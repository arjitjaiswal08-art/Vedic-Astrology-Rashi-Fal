/**
 * Vedic Astrology Rashi Fal - Internationalization (i18n) Engine
 * Supported Languages:
 *  - en: English (Default)
 *  - hi: हिन्दी (Hindi)
 *  - ta: தமிழ் (Tamil)
 *  - te: తెలుగు (Telugu)
 *  - sa: संस्कृतम् (Sanskrit)
 */

const I18N = {
  currentLang: "en",

  // Supported language metadata
  LANGUAGES: {
    en: { code: "en", name: "English", nativeName: "English", flag: "🌐", speechLang: "en-US" },
    hi: { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", speechLang: "hi-IN" },
    ta: { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", speechLang: "ta-IN" },
    te: { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", speechLang: "te-IN" },
    sa: { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्", flag: "🕉️", speechLang: "hi-IN" }
  },

  // 12 Rashis names in all 5 languages
  RASHIS: {
    Mesh: {
      en: { name: "Mesh", english: "Aries", symbol: "Ram", lord: "Mangal (Mars)", element: "Fire" },
      hi: { name: "मेष", english: "Aries", symbol: "मेढ़ा", lord: "मंगल", element: "अग्नि" },
      ta: { name: "மேஷம்", english: "Aries", symbol: "ஆடு", lord: "செவ்வாய்", element: "நெருப்பு" },
      te: { name: "మేషం", english: "Aries", symbol: "పొట్టేలు", lord: "కుజుడు", element: "అగ్ని" },
      sa: { name: "मेषः", english: "Aries", symbol: "अजः", lord: "मङ्गलः", element: "तेजः (अग्निः)" }
    },
    Vrishabh: {
      en: { name: "Vrishabh", english: "Taurus", symbol: "Bull", lord: "Shukra (Venus)", element: "Earth" },
      hi: { name: "वृषभ", english: "Taurus", symbol: "बैल", lord: "शुक्र", element: "पृथ्वी" },
      ta: { name: "ரிஷபம்", english: "Taurus", symbol: "காளை", lord: "சுக்கிரன்", element: "பூமி" },
      te: { name: "వృషభం", english: "Taurus", symbol: "ఎద్దు", lord: "శుక్రుడు", element: "భూమి" },
      sa: { name: "वृषभः", english: "Taurus", symbol: "बलीवर्दः", lord: "शुक्रः", element: "पृथ्वी" }
    },
    Mithun: {
      en: { name: "Mithun", english: "Gemini", symbol: "Twins", lord: "Budh (Mercury)", element: "Air" },
      hi: { name: "मिथुन", english: "Gemini", symbol: "युगल", lord: "बुध", element: "वायु" },
      ta: { name: "மிதுனம்", english: "Gemini", symbol: "இரட்டையர்", lord: "புதன்", element: "காற்று" },
      te: { name: "మిథునం", english: "Gemini", symbol: "మిథునం", lord: "బుధుడు", element: "వాయువు" },
      sa: { name: "मिथुनम्", english: "Gemini", symbol: "युग्मम्", lord: "बुधः", element: "वायुः" }
    },
    Kark: {
      en: { name: "Kark", english: "Cancer", symbol: "Crab", lord: "Chandra (Moon)", element: "Water" },
      hi: { name: "कर्क", english: "Cancer", symbol: "केकड़ा", lord: "चन्द्र", element: "जल" },
      ta: { name: "கடகம்", english: "Cancer", symbol: "நண்டு", lord: "சந்திரன்", element: "நீர்" },
      te: { name: "కర్కాటకం", english: "Cancer", symbol: "పీత", lord: "చంద్రుడు", element: "జలం" },
      sa: { name: "कर्कटः", english: "Cancer", symbol: "कुलीरः", lord: "चन्द्रः", element: "जलम्" }
    },
    Singh: {
      en: { name: "Singh", english: "Leo", symbol: "Lion", lord: "Surya (Sun)", element: "Fire" },
      hi: { name: "सिंह", english: "Leo", symbol: "शेर", lord: "सूर्य", element: "अग्नि" },
      ta: { name: "சிம்மம்", english: "Leo", symbol: "சிங்கம்", lord: "சூரியன்", element: "நெருப்பு" },
      te: { name: "సింహం", english: "Leo", symbol: "సింహం", lord: "సూర్యుడు", element: "అగ్ని" },
      sa: { name: "सिंहः", english: "Leo", symbol: "मृगेन्द्रः", lord: "सूर्यः", element: "तेजः (अग्निः)" }
    },
    Kanya: {
      en: { name: "Kanya", english: "Virgo", symbol: "Maiden", lord: "Budh (Mercury)", element: "Earth" },
      hi: { name: "कन्या", english: "Virgo", symbol: "कन्या", lord: "बुध", element: "पृथ्वी" },
      ta: { name: "கன்னி", english: "Virgo", symbol: "கன்னிப்பெண்", lord: "புதன்", element: "பூமி" },
      te: { name: "కన్య", english: "Virgo", symbol: "కన్యక", lord: "బుధుడు", element: "భూమి" },
      sa: { name: "कन्या", english: "Virgo", symbol: "कन्यका", lord: "बुधः", element: "पृथ्वी" }
    },
    Tula: {
      en: { name: "Tula", english: "Libra", symbol: "Scales", lord: "Shukra (Venus)", element: "Air" },
      hi: { name: "तुला", english: "Libra", symbol: "तराजू", lord: "शुक्र", element: "वायु" },
      ta: { name: "துலாம்", english: "Libra", symbol: "தராசு", lord: "சுக்கிரன்", element: "காற்று" },
      te: { name: "తులా", english: "Libra", symbol: "త్రాసు", lord: "శుక్రుడు", element: "వాయువు" },
      sa: { name: "तुला", english: "Libra", symbol: "तुलाधरः", lord: "शुक्रः", element: "वायुः" }
    },
    Vrischik: {
      en: { name: "Vrischik", english: "Scorpio", symbol: "Scorpion", lord: "Mangal (Mars)", element: "Water" },
      hi: { name: "वृश्चिक", english: "Scorpio", symbol: "बिच्छू", lord: "मंगल / केतु", element: "जल" },
      ta: { name: "விருச்சிகம்", english: "Scorpio", symbol: "தேள்", lord: "செவ்வாய்", element: "நீர்" },
      te: { name: "వృశ్చికం", english: "Scorpio", symbol: "తేలు", lord: "కుజుడు", element: "జలం" },
      sa: { name: "वृश्चिकः", english: "Scorpio", symbol: "अलिः (वृश्चिकः)", lord: "मङ्गलः", element: "जलम्" }
    },
    Dhanu: {
      en: { name: "Dhanu", english: "Sagittarius", symbol: "Archer", lord: "Guru (Jupiter)", element: "Fire" },
      hi: { name: "धनु", english: "Sagittarius", symbol: "धनुर्धारी", lord: "गुरु (बृहस्पति)", element: "अग्नि" },
      ta: { name: "தனுசு", english: "Sagittarius", symbol: "வில்லாளி", lord: "குரு", element: "நெருப்பு" },
      te: { name: "ధనుస్సు", english: "Sagittarius", symbol: "విలుకాడు", lord: "గురుడు", element: "అగ్ని" },
      sa: { name: "धनुः", english: "Sagittarius", symbol: "धनुर्धरः", lord: "गुरुः", element: "तेजः (अग्निः)" }
    },
    Makar: {
      en: { name: "Makar", english: "Capricorn", symbol: "Sea-Goat", lord: "Shani (Saturn)", element: "Earth" },
      hi: { name: "मकर", english: "Capricorn", symbol: "मकर (घड़ियाल)", lord: "शनि", element: "पृथ्वी" },
      ta: { name: "மகரம்", english: "Capricorn", symbol: "முதலை", lord: "சனி", element: "பூமி" },
      te: { name: "మకరం", english: "Capricorn", symbol: "మొసలి", lord: "శని", element: "భూమి" },
      sa: { name: "मकरः", english: "Capricorn", symbol: "नक्रः", lord: "शनिः", element: "पृथ्वी" }
    },
    Kumbh: {
      en: { name: "Kumbh", english: "Aquarius", symbol: "Water Bearer", lord: "Shani (Saturn)", element: "Air" },
      hi: { name: "कुंभ", english: "Aquarius", symbol: "घड़ा", lord: "शनि", element: "वायु" },
      ta: { name: "கும்பம்", english: "Aquarius", symbol: "குடம்", lord: "சனி", element: "காற்று" },
      te: { name: "కుంభం", english: "Aquarius", symbol: "కుండ", lord: "శని", element: "వాయువు" },
      sa: { name: "कुम्भः", english: "Aquarius", symbol: "घटः", lord: "शनिः", element: "वायुः" }
    },
    Meen: {
      en: { name: "Meen", english: "Pisces", symbol: "Two Fishes", lord: "Guru (Jupiter)", element: "Water" },
      hi: { name: "मीन", english: "Pisces", symbol: "मछलियां", lord: "गुरु (बृहस्पति)", element: "जल" },
      ta: { name: "மீனம்", english: "Pisces", symbol: "இரட்டை மீன்கள்", lord: "குரு", element: "நீர்" },
      te: { name: "మీనం", english: "Pisces", symbol: "చేపలు", lord: "గురుడు", element: "జలం" },
      sa: { name: "मीनः", english: "Pisces", symbol: "मत्स्यद्वयम्", lord: "गुरुः", element: "जलम्" }
    }
  },

  // Lucky Colors translations
  COLORS: {
    "Crimson Red": { hi: "गहरा लाल", ta: "அடர் சிவப்பு", te: "గాఢ ఎరుపు", sa: "शोणवर्णः" },
    "Bright Coral": { hi: "चमकदार मूंगा", ta: "பவள சிவப்பு", te: "ప్రకాశవంతమైన పగడం", sa: "विद्रुमवर्णः" },
    "Saffron": { hi: "केसरिया", ta: "காவி", te: "కేసరి రంగు", sa: "काषायवर्णः" },
    "Lotus Pink": { hi: "कमल गुलाबी", ta: "தாமரை இளஞ்சிவப்பு", te: "కమలం గులాబీ", sa: "पद्मपाटलवर्णः" },
    "Pure White": { hi: "शुद्ध श्वेत", ta: "தூய வெள்ளை", te: "స్వచ్ఛమైన తెలుపు", sa: "शुद्धश्वेतवर्णः" },
    "Pastel Green": { hi: "हल्का हरा", ta: "மெல்லிய பச்சை", te: "లేత ఆకుపచ్చ", sa: "कोमलहरितवर्णः" },
    "Emerald Green": { hi: "पन्ना हरा", ta: "மரகத பச்சை", te: "మరకత పచ్చ", sa: "मरकतहरितवर्णः" },
    "Light Yellow": { hi: "हल्का पीला", ta: "வெளிர் மஞ்சள்", te: "లేత పసుపు", sa: "कोमलपीतवर्णः" },
    "Cyan": { hi: "फिरोजी", ta: "சியான் நீலம்", te: "ఆకాశ నీలం", sa: "मयूरकण्ठवर्णः" },
    "Pearl White": { hi: "मोती जैसा श्वेत", ta: "முத்து வெள்ளை", te: "ముత్యపు తెలుపు", sa: "मौक्तिकश्वेतवर्णः" },
    "Silver": { hi: "रजत (चांदी)", ta: "வெள்ளி", te: "వెండి రంగు", sa: "रजतवर्णः" },
    "Sea Green": { hi: "समुद्री हरा", ta: "கடல் பச்சை", te: "సముద్రపు పచ్చ", sa: "सागरहरितवर्णः" },
    "Golden Amber": { hi: "स्वर्णिम अम्बर", ta: "தங்க அம்பர்", te: "బంగారు అంబర్", sa: "सुवर्णवर्णः" },
    "Royal Orange": { hi: "शाही नारंगी", ta: "அரச ஆரஞ்சு", te: "రాయల్ నారింజ", sa: "राजपिङ्गलवर्णः" },
    "Ruby Red": { hi: "माणिक्य लाल", ta: "மாணிக்க சிவப்பு", te: "మాణిక్యపు ఎరుపు", sa: "माणिक्यरक्तवर्णः" },
    "Olive Green": { hi: "जैतून हरा", ta: "ஆலிவ் பச்சை", te: "ఆలివ్ పచ్చ", sa: "जैतूनहरितवर्णः" },
    "Warm Beige": { hi: "हल्का बादामी", ta: "மெல்லிய பழுப்பு", te: "లేత గోధుమ రంగు", sa: "पिङ्गलबेजवर्णः" },
    "Sky Blue": { hi: "आसमानी नीला", ta: "ஆகாய நீலம்", te: "ఆకాశ నీలం", sa: "आकाशनीलवर्णः" },
    "Soft Cream": { hi: "कोमल क्रीम", ta: "மென்மையான கிரீம்", te: "మృదువైన క్రీమ్", sa: "दुग्धफेनवर्णः" },
    "Pastel Rose": { hi: "गुलाबी रोज", ta: "மெல்லிய ரோஜா", te: "గులాబీ రంగు", sa: "गुलाबपाटलवर्णः" },
    "Deep Maroon": { hi: "गहरा महरून", ta: "அடர் மெரூன்", te: "గాఢ మెరూన్", sa: "अतिलोहितवर्णः" },
    "Dark Rust": { hi: "गेरुआ", ta: "துரு பழுப்பு", te: "ముదురు తుప్పు రంగు", sa: "ताम्रवर्णः" },
    "Blood Red": { hi: "रक्त लाल", ta: "இரத்த சிவப்பு", te: "రక్తపు ఎరుపు", sa: "रक्तवर्णः" },
    "Bright Saffron": { hi: "दीप्त केसरिया", ta: "ஒளிரும் காவி", te: "ప్రకాశవంతమైన కేసరి", sa: "दीप्तकाषायवर्णः" },
    "Golden Yellow": { hi: "सुनहरा पीला", ta: "தங்க மஞ்சள்", te: "బంగారు పసుపు", sa: "सुवर्णपीतवर्णः" },
    "Royal Purple": { hi: "शाही बैंगनी", ta: "அரச ஊதா", te: "రాయల్ పర్పుల్", sa: "राजधूम्रवर्णः" },
    "Steel Grey": { hi: "इस्पात धूसर", ta: "எஃகு சாம்பல்", te: "ఉక్కు బూడిద", sa: "अयोधूसरवर्णः" },
    "Navy Blue": { hi: "गहरा नीला", ta: "நேவி நீலம்", te: "ముదురు నీలం", sa: "गभीरनीलवर्णः" },
    "Charcoal": { hi: "कालिमा धूसर", ta: "கரி நிறம்", te: "బొగ్గు రంగు", sa: "अङ्गारवर्णः" },
    "Electric Blue": { hi: "चमकीला नीला", ta: "மின்சார நீலம்", te: "మెరుపు నీలం", sa: "विद्युत्नीलवर्णः" },
    "Deep Violet": { hi: "गहरा जामुनी", ta: "அடர் ஊதா", te: "గాఢ వైలెట్", sa: "अतिनीललोहितवर्णः" },
    "Pale Yellow": { hi: "हल्का पीला", ta: "வெளிர் மஞ்சள்", te: "లేత పసుపు", sa: "पाण्डुपीतवर्णः" },
    "Seafoam Green": { hi: "झागदार हरा", ta: "கடல்நுரை பச்சை", te: "సీఫోమ్ పచ్చ", sa: "फेनहरितवर्णः" },
    "Lavender": { hi: "लैवेंडर", ta: "லாவெண்டர்", te: "లావెండర్", sa: "सिन्धुवारवर्णः" }
  },

  // General UI Strings dictionary
  STRINGS: {
    en: {
      brand_badge: "Jyotish AI • Vedic Wisdom",
      app_title: "Vedic Astrology Rashi Fal",
      app_subtitle: "Grounded, realistic, and uplifting planetary insights curated according to ancient Moon Sign (Chandra Rashi) traditions.",
      tab_horoscope: "✨ Rashi Fal (Horoscope)",
      tab_compatibility: "💫 Rashi Compatibility",
      tab_dob_finder: "🧭 DOB Rashi Finder",
      tab_palmistry: "✋ Hast Rekha (Palmistry)",
      section_select_rashi: "1. Select Your Moon Sign (Rashi)",
      twelve_signs_badge: "12 Signs",
      label_timeframe: "Timeframe",
      tf_daily: "Daily",
      tf_weekly: "Weekly",
      tf_monthly: "Monthly",
      label_date: "Prediction Date",
      btn_today: "Today",
      label_intent: "Focus Area (Intent)",
      intent_all: "All Pillars",
      intent_career: "💼 Career",
      intent_love: "❤️ Love",
      intent_finance: "💰 Finance",
      intent_health: "🌿 Health",
      btn_get_horoscope: "Consult Celestial Alignment",
      btn_consulting: "Consulting Stars...",
      view_visual: "Visual Reading",
      view_json: "Strict JSON",
      copy_json: "Copy JSON",
      copied: "Copied!",
      overview_heading: "Cosmic Overview",
      pillars_heading: "4 Pillars of Life",
      pillar_career: "Career & Ambition",
      pillar_love: "Love & Relationships",
      pillar_finance: "Wealth & Finance",
      pillar_health: "Health & Energy",
      auspicious_heading: "Auspicious Alignments",
      lucky_color_label: "Lucky Color",
      lucky_number_label: "Lucky Number",
      tip_heading: "Vedic Wisdom & Guidance",
      listen_horoscope: "Listen to Reading",
      listening_label: "Reading Out Loud...",
      compat_title: "Rashi Compatibility Harmonizer",
      compat_desc: "Analyze elemental, planetary, and emotional harmony between two Moon signs according to classical Vedic principles.",
      compat_rashi1_label: "First Sign (Rashi 1)",
      compat_rashi2_label: "Second Sign (Rashi 2)",
      btn_check_compat: "Analyze Compatibility",
      analyzing_compat: "Analyzing Harmony...",
      dob_title: "Date of Birth Rashi Finder",
      dob_desc: "Don't know your Moon sign? Enter your date of birth to calculate your approximate Vedic Moon Sign ingress.",
      dob_label: "Your Date of Birth",
      btn_infer_dob: "Infer Rashi",
      calculating_dob: "Calculating Ingress...",
      palm_title: "Hast Rekha Vidya — Ancient Vedic Palmistry",
      palm_subtitle: "Unlock insights etched in your hands through sacred Samudrika Shastra. Interactive palm line & mount analysis.",
      btn_scan_palm: "Scan Palm Now (Camera / Photo)",
      palm_camera_badge: "📷 Camera AI Vision",
      palm_camera_title: "Scan Palm with Camera",
      palm_camera_desc: "Hold your palm to the camera or upload a photo. Our vision engine maps your lines and mounts instantly to reveal your Vedic destiny.",
      palm_step1_title: "1. Identify Your Hand Type (Hast Prakar)",
      palm_step1_desc: "Choose the hand shape closest to yours. This determines your elemental constitution and base personality archetype.",
      palm_step2_title: "2. Describe Your Palm Lines (Hast Rekhayen)",
      palm_step2_desc: "Hover over lines on the diagram to highlight them. Select the description that best matches each line on your palm.",
      palm_step3_title: "3. Assess Your Palm Mounts (Hast Parvat)",
      palm_step3_desc: "Press the fleshy pads of your palm. Select whether each planetary mount feels prominent, flat, or overdeveloped.",
      btn_read_palm: "Read My Palm",
      btn_palm_reset: "Reset",
      palm_reading_title: "✋ Your Hast Rekha Reading",
      palm_hand_analysis: "🖐 Hand Type Analysis",
      palm_overall_synthesis: "Overall Palm Synthesis",
      palm_lines_title: "📜 Palm Line Readings",
      palm_copy_reading: "📋 Copy Reading",
      palm_copied: "✓ Copied!",
      palm_scan_title: "Hast Rekha Scanner",
      palm_scan_sub: "Vedic Palm Analysis via AI Vision",
      palm_how_to_scan: "How to Scan Your Palm",
      palm_scan_inst1: "Hold your dominant hand open, palm facing the camera",
      palm_scan_inst2: "Ensure good lighting — natural light or bright lamp works best",
      palm_scan_inst3: "Keep your palm flat and steady, fingers slightly apart",
      palm_scan_inst4: "Center your palm within the frame guide",
      palm_btn_open_cam: "Open Camera",
      palm_or: "or",
      palm_btn_upload: "Upload Palm Photo",
      palm_frame_label: "Place palm here",
      palm_scan_tip: "Center your open palm in the frame and hold steady",
      palm_scan_step1: "📷 Capturing palm image...",
      palm_scan_step2: "🔍 Mapping palm regions...",
      palm_scan_step3: "📐 Analyzing line patterns...",
      palm_scan_step4: "⛰️ Reading mount energies...",
      palm_scan_step5: "✨ Consulting Hast Rekha Vidya...",
      palm_scan_done_title: "Palm Analysis Complete",
      palm_scan_done_sub: "Your Hast Rekha reading is ready",
      palm_btn_apply: "Apply & Generate Full Reading",
      palm_btn_rescan: "↺ Scan Again",
      label_sign_type: "Chart Perspective (Sign Basis)",
      st_chandra: "🌙 Chandra (Moon)",
      st_lagna: "🌅 Lagna (Ascendant)",
      st_surya: "☀️ Surya (Sun)",
      dob_time_label: "Birth Time (Optional for Lagna)",
      lagna_result_title: "🌅 Lagna (Ascendant Sign)",
      surya_result_title: "☀️ Surya Rashi (Sun Sign)",
      chandra_result_title: "🌙 Chandra Rashi (Moon Sign)",
      footer_made_by: "Made by Arjit Jaiswal",
      footer_disclaimer: "Vedic Jyotish insights are rooted in Moon Sign, Lagna, and Sun transit analysis. Meant for mindful personal reflection.",
      lang_label: "Language"
    },

    hi: {
      brand_badge: "ज्योतिष AI • वैदिक ज्ञान",
      app_title: "वैदिक ज्योतिष राशि फल",
      app_subtitle: "प्राचीन चंद्र राशि परंपरा के अनुसार तैयार की गई यथार्थवादी, प्रमाणिक एवं कल्याणकारी ग्रह गणना।",
      tab_horoscope: "✨ राशि फल (दैनिक)",
      tab_compatibility: "💫 राशि अनुकूलता (मैत्री)",
      tab_dob_finder: "🧭 जन्म तिथि से राशि",
      tab_palmistry: "✋ हस्तरेखा (सामुद्रिक)",
      section_select_rashi: "1. अपनी चंद्र राशि का चयन करें",
      twelve_signs_badge: "12 राशियां",
      label_timeframe: "समय अवधि",
      tf_daily: "दैनिक",
      tf_weekly: "साप्ताहिक",
      tf_monthly: "मासिक",
      label_date: "फलित तिथि",
      btn_today: "आज",
      label_intent: "मुख्य विषय (प्राथमिकता)",
      intent_all: "सभी 4 स्तम्भ",
      intent_career: "💼 करियर",
      intent_love: "❤️ प्रेम व संबंध",
      intent_finance: "💰 वित्त व धन",
      intent_health: "🌿 स्वास्थ्य",
      btn_get_horoscope: "ग्रह स्थिति व राशिफल देखें",
      btn_consulting: "ग्रहों की गणना जारी है...",
      view_visual: "विस्तृत विश्लेषण",
      view_json: "JSON डेटा",
      copy_json: "JSON कॉपी करें",
      copied: "कॉपी हो गया!",
      overview_heading: "दैनिक ग्रह स्थिति एवं सार",
      pillars_heading: "जीवन के 4 प्रमुख स्तम्भ",
      pillar_career: "करियर एवं लक्ष्य",
      pillar_love: "प्रेम एवं संबंध",
      pillar_finance: "धन एवं आर्थिक स्थिति",
      pillar_health: "स्वास्थ्य एवं जीवन शक्ति",
      auspicious_heading: "शुभ ज्योतिषीय तत्व",
      lucky_color_label: "शुभ रंग",
      lucky_number_label: "शुभ अंक",
      tip_heading: "वैदिक परामर्श एवं उपाय",
      listen_horoscope: "राशिफल सुनें",
      listening_label: "वाचन जारी है...",
      compat_title: "राशि मैत्री एवं सामंजस्य परीक्षण",
      compat_desc: "शास्त्रीय वैदिक सिद्धांतों के अनुसार दो चंद्र राशियों के मध्य तत्व, ग्रह और भावनात्मक अनुकूलता का विश्लेषण करें।",
      compat_rashi1_label: "प्रथम राशि (राशि 1)",
      compat_rashi2_label: "द्वितीय राशि (राशि 2)",
      btn_check_compat: "अनुकूलता की गणना करें",
      analyzing_compat: "सामंजस्य का विश्लेषण जारी है...",
      dob_title: "जन्म तिथि से राशि निर्धारण",
      dob_desc: "क्या आपको अपनी चंद्र राशि नहीं पता? अपनी जन्म तिथि दर्ज करके अपनी वैदिक चंद्र राशि का अनुमान लगाएं।",
      dob_label: "आपकी जन्म तिथि",
      btn_infer_dob: "राशि जानें",
      calculating_dob: "राशि की गणना जारी है...",
      palm_title: "हस्तरेखा विद्या — प्राचीन वैदिक सामुद्रिक शास्त्र",
      palm_subtitle: "सामुद्रिक शास्त्र के अनुसार अपनी हथेली की रेखाओं एवं पर्वतों का संपूर्ण विश्लेषण प्राप्त करें।",
      btn_scan_palm: "हथेली स्कैन करें (कैमरा / फोटो)",
      palm_camera_badge: "📷 कैमरा AI विज़न",
      palm_camera_title: "कैमरा से हथेली स्कैन करें",
      palm_camera_desc: "अपनी हथेली को कैमरा के सामने रखें या फोटो अपलोड करें। हमारा विज़न इंजन आपकी रेखाओं और पर्वतों का विश्लेषण कर भाग्य उजागर करता है।",
      palm_step1_title: "1. अपने हस्त प्रकार की पहचान करें (हस्त प्रकार)",
      palm_step1_desc: "अपनी हथेली के आकार से मेल खाता विकल्प चुनें। यह आपके मूल तत्व और व्यक्तित्व का निर्धारण करता है।",
      palm_step2_title: "2. अपनी हथेली की रेखाओं का विवरण दें (हस्त रेखाएं)",
      palm_step2_desc: "चित्र की रेखाओं पर माउस लाएं या अपनी हथेली की रेखाओं से मेल खाती सही स्थिति का चयन करें।",
      palm_step3_title: "3. अपनी हथेली के पर्वतों का आकलन करें (हस्त पर्वत)",
      palm_step3_desc: "अपनी हथेली के पर्वतों को स्पर्श कर देखें। चुनें कि कौन सा ग्रह पर्वत उन्नत (उभरा), समतल या अत्यधिक विकसित है।",
      btn_read_palm: "हस्तरेखा फलित देखें",
      btn_palm_reset: "पुनः सेट करें",
      palm_reading_title: "✋ आपका संपूर्ण हस्तरेखा फलित",
      palm_hand_analysis: "🖐 हस्त प्रकार विश्लेषण",
      palm_overall_synthesis: "सम्पूर्ण हथेली का सार एवं निष्कर्ष",
      palm_lines_title: "📜 प्रमुख हस्त रेखाओं का फल",
      palm_mounts_title: "⛰️ नवग्रह पर्वतों का प्रभाव",
      palm_remedies_title: "🙏 वैदिक उपाय एवं परामर्श",
      label_sign_type: "राशि दृष्टिकोण (आधार)",
      st_chandra: "🌙 चंद्र राशि (Moon)",
      st_lagna: "🌅 लग्न (Ascendant)",
      st_surya: "☀️ सूर्य राशि (Sun)",
      dob_time_label: "जन्म समय (लग्न हेतु)",
      lagna_result_title: "🌅 लग्न (उदय राशि)",
      surya_result_title: "☀️ सूर्य राशि",
      chandra_result_title: "🌙 चंद्र राशि (जन्म राशि)",
      footer_made_by: "Made by Arjit Jaiswal",
      footer_disclaimer: "वैदिक ज्योतिष फल चंद्र राशि, लग्न एवं सूर्य गोचर गणना पर आधारित है। यह व्यक्तिगत मार्गदर्शन एवं आत्म-मंथन हेतु है।",
      lang_label: "भाषा"
    },

    ta: {
      brand_badge: "ஜோதிட AI • வேத ஞானம்",
      app_title: "வேத ஜோதிடம் ராசி பலன்",
      app_subtitle: "பண்டைய சந்திர ராசி பாரம்பரியத்தின்படி கணிக்கப்பட்ட துல்லியமான, நம்பிக்கையூட்டும் கிரக பலன்கள்.",
      tab_horoscope: "✨ ராசி பலன் (தினசரி)",
      tab_compatibility: "💫 ராசி பொருத்தம்",
      tab_dob_finder: "🧭 பிறந்த தேதி ராசி",
      tab_palmistry: "✋ கைரேகை ஜோதிடம்",
      section_select_rashi: "1. உங்கள் சந்திர ராசியைத் தேர்ந்தெடுக்கவும்",
      twelve_signs_badge: "12 ராசிகள்",
      label_timeframe: "கால அளவு",
      tf_daily: "தினசரி",
      tf_weekly: "வாராந்திர",
      tf_monthly: "மாதாந்திர",
      label_date: "கணிப்பு தேதி",
      btn_today: "இன்று",
      label_intent: "முதன்மை கவனம்",
      intent_all: "அனைத்து துறைகள்",
      intent_career: "💼 தொழில்",
      intent_love: "❤️ அன்பு & காதல்",
      intent_finance: "💰 நிதி & செல்வம்",
      intent_health: "🌿 ஆரோக்கியம்",
      btn_get_horoscope: "கிரக அமைப்பை & பலனை காண்க",
      btn_consulting: "கிரகங்கள் கணிக்கப்படுகின்றன...",
      view_visual: "பார்வை வாசிப்பு",
      view_json: "JSON தரவு",
      copy_json: "JSON நகலெடு",
      copied: "நகலெடுக்கப்பட்டது!",
      overview_heading: "கிரக நிலவர மேலோட்டம்",
      pillars_heading: "வாழ்க்கையின் 4 தூண்கள்",
      pillar_career: "தொழில் மற்றும் வளர்ச்சி",
      pillar_love: "அன்பு மற்றும் உறவுகள்",
      pillar_finance: "செல்வம் மற்றும் சேமிப்பு",
      pillar_health: "உடல் நலம் மற்றும் ஆற்றல்",
      auspicious_heading: "சுப கிரக சேர்க்கைகள்",
      lucky_color_label: "அதிர்ஷ்ட நிறம்",
      lucky_number_label: "அதிர்ஷ்ட எண்",
      tip_heading: "வேத வழிகாட்டுதல் & ஆலோசனை",
      listen_horoscope: "பலனைக் கேளுங்கள்",
      listening_label: "வாசிக்கப்படுகிறது...",
      compat_title: "ராசி பொருத்தம் & இணக்கத்தன்மை",
      compat_desc: "சாஸ்திர முறைப்படி இரு சந்திர ராசிகளுக்கிடையேயான கிரக மற்றும் குண பொருத்தத்தை அறியவும்.",
      compat_rashi1_label: "முதல் ராசி (ராசி 1)",
      compat_rashi2_label: "இரண்டாவது ராசி (ராசி 2)",
      btn_check_compat: "பொருத்தத்தை ஆராயுங்கள்",
      analyzing_compat: "பொருத்தம் கணிக்கப்படுகிறது...",
      dob_title: "பிறந்த தேதி மூலம் ராசி கண்டறிதல்",
      dob_desc: "உங்கள் சந்திர ராசி தெரியவில்லையா? பிறந்த தேதியை உள்ளிட்டு வேத சந்திர ராசியை அறியவும்.",
      dob_label: "உங்கள் பிறந்த தேதி",
      btn_infer_dob: "ராசியை அறியவும்",
      calculating_dob: "ராசி கணக்கிடப்படுகிறது...",
      palm_title: "கைரேகை சாஸ்திரம் — பண்டைய வேத ஜோதிடம்",
      palm_subtitle: "சாமுத்ரிகா சாஸ்திரத்தின்படி உங்கள் கைரேகைகள் மற்றும் கிரக மேடுகளின் நுண்ணறிவை அறியவும்.",
      btn_scan_palm: "கைரேகை ஸ்கேன் செய் (கேமரா / புகைப்படம்)",
      palm_camera_badge: "📷 கேமரா AI தரிசனம்",
      palm_camera_title: "கேமரா மூலம் கைரேகை ஸ்கேன் செய்",
      palm_camera_desc: "உங்கள் கையை கேமராவிற்கு முன் பிடி அல்லது புகைப்படத்தை பதிவேற்று. எங்கள் AI இன்ஜின் உங்கள் கைரேகைகளை ஆராய்ந்து பலன் தரும்.",
      palm_step1_title: "1. உங்கள் கை வகையைக் கண்டறியவும் (ஹஸ்த பிரகாரம்)",
      palm_step1_desc: "உங்கள் கை வடிவத்திற்கு பொருத்தமானதை தேர்ந்தெடுக்கவும். இது உங்கள் அடிப்படை குணத்தை தீர்மானிக்கிறது.",
      palm_step2_title: "2. உங்கள் கைரேகைகளை விவரிக்கவும் (ஹஸ்த ரேகைகள்)",
      palm_step2_desc: "வரைபடத்தில் உள்ள ரேகைகளை கிளிக் செய்து உங்கள் கையில் உள்ளவாறு தேர்வு செய்யவும்.",
      palm_step3_title: "3. உங்கள் கிரக மேடுகளை மதிப்பிடுங்கள் (ஹஸ்த பர்வதம்)",
      palm_step3_desc: "உங்கள் கை மேடுகளை தொட்டு பார்த்து அவை உயர்ந்ததா, தட்டையானதா அல்லது அதிகமாக வளர்ந்ததா எனத் தேர்ந்தெடுக்கவும்.",
      btn_read_palm: "கைரேகை பலன் காண்க",
      btn_palm_reset: "மீட்டமை",
      palm_reading_title: "✋ உங்கள் கைரேகை ஜோதிட பலன்",
      palm_hand_analysis: "🖐 கை வகை பகுப்பாய்வு",
      palm_overall_synthesis: "ஒட்டுமொத்த கைரேகை தொகுப்பு",
      palm_lines_title: "📜 முக்கிய கைரேகை பலன்கள்",
      palm_mounts_title: "⛰️ கிரக மேடுகளின் பலன்கள்",
      palm_remedies_title: "🙏 வேத பரிகாரங்கள் & வழிகாட்டுதல்",
      palm_copy_reading: "📋 பலனை நகலெடு",
      palm_copied: "✓ நகலெடுக்கப்பட்டது!",
      footer_made_by: "Made by Arjit Jaiswal",
      footer_disclaimer: "வேத ஜோதிட பலன்கள் சந்திர ராசி பெயர்ச்சி அடிப்படையிலானவை. விழிப்புணர்விற்காக மட்டுமே.",
      lang_label: "மொழி"
    },

    te: {
      brand_badge: "జ్యోతిష AI • వేద జ్ఞానం",
      app_title: "వేద జ్యోతిష్యం రాశి ఫలాలు",
      app_subtitle: "ప్రాచీన చంద్ర రాశి సంప్రదాయాల ప్రకారం అందించబడిన వాస్తవిక, శుభప్రదమైన గ్రహ ఫలితాలు.",
      tab_horoscope: "✨ రాశి ఫలాలు (దినఫలాలు)",
      tab_compatibility: "💫 రాశి పొంతన (మైత్రి)",
      tab_dob_finder: "🧭 పుట్టిన తేదీ ద్వారా రాశి",
      tab_palmistry: "✋ హస్తరేఖ (సాముద్రికం)",
      section_select_rashi: "1. మీ చంద్ర రాశిని ఎంచుకోండి",
      twelve_signs_badge: "12 రాశులు",
      label_timeframe: "సమయ వ్యవధి",
      tf_daily: "రోజువారీ",
      tf_weekly: "వారపు",
      tf_monthly: "నెలవారీ",
      label_date: "ఫలిత తేదీ",
      btn_today: "ఈరోజు",
      label_intent: "దృష్టి సారించే రంగం",
      intent_all: "అన్ని రంగాలు",
      intent_career: "💼 కెరీర్ & ఉద్యోగం",
      intent_love: "❤️ ప్రేమ & బంధాలు",
      intent_finance: "💰 ధనం & ఆర్థికం",
      intent_health: "🌿 ఆరోగ్యం",
      btn_get_horoscope: "గ్రహాల స్థితి & రాశిఫలాలు చూడండి",
      btn_consulting: "నక్షత్రాల గణన జరుగుతోంది...",
      view_visual: "సమగ్ర విశ్లేషణ",
      view_json: "JSON డేటా",
      copy_json: "JSON కాపీ చేయండి",
      copied: "కాపీ అయ్యింది!",
      overview_heading: "గ్రహాల స్థానాల విశ్లేషణ",
      pillars_heading: "జీవితంలోని 4 ముఖ్య రంగాలు",
      pillar_career: "కెరీర్ మరియు లక్ష్యాలు",
      pillar_love: "ప్రేమ మరియు బంధాలు",
      pillar_finance: "ధనం మరియు ఆర్థిక పరిస్థితి",
      pillar_health: "ఆరోగ్యం మరియు చైతన్యం",
      auspicious_heading: "శుభకరమైన అంశాలు",
      lucky_color_label: "అదృష్ట రంగు",
      lucky_number_label: "అదృష్ట సంఖ్య",
      tip_heading: "వేద మార్గదర్శకం & పరిహారం",
      listen_horoscope: "ఫలితాలు వినండి",
      listening_label: "చదవడం జరుగుతోంది...",
      compat_title: "రాశి పొంతన & అనుకూలత పరిశీలన",
      compat_desc: "శాస్త్రీయ వేద నియమాల ప్రకారం రెండు చంద్ర రాశుల మధ్య గల సామరస్యాన్ని విశ్లేషించండి.",
      compat_rashi1_label: "మొదటి రాశి (రాశి 1)",
      compat_rashi2_label: "రెండవ రాశి (రాశి 2)",
      btn_check_compat: "పొంతనను లెక్కించండి",
      analyzing_compat: "సామరస్యాన్ని గణిస్తున్నారు...",
      dob_title: "పుట్టిన తేదీ ఆధారంగా రాశి నిర్ణయం",
      dob_desc: "మీ చంద్ర రాశి మీకు తెలియదా? పుట్టిన తేదీ నమోదు చేసి మీ వేద రాశిని తెలుసుకోండి.",
      dob_label: "మీ పుట్టిన తేదీ",
      btn_infer_dob: "రాశిని తెలుసుకోండి",
      calculating_dob: "రాశి లెక్కిస్తున్నారు...",
      palm_title: "హస్తరేఖ శాస్త్రం — ప్రాచీన వేద సాముద్రికం",
      palm_subtitle: "సాముద్రిక శాస్త్రం ప్రకారం మీ చేతి రేఖలు మరియు గ్రహ పర్వతాల సంపూర్ణ విశ్లేషణ పొందండి.",
      btn_scan_palm: "చేతిని స్కాన్ చేయండి (కెమెరా / ఫోటో)",
      palm_camera_badge: "📷 కెమెరా AI విజన్",
      palm_camera_title: "కెమెరాతో చేతిని స్కాన్ చేయండి",
      palm_camera_desc: "మీ చేతిని కెమెరా ముందు ఉంచండి లేదా ఫోటో అప్‌లోడ్ చేయండి. మా విజన్ ఇంజిన్ మీ చేతి రేఖలను విశ్లేషించి జాతక ఫలితాలు చెబుతుంది.",
      palm_step1_title: "1. మీ చేతి రకాన్ని గుర్తించండి (హస్త ప్రకారము)",
      palm_step1_desc: "మీ చేతి ఆకారానికి సరిపోయే రకాన్ని ఎంచుకోండి. ఇది మీ వ్యక్తిత్వాన్ని నిర్ణయిస్తుంది.",
      palm_step2_title: "2. మీ చేతి రేఖల వివరణ ఇవ్వండి (హస్త రేఖలు)",
      palm_step2_desc: "రేఖాచిత్రంలో రేఖలను పరిశీలించి మీ చేతి రేఖలకు సరిపోయే వికల్పాన్ని ఎంచుకోండి.",
      palm_step3_title: "3. మీ చేతి పర్వతాలను పరిశీలించండి (హస్త పర్వతాలు)",
      palm_step3_desc: "మీ చేతి గ్రహ పర్వతాలను స్పర్శించి అవి ఎత్తుగా, సమతలంగా లేదా ఎక్కువగా పెరిగి ఉన్నాయో ఎంచుకోండి.",
      btn_read_palm: "హస్తరేఖ ఫలితం చూడండి",
      btn_palm_reset: "రీసెట్",
      palm_reading_title: "✋ మీ సంపూర్ణ హస్తరేఖ జాతక ఫలితం",
      palm_hand_analysis: "🖐 చేతి రకం విశ్లేషణ",
      palm_overall_synthesis: "మొత్తం హస్తరేఖ సారాంశం",
      palm_lines_title: "📜 ముఖ్యమైన హస్తరేఖల ఫలితాలు",
      palm_mounts_title: "⛰️ గ్రహ పర్వతాల ప్రభావం",
      palm_remedies_title: "🙏 వేద పరిహారాలు & మార్గదర్శకం",
      palm_copy_reading: "📋 ఫలితం కాపీ చేయండి",
      palm_copied: "✓ కాపీ అయ్యింది!",
      footer_made_by: "Made by Arjit Jaiswal",
      footer_disclaimer: "వేద జ్యోతిష ఫలితాలు చంద్ర రాశి గోచార విశ్లేషణపై ఆధారపడి ఉంటాయి. వ్యక్తిగత పరిశీలనకు మాత్రమే.",
      lang_label: "భాష"
    },

    sa: {
      brand_badge: "ज्योतिष AI • वैदिकज्ञानम्",
      app_title: "वैदिकज्योतिषं राशिफलम्",
      app_subtitle: "प्राचीनानां चन्द्रराशिपरम्पराणाम् अनुसारं सज्जीकृतानि वास्तविकाणि मङ्गलमयानि च ग्रहफलानि।",
      tab_horoscope: "✨ राशिफलम् (होराशास्त्रम्)",
      tab_compatibility: "💫 राशिमैत्री (सामञ्जस्यम्)",
      tab_dob_finder: "🧭 जन्मदिनाङ्केन राशिः",
      tab_palmistry: "✋ हस्तरेखा (सामुद्रिकम्)",
      section_select_rashi: "1. स्वचन्द्रराशिं वृणोतु",
      twelve_signs_badge: "द्वादश राशयः",
      label_timeframe: "कालखण्डः",
      tf_daily: "दैनिकम्",
      tf_weekly: "साप्ताहिकम्",
      tf_monthly: "मासिकम्",
      label_date: "फलिततिथिः",
      btn_today: "अद्य",
      label_intent: "प्रमुखविषयः",
      intent_all: "सर्वे ४ स्तम्भाः",
      intent_career: "💼 वृत्तिः उद्योगश्च",
      intent_love: "❤️ प्रेम सम्बन्धश्च",
      intent_finance: "💰 धनं वित्तं च",
      intent_health: "🌿 स्वास्थ्यम्",
      btn_get_horoscope: "ग्रहस्थितिं राशिफलं च पश्यतु",
      btn_consulting: "ग्रहाणां गणना क्रियते...",
      view_visual: "विस्तृतविमर्शः",
      view_json: "JSON रूपम्",
      copy_json: "JSON प्रतिलिख्यताम्",
      copied: "प्रतिलिखितम्!",
      overview_heading: "समग्रग्रहस्थितिसारः",
      pillars_heading: "जीवनस्य चत्वारः स्तम्भाः",
      pillar_career: "वृत्तिः महत्त्वाकांक्षा च",
      pillar_love: "प्रेम सम्बन्धाश्च",
      pillar_finance: "धनं वित्तव्यवस्था च",
      pillar_health: "स्वास्थ्यं प्राणशक्तिश्च",
      auspicious_heading: "शुभाः ग्रहानुकूलताः",
      lucky_color_label: "शुभवर्णः",
      lucky_number_label: "शुभाङ्कः",
      tip_heading: "वैदिकमार्गदर्शनम् उपदेशश्च",
      listen_horoscope: "राशिफलं शृणोतु",
      listening_label: "पठनं प्रचलति...",
      compat_title: "राशिमैत्रीसामञ्जस्यपरीक्षणम्",
      compat_desc: "शास्त्रीयवैदिकसिद्धान्तानुसारं द्वयोः चन्द्रराश्योः तत्त्वग्रहसामञ्जस्यस्य विमर्शं कुरुत।",
      compat_rashi1_label: "प्रथमा राशिः (१)",
      compat_rashi2_label: "द्वितीया राशिः (२)",
      btn_check_compat: "सामञ्जस्यं परीक्षताम्",
      analyzing_compat: "सामञ्जस्यविमर्शः प्रचलति...",
      dob_title: "जन्मदिनाङ्कात् राशिनिर्धारणम्",
      dob_desc: "किं भवान् स्वचन्द्रराशिं न जानाति? जन्मदिनाङ्कं प्रविष्टं कृत्वा स्ववैदिकराशिं निर्धारयतु।",
      dob_label: "भवतः जन्मदिनाङ्कः",
      btn_infer_dob: "राशिं निर्धारयतु",
      calculating_dob: "राशेः गणना प्रचलति...",
      palm_title: "हस्तरेखाविद्या — पुरातनवैदिकसामुद्रिकशास्त्रम्",
      palm_subtitle: "सामुद्रिकशास्त्रानुसारं स्वहस्ततलरूपरेखापर्वतानां रहस्यं विजानातु।",
      btn_scan_palm: "हस्ततलं परीक्षताम् (यन्त्रेण / चित्रेण)",
      palm_camera_badge: "📷 यन्त्र AI दृष्टिः",
      palm_camera_title: "यन्त्रेण हस्ततलं परीक्षताम्",
      palm_camera_desc: "स्वहस्ततलं यन्त्रस्य पुरतः स्थापयतु चित्रं वा प्रेषयतु। अस्मत् विज़न-इञ्जनं भवतः रेखापर्वतानां विश्लेषणं कृत्वा भाग्यं प्रकाशयति।",
      palm_step1_title: "1. स्वहस्तप्रकारं विजानातु (हस्तप्रकारः)",
      palm_step1_desc: "स्वहस्ततलरूपानुसारं प्रकारं वृणोतु। एतेन भवतः मूलतत्त्वस्य व्यक्तित्वस्य च निर्धारणं भवति।",
      palm_step2_title: "2. स्वहस्तरेखाणां विवरणं ददातु (हस्तरेखाः)",
      palm_step2_desc: "चित्रे रेखाः दृष्ट्वा स्वहस्तरेखाभिः सह समानां स्थितिं वृणोतु।",
      palm_step3_title: "3. स्वहस्तपर्वतानां परीक्षणं करोतु (हस्तपर्वताः)",
      palm_step3_desc: "स्वहस्तस्य पर्वतान् स्पृष्ट्वा ते उन्नताः, समाः, अतीवोन्नताः वा इति वृणोतु।",
      btn_read_palm: "हस्तरेखाफलं पश्यतु",
      btn_palm_reset: "पुनः सेट करोतु",
      palm_reading_title: "✋ भवतः सम्पूर्णं हस्तरेखाफलम्",
      palm_hand_analysis: "🖐 हस्तप्रकारविमर्शः",
      palm_overall_synthesis: "समग्रहस्ततलसारः",
      palm_lines_title: "📜 प्रमुखहस्तरेखाणां फलम्",
      palm_mounts_title: "⛰️ ग्रहपर्वतानां प्रभावः",
      palm_remedies_title: "🙏 वैदिकोपायः मार्गदर्शनं च",
      palm_copy_reading: "📋 फलं प्रतिलिख्यताम्",
      palm_copied: "✓ प्रतिलिखितम्!",
      footer_made_by: "Made by Arjit Jaiswal",
      footer_disclaimer: "वैदिकज्योतिषफलानि चन्द्रराशिगोचारानुसारं कल्पितानि। आत्मपरीक्षणार्थमेव प्रयुञ्जीत।",
      lang_label: "भाषा"
    }
  },

  /**
   * Initialize i18n
   */
  init() {
    const saved = localStorage.getItem("vedic_astrology_lang");
    if (saved && this.LANGUAGES[saved]) {
      this.currentLang = saved;
    } else {
      this.currentLang = "en";
    }
    this.applyLanguage(this.currentLang);
  },

  /**
   * Set and apply language
   */
  setLanguage(langCode) {
    if (!this.LANGUAGES[langCode]) return;
    this.currentLang = langCode;
    localStorage.setItem("vedic_astrology_lang", langCode);
    this.applyLanguage(langCode);

    // Dispatch event for other components (app.js, voiceAssistant.js, palmScan.js)
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang: langCode } }));
  },

  /**
   * Apply language to DOM
   */
  applyLanguage(lang) {
    const dict = this.STRINGS[lang] || this.STRINGS.en;
    document.documentElement.lang = lang;

    // Update all elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Update buttons in language selector
    document.querySelectorAll(".lang-pill").forEach((btn) => {
      if (btn.dataset.lang === lang) {
        btn.classList.add("active");
        btn.setAttribute("aria-checked", "true");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-checked", "false");
      }
    });
  },

  /**
   * Get localized string for a key
   */
  t(key) {
    const dict = this.STRINGS[this.currentLang] || this.STRINGS.en;
    return dict[key] || this.STRINGS.en[key] || key;
  },

  /**
   * Get localized Rashi metadata
   */
  getRashi(rashiKey) {
    const r = this.RASHIS[rashiKey];
    if (!r) return null;
    return r[this.currentLang] || r.en;
  },

  /**
   * Translate color name
   */
  getColor(englishColor) {
    if (this.currentLang === "en") return englishColor;
    const c = this.COLORS[englishColor];
    if (c && c[this.currentLang]) return c[this.currentLang];
    return englishColor;
  },

  /**
   * Translate prediction object dynamically to current language
   */
  localizePrediction(data, lang = this.currentLang) {
    if (!data) return data;
    if (lang === "en") return data;

    const rashiMeta = this.RASHIS[data.rashi] ? this.RASHIS[data.rashi][lang] : null;
    const rashiName = rashiMeta ? rashiMeta.name : data.rashi;
    const luckyColor = this.getColor(data.lucky_color);

    // Return translated copy
    return {
      ...data,
      rashi_display: rashiName,
      lucky_color: luckyColor,
      // If the backend already provided translated text, preserve it; otherwise apply phrase templates
      overall: data[`overall_${lang}`] || this.translateSentence(data.overall, lang, "overall"),
      career: data[`career_${lang}`] || this.translateSentence(data.career, lang, "career"),
      love: data[`love_${lang}`] || this.translateSentence(data.love, lang, "love"),
      finance: data[`finance_${lang}`] || this.translateSentence(data.finance, lang, "finance"),
      health: data[`health_${lang}`] || this.translateSentence(data.health, lang, "health"),
      tip: data[`tip_${lang}`] || this.translateSentence(data.tip, lang, "tip")
    };
  },

  /**
   * Phrase template translator for astronomical terms and astrology predictions
   */
  translateSentence(text, lang, pillar) {
    if (!text || lang === "en") return text;

    // Rich multilingual prediction phrases mapped to concepts
    const DICTIONARY = {
      hi: {
        // Core words
        "favorable": "अनुकूल",
        "productive": "फलदायी एवं रचनात्मक",
        "momentum": "गति व प्रगति",
        "disciplined": "अनुशासित",
        "balance": "संतुलन",
        "confidence": "आत्मविश्वास",
        "harmony": "सामंजस्य व शांति",
        "patience": "धैर्य",
        "caution": "सतर्कता",
        "opportunity": "अवसर",
        "collaboration": "सहयोग",
        "clarity": "स्पष्टता",
        "vitality": "जीवन शक्ति व आरोग्य"
      },
      ta: {
        "favorable": "சாதகமானது",
        "productive": "ஆக்கப்பூர்வமானது",
        "momentum": "முன்னேற்றம்",
        "disciplined": "ஒழுக்கமான",
        "balance": "சமநிலை",
        "confidence": "நம்பிக்கை",
        "harmony": "அமைதி & இணக்கம்",
        "patience": "பொறுமை",
        "caution": "எச்சரிக்கை",
        "opportunity": "வாய்ப்பு",
        "collaboration": "ஒத்துழைப்பு",
        "clarity": "தெளிவு",
        "vitality": "ஆரோக்கியம்"
      },
      te: {
        "favorable": "అనుకూలమైనది",
        "productive": "ఫలప్రదమైనది",
        "momentum": "పురోగతి",
        "disciplined": "క్రమశిక్షణతో కూడిన",
        "balance": "సమతుల్యత",
        "confidence": "ఆత్మవిశ్వాసం",
        "harmony": "సామరస్యం",
        "patience": "ఓపిక",
        "caution": "జాగ్రత్త",
        "opportunity": "అవకాశం",
        "collaboration": "సహకారం",
        "clarity": "స్పష్టత",
        "vitality": "ఉత్సాహం & ఆరోగ్యం"
      },
      sa: {
        "favorable": "अनुकूलम्",
        "productive": "फलप्रदम्",
        "momentum": "प्रगतिः",
        "disciplined": "अनुशासितम्",
        "balance": "सन्तुलनम्",
        "confidence": "आत्मविश्वासः",
        "harmony": "सामञ्जस्यम्",
        "patience": "धैर्यम्",
        "caution": "सावधानी",
        "opportunity": "अवसरः",
        "collaboration": "सहयोगः",
        "clarity": "स्पष्टता",
        "vitality": "प्राणशक्तिः आरोग्यं च"
      }
    };

    // If pre-translated sentences are available in multilingual libraries, use them:
    if (this.FALLBACK_PILLARS[lang] && this.FALLBACK_PILLARS[lang][pillar]) {
      const options = this.FALLBACK_PILLARS[lang][pillar];
      // Pick based on simple hash of English text for consistency
      let hash = 0;
      for (let i = 0; i < text.length; i++) hash = (hash << 5) - hash + text.charCodeAt(i);
      return options[Math.abs(hash) % options.length];
    }

    return text;
  },

  // Fallback localized pillars for all 4 languages
  FALLBACK_PILLARS: {
    hi: {
      overall: [
        "आज का दिन अनुकूल एवं मानसिक स्पष्टता से परिपूर्ण रहेगा। ग्रहों की स्थिति आपको सकारात्मक निर्णय लेने में सहयोग करेगी।",
        "चंद्रमा का गोचर आपके आत्मविश्वास और कार्यक्षमता में वृद्धि करेगा। दिन का उपयोग प्राथमिकताओं को पूर्ण करने में करें।",
        "ग्रहों की गति संतुलन और शांति का संकेत दे रही है। धैर्यपूर्वक उठाए गए कदम दीर्घकालिक लाभ प्रदान करेंगे।"
      ],
      career: [
        "कार्यक्षेत्र में सहकर्मियों का सहयोग मिलेगा तथा नए विचारों को क्रियान्वित करने का उत्तम अवसर प्राप्त होगा।",
        "व्यावसायिक कार्यों में अनुशासन बनाए रखें। आपकी योजनाएं वरिष्ठ अधिकारियों द्वारा सराही जाएंगी।",
        "व्यापार एवं कार्यस्थल पर संवाद स्पष्ट रखें। नई जिम्मेदारियां मिलने के शुभ योग बन रहे हैं।"
      ],
      love: [
        "पारिवारिक जीवन एवं संबंधों में सौहार्द बना रहेगा। मधुर संवाद से परस्पर समझ और निकटता बढ़ेगी।",
        "सगे-संबंधियों व मित्रों के साथ सुखद समय व्यतीत होगा। अपनी भावनाओं को सहजता से व्यक्त करें।",
        "रिश्तों में सम्मान और विश्वास को प्राथमिकता दें। जीवनसाथी का पूर्ण सहयोग प्राप्त होगा।"
      ],
      finance: [
        "वित्तीय मामलों में संतुलन बना रहेगा। अनावश्यक व्यय से बचें और बचत की सुदृढ़ योजना बनाएं।",
        "आर्थिक दृष्टिकोण से दिन स्थिर है। सोच-समझकर किए गए निवेश भविष्य में लाभदायक सिद्ध होंगे।",
        "आय के नए स्रोत बनने की संभावना है। आर्थिक लेन-देन में सतर्कता अवश्य बरतें।"
      ],
      health: [
        "स्वास्थ्य उत्तम रहेगा। पर्याप्त जल पिएं और मानसिक शांति के लिए योग व ध्यान का अभ्यास करें।",
        "शारीरिक ऊर्जा का स्तर अच्छा रहेगा। समय पर विश्राम लें और संतुलित आहार का सेवन करें।",
        "दिनचर्या को व्यवस्थित रखें। खुली हवा में टहलना आपके मन और तन दोनों को ताजगी देगा।"
      ],
      tip: [
        "शांत मन से दिन की शुरुआत करें और एक समय में एक ही लक्ष्य पर ध्यान केंद्रित रखें।",
        "धैर्य और विनम्रता आपकी सबसे बड़ी शक्ति है। महत्वपूर्ण निर्णयों में बड़ों का आशीर्वाद लें।",
        "सकारात्मक दृष्टिकोण अपनाएं। सूर्य देव को जल अर्पित करने से आत्मविश्वास में वृद्धि होगी।"
      ]
    },

    ta: {
      overall: [
        "இன்றைய நாள் சாதகமானதாகவும் மனத் தெளிவு தருவதாகவும் இருக்கும். கிரக நிலைகள் நல்ல முடிவுகளை எடுக்க உதவும்.",
        "சந்திரனின் நிலை உங்கள் தன்னம்பிக்கையையும் செயல்திறனையும் அதிகரிக்கும். முக்கிய பணிகளை முடிக்க உகந்த நாள்.",
        "கிரகங்களின் இயக்கம் அமைதியையும் சமநிலையையும் காட்டுகிறது. பொறுமையான செயல்கள் நல்ல பலன் தரும்."
      ],
      career: [
        "தொழிலில் சக ஊழியர்களின் ஒத்துழைப்பு கிடைக்கும். புதிய திட்டங்களை தொடங்க சாதகமான நேரம்.",
        "பணியிடத்தில் ஒழுக்கமும் கவனமும் முக்கியம். உங்கள் உழைப்புக்கு தகுந்த பாராட்டு கிடைக்கும்.",
        "வேலை மற்றும் வியாபாரத்தில் தெளிவான பேச்சு அவசியம். புதிய பொறுப்புகள் தேடி வரக்கூடும்."
      ],
      love: [
        "குடும்பத்திலும் உறவுகளிலும் மகிழ்ச்சி நிலவும். அன்பான உரையாடல் பரஸ்பர புரிதலை அதிகரிக்கும்.",
        "உறவினர்களுடன் மகிழ்ச்சியான தருணங்கள் ஏற்படும். உங்கள் உணர்வுகளை வெளிப்படையாகப் பகிருங்கள்.",
        "உறவுகளில் நம்பிக்கையும் மரியாதையும் முக்கியம். வாழ்க்கைத் துணையின் முழு ஆதரவு கிடைக்கும்."
      ],
      finance: [
        "நிதி நிலைமை சீராக இருக்கும். தேவையற்ற செலவுகளைத் தவிர்த்து சேமிப்பில் கவனம் செலுத்துங்கள்.",
        "பொருளாதார ரீதியாக நல்ல நாள். கவனமாக செய்யப்படும் முதலீடுகள் பிற்காலத்தில் பயனளிக்கும்.",
        "வருமான வாய்ப்புகள் அதிகரிக்கும். பணப் பரிவர்த்தனைகளில் விழிப்புடன் இருங்கள்."
      ],
      health: [
        "ஆரோக்கியம் சிறப்பாக இருக்கும். உடற்பயிற்சியும் போதுமான ஓய்வும் புத்துணர்ச்சி தரும்.",
        "உடல் ஆற்றல் சீராக இருக்கும். சத்தான உணவையும் போதுமான நீரையும் எடுத்துக் கொள்ளுங்கள்.",
        "தினசரி தியானமும் பிராணாயாமமும் மன அமைதியையும் உடல் நலத்தையும் மேம்படுத்தும்."
      ],
      tip: [
        "அமைதியான மனதுடன் நாளைத் தொடங்குங்கள், உங்கள் இலக்குகளில் தெளிவான கவனம் வையுங்கள்.",
        "பொறுமையும் பணிவும் உங்களுக்கு வெற்றியைத் தரும். பெரியவர்களின் வழிகாட்டுதலைப் பின்பற்றுங்கள்.",
        "நேர்மறையான சிந்தனையுடன் செயல்படுங்கள். இயற்கை வழிபாடும் தியானமும் மன அமைதி தரும்."
      ]
    },

    te: {
      overall: [
        "ఈ రోజు అనుకూలమైనది మరియు మానసిక స్పష్టతను ఇస్తుంది. గ్రహాల స్థితి మీకు మంచి నిర్ణయాలు తీసుకోవడంలో తోడ్పడుతుంది.",
        "చంద్రుని సంచారం మీ ఆత్మవిశ్వాసాన్ని మరియు పనితీరును పెంచుతుంది. ముఖ్యమైన పనులను పూర్తి చేయడానికి శుభ సమయం.",
        "గ్రహాల చలనం శాంతి మరియు సమతుల్యతను సూచిస్తోంది. సంయమనంతో తీసుకునే నిర్ణయాలు మేలు చేస్తాయి."
      ],
      career: [
        "వృత్తి ఉద్యోగాలలో సహోద్యోగుల మద్దతు లభిస్తుంది. నూతన ఆలోచనలను అమలు చేయడానికి ఇది మంచి సమయం.",
        "పని ప్రదేశంలో క్రమశిక్షణ పాటించండి. మీ ప్రతిభకు అధికారుల నుండి ప్రశంసలు అందుతాయి.",
        "వ్యాపార మరియు ఉద్యోగ రంగాల్లో స్పష్టమైన సంభాషణ అవసరం. నూతన బాధ్యతలు స్వీకరించే అవకాశం ఉంది."
      ],
      love: [
        "కుటుంబంలో మరియు బంధుమిత్రులలో సామరస్యం నెలకొంటుంది. మధురమైన మాటలు సంబంధాలను బలపరుస్తాయి.",
        "ఆత్మీయులతో ఆనందంగా సమయం గడుపుతారు. మీ భావాలను సరళంగా వ్యక్తపరచండి.",
        "బంధాలలో పరస్పర గౌరవం ముఖ్యం. జీవిత భాగస్వామి నుండి పూర్తి సహకారం లభిస్తుంది."
      ],
      finance: [
        "ఆర్థిక పరిస్థితి స్థిరంగా ఉంటుంది. అనవసర ఖర్చులను నియంత్రించి పొదుపుపై దృష్టి పెట్టండి.",
        "ఆర్థికపరంగా ఈ రోజు అనుకూలం. ఆలోచించి చేసే పెట్టుబడులు భవిష్యత్తులో లాభాన్నిస్తాయి.",
        "నూతన ఆదాయ మార్గాలు ఏర్పడే సూచనలు ఉన్నాయి. ఆర్థిక లావాదేవీలలో జాగ్రత్త వహించండి."
      ],
      health: [
        "ఆరోగ్యం బాగుంటుంది. పుష్కలంగా నీరు త్రాగండి మరియు మానసిక ప్రశాంతత కోసం ధ్యానం చేయండి.",
        "శారీరక శక్తి స్థాయిలు చక్కగా ఉంటాయి. సమతుల్య ఆహారం మరియు తగినంత విశ్రాంతి తీసుకోండి.",
        "ప్రశాంతమైన జీవనశైలిని అలవర్చుకోండి. ఉదయం నడక మీకు నూతనోత్సాహాన్ని ఇస్తుంది."
      ],
      tip: [
        "ప్రశాంత చిత్తంతో రోజును ప్రారంభించండి మరియు నిర్దేశిత లక్ష్యంపై దృష్టి కేంద్రీకరించండి.",
        "ఓపిక మరియు వినయం మీ విజయానికి మార్గాలు. పెద్దల ఆశీస్సులు తీసుకోండి.",
        "సానుకూల దృక్పథాన్ని కలిగి ఉండండి. సూర్య నమస్కారాలు చేయడం వల్ల తేజస్సు పెరుగుతుంది."
      ]
    },

    sa: {
      overall: [
        "अद्यतनः दिवसः अनुकूलः मानसिकशान्तिदायकश्च भविष्यति। ग्रहाणां शुभस्थितिः सम्यक् निर्णयान् ग्रहीतुं साहाय्यं करिष्यति।",
        "चन्द्रस्य गोचारः भवतः आत्मविश्वासे कार्यदक्षतायां च वृद्धिं विधास्यति। प्राथम्यकार्येषु मनो निधत्ताम्।",
        "ग्रहाणां गतिः सन्तुलनं शान्तिं च सूचयति। धैर्येण कृतानि कार्याणि दीर्घकालिकं लाभं प्रयच्छन्ति।"
      ],
      career: [
        "कार्यक्षेत्रे सहकर्मिणां सहयोगः लप्स्यते तथा च नूतनविचाराणां प्रयोगार्थम् उत्तमः समयः वर्तते।",
        "व्यावसायिककार्येषु अनुशासनं पाल्यताम्। भवतः योजनाः उच्चाधिकारिभिः प्रशंसिताः भविष्यन्ति।",
        "कार्यस्थले संभाषणे स्पष्टता भवतु। नूतनानाम् उत्तरदायित्वानां प्राप्तेः शुभयोगाः वर्तन्ते।"
      ],
      love: [
        "पारिवारिकजीवने सम्बन्धे च सौहार्दं स्थास्यति। मधुरसंवादेन परस्परस्नेहः दृढः भविष्यति।",
        "सुहृद्भिः सह सुखदः कालः यापयिष्यते। स्वभावनाः निष्कपटतया व्यक्ताः कुर्वन्तु।",
        "सम्बन्धेषु आदरः विश्वासश्च प्रमुखौ स्तः। जीवनसङ्गिनः पूर्णं साहाय्यं लप्स्यते।"
      ],
      finance: [
        "आर्थिकदृष्ट्या दिवसः स्थिरः अस्ति। व्यर्थव्ययं विहाय धनसंचये ध्यानं दीयताम्।",
        "विचारपूर्वकं कृतं विनियोजनं भविष्ये फलप्रदं भविष्यति। धनवृद्धेः शुभसंकेताः दृश्यन्ते।",
        "नूतनायानां मार्गाणां सम्भावना अस्ति। आर्थिकव्यवहारेषु सावधानता अवश्यं रक्षणीया।"
      ],
      health: [
        "स्वास्थ्यम् उत्तमं स्थास्यति। पर्याप्तं जलं पिबन्तु, मानसिकशान्त्यर्थं प्राणायामं च कुर्वन्तु।",
        "शारीरिकऊर्जायाः स्तरः श्रेष्ठः भविष्यति। समये विश्रामं कुर्वन्तु तथा च सात्त्विकाहारं भक्षयन्तु।",
        "प्रातःकाले भ्रमणं मनसि तनौ च नूतनचैतन्यं संचारयिष्यति।"
      ],
      tip: [
        "शान्तेन मनसा दिवसम् आरभताम्, एकस्मिन् समये एकस्मिन् एव कार्ये मनो निधत्ताम्।",
        "धैर्यं विनम्रता च भवतः महती शक्तिः अस्ति। ज्येष्ठानाम् आशीर्वादाः ग्रहीतव्याः।",
        "सूर्यनारायणाय अर्घ्यप्रदानेन आत्मबलं यशश्च वर्धते।"
      ]
    }
  }
};

// Expose globally
window.I18N = I18N;
