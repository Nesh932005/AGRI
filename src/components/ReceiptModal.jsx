import React from 'react';
import { Modal } from './Modal';
import { Printer, CheckCircle, FileText } from 'lucide-react';

export function ReceiptModal({ isOpen, onClose, data }) {
  if (!data) return null;

  const isSale = data.type === 'Sale' || data.buyer_name;
  const title = isSale ? 'Official Sales Voucher' : 'Harvest Purchase Voucher';

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-xl">
      <div className="printable-voucher space-y-6">
        {/* Header Letterhead */}
        <div className="text-center pb-4 border-b border-emerald-100">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
              🌱
            </div>
          </div>
          <h2 className="text-base font-bold text-emerald-950 uppercase tracking-wide">
            Republic of the Philippines
          </h2>
          <h3 className="text-sm font-semibold text-emerald-800">
            Municipal Agriculture Office (MAO)
          </h3>
          <p className="text-xs text-slate-500">
            Agri-Trading, Post-Harvest & Food Security Division
          </p>
        </div>

        {/* Voucher Meta */}
        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/60 flex justify-between items-center text-sm">
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Reference No.</p>
            <p className="font-mono font-bold text-emerald-900 text-base">{data.reference_no}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-semibold">Date</p>
            <p className="font-medium text-slate-800">{data.purchase_date || data.sale_date || data.date}</p>
          </div>
        </div>

        {/* Party Details */}
        <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <p className="text-xs text-slate-500 font-medium">
              {isSale ? 'Buyer / Entity' : 'Registered Farmer'}
            </p>
            <p className="font-bold text-slate-900">{data.buyer_name || data.farmer_name || 'N/A'}</p>
            <p className="text-xs text-slate-500">{data.buyer_type || data.barangay || 'San Isidro'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">Payment Method & Status</p>
            <p className="font-semibold text-emerald-700">{data.payment_method} ({data.payment_status})</p>
            <p className="text-xs text-slate-500">Storage: {data.storage_location || 'Central Silo'}</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-emerald-800 text-white text-xs uppercase">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold">Crop & Variety</th>
                <th className="px-4 py-2.5 text-right font-semibold">Qty (kg)</th>
                <th className="px-4 py-2.5 text-right font-semibold">Price / kg</th>
                <th className="px-4 py-2.5 text-right font-semibold">Total (₱)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">
                  <span className="font-semibold text-emerald-800">[{data.category}]</span> {data.variety}
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-700">
                  {Number(data.quantity_kg).toLocaleString()} kg
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-700">
                  ₱{Number(data.price_per_kg).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-900">
                  ₱{Number(data.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Highlight */}
        <div className="flex justify-between items-center p-4 bg-emerald-900 text-white rounded-xl shadow-sm">
          <div>
            <span className="text-xs uppercase font-medium tracking-wide text-emerald-200">Grand Total Payable</span>
            <p className="text-xs text-emerald-200">VAT-Exempt Agricultural Primary Commodity</p>
          </div>
          <div className="text-2xl font-bold font-mono">
            ₱{Number(data.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-dashed border-slate-300 text-center text-xs">
          <div>
            <div className="border-b border-slate-400 mb-1 pb-4 text-slate-400 italic">Signature over printed name</div>
            <p className="font-semibold text-slate-700">{isSale ? 'Authorized Buyer' : 'Farmer / Seller'}</p>
          </div>
          <div>
            <div className="border-b border-slate-400 mb-1 pb-4 text-slate-400 italic">Signature over printed name</div>
            <p className="font-semibold text-slate-700">Municipal Agriculturist / Officer</p>
          </div>
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="no-print flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 text-sm font-medium transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 text-sm font-medium transition flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Official Voucher
          </button>
        </div>
      </div>
    </Modal>
  );
}

