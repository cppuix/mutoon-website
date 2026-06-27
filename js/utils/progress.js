// Generated module
import { store } from '../state/store.js';
import { saveReadingProgress } from '../utils/storage.js';

let scrollTimeout;
function updateReadingProgressBar() {
  const readerBody = document.querySelector('.reader-body');
  if (!readerBody || !store.state.currentText) return;

  const bodyTop = readerBody.getBoundingClientRect().top + window.scrollY;
  const bodyHeight = readerBody.scrollHeight;
  const scrolled = Math.max(0, window.scrollY - bodyTop + window.innerHeight * 0.3);
  let progress = Math.min(100, Math.round((scrolled / bodyHeight) * 100));
  progress = Math.max(0, progress);

  document.getElementById('reading-progress-bar').style.width = progress + '%';
  saveReadingProgress(store.state.currentText.id, progress);
}


export { updateReadingProgressBar };
