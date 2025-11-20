
import React from 'react';
import { Icons } from './Icons';

const Hero: React.FC = () => {
  return (
    <div className="relative w-full h-[350px] md:h-[400px] rounded-2xl mb-8 shadow-xl shadow-slate-200 overflow-hidden group">
      <img 
        src="https://picsum.photos/1200/800?random=99" 
        alt="Featured" 
        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-10">
        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#00b0f0] text-white text-[11px] font-bold uppercase tracking-widest w-fit mb-3">
           <Icons.Radio size={12} /> Featured
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
          The Morning Show: <br/>
          <span className="text-[#60a5fa]">AI Revolution</span>
        </h1>
        <p className="text-slate-200 max-w-xl text-base md:text-lg mb-6 font-medium line-clamp-2">
          Start your day with personalized insights. Your AI host brings you the latest in tech, world news, and weather, tailored just for you.
        </p>
        <div className="flex gap-3">
          <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-all hover:scale-105 flex items-center gap-2 text-sm">
            <Icons.Play size={18} fill="currentColor" className="text-[#0050ff]" /> Play Now
          </button>
          <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-3 rounded-full font-bold hover:bg-white/30 transition-all flex items-center justify-center">
            <Icons.Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
