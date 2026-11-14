import { getStaffAvatarUrl } from '../utils/staffAvatars';
import { SmartFormUploader } from './SmartFormUploader';
import type { ParsedSaleData } from '../utils/formAutoParser';
import React, { useState, useMemo } from 'react';
import {
  Plus,
  Send,
  CheckCircle2,
  Calendar,
  Sparkles,
  Calculator,
  FileSpreadsheet,
  Check,
  Tag,
  Building2,
  Save,
  Edit3
} from 'lucide-react';
import { useSales } from '../context/SalesContext';
import type { SaleItem, RegionType, StatusCategory } from '../types';
import { SalesTable } from './SalesTable';
import { StatusSelector } from './StatusSelector';
import { LiveCycleBanner } from './LiveCycleClock';

interface SalesRepViewProps {
  onEditItem: (item: SaleItem) => void;
  onAddNewItem?: () => void;
  onOpenCycleManager?: () => void;
}

export const SalesRepView: React.FC<SalesRepViewProps> = ({
  onEditItem: _onEditItem,
  onAddNewItem: _onAddNewItem,
  onOpenCycleManager,
}) => {
  const {
    activeRep,
    currentRole,
    getFilteredSales,
    selectedCycleId,
    setSelectedCycleId,
    cycles,
    addSaleItem,
    updateSaleItem,
    triggerCelebration,
    reps,
    theme,
  } = useSales();

  const isDark = theme === 'dark';

  // Tab switcher for employee filling & page-fit
  const [activeTab, setActiveTab] = useState<'sheet' | 'fill' | 'target'>('sheet');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [draftToast, setDraftToast] = useState<string>('');

  // Dedicated Form State for Employee Filling
  const today = new Date().toISOString().split('T')[0];
  const [inqDate, setInqDate] = useState<string>(today);
  const [recPayDate, setRecPayDate] = useState<string>(today);
  const [region, setRegion] = useState<RegionType>('India');
  const [item, setItem] = useState<string>('');
  const [comName, setComName] = useState<string>('');
  const [purCost, setPurCost] = useState<number | ''>('');
  const [lanCost, setLanCost] = useState<number | ''>(0);
  const [sellCost, setSellCost] = useState<number | ''>('');
  const [advanPay, setAdvanPay] = useState<number | ''>('');
  const [packingCharges, setPackingCharges] = useState<number | ''>(0);
  const [forwardingCharges, setForwardingCharges] = useState<number | ''>(0);
  const [gst, setGst] = useState<number>(18);
  const [itemStatus, setItemStatus] = useState<string>('Item dispatched by supplier');
  const [statusCategory, setStatusCategory] = useState<StatusCategory>('Dispatched');

  // Manual Override State for Computed Fields (Over All Amou, Balance, Gross Profit)
  const [isOverallOverridden, setIsOverallOverridden] = useState(false);
  const [manualOverall, setManualOverall] = useState<number | ''>('');

  const [isBalanceOverridden, setIsBalanceOverridden] = useState(false);
  const [manualBalance, setManualBalance] = useState<number | ''>('');

  const [isProfitOverridden, setIsProfitOverridden] = useState(false);
  const [manualProfit, setManualProfit] = useState<number | ''>('');

  const [isGstAmountOverridden, setIsGstAmountOverridden] = useState(false);
  const [manualGstAmount, setManualGstAmount] = useState<number | ''>('');

  const handleApplyParsedData = (data: ParsedSaleData) => {
    if (data.item) setItem(data.item);
    if (data.comName) setComName(data.comName);
    if (data.purCost !== undefined) setPurCost(data.purCost);
    if (data.lanCost !== undefined) setLanCost(data.lanCost);
    if (data.sellCost !== undefined) setSellCost(data.sellCost);
    if (data.advanPay !== undefined) setAdvanPay(data.advanPay);
    if (data.packingCharges !== undefined) setPackingCharges(data.packingCharges);
    if (data.forwardingCharges !== undefined) setForwardingCharges(data.forwardingCharges);
    if (data.gst !== undefined) setGst(data.gst);
    if (data.inqDate) setInqDate(data.inqDate);
    if (data.recPayDate) setRecPayDate(data.recPayDate);
    if (data.itemStatus) setItemStatus(data.itemStatus);
    if (data.statusCategory) setStatusCategory(data.statusCategory);
    if (data.region) setRegion(data.region);
  };

  const handleBulkImportRows = (rows: ParsedSaleData[]) => {
    const targetCycle = selectedCycleId !== 'all' ? selectedCycleId : (cycles.find((c) => c.isCurrent)?.id || cycles[0]?.id || '2026-11-C2');
    for (const r of rows) {
      const sell = r.sellCost || 0;
      const pur = r.purCost || 0;
      const lan = r.lanCost || 0;
      const pack = r.packingCharges || 0;
      const fwd = r.forwardingCharges || 0;
      const adv = r.advanPay || 0;
      const g = r.gst || 18;
      const gstAmt = Math.round(sell * (g / 100));
      const overall = Math.round(sell + gstAmt + pack + fwd);
      const bal = Math.max(0, overall - adv);
      const profit = sell - pur - lan;

      const todayStr = new Date().toISOString().split('T')[0];
      addSaleItem({
        inqDate: r.inqDate || inqDate || todayStr,
        recPayDate: r.recPayDate || recPayDate || todayStr,
        item: r.item || 'Imported Sale',
        comName: r.comName || 'Customer',
        purCost: pur,
        lanCost: lan,
        sellCost: sell,
        advanPay: adv,
        packingCharges: pack,
        forwardingCharges: fwd,
        gst: g,
        gstAmount: gstAmt,
        overallAmount: overall,
        balance: bal,
        grossProfit: profit,
        purchaserName: activeRep?.name || currentRole || 'vengateshan',
        itemStatus: r.itemStatus || 'Item dispatched by supplier',
        statusCategory: r.statusCategory || 'Dispatched',
        cycleId: targetCycle,
        region: r.region || 'India',
        isDraft: false,
        notes: r.notes || 'Auto-parsed from uploaded document',
      });
    }
    setActiveTab('sheet');
  };


  const repSales = useMemo(() => {
    return getFilteredSales();
  }, [getFilteredSales]);

  const activeCycle = useMemo(() => {
    if (selectedCycleId === 'all') return cycles[cycles.length - 1];
    return cycles.find((c) => c.id === selectedCycleId) || cycles[0];
  }, [cycles, selectedCycleId]);

  const repTotals = useMemo(() => {
    const totalSales = repSales.reduce((acc, s) => acc + (s.overallAmount || 0), 0);
    const totalProfit = repSales.reduce(
      (acc, s) => acc + (s.sellCost || 0) - (s.purCost || 0) - (s.lanCost || 0),
      0
    );
    const balanceDue = repSales.reduce((acc, s) => acc + (s.balance || 0), 0);
    const dispatched = repSales.filter(
      (s) => s.statusCategory === 'Dispatched' || s.statusCategory === 'Delivered / Saled'
    ).length;

    const target = activeRep?.targetAmount || 120000;
    const progressPct = Math.min(100, Math.round((totalSales / target) * 100));

    return {
      totalSales,
      totalProfit,
      balanceDue,
      dispatched,
      totalCount: repSales.length,
      target,
      progressPct,
    };
  }, [repSales, activeRep]);

  // Live Formula Calculations
  const numSell = Number(sellCost) || 0;
  const numPur = Number(purCost) || 0;
  const numLan = Number(lanCost) || 0;
  const numAdvance = Number(advanPay) || 0;
  const numPacking = Number(packingCharges) || 0;
  const numForwarding = Number(forwardingCharges) || 0;
  const numGstRate = Number(gst) || 18;

  const formulaGstAmount = Math.round((numSell * numGstRate) / 100);
  const effectiveGstAmount = isGstAmountOverridden && manualGstAmount !== '' ? Number(manualGstAmount) : formulaGstAmount;
  const formulaOverall = numSell + effectiveGstAmount + numPacking + numForwarding;
  
  // Effective Over All Amount (uses manual edit if user entered one, otherwise auto formula)
  const effectiveOverall = isOverallOverridden && manualOverall !== '' ? Number(manualOverall) : formulaOverall;
  
  // Formula balance is based on effective overall minus advance
  const formulaBalance = Math.max(0, effectiveOverall - numAdvance);
  
  // Effective Balance (uses manual edit if user entered one, otherwise auto formula)
  const effectiveBalance = isBalanceOverridden && manualBalance !== '' ? Number(manualBalance) : formulaBalance;
  
  // Formula Gross Profit = sell - pur - lan
  const formulaGrossProfit = numSell - numPur - numLan;
  
  // Effective Gross Profit (uses manual edit if user entered one, otherwise auto formula)
  const effectiveGrossProfit = isProfitOverridden && manualProfit !== '' ? Number(manualProfit) : formulaGrossProfit;

  const handleStartEdit = (saleItem: SaleItem) => {
    setEditingItemId(saleItem.id);
    setInqDate(saleItem.inqDate || today);
    setRecPayDate(saleItem.recPayDate || today);
    setRegion(saleItem.region);
    setItem(saleItem.item);
    setComName(saleItem.comName);
    setPurCost(saleItem.purCost || '');
    setLanCost(saleItem.lanCost || 0);
    setSellCost(saleItem.sellCost || '');
    setAdvanPay(saleItem.advanPay || '');
    setPackingCharges(saleItem.packingCharges || 0);
    setForwardingCharges(saleItem.forwardingCharges || 0);
    setGst(saleItem.gst || 18);
    setItemStatus(saleItem.itemStatus);
    setStatusCategory(saleItem.statusCategory);

    // Prepopulate manual fields if present
    if (saleItem.overallAmount !== undefined) {
      setManualOverall(saleItem.overallAmount);
      setIsOverallOverridden(true);
    } else {
      setIsOverallOverridden(false);
      setManualOverall('');
    }

    if (saleItem.balance !== undefined) {
      setManualBalance(saleItem.balance);
      setIsBalanceOverridden(true);
    } else {
      setIsBalanceOverridden(false);
      setManualBalance('');
    }

    if (saleItem.grossProfit !== undefined) {
      setManualProfit(saleItem.grossProfit);
      setIsProfitOverridden(true);
    } else {
      setIsProfitOverridden(false);
      setManualProfit('');
    }

    if (saleItem.gstAmount !== undefined) {
      setManualGstAmount(saleItem.gstAmount);
      setIsGstAmountOverridden(true);
    } else {
      setIsGstAmountOverridden(false);
      setManualGstAmount('');
    }

    setActiveTab('fill');
    setDraftToast(`Loaded "${saleItem.item || 'Item'}" for editing. You can update and save!`);
    setTimeout(() => setDraftToast(''), 4000);
  };

  const handleClearForm = () => {
    setEditingItemId(null);
    setInqDate(today);
    setRecPayDate(today);
    setRegion('India');
    setItem('');
    setComName('');
    setPurCost('');
    setLanCost(0);
    setSellCost('');
    setAdvanPay('');
    setPackingCharges(0);
    setForwardingCharges(0);
    setGst(18);
    setItemStatus('Item dispatched by supplier');
    setStatusCategory('Dispatched');
    setIsOverallOverridden(false);
    setManualOverall('');
    setIsBalanceOverridden(false);
    setManualBalance('');
    setIsProfitOverridden(false);
    setManualProfit('');
    setIsGstAmountOverridden(false);
    setManualGstAmount('');
  };

  const handleSaveDraft = () => {
    // Save partial data in half without requiring all fields
    const payload = {
      inqDate: inqDate || today,
      recPayDate: recPayDate || today,
      region,
      item: item.trim() || 'Untitled (In Progress Draft)',
      comName: comName.trim() || 'Pending Company / Client',
      purCost: numPur,
      lanCost: numLan,
      sellCost: numSell,
      advanPay: numAdvance,
      balance: effectiveBalance,
      packingCharges: numPacking,
      forwardingCharges: numForwarding,
      gst: numGstRate,
      gstAmount: effectiveGstAmount,
      overallAmount: effectiveOverall,
      grossProfit: effectiveGrossProfit,
      purchaserName: activeRep?.name || currentRole,
      itemStatus: itemStatus.trim() ? itemStatus.trim() : 'Draft: Incomplete Form',
      statusCategory,
      cycleId: activeCycle?.id || '2026-10-C3',
      isDraft: true,
      notes: editingItemId ? 'Draft updated (saved in half)' : 'Saved in half by staff (Draft)',
    };

    if (editingItemId) {
      updateSaleItem(editingItemId, payload);
      setDraftToast('✓ In-progress draft updated! You can reopen & finish it anytime.');
    } else {
      addSaleItem(payload);
      setDraftToast('✓ Saved in half as draft! It is now in your sales sheet with [Draft] badge.');
    }

    handleClearForm();
    setActiveTab('sheet');
    setTimeout(() => setDraftToast(''), 5000);
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.trim() || !comName.trim() || numSell <= 0) {
      alert('To complete this row, please fill in Item Name, Company Name, and Selling Cost!\n\n(Tip: If you only have partial details right now, click "Save in Half (Save as Draft)" instead!)');
      return;
    }

    const payload = {
      inqDate: inqDate || today,
      recPayDate: recPayDate || today,
      region,
      item: item.trim(),
      comName: comName.trim(),
      purCost: numPur,
      lanCost: numLan,
      sellCost: numSell,
      advanPay: numAdvance,
      balance: effectiveBalance,
      packingCharges: numPacking,
      forwardingCharges: numForwarding,
      gst: numGstRate,
      gstAmount: effectiveGstAmount,
      overallAmount: effectiveOverall,
      grossProfit: effectiveGrossProfit,
      purchaserName: activeRep?.name || currentRole,
      itemStatus: itemStatus.trim(),
      statusCategory,
      cycleId: activeCycle?.id || '2026-10-C3',
      isDraft: false,
      notes: editingItemId ? 'Completed from in-progress draft' : 'Logged directly by staff',
    };

    if (editingItemId) {
      updateSaleItem(editingItemId, payload);
    } else {
      addSaleItem(payload);
    }

    handleClearForm();
    setActiveTab('sheet');
  };

  const handleSubmit10DayReport = () => {
    setIsSubmitted(true);
    triggerCelebration(
      '10-Day Sales Batch Submitted to MD! 🏆',
      activeRep?.displayName || currentRole
    );
  };

  return (
    <div className="h-full flex flex-col space-y-2.5 overflow-hidden">
      {/* Staff Bar & View Tabs */}
      <div className={`border rounded-2xl px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 transition-colors duration-200 ${
        isDark 
          ? 'bg-[#12141F] border-white/10 shadow-lg text-white' 
          : 'bg-white border-slate-200/90 shadow-xs text-slate-900'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md shrink-0">
            {activeRep?.avatarUrl || getStaffAvatarUrl(activeRep?.name || currentRole, reps) ? (
              <img
                src={activeRep?.avatarUrl || getStaffAvatarUrl(activeRep?.name || currentRole, reps)}
                alt={activeRep?.displayName || currentRole}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full ${
                  activeRep?.avatarColor || 'bg-indigo-600'
                } flex items-center justify-center text-white text-base sm:text-lg font-black shadow-md`}
              >
                {activeRep?.displayName.charAt(0) || currentRole.charAt(0).toUpperCase()}
              </div>
            )}
            <span
              className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
              title="Active Staff Profile"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-sm sm:text-base md:text-lg font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeRep?.displayName || currentRole} • Staff Sales Workspace
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${
                isDark 
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                <Check className="w-3 h-3 text-emerald-600" /> Active Profile
              </span>
            </div>
            <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              10-Day Reporting: Fill transaction items & review milestone targets
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
          isDark 
            ? 'bg-[#0B0D14] border-white/5' 
            : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setActiveTab('sheet')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'sheet'
                ? isDark
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white text-slate-900 shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-500" />
            <span>My 10-Day Sheet</span>
          </button>
          <button
            onClick={() => setActiveTab('fill')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'fill'
                ? isDark
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-white text-slate-900 shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-500" />
            <span>+ Fill New Sale Row</span>
          </button>
          <button
            onClick={() => setActiveTab('target')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'target'
                ? isDark
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-white text-slate-900 shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>My Milestone</span>
          </button>
        </div>

        {/* Period selection */}
        <div className={`flex items-center border rounded-xl px-2.5 py-1 ${
          isDark 
            ? 'bg-[#0B0D14] border-white/10' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <span className={`text-[10px] mr-1 flex items-center gap-1 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Calendar className="w-3 h-3 text-indigo-400" />
            Cycle:
          </span>
          <select
            value={selectedCycleId}
            onChange={(e) => {
              if (e.target.value === '__NEW_CYCLE__') {
                if (onOpenCycleManager) onOpenCycleManager();
              } else {
                setSelectedCycleId(e.target.value);
              }
            }}
            className={`bg-transparent text-[11px] font-bold focus:outline-none cursor-pointer ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}
          >
            <option value="all" className={isDark ? 'bg-zinc-900 text-white' : ''}>All Cycles</option>
            {cycles.map((c) => (
              <option key={c.id} value={c.id} className={isDark ? 'bg-zinc-900 text-white' : ''}>
                {c.name}
              </option>
            ))}
            <option value="__NEW_CYCLE__" className="text-emerald-600 font-bold">
              ➕ + Add 10-Day Timing...
            </option>
          </select>
          {onOpenCycleManager && (
            <button
              type="button"
              onClick={onOpenCycleManager}
              title="View & Add 10-Day Cycle Timing Periods"
              className="ml-1.5 pl-1.5 border-l border-slate-300 dark:border-zinc-700 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-2.5 h-2.5" />
              <span>Timing</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: MY 10-DAY SALES SHEET (Takes full remaining screen height!) */}
      {activeTab === 'sheet' && (
        <div className="flex-1 overflow-hidden flex flex-col">
          {draftToast && (
            <div className="mb-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center justify-between shadow-2xs">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {draftToast}
              </span>
              <button
                type="button"
                onClick={() => setDraftToast('')}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                ✕
              </button>
            </div>
          )}
          <SalesTable
            sales={repSales}
            onEdit={(item) => handleStartEdit(item)}
            onAddNew={() => {
              handleClearForm();
              setActiveTab('fill');
            }}
            title={`My 10-Day Sales Data (${activeRep?.displayName || currentRole})`}
            showRepColumn={false}
          />
        </div>
      )}

      {/* TAB 2: STAFF FILLING WORKSPACE (Seamless Full Page-Fit & Easy on Eyes) */}
      {activeTab === 'fill' && (
        <div className={`w-full border rounded-2xl p-4 sm:p-5 shadow-xl overflow-y-auto transition-colors duration-200 ${
          isDark 
            ? 'bg-[#12141F] border-white/10 text-slate-100 shadow-black/40' 
            : 'bg-white border-slate-200/90 text-slate-900 shadow-xs'
        }`}>
          <div className="w-full space-y-3.5">
            {/* Compact Header Row */}
            <div className={`flex items-center justify-between border-b pb-2.5 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${
                  isDark 
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50 shadow-xs' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-2xs'
                }`}>
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-base font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Staff 10-Day Payment & Sales Filling
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Fill transaction details or click <strong className={isDark ? 'text-amber-400' : 'text-amber-700'}>"Save as Draft"</strong> to finish later!
                  </p>
                </div>
              </div>
              <div className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full border flex items-center gap-2 ${
                isDark 
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60' 
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                <div className="w-5 h-5 rounded-full overflow-hidden border border-indigo-400 shrink-0 bg-slate-800">
                  {activeRep?.avatarUrl || getStaffAvatarUrl(activeRep?.name || currentRole, reps) ? (
                    <img
                      src={activeRep?.avatarUrl || getStaffAvatarUrl(activeRep?.name || currentRole, reps)}
                      alt={activeRep?.displayName || currentRole}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {(activeRep?.displayName || currentRole).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span>Staff: {activeRep?.displayName || currentRole}</span>
              </div>
            </div>

            {/* Editing In-Progress Draft Banner */}
            {editingItemId && (
              <div className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 shadow-2xs ${
                isDark 
                  ? 'bg-amber-950/40 border-amber-800/70 text-amber-200' 
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">⏳</span>
                  <div>
                    <span className="font-bold text-sm">Reopened In-Progress Draft for Editing</span>
                    <p className={`text-xs ${isDark ? 'text-amber-300/80' : 'text-amber-800'}`}>
                      Currently editing: <strong>{item || 'Untitled Draft'}</strong>. Fill missing fields and click "Save" or "Update Draft".
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearForm}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer shrink-0 ${
                    isDark 
                      ? 'bg-zinc-850 hover:bg-zinc-750 border-amber-700/60 text-amber-200' 
                      : 'bg-white hover:bg-amber-100 border-amber-300 text-amber-900'
                  }`}
                >
                  Cancel & New Row
                </button>
              </div>
            )}

            {/* Smart Form Auto-Parser & Document Uploader */}
            <SmartFormUploader
              onApplyParsedData={handleApplyParsedData}
              onBulkImportRows={handleBulkImportRows}
            />

            <form onSubmit={handleStaffSubmit} className="space-y-3.5 text-xs sm:text-sm">
              {/* SECTION 1: TRANSACTION & CLIENT IDENTITY */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 p-4 rounded-xl border ${
                isDark 
                  ? 'bg-[#161824] border-white/10' 
                  : 'bg-slate-50/80 border-slate-200/90'
              }`}>
                <div className="lg:col-span-2">
                  <label className={`block text-xs sm:text-sm font-bold mb-1.5 flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    Inquiry Date (INQ DATE) *
                  </label>
                  <input
                    type="date"
                    value={inqDate}
                    onChange={(e) => setInqDate(e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs border ${
                      isDark 
                        ? 'bg-[#0E1017] border-zinc-700/80 text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className={`block text-xs sm:text-sm font-bold mb-1.5 flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    Payment Date (REC PAY) *
                  </label>
                  <input
                    type="date"
                    value={recPayDate}
                    onChange={(e) => setRecPayDate(e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs border ${
                      isDark 
                        ? 'bg-[#0E1017] border-zinc-700/80 text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className={`block text-xs sm:text-sm font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    India / Export
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRegion('India')}
                      className={`py-2 px-2.5 rounded-lg text-xs sm:text-sm font-bold border transition cursor-pointer ${
                        region === 'India'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 text-white shadow-sm'
                          : isDark
                          ? 'bg-[#0E1017] border-zinc-700/80 text-slate-400 hover:text-white'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      🇮🇳 India
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegion('Export')}
                      className={`py-2 px-2.5 rounded-lg text-xs sm:text-sm font-bold border transition cursor-pointer ${
                        region === 'Export'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 text-white shadow-sm'
                          : isDark
                          ? 'bg-[#0E1017] border-zinc-700/80 text-slate-400 hover:text-white'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ✈️ Export
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <label className={`block text-xs sm:text-sm font-bold mb-1.5 flex items-center gap-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    <Tag className="w-3.5 h-3.5 text-indigo-400" />
                    Item Name / Description (ITEM) *
                  </label>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    placeholder="e.g. silicon trowel scraper..."
                    className={`w-full rounded-lg px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs border ${
                      isDark 
                        ? 'bg-[#0E1017] border-zinc-700/80 text-white placeholder-slate-500' 
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                    required
                  />
                </div>

                <div className="lg:col-span-3">
                  <label className={`block text-xs sm:text-sm font-bold mb-1.5 flex items-center gap-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    Company / Client (COM NAME) *
                  </label>
                  <input
                    type="text"
                    value={comName}
                    onChange={(e) => setComName(e.target.value)}
                    placeholder="e.g. handy home solution..."
                    className={`w-full rounded-lg px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs border ${
                      isDark 
                        ? 'bg-[#0E1017] border-zinc-700/80 text-white placeholder-slate-500' 
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* SECTION 2: COSTING & FINANCIAL COLUMNS */}
              <div className={`p-4 rounded-xl border space-y-2.5 ${
                isDark 
                  ? 'bg-[#161824] border-white/10' 
                  : 'bg-slate-50/80 border-slate-200/90'
              }`}>
                <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
                  <span className={`font-black text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Costing & Financial Columns (₹)
                  </span>
                  <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                    isDark 
                      ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    Live Formula Auto-Computed
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  <div>
                    <label className={`block text-xs font-bold mb-1 truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`} title="PURCHASE COST (PUR COS)">
                      PURCHASE COST (₹)
                    </label>
                    <input
                      type="number"
                      value={purCost}
                      onChange={(e) => setPurCost(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className={`w-full rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs border ${
                        isDark 
                          ? 'bg-[#0E1017] border-zinc-700/80 text-white placeholder-slate-500' 
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1 truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`} title="LANDING COST (LAN COST)">
                      LANDING COST (₹)
                    </label>
                    <input
                      type="number"
                      value={lanCost}
                      onChange={(e) => setLanCost(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className={`w-full rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs border ${
                        isDark 
                          ? 'bg-[#0E1017] border-zinc-700/80 text-white placeholder-slate-500' 
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-black mb-1 truncate ${isDark ? 'text-indigo-400' : 'text-blue-700'}`} title="SELLING COST (SELL COST) *">
                      SELLING COST (₹) *
                    </label>
                    <input
                      type="number"
                      value={sellCost}
                      onChange={(e) => setSellCost(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className={`w-full rounded-lg px-3 py-2 text-xs sm:text-sm font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs border ${
                        isDark 
                          ? 'bg-[#101424] border-indigo-500/80 text-white ring-1 ring-indigo-500/40' 
                          : 'bg-white border-blue-400 text-blue-950 ring-1 ring-blue-400/30'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1 truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`} title="ADVANCE PAYMENT (Advan Pay)">
                      ADVANCE PAY (₹)
                    </label>
                    <input
                      type="number"
                      value={advanPay}
                      onChange={(e) => setAdvanPay(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className={`w-full rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs border ${
                        isDark 
                          ? 'bg-[#0E1017] border-zinc-700/80 text-white placeholder-slate-500' 
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Packing Charges
                    </label>
                    <input
                      type="number"
                      value={packingCharges}
                      onChange={(e) => setPackingCharges(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className={`w-full rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs border ${
                        isDark 
                          ? 'bg-[#0E1017] border-zinc-700/80 text-white placeholder-slate-500' 
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Forwarding Charges
                    </label>
                    <input
                      type="number"
                      value={forwardingCharges}
                      onChange={(e) => setForwardingCharges(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className={`w-full rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs border ${
                        isDark 
                          ? 'bg-[#0E1017] border-zinc-700/80 text-white placeholder-slate-500' 
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      GST Rate (%)
                    </label>
                    <input
                      type="number"
                      value={gst}
                      onChange={(e) => setGst(Number(e.target.value))}
                      className={`w-full rounded-lg px-3 py-2 text-xs sm:text-sm font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs border ${
                        isDark 
                          ? 'bg-[#0E1017] border-zinc-700/80 text-white' 
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <label className={`block text-xs font-semibold truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        GST Calculated
                      </label>
                      {isGstAmountOverridden ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsGstAmountOverridden(false);
                            setManualGstAmount('');
                          }}
                          title="Reset to formula: Sell Cost * GST %"
                          className="text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-0.5 cursor-pointer shadow-2xs transition"
                        >
                          ✏️ Custom • ↺
                        </button>
                      ) : (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>
                          Auto • Edit
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <span className={`text-xs font-bold absolute left-3 pointer-events-none select-none ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        ₹
                      </span>
                      <input
                        id="staff-gst-calculated-input"
                        type="number"
                        value={isGstAmountOverridden ? manualGstAmount : (effectiveGstAmount || 0)}
                        onChange={(e) => {
                          setIsGstAmountOverridden(true);
                          setManualGstAmount(e.target.value === '' ? '' : Number(e.target.value));
                        }}
                        onFocus={() => {
                          if (!isGstAmountOverridden) {
                            setIsGstAmountOverridden(true);
                            setManualGstAmount(effectiveGstAmount);
                          }
                        }}
                        placeholder="0"
                        className={`w-full rounded-lg pl-7 pr-3 py-2 text-xs sm:text-sm font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs border ${
                          isGstAmountOverridden
                            ? isDark
                              ? 'bg-amber-950/40 border-amber-500/80 text-amber-300'
                              : 'bg-amber-50/50 border-amber-400 text-amber-950'
                            : isDark 
                              ? 'bg-[#0E1017] border-zinc-700/80 text-white' 
                              : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: LIVE AUTO-COMPUTED & FULLY EDITABLE CARDS + ITEM STATUS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
                {/* Left: 3 Auto-Calculated and Directly Editable Summary Cards */}
                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Card 1: OVER ALL AMOU */}
                  <div className={`p-3.5 rounded-xl border flex flex-col justify-between shadow-2xs transition-all ${
                    isDark 
                      ? 'bg-gradient-to-br from-indigo-950/70 via-indigo-900/40 to-[#12141F] border-indigo-700/50 text-indigo-100' 
                      : 'bg-blue-50/90 border-blue-200 text-blue-900'
                  }`}>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-xs font-black uppercase tracking-wide ${isDark ? 'text-indigo-300' : 'text-blue-900'}`}>
                        OVER ALL AMOU
                      </span>
                      {isOverallOverridden ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsOverallOverridden(false);
                            setManualOverall('');
                          }}
                          title="Reset to formula: Sell + GST + Pck + Fwd"
                          className="text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-0.5 cursor-pointer shadow-2xs transition"
                        >
                          ✏️ Custom • ↺
                        </button>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-0.5 ${
                          isDark 
                            ? 'text-indigo-300 bg-indigo-900/60 border-indigo-700/60' 
                            : 'text-blue-700 bg-blue-100/70 border-blue-200'
                        }`}>
                          <Edit3 className="w-3 h-3" /> Auto • Edit
                        </span>
                      )}
                    </div>

                    <div className="relative flex items-center my-1">
                      <span className={`text-sm font-bold absolute left-2.5 pointer-events-none select-none ${isDark ? 'text-indigo-400' : 'text-blue-700'}`}>
                        ₹
                      </span>
                      <input
                        type="number"
                        value={isOverallOverridden ? manualOverall : (effectiveOverall || 0)}
                        onChange={(e) => {
                          setIsOverallOverridden(true);
                          setManualOverall(e.target.value === '' ? '' : Number(e.target.value));
                        }}
                        onFocus={() => {
                          if (!isOverallOverridden) {
                            setIsOverallOverridden(true);
                            setManualOverall(effectiveOverall);
                          }
                        }}
                        placeholder="0"
                        className={`w-full rounded-lg pl-6 pr-2 py-1.5 text-base sm:text-lg font-black font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs border ${
                          isDark 
                            ? 'bg-[#0A0C13] border-indigo-600/70 text-white' 
                            : 'bg-white border-blue-300 text-blue-950'
                        }`}
                        title="Auto-calculated. Click to edit or override amount!"
                      />
                    </div>
                    <span className={`text-[10px] font-medium leading-tight ${isDark ? 'text-indigo-300/80' : 'text-blue-700'}`}>
                      Sell + GST + Pck + Fwd
                    </span>
                  </div>

                  {/* Card 2: BALANCE DUE */}
                  <div className={`p-3.5 rounded-xl border flex flex-col justify-between shadow-2xs transition-all ${
                    isDark 
                      ? 'bg-gradient-to-br from-amber-950/70 via-amber-900/40 to-[#12141F] border-amber-700/50 text-amber-100' 
                      : 'bg-amber-50/90 border-amber-200 text-amber-900'
                  }`}>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-xs font-black uppercase tracking-wide ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
                        BALANCE DUE
                      </span>
                      {isBalanceOverridden ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsBalanceOverridden(false);
                            setManualBalance('');
                          }}
                          title="Reset to formula: OVER ALL - ADVANCE"
                          className="text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-0.5 cursor-pointer shadow-2xs transition"
                        >
                          ✏️ Custom • ↺
                        </button>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-0.5 ${
                          isDark 
                            ? 'text-amber-300 bg-amber-900/60 border-amber-700/60' 
                            : 'text-amber-700 bg-amber-100/70 border-amber-200'
                        }`}>
                          <Edit3 className="w-3 h-3" /> Auto • Edit
                        </span>
                      )}
                    </div>

                    <div className="relative flex items-center my-1">
                      <span className={`text-sm font-bold absolute left-2.5 pointer-events-none select-none ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                        ₹
                      </span>
                      <input
                        type="number"
                        value={isBalanceOverridden ? manualBalance : (effectiveBalance || 0)}
                        onChange={(e) => {
                          setIsBalanceOverridden(true);
                          setManualBalance(e.target.value === '' ? '' : Number(e.target.value));
                        }}
                        onFocus={() => {
                          if (!isBalanceOverridden) {
                            setIsBalanceOverridden(true);
                            setManualBalance(effectiveBalance);
                          }
                        }}
                        placeholder="0"
                        className={`w-full rounded-lg pl-6 pr-2 py-1.5 text-base sm:text-lg font-black font-mono focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs border ${
                          isDark 
                            ? 'bg-[#0A0C13] border-amber-600/70 text-white' 
                            : 'bg-white border-amber-300 text-amber-950'
                        }`}
                        title="Auto-calculated. Click to edit or override balance!"
                      />
                    </div>
                    <span className={`text-[10px] font-medium leading-tight ${isDark ? 'text-amber-300/80' : 'text-amber-700'}`}>
                      OVER ALL - ADVANCE
                    </span>
                  </div>

                  {/* Card 3: GROSS PROFIT */}
                  <div className={`p-3.5 rounded-xl border flex flex-col justify-between shadow-2xs transition-all ${
                    isDark 
                      ? 'bg-gradient-to-br from-emerald-950/70 via-emerald-900/40 to-[#12141F] border-emerald-700/50 text-emerald-100' 
                      : 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                  }`}>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-xs font-black uppercase tracking-wide ${isDark ? 'text-emerald-300' : 'text-emerald-900'}`}>
                        GROSS PROFIT
                      </span>
                      {isProfitOverridden ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfitOverridden(false);
                            setManualProfit('');
                          }}
                          title="Reset to formula: Sell - Pur - Lan"
                          className="text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-0.5 cursor-pointer shadow-2xs transition"
                        >
                          ✏️ Custom • ↺
                        </button>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-0.5 ${
                          isDark 
                            ? 'text-emerald-300 bg-emerald-900/60 border-emerald-700/60' 
                            : 'text-emerald-700 bg-emerald-100/70 border-emerald-200'
                        }`}>
                          <Edit3 className="w-3 h-3" /> Auto • Edit
                        </span>
                      )}
                    </div>

                    <div className="relative flex items-center my-1">
                      <span className={`text-sm font-bold absolute left-2.5 pointer-events-none select-none ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        ₹
                      </span>
                      <input
                        type="number"
                        value={isProfitOverridden ? manualProfit : (effectiveGrossProfit || 0)}
                        onChange={(e) => {
                          setIsProfitOverridden(true);
                          setManualProfit(e.target.value === '' ? '' : Number(e.target.value));
                        }}
                        onFocus={() => {
                          if (!isProfitOverridden) {
                            setIsProfitOverridden(true);
                            setManualProfit(effectiveGrossProfit);
                          }
                        }}
                        placeholder="0"
                        className={`w-full rounded-lg pl-6 pr-2 py-1.5 text-base sm:text-lg font-black font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs border ${
                          isDark 
                            ? 'bg-[#0A0C13] border-emerald-600/70 text-white' 
                            : 'bg-white border-emerald-300 text-emerald-950'
                        }`}
                        title="Auto-calculated. Click to edit or override profit!"
                      />
                    </div>
                    <span className={`text-[10px] font-medium leading-tight ${isDark ? 'text-emerald-300/80' : 'text-emerald-700'}`}>
                      Sell - Pur - Lan
                    </span>
                  </div>
                </div>

                {/* Right: Item Status Selector */}
                <div className={`lg:col-span-6 p-4 rounded-xl border flex flex-col justify-between ${
                  isDark 
                    ? 'bg-[#161824] border-white/10' 
                    : 'bg-slate-50/80 border-slate-200/90'
                }`}>
                  <StatusSelector
                    value={itemStatus}
                    onChange={(newText, newCategory) => {
                      setItemStatus(newText);
                      setStatusCategory(newCategory);
                    }}
                    required
                  />
                </div>
              </div>

              {/* SECTION 4: ACTION BUTTONS (Neatly Docked, Right Below the Form) */}
              <div className={`flex flex-wrap items-center justify-between gap-3 pt-4 border-t ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => {
                    handleClearForm();
                    setActiveTab('sheet');
                  }}
                  className={`px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-2 transition cursor-pointer"
                    title="Save as draft to finish later"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingItemId ? 'Update Draft' : 'Save as Draft'}</span>
                  </button>

                  <button
                    type="submit"
                    className="px-7 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: MY MILESTONE TARGET & SUBMISSION */}
      {activeTab === 'target' && (
        <div className={`flex-1 border rounded-2xl p-5 shadow-xl overflow-y-auto ${
          isDark 
            ? 'bg-[#12141F] border-white/10 text-white' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="max-w-3xl mx-auto space-y-5">
            {/* Live Clock & 10-Day Cycle Countdown Banner */}
            <LiveCycleBanner showNextNotice={true} />

            <div className={`border-b pb-3 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <h3 className={`text-base sm:text-lg font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Sparkles className="w-5 h-5 text-amber-500" />
                10-Day Performance Milestone ({activeCycle?.name || 'Active Cycle'})
              </h3>
              <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Every 10 days, review your total filled sales and submit your batch report to the Managing Director before the countdown hits zero.
              </p>
            </div>

            {/* Target Progress Bar */}
            <div className={`p-4 rounded-2xl border space-y-2.5 ${
              isDark 
                ? 'bg-[#161824] border-white/10' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>10-Day Milestone Progress</span>
                <span className="font-black text-emerald-600 font-mono text-base sm:text-lg">
                  ₹{repTotals.totalSales.toLocaleString('en-IN')} / ₹{repTotals.target.toLocaleString('en-IN')} ({repTotals.progressPct}%)
                </span>
              </div>
              <div className={`w-full h-3.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}>
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${repTotals.progressPct}%` }}
                />
              </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className={`p-4 rounded-2xl border shadow-xs ${
                isDark ? 'bg-[#161824] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Logged Items</span>
                <p className={`text-2xl sm:text-3xl font-black mt-1 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{repTotals.totalCount} sales</p>
              </div>
              <div className={`p-4 rounded-2xl border shadow-xs ${
                isDark ? 'bg-[#161824] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>My Gross Profit Generated</span>
                <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1 font-mono">₹{repTotals.totalProfit.toLocaleString('en-IN')}</p>
              </div>
              <div className={`p-4 rounded-2xl border shadow-xs ${
                isDark ? 'bg-[#161824] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Outstanding Client Balance</span>
                <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 font-mono">₹{repTotals.balanceDue.toLocaleString('en-IN')}</p>
              </div>
              <div className={`p-4 rounded-2xl border shadow-xs ${
                isDark ? 'bg-[#161824] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Dispatched Orders</span>
                <p className="text-2xl sm:text-3xl font-black text-teal-600 mt-1 font-mono">{repTotals.dispatched} / {repTotals.totalCount}</p>
              </div>
            </div>

            {/* Big Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleSubmit10DayReport}
                className={`w-full py-3.5 rounded-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer ${
                  isSubmitted
                    ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-700'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/20'
                }`}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Report Submitted to MD Successfully!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit 10-Day Sales Batch to MD</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
