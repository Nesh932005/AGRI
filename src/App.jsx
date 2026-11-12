import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Layouts
import { MainLayout } from './layouts/MainLayout';

// Public & Landing
import { LandingPage } from './pages/LandingPage';

// Farmer Portal
import { FarmerLogin } from './pages/farmer/FarmerLogin';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';

// Office Staff & Admin Portal
import { StaffLogin } from './pages/office/StaffLogin';
import { Dashboard } from './pages/Dashboard';
import { Farmers } from './pages/Farmers';
import { CropMonitoring } from './pages/CropMonitoring';
import { Inventory } from './pages/Inventory';
import { Purchasing } from './pages/Purchasing';
import { Sales } from './pages/Sales';
import { Transactions } from './pages/Transactions';
import { Reports } from './pages/Reports';

// Office Route Wrapper with MainLayout
function OfficeShell({ activeTab }) {
  const { user, isFarmer } = useAuth();
  const navigate = useNavigate();

  // Cross-page navigation state for harvest procurement and inventory sales
  const [prefilledCrop, setPrefilledCrop] = useState(null);
  const [prefilledInventoryItem, setPrefilledInventoryItem] = useState(null);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);

  if (!user) {
    return <Navigate to="/office/login" replace />;
  }

  // If user is logged in as a farmer, redirect to farmer dashboard
  if (isFarmer) {
    return <Navigate to="/farmer/dashboard" replace />;
  }

  const handleNavigateToPurchase = (crop) => {
    setPrefilledCrop(crop);
    navigate('/office/purchasing');
  };

  const handleNavigateToSell = (invItem) => {
    setPrefilledInventoryItem(invItem);
    navigate('/office/sales');
  };

  return (
    <MainLayout
      currentTab={activeTab}
      setCurrentTab={(tab) => navigate(`/office/${tab}`)}
      onDataRefreshed={() => setDataRefreshKey(k => k + 1)}
    >
      <div key={dataRefreshKey}>
        {activeTab === 'dashboard' && <Dashboard onNavigate={(tab) => navigate(`/office/${tab}`)} />}
        {activeTab === 'farmers' && <Farmers />}
        {activeTab === 'crops' && <CropMonitoring onNavigateToPurchase={handleNavigateToPurchase} />}
        {activeTab === 'inventory' && <Inventory onNavigateToSell={handleNavigateToSell} />}
        {activeTab === 'purchasing' && (
          <Purchasing
            prefilledCrop={prefilledCrop}
            onClearPrefilledCrop={() => setPrefilledCrop(null)}
          />
        )}
        {activeTab === 'sales' && (
          <Sales
            prefilledItem={prefilledInventoryItem}
            onClearPrefilledItem={() => setPrefilledInventoryItem(null)}
          />
        )}
        {activeTab === 'transactions' && <Transactions />}
        {activeTab === 'reports' && <Reports />}
      </div>
    </MainLayout>
  );
}

// Top-level App Routes
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* 1. Central Municipal Gateway */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. Farmer Portal Routes */}
      <Route 
        path="/farmer" 
        element={user?.role === 'farmer' ? <Navigate to="/farmer/dashboard" replace /> : <Navigate to="/farmer/login" replace />} 
      />
      <Route path="/farmer/login" element={<FarmerLogin />} />
      <Route path="/farmer/dashboard" element={<FarmerDashboard />} />

      {/* 3. Office Staff & Admin Portal Routes */}
      <Route 
        path="/office" 
        element={user && user.role !== 'farmer' ? <Navigate to="/office/dashboard" replace /> : <Navigate to="/office/login" replace />} 
      />
      <Route path="/office/login" element={<StaffLogin />} />
      <Route path="/office/dashboard" element={<OfficeShell activeTab="dashboard" />} />
      <Route path="/office/farmers" element={<OfficeShell activeTab="farmers" />} />
      <Route path="/office/crops" element={<OfficeShell activeTab="crops" />} />
      <Route path="/office/inventory" element={<OfficeShell activeTab="inventory" />} />
      <Route path="/office/purchasing" element={<OfficeShell activeTab="purchasing" />} />
      <Route path="/office/sales" element={<OfficeShell activeTab="sales" />} />
      <Route path="/office/transactions" element={<OfficeShell activeTab="transactions" />} />
      <Route path="/office/reports" element={<OfficeShell activeTab="reports" />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
