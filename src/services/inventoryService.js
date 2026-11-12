import { supabase, isSupabaseConfigured } from './supabaseClient';
import { dataStore } from './dataStorage';

export const inventoryService = {
  async getAll() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('category', { ascending: true });
      if (!error && data) return data;
    }
    return dataStore.getInventory();
  },

  async addOrUpdateItem(item) {
    const current = dataStore.getInventory();
    const existingIndex = current.findIndex(
      i => i.category.toLowerCase() === item.category.toLowerCase() &&
           i.variety.toLowerCase() === item.variety.toLowerCase()
    );

    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...item,
        last_updated: new Date().toISOString().split('T')[0]
      };
    } else {
      const newItem = {
        id: `inv-${Date.now()}`,
        category: item.category,
        variety: item.variety,
        current_stock_kg: parseFloat(item.current_stock_kg) || 0,
        min_stock_alert_kg: parseFloat(item.min_stock_alert_kg) || 500,
        avg_unit_cost: parseFloat(item.avg_unit_cost) || 20,
        suggested_selling_price: parseFloat(item.suggested_selling_price) || 25,
        storage_location: item.storage_location || 'Central Warehouse',
        last_updated: new Date().toISOString().split('T')[0]
      };
      updated = [newItem, ...current];
    }

    dataStore.saveInventory(updated);
    return updated;
  },

  // Called automatically when a purchase is recorded
  increaseStockFromPurchase({ category, variety, quantity_kg, price_per_kg, storage_location }) {
    const current = dataStore.getInventory();
    const existingIndex = current.findIndex(
      i => i.category.toLowerCase() === category.toLowerCase() &&
           i.variety.toLowerCase() === variety.toLowerCase()
    );

    const qty = parseFloat(quantity_kg) || 0;
    const price = parseFloat(price_per_kg) || 0;

    if (existingIndex >= 0) {
      const existing = current[existingIndex];
      const newStock = (parseFloat(existing.current_stock_kg) || 0) + qty;
      const totalCostOld = (parseFloat(existing.current_stock_kg) || 0) * (parseFloat(existing.avg_unit_cost) || 0);
      const totalCostNew = qty * price;
      const newAvgCost = newStock > 0 ? (totalCostOld + totalCostNew) / newStock : price;

      current[existingIndex] = {
        ...existing,
        current_stock_kg: newStock,
        avg_unit_cost: parseFloat(newAvgCost.toFixed(2)),
        suggested_selling_price: parseFloat((newAvgCost * 1.25).toFixed(2)),
        last_updated: new Date().toISOString().split('T')[0]
      };
    } else {
      current.push({
        id: `inv-${Date.now()}`,
        category,
        variety,
        current_stock_kg: qty,
        min_stock_alert_kg: 500,
        avg_unit_cost: price,
        suggested_selling_price: parseFloat((price * 1.25).toFixed(2)),
        storage_location: storage_location || 'Central Warehouse Silo A',
        last_updated: new Date().toISOString().split('T')[0]
      });
    }

    dataStore.saveInventory(current);
    return current;
  },

  // Called automatically when a sale is confirmed
  decreaseStockFromSale({ category, variety, quantity_kg }) {
    const current = dataStore.getInventory();
    const existingIndex = current.findIndex(
      i => i.category.toLowerCase() === category.toLowerCase() &&
           i.variety.toLowerCase() === variety.toLowerCase()
    );

    const qty = parseFloat(quantity_kg) || 0;

    if (existingIndex >= 0) {
      const existing = current[existingIndex];
      const currentStock = parseFloat(existing.current_stock_kg) || 0;
      
      if (currentStock < qty) {
        throw new Error(`Insufficient inventory! Available: ${currentStock.toLocaleString()} kg, Requested: ${qty.toLocaleString()} kg`);
      }

      current[existingIndex] = {
        ...existing,
        current_stock_kg: Math.max(0, currentStock - qty),
        last_updated: new Date().toISOString().split('T')[0]
      };

      dataStore.saveInventory(current);
      return current[existingIndex];
    } else {
      throw new Error(`Item ${category} - ${variety} does not exist in inventory.`);
    }
  }
};

