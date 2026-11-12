import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Wheat, 
  MapPin, 
  Phone, 
  Calendar, 
  Receipt, 
  Clock, 
  CheckCircle, 
  Plus, 
  Printer, 
  AlertCircle,
  Truck,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cropService, GROWTH_STAGES } from '../services/cropService';
import { transactionService } from '../services/transactionService';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ReceiptModal } from '../components/ReceiptModal';

export function FarmerPortal() {
  const { user } = useAuth();
  const [myCrops, setMyCrops] = useState([]);
  const [myPayouts, setMyPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [selectedCropForPickup, setSelectedCropForPickup] = useState(null);
  const [pickupRequested, setPickupRequested] = useState(false);

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const loadFarmerData = async () => {
    setLoading(true);
    const [allCrops, allPurchases] = await Promise.all([
      cropService.getAll(),
      transactionService.getPurchases()
    ]);

    // Filter crops belonging to this farmer
    const filteredCrops = allCrops.filter(c => 
      c.farmer_id === user?.farmer_id || 
      c.farmer_name?.toLowerCase() === user?.full_name?.toLowerCase()
    );

    // Filter payouts/purchases belonging to this farmer
    const filteredPurchases = allPurchases.filter(p => 
      p.farmer_id === user?.farmer_id || 
      p.farmer_name?.toLowerCase() === user?.full_name?.toLowerCase()
    );

    setMyCrops(filteredCrops);
    setMyPayouts(filteredPurchases);
    setLoading(false);
  };

  useEffect(() => {
    loadFarmerData();
  }, [user]);

  const totalEarnings = myPayouts.reduce((acc, p) => acc + (parseFloat(p.total_amount) || 0), 0);
  const totalVolumeSold = myPayouts.reduce((acc, p) => acc + (parseFloat(p.quantity_kg) || 0), 0);
  const totalPlantedArea = myCrops.reduce((acc, c) => acc + (parseFloat(c.area_ha) || 0), 0);

  const handleOpenPickup = (crop) => {
    setSelectedCropForPickup(crop);
    setPickupRequested(false);
    setIsPickupModalOpen(true);
  };

  const handleConfirmPickup = async () => {
    if (selectedCropForPickup) {
      await cropService.updateCrop(selectedCropForPickup.id, {
        growth_stage: 'Harvest Ready',
        notes: `${selectedCropForPickup.notes ? selectedCropForPickup.notes + ' | ' : ''}Farmer requested MAO harvest pickup.`
      });
      setPickupRequested(true);
      setTimeout(() => {
        setIsPickupModalOpen(false);
        loadFarmerData();
      }, 1500);
    }
  };

  const getStagePercent = (stage) => {
    const index = GROWTH_STAGES.indexOf(stage);
    if (index === -1) return 10;
    return Math.round(((index + 1) / GROWTH_STAGES.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Farmer Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Official Beneficiary Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {user?.full_name}!
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Track your registered crop fields, growth stages, scheduled harvest dates, and municipal procurement payouts directly.
            </p>
          </div>

          <div className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-700/60 text-xs space-y-1.5 backdrop-blur-sm">
            <div className="flex justify-between gap-4">
              <span className="text-emerald-300">Farmer ID:</span>
              <span className="font-mono font-bold text-white">{user?.farmer_code || 'FMR-2026-001'}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-emerald-300">Barangay:</span>
              <span className="font-semibold text-white">Brgy. {user?.barangay || 'San Isidro'}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-emerald-300">Farm Size:</span>
              <span className="font-semibold text-white">{user?.farm_size_ha || 3.5} Hectares</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold">My Active Fields</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{myCrops.length} Crops</p>
          <span className="text-xs text-emerald-700 font-medium">{totalPlantedArea.toFixed(1)} ha total area</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold">Total Harvest Sold to MAO</span>
          <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">{totalVolumeSold.toLocaleString()} kg</p>
          <span className="text-xs text-slate-500">Delivered to municipal silos</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold">Total Payouts Received</span>
          <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">
            ₱{totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-500">Disbursed via LandBank / Cash</span>
        </div>
      </div>

      {/* MY PLANTED CROPS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              My Planted Crops & Field Monitoring
            </h2>
            <p className="text-xs text-slate-500">Live progress of your active agricultural commodities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myCrops.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
              <Wheat className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-600 text-sm font-semibold">No active crop fields currently registered.</p>
              <p className="text-xs text-slate-400 mt-1">Visit or contact the Agriculture Office staff to enroll your latest planting.</p>
            </div>
          ) : (
            myCrops.map(crop => {
              const percent = getStagePercent(crop.growth_stage);
              const isHarvestReady = crop.growth_stage === 'Harvest Ready';

              return (
                <div 
                  key={crop.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4"
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

                  {/* Growth tracker */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">Stage:</span>
                      <span className="font-bold text-emerald-950">{crop.growth_stage}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isHarvestReady ? 'bg-green-500 animate-pulse' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                      <span>Planted: {crop.planting_date}</span>
                      <span>Target: {crop.expected_harvest_date}</span>
                    </div>
                  </div>

                  {/* Action / Alert button */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      {isHarvestReady ? 'Ready for municipal purchase!' : `${percent}% through crop cycle`}
                    </span>

                    <button
                      onClick={() => handleOpenPickup(crop)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      Notify Office / Request Harvest Pickup
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MY PAYOUT HISTORY SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              My Harvest Procurement & Payout Vouchers
            </h2>
            <p className="text-xs text-slate-500">Official records of harvests purchased by the Municipal Agriculture Office</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5 text-left">Voucher No.</th>
                <th className="px-5 py-3.5 text-left">Date</th>
                <th className="px-5 py-3.5 text-left">Commodity</th>
                <th className="px-5 py-3.5 text-right">Volume</th>
                <th className="px-5 py-3.5 text-right">Buying Price</th>
                <th className="px-5 py-3.5 text-right">Total Payout</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {myPayouts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-500 text-sm">
                    No harvest sales recorded yet. Once the Agriculture Office procures your harvest, vouchers will appear here.
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
                      ₱{Number(p.price_per_kg).toFixed(2)}/kg
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
                        Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REQUEST HARVEST PICKUP MODAL */}
      <Modal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        title="Notify Agriculture Office: Crop Ready for Harvest"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          {pickupRequested ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-950 text-sm">Harvest Notification Sent!</h4>
              <p className="text-xs text-emerald-700">
                The Municipal Agriculture Extension team has been notified that your {selectedCropForPickup?.variety} is ready for inspection and procurement.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-600 leading-relaxed">
                You are about to alert the Municipal Agriculture Office that your field of{' '}
                <strong className="text-slate-900">{selectedCropForPickup?.variety}</strong> is ripe and ready for harvest collection and procurement.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Yield:</span>
                  <span className="font-mono font-bold text-slate-800">{Number(selectedCropForPickup?.estimated_yield_kg).toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
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
                  Confirm Notification
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

