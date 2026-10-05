import React, { useState } from 'react';
import { Scale, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

export default function DocumentComparison({ sampleDocs }) {
  const [doc1Id, setDoc1Id] = useState('demo_nda');
  const [doc2Id, setDoc2Id] = useState('demo_saas');
  const [topic, setTopic] = useState('Termination & Liability');
  const [isComparing, setIsComparing] = useState(false);
  const [result, setResult] = useState(null);

  const handleCompare = async () => {
    setIsComparing(true);
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_id_1: doc1Id,
          doc_id_2: doc2Id,
          topic: topic
        }),
      });

      if (!response.ok) throw new Error('Comparison failed');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Comparison Selector Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" /> Side-by-Side Contract Comparison Mode
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compare two contracts clause-by-clause to identify which document offers better legal protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Doc 1 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Document 1 (Base Contract)</label>
            <select
              value={doc1Id}
              onChange={(e) => setDoc1Id(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium outline-none focus:border-slate-400"
            >
              {sampleDocs.map((d) => (
                <option key={d.doc_id} value={d.doc_id}>{d.name} ({d.type})</option>
              ))}
            </select>
          </div>

          {/* Doc 2 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Document 2 (Counter Contract)</label>
            <select
              value={doc2Id}
              onChange={(e) => setDoc2Id(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium outline-none focus:border-slate-400"
            >
              {sampleDocs.map((d) => (
                <option key={d.doc_id} value={d.doc_id}>{d.name} ({d.type})</option>
              ))}
            </select>
          </div>

          {/* Compare Action */}
          <div className="flex items-end">
            <button
              onClick={handleCompare}
              disabled={isComparing}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {isComparing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Contracts...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" /> Run Side-by-Side Audit
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          
          {/* Winner Banner */}
          <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> COMPARISON RECOMMENDATION
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                Favorable Document: <span className="text-emerald-700">{result.overall_winner}</span>
              </h3>
              <p className="text-xs text-slate-600">
                {result.summary}
              </p>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="space-y-4">
            {result.comparison.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    Topic: {item.clause_type}
                  </h4>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    Side-by-Side Analysis
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Doc 1 Box */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-indigo-700 block">{result.doc_1.name}</span>
                    <p className="text-xs text-slate-700 font-mono">"{item.doc_1_text}"</p>
                  </div>

                  {/* Doc 2 Box */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-purple-700 block">{result.doc_2.name}</span>
                    <p className="text-xs text-slate-700 font-mono">"{item.doc_2_text}"</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-800 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Recommendation:</strong> {item.recommendation}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
