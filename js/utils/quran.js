// js/utils/quran.js
const cache = new Map();

export async function fetchQuran(surah, ayahStart, ayahEnd) {
  const key = `${surah}:${ayahStart}-${ayahEnd}`;
  if (cache.has(key)) return cache.get(key);

  try {
    const versePromises = [];
    for (let i = ayahStart; i <= ayahEnd; i++) {
      const url = `https://api.alquran.cloud/v1/ayah/${surah}:${i}/quran-uthmani`;
      versePromises.push(
        fetch(url).then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
      );
    }
    const results = await Promise.all(versePromises);
    const basmalah = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ';
    const verses = results.map((r, index) => {
      let text = r.data.text;
      // Remove Basmalah for surahs other than Al-Fatihah
      if (surah !== 1 && text.startsWith(basmalah)) {
        text = text.slice(basmalah.length);
      }
      return {
        number: ayahStart + index,
        text: text
      };
    });
    cache.set(key, verses);
    return verses;
  } catch (err) {
    console.error('Quran fetch error:', err);
    return [{ number: ayahStart, text: `[⚠️ تعذر تحميل الآية ${surah}:${ayahStart}-${ayahEnd}]` }];
  }
}

export function clearQuranCache() {
  cache.clear();
}