import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Search, 
  Plus, 
  AlertTriangle, 
  TrendingUp, 
  Warehouse, 
  Edit3, 
  ArrowRight,
  ShieldAlert,
  Coins
} from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { CROP_CATEGORIES } from '../services/cropService';

export function Inventory({ onNavigateToSell }) {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    current_stock_kg: '',
    min_stock_alert_kg: '',
    suggested_selling_price: '',
    storage_location: ''
  });

  const loadInventory = async () => {
    setLoading(true);
    const data = await inventoryService.getAll();
    setInventory(data);
    setLoading(false);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setEditFormData({
      current_stock_kg: String(item.current_stock_kg),
      min_stock_alert_kg: String(item.min_stock_alert_kg || 500),
      suggested_selling_price: String(item.suggested_selling_price || 25),
      storage_location: item.storage_location || 'Central Silo 1'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    await inventoryService.addOrUpdateItem({
      ...selectedItem,
      current_stock_kg: parseFloat(editFormData.current_stock_kg) || 0,
      min_stock_alert_kg: parseFloat(editFormData.min_stock_alert_kg) || 500,
      suggested_selling_price: parseFloat(editFormData.suggested_selling_price) || 25,
      storage_location: editFormData.storage_location
    });
    setIsEditModalOpen(false);
    loadInventory();
  };

  // Metrics
  const totalStockKg = inventory.reduce((acc, i) => acc + (parseFloat(i.current_stock_kg) || 0), 0);
  const totalValuation = inventory.reduce(
    (acc, i) => acc + ((parseFloat(i.current_stock_kg) || 0) * (parseFloat(i.avg_unit_cost) || 0)), 
    0
  );
  const lowStockItems = inventory.filter(i => (parseFloat(i.current_stock_kg) || 0) <= (parseFloat(i.min_stock_alert_kg) || 500));

  const filteredInventory = inventory.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.variety.toLowerCase().includes(search.toLowerCase()) ||
                        item.storage_location?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Automated Crop Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time stock balance updated automatically upon purchases and sales
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase font-semibold">Total Stock in Storage</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {totalStockKg.toLocaleString()} kg
          </p>
          <span className="text-xs text-slate-500 font-medium">
            ({(totalStockKg / 1000).toFixed(1)} metric tons)
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase font-semibold">Total Inventory Valuation</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-800 mt-2">
            ₱{totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-500">At weighted average cost</span>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xs ${
          lowStockItems.length > 0 ? 'bg-amber-50/60 border-amber-200' : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-slate-700">Low Stock Alert</span>
            <div className={`p-2 rounded-xl ${lowStockItems.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-bold font-mono mt-2 ${lowStockItems.length > 0 ? 'text-amber-900' : 'text-slate-900'}`}>
            {lowStockItems.length} Commodities
          </p>
          <span className="text-xs text-slate-500">Below threshold trigger</span>
        </div>
      </div>

      {/* Category Tabs & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commodity variety or storage silo..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                selectedCategory === 'All'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            {CROP_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5 text-left">Crop Commodity</th>
                <th className="px-5 py-3.5 text-left">Storage Silo / Facility</th>
                <th className="px-5 py-3.5 text-right">Current Stock</th>
                <th className="px-5 py-3.5 text-right">Avg Unit Cost</th>
                <th className="px-5 py-3.5 text-right">Selling Price</th>
                <th className="px-5 py-3.5 text-right">Total Valuation</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No inventory records found.
                  </td>
                </tr>
              ) : (
                filteredInventory.map(item => {
                  const isLow = (parseFloat(item.current_stock_kg) || 0) <= (parseFloat(item.min_stock_alert_kg) || 500);
                  const valuation = (parseFloat(item.current_stock_kg) || 0) * (parseFloat(item.avg_unit_cost) || 0);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={item.category} size="sm">
                            {item.category}
                          </Badge>
                          <div>
                            <p className="font-bold text-slate-900 text-xs sm:text-sm">{item.variety}</p>
                            <span className="text-[11px] text-slate-400">Updated: {item.last_updated || 'Today'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs font-medium text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Warehouse className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item.storage_location}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className={`font-mono text-xs sm:text-sm font-bold ${
                          isLow ? 'text-rose-600 font-extrabold' : 'text-slate-900'
                        }`}>
                          {Number(item.current_stock_kg).toLocaleString()} kg
                        </span>
                        {isLow && (
                          <span className="block text-[10px] text-rose-500 font-semibold uppercase">Low Stock!</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-mono text-xs text-slate-700">
                        ₱{Number(item.avg_unit_cost).toFixed(2)}/kg
                      </td>

                      <td className="px-5 py-4 text-right font-mono text-xs font-semibold text-emerald-800">
                        ₱{Number(item.suggested_selling_price).toFixed(2)}/kg
                      </td>

                      <td className="px-5 py-4 text-right font-mono text-xs font-bold text-slate-900">
                        ₱{Number(valuation).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            title="Adjust Stock or Pricing"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onNavigateToSell(item)}
                            title="Sell Stock Directly"
                            className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition inline-flex items-center gap-1 shadow-xs"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                            Sell
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUST INVENTORY MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Adjust Stock: ${selectedItem?.variety}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Current Stock (kg) *
            </label>
            <input
              type="number"
              min="0"
              required
              value={editFormData.current_stock_kg}
              onChange={(e) => setEditFormData({ ...editFormData, current_stock_kg: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Low Stock Alert Threshold (kg) *
            </label>
            <input
              type="number"
              min="10"
              required
              value={editFormData.min_stock_alert_kg}
              onChange={(e) => setEditFormData({ ...editFormData, min_stock_alert_kg: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Suggested Selling Price per kg (₱) *
            </label>
            <input
              type="number"
              step="0.25"
              min="0.5"
              required
              value={editFormData.suggested_selling_price}
              onChange={(e) => setEditFormData({ ...editFormData, suggested_selling_price: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Storage Silo / Room Location
            </label>
            <input
              type="text"
              required
              value={editFormData.storage_location}
              onChange={(e) => setEditFormData({ ...editFormData, storage_location: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              Save Adjustment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

