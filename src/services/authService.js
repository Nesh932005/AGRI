import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_USERS } from './mockData';
import { dataStore } from './dataStorage';

const AUTH_STORAGE_KEY = 'agri_current_user';

export const authService = {
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    // Default to admin for instant review
    return INITIAL_USERS[0];
  },

  async login(email, password) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const user = {
        id: data.user.id,
        email: data.user.email,
        full_name: profile?.full_name || data.user.email,
        role: profile?.role || 'staff',
        department: profile?.department || 'Municipal Agriculture Office'
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    // Demo Mode login check
    const matched = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matched));
      return matched;
    }

    // If an unknown email is typed in demo mode, create a guest staff profile
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      role: email.includes('admin') ? 'admin' : 'staff',
      department: 'Agriculture Extension Office',
      phone: '+63 900 000 0000'
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  // Dedicated Farmer Login by Farmer Code or Registered Phone Number
  async loginFarmer(codeOrPhone) {
    const cleanQuery = codeOrPhone.trim().toLowerCase();
    const farmers = dataStore.getFarmers();

    const matched = farmers.find(f => 
      f.farmer_code.toLowerCase() === cleanQuery ||
      f.contact.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '') ||
      f.name.toLowerCase().includes(cleanQuery)
    );

    if (!matched) {
      throw new Error(`No farmer registered with Code or Contact "${codeOrPhone}". Please verify your farmer ID or contact the Municipal Agriculture Office.`);
    }

    const farmerUser = {
      id: matched.id,
      farmer_id: matched.id,
      farmer_code: matched.farmer_code,
      full_name: matched.name,
      email: `${matched.farmer_code.toLowerCase()}@farmer.agri.gov`,
      role: 'farmer',
      contact: matched.contact,
      barangay: matched.barangay,
      farm_size_ha: matched.farm_size_ha,
      primary_crops: matched.primary_crops,
      department: 'Registered Farmer Beneficiary'
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(farmerUser));
    return farmerUser;
  },

  logout() {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  switchDemoRole(role = 'admin') {
    if (role === 'farmer') {
      const farmers = dataStore.getFarmers();
      const demoFarmer = farmers[0];
      const farmerUser = {
        id: demoFarmer.id,
        farmer_id: demoFarmer.id,
        farmer_code: demoFarmer.farmer_code,
        full_name: demoFarmer.name,
        email: `${demoFarmer.farmer_code.toLowerCase()}@farmer.agri.gov`,
        role: 'farmer',
        contact: demoFarmer.contact,
        barangay: demoFarmer.barangay,
        farm_size_ha: demoFarmer.farm_size_ha,
        primary_crops: demoFarmer.primary_crops,
        department: 'Registered Farmer Beneficiary'
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(farmerUser));
      return farmerUser;
    }

    const target = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(target));
    return target;
  }
};
