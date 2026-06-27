// Generated module
import { store } from '../state/store.js';
import { getReadingProgress } from '../utils/storage.js';
import { renderExportContent, renderReadingContent } from '../ui/reader.js';
import { setMode, updateLens } from '../state/actions.js';
import { toggleBookmarksPanel, updateBookmarkButton } from '../ui/bookmarks.js';
import { updateCustomizePreview } from '../ui/customize.js';

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  const progressBar = document.getElementById('reading-progress-bar');
  if (progressBar) {
    progressBar.style.display = (pageId === 'reader') ? 'block' : 'none';
  }

  if (document.getElementById('bookmarks-panel')?.classList.contains('open')) {
    toggleBookmarksPanel(false);
  }

  if (pageId === 'customize') updateCustomizePreview();
  if (pageId === 'home') {
    const searchInput = document.getElementById('global-search');
    const searchResults = document.getElementById('search-results');
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.classList.remove('active');
  }
}

function showArchive(category) {
  if (!store.state.library?.[category]) return;
  store.state.currentArchive = category;
  const data = store.state.library[category];

  const archiveCategoryLabel = document.getElementById('archive-category-label');
  const archiveTitle = document.getElementById('archive-title');
  const archiveDesc = document.getElementById('archive-desc');
  const list = document.getElementById('archive-list');

  if (archiveCategoryLabel) archiveCategoryLabel.textContent = data.label;
  if (archiveTitle) archiveTitle.textContent = data.title;
  if (archiveDesc) archiveDesc.textContent = data.description || 'Select a text to read or configure for study sheet export';
  if (list) list.innerHTML = '';

  if (!list) return;

  data.texts.forEach(text => {
    const progress = getReadingProgress(text.id);
    const li = document.createElement('li');
    li.className = 'text-item';
    li.setAttribute('role', 'listitem');
    li.setAttribute('tabindex', '0');
    li.innerHTML = `
      <div class="text-item-left">
        <div class="text-name-ar">${text.nameAr}</div>
        <div class="text-name-en">${text.nameEn}</div>
        <div class="text-meta">
          <span class="text-author">${text.author}</span>
          <span class="text-structure-pill">${text.structure}</span>
        </div>
      </div>
      <button class="text-open-btn" aria-label="Open ${text.nameEn}">Open →</button>
      ${progress > 0 ? `<div class="text-progress-bar" style="width:${progress}%"></div>` : ''}
    `;
    li.addEventListener('click', () => openReader(category, text.id));
    li.addEventListener('keydown', e => { if (e.key === 'Enter') openReader(category, text.id); });
    list.appendChild(li);
  });

  showPage('archive');
}

function openReader(category, textId) {
  const data = store.state.library?.[category];
  const text = data?.texts.find(t => t.id === textId);
  if (!text) return;

  store.state.currentText = text;
  store.state.currentMode = 'reading';
  store.state.selectedExportIds.clear();

  const readerBookName = document.getElementById('reader-book-name');
  const readerTitle = document.getElementById('reader-title');
  const readerAuthor = document.getElementById('reader-author');
  if (readerBookName) readerBookName.textContent = text.nameEn;
  if (readerTitle) readerTitle.textContent = text.nameEn;
  if (readerAuthor) readerAuthor.textContent = text.author;

  updateBookmarkButton(textId);
  renderReadingContent(text);
  renderExportContent(text);
  setMode('reading');
  updateLens(store.state.currentLens);
  showPage('reader');

  setTimeout(() => {
    const progress = getReadingProgress(textId);
    if (progress > 0) {
      const readerBody = document.querySelector('.reader-body');
      if (readerBody) {
        const scrollTarget = (progress / 100) * readerBody.scrollHeight;
        window.scrollTo({ top: scrollTarget + readerBody.getBoundingClientRect().top - 100, behavior: 'smooth' });
      }
    }
  }, 300);
}

export { showPage, showArchive, openReader };
