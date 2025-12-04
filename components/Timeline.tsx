import React from 'react';
import { Station } from '../types';

interface TimelineProps {
  previous: Station[];
  upcoming: Station[];
  currentStation: {
    station_code: string;
    station_name: string;
    distance_from_source: number;
    sta: string;
    eta: string;
    delay: number;
  };
}

export const Timeline: React.FC<TimelineProps> = ({ previous = [], upcoming = [], currentStation }) => {
  // Construct a simulated "current station" object that fits the list
  // The API gives current station info in the root object, so we manually create a station entry for it
  const currentStationObj: any = {
    station_code: currentStation.station_code,
    station_name: currentStation.station_name,
    distance_from_source: currentStation.distance_from_source,
    sta: currentStation.sta,
    eta: currentStation.eta,
    arrival_delay: currentStation.delay,
    is_current: true
  };

  // Combine lists: Previous -> Current -> Upcoming
  const allStations = [...previous, currentStationObj, ...upcoming];

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '--:--';
    return timeStr;
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-0 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">
          Journey Timeline
        </h3>
      </div>

      <div className="relative p-6">
        {/* Continuous Vertical Line */}
        <div className="absolute left-[39px] top-6 bottom-6 w-[2px] bg-slate-100"></div>

        <div className="space-y-0">
          {allStations.map((station, index) => {
            const isPassed = index < previous.length;
            const isCurrent = station.is_current;
            
            return (
              <div key={`${station.station_code}-${index}`} className={`relative flex gap-6 ${index !== allStations.length - 1 ? 'pb-10' : ''}`}>
                
                {/* Time Column (Left) */}
                <div className="w-16 text-right flex-shrink-0 pt-0.5">
                  <div className={`text-sm font-bold font-mono ${isPassed ? 'text-slate-400' : 'text-slate-900'}`}>
                    {formatTime(station.eta || station.sta)}
                  </div>
                  {station.arrival_delay > 0 && !isPassed && (
                    <div className="text-[10px] text-rose-500 font-bold mt-0.5">
                      +{station.arrival_delay} min
                    </div>
                  )}
                </div>

                {/* Node & Line */}
                <div className="relative z-10 flex flex-col items-center flex-shrink-0">
                   <div className={`
                    w-3 h-3 rounded-full border-2 
                    ${isCurrent 
                      ? 'bg-indigo-600 border-indigo-600 ring-4 ring-indigo-50' 
                      : isPassed 
                        ? 'bg-slate-300 border-slate-300' 
                        : 'bg-white border-slate-300'
                    }
                   `}></div>
                </div>

                {/* Station Details (Right) */}
                <div className={`flex-1 min-w-0 pt-[-4px] ${isPassed ? 'opacity-50' : ''}`}>
                  <h4 className={`text-sm font-bold truncate ${isCurrent ? 'text-indigo-600' : 'text-slate-800'}`}>
                    {station.station_name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                      {station.station_code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {station.distance_from_source} km
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};