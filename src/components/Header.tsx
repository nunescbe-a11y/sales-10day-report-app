import { getStaffAvatarUrl } from '../utils/staffAvatars';
import React from 'react';
import { 
  Crown, 
  UserPlus, 
  FileSpreadsheet,
  HardDriveDownload,
  HardDriveUpload,
  LogOut
} from 'lucide-react';
import { useSales } from '../context/SalesContext';
interface HeaderProps {
  onOpenAddModal?: () => void;
  onOpenCycleModal?: () => void;
  onOpenAddRepModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddRepModal,
}) => {
  const {
    currentRole,
    setCurrentRole,
    isMD,
    reps,
    session,
    exportBackupJSON,
    restoreBackupJSON,
    logout,
  } = useSales();



  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="w-full px-3 sm:px-5 py-2 flex items-center justify-between gap-3">
        {/* Brand & Cloudflare Status */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight leading-none text-slate-900">
                Nunes Sales Hub
              </h1>

            </div>
            <p className="text-[10px] mt-0.5 text-slate-500">
              {isMD ? (session.repName === 'Vengateshan TL' ? 'Team Lead • Executive All-Company Oversight & Staff Monitoring' : 'Executive All-Company Oversight') : `Staff View: ${session.repName || currentRole}`}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">


          {/* User Role Switcher - Available strictly to Managing Director */}
          {session.role === 'MD' && (
            <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
              {currentRole !== 'MD' && getStaffAvatarUrl(currentRole, reps) && (
                <div className="pl-1.5 shrink-0 flex items-center">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-indigo-400 shrink-0">
                    <img
                      src={getStaffAvatarUrl(currentRole, reps)}
                      alt={currentRole}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
                {currentRole === 'MD' && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                View:
              </span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs sm:text-sm font-bold bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-xs"
              >
                <option value="MD">{session.repName === 'Vengateshan TL' ? '⭐ TL Monitoring & Oversight Dashboard' : '👑 MD All-Company Dashboard'}</option>
                <optgroup label="Inspect Staff Sales Workspace">
                  {reps.map((r) => (
                    <option key={r.id} value={r.name}>
                      👤 {r.displayName}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}

          

          {/* Add Rep button (MD only) */}
          {isMD && (
            <button
              onClick={onOpenAddRepModal}
              title="Add New Sales Representative"
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}

          {/* Export Full Backup (.json) - MD Only */}
          {isMD && (
            <button
              onClick={exportBackupJSON}
              title="Download Full Database Backup Snapshot (.json)"
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition cursor-pointer"
            >
              <HardDriveDownload className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Restore Backup (.json) */}
          {isMD && (
            <label
              title="Restore Database from Backup (.json file)"
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition cursor-pointer flex items-center"
            >
              <HardDriveUpload className="w-3.5 h-3.5" />
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const content = event.target?.result as string;
                      if (content) {
                        restoreBackupJSON(content);
                      }
                    };
                    reader.readAsText(file);
                  }
                  e.target.value = '';
                }}
              />
            </label>
          )}

                    

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => {
              logout();
            }}
            title="Sign out to Profile Login Screen"
            className="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-xs font-bold hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>


    </header>
  );
};
