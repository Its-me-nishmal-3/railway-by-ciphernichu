import React from 'react';
import { TrainResponse } from '../types';
import { ClockIcon, NavigationIcon, AlertIcon, CheckIcon, ArrowRightIcon, LocationIcon } from './Icons';

interface StatusCardProps {
  data: TrainResponse;
}

export const StatusCard: React.FC<StatusCardProps> = ({ data }) => {
  const isDelayed = data.delay > 10;
  
  // Progress bar calculation
  const progress = Math.min(100, Math.max(0, (data.distance_from_source / data.total_distance) * 100));
  
  // Get the most relevant location message
  const locationMsg = data.current_location_info?.find(i => i.type === 1)?.readable_message || 
                     data.ahead_distance_text || 
                     `At ${data.current_station_name}`;

  const formatDelay = (minutes: number) => {
    if (minutes <= 0) return 'On Time';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m Delay`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-slate-100 overflow-hidden relative mb-8">
      {/* Top Header Section */}
      <div className="p-6 pb-4 border-b border-slate-50 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide">
                #{data.train_number}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {data.run_days.split(',').slice(0, 3).join(', ')}...
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {data.train_name}
            </h1>
          </div>
          
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border shadow-sm ${
            isDelayed 
              ? 'bg-rose-50 border-rose-100 text-rose-600' 
              : 'bg-emerald-50 border-emerald-100 text-emerald-600'
          }`}>
            {isDelayed ? <AlertIcon className="w-5 h-5" /> : <CheckIcon className="w-5 h-5" />}
            <span className="font-bold whitespace-nowrap">{formatDelay(data.delay)}</span>
          </div>
        </div>

        {/* Route Info */}
        <div className="flex items-center justify-between text-slate-600 bg-slate-50 rounded-xl p-4">
          <div className="text-left">
            <div className="text-xs text-slate-400 uppercase font-semibold mb-0.5">From</div>
            <div className="font-bold text-slate-900">{data.source_stn_name}</div>
            <div className="text-xs font-mono text-slate-400">{data.std}</div>
          </div>
          <div className="px-4 flex flex-col items-center">
             <ArrowRightIcon className="w-5 h-5 text-slate-300" />
             <span className="text-[10px] text-slate-400 mt-1">{Math.floor(data.journey_time / 60)}h {data.journey_time % 60}m</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 uppercase font-semibold mb-0.5">To</div>
            <div className="font-bold text-slate-900">{data.dest_stn_name}</div>
          </div>
        </div>
      </div>

      {/* Main Status Section */}
      <div className="p-6 pt-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Current Status Card */}
          <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-5 text-white shadow-lg shadow-indigo-200">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <NavigationIcon className="w-24 h-24 -mr-4 -mt-4" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2 opacity-90">
                <LocationIcon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Current Location</span>
              </div>
              <p className="text-lg font-bold leading-snug mb-1 capitalize">
                {locationMsg}
              </p>
              <div className="flex items-center text-xs opacity-75 mt-3">
                <ClockIcon className="w-3 h-3 mr-1" />
                Updated {data.status_as_of}
              </div>
            </div>
          </div>

          {/* Next Stop Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-2 mb-3 text-indigo-600">
              <ArrowRightIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Next Station</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-lg font-bold text-slate-900 leading-none mb-2">
                  {data.next_stoppage_info?.next_stoppage || "Destination"}
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  {data.next_stoppage_info?.next_stoppage_time_diff || "N/A"}
                </p>
              </div>
              {data.next_stoppage_info?.next_stoppage_delay > 0 && (
                <div className="text-right">
                   <span className="block text-xs text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded-md">
                     +{data.next_stoppage_info.next_stoppage_delay}m late
                   </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Journey Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Journey Progress</span>
            <span className="text-xs font-bold text-indigo-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progress}%` }}
            >
              <div className="w-full h-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-medium uppercase tracking-wide">
             <span>{data.distance_from_source} km covered</span>
             <span>{data.total_distance - data.distance_from_source} km left</span>
          </div>
        </div>
      </div>
    </div>
  );
};
