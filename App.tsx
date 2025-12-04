import React, { useEffect, useState, useCallback } from 'react';
import { TrainResponse } from './types';
import { parseTrainNumberFromUrl, fetchTrainStatus } from './services/api';
import { SearchBar } from './components/SearchBar';
import { StatusCard } from './components/StatusCard';
import { Timeline } from './components/Timeline';
import { TrainAIAssistant } from './components/TrainAIAssistant';
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
      const result = await fetchTrainStatus(number);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch status. Please check the train number.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle URL parameter on mount (e.g. ?16650)
  useEffect(() => {
    const urlTrainNo = parseTrainNumberFromUrl();
    if (urlTrainNo) {
      setTrainNumber(urlTrainNo);
      loadTrainData(urlTrainNo);
    }
  }, [loadTrainData]);

  const handleSearch = (term: string) => {
    // Update URL to allow sharing
    const newUrl = `${window.location.pathname}?${term}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    loadTrainData(term);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-center relative">
          <div 
            className="flex items-center gap-2 cursor-pointer absolute left-4" 
            onClick={() => { 
              window.history.pushState({}, '', '/');
              setData(null);
              setTrainNumber('');
            }}
          >
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <TrainIcon className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 tracking-tight hidden sm:block">LiveRail</span>
          </div>
          
          {/* Compact Search in Header if data is loaded */}
          {data && (
             <div className="font-mono font-bold text-slate-500 text-sm bg-slate-100 px-3 py-1 rounded-full">
               {data.train_number}
             </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6">
        {/* Initial Search State */}
        {!data && !loading && !error && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrainIcon className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Track your train
            </h1>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Enter a train number to get real-time live running status and station details.
            </p>
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={loading} 
              initialValue={trainNumber}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-400 font-medium text-sm mt-4">Fetching live status...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mt-8 animate-fade-in">
            <div className="p-4 bg-white border border-rose-100 rounded-2xl shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-3">
                <AlertIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Train not found</h3>
              <p className="text-slate-500 text-sm mb-4">{error}</p>
              <button 
                onClick={() => { setError(null); setData(null); }}
                className="text-indigo-600 text-sm font-bold hover:underline"
              >
                Try another train
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <div className="animate-fade-in-up">
            <StatusCard data={data} />
            
            {/* New AI Assistant Component */}
            <TrainAIAssistant data={data} />

            <Timeline 
              previous={data.previous_stations} 
              upcoming={data.upcoming_stations}
              currentStation={{
                station_code: data.current_station_code,
                station_name: data.current_station_name,
                distance_from_source: data.distance_from_source,
                sta: data.cur_stn_sta,
                eta: data.eta,
                delay: data.delay
              }}
            />

            <div className="mt-8 mb-4 text-center">
               <button 
                 onClick={() => { setData(null); setTrainNumber(''); window.history.pushState({}, '', '/'); }}
                 className="text-indigo-600 font-semibold text-sm hover:bg-indigo-50 px-4 py-2 rounded-full transition-colors"
               >
                 Search Another Train
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;