# Mutoon.com — The Foundational Text Digital Library

A single‑page application for browsing, reading, and exporting classical Islamic *mutoon* (foundational texts) with parallel Arabic‑English display, bookmarks, reading progress, and flexible export options.

![Mutoon.com screenshot](screenshot.png) *(add a screenshot if available)*

---

## 📖 Features

- **Browse** texts by category (ʿAqeedah, Hadith, Fiqh, Language, etc.)
- **Search** by title, author, keywords, or category with smart scoring
- **Read** with a language lens: Arabic only, English only, or both
- **Track progress** – automatically saves your scroll position per text
- **Bookmark** texts for quick access (keyboard shortcut: `Ctrl/Cmd + B`)
- **Select** specific units (poetry lines, prose blocks, Q&A pairs) for export
- **Export** in multiple formats:
  - PDF (via browser print)
  - DOCX (HTML‑based)
  - Markdown
  - Plain text (copy to clipboard)
- **Customise exports**:
  - Layout: parallel columns, interleaved, Arabic‑only, English‑only
  - Footnoting: inline, endnotes, or none
- **Responsive** design – works on desktop and mobile

---

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES Modules) – no frameworks
- **Styling**: Custom CSS with flexbox/grid and a print stylesheet
- **Data**: JSON (loaded via `fetch`)
- **Persistence**: `localStorage` for bookmarks and reading progress
- **Fonts**: Libre Baskerville (English), Noto Naskh Arabic

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- A static file server (e.g., Python `http.server`, Node `serve`)

### Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/yourusername/mutoon-website.git
   cd mutoon-website
   ```

2. Start a local server:
   ```bash
   # With Python 3
   python3 -m http.server 8000

   # Or with Node's serve
   npx serve .
   ```

3. Open `http://localhost:8000` in your browser.

### Data
- The application looks for `mutoon-data.json` in the project root.
- If the file is not present, it falls back to embedded demo texts (several short classics).
- You can edit or replace `mutoon-data.json` to add your own texts – see *Data Structure* below.

---

## 📁 Data Structure

`mutoon-data.json` follows this schema:

```json
{
  "metadata": { "version": "...", "lastUpdated": "...", "totalTexts": 0 },
  "categories": {
    "categoryId": {
      "label": "Display Name",
      "title": "Page Title",
      "description": "Short description",
      "icon": "📖",
      "texts": [
        {
          "id": "text-id",
          "nameAr": "العربية",
          "nameEn": "English Title",
          "author": "Author Name",
          "structure": "e.g., Continuous Prose — Fundamentals of Faith",
          "type": "poetry | prose_continuous | prose_chaptered | qa",
          "keywords": ["keyword1", "keyword2"],
          // plus type‑specific fields:
          // poetry: "content": [ { "lineNum": 1, "arabic": "...", "english": "...", "footnotes": [{"text": "..."}] } ]
          // prose_continuous: "blocks": [ { "id": "block-1", "arabic": "...", "english": "...", "footnotes": [...] } ]
          // prose_chaptered: "chapters": [ { "titleAr": "...", "titleEn": "...", "blocks": [...] } ]
          // qa: "units": [ { "id": "qa-1", "questionAr": "...", "questionEn": "...", "answerAr": "...", "answerEn": "...", "footnotes": [...] } ]
        }
      ]
    }
  }
}
```

See the included `mutoon-data.json` for concrete examples.

---

## Development

### Project Structure

```
mutoon-website/
├── index.html               # Main entry
├── mutoon-data.json         # Data (optional, fallback if missing)
├── js/
│   ├── app.js               # Initialisation
│   ├── state/
│   │   ├── store.js         # Central state
│   │   └── actions.js       # State mutators
│   ├── data/
│   │   └── dataLoader.js    # Loads JSON or fallback
│   ├── navigation/
│   │   └── router.js        # Page navigation
│   ├── ui/
│   │   ├── home.js          # Category cards
│   │   ├── search.js        # Global search
│   │   ├── reader.js        # Reading & export list
│   │   ├── customize.js     # Export preview
│   │   └── bookmarks.js     # Bookmarks panel
│   ├── export/
│   │   ├── exportLogic.js   # Selection management
│   │   └── download.js      # File generation
│   └── utils/
│       ├── dom.js           # DOM helpers
│       ├── progress.js      # Scroll tracking
│       └── storage.js       # localStorage wrappers
```

### Adding a new text type
- Extend `reader.js` (render function) and `customize.js` (unit builder) to support the new type.
- Ensure the data schema is consistent.

### Modifying styles
- Custom properties are in `:root` inside `index.html`.
- Print styles are at the end of the `<style>` block.

### Code style
- Use ES modules (`import`/`export`).
- Keep functions pure where possible.
- Use `store.state` for global state.

---

## Known Issues

- **Search**: Does not search inside the actual text content (only title, author, keywords, category). – **Low priority**.
- **PDF export**: Uses `window.print()` and DOM manipulation – sometimes restores state after print; better to rely on print stylesheet. – **Medium priority**.
- **Clipboard copy**: May fail on non‑HTTPS; no fallback. – **Low priority**.
- **Duplicate logic**: Unit building for export is duplicated in `reader.js` and `customize.js`; could be refactored. – **Medium priority**.

> Full details and recommendations can be found in `CONTEX.md`.

---

**Happy reading and studying!**