import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, FileCode, ArrowRight, ShieldAlert } from 'lucide-react';

export default function DocumentUpload({ sampleDocs, onSelectDoc, activeDocId, onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Upload failed');
      }

      const data = await response.json();
      onUploadSuccess(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error uploading document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      
      {/* Banner */}
      <div className="glass-card rounded-2xl p-6 border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900/80 to-purple-950/40 flex flex-col md:flex-row items-center gap-6 shadow-xl">
        <img 
          src="/mascot.jpg" 
          alt="LegalBuddy Owl Mascot" 
          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/40 shadow-xl shadow-indigo-500/20"
        />
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Instant Contract Analysis & AI RAG
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Upload Contract or Select Demo Document
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl">
            LegalBuddy parses contracts, chunks paragraphs into vector embeddings, flags risky clauses, and provides instant Q&A backed by exact page/section citations.
          </p>
        </div>
      </div>

      {/* 1-Click Demo Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Pre-Loaded Demo Documents (Instant Test)
          </h3>
          <span className="text-xs text-slate-400">Click any card to start querying immediately</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleDocs.map((doc) => {
            const isSelected = activeDocId === doc.doc_id;
            return (
              <div
                key={doc.doc_id}
                onClick={() => onSelectDoc(doc)}
                className={`glass-card p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/40'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                      {doc.type}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {doc.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium">
                  <span>Select & Analyze</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* File Dropzone */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-indigo-400" /> Upload Your Own Contract
        </h3>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative glass-card border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive
              ? 'border-indigo-500 bg-indigo-950/30'
              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
          }`}
        >
          <input
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-7 h-7" />
              )}
            </div>

            <div>
              <p className="text-base font-semibold text-white">
                {isUploading ? 'Ingesting Document & Generating Vectors...' : 'Drop your contract here or click to browse'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF, TXT, DOCX (Max 4.5 MB serverless limit)
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-indigo-400" /> Auto-Chunking</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Fast Vector RAG</span>
              <span>•</span>
              <span className="flex items-center gap-1"><FileCode className="w-3.5 h-3.5 text-emerald-400" /> Gemini Embeddings</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

    </div>
  );
}
