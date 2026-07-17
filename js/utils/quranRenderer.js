// js/utils/quranRenderer.js
import { escapeHtml } from './dom.js';
import { fetchQuran } from './quran.js';

/**
 * Build HTML for a Quran citation with braces and ayah numbers.
 * @param {Array<{number: number, text: string}>} verses - Array of verse objects.
 * @returns {string} HTML string.
 */
export function buildQuranCitationHtml(verses) {
  if (!verses || verses.length === 0) return '';
  let html = '<span class="quran-citation">';
  html += '<span class="quran-brace">{</span> ';
  verses.forEach((verse) => {
    html += `<span class="ayah-text">${escapeHtml(verse.text)}</span>`;
    html += `<span class="ayah-number">(${verse.number})</span>`;
  });
  html += '<span class="quran-brace">}</span>';
  html += '</span>';
  return html;
}

/**
 * Build the full Arabic HTML for a set of parts (text and quran references).
 * Text parts are escaped; quran parts are replaced with the formatted citation.
 * @param {Array<{type: string, content?: string, surah?: number, ayah_start?: number, ayah_end?: number}>} parts
 * @returns {Promise<string>} HTML string.
 */
export async function buildFullArabicHtml(parts) {
  let html = '';
  for (const part of parts) {
    if (part.type === 'text') {
      html += escapeHtml(part.content);
    } else if (part.type === 'quran') {
      try {
        const verses = await fetchQuran(part.surah, part.ayah_start, part.ayah_end);
        html += buildQuranCitationHtml(verses);
      } catch (err) {
        console.error('Error fetching Quran for part:', err);
        html += '[Quran]';
      }
    }
  }
  return html;
}