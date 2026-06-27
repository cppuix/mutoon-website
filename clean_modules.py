#!/usr/bin/env python3
"""Fix import paths: add '../' prefix for modules in subdirectories."""
import os
import re

JS_DIR = "js"
FIXED = 0

for root, dirs, files in os.walk(JS_DIR):
    for fname in files:
        if not fname.endswith(".js"):
            continue
        path = os.path.join(root, fname)

        # Calculate how deep this file is relative to js/
        rel_dir = os.path.relpath(root, JS_DIR)
        if rel_dir == ".":
            depth = 0
        else:
            depth = rel_dir.count(os.sep) + 1

        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        original = content

        if depth > 0:
            prefix = "../" * depth
            # Fix import paths that start with './' — they need the depth prefix
            # e.g., import { X } from './ui/home.js' -> import { X } from '../ui/home.js'
            # But also: import { X } from './state/store.js' -> import { X } from '../state/store.js'
            content = re.sub(
                r"from '\./([^']+)'",
                lambda m: f"from '{prefix}{m.group(1)}'",
                content
            )

        if content != original:
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            FIXED += 1
            print(f"Fixed imports in: {path}")

print(f"\nFixed {FIXED} files. Reload and test.")
