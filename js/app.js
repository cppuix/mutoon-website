// Entry point – initialisation
import { loadData } from './data/dataLoader.js';
import { bindEvents } from './events.js';
import { showToast } from './utils/dom.js';
import { renderBookmarksList } from './ui/bookmarks.js';
import { store } from './state/store.js';

async function init() {
  const loaded = await loadData();
  if (!loaded) {
    showToast('Using embedded demo texts — add mutoon-data.json for more content');
  }
  bindEvents();
  renderBookmarksList();
}
init();
