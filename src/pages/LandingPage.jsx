import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Users, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Wheat, 
  Coins, 
  Boxes, 
  Truck,
  ShieldCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';

export function LandingPage() {
  const currentPrices = [
    { name: 'Palay (Clean & Dry Rice)', price: '₱22.50 / kg', trend: '+₱0.50', category: 'Rice' },
    { name: 'Yellow Feed Corn', price: '₱18.00 / kg', trend: 'Stable', category: 'Corn' },
    { name: 'Highland Vegetables (Ampalaya/Tomato)', price: '₱45.00 / kg', trend: '+₱2.00', category: 'Vegetables' },
    { name: 'Carabao Mango (Export Grade)', price: '₱75.00 / kg', trend: '+₱5.00', category: 'Fruits' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md">
              <Sprout className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-emerald-950">AGRI</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block -mt-1">
                Municipal Agriculture Department
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/farmer/login"
              className="px-3.5 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-xl transition flex items-center gap-1.5"
            >
              <Wheat className="w-4 h-4 text-emerald-600" />
              <span>Farmer Portal</span>
            </Link>
            <Link
              to="/office/login"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition shadow-sm shadow-emerald-700/20 flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>Office Staff & Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 text-white py-16 sm:py-24">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Connected Unified Agricultural Information System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Connecting Local Farmers with the Municipal Agriculture Office
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto font-normal">
            Choose your dedicated website entry below. Both portals operate on the same live database for real-time crop monitoring, inventory tracking, and harvest payouts.
          </p>

          {/* Dual Website Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-8 text-left">
            {/* PORTAL 1: FARMER PORTAL */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-xl border border-emerald-100 flex flex-col justify-between hover:shadow-2xl transition duration-300 relative group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                    🌾
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Farmer Portal
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  Farmer Connect Website
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Dedicated self-service website for registered farmers and agricultural beneficiaries.
                </p>

                <ul className="space-y-2 text-xs text-slate-700 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Log in with your Farmer ID or mobile number</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Track crop lifecycle & growth progress</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Request harvest pickup when fields are ripe</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>View purchase vouchers & LandBank payouts</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  to="/farmer/login"
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20"
                >
                  <span>Go to Farmer Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* PORTAL 2: STAFF & ADMIN PORTAL */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-xl border border-emerald-100 flex flex-col justify-between hover:shadow-2xl transition duration-300 relative group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-white flex items-center justify-center font-bold text-xl">
                    <Building2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    Office Staff & Admin
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  Municipal Agriculture Office
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete operations dashboard for Extension Officers, Agronomists, and Administrators.
                </p>

                <ul className="space-y-2 text-xs text-slate-700 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Farmer registration & landholding records</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Rice, Corn, Vegetables & Fruits field monitoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Harvest procurement (auto-credits inventory)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Commercial crop sales & printable executive reports</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  to="/office/login"
                  className="w-full py-3 px-4 bg-emerald-950 hover:bg-emerald-900 text-white rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20"
                >
                  <span>Go to Office Staff Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Commodity Municipal Prices Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Live Municipal Buying & Market Prices (Today)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Guaranteed Farmgate Baseline</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentPrices.map(p => (
              <div key={p.name} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 block">{p.name}</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-base font-bold font-mono text-emerald-900">{p.price}</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-full">
                    {p.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unified Architecture Feature Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How Both Websites Connect in Real Time
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            A single unified Supabase database powers both distinct portal views.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">1. Field Enrollment & Monitoring</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              When a farmer or extension officer enrolls a field, it syncs across both systems. Growth stages update live from planting to harvest.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">2. Harvest Procurement & Auto-Silos</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Farmers request harvest pickup with 1 click. When Office Staff buys the yield, inventory silos update automatically and calculate average cost.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">3. Instant Digital Payout Vouchers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              The moment staff confirms a purchase, the farmer immediately receives an authenticated digital voucher in their personal Farmer Portal.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Republic of the Philippines • Municipal Agriculture Office (MAO). All rights reserved.</p>
      </footer>
    </div>
  );
}
