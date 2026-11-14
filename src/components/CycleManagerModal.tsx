import { getStaffAvatarUrl } from '../utils/staffAvatars';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Plus } from 'lucide-react';
import { useSales } from '../context/SalesContext';

interface CycleManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CycleManagerModal: React.FC<CycleManagerModalProps> = ({ isOpen, onClose }) => {
  const { cycles, addCycle, setSelectedCycleId, selectedCycleId, sales, reps } = useSales();

  const [cycleName, setCycleName] = useState('');
  const [month, setMonth] = useState('2026-11');
  const [cycleNumber, setCycleNumber] = useState<1 | 2 | 3>(2);
  const [startDate, setStartDate] = useState('2026-11-11');
  const [endDate, setEndDate] = useState('2026-11-20');
  const [isAdding, setIsAdding] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
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
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">10-Day Reporting Cycles</h3>
                  <p className="text-[11px] text-slate-500">Manage 10-day payment intervals</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Cycle Windows
                </span>
                <button
                  onClick={() => setIsAdding(!isAdding)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isAdding ? 'Cancel' : 'Create 10-Day Period'}
                </button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {cycles.map((c) => {
                  const cycleSales = sales.filter((s) => s.cycleId === c.id);
                  const totalRevenue = cycleSales.reduce((acc, s) => acc + s.overallAmount, 0);
                  const repsFilled = new Set(cycleSales.map((s) => s.purchaserName.toLowerCase())).size;

                  return (
                    <div
                      key={c.id}
                      className={`p-3 rounded-lg border transition flex items-center justify-between ${
                        selectedCycleId === c.id
                          ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{c.name}</span>
                          {c.isCurrent && (
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span>{c.startDate} to {c.endDate}</span>
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
                                  <div key={pName} className="w-4 h-4 rounded-full overflow-hidden border border-white ring-1 ring-indigo-400 bg-slate-700 shadow-2xs" title={pName}>
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
                            <span>{repsFilled}/{reps.length} reps submitted</span>
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCycleId(c.id);
                          onClose();
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-semibold border transition ${
                          selectedCycleId === c.id
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {selectedCycleId === c.id ? 'Active' : 'Select'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {isAdding && (
                <form
                  onSubmit={handleCreate}
                  className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-3"
                >
                  <h4 className="text-xs font-bold text-slate-900">Add Next 10-Day Period</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                        Month
                      </label>
                      <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                        Slot
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
                            setStartDate(`${month}-21`);
                            setEndDate(`${month}-31`);
                          }
                        }}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      >
                        <option value={1}>Days 01-10</option>
                        <option value={2}>Days 11-20</option>
                        <option value={3}>Days 21-End</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded"
                    >
                      Save Cycle
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
