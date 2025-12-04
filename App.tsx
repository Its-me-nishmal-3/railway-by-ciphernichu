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

  // Function to handle fetching logic
  const loadTrainData = useCallback(async (number: string) => {
    if (!number) return;
    
    setLoading(true);
    setError(null);
    setTrainNumber(number);

    try {
      // Update URL without reload to support sharing
      const newUrl = `${window.location.pathname}?${number}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
      
      const result = await fetchTrainStatus(number);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to track train. Please check the number and try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load from URL
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
    <div className="min-h-screen pb-12">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-600 cursor-pointer" onClick={() => window.location.reload()}>
            <TrainIcon className="w-6 h-6" />
            <span className="font-bold text-lg tracking-tight text-slate-900">TrackRail</span>
          </div>
          {data && (
            <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded hidden sm:block">
              Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Live Train Status</h1>
          <p className="text-slate-500">Enter a train number to get real-time running status</p>
        </div>

        <SearchBar 
          onSearch={handleSearch} 
          isLoading={loading} 
          initialValue={trainNumber}
        />

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex items-start space-x-3 animate-fade-in">
            <AlertIcon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-red-800">Unable to Track Train</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              {error.includes("Failed to fetch") && (
                 <p className="text-xs text-red-500 mt-2 italic">
                   Note: This might be due to network restrictions or an invalid train number.
                 </p>
              )}
            </div>
          </div>
        )}

        {loading && !data && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-500 font-medium">Locating train...</p>
          </div>
        )}

        {data && !loading && (
          <div className="animate-fade-in-up">
            <StatusCard data={data} />
            
            <div className="mt-8">
              <Timeline 
                previous={data.previous_stations} 
                upcoming={data.upcoming_stations}
                currentStationName={data.current_station_name}
              />
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Disclaimer: Train running status is compiled from crowd-sourced data and may vary. 
                Please recheck at the station on the day of travel. Not affiliated with official railway authorities.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;