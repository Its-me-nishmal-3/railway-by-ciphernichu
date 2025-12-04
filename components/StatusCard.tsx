import React from 'react';
import { TrainResponse } from '../types';
import { ClockIcon, NavigationIcon, AlertIcon, CheckIcon, ArrowRightIcon, LocationIcon } from './Icons';

interface StatusCardProps {
  data: TrainResponse;
}

export const StatusCard: React.FC<StatusCardProps> = ({ data }) => {
  const isDelayed = data.delay > 10;
  
  // Calculate progress percentage
  const progress = data.total_distance > 0 
    ? Math.min(100, Math.max(0, (data.distance_from_source / data.total_distance) * 100))
    : 0;
  
  // Format delay for display
  const formatDelay = (minutes: number) => {
    if (minutes <= 0) return 'On Time';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m Delay`;
  };

  // Construct location message
  const locationText = data.ahead_distance_text || 
                      data.current_location_info?.[0]?.readable_message || 
                      `At ${data.current_station_name}`;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative mb-8">
      {/* Header with Train Info */}
      <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/30 text-indigo-100 text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                #{data.train_number}
              </span>
              <span className="text-slate-400 text-xs font-medium">
                {data.run_days}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">
              {data.train_name}
            </h1>
            <div className="flex items-center text-slate-400 text-sm">
              <span>{data.source_stn_name}</span>
              <ArrowRightIcon className="w-4 h-4 mx-2 opacity-50" />
              <span>{data.dest_stn_name}</span>
            </div>
          </div>

          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 ${
            isDelayed ? 'bg-rose-500/20 text-rose-200' : 'bg-emerald-500/20 text-emerald-200'
          }`}>
            {isDelayed ? <AlertIcon className="w-5 h-5" /> : <CheckIcon className="w-5 h-5" />}
            <span className="font-bold whitespace-nowrap">{formatDelay(data.delay)}</span>
          </div>
        </div>
      </div>

      {/* Main Status Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Current Location */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-slate-500">
              <LocationIcon className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Current Location</span>
            </div>
            <p className="text-lg font-bold text-slate-800 leading-snug mb-2">
              {locationText}
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Updated {data.status_as_of}
            </p>
          </div>

          {/* Next Stop */}
          <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100/50">
            <div className="flex items-center gap-2 mb-3 text-indigo-600">
              <NavigationIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Next Station</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-lg font-bold text-indigo-900 leading-snug">
                  {data.next_stoppage_info?.next_stoppage || "Destination"}
                </p>
                <p className="text-sm text-indigo-700/70 font-medium mt-1">
                  {data.next_stoppage_info?.next_stoppage_time_diff || "--"}
                </p>
              </div>
              {data.next_stoppage_info?.next_stoppage_delay > 0 && (
                <div className="bg-white/80 px-2 py-1 rounded text-xs font-bold text-rose-500 shadow-sm">
                  +{data.next_stoppage_info.next_stoppage_delay}m
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-2">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-slate-400">START</span>
            <span className="text-xs font-bold text-slate-400">END</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full relative" 
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow mr-1"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2">
             <div className="text-xs text-slate-500">
               <span className="font-bold text-slate-700">{data.distance_from_source}km</span> done
             </div>
             <div className="text-xs text-slate-500">
               <span className="font-bold text-slate-700">{Math.max(0, data.total_distance - data.distance_from_source)}km</span> to go
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};