import { autoSyncReportingCycles, resolveCycleForSaleDate } from '../utils/cycleEngine';
import { DEFAULT_AVATARS, AVATAR_YAZHINI, AVATAR_JANANI, AVATAR_VENGATESHAN } from '../utils/staffAvatarsData';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { SaleItem, ReportingCycle, SalesRep, CurrentUserRole, UserSession, CelebrationState, StatusCategory, StatusOption } from '../types';
import { INITIAL_SALES, INITIAL_CYCLES, INITIAL_REPS, INITIAL_STATUS_OPTIONS } from '../data/initialData';

interface SalesContextType {
  sales: SaleItem[];
  cycles: ReportingCycle[];
  reps: SalesRep[];
  statusOptions: StatusOption[];
  session: UserSession;
  celebrationState: CelebrationState;
  currentRole: CurrentUserRole;
  selectedCycleId: string; // 'all' or cycle ID
  isMD: boolean;
  activeRep: SalesRep | undefined;
  addSaleItem: (item: Omit<SaleItem, 'id' | 'slNo' | 'updatedAt'>) => void;
  updateSaleItem: (id: string, updates: Partial<SaleItem>) => void;
  deleteSaleItem: (id: string) => void;
  addStatusOption: (text: string, category?: StatusCategory) => void;
  renameStatusOption: (id: string, newText: string, newCategory?: StatusCategory) => void;
  deleteStatusOption: (id: string) => void;
  setCurrentRole: (role: CurrentUserRole) => void;
  setSelectedCycleId: (cycleId: string) => void;
  addCycle: (cycle: Omit<ReportingCycle, 'id'>) => void;
  setActiveCycle: (cycleId: string) => void;
  addRep: (rep: Omit<SalesRep, 'id'>) => void;
  loginAsMD: (pin: string) => boolean;
  loginAsRep: (repId: string, pin: string, lockDevice: boolean) => boolean;
  verifyCredentials: (username: string, password: string) => {
    success: boolean;
    role?: 'MD' | 'EMPLOYEE';
    repName?: string;
    error?: string;
  };
  loginWithCredentials: (username: string, password: string, lockDevice?: boolean) => {
    success: boolean;
    role?: 'MD' | 'EMPLOYEE';
    repName?: string;
    error?: string;
  };
  resetPassword: (username: string, newPass: string) => boolean;
  logout: () => void;
  unlockDevice: () => void;
  triggerCelebration: (message?: string, repName?: string) => void;
  resetToDefaultData: () => void;
  clearAllSalesData: () => void;
  getFilteredSales: () => SaleItem[];
  syncStatus: 'synced' | 'saving' | 'offline';
  lastBackupTime: string;
  exportBackupJSON: () => void;
  restoreBackupJSON: (jsonData: string) => boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (t: 'dark' | 'light') => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SALES: 'sales_app_sales_v3',
  CYCLES: 'sales_app_cycles_v3',
  REPS: 'sales_app_reps_v3',
  STATUSES: 'sales_app_statuses_v3',
  SESSION: 'sales_app_session_v4',
  ROLE: 'sales_app_role_v3',
  SELECTED_CYCLE: 'sales_app_selected_cycle_v3',
};

const DEFAULT_SESSION: UserSession = {
  isAuthenticated: false,
  role: 'EMPLOYEE',
  repId: '',
  repName: '',
  isDeviceLocked: false,
};

const attachAvatars = (repList: SalesRep[]): SalesRep[] => {
  return repList
    .filter((r) => {
      const idKey = (r.id || '').toLowerCase();
      const nameKey = (r.name || '').toLowerCase();
      return (
        idKey !== 'naveena' &&
        nameKey !== 'naveena' &&
        idKey !== 'ready stock' &&
        nameKey !== 'ready stock' &&
        idKey !== 'stock' &&
        nameKey !== 'stock' &&
        idKey !== 'pranesh' &&
        nameKey !== 'pranesh'
      );
    })
    .map((r) => {
      const idKey = r.id?.toLowerCase() || '';
      const nameKey = r.name?.toLowerCase() || '';
      let embedded = DEFAULT_AVATARS[idKey] || DEFAULT_AVATARS[nameKey];
      if (!embedded) {
        if (idKey.includes('vengateshan') || nameKey.includes('vengateshan') || idKey.includes('vengatesh') || nameKey.includes('vengatesh') || idKey === 'tl') {
          embedded = AVATAR_VENGATESHAN;
        } else if (idKey.includes('yazhini') || nameKey.includes('yazhini')) {
          embedded = AVATAR_YAZHINI;
        } else if (idKey.includes('janani') || nameKey.includes('janani')) {
          embedded = AVATAR_JANANI;
        }
      }

      let displayName = r.displayName;
      if (idKey.includes('vengateshan') || nameKey.includes('vengateshan') || idKey === 'tl') displayName = 'Vengateshan TL';
      else if (nameKey === 'yazhini' || displayName === 'Yazhini S.') displayName = 'Yazhini P';
      else if (nameKey === 'janani' || displayName === 'Janani M.') displayName = 'Janani U';

      const isSvgPlaceholder = r.avatarUrl && r.avatarUrl.includes('data:image/svg+xml');
      const isCustomBase64 = r.avatarUrl && r.avatarUrl.startsWith('data:image') && !r.avatarUrl.includes('/avatars/') && !isSvgPlaceholder;
      return {
        ...r,
        displayName,
        avatarUrl: isCustomBase64 ? r.avatarUrl : (embedded || r.avatarUrl || AVATAR_VENGATESHAN),
      };
    });
};

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<SaleItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SALES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse sales from localStorage', e);
      }
    }
    return INITIAL_SALES;
  });

  const [mdPassword, setMdPassword] = useState<string>(() => {
    return localStorage.getItem('sales_app_md_pass') || 'md2026';
  });

  const [cycles, setCycles] = useState<ReportingCycle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CYCLES);
    let initialList = INITIAL_CYCLES;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) initialList = parsed;
      } catch (e) {
        console.error('Failed to parse cycles from localStorage', e);
      }
    }
    const { updatedCycles } = autoSyncReportingCycles(initialList, new Date());
    return updatedCycles;
  });

  const [reps, setReps] = useState<SalesRep[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return attachAvatars(parsed.filter((r: SalesRep) => r.id !== 'pranesh' && r.username !== 'pranesh' && r.name !== 'pranesh'));
        }
      } catch (e) {
        console.error('Failed to parse reps from localStorage', e);
      }
    }
    return attachAvatars(INITIAL_REPS.filter((r) => r.id !== 'pranesh'));
  });

  const [statusOptions, setStatusOptions] = useState<StatusOption[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STATUSES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse statuses from localStorage', e);
      }
    }
    return INITIAL_STATUS_OPTIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(statusOptions));
  }, [statusOptions]);

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    // Default to white theme, no black
    localStorage.setItem('nunes_theme', 'light');
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('nunes_theme', next);
      return next;
    });
  };

  const setTheme = (t: 'dark' | 'light') => {
    localStorage.setItem('nunes_theme', t);
    setThemeState(t);
  };

  const addStatusOption = (text: string, category: StatusCategory = 'Dispatched') => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (statusOptions.some((s) => s.text.toLowerCase() === trimmed.toLowerCase())) return;
    const newOption: StatusOption = {
      id: `status-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: trimmed,
      category,
    };
    setStatusOptions((prev) => [...prev, newOption]);
  };

  const renameStatusOption = (id: string, newText: string, newCategory?: StatusCategory) => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    setStatusOptions((prev) =>
      prev.map((opt) =>
        opt.id === id
          ? {
              ...opt,
              text: trimmed,
              category: newCategory || opt.category,
            }
          : opt
      )
    );
  };

  const deleteStatusOption = (id: string) => {
    setStatusOptions((prev) => prev.filter((opt) => opt.id !== id));
  };

  const resetPassword = (usernameInput: string, newPass: string): boolean => {
    const clean = usernameInput.trim().toLowerCase();
    if (clean === 'md' || clean === 'admin') {
      setMdPassword(newPass.trim());
      localStorage.setItem('sales_app_md_pass', newPass.trim());
      return true;
    }

    const repIndex = reps.findIndex(
      (r) => r.username.toLowerCase() === clean || r.name.toLowerCase() === clean
    );

    if (repIndex !== -1) {
      const updated = [...reps];
      updated[repIndex] = {
        ...updated[repIndex],
        password: newPass.trim(),
        pin: newPass.trim(),
      };
      setReps(updated);
      localStorage.setItem(STORAGE_KEYS.REPS, JSON.stringify(updated));
      return true;
    }

    return false;
  };

  const [session, setSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          isAuthenticated: Boolean(parsed.isAuthenticated),
          isDeviceLocked: false,
        };
      } catch (e) {
        console.error('Failed to parse session from localStorage', e);
      }
    }
    return DEFAULT_SESSION;
  });

  const [celebrationState] = useState<CelebrationState>({
    isActive: false,
    message: '',
    employeeName: '',
  });

  const [currentRole, setCurrentRoleState] = useState<CurrentUserRole>(() => {
    return session.repId || 'MD';
  });

  const [selectedCycleId, setSelectedCycleIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_CYCLE);
    if (saved && saved !== 'all') {
      return saved;
    }
    const { activeCycle } = autoSyncReportingCycles(INITIAL_CYCLES, new Date());
    return activeCycle.id;
  });

  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'offline'>('synced');
  const [lastBackupTime, setLastBackupTime] = useState<string>('');

  const latestStateRef = useRef({ sales, cycles, reps, statusOptions });
  latestStateRef.current = { sales, cycles, reps, statusOptions };
  const lastSyncedDigestRef = useRef<string>(
    JSON.stringify({ sales, cycles, reps, statusOptions })
  );
  // Continuous 10-day Cycle Auto-Creator & Auto-Rollover Engine
  useEffect(() => {
    const syncCyclesWithDate = () => {
      setCycles((prevCycles) => {
        const { updatedCycles, activeCycle, hasChanged } = autoSyncReportingCycles(prevCycles, new Date());
        if (hasChanged) {
          setSelectedCycleIdState((curSelected) => {
            const wasOldActive = prevCycles.some((c) => c.id === curSelected && !c.isCurrent);
            if (wasOldActive || !curSelected) {
              return activeCycle.id;
            }
            return curSelected;
          });
          localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(updatedCycles));
          return updatedCycles;
        }
        return prevCycles;
      });
    };

    syncCyclesWithDate();
    const interval = setInterval(syncCyclesWithDate, 15000);
    return () => clearInterval(interval);
  }, []);


  // 1. Initial Load from Permanent Server Storage (Merges with local so nothing is ever lost on updates)
  useEffect(() => {
    let isMounted = true;
    const loadFromPermanentStorage = async () => {
      try {
        const res = await fetch('/api/storage/load');
        if (res.ok) {
          const data = await res.json();
          if (data && data.exists !== false) {
            if (!isMounted) return;
            const cur = latestStateRef.current;

            let nextSales = cur.sales;
            let hadLocalAdditions = false;
            if (data.isFreshWiped || (data.sales && Array.isArray(data.sales) && data.sales.length === 0)) {
              nextSales = [];
              localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([]));
            } else if (data.sales && Array.isArray(data.sales) && data.sales.length > 0) {
              const serverSales: SaleItem[] = [...data.sales];
              const serverMap = new Map(serverSales.map((s) => [s.id, s]));
              for (const localItem of cur.sales) {
                if (!serverMap.has(localItem.id)) {
                  serverSales.push(localItem);
                  hadLocalAdditions = true;
                }
              }
              nextSales = serverSales;
            }

            const baseCycles =
              data.cycles && Array.isArray(data.cycles) && data.cycles.length > 0
                ? data.cycles
                : cur.cycles;
            const { updatedCycles: nextCycles } = autoSyncReportingCycles(baseCycles, new Date());

            const nextReps =
              data.reps && Array.isArray(data.reps) && data.reps.length > 0
                ? attachAvatars(
                    data.reps.filter(
                      (r: SalesRep) =>
                        r.id !== 'pranesh' && r.username !== 'pranesh' && r.name !== 'pranesh'
                    )
                  )
                : cur.reps;

            const nextStatuses =
              data.statusOptions && Array.isArray(data.statusOptions) && data.statusOptions.length > 0
                ? data.statusOptions.map((s: any) => ({
                    id: s.id || 'st-' + s.text,
                    text: s.text || s.label || 'Dispatched',
                    label: s.label || s.text || 'Dispatched',
                    category: s.category || 'Dispatched',
                  }))
                : cur.statusOptions;

            const curDigest = JSON.stringify({
              sales: cur.sales,
              cycles: cur.cycles,
              reps: cur.reps,
              statusOptions: cur.statusOptions,
            });
            const nextDigest = JSON.stringify({
              sales: nextSales,
              cycles: nextCycles,
              reps: nextReps,
              statusOptions: nextStatuses,
            });

            if (!hadLocalAdditions) {
              lastSyncedDigestRef.current = nextDigest;
            }

            if (nextDigest !== curDigest) {
              if (JSON.stringify(nextSales) !== JSON.stringify(cur.sales)) setSales(nextSales);
              if (JSON.stringify(nextCycles) !== JSON.stringify(cur.cycles)) setCycles(nextCycles);
              if (JSON.stringify(nextReps) !== JSON.stringify(cur.reps)) setReps(nextReps);
              if (JSON.stringify(nextStatuses) !== JSON.stringify(cur.statusOptions))
                setStatusOptions(nextStatuses);
            }

            if (data.lastUpdated) {
              setLastBackupTime(data.lastUpdated);
            }
            setSyncStatus('synced');
          }
        }
      } catch (err) {
        console.warn('Permanent server storage not reachable, operating offline from localStorage.', err);
        setSyncStatus('offline');
      }
    };

    loadFromPermanentStorage();

    // Auto-poll every 5 seconds so MD and all staff see live updates automatically without refresh
    const pollInterval = setInterval(loadFromPermanentStorage, 5000);
    const onFocus = () => loadFromPermanentStorage();
    window.addEventListener('focus', onFocus);
    window.addEventListener('visibilitychange', onFocus);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('visibilitychange', onFocus);
    };
  }, []);

  // 2. Continuous Auto-Sync to Permanent Disk Storage (Only when actual changes occur)
  useEffect(() => {
    if (!sales || sales.length === 0) return;
    const currentDigest = JSON.stringify({ sales, cycles, reps, statusOptions });
    if (currentDigest === lastSyncedDigestRef.current) return;

    const timer = setTimeout(async () => {
      try {
        setSyncStatus('saving');
        const payload = {
          version: '1.0',
          lastUpdated: new Date().toISOString(),
          system: 'Nunes 10-Day Sales Reporting Suite',
          sales,
          cycles,
          reps,
          statusOptions,
        };

        const res = await fetch('/api/storage/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          lastSyncedDigestRef.current = currentDigest;
          setSyncStatus('synced');
          setLastBackupTime(new Date().toLocaleTimeString());
        } else {
          setSyncStatus('offline');
        }
      } catch (e) {
        setSyncStatus('offline');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [sales, cycles, reps, statusOptions]);

  // One-Click Manual Backup Export
  const exportBackupJSON = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      system: 'Nunes 10-Day Sales Reporting Suite',
      version: '1.0',
      totalRecords: sales.length,
      sales,
      cycles,
      reps,
      statusOptions,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nunes_sales_backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // One-Click Manual Backup Restore
  const restoreBackupJSON = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.sales && Array.isArray(parsed.sales)) {
        setSales(parsed.sales);
      }
      if (parsed.cycles && Array.isArray(parsed.cycles)) {
        setCycles(parsed.cycles);
      }
      if (parsed.reps && Array.isArray(parsed.reps)) {
        setReps(parsed.reps);
      }
      if (parsed.statusOptions && Array.isArray(parsed.statusOptions)) {
        const normalized = parsed.statusOptions.map((s: any) => ({
          id: s.id || ('st-' + Math.random()),
          text: s.text || s.label || 'Dispatched',
          label: s.label || s.text || 'Dispatched',
          category: s.category || 'Dispatched',
        }));
        setStatusOptions(normalized);
      }
      triggerCelebration('Database backup restored successfully! 📦');
      return true;
    } catch (err) {
      console.error('Failed to restore backup:', err);
      alert('Invalid backup JSON file. Please check file formatting.');
      return false;
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(cycles));
  }, [cycles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPS, JSON.stringify(reps));
  }, [reps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_CYCLE, selectedCycleId);
  }, [selectedCycleId]);

  const triggerCelebration = (_message = '', _repName = '') => {
    // Celebration runner animation completely removed as requested
  };

  const verifyCredentials = (
    usernameInput: string,
    passwordInput: string
  ): { success: boolean; role?: 'MD' | 'EMPLOYEE'; repName?: string; error?: string } => {
    const rawUser = usernameInput.trim().toLowerCase();
    const cleanUser = rawUser.includes('@') ? rawUser.split('@')[0] : rawUser;
    const cleanPass = passwordInput.trim();

    // 1. Team Lead Vengateshan TL: Full Access like MD View
    if (
      cleanUser === 'vengateshan' ||
      cleanUser === 'vengatesh' ||
      cleanUser === 'tl' ||
      rawUser === 'vengateshan@company.com' ||
      rawUser === 'vengatesh@company.com' ||
      rawUser === 'tl@company.com'
    ) {
      if (
        cleanPass === 'vengatesh123' ||
        cleanPass === 'vengatesh' ||
        cleanPass === 'tl2026' ||
        cleanPass === '1234' ||
        cleanPass === mdPassword ||
        cleanPass === 'md2026'
      ) {
        return {
          success: true,
          role: 'MD',
          repName: 'Vengateshan TL',
        };
      }
      return { success: false, error: 'Incorrect password for Vengateshan TL. Try vengatesh123 or 1234.' };
    }

    if (
      cleanUser === 'md' ||
      cleanUser === 'admin' ||
      cleanUser === 'nunes' ||
      rawUser === 'nunes@company.com' ||
      rawUser === 'md@company.com' ||
      rawUser === 'admin@company.com'
    ) {
      const isCustomMdPass = mdPassword && mdPassword !== 'md2026';
      const validMdPass = isCustomMdPass
        ? cleanPass === mdPassword
        : (cleanPass === mdPassword ||
           cleanPass === 'md2026' ||
           cleanPass === 'nunes123' ||
           cleanPass === 'nunes2026' ||
           cleanPass === '2026' ||
           cleanPass === 'admin');
      if (validMdPass) {
        return {
          success: true,
          role: 'MD',
          repName: cleanUser === 'nunes' ? 'Nunes' : 'Managing Director',
        };
      }
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    const rep = reps.find((r) => {
      const u = r.username.toLowerCase();
      const n = r.name.toLowerCase();
      const d = r.displayName.toLowerCase();
      const e = (r.email || '').toLowerCase();
      return (
        u === cleanUser ||
        u === rawUser ||
        n === cleanUser ||
        n === rawUser ||
        e === rawUser ||
        e.split('@')[0] === cleanUser ||
        d === cleanUser ||
        d === rawUser ||
        d.includes(cleanUser) ||
        cleanUser.includes(n)
      );
    });

    if (rep) {
      if (
        cleanPass === rep.password ||
        cleanPass === rep.pin
      ) {
        return { success: true, role: 'EMPLOYEE', repName: rep.displayName };
      }
      return { success: false, error: 'Incorrect password for this user.' };
    }

    return {
      success: false,
      error: 'Account not found. Please check your email/username or sign up.',
    };
  };

  const loginWithCredentials = (
    usernameInput: string,
    passwordInput: string,
    lockDevice = false
  ): { success: boolean; role?: 'MD' | 'EMPLOYEE'; repName?: string; error?: string } => {
    const check = verifyCredentials(usernameInput, passwordInput);
    if (!check.success) return check;

    if (check.role === 'MD') {
      const isTL = check.repName === 'Vengateshan TL';
      const newSession: UserSession = {
        isAuthenticated: true,
        role: 'MD',
        repId: isTL ? 'vengateshan' : 'MD',
        repName: check.repName || 'Managing Director',
        isDeviceLocked: false,
      };
      setSession(newSession);
      setCurrentRoleState('MD');
      return check;
    }

    const rawUser = usernameInput.trim().toLowerCase();
    const cleanUser = rawUser.includes('@') ? rawUser.split('@')[0] : rawUser;
    const rep = reps.find((r) => {
      const u = r.username.toLowerCase();
      const n = r.name.toLowerCase();
      const d = r.displayName.toLowerCase();
      const e = (r.email || '').toLowerCase();
      return (
        u === cleanUser ||
        u === rawUser ||
        n === cleanUser ||
        n === rawUser ||
        e === rawUser ||
        e.split('@')[0] === cleanUser ||
        d === cleanUser ||
        d === rawUser ||
        d.includes(cleanUser) ||
        cleanUser.includes(n)
      );
    });

    if (rep) {
      const newSession: UserSession = {
        isAuthenticated: true,
        role: 'EMPLOYEE',
        repId: rep.name.toLowerCase(),
        repName: rep.displayName,
        isDeviceLocked: lockDevice,
      };
      setSession(newSession);
      setCurrentRoleState(rep.name.toLowerCase());
    }

    return check;
  };

  const loginAsMD = (pin: string): boolean => {
    return loginWithCredentials('md', pin).success;
  };

  const loginAsRep = (repId: string, pin: string, lockDevice: boolean): boolean => {
    return loginWithCredentials(repId, pin, lockDevice).success;
  };

  const logout = () => {
    setCurrentRoleState('');
    setSession({
      isAuthenticated: false,
      role: 'EMPLOYEE',
      repId: '',
      repName: '',
      isDeviceLocked: false,
    });
  };

  const unlockDevice = () => {
    setSession((prev) => ({
      ...prev,
      isDeviceLocked: false,
    }));
  };

  const setCurrentRole = (role: CurrentUserRole) => {
    if (!session.isAuthenticated) return;
    if (session.role !== 'MD' && role.toLowerCase() !== session.repId.toLowerCase()) {
      return;
    }
    setCurrentRoleState(role);
  };

  const setSelectedCycleId = (cycleId: string) => {
    setSelectedCycleIdState(cycleId);
  };

  const addSaleItem = (itemData: Omit<SaleItem, 'id' | 'slNo' | 'updatedAt'>) => {
    const newSlNo = sales.length > 0 ? Math.max(...sales.map((s) => s.slNo || 0)) + 1 : 1;
    let assignedCycle = itemData.cycleId;
    if (!assignedCycle || assignedCycle === 'all') {
      const targetDate = itemData.recPayDate || itemData.inqDate;
      assignedCycle = resolveCycleForSaleDate(targetDate, cycles);
    }
    const newItem: SaleItem = {
      ...itemData,
      cycleId: assignedCycle,
      id: `sale-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      slNo: newSlNo,
      updatedAt: new Date().toISOString(),
    };
    setSales((prev) => [newItem, ...prev]);

    // Trigger celebration runner when fully completed
    if (!newItem.isDraft) {
      triggerCelebration(`Logged "${newItem.item}"! 🎉`, newItem.purchaserName);
    }
  };

  const updateSaleItem = (id: string, updates: Partial<SaleItem>) => {
    setSales((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          // If completing a previously saved draft, celebrate completion!
          if (item.isDraft && updates.isDraft === false) {
            triggerCelebration(`Finished draft & submitted "${updated.item}"! 🏆`, updated.purchaserName);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const deleteSaleItem = (id: string) => {
    setSales((prev) => prev.filter((item) => item.id !== id));
  };

  const addCycle = (cycleData: Omit<ReportingCycle, 'id'>) => {
    const id = cycleData.month && cycleData.cycleNumber 
      ? `${cycleData.month}-C${cycleData.cycleNumber}` 
      : `cycle-${Date.now()}`;
    
    const exists = cycles.some((c) => c.id === id);
    const finalId = exists ? `cycle-${Date.now()}` : id;

    const newCycle: ReportingCycle = {
      ...cycleData,
      id: finalId,
    };

    setCycles((prev) => {
      if (newCycle.isCurrent) {
        return [...prev.map((c) => ({ ...c, isCurrent: false })), newCycle];
      }
      return [...prev, newCycle];
    });

    if (newCycle.isCurrent) {
      setSelectedCycleIdState(finalId);
    }
  };

  const setActiveCycle = (cycleId: string) => {
    setCycles((prev) =>
      prev.map((c) => ({
        ...c,
        isCurrent: c.id === cycleId,
      }))
    );
    setSelectedCycleIdState(cycleId);
  };

  const addRep = (repData: Omit<SalesRep, 'id'>) => {
    const id = repData.name.toLowerCase().replace(/\s+/g, '-');
    const newRep: SalesRep = {
      ...repData,
      id,
    };
    setReps((prev) => [...prev, newRep]);
  };

  const resetToDefaultData = () => {
    // Automatically creates a backup snapshot before resetting
    exportBackupJSON();
    setSales(INITIAL_SALES);
    setCycles(INITIAL_CYCLES);
    setReps(INITIAL_REPS);
    setSelectedCycleIdState('all');
  };

  const clearAllSalesData = () => {
    exportBackupJSON();
    setSales([]);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([]));
    fetch('/api/storage/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sales: [],
        cycles,
        reps,
        statusOptions,
        isFreshWiped: true,
      }),
    }).catch((err) => console.error('Error clearing sales storage:', err));
  };

  const isMD = session.isAuthenticated && session.role === 'MD' && (currentRole === 'MD' || currentRole === 'vengateshan');
  const activeRep = reps.find((r) => r.id === currentRole || r.name.toLowerCase() === currentRole.toLowerCase());

  const getFilteredSales = () => {
    let list = sales;

    if (!isMD) {
      const repKey = currentRole.toLowerCase();
      list = list.filter((s) => s.purchaserName.toLowerCase() === repKey);
    }

    if (selectedCycleId !== 'all') {
      list = list.filter((s) => s.cycleId === selectedCycleId);
    }

    return list;
  };

  return (
    <SalesContext.Provider
      value={{
        sales,
        cycles,
        reps,
        statusOptions,
        session,
        celebrationState,
        currentRole,
        selectedCycleId,
        isMD,
        activeRep,
        addSaleItem,
        updateSaleItem,
        deleteSaleItem,
        addStatusOption,
        renameStatusOption,
        deleteStatusOption,
        setCurrentRole,
        setSelectedCycleId,
        addCycle,
        setActiveCycle,
        addRep,
        loginAsMD,
        loginAsRep,
        verifyCredentials,
        loginWithCredentials,
        resetPassword,
        logout,
        unlockDevice,
        triggerCelebration,
        resetToDefaultData,
        clearAllSalesData,
        getFilteredSales,
        syncStatus,
        lastBackupTime,
        exportBackupJSON,
        restoreBackupJSON,
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
