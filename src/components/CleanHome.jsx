import React, { useState } from 'react';
import { Upload, FileText, ArrowRight, ArrowUp, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import FormattedText from './FormattedText';

export default function CleanHome({
  sampleDocs,
  activeDoc,
  onSelectDoc,
  onUploadSuccess,
  mode,
  messages,
  onSendMessage,
  isLoading
}) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
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
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;
    onSendMessage(inputQuery.trim());
    setInputQuery('');
  };

  const quickPrompts = [
    "Summarize this document",
    "What should I know?",
    "Key obligations & rights"
  ];

  return (
    <div className="space-y-12 pb-32">
      
      {/* 1. Hero Banner matching Photograph #2 */}
      <div className="rounded-3xl cream-card p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-6 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#e7e4d8] text-[11px] font-bold tracking-wider text-slate-700 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            YOUR DOCUMENT WORKSPACE
          </div>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight">
            Understand any legal document in seconds.
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            Upload a contract, ask questions, and explore answers with source citations.
          </p>

          <a 
            href="#upload-section"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-indigo-900 transition-colors group"
          >
            START WITH A DOCUMENT <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Hero Pen & Document Graphic matching Photograph #2 */}
        <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden shadow-lg border border-[#e7e4d8] max-h-72">
          <img 
            src="/hero.jpg" 
            alt="Legal Contract Document and Fountain Pen" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 2. Upload Section & Sample Selection matching Photograph #1 */}
      <div id="upload-section" className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 tracking-wider uppercase block">01 / DOCUMENT</span>
            <h3 className="text-2xl font-serif font-bold text-slate-900">Start with a document</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">PDF, DOCX or TXT</span>
        </div>

        {/* Dashed Upload Box matching Photograph #1 */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all bg-white ${
            dragActive ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <input
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <div>
              <p className="text-base font-bold text-slate-900">
                {isUploading ? 'Ingesting & Chunking Document...' : 'Drag & drop your document here'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                or click to browse · PDF, DOCX, TXT - max 4.5 MB
              </p>
            </div>

            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 flex items-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" /> Browse files
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* OR EXPLORE A SAMPLE Buttons matching Photograph #1 */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            OR EXPLORE A SAMPLE
          </span>

          {sampleDocs.map((doc) => {
            const isSelected = activeDoc && activeDoc.doc_id === doc.doc_id;
            return (
              <button
                key={doc.doc_id}
                onClick={() => onSelectDoc(doc)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>{doc.name.replace('.pdf', '')}</span>
                <span className="text-slate-400">↗</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* 3. Three Columns Section matching Photograph #1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4 border-t border-slate-200/80 pt-8">
        <div className="space-y-2 border-r border-slate-200/80 pr-6">
          <span className="text-2xl font-serif font-bold text-slate-900">01.</span>
          <h4 className="text-sm font-bold text-slate-900">Bring your document</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Start with your own file or explore a sample agreement.
          </p>
        </div>

        <div className="space-y-2 border-r border-slate-200/80 pr-6">
          <span className="text-2xl font-serif font-bold text-slate-900">02.</span>
          <h4 className="text-sm font-bold text-slate-900">Ask what matters</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ask questions and get instant AI answers with citations.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-2xl font-serif font-bold text-slate-900">03.</span>
          <h4 className="text-sm font-bold text-slate-900">Review the source</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Keep the underlying text close to every response.
          </p>
        </div>
      </div>

      {/* 4. Interactive Q&A Response Feed (without implementation clutter or visible asterisks) */}
      {messages.length > 0 && (
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center justify-between border-b border-slate-200 pb-3">
            <span>Document Q&A Workspace</span>
            <span className="text-xs font-sans font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
              Active: {activeDoc ? activeDoc.name : 'Mutual NDA'}
            </span>
          </h3>

          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border transition-all ${
                    isUser
                      ? 'bg-slate-900 text-white border-slate-900 ml-auto max-w-2xl'
                      : 'bg-white text-slate-900 border-slate-200 shadow-sm space-y-4'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={isUser ? 'text-slate-300' : 'text-slate-500'}>
                      {isUser ? 'YOUR QUESTION' : 'AI LEGAL ASSISTANT'}
                    </span>
                    {!isUser && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {Math.round((msg.confidence || 0.94) * 100)}% Confidence
                      </span>
                    )}
                  </div>

                  {/* Formatted Text Component (solves raw * * asterisks issue completely!) */}
                  {isUser ? (
                    <p className="text-sm font-medium">{msg.text}</p>
                  ) : (
                    <FormattedText content={msg.text} className="text-sm text-slate-800" />
                  )}

                  {/* Clean Citations Footer */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-slate-400">SOURCE CITATIONS:</span>
                      {msg.citations.map((cite, cIdx) => (
                        <span key={cIdx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                          {cite}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Fixed Floating Bottom Input Bar matching Photograph #1 & #2 */}
      <div className="fixed bottom-6 left-0 right-0 max-w-4xl mx-auto px-4 z-40">
        <form onSubmit={handleSubmit} className="space-y-3">
          
          <div className="relative bg-white border border-slate-200 shadow-xl rounded-2xl p-2 flex items-center gap-3">
            <div className="pl-3 text-amber-700">
              <Sparkles className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Upload or choose a document to start..."
              className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 outline-none py-2"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-slate-600 hover:bg-slate-800 disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 shadow-sm"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>

          {/* Try Asking Pills matching Photograph #1 */}
          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Try asking</span>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSendMessage(qp)}
                className="px-3 py-1 rounded-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-medium transition-all shadow-2xs"
              >
                {qp}
              </button>
            ))}
          </div>

        </form>
      </div>

    </div>
  );
}
