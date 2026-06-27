#!/usr/bin/env python3
"""
Refactor mutoon.js into a modular ES module architecture (robust parser).
Run: python3 refactor.py
"""

import re
import os
import shutil

SRC_FILE = "mutoon.js"
HTML_FILE = "index.html"
OUT_DIR = "js"

# ── Mapping: section number → output path → exported symbols ──
SECTION_MAP = {
    1: ("data/dataLoader.js", ["loadData", "getFallbackData"]),
    2: ("state/store.js", ["store"]),
    3: ("utils/storage.js", ["getBookmarks", "saveBookmarks", "getReadingProgress", "saveReadingProgress"]),
    4: ("navigation/router.js", ["showPage", "showArchive", "openReader"]),
    5: ("ui/home.js", ["buildHomeCategories"]),
    6: ("ui/reader.js", ["renderReadingContent", "renderFootnotes", "renderExportContent", "getExportUnits"]),
    7: ("state/actions.js", ["setMode", "updateLens", "applyLens"]),
    8: ("export/exportLogic.js", ["toggleExportUnit", "selectAllExport", "clearExport", "updateSelectedCount"]),
    9: ("ui/search.js", ["handleSearch"]),
    10: ("ui/bookmarks.js", ["toggleBookmark", "updateBookmarkButton", "toggleBookmarksPanel", "renderBookmarksList"]),
    11: ("utils/progress.js", ["updateReadingProgressBar"]),
    12: ("ui/customize.js", ["updateCustomizePreview", "updatePrintContent", "getSelectedUnits"]),
    14: ("export/download.js", ["handleDownload", "generateDocx", "generateMarkdown", "generateClipboardText"]),
    15: ("utils/dom.js", ["escapeHtml", "downloadBlob", "showToast"]),
    16: ("events.js", ["bindEvents"]),
    17: ("app.js", []),   # entry point – special treatment
}

# ── Dependencies: for each section, symbols needed from other modules ──
DEPENDENCIES = {
    1:  ["buildHomeCategories", "store"],
    2:  [],
    3:  [],
    4:  ["store", "getReadingProgress", "renderReadingContent", "renderExportContent",
          "setMode", "updateLens", "updateBookmarkButton", "getBookmarks",
          "saveBookmarks", "showToast", "updateReadingProgressBar"],
    5:  ["store"],
    6:  ["store", "escapeHtml"],
    7:  ["store"],
    8:  ["store", "updateSelectedCount"],
    9:  ["store", "escapeHtml", "showToast"],
    10: ["store", "getBookmarks", "saveBookmarks", "showToast", "openReader"],
    11: ["store", "saveReadingProgress"],
    12: ["store", "escapeHtml", "getSelectedUnits", "updatePrintContent"],
    14: ["store", "escapeHtml", "downloadBlob", "showToast", "getSelectedUnits"],
    15: [],
    16: ["handleSearch", "setMode", "updateLens", "selectAllExport", "clearExport",
          "toggleExportUnit", "updateCustomizePreview", "handleDownload",
          "toggleBookmark", "toggleBookmarksPanel", "updateBookmarkButton",
          "updateReadingProgressBar", "showPage", "showArchive", "openReader"],
    17: ["loadData", "bindEvents", "showToast", "renderBookmarksList", "store"],
}

# ─────────────────────────────────────────────────────────────
# 1. Extract sections from mutoon.js (line‑based scanner)
# ─────────────────────────────────────────────────────────────
with open(SRC_FILE, "r", encoding="utf-8") as f:
    lines = f.readlines()

sections = {}   # section_num -> list of lines (the code block)
current_section = None
current_block = []
in_section = False

# Pattern to detect a section header comment
section_start_re = re.compile(r'^\s*SECTION (\d+):')
# Pattern to detect the closing comment line (the last line of the header)
closing_line_re = re.compile(r'^\s*─+\s*\*/\s*$')

# We also need to skip the outer block comment that encloses the section title.
# The section title is inside a comment like:
# /* ───
#    SECTION X: …
#    ─── */

# We'll find the line that contains "SECTION X:" and then start collecting after the closing "*/" of that comment.
for i, line in enumerate(lines):
    if current_section is None:
        # Look for a line that contains "SECTION X:" and is inside a comment
        if section_start_re.search(line):
            # Find the section number
            num = int(section_start_re.search(line).group(1))
            # Now scan forward to find the closing line of this comment (──── */)
            j = i + 1
            while j < len(lines) and not closing_line_re.match(lines[j]):
                j += 1
            # The code starts right after the closing line
            if j + 1 < len(lines):
                current_section = num
                current_block = []
                # Start collecting from the next line
                # (We'll append lines from j+1 onwards)
                i = j  # Continue the outer loop from here
                continue
    else:
        # We are inside a section, check if we hit the next section start
        if section_start_re.search(line):
            # Save current block
            sections[current_section] = "".join(current_block).strip()
            # Start new section
            num = int(section_start_re.search(line).group(1))
            j = i
            while j < len(lines) and not closing_line_re.match(lines[j]):
                j += 1
            if j + 1 < len(lines):
                current_section = num
                current_block = []
                i = j
                continue
        else:
            # Still inside the same section
            current_block.append(line)

# Don't forget the last section
if current_section is not None:
    sections[current_section] = "".join(current_block).strip()

print(f"Found sections: {list(sections.keys())}")

# ─────────────────────────────────────────────────────────────
# 2. Prepare output directory
# ─────────────────────────────────────────────────────────────
if os.path.exists(OUT_DIR):
    shutil.rmtree(OUT_DIR)
os.makedirs(OUT_DIR, exist_ok=True)
for sub in ["data", "state", "navigation", "ui", "utils", "export"]:
    os.makedirs(os.path.join(OUT_DIR, sub), exist_ok=True)

# ─────────────────────────────────────────────────────────────
# 3. Helpers
# ─────────────────────────────────────────────────────────────
# Mapping from symbol to its module file (relative to js/)
symbol_module = {
    "loadData": "data/dataLoader.js",
    "getFallbackData": "data/dataLoader.js",
    "store": "state/store.js",
    "getBookmarks": "utils/storage.js",
    "saveBookmarks": "utils/storage.js",
    "getReadingProgress": "utils/storage.js",
    "saveReadingProgress": "utils/storage.js",
    "showPage": "navigation/router.js",
    "showArchive": "navigation/router.js",
    "openReader": "navigation/router.js",
    "buildHomeCategories": "ui/home.js",
    "renderReadingContent": "ui/reader.js",
    "renderFootnotes": "ui/reader.js",
    "renderExportContent": "ui/reader.js",
    "getExportUnits": "ui/reader.js",
    "setMode": "state/actions.js",
    "updateLens": "state/actions.js",
    "applyLens": "state/actions.js",
    "toggleExportUnit": "export/exportLogic.js",
    "selectAllExport": "export/exportLogic.js",
    "clearExport": "export/exportLogic.js",
    "updateSelectedCount": "export/exportLogic.js",
    "handleSearch": "ui/search.js",
    "toggleBookmark": "ui/bookmarks.js",
    "updateBookmarkButton": "ui/bookmarks.js",
    "toggleBookmarksPanel": "ui/bookmarks.js",
    "renderBookmarksList": "ui/bookmarks.js",
    "updateReadingProgressBar": "utils/progress.js",
    "updateCustomizePreview": "ui/customize.js",
    "updatePrintContent": "ui/customize.js",
    "getSelectedUnits": "ui/customize.js",
    "handleDownload": "export/download.js",
    "generateDocx": "export/download.js",
    "generateMarkdown": "export/download.js",
    "generateClipboardText": "export/download.js",
    "escapeHtml": "utils/dom.js",
    "downloadBlob": "utils/dom.js",
    "showToast": "utils/dom.js",
    "bindEvents": "events.js",
}

def build_imports(section_num, own_exports):
    """Generate import statements for a section."""
    needed = DEPENDENCIES.get(section_num, [])
    from collections import defaultdict
    by_module = defaultdict(set)
    for sym in needed:
        if sym in symbol_module:
            mod = symbol_module[sym]
            if mod:
                by_module[mod].add(sym)
    # Remove symbols that are exported by this same module (shouldn't import itself)
    for mod, syms in list(by_module.items()):
        syms -= set(own_exports)
        if not syms:
            del by_module[mod]

    imports = []
    for mod, syms in by_module.items():
        syms_str = ", ".join(sorted(syms))
        imports.append(f"import {{ {syms_str} }} from './{mod}';")
    return "\n".join(imports)

def adapt_code(code, section_num):
    """Replace global references with store.state.*."""
    # LIBRARY -> store.state.library
    code = code.replace("LIBRARY", "store.state.library")
    # STATE.current -> store.state.current (but we need to handle STATE.xxx -> store.state.xxx)
    code = code.replace("STATE.", "store.state.")
    code = code.replace("DATA_LOADED", "store.state.dataLoaded")
    # Remove global variable declarations (they will be handled by store)
    code = re.sub(r"let LIBRARY\s*=\s*\{\};?", "", code)
    code = re.sub(r"let DATA_LOADED\s*=\s*false;?", "", code)
    return code

# ─────────────────────────────────────────────────────────────
# 4. Write each module
# ─────────────────────────────────────────────────────────────
for sec_num, (rel_path, exports) in SECTION_MAP.items():
    code = sections.get(sec_num, "")
    if not code:
        print(f"Warning: no code for section {sec_num}")
        code = "// No code extracted"

    # Special handling for store (section 2) – convert STATE to store object
    if sec_num == 2:
        # Replace `const STATE = { ... };` with a proper store
        match = re.search(r"const STATE = \{([^}]*)\};", code, re.DOTALL)
        if match:
            inner = match.group(1).strip()
            # Build a store object
            store_code = f"""const store = {{
  state: {{
    {inner}
  }},
  setState(partial) {{ Object.assign(this.state, partial); }}
}};"""
            code = store_code
            exports = ["store"]

    code = adapt_code(code, sec_num)
    imports = build_imports(sec_num, exports)

    filepath = os.path.join(OUT_DIR, rel_path)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write("// Generated module\n")
        if imports:
            f.write(imports + "\n\n")
        f.write(code)
        if exports:
            exp_str = ", ".join(exports)
            f.write(f"\n\nexport {{ {exp_str} }};\n")

    print(f"Created {rel_path}")

# ─────────────────────────────────────────────────────────────
# 5. Create app.js (entry point) from section 17
# ─────────────────────────────────────────────────────────────
app_code = sections.get(17, "")
app_code = adapt_code(app_code, 17)
app_imports = build_imports(17, [])
# The original section 17 is an async IIFE. We'll keep it but wrap in module.
# Remove the outer `(async function init() { ... })();` so it just runs as module.
# But we want to keep the function logic; we can just export nothing and let it auto-execute.
# We'll replace the self-invocation with a direct call.
app_code = re.sub(r"\(async function init\(\) \{", "async function init() {", app_code)
app_code = re.sub(r"\}\)\(\);", "}\ninit();", app_code)

app_content = f"""// Entry point – initialisation
{app_imports}

{app_code}
"""

with open(os.path.join(OUT_DIR, "app.js"), "w", encoding="utf-8") as f:
    f.write(app_content)
print("Created app.js")

# ─────────────────────────────────────────────────────────────
# 6. Update index.html to use ES modules
# ─────────────────────────────────────────────────────────────
with open(HTML_FILE, "r", encoding="utf-8") as f:
    html = f.read()

new_script = '<script type="module" src="js/app.js"></script>'
html = html.replace('<script src="mutoon.js"></script>', new_script)

with open(HTML_FILE, "w", encoding="utf-8") as f:
    f.write(html)
print("Updated index.html")

print("\n✅ Refactoring complete. Open index.html in a browser (via local server) to test.")
