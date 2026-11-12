import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Layers
} from 'lucide-react';
import { transactionService } from '../services/transactionService';
import { Badge } from '../components/Badge';
import { ReceiptModal } from '../components/ReceiptModal';
import { CROP_CATEGORIES } from '../services/cropService';

export function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Voucher modal
  const [selectedTx, setSelectedTx] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const loadTransactions = async () => {
    setLoading(true);
    const data = await transactionService.getAllTransactions();
    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleOpenReceipt = (tx) => {
    setSelectedTx(tx);
    setIsReceiptOpen(true);
  };

  const filtered = transactions.filter(t => {
    const matchType = filterType === 'All' || t.type === filterType;
    const matchCat = filterCategory === 'All' || t.category === filterCategory;
    const matchSearch = t.reference_no.toLowerCase().includes(search.toLowerCase()) ||
                        t.entity_name?.toLowerCase().includes(search.toLowerCase()) ||
                        t.variety.toLowerCase().includes(search.toLowerCase());
    return matchType && matchCat && matchSearch;
  });

  const totalInflows = filtered
    .filter(t => t.type === 'Sale')
    .reduce((acc, t) => acc + (parseFloat(t.total_amount) || 0), 0);

  const totalOutflows = filtered
    .filter(t => t.type === 'Purchase')
    .reduce((acc, t) => acc + (parseFloat(t.total_amount) || 0), 0);

  const netBalance = totalInflows - totalOutflows;

  const exportCSV = () => {
    const headers = ['Reference No', 'Type', 'Party', 'Commodity', 'Variety', 'Quantity (kg)', 'Price/kg', 'Total (PHP)', 'Status', 'Method', 'Date'];
    const rows = filtered.map(t => [
      t.reference_no,
      t.type,
      `"${t.entity_name}"`,
      t.category,
      `"${t.variety}"`,
      t.quantity_kg,
      t.price_per_kg,
      t.total_amount,
      t.payment_status,
      t.payment_method,
      t.date
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AGRI_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Consolidated Transaction History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Unified chronological ledger of all agricultural procurements and sales
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-xs"
        >
          <Download className="w-4 h-4 text-slate-500" />
          Export Ledger (CSV)
        </button>
      </div>

      {/* Financial Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-rose-600 font-semibold mb-1">
            <span>Total Procurements (Outflows)</span>
            <ArrowDownRight className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">
            ₱{totalOutflows.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500">Disbursed to farmers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mb-1">
            <span>Total Sales Revenue (Inflows)</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-800">
            ₱{totalInflows.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500">From commercial buyers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold">Net Trade Balance</span>
          <p className={`text-2xl font-bold font-mono mt-1 ${netBalance >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            ₱{netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500">Filtered ledger balance</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reference #, farmer, buyer, variety..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
          >
            <option value="All">All Types (Purchases & Sales)</option>
            <option value="Purchase">Purchases (Expenses)</option>
            <option value="Sale">Sales (Revenues)</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
          >
            <option value="All">All Commodities</option>
            {CROP_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5 text-left">Date & Reference</th>
                <th className="px-5 py-3.5 text-left">Transaction Type</th>
                <th className="px-5 py-3.5 text-left">Entity (Farmer / Buyer)</th>
                <th className="px-5 py-3.5 text-left">Commodity</th>
                <th className="px-5 py-3.5 text-right">Quantity</th>
                <th className="px-5 py-3.5 text-right">Price / kg</th>
                <th className="px-5 py-3.5 text-right">Total (₱)</th>
                <th className="px-5 py-3.5 text-center">Payment</th>
                <th className="px-5 py-3.5 text-right">Voucher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No transactions match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-bold text-slate-900 block">{t.reference_no}</span>
                      <span className="text-[11px] text-slate-400">{t.date}</span>
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant={t.type} size="sm">
                        {t.type}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-xs font-semibold text-slate-800">
                      {t.entity_name}
                    </td>

                    <td className="px-5 py-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={t.category} size="sm">
                          {t.category}
                        </Badge>
                        <span className="font-medium text-slate-700">{t.variety}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right font-mono text-xs text-slate-700">
                      {Number(t.quantity_kg).toLocaleString()} kg
                    </td>

                    <td className="px-5 py-4 text-right font-mono text-xs text-slate-700">
                      ₱{Number(t.price_per_kg).toFixed(2)}
                    </td>

                    <td className="px-5 py-4 text-right font-mono text-xs font-bold">
                      <span className={t.type === 'Sale' ? 'text-emerald-800' : 'text-slate-900'}>
                        {t.type === 'Sale' ? '+' : '-'}₱{Number(t.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <Badge variant={t.payment_status} size="sm">
                        {t.payment_status}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleOpenReceipt(t)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                        title="Print / View Voucher"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECEIPT MODAL */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        data={selectedTx}
      />
    </div>
  );
}

