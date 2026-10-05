import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, FileText, AlertCircle } from 'lucide-react';

export default function RiskHeatmap({ activeDoc }) {
  const defaultHeatmap = [
    { section: "Section 1: Confidentiality & Scope", risk: "LOW", score: 20, reason: "Standard mutual definition covering trade secrets and non-public data." },
    { section: "Section 2: Term & Survival Obligations", risk: "MEDIUM", score: 55, reason: "5-year confidentiality survival post-termination exceeds standard 2-year market norms." },
    { section: "Section 3: Indemnification & Remedies", risk: "HIGH", score: 85, reason: "Unilateral indemnification obligation with injunction rights without bond requirement." },
    { section: "Section 4: Governing Law & Jurisdiction", risk: "LOW", score: 25, reason: "Standard California state and federal court jurisdiction." }
  ];

  const heatmapData = (activeDoc && activeDoc.risk_heatmap) ? activeDoc.risk_heatmap : defaultHeatmap;
  const docName = activeDoc ? activeDoc.name : "Mutual_Non_Disclosure_Agreement.pdf";

  const highCount = heatmapData.filter(h => h.risk === 'HIGH').length;
  const medCount = heatmapData.filter(h => h.risk === 'MEDIUM').length;
  const lowCount = heatmapData.filter(h => h.risk === 'LOW').length;

  const overallRisk = highCount > 0 ? 'HIGH' : medCount > 0 ? 'MEDIUM' : 'LOW';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Risk Overview Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200">
            <FileText className="w-3.5 h-3.5 text-indigo-600" /> Contract Audit Heatmap
          </div>
          <h2 className="text-xl font-serif font-bold text-slate-900 tracking-tight">
            Risk Analysis for {docName}
          </h2>
          <p className="text-xs text-slate-500">
            Every section evaluated for one-sided liability, strict non-compete terms, and unusual legal conditions.
          </p>
        </div>

        {/* Overall Status Badge */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-right">
            <div className="text-xs text-slate-500 font-semibold">Overall Risk Level</div>
            <div className={`text-lg font-black tracking-wider ${
              overallRisk === 'HIGH' ? 'text-rose-600' : overallRisk === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {overallRisk} RISK
            </div>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            overallRisk === 'HIGH'
              ? 'bg-rose-100 border-rose-200 text-rose-700'
              : overallRisk === 'MEDIUM'
              ? 'bg-amber-100 border-amber-200 text-amber-700'
              : 'bg-emerald-100 border-emerald-200 text-emerald-700'
          }`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Summary Counts Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200 flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-rose-700">{highCount}</div>
            <div className="text-xs font-semibold text-rose-800">High Risk Provisions</div>
          </div>
          <AlertCircle className="w-8 h-8 text-rose-300" />
        </div>
        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-amber-700">{medCount}</div>
            <div className="text-xs font-semibold text-amber-800">Medium Risk Provisions</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-300" />
        </div>
        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-emerald-700">{lowCount}</div>
            <div className="text-xs font-semibold text-emerald-800">Low Risk Provisions</div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-300" />
        </div>
      </div>

      {/* Heatmap Section Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          Section Breakdown & Risk Ratings
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {heatmapData.map((item, idx) => {
            const isHigh = item.risk === 'HIGH';
            const isMed = item.risk === 'MEDIUM';

            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          isHigh
                            ? 'bg-rose-100 text-rose-700 border-rose-200'
                            : isMed
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {item.risk} RISK ({item.score}%)
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.section}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.reason}
                    </p>
                  </div>

                  {/* Score Progress Bar */}
                  <div className="w-full md:w-48 space-y-1.5 shrink-0">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                      <span>Risk Exposure</span>
                      <span>{item.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
