import React from 'react';
import { TrainResponse } from '../types';
import { ClockIcon, NavigationIcon, AlertIcon, CheckIcon } from './Icons';

interface StatusCardProps {
  data: TrainResponse;
}

export const StatusCard: React.FC<StatusCardProps> = ({ data }) => {
  const isDelayed = data.delay > 15;
  const onTime = data.delay <= 15;
  
  // Progress bar calculation
  const progress = Math.min(100, Math.max(0, (data.distance_from_source / data.total_distance) * 100));

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 mb-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{data.train_name}</h2>
            <div className="flex items-center text-slate-500 mt-1 space-x-2">
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold tracking-wider">{data.train_number}</span>
              <span className="text-sm">•</span>
              <span className="text-sm">{data.source_stn_name} → {data.dest_stn_name}</span>
            </div>
          </div>
          
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${isDelayed ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
            {isDelayed ? <AlertIcon className="w-5 h-5" /> : <CheckIcon className="w-5 h-5" />}
            <span className="font-semibold">
              {data.delay <= 0 ? 'On Time' : `Delayed by ${Math.floor(data.delay / 60) > 0 ? `${Math.floor(data.delay / 60)}h ` : ''}${data.delay % 60}m`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Location Info */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="flex items-start space-x-3">
              <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600">
                <NavigationIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Location</p>
                <p className="text-lg font-bold text-slate-800 leading-tight">
                  {data.ahead_distance_text || "Moving..."}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {data.current_station_name} 
                  {data.status_as_of && <span className="text-slate-400 text-xs ml-2">({data.status_as_of})</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Next Stop Info */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="flex items-start space-x-3">
              <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600">
                <ClockIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Next Stop</p>
                <p className="text-lg font-bold text-slate-800 leading-tight">
                  {data.next_stoppage_info?.next_stoppage || "Destination"}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Expected in {data.next_stoppage_info?.next_stoppage_time_diff || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Journey Progress */}
        <div className="mt-8">
          <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
            <span>{data.source_stn_name}</span>
            <span>{Math.round(progress)}% Completed</span>
            <span>{data.dest_stn_name}</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>Start: {data.train_start_date}</span>
            <span>Total Dist: {data.total_distance} km</span>
          </div>
        </div>
      </div>
    </div>
  );
};