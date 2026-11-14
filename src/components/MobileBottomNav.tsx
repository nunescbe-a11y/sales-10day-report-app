import React from 'react';
import {
  TrendingUp,
  FileSpreadsheet,
  Sparkles,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useSales } from '../context/SalesContext';

interface MobileBottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: any) => void;
  onOpenUploadModal: () => void;
  onOpenCycleModal?: () => void;
  onOpenProfile?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab = 'analytics',
  onTabChange,
  onOpenUploadModal,
  onOpenCycleModal,
  onOpenProfile,
}) => {
  const { session } = useSales();

  if (!session.isAuthenticated) return null;

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 py-1 px-2 flex items-center justify-around text-slate-600 shadow-lg safe-area-pb">
      <button
        type="button"
        onClick={() => onTabChange && onTabChange('analytics')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold transition cursor-pointer ${
          activeTab === 'analytics' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <TrendingUp className="w-4 h-4" />
        <span>Charts</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange && onTabChange('sheet')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold transition cursor-pointer ${
          activeTab === 'sheet' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span>Sheet</span>
      </button>

      {/* Floating Center Action Button for Upload Form */}
      <button
        type="button"
        onClick={onOpenUploadModal}
        className="flex flex-col items-center justify-center -mt-4 w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg border-2 border-white transition active:scale-95 cursor-pointer"
        title="Upload order form or snap photo"
      >
        <Sparkles className="w-5 h-5 text-amber-300" />
      </button>

      {onOpenCycleModal && (
        <button
          type="button"
          onClick={onOpenCycleModal}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          <Clock className="w-4 h-4" />
          <span>Cycles</span>
        </button>
      )}

      {onOpenProfile && (
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>Profile</span>
        </button>
      )}
    </nav>
  );
};
