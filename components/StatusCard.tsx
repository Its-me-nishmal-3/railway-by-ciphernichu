import React from 'react';
import { TrainResponse } from '../types';
import { NavigationIcon, AlertIcon, CheckIcon, ArrowRightIcon, LocationIcon, ClockIcon } from './Icons';

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

  // Construct location message cleanly
  // Prefer the readable message from current_location_info if available
  const locationMessage = data.current_location_info?.find(info => info.type === 1)?.readable_message 
    || data.ahead_distance_text 
    || `At ${data.current_station_name}`;

  const nextStop = data.next_stoppage_info?.next_stoppage || "Destination";
  const timeToNext = data.next_stoppage_info?.next_stoppage_time_diff || "--";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative mb-8">
      {/* Top Banner: Route & Train Name */}
      <div className="bg-white p-6 border-b border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                #{data.train_number}
              </span>
              <span className="text-slate-400 text-xs font-medium uppercase">
                {data.run_days}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              {data.train_name}
            </h1>
            <div className="flex items-center text-slate-500 text-sm mt-1 font-medium">
              <span>{data.source_stn_name}</span>
              <ArrowRightIcon className="w-4 h-4 mx-2 text-slate-300" />
              <span>{data.dest_stn_name}</span>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
            isDelayed ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
          }`}>
            {isDelayed ? <AlertIcon className="w-4 h-4" /> : <CheckIcon className="w-4 h-4" />}
            <span>{formatDelay(data.delay)}</span>
          </div>
        </div>
      </div>

      {/* Main Status Area */}
      <div className="p-6 bg-slate-50/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Current Status Block */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-indigo-500">
                <LocationIcon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Current Location</span>
              </div>
              <p className="text-base font-semibold text-slate-800 leading-relaxed">
                {locationMessage}
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-3 font-medium">
              Updated {data.status_as_of}
            </p>
          </div>

          {/* Next Station Block */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <NavigationIcon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Next Stop</span>
              </div>
              <div className="flex justify-between items-start">
                <p className="text-lg font-bold text-slate-900 leading-none">
                  {nextStop}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm font-medium text-slate-600">
              <ClockIcon className="w-3.5 h-3.5" />
              <span>Arriving {timeToNext}</span>
            </div>
          </div>
        </div>

        {/* Visual Progress */}
        <div className="relative pt-2 px-1">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
            <span>{data.source}</span>
            <span>{data.destination}</span>
          </div>
          <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full relative transition-all duration-1000 ease-out ${isDelayed ? 'bg-amber-500' : 'bg-indigo-500'}`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-inherit rounded-full shadow-sm transform translate-x-1/2"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium text-slate-500">
            <span>{data.distance_from_source}km covered</span>
            <span>{Math.max(0, data.total_distance - data.distance_from_source)}km remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
};