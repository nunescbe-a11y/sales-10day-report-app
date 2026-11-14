import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  Hourglass,
  ChevronDown,
} from 'lucide-react';
import { useSales } from '../context/SalesContext';
import type { ReportingCycle } from '../types';
import { generateCycleForDate, formatDateISO } from '../utils/cycleEngine';

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
    // If a specific cycle is selected in dropdown
    if (selectedCycleId && selectedCycleId !== 'all') {
      const match = cycles.find((c) => c.id === selectedCycleId);
      if (match) return match;
    }
    // Default to the active cycle matching current date
    const isoToday = formatDateISO(now);
    const todayMatch = cycles.find((c) => isoToday >= c.startDate && isoToday <= c.endDate);
    if (todayMatch) return todayMatch;
    return cycles.find((c) => c.isCurrent) || generateCycleForDate(now, true);
  }, [cycles, selectedCycleId, now]);

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
          title={`Active 10-day cycle: ${currentCycle.name}. Click to view cycles.`}
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
    const isoToday = formatDateISO(now);
    const todayMatch = cycles.find((c) => isoToday >= c.startDate && isoToday <= c.endDate);
    if (todayMatch) return todayMatch;
    return cycles.find((c) => c.isCurrent) || generateCycleForDate(now, true);
  }, [cycles, selectedCycleId, now]);

  const timeRem = useMemo(() => calculateCycleTimeRemaining(now, activeCycle), [now, activeCycle]);

  // Determine next cycle
  const nextCycle = useMemo(() => {
    if (!activeCycle) return null;
    const currentIndex = cycles.findIndex((c) => c.id === activeCycle.id);
    if (currentIndex !== -1 && currentIndex < cycles.length - 1) {
      return cycles[currentIndex + 1];
    }
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

          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900">
              {timeStr}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span>{fullDateStr}</span>
          </div>
        </div>

        {/* Right Column: Active 10-Day Cycle Countdown */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 text-indigo-700">
                10-Day Cycle
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                {activeCycle?.name || 'Current 10-Day Reporting Period'}
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              {activeCycle?.startDate} &rarr; {activeCycle?.endDate}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeRem.progressPct >= 90
                  ? 'bg-rose-500'
                  : timeRem.progressPct >= 70
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${timeRem.progressPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-0.5">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <span>Time Left:</span>
              <span className="font-mono font-black text-slate-900">
                {timeRem.days}d {timeRem.hours}h {timeRem.minutes}m {timeRem.seconds}s
              </span>
            </div>

            {showNextNotice && nextCycle && (
              <span className="text-[11px] text-slate-400">
                Next: <strong className="text-slate-600">{nextCycle.name}</strong>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
