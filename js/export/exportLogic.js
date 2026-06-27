// Generated module
import { store } from '../state/store.js';

function toggleExportUnit(id, el) {
  const chk = document.getElementById('chk-' + id);
  if (store.state.selectedExportIds.has(id)) {
    store.state.selectedExportIds.delete(id);
    if (chk) chk.checked = false;
    if (el) el.classList.remove('selected');
  } else {
    store.state.selectedExportIds.add(id);
    if (chk) chk.checked = true;
    if (el) el.classList.add('selected');
  }
  updateSelectedCount();
}

function selectAllExport() {
  document.querySelectorAll('.export-unit').forEach(el => {
    const chk = el.querySelector('.export-checkbox');
    const id = chk.id.replace('chk-', '');
    store.state.selectedExportIds.add(id);
    chk.checked = true;
    el.classList.add('selected');
  });
  updateSelectedCount();
}

function clearExport() {
  store.state.selectedExportIds.clear();
  document.querySelectorAll('.export-unit').forEach(el => {
    el.querySelector('.export-checkbox').checked = false;
    el.classList.remove('selected');
  });
  updateSelectedCount();
}

function updateSelectedCount() {
  const n = store.state.selectedExportIds.size;
  document.getElementById('selected-count').textContent = `${n} unit${n !== 1 ? 's' : ''} selected`;
}


export { toggleExportUnit, selectAllExport, clearExport, updateSelectedCount };
