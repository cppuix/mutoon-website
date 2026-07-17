// js/events.js
import { store } from './state/store.js';
import { handleSearch } from './ui/search.js';
import { setMode, updateLens } from './state/actions.js';
import { clearExport, selectAllExport } from './export/exportLogic.js';
import { updateCustomizePreview } from './ui/customize.js';
import { handleDownload } from './export/download.js';
import { toggleBookmark, toggleBookmarksPanel } from './ui/bookmarks.js';
import { updateReadingProgressBar } from './utils/progress.js';
import { showArchive, showPage } from './navigation/router.js';

let scrollTimeout;

function bindEvents() {
  document.querySelectorAll('[data-nav="home"]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); showPage('home'); });
  });
  document.querySelectorAll('[data-nav="reader"]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); showPage('reader'); });
  });

  const topbarLogo = document.querySelector('.topbar-logo');
  if (topbarLogo) {
    topbarLogo.addEventListener('click', e => { e.preventDefault(); showPage('home'); });
  }

  const backButton = document.getElementById('btn-back-to-archive');
  if (backButton) {
    backButton.addEventListener('click', () => showArchive(store.state.currentArchive));
  }

  const searchInput = document.getElementById('global-search');
  const searchResults = document.getElementById('search-results');
  if (searchInput) {
    searchInput.addEventListener('input', function() { handleSearch(this.value); });
    searchInput.addEventListener('focus', function() { if (this.value.trim().length >= 2) handleSearch(this.value); });
  }
  if (searchResults) {
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.search-wrap')) {
        searchResults.classList.remove('active');
      }
    });
  }

  const readButton = document.getElementById('btn-read');
  const exportButton = document.getElementById('btn-export');
  if (readButton) readButton.addEventListener('click', () => setMode('reading'));
  if (exportButton) exportButton.addEventListener('click', () => setMode('export'));

  const lensSelect = document.getElementById('lens-select');
  if (lensSelect) {
    lensSelect.addEventListener('change', function() { updateLens(this.value); });
  }

  const selectAllButton = document.getElementById('btn-select-all');
  const clearExportButton = document.getElementById('btn-clear-export');
  const customizeButton = document.getElementById('btn-proceed-customize');
  if (selectAllButton) selectAllButton.addEventListener('click', selectAllExport);
  if (clearExportButton) clearExportButton.addEventListener('click', clearExport);
  if (customizeButton) customizeButton.addEventListener('click', () => showPage('customize'));

  const bookmarkToggleButton = document.getElementById('bookmark-toggle-btn');
  const bookmarksPanelButton = document.getElementById('btn-bookmarks-panel');
  const bookmarksCloseButton = document.getElementById('btn-bookmarks-close');
  const bookmarksOverlay = document.getElementById('bookmarks-overlay');
  if (bookmarkToggleButton) bookmarkToggleButton.addEventListener('click', toggleBookmark);
  if (bookmarksPanelButton) bookmarksPanelButton.addEventListener('click', () => toggleBookmarksPanel());
  if (bookmarksCloseButton) bookmarksCloseButton.addEventListener('click', () => toggleBookmarksPanel(false));
  if (bookmarksOverlay) bookmarksOverlay.addEventListener('click', () => toggleBookmarksPanel(false));

  document.querySelectorAll('#layout-options input, #footnote-options input').forEach(radio => {
    radio.addEventListener('change', async () => {
      await updateCustomizePreview();
    });
  });

  const downloadButton = document.getElementById('btn-download');
  if (downloadButton) downloadButton.addEventListener('click', handleDownload);

  window.addEventListener('scroll', () => {
    const readerPage = document.getElementById('page-reader');
    if (readerPage?.classList.contains('active')) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateReadingProgressBar, 100);
    }
  }, { passive: true });

  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      toggleBookmarksPanel();
    }
    if (e.key === 'Escape') {
      if (document.getElementById('bookmarks-panel')?.classList.contains('open')) toggleBookmarksPanel(false);
      searchResults?.classList.remove('active');
    }
  });
}

export { bindEvents };