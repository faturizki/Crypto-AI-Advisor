# Spesifikasi Proyek: Crypto AI Advisor Dashboard

## 1. Tujuan Proyek
Membuat sistem AI yang dapat:
- Memantau token baru di DEX secara real-time
- Memberikan skor peluang dan risiko token
- Menyediakan rekomendasi berbasis AI
- Menampilkan semua informasi secara interaktif di dashboard web

Stack yang digunakan: **GitHub, Supabase, Vercel** (gratis).

---

## 2. Arsitektur Sistem

[DexScreener API] │ ▼ [Backend / AI Layer] -- Claude/GPT → scoring & risk assessment │ ▼ [Supabase Database] ← simpan token & historis scoring │ ▼ [Frontend Dashboard] -- Next.js + Tailwind (Vercel)

### Komponen
1. **Backend / AI Layer**
   - Poll token baru dari DexScreener
   - Analisis scoring menggunakan AI
   - Simpan data ke Supabase
2. **Database**
   - Tabel `tokens` untuk data token & skor
   - Tabel `history` untuk data historis scoring
3. **Frontend Dashboard**
   - Menampilkan daftar token terbaru
   - Highlight token dengan potensi tinggi
   - Fitur filter: chain, skor, volume, risiko
4. **Hosting**
   - Backend script dijalankan via GitHub Actions
   - Frontend deploy di Vercel

---

## 3. Modul Sistem

### 3.1 Backend / Data Poller
- Bahasa: Python / Node.js
- Fungsi:
  - Mengambil data dari DexScreener API
  - Normalisasi data
  - Memanggil AI scoring module
  - Menyimpan ke Supabase
- Output: JSON token dengan skor & rekomendasi

### 3.2 AI Scoring Module
- Input: data token dari backend
- Output:
  - technical_score (0–100)
  - fundamental_score (0–100)
  - on_chain_score (0–100)
  - sentiment_score (0–100)
  - overall_potential_score (0–100)
  - probability_gain_20_percent (0–1)
  - rekomendasi & ringkasan

### 3.3 Supabase Database
- Tabel `tokens`
  - token_name: string
  - pair: string
  - chain: string
  - price_usd: float
  - volume_24h: float
  - liquidity: float
  - technical_score: int
  - fundamental_score: int
  - on_chain_score: int
  - sentiment_score: int
  - overall_potential_score: int
  - probability_gain_20_percent: float
  - risk_notes: text[]
  - recommendation: text
  - summary: text
  - timestamp: datetime
- Tabel `history` (opsional)
  - Simpan snapshot skor untuk analisis tren

### 3.4 Frontend Dashboard
- Framework: Next.js + React + Tailwind CSS
- Halaman utama:
  - Daftar token terbaru
  - Kolom skor & rekomendasi
  - Filter: chain, skor minimum, volume
- Highlight token high potential (warna khusus)
- Mengambil data via Supabase client API

---

## 4. Alur Data

1. Backend poll DexScreener setiap 5–30 menit (via GitHub Actions)
2. Data dikirim ke AI scoring module
3. Hasil scoring & rekomendasi disimpan ke Supabase
4. Frontend dashboard query data terbaru
5. Token high potential di-highlight secara otomatis di dashboard

---

## 5. Environment Variables

- `SUPABASE_URL` → URL project Supabase
- `SUPABASE_ANON_KEY` → API key anon Supabase
- Opsional:
  - `DEXSCREENER_API_URL` → jika ingin override URL DexScreener

---

## 6. Workflow Pengembangan

1. Clone repository
2. Setup `.env` untuk Supabase
3. Jalankan backend script untuk polling & scoring
4. Deploy frontend ke Vercel
5. (Opsional) Setup GitHub Actions untuk auto polling

---

## 7. Output JSON Contoh

```json
[
  {
    "token": "NEWCOIN",
    "pair": "NEWCOIN/USDT",
    "chain": "BSC",
    "price_usd": 0.0123,
    "volume_24h": 52000,
    "liquidity": 105000,
    "technical_score": 82,
    "fundamental_score": 78,
    "on_chain_score": 85,
    "sentiment_score": 75,
    "overall_potential_score": 81,
    "probability_gain_20_percent": 0.68,
    "risk_notes": ["Low liquidity", "New token, unverified audit"],
    "recommendation": "Monitor closely. Potential high upside, consider small allocation if trend continues.",
    "summary": "NEWCOIN baru saja listing di BSC dengan volume meningkat 120% dalam 24 jam..."
  }
]


---

8. Peringatan & Disclaimer

Semua analisis bersifat rekomendasi berbasis data.

Risiko crypto tetap tinggi; lakukan riset sebelum investasi.

Sistem hanya menampilkan rekomendasi di dashboard, tidak mengirim notifikasi eksternal.



---

9. Lisensi

MIT License © 2026
