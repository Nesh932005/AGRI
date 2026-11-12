import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Sprout, 
  Boxes, 
  ShoppingBag, 
  TrendingUp, 
  Receipt, 
  BarChart3,
  ShieldCheck,
  Building2,
  Wheat,
  ExternalLink,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Sidebar({ currentTab, setCurrentTab, isMobileOpen, setIsMobileOpen }) {
  const { user, isAdmin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'farmers', label: 'Farmers', icon: Users, badge: '5' },
    { id: 'crops', label: 'Crop Monitoring', icon: Sprout },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'purchasing', label: 'Crop Purchasing', icon: ShoppingBag },
    { id: 'sales', label: 'Crop Sales', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  const handleSelect = (id) => {
    setCurrentTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-emerald-950 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-emerald-900 shadow-xl`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-emerald-900/80 bg-emerald-900/40">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-emerald-950 shadow-md">
              <Sprout className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white leading-none">
                AGRI
              </h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-300">
                Agriculture Office
              </span>
            </div>
          </Link>

          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Office Subtitle / Municipality */}
        <div className="px-5 py-3 bg-emerald-900/20 border-b border-emerald-900/60 flex items-center gap-2 text-xs text-emerald-300">
          <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
          <span className="truncate">Municipal Agriculture Dept.</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40 font-semibold'
                    : 'text-emerald-100/80 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-emerald-700 text-white' : 'bg-emerald-900 text-emerald-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Cross-portal quick link to Farmer Connect */}
        <div className="px-3 pb-2">
          <Link
            to="/farmer/login"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-900/50 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold border border-emerald-800/80 transition group"
          >
            <div className="flex items-center gap-2">
              <Wheat className="w-4 h-4 text-emerald-400" />
              <span>Farmer Portal</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* User Card & Role Status in Sidebar */}
        <div className="p-3 border-t border-emerald-900/80 bg-emerald-900/30">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-emerald-900/40">
            <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm text-white">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.full_name || 'Agriculturist'}
              </p>
              <div className="flex items-center gap-1.5">
                <span className={`inline-block w-2 h-2 rounded-full ${isAdmin ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className="text-[11px] uppercase font-bold text-emerald-300 tracking-wider">
                  {user?.role || 'Staff'}
                </span>
              </div>
            </div>
            {isAdmin && <ShieldCheck className="w-4 h-4 text-amber-300 flex-shrink-0" />}
          </div>
        </div>
      </aside>
    </>
  );
}
