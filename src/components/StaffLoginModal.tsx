import { getStaffAvatarUrl } from '../utils/staffAvatars';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck, KeyRound, Check, ArrowRight, Crown } from 'lucide-react';
import { useSales } from '../context/SalesContext';
import type { SalesRep } from '../types';

interface StaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({ isOpen, onClose }) => {
  const { reps, currentRole, setCurrentRole, loginWithCredentials, theme } = useSales();
  const isDark = theme === 'dark';

  const [selectedRep, setSelectedRep] = useState<SalesRep | null>(null);
  const [pinOrPassword, setPinOrPassword] = useState('');
  const [error, setError] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);

  const handleQuickSelect = (rep: SalesRep) => {
    setCurrentRole(rep.name);
    setError('');
    onClose();
  };

  const handleSelectMD = () => {
    setCurrentRole('MD');
    setError('');
    onClose();
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRep) return;

    // Check PIN or password
    const result = loginWithCredentials(selectedRep.username, pinOrPassword);
    if (result.success) {
      setCurrentRole(selectedRep.name);
      setError('');
      setPinOrPassword('');
      setShowPinInput(false);
      setSelectedRep(null);
      onClose();
    } else {
      // Also accept PIN check
      if (pinOrPassword.trim() === selectedRep.pin) {
        setCurrentRole(selectedRep.name);
        setError('');
        setPinOrPassword('');
        setShowPinInput(false);
        setSelectedRep(null);
        onClose();
      } else {
        setError('Incorrect PIN or password. (Default PIN: 1234)');
      }
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className={`relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border transition-colors z-10 ${
              isDark 
                ? 'bg-[#12141F] border-white/10 text-white' 
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className={`px-5 py-3.5 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'bg-[#161824] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black leading-tight">
                    Staff Login & Profile Switcher
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Click your profile photo to log in directly to your 10-day workspace
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
              {/* Optional PIN Prompt if user clicked "Enter with PIN" */}
              {showPinInput && selectedRep ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4 p-5 rounded-2xl border border-indigo-200 bg-indigo-50/50">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-600 shadow-md shrink-0">
                      {selectedRep.avatarUrl || getStaffAvatarUrl(selectedRep.name, reps) ? (
                        <img src={selectedRep.avatarUrl || getStaffAvatarUrl(selectedRep.name, reps)} alt={selectedRep.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full ${selectedRep.avatarColor} text-white font-black text-lg flex items-center justify-center`}>
                          {selectedRep.displayName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{selectedRep.displayName}</h4>
                      <p className="text-xs text-slate-500">Enter PIN (default 1234) or password to unlock</p>
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        autoFocus
                        value={pinOrPassword}
                        onChange={(e) => {
                          setPinOrPassword(e.target.value);
                          setError('');
                        }}
                        placeholder="Enter 4-digit PIN (1234)"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    {error && (
                      <p className="text-xs text-rose-600 font-semibold mt-1.5">{error}</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPinInput(false);
                        setSelectedRep(null);
                        setError('');
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                    >
                      ← Back to Profile Selection
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickSelect(selectedRep)}
                        className="px-3 py-2 text-xs font-bold text-indigo-700 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50"
                      >
                        Quick Access (No PIN)
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        Log In Now
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <>
                  {/* Grid of Staff Profiles with REAL PHOTOS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {reps.map((rep) => {
                      const isActive = currentRole.toLowerCase() === rep.name.toLowerCase();
                      return (
                        <div
                          key={rep.id}
                          onClick={() => handleQuickSelect(rep)}
                          className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer select-none flex items-center gap-4 ${
                            isActive
                              ? 'border-indigo-600 bg-indigo-50/60 shadow-md ring-2 ring-indigo-500/20'
                              : isDark
                              ? 'border-white/10 bg-[#161824] hover:border-indigo-500/60 hover:bg-[#1a1d2c]'
                              : 'border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md hover:bg-slate-50/80'
                          }`}
                        >
                          {/* Profile Image with high quality circular display */}
                          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md shrink-0 transition-transform group-hover:scale-105">
                            {rep.avatarUrl || getStaffAvatarUrl(rep.name, reps) ? (
                              <img
                                src={rep.avatarUrl || getStaffAvatarUrl(rep.name, reps)}
                                alt={rep.displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className={`w-full h-full ${rep.avatarColor || 'bg-indigo-600'} text-white font-black text-xl flex items-center justify-center`}
                              >
                                {rep.displayName.charAt(0)}
                              </div>
                            )}
                            {isActive && (
                              <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-base font-black truncate text-slate-900 group-hover:text-indigo-600 transition">
                                {rep.displayName}
                              </h4>
                              {isActive && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                              Staff ID: <span className="font-mono font-bold text-slate-700">{rep.name}</span>
                            </p>
                            <p className="text-xs font-semibold text-emerald-700 mt-1">
                              Target: <span className="font-mono font-bold">₹{rep.targetAmount.toLocaleString('en-IN')}</span>
                            </p>
                          </div>

                          {/* Enter Arrow */}
                          <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-500 transition">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* MD All-Company Access Option */}
                  <div
                    onClick={handleSelectMD}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      currentRole === 'MD'
                        ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
                        : isDark
                        ? 'border-white/10 bg-[#161824] hover:border-amber-500/60'
                        : 'border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-black shadow-sm shrink-0">
                        <Crown className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                          Managing Director (MD View)
                          {currentRole === 'MD' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold border border-amber-200">
                              Active
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          Executive All-Company Master Sheet, Analytics & Submissions
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-amber-500 hover:text-white transition">
                      Switch to MD
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className={`px-6 py-3 border-t text-center text-xs text-slate-500 ${
              isDark ? 'bg-[#161824] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="font-semibold text-slate-700">Tip:</span> You can also switch profiles anytime using the View dropdown in the header!
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
