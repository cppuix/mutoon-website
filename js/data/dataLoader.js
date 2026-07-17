// Generated module
import { buildHomeCategories } from '../ui/home.js';
import { store } from '../state/store.js';

store.state.library = {};
store.state.dataLoaded = false;

async function loadData() {
  try {
    const response = await fetch('./mutoon-data.json');
    if (!response.ok) throw new Error('Failed to load data');
    const data = await response.json();
    store.state.library = data.categories;
    store.state.dataLoaded = true;
    buildHomeCategories();
    return true;
  } catch (err) {
    console.warn('Could not load mutoon-data.json, using embedded fallback:', err.message);
    store.state.library = getFallbackData();
    store.state.dataLoaded = true;
    buildHomeCategories();
    return false;
  }
}

function getFallbackData() {
  return {
    hadith: {
      label: "Hadith & Mustalah",
      title: "Foundational Texts in Hadith & Mustalah",
      description: "Prophetic narrations, sciences of hadith classification",
      icon: "🔍",
      texts: [
        {
          id: "bayquniyyah",
          nameAr: "الْمَنْظُومَةُ الْبَيْقُونِيَّة",
          nameEn: "Al-Manẓūmah al-Bayqūniyyah",
          author: "Ṭāhā al-Bayqūnī",
          structure: "Classical Rhymed Poetry — 34 Couplets",
          type: "poetry",
          keywords: ["mustalah", "hadith terminology", "poem", "bayquniyyah"],
          content: [
            { lineNum: 1, arabic: "أَبْدَأُ بِالْحَمْدِ مُصَلِّيًا عَلَى\nمُحَمَّدٍ خَيْرِ نَبِيٍّ أُرْسِلَا", english: "I begin with praise, sending blessings upon\nMuhammad, the best of Prophets ever sent.", footnotes: [] },
            { lineNum: 2, arabic: "وَذِي مِنْ أَقْسَامِ الْحَدِيثِ عِدَّةٌ\nوَكُلُّ وَاحِدٍ أَتَى وَحَدَّهُ", english: "And this poem comprises a number of hadith categories,\nAnd each one comes with its definition.", footnotes: [] },
            { lineNum: 3, arabic: "أَوَّلُهَا الصَّحِيحُ وَهُوَ مَا اتَّصَلْ\nإِسْنَادُهُ وَلَمْ يَشُذَّ أَوْ يُعَلّ", english: "The first of them is the Ṣaḥīḥ (Authentic), and it is that whose\nChain is continuous, not anomalous nor defective.", footnotes: [{ text: "Shudhūdh: contradicting more reliable narrators. 'Illah: hidden defect." }] },
            { lineNum: 4, arabic: "يَرْوِيهِ عَدْلٌ ضَابِطٌ عَنْ مِثْلِهِ\nمُعْتَمَدٌ فِي ضَبْطِهِ وَنَقْلِهِ", english: "Narrated by an upright, precise transmitter from one like him,\nReliable in his precision and transmission.", footnotes: [] },
            { lineNum: 5, arabic: "وَالْحَسَنُ الْمَعْرُوفُ طُرْقًا وَغَدَتْ\nرِجَالُهُ لَا كَالصَّحِيحِ اشْتُهِرَتْ", english: "And the Ḥasan (Good) is that whose paths are well-known,\nThough its narrators are not as renowned as those of the Ṣaḥīḥ.", footnotes: [] }
          ]
        },
        {
          id: "nukhbat-al-fikar",
          nameAr: "نُخْبَةُ الْفِكَرِ",
          nameEn: "Nukhbat al-Fikar",
          author: "Ibn Ḥajar al-ʿAsqalānī",
          structure: "Continuous Prose — Hadith Terminology",
          type: "prose_continuous",
          keywords: ["mustalah", "hadith sciences", "ibn hajar"],
          blocks: [
            { id: "nukhba_01", arabic: "أَمَّا بَعْدُ، فَإِنَّ التَّصَانِيفَ فِي اصْطِلَاحِ أَهْلِ الْحَدِيثِ قَدْ كَثُرَتْ.", english: "To proceed: The works on the terminology of the people of hadith have become numerous.", footnotes: [] },
            { id: "nukhba_02", arabic: "فَسَأَلَنِي بَعْضُ الْإِخْوَانِ أَنْ أُلَخِّصَ لَهُمُ الْمُهِمَّ مِنْ ذَلِكَ.", english: "Some of the brothers asked me to summarize for them what is important from that.", footnotes: [{ text: "i.e., from the science of hadith terminology" }] }
          ]
        }
      ]
    },
    aqeedah: {
      label: "ʿAqeedah & Manhaj",
      title: "Foundational Texts in ʿAqeedah & Manhaj",
      description: "Theology, creed, and methodology texts",
      icon: "📖",
      texts: [
        {
          id: "thalaathat-al-usool",
          nameAr: "ثَلَاثَةُ الْأُصُولِ",
          nameEn: "Thalāthat al-Uṣūl",
          author: "Muḥammad ibn ʿAbd al-Wahhāb",
          structure: "Continuous Prose — Fundamentals of Faith",
          type: "prose_continuous",
          keywords: ["tawheed", "monotheism", "fundamentals", "three principles"],
          blocks: [
            { 
              id: "usool_01", 
              arabic: "اعْلَمْ رَحِمَكَ اللَّهُ أَنَّهُ يَجِبُ عَلَيْنَا تَعَلُّمُ أَرْبَعِ مَسَائِلَ.", 
              english: "Know, may Allah have mercy on you, that it is obligatory upon us to learn four matters.", 
              footnotes: [] 
            },
            { 
              id: "usool_02", 
              arabic: "الْأُولَى: الْعِلْمُ؛ وَهُوَ مَعْرِفَةُ اللَّهِ، وَمَعْرِفَةُ نَبِيِّهِ، وَمَعْرِفَةُ دِينِ الْإِسْلَامِ بِالْأَدِلَّةِ.", 
              english: "The first: Knowledge; which is knowing Allah, knowing His Prophet, and knowing the religion of Islam with its evidences.", 
              footnotes: [{ text: "i.e., knowledge of Allah's names, attributes, and actions" }] 
            },
            { 
              id: "usool_03",
              // Replaced hardcoded arabic with parts
              parts: [
                { type: "text", content: "وَالدَّلِيلُ قَوْلُهُ تَعَالَى: " },
                { type: "quran", surah: 103, ayah_start: 1, ayah_end: 3 },
                { type: "text", content: "" }
              ],
              english: "And the proof is the saying of the Most High: \"By time, indeed mankind is in loss, except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.\" [Sūrah al-ʿAṣr]",
              footnotes: [
                { text: "Sūrah al-ʿAṣr (103:1-3)" }
              ]
            }
          ]
        }
      ]
    },
    fiqh: {
      label: "Fiqh & Uṣūl",
      title: "Foundational Texts in Jurisprudence & Legal Theory",
      description: "Islamic law, legal maxims, and principles of jurisprudence",
      icon: "⚖️",
      texts: [
        {
          id: "al-waraqat",
          nameAr: "الْوَرَقَات",
          nameEn: "Al-Waraqāt",
          author: "Imām al-Ḥaramayn al-Juwaynī",
          structure: "Continuous Prose — Legal Theory",
          type: "prose_continuous",
          keywords: ["usul al-fiqh", "legal theory", "principles"],
          blocks: [
            { id: "waraqat_01", arabic: "هَذِهِ وَرَقَاتٌ تَشْتَمِلُ عَلَى مَعْرِفَةِ فُصُولٍ مِنْ أُصُولِ الْفِقْهِ.", english: "These are papers encompassing knowledge of chapters from the principles of jurisprudence.", footnotes: [{ text: "Uṣūl: the foundational principles; Fiqh: the derived rulings" }] }
          ]
        }
      ]
    },
    language: {
      label: "Language & Tools",
      title: "Language Sciences & Recitation Tools",
      description: "Arabic grammar, morphology, and tajwīd",
      icon: "🌿",
      texts: [
        {
          id: "al-ajurrumiyyah",
          nameAr: "الْآجُرُّومِيَّة",
          nameEn: "Al-Ājurrūmiyyah",
          author: "Ibn Ājurrūm al-Ṣanhājī",
          structure: "Continuous Prose — Arabic Grammar",
          type: "prose_continuous",
          keywords: ["nahw", "grammar", "arabic", "syntax"],
          blocks: [
            { id: "ajrum_01", arabic: "الْكَلَامُ: هُوَ اللَّفْظُ الْمُرَكَّبُ الْمُفِيدُ بِالْوَضْعِ.", english: "Speech: It is the compounded utterance that conveys a complete meaning according to convention.", footnotes: [{ text: "By convention (bi-l-waḍʿ) meaning: according to the established usage of the Arabs" }] }
          ]
        }
      ]
    }
  };
}

export { loadData, getFallbackData };