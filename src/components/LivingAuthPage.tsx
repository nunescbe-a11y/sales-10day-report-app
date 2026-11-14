import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Check, ArrowRight, LogOut, LayoutDashboard, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LivingPortrait } from './3d-portfolio/LivingPortrait';
import { useSales } from '../context/SalesContext';

const SAVED_LOGIN_KEY = 'nunes_saved_credentials';

interface LivingAuthPageProps {
  onExploreLanding?: () => void;
  onEnterWorkspace?: () => void;
  isEmbedded?: boolean;
  onSuccess?: () => void;
}

export const LivingAuthPage: React.FC<LivingAuthPageProps> = ({
  onEnterWorkspace,
  onSuccess,
}) => {
  const { session, loginWithCredentials, logout, addRep } = useSales();

  // Mode: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Load saved credentials from localStorage
  const savedCreds = useMemo(() => {
    try {
      const saved = localStorage.getItem(SAVED_LOGIN_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.identifier) {
          return parsed;
        }
      }
    } catch (_) {}
    return null;
  }, []);

  // Form State
  const [name, setName] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState(savedCreds?.identifier || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(savedCreds?.password || '');
  const [rememberMe, setRememberMe] = useState(savedCreds ? savedCreds.remember !== false : true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // UI Interactive States
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cardShake, setCardShake] = useState(false);
  const [characterMood, setCharacterMood] = useState<'rest' | 'puff' | 'hearts' | 'winkr' | null>('rest');

  // Trigger Confetti helper
  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B600A8', '#7621B0', '#BE4C00', '#FF33BA', '#D7E2EA'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#B600A8', '#7621B0', '#FF7700'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#B600A8', '#7621B0', '#FF7700'],
        });
      }, 250);
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  // Password Focus / Blur Handlers (Living Portrait Reactions)
  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
    if (!showPassword) {
      if (typeof (window as any).setMinaEyesClosed === 'function') {
        (window as any).setMinaEyesClosed(true);
      }
    }
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    if (typeof (window as any).setMinaEyesClosed === 'function') {
      (window as any).setMinaEyesClosed(false);
    }
  };

  // Show / Hide Password Toggle (Wink Peek Reaction)
  const handleTogglePassword = () => {
    const nextShow = !showPassword;
    setShowPassword(nextShow);

    if (nextShow) {
      // Unmasking triggers a playful wink
      setCharacterMood('winkr');
      if (typeof (window as any).triggerMinaWink === 'function') {
        (window as any).triggerMinaWink();
      }
    } else {
      // Hiding password closes her eyes again if input is focused
      if (isPasswordFocused) {
        if (typeof (window as any).setMinaEyesClosed === 'function') {
          (window as any).setMinaEyesClosed(true);
        }
      }
    }
  };

  // Sign In Submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const cleanIdentifier = (loginIdentifier || email).trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier || !cleanPassword) {
      setErrorMessage('Please enter your name or email, and password.');
      setIsLoading(false);
      triggerErrorReaction();
      return;
    }

    setTimeout(() => {
      const result = loginWithCredentials(cleanIdentifier, cleanPassword, false);
      setIsLoading(false);

      if (result.success) {
        // Save or clear credentials based on rememberMe checkbox
        if (rememberMe) {
          try {
            localStorage.setItem(SAVED_LOGIN_KEY, JSON.stringify({
              identifier: cleanIdentifier,
              password: cleanPassword,
              remember: true,
            }));
          } catch (_) {}
        } else {
          try {
            localStorage.removeItem(SAVED_LOGIN_KEY);
          } catch (_) {}
        }

        // Correct Credentials Reaction: Heart Eyes & Confetti
        setCharacterMood('hearts');
        if (typeof (window as any).triggerMinaHearts === 'function') {
          (window as any).triggerMinaHearts();
        }
        fireConfetti();
        if (onSuccess) {
          setTimeout(onSuccess, 600);
        }
      } else {
        // Wrong Credentials Reaction: Pout & Shake
        setErrorMessage(result.error || 'Invalid credentials. Please try again.');
        triggerErrorReaction();
      }
    }, 400);
  };

  // Sign Up Submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      setErrorMessage('All fields are required to create an account.');
      triggerErrorReaction();
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Please accept the Terms of Service to continue.');
      triggerErrorReaction();
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const username = cleanEmail.includes('@') ? cleanEmail.split('@')[0] : cleanName.toLowerCase().replace(/\s+/g, '');
      addRep({
        username,
        password: cleanPassword,
        name: cleanName.toLowerCase().replace(/\s+/g, ''),
        displayName: cleanName,
        email: cleanEmail,
        pin: '1234',
        avatarColor: 'bg-indigo-600',
        targetAmount: 100000,
      });

      const result = loginWithCredentials(cleanEmail, cleanPassword, false);
      setIsLoading(false);

      if (result.success) {
        setLoginIdentifier(cleanEmail);
        setCharacterMood('hearts');
        if (typeof (window as any).triggerMinaHearts === 'function') {
          (window as any).triggerMinaHearts();
        }
        fireConfetti();
      } else {
        setErrorMessage('Failed to initialize new session. Please sign in.');
        triggerErrorReaction();
      }
    }, 450);
  };

  // Trigger Error Animation & Character Pout
  const triggerErrorReaction = () => {
    setCardShake(true);
    setTimeout(() => setCardShake(false), 600);

    setCharacterMood('puff');
    if (typeof (window as any).triggerMinaError === 'function') {
      (window as any).triggerMinaError();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0C0C0C] text-[#D7E2EA] font-['Kanit',sans-serif] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-x-hidden selection:bg-[#B600A8] selection:text-white">
      {/* Plush Atmosphere: Pillowy ambient radial glow */}
      <div
        className="fixed top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] bg-gradient-to-tr from-[#B600A8]/20 via-[#7621B0]/20 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-10 right-1/4 w-[450px] h-[450px] bg-gradient-to-bl from-[#7621B0]/15 via-[#BE4C00]/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Balanced Split-View Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Interactive WebGL Living Portrait */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[340px] sm:min-h-[420px] lg:min-h-[560px]">
          {/* Subtle Ambient Backlight specifically for the character */}
          <div className="absolute inset-0 m-auto w-[280px] sm:w-[360px] h-[280px] sm:h-[360px] bg-[#B600A8]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative w-full flex items-center justify-center">
            <LivingPortrait
              mode="auth"
              eyesClosed={isPasswordFocused && !showPassword}
              mood={characterMood}
              className="scale-95 sm:scale-100 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Right Column: Sleek Authentication Card */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <motion.div
            animate={cardShake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full max-w-[460px] bg-[#121216] border border-white/10 rounded-[2.5rem] p-7 sm:p-9 shadow-2xl relative overflow-hidden backdrop-blur-xl"
            style={{
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(182, 0, 168, 0.1)',
            }}
          >
            {/* Top Glowing Ambient Edge */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B600A8] to-transparent opacity-80" />

            {/* Authenticated State Card */}
            {session.isAuthenticated ? (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#B600A8] to-[#7621B0] p-0.5 flex items-center justify-center shadow-lg shadow-[#B600A8]/30">
                  <div className="w-full h-full bg-[#121216] rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#D7E2EA]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#B600A8]">
                    Authentication Verified
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Welcome, {session.repName || 'User'}!
                  </h2>
                  <p className="text-xs text-slate-400 font-normal">
                    Signed in as <span className="text-slate-200 font-mono font-medium">{session.repId}@company</span>
                  </p>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={onEnterWorkspace}
                    className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                      boxShadow: '0 8px 25px -4px rgba(182, 0, 168, 0.5)',
                    }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Enter Sales Hub Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setCharacterMood('rest');
                    }}
                    className="w-full py-3 px-4 rounded-2xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Unauthenticated: Sign In / Sign Up Forms */
              <div className="space-y-6">
                {/* Segmented Toggle: Sign In / Sign Up */}
                <div className="relative p-1 bg-white/5 border border-white/10 rounded-2xl flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setErrorMessage(null);
                    }}
                    className={`relative z-10 flex-1 py-2 text-xs font-bold transition-colors cursor-pointer text-center ${
                      activeTab === 'signin' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setErrorMessage(null);
                    }}
                    className={`relative z-10 flex-1 py-2 text-xs font-bold transition-colors cursor-pointer text-center ${
                      activeTab === 'signup' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sign Up
                  </button>

                  {/* Sliding active pill */}
                  <motion.div
                    layoutId="auth-tab-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-[#B600A8]/80 to-[#7621B0]/80 shadow-md"
                    style={{
                      left: activeTab === 'signin' ? '4px' : '50%',
                      width: 'calc(50% - 4px)',
                    }}
                  />
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tab Forms */}
                {activeTab === 'signin' ? (
                  /* 1. SIGN IN TAB */
                  <form onSubmit={handleSignIn} className="space-y-4">
                    {/* Name or Email Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Name or Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          placeholder="e.g. nunes or nunes@company.com"
                          required
                          autoComplete="username"
                          className="w-full bg-[#18181f] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#B600A8] focus:ring-2 focus:ring-[#B600A8]/20 transition"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    {/* Password Input with No-Peeking & Eye Toggle */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={handlePasswordFocus}
                          onBlur={handlePasswordBlur}
                          placeholder="••••••••"
                          required
                          className="w-full bg-[#18181f] border border-white/10 rounded-2xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#B600A8] focus:ring-2 focus:ring-[#B600A8]/20 transition"
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <button
                          type="button"
                          onClick={handleTogglePassword}
                          tabIndex={-1}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition cursor-pointer"
                          title={showPassword ? 'Hide password' : 'Peek password'}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-[#B600A8]" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded text-[#B600A8] accent-[#B600A8] bg-[#18181f] border-white/20 focus:ring-0 cursor-pointer"
                        />
                        <span>Remember me</span>
                      </label>
                    </div>

                    {/* Saved Credentials Ready Helper */}
                    {savedCreds && loginIdentifier === savedCreds.identifier && password === savedCreds.password && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-[11px] text-pink-200 animate-in fade-in duration-200">
                        <Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                        <span>Saved credentials ready — just click <strong>Sign In →</strong></span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
                      style={{
                        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                        boxShadow: '0 8px 25px -4px rgba(182, 0, 168, 0.4)',
                      }}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* 2. SIGN UP TAB */
                  <form onSubmit={handleSignUp} className="space-y-4">
                    {/* Full Name Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Full Name"
                          required
                          className="w-full bg-[#18181f] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#B600A8] focus:ring-2 focus:ring-[#B600A8]/20 transition"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          required
                          className="w-full bg-[#18181f] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#B600A8] focus:ring-2 focus:ring-[#B600A8]/20 transition"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={handlePasswordFocus}
                          onBlur={handlePasswordBlur}
                          placeholder="••••••••"
                          required
                          className="w-full bg-[#18181f] border border-white/10 rounded-2xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#B600A8] focus:ring-2 focus:ring-[#B600A8]/20 transition"
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <button
                          type="button"
                          onClick={handleTogglePassword}
                          tabIndex={-1}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition cursor-pointer"
                          title={showPassword ? 'Hide password' : 'Peek password'}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-[#B600A8]" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Terms Acceptance */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          required
                          className="mt-0.5 w-4 h-4 rounded text-[#B600A8] accent-[#B600A8] bg-[#18181f] border-white/20 focus:ring-0 cursor-pointer"
                        />
                        <span className="leading-tight">
                          I agree to the <span className="text-[#B600A8] hover:underline">Terms of Service</span> and{' '}
                          <span className="text-[#B600A8] hover:underline">Privacy Policy</span>
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
                      style={{
                        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                        boxShadow: '0 8px 25px -4px rgba(182, 0, 168, 0.4)',
                      }}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Create Account</span>
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
