
import React from 'react';
import { Icons } from './Icons';
import { Station } from '../types';

interface CreatorDashboardProps {
  userStations: Station[];
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ userStations }) => {
  const totalPlays = userStations.length * 124 + 450; // Mock logic
  const totalRevenue = userStations.length * 12.50 + 50; // Mock logic
  
  return (
    <div className="pt-4">
       <div className="flex items-center justify-between mb-8">
         <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Creator Studio</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your content and earnings.</p>
         </div>
         <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Icons.Share2 size={16} /> Share Profile
         </button>
       </div>

       {/* Stats Overview */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
             <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-[#00b0f0]">
                   <Icons.BarChart2 size={20} />
                </div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Total Plays</span>
             </div>
             <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalPlays.toLocaleString()}</p>
             <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                ▲ 12% this week
             </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
             <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-500">
                   <Icons.User size={20} />
                </div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Subscribers</span>
             </div>
             <p className="text-3xl font-bold text-slate-900 dark:text-white">842</p>
             <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                ▲ 5 new today
             </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
             <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center text-yellow-600">
                   <Icons.DollarSign size={20} />
                </div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Earnings</span>
             </div>
             <p className="text-3xl font-bold text-slate-900 dark:text-white">${totalRevenue.toFixed(2)}</p>
             <span className="text-xs text-slate-400">Payout pending</span>
          </div>
       </div>

       <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Content</h2>
       <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <table className="w-full text-left">
             <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                   <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                   <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                   <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                   <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Plays</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {userStations.length > 0 ? userStations.map((station) => (
                   <tr key={station.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                         <div className="flex items-center gap-3">
                            <img src={station.imageUrl} alt="" className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-700 object-cover" />
                            <div className="flex flex-col">
                               <span className="font-bold text-sm text-slate-900 dark:text-white">{station.title}</span>
                               <span className="text-xs text-slate-500 dark:text-slate-400">{station.category}</span>
                            </div>
                         </div>
                      </td>
                      <td className="p-4 text-sm text-slate-500 dark:text-slate-400">Today</td>
                      <td className="p-4">
                         {station.isPremium ? (
                            <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 text-xs font-bold">Premium</span>
                         ) : (
                            <span className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-500 text-xs font-bold">Free</span>
                         )}
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-900 dark:text-white text-right">0</td>
                   </tr>
                )) : (
                   <tr>
                      <td colSpan={4} className="p-10 text-center text-slate-400 dark:text-slate-500">
                         You haven't uploaded any content yet.
                      </td>
                   </tr>
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
};

export default CreatorDashboard;