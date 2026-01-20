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
  Smile,
  Mail,
  BookOpen,
  Map,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Check,
  ChevronLeft,
  FileText,
  Shield,
  Info
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
      title: "Kebijakan Privasi (Privacy Policy)",
      content: `
      1. Pengumpulan Data
      Kami memprioritaskan privasi Anda. Aplikasi ini dirancang sebagai Client-Side Application, yang berarti sebagian besar pemrosesan data terjadi langsung di perangkat (browser) Anda.

      Teks & Audio: Teks yang Anda ketik dan audio yang dihasilkan diproses sementara untuk tujuan konversi suara.

      Rekaman Suara (Cloning): Jika Anda menggunakan fitur Voice Cloning, rekaman suara Anda diproses hanya untuk membuat embedding suara dan disimpan secara lokal di browser (Local Storage) atau dikirim ke API Pihak Ketiga (Gemini/ElevenLabs) hanya untuk durasi pemrosesan. Kami tidak menyimpan rekaman suara Anda di server database kami.

      2. Keamanan API Key
      Ini adalah prioritas utama kami.
      Jika Anda memasukkan API Key pribadi (Gemini atau ElevenLabs), kunci tersebut DISIMPAN SECARA LOKAL di browser Anda (localStorage).
      Kami TIDAK mengirimkan API Key Anda ke server kami, database kami, atau pihak ketiga manapun selain langsung ke penyedia layanan AI (Google/ElevenLabs) untuk memproses permintaan Anda.
      Anda memiliki kendali penuh untuk menghapus API Key dari penyimpanan browser kapan saja melalui menu Pengaturan.

      3. Layanan Pihak Ketiga
      Aplikasi ini menggunakan layanan API dari:
      Google Gemini (Generative AI): Untuk pemrosesan teks, terjemahan, dan Text-to-Speech (Flash Model).
      ElevenLabs: Untuk sintesis suara berkualitas tinggi.
      Dengan menggunakan aplikasi ini, Anda juga tunduk pada kebijakan privasi Google dan ElevenLabs terkait data yang dikirimkan melalui API mereka.
      `
    },
    tos: {
      title: "Syarat & Ketentuan (Terms of Service)",
      content: `
      1. Penggunaan Layanan
      Te_eR™ to Speech adalah alat bantu kreativitas. Anda setuju untuk tidak menggunakan layanan ini untuk:
      Membuat konten ilegal, ujaran kebencian, fitnah, atau konten yang melanggar hukum di Indonesia dan atau di Negara tempat tinggal Anda.
      Meniru suara tokoh publik/orang lain tanpa izin untuk tujuan penipuan (deepfakes).

      2. Batasan Penggunaan (Rate Limiting)
      Pengguna Gratis (Default API): Kami menyediakan akses gratis menggunakan kuota bersama. Jika terjadi Error 429 (Too Many Requests), itu berarti kuota global sedang penuh. Harap tunggu 1-5 menit sebelum mencoba lagi.
      Pengguna API Key Pribadi: Jika Anda menggunakan API Key sendiri, batasan penggunaan mengikuti kuota akun Google/ElevenLabs pribadi Anda. Kami tidak bertanggung jawab atas biaya yang mungkin timbul dari penyedia API jika Anda melebihi kuota gratis mereka.

      3. Batasan Karakter
      Demi menjaga stabilitas performa:
      Sekali generate, disarankan maksimal 500 - 1.000 karakter.
      Teks yang terlalu panjang berisiko terpotong atau gagal diproses oleh server AI.

      4. Hak Cipta (Intellectual Property)
      Aplikasi: Kode sumber, desain antarmuka, dan branding "Te_eR™" adalah hak cipta pengembang.
      Konten Hasil Generate: Suara yang Anda hasilkan adalah milik Anda. Anda bebas menggunakannya untuk konten YouTube, TikTok, atau kebutuhan komersial lainnya, KECUALI dibatasi oleh ketentuan layanan dari model AI yang digunakan (Google/ElevenLabs).
      Catatan: Pastikan Anda memiliki lisensi yang sesuai jika menggunakan musik latar atau aset lain di luar aplikasi ini.

      5. Penyangkalan (Disclaimer)
      Layanan ini disediakan "sebagaimana adanya". Kami tidak menjamin layanan akan selalu aktif 100% tanpa gangguan, mengingat ketergantungan pada server pihak ketiga.
      `
    }
  },
  en: {
    privacy: {
      title: "Privacy Policy",
      content: `
      1. Data Collection
      We prioritize your privacy. This application is designed as a Client-Side Application, meaning most data processing happens directly on your device (browser).

      Text & Audio: The text you type and the generated audio are processed temporarily for voice conversion purposes.

      Voice Recording (Cloning): If you use the Voice Cloning feature, your voice recording is processed only to create voice embeddings and is stored locally in the browser (Local Storage) or sent to Third-Party APIs (Gemini/ElevenLabs) solely for processing duration. We do not store your voice recordings on our database servers.

      2. API Key Security
      This is our top priority.
      If you enter a personal API Key (Gemini or ElevenLabs), the key is STORED LOCALLY in your browser (localStorage).
      We DO NOT send your API Key to our servers, our database, or any third party other than directly to the AI service providers (Google/ElevenLabs) to process your request.
      You have full control to remove the API Key from browser storage at any time via the Settings menu.

      3. Third-Party Services
      This application uses API services from:
      Google Gemini (Generative AI): For text processing, translation, and Text-to-Speech (Flash Model).
      ElevenLabs: For high-quality voice synthesis.
      By using this application, you are also subject to Google's and ElevenLabs' privacy policies regarding data sent via their APIs.
      `
    },
    tos: {
      title: "Terms of Service",
      content: `
      1. Service Usage
      Te_eR™ to Speech is a creativity tool. You agree not to use this service to:
      Create illegal content, hate speech, defamation, or content that violates laws in Indonesia and or your country stayed.
      Impersonate public figures/others without permission for fraudulent purposes (deepfakes).

      2. Usage Limits (Rate Limiting)
      Free Users (Default API): We provide free access using a shared quota. If Error 429 (Too Many Requests), it means the global quota is full. Please wait 1-5 minutes before trying again.
      Personal API Key Users: If you use your own API Key, usage limits follow your personal Google/ElevenLabs account quota. We are not responsible for costs that may arise from API providers if you exceed their free quotas.

      3. Character Limits
      To maintain performance stability:
      Per generation, we recommend a maximum of 500 - 1,000 characters.
      Text that is too long risks being cut off or failing to process by the AI server.

      4. Intellectual Property
      Application: Source code, interface design, and "Te_eR™" branding are the developer's copyright.
      Generated Content: The voice you generate is yours. You are free to use it for YouTube, TikTok, or other commercial needs, UNLESS restricted by the terms of service of the AI model used (Google/ElevenLabs).
      Note: Ensure you have appropriate licenses if using background music or other assets outside this application.

      5. Disclaimer
      This service is provided "as is". We do not guarantee the service will be 100% active without interruption, given the dependence on third-party servers.
      `
    }
  }
};

const FAQ_DATA = {
  id: [
    { q: "Kenapa muncul pesan 'API Key Tidak Valid' atau error generate suara?", a: "API Key Not Valid berarti BELUM ADA (Masih Kosong), belum di masukan di kolom pengaturan API KEY. Solusi: Silahkan Copy paste API Key Gemini/ ElevenLabs di kolom pengisian API Key. BELUM memiliki API Key? Klik icon gerigi (pengaturan) di pojok kanan atas, klik salah satu 'Get Key' otomatis Anda akan di arahkan ke website penyedia API Key Gemini / ElevenLabs." },
    { q: "Apakah aman memasukkan API Key saya sendiri di sini?", a: "Sangat aman. Seperti dijelaskan dalam Kebijakan Privasi, API Key Anda hanya disimpan di Local Storage browser (HP/Laptop) Anda sendiri. Kunci tersebut tidak pernah dikirim ke server kami." },
    { q: "Apakah saya boleh menggunakan suara hasil download untuk YouTube/Monetisasi?", a: "Ya, boleh! Hasil suara yang dihasilkan melalui Gemini Flash dan ElevenLabs umumnya boleh digunakan untuk konten komersial. Namun, Anda tetap disarankan untuk memeriksa kebijakan terbaru dari Google AI Studio dan ElevenLabs Free/Pro plan untuk kepastian hukum penuh." },
    { q: "Berapa panjang teks maksimal yang bisa saya ubah jadi suara?", a: "Tidak ada batasan harian, tapi per satu kali klik 'Buat Suara', kami menyarankan maksimal 1.000 karakter. Jika Anda punya naskah panjang, silakan pecah menjadi beberapa paragraf." },
    { q: "Kenapa fitur Rekam Suara (Cloning) hasilnya berbeda dengan suara asli saya?", a: "Fitur cloning pada Gemini Flash masih dalam tahap eksperimental (Preview). Kualitas kemiripan sangat bergantung pada kualitas mikrofon Anda, kebisingan latar belakang, dan kejelasan pengucapan saat merekam." },
    { q: "Kenapa muncul pesan 'HTTP Error 429' atau suara tidak keluar?", a: "Error 429 berarti 'Terlalu Banyak Permintaan'. Karena ini adalah layanan gratis, server Google membatasi jumlah permintaan per menit. Solusi: Tunggu sekitar 1-3 menit, lalu coba lagi." },
    { q: "Bagaimana cara menghubungi, menyampaikan masukan/ keluhan?", a: "Silahkan klik icon ✉️ Contact Us di bagian footer. Anda otomatis akan terhubung dengan platform email." },
    { q: "Bagaimana jika ingin berdonasi?", a: "Silahkan klik tombol button support us atau Buy me Ko-fi di bagian footer." }
  ],
  en: [
    { q: "Why do I get 'Invalid API Key' message or voice generation error?", a: "Invalid API Key means it is EMPTY or not entered in the settings. Solution: Copy paste your Gemini/ElevenLabs API Key in the settings. Don't have one? Click the settings gear icon, click 'Get Key' to be directed to the provider's website." },
    { q: "Is it safe to enter my own API Key here?", a: "Very safe. As explained in the Privacy Policy, your API Key is only stored in your browser's Local Storage (Phone/Laptop). It is never sent to our servers." },
    { q: "Can I use the downloaded voice for YouTube/Monetization?", a: "Yes, you can! Voices generated via Gemini Flash and ElevenLabs are generally allowed for commercial content. However, please check the latest policies from Google AI Studio and ElevenLabs Free/Pro plans for full legal certainty." },
    { q: "What is the max text length I can convert?", a: "There is no daily limit, but per 'Generate' click, we recommend max 1,000 characters. If you have a long script, please break it into paragraphs." },
    { q: "Why does Voice Cloning sound different from my real voice?", a: "Cloning on Gemini Flash is experimental (Preview). Similarity depends heavily on mic quality, background noise, and pronunciation clarity." },
    { q: "Why 'HTTP Error 429' or no sound?", a: "Error 429 means 'Too Many Requests'. As a free service, Google limits requests per minute. Solution: Wait 1-3 minutes and try again." },
    { q: "How to contact for feedback/complaints?", a: "Click the ✉️ Contact Us icon in the footer. You will be connected to email platform." },
    { q: "How to donate?", a: "Click the Support Us or Buy me Ko-fi button in the footer." }
  ]
};

const TRANSLATIONS = {
  id: {
    tagline: "TEXT TO BACOT PRO",
    heroTitle1: "Ubah Teks Jadi",
    heroTitle2: "Suara",
    heroDesc: "Platform Text-to-Speech tercanggih dengan dukungan model suara aksen dari beberapa negara, logat daerah Indonesia, kloning suara, dan emosi yang nyata.",
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
    warningNote: "Note : Harap di perhatikan untuk generate TTS yang mencantumkan API KEY GRATIS, penggunaannya JANGAN terlalu over generate, berikan jeda waktu min 3-5 menit untuk generate TTS selanjutnya untuk menghindari 'error' saat generate.",
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
    heroDynamicText: "OF LIFE",
    heroDesc: "The most advanced Text-to-Speech platform with support for international accents, Indonesian local dialects, voice cloning, and real emotions.",
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
    warningNote: "Note: Please be aware for TTS generation using FREE API KEYS, do NOT over-generate. Allow a time gap of min 3-5 minutes for the next TTS generation to avoid errors.",
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
  // ADDED NEW SAMPLES
  { title: "Accent Russian (Halo my friend)", file: "https://github.com/Klik2/TTSPRO/blob/main/public/Te_eR_Halo_my_friend_PrivietMy__2026-01-16-19-20-04.wav?raw=true", type: "Accent" },
  { title: "Accent UK (British)", file: "https://github.com/Klik2/TTSPRO/blob/main/public/Te_eR_Harry_Potter_is_enjoying__2026-01-15-11-57-44.wav?raw=true", type: "Accent" },
  { title: "Accent French", file: "https://github.com/Klik2/TTSPRO/blob/ea677abccaf7bb44bd72904109bb7c2540bc2e94/public/Te_eR_1_Sous_la_vote_azure_nous_2026-01-16-21-12-02.wav?raw=true", type: "Accent" },
  { title: "Accent Spanish", file: "https://github.com/Klik2/TTSPRO/blob/ea677abccaf7bb44bd72904109bb7c2540bc2e94/public/Te_eR_Humor_La_lucha_diaria1_To_2026-01-16-21-08-29.wav?raw=true", type: "Accent" },
  { title: "Accent Hindi", file: "https://github.com/Klik2/TTSPRO/blob/ea677abccaf7bb44bd72904109bb7c2540bc2e94/public/Te_eR_Humour_Rozmarra_ki_Jaddoj_2026-01-16-21-05-05.wav?raw=true", type: "Accent" },
  { title: "Accent Chinese", file: "https://github.com/Klik2/TTSPRO/blob/ea677abccaf7bb44bd72904109bb7c2540bc2e94/public/Te_eR__2026-01-16-20-56-14.wav?raw=true", type: "Accent" },
  { title: "Accent Japanese", file: "https://github.com/Klik2/TTSPRO/blob/ea677abccaf7bb44bd72904109bb7c2540bc2e94/public/Te_eR_1_2_3_2026-01-16-21-00-54.wav?raw=true", type: "Accent" },
  // UPDATED QORI PRIA
  { title: "Murotal Qori Pria", file: "https://github.com/Klik2/TTSPRO/blob/0a224c95b984d66528cf2c1bbdac40e9346263d7/public/Te_eR_suara_sy_QS-18-1.wav?raw=true", type: "Qori" },
  { title: "Murotal Qori Wanita", file: "https://github.com/Klik2/TTSPRO/blob/main/public/Te_eR_Quran_Surah_AlKahfi_18_1_2026-01-15-02-21-10.wav?raw=true", type: "Qori" },
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
  "Tes satu dua tiga, dicoba! Mic-nya aman kan gais? Suara saya terdengar jelas?",
  "Hari ini mendung, tapi hatiku tetap cerah secerah layar HP kamu saat melihat notifikasi gajian.",
  "Makan nasi pakai kerupuk, jangan lupa bayar hutang yang numpuk. Hidup indah tanpa cicilan!",
  "Di balik tawa yang renyah, terdapat tagihan paylater yang meresahkan jiwa dan raga.",
  "Selamat pagi dunia tipu-tipu, semoga hari ini kita tetap waras walau deadline menumpuk."
];

const VOICE_MAPPING: Record<string, { baseVoice: string, gender: 'male' | 'female', promptContext: string }> = {
  // Official
  "Kore": { baseVoice: "Kore", gender: "female", promptContext: "Normal" },
  "Fenrir": { baseVoice: "Fenrir", gender: "male", promptContext: "Normal" },
  
  // Daerah
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
  
  // QORI
  "Bayyati_Qori1": { baseVoice: "Charon", gender: "male", promptContext: "Reciting Quran style, Bayyati tone, warm, soft, calm, like Qori Muhammad Siddiq Al-Minshawi" },
  "Bayyati_Qori2": { baseVoice: "Fenrir", gender: "male", promptContext: "Reciting Quran style, Bayyati tone, clear, steady, like Qori Mahmoud Khalil Al-Hussary" },
  "Bayyati_Qori3": { baseVoice: "Zephyr", gender: "male", promptContext: "Reciting Quran style, Bayyati tone, melodic, like Qori Muammar Z.A." },
  "Hijaz_Qori1": { baseVoice: "Fenrir", gender: "male", promptContext: "Reciting Quran style, Hijaz tone, sharp, emotional, high pitch, like Qori Abdul Basit" },
  "Hijaz_Qori2": { baseVoice: "Puck", gender: "male", promptContext: "Reciting Quran style, Hijaz tone, dynamic, faster, like Qori Ahmed Al-Ajmi" },
  "Hijaz_Qori3": { baseVoice: "Zephyr", gender: "male", promptContext: "Reciting Quran style, Hijaz tone, soft but emotional, like Qori Islam Sobhi" },
  "Nahawand_Qori1": { baseVoice: "Charon", gender: "male", promptContext: "Reciting Quran style, Nahawand tone, sad, dramatic, deep, like Qori Mishary Rashid Alafasy" },
  "Nahawand_Qori2": { baseVoice: "Fenrir", gender: "male", promptContext: "Reciting Quran style, Nahawand tone, dramatic, engaging, like Qori Omar Hisham Al Arabi" },
  "Nahawand_Qori3": { baseVoice: "Zephyr", gender: "male", promptContext: "Reciting Quran style, Nahawand tone, high variation, beautiful sadness, like Qori Salman Amrillah" },
};

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

const VOICE_CATEGORIES_CONFIG = [
  { key: "cat_gemini", id: "Gemini Original", voices: [
    { name: "Kore (Wanita, Jernih)", id: "Kore" },
    { name: "Fenrir (Pria, Berat)", id: "Fenrir" },
    { name: "Puck (Pria, Ringan)", id: "Puck" },
    { name: "Zephyr (Pria, Tenang)", id: "Zephyr" },
    { name: "Charon (Pria, Deep)", id: "Charon" },
  ]},
  { key: "cat_logat_pria", id: "Logat Daerah (Pria)", voices: [
    { name: "Mas Joko (Logat Jawa Medok)", id: "Jawa_Generic_ID_01" },
    { name: "Bang Jampang (Logat Betawi)", id: "Betawi_Generic_ID_01" },
    { name: "Tulang Batak (Tegas & Keras)", id: "Batak_Generic_ID_01" },
    { name: "Bli Wayan (Logat Bali)", id: "Bali_Generic_ID_01" },
    { name: "Uda Rizal (Logat Minang)", id: "Minang_Generic_ID_01" },
  ]},
  { key: "cat_logat_wanita", id: "Logat Daerah (Wanita)", voices: [
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
  ]},
  { key: "cat_accent_male", id: "Accent Negara (Pria Dewasa)", voices: [
    { name: "Accent USA", id: "Acc_Male_USA" }, { name: "Accent UK", id: "Acc_Male_UK" }, { name: "Accent Aussie", id: "Acc_Male_Aussie" },
    { name: "Accent Rusia", id: "Acc_Male_Rusia" }, { name: "Accent France", id: "Acc_Male_France" }, { name: "Accent Spain", id: "Acc_Male_Spain" },
    { name: "Accent Italian", id: "Acc_Male_Italian" }, { name: "Accent Germany", id: "Acc_Male_Germany" }, { name: "Accent Latina", id: "Acc_Male_Latina" },
    { name: "Accent Middle East", id: "Acc_Male_MiddleEast" }, { name: "Accent Chinese", id: "Acc_Male_Chinese" }, { name: "Accent Hindi", id: "Acc_Male_Hindi" },
    { name: "Accent Melayu", id: "Acc_Male_Melayu" }, { name: "Accent Singapore", id: "Acc_Male_Singapore" }, { name: "Accent African", id: "Acc_Male_African" },
  ]},
  { key: "cat_accent_female", id: "Accent Negara (Wanita Dewasa)", voices: [
    { name: "Accent USA", id: "Acc_Female_USA" }, { name: "Accent UK", id: "Acc_Female_UK" }, { name: "Accent Aussie", id: "Acc_Female_Aussie" },
    { name: "Accent Rusia", id: "Acc_Female_Rusia" }, { name: "Accent France", id: "Acc_Female_France" }, { name: "Accent Spain", id: "Acc_Female_Spain" },
    { name: "Accent Italian", id: "Acc_Female_Italian" }, { name: "Accent Germany", id: "Acc_Female_Germany" }, { name: "Accent Latina", id: "Acc_Female_Latina" },
    { name: "Accent Middle East", id: "Acc_Female_MiddleEast" }, { name: "Accent Chinese", id: "Acc_Female_Chinese" }, { name: "Accent Hindi", id: "Acc_Female_Hindi" },
    { name: "Accent Melayu", id: "Acc_Female_Melayu" }, { name: "Accent Singapore", id: "Acc_Female_Singapore" }, { name: "Accent African", id: "Acc_Female_African" },
  ]},
  { key: "cat_accent_boy", id: "Accent Negara (Anak Laki-laki)", voices: [
    { name: "Accent USA", id: "Acc_Boy_USA" }, { name: "Accent UK", id: "Acc_Boy_UK" }, { name: "Accent Aussie", id: "Acc_Boy_Aussie" },
    { name: "Accent Rusia", id: "Acc_Boy_Rusia" }, { name: "Accent France", id: "Acc_Boy_France" }, { name: "Accent Spain", id: "Acc_Boy_Spain" },
    { name: "Accent Italian", id: "Acc_Boy_Italian" }, { name: "Accent Germany", id: "Acc_Boy_Germany" }, { name: "Accent Latina", id: "Acc_Boy_Latina" },
    { name: "Accent Middle East", id: "Acc_Boy_MiddleEast" }, { name: "Accent Chinese", id: "Acc_Boy_Chinese" }, { name: "Accent Hindi", id: "Acc_Boy_Hindi" },
    { name: "Accent Melayu", id: "Acc_Boy_Melayu" }, { name: "Accent Singapore", id: "Acc_Boy_Singapore" }, { name: "Accent African", id: "Acc_Boy_African" },
  ]},
  { key: "cat_accent_girl", id: "Accent Negara (Anak Wanita)", voices: [
    { name: "Accent USA", id: "Acc_Girl_USA" }, { name: "Accent UK", id: "Acc_Girl_UK" }, { name: "Accent Aussie", id: "Acc_Girl_Aussie" },
    { name: "Accent Rusia", id: "Acc_Girl_Rusia" }, { name: "Accent France", id: "Acc_Girl_France" }, { name: "Accent Spain", id: "Acc_Girl_Spain" },
    { name: "Accent Italian", id: "Acc_Girl_Italian" }, { name: "Accent Germany", id: "Acc_Girl_Germany" }, { name: "Accent Latina", id: "Acc_Girl_Latina" },
    { name: "Accent Middle East", id: "Acc_Girl_MiddleEast" }, { name: "Accent Chinese", id: "Acc_Girl_Chinese" }, { name: "Accent Hindi", id: "Acc_Girl_Hindi" },
    { name: "Accent Melayu", id: "Acc_Girl_Melayu" }, { name: "Accent Singapore", id: "Acc_Girl_Singapore" }, { name: "Accent African", id: "Acc_Girl_African" },
  ]},
  { key: "cat_tokoh", id: "Tokoh Publik & Selebriti", voices: [
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
  ]},
  { key: "cat_qori", id: "Murotal PRO (Qori)", voices: [
    { name: "Bayati Qori-1 (Hangat/Lembut)", id: "Bayyati_Qori1" },
    { name: "Bayati Qori-2 (Tegas/Tenang)", id: "Bayyati_Qori2" },
    { name: "Bayati Qori-3 (Melodious)", id: "Bayyati_Qori3" },
    { name: "Hijaz Qori-1 (Tajam/Emosional)", id: "Hijaz_Qori1" },
    { name: "Hijaz Qori-2 (Cepat/Dinamis)", id: "Hijaz_Qori2" },
    { name: "Hijaz Qori-3 (Halus/Sedih)", id: "Hijaz_Qori3" },
    { name: "Nahawand Qori-1 (Sedih/Dalam)", id: "Nahawand_Qori1" },
    { name: "Nahawand Qori-2 (Dramatis)", id: "Nahawand_Qori2" },
    { name: "Nahawand Qori-3 (Indah)", id: "Nahawand_Qori3" },
  ]},
];

const defaultApiKey = ""; // Used as fallback if user doesn't provide key

// --- 2. UTILITY FUNCTIONS ---

// ... (fetchWithRetry, base64ToArrayBuffer, pcmToWav, generateFilename remain the same)

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

// --- 3. COMPONENTS ---

const InfoModal = ({ title, content, onClose, onAgree, onDisagree, showButtons, t, isDarkMode }: any) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={`rounded-2xl border w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-neutral-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-center flex-1">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar leading-relaxed whitespace-pre-line text-sm opacity-90">
          {content}
        </div>

        {/* Footer Buttons */}
        {showButtons && (
          <div className={`p-4 border-t flex flex-col sm:flex-row gap-3 ${isDarkMode ? 'border-white/5 bg-black/20' : 'border-slate-100 bg-slate-50'}`}>
            <button 
              onClick={onDisagree}
              className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-300 hover:bg-slate-200'}`}
            >
              {t.disagreeBtn}
            </button>
            <button 
              onClick={onAgree}
              className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'}`}
            >
              {t.agreeBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const FAQSection = ({ data, t, isDarkMode }: any) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className={`rounded-2xl border overflow-hidden transition-colors ${isDarkMode ? 'bg-neutral-900 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className={`p-4 border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
        <h3 className="font-bold flex items-center gap-2">
           <HelpCircle className="w-5 h-5 text-blue-500" /> {t.faqTitle}
        </h3>
      </div>
      <div>
        {data.map((item: any, i: number) => (
          <div key={i} className={`border-b last:border-0 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
            <button 
              onClick={() => toggle(i)}
              className={`w-full px-4 py-4 text-left flex items-start justify-between gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
            >
              <span className="text-sm font-semibold">{item.q}</span>
              {openIndex === i ? <ChevronUp className="w-4 h-4 shrink-0 mt-1 opacity-50" /> : <ChevronDown className="w-4 h-4 shrink-0 mt-1 opacity-50" />}
            </button>
            {openIndex === i && (
              <div className={`px-4 pb-4 pt-0 text-sm opacity-80 leading-relaxed ${isDarkMode ? 'text-neutral-300' : 'text-slate-600'}`}>
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom Dropdown Component
const CustomVoiceSelect = ({ selectedId, onChange, isDarkMode, customClones, t }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (catKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenCategory(openCategory === catKey ? null : catKey);
  };

  const handleSelect = (voiceId: string) => {
    onChange(voiceId);
    setIsOpen(false);
  };

  let selectedName = t.select_voice_placeholder;
  const custom = customClones.find((c: any) => c.id === selectedId);
  if (custom) selectedName = custom.name;
  else {
    for (const cat of VOICE_CATEGORIES_CONFIG) {
      const found = cat.voices.find(v => v.id === selectedId);
      if (found) {
        selectedName = found.name;
        break;
      }
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
          isDarkMode 
            ? 'bg-neutral-950 border-white/10 text-white hover:border-lime-500' 
            : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-blue-500'
        }`}
      >
        <span className="truncate text-sm">{selectedName}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
      </div>

      {isOpen && (
        <div className={`absolute z-50 w-full mt-2 rounded-xl shadow-2xl border overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar ${
          isDarkMode ? 'bg-neutral-900 border-white/10' : 'bg-white border-slate-200'
        }`}>
          {customClones.length > 0 && (
            <div className="border-b border-white/5 last:border-0">
               <div 
                  onClick={(e) => toggleCategory("custom", e)}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex justify-between items-center cursor-pointer ${
                    isDarkMode ? 'bg-neutral-800/50 text-lime-400 hover:bg-neutral-800' : 'bg-slate-50 text-blue-600 hover:bg-slate-100'
                  }`}
               >
                  {t.recSavedTitle}
                  {openCategory === "custom" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
               </div>
               {openCategory === "custom" && (
                 <div className={isDarkMode ? 'bg-black/20' : 'bg-slate-50/50'}>
                    {customClones.map((c: any) => (
                      <div 
                        key={c.id} 
                        onClick={() => handleSelect(c.id)}
                        className={`px-6 py-2.5 text-sm cursor-pointer flex items-center justify-between ${
                          selectedId === c.id 
                            ? (isDarkMode ? 'text-lime-400 bg-lime-500/10' : 'text-blue-600 bg-blue-50') 
                            : (isDarkMode ? 'text-neutral-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-100')
                        }`}
                      >
                        {c.name}
                        {selectedId === c.id && <Check className="w-3 h-3" />}
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {VOICE_CATEGORIES_CONFIG.map((cat) => (
            <div key={cat.key} className={`border-b last:border-0 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
              <div 
                  onClick={(e) => toggleCategory(cat.key, e)}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex justify-between items-center cursor-pointer ${
                    isDarkMode ? 'hover:bg-white/5 text-neutral-400' : 'hover:bg-slate-50 text-slate-500'
                  }`}
               >
                  {t[cat.key] || cat.id} 
                  {openCategory === cat.key ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
               </div>

               {openCategory === cat.key && (
                 <div className={isDarkMode ? 'bg-black/20' : 'bg-slate-50/50'}>
                    {cat.voices.map((v) => (
                      <div 
                        key={v.id} 
                        onClick={() => handleSelect(v.id)}
                        className={`px-6 py-2.5 text-sm cursor-pointer flex items-center justify-between ${
                          selectedId === v.id 
                            ? (isDarkMode ? 'text-lime-400 bg-lime-500/10' : 'text-blue-600 bg-blue-50') 
                            : (isDarkMode ? 'text-neutral-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-100')
                        }`}
                      >
                        {v.name}
                        {selectedId === v.id && <Check className="w-3 h-3" />}
                      </div>
                    ))}
                 </div>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface HistoryItem {
  id: string;
  url: string;
  text: string;
  voice: string;
  date: string;
  duration?: number;
}

const LandingPage = ({ onStart, isDarkMode, toggleTheme, language, setLanguage }: any) => {
  const [logoSwitch, setLogoSwitch] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = language === 'en' ? "OF LIFE" : "BERNYAWA";
  const [activeAudioIndex, setActiveAudioIndex] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  const [showTosModal, setShowTosModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.id;
  const legal = LEGAL_CONTENT[language as keyof typeof LEGAL_CONTENT] || LEGAL_CONTENT.id;

  // SEO & Favicon Injection
  useEffect(() => {
    document.title = "Te_eR™ to Speech - Text to Bacot PRO";
    // ... existing favicon logic ...
    let toggle = false;
    const interval = setInterval(() => {
      const icon = toggle ? '🗣️' : '🔊';
      const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
      favicon.rel = 'icon';
      favicon.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${icon}</text></svg>`;
      if (!document.head.contains(favicon)) document.head.appendChild(favicon);
      toggle = !toggle;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setLogoSwitch(prev => !prev), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTypedText(""); 
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
  }, [fullText]);

  const handlePlaySample = (index: number) => {
    audioRefs.current.forEach((audio, i) => {
      if (i !== index && audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    const currentAudio = audioRefs.current[index];
    if (currentAudio) {
      if (currentAudio.paused) {
        const playPromise = currentAudio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setActiveAudioIndex(index);
            })
            .catch(error => {
              console.log("Audio play failed:", error);
              setActiveAudioIndex(null);
            });
        }
      } else {
        currentAudio.pause();
        setActiveAudioIndex(null);
      }
    }
  };

  const handleStartClick = () => {
    setShowTosModal(true); // Open TOS on start
  };

  const bgClass = isDarkMode ? 'bg-neutral-950 text-white selection:bg-cyan-500/30' : 'bg-slate-50 text-slate-900 selection:bg-blue-200';
  const navClass = isDarkMode ? 'bg-neutral-950/80 border-white/5' : 'bg-white/80 border-blue-100';
  const logoBg = isDarkMode ? 'bg-gradient-to-br from-blue-600 to-cyan-500' : 'bg-gradient-to-br from-blue-500 to-cyan-400';
  const cardClass = isDarkMode ? 'bg-neutral-900 border-white/10 hover:border-cyan-500/50' : 'bg-white border-blue-200 hover:border-blue-400 shadow-sm';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${bgClass}`}>
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b ${navClass}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <div className={`relative h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shadow-lg ${logoBg} shadow-cyan-500/20`}>
                <Volume2 className={`absolute w-7 h-7 text-white transition-all duration-700 ease-in-out transform ${logoSwitch ? 'opacity-0 scale-50 rotate-180' : 'opacity-100 scale-100 rotate-0'}`} />
                <MessageCircle className={`absolute w-7 h-7 text-white transition-all duration-700 ease-in-out transform ${logoSwitch ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-180'}`} />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold tracking-tight">
                  Te_eR™ <span className="text-cyan-400 animate-pulse">to Speech</span>
                </h1>
                <p className={`text-[10px] md:text-xs font-mono tracking-widest ${isDarkMode ? 'text-cyan-200/70' : 'text-blue-600/70'}`}>
                  {t.tagline}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className={`px-3 py-2 rounded-xl border font-bold text-xs transition-all flex items-center gap-1 ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'}`}
            >
              <Globe className="w-3 h-3" /> {language.toUpperCase()}
            </button>
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'}`}
            >
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <header className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] -z-10 ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-200/40'}`}></div>
        
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
          {t.heroTitle1} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{t.heroTitle2} </span>
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
              {typedText}
            </span>
            <span className="absolute -right-2 top-0 h-full w-1 bg-cyan-400 animate-blink"></span>
          </span>
        </h2>
        
        <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
          {t.heroDesc} <span className="font-bold text-cyan-500">{t.freeBadge}</span>
        </p>

        <button 
            onClick={handleStartClick}
            className="mb-8 px-8 py-3 bg-white text-black rounded-full font-bold text-base hover:bg-cyan-50 transition-colors animate-[pulse_2s_infinite] border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          >
            {t.startBtn}
        </button>

        <div className="flex flex-wrap justify-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <Zap className="w-4 h-4 text-yellow-400" /> {t.poweredBy} Gemini
          </div>
        </div>
      </header>

      <section className={`py-20 border-y ${isDarkMode ? 'bg-neutral-900/50 border-white/5' : 'bg-slate-100/50 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Globe className="w-8 h-8 text-cyan-400" />, title: t.feature1, desc: t.feature1Desc },
            { icon: <Smile className="w-8 h-8 text-pink-400" />, title: t.feature2, desc: t.feature2Desc },
            { icon: <Mic2 className="w-8 h-8 text-green-400" />, title: t.feature3, desc: t.feature3Desc },
            { icon: <Infinity className="w-8 h-8 text-purple-400" />, title: t.feature4, desc: t.feature4Desc },
            { icon: <Sun className="w-8 h-8 text-yellow-400" />, title: t.feature5, desc: t.feature5Desc },
            { icon: <Languages className="w-8 h-8 text-blue-400" />, title: t.feature6, desc: t.feature6Desc },
            { icon: <BookOpen className="w-8 h-8 text-emerald-400" />, title: t.feature7, desc: t.feature7Desc },
            { icon: <Map className="w-8 h-8 text-orange-400" />, title: t.feature8, desc: t.feature8Desc },
          ].map((feature, i) => (
            <div key={i} className={`p-6 rounded-2xl border transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-neutral-950 border-white/5 hover:border-cyan-500/30' : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'}`}>
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-slate-500'}`}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-10">{t.showcaseTitle} <span className="text-cyan-400">Te_eR™</span></h3>
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
                <audio 
                  ref={el => audioRefs.current[idx] = el}
                  src={audio.file} 
                  className={`h-8 w-32 md:w-64 ${isDarkMode ? 'accent-cyan-500' : 'accent-blue-500'}`}
                  controls 
                  onPlay={() => setActiveAudioIndex(idx)}
                  onPause={() => setActiveAudioIndex(null)}
                  onError={(e) => {
                    const target = e.target as HTMLAudioElement;
                    target.style.display = 'none';
                    console.warn(`File audio '${audio.file}' tidak ditemukan di folder /public.`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center relative">
        <div className={`absolute inset-0 bg-gradient-to-t -z-10 ${isDarkMode ? 'from-blue-900/20' : 'from-blue-100'} to-transparent`}></div>
        <h3 className="text-2xl md:text-4xl font-bold mb-8">{t.ctaTitle}</h3>
        <button 
          onClick={handleStartClick}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-lg rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-500 animate-[pulse_1.5s_infinite]"
        >
          <span className="mr-2 text-xl">{t.ctaBtn1}</span>
          <span className="text-xl">{t.ctaBtn2}</span>
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 rounded-full ring-4 ring-white/20 group-hover:ring-white/40 animate-ping opacity-20"></div>
        </button>
      </section>

      <footer className={`py-10 border-t text-center ${isDarkMode ? 'border-white/5 bg-black' : 'border-slate-200 bg-slate-50'}`}>
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-mono text-cyan-500/50 animate-pulse tracking-[0.2em]">
            Te_eR™ Inovative @2026
          </p>
          
          {/* Legal Links */}
          <div className="flex gap-4 mt-2 text-[10px] opacity-70">
            <button onClick={() => setShowPrivacyModal(true)} className="hover:underline hover:text-cyan-400">
              {t.privacyLink}
            </button>
            <span>|</span>
            <button onClick={() => setShowTosModal(true)} className="hover:underline hover:text-cyan-400">
              {t.tosLink}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals for Legal */}
      {showPrivacyModal && (
        <InfoModal 
          title={legal.privacy.title} 
          content={legal.privacy.content} 
          onClose={() => setShowPrivacyModal(false)}
          showButtons={true}
          onAgree={() => {
            setShowPrivacyModal(false);
            onStart();
          }}
          onDisagree={() => setShowPrivacyModal(false)}
          t={t}
          isDarkMode={isDarkMode}
        />
      )}

      {showTosModal && (
        <InfoModal 
          title={legal.tos.title} 
          content={legal.tos.content} 
          onClose={() => setShowTosModal(false)}
          showButtons={true}
          onAgree={() => {
            setShowTosModal(false);
            onStart();
          }}
          onDisagree={() => setShowTosModal(false)}
          t={t}
          isDarkMode={isDarkMode}
        />
      )}

    </div>
  );
};

// --- MAIN APP COMPONENT ---

const MainApp = ({ isDarkMode, toggleTheme, language }: any) => {
  const [activeTab, setActiveTab] = useState<'gemini' | 'elevenlabs'>('gemini');
  const [text, setText] = useState<string>(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [showSpeakerIcon, setShowSpeakerIcon] = useState(false);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HistoryItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [customCloneName, setCustomCloneName] = useState("");
  const [customClones, setCustomClones] = useState<{name: string, id: string}[]>([]);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTosModal, setShowTosModal] = useState(false);
  
  const [userGeminiApiKey, setUserGeminiApiKey] = useState<string>("");
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>("");
  const [targetLang, setTargetLang] = useState("id");
  
  const [geminiVoiceId, setGeminiVoiceId] = useState("Kore"); 
  const [styleInstruction, setStyleInstruction] = useState("");
  
  const [elevenModelName, setElevenModelName] = useState("My Custom Model");
  const [elevenModelId, setElevenModelId] = useState("");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.id;
  const legal = LEGAL_CONTENT[language as keyof typeof LEGAL_CONTENT] || LEGAL_CONTENT.id;
  const faqData = FAQ_DATA[language as keyof typeof FAQ_DATA] || FAQ_DATA.id;

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

    // PWA Install Prompt Capture
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
    });

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  const saveSettings = () => {
    localStorage.setItem('userGeminiApiKey', userGeminiApiKey);
    localStorage.setItem('elevenLabsKey', elevenLabsApiKey);
    setIsSettingsOpen(false);
    setStatusMsg({ type: 'success', text: t.saveSettings + ' OK!' });
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
        setStatusMsg({ type: 'success', text: 'Translate OK!' });
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
           // Find display name in categories
           for (const cat of VOICE_CATEGORIES_CONFIG) {
              const found = cat.voices.find(v => v.id === geminiVoiceId);
              if (found) { displayName = found.name; break; }
           }
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
    setStatusMsg({ type: 'success', text: t.recSave + ' OK!' });
  };

  const handleInstallApp = () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    }
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
              <p className={`text-xs font-mono tracking-wider transition-colors ${colors.accent}`}>{t.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* PWA INSTALL ICON */}
            {deferredPrompt && (
                <button 
                  onClick={handleInstallApp}
                  className={`p-2.5 rounded-xl border transition-all duration-300 ${isDarkMode ? 'border-white/10 hover:bg-white/5 text-cyan-400' : 'border-slate-200 hover:bg-slate-100 text-blue-600'}`}
                  title={t.installApp}
                >
                  <Download className="w-5 h-5" />
                </button>
            )}
            
            <button onClick={() => setIsSettingsOpen(true)} className={`p-2.5 rounded-xl border transition-all duration-300 group ${elevenLabsApiKey ? `${colors.accentBorder} ${isDarkMode ? 'bg-lime-500/5' : 'bg-blue-500/5'}` : `${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'}`}`}>
              <Settings className={`w-5 h-5 transition-colors ${elevenLabsApiKey ? colors.accent : 'text-neutral-400'}`} />
            </button>
          </div>
        </div>

        {/* RUNNING TEXT WARNING */}
        <div className="w-full bg-red-500 overflow-hidden py-1">
             <div className="whitespace-nowrap animate-marquee">
                 <span className="text-white text-xs font-bold px-4">{t.runningWarning}</span>
                 <span className="text-white text-xs font-bold px-4">{t.runningWarning}</span>
                 <span className="text-white text-xs font-bold px-4">{t.runningWarning}</span>
                 <span className="text-white text-xs font-bold px-4">{t.runningWarning}</span>
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
                <span className={`text-xs font-bold tracking-widest uppercase ${colors.textMuted}`}>{t.configTitle}</span>
              </div>

              {activeTab === 'gemini' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="space-y-2">
                    <label className={`text-sm block ${colors.textMuted}`}>{t.voiceModelLabel}</label>
                    
                    {/* CUSTOM DROPDOWN COMPONENT */}
                    <CustomVoiceSelect 
                        selectedId={geminiVoiceId}
                        onChange={setGeminiVoiceId}
                        isDarkMode={isDarkMode}
                        customClones={customClones}
                        t={t}
                    />

                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm block ${colors.textMuted}`}>{t.styleLabel}</label>
                    <div className="relative">
                      <MessageSquare className={`absolute left-4 top-3.5 w-4 h-4 ${colors.textMuted}`} />
                      <input type="text" value={styleInstruction} onChange={(e) => setStyleInstruction(e.target.value)} placeholder={t.stylePlaceholder} className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-colors ${isDarkMode ? 'bg-neutral-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STYLE_PRESETS_DATA.map(style => (
                      <button 
                        key={style.id} 
                        onClick={() => setStyleInstruction(style.id)} 
                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors border ${styleInstruction === style.id ? `${isDarkMode ? 'bg-lime-500/20 text-lime-300' : 'bg-blue-100 text-blue-600'}` : `${isDarkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-white text-slate-600'}`}`}
                      >
                        {language === 'en' ? style.label_en : style.label_id}
                      </button>
                    ))}
                  </div>
                  {/* RECORDER */}
                  <div className={`pt-4 border-t space-y-3 ${isDarkMode ? 'border-white/5' : 'border-blue-100'}`}>
                    <label className={`text-sm font-bold block flex items-center gap-2 ${colors.accent}`}><Disc className="w-4 h-4 animate-spin-slow" /> {t.recTitle}</label>
                    <div className={`rounded-xl p-3 border space-y-3 ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                       <div className="flex justify-between items-center"><span className={`text-xs font-mono ${colors.textMuted}`}>{isRecording ? `REC... ${recordingTime}s` : 'Ready'}</span>{isRecording && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}</div>
                       <div className="flex gap-2">
                          <button onClick={isRecording ? stopRecording : startRecording} className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${isRecording ? 'bg-red-500/20 text-red-400 border-red-500/50' : `${isDarkMode ? 'bg-neutral-800 text-white' : 'bg-white text-slate-700 shadow-sm'}`}`}>{isRecording ? <Square className="w-3 h-3 fill-current" /> : <Mic className="w-3 h-3" />}{isRecording ? t.recStop : t.recStart}</button>
                       </div>
                       {recordedUrl && <div className="space-y-2 animate-in slide-in-from-top-2"><audio src={recordedUrl} controls className="w-full h-6 accent-blue-500" /><div className="flex gap-2"><input value={customCloneName} onChange={(e) => setCustomCloneName(e.target.value)} placeholder="Nama..." className={`flex-1 border rounded px-2 text-xs focus:outline-none ${isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-slate-900'}`} /><button onClick={saveClone} className={`px-3 rounded text-xs font-bold ${isDarkMode ? 'bg-lime-500 text-black' : 'bg-blue-600 text-white'}`}>{t.recSave}</button></div></div>}
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
                <div className="flex items-center gap-2"><span className={`text-xs font-bold tracking-widest ml-2 ${colors.textMuted}`}>{t.editorTitle}</span></div>
                <button onClick={handleAutoWrite} disabled={isLoading} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all text-xs font-medium text-red-400">{isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} {t.autoWrite}</button>
              </div>
              <div className="flex-1 p-6 relative"><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.editorPlaceholder} className={`w-full h-full bg-transparent resize-none focus:outline-none text-lg leading-relaxed font-medium ${isDarkMode ? 'text-neutral-200 placeholder-neutral-700' : 'text-slate-700 placeholder-slate-300'}`} /></div>
              <div className={`p-6 border-t space-y-4 ${isDarkMode ? 'bg-neutral-950/30 border-white/5' : 'bg-slate-50/50 border-blue-100'}`}>
                {statusMsg && <div className={`flex items-center gap-2 text-sm animate-in slide-in-from-bottom-2 fade-in ${statusMsg.type === 'error' ? 'text-red-400' : 'text-green-500'}`}>{statusMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}{statusMsg.text}</div>}
                <button onClick={generateAudio} disabled={isLoading} className={`w-full h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${colors.buttonPrimary}`}>{isLoading ? <><Loader2 className="w-6 h-6 animate-spin" /><span>{t.processing}</span></> : <><PlayCircle className="w-6 h-6" /><span>{t.generateBtn}</span></>}</button>
              </div>
            </div>

            {/* PLAYER & LIBRARY */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className={`flex items-center gap-2 ${colors.textMuted}`}>
                   <ListMusic className="w-5 h-5" />
                   <h3 className="font-bold text-sm uppercase tracking-widest">{t.libraryTitle}</h3>
                </div>
                {history.length > 0 && (
                   <button 
                     onClick={() => {
                        if (window.confirm("Hapus semua riwayat?")) {
                          setHistory([]);
                          setCurrentAudio(null);
                        }
                     }}
                     className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                   >
                     <Archive className="w-3 h-3" /> {t.deleteHistory}
                   </button>
                )}
              </div>

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
                            setCurrentAudio(item);
                            if (audioRef.current) {
                                audioRef.current.src = item.url;
                                audioRef.current.play();
                                setIsPlaying(true);
                            }
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                            ${currentAudio?.id === item.id 
                              ? `${isDarkMode ? 'bg-lime-500 text-black' : 'bg-blue-600 text-white'}` 
                              : `${isDarkMode ? 'bg-neutral-800 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}`}
                        >
                          {(currentAudio?.id === item.id && isPlaying) ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
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
                           title={t.downloadBtn}
                         >
                           <Download className="w-4 h-4" />
                         </a>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* WARNING NOTE */}
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-red-500 italic leading-relaxed">
                  {t.warningNote}
                </p>
              </div>

               {/* FAQ SECTION */}
               <div className="mt-6">
                 <FAQSection data={faqData} t={t} isDarkMode={isDarkMode} />
               </div>

            </div>

            {/* PLAYER (Hidden Audio Element for Logic) */}
            <audio 
                ref={audioRef} 
                onEnded={() => setIsPlaying(false)} 
                onPause={() => setIsPlaying(false)} 
                onPlay={() => setIsPlaying(true)} 
                className="hidden" 
            />

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={`mt-8 py-8 border-t flex flex-col items-center justify-center gap-4 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
        <a href="https://sociabuzz.com/syukrankatsiron/tribe" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-pink-600 text-white shadow-pink-600/20' : 'bg-pink-500 text-white shadow-pink-500/30'}`}><Heart className="w-4 h-4 fill-current" /> Support Us</a>
        <a href="https://ko-fi.com/syukran/tip" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 active:scale-95"><img src="https://raw.githubusercontent.com/vandratop/Yuk/872daa6f963613ba58fc4ff71f886beed94ff15d/support_me_on_kofi_beige.png" alt="Buy me a Ko-fi" className="h-10 md:h-12" /></a>
        <div className="flex flex-col items-center gap-2">
           <a href="mailto:hijrtime+ttspro@gmail.com" className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold transition-all hover:scale-105 ${isDarkMode ? 'border-white/10 hover:bg-white/10' : 'border-slate-300 hover:bg-slate-100'}`}><Mail className="w-3 h-3" /> {t.footerContact}</a>
           <p className={`text-xs font-mono animate-pulse tracking-widest ${isDarkMode ? 'text-lime-400/80' : 'text-blue-600/80'}`}>Te_eR™ Inovative @2026</p>
           
           {/* Legal Links in App */}
           <div className="flex gap-4 mt-2 text-[10px] opacity-70">
            <button onClick={() => setShowPrivacyModal(true)} className="hover:underline hover:text-cyan-400">
              {t.privacyLink}
            </button>
            <span>|</span>
            <button onClick={() => setShowTosModal(true)} className="hover:underline hover:text-cyan-400">
              {t.tosLink}
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL SETTINGS */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsSettingsOpen(false)} />
          <div className={`rounded-2xl border w-full max-w-md relative z-10 p-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] ${isDarkMode ? 'bg-neutral-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <button onClick={() => setIsSettingsOpen(false)} className="absolute right-4 top-4 hover:opacity-70 transition-opacity"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-3 mb-6"><div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}><Settings className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} /></div><h2 className="text-xl font-bold">{t.settingsTitle}</h2></div>
            
            <div className="space-y-6">
              {/* Translate */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-2 mb-1"><Globe className={`w-4 h-4 ${colors.accent}`} /><h3 className="text-sm font-bold">{t.translateTitle}</h3></div>
                <div className="space-y-2"><label className={`text-[10px] uppercase font-bold ${colors.textMuted}`}>{t.targetLangLabel}</label><select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className={`w-full p-2 text-sm rounded-lg border focus:outline-none ${isDarkMode ? 'bg-neutral-900 border-white/10' : 'bg-white border-slate-200'}`}>{TARGET_LANGUAGES.map((lang) => <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>)}</select></div>
                <button onClick={handleTranslate} disabled={isLoading} className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-400 text-white'}`}><Languages className="w-3 h-3" />{isLoading ? "..." : t.translateBtn}</button>
              </div>

              {/* Theme */}
              <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                 <div className="flex items-center gap-2">{isDarkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-orange-500" />}<span className="text-sm font-bold">{t.themeLabel}</span></div>
                 <button onClick={toggleTheme} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${isDarkMode ? 'bg-neutral-800 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-sm'}`}>{isDarkMode ? 'Gelap' : 'Terang'}</button>
              </div>

              {/* API Keys */}
              <div>
                <div className="flex items-center gap-2 mb-4"><Key className={`w-4 h-4 ${colors.textMuted}`} /><h3 className="text-sm font-bold">{t.apiKeyLabel}</h3></div>
                {/* Gemini Input */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1"><label className={`text-[10px] uppercase font-bold ${colors.textMuted}`}>API KEY Gemini</label><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className={`text-[10px] flex items-center gap-1 hover:underline ${colors.accent}`}>Get Key <ExternalLink className="w-2 h-2" /></a></div>
                  <div className="relative"><input type="password" value={userGeminiApiKey} onChange={(e) => setUserGeminiApiKey(e.target.value)} placeholder="Paste Key..." className={`w-full p-3 rounded-xl border focus:outline-none transition-colors ${isDarkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} /><div className="absolute right-3 top-3 group cursor-help"><HelpCircle className={`w-4 h-4 ${colors.textMuted}`} /><div className="hidden group-hover:block absolute right-0 bottom-6 w-48 p-2 bg-black text-white text-[10px] rounded shadow-lg z-50">Unlimited generation & translate.</div></div></div>
                </div>
                {/* ElevenLabs Input */}
                <div>
                  <div className="flex justify-between items-center mb-1"><label className={`text-[10px] uppercase font-bold ${colors.textMuted}`}>API KEY ElevenLabs</label><a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noreferrer" className={`text-[10px] flex items-center gap-1 hover:underline ${colors.accent}`}>Get Key <ExternalLink className="w-2 h-2" /></a></div>
                  <div className="relative"><input type="password" value={elevenLabsApiKey} onChange={(e) => setElevenLabsApiKey(e.target.value)} placeholder="Paste Key..." className={`w-full p-3 rounded-xl border focus:outline-none transition-colors ${isDarkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} /><div className="absolute right-3 top-3 group cursor-help"><HelpCircle className={`w-4 h-4 ${colors.textMuted}`} /><div className="hidden group-hover:block absolute right-0 bottom-6 w-48 p-2 bg-black text-white text-[10px] rounded shadow-lg z-50">Untuk fitur Pro Voice Cloning.</div></div></div>
                </div>
              </div>

              {/* Install PWA Button in Settings */}
              {deferredPrompt && (
                <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                   <div className="flex items-center gap-2"><Smartphone className={`w-4 h-4 ${colors.accent}`} /><span className="text-sm font-bold">{t.installApp}</span></div>
                   <button 
                      onClick={() => {
                        deferredPrompt.prompt();
                        deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${isDarkMode ? 'bg-neutral-800 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-sm'}`}
                   >
                      {t.installBtn}
                   </button>
                </div>
              )}

              <button onClick={saveSettings} className={`w-full font-medium py-3 rounded-xl flex items-center justify-center gap-2 mt-4 transition-colors text-white ${isDarkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-500 hover:bg-green-400 shadow-lg'}`}><Save className="w-4 h-4" /> {t.saveSettings}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modals for Legal Links inside App */}
      {showPrivacyModal && (
        <InfoModal 
          title={legal.privacy.title} 
          content={legal.privacy.content} 
          onClose={() => setShowPrivacyModal(false)}
          showButtons={false}
          t={t}
          isDarkMode={isDarkMode}
        />
      )}

      {showTosModal && (
        <InfoModal 
          title={legal.tos.title} 
          content={legal.tos.content} 
          onClose={() => setShowTosModal(false)}
          showButtons={false}
          t={t}
          isDarkMode={isDarkMode}
        />
      )}

    </div>
  );
};

// Root App to handle switching
const App = () => {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [isDarkMode, setIsDarkMode] = useState(false); // Default Light
  const [language, setLanguage] = useState<'id' | 'en'>('id'); // Default ID

  // --- 2. Inisialisasi Pi SDK ---
  useEffect(() => {
    const initPi = async () => {
      try {
        // Cek apakah script Pi SDK sudah termuat di window
        if (window.Pi) {
          // Inisialisasi: sandbox: true (untuk Testnet/Development)
          // Ubah ke false jika sudah Live Mainnet
          window.Pi.init({ version: "2.0", sandbox: true });
          
          // Opsional: Langsung minta autentikasi user
          // const scopes = ['username', 'payments'];
          // const onIncompletePaymentFound = (payment: any) => {}; 
          // window.Pi.authenticate(scopes, onIncompletePaymentFound).then((auth: any) => {
          //    console.log("Hello " + auth.user.username);
          // });
          // Opsional: Cek lagi setelah beberapa saat jika internet lambat
           setTimeout(() => {
              if (window.Pi) window.Pi.init({ version: "2.0", sandbox: true });
           }, 1000);
        }
        }
      } catch (err) {
        console.error("Pi SDK Error:", err);
      }
    };

    initPi();
  }, []);

  return view === 'landing' 
    ? <LandingPage onStart={() => setView('app')} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} language={language} setLanguage={setLanguage} /> 
    : <MainApp isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} language={language} setLanguage={setLanguage} />;
};

export default App;

