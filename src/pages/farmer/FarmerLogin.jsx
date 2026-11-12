import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { farmerService } from '../../services/farmerService';
import { 
  Wheat, 
  Hash, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  UserPlus, 
  MapPin, 
  Building2,
  Sparkles
} from 'lucide-react';

export function FarmerLogin() {
  const { loginFarmer } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  // 100% CLEAR form state
  const [codeOrPhone, setCodeOrPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Self-registration form state for new farmers with completely empty fields
  const [regData, setRegData] = useState({
    name: '',
    contact: '',
    barangay: '',
    municipality: '',
    farm_size_ha: '',
    primary_crops: []
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!codeOrPhone.trim()) {
      setError('Please enter your Farmer Code or Phone Number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await loginFarmer(codeOrPhone.trim());
      navigate('/farmer/dashboard');
    } catch (err) {
      setError(err.message || 'Farmer record not found. If you are new, please register below.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const newFarmer = await farmerService.addFarmer(regData);
      // Automatically log them in with their new code
      await loginFarmer(newFarmer.farmer_code);
      navigate('/farmer/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to register farmer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Decorative background glows */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex justify-center mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-green-300 flex items-center justify-center text-emerald-950 shadow-xl shadow-emerald-950/50">
            <Wheat className="w-8 h-8 stroke-[2.5]" />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Farmer Connect Portal
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-medium text-emerald-200">
          Municipal Agriculture Office — Beneficiary Services
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-8 border border-emerald-100 space-y-6">
          {/* Login vs Register Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                mode === 'login' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In (Existing Farmer)
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                mode === 'register' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register as New Farmer
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* SIGN IN FORM - 100% CLEAR */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Farmer Code or Mobile Number
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-emerald-700 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={codeOrPhone}
                    onChange={(e) => setCodeOrPhone(e.target.value)}
                    placeholder="Enter Farmer Code (e.g. FMR-2026-001) or Mobile Phone"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter your registered Farmer ID or phone number.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition shadow-md shadow-emerald-700/20 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Access My Farmer Portal'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* ONLINE SELF-REGISTRATION FORM - 100% CLEAR FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.contact}
                    onChange={(e) => setRegData({ ...regData, contact: e.target.value })}
                    placeholder="Enter phone number"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Farm Land Area (ha) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={regData.farm_size_ha}
                    onChange={(e) => setRegData({ ...regData, farm_size_ha: e.target.value })}
                    placeholder="e.g. 2.0"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* CLEAR EXACT BARANGAY AND MUNICIPALITY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Exact Barangay *
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.barangay}
                    onChange={(e) => setRegData({ ...regData, barangay: e.target.value })}
                    placeholder="Enter exact barangay"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Municipality / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.municipality}
                    onChange={(e) => setRegData({ ...regData, municipality: e.target.value })}
                    placeholder="Enter municipality"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition shadow-md shadow-emerald-700/20 disabled:opacity-50"
              >
                {loading ? 'Creating Profile...' : 'Complete Farmer Registration'}
                <UserPlus className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Link to Staff Portal */}
          <div className="text-center pt-2">
            <Link
              to="/office/login"
              className="text-xs font-semibold text-slate-500 hover:text-emerald-800 inline-flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Are you Office Staff or Admin? Sign in here</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
