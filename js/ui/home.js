// Generated module
import { store } from '../state/store.js';
import { showArchive } from '../navigation/router.js';

function buildHomeCategories() {
  const grid = document.getElementById('category-grid');
  if (!grid) return;
  grid.innerHTML = '';

  for (const [key, data] of Object.entries(store.state.library || {})) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <span class="card-icon" aria-hidden="true">${data.icon || '📖'}</span>
      <p class="card-title">${data.label}</p>
      <p class="card-subtitle">${data.description || ''}</p>
      <div class="card-footer">
        <span class="card-count">${data.texts.length} text${data.texts.length !== 1 ? 's' : ''}</span>
        <span class="card-arrow" aria-hidden="true">→</span>
      </div>
    `;
    card.addEventListener('click', () => showArchive(key));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') showArchive(key); });
    grid.appendChild(card);
  }
}

export { buildHomeCategories };
