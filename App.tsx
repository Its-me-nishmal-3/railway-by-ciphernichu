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
      // Update URL without reloading if it's a new search
      const currentSearch = window.location.search;
      if (!currentSearch.includes(number)) {
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

  // Handle initial URL load
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
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Minimal Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => { window.location.href = '/'; }}
          >
            <div className="bg-slate-900 text-white p-1.5 rounded-lg group-hover:bg-indigo-600 transition-colors">
              <TrainIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900">LiveRail</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        {/* Initial Search State */}
        {!data && !loading && !error && (
          <div className="text-center py-12 animate-fade-in-up">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Track your train
            </h1>
            <p className="text-slate-500 mb-8 text-lg">
              Enter a train number to get real-time live running status.
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch} 
            isLoading={loading} 
            initialValue={trainNumber}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="animate-fade-in mb-8 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-700">
            <AlertIcon className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium text-sm">Locating train...</p>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <div className="animate-fade-in-up space-y-6">
            <StatusCard data={data} />
            
            <Timeline 
              previous={data.previous_stations} 
              upcoming={data.upcoming_stations}
              currentStationCode={data.current_station_code}
            />

            <footer className="pt-12 pb-6 text-center">
              <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                Information is crowd-sourced and may not be 100% accurate. 
                Please verify with official railway enquiry for critical journey planning.
              </p>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;