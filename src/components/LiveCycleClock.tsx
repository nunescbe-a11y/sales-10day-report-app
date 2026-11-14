import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  Hourglass,
  ChevronDown,
  Layers
} from 'lucide-react';
import { useSales } from '../context/SalesContext';
import type { ReportingCycle } from '../types';

export const useLiveClock = () => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return now;
};

interface TimeRemaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  progressPct: number;
}

export const calculateCycleTimeRemaining = (
  now: Date,
  activeCycle?: ReportingCycle
): TimeRemaining => {
  if (!activeCycle) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false, progressPct: 0 };
  }

  // End of cycle is 23:59:59 on cycle.endDate
  const [year, month, day] = activeCycle.endDate.split('-').map(Number);
  const endDateTime = new Date(year, month - 1, day, 23, 59, 59, 999);

  // Start of cycle is 00:00:00 on cycle.startDate
  const [sYear, sMonth, sDay] = activeCycle.startDate.split('-').map(Number);
  const startDateTime = new Date(sYear, sMonth - 1, sDay, 0, 0, 0, 0);

  const totalCycleDuration = endDateTime.getTime() - startDateTime.getTime();
  const elapsed = Math.max(0, now.getTime() - startDateTime.getTime());
  const progressPct = totalCycleDuration > 0 ? Math.min(100, Math.round((elapsed / totalCycleDuration) * 100)) : 0;

  const diffMs = endDateTime.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, progressPct: 100 };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  return {
    totalMs: diffMs,
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    progressPct,
  };
};

// Compact Header Live Clock Pill
export const HeaderLiveClock: React.FC<{ onOpenCycleModal?: () => void }> = ({ onOpenCycleModal }) => {
  const now = useLiveClock();
  const { cycles, selectedCycleId } = useSales();

  const currentCycle = useMemo(() => {
    if (selectedCycleId && selectedCycleId !== 'all') {
      const match = cycles.find((c) => c.id === selectedCycleId);
      if (match) return match;
    }
    return cycles.find((c) => c.isCurrent) || cycles[cycles.length - 1];
  }, [cycles, selectedCycleId]);

  const timeRem = useMemo(() => calculateCycleTimeRemaining(now, currentCycle), [now, currentCycle]);

  // Formatted date and time strings
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex items-center gap-2">
      {/* Live Digital Clock Widget */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 border border-slate-200/90 text-slate-800 shadow-2xs font-mono">
        <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse shrink-0" />
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-x-1.5 text-left leading-none">
          <span className="text-[11px] font-black tracking-tight text-slate-900">{timeStr}</span>
          <span className="text-[9px] text-slate-500 font-sans font-medium hidden md:inline">{dateStr}</span>
        </div>
      </div>

      {/* Live Cycle Countdown Pill */}
      {currentCycle && (
        <button
          type="button"
          onClick={onOpenCycleModal}
          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition cursor-pointer shadow-2xs ${
            timeRem.days <= 1
              ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
              : timeRem.days <= 3
              ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
          }`}
          title={`Active 10-day cycle: ${currentCycle.name}. Click to manage cycles.`}
        >
          <Hourglass className="w-3 h-3 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="flex items-center gap-1 font-mono text-[11px] leading-tight">
            <span className="font-bold hidden lg:inline font-sans">Cycle Ends In:</span>
            <span className="font-extrabold">
              {timeRem.days}d {String(timeRem.hours).padStart(2, '0')}h {String(timeRem.minutes).padStart(2, '0')}m {String(timeRem.seconds).padStart(2, '0')}s
            </span>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition" />
        </button>
      )}
    </div>
  );
};

// Full Hero / Banner Live Cycle & Countdown Component
interface LiveCycleBannerProps {
  className?: string;
  showNextNotice?: boolean;
}

export const LiveCycleBanner: React.FC<LiveCycleBannerProps> = ({
  className = '',
  showNextNotice = true,
}) => {
  const now = useLiveClock();
  const { cycles, selectedCycleId } = useSales();

  const activeCycle = useMemo(() => {
    if (selectedCycleId && selectedCycleId !== 'all') {
      const match = cycles.find((c) => c.id === selectedCycleId);
      if (match) return match;
    }
    return cycles.find((c) => c.isCurrent) || cycles[cycles.length - 1];
  }, [cycles, selectedCycleId]);

  const timeRem = useMemo(() => calculateCycleTimeRemaining(now, activeCycle), [now, activeCycle]);

  // Determine next cycle
  const nextCycle = useMemo(() => {
    if (!activeCycle) return null;
    const currentIndex = cycles.findIndex((c) => c.id === activeCycle.id);
    if (currentIndex !== -1 && currentIndex < cycles.length - 1) {
      return cycles[currentIndex + 1];
    }
    // If last cycle, next is Cycle 1 of following month
    const nextNum = activeCycle.cycleNumber === 3 ? 1 : ((activeCycle.cycleNumber + 1) as 1 | 2 | 3);
    return {
      id: `next-cycle`,
      name: `Cycle ${nextNum} (${nextNum === 1 ? 'Days 01–10' : nextNum === 2 ? 'Days 11–20' : 'Days 21–End'})`,
      cycleNumber: nextNum,
      startDate: 'Auto-starts on deadline',
      endDate: 'Following 10 days',
      month: activeCycle.month,
    };
  }, [cycles, activeCycle]);

  // Formatted date and time strings
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const fullDateStr = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      className={`bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-sm relative overflow-hidden ${className}`}
    >
      {/* Ambient gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left Column: Live Clock & Calendar */}
        <div className="lg:col-span-5 space-y-1.5 border-b lg:border-b-0 lg:border-r border-slate-100 pb-3 lg:pb-0 lg:pr-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Live Official Clock • IST Timezone
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight flex items-center gap-1">
              <span>{timeStr}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{fullDateStr}</span>
          </div>

          {/* Active Cycle Badge */}
          {activeCycle && (
            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <Layers className="w-3 h-3 text-blue-600" />
                {activeCycle.name}
              </span>
              <span className="text-[10px] text-slate-500">
                (Window: {activeCycle.startDate} to {activeCycle.endDate})
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Live Cycle End Countdown & Progress */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Hourglass className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs font-bold text-slate-800">
                10-Day Cycle Deadline Countdown:
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-500">
              {timeRem.progressPct}% of 10-Day Period Elapsed
            </span>
          </div>

          {/* 4-Box Digital Countdown Counter */}
          <div className="grid grid-cols-4 gap-2 text-center font-mono">
            {/* Days */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-lg sm:text-xl font-black text-slate-900">
                {String(timeRem.days).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase font-bold text-slate-400 font-sans">Days</div>
            </div>

            {/* Hours */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-lg sm:text-xl font-black text-slate-900">
                {String(timeRem.hours).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase font-bold text-slate-400 font-sans">Hours</div>
            </div>

            {/* Minutes */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-lg sm:text-xl font-black text-slate-900">
                {String(timeRem.minutes).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase font-bold text-slate-400 font-sans">Minutes</div>
            </div>

            {/* Seconds */}
            <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="text-lg sm:text-xl font-black text-amber-900">
                {String(timeRem.seconds).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase font-bold text-amber-700 font-sans">Seconds</div>
            </div>
          </div>

          {/* Cycle Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${timeRem.progressPct}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 rounded-full"
            />
          </div>

          {/* Next Cycle Changeover Notice */}
          {showNextNotice && nextCycle && (
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600 bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-200/70">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800">Next Cycle Changeover:</span>
                <span className="text-indigo-700 font-semibold">{nextCycle.name}</span>
              </div>
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                Switches automatically on cycle completion
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
