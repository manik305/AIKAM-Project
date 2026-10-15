import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CitizenPortal from './components/CitizenPortal';
import OfficerDashboard from './components/OfficerDashboard';
import MeterPhotoModal from './components/MeterPhotoModal';
import ArchitectureModal from './components/ArchitectureModal';
import { queryUrjaMitraChat, checkBackendHealth } from './services/api';
import { Camera, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' or 'officer'
  const [language, setLanguage] = useState('te'); // 'te' (Telugu) or 'en' (English)
  const [apiHealth, setApiHealth] = useState('healthy');
  const [loading, setLoading] = useState(false);
  const [isMeterModalOpen, setIsMeterModalOpen] = useState(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [evidenceTicket, setEvidenceTicket] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Initial baseline calculation state for 165 units (Gruha Jyothi zero bill)
  const [resultData, setResultData] = useState({
    status: 'success',
    jev_routing_telemetry: {
      intent: 'BILL_BREAKDOWN',
      bypass_llm: true,
      dispute_severity_score: 2,
      routed_target: 'DETERMINISTIC_ENGINE',
      latency_ms: 68.4,
      evaluation_model: 'jev-system1-parallel'
    },
    response: {
      calculation: {
        billed_units: 165.0,
        energy_charges: 652.0,
        customer_charges: 60.0,
        fixed_charges: 10.0,
        electricity_duty: 9.9,
        gross_amount: 731.9,
        subsidy_amount: 731.9,
        net_payable_amount: 0.0,
        subsidy_status_note: 'Full 100% Zero-Bill Subsidy applied under Gruha Jyothi scheme (<= 200 units).',
        slab_lines: [
          { slab: '0-100 units', units: 100, rate: 3.4, amount: 340.0 },
          { slab: '101-200 units', units: 65, rate: 4.8, amount: 312.0 }
        ]
      },
      vernacular_explanation: 'మీరు ఈ నెల 165 యూనిట్లు వాడారు. గృహజ్యోతి పథకం కింద మీ మొత్తం బిల్లు రూ. 0.00.',
      language: 'te'
    }
  });

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then((data) => {
      if (data && data.status) {
        setApiHealth(data.status);
      }
    });
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRunQuery = async (params) => {
    setLoading(true);
    try {
      const data = await queryUrjaMitraChat(params);
      setResultData(data);
      if (data.response?.ticket) {
        showToast(language === 'te' 
          ? `ఫిర్యాదు టికెట్ ${data.response.ticket.ticket_id} SAP IS-U లో నమోదు చేయబడింది!`
          : `Grievance ticket ${data.response.ticket.ticket_id} pushed to SAP IS-U!`);
      }
    } catch (err) {
      console.error('Error running query:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyExtractedFromMeter = (meterData) => {
    showToast(language === 'te' 
      ? `మీటర్ OCR రీడింగ్ (${meterData.reported_reading} kWh) విజయవంతంగా వర్తింపజేయబడింది!`
      : `Meter OCR Reading (${meterData.reported_reading} kWh) applied to Copilot!`);

    handleRunQuery({
      units: meterData.units,
      message: `Audit meter photo with LCD reading ${meterData.reported_reading} kWh`,
      preferred_language: language,
      has_image: true,
      image_base64: meterData.image_base64,
      reported_reading: meterData.reported_reading,
      billed_reading: meterData.billed_reading,
      disputed_amount: meterData.disputed_amount,
    });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-900 border border-cyan-500/60 shadow-2xl text-cyan-300 text-xs font-semibold animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        apiHealth={apiHealth}
        onOpenArch={() => setIsArchModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'citizen' ? (
          <CitizenPortal
            onRunQuery={handleRunQuery}
            loading={loading}
            resultData={resultData}
            onOpenMeterModal={() => setIsMeterModalOpen(true)}
            language={language}
          />
        ) : (
          <OfficerDashboard
            language={language}
            onOpenEvidence={(t) => setEvidenceTicket(t)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>AIKAM EnergyTech Innovation Challenge • Govt. of Telangana</span>
          </div>
          <div>
            TGSPDCL & TGNPDCL • Tri-Cognitive Billing Architecture (System-1 Jev Router, System-0 TGERC Math, System-2 LangGraph)
          </div>
        </div>
      </footer>

      {/* Meter OCR Scanner Modal */}
      <MeterPhotoModal
        isOpen={isMeterModalOpen}
        onClose={() => setIsMeterModalOpen(false)}
        onApplyExtracted={handleApplyExtractedFromMeter}
        language={language}
      />

      {/* Architecture Deep Dive Modal */}
      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
        language={language}
      />

      {/* Officer Evidence Inspector Modal */}
      {evidenceTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Ticket Evidence Audit: {evidenceTicket.id}</span>
              </h3>
              <button
                onClick={() => setEvidenceTicket(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Meter Evidence Photograph (Encrypted Storage)
                </div>
                <div className="py-4 px-3 rounded-lg lcd-display border border-slate-700 my-2">
                  <div className="text-[10px] text-sky-400 font-mono">LCD READING</div>
                  <div className="text-3xl font-extrabold text-cyan-300">
                    {evidenceTicket.meterOcrReading} kWh
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">
                    OCR Confidence: {(evidenceTicket.confidence * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  Consumer USC: <span className="font-mono text-slate-200">{evidenceTicket.usc}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Billed Reading:</span>
                  <span className="font-mono text-slate-200">{evidenceTicket.billedReading} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Discrepancy Delta:</span>
                  <span className="font-mono text-rose-400 font-bold">{evidenceTicket.delta} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Original Disputed Amount:</span>
                  <span className="font-mono text-slate-200">₹{evidenceTicket.disputedAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400 font-bold">Provisional Revised Bill:</span>
                  <span className="font-mono text-emerald-400 font-bold">₹{evidenceTicket.provisionalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setEvidenceTicket(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
