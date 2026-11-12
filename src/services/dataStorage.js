import { 
  INITIAL_FARMERS, 
  INITIAL_CROPS, 
  INITIAL_INVENTORY, 
  INITIAL_PURCHASES, 
  INITIAL_SALES 
} from './mockData';

const KEYS = {
  farmers: 'agri_farmers_data',
  crops: 'agri_crops_data',
  inventory: 'agri_inventory_data',
  purchases: 'agri_purchases_data',
  sales: 'agri_sales_data'
};

function getLocal(key, defaultData) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading localStorage', err);
    return defaultData;
  }
}

function setLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed writing localStorage', err);
  }
}

export const dataStore = {
  // Farmers
  getFarmers() {
    return getLocal(KEYS.farmers, []);
  },
  saveFarmers(data) {
    setLocal(KEYS.farmers, data);
  },

  // Crops
  getCrops() {
    return getLocal(KEYS.crops, []);
  },
  saveCrops(data) {
    setLocal(KEYS.crops, data);
  },

  // Inventory
  getInventory() {
    return getLocal(KEYS.inventory, INITIAL_INVENTORY);
  },
  saveInventory(data) {
    setLocal(KEYS.inventory, data);
  },

  // Purchases
  getPurchases() {
    return getLocal(KEYS.purchases, []);
  },
  savePurchases(data) {
    setLocal(KEYS.purchases, data);
  },

  // Sales
  getSales() {
    return getLocal(KEYS.sales, []);
  },
  saveSales(data) {
    setLocal(KEYS.sales, data);
  },

  // Clear all farmers and start with a 100% clean directory
  clearAllFarmers() {
    localStorage.setItem(KEYS.farmers, JSON.stringify([]));
    localStorage.setItem(KEYS.crops, JSON.stringify([]));
    localStorage.setItem(KEYS.purchases, JSON.stringify([]));
  },

  // Reset to original demo dataset if desired
  resetToDefaults() {
    localStorage.setItem(KEYS.farmers, JSON.stringify([]));
    localStorage.setItem(KEYS.crops, JSON.stringify([]));
    localStorage.setItem(KEYS.inventory, JSON.stringify(INITIAL_INVENTORY));
    localStorage.setItem(KEYS.purchases, JSON.stringify([]));
    localStorage.setItem(KEYS.sales, JSON.stringify([]));
  }
};
