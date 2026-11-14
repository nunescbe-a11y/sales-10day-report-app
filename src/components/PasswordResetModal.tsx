import { getStaffAvatarUrl } from '../utils/staffAvatars';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, KeyRound, Check, AlertCircle } from 'lucide-react';
import { useSales } from '../context/SalesContext';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUsername?: string;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
  defaultUsername = '',
}) => {
  const { resetPassword } = useSales();

  const [username, setUsername] = useState(defaultUsername);
  useEffect(() => {
    if (isOpen) {
      setUsername(defaultUsername);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [defaultUsername, isOpen]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim()) {
      setErrorMsg('Please enter an employee or MD username');
      return;
    }
    if (newPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    const ok = resetPassword(username.trim().toLowerCase(), newPassword.trim());
    if (ok) {
      setSuccessMsg(`Password for "${username.trim()}" successfully updated!`);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
        setNewPassword('');
        setConfirmPassword('');
      }, 1500);
    } else {
      setErrorMsg(`User "${username}" not found. Available: md, yazhini, naveena, janani`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
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
            className="relative w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Reset Account Password</h3>
                  <p className="text-[10px] text-slate-500">Update employee or MD security password</p>
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

            <form onSubmit={handleReset} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Employee Username / ID
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. yazhini, naveena, janani, or md"
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium"
                    required
                  />
                  {getStaffAvatarUrl(username) && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500 shadow-xs ring-1 ring-indigo-200 shrink-0" title={username}>
                      <img src={getStaffAvatarUrl(username)} alt={username} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 4 chars)"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  required
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px]">{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px]">{successMsg}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  Update Password
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
