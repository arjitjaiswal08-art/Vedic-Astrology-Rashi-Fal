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
  signType: "chandra", // 'chandra' (Moon), 'lagna' (Ascendant), or 'surya' (Sun)
  aiMode: "daily",     // 'daily' (Mode 1), 'sun_analysis' (Mode 2), 'kundli' (Mode 3)
  date: getTodayDateString(),
  intent: "all",
  activeView: "visual", // 'visual' or 'json'
  currentPrediction: null
};

// Sign Basis / Chart Perspective Selector
function initSignTypeControl() {
  const container = document.getElementById("signTypeSelect");
  if (!container) return;
  const btns = container.querySelectorAll(".segment-btn");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.signType = btn.dataset.signtype || "chandra";
      fetchPrediction();
    });
  });
}

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
    const meta = (typeof I18N !== "undefined" ? I18N.getRashi(r.key) : null) || {
      name: r.key,
      english: r.english,
      lord: `Lord: ${r.lord}`
    };

    const card = document.createElement("div");
    card.className = `rashi-card ${r.key === state.selectedRashi ? "selected" : ""}`;
    card.setAttribute("role", "radio");
    card.setAttribute("aria-checked", r.key === state.selectedRashi);
    card.setAttribute("tabindex", "0");
    card.id = `rashiCard_${r.key}`;

    const lordDisplay = typeof I18N !== "undefined" && I18N.currentLang !== "en" 
      ? meta.lord 
      : `Lord: ${r.lord}`;

    card.innerHTML = `
      <div class="rashi-icon">${r.icon}</div>
      <div class="rashi-name">${meta.name}</div>
      <div class="rashi-english">${meta.english} • ${r.sanskrit}</div>
      <div class="rashi-lord">${lordDisplay}</div>
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
    { btn: "tabDOBFinder", panel: "panelDOBFinder" },
    { btn: "tabPalmistry", panel: "panelPalmistry" }
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
  const currentLang = typeof I18N !== "undefined" ? I18N.currentLang : "en";
  btnGetHoroscope.disabled = true;
  const consultingText = typeof I18N !== "undefined" ? I18N.t("btn_consulting") : "Consulting Stars...";
  btnGetHoroscope.innerHTML = `<span class="btn-sparkle">⏳</span> ${consultingText}`;

  const dateValue = horoscopeDateInput.value ? formatDateToDDMMYYYY(horoscopeDateInput.value) : "today";

  try {
    const res = await fetch("/api/rashifal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rashi: state.selectedRashi,
        date: dateValue,
        timeframe: state.timeframe,
        intent: state.intent === "all" ? null : state.intent,
        language: currentLang,
        signType: state.signType
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
    const btnText = typeof I18N !== "undefined" ? I18N.t("btn_get_horoscope") : "Consult Celestial Alignment";
    btnGetHoroscope.innerHTML = `<span class="btn-sparkle">✦</span> ${btnText}`;
  }
}

// Vedic AI Studio Controller
function initVedicAiStudio() {
  const modeBtns = document.querySelectorAll("#aiModeSelector .segment-btn");
  modeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      modeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.aiMode = btn.dataset.aimode || "daily";
      
      // Auto-trigger prediction in the selected mode
      executeVedicAi({ mode: state.aiMode, rashi: state.selectedRashi });
    });
  });

  const inputEl = document.getElementById("vedicAiInput");
  const runBtn = document.getElementById("btnRunVedicAi");

  const runQuery = () => {
    const q = inputEl.value.trim();
    if (q) {
      executeVedicAi({ query: q });
    } else {
      executeVedicAi({ mode: state.aiMode || "daily", rashi: state.selectedRashi });
    }
  };

  if (runBtn) runBtn.addEventListener("click", runQuery);
  if (inputEl) {
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        runQuery();
      }
    });
  }

  // Quick Chips
  const chips = document.querySelectorAll(".ai-prompt-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const q = chip.dataset.query;
      if (inputEl) inputEl.value = q;
      executeVedicAi({ query: q });
    });
  });
}

async function executeVedicAi(params) {
  const currentLang = typeof I18N !== "undefined" ? I18N.currentLang : "en";
  const btn = document.getElementById("btnRunVedicAi");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="btn-sparkle">⏳</span> Analyzing...`;
  }

  try {
    const payload = Object.assign({ language: currentLang }, params);
    const res = await fetch("/api/vedic-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("API request failed");
    const data = await res.json();
    renderPrediction(data);
  } catch (err) {
    console.warn("Vedic AI fetch error, falling back:", err);
    fetchPrediction();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span class="btn-sparkle">✦</span> Analyze with Vedic AI`;
    }
  }
}

// Render Prediction Result to DOM
function renderPrediction(data) {
  state.currentPrediction = data;
  const currentLang = typeof I18N !== "undefined" ? I18N.currentLang : "en";
  const localizedData = typeof I18N !== "undefined" ? I18N.localizePrediction(data, currentLang) : data;

  function setFieldIfExists(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) el.textContent = value;
  }

  // Handle container modes
  const containerDaily = document.getElementById("containerModeDaily");
  const containerSun   = document.getElementById("containerModeSun");
  const containerKundli = document.getElementById("containerModeKundli");
  const signBar = document.getElementById("resSignBar");

  if (data.type === "sun_analysis") {
    if (containerDaily) containerDaily.style.display = "none";
    if (containerKundli) containerKundli.style.display = "none";
    if (containerSun) containerSun.style.display = "block";
    if (signBar) signBar.style.display = "none";

    const meta = typeof I18N !== "undefined" ? I18N.getRashi(data.surya_rashi) : null;
    const signName = meta ? `${meta.name} (${meta.english})` : data.surya_rashi;
    document.getElementById("resRashiHeading").textContent = `☀️ ${signName} — Sun Sign Analysis`;
    document.getElementById("resDateBadge").textContent = "MODE 2: SUN SIGN ANALYSIS";

    const badgeEl = document.getElementById("sunBadgeSign");
    if (badgeEl) badgeEl.textContent = `Surya Rashi: ${signName}`;

    const coreEl = document.getElementById("sunCorePersonality");
    if (coreEl) coreEl.textContent = data.core_personality;

    const strengthsEl = document.getElementById("sunStrengthsList");
    if (strengthsEl) {
      strengthsEl.innerHTML = (data.strengths || []).map(s => 
        `<span style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.4);border-radius:9999px;padding:4px 12px;font-size:0.84rem;color:#34d399;display:inline-block;">✓ ${s}</span>`
      ).join("");
    }

    const weaknessesEl = document.getElementById("sunWeaknessesList");
    if (weaknessesEl) {
      weaknessesEl.innerHTML = (data.weaknesses || []).map(w => 
        `<span style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);border-radius:9999px;padding:4px 12px;font-size:0.84rem;color:#f87171;display:inline-block;">• ${w}</span>`
      ).join("");
    }

    setFieldIfExists("sunCareerTendency", data.career_tendency);
    setFieldIfExists("sunLeadershipStyle", data.leadership_style);
    setFieldIfExists("sunLoveStyle", data.love_style);
    setFieldIfExists("sunGrowthAdvice", data.growth_advice);

    // Sync mode pills
    document.querySelectorAll("#aiModeSelector .segment-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.aimode === "sun_analysis");
    });
  } else if (data.type === "kundli") {
    if (containerDaily) containerDaily.style.display = "none";
    if (containerSun) containerSun.style.display = "none";
    if (containerKundli) containerKundli.style.display = "block";
    if (signBar) signBar.style.display = "none";

    document.getElementById("resRashiHeading").textContent = `🕉️ Full Kundli Summary`;
    document.getElementById("resDateBadge").textContent = "MODE 3: FULL KUNDLI";

    const lagnaMeta   = RASHIS.find(r => r.key === data.lagna) || {};
    const suryaMeta   = RASHIS.find(r => r.key === data.surya_rashi) || {};
    const chandraMeta = RASHIS.find(r => r.key === data.chandra_rashi) || {};

    const bannerEl = document.getElementById("kundliSignsBanner");
    if (bannerEl) {
      bannerEl.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.35);border-radius:9999px;padding:6px 14px;font-size:0.88rem;color:var(--gold-glow);" title="Lagna (Ascendant)">
          🌅 <strong>${lagnaMeta.icon || ""} ${data.lagna}</strong> <span style="opacity:0.75">(Lagna)</span>
        </span>
        <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(234,88,12,0.12);border:1px solid rgba(234,88,12,0.35);border-radius:9999px;padding:6px 14px;font-size:0.88rem;color:#fb923c;" title="Surya Rashi (Sun Sign)">
          ☀️ <strong>${suryaMeta.icon || ""} ${data.surya_rashi}</strong> <span style="opacity:0.75">(Surya)</span>
        </span>
        <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.35);border-radius:9999px;padding:6px 14px;font-size:0.88rem;color:#38bdf8;" title="Chandra Rashi (Moon Sign)">
          🌙 <strong>${chandraMeta.icon || ""} ${data.chandra_rashi}</strong> <span style="opacity:0.75">(Chandra)</span>
        </span>
      `;
    }

    setFieldIfExists("kundliSummaryText", data.summary);
    setFieldIfExists("kundliCareer", data.career);
    setFieldIfExists("kundliLove", data.love);
    setFieldIfExists("kundliFinance", data.finance);
    setFieldIfExists("kundliHealth", data.health);
    setFieldIfExists("kundliPlanetaryHint", data.planetary_hint);
    setFieldIfExists("kundliTip", data.tip);

    document.querySelectorAll("#aiModeSelector .segment-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.aimode === "kundli");
    });
  } else {
    // Mode 1: Daily Horoscope (Moon-focused)
    if (containerSun) containerSun.style.display = "none";
    if (containerKundli) containerKundli.style.display = "none";
    if (containerDaily) containerDaily.style.display = "block";
    if (signBar) signBar.style.display = "flex";

    const meta = typeof I18N !== "undefined" ? I18N.getRashi(data.rashi) : null;
    const rashiDisplay = meta ? `${meta.name} (${meta.english})` : data.rashi;
    const predLabel = typeof I18N !== "undefined" ? I18N.t("tab_horoscope").replace(/[✨\s]+/g, ' ') : "Prediction";
    document.getElementById("resRashiHeading").textContent = `${rashiDisplay} ${predLabel}`;
    document.getElementById("resDateBadge").textContent = `${(state.timeframe || "daily").toUpperCase()}: ${data.date || "Today"}`;

    // ── Three-Sign Identity Bar ──────────────────────────────────────────────
    let signBarEl = document.getElementById("resSignBar");
    if (!signBarEl) {
      signBarEl = document.createElement("div");
      signBarEl.id = "resSignBar";
      const heading = document.getElementById("resRashiHeading");
      if (heading && heading.parentNode) {
        heading.parentNode.insertBefore(signBarEl, heading.nextSibling);
      }
    }

    const lagnaRashi   = RASHIS.find(r => r.key === (data.lagna         || data.rashi)) || {};
    const suryaRashi   = RASHIS.find(r => r.key === (data.surya_rashi   || data.rashi)) || {};
    const chandraRashi = RASHIS.find(r => r.key === (data.chandra_rashi || data.rashi)) || {};

    const allSame = data.lagna === data.surya_rashi && data.surya_rashi === data.chandra_rashi;

    signBarEl.style.cssText = "margin: 10px 0 18px; display: flex; gap: 10px; flex-wrap: wrap;";
    if (!allSame && (data.lagna || data.surya_rashi || data.chandra_rashi)) {
      signBarEl.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:5px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.35);border-radius:9999px;padding:4px 12px;font-size:0.82rem;color:var(--gold-glow);"
          title="Lagna (Ascendant)">
          🌅 <strong>${lagnaRashi.icon || ""} ${data.lagna || data.rashi}</strong>
          <span style="opacity:0.7">(Lagna)</span>
        </span>
        <span style="display:inline-flex;align-items:center;gap:5px;background:rgba(234,88,12,0.12);border:1px solid rgba(234,88,12,0.35);border-radius:9999px;padding:4px 12px;font-size:0.82rem;color:#fb923c;"
          title="Surya Rashi (Sun Sign)">
          ☀️ <strong>${suryaRashi.icon || ""} ${data.surya_rashi || data.rashi}</strong>
          <span style="opacity:0.7">(Surya)</span>
        </span>
        <span style="display:inline-flex;align-items:center;gap:5px;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.35);border-radius:9999px;padding:4px 12px;font-size:0.82rem;color:#38bdf8;"
          title="Chandra Rashi (Moon Sign)">
          🌙 <strong>${chandraRashi.icon || ""} ${data.chandra_rashi || data.rashi}</strong>
          <span style="opacity:0.7">(Chandra)</span>
        </span>`;
    } else {
      signBarEl.innerHTML = "";
    }

    setFieldIfExists("resPersonalityInsight", localizedData.personality_insight);
    setFieldIfExists("resEmotionalState",     localizedData.emotional_state);
    setFieldIfExists("resDailyGuidance",      localizedData.daily_guidance);
    setFieldIfExists("resCareerFocus",        localizedData.career_focus   || localizedData.career);
    setFieldIfExists("resLoveHarmony",        localizedData.love_harmony   || localizedData.love);
    setFieldIfExists("resFinanceWisdom",      localizedData.finance_wisdom || localizedData.finance);
    setFieldIfExists("resHealthVitality",     localizedData.health_vitality || localizedData.health);
    setFieldIfExists("resCosmicTip",          localizedData.cosmic_tip     || localizedData.tip);

    setFieldIfExists("resOverall",  localizedData.overall  || localizedData.daily_guidance);
    setFieldIfExists("resCareer",   localizedData.career_focus   || localizedData.career);
    setFieldIfExists("resLove",     localizedData.love_harmony   || localizedData.love);
    setFieldIfExists("resFinance",  localizedData.finance_wisdom || localizedData.finance);
    setFieldIfExists("resHealth",   localizedData.health_vitality || localizedData.health);

    setFieldIfExists("resColorName", localizedData.lucky_color || "-");
    const hex = COLOR_MAP[data.lucky_color] || "#ffd166";
    const dot = document.getElementById("resColorDot");
    if (dot) dot.style.backgroundColor = hex;

    setFieldIfExists("resLuckyNumber", localizedData.lucky_number || "-");
    setFieldIfExists("resTip", localizedData.cosmic_tip || localizedData.tip || "-");

    document.querySelectorAll("#aiModeSelector .segment-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.aimode === "daily");
    });
  }

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

function updateCompatibilityOptions() {
  const sel1 = document.getElementById("compatRashi1");
  const sel2 = document.getElementById("compatRashi2");
  if (!sel1 || !sel2) return;

  const val1 = sel1.value || "Mesh";
  const val2 = sel2.value || "Singh";

  sel1.innerHTML = "";
  sel2.innerHTML = "";

  RASHIS.forEach((r) => {
    const meta = (typeof I18N !== "undefined" ? I18N.getRashi(r.key) : null) || { name: r.key, english: r.english };
    sel1.add(new Option(`${meta.name} (${meta.english})`, r.key));
    sel2.add(new Option(`${meta.name} (${meta.english})`, r.key));
  });

  sel1.value = val1;
  sel2.value = val2;
}

// Compatibility Form Handler
function initCompatibility() {
  const sel1 = document.getElementById("compatRashi1");
  const sel2 = document.getElementById("compatRashi2");
  const btn = document.getElementById("btnCheckCompat");
  const resultBox = document.getElementById("compatResults");

  updateCompatibilityOptions();


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
  const timeInput = document.getElementById("dobTimeInput");
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
        body: JSON.stringify({
          dob: input.value,
          time: timeInput ? timeInput.value : ""
        })
      });
      const data = await res.json();

      resultBox.style.display = "block";

      const lagna = data.lagna_rashi || { key: data.inferred_rashi, english: data.english_name, sanskrit: data.sanskrit_name, lord: data.ruling_planet, element: data.element };
      const surya = data.surya_rashi || lagna;
      const chandra = data.chandra_rashi || lagna;

      const tLagna = (typeof I18N !== "undefined" ? I18N.t("lagna_result_title") : "🌅 Lagna (Ascendant Sign)");
      const tSurya = (typeof I18N !== "undefined" ? I18N.t("surya_result_title") : "☀️ Surya Rashi (Sun Sign)");
      const tChandra = (typeof I18N !== "undefined" ? I18N.t("chandra_result_title") : "🌙 Chandra Rashi (Moon Sign)");

      resultBox.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:16px;margin-bottom:16px;">
          <!-- Lagna Card -->
          <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:14px;">
            <div style="font-size:0.85rem;color:var(--gold-glow);font-weight:600;margin-bottom:4px;">${tLagna}</div>
            <div style="font-family:var(--font-heading);font-size:1.3rem;color:#fff;font-weight:700;">${lagna.key} <span style="font-size:0.9rem;font-weight:normal;color:var(--text-muted);">(${lagna.english})</span></div>
            <div style="font-size:0.85rem;color:var(--text-muted);margin-top:6px;">🪐 Lord: <strong>${lagna.lord}</strong> | 🔥 ${lagna.element}</div>
            <button type="button" class="btn-sm" style="margin-top:10px;width:100%;" onclick="switchAndSelectRashiMode('${lagna.key}', 'lagna')">Select Lagna →</button>
          </div>

          <!-- Surya Rashi Card -->
          <div style="background:rgba(234,88,12,0.1);border:1px solid rgba(234,88,12,0.3);border-radius:12px;padding:14px;">
            <div style="font-size:0.85rem;color:#fb923c;font-weight:600;margin-bottom:4px;">${tSurya}</div>
            <div style="font-family:var(--font-heading);font-size:1.3rem;color:#fff;font-weight:700;">${surya.key} <span style="font-size:0.9rem;font-weight:normal;color:var(--text-muted);">(${surya.english})</span></div>
            <div style="font-size:0.85rem;color:var(--text-muted);margin-top:6px;">🪐 Lord: <strong>${surya.lord}</strong> | 🔥 ${surya.element}</div>
            <button type="button" class="btn-sm" style="margin-top:10px;width:100%;" onclick="switchAndSelectRashiMode('${surya.key}', 'surya')">Select Surya Rashi →</button>
          </div>

          <!-- Chandra Rashi Card -->
          <div style="background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.3);border-radius:12px;padding:14px;">
            <div style="font-size:0.85rem;color:#38bdf8;font-weight:600;margin-bottom:4px;">${tChandra}</div>
            <div style="font-family:var(--font-heading);font-size:1.3rem;color:#fff;font-weight:700;">${chandra.key} <span style="font-size:0.9rem;font-weight:normal;color:var(--text-muted);">(${chandra.english})</span></div>
            <div style="font-size:0.85rem;color:var(--text-muted);margin-top:6px;">🪐 Lord: <strong>${chandra.lord}</strong> | 🔥 ${chandra.element}</div>
            <button type="button" class="btn-sm" style="margin-top:10px;width:100%;" onclick="switchAndSelectRashiMode('${chandra.key}', 'chandra')">Select Chandra Rashi →</button>
          </div>
        </div>

        <p style="color: var(--text-dim); font-size: 0.88rem; line-height: 1.5;">
          ${data.note || "Calculated using Vedic Sidereal Ephemeris."}
        </p>
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

window.switchAndSelectRashiMode = function(rashi, mode) {
  document.getElementById("tabHoroscope").click();
  state.signType = mode || "chandra";
  const container = document.getElementById("signTypeSelect");
  if (container) {
    container.querySelectorAll(".segment-btn").forEach(b => {
      if (b.dataset.signtype === state.signType) b.classList.add("active");
      else b.classList.remove("active");
    });
  }
  selectRashi(rashi);
  fetchPrediction();
};

window.switchAndSelectTab = function(tabId) {
  const btn = document.getElementById(tabId);
  if (btn) btn.click();
};

window.setTimeframe = function(timeframe) {
  state.timeframe = timeframe;
  const segmentBtns = document.querySelectorAll(".segment-btn");
  segmentBtns.forEach((b) => {
    if (b.dataset.timeframe === timeframe) {
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });

  const dateLabel = document.querySelector('label[for="horoscopeDate"]');
  if (dateLabel) {
    if (timeframe === "weekly") {
      dateLabel.textContent = "Reference Week (Start Date)";
    } else if (timeframe === "monthly") {
      dateLabel.textContent = "Reference Month (Any Date)";
    } else {
      dateLabel.textContent = "Prediction Date";
    }
  }
};

window.setIntent = function(intent) {
  state.intent = intent || "all";
  const pills = document.querySelectorAll(".pill-btn");
  pills.forEach((p) => {
    if (p.dataset.intent === state.intent) {
      p.classList.add("active");
    } else {
      p.classList.remove("active");
    }
  });
};

// Language Selector Event Binding
function initLanguageSelector() {
  const pills = document.querySelectorAll(".lang-pill");
  pills.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (typeof I18N !== "undefined") {
        I18N.setLanguage(lang);
      }
    });
  });

  window.addEventListener("languageChanged", (e) => {
    const lang = e.detail.lang;
    // Re-render Rashi grid with new language names
    initRashiGrid();

    // Re-populate compatibility dropdowns
    updateCompatibilityOptions();

    // Refresh Palmistry panel text
    if (window.palmistryPanel) {
      window.palmistryPanel.onLanguageChange();
    }

    // Refresh Palm Scan UI modal text if open
    if (window.palmScanUI && typeof window.palmScanUI.updateLanguage === "function") {
      window.palmScanUI.updateLanguage();
    }

    // If prediction is present, re-render in new language or fetch
    if (state.currentPrediction) {
      fetchPrediction();
    }
  });
}

// Expose state and methods globally for Voice Assistant
window.state = state;
window.selectRashi = selectRashi;
window.formatDateToDDMMYYYY = formatDateToDDMMYYYY;
window.horoscopeDateInput = horoscopeDateInput;
window.renderPrediction = renderPrediction;

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Initialize i18n
  if (typeof I18N !== "undefined") {
    I18N.init();
    initLanguageSelector();
  }

  horoscopeDateInput.value = state.date;
  btnSetToday.addEventListener("click", () => {
    horoscopeDateInput.value = getTodayDateString();
  });

  btnGetHoroscope.addEventListener("click", fetchPrediction);

  initRashiGrid();
  initSignTypeControl();
  initTabs();
  initTimeframe();
  initIntentPills();
  initViewToggle();
  initCompatibility();
  initDOBFinder();

  // Initialize Palmistry Panel & Scanner
  if (typeof PalmistryPanel !== "undefined") {
    window.palmistryPanel = new PalmistryPanel();
    window.palmistryPanel.init();
    if (typeof PalmScanUI !== "undefined") {
      window.palmScanUI = new PalmScanUI(window.palmistryPanel);
      window.palmScanUI.init();
    }
  }

  // Initialize Jyotish Vani Voice Assistant
  if (typeof JyotishVoiceAssistant !== "undefined") {
    window.voiceAssistant = new JyotishVoiceAssistant();
  }

  // Load initial prediction for Mithun
  fetchPrediction();
});


