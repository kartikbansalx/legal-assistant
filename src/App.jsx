import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CleanHome from './components/CleanHome';

export default function App() {
  const [mode, setMode] = useState('lawyer'); // 'lawyer' or 'client'
  const [sampleDocs, setSampleDocs] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/sample-docs')
      .then(res => res.json())
      .then(data => {
        setSampleDocs(data);
        if (data && data.length > 0) {
          setActiveDoc(data[0]);
        }
      })
      .catch(err => console.error("Could not fetch sample docs:", err));
  }, []);

  const handleSelectDoc = (doc) => {
    setActiveDoc(doc);
  };

  const handleUploadSuccess = (uploadData) => {
    const newDoc = {
      doc_id: uploadData.doc_id,
      name: uploadData.name,
      type: "Uploaded Contract",
      description: uploadData.summary
    };
    setActiveDoc(newDoc);
    setSampleDocs(prev => [newDoc, ...prev]);
  };

  const handleSendMessage = async (queryText) => {
    if (!queryText || isLoading) return;

    // Append user question
    setMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    setIsLoading(true);

    try {
      const docId = activeDoc ? activeDoc.doc_id : 'demo_nda';
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          doc_id: docId,
          mode: mode
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI Legal Assistant API');
      }

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: data.answer,
          citations: data.citations || [],
          confidence: data.confidence || 0.94,
          riskLevel: data.risk_level || 'MEDIUM'
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: `Unable to connect to backend server. Please verify FastAPI is running.`,
          citations: [],
          confidence: 0.5,
          riskLevel: 'HIGH'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        mode={mode}
        setMode={setMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CleanHome
          sampleDocs={sampleDocs}
          activeDoc={activeDoc}
          onSelectDoc={handleSelectDoc}
          onUploadSuccess={handleUploadSuccess}
          mode={mode}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-700">
          LegalBuddy — AI Legal Assistant & Document Intelligence
        </div>
        <p className="text-[11px] text-slate-400">
          Legal decision-support engine powered by RAG & Gemini AI. Does not constitute formal legal representation.
        </p>
      </footer>

    </div>
  );
}

