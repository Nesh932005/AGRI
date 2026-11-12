import { supabase, isSupabaseConfigured } from './supabaseClient';
import { dataStore } from './dataStorage';

export const CROP_CATEGORIES = ['Rice', 'Corn', 'Vegetables', 'Fruits'];

export const GROWTH_STAGES = [
  'Land Preparation',
  'Seedling',
  'Vegetative',
  'Flowering',
  'Ripening',
  'Harvest Ready',
  'Harvested'
];

export const cropService = {
  async getAll() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return dataStore.getCrops();
  },

  async addCrop(cropData) {
    const newCrop = {
      id: `crop-${Date.now()}`,
      farmer_id: cropData.farmer_id,
      farmer_name: cropData.farmer_name || 'Farmer',
      barangay: cropData.barangay || 'San Isidro',
      category: cropData.category || 'Rice',
      variety: cropData.variety,
      area_ha: parseFloat(cropData.area_ha) || 1,
      planting_date: cropData.planting_date,
      expected_harvest_date: cropData.expected_harvest_date,
      growth_stage: cropData.growth_stage || 'Vegetative',
      estimated_yield_kg: parseFloat(cropData.estimated_yield_kg) || 0,
      actual_yield_kg: parseFloat(cropData.actual_yield_kg) || 0,
      health_status: cropData.health_status || 'Healthy',
      notes: cropData.notes || ''
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('crops')
        .insert([newCrop])
        .select()
        .single();
      if (!error && data) return data;
    }

    const current = dataStore.getCrops();
    const updated = [newCrop, ...current];
    dataStore.saveCrops(updated);
    return newCrop;
  },

  async updateCrop(id, updates) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('crops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    }

    const current = dataStore.getCrops();
    const updated = current.map(c => c.id === id ? { ...c, ...updates } : c);
    dataStore.saveCrops(updated);
    return updated.find(c => c.id === id);
  },

  async deleteCrop(id) {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('crops').delete().eq('id', id);
    }
    const current = dataStore.getCrops();
    const updated = current.filter(c => c.id !== id);
    dataStore.saveCrops(updated);
    return true;
  }
};

