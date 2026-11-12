import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Search, 
  Plus, 
  Filter, 
  Wheat, 
  Calendar, 
  Activity, 
  ShoppingBag, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowRight,
  MapPin,
  Sparkles
} from 'lucide-react';
import { cropService, CROP_CATEGORIES, GROWTH_STAGES } from '../services/cropService';
import { farmerService } from '../services/farmerService';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

export function CropMonitoring({ onNavigateToPurchase }) {
  const [crops, setCrops] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  // Add Form Data with exact typeable Barangay and Municipality
  const [formData, setFormData] = useState({
    farmer_id: '',
    category: 'Rice',
    variety: '',
    barangay: '',
    municipality: 'San Jose',
    area_ha: '2.0',
    planting_date: new Date().toISOString().split('T')[0],
    expected_harvest_date: '',
    growth_stage: 'Vegetative',
    estimated_yield_kg: '8000',
    health_status: 'Healthy',
    notes: ''
  });

  const loadData = async () => {
    setLoading(true);
    const [c, f] = await Promise.all([
      cropService.getAll(),
      farmerService.getAll()
    ]);
    setCrops(c);
    setFarmers(f);
    if (f.length > 0 && !formData.farmer_id) {
      setFormData(prev => ({ 
        ...prev, 
        farmer_id: f[0].id,
        barangay: f[0].barangay || '',
        municipality: f[0].municipality || 'San Jose'
      }));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFarmerSelect = (farmerId) => {
    const f = farmers.find(item => item.id === farmerId);
    setFormData(prev => ({
      ...prev,
      farmer_id: farmerId,
      barangay: f?.barangay || '',
      municipality: f?.municipality || 'San Jose'
    }));
  };

  const handleOpenAdd = () => {
    const today = new Date();
    const harvestDate = new Date();
    harvestDate.setDate(today.getDate() + 105);

    const firstFarmer = farmers[0];

    setFormData({
      farmer_id: firstFarmer?.id || '',
      category: 'Rice',
      variety: 'NSIC Rc222 (Tubigan 18)',
      barangay: firstFarmer?.barangay || '',
      municipality: firstFarmer?.municipality || 'San Jose',
      area_ha: '2.5',
      planting_date: today.toISOString().split('T')[0],
      expected_harvest_date: harvestDate.toISOString().split('T')[0],
      growth_stage: 'Vegetative',
      estimated_yield_kg: '10000',
      health_status: 'Healthy',
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    const farmer = farmers.find(f => f.id === formData.farmer_id);
    await cropService.addCrop({
      ...formData,
      farmer_name: farmer ? farmer.name : 'Unknown Farmer',
      barangay: formData.barangay || farmer?.barangay || 'Poblacion',
      municipality: formData.municipality || farmer?.municipality || 'San Jose'
    });
    setIsAddModalOpen(false);
    loadData();
  };

  const handleOpenUpdate = (crop) => {
    setSelectedCrop(crop);
    setIsUpdateModalOpen(true);
  };

  const handleSaveStageUpdate = async (newStage, actualYield) => {
    if (!selectedCrop) return;
    await cropService.updateCrop(selectedCrop.id, {
      growth_stage: newStage,
      actual_yield_kg: actualYield ? parseFloat(actualYield) : selectedCrop.actual_yield_kg
    });
    setIsUpdateModalOpen(false);
    loadData();
  };

  // Filter crops
  const filteredCrops = crops.filter(c => {
    const q = search.toLowerCase();
    const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchStage = selectedStage === 'All' || c.growth_stage === selectedStage;
    const matchSearch = c.variety.toLowerCase().includes(q) ||
                        c.farmer_name?.toLowerCase().includes(q) ||
                        (c.barangay && c.barangay.toLowerCase().includes(q)) ||
                        (c.municipality && c.municipality.toLowerCase().includes(q));
    return matchCat && matchStage && matchSearch;
  });

  const getStagePercent = (stage) => {
    const index = GROWTH_STAGES.indexOf(stage);
    if (index === -1) return 10;
    return Math.round(((index + 1) / GROWTH_STAGES.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Crop Monitoring System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time tracking for Rice, Corn, Vegetables, and Fruits throughout lifecycle
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm shadow-emerald-800/20"
        >
          <Plus className="w-4 h-4" />
          Enroll Crop Field
        </button>
      </div>

      {/* Commodity Navigation Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            selectedCategory === 'All'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span>All Crops</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-mono">
            {crops.length}
          </span>
        </button>

        {CROP_CATEGORIES.map(category => {
          const count = crops.filter(c => c.category === category).length;
          const icons = {
            Rice: '🌾',
            Corn: '🌽',
            Vegetables: '🥬',
            Fruits: '🥭'
          };
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <span>{icons[category]} {category}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                selectedCategory === category ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Stage Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop variety, farmer name, exact barangay, or municipality..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
          >
            <option value="All">All Growth Stages</option>
            {GROWTH_STAGES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Crops Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCrops.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
            <Sprout className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No crops match the selected category and filter.</p>
          </div>
        ) : (
          filteredCrops.map(crop => {
            const percent = getStagePercent(crop.growth_stage);
            const isHarvestReady = crop.growth_stage === 'Harvest Ready';

            return (
              <div 
                key={crop.id}
                className={`bg-white rounded-2xl border transition-all duration-200 p-5 shadow-sm hover:shadow-md flex flex-col justify-between ${
                  isHarvestReady ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-slate-200/80'
                }`}
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Badge variant={crop.category} size="sm">
                          {crop.category}
                        </Badge>
                        <Badge variant={crop.health_status} size="sm">
                          {crop.health_status}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug pt-1">
                        {crop.variety}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        Farmer: <span className="font-semibold text-emerald-950">{crop.farmer_name}</span>
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span>Brgy. {crop.barangay || 'Poblacion'}, {crop.municipality || 'San Jose'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold font-mono text-emerald-800 text-sm">
                        {crop.area_ha} ha
                      </span>
                    </div>
                  </div>

                  {/* Growth Progress Tracker */}
                  <div className="my-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">Growth Phase:</span>
                      <span className="font-bold text-emerald-900">{crop.growth_stage}</span>
                    </div>

                    {/* Progress Bar */}
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
                      <span>Target: {crop.expected_harvest_date}</span>
                    </div>
                  </div>

                  {/* Yield Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-1">
                    <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Est. Yield</span>
                      <span className="font-mono font-bold text-slate-800">
                        {Number(crop.estimated_yield_kg).toLocaleString()} kg
                      </span>
                    </div>
                    <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Actual Harvest</span>
                      <span className="font-mono font-bold text-emerald-800">
                        {crop.actual_yield_kg > 0 ? `${Number(crop.actual_yield_kg).toLocaleString()} kg` : 'In Progress'}
                      </span>
                    </div>
                  </div>

                  {crop.notes && (
                    <p className="text-xs text-slate-500 italic mt-3 bg-slate-50/50 p-2 rounded-lg border border-dashed border-slate-200">
                      "{crop.notes}"
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenUpdate(crop)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                  >
                    Update Stage
                  </button>

                  {isHarvestReady ? (
                    <button
                      onClick={() => onNavigateToPurchase(crop)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Procure Harvest
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400">
                      {percent}% complete
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ENROLL CROP FIELD MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll Crop Field for Monitoring"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Registered Farmer *
            </label>
            <select
              value={formData.farmer_id}
              onChange={(e) => handleFarmerSelect(e.target.value)}
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
                {CROP_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Crop Variety / Cultivar *
              </label>
              <input
                type="text"
                required
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                placeholder="e.g. NSIC Rc222 / Sweet Corn"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* EXACT TYPEABLE BARANGAY & MUNICIPALITY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Exact Barangay Location *
              </label>
              <input
                type="text"
                required
                value={formData.barangay}
                onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                placeholder="Type exact barangay"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Municipality *
              </label>
              <input
                type="text"
                required
                value={formData.municipality}
                onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                placeholder="Type municipality"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Area Planted (ha) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.area_ha}
                onChange={(e) => setFormData({ ...formData, area_ha: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Est. Yield (kg) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.estimated_yield_kg}
                onChange={(e) => setFormData({ ...formData, estimated_yield_kg: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Planting Date *
              </label>
              <input
                type="date"
                required
                value={formData.planting_date}
                onChange={(e) => setFormData({ ...formData, planting_date: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Expected Harvest Date *
              </label>
              <input
                type="date"
                required
                value={formData.expected_harvest_date}
                onChange={(e) => setFormData({ ...formData, expected_harvest_date: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Initial Growth Stage
              </label>
              <select
                value={formData.growth_stage}
                onChange={(e) => setFormData({ ...formData, growth_stage: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {GROWTH_STAGES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Crop Health Status
              </label>
              <select
                value={formData.health_status}
                onChange={(e) => setFormData({ ...formData, health_status: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Healthy">Healthy</option>
                <option value="Needs Water">Needs Water</option>
                <option value="Pest Warning">Pest Warning</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Field Agronomist Notes
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Recommended organic fertilizer applied on week 3"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
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

      {/* UPDATE GROWTH STAGE MODAL */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title={`Update Stage: ${selectedCrop?.variety}`}
        maxWidth="max-w-md"
      >
        {selectedCrop && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Current stage is <strong className="text-slate-900">{selectedCrop.growth_stage}</strong>. Select the next progressive stage:
            </p>

            <div className="space-y-2">
              {GROWTH_STAGES.map((stage) => {
                const isCurrent = selectedCrop.growth_stage === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => handleSaveStageUpdate(stage)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
                      isCurrent
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{stage}</span>
                    {isCurrent && <span className="text-emerald-700">Current</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
