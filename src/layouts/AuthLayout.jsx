import React from 'react';
import { Sprout } from 'lucide-react';

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-green-300 flex items-center justify-center text-emerald-950 shadow-xl shadow-emerald-950/50">
            <Sprout className="w-10 h-10 stroke-[2.5]" />
          </div>
        </div>
        <h1 className="mt-4 text-center text-3xl font-extrabold text-white tracking-tight">
          AGRI Portal
        </h1>
        <p className="mt-1.5 text-center text-sm font-medium text-emerald-200">
          Municipal Agriculture Office Management & Trading System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-emerald-100">
          {children}
        </div>
      </div>
    </div>
  );
}

