// Generated module
import { store } from '../state/store.js';
import { updateSelectedCount } from '../export/exportLogic.js';

function setMode(mode) {
  store.state.currentMode = mode;
  document.getElementById('reading-mode').style.display = mode === 'reading' ? 'block' : 'none';
  document.getElementById('export-mode').style.display = mode === 'export' ? 'block' : 'none';
  document.getElementById('btn-read').classList.toggle('active', mode === 'reading');
  document.getElementById('btn-export').classList.toggle('active', mode === 'export');
  if (mode === 'export') updateSelectedCount();
}

function updateLens(value) {
  store.state.currentLens = value;
  applyLens(value);
}

function applyLens(value) {
  document.querySelectorAll('[data-lens]').forEach(el => {
    const lens = el.getAttribute('data-lens');
    if (value === 'both') {
      el.style.display = '';
    } else {
      el.style.display = (lens === value) ? '' : 'none';
    }
  });
}

export { setMode, updateLens, applyLens };
