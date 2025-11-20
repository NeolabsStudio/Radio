
import React from 'react';
import { Icons } from './Icons';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionLabel, onAction }) => {
  return (
    <div className="flex items-center justify-between mb-4 px-1">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
        {title}
      </h2>
      {actionLabel && onAction && (
        <button 
          onClick={onAction} 
          className="group flex items-center gap-1 text-xs font-bold text-[#00b0f0] hover:text-[#0050ff] transition-colors uppercase tracking-wider"
        >
          {actionLabel}
          <Icons.SkipForward size={14} className="transition-transform group-hover:translate-x-1" />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
