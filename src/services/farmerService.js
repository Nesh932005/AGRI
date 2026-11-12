import { supabase, isSupabaseConfigured } from './supabaseClient';
import { dataStore } from './dataStorage';

export const farmerService = {
  async getAll() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return dataStore.getFarmers();
  },

  async addFarmer(farmer) {
    const newFarmer = {
      id: `f-${Date.now()}`,
      farmer_code: `FMR-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      name: farmer.name,
      contact: farmer.contact,
      barangay: farmer.barangay?.trim() || 'Poblacion',
      municipality: farmer.municipality?.trim() || 'San Jose',
      farm_size_ha: parseFloat(farmer.farm_size_ha) || 1,
      primary_crops: farmer.primary_crops || ['Rice'],
      status: farmer.status || 'active',
      registered_at: new Date().toISOString().split('T')[0]
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('farmers')
        .insert([newFarmer])
        .select()
        .single();
      if (!error && data) return data;
    }

    const current = dataStore.getFarmers();
    const updated = [newFarmer, ...current];
    dataStore.saveFarmers(updated);
    return newFarmer;
  },

  async updateFarmer(id, updates) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('farmers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    }

    const current = dataStore.getFarmers();
    const updated = current.map(f => f.id === id ? { 
      ...f, 
      ...updates,
      barangay: updates.barangay ? updates.barangay.trim() : f.barangay,
      municipality: updates.municipality ? updates.municipality.trim() : f.municipality
    } : f);
    dataStore.saveFarmers(updated);
    return updated.find(f => f.id === id);
  },

  async deleteFarmer(id) {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('farmers').delete().eq('id', id);
    }
    const current = dataStore.getFarmers();
    const updated = current.filter(c => c.id !== id);
    dataStore.saveFarmers(updated);
    return true;
  }
};
