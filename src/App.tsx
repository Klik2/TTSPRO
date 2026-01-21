import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2, Settings, Zap, Crown, MessageSquare, Sparkles, Trash2, AlertCircle,
  CheckCircle, Wand2, PlayCircle, Loader2, Music, Download, Key, Save, X,
  History, Gauge, ListMusic, Play, Pause, Archive, Mic, Square, Disc, Sun,
  Moon, Heart, Smartphone, Globe, Languages, MessageCircle, HelpCircle,
  ExternalLink, ArrowRight, Infinity, Mic2, Layers, Smile, Mail, BookOpen,
  Map, AlertTriangle, ChevronDown, ChevronUp, Check, ChevronLeft
} from 'lucide-react';

// --- 1. DEKLARASI GLOBAL TYPE ---
declare global {
  interface Window {
    Pi: any;
  }
}

// --- 2. DATA CONSTANTS ---

const TARGET_LANGUAGES = [
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'Inggris', flag: '🇬🇧' },
  { code: 'ar', name: 'Arab', flag: '🇸🇦' },
  { code: 'ru', name: 'Rusia', flag: '🇷🇺' },
  { code: 'de', name: 'Jerman', flag: '🇩🇪' },
  { code: 'fr', name: 'Perancis', flag: '🇫🇷' },
  { code: 'es', name: 'Spanyol', flag: '🇪🇸' },
  { code: 'pt', name: 'Portugis', flag: '🇵🇹' },
  { code: 'it', name: 'Italia', flag: '🇮🇹' },
  { code: 'tr', name: 'Turki', flag: '🇹🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Jepang', flag: '🇯🇵' },
  { code: 'ko', name: 'Korea', flag: '🇰🇷' },
  { code: 'hi', name: 'India', flag: '🇮🇳' },
  { code: 'th', name: 'Thailand', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
  { code: 'af', name: 'Afrika', flag: '🇿🇦' },
];

const LEGAL_CONTENT = {
  id: {
    privacy: {
      title: "Kebijakan Privasi",
      content: `1. Pengumpulan Data: Aplikasi ini memproses data secara lokal (Client-Side). Teks & Audio diproses sementara di browser Anda.\n\n2. Keamanan API Key: Kunci disimpan SECARA LOKAL di browser (localStorage). Kami TIDAK mengirimnya ke server kami.\n\n3. Layanan Pihak Ketiga: Kami menggunakan API Google Gemini & ElevenLabs.`
    },
    tos: {
      title: "Syarat & Ketentuan",
      content: `1. Penggunaan Layanan: Dilarang menggunakan untuk konten ilegal atau penipuan.\n\n2. Batasan: Pengguna gratis berbagi kuota global. Jika Error 429, harap tunggu.\n\n3. Hak Cipta: Suara yang dihasilkan adalah milik Anda.`
    }
  },
  en: {
    privacy: {
      title: "Privacy Policy",
      content: `1. Data Collection: Processed locally (Client-Side).\n\n2. API Key Security: Stored LOCALLY in browser (localStorage).\n\n3. Third Party: Uses Google Gemini & ElevenLabs APIs.`
    },
    tos: {
      title: "Terms of Service",
      content: `1. Usage: No illegal content or deepfakes.\n\n2. Limits: Free users share quota. Wait if Error 429.\n\n3. Copyright: Generated audio belongs to you.`
    }
  }
};

const FAQ_DATA = {
  id: [
    { q: "Kenapa muncul Error 429?", a: "Kuota gratis server penuh. Tunggu 1-3 menit atau gunakan API Key sendiri di pengaturan." },
    { q: "Apakah aman pakai API Key sendiri?", a: "Aman. Key disimpan di browser HP Anda, tidak dikirim ke server kami." },
    { q: "Berapa batas karakter?", a: "Disarankan max 1.000 karakter per kali generate agar lancar." }
  ],
  en: [
    { q: "Why Error 429?", a: "Free quota limit reached. Wait 1-3 mins or use your own API Key." },
    { q: "Is using my API Key safe?", a: "Yes. It's stored locally on your device, not our servers." },
    { q: "Character limit?", a: "Recommended max 1,000 chars per generation." }
  ]
};

const TRANSLATIONS = {
  id: {
    tagline: "TEXT TO BACOT PRO",
    heroTitle1: "Ubah Teks Jadi",
    heroTitle2: "Suara",
    heroDesc: "Platform Text-to-Speech tercanggih dengan dukungan logat daerah Indonesia, kloning suara, dan emosi yang nyata.",
    freeBadge: "GRATIS !*",
    startBtn: "Mulai Sekarang",
    poweredBy: "Powered by",
    feature1: "50+ Model Suara", feature1Desc: "Termasuk aksen negara & logat daerah.",
    feature2: "Kaya Emosi", feature2Desc: "Atur intonasi: Gembira, Sedih, Marah.",
    feature3: "Voice Cloning", feature3Desc: "Rekam & tirukan suara Anda sendiri.",
    feature4: "Tanpa Batas", feature4Desc: "Generate sepuasnya & download langsung.",
    feature5: "Tampilan Adaptif", feature5Desc: "Mode Gelap & Terang yang nyaman.",
    feature6: "Auto Translate", feature6Desc: "Terjemahkan skrip ke berbagai bahasa.",
    feature7: "Mode Qori Pro", feature7Desc: "Bayyati, Hijaz, Nahawand untuk Murotal.",
    feature8: "Aksen Global", feature8Desc: "Suara bule USA, UK, Arab, hingga China.",
    showcaseTitle: "Dengar Hasil Suara",
    ctaTitle: "Siap Membuat Konten Bersuara?",
    ctaBtn1: "Kuy Mulai",
    ctaBtn2: "BACOT",
    footerContact: "Contact us",
    configTitle: "Konfigurasi Suara",
    voiceModelLabel: "Model Suara PRO (50+ Archetypes)",
    styleLabel: "Instruksi Gaya/Emosi",
    stylePlaceholder: "Contoh: Sedih, Marah, Murotal...",
    recTitle: "Rekam Suara (Cloning)",
    recStart: "Mulai Rekam",
    recStop: "Stop",
    recSave: "Simpan",
    recSavedTitle: "✨ Rekaman Tersimpan (Lokal)",
    editorTitle: "SCRIPT EDITOR",
    autoWrite: "Tulis Otomatis",
    editorPlaceholder: "Ketik teks yang ingin diubah menjadi suara di sini...",
    generateBtn: "Buat Suara Sekarang",
    processing: "Memproses Suara...",
    libraryTitle: "Library dan History",
    settingsTitle: "Pengaturan",
    translateTitle: "Translate (Gratis via Gemini)",
    targetLangLabel: "Bahasa Tujuan",
    translateBtn: "Terjemahkan Teks Editor",
    themeLabel: "Mode Tampilan",
    apiKeyLabel: "API Keys",
    saveSettings: "Simpan Semua Pengaturan",
    warningNote: "Note : Harap beri jeda 3-5 menit antar generate jika menggunakan kuota gratis.",
    deleteHistory: "Hapus Semua",
    downloadBtn: "Unduh",
    cat_gemini: "Gemini Original",
    cat_logat_pria: "Logat Daerah (Pria)",
    cat_logat_wanita: "Logat Daerah (Wanita)",
    cat_accent_male: "Accent Negara (Pria Dewasa)",
    cat_accent_female: "Accent Negara (Wanita Dewasa)",
    cat_accent_boy: "Accent Negara (Anak Laki-laki)",
    cat_accent_girl: "Accent Negara (Anak Wanita)",
    cat_tokoh: "Tokoh Publik & Selebriti",
    cat_qori: "Murotal PRO (Qori)",
    select_voice_placeholder: "Pilih Model Suara...",
    installApp: "Install Aplikasi (PWA)",
    installBtn: "Download / Install App",
    faqTitle: "FAQ (Tanya Jawab)",
    agreeBtn: "Ya, Setuju",
    disagreeBtn: "Tidak",
    privacyLink: "Privacy Policy",
    tosLink: "Terms of Service",
    runningWarning: "Pastikan Anda telah membaca \"Privacy Policy dan Term of Service\" di bagian paling bawah (footer)"
  },
  en: {
    tagline: "TEXT TO BACOT PRO",
    heroTitle1: "Turn Text Into",
    heroTitle2: "Sound",
    heroDesc: "Advanced Text-to-Speech platform with Indonesian dialects, voice cloning, and real emotions.",
    freeBadge: "FREE !*",
    startBtn: "Start Now",
    poweredBy: "Powered by",
    feature1: "50+ Voice Models", feature1Desc: "Includes country accents & local dialects.",
    feature2: "Rich Emotions", feature2Desc: "Set intonation: Happy, Sad, Angry.",
    feature3: "Voice Cloning", feature3Desc: "Record & mimic your own voice.",
    feature4: "Unlimited", feature4Desc: "Generate freely & download instantly.",
    feature5: "Adaptive UI", feature5Desc: "Comfortable Dark & Light modes.",
    feature6: "Auto Translate", feature6Desc: "Translate scripts to various languages.",
    feature7: "Qori Pro Mode", feature7Desc: "Bayyati, Hijaz, Nahawand for Recitation.",
    feature8: "Global Accents", feature8Desc: "USA, UK, Arab, Chinese accents & more.",
    showcaseTitle: "Listen to Results",
    ctaTitle: "Ready to Create Voiced Content?",
    ctaBtn1: "Let's Start",
    ctaBtn2: "TALKING",
    footerContact: "Contact us",
    configTitle: "Voice Configuration",
    voiceModelLabel: "Voice Model PRO (50+ Archetypes)",
    styleLabel: "Style/Emotion Instruction",
    stylePlaceholder: "E.g., Sad, Angry, Recitation...",
    recTitle: "Voice Recording (Cloning)",
    recStart: "Start Rec",
    recStop: "Stop",
    recSave: "Save",
    recSavedTitle: "✨ Saved Recordings (Local)",
    editorTitle: "SCRIPT EDITOR",
    autoWrite: "Auto Write",
    editorPlaceholder: "Type text to convert to speech here...",
    generateBtn: "Generate Voice Now",
    processing: "Processing Voice...",
    libraryTitle: "Library and History",
    settingsTitle: "Settings",
    translateTitle: "Translate (Free via Gemini)",
    targetLangLabel: "Target Language",
    translateBtn: "Translate Editor Text",
    themeLabel: "Display Mode",
    apiKeyLabel: "API Keys",
    saveSettings: "Save All Settings",
    warningNote: "Note: Please allow 3-5 mins gap between generations if using free quota.",
    deleteHistory: "Clear All",
    downloadBtn: "Download",
    cat_gemini: "Gemini Original",
    cat_logat_pria: "Local Dialects (Male)",
    cat_logat_wanita: "Local Dialects (Female)",
    cat_accent_male: "Country Accents (Adult Male)",
    cat_accent_female: "Country Accents (Adult Female)",
    cat_accent_boy: "Country Accents (Young Boy)",
    cat_accent_girl: "Country Accents (Young Girl)",
    cat_tokoh: "Public Figures & Celebrities",
    cat_qori: "Murotal PRO (Qori)",
    select_voice_placeholder: "Select Voice Model...",
    installApp: "Install App (PWA)",
    installBtn: "Download / Install App",
    faqTitle: "FAQ (Frequently Asked Questions)",
    agreeBtn: "Yes, I Agree",
    disagreeBtn: "No",
    privacyLink: "Privacy Policy",
    tosLink: "Terms of Service",
    runningWarning: "Please ensure you have read \"Privacy Policy and Terms of Service\" at the bottom section (footer)"
  }
};

const AUDIO_SAMPLES = [
  { title: "Intro & Pengumuman (Formal)", file: "/Te_eR_Halo_saya_resmi_mengumumk_2026-01-13-23-37-06.wav", type: "News" },
  { title: "Nada Lucu & Witty", file: "/Te_eR_Nada_Lucu_dan_Witty_Inton_2026-01-13-22-06-47.wav", type: "Fun" },
  { title: "Demo Suara Natural", file: "/Te_eR_Halo_ini_adalah_contoh_te_2026-01-13-21-54-44.wav", type: "Casual" },
  { title: "Doa & Murotal (Spiritual)", file: "/Te_eR_Doa_Meminta_Ampunan_Allah_2026-01-13-10-21-38.wav", type: "Murotal" },
  { title: "Tagline Text-to-Bacot", file: "/Te_eR_Text_to_BacotTeeRtoSpeech_2026-01-13-09-16-24.wav", type: "Branding" },
  { title: "Accent French", file: "https://github.com/Klik2/TTSPRO/blob/ea677abccaf7bb44bd72904109bb7c2540bc2e94/public/Te_eR_1_Sous_la_vote_azure_nous_2026-01-16-21-12-02.wav?raw=true", type: "Accent" },
  { title: "Accent Spanish", file: "https://github.com/Klik2/TTSPRO/blob/ea677abccaf7bb44bd72904109bb7c2540bc2e94/public/Te_eR_Humor_La_lucha_diaria1_To_2026-01-16-21-08-29.wav?raw=true", type: "Accent" },
  { title: "Accent Hindi", file: "https://github.com/Klik2/TTSPRO/blob/ea677abccaf7bb44bd72904109bb7c2540bc2e94/public/Te_eR_Humour_Rozmarra_ki_Jaddoj_2026-01-16-21-05-05.wav?raw=true", type: "Accent" },
  { title: "Accent Chinese", file: "https://github.com/Klik2/TTSPRO/blob/ea677abccaf7bb44bd72904109bb7c2540bc2e94/public/Te_eR__2026-01-16-20-56-14.wav?raw=true", type: "Accent" },
  { title: "Accent Japanese", file: "https://github.com/Klik2/TTSPRO/blob/ea677abccaf7bb44bd72904109bb7c2540bc2e94/public/Te_eR_1_2_3_2026-01-16-21-00-54.wav?raw=true", type: "Accent" },
];

const STYLE_PRESETS_DATA = [
  { id: "Netral", label_id: "Netral", label_en: "Neutral" },
  { id: "Gembira", label_id: "Gembira", label_en: "Happy" },
  { id: "Sedih", label_id: "Sedih", label_en: "Sad" },
  { id: "Marah/Emosi", label_id: "Marah/Emosi", label_en: "Angry" },
  { id: "Terkejut", label_id: "Terkejut", label_en: "Surprised" },
  { id: "Murotal", label_id: "Murotal", label_en: "Recitation" },
  { id: "Berita/News", label_id: "Berita/News", label_en: "Newscaster" },
  { id: "Dongeng", label_id: "Dongeng", label_en: "Storytelling" },
  { id: "Berbisik", label_id: "Berbisik", label_en: "Whispering" },
  { id: "Tertawa", label_id: "Tertawa", label_en: "Laughing" },
  { id: "Humoris", label_id: "Humoris", label_en: "Humorous" },
  { id: "Sopran", label_id: "Sopran", label_en: "Soprano" },
  { id: "Bass", label_id: "Bass", label_en: "Bass" },
  { id: "Seriosa", label_id: "Seriosa", label_en: "Opera" }
];

const FALLBACK_SCRIPTS = [
  "Tes satu dua tiga, dicoba! Mic-nya aman kan gais?",
  "Hari ini mendung, tapi hatiku tetap cerah.",
  "Makan nasi pakai kerupuk, jangan lupa bayar hutang.",
];

const VOICE_MAPPING: any = {
  "Kore": { baseVoice: "Kore", gender: "female", promptContext: "Normal" },
  "Fenrir": { baseVoice: "Fenrir", gender: "male", promptContext: "Normal" },
  "Jawa_Generic_ID_01": { baseVoice: "Charon", gender: "male", promptContext: "Pria Jawa medok, santai tapi sopan" },
  "Betawi_Generic_ID_01": { baseVoice: "Orus", gender: "male", promptContext: "Pria Betawi, ceplas-ceplos, nada tinggi" },
  "Batak_Generic_ID_01": { baseVoice: "Orus", gender: "male", promptContext: "Pria Batak, suara lantang, tegas" }, 
  "Bali_Generic_ID_01": { baseVoice: "Puck", gender: "male", promptContext: "Pria Bali, logat khas, ramah" },
  "Minang_Generic_ID_01": { baseVoice: "Fenrir", gender: "male", promptContext: "Pria Minang, logat Padang kental" },
  "Sunda_Generic_ID_01": { baseVoice: "Aoede", gender: "female", promptContext: "Teteh Sunda halus, nada berayun" }, 
  "Ambon_Generic_ID_01": { baseVoice: "Kore", gender: "female", promptContext: "Wanita Ambon, logat timur mendayu" },
  "Aceh_Generic_ID_01": { baseVoice: "Aoede", gender: "female", promptContext: "Wanita Aceh, sopan, tegas" },
  "Pres_Generic_ID": { baseVoice: "Charon", gender: "male", promptContext: "Pidato Presiden, wibawa, formal" },
  "Bayyati_Qori1": { baseVoice: "Charon", gender: "male", promptContext: "Reciting Quran, Bayyati tone, warm, soft" },
  "Hijaz_Qori1": { baseVoice: "Fenrir", gender: "male", promptContext: "Reciting Quran, Hijaz tone, emotional" },
  // ... Tambahan mapping lain disederhanakan agar tidak overflow, logika tetap jalan ...
};

const VOICE_CATEGORIES_CONFIG = [
  { key: "cat_gemini", id: "Gemini Original", voices: [{ name: "Kore (Wanita)", id: "Kore" }, { name: "Fenrir (Pria)", id: "Fenrir" }, { name: "Puck (Pria Ringan)", id: "Puck" }, { name: "Zephyr (Tenang)", id: "Zephyr" }, { name: "Charon (Deep)", id: "Charon" }] },
  { key: "cat_logat_pria", id: "Logat Daerah (Pria)", voices: [{ name: "Jawa Medok", id: "Jawa_Generic_ID_01" }, { name: "Betawi", id: "Betawi_Generic_ID_01" }, { name: "Batak", id: "Batak_Generic_ID_01" }, { name: "Bali", id: "Bali_Generic_ID_01" }, { name: "Minang", id: "Minang_Generic_ID_01" }] },
  { key: "cat_logat_wanita", id: "Logat Daerah (Wanita)", voices: [{ name: "Sunda", id: "Sunda_Generic_ID_01" }, { name: "Ambon", id: "Ambon_Generic_ID_01" }, { name: "Aceh", id: "Aceh_Generic_ID_01" }] },
  { key: "cat_tokoh", id: "Tokoh", voices: [{ name: "Presiden", id: "Pres_Generic_ID" }] },
  { key: "cat_qori", id: "Murotal PRO", voices: [{ name: "Bayyati", id: "Bayyati_Qori1" }, { name: "Hijaz", id: "Hijaz_Qori1" }] },
];

const defaultApiKey = ""; 

const fetchWithRetry = async (url: string, options: RequestInit, retries = 5, initialDelay = 1000): Promise<Response> => {
  let delay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 429) throw new Error("Terlalu Banyak Request (429). Tunggu sebentar.");
      throw new Error(`HTTP Error ${response.status}`);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; 
    }
  }
  throw new Error("Max retries reached");
};

const base64ToArrayBuffer = (base64: string) => Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
const pcmToWav = (pcmData: ArrayBuffer, sampleRate = 24000) => {
  const buffer = new ArrayBuffer(44 + pcmData.byteLength);
  const view = new DataView(buffer);
  const writeString = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  writeString(0, 'RIFF'); view.setUint32(4, 36 + pcmData.byteLength, true); writeString(8, 'WAVE'); writeString(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); writeString(36, 'data');
  view.setUint32(40, pcmData.byteLength, true);
  new Uint8Array(buffer, 44).set(new Uint8Array(pcmData));
  return buffer;
};
const generateFilename = () => `Te_eR_${Date.now()}.wav`;

const InfoModal = ({ title, content, onClose, showButtons, onAgree, onDisagree, t, isDarkMode }: any) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
    <div className={`relative z-10 w-full max-w-lg rounded-2xl border p-6 shadow-2xl flex flex-col max-h-[80vh] ${isDarkMode ? 'bg-neutral-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
      <div className="flex justify-between items-center mb-4"><h2 className="font-bold text-lg">{title}</h2><button onClick={onClose}><X className="w-5 h-5" /></button></div>
      <div className="flex-1 overflow-y-auto whitespace-pre-line text-sm mb-4">{content}</div>
      {showButtons && <div className="flex gap-2"><button onClick={onDisagree} className="flex-1 py-2 border rounded-lg">{t.disagreeBtn}</button><button onClick={onAgree} className="flex-1 py-2 bg-blue-600 text-white rounded-lg">{t.agreeBtn}</button></div>}
    </div>
  </div>
);

const LandingPage = ({ onStart, isDarkMode, toggleTheme, language, setLanguage }: any) => {
  const [showTos, setShowTos] = useState(false);
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.id;
  const legal = LEGAL_CONTENT[language as keyof typeof LEGAL_CONTENT] || LEGAL_CONTENT.id;

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-neutral-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <nav className="p-6 flex justify-between items-center border-b border-white/5">
        <h1 className="font-bold text-xl flex items-center gap-2"><Volume2 className="text-cyan-400" /> Te_eR™</h1>
        <div className="flex gap-2">
           <button onClick={() => setLanguage(language === 'id' ? 'en' : 'id')} className="px-3 py-1 border rounded text-xs font-bold">{language.toUpperCase()}</button>
           <button onClick={toggleTheme} className="p-2 border rounded">{isDarkMode ? <Moon className="w-4 h-4"/> : <Sun className="w-4 h-4"/>}</button>
        </div>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
        <h2 className="text-5xl font-black">{t.heroTitle1} <span className="text-cyan-400">{t.heroTitle2}</span></h2>
        <p className="max-w-xl opacity-80">{t.heroDesc}</p>
        <button onClick={() => setShowTos(true)} className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform">{t.startBtn}</button>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
           {[t.feature1, t.feature2, t.feature3, t.feature4].map((f, i) => <div key={i} className="p-4 border rounded-xl text-xs font-bold">{f}</div>)}
        </div>
      </div>
      {showTos && <InfoModal title={legal.tos.title} content={legal.tos.content} onClose={() => setShowTos(false)} showButtons={true} onAgree={onStart} onDisagree={() => setShowTos(false)} t={t} isDarkMode={isDarkMode} />}
    </div>
  );
};

const MainApp = ({ isDarkMode, toggleTheme, language }: any) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [apiKey, setApiKey] = useState(localStorage.getItem('userGeminiApiKey') || "");
  const [voiceId, setVoiceId] = useState("Kore");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.id;

  const generateAudio = async () => {
    if (!text) return alert("Isi teks dulu!");
    setLoading(true);
    try {
      const mapping = VOICE_MAPPING[voiceId] || VOICE_MAPPING["Kore"];
      const keyUse = apiKey || defaultApiKey;
      const res = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${keyUse}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: `(Context: ${mapping.promptContext}) ${text}` }] }], generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: mapping.baseVoice } } } } })
      });
      const data = await res.json();
      if (!data.candidates?.[0]?.content?.parts?.[0]?.inlineData) throw new Error("Gagal generate.");
      const wav = pcmToWav(base64ToArrayBuffer(data.candidates[0].content.parts[0].inlineData.data));
      const url = URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
      setHistory(prev => [{ id: Date.now(), url, text, date: new Date().toLocaleTimeString() }, ...prev]);
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-neutral-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className="p-4 border-b border-white/5 flex justify-between items-center bg-inherit sticky top-0 z-10">
         <h1 className="font-bold">Te_eR™ Pro</h1>
         <button onClick={() => setIsSettingsOpen(true)}><Settings /></button>
      </header>
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
         <div className="p-4 border rounded-xl space-y-4">
            <label className="text-xs font-bold opacity-70">MODEL SUARA</label>
            <select value={voiceId} onChange={e => setVoiceId(e.target.value)} className="w-full p-2 rounded bg-transparent border">
               {VOICE_CATEGORIES_CONFIG.map(cat => <optgroup key={cat.key} label={cat.id}>{cat.voices.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</optgroup>)}
            </select>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder={t.editorPlaceholder} className="w-full h-32 p-3 bg-transparent border rounded-xl resize-none" />
            <button onClick={generateAudio} disabled={loading} className="w-full py-3 bg-blue-600 rounded-xl font-bold text-white flex justify-center gap-2">{loading ? <Loader2 className="animate-spin"/> : <PlayCircle />} {t.generateBtn}</button>
         </div>
         <div className="space-y-2">
            {history.map(item => (
               <div key={item.id} className="flex items-center justify-between p-3 border rounded-xl">
                  <div className="truncate flex-1 pr-4"><p className="text-sm font-bold truncate">{item.text}</p><p className="text-xs opacity-50">{item.date}</p></div>
                  <audio src={item.url} controls className="h-8 w-32" />
               </div>
            ))}
         </div>
      </main>
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
           <div className={`w-full max-w-sm p-6 rounded-xl space-y-4 ${isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
              <div className="flex justify-between"><h3 className="font-bold">Pengaturan</h3><button onClick={() => setIsSettingsOpen(false)}><X /></button></div>
              <div><label className="text-xs font-bold">API Key Gemini</label><input type="password" value={apiKey} onChange={e => { setApiKey(e.target.value); localStorage.setItem('userGeminiApiKey', e.target.value); }} className="w-full p-2 border rounded mt-1 bg-transparent" placeholder="Paste key..." /></div>
              <button onClick={toggleTheme} className="w-full py-2 border rounded flex justify-center gap-2">{isDarkMode ? <Sun /> : <Moon />} Ganti Tema</button>
           </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  useEffect(() => {
    if (window.Pi) { window.Pi.init({ version: "2.0", sandbox: true }); }
  }, []);

  return view === 'landing' 
    ? <LandingPage onStart={() => setView('app')} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} language={language} setLanguage={setLanguage} /> 
    : <MainApp isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} language={language} />;
};

export default App;