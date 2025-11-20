
import React from 'react';
import { Program } from '../types';
import { Icons } from './Icons';

interface ProgramGuideProps {
  schedule: Program[];
}

const ProgramGuide: React.FC<ProgramGuideProps> = ({ schedule }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-8 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Icons.Clock size={20} className="text-[#00b0f0]" /> 
          Schedule
        </h3>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded uppercase">Today</span>
      </div>
      
      <div className="space-y-0 relative">
        {/* Vertical Line */}
        <div className="absolute left-[3.25rem] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800"></div>

        {schedule.map((prog) => (
          <div key={prog.id} className="relative flex items-center gap-6 py-3 group">
            {/* Time */}
            <div className={`w-10 text-sm font-bold text-right ${prog.isLive ? 'text-[#00b0f0]' : 'text-slate-400 dark:text-slate-500'}`}>
              {prog.time}
            </div>

            {/* Dot */}
            <div className={`relative z-10 w-3 h-3 rounded-full border-2 ${prog.isLive ? 'bg-[#00b0f0] border-white dark:border-slate-900 ring-2 ring-[#00b0f0]/20' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}></div>

            {/* Card */}
            <div className={`flex-1 p-3 rounded-lg transition-all ${prog.isLive ? 'bg-[#00b0f0]/5 border border-[#00b0f0]/20' : 'bg-slate-50/50 dark:bg-slate-800/50 border border-transparent group-hover:bg-slate-50 dark:group-hover:bg-slate-800 group-hover:border-slate-100 dark:group-hover:border-slate-700'}`}>
               <div className="flex items-center justify-between">
                 <div>
                   <h4 className={`font-bold text-sm ${prog.isLive ? 'text-[#0050ff] dark:text-[#3b82f6]' : 'text-slate-700 dark:text-slate-300'}`}>{prog.title}</h4>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Host: {prog.host}</p>
                 </div>
                 {prog.isLive && (
                   <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider animate-pulse">
                     Live
                   </span>
                 )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramGuide;