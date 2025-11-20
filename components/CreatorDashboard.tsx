
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
            <h1 className="text-3xl font-bold text-slate-900">Creator Studio</h1>
            <p className="text-slate-500">Manage your content and earnings.</p>
         </div>
         <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2">
            <Icons.Share2 size={16} /> Share Profile
         </button>
       </div>

       {/* Stats Overview */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#00b0f0]">
                   <Icons.BarChart2 size={20} />
                </div>
                <span className="text-slate-500 font-medium">Total Plays</span>
             </div>
             <p className="text-3xl font-bold text-slate-900">{totalPlays.toLocaleString()}</p>
             <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                ▲ 12% this week
             </span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                   <Icons.User size={20} />
                </div>
                <span className="text-slate-500 font-medium">Subscribers</span>
             </div>
             <p className="text-3xl font-bold text-slate-900">842</p>
             <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                ▲ 5 new today
             </span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600">
                   <Icons.DollarSign size={20} />
                </div>
                <span className="text-slate-500 font-medium">Earnings</span>
             </div>
             <p className="text-3xl font-bold text-slate-900">${totalRevenue.toFixed(2)}</p>
             <span className="text-xs text-slate-400">Payout pending</span>
          </div>
       </div>

       <h2 className="text-xl font-bold text-slate-900 mb-4">Your Content</h2>
       <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                   <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                   <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                   <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Plays</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {userStations.length > 0 ? userStations.map((station) => (
                   <tr key={station.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                         <div className="flex items-center gap-3">
                            <img src={station.imageUrl} alt="" className="w-10 h-10 rounded bg-slate-200 object-cover" />
                            <div className="flex flex-col">
                               <span className="font-bold text-sm text-slate-900">{station.title}</span>
                               <span className="text-xs text-slate-500">{station.category}</span>
                            </div>
                         </div>
                      </td>
                      <td className="p-4 text-sm text-slate-500">Today</td>
                      <td className="p-4">
                         {station.isPremium ? (
                            <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-bold">Premium</span>
                         ) : (
                            <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-bold">Free</span>
                         )}
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-900 text-right">0</td>
                   </tr>
                )) : (
                   <tr>
                      <td colSpan={4} className="p-10 text-center text-slate-400">
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
