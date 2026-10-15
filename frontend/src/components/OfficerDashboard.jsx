import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  ShieldCheck, 
  Activity, 
  Users, 
  Server, 
  ArrowUpRight, 
  Filter, 
  RefreshCw,
  Search,
  FileCheck
} from 'lucide-react';

export default function OfficerDashboard({ language, onOpenEvidence }) {
  const isTe = language === 'te';

  const [selectedCircle, setSelectedCircle] = useState('Hyderabad South');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample queue of meter discrepancy audit tickets
  const [tickets, setTickets] = useState([
    {
      id: 'URJA-DISP-89F1',
      usc: '100234891',
      consumer: 'Ramesh Reddy',
      circle: 'Hyderabad South',
      subdivision: 'Banjara Hills',
      billedReading: 14890.0,
      meterOcrReading: 14210.0,
      delta: -680.0,
      disputedAmount: 4820.0,
      provisionalAmount: 2169.0,
      confidence: 0.965,
      status: 'UNDER_AUDIT',
      timestamp: '10 mins ago'
    },
    {
      id: 'URJA-DISP-94B2',
      usc: '100492819',
      consumer: 'Lakshmi Narayana',
      circle: 'Hyderabad South',
      subdivision: 'Jubilee Hills',
      billedReading: 22450.0,
      meterOcrReading: 21890.0,
      delta: -560.0,
      disputedAmount: 3910.0,
      provisionalAmount: 1820.0,
      confidence: 0.942,
      status: 'UNDER_AUDIT',
      timestamp: '28 mins ago'
    },
    {
      id: 'URJA-DISP-41C8',
      usc: '200184712',
      consumer: 'Srinivas Rao',
      circle: 'Warangal',
      subdivision: 'Hanamkonda',
      billedReading: 8940.0,
      meterOcrReading: 8940.0,
      delta: 0.0,
      disputedAmount: 0.0,
      provisionalAmount: 0.0,
      confidence: 0.985,
      status: 'VERIFIED_CORRECT',
      timestamp: '1 hour ago'
    },
    {
      id: 'URJA-DISP-77A0',
      usc: '100829104',
      consumer: 'Mohammed Khaja',
      circle: 'Hyderabad South',
      subdivision: 'Charminar',
      billedReading: 31200.0,
      meterOcrReading: 30100.0,
      delta: -1100.0,
      disputedAmount: 8900.0,
      provisionalAmount: 3450.0,
      confidence: 0.971,
      status: 'UNDER_AUDIT',
      timestamp: '2 hours ago'
    }
  ]);

  const handleApproveProvisional = (ticketId) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: 'PROVISIONAL_APPROVED' } : t));
  };

  const handleDispatchLineman = (ticketId) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: 'LINEMAN_DISPATCHED' } : t));
  };

  const filteredTickets = tickets.filter(t => {
    const matchCircle = selectedCircle === 'ALL' || t.circle === selectedCircle;
    const matchSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        t.usc.includes(searchTerm) || 
                        t.consumer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCircle && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Officer Header Card */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                {isTe ? 'సెక్షన్ ఆఫీసర్ కమాండ్ సెంటర్' : 'Section Officer Command Center'}
              </span>
              <span className="text-xs text-slate-400">
                TGSPDCL & TGNPDCL Utility Operations
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {isTe ? 'డిస్కం వివాదాల పర్యవేక్షణ & ప్రత్యక్ష SAP గేట్‌వే' : 'Autonomous Grievance Dispatch & SAP IS-U Oversight'}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-slate-400">Circle / Sub-division</div>
              <div className="text-sm font-bold text-white font-mono">{selectedCircle}</div>
            </div>
            <select
              value={selectedCircle}
              onChange={(e) => setSelectedCircle(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Hyderabad South">Hyderabad South</option>
              <option value="Warangal">Warangal</option>
              <option value="ALL">All Circles (Statewide)</option>
            </select>
          </div>
        </div>

        {/* Real-time KPI Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isTe ? 'మొత్తం విచారణలు' : 'Total Inquiries'}
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">14,892</div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12.4% vs last cycle
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isTe ? 'తక్షణ పరిష్కార రేటు' : 'FCR Auto-Resolution'}
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">84.2%</div>
            <div className="text-[10px] text-slate-400 mt-1">
              Jev System-1 Bypassed
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isTe ? 'ఆడిట్ కోసం వేచి ఉన్నవి' : 'Pending Audit Queue'}
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">18</div>
            <div className="text-[10px] text-amber-300/80 mt-1">
              4 high-priority deltas
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isTe ? 'Jev సగటు లేటెన్సీ' : 'Jev p95 Latency'}
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">68.4ms</div>
            <div className="text-[10px] text-cyan-300/80 mt-1">
              Zero token loops
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 col-span-2 lg:col-span-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isTe ? 'AKS క్లస్టర్ పాడ్స్' : 'AKS HPA Pods'}
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-400 mt-1">3 / 50</div>
            <div className="text-[10px] text-slate-400 mt-1">
              CPU: 42% • RAM: 58%
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancy Audits Table Card */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>{isTe ? 'పెండింగ్ మీటర్ రీడింగ్ తేడాల ఆడిట్' : 'Pending Meter Discrepancy Audits'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-mono">
                {filteredTickets.length} Tickets
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isTe 
                ? 'భౌతిక మీటర్ OCR ఫోటో మరియు సవరించిన తాత్కాలిక బిల్లులను సమీక్షించండి'
                : 'Review automated OCR discrepancies and issue provisional bill adjustments'}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={isTe ? "టికెట్ లేదా USC శోధించండి..." : "Search ticket or USC..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Ticket & USC</th>
                <th className="py-3 px-4">Consumer</th>
                <th className="py-3 px-4">Billed vs OCR</th>
                <th className="py-3 px-4">Delta (kWh)</th>
                <th className="py-3 px-4">Provisional Bill</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-cyan-400">{t.id}</div>
                    <div className="font-mono text-slate-400 text-[11px]">USC: {t.usc}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{t.consumer}</div>
                    <div className="text-[11px] text-slate-400">{t.subdivision}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-slate-300">
                      Bill: <span className="text-slate-100">{t.billedReading}</span>
                    </div>
                    <div className="font-mono text-cyan-400">
                      OCR: {t.meterOcrReading} ({(t.confidence * 100).toFixed(0)}%)
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {t.delta !== 0 ? (
                      <span className="font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/80">
                        {t.delta} kWh
                      </span>
                    ) : (
                      <span className="font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/80">
                        0 (Verified)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-emerald-400">
                      ₹{t.provisionalAmount.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-400 line-through">
                      ₹{t.disputedAmount.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      t.status === 'UNDER_AUDIT'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : t.status === 'PROVISIONAL_APPROVED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : t.status === 'LINEMAN_DISPATCHED'
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => onOpenEvidence(t)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                      title="Inspect Photo Evidence"
                    >
                      Evidence
                    </button>
                    {t.status === 'UNDER_AUDIT' && (
                      <>
                        <button
                          onClick={() => handleApproveProvisional(t.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDispatchLineman(t.id)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold transition"
                        >
                          Dispatch
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
