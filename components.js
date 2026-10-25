(function () {
  'use strict';

  const components = [
    { type: 'header', name: 'Header', category: 'Navigation', desc: 'Logo, navigation links, and action button.', icon: '🧭' },
    { type: 'hero', name: 'Hero', category: 'Conversion', desc: 'High-impact headline, subtext, CTA, and visual.', icon: '✨' },
    { type: 'text', name: 'Text Section', category: 'Content', desc: 'Clean typography layout for narrative content.', icon: '📝' },
    { type: 'split', name: 'Split Content', category: 'Content', desc: 'Side-by-side image and descriptive text.', icon: '🖼️' },
    { type: 'features', name: 'Features Grid', category: 'Content', desc: 'A grid highlighting your product benefits.', icon: '⚡' },
    { type: 'testimonial', name: 'Testimonial', category: 'Social Proof', desc: 'A customer quote and attribution.', icon: '💬' },
    { type: 'pricing', name: 'Pricing Tiers', category: 'Conversion', desc: 'Plans and pricing for your customers.', icon: '💳' },
    { type: 'contact', name: 'Contact Form', category: 'Conversion', desc: 'A section to invite customer inquiries.', icon: '✉️' },
    { type: 'cta', name: 'Call to Action', category: 'Conversion', desc: 'A focused prompt for the next step.', icon: '🎯' },
    { type: 'footer', name: 'Footer', category: 'Navigation', desc: 'Links and copyright information.', icon: '📌' }
  ];

  const grid = document.getElementById('componentsGrid');
  const searchInput = document.getElementById('searchInput');
  const toast = document.getElementById('toast');
  let currentCategory = 'All';
  let toastTimer;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function renderCards() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = components.filter((component) => {
      const matchesSearch = `${component.name} ${component.desc}`.toLowerCase().includes(query);
      const matchesCategory = currentCategory === 'All' || component.category === currentCategory;
      return matchesSearch && matchesCategory;
    });
    grid.replaceChildren();

    if (filtered.length === 0) {
      grid.append(element('p', 'col-span-full py-12 text-center text-slate-400', 'No components match your search.'));
      return;
    }

    filtered.forEach((component) => {
      const card = element('article', 'bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col justify-between hover:border-blue-500 transition group');
      const details = document.createElement('div');
      const meta = element('div', 'flex items-center justify-between mb-3');
      meta.append(element('span', 'text-3xl', component.icon), element('span', 'text-xs bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full', component.category));
      details.append(meta, element('h2', 'text-lg font-semibold text-white group-hover:text-blue-400 transition', component.name));
      details.append(element('p', 'text-slate-400 text-sm mt-1', component.desc));

      const footer = element('div', 'mt-6 pt-4 border-t border-slate-700/60 flex justify-between items-center');
      footer.append(element('span', 'text-xs text-slate-500 font-mono', `type: ${component.type}`));
      const addButton = element('button', 'bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-medium transition shadow', '+ Add to Page');
      addButton.type = 'button';
      addButton.dataset.addType = component.type;
      footer.append(addButton);
      card.append(details, footer);
      grid.append(card);
    });
  }

  function showError(message) {
    toast.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3200);
  }

  function addComponent(type) {
    try {
      const stored = JSON.parse(localStorage.getItem('pending_blocks') || '[]');
      const pending = Array.isArray(stored) ? stored : [];
      pending.push(type);
      localStorage.setItem('pending_blocks', JSON.stringify(pending));
      window.location.href = `builder.html?added=${encodeURIComponent(type)}`;
    } catch (error) {
      showError('Could not save this component. Enable browser storage and try again.');
    }
  }

  searchInput.addEventListener('input', renderCards);
  document.getElementById('categoryFilters').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    currentCategory = button.dataset.category;
    document.querySelectorAll('.cat-btn').forEach((categoryButton) => {
      const active = categoryButton === button;
      categoryButton.setAttribute('aria-pressed', String(active));
      categoryButton.className = active
        ? 'cat-btn px-4 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white transition'
        : 'cat-btn px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition';
    });
    renderCards();
  });
  grid.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-add-type]');
    if (button) addComponent(button.dataset.addType);
  });

  renderCards();
})();