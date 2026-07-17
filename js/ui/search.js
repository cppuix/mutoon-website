// Generated module
import { store } from '../state/store.js';
import { escapeHtml, showToast } from '../utils/dom.js';
import { openReader } from '../navigation/router.js';

function handleSearch(query) {
  const resultsContainer = document.getElementById('search-results');
  if (!query.trim() || query.trim().length < 2) {
    resultsContainer.classList.remove('active');
    resultsContainer.innerHTML = '';
    return;
  }

  const q = query.toLowerCase().trim();
  const results = [];

  for (const [cat, data] of Object.entries(store.state.library)) {
    for (const text of data.texts) {
      let score = 0;
      if (text.nameEn.toLowerCase() === q) score += 100;
      if (text.nameAr.includes(query)) score += 100;
      if (text.nameEn.toLowerCase().includes(q)) score += 50;
      if (text.author.toLowerCase().includes(q)) score += 40;
      if (text.keywords && text.keywords.some(k => k.toLowerCase().includes(q))) score += 30;
      if (data.label.toLowerCase().includes(q)) score += 10;
      if (data.description && data.description.toLowerCase().includes(q)) score += 5;
      if (score > 0) results.push({ text, category: cat, data, score });
    }
  }

  results.sort((a, b) => b.score - a.score);

  if (results.length === 0) {
    resultsContainer.innerHTML = `<div class="search-no-results">No texts found matching "${escapeHtml(query)}"</div>`;
  } else {
    resultsContainer.innerHTML = results.slice(0, 8).map(r => `
      <div class="search-result-item" data-category="${r.category}" data-text-id="${r.text.id}">
        <div class="sr-name">${r.text.nameEn}</div>
        <div class="sr-author">${r.text.nameAr} — ${r.text.author}</div>
        <div class="sr-category">${r.data.label}</div>
      </div>
    `).join('');

    resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', function() {
        openReader(this.dataset.category, this.dataset.textId);
        resultsContainer.classList.remove('active');
        document.getElementById('global-search').value = '';
      });
    });
  }

  resultsContainer.classList.add('active');
}

export { handleSearch };
