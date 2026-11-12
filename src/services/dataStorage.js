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
    if (!raw) {
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
    return getLocal(KEYS.farmers, INITIAL_FARMERS);
  },
  saveFarmers(data) {
    setLocal(KEYS.farmers, data);
  },

  // Crops
  getCrops() {
    return getLocal(KEYS.crops, INITIAL_CROPS);
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
    return getLocal(KEYS.purchases, INITIAL_PURCHASES);
  },
  savePurchases(data) {
    setLocal(KEYS.purchases, data);
  },

  // Sales
  getSales() {
    return getLocal(KEYS.sales, INITIAL_SALES);
  },
  saveSales(data) {
    setLocal(KEYS.sales, data);
  },

  // Reset to original demo dataset
  resetToDefaults() {
    localStorage.setItem(KEYS.farmers, JSON.stringify(INITIAL_FARMERS));
    localStorage.setItem(KEYS.crops, JSON.stringify(INITIAL_CROPS));
    localStorage.setItem(KEYS.inventory, JSON.stringify(INITIAL_INVENTORY));
    localStorage.setItem(KEYS.purchases, JSON.stringify(INITIAL_PURCHASES));
    localStorage.setItem(KEYS.sales, JSON.stringify(INITIAL_SALES));
  }
};

