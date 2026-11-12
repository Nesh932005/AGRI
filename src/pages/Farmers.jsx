import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Edit2, 
  Trash2, 
  Phone, 
  MapPin, 
  Wheat, 
  CheckCircle, 
  Eye, 
  Building2, 
  AlertCircle,
  Eraser
} from 'lucide-react';
import { farmerService } from '../services/farmerService';
import { dataStore } from '../services/dataStorage';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { useAuth } from '../hooks/useAuth';

export function Farmers() {
  const { isAdmin } = useAuth();
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [municipalityFilter, setMunicipalityFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  // Completely CLEAR form state - no prefilled values
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    barangay: '',
    municipality: '',
    farm_size_ha: '',
    primary_crops: [],
    status: 'active'
  });

  const availableCrops = ['Rice', 'Corn', 'Vegetables', 'Fruits'];

  const loadFarmers = async () => {
    setLoading(true);
    const data = await farmerService.getAll();
    setFarmers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  // Opens completely BLANK form
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      contact: '',
      barangay: '',
      municipality: '',
      farm_size_ha: '',
      primary_crops: [],
      status: 'active'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (farmer) => {
    setSelectedFarmer(farmer);
    setFormData({
      name: farmer.name || '',
      contact: farmer.contact || '',
      barangay: farmer.barangay || '',
      municipality: farmer.municipality || '',
      farm_size_ha: farmer.farm_size_ha ? String(farmer.farm_size_ha) : '',
      primary_crops: farmer.primary_crops || [],
      status: farmer.status || 'active'
    });
    setIsEditModalOpen(true);
  };

  const handleOpenView = (farmer) => {
    setSelectedFarmer(farmer);
    setIsViewModalOpen(true);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    await farmerService.addFarmer(formData);
    setIsAddModalOpen(false);
    loadFarmers();
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedFarmer) return;
    await farmerService.updateFarmer(selectedFarmer.id, formData);
    setIsEditModalOpen(false);
    loadFarmers();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from farmer registry?`)) {
      await farmerService.deleteFarmer(id);
      loadFarmers();
    }
  };

  const handleClearAllFarmers = () => {
    if (window.confirm('Remove all registered farmers and start with a completely empty directory?')) {
      dataStore.clearAllFarmers();
      loadFarmers();
    }
  };

  const handleCropToggle = (crop) => {
    const exists = formData.primary_crops.includes(crop);
    if (exists) {
      setFormData({
        ...formData,
        primary_crops: formData.primary_crops.filter(c => c !== crop)
      });
    } else {
      setFormData({
        ...formData,
        primary_crops: [...formData.primary_crops, crop]
      });
    }
  };

  // Filtered farmers
  const filteredFarmers = farmers.filter(f => {
    const q = search.toLowerCase();
    const matchSearch = (f.name && f.name.toLowerCase().includes(q)) ||
                        (f.farmer_code && f.farmer_code.toLowerCase().includes(q)) ||
                        (f.barangay && f.barangay.toLowerCase().includes(q)) ||
                        (f.municipality && f.municipality.toLowerCase().includes(q));
    const matchCrop = selectedCropFilter === 'All' || f.primary_crops?.includes(selectedCropFilter);
    const matchMuni = !municipalityFilter || 
                      (f.municipality && f.municipality.toLowerCase().includes(municipalityFilter.toLowerCase())) ||
                      (f.barangay && f.barangay.toLowerCase().includes(municipalityFilter.toLowerCase()));
    return matchSearch && matchCrop && matchMuni;
  });

  const exportCSV = () => {
    const headers = ['Farmer Code', 'Name', 'Contact', 'Barangay', 'Municipality', 'Farm Size (ha)', 'Primary Crops', 'Status', 'Registered Date'];
    const rows = filteredFarmers.map(f => [
      f.farmer_code,
      `"${f.name}"`,
      f.contact,
      `"${f.barangay || ''}"`,
      `"${f.municipality || ''}"`,
      f.farm_size_ha,
      `"${f.primary_crops?.join(', ')}"`,
      f.status,
      f.registered_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AGRI_Farmers_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Farmer Registration & Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Official municipal registry of agricultural landholders and producers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {farmers.length > 0 && (
            <button
              onClick={handleClearAllFarmers}
              title="Remove all test farmers to have a completely clean directory"
              className="px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Clear All Farmers</span>
            </button>
          )}

          <button
            onClick={exportCSV}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm shadow-emerald-800/20"
          >
            <Plus className="w-4 h-4" />
            Register Farmer
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search farmer name, code, exact barangay, or municipality..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Commodity Crop Filter */}
          <div>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
            >
              <option value="All">All Commodities</option>
              <option value="Rice">🌾 Rice Only</option>
              <option value="Corn">🌽 Corn Only</option>
              <option value="Vegetables">🥬 Vegetables Only</option>
              <option value="Fruits">🥭 Fruits Only</option>
            </select>
          </div>

          {/* Location / Municipality Filter */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={municipalityFilter}
              onChange={(e) => setMunicipalityFilter(e.target.value)}
              placeholder="Filter by Municipality / Brgy..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
            />
          </div>
        </div>

        {/* Quick Tag Counts */}
        <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="font-semibold text-slate-700">{filteredFarmers.length}</span> farmers registered
        </div>
      </div>

      {/* Farmers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50/70 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5 text-left">Farmer</th>
                <th className="px-5 py-3.5 text-left">Exact Location (Barangay & Municipality)</th>
                <th className="px-5 py-3.5 text-left">Contact</th>
                <th className="px-5 py-3.5 text-left">Farm Size</th>
                <th className="px-5 py-3.5 text-left">Primary Crops</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredFarmers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-500 text-sm">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No farmers registered yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Register Farmer" above to add your first farmer with a clean form.</p>
                  </td>
                </tr>
              ) : (
                filteredFarmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                          {farmer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{farmer.name}</p>
                          <span className="font-mono text-xs text-slate-500">{farmer.farmer_code}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>Brgy. {farmer.barangay || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 pl-5">
                          <span>{farmer.municipality || 'N/A'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium text-xs">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{farmer.contact || 'N/A'}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-800 text-sm">{farmer.farm_size_ha || 0}</span>
                      <span className="text-xs text-slate-500 ml-1">hectares</span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {farmer.primary_crops && farmer.primary_crops.length > 0 ? (
                          farmer.primary_crops.map((crop) => (
                            <Badge key={crop} variant={crop} size="sm">
                              {crop}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">None specified</span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <Badge variant={farmer.status} size="sm">
                        {farmer.status}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenView(farmer)}
                          title="View Farmer Card"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(farmer)}
                          title="Edit Farmer"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(farmer.id, farmer.name)}
                            title="Delete Farmer"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD FARMER MODAL - 100% CLEAR FORM */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Farmer"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Farmer Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter farmer full name"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="Enter mobile number"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Farm Area (Hectares) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.farm_size_ha}
                onChange={(e) => setFormData({ ...formData, farm_size_ha: e.target.value })}
                placeholder="e.g. 2.5"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* EXACT BARANGAY & MUNICIPALITY TEXT INPUTS - CLEAR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Exact Barangay *
              </label>
              <input
                type="text"
                required
                value={formData.barangay}
                onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                placeholder="Enter exact barangay"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Municipality / City *
              </label>
              <input
                type="text"
                required
                value={formData.municipality}
                onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                placeholder="Enter municipality / city"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Primary Cultivated Crops (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCrops.map(crop => {
                const isSelected = formData.primary_crops.includes(crop);
                return (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => handleCropToggle(crop)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {crop} {isSelected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
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
              Save Farmer
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT FARMER MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Farmer - ${selectedFarmer?.farmer_code}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Farmer Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Farm Area (Hectares)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.farm_size_ha}
                onChange={(e) => setFormData({ ...formData, farm_size_ha: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* EDIT EXACT BARANGAY & MUNICIPALITY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Exact Barangay *
              </label>
              <input
                type="text"
                required
                value={formData.barangay}
                onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Municipality / City *
              </label>
              <input
                type="text"
                required
                value={formData.municipality}
                onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Primary Cultivated Crops
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCrops.map(crop => {
                const isSelected = formData.primary_crops.includes(crop);
                return (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => handleCropToggle(crop)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {crop} {isSelected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
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
              Update Farmer
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW FARMER PROFILE CARD */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Farmer Profile Card"
        maxWidth="max-w-lg"
      >
        {selectedFarmer && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
                {selectedFarmer.name ? selectedFarmer.name.charAt(0) : 'F'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedFarmer.name}</h3>
                <p className="font-mono text-xs font-semibold text-emerald-800">{selectedFarmer.farmer_code}</p>
                <Badge variant={selectedFarmer.status} size="sm">
                  {selectedFarmer.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Exact Barangay</span>
                <span className="font-semibold text-slate-900">{selectedFarmer.barangay || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Municipality</span>
                <span className="font-semibold text-slate-900">{selectedFarmer.municipality || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Contact Number</span>
                <span className="font-semibold text-slate-800">{selectedFarmer.contact || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Total Farm Size</span>
                <span className="font-semibold text-slate-800">{selectedFarmer.farm_size_ha || 0} Hectares</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-2">Registered Crop Types:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedFarmer.primary_crops && selectedFarmer.primary_crops.length > 0 ? (
                  selectedFarmer.primary_crops.map(c => (
                    <Badge key={c} variant={c} size="md">
                      {c}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No crops registered yet</span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
