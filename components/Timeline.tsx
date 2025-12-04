import React from 'react';
import { Station } from '../types';

interface TimelineProps {
  previous: Station[];
  upcoming: Station[];
  currentStationName: string;
}

export const Timeline: React.FC<TimelineProps> = ({ previous, upcoming, currentStationName }) => {
  // Combine lists for rendering, but keep track of status
  const allStations = [...previous, ...upcoming];

  // Helper to format time safely
  const formatTime = (time: string) => {
    if (!time) return '--:--';
    return time;
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
        Route Timeline
        <span className="ml-2 text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {allStations.length} Stations
        </span>
      </h3>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200"></div>

        <div className="space-y-0">
          {allStations.map((station, index) => {
            const isPassed = index < previous.length;
            const isNext = index === previous.length;
            const isCurrent = station.station_name === currentStationName;
            
            // Determine styles based on state
            let dotClass = "bg-slate-200 border-slate-50";
            let textClass = "text-slate-500";
            let timeClass = "text-slate-400";
            
            if (isPassed) {
              dotClass = "bg-emerald-500 border-emerald-100 shadow-emerald-100";
              textClass = "text-slate-700";
              timeClass = "text-slate-500";
            } else if (isNext) {
              dotClass = "bg-indigo-600 border-indigo-100 shadow-lg shadow-indigo-200 animate-pulse-slow";
              textClass = "text-indigo-900 font-bold";
              timeClass = "text-indigo-600 font-medium";
            }

            return (
              <div key={station.station_code} className={`relative flex items-start group hover:bg-slate-50 rounded-xl p-3 -mx-3 transition-colors ${isNext ? 'bg-indigo-50/30' : ''}`}>
                
                {/* Timeline Dot */}
                <div className={`relative z-10 flex-shrink-0 w-4 h-4 mt-1.5 rounded-full border-2 ${dotClass} transition-all duration-300`}></div>
                
                {/* Content */}
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`text-sm truncate ${textClass}`}>
                        {station.station_name}
                        <span className="ml-2 text-[10px] font-mono text-slate-400 border border-slate-200 px-1 rounded">
                          {station.station_code}
                        </span>
                      </h4>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {station.distance_from_source} km • Platform {station.platform_number || 'N/A'}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-xs ${timeClass}`}>
                        {station.arrival_delay > 0 && isPassed ? (
                          <span className="text-red-500 font-medium mr-1">+{station.arrival_delay}m</span>
                        ) : null}
                        {isPassed ? formatTime(station.eta) : formatTime(station.sta)}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                        {isPassed ? 'Departed' : 'Scheduled'}
                      </div>
                    </div>
                  </div>

                  {/* Halt info if > 0 */}
                  {station.halt > 0 && (
                     <div className="mt-1 inline-flex items-center text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                       Stop: {station.halt}m
                     </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};