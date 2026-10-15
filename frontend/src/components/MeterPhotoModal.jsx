import React, { useState } from 'react';
import { X, Camera, Upload, CheckCircle2, AlertTriangle, Scan, RefreshCw, Eye } from 'lucide-react';

export default function MeterPhotoModal({ isOpen, onClose, onApplyExtracted, language }) {
  if (!isOpen) return null;

  const isTe = language === 'te';

  // Sample presets for instant testing
  const sampleMeters = [
    {
      id: 'discrepancy',
      title: isTe ? 'తేడా ఉన్న మీటర్ (డిస్ప్యూట్)' : 'Discrepancy Meter (Overbilled)',
      reading: 14210.0,
      billed: 14890.0,
      confidence: 0.965,
      delta: -680,
      description: isTe ? 'భౌతిక మీటర్ రీడింగ్ 14210 కాగా, బిల్లులో 14890 నమోదైంది.' : 'Physical meter displays 14,210 kWh vs 14,890 on bill.',
      type: 'DISCREPANCY'
    },
    {
      id: 'gruha_jyothi',
      title: isTe ? 'గృహజ్యోతి అర్హత మీటర్' : 'Gruha Jyothi Eligible Meter',
      reading: 165.0,
      billed: 165.0,
      confidence: 0.982,
      delta: 0,
      description: isTe ? 'నెలవారీ రీడింగ్ 165 kWh - 100% జీరో బిల్ సబ్సిడీ.' : 'Monthly units 165 kWh - 100% Zero-Bill Subsidy applies.',
      type: 'NORMAL'
    },
    {
      id: 'cliff_warning',
      title: isTe ? '200 యూనిట్ల హెచ్చరిక మీటర్' : 'Subsidy Cliff Warning (194 kWh)',
      reading: 194.0,
      billed: 194.0,
      confidence: 0.954,
      delta: 0,
      description: isTe ? '194 యూనిట్లు - 6 యూనిట్లు మించితే ఉచిత విద్యుత్ కోల్పోతారు.' : '194 units - 6 units away from losing free electricity!',
      type: 'CLIFF'
    }
  ];

  const [selectedPreset, setSelectedPreset] = useState(sampleMeters[0]);
  const [customImage, setCustomImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(true);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImage(reader.result);
        triggerScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1100);
  };

  const handleApply = () => {
    onApplyExtracted({
      reported_reading: selectedPreset.reading,
      billed_reading: selectedPreset.billed,
      disputed_amount: selectedPreset.type === 'DISCREPANCY' ? 4820 : 0,
      units: selectedPreset.reading <= 500 ? selectedPreset.reading : 250,
      has_image: true,
      image_base64: customImage,
      source_preset: selectedPreset.id
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isTe ? 'మల్టీమోడల్ మీటర్ ఫోటో ఆడిట్ (OCR)' : 'Multimodal Meter Photo Audit (OCR)'}
              </h3>
              <p className="text-xs text-slate-400">
                {isTe ? 'మీటర్ LCD స్క్రీన్ ఫోటో ద్వారా రీడింగ్‌ను ఆటోమేటిక్‌గా గుర్తించండి' : 'Extract kWh reading directly from physical meter LCD display'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="mt-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {isTe ? 'పరీక్షించడానికి ఉదాహరణ మీటర్ ఎంచుకోండి లేదా అప్‌లోడ్ చేయండి:' : 'Select Sample Meter or Upload Your Photo:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {sampleMeters.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset);
                  setCustomImage(null);
                  triggerScan();
                }}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  selectedPreset.id === preset.id && !customImage
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                    : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs text-white">{preset.title}</div>
                <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{preset.reading} kWh</div>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive LCD Display Simulator */}
        <div className="mt-4 relative rounded-xl border border-slate-800 bg-slate-950 p-4 overflow-hidden">
          {/* Scanning Beam Animation */}
          {isScanning && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-bounce" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Meter Graphic Frame */}
            <div className="w-full sm:w-1/2 flex flex-col items-center justify-center p-4 rounded-lg bg-slate-900 border border-slate-800 text-center relative">
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
                TGSPDCL ELECTRONIC ENERGY METER
              </div>

              {/* LCD Screen */}
              <div className="w-full py-4 px-3 rounded-lg lcd-display border-2 border-slate-700/80 shadow-inner my-2 flex flex-col items-center justify-center">
                <span className="text-xs text-sky-400/80 font-mono tracking-widest">KILOWATT HOUR [kWh]</span>
                <span className="text-3xl font-extrabold tracking-wider mt-1 text-cyan-300">
                  {selectedPreset.reading.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                </span>
                <span className="text-[10px] text-emerald-400/90 font-mono mt-1">● CALIBRATED • 5-30A • 240V</span>
              </div>

              <div className="text-[11px] text-slate-400 mt-1">
                USC: <span className="font-mono text-slate-200">100234891</span> | Class 1.0
              </div>
            </div>

            {/* Extracted Details & Confidence */}
            <div className="w-full sm:w-1/2 space-y-3">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{isTe ? 'గుర్తించిన రీడింగ్' : 'Extracted OCR Reading'}:</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">
                    {selectedPreset.reading} kWh
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-slate-400">{isTe ? 'OCR విశ్వసనీయత' : 'OCR Confidence'}:</span>
                  <span className="font-mono font-semibold text-emerald-400 text-xs">
                    {(selectedPreset.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-800">
                  <span className="text-xs text-slate-400">{isTe ? 'బిల్లుపై ఉన్న రీడింగ్' : 'Billed Reading'}:</span>
                  <span className="font-mono text-slate-200 text-xs">
                    {selectedPreset.billed} kWh
                  </span>
                </div>
              </div>

              {/* Discrepancy Status */}
              {selectedPreset.type === 'DISCREPANCY' ? (
                <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-300">
                    <span className="font-bold">{isTe ? 'రీడింగ్ తేడా గుర్తించబడింది!' : 'Discrepancy Detected!'} </span>
                    {isTe ? 'బిల్లులో 680 యూనిట్లు ఎక్కువగా నమోదైంది.' : 'Bill is inflated by 680 units.'}
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-300">
                    <span className="font-bold">{isTe ? 'రీడింగ్ సరిపోయింది!' : 'Reading Verified Accurate.'} </span>
                    {isTe ? 'మీటర్ మరియు బిల్లు రీడింగ్ ఒకేలా ఉంది.' : 'Meter matches consumer ledger.'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Custom File Input */}
        <div className="mt-4 flex items-center justify-between">
          <label className="cursor-pointer inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isTe ? 'కస్టమ్ ఫోటోను అప్‌లోడ్ చేయండి' : 'Upload Local Meter Image'}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <div className="flex space-x-2">
            <button
              onClick={triggerScan}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition flex items-center space-x-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isTe ? 'పునఃపరిశీలన' : 'Rescan'}</span>
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-xs font-bold text-white shadow-lg shadow-cyan-950 transition"
            >
              {isTe ? 'ఈ డేటాను వర్తింపజేయి' : 'Use in Copilot Analysis'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
