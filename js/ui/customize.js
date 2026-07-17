// js/ui/customize.js
import { store } from '../state/store.js';
import { escapeHtml } from '../utils/dom.js';
import { fetchQuran } from '../utils/quran.js';
import { buildFullArabicHtml, buildQuranCitationHtml } from '../utils/quranRenderer.js';


// Helper to resolve a unit's Arabic text from parts (returns plain concatenated text, for data use)
async function resolveUnitArabic(unit)
{
  if (unit.parts)
  {
    let fullText = '';
    for (const part of unit.parts)
    {
      if (part.type === 'text')
      {
        fullText += part.content;
      } else if (part.type === 'quran')
      {
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

// Get selected units with resolved Arabic text (plain concatenated, for underlying data)
async function getSelectedUnits()
{
  const text = store.state.currentText;
  if (!text) return [];

  const allUnits = [];
  if (text.type === 'poetry')
  {
    text.content.forEach((unit, i) =>
    {
      allUnits.push({
        id: `line_${i + 1}`,
        label: `Line ${unit.lineNum}`,
        arabic: unit.arabic,
        english: unit.english,
        footnotes: unit.footnotes || []
      });
    });
  } else if (text.type === 'prose_chaptered')
  {
    text.chapters.forEach((chapter, ci) =>
    {
      chapter.blocks.forEach((block, bi) =>
      {
        const unit = {
          id: block.id || `block_${ci}_${bi}`,
          label: `${chapter.titleEn} — Block ${bi + 1}`,
          english: block.english,
          footnotes: block.footnotes || [],
        };
        if (block.parts)
        {
          unit.parts = block.parts;
          unit.arabic = ''; // placeholder
        } else
        {
          unit.arabic = block.arabic || '';
        }
        allUnits.push(unit);
      });
    });
  } else if (text.type === 'prose_continuous')
  {
    text.blocks.forEach((block, i) =>
    {
      const unit = {
        id: block.id || `block_${i}`,
        label: `Block ${i + 1}`,
        english: block.english,
        footnotes: block.footnotes || [],
      };
      if (block.parts)
      {
        unit.parts = block.parts;
        unit.arabic = ''; // placeholder
      } else
      {
        unit.arabic = block.arabic || '';
      }
      allUnits.push(unit);
    });
  } else if (text.type === 'qa')
  {
    text.units.forEach((unit, i) =>
    {
      allUnits.push({
        id: unit.id || `qa_${i}`,
        label: `Q&A Unit ${i + 1}`,
        arabic: unit.questionAr + '\n' + unit.answerAr,
        english: unit.questionEn + '\n' + unit.answerEn,
        footnotes: unit.footnotes || []
      });
    });
  }

  // Filter selected and resolve Arabic
  const selected = allUnits.filter(unit => store.state.selectedExportIds.has(unit.id));
  // Resolve each unit's Arabic (plain text)
  for (const unit of selected)
  {
    unit.arabic = await resolveUnitArabic(unit);
  }
  return selected;
}

// Update print content (for PDF) – now accepts units with 'arabicHtml' property if available
function updatePrintContent(units, layout, footnotesMode)
{
  const printContent = document.getElementById('print-content');
  if (!printContent) return;

  let html = `<div class="print-title">${escapeHtml(store.state.currentText?.nameEn || '')}</div>`;
  html += `<div class="print-author">${escapeHtml(store.state.currentText?.author || '')}</div>`;

  let footnoteCounter = 0;
  const endnotes = [];

  if (layout === 'parallel')
  {
    html += '<table class="print-table">';
    units.forEach(unit =>
    {
      const fns = unit.footnotes || [];
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      // Use unit.arabicHtml if present (formatted citation), else fallback to unit.arabic (plain)
      const arText = unit.arabicHtml || escapeHtml(unit.arabic).replace(/\n/g, '<br>');
      if (footnotesMode === 'inline' && fns.length > 0)
      {
        fns.forEach(fn => { footnoteCounter++; enText += `<br><span class="print-footnote"><sup>${footnoteCounter}</sup> ${escapeHtml(fn.text)}</span>`; });
      } else if (footnotesMode === 'endnotes' && fns.length > 0)
      {
        fns.forEach(fn => { footnoteCounter++; enText += ` <sup>[${footnoteCounter}]</sup>`; endnotes.push({ num: footnoteCounter, text: fn.text }); });
      }
      html += `<tr><td class="print-col-en">${enText}</td><td class="print-col-ar">${arText}</td></tr>`;
    });
    html += '</table>';
  } else if (layout === 'interleaved')
  {
    units.forEach(unit =>
    {
      const fns = unit.footnotes || [];
      const arText = unit.arabicHtml || escapeHtml(unit.arabic).replace(/\n/g, '<br>');
      html += `<div class="print-ar">${arText}</div>`;
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      if (footnotesMode === 'inline' && fns.length > 0)
      {
        fns.forEach(fn => { footnoteCounter++; enText += `<br><span class="print-footnote"><sup>${footnoteCounter}</sup> ${escapeHtml(fn.text)}</span>`; });
      } else if (footnotesMode === 'endnotes' && fns.length > 0)
      {
        fns.forEach(fn => { footnoteCounter++; enText += ` <sup>[${footnoteCounter}]</sup>`; endnotes.push({ num: footnoteCounter, text: fn.text }); });
      }
      html += `<div class="print-en">${enText}</div>`;
    });
  } else if (layout === 'arabic-only')
  {
    units.forEach(unit =>
    {
      const arText = unit.arabicHtml || escapeHtml(unit.arabic).replace(/\n/g, '<br>');
      html += `<div class="print-ar">${arText}</div>`;
    });
  } else if (layout === 'english-only')
  {
    units.forEach(unit =>
    {
      const fns = unit.footnotes || [];
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      if (footnotesMode === 'inline' && fns.length > 0)
      {
        fns.forEach(fn => { footnoteCounter++; enText += `<br><span class="print-footnote"><sup>${footnoteCounter}</sup> ${escapeHtml(fn.text)}</span>`; });
      } else if (footnotesMode === 'endnotes' && fns.length > 0)
      {
        fns.forEach(fn => { footnoteCounter++; enText += ` <sup>[${footnoteCounter}]</sup>`; endnotes.push({ num: footnoteCounter, text: fn.text }); });
      }
      html += `<div class="print-en">${enText}</div>`;
    });
  }

  if (footnotesMode === 'endnotes' && endnotes.length > 0)
  {
    html += '<div class="print-endnotes-title">Notes</div>';
    endnotes.forEach(en =>
    {
      html += `<div class="print-endnote-item"><strong>[${en.num}]</strong> ${escapeHtml(en.text)}</div>`;
    });
  }

  printContent.innerHTML = html;
}

async function updateCustomizePreview()
{
  if (!store.state.currentText)
  {
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

  const units = await getSelectedUnits();
  if (units.length === 0)
  {
    if (previewContent) previewContent.innerHTML = '<div class="preview-interleaved-block"><em>No units selected. Go back and select units in Export mode.</em></div>';
    if (previewEndnotes) previewEndnotes.style.display = 'none';
    return;
  }

  // Resolve each unit's Arabic: if parts, build full HTML with formatted citation; else use plain arabic
  const resolvedUnits = await Promise.all(units.map(async (unit) =>
  {
    let arabicHtml = '';
    if (unit.parts)
    {
      try
      {
        arabicHtml = await buildFullArabicHtml(unit.parts);
      } catch
      {
        arabicHtml = escapeHtml(unit.arabic || '').replace(/\n/g, '<br>');
      }
    } else
    {
      arabicHtml = escapeHtml(unit.arabic || '').replace(/\n/g, '<br>');
    }
    return { ...unit, arabicHtml };
  }));

  let footnoteCounter = 0;
  const endnotes = [];
  const buildFootnoteHtml = (fns) =>
  {
    let html = '';
    fns.forEach(fn =>
    {
      footnoteCounter++;
      html += `<br><span class="prose-footnote-inline" style="display:block;font-size:0.8rem;color:#666;margin-top:0.2rem;"><sup>${footnoteCounter}</sup> ${escapeHtml(fn.text)}</span>`;
    });
    return html;
  };

  let html = '';

  if (layout === 'parallel')
  {
    resolvedUnits.forEach(unit =>
    {
      const fns = unit.footnotes || [];
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      let arText = unit.arabicHtml;

      if (footnotesMode === 'inline' && fns.length > 0)
      {
        enText += buildFootnoteHtml(fns);
      } else if (footnotesMode === 'endnotes' && fns.length > 0)
      {
        fns.forEach(fn =>
        {
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
    if (previewContent)
    {
      previewContent.classList.remove('preview-interleaved');
      previewContent.innerHTML = html;
    }
  } else if (layout === 'interleaved')
  {
    resolvedUnits.forEach(unit =>
    {
      const fns = unit.footnotes || [];
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      let arText = unit.arabicHtml;

      if (footnotesMode === 'inline' && fns.length > 0)
      {
        enText += buildFootnoteHtml(fns);
      } else if (footnotesMode === 'endnotes' && fns.length > 0)
      {
        fns.forEach(fn =>
        {
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
    if (previewContent)
    {
      previewContent.classList.add('preview-interleaved');
      previewContent.innerHTML = html;
    }
  } else if (layout === 'arabic-only')
  {
    resolvedUnits.forEach(unit =>
    {
      html += `<div class="preview-interleaved-block"><div class="preview-block-ar">${unit.arabicHtml}</div></div>`;
    });
    if (previewContent)
    {
      previewContent.classList.remove('preview-interleaved');
      previewContent.innerHTML = html;
    }
  } else if (layout === 'english-only')
  {
    resolvedUnits.forEach(unit =>
    {
      const fns = unit.footnotes || [];
      let enText = escapeHtml(unit.english).replace(/\n/g, '<br>');
      if (footnotesMode === 'inline' && fns.length > 0)
      {
        enText += buildFootnoteHtml(fns);
      } else if (footnotesMode === 'endnotes' && fns.length > 0)
      {
        fns.forEach(fn =>
        {
          footnoteCounter++;
          enText += ` <sup>[${footnoteCounter}]</sup>`;
          endnotes.push({ num: footnoteCounter, text: fn.text });
        });
      }
      html += `<div class="preview-interleaved-block"><div class="preview-block-en">${enText}</div></div>`;
    });
    if (previewContent)
    {
      previewContent.classList.remove('preview-interleaved');
      previewContent.innerHTML = html;
    }
  }

  if (footnotesMode === 'endnotes' && endnotes.length > 0)
  {
    let endnotesHtml = '<div class="print-endnotes-title">Notes</div>';
    endnotes.forEach(en =>
    {
      endnotesHtml += `<div class="print-endnote-item"><strong>[${en.num}]</strong> ${escapeHtml(en.text)}</div>`;
    });
    if (previewEndnotes)
    {
      previewEndnotes.innerHTML = endnotesHtml;
      previewEndnotes.style.display = 'block';
    }
  } else if (previewEndnotes)
  {
    previewEndnotes.style.display = 'none';
  }

  // Update print content (using resolvedUnits with arabicHtml)
  updatePrintContent(resolvedUnits, layout, footnotesMode);
}

export { updateCustomizePreview, updatePrintContent, getSelectedUnits };