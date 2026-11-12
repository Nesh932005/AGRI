import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Printer, 
  Search, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  TrendingDown,
  Warehouse,
  MapPin
} from 'lucide-react';
import { transactionService } from '../services/transactionService';
import { farmerService } from '../services/farmerService';
import { cropService, CROP_CATEGORIES } from '../services/cropService';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ReceiptModal } from '../components/ReceiptModal';

export function Purchasing({ prefilledCrop, onClearPrefilledCrop }) {
  const [purchases, setPurchases] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Form - clean clear state
  const [formData, setFormData] = useState({
    farmer_id: '',
    crop_id: '',
    category: 'Rice',
    variety: '',
    quantity_kg: '',
    price_per_kg: '',
    payment_status: 'Paid',
    payment_method: 'Cash',
    storage_location: 'Central Silo 1',
    purchase_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const loadData = async () => {
    setLoading(true);
    const [p, f, c] = await Promise.all([
      transactionService.getPurchases(),
      farmerService.getAll(),
      cropService.getAll()
    ]);
    setPurchases(p);
    setFarmers(f);
    setCrops(c);

    if (prefilledCrop) {
      setFormData({
        farmer_id: prefilledCrop.farmer_id || '',
        crop_id: prefilledCrop.id || '',
        category: prefilledCrop.category || 'Rice',
        variety: prefilledCrop.variety || '',
        quantity_kg: String(prefilledCrop.actual_yield_kg || prefilledCrop.estimated_yield_kg || ''),
        price_per_kg: '',
        payment_status: 'Paid',
        payment_method: 'LandBank',
        storage_location: 'Central Silo 1',
        purchase_date: new Date().toISOString().split('T')[0],
        notes: `Harvest procurement from field ${prefilledCrop.variety}`
      });
      setIsPurchaseModalOpen(true);
      if (onClearPrefilledCrop) onClearPrefilledCrop();
    } else if (f.length > 0 && !formData.farmer_id) {
      setFormData(prev => ({ ...prev, farmer_id: f[0].id }));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [prefilledCrop]);

  const handleOpenAdd = () => {
    setFormData({
      farmer_id: farmers[0]?.id || '',
      crop_id: '',
      category: 'Rice',
      variety: '',
      quantity_kg: '',
      price_per_kg: '',
      payment_status: 'Paid',
      payment_method: 'Cash',
      storage_location: 'Central Silo 1',
      purchase_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsPurchaseModalOpen(true);
  };

  const handleFarmerChange = (farmerId) => {
    const farmer = farmers.find(f => f.id === farmerId);
    setFormData(prev => ({
      ...prev,
      farmer_id: farmerId,
      category: farmer?.primary_crops?.[0] || 'Rice'
    }));
  };

  const handleSubmitPurchase = async (e) => {
    e.preventDefault();
    const farmer = farmers.find(f => f.id === formData.farmer_id);
    const recorded = await transactionService.recordPurchase({
      ...formData,
      farmer_name: farmer ? farmer.name : 'Registered Farmer',
      barangay: farmer?.barangay || 'Poblacion',
      municipality: farmer?.municipality || 'San Jose'
    });

    setIsPurchaseModalOpen(false);
    loadData();

    // Show instant official receipt voucher
    setReceiptData(recorded);
    setIsReceiptOpen(true);
  };

  const handleViewReceipt = (purchase) => {
    setReceiptData(purchase);
    setIsReceiptOpen(true);
  };

  const totalProcuredAmount = purchases.reduce((acc, p) => acc + (parseFloat(p.total_amount) || 0), 0);
  const totalProcuredVolume = purchases.reduce((acc, p) => acc + (parseFloat(p.quantity_kg) || 0), 0);

  const filteredPurchases = purchases.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.reference_no.toLowerCase().includes(q) ||
                        p.farmer_name?.toLowerCase().includes(q) ||
                        p.variety.toLowerCase().includes(q) ||
                        (p.barangay && p.barangay.toLowerCase().includes(q)) ||
                        (p.municipality && p.municipality.toLowerCase().includes(q));
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Crop Purchasing & Procurement
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Procure harvested yields directly from farmers with automatic inventory crediting
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm shadow-emerald-800/20"
        >
          <Plus className="w-4 h-4" />
          Record Harvest Purchase
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold">Total Purchases Recorded</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{purchases.length}</p>
          <span className="text-xs text-emerald-700">All authenticated vouchers</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold">Total Volume Procured</span>
          <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">{totalProcuredVolume.toLocaleString()} kg</p>
          <span className="text-xs text-slate-500">Credited to storage silos</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold">Total Disbursed to Farmers</span>
          <p className="text-2xl font-bold font-mono text-rose-700 mt-1">
            ₱{totalProcuredAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-500">Agricultural support funding</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference #, farmer, barangay, or municipality..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5 text-left">Reference No.</th>
                <th className="px-5 py-3.5 text-left">Farmer & Location</th>
                <th className="px-5 py-3.5 text-left">Crop Commodity</th>
                <th className="px-5 py-3.5 text-right">Quantity</th>
                <th className="px-5 py-3.5 text-right">Price / kg</th>
                <th className="px-5 py-3.5 text-right">Total Amount</th>
                <th className="px-5 py-3.5 text-center">Payment</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No purchase vouchers found.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-slate-900">
                      {p.reference_no}
                      <span className="block text-[11px] text-slate-400 font-sans font-normal">{p.purchase_date}</span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <p className="font-bold text-slate-900">{p.farmer_name}</p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span>Brgy. {p.barangay || 'San Isidro'}, {p.municipality || 'San Jose'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={p.category} size="sm">
                          {p.category}
                        </Badge>
                        <span className="font-semibold text-slate-800">{p.variety}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{p.storage_location}</span>
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-xs text-slate-700">
                      {Number(p.quantity_kg).toLocaleString()} kg
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-xs text-slate-700">
                      ₱{Number(p.price_per_kg).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-xs font-bold text-emerald-900">
                      ₱{Number(p.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Badge variant={p.payment_status} size="sm">
                        {p.payment_status} ({p.payment_method})
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleViewReceipt(p)}
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

      {/* RECORD HARVEST PURCHASE MODAL */}
      <Modal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        title="Record Harvest Purchase Voucher"
      >
        <form onSubmit={handleSubmitPurchase} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Farmer (Seller) *
            </label>
            <select
              value={formData.farmer_id}
              onChange={(e) => handleFarmerChange(e.target.value)}
              required
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              {farmers.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} — Brgy. {f.barangay || 'Poblacion'}, {f.municipality || 'San Jose'} ({f.farmer_code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Commodity Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {CROP_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Crop Variety *
              </label>
              <input
                type="text"
                required
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Quantity in Kilograms (kg) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity_kg}
                onChange={(e) => setFormData({ ...formData, quantity_kg: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Buying Price per kg (₱) *
              </label>
              <input
                type="number"
                step="0.25"
                min="0.5"
                required
                value={formData.price_per_kg}
                onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Computed Amount Callout */}
          <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 flex justify-between items-center">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-800">Total Purchase Amount</span>
              <p className="text-[11px] text-emerald-700">Calculated automatically (Qty × Price/kg)</p>
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
                <option value="Cash">Cash</option>
                <option value="LandBank">LandBank Deposit</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Check</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Destination Storage Silo / Room *
              </label>
              <select
                value={formData.storage_location}
                onChange={(e) => setFormData({ ...formData, storage_location: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="Central Silo 1">Central Silo 1 (Grains)</option>
                <option value="Central Silo 2">Central Silo 2 (Specialty)</option>
                <option value="Grain Warehouse B">Grain Warehouse B</option>
                <option value="Cold Storage Room 1">Cold Storage Room 1 (Vegetables)</option>
                <option value="Cold Storage Room 2">Cold Storage Room 2 (Fruits)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Quality Assessment & Voucher Notes
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Clean and dry palay at 14% moisture content"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPurchaseModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm & Auto-Credit Inventory
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
