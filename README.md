# 🕉️ Vedic Astrology Rashi Fal AI

An expert Vedic Astrology AI specializing in accurate, grounded, and uplifting **Rashi Fal (Horoscope predictions)** based on Moon sign (Chandra Rashi), complete with an Express REST API, a command-line interface (CLI), and a celestial web application.

---

## 🚀 Key Features

- **12 Vedic Rashis (Moon Signs):** Knowledge base encompassing ruling planetary lords (*Mangal, Shukra, Budh, Chandra, Surya, Guru, Shani*), elemental constitutions (*Agni, Prithvi, Vayu, Jal*), and authentic traits.
- **Strict JSON Output:** Structured format with exact schema keys (`rashi`, `date`, `overall`, `career`, `love`, `finance`, `health`, `lucky_color`, `lucky_number`, `tip`).
- **Timeframe Adjustments:** Daily, Weekly, and Monthly horoscopes.
- **Intent Focus:** Tailored insights for Career, Love, Finance, and Health.
- **Rashi Compatibility:** Elemental harmony and planetary friendship scoring between two signs.
- **DOB Rashi Finder:** Vedic Sidereal Solar Ingress sign estimation.
- **Modern UI:** Deep cosmic glassmorphic interface with dual view (Visual Cards & Strict JSON code preview with 1-click copy).

---

## 📤 Strict JSON Schema

```json
{
  "rashi": "Mithun",
  "date": "04-09-2026",
  "overall": "A productive day with lively opportunities to learn and exchange ideas.",
  "career": "Team coordination thrives under your versatile approach. Focus on closing active loops before starting new ones.",
  "love": "Your wit and warmth bring joyful lightness to loved ones. Take time to genuinely listen in return.",
  "finance": "Avoid impulsive spending on novelty gadgets today. Review expenses to keep your financial goals aligned.",
  "health": "Calm an active mind with brief intervals of silence or light walking. Maintain a restful sleep habit tonight.",
  "lucky_color": "Emerald Green",
  "lucky_number": 5,
  "tip": "Focus on clear communication and finish your primary task before branching into new curiosities."
}
```

---

## 💻 Local Setup & Development

```bash
# 1. Clone repository
git clone https://github.com/arjitjaiswal08-art/Vedic-Astrology-Rashi-Fal.git
cd Vedic-Astrology-Rashi-Fal

# 2. Install dependencies
npm install

# 3. Start local server
npm start
# App running at: http://localhost:3000
```

---

## 📡 REST API Endpoints

### 1. Horoscope Prediction
- **Endpoint:** `GET` / `POST` `/api/rashifal`
- **Query / Body Parameters:**
  - `rashi`: String (e.g., `Mithun`, `Singh`, `Mesh`)
  - `date`: String (e.g., `today`, `04-09-2026`)
  - `timeframe`: `daily` | `weekly` | `monthly` (default: `daily`)
  - `intent`: `career` | `love` | `finance` | `health` (optional)

```bash
curl -s "http://localhost:3000/api/rashifal?rashi=Mithun&date=today"
```

### 2. Compatibility Match
- **Endpoint:** `GET` / `POST` `/api/compatibility`
- **Params:** `rashi1`, `rashi2`

```bash
curl -s "http://localhost:3000/api/compatibility?rashi1=Mesh&rashi2=Singh"
```

### 3. DOB Rashi Ingress
- **Endpoint:** `GET` / `POST` `/api/infer-rashi`
- **Params:** `dob` (e.g., `1995-07-25`)

```bash
curl -s "http://localhost:3000/api/infer-rashi?dob=1995-07-25"
```

---

## 🖥️ CLI Usage

```bash
# Daily Horoscope
node cli.js --rashi Mithun --date today

# Weekly Career Focus
node cli.js --rashi Singh --timeframe weekly --intent career

# Compare Two Signs
node cli.js --compat Mesh Tula

# Infer Sign from Birthday
node cli.js --dob 1996-08-20

# List all 12 Rashis
node cli.js --list
```

---

## 🚢 Deployment

### Option 1: Vercel (Recommended - Zero Configuration)
1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Select your repository: `arjitjaiswal08-art/Vedic-Astrology-Rashi-Fal`.
3. Click **"Deploy"** (Configuration is pre-set via [`vercel.json`](vercel.json)).

### Option 2: Render
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **"New Web Service"** and link `Vedic-Astrology-Rashi-Fal`.
3. Set **Build Command:** `npm install` and **Start Command:** `node server.js`.
4. Click **"Create Web Service"**.

### Option 3: Railway
1. Go to [Railway](https://railway.app).
2. Click **"New Project"** -> **"Deploy from GitHub repo"**.
3. Select `Vedic-Astrology-Rashi-Fal`.

---

## 🧪 Automated Tests

```bash
npm test
```

---

## 📜 License
MIT
