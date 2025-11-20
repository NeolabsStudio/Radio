
import React from 'react';
import { Icons } from './Icons';
import { APP_NAME } from '../constants';
import { ViewPage } from '../types';

interface SidebarProps {
  activePage: ViewPage;
  onNavigate: (page: ViewPage) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const navItems = [
    { icon: Icons.Home, label: 'Home', id: 'home' as ViewPage },
    { icon: Icons.Radio, label: 'Live Radio', id: 'radio' as ViewPage },
    { icon: Icons.Headphones, label: 'Podcasts', id: 'podcasts' as ViewPage },
    { icon: Icons.BookOpen, label: 'Audiobooks', id: 'audiobooks' as ViewPage },
    { icon: Icons.Search, label: 'Explore', id: 'explore' as ViewPage },
  ];

  const userItems = [
    { icon: Icons.BarChart2, label: 'Creator Studio', id: 'studio' as ViewPage },
    { icon: Icons.Heart, label: 'Favorites', id: 'library' as ViewPage },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 hidden md:flex flex-col z-40">
      <div className="p-6 flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-[#00b0f0] flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
          <Icons.Radio size={22} />
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-900">{APP_NAME}</span>
      </div>

      <div className="px-6 mb-4">
        <button 
          onClick={() => onNavigate('upload')}
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5"
        >
          <Icons.Upload size={18} /> Upload Content
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <div className="mb-6 px-4">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Discover</h3>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <li key={item.label}>
                  <button 
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? 'bg-slate-100 text-[#0050ff] font-semibold' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon size={20} className={`transition-colors ${isActive ? "text-[#00b0f0]" : "text-slate-400 group-hover:text-slate-600"}`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="px-4">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">You</h3>
          <ul className="space-y-1">
            {userItems.map((item) => {
               const isActive = activePage === item.id;
               return (
                <li key={item.label}>
                  <button 
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? 'bg-slate-100 text-[#0050ff] font-semibold' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon size={20} className={`transition-colors ${isActive ? "text-[#00b0f0]" : "text-slate-400 group-hover:text-slate-600"}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
            <Icons.User size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">Creator Account</span>
            <span className="text-xs text-[#00b0f0] font-medium">Pro Plan Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
