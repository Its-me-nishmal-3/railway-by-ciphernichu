import React, { useEffect, useState, useCallback } from 'react';
import { TrainResponse } from './types';
import { parseTrainNumberFromUrl, fetchTrainStatus } from './services/api';
import { SearchBar } from './components/SearchBar';
import { StatusCard } from './components/StatusCard';
import { Timeline } from './components/Timeline';
import { TrainIcon, AlertIcon } from './components/Icons';

function App() {
  const [trainNumber, setTrainNumber] = useState<string>('');
  const [data, setData] = useState<TrainResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTrainData = useCallback(async (number: string) => {
    if (!number) return;
    
    setLoading(true);
    setError(null);
    setTrainNumber(number);

    try {
      // Clean URL logic: if URL has query ?12345, keep it.
      const currentUrlParams = window.location.search;
      if (!currentUrlParams.includes(number)) {
         const newUrl = `${window.location.pathname}?${number}`;
         window.history.pushState({ path: newUrl }, '', newUrl);
      }
      
      const result = await fetchTrainStatus(number);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch status. Please check the train number.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const urlTrainNo = parseTrainNumberFromUrl();
    if (urlTrainNo) {
      setTrainNumber(urlTrainNo);
      loadTrainData(urlTrainNo);
    }
  }, [loadTrainData]);

  const handleSearch = (term: string) => {
    loadTrainData(term);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 font-sans">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 text-indigo-600 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => { window.location.href = '/'; }}
          >
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <TrainIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">TrackRail</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
              Live Status
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {!data && !loading && (
          <div className="text-center mb-12 mt-8 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Where is your train?
            </h1>
            <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
              Get real-time updates, delays, and platform numbers instantly.
            </p>
          </div>
        )}

        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch} 
            isLoading={loading} 
            initialValue={trainNumber}
          />
        </div>

        {error && (
          <div className="max-w-md mx-auto bg-white border border-rose-100 rounded-2xl p-4 shadow-lg shadow-rose-100/50 flex items-center space-x-3 mb-8 animate-fade-in">
            <div className="bg-rose-100 p-2 rounded-full text-rose-600">
               <AlertIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900">Error</h3>
              <p className="text-sm text-rose-600">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium animate-pulse">Fetching latest status...</p>
          </div>
        )}

        {data && !loading && (
          <div className="animate-fade-in-up space-y-6">
            <StatusCard data={data} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                 <Timeline 
                  previous={data.previous_stations} 
                  upcoming={data.upcoming_stations}
                  currentStationName={data.current_station_name}
                />
              </div>
            </div>

            <div className="pt-8 pb-4 text-center border-t border-slate-200 mt-12">
              <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
                <span className="font-semibold text-slate-500">Disclaimer:</span> This application allows you to track train status. 
                Data is crowd-sourced and may vary from actual railway announcements. 
                Please verify with official displays at the station.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
