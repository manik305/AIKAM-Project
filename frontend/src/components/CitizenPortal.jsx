import React, { useState } from 'react';
import { 
  Zap, 
  Calculator, 
  Camera, 
  Send, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Mic, 
  Clock, 
  ShieldAlert,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function CitizenPortal({ 
  onRunQuery, 
  loading, 
  resultData, 
  onOpenMeterModal,
  language 
}) {
  const isTe = language === 'te';

  // State for user inputs
  const [units, setUnits] = useState(165);
  const [uscNumber, setUscNumber] = useState('100234891');
  const [circle, setCircle] = useState('Hyderabad South');
  const [message, setMessage] = useState('Explain my electricity bill for 165 units');
  const [reportedReading, setReportedReading] = useState(14210);
  const [billedReading, setBilledReading] = useState(14890);
  const [hasDiscrepancyMode, setHasDiscrepancyMode] = useState(false);
  const [activeInputTab, setActiveInputTab] = useState('numbers'); // 'numbers', 'vision', 'chat'

  // Quick unit presets
  const unitPresets = [
    { label: '50 kWh (Slab 1)', val: 50 },
    { label: '100 kWh (Slab 2)', val: 100 },
    { label: '165 kWh (Zero-Bill)', val: 165 },
    { label: '195 kWh (Cliff Edge)', val: 195 },
    { label: '210 kWh (No Subsidy)', val: 210 },
    { label: '350 kWh (High Usage)', val: 350 },
  ];

  // Quick prompt presets
  const promptPresets = [
    {
      te: 'నా బిల్లు 165 యూనిట్లకు జీరో వచ్చిందా?',
      en: 'Why is my bill calculated as zero for 165 units?',
      action: () => {
        setUnits(165);
        setMessage('Why is my bill zero for 165 units under Gruha Jyothi?');
        handleTriggerQuery(165, 'Why is my bill zero for 165 units under Gruha Jyothi?');
      }
    },
    {
      te: 'నేను 200 యూనిట్ల సబ్సిడీ పరిమితి దాటిపోతానా?',
      en: 'Will I cross the 200-unit subsidy threshold?',
      action: () => {
        setUnits(195);
        setMessage('Will I cross 200 units for Gruha Jyothi subsidy this month?');
        handleTriggerQuery(195, 'Will I cross 200 units for Gruha Jyothi subsidy this month?');
      }
    },
    {
      te: 'మీటర్ రీడింగ్ తప్పుగా నమోదైంది (ఆడిట్ చేయండి)',
      en: 'Meter reading discrepancy detected (Audit meter)',
      action: () => {
        setHasDiscrepancyMode(true);
        setUnits(240);
        setMessage('Discrepancy detected in meter reading. Physical LCD 14210 vs bill 14890.');
        handleTriggerQuery(240, 'Discrepancy detected in meter reading', true, 14210, 14890, 4820);
      }
    }
  ];

  const handleTriggerQuery = (customUnits, customMsg, withImage = false, repRead = null, billRead = null, dispAmt = null) => {
    onRunQuery({
      units: customUnits !== undefined ? customUnits : units,
      message: customMsg || message,
      preferred_language: language,
      usc_number: uscNumber,
      circle,
      has_image: withImage || hasDiscrepancyMode,
      reported_reading: repRead !== null ? repRead : (hasDiscrepancyMode ? reportedReading : null),
      billed_reading: billRead !== null ? billRead : (hasDiscrepancyMode ? billedReading : null),
      disputed_amount: dispAmt !== null ? dispAmt : (hasDiscrepancyMode ? 4820 : null),
    });
  };

  const calc = resultData?.response?.calculation;
  const vision = resultData?.response?.vision_audit;
  const advisory = resultData?.response?.advisory;
  const ticket = resultData?.response?.ticket;
  const telemetry = resultData?.jev_routing_telemetry;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Multi-Source Input Card */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                {isTe ? 'పౌరుల విద్యుత్ కోపైలట్' : 'Citizen Consumer Copilot'}
              </span>
              <span className="text-xs text-slate-400">
                {isTe ? 'బహుళ మూలాల ఇన్‌పుట్: సంఖ్యలు & ఫోటోలు' : 'Multi-source Input: Direct Numbers & Images'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {isTe ? 'మీ విద్యుత్ బిల్లు & సబ్సిడీని తక్షణమే విశ్లేషించండి' : 'Personalized Vernacular Billing & Subsidy Copilot'}
            </h2>
          </div>

          {/* Input Source Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveInputTab('numbers')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeInputTab === 'numbers' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{isTe ? 'ప్రత్యక్ష సంఖ్యలు' : 'Direct Numbers'}</span>
            </button>
            <button
              onClick={() => {
                setActiveInputTab('vision');
                onOpenMeterModal();
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeInputTab === 'vision' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isTe ? 'మీటర్ ఫోటో OCR' : 'Meter Photo OCR'}</span>
            </button>
            <button
              onClick={() => setActiveInputTab('chat')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeInputTab === 'chat' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTe ? 'వాయిస్ / చాట్' : 'Vernacular Chat'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Controls based on Input Mode */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Direct Inputs & Presets */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* USC and Circle Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isTe ? 'సర్వీస్ కనెక్షన్ నంబర్ (USC No)' : 'Service Connection Number (USC)'}
                </label>
                <input
                  type="text"
                  value={uscNumber}
                  onChange={(e) => setUscNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="100234891"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isTe ? 'డిస్కం సర్కిల్' : 'DISCOM Circle'}
                </label>
                <select
                  value={circle}
                  onChange={(e) => setCircle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="Hyderabad South">Hyderabad South (TGSPDCL)</option>
                  <option value="Hyderabad Central">Hyderabad Central (TGSPDCL)</option>
                  <option value="Secunderabad">Secunderabad (TGSPDCL)</option>
                  <option value="Warangal">Warangal (TGNPDCL)</option>
                  <option value="Karimnagar">Karimnagar (TGNPDCL)</option>
                  <option value="Nizamabad">Nizamabad (TGNPDCL)</option>
                </select>
              </div>
            </div>

            {/* Consumption Stepper & Dynamic Slider */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isTe ? 'నెలవారీ వినియోగం (యూనిట్లు / kWh)' : 'Monthly Consumption (Billed Units / kWh)'}
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-3xl font-extrabold text-cyan-400 font-mono">{units}</span>
                    <span className="text-xs text-slate-400 font-medium">kWh</span>
                    {units <= 200 ? (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                        {isTe ? '100% ఉచిత గృహజ్యోతి' : '100% Zero-Bill Eligible'}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/60">
                        {isTe ? 'సబ్సిడీ పరిమితి దాటింది' : 'Non-Subsidized (>200 kWh)'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setUnits(Math.max(0, units - 10))}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={units}
                    onChange={(e) => setUnits(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-16 px-2 py-1 text-center rounded-lg bg-slate-900 border border-slate-700 font-mono text-sm text-cyan-300 font-bold"
                  />
                  <button
                    onClick={() => setUnits(units + 10)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={units}
                onChange={(e) => setUnits(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {unitPresets.map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setUnits(p.val)}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-medium border transition ${
                      units === p.val
                        ? 'bg-cyan-900/60 text-cyan-200 border-cyan-500'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Omnichannel Query Input Bar */}
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTriggerQuery()}
                placeholder={isTe ? "మీ ప్రశ్నను ఇక్కడ అడగండి (ఉదా: 165 యూనిట్లకు బిల్లు ఎందుకు?)..." : "Ask a query or explain bill (e.g., Why is my bill calculated for 165 units?)..."}
                className="w-full pl-4 pr-28 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => handleTriggerQuery()}
                disabled={loading}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-950 transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-spin text-xs">●</span>
                ) : (
                  <>
                    <span>{isTe ? 'విశ్లేషించు' : 'Analyze'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Bilingual Quick Prompt Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isTe ? 'శీఘ్ర ప్రశ్నలు:' : 'Quick Prompts:'}</span>
              </span>
              {promptPresets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={p.action}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white transition flex items-center space-x-1"
                >
                  <span>{isTe ? p.te : p.en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Multimodal Meter OCR Launcher & Fast Telemetry */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Meter Photo OCR Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isTe ? 'మీటర్ ఫోటో ఆడిట్' : 'Multimodal Meter OCR'}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-semibold">
                  System-2 Vision
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                {isTe 
                  ? 'మీ భౌతిక మీటర్ స్క్రీన్‌ను స్కాన్ చేసి రీడింగ్ తేడాలను గుర్తించండి'
                  : 'Audit physical LCD meter photograph to detect overbilling discrepancies'}
              </p>

              <button
                onClick={onOpenMeterModal}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-2 transition"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>{isTe ? 'మీటర్ ఫోటోను స్కాన్ చేయండి' : 'Scan Physical Meter Photo'}</span>
              </button>

              {/* Quick toggle for discrepancy simulation */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {isTe ? 'రీడింగ్ తేడా మోడ్:' : 'Discrepancy audit mode:'}
                </span>
                <button
                  onClick={() => setHasDiscrepancyMode(!hasDiscrepancyMode)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                    hasDiscrepancyMode
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-slate-850 text-slate-400 border border-slate-800'
                  }`}
                >
                  {hasDiscrepancyMode ? (isTe ? 'తేడా ఉంది (-680)' : 'Active (Mismatch)') : (isTe ? 'సాధారణం' : 'Normal')}
                </button>
              </div>
            </div>

            {/* System-1 Jev Telemetry Pill */}
            {telemetry && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Jev System-1 Router
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {telemetry.latency_ms || 68.4}ms
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Intent:</span>
                    <span className="font-mono text-cyan-400 font-semibold">{telemetry.intent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bypass LLM:</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {telemetry.bypass_llm ? 'True (Deterministic)' : 'False'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Severity Score:</span>
                    <span className="font-mono text-amber-400 font-semibold">
                      {telemetry.dispute_severity_score}/10
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Vernacular AI Explanation Banner */}
      {resultData?.response?.vernacular_explanation && (
        <div className="glass-panel-accent rounded-2xl p-5 border-l-4 border-l-cyan-400 shadow-xl">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {isTe ? 'ఉర్జామిత్ర తెలుగు వివరణ' : 'UrjaMitra Vernacular Copilot Summary'}
              </span>
              <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                {resultData.response.vernacular_explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live Results Grid: Bill Deconstruction, Vision Audit, Subsidy Advisory, Dispute */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Module 1: Deterministic Gazette Bill Deconstruction */}
        {calc && (
          <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-sky-950 text-sky-400 border border-sky-800">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isTe ? 'గెజిట్ బిల్లు విభజన (TGERC)' : 'Official TGERC Gazette Bill'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isTe ? '100% పారదర్శక గణిత సూత్రాలు' : 'Deterministic 2024-25 Gazette Formulas'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-1 rounded border border-sky-800">
                LT-Category I
              </span>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400">{isTe ? 'స్థూల మొత్తం' : 'Gross Billed'}:</span>
                <div className="text-xl font-bold font-mono text-slate-200 mt-0.5">
                  ₹{calc.gross_amount.toFixed(2)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/80">
                <span className="text-xs text-emerald-400 font-semibold">{isTe ? 'చెల్లించాల్సిన నికర మొత్తం' : 'Net Payable'}:</span>
                <div className="text-xl font-black font-mono text-emerald-300 mt-0.5">
                  ₹{calc.net_payable_amount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Gruha Jyothi Banner */}
            <div className={`p-3 rounded-xl border text-xs flex items-start space-x-2 ${
              calc.subsidy_amount > 0 
                ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                : 'bg-amber-950/30 border-amber-800/60 text-amber-300'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <div>
                <span className="font-bold">{isTe ? 'గృహజ్యోతి సబ్సిడీ:' : 'Gruha Jyothi Subsidy:'} </span>
                <span>{calc.subsidy_status_note}</span>
                {calc.subsidy_amount > 0 && (
                  <span className="block font-mono font-bold mt-1 text-emerald-400">
                    {isTe ? 'ఆదా అయిన మొత్తం: ' : 'Total Saved: '}₹{calc.subsidy_amount.toFixed(2)} (100% Zero-Bill)
                  </span>
                )}
              </div>
            </div>

            {/* Line-by-line Slab Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pt-1">
                {isTe ? 'స్లాబ్ వారీగా లెక్కలు:' : 'Tariff Slab Line Items:'}
              </div>
              {calc.slab_lines?.map((slab, i) => (
                <div key={i} className="flex justify-between py-1 px-2 rounded bg-slate-950/50">
                  <span className="text-slate-400">{slab.slab} ({slab.units} units @ ₹{slab.rate}):</span>
                  <span className="font-mono text-slate-200">₹{slab.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between py-1 px-2 rounded bg-slate-950/50">
                <span className="text-slate-400">{isTe ? 'కస్టమర్ ఛార్జీలు' : 'Customer Charges'}:</span>
                <span className="font-mono text-slate-200">₹{calc.customer_charges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-slate-950/50">
                <span className="text-slate-400">{isTe ? 'ఫిక్స్డ్ ఛార్జీలు' : 'Fixed Charges'}:</span>
                <span className="font-mono text-slate-200">₹{calc.fixed_charges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-slate-950/50">
                <span className="text-slate-400">{isTe ? 'విద్యుత్ డ్యూటీ (6 పైసలు/యూనిట్)' : 'Electricity Duty (6p/unit)'}:</span>
                <span className="font-mono text-slate-200">₹{calc.electricity_duty.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Module 2: Multimodal Meter OCR Audit */}
        {vision && (
          <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isTe ? 'మల్టీమోడల్ మీటర్ ఆడిట్ (Vision)' : 'Multimodal Meter OCR Audit'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isTe ? 'భౌతిక LCD రీడింగ్ వర్సెస్ బిల్లు ఇన్వాయిస్' : 'Physical LCD Reading vs Ledger Invoiced'}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                vision.discrepancy_detected
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {vision.discrepancy_detected ? (isTe ? 'తేడా గుర్తించబడింది' : 'Discrepancy Found') : (isTe ? 'సరైనది' : 'Verified Correct')}
              </span>
            </div>

            {/* Readings Comparison Table */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{isTe ? 'మీటర్ OCR రీడింగ్' : 'Meter OCR Extracted'}:</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  {vision.extracted_reading} kWh
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{isTe ? 'OCR కాన్ఫిడెన్స్ స్కోర్' : 'OCR Extraction Confidence'}:</span>
                <span className="font-mono text-emerald-400 text-xs font-semibold">
                  {(vision.ocr_confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">{isTe ? 'బిల్లుపై ఉన్న రీడింగ్' : 'Billed on Invoice'}:</span>
                <span className="font-mono text-slate-200 text-xs font-semibold">
                  {billedReading} kWh
                </span>
              </div>
              {vision.discrepancy_detected && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-rose-400 font-semibold">{isTe ? 'మిగులు వ్యత్యాసం' : 'Overbilled Delta'}:</span>
                  <span className="font-mono font-bold text-rose-400 text-sm">
                    {vision.extracted_reading - billedReading} kWh
                  </span>
                </div>
              )}
            </div>

            {/* Recommended Action */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-400">{isTe ? 'సిఫార్సు చేయబడిన చర్య:' : 'Recommended Action:'} </span>
                <span className="font-semibold text-white">{vision.recommended_action}</span>
              </div>
              {vision.discrepancy_detected && (
                <span className="text-[11px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                  Escalated
                </span>
              )}
            </div>
          </div>
        )}

        {/* Module 3: Proactive 200-Unit Subsidy Cliff Advisory */}
        {advisory && (
          <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isTe ? 'గృహజ్యోతి సబ్సిడీ అడ్వైజరీ' : 'Gruha Jyothi Cliff Advisory'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isTe ? '200 యూనిట్ల క్లిఫ్ దాటకుండా ప్రోయాక్టివ్ హెచ్చరిక' : 'Predictive Consumption Run-Rate to 200 kWh'}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                advisory.is_danger_zone
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {advisory.is_danger_zone ? (isTe ? 'ప్రమాద స్థాయి' : 'Danger Zone') : (isTe ? 'సురక్షిత స్థాయి' : 'Safe Tier')}
              </span>
            </div>

            {/* Run-Rate Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">{isTe ? 'ప్రస్తుత వినియోగం' : 'Current Consumption'}: {advisory.current_units} kWh</span>
                <span className="font-mono font-bold text-amber-400">200 kWh Limit</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    advisory.current_units > 185
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : 'bg-gradient-to-r from-cyan-500 to-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (advisory.current_units / 200) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0 kWh</span>
                <span className="font-semibold text-slate-300">
                  {isTe ? `మిగిలిన పరిమితి: ${advisory.units_until_cliff} kWh` : `${advisory.units_until_cliff} kWh buffer left`}
                </span>
                <span>200 kWh (Cliff)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">{isTe ? 'రోజువారీ బర్న్ రేట్' : 'Daily Burn Rate'}:</span>
                <div className="font-mono font-bold text-cyan-300 text-sm mt-0.5">
                  {advisory.daily_burn_rate} kWh / day
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">{isTe ? 'నెలాఖరు అంచనా' : 'Month-End Projected'}:</span>
                <div className={`font-mono font-bold text-sm mt-0.5 ${advisory.projected_units > 200 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {advisory.projected_units} kWh
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
              {advisory.advisory_message}
            </p>
          </div>
        )}

        {/* Module 4: Autonomous SAP IS-U Dispute Resolution Ticket */}
        {ticket && (
          <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-xl border border-rose-900/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-rose-950 text-rose-400 border border-rose-800">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isTe ? 'అధికారిక SAP IS-U ఫిర్యాదు టికెట్' : 'Autonomous SAP IS-U Dispute'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isTe ? 'తక్షణ తాత్కాలిక బిల్లు సవరణ' : 'Provisional Invoiced Revision Gateway'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800">
                {ticket.status}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{isTe ? 'టికెట్ ఐడీ' : 'Ticket ID'}:</span>
                <span className="font-mono font-bold text-cyan-400">{ticket.ticket_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">USC No:</span>
                <span className="font-mono text-slate-200">{ticket.usc_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isTe ? 'ఫిర్యాదు వర్గం' : 'Category'}:</span>
                <span className="text-slate-300 font-medium">{ticket.complaint_type}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400">{isTe ? 'వివాదంలో ఉన్న మొత్తం' : 'Disputed Amount'}:</span>
                <span className="font-mono text-rose-400 font-bold">₹{ticket.disputed_amount_inr?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400 font-bold">{isTe ? 'తాత్కాలిక సవరించిన మొత్తం' : 'Provisional Revised Bill'}:</span>
                <span className="font-mono text-emerald-400 font-black text-sm">₹{ticket.provisional_revised_amount_inr?.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300">
              {isTe 
                ? 'మీ ఫిర్యాదు డిస్కం సెక్షన్ ఆఫీసర్ కమాండ్ సెంటర్‌కు సమర్పించబడింది. విచారణ పూర్తయ్యే వరకు సవరించిన మొత్తాన్ని మాత్రమే చెల్లించవచ్చు.'
                : 'Ticket queued for Section Officer review. Consumer is authorized to pay only the provisional revised amount during verification.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
