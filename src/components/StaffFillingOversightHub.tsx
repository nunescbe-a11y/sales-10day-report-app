import { getStaffAvatarUrl } from '../utils/staffAvatars';
import React, { useState, useMemo } from 'react';
import {
  Users,
  KeyRound,
  Eye,
  Plus,
  Search,
  ArrowLeft,
  FileSpreadsheet,
  Edit3,
  Trash2,
  Award
} from 'lucide-react';
import type { SalesRep, SaleItem } from '../types';
import { StatusBadge } from './StatusBadge';

interface StaffFillingOversightHubProps {
  reps: SalesRep[];
  sales: SaleItem[];
  onEditItem: (item: SaleItem) => void;
  onAddNewItem: () => void;
  onOpenResetPassword?: (username?: string) => void;
  isDark: boolean;
  deleteSaleItem: (id: string) => void;
}

export const StaffFillingOversightHub: React.FC<StaffFillingOversightHubProps> = ({
  reps,
  sales,
  onEditItem,
  onAddNewItem,
  onOpenResetPassword,
  isDark,
  deleteSaleItem,
}) => {
  const [inspectedRepId, setInspectedRepId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'drafts' | 'pending'>('all');

  // Compute metrics per staff
  const staffStats = useMemo(() => {
    return reps.map((rep) => {
      const repKey = rep.name.toLowerCase();
      const repIdKey = rep.id.toLowerCase();
      const repSales = sales
        .filter((s) => {
          const p = s.purchaserName.toLowerCase();
          return p === repKey || p === repIdKey || p.includes(repKey) || repKey.includes(p);
        })
        .sort((a, b) => (b.slNo || 0) - (a.slNo || 0));

      const completed = repSales.filter((s) => !s.isDraft);
      const drafts = repSales.filter((s) => s.isDraft);
      const totalOverall = repSales.reduce((acc, s) => acc + (s.overallAmount || 0), 0);
      const totalSelling = repSales.reduce((acc, s) => acc + (s.sellCost || 0), 0);
      const totalPurchase = repSales.reduce((acc, s) => acc + (s.purCost || 0), 0);
      const totalLanding = repSales.reduce((acc, s) => acc + (s.lanCost || 0), 0);
      const totalProfit = repSales.reduce(
        (acc, s) => acc + (s.sellCost || 0) - (s.purCost || 0) - (s.lanCost || 0),
        0
      );
      const totalAdvance = repSales.reduce((acc, s) => acc + (s.advanPay || 0), 0);
      const totalBalance = repSales.reduce((acc, s) => acc + (s.balance || 0), 0);
      const targetPct = Math.min(100, Math.round((totalOverall / (rep.targetAmount || 1)) * 100));
      const latestItem = repSales.length > 0 ? repSales[0] : null;

      return {
        rep,
        repSales,
        completedCount: completed.length,
        draftsCount: drafts.length,
        totalOverall,
        totalSelling,
        totalPurchase,
        totalLanding,
        totalProfit,
        totalAdvance,
        totalBalance,
        targetPct,
        latestItem,
        isActive: repSales.length > 0,
        hasDrafts: drafts.length > 0,
      };
    });
  }, [reps, sales]);

  // Overall Company Staff Overview
  const totalCompletedAcrossStaff = useMemo(() => sales.filter((s) => !s.isDraft).length, [sales]);
  const totalDraftsAcrossStaff = useMemo(() => sales.filter((s) => s.isDraft).length, [sales]);
  const totalSalesValue = useMemo(() => sales.reduce((acc, s) => acc + (s.overallAmount || 0), 0), [sales]);
  const totalProfitValue = useMemo(
    () => sales.reduce((acc, s) => acc + (s.sellCost || 0) - (s.purCost || 0) - (s.lanCost || 0), 0),
    [sales]
  );
  const activeSubmittersCount = useMemo(() => staffStats.filter((s) => s.isActive).length, [staffStats]);

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staffStats.filter((st) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        st.rep.displayName.toLowerCase().includes(q) ||
        st.rep.username.toLowerCase().includes(q) ||
        st.rep.email?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filterMode === 'active') return st.isActive;
      if (filterMode === 'drafts') return st.hasDrafts;
      if (filterMode === 'pending') return !st.isActive;
      return true;
    });
  }, [staffStats, searchQuery, filterMode]);

  // Inspected Rep data
  const currentInspected = useMemo(() => {
    if (!inspectedRepId) return null;
    return staffStats.find(
      (st) => st.rep.id === inspectedRepId || st.rep.name.toLowerCase() === inspectedRepId.toLowerCase()
    );
  }, [inspectedRepId, staffStats]);

  // --------------------------------------------------------------------------
  // VIEW 1: DETAILED INSPECTION OF A SINGLE STAFF MEMBER'S FILLED ROWS
  // --------------------------------------------------------------------------
  if (currentInspected) {
    const { rep, repSales, totalOverall, totalProfit, totalAdvance, totalBalance, targetPct, draftsCount } = currentInspected;

    return (
      <div className={`flex-1 h-full flex flex-col rounded-2xl border overflow-hidden transition-colors ${
        isDark ? 'bg-[#12141F] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header with Back Button & Quick Actions */}
        <div className={`p-3 sm:p-4 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
          isDark ? 'border-white/10 bg-[#0E1017]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setInspectedRepId(null)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isDark
                  ? 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-slate-200'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-2xs'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Staff Overview</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md shrink-0">
                {rep.avatarUrl || getStaffAvatarUrl(rep.name, reps) ? (
                  <img
                    src={rep.avatarUrl || getStaffAvatarUrl(rep.name, reps)}
                    alt={rep.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full ${rep.avatarColor} text-white font-extrabold text-base flex items-center justify-center`}>
                    {rep.displayName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {rep.displayName} • Staff Filling Submissions
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    repSales.length > 0
                      ? isDark ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isDark ? 'bg-zinc-800 text-slate-400 border-zinc-700' : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}>
                    {repSales.length} Total Filled
                  </span>
                  {draftsCount > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isDark ? 'bg-amber-950/60 text-amber-300 border-amber-800/60' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {draftsCount} Saved in Half (Draft)
                    </span>
                  )}
                </div>
                <p className={`text-[10px] mt-0.5 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Login User: <span className={isDark ? 'text-slate-300' : 'text-slate-800 font-semibold'}>{rep.username}</span> • Email: {rep.email || 'None'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenResetPassword?.(rep.username)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                isDark 
                  ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-slate-300' 
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-2xs'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span>Reset Password</span>
            </button>

            <button
              onClick={onAddNewItem}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Row for {rep.displayName.split(' ')[0]}</span>
            </button>
          </div>
        </div>

        {/* Staff Summary Metric Strip */}
        <div className={`p-3 border-b grid grid-cols-2 sm:grid-cols-5 gap-2.5 shrink-0 ${
          isDark ? 'border-white/5 bg-[#12141F]' : 'border-slate-200 bg-white'
        }`}>
          <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Revenue Filled</span>
            <p className="text-sm font-extrabold font-mono text-emerald-400 mt-0.5">₹{totalOverall.toLocaleString('en-IN')}</p>
          </div>
          <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Gross Profit</span>
            <p className="text-sm font-extrabold font-mono text-teal-400 mt-0.5">₹{totalProfit.toLocaleString('en-IN')}</p>
          </div>
          <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Advance Collected</span>
            <p className="text-sm font-extrabold font-mono text-blue-400 mt-0.5">₹{totalAdvance.toLocaleString('en-IN')}</p>
          </div>
          <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Balance Pending</span>
            <p className="text-sm font-extrabold font-mono text-amber-400 mt-0.5">₹{totalBalance.toLocaleString('en-IN')}</p>
          </div>
          <div className={`p-2.5 rounded-xl border col-span-2 sm:col-span-1 ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-400 uppercase font-semibold">10-Day Target</span>
              <span className="font-mono font-bold text-indigo-400">{targetPct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden mt-1.5">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${targetPct}%` }} />
            </div>
            <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">
              ₹{totalOverall.toLocaleString('en-IN')} / ₹{rep.targetAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Detailed Items Table Filled by this Staff Member */}
        <div className="flex-1 overflow-auto p-3">
          {repSales.length === 0 ? (
            <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-slate-400 mb-2">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">No sales rows filled yet by {rep.displayName}</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                When {rep.displayName} fills records in their workspace or saves drafts in half, they will appear here with full audit detail.
              </p>
              <button
                onClick={onAddNewItem}
                className="mt-4 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Row for {rep.displayName}</span>
              </button>
            </div>
          ) : (
            <div className="border border-white/10 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead className={`text-[10px] uppercase font-bold tracking-wider border-b ${
                  isDark ? 'bg-[#0E1017] text-slate-400 border-white/10' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <tr>
                    <th className="py-2.5 px-3">SL</th>
                    <th className="py-2.5 px-3">Inq / Pay Date</th>
                    <th className="py-2.5 px-3">Region</th>
                    <th className="py-2.5 px-3">Item / Description</th>
                    <th className="py-2.5 px-3">Company / Client</th>
                    <th className="py-2.5 px-3 text-right">Selling (₹)</th>
                    <th className="py-2.5 px-3 text-right">Advance (₹)</th>
                    <th className="py-2.5 px-3 text-right">Balance (₹)</th>
                    <th className="py-2.5 px-3 text-right">Gross Profit (₹)</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {repSales.map((item, idx) => {
                    const profit = (item.sellCost || 0) - (item.purCost || 0) - (item.lanCost || 0);

                    return (
                      <tr
                        key={item.id}
                        className={`transition hover:bg-white/5 ${
                          item.isDraft ? (isDark ? 'bg-amber-950/10' : 'bg-amber-50/40') : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{item.slNo || idx + 1}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="font-semibold">{item.inqDate || '—'}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{item.recPayDate || 'Pending'}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.region === 'Export'
                              ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                              : 'bg-blue-950/60 text-blue-300 border-blue-800/60'
                          }`}>
                            {item.region}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 max-w-[180px]">
                          <div className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`} title={item.item}>
                            {item.item || 'Untitled Draft'}
                          </div>
                          {item.notes && (
                            <p className="text-[10px] text-slate-400 truncate mt-0.5" title={item.notes}>
                              {item.notes}
                            </p>
                          )}
                        </td>
                        <td className="py-2.5 px-3 max-w-[140px] truncate" title={item.comName}>
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}>{item.comName || '—'}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-400">
                          ₹{Number(item.sellCost || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-blue-400">
                          ₹{Number(item.advanPay || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">
                          ₹{Number(item.balance || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                          ₹{Number(profit).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <StatusBadge status={item.itemStatus} />
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {item.isDraft ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Draft in Half
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Completed
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => onEditItem(item)}
                              title="Edit this sale row"
                              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete row "${item.item || 'Item'}" filled by ${rep.displayName}?`)) {
                                  deleteSaleItem(item.id);
                                }
                              }}
                              title="Delete this row"
                              className="p-1 rounded-lg bg-white/5 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW 2: EXECUTIVE ALL-STAFF FILLING COMMAND CENTER & LEADERBOARD
  // --------------------------------------------------------------------------
  return (
    <div className={`flex-1 h-full flex flex-col rounded-2xl border overflow-hidden transition-colors ${
      isDark ? 'bg-[#12141F] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Top Header */}
      <div className={`p-3 sm:p-4 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
        isDark ? 'border-white/10 bg-[#0E1017]' : 'border-slate-200 bg-slate-50'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Users className="w-4 h-4 text-purple-500" />
              Staff Accounts & Filling Submissions Monitor
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              isDark ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}>
              {activeSubmittersCount} of {reps.length} Active
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Audit what each staff member is filling in real-time, inspect saved drafts, and verify revenue targets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenResetPassword?.('md')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isDark 
                ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-slate-300' 
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-2xs'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>Reset MD Password</span>
          </button>
        </div>
      </div>

      {/* 4 Company-Wide Staff Oversight Metrics */}
      <div className={`p-3 border-b grid grid-cols-2 lg:grid-cols-4 gap-2.5 shrink-0 ${
        isDark ? 'border-white/5 bg-[#12141F]' : 'border-slate-200 bg-white'
      }`}>
        <div className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-slate-50 border-slate-200 shadow-2xs'}`}>
          <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Staff</span>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className={`text-lg font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{reps.length} Reps</span>
            <span className="text-[11px] text-emerald-600 font-semibold">{activeSubmittersCount} active</span>
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-slate-50 border-slate-200 shadow-2xs'}`}>
          <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Submissions</span>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-lg font-black font-mono text-indigo-600">{sales.length} Rows</span>
            <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {totalCompletedAcrossStaff} done • {totalDraftsAcrossStaff} drafts
            </span>
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-slate-50 border-slate-200 shadow-2xs'}`}>
          <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Value Filled</span>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-lg font-black font-mono text-emerald-600">₹{totalSalesValue.toLocaleString('en-IN')}</span>
            <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Overall</span>
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-slate-50 border-slate-200 shadow-2xs'}`}>
          <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Gross Profit</span>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-lg font-black font-mono text-teal-600">₹{totalProfitValue.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {totalSalesValue > 0 ? `${((totalProfitValue / totalSalesValue) * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-2.5 sm:p-3 border-b flex flex-wrap items-center justify-between gap-2.5 shrink-0 ${
        isDark ? 'border-white/5 bg-[#0E1017]/50' : 'border-slate-200 bg-slate-50'
      }`}>
        {/* Search */}
        <div className="relative min-w-[200px] flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff by name or username..."
            className={`w-full rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none border transition ${
              isDark 
                ? 'bg-[#18181F] border-white/10 text-white placeholder-slate-500 focus:border-purple-500/50' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 shadow-2xs'
            }`}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterMode === 'all'
                ? 'bg-purple-600 text-white shadow-xs'
                : isDark
                ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs'
            }`}
          >
            All Staff ({reps.length})
          </button>
          <button
            onClick={() => setFilterMode('active')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterMode === 'active'
                ? 'bg-emerald-600 text-white shadow-xs'
                : isDark
                ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs'
            }`}
          >
            Active Submitters ({activeSubmittersCount})
          </button>
          <button
            onClick={() => setFilterMode('drafts')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterMode === 'drafts'
                ? 'bg-amber-600 text-white shadow-xs'
                : isDark
                ? 'bg-white/5 hover:bg-white/10 text-slate-400'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs'
            }`}
          >
            Has Drafts
          </button>
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterMode === 'pending'
                ? 'bg-zinc-700 text-white shadow-xs'
                : 'bg-white/5 hover:bg-white/10 text-slate-400'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Main Staff Cards Grid & Activity Inspector */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredStaff.map((item) => {
            const { rep, repSales, totalOverall, totalProfit, totalAdvance, totalBalance, targetPct, draftsCount, latestItem, isActive } = item;

            return (
              <div
                key={rep.id}
                className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 shadow-md ${
                  isDark
                    ? 'bg-[#18181F]/80 hover:bg-[#1E1E28] border-white/5 hover:border-purple-500/40 shadow-black/40'
                    : 'bg-slate-50 hover:bg-white border-slate-200 shadow-slate-200'
                }`}
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md shrink-0">
                        {rep.avatarUrl || getStaffAvatarUrl(rep.name, reps) ? (
                          <img
                            src={rep.avatarUrl || getStaffAvatarUrl(rep.name, reps)}
                            alt={rep.displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full ${rep.avatarColor} text-white font-extrabold text-sm flex items-center justify-center`}>
                            {rep.displayName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>{rep.displayName}</h4>
                        <p className={`text-xs font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>@{rep.username}</p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    {isActive ? (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      }`}>
                        {repSales.length} Logged
                      </span>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        isDark ? 'bg-zinc-800 text-slate-400 border-zinc-700' : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}>
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Financial Grid */}
                  <div className={`mt-3 p-3 rounded-xl border grid grid-cols-2 gap-2.5 text-xs ${
                    isDark ? 'bg-black/30 border-white/5' : 'bg-white border-slate-200 shadow-2xs'
                  }`}>
                    <div>
                      <span className={`text-xs font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Sales</span>
                      <span className={`font-mono font-bold text-sm sm:text-base ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>₹{totalOverall.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className={`text-xs font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gross Profit</span>
                      <span className={`font-mono font-bold text-sm sm:text-base ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>₹{totalProfit.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className={`text-xs font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Advance</span>
                      <span className={`font-mono font-semibold text-xs sm:text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>₹{totalAdvance.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className={`text-xs font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Balance Due</span>
                      <span className={`font-mono font-semibold text-xs sm:text-sm ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>₹{totalBalance.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* 10-Day Target Quota Progress */}
                  <div className="mt-3">
                    <div className="flex justify-between items-center text-[10px] mb-1">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>10-Day Quota Target</span>
                      <span className={`font-mono font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{targetPct}%</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${targetPct}%` }}
                      />
                    </div>
                    <div className={`flex justify-between text-[9px] font-mono mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      <span>₹{totalOverall.toLocaleString('en-IN')}</span>
                      <span>Target: ₹{rep.targetAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Latest Activity Note */}
                  <div className={`mt-2.5 pt-2 border-t text-[10px] flex items-center justify-between ${
                    isDark ? 'border-white/5 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}>
                    <span className="truncate" title={latestItem?.item || 'None'}>
                      {latestItem ? `Latest: ${latestItem.item}` : 'No submissions yet'}
                    </span>
                    {draftsCount > 0 && (
                      <span className={`font-bold shrink-0 ml-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                        {draftsCount} Draft{draftsCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className={`pt-2 border-t flex items-center gap-1.5 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                  <button
                    onClick={() => setInspectedRepId(rep.id)}
                    className={`flex-1 py-1.5 px-2.5 border text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isDark
                        ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 border-purple-500/30 text-purple-200 hover:text-white'
                        : 'bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-purple-200 text-purple-700 shadow-2xs'
                    }`}
                  >
                    <Eye className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    <span>Inspect Rows ({repSales.length})</span>
                  </button>

                  <button
                    onClick={() => onOpenResetPassword?.(rep.username)}
                    title="Reset Password or PIN"
                    className={`p-1.5 rounded-xl border transition cursor-pointer ${
                      isDark 
                        ? 'border-white/10 hover:bg-white/10 text-slate-400 hover:text-white' 
                        : 'border-slate-300 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Executive Staff Submissions Comparison Matrix */}
        <div className={`mt-4 border rounded-2xl p-4 ${isDark ? 'bg-[#0E1017] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xs'}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Award className="w-4 h-4 text-amber-500" />
                Staff Submissions Comparison Matrix
              </h4>
              <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Side-by-side executive audit of items filled, revenue generated, and completion rates.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className={`text-[10px] uppercase font-bold border-b ${
                isDark ? 'text-slate-400 border-white/10' : 'text-slate-600 border-slate-200 bg-slate-50'
              }`}>
                <tr>
                  <th className="py-2 px-3">Staff Member</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-center">Items (Done / Draft)</th>
                  <th className="py-2 px-3 text-right">Total Revenue (₹)</th>
                  <th className="py-2 px-3 text-right">Advance Received (₹)</th>
                  <th className="py-2 px-3 text-right">Balance Due (₹)</th>
                  <th className="py-2 px-3 text-right">Gross Profit (₹)</th>
                  <th className="py-2 px-3">10-Day Target</th>
                  <th className="py-2 px-3 text-center">Audit</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                {staffStats.map((st) => (
                  <tr key={st.rep.id} className={`transition ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500 shrink-0 bg-slate-800 shadow-xs">
                          {st.rep.avatarUrl || getStaffAvatarUrl(st.rep.name, reps) ? (
                            <img
                              src={st.rep.avatarUrl || getStaffAvatarUrl(st.rep.name, reps)}
                              alt={st.rep.displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full ${st.rep.avatarColor} text-white font-bold text-xs flex items-center justify-center`}>
                              {st.rep.displayName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{st.rep.displayName}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">@{st.rep.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {st.isActive ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        }`}>
                          Active
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isDark ? 'bg-zinc-800 text-slate-400 border-zinc-700' : 'bg-slate-200 text-slate-600 border-slate-300'
                        }`}>
                          No Entries
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold">
                      <span className={isDark ? 'text-indigo-400' : 'text-indigo-600'}>{st.repSales.length}</span>
                      <span className={`text-[10px] font-normal ${isDark ? 'text-slate-500' : 'text-slate-500'}`}> ({st.completedCount} / {st.draftsCount})</span>
                    </td>
                    <td className={`py-2.5 px-3 text-right font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      ₹{st.totalOverall.toLocaleString('en-IN')}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-mono ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      ₹{st.totalAdvance.toLocaleString('en-IN')}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-mono font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      ₹{st.totalBalance.toLocaleString('en-IN')}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-mono font-bold ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
                      ₹{st.totalProfit.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-16 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}>
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{ width: `${st.targetPct}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{st.targetPct}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => setInspectedRepId(st.rep.id)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
