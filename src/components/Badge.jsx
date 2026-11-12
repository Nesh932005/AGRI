import React from 'react';

export function Badge({ children, variant = 'default', size = 'md' }) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  };

  const variantMap = {
    // Crop Categories
    Rice: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Corn: 'bg-amber-100 text-amber-800 border-amber-300',
    Vegetables: 'bg-lime-100 text-lime-800 border-lime-300',
    Fruits: 'bg-orange-100 text-orange-800 border-orange-300',

    // Statuses
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-700 border-gray-200',
    Healthy: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Needs Water': 'bg-blue-100 text-blue-800 border-blue-200',
    'Pest Warning': 'bg-amber-100 text-amber-800 border-amber-200',
    Damaged: 'bg-rose-100 text-rose-800 border-rose-200',

    // Growth Stages
    'Land Preparation': 'bg-stone-100 text-stone-700 border-stone-300',
    'Seedling': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Vegetative': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'Flowering': 'bg-purple-100 text-purple-800 border-purple-200',
    'Ripening': 'bg-amber-100 text-amber-800 border-amber-300',
    'Harvest Ready': 'bg-green-600 text-white font-semibold border-green-700 shadow-sm animate-pulse',
    'Harvested': 'bg-slate-200 text-slate-800 border-slate-300',

    // Financial
    Paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Purchase: 'bg-rose-50 text-rose-700 border-rose-200',
    Sale: 'bg-emerald-50 text-emerald-700 border-emerald-200',

    // Roles
    admin: 'bg-emerald-800 text-white border-emerald-900',
    staff: 'bg-emerald-100 text-emerald-900 border-emerald-300',

    // Fallback
    default: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const style = variantMap[variant] || variantMap.default;

  return (
    <span className={`inline-flex items-center rounded-full border ${style} ${sizeClasses[size]}`}>
      {children}
    </span>
  );
}

