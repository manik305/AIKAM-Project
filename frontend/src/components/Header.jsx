import React from 'react';
import { Zap, ShieldCheck, Activity, Globe, UserCheck, LayoutDashboard, Cpu } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  language, 
  setLanguage, 
  apiHealth,
  onOpenArch
}) {
  const isTe = language === 'te';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Initiative */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 shadow-lg shadow-cyan-500/20 text-white">
              <Zap className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">UrjaMitra</span>
                  <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-cyan-950/90 text-cyan-300 border border-cyan-800/50">AI</span>
                </span>
                <span className="hidden md:inline-block text-xs text-slate-400 border-l border-slate-700 pl-2 font-medium">
                  {isTe ? 'ఉర్జామిత్ర AI' : 'Telangana Discoms'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                TGSPDCL & TGNPDCL • AIKAM EnergyTech
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Citizen vs Officer) */}
          <div className="hidden lg:flex items-center bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('citizen')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'citizen'
                  ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{isTe ? 'పౌరుల పోర్టల్ (Citizen)' : 'Citizen Copilot'}</span>
            </button>
            <button
              onClick={() => setActiveTab('officer')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'officer'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{isTe ? 'అధికారుల కమాండ్ (Officer)' : 'Officer Command Center'}</span>
            </button>
          </div>

          {/* Controls: Architecture, Language & Live Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Architecture Explainer Button */}
            <button
              onClick={onOpenArch}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-sky-400 hover:text-sky-300 transition-all"
              title="View Tri-Cognitive Architecture"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{isTe ? 'ఆర్కిటెక్చర్' : 'Architecture'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'te' ? 'en' : 'te')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'te' ? 'తెలుగు' : 'English'}</span>
            </button>

            {/* Live Gateway Pill */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 border border-slate-800 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${apiHealth === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-400'}`}></span>
              <span className="hidden xl:inline text-[11px] text-slate-400">Jev Router:</span>
              <span className="text-[11px] font-mono font-semibold text-emerald-400">
                {apiHealth === 'healthy' ? '<70ms' : 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Tabs Bar */}
        <div className="flex lg:hidden items-center justify-between border-t border-slate-800/80 py-2">
          <button
            onClick={() => setActiveTab('citizen')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md ${
              activeTab === 'citizen' ? 'bg-cyan-600 text-white' : 'text-slate-400'
            }`}
          >
            {isTe ? 'పౌరుల పోర్టల్' : 'Citizen Copilot'}
          </button>
          <button
            onClick={() => setActiveTab('officer')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md ${
              activeTab === 'officer' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            {isTe ? 'కమాండ్ సెంటర్' : 'Officer Center'}
          </button>
          <button
            onClick={onOpenArch}
            className="px-3 py-1.5 text-xs text-sky-400 font-semibold"
          >
            {isTe ? 'మ్యాప్' : 'Arch'}
          </button>
        </div>
      </div>
    </header>
  );
}
