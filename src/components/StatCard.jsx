import React from 'react';

export function StatCard({ title, value, change, icon: Icon, trend = 'up', description, color = 'emerald' }) {
  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'bg-amber-100 text-amber-800'
    },
    blue: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: 'bg-blue-100 text-blue-800'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      badge: 'bg-rose-100 text-rose-800'
    }
  };

  const style = colorStyles[color] || colorStyles.emerald;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{value}</h3>
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl border ${style.bg} transition-transform group-hover:scale-105`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100 text-xs">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
            {change}
          </span>
          <span className="text-slate-500">vs last month</span>
        </div>
      )}
    </div>
  );
}

