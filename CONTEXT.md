# Mutoon.com — Project Overview & Technical Reference

> **Purpose**: This document provides a comprehensive overview of the Mutoon.com digital library project. It is intended as a reference for developers (or LLMs) who need to understand the architecture, data model, current issues, and recommendations for future improvements.  
> **Last updated**: 2026-07-17  
> **Version**: 1.0 (as implemented)

---

## 1. Project Introduction

**Mutoon.com** is a single‑page application (SPA) designed to serve as a digital library of classical Islamic foundational texts (*mutoon*). It enables users to:

- Browse texts by category (ʿAqeedah, Hadith, Fiqh, Language, etc.)
- Search for texts by title, author, keywords, or category
- Read texts with parallel Arabic/English display, with a language lens (Arabic only, English only, or both)
- Select specific units (poetry lines, prose blocks, Q&A pairs) for export
- Customise the export layout (parallel columns, interleaved, Arabic‑only, English‑only), footnote placement (inline, endnotes, none), and download format (PDF via print, DOCX, Markdown, or copy to clipboard)
- Bookmark texts for quick access
- Track reading progress per text (stored locally)

---

## 2. Technology Stack

| Layer          | Technology / Approach                                      |
|----------------|------------------------------------------------------------|
| **UI**         | Plain HTML5, CSS3 (custom properties, flexbox, grid)       |
| **JavaScript** | Vanilla ES Modules (no framework) – uses `type="module"`   |
| **Styling**    | Custom CSS with a print stylesheet for PDF export          |
| **Data**       | JSON (loaded via `fetch` from `mutoon-data.json`)          |
| **Persistence**| `localStorage` (bookmarks, reading progress)               |
| **Fonts**      | Google Fonts: Libre Baskerville (English), Noto Naskh Arabic |
| **Export**     | PDF (via browser print), DOCX (HTML-based .doc), Markdown, clipboard |
| **Build**      | None – static files served directly (can be enhanced later)|

---

## 3. Architecture Overview

### 3.1. Core Modules

| File                     | Responsibility                                                                                      |
|--------------------------|-----------------------------------------------------------------------------------------------------|
| `index.html`             | Single HTML entry point with all markup, CSS, and the main layout.                                  |
| `js/app.js`              | Entry point – initialises data loading and binds events.                                            |
| `js/state/store.js`      | Central state store: `currentArchive`, `currentText`, `currentMode`, `currentLens`, `selectedExportIds` (Set). |
| `js/state/actions.js`    | State‑mutating actions: `setMode`, `updateLens`, `applyLens`.                                       |
| `js/data/dataLoader.js`  | Fetches `mutoon-data.json` or falls back to embedded demo data; triggers `buildHomeCategories`.     |
| `js/navigation/router.js`| Page switching (`showPage`, `showArchive`, `openReader`); restores reading progress on open.        |
| `js/events.js`           | Binds all UI event listeners (navigation, search, mode toggles, export controls, bookmarks, etc.). |
| `js/ui/home.js`          | Renders category cards on the home page.                                                            |
| `js/ui/search.js`        | Implements global search with scoring; results navigate to a text.                                  |
| `js/ui/reader.js`        | Renders reading content (poetry, prose, Q&A) and the export selection list.                        |
| `js/export/exportLogic.js`| Toggles selection of export units, select‑all, clear, and updates the selected count.              |
| `js/ui/customize.js`     | Builds the live preview in the Customise page, generates print‑ready HTML for PDF export.           |
| `js/ui/bookmarks.js`     | Bookmark toggling, panel management, and rendering of the bookmark list.                            |
| `js/export/download.js`  | Handles download of DOCX, Markdown, clipboard; triggers PDF via print.                              |
| `js/utils/progress.js`   | Tracks scroll progress and saves it to localStorage.                                                |
| `js/utils/storage.js`    | Simple localStorage helpers for bookmarks and progress.                                             |
| `js/utils/dom.js`        | Utilities: `escapeHtml`, `downloadBlob`, `showToast`.                                               |

### 3.2. Flow Diagram (High Level)

```
User action → events.js → router.js / actions.js
                           ↓
                   Update store.state
                           ↓
        UI modules re‑render (home, reader, customize)
                           ↓
                   Export → download.js → generate file
```

---

## 4. Data Model

### 4.1. Top‑Level Structure (`mutoon-data.json`)

```json
{
  "metadata": { "version": "...", "lastUpdated": "...", "totalTexts": ... },
  "categories": {
    "categoryId": {
      "label": "Display name",
      "title": "Page title",
      "description": "Short description",
      "icon": "emoji or HTML entity",
      "texts": [ ... ]
    }
  }
}
```

### 4.2. Text Object Structure

Each text can be one of four types:

| Type               | Fields                                                                                                                                                                |
|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **poetry**         | `type: "poetry"`, `content: [ { lineNum, arabic, english, footnotes: [ { text } ] } ]`                                                                                |
| **prose_continuous**| `type: "prose_continuous"`, `blocks: [ { id, arabic, english, footnotes } ]`                                                                                          |
| **prose_chaptered** | `type: "prose_chaptered"`, `chapters: [ { titleAr, titleEn, blocks: [ { id, arabic, english, footnotes } ] } ]`                                                      |
| **qa**              | `type: "qa"`, `units: [ { id, questionAr, questionEn, answerAr, answerEn, footnotes } ]`                                                                             |

All texts also include `id`, `nameAr`, `nameEn`, `author`, `structure` (human‑readable), and `keywords` (array).

### 4.3. Export Units

For export purposes, each text is broken down into **units**:
- Poetry: one unit per line
- Prose (continuous/chaptered): one unit per block
- Q&A: one unit per question‑answer pair

Each unit has an `id`, `label`, `arabic`, `english`, and `footnotes` array.

---

## 5. Features in Detail

### 5.1. Home Page
- Displays category cards with icons, labels, descriptions, and text counts.
- Global search bar (scored search on title, author, keywords, category label/description).
- Clicking a category navigates to the archive view.

### 5.2. Archive View
- Lists all texts in a category, showing Arabic/English names, author, and structure pill.
- Each item shows a progress bar (based on stored reading progress).
- Clicking a text opens the reader.

### 5.3. Reader
- **Reading mode**: Displays the text with Arabic and English, respecting the selected lens (both, Arabic only, English only). Footnotes appear inline (as styled blocks) below each unit.
- **Export mode**: Shows a list of all units with checkboxes. Users can select/deselect units individually or use “Select all” / “Clear”.
- **Bookmark**: Toggles bookmark for the current text.
- **Lens selector**: `both`, `arabic`, `english`.
- **Progress bar**: Updates on scroll and persists.

### 5.4. Customise Page
- Accessed from the reader’s Export mode (“Proceed to styling”).
- Provides options:
  - Layout: parallel columns, interleaved, Arabic only, English only
  - Footnote placement: inline, endnotes, none
  - Download format: PDF (print), DOCX, Markdown, clipboard
- Live preview updates immediately.
- The download button generates the file or opens the print dialog.

### 5.5. Bookmarks Panel
- Accessible via topbar button or keyboard shortcut (Ctrl/Cmd + B).
- Shows saved texts with title, author, and date.
- Clicking a bookmark opens the text.

---

## 6. Known Issues & Limitations

| Issue                                                                                       | Severity | Suggested Fix                                                                                     |
|---------------------------------------------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------|
| `search.js` uses `openReader` but does not import it – causes runtime error.                | **High** | Add `import { openReader } from '../navigation/router.js';` at the top of `search.js`.            |
| Duplicated logic for building export units in `reader.js` (`getExportUnits`) and `customize.js` (`getSelectedUnits`). | Medium   | Extract to a shared module (e.g., `export/exportHelpers.js`) and import in both places.           |
| PDF export via `window.print()` manipulates DOM elements (hides/shows) – fragile if user navigates while print dialog is open. | Medium   | Rely on the print stylesheet already present; simply show `#print-content` and call `print()`.   |
| Search does not scan the actual text content (only title, author, keywords, category).      | Low      | Extend search to traverse all units and score matches (implementation detail).                   |
| `footnotesMode: 'none'` is not explicitly short‑circuited; still processes `fns`.           | Low      | Add a condition to skip footnote processing when `none` is selected.                             |
| Clipboard copy may fail on non‑HTTPS or if permissions are denied; no fallback.             | Low      | Implement a fallback using `document.execCommand('copy')` if `navigator.clipboard` fails.        |

---

## 7. Recommendations for Future Improvement

### 7.1. Code Quality & Maintenance
- **Unify export unit generation** – create `export/exportHelpers.js` with a single `getAllUnits(text)` function, used by both reader and customize.
- **Add TypeScript or JSDoc** for better type safety and IDE support.
- **Unit tests** for critical functions like `getAllUnits`, `generateMarkdown`, etc.
- **Error handling** – improve user feedback when `mutoon-data.json` fails to load (currently a console warning and fallback).

### 7.2. Performance & UX
- **Virtual scrolling** for large texts (e.g., very long poems) to avoid rendering thousands of elements.
- **Full‑text search** with highlighting of matches.
- **Search autocomplete/suggestions** as the user types.
- **Pagination** for archive lists if a category has many texts.

### 7.3. Export Enhancements
- **PDF generation** using a library like `html2pdf.js` or `jsPDF` for more reliable output than print styles.
- **DOCX** using a proper library (`docx` npm package) for better formatting.
- **Export all units** without selection (select‑all by default).
- **Customisable export filename**.
- **Support for exporting footnotes as true footnotes (at page bottom) in PDF/DOCX**.

### 7.4. Feature Additions
- **User accounts** to sync bookmarks/progress across devices.
- **Annotations/highlights** per text.
- **Shareable links** to specific texts or units.
- **Batch import** of texts via a simple admin interface or JSON upload.
- **Dark mode** support.

### 7.5. Build & Deployment
- Use a bundler (Vite, Webpack) to minify and bundle assets.
- Implement a service worker for offline reading.
- Set up a CI/CD pipeline for automatic deployment.

---

## 8. Developer Setup

### 8.1. Prerequisites
- A modern web browser (Chrome, Firefox, Edge).
- Any static file server (e.g., Python `http.server`, Node `serve`, or PHP built‑in server).

### 8.2. Running Locally
```bash
# Clone the repository (if applicable)
cd mutoon-website

# Start a local server (example with Python)
python3 -m http.server 8000

# Or with Node's serve
npx serve .

# Open http://localhost:8000 in a browser.
```

### 8.3. Data Customisation
- Edit `mutoon-data.json` to add/remove/modify texts. The data structure must match the schema described above.
- If `mutoon-data.json` is missing, the fallback embedded data (in `dataLoader.js`) will be used.

---

## 9. Licensing

_This section should be filled with the appropriate license information for the project (e.g., MIT, GPL, or proprietary)._

---

## 10. Contact & Contribution

If you are extending or maintaining this project, please update this document as changes occur to keep the reference accurate.

---

**End of document**