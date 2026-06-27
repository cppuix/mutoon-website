// Generated module
import { store } from '../state/store.js';
import { applyLens } from '../state/actions.js';
import { escapeHtml } from '../utils/dom.js';
import { toggleExportUnit } from '../export/exportLogic.js';

function renderReadingContent(text) {
  const container = document.getElementById('reader-content');
  if (!container) return;
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

  applyLens(store.state.currentLens);
}

function renderFootnotes(footnotes) {
  if (!footnotes || footnotes.length === 0) return '';
  return footnotes.map((fn, i) =>
    `<span class="prose-footnote-inline" data-lens="english"><sup>${i + 1}</sup> ${escapeHtml(fn.text)}</span>`
  ).join('');
}

function renderExportContent(text) {
  const container = document.getElementById('export-content');
  if (!container) return;
  container.innerHTML = '';

  const units = getExportUnits(text);
  units.forEach(unit => {
    const div = document.createElement('div');
    div.className = 'export-unit';
    div.id = 'export-unit-' + unit.id;
    const isSelected = store.state.selectedExportIds.has(unit.id);
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

export { renderReadingContent, renderFootnotes, renderExportContent, getExportUnits };
