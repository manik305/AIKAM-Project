import React from 'react';
import { X, Cpu, Server, Zap, Database, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose, language }) {
  if (!isOpen) return null;

  const isTe = language === 'te';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                UrjaMitra AI: Tri-Cognitive Architecture Blueprint
              </h2>
              <p className="text-xs text-slate-400">
                Department of Energy, Govt. of Telangana • TGSPDCL & TGNPDCL
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

        {/* 3 Cognitive Pillars */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* System 1: Jev Decision Router */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-800/60 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                System-1: Perception
              </span>
              <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                50-100ms
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Jev Token Router</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Non-autoregressive parallel evaluation using TypeSafe primitives:
              <br />• <strong>Choice</strong>: 5 deterministic intents
              <br />• <strong>Noul</strong>: Direct LLM bypass boolean
              <br />• <strong>Score</strong>: Dispute severity 1-10
            </p>
          </div>

          {/* System 0: Deterministic Math */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-800/60 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                System-0: Execution
              </span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                &lt;5ms
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">TGERC Gazette Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero LLM arithmetic. 100% mathematical certainty enforcing:
              <br />• Official 2024-25 TGERC Retail Supply Order
              <br />• Gruha Jyothi 100% Zero-Bill (&lt;= 200 kWh)
              <br />• Telescopic multi-slab energy calculations
            </p>
          </div>

          {/* System 2: LangGraph Agent Core */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-800/60 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                System-2: Cognition
              </span>
              <span className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                Multi-Agent
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">LangGraph StateGraph</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Coordinated multi-agent workflow:
              <br />• <strong>Vision Agent</strong>: Multimodal LCD meter OCR
              <br />• <strong>Advisory Agent</strong>: Subsidy cliff trajectory
              <br />• <strong>Ticket Agent</strong>: SAP IS-U BAPI grievance
            </p>
          </div>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            End-to-End Orchestration Architecture
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="w-full sm:w-auto p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <div className="font-bold text-white">Citizen / Officer Portal</div>
              <div className="text-[10px] text-slate-400">React + Tailwind SPA</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 rotate-90 sm:rotate-0" />

            <div className="w-full sm:w-auto p-3 rounded-lg bg-cyan-950/50 border border-cyan-800 text-center">
              <div className="font-bold text-cyan-300">FastAPI Gateway</div>
              <div className="text-[10px] text-cyan-400/80">/api/v1/chat/query</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 rotate-90 sm:rotate-0" />

            <div className="w-full sm:w-auto p-3 rounded-lg bg-indigo-950/50 border border-indigo-800 text-center">
              <div className="font-bold text-indigo-300">Jev System-1 Router</div>
              <div className="text-[10px] text-indigo-400/80">&lt;100ms Token Eval</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 rotate-90 sm:rotate-0" />

            <div className="w-full sm:w-auto p-3 rounded-lg bg-emerald-950/50 border border-emerald-800 text-center">
              <div className="font-bold text-emerald-300">TGERC Math / LangGraph</div>
              <div className="text-[10px] text-emerald-400/80">Python Engine</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 rotate-90 sm:rotate-0" />

            <div className="w-full sm:w-auto p-3 rounded-lg bg-purple-950/50 border border-purple-800 text-center">
              <div className="font-bold text-purple-300">TGSPDCL SAP IS-U</div>
              <div className="text-[10px] text-purple-400/80">BAPI Dispute Gateway</div>
            </div>
          </div>
        </div>

        {/* AKS Autoscaling Specs */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Azure Kubernetes Service (AKS) Elastic HPA</strong>: Scales from 3 to 50 pods when RAM &gt; 70% or CPU &gt; 65% during peak billing cycles.
            </span>
          </div>
          <span className="font-mono text-emerald-400 font-bold whitespace-nowrap">
            99.99% Availability
          </span>
        </div>
      </div>
    </div>
  );
}
