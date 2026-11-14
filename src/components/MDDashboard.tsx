import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  PackageCheck,
  Users,
  Calendar,
  Layers,
  ArrowUpRight,
  Plus,
  FileSpreadsheet,
  Clock,
  Flag,
  Trophy,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { useSales } from '../context/SalesContext';
import type { SaleItem } from '../types';
import { SalesTable } from './SalesTable';
import { LiveCycleBanner } from './LiveCycleClock';
import { StaffFillingOversightHub } from './StaffFillingOversightHub';
import { getStaffAvatarUrl } from '../utils/staffAvatars';

interface MDDashboardProps {
  onEditItem: (item: SaleItem) => void;
  onAddNewItem: () => void;
  onOpenResetPassword?: (username?: string) => void;
}

const LIGHT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export const MDDashboard: React.FC<MDDashboardProps> = ({
  onEditItem,
  onAddNewItem,
  onOpenResetPassword,
}) => {
  const { sales, reps, cycles, selectedCycleId, setSelectedCycleId, theme, deleteSaleItem } = useSales();
  const isDark = theme === 'dark';

  // Tab switcher for TRUE PAGE-FIT
  const [activeTab, setActiveTab] = useState<'analytics' | 'sheet' | 'cycle' | 'staff'>('analytics');

  // Master Sheet Staff Filter state
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('all');

  // Milestone Sprint Race Track vs Bar View toggle
  const [repChartMode, setRepChartMode] = useState<'race' | 'bars'>('race');

  const currentSales = useMemo(() => {
    if (selectedCycleId === 'all') return sales;
    return sales.filter((s) => s.cycleId === selectedCycleId);
  }, [sales, selectedCycleId]);

  const kpis = useMemo(() => {
    const totalRevenue = currentSales.reduce((acc, s) => acc + (s.overallAmount || 0), 0);
    const totalSell = currentSales.reduce((acc, s) => acc + (s.sellCost || 0), 0);
    const totalPur = currentSales.reduce((acc, s) => acc + (s.purCost || 0), 0);
    const totalLan = currentSales.reduce((acc, s) => acc + (s.lanCost || 0), 0);
    const totalBalance = currentSales.reduce((acc, s) => acc + (s.balance || 0), 0);
    const totalAdvance = currentSales.reduce((acc, s) => acc + (s.advanPay || 0), 0);

    const grossProfit = totalSell - totalPur - totalLan;
    const marginPct = totalSell > 0 ? ((grossProfit / totalSell) * 100).toFixed(1) : '0';

    const dispatchedCount = currentSales.filter((s) => 
      s.statusCategory === 'Dispatched' || s.statusCategory === 'Delivered / Saled'
    ).length;
    const pendingCount = currentSales.length - dispatchedCount;

    return {
      totalRevenue,
      totalSell,
      grossProfit,
      marginPct,
      totalBalance,
      totalAdvance,
      totalOrders: currentSales.length,
      dispatchedCount,
      pendingCount,
    };
  }, [currentSales]);

  const cycleTrendData = useMemo(() => {
    return cycles.map((c) => {
      const items = sales.filter((s) => s.cycleId === c.id);
      const revenue = items.reduce((acc, s) => acc + (s.overallAmount || 0), 0);
      const sell = items.reduce((acc, s) => acc + (s.sellCost || 0), 0);
      const cost = items.reduce((acc, s) => acc + (s.purCost || 0) + (s.lanCost || 0), 0);
      const profit = sell - cost;

      return {
        name: c.name.split('(')[0].trim(),
        cycle: `Cycle ${c.cycleNumber}`,
        revenue,
        profit,
        orders: items.length,
      };
    });
  }, [cycles, sales]);

  const repPerformanceData = useMemo(() => {
    const list = reps.map((rep) => {
      const repSales = currentSales.filter(
        (s) =>
          s.purchaserName.toLowerCase().trim() === rep.name.toLowerCase().trim() ||
          s.purchaserName.toLowerCase().trim() === rep.id.toLowerCase().trim()
      );
      const totalAmount = repSales.reduce((acc, s) => acc + (s.overallAmount || 0), 0);
      const profit = repSales.reduce(
        (acc, s) => acc + (s.sellCost || 0) - (s.purCost || 0) - (s.lanCost || 0),
        0
      );
      const target = rep.targetAmount || 100000;
      const pct = Math.round((totalAmount / target) * 100);
      const gap = Math.max(0, target - totalAmount);

      return {
        rep,
        name: rep.displayName,
        sales: totalAmount,
        profit,
        orders: repSales.length,
        target,
        pct,
        gap,
      };
    });

    return list.sort((a, b) => b.sales - a.sales);
  }, [reps, currentSales]);

  const topLeader = repPerformanceData[0];
  const runnersUp = repPerformanceData.slice(1, 3);

  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    currentSales.forEach((s) => {
      const cat = s.statusCategory || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [currentSales]);

  const regionBreakdown = useMemo(() => {
    const india = currentSales
      .filter((s) => s.region === 'India')
      .reduce((acc, s) => acc + s.overallAmount, 0);
    const exportAmt = currentSales
      .filter((s) => s.region === 'Export')
      .reduce((acc, s) => acc + s.overallAmount, 0);

    return [
      { name: '🇮🇳 India Domestic', value: india },
      { name: '✈️ Export Orders', value: exportAmt },
    ];
  }, [currentSales]);

  const activeCycle = useMemo(() => {
    if (selectedCycleId && selectedCycleId !== 'all') {
      const match = cycles.find((c) => c.id === selectedCycleId);
      if (match) return match;
    }
    return cycles.find((c) => c.isCurrent) || cycles[cycles.length - 1];
  }, [cycles, selectedCycleId]);

  return (
    <div className="h-full flex flex-col space-y-2.5 overflow-hidden">
      {/* Top MD Sub-Header with Page-Fit Tab Switcher - SLEEK BLACK BAR */}
      <div className="border border-slate-200 rounded-2xl px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 bg-white text-slate-900 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black leading-tight text-slate-900">
              Managing Director Executive Command
            </h2>
            <p className="text-xs mt-0.5 font-medium text-slate-500">
              10-Day Payment Analytics • Master Sales Oversight
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
          'bg-slate-100/90 border-slate-200'
        }`}>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? isDark
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white text-slate-900 shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span>Executive Charts</span>
          </button>
          <button
            onClick={() => setActiveTab('sheet')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'sheet'
                ? isDark
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-white text-slate-900 shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Master Sales Sheet</span>
          </button>
          <button
            onClick={() => setActiveTab('cycle')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'cycle'
                ? isDark
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-white text-slate-900 shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>10-Day Cycle Live Timer</span>
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'staff'
                ? isDark
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white text-slate-900 shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-purple-500" />
            <span>Staff Filling & Submissions</span>
            {sales.length > 0 && (
              <span className="px-1.5 py-0.2 rounded text-xs bg-purple-500/20 text-purple-700 font-mono font-bold">
                {sales.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* 10-Day Cycle Filter Dropdown for MD */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm ${
            'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              Cycle:
            </span>
            <select
              value={selectedCycleId}
              onChange={(e) => setSelectedCycleId(e.target.value)}
              className={`rounded px-2 py-0.5 text-xs sm:text-sm font-semibold cursor-pointer focus:outline-none border ${
                'bg-white border-slate-300 text-slate-800'
              }`}
            >
              <option value="all">All Cycles ({sales.length} rows)</option>
              {cycles.map((c) => {
                const count = sales.filter((s) => s.cycleId === c.id).length;
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          <button
            onClick={onAddNewItem}
            className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Sale</span>
          </button>
        </div>
      </div>

      {/* TAB 1: EXECUTIVE CHARTS & KPIS (Fits 100% on screen!) */}
      {activeTab === 'analytics' && (
        <div className="flex-1 flex flex-col space-y-2.5 overflow-y-auto pr-1">
          {/* 4 Compact Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            <div className={`p-4 rounded-2xl border shadow-md transition-colors duration-200 ${
              isDark ? 'bg-[#12141F] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className={`flex items-center justify-between text-xs font-bold uppercase ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <span>Total Overall Sales</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <p className={`text-2xl sm:text-3xl font-black mt-1 font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ₹{kpis.totalRevenue.toLocaleString('en-IN')}
              </p>
              <div className={`flex items-center gap-1.5 text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="text-emerald-600 font-bold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> {kpis.totalOrders} deals
                </span>
                <span>logged across staff</span>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border shadow-md transition-colors duration-200 ${
              isDark ? 'bg-[#12141F] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className={`flex items-center justify-between text-xs font-bold uppercase ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <span>Gross Profit & Margin</span>
                <TrendingUp className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1 font-mono tracking-tight">
                ₹{kpis.grossProfit.toLocaleString('en-IN')}
              </p>
              <div className={`flex items-center gap-1.5 text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className={`px-2 py-0.5 rounded font-bold font-mono text-xs ${
                  isDark ? 'bg-indigo-950/60 text-indigo-300' : 'bg-blue-50 text-blue-700'
                }`}>
                  {kpis.marginPct}% Margin
                </span>
                <span>Net of Costs</span>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border shadow-md transition-colors duration-200 ${
              isDark ? 'bg-[#12141F] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className={`flex items-center justify-between text-xs font-bold uppercase ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <span>Balance Receivable</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 font-mono tracking-tight">
                ₹{kpis.totalBalance.toLocaleString('en-IN')}
              </p>
              <div className={`flex items-center gap-1.5 text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className={`font-mono font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ₹{kpis.totalAdvance.toLocaleString('en-IN')}
                </span>
                <span>advance received</span>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border shadow-md transition-colors duration-200 ${
              isDark ? 'bg-[#12141F] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className={`flex items-center justify-between text-xs font-bold uppercase ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <span>Order Fulfillment</span>
                <PackageCheck className="w-4 h-4 text-teal-500" />
              </div>
              <p className={`text-2xl sm:text-3xl font-black mt-1 font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {kpis.dispatchedCount} / {kpis.totalOrders}
              </p>
              <div className={`flex items-center gap-1.5 text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="text-teal-600 font-bold">
                  {kpis.totalOrders > 0 ? Math.round((kpis.dispatchedCount / kpis.totalOrders) * 100) : 0}%
                </span>
                <span>dispatched • {kpis.pendingCount} pending</span>
              </div>
            </div>
          </div>

          {/* Row 1: Milestone Sprint & Sales Race Track (Image + Race) & Leader Spotlight */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 shrink-0">
            {/* Sales Rep Milestone Race Track */}
            <div className="lg:col-span-2 p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5 text-indigo-600" />
                    10-Day Milestone Sprint &amp; Sales Race Track
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Watch sales representatives race their profile photos toward the 100% quota finish line (🏁)
                  </p>
                </div>
                {/* View Mode Toggle: Race vs Classic Bars */}
                <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px]">
                  <button
                    onClick={() => setRepChartMode('race')}
                    className={`px-2 py-0.5 rounded font-bold transition-all flex items-center gap-1 ${
                      repChartMode === 'race'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🏁</span> Race Track
                  </button>
                  <button
                    onClick={() => setRepChartMode('bars')}
                    className={`px-2 py-0.5 rounded font-bold transition-all flex items-center gap-1 ${
                      repChartMode === 'bars'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>📊</span> Bar Chart
                  </button>
                </div>
              </div>

              {repChartMode === 'race' ? (
                /* The Image + Race Track Visualization */
                <div className="space-y-2 pt-0.5">
                  {repPerformanceData.map((item, idx) => {
                    const isFirst = idx === 0 && item.sales > 0;
                    const clampedPct = Math.min(100, Math.max(item.sales > 0 ? 5 : 0, item.pct));
                    const avatarSrc = getStaffAvatarUrl(item.name, reps) || item.rep.avatarUrl;

                    return (
                      <div
                        key={item.rep.id}
                        className="p-2 rounded-xl bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200/80 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-2">
                            {/* Rank Medal */}
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                idx === 0
                                  ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                                  : idx === 1
                                  ? 'bg-slate-200 text-slate-800'
                                  : idx === 2
                                  ? 'bg-amber-800/10 text-amber-900'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                            </span>

                            {/* Rep Name & Stats (Image is inside the race bar) */}
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{item.name}</span>
                              {isFirst && (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-0.5 shadow-2xs">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Sprint Leader
                                </span>
                              )}
                              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                                • {item.orders} {item.orders === 1 ? 'deal' : 'deals'} (Profit: ₹{item.profit.toLocaleString('en-IN')})
                              </span>
                            </div>
                          </div>

                          {/* Rupee Volume & Percentage Badge */}
                          <div className="flex items-center gap-2 text-right">
                            <span className="font-mono font-bold text-slate-900 text-xs">
                              ₹{item.sales.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              / ₹{(item.target / 1000).toFixed(0)}k
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                                item.pct >= 70
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.pct >= 20
                                  ? 'bg-blue-100 text-blue-800'
                                  : item.pct > 0
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {item.pct}%
                            </span>
                          </div>
                        </div>

                        {/* Interactive Race Lane with Avatar strictly INSIDE the bar */}
                        <div className="relative pt-1 pb-1">
                          <div className="relative h-11 sm:h-12 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200/90 shadow-inner flex items-center">
                            {/* Track Mileposts */}
                            <div className="absolute inset-0 flex justify-between px-3 text-[9px] font-black text-slate-400 select-none items-center pointer-events-none z-0">
                              <span className="flex items-center gap-1 text-slate-500 font-bold">🚩 START</span>
                              <span>25%</span>
                              <span>50%</span>
                              <span>75%</span>
                              <span className="text-amber-600 font-black">🏁 100% FINISH</span>
                            </div>

                            {/* Race Bar Fill with Racer Avatar INSIDE */}
                            <div
                              className={`h-full rounded-2xl transition-all duration-700 relative z-10 flex items-center justify-end pr-1.5 shadow-md ${
                                idx === 0
                                  ? 'bg-gradient-to-r from-amber-500/70 via-indigo-600 to-purple-600'
                                  : idx === 1
                                  ? 'bg-gradient-to-r from-blue-500/70 to-cyan-500'
                                  : 'bg-gradient-to-r from-emerald-500/70 to-teal-500'
                              }`}
                              style={{
                                width: `${Math.max(clampedPct, 8)}%`,
                                minWidth: '44px',
                              }}
                            >
                              {/* RACER AVATAR: Cleanly nestled INSIDE the track bar */}
                              <div className="relative shrink-0 flex items-center justify-center">
                                {avatarSrc ? (
                                  <img
                                    src={avatarSrc}
                                    alt={item.name}
                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 shadow-lg ring-2 ${
                                      idx === 0
                                        ? 'border-amber-300 ring-amber-500'
                                        : 'border-white ring-indigo-400'
                                    }`}
                                  />
                                ) : (
                                  <div
                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white shadow-lg ${
                                      item.rep.avatarColor || 'bg-slate-700'
                                    }`}
                                  >
                                    {item.name.slice(0, 1)}
                                  </div>
                                )}
                                {isFirst && (
                                  <span className="absolute -top-1.5 -right-1 text-xs drop-shadow-md select-none">
                                    👑
                                  </span>
                                )}
                                {item.sales > 0 && (
                                  <span className="absolute -bottom-1 -right-1 text-[8px] bg-amber-400 text-slate-950 font-black rounded-full px-1 shadow-xs select-none">
                                    ⚡
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Classic Bar Chart View */
                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={repPerformanceData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} />
                      <YAxis
                        stroke="#64748b"
                        tick={{ fontSize: 9 }}
                        tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderColor: '#e2e8f0',
                          borderRadius: '6px',
                          fontSize: '10px',
                        }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                      />
                      <Bar dataKey="sales" name="Sales (₹)" fill="#3b82f6" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                      <Bar dataKey="profit" name="Profit (₹)" fill="#10b981" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Right Column: Sprint Leader Spotlight & Market Split - CLEAN WHITE THEME */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-black tracking-tight text-slate-900">Sprint Leader Spotlight</h3>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    👑 10-Day Leader
                  </span>
                </div>

                {/* Champion Card */}
                {topLeader && (
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 border border-amber-300 relative overflow-hidden mb-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        {topLeader.rep.avatarUrl || getStaffAvatarUrl(topLeader.name, reps) ? (
                          <img
                            src={topLeader.rep.avatarUrl || getStaffAvatarUrl(topLeader.name, reps)}
                            alt={topLeader.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400 shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white text-lg font-bold">
                            {topLeader.name.slice(0, 2)}
                          </div>
                        )}
                        <span className="absolute -top-2 -right-1.5 text-base drop-shadow-sm">👑</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-slate-900 truncate flex items-center gap-1">
                          {topLeader.name}
                        </h4>
                        <p className="text-[10px] text-amber-700 font-medium">Rank #1 • Highest Sales</p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                          <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-mono">
                            ₹{topLeader.sales.toLocaleString('en-IN')}
                          </span>
                          <span className="text-slate-600">
                            Profit: <strong className="text-emerald-700 font-mono">₹{topLeader.profit.toLocaleString('en-IN')}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Contenders Strip */}
                <div className="space-y-1.5 mb-3">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Top Contenders</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {runnersUp.map((runner, i) => (
                      <div
                        key={runner.rep.id}
                        className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 shadow-2xs"
                      >
                        {runner.rep.avatarUrl || getStaffAvatarUrl(runner.name, reps) ? (
                          <img
                            src={runner.rep.avatarUrl || getStaffAvatarUrl(runner.name, reps)}
                            alt={runner.name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {runner.name.slice(0, 1)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold text-slate-800 truncate">
                            {runner.name.split(' ')[0]}
                          </div>
                          <div className="text-[9px] font-mono text-emerald-700 font-bold">
                            ₹{runner.sales.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <span className="text-[10px]">{i === 0 ? '🥈' : '🥉'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Geographic Split at Bottom */}
              <div className="border-t border-slate-200 pt-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                  <span>Market Geography</span>
                  <span className="text-slate-800 font-mono font-bold">Total: ₹{(kpis.totalRevenue / 1000).toFixed(0)}k</span>
                </div>
                {regionBreakdown.map((r, i) => {
                  const total = kpis.totalRevenue || 1;
                  const pct = Math.round((r.value / total) * 100);
                  return (
                    <div key={r.name} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-medium text-slate-600">{r.name}</span>
                        <span className="font-mono text-slate-900 font-bold">
                          ₹{r.value.toLocaleString('en-IN')} <span className="text-indigo-600">({pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            i === 0
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 2: Cycle Trends & Order Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 shrink-0">
            {/* Chart 1: 10-Day Cycle Trends Area Chart */}
            <div className="lg:col-span-2 p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    10-Day Cycle Performance Trends (₹)
                  </h3>
                  <p className="text-[10px] text-slate-400">Total sales vs gross profit across reporting windows</p>
                </div>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cycleTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mdRevLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="mdProfitLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                        borderRadius: '8px',
                        fontSize: '11px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Total Sales"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#mdRevLight)"
                      isAnimationActive={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      name="Gross Profit"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#mdProfitLight)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Order Status Donut */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <PackageCheck className="w-3.5 h-3.5 text-cyan-600" />
                  Order Status Breakdown
                </h3>
                <p className="text-[10px] text-slate-400">Current dispatch & fulfillment status</p>
              </div>

              <div className="h-32 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                      isAnimationActive={false}
                    >
                      {statusDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={LIGHT_COLORS[index % LIGHT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                        borderRadius: '6px',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap gap-1 border-t border-slate-100 pt-1.5 text-[9px]">
                {statusDistribution.map((s, idx) => (
                  <span key={s.name} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: LIGHT_COLORS[idx % LIGHT_COLORS.length] }}
                    />
                    <span className="text-slate-700">{s.name}: <strong>{s.value}</strong></span>
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MASTER SALES SPREADSHEET (Takes full remaining screen height!) */}
      {activeTab === 'sheet' && (
        <div className="flex-1 overflow-hidden flex flex-col gap-2">
          {/* Quick Staff Filter Bar for MD */}
          <div className={`px-3 py-1.5 rounded-xl border flex items-center justify-between gap-2 text-xs shrink-0 ${
            isDark ? 'bg-[#12141F] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-400" />
                Staff Filter:
              </span>
              <button
                onClick={() => setSelectedStaffFilter('all')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                  selectedStaffFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                All Company ({currentSales.length})
              </button>
              {reps.map((r) => {
                const count = currentSales.filter(
                  (s) =>
                    s.purchaserName.toLowerCase().trim() === r.name.toLowerCase().trim() ||
                    s.purchaserName.toLowerCase().trim() === r.displayName.toLowerCase().trim()
                ).length;
                const avatar = r.avatarUrl || getStaffAvatarUrl(r.name, reps);
                const isSelected = selectedStaffFilter === r.name.toLowerCase();

                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedStaffFilter(r.name.toLowerCase())}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-white/60 shrink-0 shadow-2xs bg-slate-800">
                      {avatar ? (
                        <img src={avatar} alt={r.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-700 text-white text-[9px] font-bold flex items-center justify-center">
                          {r.displayName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span>{r.displayName.split(' ')[0]}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono font-bold">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <SalesTable
              sales={
                selectedStaffFilter === 'all'
                  ? currentSales
                  : currentSales.filter((s) => s.purchaserName.toLowerCase() === selectedStaffFilter)
              }
              onEdit={onEditItem}
              onAddNew={onAddNewItem}
              title={
                selectedStaffFilter === 'all'
                  ? 'Company-Wide Master Sales Sheet'
                  : `${reps.find((r) => r.name.toLowerCase() === selectedStaffFilter)?.displayName || 'Staff'} Sales Records`
              }
              showRepColumn={true}
            />
          </div>
        </div>
      )}

      {/* TAB 3: STAFF FILLING & SUBMISSIONS OVERSIGHT HUB */}
      {activeTab === 'staff' && (
        <StaffFillingOversightHub
          reps={reps}
          sales={sales}
          onEditItem={onEditItem}
          onAddNewItem={onAddNewItem}
          onOpenResetPassword={onOpenResetPassword}
          isDark={isDark}
          deleteSaleItem={deleteSaleItem}
        />
      )}
      {/* TAB 4: 10-DAY CYCLE LIVE TIMER & DETAILS */}
      {activeTab === 'cycle' && (
        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-xs overflow-y-auto space-y-4">
          <LiveCycleBanner showNextNotice={true} />

          <div className="border-t border-slate-100 pt-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              10-Day Cycle Accounting Timeline & Revenue Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {cycles.map((c) => {
                const cSales = sales.filter((s) => s.cycleId === c.id);
                const cRev = cSales.reduce((acc, s) => acc + (s.overallAmount || 0), 0);
                const cProfit = cSales.reduce((acc, s) => acc + (s.sellCost || 0) - (s.purCost || 0) - (s.lanCost || 0), 0);
                const isSelected = c.id === activeCycle?.id;

                return (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-xl border transition ${
                      isSelected
                        ? 'bg-blue-50/50 border-blue-300 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900 text-xs">{c.name}</span>
                      {isSelected && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Active Period
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Dates: <strong>{c.startDate}</strong> to <strong>{c.endDate}</strong>
                    </p>
                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Sales Invoiced:</span>
                      <span className="font-bold font-mono text-slate-900">₹{cRev.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Gross Margin:</span>
                      <span className="font-bold font-mono text-emerald-700">₹{cProfit.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
