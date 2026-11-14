import { getStaffAvatarUrl } from '../utils/staffAvatars';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Plus, Zap, CheckCircle2, Clock } from 'lucide-react';
import { useSales } from '../context/SalesContext';
import type { ReportingCycle } from '../types';

interface CycleManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function getNextCycleRecommendation(existingCycles: ReportingCycle[]) {
  if (!existingCycles || existingCycles.length === 0) {
    return {
      month: '2026-11',
      cycleNumber: 2 as const,
      startDate: '2026-11-11',
      endDate: '2026-11-20',
      name: 'Nov 11 - Nov 20, 2026 (Cycle 2)',
    };
  }

  // Sort cycles by startDate ascending
  const sorted = [...existingCycles].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const latest = sorted[sorted.length - 1];

  const [yStr, mStr] = latest.month.split('-');
  let nextYear = parseInt(yStr, 10) || 2026;
  let nextMonth = parseInt(mStr, 10) || 11;
  let nextCycleNumber: 1 | 2 | 3 = 1;

  if (latest.cycleNumber === 1) {
    nextCycleNumber = 2;
  } else if (latest.cycleNumber === 2) {
    nextCycleNumber = 3;
  } else {
    nextCycleNumber = 1;
    nextMonth += 1;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
  }

  const monthStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
  const lastDayOfMonth = new Date(nextYear, nextMonth, 0).getDate();

  let startDate = '';
  let endDate = '';
  if (nextCycleNumber === 1) {
    startDate = `${monthStr}-01`;
    endDate = `${monthStr}-10`;
  } else if (nextCycleNumber === 2) {
    startDate = `${monthStr}-11`;
    endDate = `${monthStr}-20`;
  } else {
    startDate = `${monthStr}-21`;
    endDate = `${monthStr}-${String(lastDayOfMonth).padStart(2, '0')}`;
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[nextMonth - 1];
  const startDay = nextCycleNumber === 1 ? '01' : nextCycleNumber === 2 ? '11' : '21';
  const endDay = nextCycleNumber === 1 ? '10' : nextCycleNumber === 2 ? '20' : String(lastDayOfMonth).padStart(2, '0');
  const name = `${monthName} ${startDay} - ${monthName} ${endDay}, ${nextYear} (Cycle ${nextCycleNumber})`;

  return {
    month: monthStr,
    cycleNumber: nextCycleNumber,
    startDate,
    endDate,
    name,
  };
}

export const CycleManagerModal: React.FC<CycleManagerModalProps> = ({ isOpen, onClose }) => {
  const { cycles, addCycle, setActiveCycle, setSelectedCycleId, selectedCycleId, sales, reps } = useSales();

  const [cycleName, setCycleName] = useState('');
  const [month, setMonth] = useState('2026-11');
  const [cycleNumber, setCycleNumber] = useState<1 | 2 | 3>(2);
  const [startDate, setStartDate] = useState('2026-11-11');
  const [endDate, setEndDate] = useState('2026-11-20');
  const [isAdding, setIsAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const nextRec = useMemo(() => getNextCycleRecommendation(cycles), [cycles]);

  const handleQuickAdd = () => {
    addCycle({
      name: nextRec.name,
      month: nextRec.month,
      cycleNumber: nextRec.cycleNumber,
      startDate: nextRec.startDate,
      endDate: nextRec.endDate,
      isCurrent: true,
    });
    setSuccessMsg(`Added "${nextRec.name}" as active timing!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedName =
      cycleName.trim() ||
      `${month} - Days ${cycleNumber === 1 ? '01-10' : cycleNumber === 2 ? '11-20' : '21-End'} (Cycle ${cycleNumber})`;

    addCycle({
      name: generatedName,
      month,
      cycleNumber,
      startDate,
      endDate,
      isCurrent: true,
    });

    setIsAdding(false);
    setCycleName('');
    setSuccessMsg(`Added "${generatedName}" successfully!`);
    setTimeout(() => setSuccessMsg(''), 3000);
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
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="relative w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50/90">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">10-Day Reporting Cycles & Timing</h3>
                  <p className="text-[11px] text-slate-500">Add and manage 10-day payment intervals and countdown timing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Notification Banner */}
              {successMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                <div>
                  <span className="text-[11px] font-bold text-indigo-900 block">
                    Next Recommended Period:
                  </span>
                  <span className="text-xs font-extrabold text-indigo-700">
                    {nextRec.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleQuickAdd}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                    title={`Click to immediately add ${nextRec.name}`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>+ Quick-Add Next Cycle</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdding(!isAdding)}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-600" />
                    <span>{isAdding ? 'Close Form' : 'Custom Dates'}</span>
                  </button>
                </div>
              </div>

              {/* Custom Cycle Add Form */}
              {isAdding && (
                <form
                  onSubmit={handleCreateCustom}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Create Custom 10-Day Period</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                        Month
                      </label>
                      <input
                        type="month"
                        value={month}
                        onChange={(e) => {
                          const m = e.target.value;
                          setMonth(m);
                          if (cycleNumber === 1) {
                            setStartDate(`${m}-01`);
                            setEndDate(`${m}-10`);
                          } else if (cycleNumber === 2) {
                            setStartDate(`${m}-11`);
                            setEndDate(`${m}-20`);
                          } else {
                            const [y, mon] = m.split('-').map(Number);
                            const lastD = new Date(y, mon, 0).getDate();
                            setStartDate(`${m}-21`);
                            setEndDate(`${m}-${String(lastD).padStart(2, '0')}`);
                          }
                        }}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                        Slot in Month
                      </label>
                      <select
                        value={cycleNumber}
                        onChange={(e) => {
                          const num = Number(e.target.value) as 1 | 2 | 3;
                          setCycleNumber(num);
                          if (num === 1) {
                            setStartDate(`${month}-01`);
                            setEndDate(`${month}-10`);
                          } else if (num === 2) {
                            setStartDate(`${month}-11`);
                            setEndDate(`${month}-20`);
                          } else {
                            const [y, mon] = month.split('-').map(Number);
                            const lastD = new Date(y, mon, 0).getDate();
                            setStartDate(`${month}-21`);
                            setEndDate(`${month}-${String(lastD).padStart(2, '0')}`);
                          }
                        }}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      >
                        <option value={1}>Days 01-10 (Cycle 1)</option>
                        <option value={2}>Days 11-20 (Cycle 2)</option>
                        <option value={3}>Days 21-End of Month (Cycle 3)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Display Title (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder={`e.g. ${month} - Days 11-20 (Cycle ${cycleNumber})`}
                      value={cycleName}
                      onChange={(e) => setCycleName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded cursor-pointer shadow-xs"
                    >
                      Save & Activate Cycle
                    </button>
                  </div>
                </form>
              )}

              {/* Cycle Windows List */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {cycles.map((c) => {
                  const cycleSales = sales.filter((s) => s.cycleId === c.id);
                  const totalRevenue = cycleSales.reduce((acc, s) => acc + (s.overallAmount || 0), 0);
                  const repsFilled = new Set(cycleSales.map((s) => s.purchaserName.toLowerCase())).size;
                  const isCurrentActive = Boolean(c.isCurrent);
                  const isFiltered = selectedCycleId === c.id;

                  return (
                    <div
                      key={c.id}
                      className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                        isCurrentActive
                          ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200'
                          : isFiltered
                          ? 'bg-indigo-50/60 border-indigo-300 ring-1 ring-indigo-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs">{c.name}</span>
                          {isCurrentActive && (
                            <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-ping" />
                              Active Timer
                            </span>
                          )}
                          {isFiltered && !isCurrentActive && (
                            <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.2 rounded-full">
                              Currently Filtered
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-slate-600">{c.startDate} to {c.endDate}</span>
                          <span>•</span>
                          <span className="font-bold text-indigo-700 font-mono">
                            ₹{totalRevenue.toLocaleString('en-IN')}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="flex -space-x-1.5">
                              {Array.from(new Set(cycleSales.map((s) => s.purchaserName.toLowerCase()))).map((pName) => {
                                const url = getStaffAvatarUrl(pName, reps);
                                return (
                                  <div
                                    key={pName}
                                    className="w-4 h-4 rounded-full overflow-hidden border border-white ring-1 ring-indigo-400 bg-slate-700 shadow-2xs"
                                    title={pName}
                                  >
                                    {url ? (
                                      <img src={url} alt={pName} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full text-[8px] text-white flex items-center justify-center font-bold">
                                        {pName.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {repsFilled}/{reps.length} reps submitted
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {!isCurrentActive ? (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveCycle(c.id);
                              setSuccessMsg(`Set "${c.name}" as active live timer!`);
                              setTimeout(() => setSuccessMsg(''), 3000);
                            }}
                            title="Set this cycle as the active cycle for the countdown timer"
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-300 hover:border-emerald-300 transition cursor-pointer"
                          >
                            Set Active
                          </button>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCycleId(c.id);
                            onClose();
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                            isFiltered
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {isFiltered ? 'Viewing' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
