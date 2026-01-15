import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Settings,
  Zap,
  Crown,
  MessageSquare,
  Sparkles,
  Trash2,
  AlertCircle,
  CheckCircle,
  Wand2,
  PlayCircle,
  Loader2,
  Music,
  Download,
  Key,
  Save,
  X,
  History,
  Gauge,
  ListMusic,
  Play,
  Pause,
  Archive,
  Mic,
  Square,
  Disc,
  Sun,
  Moon,
  Heart,
  Smartphone,
  Globe,
  Languages,
  MessageCircle,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  Infinity,
  Mic2,
  Layers,
  Smile
} from 'lucide-react';

// --- UTILITY FUNCTIONS (GLOBAL) ---

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const pcmToWav = (pcmData: ArrayBuffer, sampleRate: number = 24000) => {
  const numChannels = 1;
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const dataSize = pcmData.byteLength;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); 
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); 
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const pcmBytes = new Uint8Array(pcmData);
  const wavBytes = new Uint8Array(buffer, 44);
  wavBytes.set(pcmBytes);

  return buffer;
};

const generateFilename = (text: string) => {
  const cleanText = text.replace(/[^a-zA-Z0-9 ]/g, "").trim();
  const truncated = cleanText.substring(0, 25).replace(/\s+/g, "_");
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `Te_eR_${truncated}_${timestamp}.wav`;
};

const fetchWithRetry = async (url: string, options: RequestInit, retries = 5, initialDelay = 1000): Promise<Response> => {
  let delay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 401 || response.status === 403) throw new Error("API Key Invalid");
      if (response.status === 400) {
         const err = await response.json().catch(() => ({}));
         console.error("Bad Request:", err);
         throw new Error("Parameter Salah (Voice/Prompt) atau Request Ditolak.");
      }
      throw new Error(`HTTP Error ${response.status}`);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; 
    }
  }
  throw new Error("Max retries reached");
};

// --- DATA & CONFIGURATIONS ---

const defaultApiKey = ""; // Variabel ini akan diisi otomatis oleh sistem saat runtime.

// NOTE: Karena ini adalah pratinjau statis, file audio lokal tidak dapat dimuat.
// URL di bawah ini adalah placeholder. Dalam produksi nyata, ganti dengan URL file yang benar (misal di folder /public)
const AUDIO_SAMPLES = [
  { title: "Intro & Pengumuman (Formal)", file: "/Te_eR_Halo_saya_resmi_mengumumk_2026-01-13-23-37-06.wav", type: "News" }, 
  { title: "Nada Lucu & Witty", file: "/Te_eR_Nada_Lucu_dan_Witty_Inton_2026-01-13-22-06-47.wav", type: "Fun" }, 
  { title: "Demo Suara Natural", file: "/Te_eR_Halo_ini_adalah_contoh_te_2026-01-13-21-54-44.wav", type: "Casual" }, 
  { title: "Doa & Murotal (Spiritual)", file: "/Te_eR_Doa_Meminta_Ampunan_Allah_2026-01-13-10-21-38.wav", type: "Murotal" }, 
  { title: "Tagline Text-to-Bacot", file: "/Te_eR_Text_to_BacotTeeRtoSpeech_2026-01-13-09-16-24.wav", type: "Branding" }, 
];

const VOICE_MAPPING: Record<string, { baseVoice: string, gender: 'male' | 'female', promptContext: string }> = {
  "Kore": { baseVoice: "Kore", gender: "female", promptContext: "Normal" },
  "Fenrir": { baseVoice: "Fenrir", gender: "male", promptContext: "Normal" },
  "Jawa_Generic_ID_01": { baseVoice: "Charon", gender: "male", promptContext: "Pria Jawa medok, santai tapi sopan" },
  "Betawi_Generic_ID_01": { baseVoice: "Orus", gender: "male", promptContext: "Pria Betawi, ceplas-ceplos, nada tinggi, 'gue-elo'" },
  "Batak_Generic_ID_01": { baseVoice: "Orus", gender: "male", promptContext: "Pria Batak, suara lantang, tegas, berwibawa, logat kuat" }, 
  "Bali_Generic_ID_01": { baseVoice: "Puck", gender: "male", promptContext: "Pria Bali, logat khas, ramah" },
  "Minang_Generic_ID_01": { baseVoice: "Fenrir", gender: "male", promptContext: "Pria Minang, logat Padang kental, cepat" },
  "Sunda_Generic_ID_01": { baseVoice: "Aoede", gender: "female", promptContext: "Teteh Sunda halus, nada berayun cengkok, ramah, 'teh'" }, 
  "Ambon_Generic_ID_01": { baseVoice: "Kore", gender: "female", promptContext: "Wanita Ambon/Maluku, logat timur mendayu, manis, 'beta-ose'" },
  "Aceh_Generic_ID_01": { baseVoice: "Aoede", gender: "female", promptContext: "Wanita Aceh (Cut), logat melayu aceh kental, sopan, tegas" },
  "Betawi_Female_ID_01": { baseVoice: "Kore", gender: "female", promptContext: "Mpok Betawi, nyablak, nada tinggi, cepat, 'nyak-babe'" },
  "Makassar_Generic_ID_01": { baseVoice: "Aoede", gender: "female", promptContext: "Wanita Makassar (Dara Daeng), logat tegas, akhiran 'mi/ji/ki', cepat" },
  "Manado_Generic_ID_01": { baseVoice: "Kore", gender: "female", promptContext: "Nona Manado, nada naik di akhir kalimat, cepat, 'torang'" },
  "Papua_Generic_ID_01": { baseVoice: "Aoede", gender: "female", promptContext: "Kakak Perempuan Papua, logat timur kental, jujur, ramah" },
  "Jawa_Ngapak_ID_01": { baseVoice: "Kore", gender: "female", promptContext: "Mbak Jawa Ngapak (Banyumas/Tegal), logat ngapak medok, lucu, 'inyong'" },
  "Minang_Female_ID_01": { baseVoice: "Aoede", gender: "female", promptContext: "Uni Minang, logat Padang kental, tegas, cepat, 'awak'" },
  "Melayu_Generic_ID_01": { baseVoice: "Aoede", gender: "female", promptContext: "Mak Cik Melayu (Riau/Malaysia), logat mendayu-dayu, sangat sopan" },
  "Pres_Generic_ID": { baseVoice: "Charon", gender: "male", promptContext: "Pidato Presiden, lambat, sangat berwibawa, formal, jeda panjang" },
  "Komedi_Generic_ID": { baseVoice: "Puck", gender: "male", promptContext: "Komedian stand-up, nada bercanda, tertawa kecil, cepat" },
  "News_Generic_ID": { baseVoice: "Orus", gender: "male", promptContext: "Pembaca berita TV, formal, artikulasi sangat jelas, datar" },
  "Docu_Generic_ID": { baseVoice: "Charon", gender: "male", promptContext: "Narator dokumenter National Geographic, epik, dalam, misterius" },
  "Motiv_Generic_ID": { baseVoice: "Zephyr", gender: "male", promptContext: "Motivator semangat, energik, mengajak, nada tinggi" },
  "Poet_Generic_ID": { baseVoice: "Kore", gender: "female", promptContext: "Penyair senja, berbisik, lembut, melankolis, puitis" },
  "Tech_Generic_ID": { baseVoice: "Fenrir", gender: "male", promptContext: "Reviewer gadget, cepat, antusias, geeky" },
  "Sport_Generic_ID": { baseVoice: "Orus", gender: "male", promptContext: "Komentator bola jebret, berteriak, histeris, sangat cepat" },
  "Fairy_Generic_ID": { baseVoice: "Aoede", gender: "female", promptContext: "Ibu Peri dongeng, keibuan, sangat lembut, magis" },
  "Villain_Generic_ID": { baseVoice: "Charon", gender: "male", promptContext: "Penjahat Anime, suara serak, mengerikan, jahat, tertawa licik" }, 
};

// ... (Helper function createAccentMapping and usage remains the same)
const createAccentMapping = (idPrefix: string, baseVoice: string, gender: string, basePrompt: string) => {
  const accents = [
    { code: "USA", label: "USA" }, { code: "UK", label: "British" }, { code: "Aussie", label: "Australian" },
    { code: "Rusia", label: "Russian" }, { code: "France", label: "French" }, { code: "Spain", label: "Spanish" },
    { code: "Italian", label: "Italian" }, { code: "Germany", label: "German" }, { code: "Latina", label: "Latino/Hispanic" },
    { code: "MiddleEast", label: "Middle Eastern/Arabic" }, { code: "Chinese", label: "Chinese" }, { code: "Hindi", label: "Indian/Hindi" },
    { code: "Melayu", label: "Malay" }, { code: "Singapore", label: "Singaporean/Singlish" }, { code: "African", label: "African" }
  ];
  accents.forEach(acc => {
    // @ts-ignore
    VOICE_MAPPING[`${idPrefix}_${acc.code}`] = {
      baseVoice: baseVoice,
      // @ts-ignore
      gender: gender,
      promptContext: `${basePrompt}, strong ${acc.label} Accent`
    };
  });
};
createAccentMapping("Acc_Male", "Fenrir", "male", "Adult Male");
createAccentMapping("Acc_Female", "Kore", "female", "Adult Female");
createAccentMapping("Acc_Boy", "Puck", "male", "Young Boy (Child)");
createAccentMapping("Acc_Girl", "Aoede", "female", "Young Girl (Child)");

const VOICE_DATABASE_CATEGORIES = {
  "Gemini Original": [
    { name: "Kore (Wanita, Jernih)", id: "Kore" },
    { name: "Fenrir (Pria, Berat)", id: "Fenrir" },
    { name: "Puck (Pria, Ringan)", id: "Puck" },
    { name: "Zephyr (Pria, Tenang)", id: "Zephyr" },
    { name: "Charon (Pria, Deep)", id: "Charon" },
  ],
  "Logat Daerah (Pria)": [
    { name: "Mas Joko (Logat Jawa Medok)", id: "Jawa_Generic_ID_01" },
    { name: "Bang Jampang (Logat Betawi)", id: "Betawi_Generic_ID_01" },
    { name: "Tulang Batak (Tegas & Keras)", id: "Batak_Generic_ID_01" },
    { name: "Bli Wayan (Logat Bali)", id: "Bali_Generic_ID_01" },
    { name: "Uda Rizal (Logat Minang)", id: "Minang_Generic_ID_01" },
  ],
  "Logat Daerah (Wanita)": [
    { name: "Teteh Geulis (Logat Sunda Halus)", id: "Sunda_Generic_ID_01" }, 
    { name: "Parampuang (Logat Ambon)", id: "Ambon_Generic_ID_01" },
    { name: "Cut (Logat Aceh)", id: "Aceh_Generic_ID_01" },
    { name: "Mpok (Logat Betawi)", id: "Betawi_Female_ID_01" },
    { name: "Dara Daeng (Logat Makassar)", id: "Makassar_Generic_ID_01" },
    { name: "Nona (Logat Manado)", id: "Manado_Generic_ID_01" },
    { name: "Kakak (Logat Papua)", id: "Papua_Generic_ID_01" },
    { name: "Mbak (Logat Jawa Ngapak)", id: "Jawa_Ngapak_ID_01" },
    { name: "Uni (Logat Minang)", id: "Minang_Female_ID_01" },
    { name: "Mak Cik (Logat Melayu)", id: "Melayu_Generic_ID_01" },
  ],
  "Accent Negara (Pria Dewasa)": [
    { name: "Accent USA", id: "Acc_Male_USA" }, { name: "Accent UK", id: "Acc_Male_UK" }, { name: "Accent Aussie", id: "Acc_Male_Aussie" },
    { name: "Accent Rusia", id: "Acc_Male_Rusia" }, { name: "Accent France", id: "Acc_Male_France" }, { name: "Accent Spain", id: "Acc_Male_Spain" },
    { name: "Accent Italian", id: "Acc_Male_Italian" }, { name: "Accent Germany", id: "Acc_Male_Germany" }, { name: "Accent Latina", id: "Acc_Male_Latina" },
    { name: "Accent Middle East", id: "Acc_Male_MiddleEast" }, { name: "Accent Chinese", id: "Acc_Male_Chinese" }, { name: "Accent Hindi", id: "Acc_Male_Hindi" },
    { name: "Accent Melayu", id: "Acc_Male_Melayu" }, { name: "Accent Singapore", id: "Acc_Male_Singapore" }, { name: "Accent African", id: "Acc_Male_African" },
  ],
  "Accent Negara (Wanita Dewasa)": [
    { name: "Accent USA", id: "Acc_Female_USA" }, { name: "Accent UK", id: "Acc_Female_UK" }, { name: "Accent Aussie", id: "Acc_Female_Aussie" },
    { name: "Accent Rusia", id: "Acc_Female_Rusia" }, { name: "Accent France", id: "Acc_Female_France" }, { name: "Accent Spain", id: "Acc_Female_Spain" },
    { name: "Accent Italian", id: "Acc_Female_Italian" }, { name: "Accent Germany", id: "Acc_Female_Germany" }, { name: "Accent Latina", id: "Acc_Female_Latina" },
    { name: "Accent Middle East", id: "Acc_Female_MiddleEast" }, { name: "Accent Chinese", id: "Acc_Female_Chinese" }, { name: "Accent Hindi", id: "Acc_Female_Hindi" },
    { name: "Accent Melayu", id: "Acc_Female_Melayu" }, { name: "Accent Singapore", id: "Acc_Female_Singapore" }, { name: "Accent African", id: "Acc_Female_African" },
  ],
  "Accent Negara (Anak Laki-laki)": [
    { name: "Accent USA", id: "Acc_Boy_USA" }, { name: "Accent UK", id: "Acc_Boy_UK" }, { name: "Accent Aussie", id: "Acc_Boy_Aussie" },
    { name: "Accent Rusia", id: "Acc_Boy_Rusia" }, { name: "Accent France", id: "Acc_Boy_France" }, { name: "Accent Spain", id: "Acc_Boy_Spain" },
    { name: "Accent Italian", id: "Acc_Boy_Italian" }, { name: "Accent Germany", id: "Acc_Boy_Germany" }, { name: "Accent Latina", id: "Acc_Boy_Latina" },
    { name: "Accent Middle East", id: "Acc_Boy_MiddleEast" }, { name: "Accent Chinese", id: "Acc_Boy_Chinese" }, { name: "Accent Hindi", id: "Acc_Boy_Hindi" },
    { name: "Accent Melayu", id: "Acc_Boy_Melayu" }, { name: "Accent Singapore", id: "Acc_Boy_Singapore" }, { name: "Accent African", id: "Acc_Boy_African" },
  ],
  "Accent Negara (Anak Wanita)": [
    { name: "Accent USA", id: "Acc_Girl_USA" }, { name: "Accent UK", id: "Acc_Girl_UK" }, { name: "Accent Aussie", id: "Acc_Girl_Aussie" },
    { name: "Accent Rusia", id: "Acc_Girl_Rusia" }, { name: "Accent France", id: "Acc_Girl_France" }, { name: "Accent Spain", id: "Acc_Girl_Spain" },
    { name: "Accent Italian", id: "Acc_Girl_Italian" }, { name: "Accent Germany", id: "Acc_Girl_Germany" }, { name: "Accent Latina", id: "Acc_Girl_Latina" },
    { name: "Accent Middle East", id: "Acc_Girl_MiddleEast" }, { name: "Accent Chinese", id: "Acc_Girl_Chinese" }, { name: "Accent Hindi", id: "Acc_Girl_Hindi" },
    { name: "Accent Melayu", id: "Acc_Girl_Melayu" }, { name: "Accent Singapore", id: "Acc_Girl_Singapore" }, { name: "Accent African", id: "Acc_Girl_African" },
  ],
  "Tokoh Publik & Selebriti": [
    { name: "Sang Presiden (Wibawa)", id: "Pres_Generic_ID" },
    { name: "Komedian Legend (Lucu)", id: "Komedi_Generic_ID" },
    { name: "Host Berita Malam (Formal)", id: "News_Generic_ID" },
    { name: "Narator Dokumenter (Epik)", id: "Docu_Generic_ID" },
    { name: "Motivator Sukses (Semangat)", id: "Motiv_Generic_ID" },
    { name: "Penyair Senja (Puitis)", id: "Poet_Generic_ID" },
    { name: "Reviewer Gadget (Cepat)", id: "Tech_Generic_ID" },
    { name: "Komentator Bola (Teriak)", id: "Sport_Generic_ID" },
    { name: "Ibu Peri (Dongeng)", id: "Fairy_Generic_ID" },
    { name: "Villain Anime (Jahat)", id: "Villain_Generic_ID" },
  ]
};

const STYLE_PRESETS = [
  "Netral", "Gembira", "Sedih", "Marah/Emosi", "Terkejut", 
  "Bingung", "Galau", "Berteriak", "Berbisik", "Tertawa", 
  "Humoris", "Menghela Nafas", "Serius", "Berita/News", "Dongeng",
  "Murotal", "Sopran", "Bass", "Podcaster", "Reporter", "Tenor", "Seriosa"
];

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

const FALLBACK_SCRIPTS = [
  "Tes satu dua tiga, dicoba! Mic-nya aman kan gais? Suara saya terdengar jelas?",
  "Hari ini mendung, tapi hatiku tetap cerah secerah layar HP kamu saat melihat notifikasi gajian.",
  "Makan nasi pakai kerupuk, jangan lupa bayar hutang yang numpuk. Hidup indah tanpa cicilan!",
  "Di balik tawa yang renyah, terdapat tagihan paylater yang meresahkan jiwa dan raga.",
  "Selamat pagi dunia tipu-tipu, semoga hari ini kita tetap waras walau deadline menumpuk."
];

// --- LANDING PAGE COMPONENT ---
const LandingPage = ({ onStart, isDarkMode, toggleTheme }: { onStart: () => void, isDarkMode: boolean, toggleTheme: () => void }) => {
  const [logoSwitch, setLogoSwitch] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "BERNYAWA";
  const [activeAudioIndex, setActiveAudioIndex] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => setLogoSwitch(prev => !prev), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 200);
    return () => clearInterval(typeInterval);
  }, []);

  const handlePlaySample = (index: number) => {
    // Stop semua audio lain sebelum memutar yang baru
    audioRefs.current.forEach((audio, i) => {
      if (i !== index && audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    const currentAudio = audioRefs.current[index];
    if (currentAudio) {
      if (currentAudio.paused) {
        // Safe play with promise handling
        const playPromise = currentAudio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setActiveAudioIndex(index);
            })
            .catch(error => {
              console.log("Audio not ready or blocked by browser policy:", error);
              setActiveAudioIndex(null);
            });
        }
      } else {
        currentAudio.pause();
        setActiveAudioIndex(null);
      }
    }
  };

  const bgClass = isDarkMode ? 'bg-neutral-950 text-white selection:bg-cyan-500/30' : 'bg-slate-50 text-slate-900 selection:bg-blue-200';
  const navClass = isDarkMode ? 'bg-neutral-950/80 border-white/5' : 'bg-white/80 border-blue-100';
  const logoBg = isDarkMode ? 'bg-gradient-to-br from-blue-600 to-cyan-500' : 'bg-gradient-to-br from-blue-500 to-cyan-400';
  const cardClass = isDarkMode ? 'bg-neutral-900 border-white/10 hover:border-cyan-500/50' : 'bg-white border-blue-200 hover:border-blue-400 shadow-sm';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${bgClass}`}>
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b ${navClass}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <div className={`relative h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shadow-lg ${logoBg} shadow-cyan-500/20`}>
                <Volume2 className={`absolute w-6 h-6 md:w-7 md:h-7 text-white transition-all duration-700 ${logoSwitch ? 'opacity-0 scale-50 rotate-180' : 'opacity-100 scale-100'}`} />
                <MessageCircle className={`absolute w-6 h-6 md:w-7 md:h-7 text-white transition-all duration-700 ${logoSwitch ? 'opacity-100 scale-100' : 'opacity-0 scale-50 -rotate-180'}`} />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold tracking-tight">
                  Te_eR™ <span className="text-cyan-400 animate-pulse">to Speech</span>
                </h1>
                <p className={`text-[10px] md:text-xs font-mono tracking-widest ${isDarkMode ? 'text-cyan-200/70' : 'text-blue-600/70'}`}>
                  Text to Bacot PRO
                </p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'}`}
          >
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] -z-10 ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-200/40'}`}></div>
        
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
          Ubah Teks Jadi <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Suara </span>
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
              {typedText}
            </span>
            <span className="absolute -right-2 top-0 h-full w-1 bg-cyan-400 animate-blink"></span>
          </span>
        </h2>
        
        <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
          Platform Text-to-Speech tercanggih dengan dukungan logat daerah Indonesia, 
          kloning suara, dan emosi yang nyata. <span className="font-bold text-cyan-500">GRATIS !*</span>
        </p>

        <button 
            onClick={onStart}
            className="mb-8 px-8 py-3 bg-white text-black rounded-full font-bold text-base hover:bg-cyan-50 transition-colors animate-[pulse_2s_infinite] border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          >
            Mulai Sekarang
        </button>

        <div className="flex flex-wrap justify-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <Zap className="w-4 h-4 text-yellow-400" /> Powered by Gemini
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className={`py-20 border-y ${isDarkMode ? 'bg-neutral-900/50 border-white/5' : 'bg-slate-100/50 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Globe className="w-8 h-8 text-cyan-400" />, title: "30+ Model Suara", desc: "Termasuk aksen negara & logat daerah (Jawa, Sunda, dll)." },
            { icon: <Smile className="w-8 h-8 text-pink-400" />, title: "Kaya Emosi", desc: "Atur intonasi: Gembira, Sedih, Marah, Murotal." },
            { icon: <Mic2 className="w-8 h-8 text-green-400" />, title: "Voice Cloning", desc: "Rekam & simpan suara Anda sendiri untuk dijadikan model." },
            { icon: <Infinity className="w-8 h-8 text-purple-400" />, title: "Tanpa Batas", desc: "Generate TTS sepuasnya & download langsung." },
            { icon: <Sun className="w-8 h-8 text-yellow-400" />, title: "Tampilan Adaptif", desc: "Mode Gelap & Terang yang nyaman di mata." },
            { icon: <Languages className="w-8 h-8 text-blue-400" />, title: "Auto Translate", desc: "Terjemahkan skrip ke berbagai bahasa instan." },
          ].map((feature, i) => (
            <div key={i} className={`p-6 rounded-2xl border transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-neutral-950 border-white/5 hover:border-cyan-500/30' : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'}`}>
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-slate-500'}`}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Audio Showcase */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-10">Dengar Hasil Suara <span className="text-cyan-400">Te_eR™</span></h3>
          
          <div className="space-y-4">
            {AUDIO_SAMPLES.map((audio, idx) => (
              <div key={idx} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${cardClass}`}>
                <button 
                  onClick={() => handlePlaySample(idx)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 ${activeAudioIndex === idx ? 'bg-cyan-500 text-white animate-pulse' : 'bg-cyan-500/20 text-cyan-500'}`}
                >
                  {activeAudioIndex === idx ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{audio.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? 'bg-white/10 text-neutral-400' : 'bg-slate-100 text-slate-500'}`}>{audio.type}</span>
                </div>
                {/* Native Audio Element (Hidden functionality via custom button, or visible if needed) */}
                <audio 
                  ref={el => audioRefs.current[idx] = el}
                  src={audio.file} 
                  className={`h-8 w-32 md:w-64 ${isDarkMode ? 'accent-cyan-500' : 'accent-blue-500'}`}
                  controls // Keep controls for fallback interaction
                  onPlay={() => setActiveAudioIndex(idx)}
                  onPause={() => setActiveAudioIndex(null)}
                  onError={(e) => {
                    // Suppress circular error in console by hiding element on fail
                    const target = e.target as HTMLAudioElement;
                    target.style.display = 'none';
                    // Show simple warning
                    console.warn(`File audio '${audio.file}' tidak ditemukan di folder /public.`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center relative">
        <div className={`absolute inset-0 bg-gradient-to-t -z-10 ${isDarkMode ? 'from-blue-900/20' : 'from-blue-100'} to-transparent`}></div>
        <h3 className="text-2xl md:text-4xl font-bold mb-8">Siap Membuat Konten Bersuara?</h3>
        
        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-lg rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-500 animate-[pulse_1.5s_infinite]"
        >
          <span className="mr-2 text-xl">Kuy Mulai</span>
          <span className="text-xl">BACOT</span>
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 rounded-full ring-4 ring-white/20 group-hover:ring-white/40 animate-ping opacity-20"></div>
        </button>
      </section>

      {/* Footer Landing Page (Copyright Only) */}
      <footer className={`py-10 border-t text-center ${isDarkMode ? 'border-white/5 bg-black' : 'border-slate-200 bg-slate-50'}`}>
        <p className="text-xs font-mono text-cyan-500/50 animate-pulse tracking-[0.2em]">
          Te_eR™ Inovative @2026
        </p>
      </footer>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const MainApp = ({ isDarkMode, toggleTheme }: { isDarkMode: boolean, toggleTheme: () => void }) => {
  const [activeTab, setActiveTab] = useState<'gemini' | 'elevenlabs'>('gemini');
  const [text, setText] = useState<string>("Halo, ini adalah contoh teks untuk dikonversi menjadi suara.");
  const [isLoading, setIsLoading] = useState(false);
  const [showSpeakerIcon, setShowSpeakerIcon] = useState(false);
  
  // Audio & History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HistoryItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  
  // Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [customCloneName, setCustomCloneName] = useState("");
  const [customClones, setCustomClones] = useState<{name: string, id: string}[]>([]);

  // Settings & Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [userGeminiApiKey, setUserGeminiApiKey] = useState<string>("");
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>("");
  const [targetLang, setTargetLang] = useState("id");
  
  const [geminiVoiceId, setGeminiVoiceId] = useState("Kore"); 
  const [styleInstruction, setStyleInstruction] = useState("");
  
  const [elevenModelName, setElevenModelName] = useState("My Custom Model");
  const [elevenModelId, setElevenModelId] = useState("");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Theme Colors
  const colors = {
    bg: isDarkMode ? 'bg-neutral-950' : 'bg-slate-50',
    card: isDarkMode ? 'bg-neutral-900 border-white/5' : 'bg-white border-blue-500/10 shadow-xl shadow-blue-500/5',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    textMuted: isDarkMode ? 'text-neutral-400' : 'text-slate-500',
    accent: isDarkMode ? 'text-lime-400' : 'text-blue-600',
    accentBg: isDarkMode ? 'bg-lime-500' : 'bg-blue-600',
    accentBorder: isDarkMode ? 'border-lime-500/30' : 'border-blue-500/30',
    buttonPrimary: isDarkMode 
      ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white' 
      : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-blue-500/30',
  };

  useEffect(() => {
    const savedGeminiKey = localStorage.getItem('userGeminiApiKey');
    if (savedGeminiKey) setUserGeminiApiKey(savedGeminiKey);

    const savedElevenKey = localStorage.getItem('elevenLabsKey');
    if (savedElevenKey) setElevenLabsApiKey(savedElevenKey);
    
    const savedClones = localStorage.getItem('gemini_clones');
    if (savedClones) {
       try { setCustomClones(JSON.parse(savedClones)); } catch (e) {}
    }

    const interval = setInterval(() => {
      setShowSpeakerIcon(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  const saveSettings = () => {
    localStorage.setItem('userGeminiApiKey', userGeminiApiKey);
    localStorage.setItem('elevenLabsKey', elevenLabsApiKey);
    setIsSettingsOpen(false);
    setStatusMsg({ type: 'success', text: 'Pengaturan tersimpan!' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // --- MAIN LOGIC FUNCTIONS ---
  const handleTranslate = async () => {
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const keyToUse = userGeminiApiKey || defaultApiKey;
      const targetLangName = TARGET_LANGUAGES.find(l => l.code === targetLang)?.name || "English";
      
      const response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${keyToUse}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Translate to ${targetLangName}, return ONLY text:\n\n${text}` }] }]
          })
        }
      );

      const data = await response.json();
      const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (translatedText) {
        setText(translatedText.trim());
        setStatusMsg({ type: 'success', text: 'Teks berhasil diterjemahkan!' });
        setIsSettingsOpen(false);
      } else {
        throw new Error("Gagal translate.");
      }
    } catch (e: any) {
      setStatusMsg({ type: 'error', text: `Error: ${e.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoWrite = async () => {
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const keyToUse = userGeminiApiKey || defaultApiKey;
      const response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${keyToUse}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Buatkan skrip pendek (3 kalimat) lucu/puitis Bahasa Indonesia untuk demo TTS." }] }]
          })
        }
      );
      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) setText(generatedText);
    } catch (e) {
      const randomScript = FALLBACK_SCRIPTS[Math.floor(Math.random() * FALLBACK_SCRIPTS.length)];
      setText(randomScript);
      setStatusMsg({ type: 'success', text: 'Mode Offline (Fallback).' });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAudio = async () => {
    if (!text.trim()) {
      setStatusMsg({ type: 'error', text: 'Teks kosong.' });
      return;
    }
    setIsLoading(true);
    setStatusMsg(null);

    try {
      let blobUrl = "";
      let usedVoiceName = "";

      if (activeTab === 'gemini') {
        let mapping = { baseVoice: "Kore", promptContext: "" };
        let displayName = "Gemini Custom";

        if (geminiVoiceId.startsWith('clone_')) {
           const clone = customClones.find(c => c.id === geminiVoiceId);
           displayName = clone ? clone.name : "Custom Clone";
           mapping = { baseVoice: "Fenrir", promptContext: "Tirukan gaya bicara natural" };
        } else {
           mapping = VOICE_MAPPING[geminiVoiceId] || { baseVoice: "Kore", promptContext: "" };
           Object.values(VOICE_DATABASE_CATEGORIES).forEach(list => {
             const found = list.find(v => v.id === geminiVoiceId);
             if (found) displayName = found.name;
           });
        }
        
        usedVoiceName = displayName;
        const keyToUse = userGeminiApiKey || defaultApiKey;
        const promptText = `${mapping.promptContext ? `(Context: ${mapping.promptContext})` : ""} ${styleInstruction ? `(Style: ${styleInstruction})` : ""} ${text}`;

        const response = await fetchWithRetry(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${keyToUse}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: mapping.baseVoice } } }
              }
            })
          }
        );

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        
        const inlineData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        if (!inlineData) {
             const reason = data.candidates?.[0]?.finishReason;
             if (reason === "SAFETY") throw new Error("Konten tidak aman.");
             throw new Error("Gagal generate audio.");
        }

        const pcmBuffer = base64ToArrayBuffer(inlineData.data);
        const wavBuffer = pcmToWav(pcmBuffer, 24000); 
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        blobUrl = URL.createObjectURL(blob);

      } else {
        if (!elevenLabsApiKey) throw new Error("API Key ElevenLabs wajib diisi.");
        const targetId = elevenModelId.trim() ? elevenModelId : "21m00Tcm4TlvDq8ikWAM"; 
        usedVoiceName = elevenModelName.trim() ? elevenModelName : "ElevenLabs Voice";

        const response = await fetchWithRetry(
          `https://api.elevenlabs.io/v1/text-to-speech/${targetId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "xi-api-key": elevenLabsApiKey },
            body: JSON.stringify({ text: text, model_id: "eleven_multilingual_v2" })
          }
        );
        const blob = await response.blob();
        blobUrl = URL.createObjectURL(blob);
      }
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        url: blobUrl,
        text: text,
        voice: usedVoiceName,
        date: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [newItem, ...prev]);
      setCurrentAudio(newItem);
      setStatusMsg({ type: 'success', text: 'Audio berhasil dibuat!' });

    } catch (err: any) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.message || "Error." });
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (item: HistoryItem) => {
    setCurrentAudio(item);
    setTimeout(() => {
      if (audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
             console.error("Playback failed:", error);
             setIsPlaying(false);
          });
        }
        setIsPlaying(true);
      }
    }, 100);
  };

  // --- Recorder Functions ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedUrl(URL.createObjectURL(blob));
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } catch (err) { setStatusMsg({ type: 'error', text: 'Mic Error' }); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const saveClone = () => {
    if (!customCloneName.trim()) return;
    const newClone = { name: `[REC] ${customCloneName}`, id: `clone_${Date.now()}` };
    const updated = [newClone, ...customClones];
    setCustomClones(updated);
    localStorage.setItem('gemini_clones', JSON.stringify(updated));
    setRecordedUrl(null); setRecordedBlob(null); setCustomCloneName("");
    setStatusMsg({ type: 'success', text: 'Clone Saved!' });
  };

  // --- RENDER MAIN APP ---
  return (
    <div className={`min-h-screen font-sans pb-10 flex flex-col transition-colors duration-500 ${colors.bg} ${colors.text}`}>
      
      {/* HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-500 ${isDarkMode ? 'bg-neutral-950/80 border-white/5' : 'bg-white/80 border-blue-500/10'}`}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`relative h-12 w-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/20' : 'bg-gradient-to-br from-blue-500 to-cyan-400 shadow-blue-500/40'}`}>
              <Volume2 className={`absolute w-7 h-7 text-white transition-all duration-700 ease-in-out transform ${showSpeakerIcon ? 'opacity-0 scale-50 rotate-180' : 'opacity-100 scale-100 rotate-0'}`} />
              <MessageCircle className={`absolute w-7 h-7 text-white transition-all duration-700 ease-in-out transform ${showSpeakerIcon ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-180'}`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-tight transition-colors flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <span className="relative">Te_eR™<span className={`absolute -inset-1 blur-md opacity-50 animate-pulse ${isDarkMode ? 'bg-blue-500' : 'bg-cyan-400'}`}></span></span>
                <span className="relative z-10 animate-[pulse_2s_infinite]">to Speech</span>
              </h1>
              <p className={`text-xs font-mono tracking-wider transition-colors ${colors.accent}`}>TEXT TO BACOT PRO</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSettingsOpen(true)} className={`p-2.5 rounded-xl border transition-all duration-300 group ${elevenLabsApiKey ? `${colors.accentBorder} ${isDarkMode ? 'bg-lime-500/5' : 'bg-blue-500/5'}` : `${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'}`}`}>
              <Settings className={`w-5 h-5 transition-colors ${elevenLabsApiKey ? colors.accent : 'text-neutral-400'}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8 space-y-8 flex-grow">
        {/* MODE SWITCHER */}
        <div className={`rounded-2xl p-1 grid grid-cols-2 gap-1 relative border max-w-lg mx-auto md:mx-0 transition-colors ${isDarkMode ? 'bg-neutral-900 border-white/5' : 'bg-white border-blue-100 shadow-sm'}`}>
          <button onClick={() => setActiveTab('gemini')} className={`relative z-10 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'gemini' ? `${colors.accentBg} text-white shadow-lg` : `${colors.textMuted} hover:text-current`}`}>
            <Zap className="w-4 h-4" /> Gemini Flash
          </button>
          <button onClick={() => setActiveTab('elevenlabs')} className={`relative z-10 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'elevenlabs' ? `${isDarkMode ? 'bg-white text-neutral-950' : 'bg-slate-100 text-slate-900'} shadow-lg` : `${colors.textMuted} hover:text-current`}`}>
            <Crown className="w-4 h-4" /> ElevenLabs Pro
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* KOLOM KIRI */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`rounded-3xl border shadow-xl p-6 space-y-6 transition-colors ${colors.card}`}>
              <div className={`flex items-center gap-2 border-b pb-4 ${isDarkMode ? 'border-white/5' : 'border-blue-100'}`}>
                <Settings className={`w-4 h-4 ${colors.textMuted}`} />
                <span className={`text-xs font-bold tracking-widest uppercase ${colors.textMuted}`}>Konfigurasi Suara</span>
              </div>

              {activeTab === 'gemini' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="space-y-2">
                    <label className={`text-sm block ${colors.textMuted}`}>Model Suara PRO (50+ Archetypes)</label>
                    <div className="relative">
                      <select value={geminiVoiceId} onChange={(e) => setGeminiVoiceId(e.target.value)} className={`w-full border rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-opacity-100 transition-colors cursor-pointer text-sm ${isDarkMode ? 'bg-neutral-950 border-white/10 text-white focus:border-lime-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'}`}>
                         {customClones.length > 0 && <optgroup label="✨ Rekaman Tersimpan (Lokal)" className={isDarkMode ? "bg-neutral-900" : "bg-white"}>{customClones.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>}
                         {Object.entries(VOICE_DATABASE_CATEGORIES).map(([category, voices]) => (
                          <optgroup key={category} label={category} className={isDarkMode ? "bg-neutral-900 text-lime-300" : "bg-white text-blue-600 font-bold"}>
                            {voices.map(v => <option key={v.id} value={v.id} className={isDarkMode ? "text-white" : "text-slate-800 font-normal"}>{v.name}</option>)}
                          </optgroup>
                        ))}
                      </select>
                      <div className={`absolute right-4 top-3.5 pointer-events-none ${colors.textMuted}`}>▼</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm block ${colors.textMuted}`}>Instruksi Gaya/Emosi</label>
                    <div className="relative">
                      <MessageSquare className={`absolute left-4 top-3.5 w-4 h-4 ${colors.textMuted}`} />
                      <input type="text" value={styleInstruction} onChange={(e) => setStyleInstruction(e.target.value)} placeholder="Contoh: Sedih, Marah..." className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-colors ${isDarkMode ? 'bg-neutral-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STYLE_PRESETS.map(style => (
                      <button key={style} onClick={() => setStyleInstruction(style)} className={`px-3 py-1.5 rounded-lg text-xs transition-colors border ${styleInstruction === style ? `${isDarkMode ? 'bg-lime-500/20 text-lime-300' : 'bg-blue-100 text-blue-600'}` : `${isDarkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-white text-slate-600'}`}`}>{style}</button>
                    ))}
                  </div>
                  {/* RECORDER */}
                  <div className={`pt-4 border-t space-y-3 ${isDarkMode ? 'border-white/5' : 'border-blue-100'}`}>
                    <label className={`text-sm font-bold block flex items-center gap-2 ${colors.accent}`}><Disc className="w-4 h-4 animate-spin-slow" /> Rekam Suara (Cloning)</label>
                    <div className={`rounded-xl p-3 border space-y-3 ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                       <div className="flex justify-between items-center"><span className={`text-xs font-mono ${colors.textMuted}`}>{isRecording ? `Merekam... ${recordingTime}s` : 'Siap Merekam'}</span>{isRecording && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}</div>
                       <div className="flex gap-2">
                          <button onClick={isRecording ? stopRecording : startRecording} className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${isRecording ? 'bg-red-500/20 text-red-400 border-red-500/50' : `${isDarkMode ? 'bg-neutral-800 text-white' : 'bg-white text-slate-700 shadow-sm'}`}`}>{isRecording ? <Square className="w-3 h-3 fill-current" /> : <Mic className="w-3 h-3" />}{isRecording ? 'Stop' : 'Mulai Rekam'}</button>
                       </div>
                       {recordedUrl && <div className="space-y-2 animate-in slide-in-from-top-2"><audio src={recordedUrl} controls className="w-full h-6 accent-blue-500" /><div className="flex gap-2"><input value={customCloneName} onChange={(e) => setCustomCloneName(e.target.value)} placeholder="Nama Voice Clone..." className={`flex-1 border rounded px-2 text-xs focus:outline-none ${isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-slate-900'}`} /><button onClick={saveClone} className={`px-3 rounded text-xs font-bold ${isDarkMode ? 'bg-lime-500 text-black' : 'bg-blue-600 text-white'}`}>Simpan</button></div></div>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className={`p-4 rounded-xl border space-y-4 ${isDarkMode ? 'bg-neutral-900 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="space-y-3">
                        <div><label className={`text-[10px] uppercase font-bold mb-1 block ${colors.textMuted}`}>Nama Model</label><input value={elevenModelName} onChange={(e) => setElevenModelName(e.target.value)} className={`w-full p-2 text-sm rounded-lg border focus:outline-none ${isDarkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} /></div>
                        <div><label className={`text-[10px] uppercase font-bold mb-1 block ${colors.textMuted}`}>ID Model</label><input value={elevenModelId} onChange={(e) => setElevenModelId(e.target.value)} className={`w-full p-2 text-sm rounded-lg border focus:outline-none ${isDarkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} /></div>
                      </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN */}
          <div className="lg:col-span-8 space-y-6">
            <div className={`rounded-3xl border overflow-hidden flex flex-col h-[400px] ${colors.card}`}>
              <div className={`border-b p-4 flex items-center justify-between ${isDarkMode ? 'bg-neutral-950/50 border-white/5' : 'bg-slate-50/50 border-blue-100'}`}>
                <div className="flex items-center gap-2"><span className={`text-xs font-bold tracking-widest ml-2 ${colors.textMuted}`}>SCRIPT EDITOR</span></div>
                <button onClick={handleAutoWrite} disabled={isLoading} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all text-xs font-medium text-red-400">{isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} Tulis Otomatis</button>
              </div>
              <div className="flex-1 p-6 relative"><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Ketik teks yang ingin diubah menjadi suara di sini..." className={`w-full h-full bg-transparent resize-none focus:outline-none text-lg leading-relaxed font-medium ${isDarkMode ? 'text-neutral-200 placeholder-neutral-700' : 'text-slate-700 placeholder-slate-300'}`} /></div>
              <div className={`p-6 border-t space-y-4 ${isDarkMode ? 'bg-neutral-950/30 border-white/5' : 'bg-slate-50/50 border-blue-100'}`}>
                {statusMsg && <div className={`flex items-center gap-2 text-sm animate-in slide-in-from-bottom-2 fade-in ${statusMsg.type === 'error' ? 'text-red-400' : 'text-green-500'}`}>{statusMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}{statusMsg.text}</div>}
                <button onClick={generateAudio} disabled={isLoading} className={`w-full h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${colors.buttonPrimary}`}>{isLoading ? <><Loader2 className="w-6 h-6 animate-spin" /><span>Memproses Suara...</span></> : <><PlayCircle className="w-6 h-6" /><span>Buat Suara Sekarang</span></>}</button>
              </div>
            </div>

            {/* PLAYER & LIBRARY */}
            {currentAudio && (
                <div className={`sticky top-24 z-30 backdrop-blur-md rounded-2xl border p-4 shadow-2xl animate-in slide-in-from-top-4 ${isDarkMode ? 'bg-neutral-800/90 border-lime-500/30' : 'bg-white/90 border-blue-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border shrink-0 ${isDarkMode ? 'bg-lime-500/20 border-lime-500/30' : 'bg-blue-100 border-blue-200'}`}>{isPlaying ? <div className="flex gap-0.5 items-end h-5"><div className={`w-1 h-3 animate-[pulse_0.5s_ease-in-out_infinite] ${isDarkMode ? 'bg-lime-400' : 'bg-blue-600'}`}></div></div> : <Music className={`w-6 h-6 ${isDarkMode ? 'text-lime-400' : 'text-blue-600'}`} />}</div>
                    <div className="flex-1 min-w-0"><div className="flex justify-between items-center mb-1"><h4 className={`font-medium truncate text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentAudio.text}</h4><span className={`text-[10px] border px-1.5 rounded ${isDarkMode ? 'text-lime-400 border-lime-500/20' : 'text-blue-600 border-blue-200 bg-blue-50'}`}>{currentAudio.voice}</span></div><audio ref={audioRef} src={currentAudio.url} onEnded={() => setIsPlaying(false)} onPause={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} controls className={`w-full h-8 ${isDarkMode ? 'accent-lime-500' : 'accent-blue-600'}`} style={{ filter: isDarkMode ? 'hue-rotate(280deg) invert(10%)' : 'none' }} /></div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pl-16">
                     <div className="flex items-center gap-2"><Gauge className={`w-3 h-3 ${colors.textMuted}`} /><select value={playbackSpeed} onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))} className={`border text-[10px] rounded px-1 py-0.5 focus:outline-none ${isDarkMode ? 'bg-neutral-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}><option value="0.5">0.5x</option><option value="1.0">1.0x</option><option value="1.5">1.5x</option></select></div>
                     <a href={currentAudio.url} download={generateFilename(currentAudio.text)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isDarkMode ? 'bg-lime-500 text-neutral-950' : 'bg-blue-600 text-white'}`}><Download className="w-3 h-3" /> Unduh</a>
                  </div>
                </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={`mt-8 py-8 border-t flex flex-col items-center justify-center gap-4 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
        <a href="https://sociabuzz.com/syukrankatsiron/tribe" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-pink-600 text-white shadow-pink-600/20' : 'bg-pink-500 text-white shadow-pink-500/30'}`}><Heart className="w-4 h-4 fill-current" /> Support Us</a>
        <a href="https://ko-fi.com/syukran/tip" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 active:scale-95"><img src="https://raw.githubusercontent.com/vandratop/Yuk/872daa6f963613ba58fc4ff71f886beed94ff15d/support_me_on_kofi_beige.png" alt="Buy me a Ko-fi" className="h-10 md:h-12" /></a>
        <p className={`text-sm font-mono animate-pulse tracking-widest ${isDarkMode ? 'text-lime-400/80' : 'text-blue-600/80'}`}>Te_eR™ Inovative @2026</p>
      </footer>

      {/* MODAL SETTINGS */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsSettingsOpen(false)} />
          <div className={`rounded-2xl border w-full max-w-md relative z-10 p-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] ${isDarkMode ? 'bg-neutral-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <button onClick={() => setIsSettingsOpen(false)} className="absolute right-4 top-4 hover:opacity-70 transition-opacity"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-3 mb-6"><div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}><Settings className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} /></div><h2 className="text-xl font-bold">Pengaturan</h2></div>
            
            <div className="space-y-6">
              {/* Translate */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-2 mb-1"><Globe className={`w-4 h-4 ${colors.accent}`} /><h3 className="text-sm font-bold">Translate (Gratis via Gemini)</h3></div>
                <div className="space-y-2"><label className={`text-[10px] uppercase font-bold ${colors.textMuted}`}>Bahasa Tujuan</label><select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className={`w-full p-2 text-sm rounded-lg border focus:outline-none ${isDarkMode ? 'bg-neutral-900 border-white/10' : 'bg-white border-slate-200'}`}>{TARGET_LANGUAGES.map((lang) => <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>)}</select></div>
                <button onClick={handleTranslate} disabled={isLoading} className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-400 text-white'}`}><Languages className="w-3 h-3" />{isLoading ? "Menerjemahkan..." : "Terjemahkan Teks Editor"}</button>
              </div>

              {/* Theme */}
              <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                 <div className="flex items-center gap-2">{isDarkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-orange-500" />}<span className="text-sm font-bold">Mode Tampilan</span></div>
                 <button onClick={toggleTheme} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${isDarkMode ? 'bg-neutral-800 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-sm'}`}>{isDarkMode ? 'Gelap' : 'Terang'}</button>
              </div>

              {/* API Keys */}
              <div>
                <div className="flex items-center gap-2 mb-4"><Key className={`w-4 h-4 ${colors.textMuted}`} /><h3 className="text-sm font-bold">API Keys</h3></div>
                {/* Gemini Input */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1"><label className={`text-[10px] uppercase font-bold ${colors.textMuted}`}>API KEY Gemini</label><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className={`text-[10px] flex items-center gap-1 hover:underline ${colors.accent}`}>Dapatkan Key <ExternalLink className="w-2 h-2" /></a></div>
                  <div className="relative"><input type="password" value={userGeminiApiKey} onChange={(e) => setUserGeminiApiKey(e.target.value)} placeholder="Tempel API Key Gemini..." className={`w-full p-3 rounded-xl border focus:outline-none transition-colors ${isDarkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} /><div className="absolute right-3 top-3 group cursor-help"><HelpCircle className={`w-4 h-4 ${colors.textMuted}`} /><div className="hidden group-hover:block absolute right-0 bottom-6 w-48 p-2 bg-black text-white text-[10px] rounded shadow-lg z-50">Unlimited generation & translate.</div></div></div>
                </div>
                {/* ElevenLabs Input */}
                <div>
                  <div className="flex justify-between items-center mb-1"><label className={`text-[10px] uppercase font-bold ${colors.textMuted}`}>API KEY ElevenLabs</label><a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noreferrer" className={`text-[10px] flex items-center gap-1 hover:underline ${colors.accent}`}>Dapatkan Key <ExternalLink className="w-2 h-2" /></a></div>
                  <div className="relative"><input type="password" value={elevenLabsApiKey} onChange={(e) => setElevenLabsApiKey(e.target.value)} placeholder="Tempel API Key ElevenLabs..." className={`w-full p-3 rounded-xl border focus:outline-none transition-colors ${isDarkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} /><div className="absolute right-3 top-3 group cursor-help"><HelpCircle className={`w-4 h-4 ${colors.textMuted}`} /><div className="hidden group-hover:block absolute right-0 bottom-6 w-48 p-2 bg-black text-white text-[10px] rounded shadow-lg z-50">Untuk fitur Pro Voice Cloning.</div></div></div>
                </div>
              </div>

              <button onClick={saveSettings} className={`w-full font-medium py-3 rounded-xl flex items-center justify-center gap-2 mt-4 transition-colors text-white ${isDarkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-500 hover:bg-green-400 shadow-lg'}`}><Save className="w-4 h-4" /> Simpan Semua Pengaturan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Root App to handle switching
const App = () => {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [isDarkMode, setIsDarkMode] = useState(true); // Shared theme state

  return view === 'landing' 
    ? <LandingPage onStart={() => setView('app')} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} /> 
    : <MainApp isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />;
};

export default App;