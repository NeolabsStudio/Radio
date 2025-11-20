import React, { useEffect, useRef, useState } from 'react';
import { Icons } from './Icons';
import { AudioTrack, AudioStatus } from '../types';
import { getAudioContext, formatTime } from '../services/audioUtils';

interface AudioPlayerProps {
  track: AudioTrack | null;
  status: AudioStatus;
  setStatus: (status: AudioStatus) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ track, status, setStatus }) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Handle Playback Logic
  useEffect(() => {
    if (!track || !track.audioBuffer) return;

    const ctx = getAudioContext();

    const play = () => {
      if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch(e) {}
      }

      const source = ctx.createBufferSource();
      source.buffer = track.audioBuffer;
      
      const gain = ctx.createGain();
      gain.gain.value = volume;
      
      source.connect(gain);
      gain.connect(ctx.destination);

      sourceRef.current = source;
      gainRef.current = gain;

      // Calculate start time based on paused position
      const offset = pauseTimeRef.current;
      startTimeRef.current = ctx.currentTime - offset;

      source.start(0, offset);
      setStatus(AudioStatus.PLAYING);

      source.onended = () => {
        // Check if it ended naturally or was stopped
        if (ctx.currentTime - startTimeRef.current >= (track.audioBuffer?.duration || 0)) {
          setStatus(AudioStatus.IDLE);
          setProgress(0);
          pauseTimeRef.current = 0;
        }
      };
    };

    if (status === AudioStatus.PLAYING && !sourceRef.current) {
      // Initial play trigger
      if (ctx.state === 'suspended') ctx.resume();
      play();
    } else if (status === AudioStatus.PLAYING && sourceRef.current) {
      // Already playing, do nothing (or handle resume if previously paused logic handled elsewhere)
    } else if (status === AudioStatus.PAUSED) {
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
          pauseTimeRef.current = ctx.currentTime - startTimeRef.current;
        } catch (e) {}
        sourceRef.current = null;
      }
    }

    return () => {
      // Cleanup is handled by control logic, but safety stop on unmount
      if (sourceRef.current && status === AudioStatus.IDLE) {
         try { sourceRef.current.stop(); } catch(e) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, status]); // Only re-run if track changes or status explicitly toggles

  // Progress Loop
  useEffect(() => {
    const updateProgress = () => {
      if (status === AudioStatus.PLAYING && track?.audioBuffer) {
        const ctx = getAudioContext();
        const current = ctx.currentTime - startTimeRef.current;
        const percent = (current / track.audioBuffer.duration) * 100;
        setProgress(Math.min(percent, 100));
        
        if (current < track.audioBuffer.duration) {
            rafRef.current = requestAnimationFrame(updateProgress);
        }
      }
    };

    if (status === AudioStatus.PLAYING) {
      rafRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [status, track]);

  // Volume Control
  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (status === AudioStatus.PLAYING) {
      setStatus(AudioStatus.PAUSED);
    } else if (status === AudioStatus.PAUSED || status === AudioStatus.IDLE) {
      setStatus(AudioStatus.PLAYING);
    }
  };

  if (!track && status !== AudioStatus.GENERATING) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-3 md:p-4 z-50 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
        
        {/* Track Info */}
        <div className="flex items-center gap-4 w-1/3">
          {track ? (
            <>
              <div className="w-14 h-14 bg-slate-800 rounded-lg overflow-hidden relative shadow-lg border border-slate-700">
                <img src={track.imageUrl} alt="cover" className="w-full h-full object-cover" />
                {status === AudioStatus.PLAYING && (
                    <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-1.5 gap-[3px]">
                       <div className="audio-wave-bar bg-white" style={{animationDuration: '0.6s'}}></div>
                       <div className="audio-wave-bar bg-white" style={{animationDuration: '0.8s'}}></div>
                       <div className="audio-wave-bar bg-white" style={{animationDuration: '0.5s'}}></div>
                    </div>
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm truncate text-white">{track.title}</span>
                <span className="text-xs text-slate-400 truncate font-medium">Host: {track.artist}</span>
              </div>
            </>
          ) : (
             <div className="flex items-center gap-3 animate-pulse">
                <div className="w-14 h-14 bg-slate-800 rounded-lg"></div>
                <div className="flex flex-col gap-2">
                    <div className="w-32 h-3 bg-slate-800 rounded"></div>
                    <div className="w-20 h-3 bg-slate-800 rounded"></div>
                </div>
             </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center justify-center w-1/3">
          <div className="flex items-center gap-6 mb-2">
            <button className="text-slate-400 hover:text-white transition-colors">
              <Icons.SkipBack size={20} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-105 transition-transform hover:bg-blue-50"
              disabled={status === AudioStatus.GENERATING}
            >
              {status === AudioStatus.GENERATING ? (
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : status === AudioStatus.PLAYING ? (
                <Icons.Pause size={20} fill="currentColor" />
              ) : (
                <Icons.Play size={20} fill="currentColor" className="ml-1" />
              )}
            </button>
            
            <button className="text-slate-400 hover:text-white transition-colors">
              <Icons.SkipForward size={20} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md flex items-center gap-3 text-xs font-medium text-slate-500">
             <span className="w-8 text-right">{formatTime((track?.duration || 0) * (progress / 100))}</span>
             <div className="relative flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden group cursor-pointer">
               <div 
                 className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" 
                 style={{ width: `${progress}%` }} 
               />
             </div>
             <span className="w-8">{formatTime(track?.duration || 0)}</span>
          </div>
        </div>

        {/* Volume / Extra */}
        <div className="flex items-center justify-end gap-4 w-1/3">
           <button className="text-slate-400 hover:text-white hidden sm:block">
             <Icons.Mic size={18} />
           </button>
           <div className="flex items-center gap-2 group">
             <button 
               onClick={() => setVolume(prev => prev === 0 ? 0.8 : 0)}
               className="text-slate-400 group-hover:text-white"
             >
               {volume === 0 ? <Icons.VolumeX size={20} /> : <Icons.Volume2 size={20} />}
             </button>
             <input 
               type="range" 
               min="0" 
               max="1" 
               step="0.01" 
               value={volume}
               onChange={(e) => setVolume(parseFloat(e.target.value))}
               className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
             />
           </div>
        </div>

      </div>
    </div>
  );
};

export default AudioPlayer;