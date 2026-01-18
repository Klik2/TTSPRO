Privacy Policy (Kebijakan Privasi)

Kebijakan Privasi Te_eR™ to Speech

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


----

Terms of Service (Syarat & Ketentuan)


Syarat dan Ketentuan Penggunaan

1. Penggunaan Layanan

Te_eR™ to Speech adalah alat bantu kreativitas. Anda setuju untuk tidak menggunakan layanan ini untuk:

Membuat konten ilegal, ujaran kebencian, fitnah, atau konten yang melanggar hukum di Indonesia.

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

---

FAQ (Tanya Jawab)

Pertanyaan yang Sering Diajukan

Q1: Kenapa muncul pesan "API Key Tidak Valid" atau error generate suara?

A: API Key Not Valid berarti BELUM ADA (Masih Kosong), belum di masukan di kolom pengaturan API KEY.

Solusi: Silahkan Copy paste API Key Gemini/ ElevenLabs di kolom pengisian API Key.
BELUM memiliki API Key ?
Klik icon gerigi (pengaturan) di pojok kanan atas, klik salah satu "Get Key" otomatis Anda akan di arahkan ke website penyedia API Key Gemini / ElevenLabs, ikuti instruksi yang ada di website tersebut dan pastikan Anda sudah login untuk mendapatkan API Key. 
Setelah mendapatkan API Key Gemini / ElevenLabs copy paste di kolom API Key di WebApp "Te_eR™ to Speech"


Q2: Apakah aman memasukkan API Key saya sendiri di sini?

A: Sangat aman. Seperti dijelaskan dalam Kebijakan Privasi, API Key Anda hanya disimpan di Local Storage browser (HP/Laptop) Anda sendiri. Kunci tersebut tidak pernah dikirim ke server kami. Kunci itu langsung menghubungkan browser Anda ke Google/ElevenLabs.


Q3: Apakah saya boleh menggunakan suara hasil download untuk YouTube/Monetisasi?

A: Ya, boleh! Hasil suara yang dihasilkan melalui Gemini Flash dan ElevenLabs umumnya boleh digunakan untuk konten komersial. Namun, Anda tetap disarankan untuk memeriksa kebijakan terbaru dari Google AI Studio dan ElevenLabs Free/Pro plan untuk kepastian hukum penuh.


Q4: Berapa panjang teks maksimal yang bisa saya ubah jadi suara?

A: Tidak ada batasan harian, tapi per satu kali klik "Buat Suara", kami menyarankan maksimal 1.000 karakter. Jika Anda punya naskah panjang (misal satu bab buku), silakan pecah menjadi beberapa paragraf dan generate secara bertahap agar hasilnya lebih akurat dan tidak error.


Q5: Kenapa fitur Rekam Suara (Cloning) hasilnya berbeda dengan suara asli saya?

A: Fitur cloning pada Gemini Flash masih dalam tahap eksperimental (Preview). Kualitas kemiripan sangat bergantung pada kualitas mikrofon Anda, kebisingan latar belakang, dan kejelasan pengucapan saat merekam. Cobalah merekam di ruangan sunyi untuk hasil terbaik.


Q6: Kenapa muncul pesan "HTTP Error 429" atau suara tidak keluar?

A: Error 429 berarti "Terlalu Banyak Permintaan". Karena ini adalah layanan gratis, server Google membatasi jumlah permintaan per menit.

Solusi: Tunggu sekitar 1-3 menit, lalu coba lagi. Jangan menekan tombol berulang-ulang dengan cepat. Untuk pengalaman lancar tanpa batas, masukkan API Key Gemini Anda sendiri di menu Pengaturan.


Q7 : Bagaimana cara menghubungi, menyampaikan masukan/ keluhan ?

A : Silahkan klik icon ✉️ Contact Us di bagian footer. Anda otomatis akan terhubung dengan platform email.


Q8 : Bagaimana jika ingin berdonasi?

A : Silahkan klik tombol button support us atau Buy me Ko-fi di bagian footer.

