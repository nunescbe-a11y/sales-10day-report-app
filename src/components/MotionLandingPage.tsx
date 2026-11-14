import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  Lock,
  Monitor,
  Calculator,
  Zap,
  Layers,
  Award
} from 'lucide-react';
import { AnimatedBoyAvatar } from './AnimatedBoyAvatar';
import type { BoyEmotion } from './AnimatedBoyAvatar';
import { CloudflareLogin } from './CloudflareLogin';
import { useSales } from '../context/SalesContext';
import { HeaderLiveClock, LiveCycleBanner } from './LiveCycleClock';

interface MotionLandingPageProps {
  onDirectLogin?: () => void;
}

export const MotionLandingPage: React.FC<MotionLandingPageProps> = ({ onDirectLogin }) => {
  const { triggerCelebration } = useSales();

  // Interactive Companion Playground Emotion
  const [demoEmotion, setDemoEmotion] = useState<BoyEmotion>('idle');

  // Interactive Live Formula Playground State
  const [playPurCost, setPlayPurCost] = useState<number>(32000);
  const [playLanCost, setPlayLanCost] = useState<number>(1500);
  const [playSellCost, setPlaySellCost] = useState<number>(100000);
  const [playAdvance, setPlayAdvance] = useState<number>(80000);
  const [playGst] = useState<number>(18);
  const [playPacking] = useState<number>(800);
  const [playForwarding] = useState<number>(1200);

  // Math calculations
  const playGstAmount = Math.round((playSellCost * playGst) / 100);
  const playOverallAmount = playSellCost + playGstAmount + playPacking + playForwarding;
  const playBalance = playOverallAmount - playAdvance;
  const playProfit = playSellCost - playPurCost - playLanCost;
  const playMargin = playSellCost > 0 ? ((playProfit / playSellCost) * 100).toFixed(1) : '0';

  const scrollToLogin = () => {
    const el = document.getElementById('login-terminal-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-blue-500 selection:text-white font-sans">
      {/* 1. Fluid Ambient Motion Orbs (Background) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            x: [-40, 50, -30, -40],
            y: [-30, 40, -50, -30],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-blue-300/30 blur-3xl"
        />

        <motion.div
          animate={{
            x: [50, -40, 30, 50],
            y: [40, -50, 35, 40],
            scale: [1, 1.18, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -right-32 w-[560px] h-[560px] rounded-full bg-orange-300/25 blur-3xl"
        />

        <motion.div
          animate={{
            x: [-30, 40, -40, -30],
            y: [30, -35, 45, 30],
            scale: [0.95, 1.12, 0.95, 0.95],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 left-1/3 w-[580px] h-[580px] rounded-full bg-emerald-200/30 blur-3xl"
        />

        {/* Tech Dot Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)`,
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 80%)',
          }}
        />
      </div>

      {/* 2. Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/75 border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                  10-Day Sales Report Hub
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
                  <ShieldCheck className="w-2.5 h-2.5 text-orange-600" /> Cloudflare
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">October 2026 Enterprise Edition</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#cycles" className="hover:text-blue-600 transition">10-Day Engine</a>
            <a href="#playground" className="hover:text-blue-600 transition">Formula Playground</a>
            <a href="#companion" className="hover:text-blue-600 transition">3D Companion</a>
            <a href="#security" className="hover:text-blue-600 transition">Privacy & Security</a>
          </nav>

          <div className="flex items-center gap-2">
            <HeaderLiveClock onOpenCycleModal={scrollToLogin} />

            {onDirectLogin && (
              <button
                type="button"
                onClick={onDirectLogin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/90 bg-white/80 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
                title="Switch to compact direct login view"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Direct Login</span>
              </button>
            )}
            <button
              onClick={scrollToLogin}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Sign In to Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative z-10 pt-12 pb-16 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Shimmering Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/80 backdrop-blur-md border border-slate-200/90 text-slate-800 shadow-xs mb-6"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Next-Gen Enterprise Sales Workspace</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded-md font-bold border border-blue-200">
            10-Day Cycles Active
          </span>
        </motion.div>

        {/* Kinetic Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl leading-[1.12]"
        >
          Every 10 Days, Reconcile Sales with{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 bg-clip-text text-transparent">
            Total Financial Precision.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-slate-600 max-w-2xl mt-4 leading-relaxed"
        >
          Replaces spreadsheets with dedicated 10-day reporting windows. Staff fill transactions with instant 18% GST formulas in private isolation, while the Managing Director maintains real-time command oversight.
        </motion.p>

        {/* Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-8"
        >
          <button
            onClick={scrollToLogin}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition cursor-pointer hover:scale-[1.02]"
          >
            <span>Launch Access Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#cycles"
            className="px-5 py-3 bg-white/80 hover:bg-white text-slate-700 border border-slate-200/90 rounded-xl text-sm font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <span>Explore 10-Day Architecture</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </a>
        </motion.div>

        {/* Live Official Clock & 10-Day Cycle Countdown Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="w-full max-w-4xl mt-8"
        >
          <LiveCycleBanner showNextNotice={true} />
        </motion.div>

        {/* Floating 3D Stat Badges */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full max-w-3xl"
        >
          {/* Card 1 */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="p-4 bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md transition text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Master Sales</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-black text-slate-900">₹2,31,546</div>
            <span className="text-[11px] font-semibold text-emerald-600">+57.4% Profit Margin</span>
            <p className="text-[10px] text-slate-500 mt-1">Live aggregated company total</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
            className="p-4 bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md transition text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Device Lock</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Monitor className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-base font-black text-slate-900">Single-User Locked</div>
            <span className="text-[11px] font-semibold text-indigo-600">Zero Data Leakage</span>
            <p className="text-[10px] text-slate-500 mt-1">Hides other reps & MD charts</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            className="p-4 bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md transition text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Auto Formulas</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-base font-black text-slate-900">18% GST + Margins</div>
            <span className="text-[11px] font-semibold text-amber-600">Real-Time Instant Math</span>
            <p className="text-[10px] text-slate-500 mt-1">Automatic overall & balance</p>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. Section 1: The 10-Day Cycle Breakdown */}
      <section id="cycles" className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/70">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Structured Accounting</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            The 10-Day Reporting Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Dividing the calendar month into three 10-day cycles ensures zero payment bottlenecks and gives the MD granular visibility into sales pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cycle 1 */}
          <div className="p-6 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-4">
              C1
            </div>
            <h3 className="text-base font-bold text-slate-900">Cycle 1 • Days 01 to 10</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Early-month inquiries and initial customer advances. Staff log quotes, landing costs, and incoming purchase orders.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Typical Focus:</span>
              <span className="font-semibold text-blue-700">Advance Collection & Quotes</span>
            </div>
          </div>

          {/* Cycle 2 */}
          <div className="p-6 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm mb-4">
              C2
            </div>
            <h3 className="text-base font-bold text-slate-900">Cycle 2 • Days 11 to 20</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Mid-month fulfillment, courier tracking, and factory dispatches. Balances are updated as partial supplies complete.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Typical Focus:</span>
              <span className="font-semibold text-indigo-700">Dispatch & Invoicing</span>
            </div>
          </div>

          {/* Cycle 3 */}
          <div className="p-6 bg-white/90 backdrop-blur-md border border-blue-200 rounded-2xl shadow-sm hover:shadow-md transition bg-gradient-to-b from-blue-50/20 to-white">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm mb-4">
              C3
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-slate-900">Cycle 3 • Days 21 to End</h3>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">Active</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Final reconciliation, outstanding balance collection, and comprehensive batch report submission to the Managing Director.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Typical Focus:</span>
              <span className="font-semibold text-orange-700">Month-End Balance Settlement</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 2: Interactive Live Formula Playground */}
      <section id="playground" className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/70">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Live Math Engine</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Interactive Costing & Formula Playground
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Try adjusting the numbers below to see the exact formula engine calculate GST, Overall Invoiced Amount, and Gross Profit in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Controls on Left */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  PURCHASE COST (PUR COS) (₹)
                </label>
                <input
                  type="number"
                  value={playPurCost}
                  onChange={(e) => setPlayPurCost(Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  LANDING COST (LAN COST) (₹)
                </label>
                <input
                  type="number"
                  value={playLanCost}
                  onChange={(e) => setPlayLanCost(Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-blue-700 mb-1">
                  SELLING COST (SELL COST) (₹)
                </label>
                <input
                  type="number"
                  value={playSellCost}
                  onChange={(e) => setPlaySellCost(Number(e.target.value) || 0)}
                  className="w-full bg-blue-50/50 border border-blue-400 rounded-lg px-3 py-1.5 text-xs text-blue-950 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  ADVANCE PAYMENT (Advan Pay) (₹)
                </label>
                <input
                  type="number"
                  value={playAdvance}
                  onChange={(e) => setPlayAdvance(Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-semibold"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Standard 18% GST: <strong>₹{playGstAmount.toLocaleString('en-IN')}</strong></span>
              <span>Packing: <strong>₹{playPacking}</strong></span>
              <span>Forwarding: <strong>₹{playForwarding}</strong></span>
            </div>
          </div>

          {/* Results on Right */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-bold text-blue-900 uppercase">OVER ALL AMOU (Invoiced)</span>
              <div className="text-2xl font-black text-blue-950 font-mono mt-1">
                ₹{playOverallAmount.toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-blue-700 mt-1">
                Formula: Selling Cost + GST (18%) + Packing + Forwarding
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold text-amber-900 uppercase">BALANCE DUE</span>
              <div className="text-2xl font-black text-amber-950 font-mono mt-1">
                ₹{playBalance.toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-amber-700 mt-1">
                Formula: Overall Amount - Advance Payment
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-900 uppercase">GROSS PROFIT & MARGIN</span>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-xs">
                  {playMargin}% Margin
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-950 font-mono mt-1">
                ₹{playProfit.toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-emerald-700 mt-1">
                Formula: Selling Cost - Purchase Cost - Landing Cost
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section 3: Interactive 3D Companion Playground */}
      <section id="companion" className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/70">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Emotional Feedback</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            3D Animated Boy Companion & Runner
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            The intelligent animated avatar provides real-time emotional feedback during login and celebrates completed 10-day milestones.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center">
          {/* Avatar on Pedestal */}
          <div className="relative mb-4">
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.1, 0.35] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -inset-4 rounded-full border border-orange-300/40 pointer-events-none"
            />
            <AnimatedBoyAvatar emotion={demoEmotion} size={135} />
          </div>

          {/* Interactive Speech Bubble */}
          <div className="min-h-[28px] mb-6">
            <AnimatePresence mode="wait">
              {demoEmotion === 'kiss' ? (
                <motion.p
                  key="kiss"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: [1, 1.15, 1] }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-sm font-black text-rose-600"
                >
                  😘 Correct password! Sending you a cheerful kiss! 💖
                </motion.p>
              ) : demoEmotion === 'sad' ? (
                <motion.p
                  key="sad"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, x: [-3, 3, -3, 3, 0] }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-sm font-bold text-rose-500"
                >
                  😢 Oh no! Incorrect credentials... I'm crying! 💧
                </motion.p>
              ) : demoEmotion === 'typing' ? (
                <motion.p
                  key="typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-bold text-indigo-600"
                >
                  👀 Focused gaze: Verifying your employee identity...
                </motion.p>
              ) : (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold text-slate-500"
                >
                  Click any button below to trigger the companion's animations!
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Buttons to test each emotion */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setDemoEmotion('kiss')}
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Test Kiss (Correct)</span>
              <span>😘</span>
            </button>

            <button
              onClick={() => setDemoEmotion('sad')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Test Crying (Wrong)</span>
              <span>😢</span>
            </button>

            <button
              onClick={() => setDemoEmotion('typing')}
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Test Typing Focus</span>
              <span>👀</span>
            </button>

            <button
              onClick={() => {
                triggerCelebration('Logged sales deal via Landing Page! 🏆', 'Guest');
              }}
              className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Test Celebration Runner</span>
              <span>🏃‍♂️</span>
            </button>

            <button
              onClick={() => setDemoEmotion('idle')}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Reset Idle
            </button>
          </div>
        </div>
      </section>

      {/* 7. Section 4: Security & Single-User Device Lock */}
      <section id="security" className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/70">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Access Control</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Privacy & Executive Hierarchy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Installed on employee computers with strict single-user device locking so team members only see their own sales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Staff Mode Box */}
          <div className="p-6 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Staff Single-User Mode</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              When an employee logs into their workstation with "Lock this computer to this employee" enabled:
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Only their personal 10-day cycle items are visible.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Other employees' deals and names are strictly hidden.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>MD executive charts and overall margins are locked out.</span>
              </li>
            </ul>
          </div>

          {/* MD Command Box */}
          <div className="p-6 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">MD Command Center</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              The Managing Director gains high-level oversight across the company's financial operations:
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Real-time cycle trends (Sales vs. Gross Profit).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Master table containing all staff entries with Excel export.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Staff password reset and access credential management.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. Section 5: The Cloudflare Access Terminal */}
      <section id="login-terminal-section" className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/70">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Direct Access</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Sign In to Sales Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enter your employee credentials or select a 1-click test profile below.
          </p>
        </div>

        {/* Embedded Terminal Container */}
        <div className="max-w-md mx-auto">
          <CloudflareLogin isEmbedded />
        </div>
      </section>

      {/* 9. Bottom Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">10-Day Sales Reporting Suite</span>
            <span className="text-slate-300">•</span>
            <span>Cloudflare Edge Deployment</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Cycle 1 (Days 01–10)</span>
            <span>•</span>
            <span>Cycle 2 (Days 11–20)</span>
            <span>•</span>
            <span className="font-bold text-blue-600">Cycle 3 (Days 21–EOM)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
