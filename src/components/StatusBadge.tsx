import React from 'react';
import { Truck, Clock, CheckCircle2, AlertCircle, ShoppingCart } from 'lucide-react';
import type { StatusCategory } from '../types';

interface StatusBadgeProps {
  status: string;
  category?: StatusCategory;
  isDraft?: boolean;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, category, isDraft = false, showIcon = true }) => {
  const normalized = status.toLowerCase();

  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
  let icon = <Clock className="w-3 h-3 text-slate-500" />;
  let dotColor = 'bg-slate-400';

  if (isDraft || normalized.includes('draft') || normalized.includes('incomplete') || normalized.includes('half')) {
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
    icon = <Clock className="w-3 h-3 text-amber-700 animate-pulse" />;
    dotColor = 'bg-amber-500';
  } else if (category === 'Delivered / Saled' || normalized.includes('saled') || normalized.includes('delivered') || normalized.includes('completed')) {
    badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    icon = <CheckCircle2 className="w-3 h-3 text-emerald-600" />;
    dotColor = 'bg-emerald-500';
  } else if (category === 'Dispatched' || normalized.includes('dispatched by supplier') || normalized.includes('dispatched via') || normalized.includes('customs cleared')) {
    badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
    icon = <Truck className="w-3 h-3 text-blue-600" />;
    dotColor = 'bg-blue-500';
  } else if (category === 'Pending Dispatch' || normalized.includes('dispatched by') || normalized.includes('pending')) {
    badgeColor = 'bg-amber-50 text-amber-900 border-amber-200';
    icon = <Clock className="w-3 h-3 text-amber-600" />;
    dotColor = 'bg-amber-500';
  } else if (category === 'Partial Supply' || normalized.includes('one item supplied') || normalized.includes('partial')) {
    badgeColor = 'bg-purple-50 text-purple-900 border-purple-200';
    icon = <AlertCircle className="w-3 h-3 text-purple-600" />;
    dotColor = 'bg-purple-500';
  } else if (category === 'Order Placed' || normalized.includes('order placed') || normalized.includes('ordered')) {
    badgeColor = 'bg-cyan-50 text-cyan-900 border-cyan-200';
    icon = <ShoppingCart className="w-3 h-3 text-cyan-600" />;
    dotColor = 'bg-cyan-500';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${badgeColor} transition-all whitespace-nowrap`}
      title={status}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {showIcon && icon}
      <span className="truncate max-w-[170px]">{status}</span>
    </span>
  );
};
