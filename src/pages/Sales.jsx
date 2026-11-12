import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Printer, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Coins, 
  Store,
  DollarSign
} from 'lucide-react';
import { transactionService } from '../services/transactionService';
import { inventoryService } from '../services/inventoryService';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ReceiptModal } from '../components/ReceiptModal';

export function Sales({ prefilledItem, onClearPrefilledItem }) {
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Modals
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    buyer_name: '',
    buyer_type: 'Wholesaler',
    buyer_contact: '',
    inventory_id: '',
    category: 'Rice',
    variety: '',
    quantity_kg: '500',
    price_per_kg: '28.00',
    payment_status: 'Paid',
    payment_method: 'Cash',
    storage_location: 'Central Silo 1',
    sale_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const loadData = async () => {
    setLoading(true);
    const [s, inv] = await Promise.all([
      transactionService.getSales(),
      inventoryService.getAll()
    ]);
    setSales(s);
    setInventory(inv);

    if (prefilledItem) {
      setFormData({
        buyer_name: 'Metro Food Terminal Wholesalers',
        buyer_type: 'Wholesaler',
        buyer_contact: '0917-555-1122',
        inventory_id: prefilledItem.id,
        category: prefilledItem.category,
        variety: prefilledItem.variety,
        quantity_kg: String(Math.min(500, prefilledItem.current_stock_kg)),
        price_per_kg: String(prefilledItem.suggested_selling_price || 30),
        payment_status: 'Paid',
        payment_method: 'Bank Transfer',
        storage_location: prefilledItem.storage_location || 'Central Silo 1',
        sale_date: new Date().toISOString().split('T')[0],
        notes: `Direct stock sale from ${prefilledItem.storage_location}`
      });
      setIsSaleModalOpen(true);
      if (onClearPrefilledItem) onClearPrefilledItem();
    } else if (inv.length > 0 && !formData.inventory_id) {
      const firstAvailable = inv.find(i => i.current_stock_kg > 0) || inv[0];
      setFormData(prev => ({
        ...prev,
        inventory_id: firstAvailable.id,
        category: firstAvailable.category,
        variety: firstAvailable.variety,
        price_per_kg: String(firstAvailable.suggested_selling_price || 26),
        storage_location: firstAvailable.storage_location
      }));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [prefilledItem]);

  const handleOpenAdd = () => {
    setErrorMsg('');
    const firstAvailable = inventory.find(i => i.current_stock_kg > 0) || inventory[0];
    setFormData({
      buyer_name: '',
      buyer_type: 'Wholesaler',
      buyer_contact: '',
      inventory_id: firstAvailable?.id || '',
      category: firstAvailable?.category || 'Rice',
      variety: firstAvailable?.variety || '',
      quantity_kg: '500',
      price_per_kg: String(firstAvailable?.suggested_selling_price || 26),
      payment_status: 'Paid',
      payment_method: 'Bank Transfer',
      storage_location: firstAvailable?.storage_location || 'Central Silo 1',
      sale_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsSaleModalOpen(true);
  };

  const handleInventorySelect = (invId) => {
    const item = inventory.find(i => i.id === invId);
    if (!item) return;
    setFormData(prev => ({
      ...prev,
      inventory_id: invId,
      category: item.category,
      variety: item.variety,
      price_per_kg: String(item.suggested_selling_price || 25),
      storage_location: item.storage_location
    }));
  };

  const handleSubmitSale = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const selectedInv = inventory.find(i => i.id === formData.inventory_id);
      const requestedQty = parseFloat(formData.quantity_kg) || 0;

      if (!selectedInv || selectedInv.current_stock_kg < requestedQty) {
        setErrorMsg(`Insufficient stock! Available in ${selectedInv?.storage_location || 'storage'}: ${selectedInv?.current_stock_kg?.toLocaleString() || 0} kg`);
        return;
      }

      const recorded = await transactionService.recordSale(formData);
      setIsSaleModalOpen(false);
      loadData();

      // Show receipt modal
      setReceiptData(recorded);
      setIsReceiptOpen(true);
    } catch (err) {
      setErrorMsg(err.message || 'Error executing sale');
    }
  };

  const handleViewReceipt = (sale) => {
    setReceiptData(sale);
    setIsReceiptOpen(true);
  };

  const totalSalesRevenue = sales.reduce((acc, s) => acc + (parseFloat(s.total_amount) || 0), 0);
  const totalSoldVolume = sales.reduce((acc, s) => acc + (parseFloat(s.quantity_kg) || 0), 0);

  const filteredSales = sales.filter(s => {
    const match = s.reference_no.toLowerCase().includes(search.toLowerCase()) ||
                  s.buyer_name.toLowerCase().includes(search.toLowerCase()) ||
                  s.variety.toLowerCase().includes(search.toLowerCase());
    return match;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Crop Sales & Market Distribution
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Sell warehouse commodities to wholesalers, institutional buyers, and local markets
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm shadow-emerald-800/20"
        >
          <Plus className="w-4 h-4" />
          Register New Sale
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold">Total Sales Executed</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{sales.length}</p>
          <span className="text-xs text-emerald-700">Official sales vouchers</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold">Total Volume Sold</span>
          <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">{totalSoldVolume.toLocaleString()} kg</p>
          <span className="text-xs text-slate-500">Dispatched from municipal silos</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold">Total Revenue Generated</span>
          <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">
            ₱{totalSalesRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-500">Gross proceeds received</span>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference #, buyer name or crop..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5 text-left">Reference No.</th>
                <th className="px-5 py-3.5 text-left">Buyer / Outlet</th>
                <th className="px-5 py-3.5 text-left">Commodity Sold</th>
                <th className="px-5 py-3.5 text-right">Quantity</th>
                <th className="px-5 py-3.5 text-right">Price / kg</th>
                <th className="px-5 py-3.5 text-right">Total Revenue</th>
                <th className="px-5 py-3.5 text-center">Payment</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No sales vouchers found.
                  </td>
                </tr>
              ) : (
                filteredSales.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-slate-900">
                      {s.reference_no}
                      <span className="block text-[11px] text-slate-400 font-sans font-normal">{s.sale_date}</span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <p className="font-bold text-slate-900">{s.buyer_name}</p>
                      <span className="text-[11px] text-slate-500">{s.buyer_type} {s.buyer_contact ? `• ${s.buyer_contact}` : ''}</span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={s.category} size="sm">
                          {s.category}
                        </Badge>
                        <span className="font-semibold text-slate-800">{s.variety}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{s.storage_location}</span>
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-xs text-slate-700">
                      {Number(s.quantity_kg).toLocaleString()} kg
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-xs text-slate-700">
                      ₱{Number(s.price_per_kg).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-xs font-bold text-emerald-900">
                      ₱{Number(s.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Badge variant={s.payment_status} size="sm">
                        {s.payment_status} ({s.payment_method})
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleViewReceipt(s)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Voucher
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTER SALE MODAL */}
      <Modal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        title="Register Crop Sale & Dispatch"
      >
        <form onSubmit={handleSubmitSale} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Buyer Name / Business *
              </label>
              <input
                type="text"
                required
                value={formData.buyer_name}
                onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                placeholder="e.g. Metro Food Terminal Corp."
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Buyer Category
              </label>
              <select
                value={formData.buyer_type}
                onChange={(e) => setFormData({ ...formData, buyer_type: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="Wholesaler">Wholesaler</option>
                <option value="Public Market">Public Market Vendor</option>
                <option value="Retailer">Supermarket / Retailer</option>
                <option value="Cooperative">Farmers Cooperative</option>
                <option value="Government Agency">Government / DSWD Food Bank</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Buyer Contact Phone
              </label>
              <input
                type="text"
                value={formData.buyer_contact}
                onChange={(e) => setFormData({ ...formData, buyer_contact: e.target.value })}
                placeholder="0918-000-0000"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Select Available Stock *
              </label>
              <select
                value={formData.inventory_id}
                onChange={(e) => handleInventorySelect(e.target.value)}
                required
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>
                    [{item.category}] {item.variety} — Stock: {Number(item.current_stock_kg).toLocaleString()} kg ({item.storage_location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Selling Quantity (kg) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity_kg}
                onChange={(e) => setFormData({ ...formData, quantity_kg: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Selling Price per kg (₱) *
              </label>
              <input
                type="number"
                step="0.25"
                min="0.5"
                required
                value={formData.price_per_kg}
                onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Computed Amount Callout */}
          <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 flex justify-between items-center">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-800">Total Invoice Revenue</span>
              <p className="text-[11px] text-emerald-700">Calculated (Qty × Price/kg)</p>
            </div>
            <div className="text-xl font-bold font-mono text-emerald-950">
              ₱{((parseFloat(formData.quantity_kg) || 0) * (parseFloat(formData.price_per_kg) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Payment Method
              </label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="Cash">Cash on Delivery</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Post-Dated Check</option>
                <option value="Credit">Credit Terms (30-day)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Sale Date
              </label>
              <input
                type="date"
                required
                value={formData.sale_date}
                onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Dispatch Truck / Release Notes
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Dispatched via Truck #ABK-5912 to Divisoria terminal"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSaleModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Sale & Auto-Deduct Stock
            </button>
          </div>
        </form>
      </Modal>

      {/* RECEIPT MODAL */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        data={receiptData}
      />
    </div>
  );
}

