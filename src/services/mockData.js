// Initial realistic seed data for AGRI Municipal Agriculture Office

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

export const INITIAL_FARMERS = [
  {
    id: 'f-1',
    farmer_code: 'FMR-2026-001',
    name: 'Juanito Batumbakal',
    contact: '0917-234-5678',
    barangay: 'San Isidro',
    farm_size_ha: 3.5,
    primary_crops: ['Rice', 'Vegetables'],
    status: 'active',
    registered_at: '2025-01-15'
  },
  {
    id: 'f-2',
    farmer_code: 'FMR-2026-002',
    name: 'Esperanza Morales',
    contact: '0928-345-6789',
    barangay: 'Santa Maria',
    farm_size_ha: 5.2,
    primary_crops: ['Corn', 'Fruits'],
    status: 'active',
    registered_at: '2025-02-10'
  },
  {
    id: 'f-3',
    farmer_code: 'FMR-2026-003',
    name: 'Danilo Ramos',
    contact: '0919-456-7890',
    barangay: 'San Roque',
    farm_size_ha: 2.8,
    primary_crops: ['Vegetables'],
    status: 'active',
    registered_at: '2025-03-01'
  },
  {
    id: 'f-4',
    farmer_code: 'FMR-2026-004',
    name: 'Corazon Mendoza',
    contact: '0935-567-8901',
    barangay: 'Maligaya',
    farm_size_ha: 6.0,
    primary_crops: ['Rice', 'Corn'],
    status: 'active',
    registered_at: '2025-03-18'
  },
  {
    id: 'f-5',
    farmer_code: 'FMR-2026-005',
    name: 'Mateo Villanueva',
    contact: '0946-678-9012',
    barangay: 'Buenavista',
    farm_size_ha: 4.0,
    primary_crops: ['Fruits'],
    status: 'active',
    registered_at: '2025-04-05'
  }
];

export const INITIAL_CROPS = [
  {
    id: 'crop-1',
    farmer_id: 'f-1',
    farmer_name: 'Juanito Batumbakal',
    barangay: 'San Isidro',
    category: 'Rice',
    variety: 'NSIC Rc222 (Tubigan 18)',
    area_ha: 2.5,
    planting_date: '2026-08-10',
    expected_harvest_date: '2026-11-20',
    growth_stage: 'Harvest Ready',
    estimated_yield_kg: 11250,
    actual_yield_kg: 11400,
    health_status: 'Healthy',
    notes: 'Excellent grain filling, no sign of stem borer.'
  },
  {
    id: 'crop-2',
    farmer_id: 'f-2',
    farmer_name: 'Esperanza Morales',
    barangay: 'Santa Maria',
    category: 'Corn',
    variety: 'Yellow Hybrid Pioneer 30T80',
    area_ha: 3.0,
    planting_date: '2026-09-01',
    expected_harvest_date: '2026-12-15',
    growth_stage: 'Ripening',
    estimated_yield_kg: 18000,
    actual_yield_kg: 0,
    health_status: 'Healthy',
    notes: 'Adequate fertilization applied; monitor for fall armyworm.'
  },
  {
    id: 'crop-3',
    farmer_id: 'f-3',
    farmer_name: 'Danilo Ramos',
    barangay: 'San Roque',
    category: 'Vegetables',
    variety: 'Ampalaya (Galaxy Max)',
    area_ha: 1.2,
    planting_date: '2026-09-15',
    expected_harvest_date: '2026-11-10',
    growth_stage: 'Harvest Ready',
    estimated_yield_kg: 3600,
    actual_yield_kg: 3450,
    health_status: 'Healthy',
    notes: 'Trellis structure reinforced; ready for wholesale.'
  },
  {
    id: 'crop-4',
    farmer_id: 'f-4',
    farmer_name: 'Corazon Mendoza',
    barangay: 'Maligaya',
    category: 'Rice',
    variety: 'Dinorado Special',
    area_ha: 3.5,
    planting_date: '2026-09-20',
    expected_harvest_date: '2026-12-28',
    growth_stage: 'Flowering',
    estimated_yield_kg: 14000,
    actual_yield_kg: 0,
    health_status: 'Needs Water',
    notes: 'Canal irrigation scheduled for tomorrow.'
  },
  {
    id: 'crop-5',
    farmer_id: 'f-5',
    farmer_name: 'Mateo Villanueva',
    barangay: 'Buenavista',
    category: 'Fruits',
    variety: 'Carabao Mango (Sweet Elena)',
    area_ha: 4.0,
    planting_date: '2024-01-10',
    expected_harvest_date: '2026-11-25',
    growth_stage: 'Harvest Ready',
    estimated_yield_kg: 8500,
    actual_yield_kg: 8200,
    health_status: 'Healthy',
    notes: 'Fruit bagging complete, export quality grade.'
  },
  {
    id: 'crop-6',
    farmer_id: 'f-1',
    farmer_name: 'Juanito Batumbakal',
    barangay: 'San Isidro',
    category: 'Vegetables',
    variety: 'Tomato (Diamante Max)',
    area_ha: 1.0,
    planting_date: '2026-10-01',
    expected_harvest_date: '2026-12-10',
    growth_stage: 'Vegetative',
    estimated_yield_kg: 5000,
    actual_yield_kg: 0,
    health_status: 'Healthy',
    notes: 'Mulching applied, thriving vigorously.'
  }
];

export const INITIAL_INVENTORY = [
  {
    id: 'inv-1',
    category: 'Rice',
    variety: 'NSIC Rc222 (Tubigan 18)',
    current_stock_kg: 14200,
    min_stock_alert_kg: 3000,
    avg_unit_cost: 21.50,
    suggested_selling_price: 26.00,
    storage_location: 'Central Silo 1',
    last_updated: '2026-11-10'
  },
  {
    id: 'inv-2',
    category: 'Rice',
    variety: 'Dinorado Premium Fragrant',
    current_stock_kg: 4800,
    min_stock_alert_kg: 1500,
    avg_unit_cost: 38.00,
    suggested_selling_price: 46.00,
    storage_location: 'Central Silo 2',
    last_updated: '2026-11-08'
  },
  {
    id: 'inv-3',
    category: 'Corn',
    variety: 'Yellow Feed Corn Pioneer',
    current_stock_kg: 9600,
    min_stock_alert_kg: 2000,
    avg_unit_cost: 16.50,
    suggested_selling_price: 21.00,
    storage_location: 'Grain Warehouse B',
    last_updated: '2026-11-09'
  },
  {
    id: 'inv-4',
    category: 'Vegetables',
    variety: 'Ampalaya (Galaxy Max)',
    current_stock_kg: 1850,
    min_stock_alert_kg: 500,
    avg_unit_cost: 38.00,
    suggested_selling_price: 52.00,
    storage_location: 'Cold Storage Room 1',
    last_updated: '2026-11-11'
  },
  {
    id: 'inv-5',
    category: 'Fruits',
    variety: 'Carabao Mango (Sweet Elena)',
    current_stock_kg: 3400,
    min_stock_alert_kg: 800,
    avg_unit_cost: 65.00,
    suggested_selling_price: 85.00,
    storage_location: 'Cold Storage Room 2',
    last_updated: '2026-11-11'
  }
];

export const INITIAL_PURCHASES = [
  {
    id: 'pur-1',
    reference_no: 'PUR-2026-1001',
    farmer_id: 'f-1',
    farmer_name: 'Juanito Batumbakal',
    category: 'Rice',
    variety: 'NSIC Rc222 (Tubigan 18)',
    quantity_kg: 5000,
    price_per_kg: 21.50,
    total_amount: 107500,
    payment_status: 'Paid',
    payment_method: 'LandBank',
    storage_location: 'Central Silo 1',
    purchase_date: '2026-11-05',
    notes: 'Grade A palay, moisture content at 13.8%.'
  },
  {
    id: 'pur-2',
    reference_no: 'PUR-2026-1002',
    farmer_id: 'f-3',
    farmer_name: 'Danilo Ramos',
    category: 'Vegetables',
    variety: 'Ampalaya (Galaxy Max)',
    quantity_kg: 1200,
    price_per_kg: 38.00,
    total_amount: 45600,
    payment_status: 'Paid',
    payment_method: 'Cash',
    storage_location: 'Cold Storage Room 1',
    purchase_date: '2026-11-08',
    notes: 'Freshly harvested morning batch.'
  },
  {
    id: 'pur-3',
    reference_no: 'PUR-2026-1003',
    farmer_id: 'f-5',
    farmer_name: 'Mateo Villanueva',
    category: 'Fruits',
    variety: 'Carabao Mango (Sweet Elena)',
    quantity_kg: 2500,
    price_per_kg: 65.00,
    total_amount: 162500,
    payment_status: 'Paid',
    payment_method: 'Bank Transfer',
    storage_location: 'Cold Storage Room 2',
    purchase_date: '2026-11-10',
    notes: 'Premium export grade size 280-320g.'
  }
];

export const INITIAL_SALES = [
  {
    id: 'sale-1',
    reference_no: 'SAL-2026-2001',
    buyer_name: 'Metro Food Terminal Wholesalers',
    buyer_type: 'Wholesaler',
    buyer_contact: '0918-999-1122',
    category: 'Rice',
    variety: 'NSIC Rc222 (Tubigan 18)',
    quantity_kg: 3000,
    price_per_kg: 26.00,
    total_amount: 78000,
    payment_status: 'Paid',
    payment_method: 'Bank Transfer',
    storage_location: 'Central Silo 1',
    sale_date: '2026-11-07',
    notes: 'Dispatched via Truck #NGA-4412.'
  },
  {
    id: 'sale-2',
    reference_no: 'SAL-2026-2002',
    buyer_name: 'San Isidro Public Market Vendors Assoc.',
    buyer_type: 'Public Market',
    buyer_contact: '0922-333-4455',
    category: 'Vegetables',
    variety: 'Ampalaya (Galaxy Max)',
    quantity_kg: 600,
    price_per_kg: 52.00,
    total_amount: 31200,
    payment_status: 'Paid',
    payment_method: 'Cash',
    storage_location: 'Cold Storage Room 1',
    sale_date: '2026-11-09',
    notes: 'Daily market delivery allocation.'
  },
  {
    id: 'sale-3',
    reference_no: 'SAL-2026-2003',
    buyer_name: 'Luzon Fruit Exporters Corp.',
    buyer_type: 'Wholesaler',
    buyer_contact: '0917-888-7766',
    category: 'Fruits',
    variety: 'Carabao Mango (Sweet Elena)',
    quantity_kg: 1500,
    price_per_kg: 85.00,
    total_amount: 127500,
    payment_status: 'Paid',
    payment_method: 'Bank Transfer',
    storage_location: 'Cold Storage Room 2',
    sale_date: '2026-11-11',
    notes: 'Refrigerated container dispatched.'
  }
];

