(function () {
  'use strict';

  const STORAGE_KEY = 'whipItShipIt.blocks';
  const PENDING_KEY = 'pending_blocks';
  const defaults = {
    header: { brand: 'Acme', cta: 'Get started' },
    hero: { headline: 'Build a site that feels designed', sub: 'A clear, confident introduction to your product.', cta: 'Start building' },
    text: { title: 'A simple text section', body: 'Tell visitors what makes your product useful.' },
    split: { title: 'A closer look', body: 'Pair a useful detail with a short explanation.' },
    features: { title: 'Everything you need', body: 'Show the benefits that matter most to your customers.' },
    testimonial: { title: 'Loved by teams', body: '“This made it easy to get our new site up and running.”' },
    pricing: { title: 'Simple pricing', body: 'Choose the plan that fits your team.' },
    contact: { title: 'Let’s talk', body: 'Send us a note and we’ll be in touch.' },
    cta: { title: 'Ready to get started?', body: 'Take the next step with us.', cta: 'Get started' },
    footer: { brand: 'Acme', copyright: '© 2026 Acme. All rights reserved.' }
  };

  const blockNames = {
    header: 'Header', hero: 'Hero', text: 'Text section', split: 'Split content',
    features: 'Features', testimonial: 'Testimonial', pricing: 'Pricing',
    contact: 'Contact', cta: 'Call to action', footer: 'Footer'
  };

  const colors = { bg: '#ffffff', text: '#202522' };
  const elements = {
    list: document.getElementById('blockList'),
    preview: document.getElementById('sitePreview'),
    form: document.getElementById('propertiesForm'),
    heading: document.getElementById('propertiesTitle'),
    type: document.getElementById('selectedType'),
    empty: document.getElementById('emptyProperties'),
    count: document.getElementById('blockCount'),
    toast: document.getElementById('toast'),
    save: document.getElementById('saveStatus')
  };

  function makeId() {
    return window.crypto && typeof window.crypto.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function makeBlock(type) {
    const content = defaults[type] || { title: 'New section', body: 'Add a description for this section.' };
    return { id: makeId(), type, content: { ...content }, style: { ...colors } };
  }

  function readBlocks() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) {
        return saved.filter((block) => block && typeof block === 'object' && typeof block.type === 'string')
          .map((block) => ({
            id: String(block.id || makeId()),
            type: block.type,
            content: { ...(defaults[block.type] || {}), ...(block.content || {}) },
            style: { ...colors, ...(block.style || {}) }
          }));
      }
    } catch (error) {
      console.warn('Could not read saved page data.', error);
    }
    return [makeBlock('header'), makeBlock('hero')];
  }

  let blocks = readBlocks();
  let selectedId = blocks[blocks.length - 1]?.id || '';
  let toastTimer;

  function saveBlocks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
      elements.save.textContent = 'Saved locally';
    } catch (error) {
      elements.save.textContent = 'Could not save';
      console.warn('Could not save page data.', error);
    }
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elements.toast.classList.remove('visible'), 2600);
  }

  function addPendingBlocks() {
    try {
      const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
      if (!Array.isArray(pending) || pending.length === 0) return;

      pending.forEach((item) => {
        const type = typeof item === 'string' ? item : item && item.type;
        if (typeof type === 'string') blocks.push(makeBlock(type));
      });
      localStorage.removeItem(PENDING_KEY);
      selectedId = blocks[blocks.length - 1]?.id || '';
      saveBlocks();
      showToast('Component added to your page');
    } catch (error) {
      console.warn('Could not load pending components.', error);
    }
  }
  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function downloadFile(contents, mimeType, filename) {
    const url = URL.createObjectURL(new Blob([contents], { type: mimeType }));
    const link = makeElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportToJSON() {
    downloadFile(JSON.stringify(blocks, null, 2), 'application/json', 'site-config.json');
    showToast('JSON configuration exported');
  }

  function exportToHTML() {
    const pageStyles = `*{box-sizing:border-box}body{margin:0;color:#202522;font:16px Arial,sans-serif;line-height:1.6}.preview-section{padding:36px clamp(20px,6vw,64px);border-bottom:1px solid rgba(32,37,34,.08);overflow-wrap:anywhere}.preview-section:last-child{border-bottom:0}.preview-header{min-height:62px;padding-top:17px;padding-bottom:17px}.preview-header-row{display:flex;align-items:center;justify-content:space-between;gap:16px}.preview-brand{font-size:17px;font-weight:800}.preview-cta{display:inline-block;margin-top:14px;padding:8px 13px;color:#fff;background:#245b4d;border-radius:4px;font-size:11px;font-weight:700}.preview-hero{padding-top:clamp(48px,9vw,92px);padding-bottom:clamp(48px,9vw,92px)}.preview-hero h2{max-width:620px;font-size:clamp(30px,4vw,53px);line-height:1.06}.preview-section h2{margin:0 0 12px;font-size:clamp(24px,3vw,37px);line-height:1.14}.preview-section p{max-width:620px;margin:0;opacity:.72;font-size:14px;line-height:1.7}.preview-section .preview-cta{margin-top:22px}.preview-eyebrow{margin-bottom:13px;color:#e9795d;font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.preview-testimonial{text-align:center}.preview-testimonial p{margin-right:auto;margin-left:auto}.preview-pricing{background-image:linear-gradient(90deg,transparent 32.9%,rgba(32,37,34,.07) 33%,transparent 33.1%,transparent 66.2%,rgba(32,37,34,.07) 66.3%,transparent 66.4%)}.preview-empty{display:grid;min-height:330px;place-items:center;padding:35px;color:#747b75;text-align:center}.preview-empty strong{display:block;margin-bottom:8px;color:#202522;font-size:19px}`;
    const fullDocument = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My website</title><style>${pageStyles}</style></head><body>${elements.preview.innerHTML}</body></html>`;
    downloadFile(fullDocument, 'text/html', 'my-website.html');
    showToast('HTML page exported');
  }
  function getTitle(block) {
    const content = block.content || {};
    return content.headline || content.title || content.brand || blockNames[block.type] || 'New section';
  }

  function renderPreview() {
    elements.preview.replaceChildren();
    if (blocks.length === 0) {
      const empty = makeElement('div', 'preview-empty');
      const message = makeElement('div');
      message.append(makeElement('strong', '', 'Your page is ready for a first section'), document.createTextNode('Browse components to add a header, hero, and more.'));
      empty.append(message);
      elements.preview.append(empty);
      return;
    }

    blocks.forEach((block) => {
      const section = makeElement('section', `preview-section preview-${block.type}`);
      section.style.backgroundColor = block.style?.bg || colors.bg;
      section.style.color = block.style?.text || colors.text;

      if (block.type === 'header') {
        const row = makeElement('div', 'preview-header-row');
        row.append(makeElement('span', 'preview-brand', block.content.brand || 'Your brand'));
        row.append(makeElement('span', 'preview-cta', block.content.cta || 'Get started'));
        section.append(row);
      } else {
        if (block.type === 'hero') section.append(makeElement('p', 'preview-eyebrow', 'Made for what comes next'));
        section.append(makeElement('h2', '', getTitle(block)));
        const body = block.content.sub || block.content.body || block.content.copyright || '';
        if (body) section.append(makeElement('p', '', body));
        if (block.content.cta) section.append(makeElement('span', 'preview-cta', block.content.cta));
      }

      elements.preview.append(section);
    });
  }

  function makeAction(label, action, id, disabled, className) {
    const button = makeElement('button', `layer-action ${className || ''}`, label);
    button.type = 'button';
    button.dataset.action = action;
    button.dataset.id = id;
    button.disabled = Boolean(disabled);
    button.setAttribute('aria-label', `${action} section`);
    return button;
  }

  function renderLayers() {
    elements.list.replaceChildren();
    blocks.forEach((block, index) => {
      const item = makeElement('li', `layer-item${block.id === selectedId ? ' selected' : ''}`);
      const select = makeElement('button', 'layer-select');
      select.type = 'button';
      select.dataset.action = 'select';
      select.dataset.id = block.id;
      select.setAttribute('aria-pressed', String(block.id === selectedId));
      select.append(makeElement('span', 'layer-number', String(index + 1)), makeElement('span', 'layer-label', getTitle(block)));

      const actions = makeElement('span', 'layer-actions');
      actions.append(
        makeAction('↑', 'up', block.id, index === 0),
        makeAction('↓', 'down', block.id, index === blocks.length - 1),
        makeAction('×', 'remove', block.id, false, 'remove')
      );
      item.append(select, actions);
      elements.list.append(item);
    });
    elements.count.textContent = `${blocks.length} ${blocks.length === 1 ? 'section' : 'sections'}`;
  }

  function makeField(labelText, key, value, type, group) {
    const label = makeElement('label', 'field');
    label.append(makeElement('span', 'field-label', labelText));
    const input = makeElement(type === 'textarea' ? 'textarea' : 'input');
    if (type !== 'textarea') input.type = type || 'text';
    input.name = key;
    input.dataset[group === 'style' ? 'styleKey' : 'contentKey'] = key;
    input.value = value ?? '';
    input.setAttribute('aria-label', labelText);
    label.append(input);
    return label;
  }

  function renderProperties() {
    const block = blocks.find((item) => item.id === selectedId);
    elements.form.replaceChildren();
    elements.empty.hidden = Boolean(block);
    elements.form.hidden = !block;
    elements.type.hidden = !block;
    if (!block) {
      elements.heading.textContent = 'Content';
      return;
    }

    elements.heading.textContent = blockNames[block.type] || 'Content';
    elements.type.textContent = block.type.toUpperCase();
    Object.entries(block.content || {}).forEach(([key, value]) => {
      if (typeof value !== 'string') return;
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
      const useTextarea = value.length > 55 || key === 'body' || key === 'sub';
      elements.form.append(makeField(label, key, value, useTextarea ? 'textarea' : 'text', 'content'));
    });
    elements.form.append(
      makeField('Background', 'bg', block.style.bg, 'color', 'style'),
      makeField('Text color', 'text', block.style.text, 'color', 'style')
    );
  }

  function render() {
    renderLayers();
    renderPreview();
    renderProperties();
  }

  elements.list.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button || button.disabled) return;
    const { action, id } = button.dataset;
    const index = blocks.findIndex((block) => block.id === id);
    if (index < 0) return;

    if (action === 'select') {
      selectedId = id;
    } else if (action === 'remove') {
      blocks.splice(index, 1);
      selectedId = blocks[Math.min(index, blocks.length - 1)]?.id || '';
      saveBlocks();
    } else if (action === 'up' || action === 'down') {
      const nextIndex = action === 'up' ? index - 1 : index + 1;
      [blocks[index], blocks[nextIndex]] = [blocks[nextIndex], blocks[index]];
      selectedId = id;
      saveBlocks();
    }
    render();
  });

  elements.form.addEventListener('input', (event) => {
    const field = event.target;
    const block = blocks.find((item) => item.id === selectedId);
    if (!block) return;
    if (field.dataset.contentKey) block.content[field.dataset.contentKey] = field.value;
    if (field.dataset.styleKey) block.style[field.dataset.styleKey] = field.value;
    renderPreview();
    renderLayers();
    saveBlocks();
  });

  document.getElementById('exportHTMLButton').addEventListener('click', exportToHTML);
  document.getElementById('exportJSONButton').addEventListener('click', exportToJSON);

  addPendingBlocks();
  render();
  saveBlocks();

  const addedType = new URLSearchParams(window.location.search).get('added');
  if (addedType) showToast(`${blockNames[addedType] || 'Component'} added to your page`);
})();