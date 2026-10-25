import React, { useState } from 'react';
import ComponentsLibrary, { AVAILABLE_COMPONENTS } from './ComponentsLibrary';

export default function WebsiteBuilderApp() {
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' or 'library'
  const [blocks, setBlocks] = useState([
    { id: '1', type: 'header', content: { brand: 'Acme', cta: 'Get Started' }, style: { bg: '#ffffff', text: '#0f172a' } },
    { id: '2', type: 'hero', content: { headline: 'Build a site that feels designed', sub: 'Lightweight browser builder.', cta: 'Start Building' }, style: { bg: '#ffffff', text: '#0f172a' } }
  ]);
  const [selectedId, setSelectedId] = useState('2');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      style: { bg: '#ffffff', text: '#0f172a' }
    };
    setBlocks([...blocks, newBlock]);
    setSelectedId(newBlock.id);
    showToast(`Added ${type} block to canvas!`);
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case 'header': return { brand: 'Acme', cta: 'Get Started' };
      case 'hero': return { headline: 'Catchy headline that converts', sub: 'Explain your value proposition clearly.', cta: 'Get Started' };
      case 'text': return { title: 'A simple text block', body: 'Edit this text in the properties panel.' };
      case 'pricing': return { title: 'Simple Pricing', sub: 'No hidden fees.' };
      case 'footer': return { brand: 'Acme', copyright: '© 2026 Acme.' };
      default: return { title: 'New Section', body: 'Customize this content.' };
    }
  };

  // IF USER IS ON THE COMPONENT LIBRARY PAGE
  if (activeTab === 'library') {
    return (
      <ComponentsLibrary 
        onAddComponent={addBlock} 
        onBackToBuilder={() => setActiveTab('builder')} 
      />
    );
  }

  // OTHERWISE, SHOW THE MAIN BUILDER WORKSPACE
  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}

      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
        <h1 className="font-bold text-lg text-white">🚀 ClientSite Builder</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveTab('library')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition">
            📂 Open Full Component Library
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-slate-950 p-8 overflow-y-auto flex justify-center">
          <div className="w-full max-w-3xl bg-white text-slate-900 shadow-xl rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-bold">Active Canvas Preview</h2>
            {blocks.map(b => (
              <div 
                key={b.id} 
                onClick={() => setSelectedId(b.id)}
                className={`p-6 border rounded-lg cursor-pointer ${selectedId === b.id ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200'}`}>
                <h3 className="font-bold uppercase text-xs text-blue-600">{b.type} block</h3>
                <p className="text-lg font-semibold mt-1">{b.content.headline || b.content.title || b.content.brand || 'Section Content'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}