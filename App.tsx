
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import StationCard from './components/StationCard';
import AudioPlayer from './components/AudioPlayer';
import SectionHeader from './components/SectionHeader';
import ProgramGuide from './components/ProgramGuide';
import EpisodeList from './components/EpisodeList';
import UploadView from './components/UploadView';
import CreatorDashboard from './components/CreatorDashboard';
import { Icons } from './components/Icons';
import { MOCK_STATIONS, CATEGORIES, MOCK_EPISODES, MOCK_SCHEDULE } from './constants';
import { Station, AudioStatus, AudioTrack, ViewPage, ContentType, Episode } from './types';
import { generateStationContent } from './services/geminiService';
import { getAudioContext, decodeAudioData } from './services/audioUtils';

function App() {
  const [activePage, setActivePage] = useState<ViewPage>('home');
  const [allStations, setAllStations] = useState<Station[]>(MOCK_STATIONS);
  const [currentStationId, setCurrentStationId] = useState<string | undefined>(undefined);
  const [audioStatus, setAudioStatus] = useState<AudioStatus>(AudioStatus.IDLE);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handlePlayStation = async (station: Station) => {
    if (currentStationId === station.id) {
      if (audioStatus === AudioStatus.PLAYING) {
        setAudioStatus(AudioStatus.PAUSED);
      } else if (audioStatus === AudioStatus.PAUSED) {
        setAudioStatus(AudioStatus.PLAYING);
      }
      return;
    }

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    setErrorMsg(null);
    setCurrentStationId(station.id);
    setAudioStatus(AudioStatus.GENERATING);
    
    // Determine Artist display
    const artistDisplay = station.isUserGenerated ? station.author : `AI Host (${station.voice})`;

    setCurrentTrack(prev => prev ? { ...prev, title: 'Loading Content...', artist: station.title } : null);

    try {
      let audioBuffer: AudioBuffer;

      if (station.isUserGenerated && station.audioUrl) {
        // Handle User Uploaded Audio (fetch blob URL and decode)
        const response = await fetch(station.audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        // Native decode for user files (mp3/wav)
        audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      } else {
        // Handle AI Generated Content
        const content = await generateStationContent(station);
        if (!content.audioBase64) {
          throw new Error("Audio generation failed");
        }
        audioBuffer = await decodeAudioData(content.audioBase64);
      }
      
      const newTrack: AudioTrack = {
        id: Date.now().toString(),
        title: station.title,
        artist: artistDisplay,
        imageUrl: station.imageUrl,
        audioBuffer: audioBuffer,
        duration: audioBuffer.duration
      };

      setCurrentTrack(newTrack);
      setAudioStatus(AudioStatus.PLAYING);
    } catch (err) {
      console.error("Playback error:", err);
      setErrorMsg("Failed to play content. Please check API Key or file format.");
      setAudioStatus(AudioStatus.ERROR);
      setCurrentStationId(undefined);
    }
  };

  const handlePlayEpisode = (episode: Episode) => {
    const parentStation = allStations.find(s => s.id === episode.stationId);
    if (parentStation) {
      handlePlayStation(parentStation);
    }
  };

  const handleUpload = (newStation: Station) => {
    setAllStations(prev => [newStation, ...prev]);
    setActivePage('studio');
  };

  // Filter Logic
  const getStationsByType = (type: ContentType) => allStations.filter(s => s.type === type);
  const userUploadedStations = useMemo(() => allStations.filter(s => s.isUserGenerated), [allStations]);

  const filteredStations = useMemo(() => {
    let stations = allStations;
    
    if (activePage === 'radio') stations = getStationsByType('radio');
    else if (activePage === 'podcasts') stations = getStationsByType('podcast');
    else if (activePage === 'audiobooks') stations = getStationsByType('audiobook');
    else if (activePage === 'library') stations = stations.filter(s => s.isPremium); // Mock Library as Premium items
    
    if (activeCategory !== "All") {
      stations = stations.filter(s => s.category === activeCategory);
    }
    
    return stations;
  }, [activePage, activeCategory, allStations]);

  // Render Page Content
  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <>
            <Hero />
            
            {/* Live Radio Section - Horizontal Scroll */}
            <div className="mb-10">
              <SectionHeader 
                title="Live AI Radio" 
                actionLabel="View Schedule" 
                onAction={() => setActivePage('radio')} 
              />
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                {getStationsByType('radio').map(station => (
                  <div key={station.id} className="min-w-[160px] w-[160px] md:min-w-[200px] md:w-[200px]">
                    <StationCard 
                      station={station}
                      currentStationId={currentStationId}
                      status={audioStatus}
                      onPlay={handlePlayStation}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Creators - User Generated */}
            {userUploadedStations.length > 0 && (
              <div className="mb-10">
                <SectionHeader 
                  title="New from Creators" 
                  actionLabel="Browse All" 
                  onAction={() => setActivePage('podcasts')} 
                />
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                  {userUploadedStations.map(station => (
                    <div key={station.id} className="min-w-[160px] w-[160px] md:min-w-[200px] md:w-[200px]">
                      <StationCard 
                        station={station}
                        currentStationId={currentStationId}
                        status={audioStatus}
                        onPlay={handlePlayStation}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Podcasts Section */}
            <div className="mb-10">
              <SectionHeader 
                title="Trending Podcasts" 
                actionLabel="See All" 
                onAction={() => setActivePage('podcasts')} 
              />
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                {getStationsByType('podcast').slice(0, 6).map(station => (
                  <div key={station.id} className="min-w-[160px] w-[160px] md:min-w-[200px] md:w-[200px]">
                    <StationCard 
                      station={station}
                      currentStationId={currentStationId}
                      status={audioStatus}
                      onPlay={handlePlayStation}
                    />
                  </div>
                ))}
              </div>
            </div>

             {/* Catch Up / Recent Episodes */}
             <div className="mb-10">
               <SectionHeader title="Catch Up" />
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 transition-colors">
                     <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                       <Icons.Clock size={18} className="text-[#00b0f0]"/> Latest Segments
                     </h3>
                     <EpisodeList episodes={MOCK_EPISODES.slice(0,3)} onPlay={handlePlayEpisode} />
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b0f0] opacity-10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
                      <div className="relative z-10 h-full flex flex-col justify-center">
                        <span className="text-[#00b0f0] font-bold uppercase tracking-widest text-xs mb-2">Creator Spotlight</span>
                        <h3 className="text-2xl font-bold mb-2 text-white">Become a Creator</h3>
                        <p className="text-slate-400 text-sm mb-6 line-clamp-3">
                           Share your stories with the world. Upload your own podcasts and audio shows directly to NCOR.
                        </p>
                        <button 
                          className="bg-white text-slate-900 px-5 py-2.5 rounded-full font-bold text-sm self-start hover:bg-[#00b0f0] hover:text-white transition-colors"
                          onClick={() => setActivePage('upload')}
                        >
                          Start Uploading
                        </button>
                      </div>
                  </div>
               </div>
             </div>
          </>
        );

      case 'radio':
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                 <SectionHeader title="On Air Now" />
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                   {filteredStations.map(station => (
                      <StationCard 
                        key={station.id} 
                        station={station}
                        currentStationId={currentStationId}
                        status={audioStatus}
                        onPlay={handlePlayStation}
                      />
                   ))}
                 </div>
              </div>
              
              {/* Sidebar Content - Program Guide */}
              <div>
                <ProgramGuide schedule={MOCK_SCHEDULE} />
              </div>
            </div>
          </>
        );

      case 'upload':
        return <UploadView onUpload={handleUpload} onCancel={() => setActivePage('home')} />;
      
      case 'studio':
        return <CreatorDashboard userStations={userUploadedStations} />;

      case 'podcasts':
         return (
           <>
             <div className="mb-8">
               <SectionHeader title="Latest Episodes" />
               <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                 <EpisodeList episodes={MOCK_EPISODES} onPlay={handlePlayEpisode} />
               </div>
             </div>

             <SectionHeader title="All Shows" />
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredStations.map(station => (
                  <StationCard 
                    key={station.id} 
                    station={station}
                    currentStationId={currentStationId}
                    status={audioStatus}
                    onPlay={handlePlayStation}
                  />
                ))}
             </div>
           </>
         );

      case 'explore':
        return (
           <div className="pt-4">
             <div className="relative mb-8">
               <input 
                 type="text" 
                 placeholder="Search for topics, shows, or creators..." 
                 className="w-full p-4 pl-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00b0f0] placeholder:text-slate-400 transition-colors"
               />
               <Icons.Search className="absolute left-4 top-4 text-slate-400" size={20} />
             </div>
             
             <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Browse Categories</h2>
             <div className="flex flex-wrap gap-3 mb-8">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeCategory === cat ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#00b0f0] hover:text-[#00b0f0]'}`}
                  >
                    {cat}
                  </button>
                ))}
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredStations.map(station => (
                   <StationCard 
                    key={station.id} 
                    station={station}
                    currentStationId={currentStationId}
                    status={audioStatus}
                    onPlay={handlePlayStation}
                  />
                ))}
             </div>
           </div>
        );

      case 'library':
         return (
            <div className="pt-4">
               <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">Your Favorites</h1>
               {filteredStations.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                   {filteredStations.map((station) => (
                    <StationCard 
                      key={station.id} 
                      station={station}
                      currentStationId={currentStationId}
                      status={audioStatus}
                      onPlay={handlePlayStation}
                    />
                  ))}
                 </div>
               ) : (
                <div className="flex flex-col items-center justify-center h-[40vh] text-slate-400 dark:text-slate-500">
                  <Icons.Heart size={64} className="mb-4 text-slate-200 dark:text-slate-700" />
                  <h2 className="text-xl font-bold text-slate-600 dark:text-slate-400">Your Library is empty</h2>
                  <p>Subscribe to premium content or favorite shows to see them here.</p>
                </div>
               )}
            </div>
         );

      default: // Audiobooks or other generic list pages
        return (
          <>
            <div className="flex items-center justify-between mb-8">
               <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize transition-colors">{activePage}</h1>
               
               <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[50%]">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                        activeCategory === cat 
                          ? 'bg-[#00b0f0] text-white' 
                          : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-[#00b0f0]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredStations.length > 0 ? filteredStations.map((station) => (
                <StationCard 
                  key={station.id} 
                  station={station}
                  currentStationId={currentStationId}
                  status={audioStatus}
                  onPlay={handlePlayStation}
                />
              )) : (
                <div className="col-span-full py-10 text-center text-slate-400">
                   No content found for {activeCategory}
                </div>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className={theme}>
      <div className="bg-[#f9f9f9] dark:bg-[#020617] min-h-screen flex pb-24 font-sans text-slate-900 dark:text-slate-100 selection:bg-[#b3e5fc] selection:text-blue-900 transition-colors duration-300">
        <Sidebar activePage={activePage} onNavigate={setActivePage} theme={theme} toggleTheme={toggleTheme} />

        <main className="flex-1 md:ml-64 p-4 md:p-8 max-w-[1600px] mx-auto w-full overflow-x-hidden">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between mb-6 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="w-8 h-8 rounded-full bg-[#00b0f0] flex items-center justify-center text-white">
                <Icons.Radio size={16} />
              </div>
              <span className="font-bold text-xl tracking-tight">{activePage === 'home' ? 'NCOR' : activePage.charAt(0).toUpperCase() + activePage.slice(1)}</span>
            </div>
            <button className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"><Icons.Menu /></button>
          </div>

          {errorMsg && (
            <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-bounce cursor-pointer" onClick={() => setErrorMsg(null)}>
              <Icons.X size={20} />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {renderContent()}
        </main>

        <AudioPlayer 
          track={currentTrack} 
          status={audioStatus} 
          setStatus={setAudioStatus}
        />
      </div>
    </div>
  );
}

export default App;
