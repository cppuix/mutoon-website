// Generated module
import { store } from '../state/store.js';
import { escapeHtml } from '../utils/dom.js';

function getSelectedUnits() {
  const text = store.state.currentText;
  if (!text) return [];

  const allUnits = [];
  if (text.type === 'poetry') {
    text.content.forEach((unit, i) => {
      allUnits.push({
        id: `line_${i + 1}`,
        label: `Line ${unit.lineNum}`,
        arabic: unit.arabic,
        english: unit.english,
        footnotes: unit.footnotes || []
      });
    });
  } else if (text.type === 'prose_chaptered') {
    text.chapters.forEach((chapter, ci) => {
      chapter.blocks.forEach((block, bi) => {
        allUnits.push({
          id: block.id || `block_${ci}_${bi}`,
          label: `${chapter.titleEn} — Block ${bi + 1}`,
          arabic: block.arabic,
          english: block.english,
          footnotes: block.footnotes || []
        });
      });
    });
  } else if (text.type === 'prose_continuous') {
    text.blocks.forEach((block, i) => {
      allUnits.push({
        id: block.id || `block_${i}`,
        label: `Block ${i + 1}`,
        arabic: block.arabic,
        english: block.english,
        footnotes: block.footnotes || []
      });
    });
  } else if (text.type === 'qa') {
    text.units.forEach((unit, i) => {
      allUnits.push({
        id: unit.id || `qa_${i}`,
        label: `Q&A Unit ${i + 1}`,
        arabic: unit.questionAr + '\n' + unit.answerAr,
        english: unit.questionEn + '\n' + unit.answerEn,
        footnotes: unit.footnotes || []
      });
    });
  }

  return allUnits.filter(unit => store.state.selectedExportIds.has(unit.id));
}

function updatePrintContent(units, layout, footnotesMode) {
  const printContent = document.getElementById('print-content');
  if (!printContent) return;

  let html = `<div class="print-title">${escapeHtml(store.state.currentText?.nameEn || '')}</div>`;
  html += `<div class="print-author">${escapeHtml(store.state.currentText?.author || '')}</div>`;

  let footnoteCounter = 0;
  const endnotes = [];

  if (layout === 'parallel') {
    html += '<table class="print-table">';
    units.forEach(unit => {
      const fns = unit.footnotes || [];
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      if (footnotesMode === 'inline' && fns.length > 0) {
        fns.forEach(fn => { footnoteCounter++; enText += `<br><span class="print-footnote"><sup>${footnoteCounter}</sup> ${escapeHtml(fn.text)}</span>`; });
      } else if (footnotesMode === 'endnotes' && fns.length > 0) {
        fns.forEach(fn => { footnoteCounter++; enText += ` <sup>[${footnoteCounter}]</sup>`; endnotes.push({ num: footnoteCounter, text: fn.text }); });
      }
      html += `<tr><td class="print-col-en">${enText}</td><td class="print-col-ar">${escapeHtml(unit.arabic).replace(/\n/g, '<br>')}</td></tr>`;
    });
    html += '</table>';
  } else if (layout === 'interleaved') {
    units.forEach(unit => {
      const fns = unit.footnotes || [];
      html += `<div class="print-ar">${escapeHtml(unit.arabic).replace(/\n/g, '<br>')}</div>`;
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      if (footnotesMode === 'inline' && fns.length > 0) {
        fns.forEach(fn => { footnoteCounter++; enText += `<br><span class="print-footnote"><sup>${footnoteCounter}</sup> ${escapeHtml(fn.text)}</span>`; });
      } else if (footnotesMode === 'endnotes' && fns.length > 0) {
        fns.forEach(fn => { footnoteCounter++; enText += ` <sup>[${footnoteCounter}]</sup>`; endnotes.push({ num: footnoteCounter, text: fn.text }); });
      }
      html += `<div class="print-en">${enText}</div>`;
    });
  } else if (layout === 'arabic-only') {
    units.forEach(unit => {
      html += `<div class="print-ar">${escapeHtml(unit.arabic).replace(/\n/g, '<br>')}</div>`;
    });
  } else if (layout === 'english-only') {
    units.forEach(unit => {
      const fns = unit.footnotes || [];
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      if (footnotesMode === 'inline' && fns.length > 0) {
        fns.forEach(fn => { footnoteCounter++; enText += `<br><span class="print-footnote"><sup>${footnoteCounter}</sup> ${escapeHtml(fn.text)}</span>`; });
      } else if (footnotesMode === 'endnotes' && fns.length > 0) {
        fns.forEach(fn => { footnoteCounter++; enText += ` <sup>[${footnoteCounter}]</sup>`; endnotes.push({ num: footnoteCounter, text: fn.text }); });
      }
      html += `<div class="print-en">${enText}</div>`;
    });
  }

  if (footnotesMode === 'endnotes' && endnotes.length > 0) {
    html += '<div class="print-endnotes-title">Notes</div>';
    endnotes.forEach(en => {
      html += `<div class="print-endnote-item"><strong>[${en.num}]</strong> ${escapeHtml(en.text)}</div>`;
    });
  }

  printContent.innerHTML = html;
}

function updateCustomizePreview() {
  if (!store.state.currentText) {
    const previewContent = document.getElementById('preview-content');
    if (previewContent) previewContent.innerHTML = '<div class="preview-interleaved-block"><em>No text loaded. Go back and open a text first.</em></div>';
    return;
  }

  const layout = document.querySelector('input[name="layout"]:checked')?.value || 'parallel';
  const footnotesMode = document.querySelector('input[name="footnotes"]:checked')?.value || 'endnotes';
  const previewBoxTitle = document.getElementById('preview-box-title');
  const previewContent = document.getElementById('preview-content');
  const previewEndnotes = document.getElementById('preview-endnotes');

  if (previewBoxTitle) previewBoxTitle.textContent = store.state.currentText.nameEn + ' — ' + layout.replace('-', ' ');

  const units = getSelectedUnits();
  if (units.length === 0) {
    if (previewContent) previewContent.innerHTML = '<div class="preview-interleaved-block"><em>No units selected. Go back and select units in Export mode.</em></div>';
    if (previewEndnotes) previewEndnotes.style.display = 'none';
    return;
  }

  let footnoteCounter = 0;
  const endnotes = [];
  const buildFootnoteHtml = (fns, container) => {
    let html = '';
    fns.forEach(fn => {
      footnoteCounter++;
      html += `<br><span class="prose-footnote-inline" style="display:block;font-size:0.8rem;color:#666;margin-top:0.2rem;"><sup>${footnoteCounter}</sup> ${escapeHtml(fn.text)}</span>`;
    });
    return html;
  };

  let html = '';

  if (layout === 'parallel') {
    units.forEach(unit => {
      const fns = unit.footnotes || [];
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      let arText = escapeHtml(unit.arabic).replace(/\n/g, '<br>');

      if (footnotesMode === 'inline' && fns.length > 0) {
        enText += buildFootnoteHtml(fns);
      } else if (footnotesMode === 'endnotes' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          enText += ` <sup>[${footnoteCounter}]</sup>`;
          endnotes.push({ num: footnoteCounter, text: fn.text });
        });
      }

      html += `<div class="preview-parallel-row">
        <div class="preview-parallel-en">${enText}</div>
        <div class="preview-parallel-ar">${arText}</div>
      </div>`;
    });
    if (previewContent) {
      previewContent.classList.remove('preview-interleaved');
      previewContent.innerHTML = html;
    }
  } else if (layout === 'interleaved') {
    units.forEach(unit => {
      const fns = unit.footnotes || [];
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      let arText = escapeHtml(unit.arabic).replace(/\n/g, '<br>');

      if (footnotesMode === 'inline' && fns.length > 0) {
        enText += buildFootnoteHtml(fns);
      } else if (footnotesMode === 'endnotes' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          enText += ` <sup>[${footnoteCounter}]</sup>`;
          endnotes.push({ num: footnoteCounter, text: fn.text });
        });
      }

      html += `<div class="preview-interleaved-block">
        <div class="preview-block-ar">${arText}</div>
        <div class="preview-block-en">${enText}</div>
      </div>`;
    });
    if (previewContent) {
      previewContent.classList.add('preview-interleaved');
      previewContent.innerHTML = html;
    }
  } else if (layout === 'arabic-only') {
    units.forEach(unit => {
      html += `<div class="preview-interleaved-block"><div class="preview-block-ar">${escapeHtml(unit.arabic).replace(/\n/g, '<br>')}</div></div>`;
    });
    if (previewContent) {
      previewContent.classList.remove('preview-interleaved');
      previewContent.innerHTML = html;
    }
  } else if (layout === 'english-only') {
    units.forEach(unit => {
      const fns = unit.footnotes || [];
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      if (footnotesMode === 'inline' && fns.length > 0) {
        enText += buildFootnoteHtml(fns);
      } else if (footnotesMode === 'endnotes' && fns.length > 0) {
        fns.forEach(fn => {
          footnoteCounter++;
          enText += ` <sup>[${footnoteCounter}]</sup>`;
          endnotes.push({ num: footnoteCounter, text: fn.text });
        });
      }
      html += `<div class="preview-interleaved-block"><div class="preview-block-en">${enText}</div></div>`;
    });
    if (previewContent) {
      previewContent.classList.remove('preview-interleaved');
      previewContent.innerHTML = html;
    }
  }

  if (footnotesMode === 'endnotes' && endnotes.length > 0) {
    let endnotesHtml = '<div class="print-endnotes-title">Notes</div>';
    endnotes.forEach(en => {
      endnotesHtml += `<div class="print-endnote-item"><strong>[${en.num}]</strong> ${escapeHtml(en.text)}</div>`;
    });
    if (previewEndnotes) {
      previewEndnotes.innerHTML = endnotesHtml;
      previewEndnotes.style.display = 'block';
    }
  } else if (previewEndnotes) {
    previewEndnotes.style.display = 'none';
  }

  updatePrintContent(units, layout, footnotesMode);
}

export { updateCustomizePreview, updatePrintContent, getSelectedUnits };
