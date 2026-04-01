# Crypto AI Advisor Dashboard (Free Stack Version)

**Crypto AI Advisor** adalah agen AI untuk **menganalisis dan memberi rekomendasi cryptocurrency**. Sistem ini memindai token baru di DEX (Decentralized Exchanges) secara real-time, menilai peluang dan risiko, serta memberikan insight teknikal, fundamental, on-chain, dan sentimen pasar.

Stack ini menggunakan **100% layanan gratis**: GitHub, Supabase, dan Vercel.

---

## ⚡ Fitur Utama

- **Real-time DEX Monitoring**: Pantau token baru di DEX seperti Uniswap, PancakeSwap menggunakan [DexScreener API](https://docs.dexscreener.com/api/reference)
- **AI-Powered Scoring**: Analisis Technical + Fundamental + On-chain + Sentiment
- **Risk Assessment**: Skor risiko untuk setiap token baru
- **Probabilistic Prediction**: Kemungkinan kenaikan harga token (1–3 bulan)
- **Dashboard Interaktif**: Visualisasi skor, peluang, rekomendasi langsung di web
- **High-Potential Token Highlight**: Semua rekomendasi tampil di dashboard, tanpa perlu notifikasi eksternal

---

## 🏗️ Arsitektur Sistem (Free Stack)

[DexScreener API] │ ▼ [Backend / AI Layer] -- Claude/GPT → scoring & risk assessment │ ▼ [Supabase Database] ← simpan token & historis scoring │ ▼ [Frontend Dashboard] -- Next.js + Tailwind (hosted di Vercel)

- **Frontend**: Next.js + React + Tailwind, hosted di Vercel gratis  
- **Backend / API**: Python / Node.js, poll DexScreener → scoring AI → simpan di Supabase  
- **Database**: Supabase free tier (PostgreSQL)  
- **AI Layer**: Claude / GPT prompt-based scoring  
- **Dashboard Alerts**: Semua alert & rekomendasi muncul langsung di dashboard

---

## 🛠️ Teknologi yang Digunakan

| Komponen        | Teknologi / Tools                         |
|-----------------|-----------------------------------------|
| Version Control  | GitHub (repo + GitHub Actions CI/CD)    |
| Frontend         | Next.js + React + Tailwind (Vercel)     |
| Database         | Supabase (PostgreSQL free tier)         |
| Backend / API    | Python / Node.js                         |
| AI               | Claude / GPT prompt-based scoring        |

---

## 📊 Contoh Output JSON (untuk dashboard)

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
    "probability_20_percent_gain": 0.68,
    "risk_notes": ["Low liquidity, moderate volatility", "New token, unverified audit"],
    "recommendation": "Monitor closely. Potential high upside, consider small allocation if trend continues.",
    "summary": "NEWCOIN baru saja listing di BSC dengan volume meningkat 120% dalam 24 jam. Technical pattern menunjukkan kemungkinan breakout. Developer aktif, roadmap jelas. Risiko: liquidity rendah, audit belum tersedia."
  }
]


---

🚀 Cara Menggunakan (Stack Gratis)

1️⃣ Clone Repository

git clone https://github.com/username/crypto-ai-advisor.git
cd crypto-ai-advisor

2️⃣ Setup Supabase

1. Daftar gratis di Supabase


2. Buat project baru dan catat SUPABASE_URL & SUPABASE_ANON_KEY


3. Buat tabel tokens untuk menyimpan data token


4. Tambahkan env vars di backend .env:



SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_anon_key

3️⃣ Jalankan Backend / Script Analisis

pip install -r requirements.txt
python run_analysis.py

Script ini poll DexScreener API → kirim data ke Supabase → scoring AI → simpan hasil.


4️⃣ Setup Frontend di Vercel

1. Daftar gratis di Vercel


2. Deploy folder dashboard dengan environment variable:



SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_anon_key

3. Dashboard menampilkan token dengan scoring, rekomendasi, dan highlight high-potential langsung di web.



5️⃣ GitHub Actions (Opsional)

Buat workflow .github/workflows/auto_analysis.yml untuk menjalankan backend otomatis setiap 30 menit:


on:
  schedule:
    - cron: "*/30 * * * *"
jobs:
  analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.11
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run Analysis
        run: python run_analysis.py


---

⚠️ Peringatan & Disclaimer

Crypto sangat volatil, semua analisis bersifat rekomendasi berbasis data.

Lakukan riset tambahan sebelum mengambil keputusan investasi.

Agen ini membantu mendeteksi peluang, bukan prediksi harga pasti.

Semua rekomendasi ditampilkan langsung di dashboard, tanpa notifikasi eksternal.



---

📄 Lisensi

MIT License © 2026
