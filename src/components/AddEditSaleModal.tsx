import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, Check, Building2, Tag, Calendar, UserCheck, Save, Edit3, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { SaleItem, RegionType, StatusCategory } from '../types';
import { useSales } from '../context/SalesContext';
import { StatusSelector } from './StatusSelector';
import { getStaffAvatarUrl } from '../utils/staffAvatars';
import { SmartFormUploader } from './SmartFormUploader';
import type { ParsedSaleData } from '../utils/formAutoParser';

interface AddEditSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: SaleItem | null;
  onOpenCycleModal?: () => void;
}

export const AddEditSaleModal: React.FC<AddEditSaleModalProps> = ({
  isOpen,
  onClose,
  itemToEdit,
  onOpenCycleModal,
}) => {
  const { addSaleItem, updateSaleItem, reps, cycles, currentRole, isMD } = useSales();

  const [inqDate, setInqDate] = useState<string>('');
  const [recPayDate, setRecPayDate] = useState<string>('');
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
  const [purchaserName, setPurchaserName] = useState<string>('');
  const [itemStatus, setItemStatus] = useState<string>('Item dispatched by supplier');
  const [statusCategory, setStatusCategory] = useState<StatusCategory>('Dispatched');
  const [cycleId, setCycleId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Manual Override States for Computed Fields
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
    if (data.purchaserName) setPurchaserName(data.purchaserName);
    if (data.itemStatus) setItemStatus(data.itemStatus);
    if (data.statusCategory) setStatusCategory(data.statusCategory);
    if (data.region) setRegion(data.region);
    if (data.notes) setNotes(data.notes);
  };

  const handleBulkImportRows = (rows: ParsedSaleData[]) => {
    const targetCycle = cycleId || cycles.find((c) => c.isCurrent)?.id || cycles[0]?.id || '2026-11-C2';
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
        purchaserName: r.purchaserName || purchaserName || currentRole || 'vengateshan',
        itemStatus: r.itemStatus || 'Item dispatched by supplier',
        statusCategory: r.statusCategory || 'Dispatched',
        cycleId: targetCycle,
        region: r.region || 'India',
        isDraft: false,
        notes: r.notes || 'Auto-parsed from uploaded document',
      });
    }
    onClose();
  };


  useEffect(() => {
    if (itemToEdit) {
      setInqDate(itemToEdit.inqDate);
      setRecPayDate(itemToEdit.recPayDate);
      setRegion(itemToEdit.region);
      setItem(itemToEdit.item);
      setComName(itemToEdit.comName);
      setPurCost(itemToEdit.purCost);
      setLanCost(itemToEdit.lanCost);
      setSellCost(itemToEdit.sellCost);
      setAdvanPay(itemToEdit.advanPay);
      setPackingCharges(itemToEdit.packingCharges);
      setForwardingCharges(itemToEdit.forwardingCharges);
      setGst(itemToEdit.gst);
      setPurchaserName(itemToEdit.purchaserName);
      setItemStatus(itemToEdit.itemStatus);
      setStatusCategory(itemToEdit.statusCategory);
      setCycleId(itemToEdit.cycleId);
      setNotes(itemToEdit.notes || '');

      if (itemToEdit.overallAmount !== undefined) {
        setManualOverall(itemToEdit.overallAmount);
        setIsOverallOverridden(true);
      } else {
        setIsOverallOverridden(false);
        setManualOverall('');
      }

      if (itemToEdit.balance !== undefined) {
        setManualBalance(itemToEdit.balance);
        setIsBalanceOverridden(true);
      } else {
        setIsBalanceOverridden(false);
        setManualBalance('');
      }

      if (itemToEdit.grossProfit !== undefined) {
        setManualProfit(itemToEdit.grossProfit);
        setIsProfitOverridden(true);
      } else {
        setIsProfitOverridden(false);
        setManualProfit('');
      }

      if (itemToEdit.gstAmount !== undefined) {
        setManualGstAmount(itemToEdit.gstAmount);
        setIsGstAmountOverridden(true);
      } else {
        setIsGstAmountOverridden(false);
        setManualGstAmount('');
      }
    } else {
      const today = new Date().toISOString().split('T')[0];
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
      setPurchaserName(!isMD ? currentRole : (reps[0]?.name || 'yazhini'));
      setItemStatus('Item dispatched by supplier');
      setStatusCategory('Dispatched');
      const activeCycle = cycles.find((c) => c.isCurrent) || cycles[cycles.length - 1];
      setCycleId(activeCycle?.id || '');
      setNotes('');

      setIsOverallOverridden(false);
      setManualOverall('');
      setIsBalanceOverridden(false);
      setManualBalance('');
      setIsProfitOverridden(false);
      setManualProfit('');
      setIsGstAmountOverridden(false);
      setManualGstAmount('');
    }
    setErrors({});
  }, [itemToEdit, isOpen, currentRole, isMD, reps, cycles]);

  const numSellCost = Number(sellCost) || 0;
  const numPurCost = Number(purCost) || 0;
  const numLanCost = Number(lanCost) || 0;
  const numAdvanPay = Number(advanPay) || 0;
  const numPacking = Number(packingCharges) || 0;
  const numForwarding = Number(forwardingCharges) || 0;
  const numGstRate = Number(gst) || 0;

  const formulaGstAmount = Math.round((numSellCost * numGstRate) / 100);
  const gstAmount = isGstAmountOverridden && manualGstAmount !== '' ? Number(manualGstAmount) : formulaGstAmount;
  const formulaOverall = numSellCost + gstAmount + numPacking + numForwarding;
  const overallAmount = isOverallOverridden && manualOverall !== '' ? Number(manualOverall) : formulaOverall;

  const formulaBalance = Math.max(0, overallAmount - numAdvanPay);
  const balance = isBalanceOverridden && manualBalance !== '' ? Number(manualBalance) : formulaBalance;

  const formulaProfit = numSellCost - numPurCost - numLanCost;
  const grossProfit = isProfitOverridden && manualProfit !== '' ? Number(manualProfit) : formulaProfit;
  const grossMargin = numSellCost > 0 ? ((grossProfit / numSellCost) * 100).toFixed(1) : '0';

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!item.trim()) errs.item = 'Item name is required';
    if (!comName.trim()) errs.comName = 'Company name is required';
    if (sellCost === '' || numSellCost <= 0) errs.sellCost = 'Enter selling cost';
    if (!purchaserName) errs.purchaserName = 'Select a representative';
    if (!cycleId) errs.cycleId = 'Select a 10-day cycle';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      inqDate,
      recPayDate,
      region,
      item: item.trim(),
      comName: comName.trim(),
      purCost: numPurCost,
      lanCost: numLanCost,
      sellCost: numSellCost,
      advanPay: numAdvanPay,
      balance,
      packingCharges: numPacking,
      forwardingCharges: numForwarding,
      gst: numGstRate,
      gstAmount,
      overallAmount,
      grossProfit,
      purchaserName,
      itemStatus: itemStatus.trim(),
      statusCategory,
      cycleId,
      isDraft: false,
      notes: notes.trim(),
    };

    if (itemToEdit) {
      updateSaleItem(itemToEdit.id, payload);
    } else {
      addSaleItem(payload);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#4f46e5', '#059669', '#d97706'],
        });
      } catch (err) {
        // ignore
      }
    }

    onClose();
  };

  const handleSaveDraft = () => {
    // Save in half without requiring all fields
    const payload = {
      inqDate: inqDate || new Date().toISOString().split('T')[0],
      recPayDate: recPayDate || new Date().toISOString().split('T')[0],
      region,
      item: item.trim() || 'Untitled (In Progress Draft)',
      comName: comName.trim() || 'Pending Company / Client',
      purCost: numPurCost,
      lanCost: numLanCost,
      sellCost: numSellCost,
      advanPay: numAdvanPay,
      balance,
      packingCharges: numPacking,
      forwardingCharges: numForwarding,
      gst: numGstRate,
      gstAmount,
      overallAmount,
      grossProfit,
      purchaserName: purchaserName || (!isMD ? currentRole : (reps[0]?.name || 'yazhini')),
      itemStatus: itemStatus.trim() ? itemStatus.trim() : 'Draft: Incomplete Form',
      statusCategory,
      cycleId: cycleId || cycles[cycles.length - 1]?.id || '2026-10-C3',
      isDraft: true,
      notes: notes.trim() || 'Saved in half (Draft)',
    };

    if (itemToEdit) {
      updateSaleItem(itemToEdit.id, payload);
    } else {
      addSaleItem(payload);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {itemToEdit ? 'Edit Sales Entry' : 'New 10-Day Sales Report Entry'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Exact format from Excel payment report • Auto-calculates Overall & Balance
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {!itemToEdit && (
                <SmartFormUploader
                  onApplyParsedData={handleApplyParsedData}
                  onBulkImportRows={handleBulkImportRows}
                />
              )}
              {/* Row 1: Purchaser, Cycle, Region */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-indigo-600" />
                    Purchaser / Sales Rep <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {/* Visual Staff Profile Photo */}
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500 ring-2 ring-indigo-200 shrink-0 shadow-xs bg-slate-800">
                      {getStaffAvatarUrl(purchaserName, reps) ? (
                        <img
                          src={getStaffAvatarUrl(purchaserName, reps)}
                          alt={purchaserName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                          {purchaserName ? purchaserName.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                    </div>
                    <select
                      value={purchaserName}
                      disabled={!isMD}
                      onChange={(e) => setPurchaserName(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold disabled:bg-slate-100 cursor-pointer"
                    >
                      {(isMD
                        ? reps
                        : reps.filter((r) => r.name.toLowerCase() === currentRole.toLowerCase())
                      ).map((rep) => (
                        <option key={rep.id} value={rep.name}>
                          {rep.displayName} ({rep.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  {!isMD && (
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      🔒 Logged in as {purchaserName}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1 shrink-0">
                      <Calendar className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>10-Day Cycle <span className="text-rose-500">*</span></span>
                    </label>
                    {onOpenCycleModal && (
                      <button
                        type="button"
                        onClick={onOpenCycleModal}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer shrink-0"
                        title="Add or Manage 10-Day Timing Periods"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>+ Timing</span>
                      </button>
                    )}
                  </div>
                  <select
                    value={cycleId}
                    onChange={(e) => {
                      if (e.target.value === '__NEW_CYCLE__') {
                        if (onOpenCycleModal) onOpenCycleModal();
                      } else {
                        setCycleId(e.target.value);
                      }
                    }}
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  >
                    {cycles.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                    <option value="__NEW_CYCLE__" className="text-indigo-600 font-bold">
                      ➕ + Add New 10-Day Timing...
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    India or Export <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRegion('India')}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold border transition ${
                        region === 'India'
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      🇮🇳 India
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegion('Export')}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold border transition ${
                        region === 'Export'
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      ✈️ Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Core Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-indigo-600" />
                    Item Name / Description <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    placeholder="e.g. silicon trowel scraper, tabulate hardness tester..."
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {errors.item && <p className="text-[10px] text-rose-500 mt-0.5">{errors.item}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-indigo-600" />
                    Company Name (COM NAME) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={comName}
                    onChange={(e) => setComName(e.target.value)}
                    placeholder="e.g. handy home solution, TSUJI IPPEI..."
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {errors.comName && <p className="text-[10px] text-rose-500 mt-0.5">{errors.comName}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Inquiry Date (INQ DATE)
                  </label>
                  <input
                    type="date"
                    value={inqDate}
                    onChange={(e) => setInqDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Received Payment Date (REC PAY DATE)
                  </label>
                  <input
                    type="date"
                    value={recPayDate}
                    onChange={(e) => setRecPayDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Financial Box */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                    <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                    Costing & Calculations (₹)
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live Auto Formula
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                      PURCHASE COST (PUR COS)
                    </label>
                    <input
                      type="number"
                      value={purCost}
                      onChange={(e) => setPurCost(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                      LANDING COST (LAN COST)
                    </label>
                    <input
                      type="number"
                      value={lanCost}
                      onChange={(e) => setLanCost(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-indigo-900 mb-0.5">
                      SELLING COST (SELL COST) *
                    </label>
                    <input
                      type="number"
                      value={sellCost}
                      onChange={(e) => setSellCost(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-white border border-indigo-400 rounded-md px-2 py-1 text-xs text-indigo-950 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                      ADVANCE PAYMENT (Advan Pay)
                    </label>
                    <input
                      type="number"
                      value={advanPay}
                      onChange={(e) => setAdvanPay(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Packing Charges
                    </label>
                    <input
                      type="number"
                      value={packingCharges}
                      onChange={(e) => setPackingCharges(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Forwarding Charges
                    </label>
                    <input
                      type="number"
                      value={forwardingCharges}
                      onChange={(e) => setForwardingCharges(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      GST % (Standard 18%)
                    </label>
                    <input
                      type="number"
                      value={gst}
                      onChange={(e) => setGst(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <label className="block text-[10px] font-semibold text-slate-600">
                        GST Calculated
                      </label>
                      {isGstAmountOverridden ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsGstAmountOverridden(false);
                            setManualGstAmount('');
                          }}
                          className="text-[9px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-1.5 py-0.5 rounded border border-amber-300 flex items-center gap-0.5 cursor-pointer shadow-2xs transition"
                          title="Reset to formula: Sell Cost * GST %"
                        >
                          ✏️ Custom • ↺
                        </button>
                      ) : (
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-0.5">
                          Auto • Edit
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <span className="text-xs font-bold text-slate-500 absolute left-2 pointer-events-none select-none">
                        ₹
                      </span>
                      <input
                        id="gst-calculated-input"
                        type="number"
                        value={isGstAmountOverridden ? manualGstAmount : (gstAmount || 0)}
                        onChange={(e) => {
                          setIsGstAmountOverridden(true);
                          setManualGstAmount(e.target.value === '' ? '' : Number(e.target.value));
                        }}
                        onFocus={() => {
                          if (!isGstAmountOverridden) {
                            setIsGstAmountOverridden(true);
                            setManualGstAmount(gstAmount);
                          }
                        }}
                        placeholder="0"
                        className={`w-full bg-white border ${
                          isGstAmountOverridden ? 'border-amber-400 bg-amber-50/40 text-amber-950 font-bold' : 'border-slate-300 text-slate-900 font-semibold'
                        } rounded-md pl-5 pr-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs`}
                      />
                    </div>
                  </div>
                </div>

                {/* Real-time Result Tiles (Calculated & Editable) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {/* OVER ALL AMOU */}
                  <div className="p-2.5 rounded-lg bg-indigo-50/90 border border-indigo-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p className="text-[10px] font-bold text-indigo-900 uppercase">OVER ALL AMOU</p>
                      {isOverallOverridden ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsOverallOverridden(false);
                            setManualOverall('');
                          }}
                          className="text-[9px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-1.5 py-0.5 rounded border border-amber-300 flex items-center gap-0.5 cursor-pointer shadow-2xs transition"
                          title="Reset to formula"
                        >
                          ✏️ Custom • ↺
                        </button>
                      ) : (
                        <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100/70 px-1.5 py-0.5 rounded border border-indigo-200 flex items-center gap-0.5">
                          <Edit3 className="w-2.5 h-2.5" /> Auto • Edit
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center my-0.5">
                      <span className="text-xs font-bold text-indigo-700 absolute left-2 pointer-events-none select-none">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={isOverallOverridden ? manualOverall : (overallAmount || 0)}
                        onChange={(e) => {
                          setIsOverallOverridden(true);
                          setManualOverall(e.target.value === '' ? '' : Number(e.target.value));
                        }}
                        onFocus={() => {
                          if (!isOverallOverridden) {
                            setIsOverallOverridden(true);
                            setManualOverall(overallAmount);
                          }
                        }}
                        className="w-full bg-white border border-indigo-300 rounded-md pl-5 pr-1.5 py-1 text-sm font-black text-indigo-950 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                      />
                    </div>
                    <p className="text-[9px] text-indigo-700">Sell + GST + Pck + Fwd</p>
                  </div>

                  {/* Balance Due */}
                  <div className="p-2.5 rounded-lg bg-amber-50/90 border border-amber-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p className="text-[10px] font-bold text-amber-900 uppercase">Balance Due</p>
                      {isBalanceOverridden ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsBalanceOverridden(false);
                            setManualBalance('');
                          }}
                          className="text-[9px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-1.5 py-0.5 rounded border border-amber-300 flex items-center gap-0.5 cursor-pointer shadow-2xs transition"
                          title="Reset to formula"
                        >
                          ✏️ Custom • ↺
                        </button>
                      ) : (
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-0.5">
                          <Edit3 className="w-2.5 h-2.5" /> Auto • Edit
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center my-0.5">
                      <span className="text-xs font-bold text-amber-700 absolute left-2 pointer-events-none select-none">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={isBalanceOverridden ? manualBalance : (balance || 0)}
                        onChange={(e) => {
                          setIsBalanceOverridden(true);
                          setManualBalance(e.target.value === '' ? '' : Number(e.target.value));
                        }}
                        onFocus={() => {
                          if (!isBalanceOverridden) {
                            setIsBalanceOverridden(true);
                            setManualBalance(balance);
                          }
                        }}
                        className="w-full bg-white border border-amber-300 rounded-md pl-5 pr-1.5 py-1 text-sm font-black text-amber-950 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
                      />
                    </div>
                    <p className="text-[9px] text-amber-700">Overall - ADVANCE PAYMENT</p>
                  </div>

                  {/* Gross Profit / Margin */}
                  <div className="p-2.5 rounded-lg bg-emerald-50/90 border border-emerald-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p className="text-[10px] font-bold text-emerald-900 uppercase">Gross Profit</p>
                      {isProfitOverridden ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfitOverridden(false);
                            setManualProfit('');
                          }}
                          className="text-[9px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-1.5 py-0.5 rounded border border-amber-300 flex items-center gap-0.5 cursor-pointer shadow-2xs transition"
                          title="Reset to formula"
                        >
                          ✏️ Custom • ↺
                        </button>
                      ) : (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                          <Edit3 className="w-2.5 h-2.5" /> Auto • Edit
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center my-0.5">
                      <span className="text-xs font-bold text-emerald-700 absolute left-2 pointer-events-none select-none">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={isProfitOverridden ? manualProfit : (grossProfit || 0)}
                        onChange={(e) => {
                          setIsProfitOverridden(true);
                          setManualProfit(e.target.value === '' ? '' : Number(e.target.value));
                        }}
                        onFocus={() => {
                          if (!isProfitOverridden) {
                            setIsProfitOverridden(true);
                            setManualProfit(grossProfit);
                          }
                        }}
                        className="w-full bg-white border border-emerald-300 rounded-md pl-5 pr-1.5 py-1 text-sm font-black text-emerald-950 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                      />
                    </div>
                    <p className="text-[9px] text-emerald-700">SELLING COST - PURCHASE COST - LANDING COST ({grossMargin}%)</p>
                  </div>
                </div>
              </div>

              {/* Status Section with + Add Status & Rename */}
              <StatusSelector
                value={itemStatus}
                onChange={(newText, newCat) => {
                  setItemStatus(newText);
                  setStatusCategory(newCat);
                }}
                required
              />

              {/* Remarks */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Notes / Tracking Docket (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Docket #98765 via Professional Courier"
                  className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-900"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                    title="Cannot fill full form now? Save in half to reopen & finish later!"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save as Draft</span>
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
