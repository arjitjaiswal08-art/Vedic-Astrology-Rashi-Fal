/**
 * Jyotish Vani AI - Vedic Astrology Voice Assistant Engine
 * Supports Speech-to-Text (Web Speech API), Natural Language Astrology Query Parsing,
 * and Text-to-Speech (SpeechSynthesis) with Animated Audio Waveform Feedback.
 */

class JyotishVoiceAssistant {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.selectedVoice = null;

    // Rashi Dictionary: Maps both Sanskrit and English names to the canonical Sanskrit Rashi key
    this.rashiMap = {
      // Mesh / Aries
      "mesh": "Mesh", "mesha": "Mesh", "aries": "Mesh", "ram": "Mesh",
      // Vrishabh / Taurus
      "vrishabh": "Vrishabh", "vrishabha": "Vrishabh", "taurus": "Vrishabh", "bull": "Vrishabh",
      // Mithun / Gemini
      "mithun": "Mithun", "mithuna": "Mithun", "gemini": "Mithun", "twins": "Mithun",
      // Kark / Cancer
      "kark": "Kark", "karka": "Kark", "cancer": "Kark", "crab": "Kark",
      // Singh / Leo
      "singh": "Singh", "simha": "Singh", "leo": "Singh", "lion": "Singh",
      // Kanya / Virgo
      "kanya": "Kanya", "virgo": "Kanya", "maiden": "Kanya",
      // Tula / Libra
      "tula": "Tula", "libra": "Tula", "scales": "Tula", "balance": "Tula",
      // Vrischik / Scorpio
      "vrischik": "Vrischik", "vrishchika": "Vrischik", "scorpio": "Vrischik", "scorpion": "Vrischik",
      // Dhanu / Sagittarius
      "dhanu": "Dhanu", "dhanus": "Dhanu", "sagittarius": "Dhanu", "archer": "Dhanu",
      // Makar / Capricorn
      "makar": "Makar", "makara": "Makar", "capricorn": "Makar", "goat": "Makar",
      // Kumbh / Aquarius
      "kumbh": "Kumbh", "kumbha": "Kumbh", "aquarius": "Kumbh", "water bearer": "Kumbh",
      // Meen / Pisces
      "meen": "Meen", "meena": "Meen", "pisces": "Meen", "fish": "Meen"
    };

    this.dom = {};
    this.init();
  }

  init() {
    this.cacheDom();
    this.initSpeechRecognition();
    this.initSpeechSynthesis();
    this.bindEvents();
  }

  cacheDom() {
    this.dom = {
      // Floating launcher
      launcherBtn: document.getElementById("voiceAssistantLauncher"),
      launcherBadge: document.getElementById("launcherStatusBadge"),

      // Assistant Drawer
      drawer: document.getElementById("voiceAssistantDrawer"),
      closeBtn: document.getElementById("closeVoiceAssistant"),
      backdrop: document.getElementById("voiceAssistantBackdrop"),

      // Audio waves & Visualizer
      visualizer: document.getElementById("voiceVisualizer"),
      statusLabel: document.getElementById("voiceStatusLabel"),
      orbElement: document.getElementById("assistantOrb"),

      // Transcript & Response
      transcriptText: document.getElementById("voiceTranscriptText"),
      responseText: document.getElementById("voiceResponseText"),

      // Controls
      micToggleBtn: document.getElementById("btnToggleMic"),
      btnStopAudio: document.getElementById("btnStopVoiceAudio"),
      voiceQueryInput: document.getElementById("voiceQueryInput"),
      btnSendQuery: document.getElementById("btnSendVoiceQuery"),
      chipButtons: document.querySelectorAll(".voice-chip-btn"),

      // Direct Results Listen Button
      btnListenHoroscope: document.getElementById("btnListenHoroscope"),
      listenIcon: document.getElementById("listenIcon"),
      listenLabel: document.getElementById("listenLabel"),
      listenWave: document.getElementById("listenWave")
    };
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition API not supported in this browser. Fallback to text mode enabled.");
      if (this.dom.statusLabel) {
        this.dom.statusLabel.textContent = "Voice input unavailable (type below)";
      }
      if (this.dom.micToggleBtn) {
        this.dom.micToggleBtn.title = "Voice recognition is not supported in this browser. Use text input below.";
        this.dom.micToggleBtn.classList.add("disabled-mic");
      }
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";

      this.recognition.onstart = () => {
        this.isListening = true;
        this.setVisualState("listening", "Listening... Speak your question");
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        if (this.dom.transcriptText) {
          this.dom.transcriptText.textContent = `“${text}”`;
        }

        if (finalTranscript) {
          this.handleNaturalQuery(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        this.isListening = false;
        let msg = "Microphone error. Please try again or type below.";
        if (event.error === "not-allowed") {
          msg = "Microphone permission denied. Allow mic access or type below.";
        } else if (event.error === "no-speech") {
          msg = "No speech detected. Click the mic to try again.";
        }
        this.setVisualState("idle", msg);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (!this.isSpeaking) {
          this.setVisualState("idle", "Tap microphone to speak or choose a topic");
        }
      };
    } catch (e) {
      console.error("Failed to initialize SpeechRecognition:", e);
    }
  }

  initSpeechSynthesis() {
    if (!("speechSynthesis" in window)) {
      console.warn("SpeechSynthesis API not supported in this browser.");
      return;
    }

    const loadVoices = () => {
      this.updateVoiceForLanguage(typeof I18N !== "undefined" ? I18N.currentLang : "en");
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  updateVoiceForLanguage(lang = "en") {
    if (!("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    if (lang === "hi") {
      this.selectedVoice = voices.find(v => v.lang === "hi-IN" || v.lang.startsWith("hi")) || this.selectedVoice;
    } else if (lang === "ta") {
      this.selectedVoice = voices.find(v => v.lang === "ta-IN" || v.lang.startsWith("ta")) || this.selectedVoice;
    } else if (lang === "te") {
      this.selectedVoice = voices.find(v => v.lang === "te-IN" || v.lang.startsWith("te")) || this.selectedVoice;
    } else if (lang === "sa") {
      this.selectedVoice = voices.find(v => v.lang.startsWith("sa") || v.lang === "hi-IN" || v.lang.startsWith("hi")) || this.selectedVoice;
    } else {
      this.selectedVoice =
        voices.find(v => v.lang === "en-IN") ||
        voices.find(v => v.lang === "en-GB") ||
        voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"))) ||
        voices.find(v => v.lang.startsWith("en")) ||
        voices[0] ||
        null;
    }

    if (this.recognition) {
      const speechCode = (typeof I18N !== "undefined" && I18N.LANGUAGES[lang]) ? I18N.LANGUAGES[lang].speechLang : "en-US";
      this.recognition.lang = speechCode;
    }
  }

  bindEvents() {
    // Listen to global language change
    window.addEventListener("languageChanged", (e) => {
      this.updateVoiceForLanguage(e.detail.lang);
    });

    // Open/Close Drawer
    if (this.dom.launcherBtn) {
      this.dom.launcherBtn.addEventListener("click", () => this.toggleDrawer());
    }

    if (this.dom.closeBtn) {
      this.dom.closeBtn.addEventListener("click", () => this.closeDrawer());
    }

    if (this.dom.backdrop) {
      this.dom.backdrop.addEventListener("click", () => this.closeDrawer());
    }

    // Toggle Mic
    if (this.dom.micToggleBtn) {
      this.dom.micToggleBtn.addEventListener("click", () => this.toggleListening());
    }

    // Stop Audio
    if (this.dom.btnStopAudio) {
      this.dom.btnStopAudio.addEventListener("click", () => this.stopSpeaking());
    }

    // Text Query Input
    if (this.dom.btnSendQuery && this.dom.voiceQueryInput) {
      const sendText = () => {
        const val = this.dom.voiceQueryInput.value.trim();
        if (val) {
          this.dom.voiceQueryInput.value = "";
          if (this.dom.transcriptText) {
            this.dom.transcriptText.textContent = `“${val}”`;
          }
          this.handleNaturalQuery(val);
        }
      };

      this.dom.btnSendQuery.addEventListener("click", sendText);
      this.dom.voiceQueryInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          sendText();
        }
      });
    }

    // Quick Voice Chips
    if (this.dom.chipButtons) {
      this.dom.chipButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          const prompt = btn.dataset.prompt;
          if (prompt) {
            if (this.dom.transcriptText) {
              this.dom.transcriptText.textContent = `“${prompt}”`;
            }
            this.handleNaturalQuery(prompt);
          }
        });
      });
    }

    // Direct Results Listen Button
    if (this.dom.btnListenHoroscope) {
      this.dom.btnListenHoroscope.addEventListener("click", () => {
        if (this.isSpeaking) {
          this.stopSpeaking();
        } else {
          this.speakCurrentHoroscope();
        }
      });
    }
  }

  toggleDrawer() {
    if (!this.dom.drawer) return;
    const isOpen = this.dom.drawer.classList.contains("open");
    if (isOpen) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }

  openDrawer() {
    if (!this.dom.drawer) return;
    this.dom.drawer.classList.add("open");
    if (this.dom.backdrop) this.dom.backdrop.classList.add("open");
    if (this.dom.launcherBtn) this.dom.launcherBtn.classList.add("active");

    // Auto-prompt to listen if supported and idle
    if (this.recognition && !this.isListening && !this.isSpeaking) {
      setTimeout(() => this.startListening(), 400);
    }
  }

  closeDrawer() {
    if (!this.dom.drawer) return;
    this.dom.drawer.classList.remove("open");
    if (this.dom.backdrop) this.dom.backdrop.classList.remove("open");
    if (this.dom.launcherBtn) this.dom.launcherBtn.classList.remove("active");

    if (this.isListening) {
      this.stopListening();
    }
  }

  toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.stopSpeaking();
      this.startListening();
    }
  }

  startListening() {
    if (!this.recognition) {
      this.setVisualState("idle", "Speech recognition unavailable. Please type your query below.");
      return;
    }

    try {
      this.stopSpeaking();
      this.recognition.start();
    } catch (e) {
      console.warn("Recognition start skipped:", e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn("Recognition stop error:", e);
      }
    }
    this.isListening = false;
  }

  setVisualState(state, message) {
    if (this.dom.statusLabel) {
      this.dom.statusLabel.textContent = message;
    }

    const orb = this.dom.orbElement;
    const visualizer = this.dom.visualizer;
    const micBtn = this.dom.micToggleBtn;

    // Reset visual classes
    if (orb) orb.className = "assistant-orb " + state;
    if (visualizer) visualizer.className = "voice-visualizer " + (state === "speaking" || state === "listening" ? "active" : "");
    if (micBtn) {
      if (state === "listening") {
        micBtn.classList.add("recording");
      } else {
        micBtn.classList.remove("recording");
      }
    }

    // Results listen button status
    if (this.dom.btnListenHoroscope) {
      if (this.isSpeaking) {
        this.dom.btnListenHoroscope.classList.add("playing");
        if (this.dom.listenIcon) this.dom.listenIcon.textContent = "⏹️";
        if (this.dom.listenLabel) this.dom.listenLabel.textContent = "Stop Voice";
        if (this.dom.listenWave) this.dom.listenWave.style.display = "inline-flex";
      } else {
        this.dom.btnListenHoroscope.classList.remove("playing");
        if (this.dom.listenIcon) this.dom.listenIcon.textContent = "🔊";
        if (this.dom.listenLabel) this.dom.listenLabel.textContent = "Listen to Horoscope";
        if (this.dom.listenWave) this.dom.listenWave.style.display = "none";
      }
    }
  }

  /**
   * Natural Language Astrology Query Parser
   */
  async handleNaturalQuery(query) {
    const q = query.toLowerCase();
    this.setVisualState("processing", "Consulting celestial alignments...");

    // 1. Direct Control Commands: Stop / Mute / Pause
    if (/^(stop|quiet|silence|mute|pause|shut up)/i.test(q)) {
      this.stopSpeaking();
      this.setVisualState("idle", "Voice playback paused.");
      if (this.dom.responseText) {
        this.dom.responseText.textContent = "Voice playback stopped.";
      }
      return;
    }

    // 2. Read Current Horoscope Command
    if (/(read|speak|listen|recite|tell me|hear).*horoscope/i.test(q) && !this.detectRashiInQuery(q)) {
      this.speakCurrentHoroscope();
      return;
    }

    // 3. Compatibility Match Query: e.g. "compare aries and leo", "compatibility between tula and vrishchik"
    const compatMatch = this.detectCompatibilityQuery(q);
    if (compatMatch) {
      await this.executeCompatibilityQuery(compatMatch.rashi1, compatMatch.rashi2);
      return;
    }

    // 4. Ingress / DOB Query (generic without year)
    if (/(born on|birthday|date of birth|dob)/i.test(q) && !/\d{4}/.test(q)) {
      const response = "To find your Vedic Rashi by birth date, enter your Date of Birth in the DOB Rashi Finder tab!";
      if (window.switchAndSelectTab) window.switchAndSelectTab("tabDOBFinder");
      this.respondAndSpeak(response);
      return;
    }

    // 5. Query the Advanced Vedic Astrology AI System
    try {
      const currentLang = typeof I18N !== "undefined" ? I18N.currentLang : "en";
      const res = await fetch("/api/vedic-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, language: currentLang })
      });
      if (!res.ok) throw new Error("Vedic AI API request failed");
      const data = await res.json();

      // Render to main page if available
      if (window.renderPrediction) {
        window.renderPrediction(data);
      }

      // Build spoken response & dialogue snippet based on data.type
      let spokenText = "";
      let displayText = "";

      if (data.type === "sun_analysis") {
        spokenText = `Surya Rashi ${data.surya_rashi}. ${data.core_personality} Career: ${data.career_tendency} Growth advice: ${data.growth_advice}`;
        displayText = `☀️ [Mode 2: Sun Analysis for ${data.surya_rashi}]\n\n${data.core_personality}\n\n• Strengths: ${data.strengths.join(", ")}\n• Leadership: ${data.leadership_style}\n• Advice: ${data.growth_advice}`;
      } else if (data.type === "kundli") {
        spokenText = `Kundli synthesis for Lagna ${data.lagna}, Sun ${data.surya_rashi}, and Moon ${data.chandra_rashi}. ${data.summary} Tip: ${data.tip}`;
        displayText = `🕉️ [Mode 3: Kundli Summary: Lagna ${data.lagna} | Sun ${data.surya_rashi} | Moon ${data.chandra_rashi}]\n\n${data.summary}\n\n• Career: ${data.career}\n• Love: ${data.love}\n• Health: ${data.health}\n• Planetary Hint: ${data.planetary_hint}\n• Upaya: ${data.tip}`;
      } else if (data.type === "compatibility") {
        spokenText = `Compatibility between ${data.rashi1} and ${data.rashi2} is ${data.compatibility_score}, rated as ${data.rating}. ${data.elemental_dynamic}`;
        displayText = `⚡ Compatibility: ${data.rashi1} & ${data.rashi2} (${data.compatibility_score} - ${data.rating})\n\n${data.elemental_dynamic}\nGuidance: ${data.advice}`;
      } else {
        // Mode 1: Daily Horoscope
        spokenText = `Namaste. For ${data.rashi}, ${data.overall} In career: ${data.career} Lucky color: ${data.lucky_color}, number: ${data.lucky_number}. Upaya: ${data.tip}`;
        displayText = `🌙 [Mode 1: Daily Horoscope for ${data.rashi}]\n\n${data.overall}\n\n• Career: ${data.career}\n• Love: ${data.love}\n• Finance: ${data.finance}\n• Health: ${data.health}\n• Lucky: ${data.lucky_color} | Number: ${data.lucky_number}\n• Upaya: ${data.tip}`;
      }

      if (this.dom.responseText) {
        this.dom.responseText.innerText = displayText;
      }
      this.speak(spokenText);
    } catch (err) {
      console.error("Voice Vedic AI failed:", err);
      this.respondAndSpeak(`I consulted the celestial alignments for your query. You can explore the visual cards above.`);
    }
  }

  detectRashiInQuery(query) {
    const words = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/);

    // Direct check for multi-word or exact match
    for (const [alias, canonical] of Object.entries(this.rashiMap)) {
      const regex = new RegExp(`\\b${alias}\\b`, "i");
      if (regex.test(query)) {
        return canonical;
      }
    }

    for (const word of words) {
      if (this.rashiMap[word]) {
        return this.rashiMap[word];
      }
    }
    return null;
  }

  detectCompatibilityQuery(query) {
    const isCompatQuery = /compare|compatibility|compatible|match|harmony|versus|vs/i.test(query);
    if (!isCompatQuery) return null;

    const found = [];
    const lower = query.toLowerCase();

    for (const [alias, canonical] of Object.entries(this.rashiMap)) {
      const regex = new RegExp(`\\b${alias}\\b`, "i");
      if (regex.test(lower)) {
        if (!found.includes(canonical)) {
          found.push(canonical);
        }
      }
    }

    if (found.length >= 2) {
      return { rashi1: found[0], rashi2: found[1] };
    }
    return null;
  }

  async executeCompatibilityQuery(rashi1, rashi2) {
    try {
      const res = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rashi1, rashi2 })
      });
      const data = await res.json();

      // Trigger UI compatibility tab
      if (window.switchAndSelectTab) {
        window.switchAndSelectTab("tabCompatibility");
      }
      const sel1 = document.getElementById("compatRashi1");
      const sel2 = document.getElementById("compatRashi2");
      if (sel1 && sel2) {
        sel1.value = rashi1;
        sel2.value = rashi2;
        const btn = document.getElementById("btnCheckCompat");
        if (btn) btn.click();
      }

      const spokenResponse = `Compatibility between ${rashi1} and ${rashi2} is ${data.compatibility_score}, rated as ${data.rating}. ${data.elemental_dynamic}. Guidance: ${data.advice}`;
      this.respondAndSpeak(spokenResponse);
    } catch (err) {
      console.error(err);
      this.respondAndSpeak(`Comparing ${rashi1} and ${rashi2}. Please review the detailed harmony matrix.`);
    }
  }

  async fetchHoroscope(rashi, timeframe, intent) {
    const dateValue = (window.horoscopeDateInput && window.horoscopeDateInput.value)
      ? window.formatDateToDDMMYYYY(window.horoscopeDateInput.value)
      : "today";

    const res = await fetch("/api/rashifal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rashi, date: dateValue, timeframe, intent })
    });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  }

  composePredictionSpeech(data, intent, timeframe) {
    const timeLabel = timeframe === "weekly" ? "this week" : (timeframe === "monthly" ? "this month" : "today");
    const rashiName = data.rashi;

    if (intent === "career") {
      return `For ${rashiName} ${timeLabel}, your career forecast: ${data.career} Lucky number is ${data.lucky_number}, and lucky color is ${data.lucky_color}.`;
    }
    if (intent === "love") {
      return `In love and relationships for ${rashiName} ${timeLabel}: ${data.love} Celestial advice: ${data.tip}`;
    }
    if (intent === "finance") {
      return `For ${rashiName} finances ${timeLabel}: ${data.finance} Lucky color is ${data.lucky_color}.`;
    }
    if (intent === "health") {
      return `For your health and vitality ${timeLabel}: ${data.health} Upaya: ${data.tip}`;
    }
    if (intent === "tip") {
      return `Vedic Upaya for ${rashiName}: ${data.tip} Your lucky color is ${data.lucky_color}, and lucky number is ${data.lucky_number}.`;
    }

    // Overall Full Brief
    return `Namaste. Here is the ${timeLabel} alignment for ${rashiName}. ${data.overall} In career: ${data.career} In relationships: ${data.love} Key advice: ${data.tip} Lucky color is ${data.lucky_color}, and lucky number is ${data.lucky_number}.`;
  }

  speakCurrentHoroscope() {
    if (!window.state || !window.state.currentPrediction) {
      const emptyMsg = (typeof I18N !== "undefined" && I18N.currentLang === "hi")
        ? "कृपया पहले किसी राशि का राशिफल देखें, ताकि मैं उसका वाचन कर सकूं।"
        : (typeof I18N !== "undefined" && I18N.currentLang === "ta")
        ? "முதலில் ஒரு ராசி பலனைப் பாருங்கள், பிறகு நான் வாசிக்கிறேன்."
        : (typeof I18N !== "undefined" && I18N.currentLang === "te")
        ? "దయచేసి ముందుగా రాశి ఫలాలను చూడండి, అప్పుడు నేను చదువుతాను."
        : (typeof I18N !== "undefined" && I18N.currentLang === "sa")
        ? "कृपया पूर्वं राशिफलं पश्यतु, येन अहं तत् पठितुं शक्नोमि।"
        : "Please consult a horoscope first so I can read it for you.";
      this.respondAndSpeak(emptyMsg);
      return;
    }
    const raw = window.state.currentPrediction;
    const currentLang = typeof I18N !== "undefined" ? I18N.currentLang : "en";
    const data = typeof I18N !== "undefined" ? I18N.localizePrediction(raw, currentLang) : raw;

    let text;
    if (currentLang === "hi") {
      text = `नमस्ते। ${data.rashi_display || data.rashi} राशि का राशिफल: ${data.overall} करियर: ${data.career} प्रेम: ${data.love} वित्त: ${data.finance} स्वास्थ्य: ${data.health} वैदिक उपाय: ${data.tip} शुभ रंग है ${data.lucky_color}, और शुभ अंक है ${data.lucky_number}।`;
    } else if (currentLang === "ta") {
      text = `வணக்கம். ${data.rashi_display || data.rashi} ராசி பலன்: ${data.overall} தொழில்: ${data.career} குடும்பம்: ${data.love} நிதி: ${data.finance} ஆரோக்கியம்: ${data.health} வேத பரிகாரம்: ${data.tip} அதிர்ஷ்ட நிறம் ${data.lucky_color}, அதிர்ஷ்ட எண் ${data.lucky_number}.`;
    } else if (currentLang === "te") {
      text = `నమస్కారం. ${data.rashi_display || data.rashi} రాశి ఫలాలు: ${data.overall} కెరీర్: ${data.career} ప్రేమ: ${data.love} ఆర్థికం: ${data.finance} ఆరోగ్యం: ${data.health} వేద పరిహారం: ${data.tip} అదృష్ట రంగు ${data.lucky_color}, అదృష్ట సంఖ్య ${data.lucky_number}.`;
    } else if (currentLang === "sa") {
      text = `नमो नमः। ${data.rashi_display || data.rashi} राशेः फलितम्: ${data.overall} कार्यक्षेत्रम्: ${data.career} प्रेम: ${data.love} वित्तम्: ${data.finance} स्वास्थ्यम्: ${data.health} उपायः: ${data.tip} शुभवर्णः ${data.lucky_color}, शुभाङ्कः ${data.lucky_number}।`;
    } else {
      text = `Namaste. Reading ${window.state.timeframe || "daily"} horoscope for ${data.rashi}. ${data.overall} Career: ${data.career} Love: ${data.love} Finance: ${data.finance} Health: ${data.health} Key Upaya: ${data.tip} Lucky color is ${data.lucky_color}, lucky number is ${data.lucky_number}.`;
    }

    this.respondAndSpeak(text);
  }

  respondAndSpeak(text) {
    if (this.dom.responseText) {
      this.dom.responseText.textContent = text;
    }

    this.speak(text);
  }

  speak(text) {
    if (!("speechSynthesis" in window)) {
      this.setVisualState("idle", "Speech synthesis not supported in this browser.");
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96; // Slightly relaxed, regal tempo
    utterance.pitch = 1.0;

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.setVisualState("speaking", "Jyotish Vani is speaking...");
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.setVisualState("idle", "Tap microphone to speak or choose a topic");
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      this.isSpeaking = false;
      this.setVisualState("idle", "Tap microphone to speak or choose a topic");
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.setVisualState("idle", "Tap microphone to speak or choose a topic");
  }
}

// Attach globally
window.JyotishVoiceAssistant = JyotishVoiceAssistant;
