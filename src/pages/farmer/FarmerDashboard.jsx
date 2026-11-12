import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cropService, GROWTH_STAGES, CROP_CATEGORIES } from '../../services/cropService';
import { transactionService } from '../../services/transactionService';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { ReceiptModal } from '../../components/ReceiptModal';
import { 
  Wheat, 
  Sprout, 
  Calendar, 
  MapPin, 
  Phone, 
  Plus, 
  Truck, 
  Printer, 
  LogOut, 
  Building2, 
  Coins, 
  CheckCircle,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function FarmerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [myCrops, setMyCrops] = useState([]);
  const [myPayouts, setMyPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [selectedCropForPickup, setSelectedCropForPickup] = useState(null);
  const [pickupRequested, setPickupRequested] = useState(false);

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Enroll crop form
  const [enrollForm, setEnrollForm] = useState({
    category: 'Rice',
    variety: 'NSIC Rc222 (Tubigan 18)',
    area_ha: '2.0',
    planting_date: new Date().toISOString().split('T')[0],
    expected_harvest_date: '',
    estimated_yield_kg: '8000',
    health_status: 'Healthy',
    notes: ''
  });

  const loadData = async () => {
    setLoading(true);
    const [allCrops, allPurchases] = await Promise.all([
      cropService.getAll(),
      transactionService.getPurchases()
    ]);

    const userFarmerId = user?.farmer_id || user?.id;
    const userFarmerName = user?.full_name?.toLowerCase();

    const filteredCrops = allCrops.filter(c => 
      c.farmer_id === userFarmerId || 
      c.farmer_name?.toLowerCase() === userFarmerName
    );

    const filteredPurchases = allPurchases.filter(p => 
      p.farmer_id === userFarmerId || 
      p.farmer_name?.toLowerCase() === userFarmerName
    );

    setMyCrops(filteredCrops);
    setMyPayouts(filteredPurchases);
    setLoading(false);
  };

  useEffect(() => {
    if (!user || user.role !== 'farmer') {
      navigate('/farmer/login');
      return;
    }
    loadData();
  }, [user]);

  const handleOpenEnroll = () => {
    const today = new Date();
    const harvest = new Date();
    harvest.setDate(today.getDate() + 105);

    setEnrollForm({
      category: 'Rice',
      variety: 'NSIC Rc222 (Tubigan 18)',
      area_ha: '2.0',
      planting_date: today.toISOString().split('T')[0],
      expected_harvest_date: harvest.toISOString().split('T')[0],
      estimated_yield_kg: '8500',
      health_status: 'Healthy',
      notes: ''
    });
    setIsEnrollModalOpen(true);
  };

  const handleSaveEnroll = async (e) => {
    e.preventDefault();
    await cropService.addCrop({
      ...enrollForm,
      farmer_id: user?.farmer_id || user?.id,
      farmer_name: user?.full_name,
      barangay: user?.barangay || 'San Isidro',
      growth_stage: 'Vegetative'
    });
    setIsEnrollModalOpen(false);
    loadData();
  };

  const handleOpenPickup = (crop) => {
    setSelectedCropForPickup(crop);
    setPickupRequested(false);
    setIsPickupModalOpen(true);
  };

  const handleConfirmPickup = async () => {
    if (selectedCropForPickup) {
      await cropService.updateCrop(selectedCropForPickup.id, {
        growth_stage: 'Harvest Ready',
        notes: `${selectedCropForPickup.notes ? selectedCropForPickup.notes + ' | ' : ''}Farmer requested MAO harvest procurement.`
      });
      setPickupRequested(true);
      setTimeout(() => {
        setIsPickupModalOpen(false);
        loadData();
      }, 1500);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/farmer/login');
  };

  const totalEarnings = myPayouts.reduce((acc, p) => acc + (parseFloat(p.total_amount) || 0), 0);
  const totalVolumeSold = myPayouts.reduce((acc, p) => acc + (parseFloat(p.quantity_kg) || 0), 0);
  const totalPlantedArea = myCrops.reduce((acc, c) => acc + (parseFloat(c.area_ha) || 0), 0);

  const getStagePercent = (stage) => {
    const index = GROWTH_STAGES.indexOf(stage);
    if (index === -1) return 10;
    return Math.round(((index + 1) / GROWTH_STAGES.length) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
      {/* Farmer Website Header */}
      <header className="bg-emerald-950 text-white sticky top-0 z-30 shadow-md border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-green-300 flex items-center justify-center text-emerald-950 shadow-md">
              <Wheat className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-white block leading-none">
                AGRI Farmer Connect
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-300">
                Beneficiary Portal • Brgy. {user?.barangay || 'San Isidro'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/office/login"
              title="Switch to Office Staff Portal"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700/60 transition"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Office Portal</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-rose-900/70 text-emerald-100 hover:text-white text-xs font-semibold border border-emerald-800 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Farmer Welcome Profile Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Connected Beneficiary ID: {user?.farmer_code || 'FMR-2026-001'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Mabuhay, {user?.full_name}!
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
                Here are your active fields, growth progression, and payment vouchers issued by the Municipal Agriculture Office.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleOpenEnroll}
                className="px-4 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-emerald-700" />
                Enroll New Field
              </button>
            </div>
          </div>
        </div>

        {/* Farmer KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-500 uppercase font-semibold">My Planted Fields</span>
            <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{myCrops.length} Active Crops</p>
            <span className="text-xs text-emerald-700 font-medium">{totalPlantedArea.toFixed(1)} hectares cultivated</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-500 uppercase font-semibold">Harvest Delivered to MAO</span>
            <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">{totalVolumeSold.toLocaleString()} kg</p>
            <span className="text-xs text-slate-500">Credited into municipal silos</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-500 uppercase font-semibold">Total Payouts Received</span>
            <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">
              ₱{totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="text-xs text-slate-500">Disbursed via LandBank / Cash</span>
          </div>
        </div>

        {/* Section 1: My Planted Crops */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>My Planted Crops & Field Monitoring</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                  {myCrops.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500">Live lifecycle tracking synchronized with Municipal agronomists</p>
            </div>

            <button
              onClick={handleOpenEnroll}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              + Add Field
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCrops.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
                <Wheat className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-600 text-sm font-semibold">No crop fields registered under your account yet.</p>
                <button
                  onClick={handleOpenEnroll}
                  className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition"
                >
                  Enroll Your First Crop
                </button>
              </div>
            ) : (
              myCrops.map(crop => {
                const percent = getStagePercent(crop.growth_stage);
                const isHarvestReady = crop.growth_stage === 'Harvest Ready';

                return (
                  <div 
                    key={crop.id}
                    className={`bg-white rounded-2xl border transition p-5 shadow-sm space-y-4 ${
                      isHarvestReady ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Badge variant={crop.category} size="sm">
                            {crop.category}
                          </Badge>
                          <Badge variant={crop.health_status} size="sm">
                            {crop.health_status}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">{crop.variety}</h3>
                        <p className="text-xs text-slate-500 font-mono">Area: {crop.area_ha} hectares</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Est. Yield</span>
                        <span className="font-mono font-bold text-emerald-800 text-sm">
                          {Number(crop.estimated_yield_kg).toLocaleString()} kg
                        </span>
                      </div>
                    </div>

                    {/* Growth progress bar */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-500 font-medium">Growth Phase:</span>
                        <span className="font-bold text-emerald-950">{crop.growth_stage}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isHarvestReady ? 'bg-green-500 animate-pulse' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                        <span>Planted: {crop.planting_date}</span>
                        <span>Harvest Target: {crop.expected_harvest_date}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        {isHarvestReady ? '🌾 Harvest Ready!' : `${percent}% complete`}
                      </span>

                      <button
                        onClick={() => handleOpenPickup(crop)}
                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Notify MAO / Request Pickup
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Section 2: Payout & Harvest Vouchers */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                My Payout & Harvest Procurement Vouchers
              </h2>
              <p className="text-xs text-slate-500">Official digital vouchers for crops bought by the Agriculture Office</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5 text-left">Voucher No.</th>
                  <th className="px-5 py-3.5 text-left">Date</th>
                  <th className="px-5 py-3.5 text-left">Commodity</th>
                  <th className="px-5 py-3.5 text-right">Delivered (kg)</th>
                  <th className="px-5 py-3.5 text-right">Price / kg</th>
                  <th className="px-5 py-3.5 text-right">Total Payout</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {myPayouts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-slate-500 text-sm">
                      No purchase vouchers issued yet. Once the Agriculture Office buys your harvested crop, official payment vouchers appear here.
                    </td>
                  </tr>
                ) : (
                  myPayouts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-slate-900">
                        {p.reference_no}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600">
                        {p.purchase_date}
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-slate-900">
                        <span className="font-semibold text-emerald-800">[{p.category}]</span> {p.variety}
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
                          onClick={() => { setSelectedReceipt(p); setIsReceiptOpen(true); }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
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
      </main>

      {/* ENROLL FIELD MODAL */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title="Enroll New Crop Field"
      >
        <form onSubmit={handleSaveEnroll} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Commodity Category *
              </label>
              <select
                value={enrollForm.category}
                onChange={(e) => setEnrollForm({ ...enrollForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium"
              >
                {CROP_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Variety / Cultivar *
              </label>
              <input
                type="text"
                required
                value={enrollForm.variety}
                onChange={(e) => setEnrollForm({ ...enrollForm, variety: e.target.value })}
                placeholder="e.g. NSIC Rc222 / Sweet Corn"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Area Planted (ha) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={enrollForm.area_ha}
                onChange={(e) => setEnrollForm({ ...enrollForm, area_ha: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Estimated Yield (kg) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={enrollForm.estimated_yield_kg}
                onChange={(e) => setEnrollForm({ ...enrollForm, estimated_yield_kg: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Planting Date *
              </label>
              <input
                type="date"
                required
                value={enrollForm.planting_date}
                onChange={(e) => setEnrollForm({ ...enrollForm, planting_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Harvest Date *
              </label>
              <input
                type="date"
                required
                value={enrollForm.expected_harvest_date}
                onChange={(e) => setEnrollForm({ ...enrollForm, expected_harvest_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEnrollModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              Enroll Field
            </button>
          </div>
        </form>
      </Modal>

      {/* REQUEST HARVEST PICKUP MODAL */}
      <Modal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        title="Notify Agriculture Office: Harvest Ready"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          {pickupRequested ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-950 text-sm">Notification Sent to Office!</h4>
              <p className="text-xs text-emerald-700">
                The Municipal Agriculture Extension staff has received your alert. The crop status is now flagged as Harvest Ready in the municipal inventory schedule.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-600 leading-relaxed">
                Alert the Municipal Agriculture Office that your field of{' '}
                <strong className="text-slate-900">{selectedCropForPickup?.variety}</strong> is ripe and ready for harvest procurement.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Yield:</span>
                  <span className="font-mono font-bold text-slate-800">{Number(selectedCropForPickup?.estimated_yield_kg).toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Barangay:</span>
                  <span className="font-semibold text-slate-800">Brgy. {user?.barangay || 'San Isidro'}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPickupModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPickup}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Truck className="w-4 h-4" />
                  Send Harvest Notification
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* RECEIPT MODAL */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        data={selectedReceipt}
      />
    </div>
  );
}
