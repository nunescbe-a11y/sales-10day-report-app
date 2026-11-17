import { getStaffAvatarUrl } from '../utils/staffAvatars';
import { AVATAR_VENGATESHAN } from '../utils/staffAvatarsData';
import React, { useState } from 'react';
import { 
  Crown, 
  UserPlus, 
  FileSpreadsheet,
  HardDriveDownload,
  HardDriveUpload,
  UserCheck,
  LogOut
} from 'lucide-react';
import { useSales } from '../context/SalesContext';
import { StaffLoginModal } from './StaffLoginModal';
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

  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(false);
  const activeRep = reps.find((r) => r.name.toLowerCase() === currentRole.toLowerCase() || r.id === currentRole);

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
          {/* Authenticated Profile Card (Switchable only if logged in as MD) */}
          {session.role === 'MD' ? (
            <button
              type="button"
              onClick={() => setIsStaffLoginOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 transition cursor-pointer shadow-xs"
              title="Click to inspect staff members' workspaces"
            >
              {session.repName === 'Vengateshan TL' && currentRole === 'MD' ? (
                <img
                  src={AVATAR_VENGATESHAN}
                  alt="Vengateshan TL"
                  className="w-7 h-7 rounded-full object-cover border-2 border-emerald-500 shrink-0 shadow-xs"
                />
              ) : getStaffAvatarUrl(activeRep?.name || currentRole, reps) || activeRep?.avatarUrl ? (
                <img
                  src={getStaffAvatarUrl(activeRep?.name || currentRole, reps) || activeRep?.avatarUrl}
                  alt={activeRep ? activeRep.displayName : 'Staff'}
                  className="w-7 h-7 rounded-full object-cover border-2 border-indigo-500 shrink-0 shadow-xs"
                />
              ) : (
                <div
                  className={`w-7 h-7 rounded-full ${
                    activeRep?.avatarColor || 'bg-gradient-to-tr from-amber-500 to-orange-500'
                  } text-white text-xs font-black flex items-center justify-center shrink-0 shadow-xs`}
                >
                  {activeRep ? activeRep.displayName.charAt(0) : '👑'}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <span className="block text-xs font-black leading-tight text-slate-900">
                  {currentRole === 'MD'
                    ? (session.repName === 'Vengateshan TL' ? 'Vengateshan TL' : 'MD Executive')
                    : (activeRep ? activeRep.displayName : 'Staff')}
                </span>
                <span className="block text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                  {session.repName === 'Vengateshan TL'
                    ? (currentRole === 'MD' ? 'Team Lead • Monitor' : 'Inspecting Staff Workspace')
                    : (currentRole === 'MD' ? 'Director • Oversight' : 'Inspecting Staff Workspace')}
                </span>
              </div>
              <UserCheck className="w-4 h-4 text-indigo-600 hidden md:block" />
            </button>
          ) : null}

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
              setIsStaffLoginOpen(false);
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

      <StaffLoginModal
        isOpen={isStaffLoginOpen}
        onClose={() => setIsStaffLoginOpen(false)}
      />
    </header>
  );
};
