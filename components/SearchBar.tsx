import React, { useState } from 'react';
import { SearchIcon } from './Icons';

interface SearchBarProps {
  onSearch: (trainNo: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-6">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <SearchIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          className="block w-full p-4 pl-10 text-sm text-slate-900 border border-slate-200 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
          placeholder="Enter Train Number (e.g. 16650)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !value}
          className="absolute right-2.5 bottom-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium rounded-xl text-sm px-4 py-2 transition-colors"
        >
          {isLoading ? 'Searching...' : 'Track'}
        </button>
      </div>
    </form>
  );
};