import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../layouts/AuthLayout';
import { 
  Lock, 
  Mail, 
  Shield, 
  User, 
  ArrowRight, 
  Wheat, 
  Hash, 
  Phone,
  Building2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export function Login() {
  const { login, loginFarmer } = useAuth();
  
  // 'farmer' or 'staff'
  const [loginMode, setLoginMode] = useState('farmer');

  // Staff login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Farmer login state
  const [farmerCodeOrPhone, setFarmerCodeOrPhone] = useState('FMR-2026-001');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitStaff = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Failed to authenticate staff account');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFarmer = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginFarmer(farmerCodeOrPhone);
    } catch (err) {
      setError(err.message || 'Farmer identification not found');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStaffLogin = async (demoEmail, demoPassword) => {
    setLoginMode('staff');
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFarmerLogin = async (code) => {
    setLoginMode('farmer');
    setFarmerCodeOrPhone(code);
    setError('');
    setLoading(true);
    try {
      await loginFarmer(code);
    } catch (err) {
      setError(err.message || 'Farmer login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Portal Mode Switch Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => { setLoginMode('farmer'); setError(''); }}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              loginMode === 'farmer'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            <Wheat className="w-4 h-4" />
            <span>Farmer Portal</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setLoginMode('staff'); setError(''); }}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              loginMode === 'staff'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Office Staff / Admin</span>
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {loginMode === 'farmer' ? (
              <>
                <span>Farmer Access & Services</span>
                <span className="text-emerald-700">🌱</span>
              </>
            ) : (
              <>
                <span>Agriculture Office Staff Login</span>
                <span className="text-emerald-700">🏛️</span>
              </>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {loginMode === 'farmer' 
              ? 'Enter your registered Farmer ID Code (e.g. FMR-2026-001) or Mobile Number to view your crops and payouts.'
              : 'Sign in with your official municipal agriculture credentials.'
            }
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* ================= FARMER LOGIN FORM ================= */}
        {loginMode === 'farmer' ? (
          <form onSubmit={handleSubmitFarmer} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Farmer Code or Phone Number
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-emerald-700 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={farmerCodeOrPhone}
                  onChange={(e) => setFarmerCodeOrPhone(e.target.value)}
                  placeholder="e.g. FMR-2026-001 or 0917-234-5678"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Issued upon registration at the Municipal Agriculture Office.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition shadow-md shadow-emerald-700/20 disabled:opacity-50"
            >
              {loading ? 'Verifying Farmer...' : 'Sign In as Farmer'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* ================= STAFF & ADMIN LOGIN FORM ================= */
          <form onSubmit={handleSubmitStaff} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Office Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@agri.gov"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition shadow-md shadow-emerald-700/20 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In as Staff'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Demo Access Buttons */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
            One-Click Instant Demo Portals
          </p>
          <div className="grid grid-cols-3 gap-2">
            {/* Farmer Demo */}
            <button
              type="button"
              onClick={() => handleQuickFarmerLogin('FMR-2026-001')}
              className="flex flex-col items-center p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 transition text-center"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-1">
                🌾
              </div>
              <span className="text-xs font-bold text-emerald-900 leading-tight">Farmer</span>
              <span className="text-[10px] text-slate-500 mt-0.5 truncate max-w-full">Batumbakal</span>
            </button>

            {/* Staff Demo */}
            <button
              type="button"
              onClick={() => handleQuickStaffLogin('staff@agri.gov', 'staff123')}
              className="flex flex-col items-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition text-center"
            >
              <div className="w-7 h-7 rounded-full bg-slate-600 text-white flex items-center justify-center text-xs font-bold mb-1">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">Office Staff</span>
              <span className="text-[10px] text-slate-500 mt-0.5 truncate max-w-full">Field Officer</span>
            </button>

            {/* Admin Demo */}
            <button
              type="button"
              onClick={() => handleQuickStaffLogin('admin@agri.gov', 'admin123')}
              className="flex flex-col items-center p-2.5 rounded-xl border border-amber-300 bg-amber-50/60 hover:bg-amber-100 text-amber-950 transition text-center"
            >
              <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold mb-1">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-amber-900 leading-tight">Admin</span>
              <span className="text-[10px] text-slate-500 mt-0.5 truncate max-w-full">Chief Agri</span>
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
