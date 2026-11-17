import type { ReportingCycle } from '../types';

/**
 * Formats a Date object to YYYY-MM-DD in local time
 */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse date string from either YYYY-MM-DD or DD/MM/YYYY format
 */
export function parseDateFlexible(dateStr?: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const clean = dateStr.trim();
  
  // DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(clean)) {
    const [d, m, y] = clean.split('/').map(Number);
    return new Date(y, m - 1, d);
  }
  
  // YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(clean)) {
    const [y, m, d] = clean.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  const parsed = new Date(clean);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Generate a standard 10-day reporting cycle for any given date:
 * - Cycle 1: Days 01 - 10
 * - Cycle 2: Days 11 - 20
 * - Cycle 3: Days 21 - End of Month (28, 29, 30, or 31)
 */
export function generateCycleForDate(date: Date = new Date(), isCurrent = false): ReportingCycle {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();

  const monthNum = String(month + 1).padStart(2, '0');
  const monthShort = date.toLocaleString('en-US', { month: 'short' });
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  let cycleNumber: 1 | 2 | 3 = 1;
  let startDay = 1;
  let endDay = 10;

  if (day >= 1 && day <= 10) {
    cycleNumber = 1;
    startDay = 1;
    endDay = 10;
  } else if (day >= 11 && day <= 20) {
    cycleNumber = 2;
    startDay = 11;
    endDay = 20;
  } else {
    cycleNumber = 3;
    startDay = 21;
    endDay = lastDayOfMonth;
  }

  const startDate = `${year}-${monthNum}-${String(startDay).padStart(2, '0')}`;
  const endDate = `${year}-${monthNum}-${String(endDay).padStart(2, '0')}`;
  const id = `${year}-${monthNum}-C${cycleNumber}`;
  const name = `${monthShort} ${String(startDay).padStart(2, '0')} - ${monthShort} ${String(endDay).padStart(2, '0')}, ${year} (Cycle ${cycleNumber}${isCurrent ? ' - Active' : ''})`;

  return {
    id,
    name,
    month: `${year}-${monthNum}`,
    cycleNumber,
    startDate,
    endDate,
    isCurrent,
  };
}

/**
 * Calculate the next subsequent 10-day cycle following a given cycle:
 * Cycle 1 -> Cycle 2 (Days 11-20)
 * Cycle 2 -> Cycle 3 (Days 21-End)
 * Cycle 3 -> Cycle 1 of Next Month (Days 01-10)
 */
export function generateNextCycle(currentCycle: ReportingCycle, isCurrent = false): ReportingCycle {
  const [yearStr, monthStr] = currentCycle.month.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed

  if (currentCycle.cycleNumber === 1) {
    const nextDate = new Date(year, month, 11);
    return generateCycleForDate(nextDate, isCurrent);
  } else if (currentCycle.cycleNumber === 2) {
    const nextDate = new Date(year, month, 21);
    return generateCycleForDate(nextDate, isCurrent);
  } else {
    // Next month, Day 1
    const nextDate = new Date(year, month + 1, 1);
    return generateCycleForDate(nextDate, isCurrent);
  }
}

/**
 * Automatically audits the cycle registry against today's date:
 * 1. Detects cycle closure: when previous cycle ends/expires, it closes and isCurrent = false
 * 2. Automatically creates and activates the next current cycle for today's date (isCurrent = true)
 * 3. Also automatically creates upcoming subsequent cycles so staff and admin can plan ahead
 * 4. Normalizes cycle display titles so that only the truly active cycle has the ' - Active' badge
 * 5. Returns updatedCycles, activeCycle, hasChanged, and rolledOverFrom ID
 */
export function autoSyncReportingCycles(
  existingCycles: ReportingCycle[],
  now: Date = new Date()
): {
  updatedCycles: ReportingCycle[];
  activeCycle: ReportingCycle;
  hasChanged: boolean;
  rolledOverFrom?: string;
} {
  const todayCycle = generateCycleForDate(now, true);
  const nextCycle = generateNextCycle(todayCycle, false);
  const subsequentCycle = generateNextCycle(nextCycle, false);

  const prevActive = existingCycles.find((c) => c.isCurrent);
  let rolledOverFrom: string | undefined = undefined;
  if (prevActive && prevActive.id !== todayCycle.id) {
    rolledOverFrom = prevActive.id;
  }

  let hasChanged = false;
  const cycleMap = new Map<string, ReportingCycle>();

  // Load existing cycles
  for (const c of existingCycles) {
    cycleMap.set(c.id, { ...c });
  }

  // Ensure current today's cycle exists
  if (!cycleMap.has(todayCycle.id)) {
    cycleMap.set(todayCycle.id, todayCycle);
    hasChanged = true;
  }

  // Ensure upcoming next cycle exists
  if (!cycleMap.has(nextCycle.id)) {
    cycleMap.set(nextCycle.id, nextCycle);
    hasChanged = true;
  }

  // Ensure subsequent cycle exists
  if (!cycleMap.has(subsequentCycle.id)) {
    cycleMap.set(subsequentCycle.id, subsequentCycle);
    hasChanged = true;
  }

  // Update isCurrent status and clean up names
  for (const [id, c] of cycleMap.entries()) {
    const isTodayMatch = id === todayCycle.id;
    if (c.isCurrent !== isTodayMatch) {
      c.isCurrent = isTodayMatch;
      hasChanged = true;
    }

    // Synchronize title badge with active status
    if (c.isCurrent) {
      if (!c.name.includes('- Active')) {
        c.name = c.name.endsWith(')') ? c.name.replace(/\)$/, ' - Active)') : `${c.name} - Active`;
        hasChanged = true;
      }
    } else {
      if (c.name.includes('- Active')) {
        c.name = c.name.replace(/\s*-\s*Active/g, '');
        hasChanged = true;
      }
    }
  }

  // Sort chronologically by startDate
  const updatedCycles = Array.from(cycleMap.values()).sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  );

  const activeCycle = updatedCycles.find((c) => c.isCurrent) || todayCycle;

  return {
    updatedCycles,
    activeCycle,
    hasChanged,
    rolledOverFrom,
  };
}

/**
 * Automatically determine the matching cycle ID for any given sale date
 */
export function resolveCycleForSaleDate(
  dateInput: string,
  availableCycles: ReportingCycle[]
): string {
  const parsed = parseDateFlexible(dateInput);
  if (!parsed) {
    const current = availableCycles.find((c) => c.isCurrent);
    return current ? current.id : availableCycles[availableCycles.length - 1]?.id || 'all';
  }

  const iso = formatDateISO(parsed);
  // Look for existing cycle whose range covers this date
  const match = availableCycles.find((c) => iso >= c.startDate && iso <= c.endDate);
  if (match) return match.id;

  // Otherwise generate standard cycle ID for this date
  const generated = generateCycleForDate(parsed);
  return generated.id;
}
