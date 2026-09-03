/**
 * Vedic Astrology Rashi Fal - Frontend Application Logic
 */

// 12 Rashis Metadata with icons & representations
const RASHIS = [
  { key: "Mesh", english: "Aries", sanskrit: "मेष", icon: "♈", lord: "Mangal" },
  { key: "Vrishabh", english: "Taurus", sanskrit: "वृषभ", icon: "♉", lord: "Shukra" },
  { key: "Mithun", english: "Gemini", sanskrit: "मिथुन", icon: "♊", lord: "Budh" },
  { key: "Kark", english: "Cancer", sanskrit: "कर्क", icon: "♋", lord: "Chandra" },
  { key: "Singh", english: "Leo", sanskrit: "सिंह", icon: "♌", lord: "Surya" },
  { key: "Kanya", english: "Virgo", sanskrit: "कन्या", icon: "♍", lord: "Budh" },
  { key: "Tula", english: "Libra", sanskrit: "तुला", icon: "♎", lord: "Shukra" },
  { key: "Vrischik", english: "Scorpio", sanskrit: "वृश्चिक", icon: "♏", lord: "Mangal" },
  { key: "Dhanu", english: "Sagittarius", sanskrit: "धनु", icon: "♐", lord: "Guru" },
  { key: "Makar", english: "Capricorn", sanskrit: "मकर", icon: "♑", lord: "Shani" },
  { key: "Kumbh", english: "Aquarius", sanskrit: "कुम्भ", icon: "♒", lord: "Shani" },
  { key: "Meen", english: "Pisces", sanskrit: "मीन", icon: "♓", lord: "Guru" }
];

// Application State
const state = {
  selectedRashi: "Mithun",
  timeframe: "daily",
  date: getTodayDateString(),
  intent: "all",
  activeView: "visual", // 'visual' or 'json'
  currentPrediction: null
};

// Helpers
function getTodayDateString() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDateToDDMMYYYY(isoDate) {
  if (!isoDate) return "Today";
  const parts = isoDate.split("-");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return isoDate;
}

// Color map for lucky color dot preview
const COLOR_MAP = {
  "Crimson Red": "#e11d48",
  "Bright Coral": "#fb7185",
  "Saffron": "#f97316",
  "Lotus Pink": "#f472b6",
  "Pure White": "#ffffff",
  "Pastel Green": "#86efac",
  "Emerald Green": "#10b981",
  "Light Yellow": "#fef08a",
  "Cyan": "#06b6d4",
  "Pearl White": "#f8fafc",
  "Silver": "#cbd5e1",
  "Sea Green": "#2dd4bf",
  "Golden Amber": "#f59e0b",
  "Royal Orange": "#ea580c",
  "Ruby Red": "#be123c",
  "Olive Green": "#84cc16",
  "Warm Beige": "#fde047",
  "Sky Blue": "#38bdf8",
  "Soft Cream": "#fef9c3",
  "Pastel Rose": "#fda4af",
  "Deep Maroon": "#881337",
  "Dark Rust": "#b45309",
  "Blood Red": "#991b1b",
  "Bright Saffron": "#fb923c",
  "Golden Yellow": "#eab308",
  "Royal Purple": "#7e22ce",
  "Steel Grey": "#94a3b8",
  "Navy Blue": "#1e3a8a",
  "Charcoal": "#334155",
  "Electric Blue": "#2563eb",
  "Deep Violet": "#581c87",
  "Pale Yellow": "#fef08a",
  "Seafoam Green": "#6ee7b7",
  "Lavender": "#c084fc"
};

// DOM Elements
const rashiGrid = document.getElementById("rashiGrid");
const horoscopeDateInput = document.getElementById("horoscopeDate");
const btnSetToday = document.getElementById("btnSetToday");
const btnGetHoroscope = document.getElementById("btnGetHoroscope");
const resultsSection = document.getElementById("resultsSection");
const btnViewVisual = document.getElementById("btnViewVisual");
const btnViewJson = document.getElementById("btnViewJson");
const visualDisplay = document.getElementById("visualDisplay");
const jsonDisplay = document.getElementById("jsonDisplay");
const rawJsonCode = document.getElementById("rawJsonCode");
const btnCopyJson = document.getElementById("btnCopyJson");
const copyText = document.getElementById("copyText");
const copyIcon = document.getElementById("copyIcon");

// Render 12 Rashis Grid
function initRashiGrid() {
  rashiGrid.innerHTML = "";
  RASHIS.forEach((r) => {
    const card = document.createElement("div");
    card.className = `rashi-card ${r.key === state.selectedRashi ? "selected" : ""}`;
    card.setAttribute("role", "radio");
    card.setAttribute("aria-checked", r.key === state.selectedRashi);
    card.setAttribute("tabindex", "0");
    card.id = `rashiCard_${r.key}`;

    card.innerHTML = `
      <div class="rashi-icon">${r.icon}</div>
      <div class="rashi-name">${r.key}</div>
      <div class="rashi-english">${r.english} • ${r.sanskrit}</div>
      <div class="rashi-lord">Lord: ${r.lord}</div>
    `;

    card.addEventListener("click", () => {
      selectRashi(r.key);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectRashi(r.key);
      }
    });

    rashiGrid.appendChild(card);
  });
}

function selectRashi(rashiKey) {
  state.selectedRashi = rashiKey;
  document.querySelectorAll(".rashi-card").forEach((c) => {
    c.classList.remove("selected");
    c.setAttribute("aria-checked", "false");
  });
  const selected = document.getElementById(`rashiCard_${rashiKey}`);
  if (selected) {
    selected.classList.add("selected");
    selected.setAttribute("aria-checked", "true");
  }
}

// Navigation Tabs
function initTabs() {
  const tabs = [
    { btn: "tabHoroscope", panel: "panelHoroscope" },
    { btn: "tabCompatibility", panel: "panelCompatibility" },
    { btn: "tabDOBFinder", panel: "panelDOBFinder" }
  ];

  tabs.forEach((t) => {
    const button = document.getElementById(t.btn);
    const panel = document.getElementById(t.panel);

    button.addEventListener("click", () => {
      tabs.forEach((item) => {
        document.getElementById(item.btn).classList.remove("active");
        document.getElementById(item.btn).setAttribute("aria-selected", "false");
        document.getElementById(item.panel).style.display = "none";
      });
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");
      panel.style.display = "block";
    });
  });
}

// Timeframe Segmented Control
function initTimeframe() {
  const segmentBtns = document.querySelectorAll(".segment-btn");
  segmentBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      segmentBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.timeframe = btn.dataset.timeframe;

      // Adjust date label if weekly/monthly
      const dateLabel = document.querySelector('label[for="horoscopeDate"]');
      if (state.timeframe === "weekly") {
        dateLabel.textContent = "Reference Week (Start Date)";
      } else if (state.timeframe === "monthly") {
        dateLabel.textContent = "Reference Month (Any Date)";
      } else {
        dateLabel.textContent = "Prediction Date";
      }
    });
  });
}

// Intent Pills
function initIntentPills() {
  const pills = document.querySelectorAll(".pill-btn");
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      state.intent = pill.dataset.intent;
    });
  });
}

// View Toggle (Visual vs Strict JSON)
function initViewToggle() {
  btnViewVisual.addEventListener("click", () => {
    state.activeView = "visual";
    btnViewVisual.classList.add("active");
    btnViewJson.classList.remove("active");
    visualDisplay.style.display = "block";
    jsonDisplay.style.display = "none";
  });

  btnViewJson.addEventListener("click", () => {
    state.activeView = "json";
    btnViewJson.classList.add("active");
    btnViewVisual.classList.remove("active");
    visualDisplay.style.display = "none";
    jsonDisplay.style.display = "block";
  });

  btnCopyJson.addEventListener("click", () => {
    if (!state.currentPrediction) return;
    const jsonString = JSON.stringify(state.currentPrediction, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      copyIcon.textContent = "✓";
      copyText.textContent = "Copied!";
      setTimeout(() => {
        copyIcon.textContent = "📋";
        copyText.textContent = "Copy JSON";
      }, 2000);
    });
  });
}

// Fetch or Compute Prediction
async function fetchPrediction() {
  btnGetHoroscope.disabled = true;
  btnGetHoroscope.innerHTML = `<span class="btn-sparkle">⏳</span> Consulting Stars...`;

  const dateValue = horoscopeDateInput.value ? formatDateToDDMMYYYY(horoscopeDateInput.value) : "today";

  try {
    const res = await fetch("/api/rashifal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rashi: state.selectedRashi,
        date: dateValue,
        timeframe: state.timeframe,
        intent: state.intent === "all" ? null : state.intent
      })
    });

    if (!res.ok) throw new Error("API request failed");
    const data = await res.json();
    renderPrediction(data);
  } catch (err) {
    console.warn("Using local fallback prediction:", err);
    // In case user opened static file without server running
    const fallback = generateClientFallback(state.selectedRashi, dateValue, state.timeframe, state.intent);
    renderPrediction(fallback);
  } finally {
    btnGetHoroscope.disabled = false;
    btnGetHoroscope.innerHTML = `<span class="btn-sparkle">✦</span> Consult Celestial Alignment`;
  }
}

// Render Prediction Result to DOM
function renderPrediction(data) {
  state.currentPrediction = data;

  const rashiObj = RASHIS.find((r) => r.key === data.rashi) || RASHIS[2];
  document.getElementById("resRashiHeading").textContent = `${data.rashi} (${rashiObj.english}) Prediction`;
  document.getElementById("resDateBadge").textContent = `${state.timeframe.toUpperCase()}: ${data.date}`;

  // Populate Visual Fields
  document.getElementById("resOverall").textContent = data.overall;
  document.getElementById("resCareer").textContent = data.career;
  document.getElementById("resLove").textContent = data.love;
  document.getElementById("resFinance").textContent = data.finance;
  document.getElementById("resHealth").textContent = data.health;

  document.getElementById("resColorName").textContent = data.lucky_color;
  const hex = COLOR_MAP[data.lucky_color] || "#ffd166";
  document.getElementById("resColorDot").style.backgroundColor = hex;

  document.getElementById("resLuckyNumber").textContent = data.lucky_number;
  document.getElementById("resTip").textContent = data.tip;

  // Strict JSON block
  rawJsonCode.textContent = JSON.stringify(data, null, 2);

  // Show section
  resultsSection.style.display = "block";
  resultsSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Client-side fallback if server offline
function generateClientFallback(rashi, date, timeframe, intent) {
  return {
    rashi: rashi || "Mithun",
    date: date || "Today",
    overall: "A productive day with lively opportunities to learn and exchange ideas.",
    career: "Good time for collaboration, communication, and clear teamwork.",
    love: "Positive conversations bring mutual understanding and joy.",
    finance: "Maintain disciplined budgeting and avoid impulsive discretionary expenses.",
    health: "Stay hydrated and manage mental stress with brief screen breaks.",
    lucky_color: "Emerald Green",
    lucky_number: 5,
    tip: intent && intent !== "all" 
      ? `Prioritize your ${intent} goals with disciplined daily focus.` 
      : "Focus on clear communication and finish pending tasks before starting new ones."
  };
}

// Compatibility Form Handler
function initCompatibility() {
  const sel1 = document.getElementById("compatRashi1");
  const sel2 = document.getElementById("compatRashi2");
  const btn = document.getElementById("btnCheckCompat");
  const resultBox = document.getElementById("compatResults");

  RASHIS.forEach((r) => {
    sel1.add(new Option(`${r.key} (${r.english})`, r.key));
    sel2.add(new Option(`${r.key} (${r.english})`, r.key));
  });

  sel1.value = "Mesh";
  sel2.value = "Singh";

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "Analyzing Harmony...";

    try {
      const res = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rashi1: sel1.value, rashi2: sel2.value })
      });
      const data = await res.json();

      resultBox.style.display = "block";
      resultBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
          <div>
            <h3 style="font-family: var(--font-heading); color: #fff; font-size: 1.3rem;">
              ${data.rashi1.name} (${data.rashi1.english}) & ${data.rashi2.name} (${data.rashi2.english})
            </h3>
            <span style="font-size: 0.85rem; color: var(--gold-primary);">${data.rating}</span>
          </div>
          <div style="background: var(--gold-gradient); color: #0c1022; padding: 8px 18px; border-radius: 9999px; font-weight: 700; font-size: 1.2rem;">
            ${data.compatibility_score}
          </div>
        </div>
        <p style="color: #e2e8f0; margin-bottom: 12px; font-size: 1.02rem;">
          <strong>Elemental Dynamic:</strong> ${data.elemental_dynamic}
        </p>
        <p style="color: var(--text-muted); font-size: 0.95rem; border-left: 3px solid var(--gold-primary); padding-left: 14px; margin-top: 14px;">
          <strong>Astrological Guidance:</strong> ${data.advice}
        </p>
      `;
    } catch (e) {
      console.error(e);
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<span class="btn-sparkle">✦</span> Analyze Compatibility`;
    }
  });
}

// DOB Rashi Ingress Handler
function initDOBFinder() {
  const input = document.getElementById("dobInput");
  const btn = document.getElementById("btnInferDOB");
  const resultBox = document.getElementById("dobResultBox");

  btn.addEventListener("click", async () => {
    if (!input.value) return;
    btn.disabled = true;
    btn.textContent = "Calculating Ingress...";

    try {
      const res = await fetch("/api/infer-rashi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dob: input.value })
      });
      const data = await res.json();

      resultBox.style.display = "block";
      resultBox.innerHTML = `
        <h3 style="font-family: var(--font-heading); color: #fff; margin-bottom: 8px; font-size: 1.3rem;">
          Inferred Vedic Sign: <span style="color: var(--gold-primary);">${data.inferred_rashi}</span> (${data.english_name} • ${data.sanskrit_name})
        </h3>
        <div style="display: flex; gap: 16px; margin: 12px 0; font-size: 0.95rem; color: var(--text-muted); flex-wrap: wrap;">
          <span>🪐 Ruling Planet: <strong style="color: #fff;">${data.ruling_planet}</strong></span>
          <span>🔥 Element: <strong style="color: #fff;">${data.element}</strong></span>
        </div>
        <p style="color: var(--text-dim); font-size: 0.88rem; line-height: 1.5; margin-top: 10px;">
          ${data.note}
        </p>
        <button type="button" class="btn-sm" style="margin-top: 16px; padding: 8px 18px;" onclick="switchAndSelectRashi('${data.inferred_rashi}')">
          Check ${data.inferred_rashi} Horoscope →
        </button>
      `;
    } catch (e) {
      console.error(e);
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<span class="btn-sparkle">✦</span> Infer Rashi`;
    }
  });
}

window.switchAndSelectRashi = function(rashi) {
  document.getElementById("tabHoroscope").click();
  selectRashi(rashi);
  fetchPrediction();
};

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  horoscopeDateInput.value = state.date;
  btnSetToday.addEventListener("click", () => {
    horoscopeDateInput.value = getTodayDateString();
  });

  btnGetHoroscope.addEventListener("click", fetchPrediction);

  initRashiGrid();
  initTabs();
  initTimeframe();
  initIntentPills();
  initViewToggle();
  initCompatibility();
  initDOBFinder();

  // Load initial prediction for Mithun
  fetchPrediction();
});
