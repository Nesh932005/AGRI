import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sprout, 
  Boxes, 
  TrendingUp, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  FileText,
  AlertTriangle,
  Wheat,
  Calendar,
  Sparkles
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { farmerService } from '../services/farmerService';
import { cropService } from '../services/cropService';
import { inventoryService } from '../services/inventoryService';
import { transactionService } from '../services/transactionService';

export function Dashboard({ onNavigate }) {
  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
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
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute metrics
  const totalFarmers = farmers.length;
  const totalPlantedArea = crops.reduce((acc, c) => acc + (parseFloat(c.area_ha) || 0), 0);
  const totalHarvestedYield = crops.reduce((acc, c) => acc + (parseFloat(c.actual_yield_kg) || 0), 0);
  const totalStockKg = inventory.reduce((acc, i) => acc + (parseFloat(i.current_stock_kg) || 0), 0);

  const totalPurchases = transactions
    .filter(t => t.type === 'Purchase')
    .reduce((acc, t) => acc + (parseFloat(t.total_amount) || 0), 0);

  const totalSales = transactions
    .filter(t => t.type === 'Sale')
    .reduce((acc, t) => acc + (parseFloat(t.total_amount) || 0), 0);

  const netBalance = totalSales - totalPurchases;

  // Breakdown by category
  const categories = ['Rice', 'Corn', 'Vegetables', 'Fruits'];
  const categoryStats = categories.map(cat => {
    const catCrops = crops.filter(c => c.category === cat);
    const catArea = catCrops.reduce((acc, c) => acc + (parseFloat(c.area_ha) || 0), 0);
    const catStock = inventory
      .filter(i => i.category === cat)
      .reduce((acc, i) => acc + (parseFloat(i.current_stock_kg) || 0), 0);
    return { name: cat, area: catArea, stock: catStock, count: catCrops.length };
  });

  const harvestReadyCrops = crops.filter(c => c.growth_stage === 'Harvest Ready');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Municipal Agricultural Monitoring & Trading
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back to AGRI Operations
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Track real-time farmer fields, crop growth across Rice, Corn, Vegetables & Fruits, automated inventory silos, and municipal harvest trading.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('farmers')}
              className="px-4 py-2.5 bg-white text-emerald-900 rounded-xl font-semibold text-xs hover:bg-emerald-50 transition shadow-sm flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-emerald-700" />
              Register Farmer
            </button>
            <button
              onClick={() => onNavigate('purchasing')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs transition shadow-sm flex items-center gap-2 border border-emerald-500/50"
            >
              <ShoppingBag className="w-4 h-4" />
              Buy Harvest
            </button>
            <button
              onClick={() => onNavigate('sales')}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-semibold text-xs transition shadow-sm flex items-center gap-2 border border-emerald-500/50"
            >
              <TrendingUp className="w-4 h-4" />
              Sell Crop Stock
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Farmers"
          value={totalFarmers}
          change="+12%"
          icon={Users}
          color="emerald"
          description="Registered agricultural producers"
        />
        <StatCard
          title="Monitored Area"
          value={`${totalPlantedArea.toFixed(1)} ha`}
          change="+4.5 ha"
          icon={Sprout}
          color="emerald"
          description="Under active crop monitoring"
        />
        <StatCard
          title="Inventory in Silos"
          value={`${(totalStockKg / 1000).toFixed(1)} tons`}
          change={`${totalStockKg.toLocaleString()} kg`}
          icon={Boxes}
          color="blue"
          description="Ready for distribution/sale"
        />
        <StatCard
          title="Net Trade Balance"
          value={`₱${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          change={netBalance >= 0 ? `+₱${netBalance.toLocaleString()}` : `-₱${Math.abs(netBalance).toLocaleString()}`}
          icon={TrendingUp}
          color={netBalance >= 0 ? 'emerald' : 'rose'}
          description="Sales Revenue minus Procurement"
        />
      </div>

      {/* Harvest Alert Banner if crops are Harvest Ready */}
      {harvestReadyCrops.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                {harvestReadyCrops.length} Crop Batch{harvestReadyCrops.length > 1 ? 'es' : ''} Ready for Harvest!
              </h4>
              <p className="text-xs text-amber-700">
                {harvestReadyCrops.map(c => `${c.farmer_name} (${c.category} - ${c.variety})`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('crops')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition"
          >
            Review & Procure
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mid Section: Crop Category Distribution & Silo Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Crop Commodity Breakdown
              </h3>
              <p className="text-xs text-slate-500">Monitored hectares and available warehouse inventory</p>
            </div>
            <button
              onClick={() => onNavigate('crops')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              View All Crops <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categoryStats.map((item) => (
              <div 
                key={item.name}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-emerald-50/40 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={item.name} size="md">
                    {item.name}
                  </Badge>
                  <span className="text-xs font-mono font-semibold text-slate-600">
                    {item.count} Field{item.count !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Planted Area:</span>
                    <span className="font-semibold text-slate-800">{item.area.toFixed(1)} ha</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Stock in Silos:</span>
                    <span className="font-mono font-bold text-emerald-800">{item.stock.toLocaleString()} kg</span>
                  </div>
                </div>
                {/* Visual Bar */}
                <div className="mt-3 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(10, (item.stock / 15000) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Flow Summary (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Procurement & Sales Flow
            </h3>
            <p className="text-xs text-slate-500 mb-4">Trading activity to date</p>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100">
                <div className="flex items-center justify-between text-xs text-rose-700 font-semibold mb-1">
                  <span>Harvest Purchases (Inflow)</span>
                  <ArrowDownRight className="w-4 h-4 text-rose-600" />
                </div>
                <p className="text-lg font-bold font-mono text-rose-950">
                  ₱{totalPurchases.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-rose-600/80 mt-0.5">Paid to local registered farmers</p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mb-1">
                  <span>Crop Sales (Outflow)</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-lg font-bold font-mono text-emerald-950">
                  ₱{totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-emerald-600/80 mt-0.5">Wholesalers, retailers & markets</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigate('transactions')}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              Open Complete Ledger
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recent Trading Transactions
            </h3>
            <p className="text-xs text-slate-500">Live feed of purchases and market sales</p>
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            All Transactions <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase font-semibold text-slate-500">
                <th className="pb-3 pl-2">Reference</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Party (Farmer / Buyer)</th>
                <th className="pb-3">Commodity</th>
                <th className="pb-3 text-right">Quantity</th>
                <th className="pb-3 text-right">Total Amount</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 pl-2 font-mono text-xs font-bold text-slate-800">
                    {tx.reference_no}
                  </td>
                  <td className="py-3">
                    <Badge variant={tx.type} size="sm">
                      {tx.type}
                    </Badge>
                  </td>
                  <td className="py-3 font-medium text-slate-900 text-xs">
                    {tx.entity_name}
                  </td>
                  <td className="py-3 text-xs text-slate-700">
                    <span className="font-semibold text-emerald-800">[{tx.category}]</span> {tx.variety}
                  </td>
                  <td className="py-3 text-right font-mono text-xs text-slate-700">
                    {Number(tx.quantity_kg).toLocaleString()} kg
                  </td>
                  <td className="py-3 text-right font-mono text-xs font-bold text-slate-900">
                    ₱{Number(tx.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant={tx.payment_status} size="sm">
                      {tx.payment_status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

