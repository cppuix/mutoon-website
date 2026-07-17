// js/export/download.js
import { store } from '../state/store.js';
import { downloadBlob, escapeHtml, showToast } from '../utils/dom.js';
import { fetchQuran } from '../utils/quran.js';

// Helper to resolve Arabic text from parts
async function resolveUnitArabic(unit) {
  if (unit.parts && unit.parts.length) {
    let fullText = '';
    for (const part of unit.parts) {
      if (part.type === 'text') {
        fullText += part.content;
      } else if (part.type === 'quran') {
        const verses = await fetchQuran(part.surah, part.ayah_start, part.ayah_end);
        // verses is now an array of { number, text }
        const verseTexts = verses.map(v => v.text);
        fullText += verseTexts.join(' ');
      }
    }
    return fullText;
  }
  return unit.arabic || '';
}

// Get selected units (from customize.js – we duplicate logic here for now)
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
        const unit = {
          id: block.id || `block_${ci}_${bi}`,
          label: `${chapter.titleEn} — Block ${bi + 1}`,
          english: block.english,
          footnotes: block.footnotes || []
        };
        if (block.parts) {
          unit.parts = block.parts;
          unit.arabic = '';
        } else {
          unit.arabic = block.arabic || '';
        }
        allUnits.push(unit);
      });
    });
  } else if (text.type === 'prose_continuous') {
    text.blocks.forEach((block, i) => {
      const unit = {
        id: block.id || `block_${i}`,
        label: `Block ${i + 1}`,
        english: block.english,
        footnotes: block.footnotes || []
      };
      if (block.parts) {
        unit.parts = block.parts;
        unit.arabic = '';
      } else {
        unit.arabic = block.arabic || '';
      }
      allUnits.push(unit);
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

async function generateDocx(units, layout, footnotesMode) {
  // Resolve Arabic texts first
  const resolvedUnits = await Promise.all(units.map(async (unit) => ({
    ...unit,
    arabic: await resolveUnitArabic(unit)
  })));

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
<div class="title">${escapeHtml(store.state.currentText.nameEn)}</div>
<div class="author">${escapeHtml(store.state.currentText.author)}</div>`;

  let fc = 0, endnotes = [];

  resolvedUnits.forEach((unit, i) => {
    const fns = unit.footnotes || [];
    if (layout === 'interleaved') {
      html += `<div class="ar">${escapeHtml(unit.arabic).replace(/\n/g, '<br>')}</div>`;
      html += `<div class="en">${escapeHtml(unit.english).replace(/\n/g, '<br>')}`;
      if (footnotesMode === 'inline') fns.forEach(fn => { fc++; html += `<br><span class="footnote"><sup>${fc}</sup> ${escapeHtml(fn.text)}</span>`; });
      else if (footnotesMode === 'endnotes') fns.forEach(fn => { fc++; html += ` <sup>[${fc}]</sup>`; endnotes.push({ num: fc, text: fn.text }); });
      html += '</div><br>';
    } else if (layout === 'parallel') {
      if (i === 0) html += '<table>';
      // English left, Arabic right
      html += `<tr><td class="en-col"><div class="en">${escapeHtml(unit.english).replace(/\n/g, '<br>')}`;
      if (footnotesMode === 'inline') fns.forEach(fn => { fc++; html += `<br><span class="footnote"><sup>${fc}</sup> ${escapeHtml(fn.text)}</span>`; });
      else if (footnotesMode === 'endnotes') fns.forEach(fn => { fc++; html += ` <sup>[${fc}]</sup>`; endnotes.push({ num: fc, text: fn.text }); });
      html += `</div></td><td class="ar-col"><div class="ar">${escapeHtml(unit.arabic).replace(/\n/g, '<br>')}</div></td></tr>`;
    } else if (layout === 'arabic-only') {
      html += `<div class="ar">${escapeHtml(unit.arabic).replace(/\n/g, '<br>')}</div><br>`;
    } else if (layout === 'english-only') {
      html += `<div class="en">${escapeHtml(unit.english).replace(/\n/g, '<br>')}</div><br>`;
    }
  });

  if (layout === 'parallel') html += '</table>';
  if (footnotesMode === 'endnotes' && endnotes.length > 0) {
    html += '<div class="endnotes-title">Notes</div>';
    endnotes.forEach(en => { html += `<div class="endnote"><strong>[${en.num}]</strong> ${escapeHtml(en.text)}</div>`; });
  }
  html += '</body></html>';

  const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
  downloadBlob(blob, store.state.currentText.nameEn.replace(/[^a-zA-Z0-9]/g, '_') + '.doc');
}

async function generateMarkdown(units, layout, footnotesMode) {
  // Resolve Arabic texts
  const resolvedUnits = await Promise.all(units.map(async (unit) => ({
    ...unit,
    arabic: await resolveUnitArabic(unit)
  })));

  let md = `# ${store.state.currentText.nameEn}\n\n*${store.state.currentText.author}*\n\n---\n\n`;
  let fc = 0, endnotes = [];

  resolvedUnits.forEach(unit => {
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

async function generateClipboardText(units, layout, footnotesMode) {
  // Resolve Arabic texts
  const resolvedUnits = await Promise.all(units.map(async (unit) => ({
    ...unit,
    arabic: await resolveUnitArabic(unit)
  })));

  let text = `${store.state.currentText.nameEn}\n${store.state.currentText.author}\n${'─'.repeat(50)}\n\n`;
  let fc = 0, endnotes = [];

  resolvedUnits.forEach(unit => {
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
    await generateDocx(units, layout, footnotesMode);
    showToast('DOCX file downloaded');
  } else if (format === 'markdown') {
    const md = await generateMarkdown(units, layout, footnotesMode);
    const blob = new Blob([md], { type: 'text/markdown' });
    downloadBlob(blob, store.state.currentText.nameEn.replace(/[^a-zA-Z0-9]/g, '_') + '.md');
    showToast('Markdown file downloaded');
  } else if (format === 'clipboard') {
    const text = await generateClipboardText(units, layout, footnotesMode);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard ✓');
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied to clipboard ✓ (fallback)');
      } catch {
        showToast('Failed to copy — check browser permissions');
      }
    }
  }
}

export { handleDownload, generateDocx, generateMarkdown, generateClipboardText };