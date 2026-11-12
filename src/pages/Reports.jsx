import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Printer, 
  Download, 
  TrendingUp, 
  Sprout, 
  Users, 
  Building2, 
  CheckCircle, 
  Calendar,
  FileCheck
} from 'lucide-react';
import { farmerService } from '../services/farmerService';
import { cropService, CROP_CATEGORIES } from '../services/cropService';
import { inventoryService } from '../services/inventoryService';
import { transactionService } from '../services/transactionService';
import { Badge } from '../components/Badge';

export function Reports() {
  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      const [f, c, inv, tx] = await Promise.all([
        farmerService.getAll(),
        cropService.getAll(),
        inventoryService.getAll(),
        transactionService.getAllTransactions()
      ]);
      setFarmers(f);
      setCrops(c);
      setInventory(inv);
      setTransactions(tx);
      setLoading(false);
    }
    loadAll();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Metrics computation
  const totalArea = crops.reduce((acc, c) => acc + (parseFloat(c.area_ha) || 0), 0);
  const totalActualYield = crops.reduce((acc, c) => acc + (parseFloat(c.actual_yield_kg) || 0), 0);
  const totalStock = inventory.reduce((acc, i) => acc + (parseFloat(i.current_stock_kg) || 0), 0);
  const totalInventoryValue = inventory.reduce(
    (acc, i) => acc + ((parseFloat(i.current_stock_kg) || 0) * (parseFloat(i.avg_unit_cost) || 0)), 
    0
  );

  const purchases = transactions.filter(t => t.type === 'Purchase');
  const sales = transactions.filter(t => t.type === 'Sale');

  const totalProcurementExpenses = purchases.reduce((acc, p) => acc + (parseFloat(p.total_amount) || 0), 0);
  const totalSalesRevenue = sales.reduce((acc, s) => acc + (parseFloat(s.total_amount) || 0), 0);
  const netTradeMargin = totalSalesRevenue - totalProcurementExpenses;

  // Commodity summary
  const commodityBreakdown = CROP_CATEGORIES.map(category => {
    const catCrops = crops.filter(c => c.category === category);
    const catArea = catCrops.reduce((acc, c) => acc + (parseFloat(c.area_ha) || 0), 0);
    const catYield = catCrops.reduce((acc, c) => acc + (parseFloat(c.actual_yield_kg) || 0), 0);
    const catStock = inventory.filter(i => i.category === category).reduce((acc, i) => acc + (parseFloat(i.current_stock_kg) || 0), 0);
    return {
      category,
      cropCount: catCrops.length,
      area: catArea,
      yield: catYield,
      stock: catStock
    };
  });

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Agricultural Reports & Analytics Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate and print official municipal production and financial balance sheets
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm shadow-emerald-800/20"
        >
          <Printer className="w-4 h-4" />
          Print Official Executive Report
        </button>
      </div>

      {/* PRINTABLE REPORT DOCUMENT */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-8">
        {/* Official Letterhead */}
        <div className="text-center pb-6 border-b border-emerald-900/20">
          <div className="w-14 h-14 bg-emerald-700 text-white rounded-2xl mx-auto flex items-center justify-center font-bold text-2xl shadow-md mb-2">
            🌱
          </div>
          <h2 className="text-base font-bold text-emerald-950 uppercase tracking-widest">
            Republic of the Philippines
          </h2>
          <h3 className="text-lg font-bold text-emerald-800">
            MUNICIPAL AGRICULTURE OFFICE (MAO)
          </h3>
          <p className="text-xs text-slate-500">
            Comprehensive Agricultural Production, Inventory Silo & Commodity Trading Report
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-900">
            <Calendar className="w-3.5 h-3.5" />
            <span>Reporting Period: Calendar Year 2026 (To Date)</span>
          </div>
        </div>

        {/* Executive KPI Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <span className="text-xs text-slate-500 font-semibold uppercase block">Active Farmers</span>
            <span className="text-2xl font-bold font-mono text-slate-900">{farmers.length}</span>
            <span className="text-[11px] text-emerald-700 block mt-0.5">Verified producers</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <span className="text-xs text-slate-500 font-semibold uppercase block">Monitored Area</span>
            <span className="text-2xl font-bold font-mono text-emerald-800">{totalArea.toFixed(1)} ha</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Across all barangays</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <span className="text-xs text-slate-500 font-semibold uppercase block">Silo Stock In-Store</span>
            <span className="text-2xl font-bold font-mono text-slate-900">{(totalStock / 1000).toFixed(1)} tons</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">{totalStock.toLocaleString()} kg stored</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <span className="text-xs text-slate-500 font-semibold uppercase block">Net Trade Surplus</span>
            <span className={`text-2xl font-bold font-mono ${netTradeMargin >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              ₱{netTradeMargin.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Procurement vs Sales</span>
          </div>
        </div>

        {/* Section 1: Commodity Production Performance */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Sprout className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              I. Commodity Production Breakdown (Rice, Corn, Vegetables, Fruits)
            </h3>
          </div>

          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-emerald-900 text-white text-xs uppercase">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold">Commodity Sector</th>
                <th className="px-4 py-2.5 text-center font-semibold">Active Fields</th>
                <th className="px-4 py-2.5 text-right font-semibold">Area (ha)</th>
                <th className="px-4 py-2.5 text-right font-semibold">Actual Harvest (kg)</th>
                <th className="px-4 py-2.5 text-right font-semibold">Current Stock (kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {commodityBreakdown.map((item) => (
                <tr key={item.category} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-900">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 mr-2" />
                    {item.category}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-slate-700">
                    {item.cropCount}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-700">
                    {item.area.toFixed(1)} ha
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-800">
                    {item.yield.toLocaleString()} kg
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    {item.stock.toLocaleString()} kg
                  </td>
                </tr>
              ))}
              <tr className="bg-emerald-50 font-bold text-emerald-950">
                <td className="px-4 py-3">Total Aggregate</td>
                <td className="px-4 py-3 text-center font-mono">{crops.length}</td>
                <td className="px-4 py-3 text-right font-mono">{totalArea.toFixed(1)} ha</td>
                <td className="px-4 py-3 text-right font-mono">{totalActualYield.toLocaleString()} kg</td>
                <td className="px-4 py-3 text-right font-mono">{totalStock.toLocaleString()} kg</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: Financial Trading Balance Sheet */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              II. Municipal Crop Procurement & Sales Balance Sheet
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Purchases summary */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60">
              <h4 className="text-xs font-bold uppercase text-slate-700 mb-3 flex items-center justify-between">
                <span>Farmer Procurement Disbursed</span>
                <span className="text-rose-600 font-mono font-bold">₱{totalProcurementExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </h4>
              <ul className="text-xs space-y-2">
                <li className="flex justify-between text-slate-600">
                  <span>Total Purchase Vouchers:</span>
                  <span className="font-semibold text-slate-900">{purchases.length} transactions</span>
                </li>
                <li className="flex justify-between text-slate-600">
                  <span>Procured Volume:</span>
                  <span className="font-semibold text-slate-900">
                    {purchases.reduce((acc, p) => acc + (parseFloat(p.quantity_kg) || 0), 0).toLocaleString()} kg
                  </span>
                </li>
                <li className="flex justify-between text-slate-600">
                  <span>Average Buying Price:</span>
                  <span className="font-semibold text-slate-900">
                    ₱{(totalProcurementExpenses / Math.max(1, purchases.reduce((acc, p) => acc + (parseFloat(p.quantity_kg) || 0), 0))).toFixed(2)}/kg
                  </span>
                </li>
              </ul>
            </div>

            {/* Sales summary */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60">
              <h4 className="text-xs font-bold uppercase text-slate-700 mb-3 flex items-center justify-between">
                <span>Commercial Sales Proceeds</span>
                <span className="text-emerald-700 font-mono font-bold">₱{totalSalesRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </h4>
              <ul className="text-xs space-y-2">
                <li className="flex justify-between text-slate-600">
                  <span>Total Sales Invoices:</span>
                  <span className="font-semibold text-slate-900">{sales.length} transactions</span>
                </li>
                <li className="flex justify-between text-slate-600">
                  <span>Dispatched Volume:</span>
                  <span className="font-semibold text-slate-900">
                    {sales.reduce((acc, s) => acc + (parseFloat(s.quantity_kg) || 0), 0).toLocaleString()} kg
                  </span>
                </li>
                <li className="flex justify-between text-slate-600">
                  <span>Average Realized Price:</span>
                  <span className="font-semibold text-slate-900">
                    ₱{(totalSalesRevenue / Math.max(1, sales.reduce((acc, s) => acc + (parseFloat(s.quantity_kg) || 0), 0))).toFixed(2)}/kg
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Signatory block */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-12 text-center text-xs">
          <div>
            <p className="text-slate-500 mb-6">Prepared and certified correct by:</p>
            <div className="border-b border-slate-800 pb-1 font-bold text-slate-900 text-sm">
              ROBERTO DELA CRUZ
            </div>
            <p className="text-slate-600 font-medium mt-1">Agricultural Extension & Trading Officer</p>
          </div>

          <div>
            <p className="text-slate-500 mb-6">Approved by:</p>
            <div className="border-b border-slate-800 pb-1 font-bold text-slate-900 text-sm">
              ENGR. MARIA ELENA SANTOS
            </div>
            <p className="text-slate-600 font-medium mt-1">Municipal Agriculturist / Department Head</p>
          </div>
        </div>
      </div>
    </div>
  );
}

