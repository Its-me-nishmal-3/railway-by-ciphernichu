import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { TrainResponse } from '../types';
import { SparklesIcon, SendIcon, BotIcon, MessageSquareIcon } from './Icons';

interface Props {
  data: TrainResponse;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const TrainAIAssistant: React.FC<Props> = ({ data }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Helper to prepare context without overloading tokens
  const getContextData = () => {
    return {
      train_name: data.train_name,
      train_number: data.train_number,
      status: data.status,
      delay: data.delay,
      current_location: data.current_location_info[0]?.readable_message || data.current_station_name,
      next_stop: data.next_stoppage_info,
      distance_covered: data.distance_from_source,
      total_distance: data.total_distance,
      upcoming_major_stations: data.upcoming_stations.slice(0, 5).map(s => ({
        name: s.station_name,
        eta: s.eta,
        delay: s.arrival_delay
      }))
    };
  };

  const generateInsight = async () => {
    setLoadingInsight(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a helpful railway assistant. Analyze this train status: ${JSON.stringify(getContextData())}. 
      Provide a concise, friendly summary (max 3 sentences) for a passenger. Mention the delay (if any) and the next major milestone.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      setInsight(response.text || "Unable to generate insight.");
    } catch (error) {
      console.error("AI Error", error);
      setInsight("Sorry, I couldn't analyze the journey right now.");
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = question;
    setQuestion('');
    setMessages(prev => [...prev, { role: 'user', text: userQ }]);
    setChatLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Context: ${JSON.stringify(getContextData())}. 
      User Question: "${userQ}". 
      Answer briefly and helpfully as a train conductor.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm not sure about that." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-3xl shadow-sm border border-indigo-100 overflow-hidden mb-8">
      <div className="p-6 border-b border-indigo-100/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <SparklesIcon className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-800">AI Journey Assistant</h3>
        </div>
      </div>

      <div className="p-6">
        {/* Insight Section */}
        {!insight && !loadingInsight ? (
          <button 
            onClick={generateInsight}
            className="w-full py-3 px-4 bg-white border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700 font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
          >
            <SparklesIcon className="w-4 h-4" />
            Analyze Journey Status
          </button>
        ) : (
          <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm relative">
             {loadingInsight ? (
               <div className="animate-pulse flex space-x-4">
                 <div className="flex-1 space-y-2 py-1">
                   <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                   <div className="h-4 bg-slate-200 rounded"></div>
                 </div>
               </div>
             ) : (
               <>
                 <p className="text-slate-700 text-sm leading-relaxed">{insight}</p>
                 <div className="absolute top-0 right-0 -mt-1 -mr-1">
                   <span className="flex h-3 w-3">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                   </span>
                 </div>
               </>
             )}
          </div>
        )}

        {/* Chat Section */}
        <div className="mt-6">
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                    <BotIcon className="w-4 h-4" />
                  </div>
                )}
                <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                    <BotIcon className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                  </div>
              </div>
            )}
          </div>

          <form onSubmit={handleAskQuestion} className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <MessageSquareIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about delays, next stops..."
              className="block w-full pl-10 pr-12 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm transition-all"
            />
            <button
              type="submit"
              disabled={!question || chatLoading}
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-2 rounded-lg transition-colors"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};