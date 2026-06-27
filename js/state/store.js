// Generated module
const store = {
  state: {
    currentArchive: null,
  currentText: null,
  currentMode: 'reading',    // 'reading' | 'export'
  currentLens: 'both',       // 'both' | 'arabic' | 'english'
  selectedExportIds: new Set()
  },
  setState(partial) { Object.assign(this.state, partial); }
};

export { store };
