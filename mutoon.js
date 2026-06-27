/* ═══════════════════════════════════════════════════════════
   MUTOON.COM — JavaScript Application
   A digital library for classical Islamic foundational texts.
   Loads data from mutoon-data.json (with embedded fallback).
   ═══════════════════════════════════════════════════════════ */

   SECTION 1: DATA LAYER
   Load library data from external JSON or use embedded fallback.
   ────────────────────────────────────────────────────────── */
let LIBRARY = {};
let DATA_LOADED = false;

async function loadData() {
  try {
    const response = await fetch('./mutoon-data.json');
    if (!response.ok) throw new Error('Failed to load data');
    const data = await response.json();
    LIBRARY = data.categories;
    DATA_LOADED = true;
    buildHomeCategories();
    return true;
  } catch (err) {
    console.warn('Could not load mutoon-data.json, using embedded fallback:', err.message);
    LIBRARY = getFallbackData();
    DATA_LOADED = true;
    buildHomeCategories();
    return false;
  }
}

function getFallbackData() {
  return {
    hadith: {
      label: "Hadith & Mustalah",
      title: "Foundational Texts in Hadith & Mustalah",
      description: "Prophetic narrations, sciences of hadith classification",
      icon: "🔍",
      texts: [
        {
          id: "bayquniyyah",
          nameAr: "الْمَنْظُومَةُ الْبَيْقُونِيَّة",
          nameEn: "Al-Manẓūmah al-Bayqūniyyah",
          author: "Ṭāhā al-Bayqūnī",
          structure: "Classical Rhymed Poetry — 34 Couplets",
          type: "poetry",
          keywords: ["mustalah", "hadith terminology", "poem", "bayquniyyah"],
          content: [
            { lineNum: 1, arabic: "أَبْدَأُ بِالْحَمْدِ مُصَلِّيًا عَلَى\nمُحَمَّدٍ خَيْرِ نَبِيٍّ أُرْسِلَا", english: "I begin with praise, sending blessings upon\nMuhammad, the best of Prophets ever sent.", footnotes: [] },
            { lineNum: 2, arabic: "وَذِي مِنْ أَقْسَامِ الْحَدِيثِ عِدَّةٌ\nوَكُلُّ وَاحِدٍ أَتَى وَحَدَّهُ", english: "And this poem comprises a number of hadith categories,\nAnd each one comes with its definition.", footnotes: [] },
            { lineNum: 3, arabic: "أَوَّلُهَا الصَّحِيحُ وَهُوَ مَا اتَّصَلْ\nإِسْنَادُهُ وَلَمْ يَشُذَّ أَوْ يُعَلّ", english: "The first of them is the Ṣaḥīḥ (Authentic), and it is that whose\nChain is continuous, not anomalous nor defective.", footnotes: [{ text: "Shudhūdh: contradicting more reliable narrators. 'Illah: hidden defect." }] },
            { lineNum: 4, arabic: "يَرْوِيهِ عَدْلٌ ضَابِطٌ عَنْ مِثْلِهِ\nمُعْتَمَدٌ فِي ضَبْطِهِ وَنَقْلِهِ", english: "Narrated by an upright, precise transmitter from one like him,\nReliable in his precision and transmission.", footnotes: [] },
            { lineNum: 5, arabic: "وَالْحَسَنُ الْمَعْرُوفُ طُرْقًا وَغَدَتْ\nرِجَالُهُ لَا كَالصَّحِيحِ اشْتُهِرَتْ", english: "And the Ḥasan (Good) is that whose paths are well-known,\nThough its narrators are not as renowned as those of the Ṣaḥīḥ.", footnotes: [] }
          ]
        },
        {
          id: "nukhbat-al-fikar",
          nameAr: "نُخْبَةُ الْفِكَرِ",
          nameEn: "Nukhbat al-Fikar",
          author: "Ibn Ḥajar al-ʿAsqalānī",
          structure: "Continuous Prose — Hadith Terminology",
          type: "prose_continuous",
          keywords: ["mustalah", "hadith sciences", "ibn hajar"],
          blocks: [
            { id: "nukhba_01", arabic: "أَمَّا بَعْدُ، فَإِنَّ التَّصَانِيفَ فِي اصْطِلَاحِ أَهْلِ الْحَدِيثِ قَدْ كَثُرَتْ.", english: "To proceed: The works on the terminology of the people of hadith have become numerous.", footnotes: [] },
            { id: "nukhba_02", arabic: "فَسَأَلَنِي بَعْضُ الْإِخْوَانِ أَنْ أُلَخِّصَ لَهُمُ الْمُهِمَّ مِنْ ذَلِكَ.", english: "Some of the brothers asked me to summarize for them what is important from that.", footnotes: [{ text: "i.e., from the science of hadith terminology" }] }
          ]
        }
      ]
    },
    aqeedah: {
      label: "ʿAqeedah & Manhaj",
      title: "Foundational Texts in ʿAqeedah & Manhaj",
      description: "Theology, creed, and methodology texts",
      icon: "📖",
      texts: [
        {
          id: "thalaathat-al-usool",
          nameAr: "ثَلَاثَةُ الْأُصُولِ",
          nameEn: "Thalāthat al-Uṣūl",
          author: "Muḥammad ibn ʿAbd al-Wahhāb",
          structure: "Continuous Prose — Fundamentals of Faith",
          type: "prose_continuous",
          keywords: ["tawheed", "monotheism", "fundamentals", "three principles"],
          blocks: [
            { id: "usool_01", arabic: "اعْلَمْ رَحِمَكَ اللَّهُ أَنَّهُ يَجِبُ عَلَيْنَا تَعَلُّمُ أَرْبَعِ مَسَائِلَ.", english: "Know, may Allah have mercy on you, that it is obligatory upon us to learn four matters.", footnotes: [] },
            { id: "usool_02", arabic: "الْأُولَى: الْعِلْمُ؛ وَهُوَ مَعْرِفَةُ اللَّهِ، وَمَعْرِفَةُ نَبِيِّهِ، وَمَعْرِفَةُ دِينِ الْإِسْلَامِ بِالْأَدِلَّةِ.", english: "The first: Knowledge; which is knowing Allah, knowing His Prophet, and knowing the religion of Islam with its evidences.", footnotes: [{ text: "i.e., knowledge of Allah's names, attributes, and actions" }] }
          ]
        }
      ]
    },
    fiqh: {
      label: "Fiqh & Uṣūl",
      title: "Foundational Texts in Jurisprudence & Legal Theory",
      description: "Islamic law, legal maxims, and principles of jurisprudence",
      icon: "⚖️",
      texts: [
        {
          id: "al-waraqat",
          nameAr: "الْوَرَقَات",
          nameEn: "Al-Waraqāt",
          author: "Imām al-Ḥaramayn al-Juwaynī",
          structure: "Continuous Prose — Legal Theory",
          type: "prose_continuous",
          keywords: ["usul al-fiqh", "legal theory", "principles"],
          blocks: [
            { id: "waraqat_01", arabic: "هَذِهِ وَرَقَاتٌ تَشْتَمِلُ عَلَى مَعْرِفَةِ فُصُولٍ مِنْ أُصُولِ الْفِقْهِ.", english: "These are papers encompassing knowledge of chapters from the principles of jurisprudence.", footnotes: [{ text: "Uṣūl: the foundational principles; Fiqh: the derived rulings" }] }
          ]
        }
      ]
    },
    language: {
      label: "Language & Tools",
      title: "Language Sciences & Recitation Tools",
      description: "Arabic grammar, morphology, and tajwīd",
      icon: "🌿",
      texts: [
        {
          id: "al-ajurrumiyyah",
          nameAr: "الْآجُرُّومِيَّة",
          nameEn: "Al-Ājurrūmiyyah",
          author: "Ibn Ājurrūm al-Ṣanhājī",
          structure: "Continuous Prose — Arabic Grammar",
          type: "prose_continuous",
          keywords: ["nahw", "grammar", "arabic", "syntax"],
          blocks: [
            { id: "ajrum_01", arabic: "الْكَلَامُ: هُوَ اللَّفْظُ الْمُرَكَّبُ الْمُفِيدُ بِالْوَضْعِ.", english: "Speech: It is the compounded utterance that conveys a complete meaning according to convention.", footnotes: [{ text: "By convention (bi-l-waḍʿ) meaning: according to the established usage of the Arabs" }] }
          ]
        }
      ]
    }
  };
}

   SECTION 2: STATE MANAGEMENT
   Centralized application state.
   ────────────────────────────────────────────────────────── */
const STATE = {
  currentArchive: null,
  currentText: null,
  currentMode: 'reading',    // 'reading' | 'export'
  currentLens: 'both',       // 'both' | 'arabic' | 'english'
  selectedExportIds: new Set()
};

   SECTION 3: PERSISTENCE (localStorage)
   Bookmarks and reading progress survive page reloads.
   ────────────────────────────────────────────────────────── */
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

   SECTION 4: NAVIGATION
   Page routing: home, archive, reader, customize.
   ────────────────────────────────────────────────────────── */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  const progressBar = document.getElementById('reading-progress-bar');
  progressBar.style.display = (pageId === 'reader') ? 'block' : 'none';

  if (document.getElementById('bookmarks-panel').classList.contains('open')) {
    toggleBookmarksPanel(false);
  }

  if (pageId === 'customize') updateCustomizePreview();
  if (pageId === 'home') {
    document.getElementById('global-search').value = '';
    document.getElementById('search-results').classList.remove('active');
  }
}

function showArchive(category) {
  if (!LIBRARY[category]) return;
  STATE.currentArchive = category;
  const data = LIBRARY[category];

  document.getElementById('archive-category-label').textContent = data.label;
  document.getElementById('archive-title').textContent = data.title;
  document.getElementById('archive-desc').textContent = data.description || 'Select a text to read or configure for study sheet export';

  const list = document.getElementById('archive-list');
  list.innerHTML = '';

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
  const data = LIBRARY[category];
  const text = data.texts.find(t => t.id === textId);
  if (!text) return;

  STATE.currentText = text;
  STATE.currentMode = 'reading';
  STATE.selectedExportIds.clear();

  document.getElementById('reader-book-name').textContent = text.nameEn;
  document.getElementById('reader-title').textContent = text.nameEn;
  document.getElementById('reader-author').textContent = text.author;

  updateBookmarkButton(textId);
  renderReadingContent(text);
  renderExportContent(text);
  setMode('reading');
  updateLens(STATE.currentLens);
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

   SECTION 5: HOME PAGE CATEGORIES
   Build category cards from loaded data.
   ────────────────────────────────────────────────────────── */
function buildHomeCategories() {
  const grid = document.getElementById('category-grid');
  if (!grid) return;
  grid.innerHTML = '';

  for (const [key, data] of Object.entries(LIBRARY)) {
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

   SECTION 6: RENDERING
   Render reading content and export content based on text type.
   ────────────────────────────────────────────────────────── */
function renderReadingContent(text) {
  const container = document.getElementById('reader-content');
  container.innerHTML = '';

  if (text.type === 'poetry') {
    text.content.forEach((unit, i) => {
      const div = document.createElement('div');
      div.className = 'poem-unit';
      div.id = 'unit-' + (i + 1);
      div.innerHTML = `
        <span class="line-number">Line ${unit.lineNum}</span>
        <div class="poem-arabic" data-lens="arabic">${escapeHtml(unit.arabic).replace(/\n/g,'<br>')}</div>
        <div class="poem-translation" data-lens="english">${escapeHtml(unit.english).replace(/\n/g,'<br>')}</div>
        ${renderFootnotes(unit.footnotes)}
      `;
      container.appendChild(div);
    });
  } else if (text.type === 'prose_chaptered') {
    text.chapters.forEach((ch, ci) => {
      const chDiv = document.createElement('div');
      chDiv.id = 'chapter-' + ci;
      const arHead = document.createElement('p');
      arHead.className = 'chapter-heading-ar';
      arHead.setAttribute('data-lens', 'arabic');
      arHead.textContent = ch.titleAr;
      chDiv.appendChild(arHead);
      const enHead = document.createElement('div');
      enHead.className = 'chapter-heading';
      enHead.setAttribute('data-lens', 'english');
      enHead.textContent = ch.titleEn;
      chDiv.appendChild(enHead);
      ch.blocks.forEach((block, bi) => {
        const bDiv = document.createElement('div');
        bDiv.className = 'prose-block';
        bDiv.id = 'block-' + ci + '-' + bi;
        bDiv.innerHTML = `
          <div class="prose-ar" data-lens="arabic">${escapeHtml(block.arabic)}</div>
          <div class="prose-en" data-lens="english">${escapeHtml(block.english)}</div>
          ${renderFootnotes(block.footnotes)}
        `;
        chDiv.appendChild(bDiv);
      });
      container.appendChild(chDiv);
    });
  } else if (text.type === 'prose_continuous') {
    text.blocks.forEach((block, i) => {
      const bDiv = document.createElement('div');
      bDiv.className = 'prose-block';
      bDiv.id = 'block-' + i;
      bDiv.innerHTML = `
        <div class="prose-ar" data-lens="arabic">${escapeHtml(block.arabic)}</div>
        <div class="prose-en" data-lens="english">${escapeHtml(block.english)}</div>
        ${renderFootnotes(block.footnotes)}
      `;
      container.appendChild(bDiv);
    });
  } else if (text.type === 'qa') {
    text.units.forEach((unit, i) => {
      const div = document.createElement('div');
      div.className = 'qa-unit';
      div.id = 'qa-' + i;
      div.innerHTML = `
        <p class="qa-label q">Question ${i + 1}</p>
        <div class="qa-arabic" data-lens="arabic">${escapeHtml(unit.questionAr)}</div>
        <p class="qa-english" data-lens="english">${escapeHtml(unit.questionEn)}</p>
        <hr class="qa-divider">
        <p class="qa-label a">Answer</p>
        <div class="qa-arabic" data-lens="arabic">${escapeHtml(unit.answerAr)}</div>
        <p class="qa-english" data-lens="english">${escapeHtml(unit.answerEn)}</p>
        ${renderFootnotes(unit.footnotes)}
      `;
      container.appendChild(div);
    });
  }

  applyLens(STATE.currentLens);
}

function renderFootnotes(footnotes) {
  if (!footnotes || footnotes.length === 0) return '';
  return footnotes.map((fn, i) =>
    `<span class="prose-footnote-inline" data-lens="english"><sup>${i + 1}</sup> ${escapeHtml(fn.text)}</span>`
  ).join('');
}

function renderExportContent(text) {
  const container = document.getElementById('export-content');
  container.innerHTML = '';

  const units = getExportUnits(text);
  units.forEach(unit => {
    const div = document.createElement('div');
    div.className = 'export-unit';
    div.id = 'export-unit-' + unit.id;
    const isSelected = STATE.selectedExportIds.has(unit.id);
    if (isSelected) div.classList.add('selected');
    div.innerHTML = `
      <div class="export-unit-header">
        <input type="checkbox" class="export-checkbox" id="chk-${unit.id}" aria-label="Select ${unit.label}" ${isSelected ? 'checked' : ''}>
        <span class="export-unit-label">${unit.label}</span>
      </div>
      <div class="export-unit-body">
        <div class="prose-ar" style="font-size:1.1rem;margin-bottom:0.6rem;">${escapeHtml(unit.arabic).replace(/\n/g,'<br>')}</div>
        <div class="prose-en" style="font-style:italic;font-size:0.88rem;">${escapeHtml(unit.english).replace(/\n/g,'<br>')}</div>
      </div>
    `;
    div.querySelector('.export-unit-header').addEventListener('click', function(e) {
      if (e.target.tagName === 'INPUT') return;
      toggleExportUnit(unit.id, div);
    });
    div.querySelector('.export-checkbox').addEventListener('click', function(e) {
      e.stopPropagation();
      toggleExportUnit(unit.id, div);
    });
    container.appendChild(div);
  });
}

function getExportUnits(text) {
  if (text.type === 'poetry') {
    return text.content.map((u, i) => ({
      id: `line_${i + 1}`,
      label: `Line ${u.lineNum}`,
      arabic: u.arabic,
      english: u.english,
      footnotes: u.footnotes || []
    }));
  }
  if (text.type === 'prose_chaptered') {
    return text.chapters.flatMap((ch, ci) => ch.blocks.map((b, bi) => ({
      id: b.id || `block_${ci}_${bi}`,
      label: `${ch.titleEn} — Block ${bi + 1}`,
      arabic: b.arabic,
      english: b.english,
      footnotes: b.footnotes || []
    })));
  }
  if (text.type === 'prose_continuous') {
    return text.blocks.map((b, i) => ({
      id: b.id || `block_${i}`,
      label: `Block ${i + 1}`,
      arabic: b.arabic,
      english: b.english,
      footnotes: b.footnotes || []
    }));
  }
  if (text.type === 'qa') {
    return text.units.map((u, i) => ({
      id: u.id || `qa_${i}`,
      label: `Q&A Unit ${i + 1}`,
      arabic: u.questionAr + '\n' + u.answerAr,
      english: u.questionEn + '\n' + u.answerEn,
      footnotes: u.footnotes || []
    }));
  }
  return [];
}

   SECTION 7: MODE & LENS
   Toggle between reading/export modes and language views.
   ────────────────────────────────────────────────────────── */
function setMode(mode) {
  STATE.currentMode = mode;
  document.getElementById('reading-mode').style.display = mode === 'reading' ? 'block' : 'none';
  document.getElementById('export-mode').style.display = mode === 'export' ? 'block' : 'none';
  document.getElementById('btn-read').classList.toggle('active', mode === 'reading');
  document.getElementById('btn-export').classList.toggle('active', mode === 'export');
  if (mode === 'export') updateSelectedCount();
}

function updateLens(value) {
  STATE.currentLens = value;
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

   SECTION 8: EXPORT SELECTION
   Checkbox logic for selecting units to export.
   ────────────────────────────────────────────────────────── */
function toggleExportUnit(id, el) {
  const chk = document.getElementById('chk-' + id);
  if (STATE.selectedExportIds.has(id)) {
    STATE.selectedExportIds.delete(id);
    if (chk) chk.checked = false;
    if (el) el.classList.remove('selected');
  } else {
    STATE.selectedExportIds.add(id);
    if (chk) chk.checked = true;
    if (el) el.classList.add('selected');
  }
  updateSelectedCount();
}

function selectAllExport() {
  document.querySelectorAll('.export-unit').forEach(el => {
    const chk = el.querySelector('.export-checkbox');
    const id = chk.id.replace('chk-', '');
    STATE.selectedExportIds.add(id);
    chk.checked = true;
    el.classList.add('selected');
  });
  updateSelectedCount();
}

function clearExport() {
  STATE.selectedExportIds.clear();
  document.querySelectorAll('.export-unit').forEach(el => {
    el.querySelector('.export-checkbox').checked = false;
    el.classList.remove('selected');
  });
  updateSelectedCount();
}

function updateSelectedCount() {
  const n = STATE.selectedExportIds.size;
  document.getElementById('selected-count').textContent = `${n} unit${n !== 1 ? 's' : ''} selected`;
}

   SECTION 9: SEARCH
   Relevance-scored search across text names, authors, keywords.
   ────────────────────────────────────────────────────────── */
function handleSearch(query) {
  const resultsContainer = document.getElementById('search-results');
  if (!query.trim() || query.trim().length < 2) {
    resultsContainer.classList.remove('active');
    resultsContainer.innerHTML = '';
    return;
  }

  const q = query.toLowerCase().trim();
  const results = [];

  for (const [cat, data] of Object.entries(LIBRARY)) {
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

   SECTION 10: BOOKMARKS
   Add/remove bookmarks, render bookmarks panel.
   ────────────────────────────────────────────────────────── */
function toggleBookmark() {
  if (!STATE.currentText) return;
  const bookmarks = getBookmarks();
  const existing = bookmarks.findIndex(b => b.textId === STATE.currentText.id && b.archive === STATE.currentArchive);

  if (existing >= 0) {
    bookmarks.splice(existing, 1);
    showToast('Bookmark removed');
  } else {
    bookmarks.push({
      textId: STATE.currentText.id,
      archive: STATE.currentArchive,
      nameEn: STATE.currentText.nameEn,
      nameAr: STATE.currentText.nameAr,
      author: STATE.currentText.author,
      date: new Date().toISOString()
    });
    showToast('Bookmark added ✓');
  }

  saveBookmarks(bookmarks);
  updateBookmarkButton(STATE.currentText.id);
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

   SECTION 11: READING PROGRESS
   Scroll-based progress bar, persisted per text.
   ────────────────────────────────────────────────────────── */
let scrollTimeout;
function updateReadingProgressBar() {
  const readerBody = document.querySelector('.reader-body');
  if (!readerBody || !STATE.currentText) return;

  const bodyTop = readerBody.getBoundingClientRect().top + window.scrollY;
  const bodyHeight = readerBody.scrollHeight;
  const scrolled = Math.max(0, window.scrollY - bodyTop + window.innerHeight * 0.3);
  let progress = Math.min(100, Math.round((scrolled / bodyHeight) * 100));
  progress = Math.max(0, progress);

  document.getElementById('reading-progress-bar').style.width = progress + '%';
  saveReadingProgress(STATE.currentText.id, progress);
}

   SECTION 12: CUSTOMIZE PREVIEW (FIXED)
   Live preview of export layout/footnote choices.
   ────────────────────────────────────────────────────────── */
function updateCustomizePreview() {
  if (!STATE.currentText) {
    document.getElementById('preview-ar').innerHTML = '<em>No text loaded. Go back and open a text first.</em>';
    document.getElementById('preview-en').innerHTML = '';
    return;
  }

  const layout = document.querySelector('input[name="layout"]:checked')?.value || 'parallel';
  const footnotesMode = document.querySelector('input[name="footnotes"]:checked')?.value || 'endnotes';
  const previewBoxTitle = document.getElementById('preview-box-title');
  const previewAr = document.getElementById('preview-ar');
  const previewEn = document.getElementById('preview-en');
  const previewContent = document.getElementById('preview-content');
  const previewEndnotes = document.getElementById('preview-endnotes');

  previewBoxTitle.textContent = STATE.currentText.nameEn + ' — ' + layout.replace('-', ' ');

  const units = getSelectedUnits();
  if (units.length === 0) {
    previewAr.innerHTML = '<em>No units selected. Go back and select units in Export mode.</em>';
    previewEn.innerHTML = '<em>Select units to preview them here.</em>';
    previewEndnotes.style.display = 'none';
    return;
  }

  let footnoteCounter = 0;
  const endnotes = [];

  // ── Build preview HTML based on layout ──
  if (layout === 'parallel') {
    // Parallel: English left, Arabic right
    let arHtml = '',
      enHtml = '';
    units.forEach(unit => {
      const fns = unit.footnotes || [];
      arHtml += `<div>${escapeHtml(unit.arabic).replace(/\n/g, '<br>')}</div>`;
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      if (footnotesMode === 'inline' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          enText +=
            `<br><span class="prose-footnote-inline" style="display:block;font-size:0.8rem;color:#666;margin-top:0.2rem;"><sup>${footnoteCounter}</sup> ${escapeHtml(fn.text)}</span>`;
        });
      } else if (footnotesMode === 'endnotes' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          enText += ` <sup>[${footnoteCounter}]</sup>`;
          endnotes.push({ num: footnoteCounter, text: fn.text });
        });
      }
      enHtml += `<div>${enText}</div>`;
    });

    // Place English in left column, Arabic in right column by setting order
    previewEn.innerHTML = enHtml;
    previewAr.innerHTML = arHtml;
    previewAr.style.order = '2';   // move to right
    previewEn.style.order = '1';   // move to left
    previewAr.style.display = '';
    previewEn.style.display = '';
    previewContent.style.display = 'grid';
    previewContent.style.gridTemplateColumns = '1fr 1fr';
    previewContent.classList.remove('preview-interleaved');

  } else if (layout === 'interleaved') {
    // Interleaved: Arabic then English sequentially
    let combinedHtml = '';
    units.forEach(unit => {
      const fns = unit.footnotes || [];
      combinedHtml +=
        `<div style="margin-bottom:0.8rem;font-family:'Noto Naskh Arabic','Scheherazade New',serif;font-size:1.1rem;line-height:2;text-align:right;direction:rtl;color:#1e2b3c;">${escapeHtml(unit.arabic).replace(/\n/g, '<br>')}</div>`;
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      if (footnotesMode === 'inline' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          enText +=
            `<br><span style="font-size:0.8rem;color:#666;"><sup>${footnoteCounter}</sup> ${escapeHtml(fn.text)}</span>`;
        });
      } else if (footnotesMode === 'endnotes' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          enText += ` <sup>[${footnoteCounter}]</sup>`;
          endnotes.push({ num: footnoteCounter, text: fn.text });
        });
      }
      combinedHtml +=
        `<div style="margin-bottom:1.2rem;font-style:italic;color:#444;padding-left:0.5rem;border-left:3px solid #e5ded4;padding-left:0.8rem;">${enText}</div>`;
    });

    previewAr.innerHTML = combinedHtml;
    previewEn.innerHTML = '';
    previewAr.style.display = '';
    previewEn.style.display = 'none';
    previewContent.style.display = 'block';
    previewContent.style.gridTemplateColumns = '1fr';
    previewContent.classList.add('preview-interleaved');

  } else if (layout === 'arabic-only') {
    let html = '';
    units.forEach(unit => {
      html +=
        `<div style="margin-bottom:1.2rem;font-family:'Noto Naskh Arabic','Scheherazade New',serif;font-size:1.1rem;line-height:2;text-align:right;direction:rtl;">${escapeHtml(unit.arabic).replace(/\n/g, '<br>')}</div>`;
    });
    previewAr.innerHTML = html;
    previewEn.innerHTML = '';
    previewAr.style.display = '';
    previewEn.style.display = 'none';
    previewContent.style.display = 'block';
    previewContent.style.gridTemplateColumns = '1fr';
    previewContent.classList.remove('preview-interleaved');

  } else if (layout === 'english-only') {
    let html = '';
    units.forEach(unit => {
      let txt = escapeHtml(unit.english).replace(/\n/g, '<br>');
      const fns = unit.footnotes || [];
      if (footnotesMode === 'inline' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          txt +=
            `<br><span style="font-size:0.8rem;color:#666;"><sup>${footnoteCounter}</sup> ${escapeHtml(fn.text)}</span>`;
        });
      } else if (footnotesMode === 'endnotes' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          txt += ` <sup>[${footnoteCounter}]</sup>`;
          endnotes.push({ num: footnoteCounter, text: fn.text });
        });
      }
      html += `<div style="margin-bottom:1.2rem;font-style:italic;color:#444;">${txt}</div>`;
    });
    previewAr.innerHTML = '';
    previewEn.innerHTML = html;
    previewAr.style.display = 'none';
    previewEn.style.display = '';
    previewContent.style.display = 'block';
    previewContent.style.gridTemplateColumns = '1fr';
    previewContent.classList.remove('preview-interleaved');
  }

  // ── Endnotes ──
  if (footnotesMode === 'endnotes' && endnotes.length > 0) {
    let endnotesHtml = '<div class="print-endnotes-title">Notes</div>';
    endnotes.forEach(en => {
      endnotesHtml +=
        `<div class="print-endnote-item"><strong>[${en.num}]</strong> ${escapeHtml(en.text)}</div>`;
    });
    previewEndnotes.innerHTML = endnotesHtml;
    previewEndnotes.style.display = 'block';
  } else {
    previewEndnotes.style.display = 'none';
  }

  // ── Update print content ──
  updatePrintContent(units, layout, footnotesMode);
}

   SECTION 13: PRINT CONTENT (FIXED)
   ────────────────────────────────────────────────────────── */
function updatePrintContent(units, layout, footnotesMode) {
  const printTitle = document.getElementById('print-preview-title');
  const printContent = document.getElementById('print-preview-content');
  const printEndnotes = document.getElementById('print-endnotes-section');
  if (!printTitle || !printContent) return;

  printTitle.textContent = STATE.currentText ? STATE.currentText.nameEn : '';

  let footnoteCounter = 0;
  const endnotes = [];

  // ── Build print HTML ──
  if (layout === 'parallel') {
    // Parallel: English left, Arabic right
    let arHtml = '',
      enHtml = '';
    units.forEach(unit => {
      const fns = unit.footnotes || [];
      arHtml += `<div>${escapeHtml(unit.arabic).replace(/\n/g, '<br>')}</div>`;
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      if (footnotesMode === 'inline' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          enText +=
            `<br><span class="print-footnote" style="font-size:9pt;color:#666;"><sup>${footnoteCounter}</sup> ${escapeHtml(fn.text)}</span>`;
        });
      } else if (footnotesMode === 'endnotes' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          enText += ` <sup>[${footnoteCounter}]</sup>`;
          endnotes.push({ num: footnoteCounter, text: fn.text });
        });
      }
      enHtml += `<div>${enText}</div>`;
    });
    printContent.innerHTML =
      `<div class="preview-col en" style="grid-column:1/2;font-size:10pt;font-style:italic;color:#444;">${enHtml}</div><div class="preview-col ar" style="grid-column:2/3;font-family:'Noto Naskh Arabic',serif;font-size:11pt;line-height:2;text-align:right;direction:rtl;">${arHtml}</div>`;
    printContent.style.display = 'grid';
    printContent.style.gridTemplateColumns = '1fr 1fr';
    printContent.classList.remove('preview-interleaved');

  } else if (layout === 'interleaved') {
    let combined = '';
    units.forEach(unit => {
      const fns = unit.footnotes || [];
      combined +=
        `<div style="margin-bottom:0.6rem;font-family:'Noto Naskh Arabic',serif;font-size:11pt;line-height:2;text-align:right;direction:rtl;">${escapeHtml(unit.arabic).replace(/\n/g, '<br>')}</div>`;
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      if (footnotesMode === 'inline' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          enText +=
            `<br><span style="font-size:9pt;color:#666;"><sup>${footnoteCounter}</sup> ${escapeHtml(fn.text)}</span>`;
        });
      } else if (footnotesMode === 'endnotes' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          enText += ` <sup>[${footnoteCounter}]</sup>`;
          endnotes.push({ num: footnoteCounter, text: fn.text });
        });
      }
      combined +=
        `<div style="margin-bottom:1rem;font-size:10pt;font-style:italic;color:#444;padding-left:0.5rem;border-left:2px solid #ddd6cc;padding-left:0.8rem;">${enText}</div>`;
    });
    printContent.innerHTML = combined;
    printContent.style.display = 'block';
    printContent.style.gridTemplateColumns = '1fr';
    printContent.classList.add('preview-interleaved');

  } else if (layout === 'arabic-only') {
    let html = '';
    units.forEach(unit => {
      html +=
        `<div style="margin-bottom:0.8rem;font-family:'Noto Naskh Arabic',serif;font-size:11pt;line-height:2;text-align:right;direction:rtl;">${escapeHtml(unit.arabic).replace(/\n/g, '<br>')}</div>`;
    });
    printContent.innerHTML = html;
    printContent.style.display = 'block';
    printContent.style.gridTemplateColumns = '1fr';
    printContent.classList.remove('preview-interleaved');

  } else if (layout === 'english-only') {
    let html = '';
    units.forEach(unit => {
      let txt = escapeHtml(unit.english).replace(/\n/g, '<br>');
      const fns = unit.footnotes || [];
      if (footnotesMode === 'inline' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          txt +=
            `<br><span style="font-size:9pt;color:#666;"><sup>${footnoteCounter}</sup> ${escapeHtml(fn.text)}</span>`;
        });
      } else if (footnotesMode === 'endnotes' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          txt += ` <sup>[${footnoteCounter}]</sup>`;
          endnotes.push({ num: footnoteCounter, text: fn.text });
        });
      }
      html += `<div style="margin-bottom:0.8rem;font-size:10pt;font-style:italic;color:#444;">${txt}</div>`;
    });
    printContent.innerHTML = html;
    printContent.style.display = 'block';
    printContent.style.gridTemplateColumns = '1fr';
    printContent.classList.remove('preview-interleaved');
  }

  // ── Endnotes ──
  if (footnotesMode === 'endnotes' && endnotes.length > 0) {
    let endnotesHtml = '<div class="print-endnotes-title">Notes</div>';
    endnotes.forEach(en => {
      endnotesHtml +=
        `<div class="print-endnote-item"><strong>[${en.num}]</strong> ${escapeHtml(en.text)}</div>`;
    });
    if (printEndnotes) {
      printEndnotes.innerHTML = endnotesHtml;
      printEndnotes.style.display = 'block';
    }
  } else if (printEndnotes) {
    printEndnotes.style.display = 'none';
  }
}

function getSelectedUnits() {
  if (!STATE.currentText) return [];
  const allUnits = getExportUnits(STATE.currentText);
  if (STATE.selectedExportIds.size === 0) return allUnits;
  return allUnits.filter(u => STATE.selectedExportIds.has(u.id));
}

   SECTION 14: EXPORT / DOWNLOAD (FIXED parallel column order)
   ────────────────────────────────────────────────────────── */
function generateDocx(units, layout, footnotesMode) {
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"><style>
@page{size:A4;margin:2cm}body{font-family:'Libre Baskerville',Georgia,serif;font-size:11pt;line-height:1.8}
.ar{font-family:'Noto Naskh Arabic',serif;direction:rtl;text-align:right;font-size:13pt}
.en{font-style:italic}.title{font-size:16pt;font-weight:bold;text-align:center;margin-bottom:.5cm}
.author{font-style:italic;text-align:center;color:#555;margin-bottom:1cm}
.footnote{font-size:9pt;color:#666;margin-top:.2cm}
.endnotes-title{font-size:12pt;font-weight:bold;margin-top:1cm;border-bottom:1px solid #999}
.endnote{font-size:9pt;margin-bottom:.2cm}
table{width:100%;border-collapse:collapse}td{vertical-align:top;padding:.3cm}
td.ar-col{width:50%;border-left:1px solid #ccc}td.en-col{width:50%}
</style></head><body>
<div class="title">${escapeHtml(STATE.currentText.nameEn)}</div>
<div class="author">${escapeHtml(STATE.currentText.author)}</div>`;

  let fc = 0, endnotes = [];

  units.forEach((unit, i) => {
    const fns = unit.footnotes || [];
    if (layout === 'interleaved') {
      html += `<div class="ar">${escapeHtml(unit.arabic).replace(/\n/g,'<br>')}</div>`;
      html += `<div class="en">${escapeHtml(unit.english).replace(/\n/g,'<br>')}`;
      if (footnotesMode === 'inline') fns.forEach(fn => { fc++; html += `<br><span class="footnote"><sup>${fc}</sup> ${escapeHtml(fn.text)}</span>`; });
      else if (footnotesMode === 'endnotes') fns.forEach(fn => { fc++; html += ` <sup>[${fc}]</sup>`; endnotes.push({ num: fc, text: fn.text }); });
      html += '</div><br>';
    } else if (layout === 'parallel') {
      if (i === 0) html += '<table>';
      // English left (col 1), Arabic right (col 2)
      html += `<tr><td class="en-col"><div class="en">${escapeHtml(unit.english).replace(/\n/g,'<br>')}`;
      if (footnotesMode === 'inline') fns.forEach(fn => { fc++; html += `<br><span class="footnote"><sup>${fc}</sup> ${escapeHtml(fn.text)}</span>`; });
      else if (footnotesMode === 'endnotes') fns.forEach(fn => { fc++; html += ` <sup>[${fc}]</sup>`; endnotes.push({ num: fc, text: fn.text }); });
      html += `</div></td><td class="ar-col"><div class="ar">${escapeHtml(unit.arabic).replace(/\n/g,'<br>')}</div></td></tr>`;
    } else if (layout === 'arabic-only') {
      html += `<div class="ar">${escapeHtml(unit.arabic).replace(/\n/g,'<br>')}</div><br>`;
    } else if (layout === 'english-only') {
      html += `<div class="en">${escapeHtml(unit.english).replace(/\n/g,'<br>')}</div><br>`;
    }
  });

  if (layout === 'parallel') html += '</table>';
  if (footnotesMode === 'endnotes' && endnotes.length > 0) {
    html += '<div class="endnotes-title">Notes</div>';
    endnotes.forEach(en => { html += `<div class="endnote"><strong>[${en.num}]</strong> ${escapeHtml(en.text)}</div>`; });
  }
  html += '</body></html>';

  const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
  downloadBlob(blob, STATE.currentText.nameEn.replace(/[^a-zA-Z0-9]/g, '_') + '.doc');
}

function generateMarkdown(units, layout, footnotesMode) {
  let md = `# ${STATE.currentText.nameEn}\n\n*${STATE.currentText.author}*\n\n---\n\n`;
  let fc = 0, endnotes = [];

  units.forEach(unit => {
    const fns = unit.footnotes || [];
    if (layout === 'arabic-only') {
      md += `<div dir="rtl" style="font-family:'Noto Naskh Arabic';font-size:1.2em;line-height:2;">\n\n${unit.arabic}\n\n</div>\n\n`;
    } else if (layout === 'english-only') {
      md += `*${unit.english}*\n\n`;
    } else {
      md += `<div dir="rtl" style="font-family:'Noto Naskh Arabic';font-size:1.2em;line-height:2;">\n\n${unit.arabic}\n\n</div>\n\n`;
      md += `*${unit.english}*`;
      if (footnotesMode === 'inline') fns.forEach(fn => { fc++; md += `  \n> <sup>${fc}</sup> ${fn.text}`; });
      else if (footnotesMode === 'endnotes') fns.forEach(fn => { fc++; md += ` <sup>[${fc}]</sup>`; endnotes.push({ num: fc, text: fn.text }); });
      md += '\n\n';
    }
  });

  if (footnotesMode === 'endnotes' && endnotes.length > 0) {
    md += '---\n\n### Notes\n\n';
    endnotes.forEach(en => { md += `**[${en.num}]** ${en.text}\n\n`; });
  }
  return md;
}

function generateClipboardText(units, layout, footnotesMode) {
  let text = `${STATE.currentText.nameEn}\n${STATE.currentText.author}\n${'─'.repeat(50)}\n\n`;
  let fc = 0, endnotes = [];

  units.forEach(unit => {
    const fns = unit.footnotes || [];
    if (layout === 'arabic-only') {
      text += `${unit.arabic}\n\n`;
    } else if (layout === 'english-only') {
      text += `${unit.english}\n\n`;
    } else {
      text += `${unit.arabic}\n${unit.english}`;
      if (footnotesMode === 'inline') fns.forEach(fn => { fc++; text += `\n  [${fc}] ${fn.text}`; });
      else if (footnotesMode === 'endnotes') fns.forEach(fn => { fc++; text += ` [${fc}]`; endnotes.push({ num: fc, text: fn.text }); });
      text += '\n\n';
    }
  });

  if (footnotesMode === 'endnotes' && endnotes.length > 0) {
    text += `${'─'.repeat(50)}\nNotes:\n`;
    endnotes.forEach(en => { text += `[${en.num}] ${en.text}\n`; });
  }
  return text;
}

async function handleDownload() {
  const layout = document.querySelector('input[name="layout"]:checked')?.value || 'parallel';
  const footnotesMode = document.querySelector('input[name="footnotes"]:checked')?.value || 'endnotes';
  const format = document.querySelector('input[name="format"]:checked')?.value || 'pdf';
  const units = getSelectedUnits();

  if (units.length === 0) {
    showToast('No units selected. Please select units in Export mode first.');
    return;
  }

  if (format === 'pdf') {
    showToast('Opening print dialog — choose "Save as PDF" in your browser');
    setTimeout(() => {
      const printContent = document.getElementById('print-content');
      const customizePage = document.getElementById('page-customize');
      const allPages = document.querySelectorAll('.page');
      const topbar = document.querySelector('.topbar');
      const toast = document.getElementById('toast');
      const bookmarksPanel = document.getElementById('bookmarks-panel');
      const bookmarksOverlay = document.getElementById('bookmarks-overlay');
      const progressBar = document.getElementById('reading-progress-bar');

      const orig = {};
      allPages.forEach(p => { orig[p.id] = p.style.display; p.style.display = 'none'; });
      orig['topbar'] = topbar.style.display; topbar.style.display = 'none';
      orig['toast'] = toast.style.display; toast.style.display = 'none';
      orig['bp'] = bookmarksPanel.style.display; bookmarksPanel.style.display = 'none';
      orig['bo'] = bookmarksOverlay.style.display; bookmarksOverlay.style.display = 'none';
      orig['pb'] = progressBar.style.display; progressBar.style.display = 'none';

      printContent.style.display = 'block';
      customizePage.style.display = 'block';
      customizePage.classList.add('active');

      window.print();

      printContent.style.display = 'none';
      allPages.forEach(p => { p.style.display = orig[p.id] || ''; });
      topbar.style.display = orig['topbar'] || '';
      toast.style.display = orig['toast'] || '';
      bookmarksPanel.style.display = orig['bp'] || '';
      bookmarksOverlay.style.display = orig['bo'] || '';
      progressBar.style.display = orig['pb'] || '';
      customizePage.classList.add('active');
    }, 500);
  } else if (format === 'docx') {
    generateDocx(units, layout, footnotesMode);
    showToast('DOCX file downloaded');
  } else if (format === 'markdown') {
    const md = generateMarkdown(units, layout, footnotesMode);
    const blob = new Blob([md], { type: 'text/markdown' });
    downloadBlob(blob, STATE.currentText.nameEn.replace(/[^a-zA-Z0-9]/g, '_') + '.md');
    showToast('Markdown file downloaded');
  } else if (format === 'clipboard') {
    const text = generateClipboardText(units, layout, footnotesMode);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard ✓');
    } catch {
      showToast('Failed to copy — check browser permissions');
    }
  }
}

   SECTION 15: UTILITIES
   Helper functions used throughout.
   ────────────────────────────────────────────────────────── */
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => t.classList.remove('show'), 2800);
}

   SECTION 16: EVENT BINDINGS
   Wire up all DOM event listeners.
   ────────────────────────────────────────────────────────── */
function bindEvents() {
  // Navigation
  document.querySelectorAll('[data-nav="home"]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); showPage('home'); });
  });
  document.querySelectorAll('[data-nav="reader"]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); showPage('reader'); });
  });

  // Logo click
  document.querySelector('.topbar-logo').addEventListener('click', e => { e.preventDefault(); showPage('home'); });

  // Archive back button
  document.getElementById('btn-back-to-archive').addEventListener('click', () => showArchive(STATE.currentArchive));

  // Search
  document.getElementById('global-search').addEventListener('input', function() { handleSearch(this.value); });
  document.getElementById('global-search').addEventListener('focus', function() { if (this.value.trim().length >= 2) handleSearch(this.value); });
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-wrap')) {
      document.getElementById('search-results').classList.remove('active');
    }
  });

  // Mode toggle
  document.getElementById('btn-read').addEventListener('click', () => setMode('reading'));
  document.getElementById('btn-export').addEventListener('click', () => setMode('export'));

  // Lens
  document.getElementById('lens-select').addEventListener('change', function() { updateLens(this.value); });

  // Export controls
  document.getElementById('btn-select-all').addEventListener('click', selectAllExport);
  document.getElementById('btn-clear-export').addEventListener('click', clearExport);
  document.getElementById('btn-proceed-customize').addEventListener('click', () => showPage('customize'));

  // Bookmarks
  document.getElementById('bookmark-toggle-btn').addEventListener('click', toggleBookmark);
  document.getElementById('btn-bookmarks-panel').addEventListener('click', () => toggleBookmarksPanel());
  document.getElementById('btn-bookmarks-close').addEventListener('click', () => toggleBookmarksPanel(false));
  document.getElementById('bookmarks-overlay').addEventListener('click', () => toggleBookmarksPanel(false));

  // Customize: live preview on radio change
  document.querySelectorAll('#layout-options input, #footnote-options input').forEach(radio => {
    radio.addEventListener('change', updateCustomizePreview);
  });

  // Download
  document.getElementById('btn-download').addEventListener('click', handleDownload);

  // Scroll progress
  window.addEventListener('scroll', () => {
    if (document.getElementById('page-reader').classList.contains('active')) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateReadingProgressBar, 100);
    }
  }, { passive: true });

  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      toggleBookmarksPanel();
    }
    if (e.key === 'Escape') {
      if (document.getElementById('bookmarks-panel').classList.contains('open')) toggleBookmarksPanel(false);
      document.getElementById('search-results').classList.remove('active');
    }
  });
}

   SECTION 17: INITIALIZATION
   Load data, bind events, render home page.
   ────────────────────────────────────────────────────────── */
(async function init() {
  const loaded = await loadData();
  if (!loaded) {
    showToast('Using embedded demo texts — add mutoon-data.json for more content');
  }
  bindEvents();
  renderBookmarksList();
})();
