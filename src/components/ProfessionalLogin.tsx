import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSpreadsheet,
  Eye,
  EyeOff,
  Crown,
  ArrowRight,
  AlertCircle,
  Users,
  Wifi,
  Lock,
} from 'lucide-react';
import { useSales } from '../context/SalesContext';
import { getStaffAvatarUrl } from '../utils/staffAvatars';
import type { SalesRep } from '../types';

type SelectedIdentity =
  | { type: 'MD'; displayName: string; username: string; roleLabel: string }
  | { type: 'REP'; rep: SalesRep };

export const ProfessionalLogin: React.FC = () => {
  const { reps, loginWithCredentials, syncStatus } = useSales();

  const [selected, setSelected] = useState<SelectedIdentity | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showHelpNote, setShowHelpNote] = useState(false);
  const [nowText, setNowText] = useState('');
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // macOS top menu bar live clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setNowText(
        now.toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })
      );
    };
    updateClock();
    const t = setInterval(updateClock, 15000);
    return () => clearInterval(t);
  }, []);

  const handleSelectMD = () => {
    setSelected({
      type: 'MD',
      displayName: 'Managing Director',
      username: 'md',
      roleLabel: 'Executive All-Company Oversight',
    });
    setPassword('');
    setError('');
    setShowHelpNote(false);
    setTimeout(() => passwordInputRef.current?.focus(), 80);
  };

  const handleSelectRep = (rep: SalesRep) => {
    setSelected({ type: 'REP', rep });
    setPassword('');
    setError('');
    setShowHelpNote(false);
    setTimeout(() => passwordInputRef.current?.focus(), 80);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (!password.trim()) {
      setError('Enter your password or PIN');
      passwordInputRef.current?.focus();
      return;
    }

    const usernameToVerify =
      selected.type === 'MD' ? 'md' : selected.rep.username || selected.rep.name;

    const result = loginWithCredentials(usernameToVerify, password);
    if (!result.success) {
      setError(result.error || 'Incorrect password. Try again.');
    } else {
      setError('');
      setPassword('');
      setShowHelpNote(false);
    }
  };

  const selectedAvatarUrl =
    selected?.type === 'REP'
      ? getStaffAvatarUrl(selected.rep.name, reps) || selected.rep.avatarUrl
      : undefined;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#F5F5F7] via-[#FFFFFF] to-[#EEF1F6] text-slate-900 flex flex-col justify-between font-sans select-none">
      {/* Apple macOS-style Light Menu Bar */}
      <header className="w-full h-9 px-4 sm:px-6 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-2xs">
            <FileSpreadsheet className="w-3 h-3" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">
            Nunes Sales Hub
          </span>
          <span className="hidden sm:inline text-slate-400">&bull;</span>
          <span className="hidden sm:inline text-slate-500 font-medium">
            10-Day Reporting Portal
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-700 font-medium">
          <span
            className="inline-flex items-center gap-1.5 text-[11px]"
            title="Live Sync Status"
          >
            <Wifi
              className={`w-3.5 h-3.5 ${
                syncStatus === 'offline' ? 'text-rose-500' : 'text-emerald-600'
              }`}
            />
            <span className="hidden sm:inline">
              {syncStatus === 'offline' ? 'Offline' : 'Connected'}
            </span>
          </span>
          <span className="text-[11px] font-semibold text-slate-800">
            {nowText}
          </span>
        </div>
      </header>

      {/* Center Stage: Apple Desktop Login Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          {!selected ? (
            /* MULTI-USER APPLE DESKTOP LOGIN ROW */
            <motion.div
              key="apple-user-picker"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-3xl text-center space-y-8"
            >
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/90 shadow-2xs text-[11px] font-semibold text-slate-600 mb-2">
                  <Lock className="w-3 h-3 text-slate-500" />
                  Select Your Account to Continue
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Who is signing in?
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Click your profile photo below. After signing in, you will open strictly inside your own account.
                </p>
              </div>

              {/* Horizontal Apple Desktop Circular Portraits Row */}
              <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-8">
                {reps.filter(r => r.id !== 'naveena' && r.name !== 'naveena' && r.id !== 'ready stock' && r.name !== 'ready stock' && r.id !== 'pranesh').map((rep) => {
                  const avatarUrl =
                    getStaffAvatarUrl(rep.name, reps) || rep.avatarUrl;
                  return (
                    <button
                      key={rep.id}
                      type="button"
                      onClick={() => handleSelectRep(rep)}
                      className="group flex flex-col items-center gap-2.5 w-24 sm:w-28 cursor-pointer focus:outline-none"
                    >
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-[3px] border-white ring-1 ring-slate-200 shadow-lg group-hover:scale-105 group-hover:ring-2 group-hover:ring-indigo-500 group-hover:shadow-xl transition-all duration-200 bg-white">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={rep.displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-full h-full ${
                              rep.avatarColor || 'bg-indigo-600'
                            } text-white font-bold text-2xl flex items-center justify-center`}
                          >
                            {rep.displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <span className="block text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                          {rep.displayName}
                        </span>
                        <span className="block text-[11px] font-semibold text-slate-500">
                          {rep.id === 'vengateshan' ? '⭐ Team Lead (Full Access)' : 'Sales Rep'}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {/* Managing Director Portrait Card */}
                <button
                  type="button"
                  onClick={handleSelectMD}
                  className="group flex flex-col items-center gap-2.5 w-24 sm:w-28 cursor-pointer focus:outline-none"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 border-[3px] border-white ring-1 ring-amber-200 shadow-lg group-hover:scale-105 group-hover:ring-2 group-hover:ring-amber-500 group-hover:shadow-xl transition-all duration-200 flex items-center justify-center text-white">
                    <Crown className="w-9 h-9 drop-shadow-xs" />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-slate-900 group-hover:text-amber-600 transition">
                      MD Executive
                    </span>
                    <span className="block text-[11px] text-slate-500 font-medium">
                      Director
                    </span>
                  </div>
                </button>
              </div>
            </motion.div>
          ) : (
            /* FOCUSED APPLE DESKTOP PASSWORD UNLOCK VIEW */
            <motion.div
              key="apple-password-unlock"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm flex flex-col items-center text-center"
            >
              {/* Large Centered Circular Hero Avatar */}
              <div className="relative mb-4">
                {selected.type === 'REP' ? (
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white ring-1 ring-slate-200 shadow-2xl bg-white">
                    {selectedAvatarUrl ? (
                      <img
                        src={selectedAvatarUrl}
                        alt={selected.rep.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full ${
                          selected.rep.avatarColor || 'bg-indigo-600'
                        } text-white font-bold text-3xl flex items-center justify-center`}
                      >
                        {selected.rep.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 border-4 border-white ring-1 ring-amber-200 shadow-2xl flex items-center justify-center text-white">
                    <Crown className="w-11 h-11 drop-shadow-xs" />
                  </div>
                )}
              </div>

              {/* Clean Apple-Style User Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {selected.type === 'MD'
                  ? selected.displayName
                  : selected.rep.displayName}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5 mb-5">
                {selected.type === 'MD'
                  ? selected.roleLabel
                  : `Personal Account (@${selected.rep.username || selected.rep.name})`}
              </p>

              {/* Signature macOS Pill Password Input + Inline Submit Arrow */}
              <form onSubmit={handleSubmit} className="w-full space-y-3">
                <div className="relative flex items-center w-72 sm:w-80 mx-auto">
                  <input
                    id="login-password-input"
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    className="w-full rounded-full bg-white border border-slate-300/90 shadow-md pl-5 pr-20 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition"
                  />

                  {/* Peek Password + Inline macOS Arrow Submit Button */}
                  <div className="absolute right-1.5 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="submit"
                      title="Sign In"
                      aria-label="Sign In"
                      className="w-7 h-7 rounded-full bg-slate-900 hover:bg-indigo-600 text-white flex items-center justify-center transition shadow-xs cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Error Feedback */}
                {error && (
                  <div className="w-72 sm:w-80 mx-auto px-3.5 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                {showHelpNote && (
                  <p className="text-[11px] text-slate-500 bg-white border border-slate-200 rounded-2xl px-3.5 py-2 shadow-2xs w-72 sm:w-80 mx-auto">
                    Ask your Managing Director to reset your password inside the Staff Submissions Hub.
                  </p>
                )}

                {/* Bottom Links: Switch Account & Need Help */}
                <div className="pt-3 flex items-center justify-center gap-4 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(null);
                      setError('');
                      setPassword('');
                      setShowHelpNote(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold shadow-2xs transition cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    Switch User
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowHelpNote((v) => !v)}
                    className="text-slate-500 hover:text-indigo-600 font-medium cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Clean Minimal Apple Desktop Footer */}
      <footer className="w-full py-3 px-4 text-center text-[11px] text-slate-400 font-medium">
        Nunes Instruments &bull; Signed-in staff only see their own 10-day account &amp; records
      </footer>
    </div>
  );
};
