import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  Wheat,
  ShieldAlert
} from 'lucide-react';

export function StaffLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/office/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid office credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
      navigate('/office/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Decorative background glows */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex justify-center mb-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-2xl shadow-xl shadow-emerald-950/60 border border-emerald-700">
            <Building2 className="w-8 h-8" />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Municipal Agriculture Office
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-medium text-emerald-200">
          Executive Operations, Extension Services & Trading Suite
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-8 border border-slate-200 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Staff & Administrator Sign In
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Access the municipal database, crop inventory, and purchasing ledger
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Government / Office Email
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
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition shadow-md shadow-emerald-950/20 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Office Suite'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
              1-Click Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('staff@agri.gov', 'staff123')}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Field Officer (Staff)</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Roberto Dela Cruz</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@agri.gov', 'admin123')}
                className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 text-left transition"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Chief Agriculturist (Admin)</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Engr. Maria Santos</span>
              </button>
            </div>
          </div>

          {/* Link to Farmer Portal */}
          <div className="text-center pt-2">
            <Link
              to="/farmer/login"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1.5"
            >
              <Wheat className="w-3.5 h-3.5" />
              <span>Are you a registered farmer? Open Farmer Connect here</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

