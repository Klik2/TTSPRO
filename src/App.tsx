
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
  MessageCircle // Used as proxy for speaking head
} from 'lucide-react';

// --- CONFIGURATION & DATABASE ---

const apiKey = ""; 

const VOICE_MAPPING: Record<string, { baseVoice: string, gender: 'male' | 'female', promptContext: string }> = {
  // Official
  "Kore": { baseVoice: "Kore", gender: "female", promptContext: "Normal" },
  "Fenrir": { baseVoice: "Fenrir", gender: "male", promptContext: "Normal" },
  
  // Daerah Pria (Existing)
  "Jawa_Generic_ID_01": { baseVoice: "Charon", gender: "male", promptContext: "Pria Jawa medok, santai tapi sopan" },
  "Betawi_Generic_ID_01": { baseVoice: "Orus", gender: "male", promptContext: "Pria Betawi, ceplas-ceplos, nada tinggi, 'gue-elo'" },
  "Batak_Generic_ID_01": { baseVoice: "Orus", gender: "male", promptContext: "Pria Batak, suara lantang, tegas, berwibawa, logat kuat" }, 
  "Bali_Generic_ID_01": { baseVoice: "Puck", gender: "male", promptContext: "Pria Bali, logat khas, ramah" },
  "Minang_Generic_ID_01": { baseVoice: "Fenrir", gender: "male", promptContext: "Pria Minang, logat Padang kental, cepat" },
  
  // Daerah Wanita (New & Updated)
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

  // Tokoh
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
  "Humoris", "Menghela Nafas", "Serius", "Berita/News", "Dongeng"
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

// --- FUNGSI UTILITAS ---

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


// Tipe Data History
interface HistoryItem {
  id: string;
  url: string;
  text: string;
  voice: string;
  date: string;
  duration?: number;
}

// --- KOMPONEN UTAMA ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'gemini' | 'elevenlabs'>('gemini');
  const [text, setText] = useState<string>("Halo, ini adalah contoh teks untuk dikonversi menjadi suara.");
  const [isLoading, setIsLoading] = useState(false);
  
  // DEFAULT MODE: CERAH (LIGHT)
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Header Animation State
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

  // PWA Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Status UI
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  
  // Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>("");
  const [targetLang, setTargetLang] = useState("id"); // DEFAULT INDONESIA
  
  // Configs
  const [geminiVoiceId, setGeminiVoiceId] = useState("Kore"); 
  const [styleInstruction, setStyleInstruction] = useState("");
  
  // ElevenLabs Manual Input State
  const [elevenModelName, setElevenModelName] = useState("My Custom Model");
  const [elevenModelId, setElevenModelId] = useState("");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Theme Colors Helper
  const colors = {
    bg: isDarkMode ? 'bg-neutral-950' : 'bg-slate-50',
    card: isDarkMode ? 'bg-neutral-900 border-white/5' : 'bg-white border-blue-500/10 shadow-xl shadow-blue-500/5',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    textMuted: isDarkMode ? 'text-neutral-400' : 'text-slate-500',
    accent: isDarkMode ? 'text-lime-400' : 'text-blue-600',
    accentBg: isDarkMode ? 'bg-lime-500' : 'bg-blue-600',
    accentBorder: isDarkMode ? 'border-lime-500/30' : 'border-blue-500/30',
    accentHover: isDarkMode ? 'hover:text-lime-300' : 'hover:text-blue-500',
    buttonPrimary: isDarkMode 
      ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white' 
      : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-blue-500/30',
  };

  useEffect(() => {
    const savedElevenKey = localStorage.getItem('elevenLabsKey');
    if (savedElevenKey) setElevenLabsApiKey(savedElevenKey);
    
    const savedClones = localStorage.getItem('gemini_clones');
    if (savedClones) {
       try {
         setCustomClones(JSON.parse(savedClones));
       } catch (e) {
         console.error("Failed to parse saved clones");
       }
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    // Icon Toggle Animation Interval
    const interval = setInterval(() => {
      setShowSpeakerIcon(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const saveSettings = () => {
    localStorage.setItem('elevenLabsKey', elevenLabsApiKey);
    setIsSettingsOpen(false);
    setStatusMsg({ type: 'success', text: 'Pengaturan tersimpan!' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        setDeferredPrompt(null);
      });
    } else {
      alert("Fitur install tidak tersedia di browser ini atau aplikasi sudah terinstall.");
    }
  };

  // --- TRANSLATE LOGIC (GEMINI FREE) ---
  const handleTranslate = async () => {
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const targetLangName = TARGET_LANGUAGES.find(l => l.code === targetLang)?.name || "English";
      
      const response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: `Translate the following text to ${targetLangName}. Only return the translated text, no explanations:\n\n${text}` 
              }] 
            }]
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
        throw new Error("Gagal mendapatkan respon terjemahan.");
      }
    } catch (e: any) {
      console.error(e);
      setStatusMsg({ type: 'error', text: `Gagal translate: ${e.message}` });
    } finally {
      setIsLoading(false);
    }
  };


  // --- RECORDER LOGIC ---

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'Gagal mengakses mikrofon.' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const saveClone = () => {
    if (!customCloneName.trim()) {
      setStatusMsg({ type: 'error', text: 'Beri nama untuk suara ini.' });
      return;
    }
    
    const newClone = { name: `[REC] ${customCloneName}`, id: `clone_${Date.now()}` };
    const updatedClones = [newClone, ...customClones];
    setCustomClones(updatedClones);
    localStorage.setItem('gemini_clones', JSON.stringify(updatedClones));
    
    setRecordedUrl(null);
    setRecordedBlob(null);
    setCustomCloneName("");
    
    setStatusMsg({ type: 'success', text: 'Voice Clone Tersimpan & Tersedia di Menu!' });
  };


  // --- GENERATION LOGIC ---

  const handleAutoWrite = async () => {
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Buatkan skrip pendek (maksimal 3 kalimat) yang lucu atau puitis dalam Bahasa Indonesia untuk demo text-to-speech." }] }]
          })
        }
      );

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) setText(generatedText);
    } catch (e) {
      console.warn("Auto-write API failed, using fallback.", e);
      const randomScript = FALLBACK_SCRIPTS[Math.floor(Math.random() * FALLBACK_SCRIPTS.length)];
      setText(randomScript);
      setStatusMsg({ type: 'success', text: 'Menggunakan skrip offline (Mode Hemat).' });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAudio = async () => {
    if (!text.trim()) {
      setStatusMsg({ type: 'error', text: 'Teks tidak boleh kosong.' });
      return;
    }

    setIsLoading(true);
    setStatusMsg(null);

    try {
      let blobUrl = "";
      let usedVoiceName = "";

      if (activeTab === 'gemini') {
        // --- GEMINI LOGIC ---
        
        let mapping = { baseVoice: "Kore", promptContext: "" };
        let displayName = "Gemini Custom";

        if (geminiVoiceId.startsWith('clone_')) {
           const clone = customClones.find(c => c.id === geminiVoiceId);
           displayName = clone ? clone.name : "Custom Clone";
           // Default to FENRIR (Male) for custom clones to match user request for male voice
           mapping = { baseVoice: "Fenrir", promptContext: "Tirukan gaya bicara natural dan spontan" };
        } else {
           mapping = VOICE_MAPPING[geminiVoiceId] || { baseVoice: "Kore", promptContext: "" };
           Object.values(VOICE_DATABASE_CATEGORIES).forEach(list => {
             const found = list.find(v => v.id === geminiVoiceId);
             if (found) displayName = found.name;
           });
        }
        
        usedVoiceName = displayName;

        const userStyle = styleInstruction ? `(Gaya: ${styleInstruction})` : "";
        const persona = mapping.promptContext ? `(Konteks: ${mapping.promptContext})` : "";
        const finalPrompt = `${persona} ${userStyle} ${text}`;

        const response = await fetchWithRetry(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: finalPrompt }] }],
              generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: mapping.baseVoice }
                  }
                }
              }
            })
          }
        );

        const data = await response.json();
        
        // --- IMPROVED ERROR HANDLING ---
        if (data.error) {
            throw new Error(data.error.message || "Terjadi kesalahan pada API Gemini.");
        }
        
        const candidate = data.candidates?.[0];
        if (!candidate) {
            // Check for prompt feedback block
            if (data.promptFeedback?.blockReason) {
                throw new Error(`Konten diblokir: ${data.promptFeedback.blockReason}`);
            }
            throw new Error("Tidak ada kandidat respon dari AI. Coba ubah teks atau gaya.");
        }

        // Cek data inline (audio) TERLEBIH DAHULU sebelum cek finishReason
        const inlineData = candidate.content?.parts?.[0]?.inlineData;
        
        if (!inlineData) {
             // Baru cek alasan jika data audio KOSONG
             if (candidate.finishReason === "SAFETY") throw new Error("Gagal: Konten dianggap tidak aman oleh AI.");
             if (candidate.finishReason === "RECITATION") throw new Error("Gagal: Konten terdeteksi sebagai repetisi/hak cipta.");
             if (candidate.finishReason === "OTHER") throw new Error("Gagal: Terjadi kesalahan internal AI (OTHER). Silakan coba teks yang berbeda atau tunggu sebentar.");
             throw new Error("Gagal: Audio tidak dihasilkan (Alasan tidak diketahui).");
        }

        const pcmBuffer = base64ToArrayBuffer(inlineData.data);
        const wavBuffer = pcmToWav(pcmBuffer, 24000); 
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        blobUrl = URL.createObjectURL(blob);

      } else {
        // --- ELEVENLABS LOGIC ---
        if (!elevenLabsApiKey) throw new Error("API Key ElevenLabs wajib diisi di pengaturan.");
        
        const targetId = elevenModelId.trim() ? elevenModelId : "21m00Tcm4TlvDq8ikWAM"; 
        usedVoiceName = elevenModelName.trim() ? elevenModelName : "ElevenLabs Voice";

        const response = await fetchWithRetry(
          `https://api.elevenlabs.io/v1/text-to-speech/${targetId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": elevenLabsApiKey
            },
            body: JSON.stringify({
              text: text,
              model_id: "eleven_multilingual_v2",
              voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            })
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
      setStatusMsg({ type: 'error', text: err.message || "Terjadi kesalahan sistem." });
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (item: HistoryItem) => {
    setCurrentAudio(item);
    setTimeout(() => {
      audioRef.current?.play();
      setIsPlaying(true);
    }, 100);
  };

  const togglePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const deleteItem = (id: string) => {
    setHistory(prev => prev.filter(i => i.id !== id));
    if (currentAudio?.id === id) {
      setCurrentAudio(null);
      setIsPlaying(false);
    }
  };

  const clearAllHistory = () => {
    if (window.confirm("Hapus semua riwayat audio?")) {
      setHistory([]);
      setCurrentAudio(null);
    }
  };

  const charCount = text.length;
  const estTime = `${Math.ceil(charCount / 15)}s`;

  return (
    <div className={`min-h-screen font-sans pb-10 flex flex-col transition-colors duration-500 ${colors.bg} ${colors.text}`}>
      
      {/* HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-500 ${isDarkMode ? 'bg-neutral-950/80 border-white/5' : 'bg-white/80 border-blue-500/10'}`}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`relative h-12 w-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/20' : 'bg-gradient-to-br from-blue-500 to-cyan-400 shadow-blue-500/40'}`}>
              {/* ANIMATED ICON SWITCHER */}
              <Volume2 
                className={`absolute w-7 h-7 text-white transition-all duration-700 ease-in-out transform ${showSpeakerIcon ? 'opacity-0 scale-50 rotate-180' : 'opacity-100 scale-100 rotate-0'}`} 
              />
              <MessageCircle 
                className={`absolute w-7 h-7 text-white transition-all duration-700 ease-in-out transform ${showSpeakerIcon ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-180'}`} 
              />
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-tight transition-colors flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <span className="relative">
                  Te_eR™
                  <span className={`absolute -inset-1 blur-md opacity-50 animate-pulse ${isDarkMode ? 'bg-blue-500' : 'bg-cyan-400'}`}></span>
                </span>
                <span className="relative z-10 animate-[pulse_2s_infinite]">to Speech</span>
              </h1>
              <p className={`text-xs font-mono tracking-wider transition-colors ${colors.accent}`}>
                TEXT TO BACOT PRO
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className={`p-2.5 rounded-xl border transition-all duration-300 ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                title="Install App"
              >
                <Smartphone className="w-5 h-5" />
              </button>
            )}

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2.5 rounded-xl border transition-all duration-300 group
                ${elevenLabsApiKey 
                  ? `${colors.accentBorder} ${isDarkMode ? 'bg-lime-500/5' : 'bg-blue-500/5'}` 
                  : `${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'}`
                }`}
            >
              <Settings className={`w-5 h-5 transition-colors ${elevenLabsApiKey ? colors.accent : 'text-neutral-400'}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8 space-y-8 flex-grow">
        
        {/* MODE SWITCHER */}
        <div className={`rounded-2xl p-1 grid grid-cols-2 gap-1 relative border max-w-lg mx-auto md:mx-0 transition-colors ${isDarkMode ? 'bg-neutral-900 border-white/5' : 'bg-white border-blue-100 shadow-sm'}`}>
          <button
            onClick={() => setActiveTab('gemini')}
            className={`relative z-10 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300
              ${activeTab === 'gemini' 
                ? `${colors.accentBg} text-white shadow-lg` 
                : `${colors.textMuted} hover:text-current`
              }`}
          >
            <Zap className="w-4 h-4" />
            Gemini Flash
          </button>
          
          <button
            onClick={() => setActiveTab('elevenlabs')}
            className={`relative z-10 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300
              ${activeTab === 'elevenlabs' 
                ? `${isDarkMode ? 'bg-white text-neutral-950' : 'bg-slate-100 text-slate-900'} shadow-lg` 
                : `${colors.textMuted} hover:text-current`
              }`}
          >
            <Crown className="w-4 h-4" />
            ElevenLabs Pro
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* KOLOM KIRI (Konfigurasi) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className={`rounded-3xl border shadow-xl p-6 space-y-6 transition-colors ${colors.card}`}>
              <div className={`flex items-center gap-2 border-b pb-4 ${isDarkMode ? 'border-white/5' : 'border-blue-100'}`}>
                <Settings className={`w-4 h-4 ${colors.textMuted}`} />
                <span className={`text-xs font-bold tracking-widest uppercase ${colors.textMuted}`}>Konfigurasi Suara</span>
              </div>

              {activeTab === 'gemini' ? (
                // GEMINI CONFIG
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="space-y-2">
                    <label className={`text-sm block ${colors.textMuted}`}>Model Suara (30+ Archetypes)</label>
                    <div className="relative">
                      <select 
                        value={geminiVoiceId}
                        onChange={(e) => setGeminiVoiceId(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-opacity-100 transition-colors cursor-pointer text-sm
                          ${isDarkMode 
                            ? 'bg-neutral-950 border-white/10 text-white focus:border-lime-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'}`}
                      >
                         {customClones.length > 0 && (
                          <optgroup label="✨ Rekaman Tersimpan (Lokal)" className={isDarkMode ? "bg-neutral-900 text-lime-400" : "bg-white text-blue-600 font-bold"}>
                            {customClones.map(c => (
                              <option key={c.id} value={c.id} className={isDarkMode ? "text-white" : "text-slate-800 font-normal"}>{c.name}</option>
                            ))}
                          </optgroup>
                         )}

                         {Object.entries(VOICE_DATABASE_CATEGORIES).map(([category, voices]) => (
                          <optgroup key={category} label={category} className={isDarkMode ? "bg-neutral-900 text-lime-300" : "bg-white text-blue-600 font-bold"}>
                            {voices.map(v => (
                              <option key={v.id} value={v.id} className={isDarkMode ? "text-white" : "text-slate-800 font-normal"}>{v.name}</option>
                            ))}
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
                      <input 
                        type="text" 
                        value={styleInstruction}
                        onChange={(e) => setStyleInstruction(e.target.value)}
                        placeholder="Contoh: Sedih, Marah..."
                        className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-colors
                          ${isDarkMode 
                            ? 'bg-neutral-950 border-white/10 text-white placeholder-neutral-600 focus:border-lime-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'}`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {STYLE_PRESETS.map(style => (
                      <button 
                        key={style}
                        onClick={() => setStyleInstruction(style)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors border 
                          ${styleInstruction === style 
                            ? `${isDarkMode ? 'bg-lime-500/20 border-lime-500/50 text-lime-300' : 'bg-blue-500/10 border-blue-500/50 text-blue-600'}`
                            : `${isDarkMode ? 'bg-neutral-800 border-white/5 text-neutral-300' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>

                  {/* VOICE RECORDER */}
                  <div className={`pt-4 border-t space-y-3 ${isDarkMode ? 'border-white/5' : 'border-blue-100'}`}>
                    <label className={`text-sm font-bold block flex items-center gap-2 ${colors.accent}`}>
                      <Disc className="w-4 h-4 animate-spin-slow" />
                      Rekam Suara (Cloning)
                    </label>
                    
                    <div className={`rounded-xl p-3 border space-y-3 ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                       <div className="flex justify-between items-center">
                          <span className={`text-xs font-mono ${colors.textMuted}`}>
                             {isRecording ? `Merekam... ${recordingTime}s` : 'Siap Merekam'}
                          </span>
                          {isRecording && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                       </div>

                       <div className="flex gap-2">
                          <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all
                              ${isRecording 
                                ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
                                : `${isDarkMode ? 'bg-neutral-800 text-white border-white/10' : 'bg-white text-slate-700 border-slate-200 shadow-sm'}`}`}
                          >
                            {isRecording ? <Square className="w-3 h-3 fill-current" /> : <Mic className="w-3 h-3" />}
                            {isRecording ? 'Stop' : 'Mulai Rekam'}
                          </button>
                       </div>

                       {recordedUrl && (
                         <div className="space-y-2 animate-in slide-in-from-top-2">
                           <audio src={recordedUrl} controls className="w-full h-6 accent-blue-500" />
                           <div className="flex gap-2">
                             <input 
                               value={customCloneName}
                               onChange={(e) => setCustomCloneName(e.target.value)}
                               placeholder="Nama Voice Clone..."
                               className={`flex-1 border rounded px-2 text-xs focus:outline-none ${isDarkMode ? 'bg-neutral-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                             />
                             <button 
                               onClick={saveClone}
                               className={`px-3 rounded text-xs font-bold ${isDarkMode ? 'bg-lime-500 text-black' : 'bg-blue-600 text-white'}`}
                             >
                               Simpan
                             </button>
                           </div>
                         </div>
                       )}
                    </div>
                  </div>

                </div>
              ) : (
                // ELEVENLABS CONFIG
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className={`p-4 rounded-xl border space-y-4 ${isDarkMode ? 'bg-neutral-900 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className={`w-4 h-4 ${colors.accent}`} />
                        <h3 className={`text-sm font-bold ${colors.text}`}>Voice Model</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className={`text-[10px] uppercase font-bold mb-1 block ${colors.textMuted}`}>Nama Model</label>
                          <input 
                            value={elevenModelName}
                            onChange={(e) => setElevenModelName(e.target.value)}
                            placeholder="Contoh: My Custom Voice"
                            className={`w-full p-2 text-sm rounded-lg border focus:outline-none ${isDarkMode ? 'bg-black/50 border-white/10 text-white focus:border-lime-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'}`}
                          />
                        </div>
                        <div>
                          <label className={`text-[10px] uppercase font-bold mb-1 block ${colors.textMuted}`}>ID Model</label>
                          <input 
                            value={elevenModelId}
                            onChange={(e) => setElevenModelId(e.target.value)}
                            placeholder="Contoh: 21m00Tcm4TlvDq8ikWAM"
                            className={`w-full p-2 text-sm rounded-lg border font-mono focus:outline-none ${isDarkMode ? 'bg-black/50 border-white/10 text-white focus:border-lime-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'}`}
                          />
                        </div>
                      </div>
                  </div>

                  {!elevenLabsApiKey && (
                    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                      <AlertCircle className="text-red-400 w-5 h-5 shrink-0" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-red-400">API Key Kosong</p>
                        <p className="text-[10px] text-red-300/80">
                          Masukkan API Key ElevenLabs di menu Settings.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Statistik */}
            <div className={`hidden lg:block rounded-3xl border p-6 space-y-4 ${colors.card}`}>
              <div className="flex justify-between items-end">
                <span className={`text-sm ${colors.textMuted}`}>Jumlah Karakter</span>
                <span className="text-2xl font-bold font-mono">{charCount}</span>
              </div>
              <div className={`h-2 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-neutral-800' : 'bg-slate-200'}`}>
                <div 
                  className={`h-full transition-all duration-500 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}
                  style={{ width: `${Math.min((charCount / 500) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className={`text-xs ${colors.textMuted}`}>Estimasi Durasi</span>
                <span className={`text-sm font-mono ${colors.accent}`}>{estTime}</span>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (Editor) */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className={`rounded-3xl border overflow-hidden flex flex-col h-[400px] ${colors.card}`}>
              <div className={`border-b p-4 flex items-center justify-between ${isDarkMode ? 'bg-neutral-950/50 border-white/5' : 'bg-slate-50/50 border-blue-100'}`}>
                <div className="flex items-center gap-2">
                   <span className={`text-xs font-bold tracking-widest ml-2 ${colors.textMuted}`}>SCRIPT EDITOR</span>
                </div>
                <button 
                  onClick={handleAutoWrite}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all text-xs font-medium text-red-400"
                >
                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  Tulis Otomatis
                </button>
              </div>

              <div className="flex-1 p-6 relative">
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Ketik teks yang ingin diubah menjadi suara di sini..."
                  className={`w-full h-full bg-transparent resize-none focus:outline-none text-lg leading-relaxed font-medium ${isDarkMode ? 'text-neutral-200 placeholder-neutral-700' : 'text-slate-700 placeholder-slate-300'}`}
                />
              </div>

              <div className={`p-6 border-t space-y-4 ${isDarkMode ? 'bg-neutral-950/30 border-white/5' : 'bg-slate-50/50 border-blue-100'}`}>
                {statusMsg && (
                  <div className={`flex items-center gap-2 text-sm animate-in slide-in-from-bottom-2 fade-in
                    ${statusMsg.type === 'error' ? 'text-red-400' : 'text-green-500'}`}
                  >
                    {statusMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    {statusMsg.text}
                  </div>
                )}

                <button
                  onClick={generateAudio}
                  disabled={isLoading}
                  className={`w-full h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${colors.buttonPrimary}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Memproses Suara...</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-6 h-6" />
                      <span>Buat Suara Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* STICKY PLAYER & LIBRARY */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className={`flex items-center gap-2 ${colors.textMuted}`}>
                   <ListMusic className="w-5 h-5" />
                   <h3 className="font-bold text-sm uppercase tracking-widest">Library & History</h3>
                </div>
                {history.length > 0 && (
                   <button 
                     onClick={clearAllHistory}
                     className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                   >
                     <Archive className="w-3 h-3" /> Hapus Semua
                   </button>
                )}
              </div>

              {/* STICKY PLAYER CARD */}
              {currentAudio && (
                <div className={`sticky top-24 z-30 backdrop-blur-md rounded-2xl border p-4 shadow-2xl animate-in slide-in-from-top-4 
                  ${isDarkMode ? 'bg-neutral-800/90 border-lime-500/30' : 'bg-white/90 border-blue-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border shrink-0 
                      ${isDarkMode ? 'bg-lime-500/20 border-lime-500/30' : 'bg-blue-100 border-blue-200'}`}>
                      {isPlaying ? (
                        <div className="flex gap-0.5 items-end h-5">
                          <div className={`w-1 h-3 animate-[pulse_0.5s_ease-in-out_infinite] ${isDarkMode ? 'bg-lime-400' : 'bg-blue-600'}`}></div>
                          <div className={`w-1 h-5 animate-[pulse_0.7s_ease-in-out_infinite] ${isDarkMode ? 'bg-lime-400' : 'bg-blue-600'}`}></div>
                          <div className={`w-1 h-2 animate-[pulse_0.4s_ease-in-out_infinite] ${isDarkMode ? 'bg-lime-400' : 'bg-blue-600'}`}></div>
                        </div>
                      ) : (
                        <Music className={`w-6 h-6 ${isDarkMode ? 'text-lime-400' : 'text-blue-600'}`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                         <h4 className={`font-medium truncate text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentAudio.text}</h4>
                         <span className={`text-[10px] border px-1.5 rounded 
                           ${isDarkMode ? 'text-lime-400 border-lime-500/20' : 'text-blue-600 border-blue-200 bg-blue-50'}`}>
                           {currentAudio.voice}
                         </span>
                      </div>
                      
                      <audio 
                        ref={audioRef}
                        src={currentAudio.url}
                        onEnded={() => setIsPlaying(false)}
                        onPause={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                        controls
                        className={`w-full h-8 ${isDarkMode ? 'accent-lime-500' : 'accent-blue-600'}`}
                        style={{ filter: isDarkMode ? 'hue-rotate(280deg) invert(10%)' : 'none' }} 
                      />
                    </div>
                  </div>

                  {/* Speed & Download Control */}
                  <div className="flex items-center justify-between mt-3 pl-16">
                     <div className="flex items-center gap-2">
                        <Gauge className={`w-3 h-3 ${colors.textMuted}`} />
                        <select 
                          value={playbackSpeed}
                          onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                          className={`border text-[10px] rounded px-1 py-0.5 focus:outline-none
                            ${isDarkMode ? 'bg-neutral-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                        >
                          <option value="0.5">0.5x (Lambat)</option>
                          <option value="1.0">1.0x (Normal)</option>
                          <option value="1.25">1.25x (Cepat)</option>
                          <option value="1.5">1.5x (Ngebut)</option>
                          <option value="2.0">2.0x (Kilat)</option>
                        </select>
                     </div>
                     
                     <a 
                       href={currentAudio.url}
                       download={generateFilename(currentAudio.text)}
                       className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors
                         ${isDarkMode ? 'bg-lime-500 text-neutral-950 hover:bg-lime-400' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                     >
                       <Download className="w-3 h-3" /> Unduh
                     </a>
                  </div>
                </div>
              )}

              {/* LIST HISTORY */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {history.length === 0 ? (
                  <div className={`text-center py-12 border border-dashed rounded-2xl ${isDarkMode ? 'border-white/10' : 'border-slate-300'}`}>
                    <History className={`w-8 h-8 mx-auto mb-2 ${colors.textMuted}`} />
                    <p className={`text-sm ${colors.textMuted}`}>Belum ada riwayat suara.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div 
                      key={item.id}
                      className={`group flex items-center justify-between p-3 rounded-xl border transition-all 
                        ${currentAudio?.id === item.id 
                          ? `${isDarkMode ? 'bg-neutral-800 border-lime-500/30' : 'bg-blue-50 border-blue-200'}` 
                          : `${isDarkMode ? 'bg-neutral-900 border-white/5 hover:bg-neutral-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`}`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button 
                          onClick={() => {
                            if (currentAudio?.id === item.id && isPlaying) togglePlayPause();
                            else playAudio(item);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                            ${currentAudio?.id === item.id 
                              ? `${isDarkMode ? 'bg-lime-500 text-black' : 'bg-blue-600 text-white'}` 
                              : `${isDarkMode ? 'bg-neutral-800 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}`}
                        >
                          {currentAudio?.id === item.id && isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                        </button>
                        
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate pr-4 ${currentAudio?.id === item.id ? colors.accent : colors.text}`}>
                            {item.text}
                          </p>
                          <div className={`flex items-center gap-2 text-[10px] ${colors.textMuted}`}>
                             <span>{item.date}</span>
                             <span>•</span>
                             <span>{item.voice}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <a 
                           href={item.url}
                           download={generateFilename(item.text)}
                           className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10 text-neutral-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'}`}
                           title="Unduh"
                         >
                           <Download className="w-4 h-4" />
                         </a>
                         <button 
                           onClick={() => deleteItem(item.id)}
                           className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400"
                           title="Hapus"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={`mt-8 py-8 border-t flex flex-col items-center justify-center gap-4 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
        <a 
          href="https://sociabuzz.com/syukrankatsiron/tribe" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95
             ${isDarkMode ? 'bg-pink-600 text-white shadow-pink-600/20' : 'bg-pink-500 text-white shadow-pink-500/30'}`}
        >
          <Heart className="w-4 h-4 fill-current" />
          Support Us
        </a>

        <a 
          href="https://ko-fi.com/syukran/tip" 
          target="_blank" 
          rel="noopener noreferrer"
          className="transition-transform hover:scale-105 active:scale-95"
        >
          <img 
            src="https://raw.githubusercontent.com/vandratop/Yuk/872daa6f963613ba58fc4ff71f886beed94ff15d/support_me_on_kofi_beige.png" 
            alt="Buy me a Ko-fi" 
            className="h-10 md:h-12"
          />
        </a>
        <p className={`text-sm font-mono animate-pulse tracking-widest ${isDarkMode ? 'text-lime-400/80' : 'text-blue-600/80'}`}>
          Te_eR™ Inovative @2026
        </p>
      </footer>

      {/* MODAL SETTINGS */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSettingsOpen(false)}
          />
          <div className={`rounded-2xl border w-full max-w-md relative z-10 p-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]
            ${isDarkMode ? 'bg-neutral-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute right-4 top-4 hover:opacity-70 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER SETTINGS */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                <Settings className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h2 className="text-xl font-bold">Pengaturan</h2>
            </div>

            <div className="space-y-6">
              
              {/* 1. TRANSLATE */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Globe className={`w-4 h-4 ${colors.accent}`} />
                  <h3 className="text-sm font-bold">Translate (Gratis via Gemini)</h3>
                </div>
                
                <div className="space-y-2">
                  <label className={`text-[10px] uppercase font-bold ${colors.textMuted}`}>Bahasa Tujuan</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className={`w-full p-2 text-sm rounded-lg border focus:outline-none 
                      ${isDarkMode ? 'bg-neutral-900 border-white/10' : 'bg-white border-slate-200'}`}
                  >
                    {TARGET_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={handleTranslate}
                  disabled={isLoading}
                  className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all
                    ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-400 text-white'}`}
                >
                  <Languages className="w-3 h-3" />
                  {isLoading ? "Menerjemahkan..." : "Terjemahkan Teks Editor"}
                </button>
              </div>

              {/* 2. TEMA APLIKASI */}
              <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                 <div className="flex items-center gap-2">
                    {isDarkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-orange-500" />}
                    <span className="text-sm font-bold">Mode Tampilan</span>
                 </div>
                 <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors
                      ${isDarkMode ? 'bg-neutral-800 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-sm'}`}
                 >
                    {isDarkMode ? 'Gelap' : 'Terang'}
                 </button>
              </div>

              {/* 3. API KEYS */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                   <Key className={`w-4 h-4 ${colors.textMuted}`} />
                   <h3 className="text-sm font-bold">API Keys Lainnya</h3>
                </div>
                <label className={`text-[10px] uppercase font-bold mb-1 block ${colors.textMuted}`}>
                  ElevenLabs API Key
                </label>
                <input 
                  type="password" 
                  value={elevenLabsApiKey}
                  onChange={(e) => setElevenLabsApiKey(e.target.value)}
                  placeholder="sk_..."
                  className={`w-full p-3 rounded-xl border focus:outline-none transition-colors
                    ${isDarkMode ? 'bg-black/50 border-white/10 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'}`}
                />
              </div>

              <button 
                onClick={saveSettings}
                className={`w-full font-medium py-3 rounded-xl flex items-center justify-center gap-2 mt-4 transition-colors text-white
                   ${isDarkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/20'}`}
              >
                <Save className="w-4 h-4" />
                Simpan Semua Pengaturan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
