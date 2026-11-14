import React, { useState } from 'react';
import { getStaffAvatarUrl } from '../utils/staffAvatars';
import type { SalesRep } from '../types';

interface StaffAvatarProps {
  name: string;
  avatarUrl?: string;
  reps?: SalesRep[];
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showName?: boolean;
  nameClassName?: string;
  badge?: React.ReactNode;
  alt?: string;
}

const SIZE_MAP = {
  xs: 'w-5 h-5 min-w-[20px] text-[9px]',
  sm: 'w-7 h-7 min-w-[28px] text-[11px]',
  md: 'w-8 h-8 min-w-[32px] text-xs',
  lg: 'w-10 h-10 min-w-[40px] text-sm',
  xl: 'w-12 h-12 min-w-[48px] text-base',
  '2xl': 'w-16 h-16 min-w-[64px] text-lg',
};

export const StaffAvatar: React.FC<StaffAvatarProps> = ({
  name,
  avatarUrl,
  reps,
  size = 'md',
  className = '',
  showName = false,
  nameClassName = '',
  badge,
  alt,
}) => {
  const [loadFailed, setLoadFailed] = useState(false);
  const resolvedUrl = !loadFailed ? avatarUrl || getStaffAvatarUrl(name, reps) : undefined;
  const initial = (name || '?').trim().charAt(0).toUpperCase();

  const containerSize = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div className={`inline-flex items-center gap-2 ${showName ? '' : 'shrink-0'}`}>
      <div
        className={`relative ${containerSize} rounded-full overflow-hidden border-2 border-indigo-400/80 shadow-xs ring-1 ring-white/40 shrink-0 bg-slate-800 ${className}`}
        title={name}
      >
        {resolvedUrl ? (
          <img
            src={resolvedUrl}
            alt={alt || name}
            onError={() => setLoadFailed(true)}
            className="w-full h-full object-cover block"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center">
            {initial}
          </div>
        )}

        {badge && <div className="absolute -top-1 -right-1 z-10">{badge}</div>}
      </div>

      {showName && (
        <span className={`font-bold capitalize truncate ${nameClassName || 'text-xs text-slate-800'}`}>
          {name}
        </span>
      )}
    </div>
  );
};
