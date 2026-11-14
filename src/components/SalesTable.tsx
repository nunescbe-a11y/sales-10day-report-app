import React, { useState, useMemo } from 'react';
import { 
  Search, 

  Edit3, 
  Trash2, 
  Copy, 
  ArrowUpDown, 
  Building2, 
  FileSpreadsheet,
  Plus
} from 'lucide-react';
import type { SaleItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { useSales } from '../context/SalesContext';
import { getStaffAvatarUrl } from '../utils/staffAvatars';

interface SalesTableProps {
  sales: SaleItem[];
  onEdit: (item: SaleItem) => void;
  onAddNew: () => void;
  title?: string;
  showRepColumn?: boolean;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  onEdit,
  onAddNew,
  title = '10-Day Sales Data Sheet',
  showRepColumn = true,
}) => {
  const { deleteSaleItem, addSaleItem, reps, theme } = useSales();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState<'all' | 'India' | 'Export'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof SaleItem>('slNo');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const draftsCount = useMemo(() => sales.filter((s) => s.isDraft).length, [sales]);

  const filteredRecords = useMemo(() => {
    return sales
      .filter((s) => {
        const matchesSearch =
          s.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.comName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.purchaserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.itemStatus.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRegion = filterRegion === 'all' || s.region === filterRegion;
        const matchesStatus =
          filterStatus === 'all'
            ? true
            : filterStatus === 'drafts'
            ? s.isDraft === true
            : filterStatus === 'completed'
            ? !s.isDraft
            : s.statusCategory === filterStatus;

        return matchesSearch && matchesRegion && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') valA = (valA as string).toLowerCase();
        if (typeof valB === 'string') valB = (valB as string).toLowerCase();

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [sales, searchQuery, filterRegion, filterStatus, sortField, sortDirection]);

  const totals = useMemo(() => {
    return filteredRecords.reduce(
      (acc, curr) => ({
        purCost: acc.purCost + (curr.purCost || 0),
        lanCost: acc.lanCost + (curr.lanCost || 0),
        sellCost: acc.sellCost + (curr.sellCost || 0),
        advanPay: acc.advanPay + (curr.advanPay || 0),
        balance: acc.balance + (curr.balance || 0),
        packing: acc.packing + (curr.packingCharges || 0),
        forwarding: acc.forwarding + (curr.forwardingCharges || 0),
        overall: acc.overall + (curr.overallAmount || 0),
      }),
      { purCost: 0, lanCost: 0, sellCost: 0, advanPay: 0, balance: 0, packing: 0, forwarding: 0, overall: 0 }
    );
  }, [filteredRecords]);

  const handleSort = (field: keyof SaleItem) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDuplicate = (item: SaleItem) => {
    const { id, slNo, updatedAt, ...rest } = item;
    addSaleItem({
      ...rest,
      item: `${rest.item} (Copy)`,
    });
  };

  return (
    <div className={`h-full flex-1 border rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-0 transition-colors duration-200 ${
      isDark 
        ? 'bg-[#12141F] border-white/10 text-slate-100 shadow-black/40' 
        : 'bg-white border-slate-200 shadow-xs text-slate-900'
    }`}>
      {/* Table Toolbar - Compact */}
      <div className={`p-2.5 border-b flex flex-wrap items-center justify-between gap-2 shrink-0 ${
        isDark ? 'bg-[#161824] border-white/10' : 'bg-slate-50/70 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <h3 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {title}
          </h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
            isDark ? 'bg-zinc-800 text-slate-300' : 'bg-slate-200/80 text-slate-700'
          }`}>
            {filteredRecords.length} items
          </span>
          {draftsCount > 0 && (
            <button
              type="button"
              onClick={() => setFilterStatus(filterStatus === 'drafts' ? 'all' : 'drafts')}
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition cursor-pointer flex items-center gap-1 ${
                filterStatus === 'drafts'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                  : isDark
                  ? 'bg-amber-950/50 text-amber-300 border-amber-800/60 hover:bg-amber-900/60'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
              title="Click to toggle only half-filled / in-progress drafts"
            >
              <span>⏳ {draftsCount} Saved in Half (Draft)</span>
            </button>
          )}
        </div>

        {/* Filters and search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search item / company..."
              className={`border rounded-lg pl-8 pr-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44 ${
                isDark 
                  ? 'bg-[#0E1017] border-zinc-700 text-white placeholder-slate-500' 
                  : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>

          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value as any)}
            className={`border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
              isDark ? 'bg-[#0E1017] border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <option value="all">All Regions</option>
            <option value="India">🇮🇳 India</option>
            <option value="Export">✈️ Export</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium ${
              isDark ? 'bg-[#0E1017] border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <option value="all">All Statuses ({sales.length})</option>
            {draftsCount > 0 && (
              <option value="drafts">⏳ Drafts Only ({draftsCount})</option>
            )}
            <option value="completed">✓ Completed Only</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Pending Dispatch">Pending Dispatch</option>
            <option value="Delivered / Saled">Delivered / Saled</option>
            <option value="Partial Supply">Partial Supply</option>
            <option value="Order Placed">Order Placed</option>
          </select>

          

          <button
            onClick={onAddNew}
            className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm shadow-indigo-600/20 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>
      </div>

      {/* Table Container - Fits exact remaining viewport height */}
      <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead className={`sticky top-0 z-10 font-black border-b uppercase tracking-tight text-xs ${
            isDark ? 'bg-[#0E1017] text-slate-300 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            <tr className="whitespace-nowrap">
              <th
                onClick={() => handleSort('slNo')}
                className="py-2.5 px-3 cursor-pointer hover:text-indigo-600 text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>SL</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('inqDate')}
                className="py-2.5 px-3 cursor-pointer hover:text-indigo-600"
              >
                INQ DATE
              </th>
              <th
                onClick={() => handleSort('recPayDate')}
                className="py-2.5 px-3 cursor-pointer hover:text-indigo-600"
              >
                REC PAY DATE
              </th>
              <th className="py-2.5 px-2.5">REGION</th>
              <th
                onClick={() => handleSort('item')}
                className="py-2.5 px-3.5 min-w-[200px] cursor-pointer hover:text-indigo-600"
              >
                ITEM
              </th>
              <th
                onClick={() => handleSort('comName')}
                className="py-2.5 px-3.5 min-w-[170px] cursor-pointer hover:text-indigo-600"
              >
                COM NAME
              </th>
              {showRepColumn && <th className="py-2.5 px-3 min-w-[150px]">Purchaser</th>}
              <th className="py-2.5 px-3 text-right" title="Purchase Cost (PUR COS)">
                <div>PURCHASE COST</div>
                <div className="text-[9px] font-medium text-slate-400 tracking-wider">PUR COS</div>
              </th>
              <th className="py-2.5 px-2.5 text-right" title="Landing Cost (LAN COST)">
                <div>LANDING COST</div>
                <div className="text-[9px] font-medium text-slate-400 tracking-wider">LAN COST</div>
              </th>
              <th
                onClick={() => handleSort('sellCost')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-indigo-600 text-indigo-700 font-bold"
                title="Selling Cost (SELL COST)"
              >
                <div>SELLING COST</div>
                <div className="text-[9px] font-medium text-indigo-500 tracking-wider">SELL COST</div>
              </th>
              <th className="py-2.5 px-3 text-right" title="Advance Payment (Advan Pay)">
                <div>ADVANCE PAYMENT</div>
                <div className="text-[9px] font-medium text-slate-400 tracking-wider">Advan Pay</div>
              </th>
              <th className="py-2.5 px-3 text-right text-amber-700 font-bold">Balance</th>
              <th className="py-2.5 px-2 text-right">Pck</th>
              <th className="py-2.5 px-2 text-right">Fwd</th>
              <th className="py-2.5 px-2 text-center">GST</th>
              <th
                onClick={() => handleSort('overallAmount')}
                className="py-2.5 px-3.5 text-right text-emerald-700 font-black cursor-pointer hover:text-emerald-800"
              >
                OVER ALL AMOU
              </th>
              <th className="py-2.5 px-3 min-w-[170px]">ITEM STATUS</th>
              <th className="py-2.5 px-2.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-slate-100'}`}>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={18} className="py-8 text-center text-slate-400">
                  <p className="text-sm font-semibold">No records found for current filter.</p>
                </td>
              </tr>
            ) : (
              filteredRecords.map((item, index) => {
                const rep = reps.find(
                  (r) =>
                    r.name.toLowerCase() === item.purchaserName.toLowerCase() ||
                    r.displayName.toLowerCase() === item.purchaserName.toLowerCase()
                );
                const avatarUrl = rep?.avatarUrl || getStaffAvatarUrl(item.purchaserName, reps);

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isDark
                        ? index % 2 === 0
                          ? 'bg-[#12141F] hover:bg-indigo-950/40 text-slate-200'
                          : 'bg-[#151824] hover:bg-indigo-950/40 text-slate-200'
                        : index % 2 === 0
                        ? 'bg-white hover:bg-indigo-50/50 text-slate-900'
                        : 'bg-slate-50/60 hover:bg-indigo-50/50 text-slate-900'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono text-slate-500 text-center font-bold text-xs sm:text-sm">
                      {item.slNo}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap text-xs sm:text-sm">
                      {item.inqDate ? item.inqDate.split('-').reverse().join('/') : '-'}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap text-xs sm:text-sm">
                      {item.recPayDate ? item.recPayDate.split('-').reverse().join('/') : '-'}
                    </td>

                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          item.region === 'Export'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.region === 'Export' ? '✈️ Export' : '🇮🇳 India'}
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5 font-bold text-slate-900 text-xs sm:text-sm max-w-[220px]">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate" title={item.item}>
                          {item.item}
                        </span>
                        {item.isDraft && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            ⏳ Draft
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 text-slate-700 text-xs sm:text-sm max-w-[190px]">
                      <div className="flex items-center gap-1.5 truncate" title={item.comName}>
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate font-medium">{item.comName}</span>
                      </div>
                    </td>

                    {showRepColumn && (
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500 shadow-xs ring-1 ring-white/60 shrink-0 bg-slate-800">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt={item.purchaserName}
                                className="w-full h-full object-cover block"
                              />
                            ) : (
                              <div
                                className={`w-full h-full ${
                                  rep?.avatarColor || 'bg-indigo-600'
                                } flex items-center justify-center text-white text-xs font-bold`}
                              >
                                {item.purchaserName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className={`capitalize font-bold text-xs sm:text-sm block leading-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                              {rep?.displayName || item.purchaserName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              @{item.purchaserName.toLowerCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                    )}

                    <td className="py-2.5 px-3 text-right font-mono text-slate-700 text-xs sm:text-sm">
                      {item.purCost > 0 ? `₹${item.purCost.toLocaleString('en-IN')}` : '-'}
                    </td>

                    <td className="py-2.5 px-2.5 text-right font-mono text-slate-600 text-xs sm:text-sm">
                      {item.lanCost > 0 ? `₹${item.lanCost.toLocaleString('en-IN')}` : '-'}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono font-black text-indigo-700 text-xs sm:text-sm">
                      ₹{item.sellCost.toLocaleString('en-IN')}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono text-slate-700 text-xs sm:text-sm">
                      {item.advanPay > 0 ? `₹${item.advanPay.toLocaleString('en-IN')}` : '-'}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono font-black text-amber-600 text-xs sm:text-sm">
                      {item.balance > 0 ? `₹${item.balance.toLocaleString('en-IN')}` : '₹0'}
                    </td>

                    <td className="py-2.5 px-2 text-right font-mono text-slate-600 text-xs sm:text-sm">
                      {item.packingCharges > 0 ? `₹${item.packingCharges}` : '-'}
                    </td>

                    <td className="py-2.5 px-2 text-right font-mono text-slate-600 text-xs sm:text-sm">
                      {item.forwardingCharges > 0 ? `₹${item.forwardingCharges}` : '-'}
                    </td>

                    <td className="py-2.5 px-2 text-center text-slate-600 font-mono text-xs sm:text-sm">
                      {item.gst}%
                    </td>

                    <td className="py-2.5 px-3.5 text-right font-mono font-black text-emerald-700 text-xs sm:text-sm whitespace-nowrap">
                      ₹{item.overallAmount.toLocaleString('en-IN')}
                    </td>

                  <td className="py-2 px-3">
                    <StatusBadge status={item.itemStatus} category={item.statusCategory} isDraft={item.isDraft} />
                  </td>

                  <td className="py-2 px-2 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {item.isDraft ? (
                        <button
                          onClick={() => onEdit(item)}
                          title="Reopen and complete this half-filled draft"
                          className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center gap-1 border border-amber-300 transition cursor-pointer shadow-2xs"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>Reopen & Edit</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onEdit(item)}
                          title="Edit row"
                          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDuplicate(item)}
                        title="Duplicate row"
                        className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete item "${item.item}"?`)) {
                            deleteSaleItem(item.id);
                          }
                        }}
                        title="Delete row"
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>

          {/* Sticky Footer Summary */}
          {filteredRecords.length > 0 && (
            <tfoot className={`sticky bottom-0 z-10 font-bold border-t-2 text-[11px] whitespace-nowrap ${
              isDark 
                ? 'bg-[#0E1017] text-white border-zinc-700 shadow-md' 
                : 'bg-slate-100 text-slate-800 border-slate-300'
            }`}>
              <tr>
                <td colSpan={4} className="py-2.5 px-2.5 text-right uppercase text-slate-600 font-bold">
                  Total Summary:
                </td>
                <td className="py-2.5 px-3 font-normal text-slate-600">
                  {new Set(filteredRecords.map((f) => f.item)).size} items
                </td>
                <td className="py-2.5 px-3 font-normal text-slate-600">
                  {new Set(filteredRecords.map((f) => f.comName)).size} companies
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono text-slate-700">
                  ₹{totals.purCost.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-slate-600">
                  ₹{totals.lanCost.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono text-indigo-700 font-black">
                  ₹{totals.sellCost.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono text-slate-700">
                  ₹{totals.advanPay.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono text-amber-700 font-black">
                  ₹{totals.balance.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 px-1.5 text-right font-mono text-slate-600">
                  ₹{totals.packing.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 px-1.5 text-right font-mono text-slate-600">
                  ₹{totals.forwarding.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 px-1.5 text-center text-slate-400">-</td>
                <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-700 text-xs">
                  ₹{totals.overall.toLocaleString('en-IN')}
                </td>
                {showRepColumn && <td className="py-2.5 px-2.5"></td>}
                <td colSpan={2} className="py-2.5 px-3 text-slate-700 font-semibold">
                  Profit: ₹{(totals.sellCost - totals.purCost - totals.lanCost).toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
