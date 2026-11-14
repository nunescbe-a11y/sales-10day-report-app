import React, { useState } from 'react';
import { Plus, Check, X, Pencil, Trash2 } from 'lucide-react';
import { useSales } from '../context/SalesContext';
import type { StatusCategory } from '../types';

interface StatusSelectorProps {
  value: string;
  onChange: (text: string, category: StatusCategory) => void;
  required?: boolean;
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  value,
  onChange,
  required = true,
}) => {
  const { statusOptions, addStatusOption, renameStatusOption, deleteStatusOption, theme } = useSales();
  const isDark = theme === 'dark';

  // Add new status state
  const [isAdding, setIsAdding] = useState(false);
  const [newStatusText, setNewStatusText] = useState('');
  const [newCategory, setNewCategory] = useState<StatusCategory>('Dispatched');

  // Editing existing status state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatusText, setEditStatusText] = useState('');

  const handleStartAdd = () => {
    setIsAdding(true);
    setNewStatusText('');
    setNewCategory('Dispatched');
  };

  const handleConfirmAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newStatusText.trim();
    if (!clean) return;

    addStatusOption(clean, newCategory);
    onChange(clean, newCategory);
    setIsAdding(false);
    setNewStatusText('');
  };

  const handleStartRename = (id: string, currentText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditStatusText(currentText);
  };

  const handleConfirmRename = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = editStatusText.trim();
    if (!clean) return;

    renameStatusOption(id, clean);
    const opt = statusOptions.find((s) => s.id === id);
    const optTxt = opt ? (opt.text || (opt as any).label || '') : '';
    if ((value || '').trim().toLowerCase() === optTxt.trim().toLowerCase()) {
      onChange(clean, opt?.category || 'Dispatched');
    }
    setEditingId(null);
  };

  const handleDelete = (id: string, statusText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete status option "${statusText}"?`)) {
      deleteStatusOption(id);
      if ((value || '').trim().toLowerCase() === (statusText || '').trim().toLowerCase()) {
        onChange('', 'Dispatched');
      }
    }
  };

  return (
    <div className="space-y-2">
      {/* Header with Title and '+ Add Status' Button */}
      <div className="flex items-center justify-between">
        <label className={`text-xs font-extrabold tracking-tight flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <span>ITEM STATUS</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>

        {/* The + Add Status Button requested by user */}
        {!isAdding && (
          <button
            type="button"
            onClick={handleStartAdd}
            className={`flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-full border shadow-2xs transition cursor-pointer ${
              isDark 
                ? 'bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border-indigo-700/60' 
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
            }`}
          >
            <Plus className="w-3 h-3 text-indigo-400" />
            <span>Add Status</span>
          </button>
        )}
      </div>

      {/* Inline Add Box when '+' is clicked */}
      {isAdding && (
        <div
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleConfirmAdd();
            }
          }}
          className={`p-2.5 rounded-xl border space-y-2 animate-in fade-in duration-150 ${
            isDark 
              ? 'bg-zinc-900/90 border-indigo-700/60' 
              : 'bg-blue-50/70 border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${isDark ? 'text-indigo-300' : 'text-blue-900'}`}>
              <Plus className="w-3 h-3 text-indigo-400" />
              Add Custom Item Status
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-200 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              autoFocus
              value={newStatusText}
              onChange={(e) => setNewStatusText(e.target.value)}
              placeholder="e.g. Sent for Calibration, Waiting for QC approval..."
              className={`flex-1 rounded-md px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 border ${
                isDark 
                  ? 'bg-zinc-950 border-zinc-700 text-white placeholder-slate-500' 
                  : 'bg-white border-blue-300 text-slate-900 placeholder-slate-400'
              }`}
              required
            />

            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as StatusCategory)}
              className={`rounded-md px-2 py-1 text-[11px] font-medium border ${
                isDark 
                  ? 'bg-zinc-950 border-zinc-700 text-white' 
                  : 'bg-white border-blue-300 text-slate-700'
              }`}
            >
              <option value="Dispatched">Dispatched</option>
              <option value="Pending Dispatch">Pending Dispatch</option>
              <option value="Delivered / Saled">Delivered / Saled</option>
              <option value="Partial Supply">Partial Supply</option>
              <option value="Order Placed">Order Placed</option>
            </select>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleConfirmAdd()}
                className="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md text-xs font-bold flex items-center gap-1 shadow-2xs transition cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className={`px-2 py-1 rounded-md text-xs font-semibold border transition cursor-pointer ${
                  isDark 
                    ? 'bg-zinc-800 text-slate-300 border-zinc-700 hover:bg-zinc-700' 
                    : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Chips List */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {statusOptions.map((opt) => {
          const optText = opt.text || (opt as any).label || '';
          const isSelected = (value || '').trim().toLowerCase() === optText.trim().toLowerCase();
          const isEditing = editingId === opt.id;

          if (isEditing) {
            return (
              <div
                key={opt.id}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleConfirmRename(opt.id);
                  }
                }}
                className={`inline-flex items-center gap-1 rounded-lg p-0.5 shadow-xs border ${
                  isDark 
                    ? 'bg-zinc-900 border-indigo-500' 
                    : 'bg-white border-blue-500'
                }`}
              >
                <input
                  type="text"
                  autoFocus
                  value={editStatusText}
                  onChange={(e) => setEditStatusText(e.target.value)}
                  className={`px-2 py-0.5 text-xs font-medium focus:outline-none min-w-[140px] bg-transparent ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  title="Save Rename"
                  onClick={() => handleConfirmRename(opt.id)}
                  className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  title="Cancel"
                  onClick={() => setEditingId(null)}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          }

          return (
            <div
              key={opt.id}
              onClick={() => onChange(optText, opt.category)}
              className={`group relative inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-500 text-white font-extrabold shadow-sm shadow-indigo-600/30'
                  : isDark
                  ? 'bg-[#0E1017] border border-zinc-700/80 text-slate-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800 font-medium'
                  : 'bg-white border border-slate-300/80 text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-medium'
              }`}
            >
              <span>{optText}</span>

              {/* Action Buttons to Rename & Delete - discrete on hover */}
              <div
                className={`flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5`}
              >
                <button
                  type="button"
                  title={`Rename "${optText}"`}
                  onClick={(e) => handleStartRename(opt.id, optText, e)}
                  className={`p-0.5 rounded hover:scale-110 transition cursor-pointer ${
                    isSelected 
                      ? 'hover:bg-indigo-700 text-indigo-100' 
                      : isDark
                      ? 'hover:bg-zinc-700 text-slate-400 hover:text-white'
                      : 'hover:bg-slate-200 text-slate-500'
                  }`}
                >
                  <Pencil className="w-2.5 h-2.5" />
                </button>
                {statusOptions.length > 2 && (
                  <button
                    type="button"
                    title={`Delete "${optText}"`}
                    onClick={(e) => handleDelete(opt.id, optText, e)}
                    className={`p-0.5 rounded hover:scale-110 transition cursor-pointer ${
                      isSelected 
                        ? 'hover:bg-rose-700 text-rose-100' 
                        : isDark
                        ? 'hover:bg-rose-950 text-rose-400'
                        : 'hover:bg-rose-100 text-rose-500'
                    }`}
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Editable Text Input below chips (as in original user screenshot) */}
      <div className="relative">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value, 'Dispatched')}
          placeholder="e.g. Item dispatched by supplier, dispatched by 30/10/26, saled..."
          className={`w-full rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition font-medium border ${
            isDark 
              ? 'bg-[#0E1017] border-zinc-700/80 text-white placeholder-slate-500' 
              : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
          }`}
          required={required}
        />
      </div>
    </div>
  );
};
