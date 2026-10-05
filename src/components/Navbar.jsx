import React from 'react';
import { Scale } from 'lucide-react';

export default function Navbar({ mode, setMode, activeTab, setActiveTab }) {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Subtitle matching photograph */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-[#1e293b] flex items-center justify-center text-white shadow-sm shrink-0">
              <Scale className="w-5 h-5" />
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-xl font-serif font-bold text-slate-900 tracking-tight">
                AI Legal Assistant
              </h1>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                DOCUMENT INTELLIGENCE
              </span>
            </div>
          </div>

          {/* Right Mode Switcher Pill matching photograph */}
          <div className="flex items-center gap-3">
            <div className="bg-[#f1f5f9] p-1 rounded-full border border-slate-200/80 flex items-center gap-1">
              <button
                onClick={() => setMode('lawyer')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  mode === 'lawyer'
                    ? 'bg-[#1e293b] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Lawyer Mode
              </button>
              <button
                onClick={() => setMode('client')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  mode === 'client'
                    ? 'bg-[#1e293b] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Client Mode
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
