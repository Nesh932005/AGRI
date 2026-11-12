import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Menu, 
  Database, 
  RefreshCw, 
  LogOut, 
  Wheat,
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { dataStore } from '../services/dataStorage';

export function Navbar({ currentTab, onOpenMobileSidebar, onDataRefreshed, setCurrentTab }) {
  const { user, logout, switchRole, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleResetData = () => {
    if (window.confirm('Clear all farmers, crops, and purchase records to have a completely clean database?')) {
      dataStore.clearAllFarmers();
      if (onDataRefreshed) onDataRefreshed();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/office/login');
  };

  const titles = {
    dashboard: 'Executive Dashboard & Overview',
    farmers: 'Farmer Registration & Profile Directory',
    crops: 'Crop Growth & Harvest Monitoring (Rice, Corn, Vegetables, Fruits)',
    inventory: 'Automatic Inventory Management & Stock Silos',
    purchasing: 'Crop Purchasing (Harvest Procurement)',
    sales: 'Crop Sales & Distribution Outlets',
    transactions: 'Consolidated Transaction History & Ledger',
    reports: 'Agricultural Reports & Analytics Hub'
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-xs">
      {/* Left: Mobile trigger & view title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-emerald-700"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{titles[currentTab] || 'AGRI Office Suite'}</span>
          </h2>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Supabase Status indicator */}
        <div 
          title={isSupabaseConfigured ? 'Connected to live Supabase backend' : 'Running in reactive local storage mode. Connect real Supabase anytime in .env'}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isSupabaseConfigured 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : 'bg-emerald-50/60 text-emerald-700 border-emerald-200'
          }`}
        >
          <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-emerald-600 animate-pulse' : 'text-emerald-600'}`} />
          <span>{isSupabaseConfigured ? 'Supabase Live' : 'Supabase Ready'}</span>
        </div>

        {/* Staff / Admin Quick Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => switchRole('staff')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              !isAdmin ? 'bg-white text-emerald-800 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Staff
          </button>
          <button
            onClick={() => switchRole('admin')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              isAdmin ? 'bg-emerald-700 text-white shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Direct link to Farmer Website */}
        <Link
          to="/farmer/dashboard"
          title="Switch to Farmer Website"
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition"
        >
          <Wheat className="w-3.5 h-3.5 text-emerald-700" />
          <span>Farmer View</span>
        </Link>

        {/* Reset Demo Data */}
        <button
          onClick={handleResetData}
          title="Reset sample records to initial defaults"
          className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200/80 transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          title="Sign out of AGRI Office"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200/80 text-xs font-medium transition"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
