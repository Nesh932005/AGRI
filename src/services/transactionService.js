import { supabase, isSupabaseConfigured } from './supabaseClient';
import { dataStore } from './dataStorage';
import { inventoryService } from './inventoryService';

export const transactionService = {
  // Purchases
  async getPurchases() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('purchase_date', { ascending: false });
      if (!error && data) return data;
    }
    return dataStore.getPurchases();
  },

  async recordPurchase(purchaseData) {
    const qty = parseFloat(purchaseData.quantity_kg) || 0;
    const price = parseFloat(purchaseData.price_per_kg) || 0;
    const total = parseFloat((qty * price).toFixed(2));

    const newPurchase = {
      id: `pur-${Date.now()}`,
      reference_no: `PUR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      farmer_id: purchaseData.farmer_id || null,
      farmer_name: purchaseData.farmer_name || 'Registered Farmer',
      crop_id: purchaseData.crop_id || null,
      category: purchaseData.category,
      variety: purchaseData.variety,
      quantity_kg: qty,
      price_per_kg: price,
      total_amount: total,
      payment_status: purchaseData.payment_status || 'Paid',
      payment_method: purchaseData.payment_method || 'Cash',
      storage_location: purchaseData.storage_location || 'Central Warehouse Silo A',
      purchase_date: purchaseData.purchase_date || new Date().toISOString().split('T')[0],
      notes: purchaseData.notes || ''
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('purchases')
        .insert([newPurchase])
        .select()
        .single();
      if (!error && data) {
        return data;
      }
    }

    // Auto-update inventory
    inventoryService.increaseStockFromPurchase({
      category: newPurchase.category,
      variety: newPurchase.variety,
      quantity_kg: newPurchase.quantity_kg,
      price_per_kg: newPurchase.price_per_kg,
      storage_location: newPurchase.storage_location
    });

    const current = dataStore.getPurchases();
    const updated = [newPurchase, ...current];
    dataStore.savePurchases(updated);
    return newPurchase;
  },

  // Sales
  async getSales() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('sale_date', { ascending: false });
      if (!error && data) return data;
    }
    return dataStore.getSales();
  },

  async recordSale(saleData) {
    const qty = parseFloat(saleData.quantity_kg) || 0;
    const price = parseFloat(saleData.price_per_kg) || 0;
    const total = parseFloat((qty * price).toFixed(2));

    // Deduct stock first to validate available inventory
    inventoryService.decreaseStockFromSale({
      category: saleData.category,
      variety: saleData.variety,
      quantity_kg: qty
    });

    const newSale = {
      id: `sale-${Date.now()}`,
      reference_no: `SAL-2026-${Math.floor(2000 + Math.random() * 8000)}`,
      buyer_name: saleData.buyer_name,
      buyer_type: saleData.buyer_type || 'Wholesaler',
      buyer_contact: saleData.buyer_contact || '',
      category: saleData.category,
      variety: saleData.variety,
      quantity_kg: qty,
      price_per_kg: price,
      total_amount: total,
      payment_status: saleData.payment_status || 'Paid',
      payment_method: saleData.payment_method || 'Cash',
      storage_location: saleData.storage_location || 'Central Warehouse Silo A',
      sale_date: saleData.sale_date || new Date().toISOString().split('T')[0],
      notes: saleData.notes || ''
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('sales')
        .insert([newSale])
        .select()
        .single();
      if (!error && data) return data;
    }

    const current = dataStore.getSales();
    const updated = [newSale, ...current];
    dataStore.saveSales(updated);
    return newSale;
  },

  // Consolidated ledger for transactions page
  async getAllTransactions() {
    const purchases = await this.getPurchases();
    const sales = await this.getSales();

    const formattedPurchases = purchases.map(p => ({
      id: p.id,
      reference_no: p.reference_no,
      type: 'Purchase',
      entity_name: p.farmer_name,
      category: p.category,
      variety: p.variety,
      quantity_kg: p.quantity_kg,
      price_per_kg: p.price_per_kg,
      total_amount: p.total_amount,
      payment_status: p.payment_status,
      payment_method: p.payment_method,
      date: p.purchase_date,
      notes: p.notes,
      is_credit: false
    }));

    const formattedSales = sales.map(s => ({
      id: s.id,
      reference_no: s.reference_no,
      type: 'Sale',
      entity_name: s.buyer_name,
      category: s.category,
      variety: s.variety,
      quantity_kg: s.quantity_kg,
      price_per_kg: s.price_per_kg,
      total_amount: s.total_amount,
      payment_status: s.payment_status,
      payment_method: s.payment_method,
      date: s.sale_date,
      notes: s.notes,
      is_credit: true
    }));

    return [...formattedPurchases, ...formattedSales].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }
};

