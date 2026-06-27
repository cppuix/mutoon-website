// Generated module

function getBookmarks() {
  try { return JSON.parse(localStorage.getItem('mutoon_bookmarks') || '[]'); }
  catch { return []; }
}
function saveBookmarks(bookmarks) {
  localStorage.setItem('mutoon_bookmarks', JSON.stringify(bookmarks));
}
function getReadingProgress(textId) {
  try { return JSON.parse(localStorage.getItem('mutoon_progress_' + textId) || '0'); }
  catch { return 0; }
}
function saveReadingProgress(textId, progress) {
  localStorage.setItem('mutoon_progress_' + textId, JSON.stringify(progress));
}


export { getBookmarks, saveBookmarks, getReadingProgress, saveReadingProgress };
