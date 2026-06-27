// Generated module
import { store } from '../state/store.js';
import { getBookmarks, saveBookmarks } from '../utils/storage.js';
import { showToast } from '../utils/dom.js';
import { openReader } from '../navigation/router.js';

function toggleBookmark() {
  if (!store.state.currentText) return;
  const bookmarks = getBookmarks();
  const existing = bookmarks.findIndex(b => b.textId === store.state.currentText.id && b.archive === store.state.currentArchive);

  if (existing >= 0) {
    bookmarks.splice(existing, 1);
    showToast('Bookmark removed');
  } else {
    bookmarks.push({
      textId: store.state.currentText.id,
      archive: store.state.currentArchive,
      nameEn: store.state.currentText.nameEn,
      nameAr: store.state.currentText.nameAr,
      author: store.state.currentText.author,
      date: new Date().toISOString()
    });
    showToast('Bookmark added ✓');
  }

  saveBookmarks(bookmarks);
  updateBookmarkButton(store.state.currentText.id);
  renderBookmarksList();
}

function updateBookmarkButton(textId) {
  const bookmarks = getBookmarks();
  const isBookmarked = bookmarks.some(b => b.textId === textId);
  const btn = document.getElementById('bookmark-toggle-btn');
  btn.textContent = isBookmarked ? '★ Bookmarked' : '☆ Bookmark';
  btn.classList.toggle('active', isBookmarked);
}

function toggleBookmarksPanel(forceState) {
  const panel = document.getElementById('bookmarks-panel');
  const overlay = document.getElementById('bookmarks-overlay');
  const shouldOpen = forceState !== undefined ? forceState : !panel.classList.contains('open');

  if (shouldOpen) {
    panel.classList.add('open');
    overlay.classList.add('active');
    renderBookmarksList();
  } else {
    panel.classList.remove('open');
    overlay.classList.remove('active');
  }
}

function renderBookmarksList() {
  const list = document.getElementById('bookmarks-list');
  const bookmarks = getBookmarks();

  if (bookmarks.length === 0) {
    list.innerHTML = '<div class="bookmarks-empty">No bookmarks yet. Bookmark a text while reading.</div>';
    return;
  }

  list.innerHTML = bookmarks.map(b => `
    <div class="bookmark-item" data-archive="${b.archive}" data-text-id="${b.textId}">
      <div class="bm-name">${b.nameEn}</div>
      <div class="bm-meta">${b.nameAr} — ${b.author}</div>
      <div class="bm-date">${new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
    </div>
  `).join('');

  list.querySelectorAll('.bookmark-item').forEach(item => {
    item.addEventListener('click', function() {
      openReader(this.dataset.archive, this.dataset.textId);
      toggleBookmarksPanel(false);
    });
  });
}

export { toggleBookmark, updateBookmarkButton, toggleBookmarksPanel, renderBookmarksList };
