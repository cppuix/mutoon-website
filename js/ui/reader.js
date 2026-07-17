// js/ui/reader.js
import { store } from '../state/store.js';
import { applyLens } from '../state/actions.js';
import { escapeHtml } from '../utils/dom.js';
import { toggleExportUnit } from '../export/exportLogic.js';
import { fetchQuran } from '../utils/quran.js';
import { buildQuranCitationHtml } from '../utils/quranRenderer.js';
import { buildFullArabicHtml } from '../utils/quranRenderer.js';

// Helper to render footnotes
function renderFootnotes(footnotes) {
  if (!footnotes || footnotes.length === 0) return '';
  return footnotes.map((fn, i) =>
    `<span class="prose-footnote-inline" data-lens="english"><sup>${i + 1}</sup> ${escapeHtml(fn.text)}</span>`
  ).join('');
}

// Build a DOM element for a prose block (continuous or within chapter)
function buildProseBlockElement(block, blockIndex) {
  const div = document.createElement('div');
  div.className = 'prose-block';
  div.id = `block-${blockIndex}`;

  // Arabic side
  const arabicDiv = document.createElement('div');
  arabicDiv.className = 'prose-ar';
  arabicDiv.setAttribute('data-lens', 'arabic');

  if (block.parts) {
    // Build from parts – text nodes and Quran placeholders
    block.parts.forEach(part => {
      if (part.type === 'text') {
        const textNode = document.createTextNode(part.content);
        arabicDiv.appendChild(textNode);
      } else if (part.type === 'quran') {
        // Create a container for the Quran verses
        const container = document.createElement('span');
        container.className = 'quran-block';
        container.dataset.surah = part.surah;
        container.dataset.ayahStart = part.ayah_start;
        container.dataset.ayahEnd = part.ayah_end;
        // Placeholder that will be replaced after fetch
        container.innerHTML = '<span class="ayah-loading">⏳</span>';
        arabicDiv.appendChild(container);
      }
    });
  } else if (block.arabic) {
    // Legacy: direct arabic string
    const textNode = document.createTextNode(block.arabic);
    arabicDiv.appendChild(textNode);
  }
  div.appendChild(arabicDiv);

  // English side
  const englishDiv = document.createElement('div');
  englishDiv.className = 'prose-en';
  englishDiv.setAttribute('data-lens', 'english');
  if (block.english) {
    englishDiv.textContent = block.english;
  }
  div.appendChild(englishDiv);

  // Footnotes
  if (block.footnotes && block.footnotes.length) {
    const fnDiv = document.createElement('div');
    fnDiv.className = 'prose-footnote-inline';
    fnDiv.setAttribute('data-lens', 'english');
    fnDiv.innerHTML = block.footnotes.map((fn, i) =>
      `<sup>${i + 1}</sup> ${escapeHtml(fn.text)}`
    ).join(' ');
    div.appendChild(fnDiv);
  }

  return div;
}

// Render reading content for the current text
export async function renderReadingContent(text) {
  const container = document.getElementById('reader-content');
  if (!container) return;
  container.innerHTML = '';

  // Handle different text types
  if (text.type === 'poetry') {
    text.content.forEach((unit, i) => {
      const div = document.createElement('div');
      div.className = 'poem-unit';
      div.id = 'unit-' + (i + 1);
      div.innerHTML = `
        <span class="line-number">Line ${unit.lineNum}</span>
        <div class="poem-arabic" data-lens="arabic">${escapeHtml(unit.arabic).replace(/\n/g, '<br>')}</div>
        <div class="poem-translation" data-lens="english">${escapeHtml(unit.english).replace(/\n/g, '<br>')}</div>
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
        const blockEl = buildProseBlockElement(block, `${ci}-${bi}`);
        chDiv.appendChild(blockEl);
      });
      container.appendChild(chDiv);
    });
  } else if (text.type === 'prose_continuous') {
    text.blocks.forEach((block, i) => {
      const blockEl = buildProseBlockElement(block, i);
      container.appendChild(blockEl);
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

  // Now fetch and render all Quran blocks with ayah-by-ayah display
  const quranBlocks = container.querySelectorAll('.quran-block');
  const fetchPromises = Array.from(quranBlocks).map(async (block) => {
    const surah = parseInt(block.dataset.surah);
    const start = parseInt(block.dataset.ayahStart);
    const end = parseInt(block.dataset.ayahEnd);

    try {
      const verses = await fetchQuran(surah, start, end);
      const citationHtml = buildQuranCitationHtml(verses);
      block.innerHTML = citationHtml;
    } catch (err) {
      block.innerHTML = `<span class="ayah-error">[⚠️ تعذر تحميل الآيات]</span>`;
    }
  });

  await Promise.all(fetchPromises);

  // Re-apply lens after dynamic content is inserted
  applyLens(store.state.currentLens);
}

// Get export units from the current text (used in export mode)
export function getExportUnits(text) {
  const units = [];
  if (text.type === 'poetry') {
    text.content.forEach((unit, i) => {
      units.push({
        id: `line_${i + 1}`,
        label: `Line ${unit.lineNum}`,
        arabic: unit.arabic,
        english: unit.english,
        footnotes: unit.footnotes || [],
        // poetry does not use parts
      });
    });
  } else if (text.type === 'prose_chaptered') {
    text.chapters.forEach((ch, ci) => {
      ch.blocks.forEach((block, bi) => {
        const unit = {
          id: block.id || `block_${ci}_${bi}`,
          label: `${ch.titleEn} — Block ${bi + 1}`,
          english: block.english,
          footnotes: block.footnotes || [],
        };
        if (block.parts) {
          unit.parts = block.parts;
          unit.arabic = ''; // placeholder, will be resolved later
        } else {
          unit.arabic = block.arabic || '';
        }
        units.push(unit);
      });
    });
  } else if (text.type === 'prose_continuous') {
    text.blocks.forEach((block, i) => {
      const unit = {
        id: block.id || `block_${i}`,
        label: `Block ${i + 1}`,
        english: block.english,
        footnotes: block.footnotes || [],
      };
      if (block.parts) {
        unit.parts = block.parts;
        unit.arabic = ''; // placeholder
      } else {
        unit.arabic = block.arabic || '';
      }
      units.push(unit);
    });
  } else if (text.type === 'qa') {
    text.units.forEach((unit, i) => {
      units.push({
        id: unit.id || `qa_${i}`,
        label: `Q&A Unit ${i + 1}`,
        arabic: unit.questionAr + '\n' + unit.answerAr,
        english: unit.questionEn + '\n' + unit.answerEn,
        footnotes: unit.footnotes || [],
      });
    });
  }
  return units;
}

// Render the export selection list (now async)
export async function renderExportContent(text) {
  const container = document.getElementById('export-content');
  if (!container) return;
  container.innerHTML = '';

  const units = getExportUnits(text);

  // Build all unit elements with placeholders, then fetch Quran text for parts
  const unitElements = [];
  for (const unit of units) {
    const div = document.createElement('div');
    div.className = 'export-unit';
    div.id = 'export-unit-' + unit.id;
    const isSelected = store.state.selectedExportIds.has(unit.id);
    if (isSelected) div.classList.add('selected');

    // Store the unit data on the element for later use
    div.dataset.unitId = unit.id;
    div.dataset.hasParts = unit.parts ? 'true' : 'false';

    // Initial display with placeholder (or direct arabic if no parts)
    let arabicDisplay = '';
    if (unit.parts) {
      arabicDisplay = '⏳'; // will be replaced
    } else {
      arabicDisplay = escapeHtml(unit.arabic || '').replace(/\n/g, '<br>');
    }

    div.innerHTML = `
      <div class="export-unit-header">
        <input type="checkbox" class="export-checkbox" id="chk-${unit.id}" aria-label="Select ${unit.label}" ${isSelected ? 'checked' : ''}>
        <span class="export-unit-label">${unit.label}</span>
      </div>
      <div class="export-unit-body">
        <div class="prose-ar" style="font-size:1.1rem;margin-bottom:0.6rem;">${arabicDisplay}</div>
        <div class="prose-en" style="font-style:italic;font-size:0.88rem;">${escapeHtml(unit.english).replace(/\n/g, '<br>')}</div>
      </div>
    `;

    // Store the body element reference
    const bodyDiv = div.querySelector('.prose-ar');
    div.dataset.bodyRef = bodyDiv;

    container.appendChild(div);
    unitElements.push({ div, unit, bodyDiv });

    // Attach event listeners for checkbox toggle
    div.querySelector('.export-unit-header').addEventListener('click', function(e) {
      if (e.target.tagName === 'INPUT') return;
      toggleExportUnit(unit.id, div);
    });
    div.querySelector('.export-checkbox').addEventListener('click', function(e) {
      e.stopPropagation();
      toggleExportUnit(unit.id, div);
    });
  }

  // Now fetch Quran text for units that have parts and build full Arabic HTML
  const fetchPromises = unitElements
    .filter(({ unit }) => unit.parts)
    .map(async ({ unit, bodyDiv }) => {
      try {
        const fullHtml = await buildFullArabicHtml(unit.parts);
        bodyDiv.innerHTML = fullHtml;
      } catch (err) {
        bodyDiv.innerHTML = `<span class="ayah-error">[⚠️]</span>`;
        console.error('Error building full Arabic for export unit:', err);
      }
    });

  await Promise.all(fetchPromises);
}