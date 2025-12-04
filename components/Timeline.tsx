import React from 'react';
import { Station } from '../types';

interface TimelineProps {
  previous: Station[];
  upcoming: Station[];
  currentStationName: string;
}

export const Timeline: React.FC<TimelineProps> = ({ previous, upcoming, currentStationName }) => {
  // Merge arrays to form complete list
  const allStations = [...previous, ...upcoming];

  // Utility to format time or return '--'
  const formatTime = (t: string) => t || '--:--';

  // Helper to determine delay status color
  const getDelayColor = (delay: number) => {
    if (delay <= 0) return 'text-emerald-500';
    if (delay < 15) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-900">Route Timeline</h3>
        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">
          {allStations.length} Stops
        </span>
      </div>

      <div className="relative pl-2">
        {/* Continuous vertical line */}
        <div className="absolute left-[7px] top-2 bottom-4 w-0.5 bg-slate-100"></div>

        <div className="space-y-6">
          {allStations.map((station, index) => {
            const isPassed = index < previous.length;
            const isNext = index === previous.length; // First item of upcoming
            
            return (
              <div key={`${station.station_code}-${index}`} className="relative flex items-start group">
                
                {/* Timeline Node */}
                <div 
                  className={`
                    absolute left-0 mt-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 z-10
                    ${isPassed 
                      ? 'bg-emerald-500 border-emerald-500' 
                      : isNext 
                        ? 'bg-white border-indigo-600 shadow-[0_0_0_4px_rgba(79,70,229,0.2)]' 
                        : 'bg-white border-slate-300'
                    }
                  `}
                >
                  {isPassed && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`ml-8 flex-1 ${isPassed ? 'opacity-70' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className={`text-sm font-bold truncate ${isNext ? 'text-indigo-900 text-base' : 'text-slate-800'}`}>
                        {station.station_name}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-mono bg-slate-50 px-1 rounded border border-slate-100">{station.station_code}</span>
                        <span>•</span>
                        <span>{station.distance_from_source} km</span>
                        {station.platform_number > 0 && (
                          <>
                            <span>•</span>
                            <span>PF {station.platform_number}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className={`text-sm font-bold font-mono ${isPassed ? 'text-slate-600' : 'text-slate-900'}`}>
                        {isPassed ? formatTime(station.eta) : formatTime(station.sta)}
                      </div>
                      {station.arrival_delay > 0 && (
                        <div className={`text-[10px] font-bold mt-0.5 ${getDelayColor(station.arrival_delay)}`}>
                          +{station.arrival_delay}m Late
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Halt Information */}
                  {station.halt > 0 && (
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center">
                       <span className="bg-slate-50 px-1.5 py-0.5 rounded text-slate-500 border border-slate-100">
                         {station.halt}m stop
                       </span>
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
