// Initial seed data for AGRI Municipal Agriculture Office

export const INITIAL_USERS = [
  {
    id: 'user-admin-1',
    email: 'admin@agri.gov',
    full_name: 'Engr. Maria Santos',
    role: 'admin',
    department: 'Municipal Agriculture Office - Executive',
    phone: '+63 917 555 0101'
  },
  {
    id: 'user-staff-1',
    email: 'staff@agri.gov',
    full_name: 'Roberto Dela Cruz',
    role: 'staff',
    department: 'Agricultural Extension Services',
    phone: '+63 920 555 0202'
  }
];

// Clean empty farmers array so the system starts with a completely clear directory
export const INITIAL_FARMERS = [];

// Clean empty crops array
export const INITIAL_CROPS = [];

export const INITIAL_INVENTORY = [
  {
    id: 'inv-1',
    category: 'Rice',
    variety: 'Clean & Dry Palay',
    current_stock_kg: 5000,
    min_stock_alert_kg: 1000,
    avg_unit_cost: 21.50,
    suggested_selling_price: 26.00,
    storage_location: 'Central Silo 1',
    last_updated: '2026-11-12'
  },
  {
    id: 'inv-2',
    category: 'Corn',
    variety: 'Yellow Feed Corn',
    current_stock_kg: 3000,
    min_stock_alert_kg: 1000,
    avg_unit_cost: 16.50,
    suggested_selling_price: 21.00,
    storage_location: 'Grain Warehouse B',
    last_updated: '2026-11-12'
  },
  {
    id: 'inv-3',
    category: 'Vegetables',
    variety: 'Assorted Vegetables',
    current_stock_kg: 1200,
    min_stock_alert_kg: 300,
    avg_unit_cost: 38.00,
    suggested_selling_price: 52.00,
    storage_location: 'Cold Storage Room 1',
    last_updated: '2026-11-12'
  },
  {
    id: 'inv-4',
    category: 'Fruits',
    variety: 'Seasonal Fruits',
    current_stock_kg: 1500,
    min_stock_alert_kg: 400,
    avg_unit_cost: 60.00,
    suggested_selling_price: 80.00,
    storage_location: 'Cold Storage Room 2',
    last_updated: '2026-11-12'
  }
];

export const INITIAL_PURCHASES = [];
export const INITIAL_SALES = [];
