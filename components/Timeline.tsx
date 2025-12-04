import React from 'react';
import { Station } from '../types';

interface TimelineProps {
  previous: Station[];
  upcoming: Station[];
  currentStationCode: string;
}

export const Timeline: React.FC<TimelineProps> = ({ previous = [], upcoming = [], currentStationCode }) => {
  // Combine lists: Previous stations first, then upcoming
  // Note: previous_stations usually comes in reverse order (nearest passed first) or correct order depending on API. 
  // Based on the sample JSON, previous stations are in order from source (si_no 1 to 93).
  // Upcoming stations are si_no 95 to end.
  // We should render them all in order.
  
  const allStations = [...previous, ...upcoming];

  // Helper to determine delay status color
  const getDelayColor = (delay: number) => {
    if (!delay || delay <= 0) return 'text-emerald-600 bg-emerald-50';
    if (delay < 15) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '--:--';
    return timeStr;
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
        <span className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></span>
        Full Route
      </h3>

      <div className="relative pl-4 space-y-0">
        {/* Vertical Line */}
        <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-slate-200"></div>

        {allStations.map((station, index) => {
          // Determine status based on list membership
          // If it's in previous list, it's passed.
          // If it's the last one in previous list, it might be the "just left" one.
          // Or we can check based on array membership.
          const isPassed = index < previous.length;
          const isCurrent = station.station_code === currentStationCode;
          const isUpcoming = index >= previous.length;

          return (
            <div key={`${station.station_code}-${index}`} className={`relative flex items-start group ${index !== allStations.length - 1 ? 'pb-8' : ''}`}>
              
              {/* Node Indicator */}
              <div className={`
                relative z-10 flex-shrink-0 w-4 h-4 rounded-full border-2 mt-1.5 mr-6
                ${isPassed 
                  ? 'bg-slate-200 border-slate-300' 
                  : isCurrent 
                    ? 'bg-indigo-600 border-indigo-600 shadow-[0_0_0_4px_rgba(79,70,229,0.2)]'
                    : 'bg-white border-indigo-400'
                }
              `}></div>

              {/* Station Details */}
              <div className={`flex-1 min-w-0 ${isPassed ? 'opacity-60 grayscale' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div className="mb-1 sm:mb-0">
                    <h4 className={`text-base font-bold ${isPassed ? 'text-slate-600' : 'text-slate-900'}`}>
                      {station.station_name}
                    </h4>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span className="font-mono">{station.station_code}</span>
                      <span>•</span>
                      <span>{station.distance_from_source}km</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right flex flex-row sm:flex-col gap-4 sm:gap-0 mt-2 sm:mt-0">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Arrival</span>
                      <span className="font-mono font-medium text-slate-700">
                        {formatTime(isPassed ? station.eta : station.sta)}
                      </span>
                    </div>
                    {station.arrival_delay > 0 && (
                      <div className="sm:mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${getDelayColor(station.arrival_delay)}`}>
                          +{station.arrival_delay}m
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};