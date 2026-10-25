import React, { useState } from 'react';

// --- FULL AVAILABLE COMPONENTS DEFINITIONS ---
export const AVAILABLE_COMPONENTS = [
  { type: 'header', name: 'Header', category: 'Navigation', desc: 'Logo, navigation links, and action button.', icon: '🧭' },
  { type: 'hero', name: 'Hero', category: 'Conversion', desc: 'High-impact headline, subtext, CTA, and visual.', icon: '✨' },
  { type: 'text', name: 'Text Section', category: 'Content', desc: 'Clean typography layout for narrative content.', icon: '📝' },
  { type: 'split', name: 'Split Content', category: 'Content', desc: 'Side-by-side image and descriptive text.', icon: '🖼️' },
  { type: 'features', name: 'Features Grid', category: 'Content', desc: '3-column grid with icons highlighting key benefits.', icon: '⚡' },
  { type: 'testimonial', name: 'Testimonial', category: 'Social Proof', desc: 'Customer quote, avatar, and attribution.', icon: '💬' },
  { type: 'pricing', name: 'Pricing Tiers', category: 'Conversion', desc: '3-tier pricing cards with feature lists.', icon: '💳' },
  { type: 'contact', name: 'Contact Form', category: 'Conversion', desc: 'Lead generation form with inputs and submit button.', icon: '✉️' },
  { type: 'cta', name: 'Call to Action', category: 'Conversion', desc: 'Centered final push section to drive conversions.', icon: '🎯' },
  { type: 'footer', name: 'Footer', category: 'Navigation', desc: 'Multi-column site links and copyright notice.', icon: '📌' },
];

export default function ComponentsLibrary({ onAddComponent, onBackToBuilder }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Navigation', 'Content', 'Conversion', 'Social Proof'];

  const filteredComponents = AVAILABLE_COMPONENTS.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          comp.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || comp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-8 py-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBackToBuilder}
            className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition">
            ← Back to Builder
          </button>
          <h1 className="font-bold text-lg text-white">Component Library</h1>
        </div>
        <div className="text-xs text-slate-400 font-mono">10 Available Blocks</div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold">Browse & Add Components</h2>
            <p className="text-slate-400 text-sm mt-1">Select polished sections to inject directly into your client's active workspace.</p>
          </div>
          
          <input 
            type="text" 
            placeholder="Search components..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm w-72 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map(comp => (
            <div key={comp.type} className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col justify-between hover:border-blue-500 transition group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{comp.icon}</span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full">{comp.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition">{comp.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{comp.desc}</p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-700/60 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-mono">type: {comp.type}</span>
                <button 
                  onClick={() => {
                    onAddComponent(comp.type);
                    onBackToBuilder();
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-medium transition shadow">
                  + Add to Page
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}