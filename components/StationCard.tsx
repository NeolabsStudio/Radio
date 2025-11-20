
import React from 'react';
import { Station, AudioStatus } from '../types';
import { Icons } from './Icons';

interface StationCardProps {
  station: Station;
  currentStationId?: string;
  status: AudioStatus;
  onPlay: (station: Station) => void;
}

const StationCard: React.FC<StationCardProps> = ({ station, currentStationId, status, onPlay }) => {
  const isCurrent = currentStationId === station.id;
  const isPlaying = isCurrent && status === AudioStatus.PLAYING;
  const isGenerating = isCurrent && status === AudioStatus.GENERATING;

  return (
    <div className="group relative flex flex-col gap-3 cursor-pointer w-full">
      {/* Image Container */}
      <div 
        className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300"
        onClick={() => onPlay(station)}
      >
        <img 
          src={station.imageUrl} 
          alt={station.title} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isPlaying ? 'scale-105' : ''}`}
        />
        
        {/* Overlay - Clean & Minimal */}
        <div className={`absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-opacity duration-300 ${isPlaying || isGenerating ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} flex items-center justify-center`}>
          <button className="w-12 h-12 rounded-full bg-white text-[#0050ff] flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
            {isGenerating ? (
               <div className="w-5 h-5 border-2 border-[#0050ff] border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
               <Icons.Pause size={24} fill="currentColor" />
            ) : (
               <Icons.Play size={24} fill="currentColor" className="ml-1" />
            )}
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
           <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur px-2 py-1 rounded uppercase tracking-wider self-start">
             {station.category}
           </span>
           {station.isPremium && (
             <span className="text-[10px] font-bold text-white bg-[#ffd700] text-yellow-900 px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 self-start">
               <Icons.Lock size={8} /> Premium
             </span>
           )}
        </div>

        {/* Live Indicator */}
        {isCurrent && (status === AudioStatus.PLAYING || status === AudioStatus.GENERATING) && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            PLAYING
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-0.5">
        <h3 
          onClick={() => onPlay(station)}
          className={`font-bold text-base leading-tight mb-1 transition-colors ${isCurrent ? 'text-[#0050ff]' : 'text-slate-900 group-hover:text-[#0050ff]'}`}
        >
          {station.title}
        </h3>
        <div className="flex items-center justify-between">
            <p className="text-slate-500 text-xs font-medium flex items-center gap-1">
               {station.isUserGenerated ? <Icons.User size={10} /> : <Icons.Radio size={10} />}
               {station.author}
            </p>
        </div>
      </div>
    </div>
  );
};

export default StationCard;
