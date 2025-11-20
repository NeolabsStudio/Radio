
import React from 'react';
import { Episode } from '../types';
import { Icons } from './Icons';

interface EpisodeListProps {
  episodes: Episode[];
  onPlay: (episode: Episode) => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, onPlay }) => {
  return (
    <div className="space-y-1">
      {episodes.map((ep) => (
        <div 
          key={ep.id} 
          className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white hover:shadow-sm hover:border-slate-100 border border-transparent transition-all cursor-pointer"
          onClick={() => onPlay(ep)}
        >
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
            <img src={ep.imageUrl} alt={ep.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Icons.Play size={16} className="text-white fill-current" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
             <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-[#0050ff] transition-colors">{ep.title}</h4>
             <p className="text-xs text-slate-500 truncate">{ep.description}</p>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-1 text-xs text-slate-400">
            <span className="font-medium">{ep.date}</span>
            <span className="flex items-center gap-1"><Icons.Clock size={10} /> {ep.duration}</span>
          </div>

          <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0050ff] hover:border-[#0050ff] bg-white">
             <Icons.Play size={12} fill="currentColor" className="ml-0.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default EpisodeList;
