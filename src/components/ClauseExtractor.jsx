import React, { useState } from 'react';
import { Filter, FileCode, Copy, Check } from 'lucide-react';

export default function ClauseExtractor({ activeDoc }) {
  const [filterType, setFilterType] = useState('ALL');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const defaultClauses = [
    { type: "Confidentiality", section: "Section 1 & 2", text: "Receiving Party shall hold all Confidential Information in strict confidence and use reasonable care to prevent unauthorized disclosure.", risk: "LOW" },
    { type: "Termination", section: "Section 3", text: "Agreement remains in effect for 3 years; confidentiality obligations survive for an additional 5 years post-termination.", risk: "MEDIUM" },
    { type: "Indemnity", section: "Section 4", text: "Receiving Party agrees to indemnify, defend, and hold harmless Disclosing Party against damages and legal costs arising from unauthorized disclosure.", risk: "HIGH" },
    { type: "Liability", section: "Section 4", text: "Disclosing Party entitled to seek injunctive relief without requirement of posting a bond.", risk: "HIGH" }
  ];

  const clauses = (activeDoc && activeDoc.clauses) ? activeDoc.clauses : defaultClauses;
  const docName = activeDoc ? activeDoc.name : "Mutual_Non_Disclosure_Agreement.pdf";

  const clauseTypes = ['ALL', 'Termination', 'Indemnity', 'Liability', 'Confidentiality', 'Non-Compete', 'Payment'];

  const filteredClauses = filterType === 'ALL'
    ? clauses
    : clauses.filter(c => c.type.toLowerCase().includes(filterType.toLowerCase()));

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-600" /> Clause Extractor & Categorizer
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Extracted provisions from <span className="text-slate-900 font-bold">{docName}</span>
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> FILTER:
          </span>
          {clauseTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                filterType === type
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Clause Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClauses.length > 0 ? (
          filteredClauses.map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    {item.type} Clause
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {item.section}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    item.risk === 'HIGH'
                      ? 'bg-rose-100 text-rose-700 border-rose-200'
                      : item.risk === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}>
                    {item.risk} Risk
                  </span>

                  <button
                    onClick={() => handleCopy(item.text, idx)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                    title="Copy clause text"
                  >
                    {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono leading-relaxed">
                "{item.text}"
              </p>

            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 font-medium">
            No clauses found matching filter "{filterType}".
          </div>
        )}
      </div>

    </div>
  );
}
