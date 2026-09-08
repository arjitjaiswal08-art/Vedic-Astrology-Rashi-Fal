/**
 * Vedic Astrology Rashi Fal Engine
 * Specialized in Rashi Fal (Horoscope predictions) based on Moon Sign (Chandra Rashi).
 * Strictly outputs structured JSON matching the specified format.
 */

// 12 Rashis Knowledge Base with Vedic rulerships, elements, and core traits
const RASHI_DATA = {
  Mesh: {
    englishName: "Aries",
    sanskritName: "मेष",
    symbol: "Ram",
    lord: "Mangal (Mars)",
    element: "Agni (Fire)",
    modality: "Chara (Movable)",
    nature: "Energetic, bold",
    luckyColors: ["Crimson Red", "Bright Coral", "Saffron"],
    luckyNumbers: [9, 1, 18],
    gemstone: "Moonga (Red Coral)",
    traits: {
      strengths: "Courageous, determined, confident, enthusiastic",
      growthArea: "Patience and impulse control"
    },
    // Seeded transit insights for daily/weekly/monthly variations
    planetaryInfluence: "Mars encourages proactive initiative and dynamic physical energy."
  },
  Vrishabh: {
    englishName: "Taurus",
    sanskritName: "वृषभ",
    symbol: "Bull",
    lord: "Shukra (Venus)",
    element: "Prithvi (Earth)",
    modality: "Sthira (Fixed)",
    nature: "Stable, practical",
    luckyColors: ["Lotus Pink", "Pure White", "Pastel Green"],
    luckyNumbers: [6, 2, 15],
    gemstone: "Heera (Diamond) / White Sapphire",
    traits: {
      strengths: "Reliable, patient, practical, devoted",
      growthArea: "Flexibility and welcoming change"
    },
    planetaryInfluence: "Venus brings a desire for harmony, artistic refinement, and grounded value."
  },
  Mithun: {
    englishName: "Gemini",
    sanskritName: "मिथुन",
    symbol: "Twins",
    lord: "Budh (Mercury)",
    element: "Vayu (Air)",
    modality: "Dvisvabhava (Dual)",
    nature: "Communicative, curious",
    luckyColors: ["Emerald Green", "Light Yellow", "Cyan"],
    luckyNumbers: [5, 3, 14],
    gemstone: "Panna (Emerald)",
    traits: {
      strengths: "Adaptable, intellectually curious, expressive, witty",
      growthArea: "Maintaining sustained focus on one priority"
    },
    planetaryInfluence: "Mercury heightens mental agility, dialogue, and networking opportunities."
  },
  Kark: {
    englishName: "Cancer",
    sanskritName: "कर्क",
    symbol: "Crab",
    lord: "Chandra (Moon)",
    element: "Jal (Water)",
    modality: "Chara (Movable)",
    nature: "Emotional, caring",
    luckyColors: ["Pearl White", "Silver", "Sea Green"],
    luckyNumbers: [2, 7, 11],
    gemstone: "Moti (Natural Pearl)",
    traits: {
      strengths: "Empathetic, nurturing, deeply intuitive, protective",
      growthArea: "Emotional detachment and clear boundaries"
    },
    planetaryInfluence: "Moon enhances emotional clarity, empathy, and intuitive decision-making."
  },
  Singh: {
    englishName: "Leo",
    sanskritName: "सिंह",
    symbol: "Lion",
    lord: "Surya (Sun)",
    element: "Agni (Fire)",
    modality: "Sthira (Fixed)",
    nature: "Confident, leader",
    luckyColors: ["Golden Amber", "Royal Orange", "Ruby Red"],
    luckyNumbers: [1, 4, 10],
    gemstone: "Manikya (Ruby)",
    traits: {
      strengths: "Generous, charismatic, warm-hearted, natural leader",
      growthArea: "Receptivity to other people's perspectives"
    },
    planetaryInfluence: "The Sun radiates vitality, creative confidence, and commanding leadership."
  },
  Kanya: {
    englishName: "Virgo",
    sanskritName: "कन्या",
    symbol: "Maiden",
    lord: "Budh (Mercury)",
    element: "Prithvi (Earth)",
    modality: "Dvisvabhava (Dual)",
    nature: "Analytical, detail-oriented",
    luckyColors: ["Olive Green", "Warm Beige", "Sky Blue"],
    luckyNumbers: [5, 6, 23],
    gemstone: "Panna (Emerald) / Peridot",
    traits: {
      strengths: "Methodical, diligent, practical, observant",
      growthArea: "Avoiding over-criticism and perfectionist fatigue"
    },
    planetaryInfluence: "Mercury supports organization, analytical problem-solving, and efficient workflows."
  },
  Tula: {
    englishName: "Libra",
    sanskritName: "तुला",
    symbol: "Scales",
    lord: "Shukra (Venus)",
    element: "Vayu (Air)",
    modality: "Chara (Movable)",
    nature: "Balanced, social",
    luckyColors: ["Soft Cream", "Sky Blue", "Pastel Rose"],
    luckyNumbers: [6, 7, 15],
    gemstone: "Heera (Diamond) / Opal",
    traits: {
      strengths: "Diplomatic, gracious, fair-minded, harmonious",
      growthArea: "Decisiveness in timely matters"
    },
    planetaryInfluence: "Venus promotes fair agreements, relational warmth, and aesthetic balance."
  },
  Vrischik: {
    englishName: "Scorpio",
    sanskritName: "वृश्चिक",
    symbol: "Scorpion",
    lord: "Mangal (Mars) / Ketu",
    element: "Jal (Water)",
    modality: "Sthira (Fixed)",
    nature: "Intense, secretive",
    luckyColors: ["Deep Maroon", "Dark Rust", "Blood Red"],
    luckyNumbers: [9, 8, 18],
    gemstone: "Moonga (Red Coral) / Cat's Eye",
    traits: {
      strengths: "Resourceful, passionate, perceptive, courageous",
      growthArea: "Letting go of past resentments"
    },
    planetaryInfluence: "Mars and Ketu empower deep transformation, research, and emotional resilience."
  },
  Dhanu: {
    englishName: "Sagittarius",
    sanskritName: "धनु",
    symbol: "Archer",
    lord: "Guru (Jupiter)",
    element: "Agni (Fire)",
    modality: "Dvisvabhava (Dual)",
    nature: "Adventurous, optimistic",
    luckyColors: ["Bright Saffron", "Golden Yellow", "Royal Purple"],
    luckyNumbers: [3, 9, 12],
    gemstone: "Pukhraj (Yellow Sapphire)",
    traits: {
      strengths: "Generous, idealistic, philosophical, inspiring",
      growthArea: "Grounding big visions into practical details"
    },
    planetaryInfluence: "Jupiter expands wisdom, ethical purpose, and forward-looking optimism."
  },
  Makar: {
    englishName: "Capricorn",
    sanskritName: "मकर",
    symbol: "Sea-Goat",
    lord: "Shani (Saturn)",
    element: "Prithvi (Earth)",
    modality: "Chara (Movable)",
    nature: "Disciplined, ambitious",
    luckyColors: ["Steel Grey", "Navy Blue", "Charcoal"],
    luckyNumbers: [8, 4, 17],
    gemstone: "Neelam (Blue Sapphire)",
    traits: {
      strengths: "Tenacious, responsible, disciplined, patient",
      growthArea: "Balancing work commitments with emotional joy"
    },
    planetaryInfluence: "Saturn fosters long-term strategic perseverance and professional mastery."
  },
  Kumbh: {
    englishName: "Aquarius",
    sanskritName: "कुम्भ",
    symbol: "Water-Bearer",
    lord: "Shani (Saturn) / Rahu",
    element: "Vayu (Air)",
    modality: "Sthira (Fixed)",
    nature: "Innovative, independent",
    luckyColors: ["Electric Blue", "Cyan", "Deep Violet"],
    luckyNumbers: [4, 8, 22],
    gemstone: "Neelam (Blue Sapphire) / Hessonite",
    traits: {
      strengths: "Progressive, humanitarian, original, vision-driven",
      growthArea: "Connecting comfortably on one-on-one personal emotions"
    },
    planetaryInfluence: "Saturn and Rahu fuel unconventional thinking, teamwork, and future-forward innovation."
  },
  Meen: {
    englishName: "Pisces",
    sanskritName: "मीन",
    symbol: "Two Fishes",
    lord: "Guru (Jupiter)",
    element: "Jal (Water)",
    modality: "Dvisvabhava (Dual)",
    nature: "Intuitive, dreamy",
    luckyColors: ["Pale Yellow", "Seafoam Green", "Lavender"],
    luckyNumbers: [3, 7, 12],
    gemstone: "Pukhraj (Yellow Sapphire)",
    traits: {
      strengths: "Compassionate, artistic, intuitive, gentle",
      growthArea: "Maintaining realistic expectations and healthy limits"
    },
    planetaryInfluence: "Jupiter enhances spiritual depth, creative imagination, and benevolent guidance."
  }
};

// Aliases lookup table to normalize incoming Rashi names
const RASHI_ALIASES = {
  // Sanskrit / Hindi transliterations
  mesh: "Mesh",
  mesha: "Mesh",
  aries: "Mesh",
  vrishabh: "Vrishabh",
  vrishabha: "Vrishabh",
  vrisabha: "Vrishabh",
  taurus: "Vrishabh",
  mithun: "Mithun",
  mithuna: "Mithun",
  gemini: "Mithun",
  kark: "Kark",
  karka: "Kark",
  karkat: "Kark",
  cancer: "Kark",
  singh: "Singh",
  simha: "Singh",
  leo: "Singh",
  kanya: "Kanya",
  virgo: "Kanya",
  tula: "Tula",
  libra: "Tula",
  vrischik: "Vrischik",
  vrishchika: "Vrischik",
  vrischika: "Vrischik",
  scorpio: "Vrischik",
  dhanu: "Dhanu",
  dhanus: "Dhanu",
  sagittarius: "Dhanu",
  makar: "Makar",
  makara: "Makar",
  capricorn: "Makar",
  kumbh: "Kumbh",
  kumbha: "Kumbh",
  aquarius: "Kumbh",
  meen: "Meen",
  meena: "Meen",
  pisces: "Meen"
};

/**
 * Normalizes user provided rashi name to standard key.
 */
function normalizeRashiName(input) {
  if (!input) return "Mithun";
  const cleaned = input.toString().trim().toLowerCase().replace(/[^a-z]/g, "");
  return RASHI_ALIASES[cleaned] || "Mithun";
}

/**
 * Standardize Date formatting:
 * Ensures date is in DD-MM-YYYY or formatted appropriately.
 */
function normalizeDate(rawDate) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  if (!rawDate || String(rawDate).trim().toLowerCase() === "today") {
    return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
  }

  const str = String(rawDate).trim();
  // Already in DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
    return str;
  }

  // Handle YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const parts = str.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  // Parse standard date
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return `${pad(parsed.getDate())}-${pad(parsed.getMonth() + 1)}-${parsed.getFullYear()}`;
  }

  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
}

/**
 * Deterministic hash generator based on Rashi, date string, and scope.
 * Guarantees coherent, reproducible astrological transit states without random jumping.
 */
function getAstrologicalSeed(rashiKey, dateStr, timeframe = "daily") {
  const str = `${rashiKey}_${dateStr}_${timeframe}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Curated Vedic Prediction Library
 * Strictly realistic, positive yet honest, non-fearful, 1-2 lines max each.
 */
const PREDICTION_LIBRARY = {
  Mesh: {
    daily: {
      overall: [
        "A vibrant wave of energy propels your day forward. Direct your natural boldness into steady, deliberate action.",
        "Your dynamic drive is strong today. Taking a thoughtful pause before making major decisions will yield great results.",
        "A highly productive day where initiative pays off. Keep your momentum steady and communicate with clarity."
      ],
      career: [
        "Your proactive approach catches the eye of mentors. Focus on completing pending deliverables with confidence.",
        "Ideal time for independent leadership and pitching fresh ideas. Keep colleagues aligned with patience.",
        "Constructive dialogue with teammates helps resolve an old obstacle. Trust your ability to lead with composure."
      ],
      love: [
        "Expressing warmth openly brings you closer to your partner. Single individuals may connect over shared passions.",
        "Honest listening helps dissolve minor differences today. Celebrate the simple moments together.",
        "An encouraging conversation adds spark to your relationship. Keep your tone gentle and supportive."
      ],
      finance: [
        "Financial matters remain stable with disciplined planning. Review your budget before making non-essential purchases.",
        "A steady phase for your finances. Focus on long-term savings rather than impulsive investments.",
        "Favorable outlook for budgeting and smart resource management. Avoid rushed financial commitments today."
      ],
      health: [
        "High vitality marks your day. Channel excess energy through regular hydration and mindful physical exercise.",
        "Your endurance is solid, but remember to rest your eyes and stretch regularly during work hours.",
        "Good physical stamina supports your schedule. Pair your active routine with mindful breathing."
      ],
      tips: [
        "Channel your bold energy into constructive planning rather than hasty reactions.",
        "Patience with routine processes will turn good ideas into lasting achievements.",
        "Listen fully before responding to turn standard conversations into meaningful wins."
      ]
    },
    weekly: {
      overall: "This week offers strong momentum for personal milestones. Balancing bold initiative with tactical patience will ensure steady progress.",
      career: "Leadership responsibilities may expand favorably. Collaborate closely with peers to execute complex tasks smoothly.",
      love: "Quality time and shared activities strengthen your emotional bond. Singles find warmth in authentic social settings.",
      finance: "A good week to review investments and streamline recurring expenses. Prioritize security over speculation.",
      health: "Maintain a balanced sleep schedule to support your dynamic stamina throughout the week.",
      tips: "Break large goals into weekly milestones to prevent burn-out while maintaining your drive."
    },
    monthly: {
      overall: "This month highlights professional advancement and creative growth. Trust your inner courage while remaining receptive to constructive guidance.",
      career: "Key projects gain steady traction, leading to increased recognition. Keep refining your technical and managerial skill set.",
      love: "Emotional harmony flourishes as you prioritize mutual respect and transparent communication.",
      finance: "Sound financial prudence will strengthen your foundation. A good period for disciplined long-term asset building.",
      health: "Prioritize consistent fitness routines and balanced nutrition to keep your vitality at peak levels.",
      tips: "Ground your ambitious monthly visions with daily discipline and thoughtful teamwork."
    }
  },

  Vrishabh: {
    daily: {
      overall: [
        "A grounded and tranquil day that favors practical execution. Trust your steady pace to handle complex responsibilities.",
        "A calm inner focus helps you organize your schedule effortlessly. Appreciate aesthetic comforts that bring you peace.",
        "Stability and steady judgment serve you well today. Small, consistent efforts create meaningful headway."
      ],
      career: [
        "Your pragmatic mindset is an asset in team discussions. Focus on refining existing projects to perfection.",
        "Good progress is achieved through methodical effort. Maintain your reliable standards without rushing.",
        "Colleagues value your calm perspective during busy workflows. An organized checklist brings clarity."
      ],
      love: [
        "Affectionate gestures and dependable support reinforce your relationship. Meaningful bonds deepen quietly.",
        "A peaceful evening with your loved one restores emotional comfort. Speak from the heart with gentleness.",
        "Loyalty and shared values build mutual trust. Single Bulls find comfort in sincere, unpretentious interactions."
      ],
      finance: [
        "Wise fiscal judgment keeps your monetary outlook strong. Ideal for balancing accounts and budgeting for home comforts.",
        "Favorable day for reviewing savings goals. Your natural caution shields you from unnecessary expenditures.",
        "Financial affairs remain balanced. Stick to your curated budget and avoid speculative trends."
      ],
      health: [
        "Good physical endurance supports your routine. Support your digestive health with fresh, wholesome meals.",
        "Gentle neck and shoulder stretches ease muscle stiffness. Take short nature walks to unwind.",
        "Balanced vitality throughout the day. Keep your hydration consistent and practice rhythmic breathing."
      ],
      tips: [
        "Embrace slight adjustments to your schedule without losing your inner serenity.",
        "Let your practical instincts guide your decisions, but remain open to creative shortcuts.",
        "Take a few moments this evening to relax in quiet comfort and recharge your spirit."
      ]
    },
    weekly: {
      overall: "A calm and constructive week where patience yields tangible rewards. Maintain your steady pace and enjoy life's steady pleasures.",
      career: "Your attention to quality and detail receives well-deserved praise. A great week to complete foundational milestones.",
      love: "Warmth and mutual comfort dominate your relationships. Express your appreciation through thoughtful acts.",
      finance: "Disciplined budgeting protects your resources. Look for safe avenues to strengthen your long-term security.",
      health: "Engage in light outdoor movement and wholesome food choices to keep your physical equilibrium.",
      tips: "Flexibility combined with your innate perseverance will make this week especially fruitful."
    },
    monthly: {
      overall: "This month emphasizes financial consolidation, domestic harmony, and steady personal achievements.",
      career: "Persistent dedication brings steady career recognition. New responsibilities align with your long-term vision.",
      love: "Relationship dynamics stabilize beautifully as mutual understanding and shared values take center stage.",
      finance: "A supportive month for acquiring durable assets and solidifying personal savings reserves.",
      health: "Establish a rhythmic daily routine that balances work efficiency with restorative rest and clean eating.",
      tips: "Keep your foundation strong and welcome incremental personal improvements with an open mind."
    }
  },

  Mithun: {
    daily: {
      overall: [
        "A productive day with lively opportunities to learn and exchange ideas. Your natural curiosity opens interesting doors.",
        "Your mental agility is at a high point today. Clear and engaging interactions make routine tasks enjoyable.",
        "Favorable planetary support for writing, networking, and creative thinking. Keep your priorities structured."
      ],
      career: [
        "Good time for collaborative dialogue, brainstorming, and client outreach. Your articulation is especially sharp.",
        "Team coordination thrives under your versatile approach. Focus on closing active loops before starting new ones.",
        "An unexpected insight helps solve a challenging project riddle. Share your thoughts openly with colleagues."
      ],
      love: [
        "Positive and lighthearted conversations strengthen relationships. A playful debate brings smiles.",
        "Open-hearted sharing creates a delightful rapport. Singles may discover an intellectual spark with someone new.",
        "Your wit and warmth bring joyful lightness to loved ones. Take time to genuinely listen in return."
      ],
      finance: [
        "Avoid impulsive spending on novelty gadgets today. Review expenses to keep your financial goals aligned.",
        "Smart monetary ideas emerge; assess them practically before committing funds.",
        "Financial outlook remains stable. Focus on tracking daily outlays and building an emergency cushion."
      ],
      health: [
        "Stay hydrated and manage mental stress through brief screen breaks. Deep breathing keeps your energy fresh.",
        "Calm an active mind with brief intervals of silence or light walking. Maintain a restful sleep habit tonight.",
        "Vitality is good, but pacing your mental activities prevents end-of-day fatigue."
      ],
      tips: [
        "Focus on clear communication and finish your primary task before branching into new curiosities.",
        "Channel your versatile energy into one core priority to see impressive tangible results.",
        "Listen as attentively as you speak to unlock valuable collaborative insights."
      ]
    },
    weekly: {
      overall: "A fast-paced, intellectually stimulating week. Prioritize your commitments carefully to turn diverse interests into solid wins.",
      career: "Favorable conditions for presentations, contracts, and cross-team communication. Stay organized to maximize productivity.",
      love: "Intellectual camaraderie enriches emotional connections. Plan an engaging date or stimulating conversation.",
      finance: "Keep expenditures grounded in necessity. An opportune week to organize financial paperwork and subscriptions.",
      health: "Balance active mental schedules with physical movement and soothing evening downtime.",
      tips: "Keep a written checklist to ensure multiple ongoing conversations translate into clear outcomes."
    },
    monthly: {
      overall: "This month highlights dynamic communication, skill expansion, and rewarding collaborative connections.",
      career: "Professional growth comes through innovative ideas and networking. Your ability to adapt proves invaluable.",
      love: "Transparency and thoughtful listening elevate relationship harmony. A refreshing new phase in personal connections.",
      finance: "Prudent budget management balances occasional discretionary expenditures. Maintain a steady savings rate.",
      health: "Protect your nervous system with mindful relaxation practices and consistent restorative rest.",
      tips: "Harness your intellectual curiosity by directing it toward one mastery skill this month."
    }
  },

  Kark: {
    daily: {
      overall: [
        "Your intuitive instincts are heightened today. Gentle emotional clarity guides your decisions with wisdom.",
        "A nurturing atmosphere surrounds you. Balancing domestic comfort with your daily duties brings inner contentment.",
        "A peaceful day where empathetic understanding helps you navigate both personal and practical matters smoothly."
      ],
      career: [
        "Your supportive nature fosters excellent teamwork. Trust your instincts when navigating workplace dynamics.",
        "Quiet concentration helps you make steady headway on detailed work. Keep workplace interactions empathetic yet professional.",
        "Colleagues appreciate your dependability and care. A thoughtful approach helps resolve an office dilemma."
      ],
      love: [
        "A heartwarming conversation deepens intimacy with your partner. Express your feelings with openness and trust.",
        "Affection and protective warmth create a safe haven in your relationship. Cherish family and close ties.",
        "Singles will find that genuine authenticity attracts kindred spirits. Allow connections to develop organically."
      ],
      finance: [
        "Your protective financial instincts serve you well. Prioritize family security and sensible home expenses.",
        "A stable day for monetary planning. Avoid emotional retail therapy and stick to your established budget.",
        "Financial affairs remain under control. Consider reviewing long-term savings plans for domestic goals."
      ],
      health: [
        "Nurture your digestive and emotional well-being with soothing warm teas and balanced home-cooked meals.",
        "Take a moment for calm reflection near water or in a quiet room to restore mental balance.",
        "Your energy responds well to gentle movement and mindful evening relaxation. Prioritize good sleep."
      ],
      tips: [
        "Trust your intuition, but pair it with practical facts before making key commitments.",
        "Create a peaceful personal sanctuary to recharge your emotional batteries during busy hours.",
        "Express your needs clearly instead of assuming others will sense them automatically."
      ]
    },
    weekly: {
      overall: "A comforting week centered on domestic harmony, intuitive growth, and steady professional focus.",
      career: "Your loyalty and steady work ethic strengthen your position. Trust your timing and maintain healthy boundaries.",
      love: "Deep emotional bonding and heartwarming moments with loved ones highlight this week. Speak your truth gently.",
      finance: "Favorable time to consolidate household budgets and invest in long-term domestic stability.",
      health: "Support your vital energy with proper hydration, peaceful sleep, and nurturing self-care habits.",
      tips: "Set gentle but clear boundaries so you can care for others without exhausting yourself."
    },
    monthly: {
      overall: "This month brings emotional maturity, family blessings, and rewarding strides in creative or professional pursuits.",
      career: "Your dedicated efforts receive warm acknowledgment. Trust your creative intuition on key assignments.",
      love: "Deepened trust and shared vulnerability bring relationships into a richer, more supportive chapter.",
      finance: "Wise financial stewardship strengthens family security. Plan for long-term investments with patience.",
      health: "Cultivate holistic wellness through balanced nutrition, gentle physical activity, and stress-release rituals.",
      tips: "Honor your emotional sensitivity as a strength, while keeping your daily routines grounded and structured."
    }
  },

  Singh: {
    daily: {
      overall: [
        "Your natural charisma and leadership shine brightly today. Lead with generosity and lead by positive example.",
        "A radiant sense of confidence helps you tackle complex tasks. Sharing credit with others magnifies your goodwill.",
        "A sunny outlook opens doors to creative accomplishment. Your warmth uplifts everyone in your circle."
      ],
      career: [
        "Excellent day to spearhead key initiatives and inspire colleagues. Your authority is respected when delivered with grace.",
        "Creative solutions come naturally. Step forward into leadership roles with a balanced and encouraging approach.",
        "Your presentations and proposals carry persuasive weight. Maintain humility while showcasing your work."
      ],
      love: [
        "Romantic warmth and generous affection brighten your relationship. A grand, sincere gesture will be cherished.",
        "Share your genuine appreciation with your partner. Singles attract admiration through authentic confidence.",
        "Joyful moments and shared laughter reignite romance. Keep your heart open and generous."
      ],
      finance: [
        "Financial outlook is promising, but temper tendencies toward lavish spending. Invest in lasting value.",
        "Steady cash flow allows for confident budgeting. Prioritize practical security over short-term luxury.",
        "Good day to evaluate investments. Exercise prudence and verify contract details before major purchases."
      ],
      health: [
        "Vitality is robust today. Maintain cardiovascular health through brisk walking or dynamic workouts.",
        "Keep your spine aligned and stay well-hydrated throughout the afternoon. Moderate your caffeine intake.",
        "High energy levels support a busy schedule. End the day with relaxing music to unwind fully."
      ],
      tips: [
        "Lead with genuine generosity; true authority inspires rather than commands.",
        "Celebrate other people's achievements today to build enduring alliances.",
        "Balance your ambitious public presence with quiet, grounded reflection."
      ]
    },
    weekly: {
      overall: "A high-visibility week where your confidence and creativity command respect. Lead with heart and practical clarity.",
      career: "Opportunities for promotion or project leadership may arise. Collaboration and mentoring bring mutual triumph.",
      love: "Passionate and uplifting moments enhance your romantic life. Be attentive to your partner's quiet needs as well.",
      finance: "A favorable week for financial planning. Channel your resources into durable, productive assets.",
      health: "Channel your fiery vitality into structured fitness routines while ensuring adequate rest.",
      tips: "Let your inner light warm those around you through encouragement, active listening, and generosity."
    },
    monthly: {
      overall: "This month brings elevated social status, creative breakthroughs, and dynamic personal evolution.",
      career: "Major career strides are within reach as your executive capability shines. Stay disciplined with deadlines.",
      love: "Rich emotional fulfillment and joyful celebrations enhance your personal connections.",
      finance: "Monetary growth is favored through strategic planning. Keep discretionary spending purposeful.",
      health: "Support your heart and stamina with clean food, joyful movement, and mindful boundary-setting.",
      tips: "Combine your majestic vision with humility to build enduring respect across all spheres."
    }
  },

  Kanya: {
    daily: {
      overall: [
        "Your analytical precision and practical efficiency are your superpowers today. Tackle intricate details with ease.",
        "A disciplined and orderly mindset turns chaos into smooth productivity. Celebrate small, steady accomplishments.",
        "Your keen eye for improvement helps streamline tasks at work and home. Avoid overthinking minor imperfections."
      ],
      career: [
        "Outstanding day for organizing data, refining code, or reviewing contracts. Your thoroughness prevents errors.",
        "Colleagues look to you for realistic solutions and procedural clarity. Keep your critiques constructive and encouraging.",
        "A challenging assignment is resolved thanks to your meticulous dedication. Step back and admire your handiwork."
      ],
      love: [
        "Practical acts of service and quiet reliability express your love deeply. Thoughtfulness speaks louder than words.",
        "A gentle and honest dialogue smooths over any recent misunderstandings. Appreciate your partner's unique strengths.",
        "Singles find meaningful resonance with individuals who appreciate genuine intellect and wholesome integrity."
      ],
      finance: [
        "Excellent fiscal control keeps your budget airtight. A favorable day for auditing expenses and eliminating waste.",
        "Sensible monetary choices reinforce your savings cushion. Research before choosing new financial instruments.",
        "Your analytical approach protects you from speculative traps. Financial stability is well preserved."
      ],
      health: [
        "Support your digestive system with fiber-rich meals and probiotic foods. Take regular breathing breaks from screens.",
        "Ease mental tension by practicing mindful mindfulness or a short walk amidst greenery.",
        "Physical vitality is steady. Maintain regular meal timings to keep energy dips at bay."
      ],
      tips: [
        "Strive for excellence rather than flawless perfection to protect your peace of mind.",
        "Offer yourself the same compassionate patience you extend when debugging complex problems.",
        "Organize your top three priorities early and release non-critical micro-tasks."
      ]
    },
    weekly: {
      overall: "A productive week defined by organization, practical problem-solving, and efficient routine improvements.",
      career: "Your methodical approach resolves key project bottlenecks. A great week for documentation and systems refinement.",
      love: "Quiet devotion and helpful support deepen mutual respect. Open up emotionally to complement your practical care.",
      finance: "Solid progress in saving and budgeting goals. Ideal week to plan future investments with conservative caution.",
      health: "Maintain gut wellness and incorporate light stretching to relieve tension in the neck and shoulders.",
      tips: "Remember that done and functional is often better than indefinitely delayed perfection."
    },
    monthly: {
      overall: "This month heralds intellectual clarity, professional optimization, and tangible wellness improvements.",
      career: "Your reliability positions you as an indispensable asset. New responsibilities bring long-term career value.",
      love: "Relationships thrive on mutual honesty, shared health goals, and peaceful domestic routines.",
      finance: "A very favorable month for steady financial accumulation and disciplined expense control.",
      health: "Implement sustainable wellness habits; consistent small choices will produce remarkable vitality.",
      tips: "Channel your analytical mind into constructive building while maintaining inner kindness."
    }
  },

  Tula: {
    daily: {
      overall: [
        "A harmonious and socially balanced day unfolds. Your diplomatic grace bridges gaps and builds consensus easily.",
        "Aesthetic appreciation and fair-minded perspectives guide your actions. Seek equilibrium in your work and rest.",
        "Your charm and objective fairness make group interactions pleasant and mutually rewarding."
      ],
      career: [
        "Favorable time for negotiations, client partnerships, and team consensus. Your balanced view resolves disputes.",
        "Collaboration yields superior results compared to solo effort today. Maintain clear, fair expectations.",
        "Creative projects and visual design tasks benefit from your refined aesthetic touch. Keep decisions timely."
      ],
      love: [
        "Romantic harmony and pleasant companionship illuminate your day. An affectionate date brings sweet connection.",
        "Mutual respect and attentive listening restore balance in your relationship. Single Libras charm effortlessly.",
        "Express your heartfelt appreciation to your partner. Small romantic gestures carry wonderful resonance."
      ],
      finance: [
        "Maintain financial equilibrium by balancing planned investments with moderate leisure spending.",
        "A steady financial phase. Review shared financial responsibilities and ensure transparent budgeting.",
        "Avoid making hasty purchases solely for aesthetic appeal; evaluate long-term utility first."
      ],
      health: [
        "Promote kidney and skin wellness with ample pure water. Gentle yoga or balance exercises restore your center.",
        "Take conscious pauses to detach from social demands and recharge your mental equilibrium.",
        "Vitality is smooth and pleasant. Balance desk work with regular gentle posture adjustments."
      ],
      tips: [
        "Make timely decisions with confidence rather than endlessly weighing every minor alternative.",
        "Infuse beauty and balance into your immediate workspace to elevate your mood and focus.",
        "Practice saying a polite 'no' when necessary to protect your own inner harmony."
      ]
    },
    weekly: {
      overall: "A balanced and pleasant week highlighting diplomatic successes, artistic pursuits, and mutually supportive alliances.",
      career: "Partnerships and collaborative endeavors flourish. Your ability to mediate differences wins high praise.",
      love: "Romance and emotional harmony are strongly supported. Plan dedicated quality time with your partner.",
      finance: "Finances remain stable. A sensible week to balance expenditures between personal growth and home comforts.",
      health: "Engage in rhythmic exercises like swimming or pilates to keep your body aligned and mind centered.",
      tips: "Trust your internal moral compass and take definitive action once both sides of a coin are seen."
    },
    monthly: {
      overall: "This month brings elevated social connection, professional partnerships, and inner artistic fulfillment.",
      career: "Joint ventures and high-level collaborations yield substantial progress. Your diplomatic skills shine brightly.",
      love: "A deeply romantic and mutually restorative month for long-term relationships and blossoming new bonds.",
      finance: "Financial stability is supported by steady income streams and thoughtful financial pacts.",
      health: "Cultivate balance through regular hydration, clean nutrition, and restorative downtime.",
      tips: "Keep your boundaries as polished as your charm to maintain enduring inner peace."
    }
  },

  Vrischik: {
    daily: {
      overall: [
        "An intense, perceptive, and transformative day. Your focus penetrates beneath the surface to reveal key truths.",
        "Strong determination guides you through challenging circumstances. Use your quiet power constructively.",
        "A profound sense of purpose empowers your actions. Trust your deep intuition while releasing unnecessary tension."
      ],
      career: [
        "Excellent day for research, investigative analysis, and strategic planning. You see solutions others miss.",
        "Your resilience helps you conquer demanding deadlines. Work steadily without getting pulled into office politics.",
        "Discreet negotiations and confidential projects proceed in your favor. Let your results do the talking."
      ],
      love: [
        "Deep emotional intimacy and loyal devotion bring you closer to your partner. Sincerity dissolves hesitation.",
        "Vulnerability is your greatest strength today; open your heart without fear of judgment.",
        "Passionate bonds are strengthened through private, meaningful conversations. Singles attract mysterious connections."
      ],
      finance: [
        "Favorable planetary support for managing joint assets, debts, and insurance matters. Keep financial plans discreet.",
        "A secure day for finances. Focus on building an untouchable emergency reserve and eliminating liabilities.",
        "Financial intuition is keen. Verify terms thoroughly before engaging in complex financial transactions."
      ],
      health: [
        "Channel intense emotional energy into vigorous physical workouts or detoxifying hydration.",
        "Practice mindful release of physical tension in the lower back through gentle stretching.",
        "Endurance is strong. Make time for quiet meditative reflection before bedtime to calm the nervous system."
      ],
      tips: [
        "Release past grievances to make room for transformative new opportunities today.",
        "Direct your intense determination toward solving one major dilemma rather than brooding.",
        "Allow genuine vulnerability to strengthen your closest bonds rather than holding up armor."
      ]
    },
    weekly: {
      overall: "A transformative week that rewards deep focus, strategic confidentiality, and emotional authenticity.",
      career: "Your investigative drive uncovers valuable breakthroughs. Step up to complex problems with quiet confidence.",
      love: "Deep intimacy and emotional renewal enrich your relationship. Honest conversations clear the air.",
      finance: "Good week to resolve lingering dues, review insurance, and tighten fiscal management.",
      health: "Engage in strength-building workouts and prioritize mental decompression to stay energized.",
      tips: "Trust your resilience and remember that letting go of control is often the fastest route to peace."
    },
    monthly: {
      overall: "This month marks a powerful cycle of personal renewal, emotional depth, and career consolidation.",
      career: "Strategic initiatives launched with patience now gain decisive traction. Your expertise is recognized.",
      love: "Relationships evolve toward greater depth, shared truth, and unwavering loyalty.",
      finance: "Favorable progress in clearing debts and strengthening long-term investments. Maintain fiscal discretion.",
      health: "Prioritize holistic detoxification, restorative sleep, and emotional mindfulness.",
      tips: "Transform obstacles into stepping stones by remaining focused on your ultimate purpose."
    }
  },

  Dhanu: {
    daily: {
      overall: [
        "An adventurous, optimistic, and expansive day. Your uplifting vision inspires those around you to aim higher.",
        "Broad perspectives and philosophical curiosity make routine work exciting. Keep your enthusiasm grounded in practical steps.",
        "Favorable stars for learning, mentorship, and creative expansion. Walk with joyful confidence today."
      ],
      career: [
        "Your big-picture thinking identifies promising future pathways. Great time for education, training, and presentations.",
        "Colleagues welcome your positive leadership and ethical stance. Ensure execution details match your bold visions.",
        "A promising networking connection broadens your professional horizon. Be clear about timeline deliverables."
      ],
      love: [
        "Spontaneous joy and philosophical banter bring fresh spark to romance. Plan an outdoor adventure together.",
        "Honest, open-hearted communication fosters mutual trust. Single Archers connect through shared ideals.",
        "Laughter and optimism enrich your bond. Give your partner room to share their hopes as well."
      ],
      finance: [
        "Financial outlook is generally positive, but avoid over-optimistic speculation or rushed commitments.",
        "Good day to invest in education, books, or skill enhancement that yields long-term returns.",
        "Prudence balances your generous nature. Keep track of daily travel and leisure expenses."
      ],
      health: [
        "Stamina is high today. Outdoor sports, hiking, or brisk walking recharge your spirits.",
        "Stretch your hips and thighs to relieve tension from sitting. Maintain adequate water intake.",
        "Vitality is sunny and resilient. Avoid heavy meals late at night to ensure sound sleep."
      ],
      tips: [
        "Anchor your broad philosophical vision into three concrete action items for today.",
        "Combine your natural optimism with practical attention to detail for flawless results.",
        "Share your wisdom with humility, allowing others to find their own answers."
      ]
    },
    weekly: {
      overall: "An expansive, inspiring week filled with learning opportunities, optimistic plans, and philosophical growth.",
      career: "Strategic thinking and international or higher-learning connections open doors. Deliver on concrete promises.",
      love: "Spontaneous adventures and uplifting conversations enliven your emotional life. Celebrate shared values.",
      finance: "Moderate discretionary spending on travel or leisure. Focus on systematic, long-term savings plans.",
      health: "Engage in active outdoor pursuits to keep your spirits and physical stamina aligned.",
      tips: "Keep your arrow aimed high, but make sure your feet remain firmly planted on the ground."
    },
    monthly: {
      overall: "This month encourages ambitious horizons, educational breakthroughs, and rewarding philosophical discovery.",
      career: "Mentors recognize your potential as you take on strategic, forward-looking initiatives.",
      love: "Joy, travel, and honest emotional expression enhance mutual understanding and romantic vitality.",
      finance: "Overall financial growth is supported. Ensure thorough due diligence before entering new agreements.",
      health: "Maintain liver and digestive vitality with clean, antioxidant-rich foods and regular movement.",
      tips: "Let wisdom and ethical clarity guide every major decision you undertake this month."
    }
  },

  Makar: {
    daily: {
      overall: [
        "A disciplined, ambitious, and highly constructive day. Your steady perseverance turns challenges into solid victories.",
        "Order and structured methodology guide your path. Keep your focus on long-term milestones while honoring your pace.",
        "Your mature outlook commands respect in all arenas. Practical patience delivers meaningful results."
      ],
      career: [
        "Superb day for project management, strategic roadmaps, and meeting high professional standards.",
        "Senior leadership values your dependable competence. Tackle the most demanding task on your list early.",
        "Progress is steady and tangible. Your organized approach keeps entire team workflows on track."
      ],
      love: [
        "Quiet dedication and dependable actions express your love louder than words. Consistency builds lasting trust.",
        "Take a break from career thoughts to offer your loved one your undivided presence this evening.",
        "Singles attract mature and reliable partners who admire your dedication and wholesome character."
      ],
      finance: [
        "Financial prudence is your greatest asset. A disciplined day that supports savings, budgeting, and debt retirement.",
        "Steady monetary growth through patient planning. Avoid impulsive spending on temporary trends.",
        "Favorable outlook for long-term investments and securing tangible assets. Stick to conservative strategies."
      ],
      health: [
        "Support your bones and joints with proper posture, calcium-rich foods, and gentle mobility stretches.",
        "Take conscious breathers during intensive desk work to relax the jaw and shoulders.",
        "Stamina is resilient, but don't compromise on scheduled meals and restful sleep tonight."
      ],
      tips: [
        "Remember that taking time to rest is an essential part of long-term professional mastery.",
        "Celebrate small daily milestones along your climb to keep motivation burning bright.",
        "Soften your realistic assessment with warm encouragement when guiding peers."
      ]
    },
    weekly: {
      overall: "A highly constructive week where your discipline and strategic patience lay durable foundations for success.",
      career: "Major career responsibilities are handled with mastery. Recognition from superiors is well supported.",
      love: "Reliable companionship and shared life goals bring deep emotional reassurance. Plan quiet time together.",
      finance: "Financial control is strong. Excellent timing to evaluate long-term financial security and retirement plans.",
      health: "Focus on joint flexibility, balanced nutrition, and guarding against work-related fatigue.",
      tips: "Allow yourself to enjoy the present moment as you climb steadily toward your future mountain."
    },
    monthly: {
      overall: "This month highlights professional consolidation, enduring reputation, and steady financial milestones.",
      career: "Your persistence culminates in significant milestones. Long-term career targets come within reachable distance.",
      love: "Relationships strengthen on the bedrock of mutual loyalty, emotional security, and shared commitments.",
      finance: "Solid financial accumulation through patient investments and strict expense control.",
      health: "Maintain a steady routine of regular meals, spinal stretches, and restorative sleep habits.",
      tips: "Balance your dedicated ambition with joyful domestic relaxation and heartwarming connection."
    }
  },

  Kumbh: {
    daily: {
      overall: [
        "An innovative, independent, and forward-looking day. Your visionary thinking uncovers original solutions.",
        "A refreshing sense of intellectual freedom guides your day. Connecting with like-minded friends brings creative joy.",
        "Favorable planetary transits for humanitarian pursuits, technological tasks, and group collaboration."
      ],
      career: [
        "Your unique perspective resolves systemic issues that baffled others. Great day for coding, research, and innovation.",
        "Teamwork flourishes when you share the big-picture purpose. Keep communication grounded and actionable.",
        "An unconventional idea gains supportive interest. Frame your concept with practical implementation steps."
      ],
      love: [
        "Intellectual camaraderie and emotional freedom enrich your romantic connection. Enjoy stimulating conversations.",
        "Respect your partner's individuality while sharing your own hopes openly. Singles connect over common ideals.",
        "A lighthearted and refreshing approach brings joy to your relationship. True friendship underpins deep love."
      ],
      finance: [
        "Stable financial footing with opportunities to optimize tech subscriptions or modern investment tools.",
        "Sensible monetary phase. Balance your interest in modern assets with time-tested savings foundations.",
        "Financial outlook is secure. Avoid impulsive group spending and keep personal budgeting intact."
      ],
      health: [
        "Promote circulation with brisk walks, leg stretches, and keeping properly hydrated throughout the day.",
        "Take breaks from digital devices to reduce sensory overload and restore mental clarity.",
        "Energy is active and alert. Practice calming evening meditation to transition into restful sleep."
      ],
      tips: [
        "Bridge your futuristic concepts with practical, step-by-step implementation for maximum impact.",
        "Reach out to a trusted collaborator or friend to share creative inspiration.",
        "Balance your intellectual focus with genuine, grounded emotional presence."
      ]
    },
    weekly: {
      overall: "An inspiring week marked by innovative problem-solving, meaningful networking, and progressive insights.",
      career: "Collaborative projects and technological initiatives advance swiftly. Your out-of-the-box ideas stand out.",
      love: "Romantic bonds thrive through friendship, mutual respect, and intellectual alignment. Share your dreams.",
      finance: "Favorable time to audit technological expenses and plan innovative savings strategies.",
      health: "Keep your nervous system relaxed with digital detox periods and regular outdoor walks.",
      tips: "Channel your independent vision into community-building and constructive group triumphs."
    },
    monthly: {
      overall: "This month opens up progressive networks, career innovation, and exciting personal expansion.",
      career: "Major breakthroughs in group projects and technical assignments. Your forward-looking leadership is valued.",
      love: "Deep mutual understanding and shared social ideals elevate romance into an inspiring partnership.",
      finance: "Solid financial stability supported by diversified resources. Focus on long-term technological or collective assets.",
      health: "Maintain nervous system balance through mindful breathing, regular movement, and sound sleep.",
      tips: "Stay true to your unique individuality while building strong bridges with diverse teammates."
    }
  },

  Meen: {
    daily: {
      overall: [
        "An intuitive, compassionate, and creatively rich day. Your artistic sensitivity guides you to gentle breakthroughs.",
        "A serene and imaginative perspective brings beauty to your daily routine. Trust your quiet inner wisdom.",
        "Favorable transits for meditation, creative writing, and helping others. Keep your daily schedule organized."
      ],
      career: [
        "Your empathetic understanding facilitates smooth collaboration. Creative and design work thrives under your touch.",
        "Trust your subtle instincts during negotiations. Keep practical timelines clearly documented to stay focused.",
        "A peaceful and supportive work atmosphere helps you deliver polished, thoughtful work on time."
      ],
      love: [
        "Heartfelt empathy and tender romance color your relationship. A poetic, affectionate gesture is cherished.",
        "Deep emotional resonance creates a soul-level connection. Singles attract gentle and spiritually attuned partners.",
        "Share your imaginative dreams with your loved one. Authentic vulnerability fosters magical closeness."
      ],
      finance: [
        "Maintain practical boundaries in monetary affairs. Protect your generosity with clear budgeting.",
        "A steady financial phase. Review bank statements and avoid making loans based solely on emotional impulses.",
        "Financial security is maintained through grounded discipline. Plan for creative or peaceful domestic investments."
      ],
      health: [
        "Pamper your feet with a relaxing soak or gentle massage. Drink warm herbal infusions to soothe digestion.",
        "Guard your energetic space by spending a few quiet moments in nature or peaceful solitude.",
        "Vitality is gentle and rhythmic. Prioritize consistent sleep hours to refresh your dream-rich mind."
      ],
      tips: [
        "Pair your beautiful creative intuition with grounded checklists to turn visions into reality.",
        "Set kind but firm boundaries to protect your compassionate energy from emotional fatigue.",
        "Spend a few minutes in quiet meditation today to tap into your deepest inner guidance."
      ]
    },
    weekly: {
      overall: "A soulful and creative week that rewards gentle intuition, compassionate collaboration, and inner reflection.",
      career: "Artistic and humanitarian projects gain positive momentum. Keep detailed notes to keep workflows grounded.",
      love: "Tender romance, emotional healing, and mutual forgiveness grace your romantic connections this week.",
      finance: "Maintain prudent control over financial outlays. Focus on saving for peace-of-mind security.",
      health: "Support your immune wellness through restorative rest, mindful breathing, and wholesome meals.",
      tips: "Allow your intuitive wisdom to navigate the waves, while keeping your anchor firmly set in daily duty."
    },
    monthly: {
      overall: "This month illuminates artistic mastery, spiritual clarity, and meaningful emotional rejuvenation.",
      career: "Creative recognition and collaborative appreciation come your way. Your empathy inspires your entire team.",
      love: "Deep soul connection, unconditional affection, and harmonious home life mark this romantic cycle.",
      finance: "Favorable month for steady financial recovery and stabilizing domestic resources through prudent planning.",
      health: "Engage in gentle yoga, swimming, and meditative practices to nurture your mind, body, and spirit.",
      tips: "Trust the gentle currents of life while remaining proactive in caring for your practical obligations."
    }
  }
};

// ─────────────────────── MULTILINGUAL LOCALIZATION DATA ───────────────────────

const MULTILINGUAL_DATA = {
  names: {
    Mesh: { hi: "मेष", ta: "மேஷம்", te: "మేషం", sa: "मेषः" },
    Vrishabh: { hi: "वृषभ", ta: "ரிஷபம்", te: "వృషభం", sa: "वृषभः" },
    Mithun: { hi: "मिथुन", ta: "மிதுனம்", te: "మిథునం", sa: "मिथुनम्" },
    Kark: { hi: "कर्क", ta: "கடகம்", te: "కర్కాటకం", sa: "कर्कटः" },
    Singh: { hi: "सिंह", ta: "சிம்மம்", te: "సింహం", sa: "सिंहः" },
    Kanya: { hi: "कन्या", ta: "கன்னி", te: "కన్య", sa: "कन्या" },
    Tula: { hi: "तुला", ta: "துலாம்", te: "తులా", sa: "तुला" },
    Vrischik: { hi: "वृश्चिक", ta: "விருச்சிகம்", te: "వృశ్చికం", sa: "वृश्चिकः" },
    Dhanu: { hi: "धनु", ta: "தனுசு", te: "ధనుస్సు", sa: "धनुः" },
    Makar: { hi: "मकर", ta: "மகரம்", te: "మకరం", sa: "मकरः" },
    Kumbh: { hi: "कुंभ", ta: "கும்பம்", te: "కుంభం", sa: "कुम्भः" },
    Meen: { hi: "मीन", ta: "மீனம்", te: "మీనం", sa: "मीनः" }
  },
  colors: {
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
    "Ruby Red": { hi: "माणिक्य लाल", ta: "மாணிக்க சிவப்பு", te: "మాணிக்கపు ఎరుపు", sa: "माणिक्यरक्तवर्णः" },
    "Olive Green": { hi: "जैतून हरा", ta: "ஆலிவ் பச்சை", te: "ఆలివ్ పచ్చ", sa: "जैतूनहरितवर्णः" },
    "Warm Beige": { hi: "हल्का बादामी", ta: "மெல்லிய பழுப்பு", te: "లేత గోధుమ రంగు", sa: "पिङ्गलबेजवर्णः" },
    "Sky Blue": { hi: "आसमानी नीला", ta: "ஆகாய நீலம்", te: "ఆకాశ నీలం", sa: "आकाशनीलवर्णः" },
    "Soft Cream": { hi: "कोमल मलाईदार", ta: "மென்மையான கிரீம்", te: "మృదువైన క్రీమ్", sa: "दुग्धफेनवर्णः" },
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

  // Localized personality/emotional/guidance lines per Rashi per language
  insights: {
    hi: {
      personality: {
        Mesh:     "आपकी मेष लग्न आपको साहसी, दृढ़ और उत्साही बनाती है। मंगल ग्रह आपको नई पहल और गतिशील ऊर्जा का आशीर्वाद देता है। विकास क्षेत्र: धैर्य और आवेग पर नियंत्रण।",
        Vrishabh: "आपकी वृषभ लग्न आपको विश्वसनीय, धैर्यवान और व्यावहारिक बनाती है। शुक्र ग्रह सौंदर्य, सामंजस्य और मूल्यों की समझ देता है। विकास क्षेत्र: लचीलापन और परिवर्तन को स्वीकार करना।",
        Mithun:   "आपकी मिथुन लग्न आपको अनुकूलनशील, जिज्ञासु और अभिव्यक्तिशील बनाती है। बुध ग्रह मानसिक चपलता और संवाद शक्ति प्रदान करता है। विकास क्षेत्र: एक विषय पर निरंतर ध्यान केंद्रित करना।",
        Kark:     "आपकी कर्क लग्न आपको भावनात्मक, पोषणशील और अत्यंत सहज ज्ञान वाला बनाती है। चंद्रमा भावनात्मक स्पष्टता और सहानुभूति देता है। विकास क्षेत्र: भावनात्मक सीमाएं और स्पष्ट विचार।",
        Singh:    "आपकी सिंह लग्न आपको उदार, करिश्माई और स्वाभाविक नेता बनाती है। सूर्य आत्मविश्वास और रचनात्मक ऊर्जा का संचार करता है। विकास क्षेत्र: दूसरों के दृष्टिकोण को सुनना।",
        Kanya:    "आपकी कन्या लग्न आपको विश्लेषणात्मक, परिश्रमी और व्यावहारिक बनाती है। बुध ग्रह सूक्ष्म विवरण और सेवा भावना जगाता है। विकास क्षेत्र: आत्म-आलोचना को कम करना।",
        Tula:     "आपकी तुला लग्न आपको न्यायप्रिय, कूटनीतिक और सहयोगी बनाती है। शुक्र ग्रह संबंधों में संतुलन और सौंदर्य बोध देता है। विकास क्षेत्र: निर्णायकता और आत्मनिर्भरता।",
        Vrischik: "आपकी वृश्चिक लग्न आपको तीव्र, अंतर्दृष्टिपूर्ण और दृढ़ संकल्पी बनाती है। मंगल गहरे रूपांतरण और खोजी स्वभाव का आशीर्वाद देता है। विकास क्षेत्र: विश्वास और खुलापन।",
        Dhanu:    "आपकी धनु लग्न आपको आशावादी, साहसी और ज्ञान-पिपासु बनाती है। गुरु ग्रह विस्तार, दर्शन और आध्यात्मिक ज्ञान देता है। विकास क्षेत्र: धैर्य और विवरणों पर ध्यान।",
        Makar:    "आपकी मकर लग्न आपको अनुशासित, महत्वाकांक्षी और जिम्मेदार बनाती है। शनि दीर्घकालिक सफलता और संरचना का आशीर्वाद देता है। विकास क्षेत्र: आराम और भावनात्मक अभिव्यक्ति।",
        Kumbh:    "आपकी कुंभ लग्न आपको प्रगतिशील, मानवतावादी और मौलिक विचारक बनाती है। शनि नवाचार और सामाजिक दूरदर्शिता प्रदान करता है। विकास क्षेत्र: भावनात्मक गर्मजोशी और व्यक्तिगत संबंध।",
        Meen:     "आपकी मीन लग्न आपको करुणामय, कलात्मक और आध्यात्मिक रूप से संवेदनशील बनाती है। गुरु ग्रह सहज ज्ञान और आंतरिक शांति देता है। विकास क्षेत्र: व्यावहारिक सीमाएं और दृढ़ निर्णय।"
      },
      emotional: {
        Mesh:     "मेष चंद्र राशि के साथ आपका भावनात्मक संसार उत्साही और सहज है। मंगल की ऊर्जा आपकी भावनाओं को तीव्र और त्वरित बनाती है।",
        Vrishabh: "वृषभ चंद्र राशि के साथ आपका आंतरिक संसार स्थिर और संवेदनशील है। शुक्र की कृपा से भावनाओं में सौम्यता और गहराई है।",
        Mithun:   "मिथुन चंद्र राशि के साथ आपका मन जिज्ञासु और चंचल है। बुध की शक्ति से विचार और भावनाएं तेज़ी से बदलती हैं।",
        Kark:     "कर्क चंद्र राशि के साथ आपका हृदय गहरी भावनाओं और सहानुभूति से भरा है। चंद्रमा की कृपा से आप अत्यंत सहज ज्ञानी हैं।",
        Singh:    "सिंह चंद्र राशि के साथ आपका भावनात्मक संसार उज्ज्वल और उदार है। सूर्य की ऊर्जा आपको गर्मजोशी और आत्मविश्वास देती है।",
        Kanya:    "कन्या चंद्र राशि के साथ आपका मन विश्लेषणात्मक और सूक्ष्म है। बुध की शक्ति से भावनाओं में स्पष्टता और व्यावहारिकता है।",
        Tula:     "तुला चंद्र राशि के साथ आपका भावनात्मक संसार संतुलित और सामंजस्यपूर्ण है। शुक्र की कृपा से संबंधों में मधुरता रहती है।",
        Vrischik: "वृश्चिक चंद्र राशि के साथ आपका भावनात्मक संसार गहरा और रहस्यमय है। मंगल की शक्ति से भावनाएं तीव्र और परिवर्तनशील हैं।",
        Dhanu:    "धनु चंद्र राशि के साथ आपका मन स्वतंत्र और आशावादी है। गुरु की कृपा से आपकी भावनाओं में उदारता और विस्तार है।",
        Makar:    "मकर चंद्र राशि के साथ आपका भावनात्मक संसार संयमित और व्यावहारिक है। शनि की शक्ति से आप भावनाओं को अनुशासन से संभालते हैं।",
        Kumbh:    "कुंभ चंद्र राशि के साथ आपका मन प्रगतिशील और स्वतंत्र है। शनि की कृपा से आप समाज के प्रति गहरी सहानुभूति रखते हैं।",
        Meen:     "मीन चंद्र राशि के साथ आपका भावनात्मक संसार स्वप्निल और करुणामय है। गुरु की शक्ति से आप अत्यंत आध्यात्मिक और सहज ज्ञानी हैं।"
      },
      guidance: {
        Mesh:     "आज की ग्रहीय ऊर्जा आपको नई शुरुआत करने के लिए प्रेरित करती है। साहस और दृढ़ता के साथ आगे बढ़ें — आपका सूर्य आपको शक्ति देता है।",
        Vrishabh: "आज का दिन स्थिरता और धैर्य का है। व्यावहारिक कदम उठाएं और अपने लक्ष्यों की ओर दृढ़ता से बढ़ें।",
        Mithun:   "आज संवाद और नेटवर्किंग के शुभ योग हैं। नए विचारों को साझा करें — आपकी बुद्धि और चपलता आज चमकेगी।",
        Kark:     "आज भावनात्मक संतुलन और पारिवारिक सौहार्द का दिन है। अपनी अंतर्प्रेरणा पर भरोसा करें।",
        Singh:    "आज आत्मविश्वास के साथ नेतृत्व करें। आपकी रचनात्मकता और करिश्मा आज दूसरों को प्रेरित करेगा।",
        Kanya:    "आज विवरण और सटीकता पर ध्यान दें। आपका विश्लेषणात्मक दृष्टिकोण आज बड़े काम आएगा।",
        Tula:     "आज संतुलन और सहयोग का दिन है। निर्णय लेते समय न्याय और समभाव बनाए रखें।",
        Vrischik: "आज गहरी अंतर्दृष्टि और परिवर्तन का समय है। रहस्यों को सुलझाने और नई खोज करने का शुभ दिन है।",
        Dhanu:    "आज विस्तार और अन्वेषण का दिन है। नए ज्ञान और अनुभवों के प्रति खुले रहें।",
        Makar:    "आज अनुशासन और कड़ी मेहनत से लक्ष्य प्राप्त करें। शनि का आशीर्वाद आपके साथ है।",
        Kumbh:    "आज नवाचार और सामाजिक सोच का दिन है। प्रगतिशील विचारों से आप दूसरों को लाभ पहुंचा सकते हैं।",
        Meen:     "आज आध्यात्मिक चिंतन और सृजनशीलता का दिन है। अपनी कल्पना और करुणा को कार्यरूप दें।"
      }
    }
  },

  pillars: {
    hi: {
      overall: [
        "आज ग्रहों की अनुकूल स्थिति आपके आत्मविश्वास और आत्मबल को सुदृढ़ करेगी। महत्वपूर्ण कार्यों में सफलता मिलेगी।",
        "चंद्रमा का शुभ गोचर मानसिक स्पष्टता और कार्यक्षेत्र में गति प्रदान करेगा। प्राथमिकताओं पर ध्यान केंद्रित रखें।",
        "ग्रहों की गति संतुलन और शांति का संकेत दे रही है। धैर्यपूर्वक उठाए गए कदम दीर्घकालिक लाभ देंगे।"
      ],
      career: [
        "कार्यक्षेत्र में सहकर्मियों का पूर्ण सहयोग प्राप्त होगा। नए विचारों को क्रियान्वित करने का उत्तम अवसर है।",
        "व्यावसायिक कार्यों में अनुशासन बनाए रखें। आपकी कार्यकुशलता की वरिष्ठ अधिकारियों द्वारा प्रशंसा होगी।",
        "व्यापार एवं कार्यस्थल पर संवाद स्पष्ट रखें। नई जिम्मेदारियां मिलने के शुभ योग बन रहे हैं।"
      ],
      love: [
        "पारिवारिक जीवन एवं प्रेम संबंधों में सौहार्द बना रहेगा। मधुर संवाद से परस्पर विश्वास और समझ बढ़ेगी।",
        "सगे-संबंधियों व मित्रों के साथ सुखद समय व्यतीत होगा। अपनी भावनाओं को निष्कपट रूप से व्यक्त करें।",
        "रिश्तों में सम्मान और निष्ठा को प्राथमिकता दें। जीवनसाथी का पूर्ण भावनात्मक सहयोग मिलेगा।"
      ],
      finance: [
        "वित्तीय मामलों में संतुलन बना रहेगा। अनावश्यक व्यय पर नियंत्रण रखें और बचत की योजना पर ध्यान दें।",
        "आर्थिक दृष्टिकोण से दिन स्थिर और फलदायी है। सोच-समझकर किए गए निवेश भविष्य में लाभ देंगे।",
        "आय के नए स्रोत बनने की शुभ संभावना है। आर्थिक लेन-देन में सतर्कता अवश्य बरतें।"
      ],
      health: [
        "स्वास्थ्य उत्तम रहेगा। पर्याप्त जल पिएं और मानसिक शांति के लिए योग व ध्यान का अभ्यास करें।",
        "शारीरिक ऊर्जा का स्तर श्रेष्ठ रहेगा। समय पर विश्राम लें और संतुलित सात्विक आहार अपनाएं।",
        "दिनचर्या को व्यवस्थित रखें। खुली हवा में टहलना आपके मन और शरीर दोनों को नवस्फूर्ति देगा।"
      ],
      tip: [
        "शांत मन से दिन की शुरुआत करें और एक समय में एक ही लक्ष्य पर ध्यान केंद्रित रखें।",
        "धैर्य और विनम्रता आपकी सबसे बड़ी शक्ति है। बड़ों का आशीर्वाद लेकर महत्वपूर्ण कार्य करें।",
        "सकारात्मक दृष्टिकोण अपनाएं। सूर्य देव को अर्घ्य देने से आत्मबल और तेज में वृद्धि होगी।"
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

// ── VEDIC ASTROLOGY KNOWLEDGE BASE (Pillars, Mantras, Remedies, Transits) ────

const EDUCATION_DATA = {
  Mesh: {
    en: "Aries students experience sharp intellectual drive and competitive ambition. Excel in technical topics, engineering, sports science, and timed tests. Break long study hours into 45-minute energetic sprints for maximum retention.",
    hi: "मेष राशि के विद्यार्थियों में उत्कृष्ट प्रतिस्पर्धात्मक ऊर्जा और तत्परता रहेगी। तकनीकी विषयों, गणित और समयबद्ध परीक्षाओं में श्रेष्ठ प्रदर्शन के योग हैं।"
  },
  Vrishabh: {
    en: "Taurus students benefit from patient, methodical revision and strong conceptual retention. Highly favorable for commerce, finance, architecture, and environmental sciences. A calm, uncluttered study space brings steady focus.",
    hi: "वृषभ राशि के छात्र शांत, व्यवस्थित और धैर्यपूर्ण अध्ययन से उत्कृष्ट परिणाम प्राप्त करेंगे। वाणिज्य, कला और व्यावहारिक विज्ञान में विशेष सफलता मिलेगी।"
  },
  Mithun: {
    en: "Gemini students enjoy quick intellectual absorption and communicative versatility. Favorable for languages, coding, data science, and writing. Avoid multitasking across subjects to ensure deep mastery.",
    hi: "मिथुन राशि के शिक्षार्थियों में अद्भुत बौद्धिक ग्रहण शक्ति और तार्किक चपलता रहेगी। भाषा, कंप्यूटर और संचार से जुड़े विषयों में विशेष लाभ होगा।"
  },
  Kark: {
    en: "Cancer students learn best in an emotionally supportive, peaceful environment. Strong intuitive recall aids medical, history, psychology, and creative arts. Review key concepts right before rest to anchor memory.",
    hi: "कर्क राशि के छात्रों के लिए एकाग्र और सौम्य वातावरण में अध्ययन लाभकारी रहेगा। चिकित्सा, मनोविज्ञान और रचनात्मक विषयों में श्रेष्ठ ग्रहण शक्ति रहेगी।"
  },
  Singh: {
    en: "Leo students thrive in academic presentations, leadership seminars, and administrative or political studies. Cultivate academic humility and avoid overconfident rushes during complex exam calculations.",
    hi: "सिंह राशि के विद्यार्थी प्रतियोगी परीक्षाओं और नेतृत्व सम्मेलनों में चमकेंगे। आत्मविश्वास उत्तम रहेगा; जटिल विषयों में धैर्य और सतर्कता रखें।"
  },
  Kanya: {
    en: "Virgo students naturally command analytical precision, diligent note-taking, and research depth. Outstanding prospects in STEM, medicine, statistics, and editorial work. Guard against unnecessary exam-related perfectionism.",
    hi: "कन्या राशि के छात्रों का विश्लेषणात्मक दृष्टिकोण और सूक्ष्म अध्ययन अत्यंत प्रभावी रहेगा। विज्ञान, सांख्यिकी और शोध कार्यों में उत्तम प्रगति होगी।"
  },
  Tula: {
    en: "Libra students excel in collaborative group discussions, legal studies, design, and humanities. Maintain steady revision schedules to prevent decision fatigue when choosing project specializations.",
    hi: "तुला राशि के विद्यार्थियों के लिए विधि, समाजशास्त्र और कलात्मक अध्ययन में उत्तम सफलता के योग हैं। अध्ययन में नियमित संतुलन बनाए रखें।"
  },
  Vrischik: {
    en: "Scorpio students possess unmatched focus, research intensity, and investigative depth. Favorable for surgery, advanced scientific research, and deep theoretical analysis. Pace your stamina to avoid mental exhaustion.",
    hi: "वृश्चिक राशि के शिक्षार्थियों में गूढ़ अध्ययन और अटूट एकाग्रता रहेगी। वैज्ञानिक अनुसंधान, औषध विज्ञान और रहस्यमयी विषयों में गहरी अंतर्दृष्टि मिलेगी।"
  },
  Dhanu: {
    en: "Sagittarius students excel in higher education, philosophy, jurisprudence, and competitive university admissions. Keep visionary big-picture understanding grounded with diligent attention to examination syllabi.",
    hi: "धनु राशि के छात्रों के लिए उच्च शिक्षा, दर्शनशास्त्र और राष्ट्रीय परीक्षाओं में अनुकूल प्रगति होगी। अपने विस्तृत ज्ञान को व्यवस्थित रखें।"
  },
  Makar: {
    en: "Capricorn students display disciplined stamina, structured work ethics, and long-term academic strategy. High success in engineering, corporate law, and finance exams.",
    hi: "मकर राशि के विद्यार्थी कठोर अनुशासन और योजनाबद्ध अभ्यास से उत्कृष्ट सफलता अर्जित करेंगे। इंजीनियरिंग और वाणिज्य में विशेष लाभ होगा।"
  },
  Kumbh: {
    en: "Aquarius students gravitate toward innovative subjects, physics, AI/tech, and social sciences. Combine your unconventional thinking with standard test-taking formats for best scores.",
    hi: "कुंभ राशि के छात्र आधुनिक तकनीक, विज्ञान और नवोन्मेषी अनुसंधानों में अग्रणी रहेंगे। अपनी अनूठी सोच को सुनियोजित प्रारूप में प्रस्तुत करें।"
  },
  Meen: {
    en: "Pisces students possess fertile creative imagination and intuitive grasp of complex abstract concepts. Excellent for biology, literature, arts, and spiritual sciences. Keep a grounded study schedule.",
    hi: "मीन राशि के शिक्षार्थियों में कल्पनाशीलता और आध्यात्मिक समझ श्रेष्ठ रहेगी। साहित्य, जीव विज्ञान और कला में उत्कृष्ट सफलता के संकेत हैं।"
  }
};

const SANSKRIT_MANTRAS = {
  Mesh: {
    mantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
    transliteration: "Om Kraam Kreem Kroum Sah Bhaumaaya Namah",
    deity: "Mangal Dev / Lord Hanuman",
    meaning: "Salutations to Mars, the divine embodiment of boundless energy, heroic courage, and righteous triumph.",
    japa_count: "108 times at sunrise facing East"
  },
  Vrishabh: {
    mantra: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
    transliteration: "Om Draam Dreem Droum Sah Shukraaya Namah",
    deity: "Shukra Dev / Goddess Mahalakshmi",
    meaning: "Salutations to Venus, bestower of prosperity, harmonious bonds, artistic grace, and spiritual refinement.",
    japa_count: "108 times at dusk facing North-East"
  },
  Mithun: {
    mantra: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
    transliteration: "Om Braam Breem Broum Sah Budhaaya Namah",
    deity: "Budh Dev / Lord Vishnu",
    meaning: "Salutations to Mercury, the divine illuminator of intellect, speech, discriminative wisdom, and success.",
    japa_count: "108 times on Wednesday morning"
  },
  Kark: {
    mantra: "ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः",
    transliteration: "Om Shraam Shreem Shroum Sah Chandraaya Namah",
    deity: "Chandra Dev / Lord Shiva",
    meaning: "Salutations to the Moon, sovereign lord of emotional peace, inner calmness, intuition, and mental clarity.",
    japa_count: "108 times in the evening"
  },
  Singh: {
    mantra: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
    transliteration: "Om Hraam Hreem Hroum Sah Suryaaya Namah",
    deity: "Surya Bhagavan / Lord Rama",
    meaning: "Salutations to the Sun, source of universal vitality, spiritual illumination, and righteous sovereignty.",
    japa_count: "108 times at sunrise with water offering (Arghya)"
  },
  Kanya: {
    mantra: "ॐ बुं बुधाय नमः",
    transliteration: "Om Bum Budhaaya Namah",
    deity: "Budh Dev / Lord Ganesha",
    meaning: "Salutations to Mercury and Lord Ganesha, removers of obstacles and granters of analytical brilliance.",
    japa_count: "108 times in the morning"
  },
  Tula: {
    mantra: "ॐ शुं शुक्राय नमः",
    transliteration: "Om Shum Shukraaya Namah",
    deity: "Shukra Dev / Goddess Lakshmi",
    meaning: "Salutations to Venus, grantor of equitable relationships, serene charm, and refined abundance.",
    japa_count: "108 times on Friday evening"
  },
  Vrischik: {
    mantra: "ॐ अं अंगारकाय नमः",
    transliteration: "Om Am Angaarakaaya Namah",
    deity: "Mangal Dev / Lord Kartikeya",
    meaning: "Salutations to Mars, granter of deep protective vitality, resilience, and inner spiritual power.",
    japa_count: "108 times on Tuesday morning"
  },
  Dhanu: {
    mantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
    transliteration: "Om Graam Greem Groum Sah Gurave Namah",
    deity: "Guru Brihaspati / Lord Narayana",
    meaning: "Salutations to Jupiter, supreme divine preceptor, source of higher wisdom, dharma, and expansion.",
    japa_count: "108 times on Thursday morning"
  },
  Makar: {
    mantra: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
    transliteration: "Om Praam Preem Proum Sah Shanaishcharaaya Namah",
    deity: "Shani Dev / Lord Shiva",
    meaning: "Salutations to Saturn, guardian of justice, steadfast patience, humility, and karmic maturity.",
    japa_count: "108 times on Saturday evening with mustard oil lamp"
  },
  Kumbh: {
    mantra: "ॐ शं शनैश्चराय नमः",
    transliteration: "Om Sham Shanaishcharaaya Namah",
    deity: "Shani Dev / Lord Hanuman",
    meaning: "Salutations to Saturn, bestower of universal compassion, visionary detachment, and enduring resilience.",
    japa_count: "108 times after sunset"
  },
  Meen: {
    mantra: "ॐ बृं बृहस्पतये नमः",
    transliteration: "Om Breem Brihaspataye Namah",
    deity: "Guru Brihaspati / Lord Vishnu",
    meaning: "Salutations to Jupiter, guiding consciousness toward compassionate grace, intuition, and spiritual moksha.",
    japa_count: "108 times on Thursday morning"
  }
};

const VEDIC_REMEDIES = {
  Mesh: [
    { type: "Mantra Japa", title: "Hanuman Chalisa", description: "Recite the Hanuman Chalisa or Mangal Beej Mantra once in the morning to channel vitality into constructive action." },
    { type: "Dāna (Charity)", title: "Red Lentils / Jaggery", description: "Donate red lentils (Masoor dal) or jaggery to sanitation workers or those in need on Tuesday." },
    { type: "Lifestyle & Upay", title: "Surya Arghya", description: "Offer clean water to the rising sun from a copper vessel with sincere reverence for physical vitality." }
  ],
  Vrishabh: [
    { type: "Mantra Japa", title: "Sri Suktam", description: "Chant Sri Suktam or the Shukra Gayatri Mantra at dusk to welcome harmonious energy into your domestic sphere." },
    { type: "Dāna (Charity)", title: "White Food Offering", description: "Donate white rice, pure milk, or sweets to a community kitchen on Friday." },
    { type: "Lifestyle & Upay", title: "Fragrant Aura", description: "Use pure sandalwood or natural floral attar; practice gratitude before meals to honor mother nature." }
  ],
  Mithun: [
    { type: "Mantra Japa", title: "Vishnu Sahasranama", description: "Recite Om Namo Bhagavate Vasudevaya or Budh Beej Mantra 108 times to sharpen intellect and clear speech." },
    { type: "Dāna (Charity)", title: "Green Feed to Cows", description: "Feed fresh green fodder, spinach, or green fruits to cows or birds on Wednesday." },
    { type: "Lifestyle & Upay", title: "Tulsi Parikrama", description: "Water a sacred Tulsi plant daily and observe 15 minutes of silent mindfulness away from digital screens." }
  ],
  Kark: [
    { type: "Mantra Japa", title: "Maha Mrityunjaya / Shiva Japa", description: "Chant 'Om Namah Shivaya' 108 times with measured deep breathing to soothe emotional fluctuations." },
    { type: "Dāna (Charity)", title: "Drinking Water / Milk", description: "Offer clean drinking water, milk, or silver coins to elderly travelers or community shrines on Monday." },
    { type: "Lifestyle & Upay", title: "Silver Vessel", description: "Drink drinking water kept overnight in a silver vessel; respect and seek the blessings of your mother." }
  ],
  Singh: [
    { type: "Mantra Japa", title: "Aditya Hridaya Stotra", description: "Chant the Aditya Hridaya Stotra or Gayatri Mantra facing the morning sunrise for sovereign clarity." },
    { type: "Dāna (Charity)", title: "Wheat & Jaggery", description: "Donate whole wheat grain, jaggery, or copper kitchenware on Sunday to support social nourishment." },
    { type: "Lifestyle & Upay", title: "Fatherly Respect", description: "Seek blessings from father figures and mentors; practice 12 rounds of mindful Surya Namaskar." }
  ],
  Kanya: [
    { type: "Mantra Japa", title: "Sankat Nashan Ganesha", description: "Recite Ganesha Atharvashirsha on Wednesday morning to dissolve analytical worry and mental anxiety." },
    { type: "Dāna (Charity)", title: "Educational Stationery", description: "Donate notebooks, books, or green educational pens to deserving underprivileged students." },
    { type: "Lifestyle & Upay", title: "Nature Grounding", description: "Walk barefoot on natural green grass in the morning; keep your workspace meticulously organized." }
  ],
  Tula: [
    { type: "Mantra Japa", title: "Mahalakshmi Ashtakam", description: "Chant Mahalakshmi Ashtakam on Friday evening while lighting a pure cow ghee lamp." },
    { type: "Dāna (Charity)", title: "Kanya Pujan / Silk Cloth", description: "Offer wholesome meals or modest silk apparel to young girls or women in need on Friday." },
    { type: "Lifestyle & Upay", title: "Equanimity Practice", description: "Avoid harsh words in intimate relationships; wear clean, dignified white or pastel attire." }
  ],
  Vrischik: [
    { type: "Mantra Japa", title: "Subrahmanya Ashtakam", description: "Chant Om Saravanabhavaya Namah or Hanuman Bahuk for unwavering inner courage and spiritual shield." },
    { type: "Dāna (Charity)", title: "Warm Blankets / Blood Donation", description: "Donate warm blankets, medical aid, or red cloth to those facing hardship on Tuesdays." },
    { type: "Lifestyle & Upay", title: "Pranayama & Truth", description: "Practice Anulom-Vilom pranayama; practice transparent truthfulness to release subconscious grudges." }
  ],
  Dhanu: [
    { type: "Mantra Japa", title: "Guru Beej Mantra", description: "Chant Om Graam Greem Groum Sah Gurave Namah 108 times with a turmeric mala on Thursday." },
    { type: "Dāna (Charity)", title: "Yellow Dal / Holy Books", description: "Donate yellow split lentils (Chana dal), yellow bananas, or spiritual philosophy books on Thursday." },
    { type: "Lifestyle & Upay", title: "Tilak & Dharma", description: "Apply a modest yellow Chandan or saffron tilak on the forehead; honor spiritual teachers and Gurus." }
  ],
  Makar: [
    { type: "Mantra Japa", title: "Dashratha Shani Stotra", description: "Recite the Dashratha Shani Stotra on Saturday twilight to balance karmic weight with divine grace." },
    { type: "Dāna (Charity)", title: "Black Sesame & Mustard Oil", description: "Donate mustard oil, black sesame seeds, or iron utensils to hardworking daily laborers on Saturday." },
    { type: "Lifestyle & Upay", title: "Selfless Service (Seva)", description: "Feed stray dogs or crows with roti; practice punctuality and humility in all professional dealings." }
  ],
  Kumbh: [
    { type: "Mantra Japa", title: "Shani Beej Mantra", description: "Chant Om Sham Shanaishcharaaya Namah while lighting a sesame oil lamp near a Peepal tree on Saturday." },
    { type: "Dāna (Charity)", title: "Footwear / Winter Clothes", description: "Donate sturdy shoes, umbrellas, or blankets to elderly laborers or disabled individuals." },
    { type: "Lifestyle & Upay", title: "Community Welfare", description: "Engage in selfless humanitarian community service; cultivate unconditional kindness for all beings." }
  ],
  Meen: [
    { type: "Mantra Japa", title: "Vishnu Gayatri Mantra", description: "Chant Om Narayanaya Vidmahe Vasudevaya Dheemahi Tanno Vishnuh Prachodayat on Thursday." },
    { type: "Dāna (Charity)", title: "Yellow Sweets / Turmeric", description: "Donate turmeric, raw honey, or yellow sweets to traditional Vedic pathshalas or temples." },
    { type: "Lifestyle & Upay", title: "Sacred Water Meditation", description: "Spend time near clean, peaceful natural water bodies; practice quiet forgiveness and detachment." }
  ]
};

const GOCHAR_TRANSITS = {
  saturn: { planet: "Shani (Saturn)", sign: "Kumbh (Aquarius)", status: "Moolatrikona / Direct", guidance: "Saturn demands disciplined service, structured patience, and authentic karmic integrity." },
  jupiter: { planet: "Guru (Jupiter)", sign: "Vrishabh (Taurus)", status: "Direct & Expansive", guidance: "Jupiter enriches tangible stability, thoughtful investment, family wisdom, and ethical growth." },
  rahu: { planet: "Rahu", sign: "Meen (Pisces)", status: "Retrograde", guidance: "Rahu expands intuitive imagination and foreign prospects; navigate illusions with discernment." },
  ketu: { planet: "Ketu", sign: "Kanya (Virgo)", status: "Retrograde", guidance: "Ketu promotes spiritual detachment, critical refinement, and holistic healing." }
};

function calculateShubhMuhurat(dateStr) {
  // Deterministic calculation based on date hash
  const d = new Date(dateStr || Date.now());
  const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  // Standard Abhijit Muhurat: roughly 11:48 AM to 12:38 PM
  const abhijit = "11:48 AM – 12:38 PM";
  
  // Amrit Kaal shifts deterministically based on weekday
  const amritWindows = [
    "02:15 PM – 03:45 PM", // Sun
    "09:30 AM – 11:00 AM", // Mon
    "03:40 PM – 05:10 PM", // Tue
    "10:15 AM – 11:45 AM", // Wed
    "01:30 PM – 03:00 PM", // Thu
    "04:20 PM – 05:50 PM", // Fri
    "07:30 AM – 09:00 AM"  // Sat
  ];

  const brahmaMuhurta = "04:24 AM – 05:12 AM";

  return {
    abhijit_muhurat: abhijit,
    amrit_kaal: amritWindows[day] || "02:15 PM – 03:45 PM",
    brahma_muhurta: brahmaMuhurta,
    best_window: `${abhijit} (Abhijit Muhurat)`
  };
}

function calculateGocharForMoon(moonSignKey) {
  const meta = RASHI_DATA[moonSignKey] || RASHI_DATA["Mithun"];
  return {
    moon_sign: meta.englishName,
    saturn_transit: `Shani transits in Kumbh: Rewards patience and disciplined effort for ${meta.englishName}.`,
    jupiter_transit: `Guru transits in Vrishabh: Favorable planetary aspects bring moral clarity, intellectual expansion, and protective grace.`,
    rahu_ketu_axis: `Rahu in Meen and Ketu in Kanya sharpen intuition while urging practical groundedness in daily tasks.`,
    summary: `Benefic transits of Jupiter harmonize karmic lessons from Saturn, making steady, honest endeavor fruitful.`
  };
}

/**
 * Core Rashi Fal prediction generator — Comprehensive Vedic Jyotish System.
 */
function generateRashiFal({
  rashi,
  date,
  timeframe = "daily",
  intent = null,
  language = "en",
  signType = "chandra",
  lagna = null,
  surya = null,
  chandra = null,
  name = "",
  dob = "",
  tob = "",
  pob = ""
} = {}) {
  // Resolve primary sign based on signType priority
  const st = String(signType || "chandra").toLowerCase();

  // If DOB is provided and signs are not explicitly passed, infer them
  let inferredKundli = null;
  let chandraCandidate = chandra || rashi;
  let lagnaCandidate = lagna || rashi;
  let suryaCandidate = surya || rashi;

  if (dob) {
    const inferred = inferRashiFromDOB(dob, tob);
    if (!inferred.error) {
      inferredKundli = inferred;
      if (!chandra && !rashi) chandraCandidate = inferred.chandra_rashi.key;
      if (!surya) suryaCandidate = inferred.surya_rashi.key;
      if (!lagna) lagnaCandidate = inferred.lagna_rashi.key;
    }
  }

  // Normalize all three signs
  const chandraKey = normalizeRashiName(chandraCandidate);
  const lagnaKey   = normalizeRashiName(lagnaCandidate);
  const suryaKey   = normalizeRashiName(suryaCandidate);

  // The primary sign drives the prediction library and seed
  let primaryKey;
  if (st === "lagna" || st === "ascendant") {
    primaryKey = lagnaKey;
  } else if (st === "surya" || st === "sun") {
    primaryKey = suryaKey;
  } else {
    primaryKey = chandraKey;
  }

  const normalizedDate = normalizeDate(date);
  const scope = (timeframe || "daily").toLowerCase();
  const lang  = String(language || "en").toLowerCase().trim();

  // Deterministic seeds — each sign gets its own seed offset
  const seedPrimary = getAstrologicalSeed(primaryKey,  normalizedDate, scope);
  const seedLagna   = getAstrologicalSeed(lagnaKey,    normalizedDate, scope);
  const seedChandra = getAstrologicalSeed(chandraKey,  normalizedDate, scope);
  const seedSurya   = getAstrologicalSeed(suryaKey,    normalizedDate, scope);

  const primaryInfo  = RASHI_DATA[primaryKey]  || RASHI_DATA["Mithun"];
  const lagnaInfo    = RASHI_DATA[lagnaKey]    || primaryInfo;
  const chandraInfo  = RASHI_DATA[chandraKey]  || primaryInfo;
  const suryaInfo    = RASHI_DATA[suryaKey]    || primaryInfo;

  const libPrimary  = PREDICTION_LIBRARY[primaryKey]  || PREDICTION_LIBRARY["Mithun"];
  const libLagna    = PREDICTION_LIBRARY[lagnaKey]    || PREDICTION_LIBRARY["Mithun"];
  const libChandra  = PREDICTION_LIBRARY[chandraKey]  || PREDICTION_LIBRARY["Mithun"];
  const libSurya    = PREDICTION_LIBRARY[suryaKey]    || PREDICTION_LIBRARY["Mithun"];

  // ── Pull raw text per scope ──────────────────────────────────────────────
  function pullDaily(lib, seed, field, offset) {
    const set = lib.daily[field];
    return Array.isArray(set) ? set[(seed + offset) % set.length] : "";
  }

  let overallText, careerText, loveText, financeText, healthText, tipText;

  if (scope === "weekly") {
    overallText  = libPrimary.weekly.overall;
    careerText   = libPrimary.weekly.career;
    loveText     = libPrimary.weekly.love;
    financeText  = libPrimary.weekly.finance;
    healthText   = libPrimary.weekly.health;
    tipText      = libPrimary.weekly.tips;
  } else if (scope === "monthly") {
    overallText  = libPrimary.monthly.overall;
    careerText   = libPrimary.monthly.career;
    loveText     = libPrimary.monthly.love;
    financeText  = libPrimary.monthly.finance;
    healthText   = libPrimary.monthly.health;
    tipText      = libPrimary.monthly.tips;
  } else {
    overallText  = pullDaily(libPrimary,  seedPrimary,  "overall",  0);
    careerText   = pullDaily(libPrimary,  seedPrimary,  "career",   1);
    loveText     = pullDaily(libChandra,  seedChandra,  "love",     2);
    financeText  = pullDaily(libPrimary,  seedPrimary,  "finance",  3);
    healthText   = pullDaily(libPrimary,  seedPrimary,  "health",   4);
    tipText      = pullDaily(libPrimary,  seedPrimary,  "tips",     0);
  }

  // ── Three-sign composite insights ───────────────────────────────────────
  // personality_insight → driven by Lagna (outer personality & direction)
  const lagnaTraits = lagnaInfo.traits ? lagnaInfo.traits.strengths : lagnaInfo.nature;
  const lagnaGrowth = lagnaInfo.traits ? lagnaInfo.traits.growthArea : "";
  const personalityInsight = (
    `Your ${lagnaInfo.englishName} Lagna bestows ${lagnaTraits}. ` +
    `${lagnaInfo.planetaryInfluence} ` +
    (lagnaGrowth ? `Growth area: ${lagnaGrowth}.` : "")
  ).trim();

  // emotional_state → driven by Chandra Rashi (inner mind & feelings)
  const chandraTraits = chandraInfo.traits ? chandraInfo.traits.strengths : chandraInfo.nature;
  const emotionalState = (
    `With ${chandraInfo.englishName} Chandra Rashi, your inner world is ${chandraTraits}. ` +
    `${chandraInfo.planetaryInfluence}`
  ).trim();

  // daily_guidance → blend of all three signs via seed-derived library text
  const suryaTraits = suryaInfo.traits ? suryaInfo.traits.strengths : suryaInfo.nature;
  const dailyGuidance = (
    `Today's ${scope} energy: ` + overallText +
    ` Your Sun in ${suryaInfo.englishName} amplifies ${suryaTraits} — trust this strength.`
  ).trim();

  // ── Intent personalisation ──────────────────────────────────────────────
  if (intent) {
    const ci = String(intent).toLowerCase().trim();
    if (ci === "career" || ci === "job" || ci === "business") {
      tipText = `Career focus: ${careerText} ${tipText}`;
    } else if (ci === "love" || ci === "relationship" || ci === "marriage") {
      tipText = `Relationship focus: ${loveText} ${tipText}`;
    } else if (ci === "finance" || ci === "money" || ci === "wealth") {
      tipText = `Financial focus: ${financeText} ${tipText}`;
    } else if (ci === "health" || ci === "wellness") {
      tipText = `Wellness focus: ${healthText} ${tipText}`;
    }
  }

  // ── Lucky attributes (from primary sign) ────────────────────────────────
  let luckyColor  = primaryInfo.luckyColors[seedPrimary % primaryInfo.luckyColors.length];
  const luckyNumber = primaryInfo.luckyNumbers[seedPrimary % primaryInfo.luckyNumbers.length];

  // ── Multilingual localisation ────────────────────────────────────────────
  let personalityInsightFinal = personalityInsight;
  let emotionalStateFinal     = emotionalState;
  let dailyGuidanceFinal      = dailyGuidance;

  if (lang !== "en" && MULTILINGUAL_DATA.pillars[lang]) {
    const p = MULTILINGUAL_DATA.pillars[lang];
    overallText  = p.overall[seedPrimary % p.overall.length];
    careerText   = p.career[(seedPrimary + 1) % p.career.length];
    loveText     = p.love[(seedChandra + 2) % p.love.length];
    financeText  = p.finance[(seedPrimary + 3) % p.finance.length];
    healthText   = p.health[(seedPrimary + 4) % p.health.length];
    tipText      = p.tip[seedPrimary % p.tip.length];

    if (MULTILINGUAL_DATA.colors[luckyColor] && MULTILINGUAL_DATA.colors[luckyColor][lang]) {
      luckyColor = MULTILINGUAL_DATA.colors[luckyColor][lang];
    }

    // Localize 3-sign insight fields if translations exist
    const ins = MULTILINGUAL_DATA.insights && MULTILINGUAL_DATA.insights[lang];
    if (ins) {
      if (ins.personality && ins.personality[lagnaKey]) {
        personalityInsightFinal = ins.personality[lagnaKey];
      }
      if (ins.emotional && ins.emotional[chandraKey]) {
        emotionalStateFinal = ins.emotional[chandraKey];
      }
      if (ins.guidance && ins.guidance[primaryKey]) {
        // Combine localized guidance with localized overall
        dailyGuidanceFinal = ins.guidance[primaryKey] + " " + overallText;
      }
    }
  }

  // ── Jyotish 8 Pillars Extensions ─────────────────────────────────────────
  // Education & Learning Focus
  const educationObj = EDUCATION_DATA[primaryKey] || EDUCATION_DATA["Mithun"];
  const educationText = (lang === "hi" && educationObj.hi) ? educationObj.hi : (educationObj.en || educationObj);

  // Vedic Remedies (Upay)
  const remediesList = VEDIC_REMEDIES[primaryKey] || VEDIC_REMEDIES["Mithun"];

  // Auspicious Timing (Shubh Muhurat)
  const shubhMuhurat = calculateShubhMuhurat(normalizedDate);

  // Sacred Sanskrit Mantra
  const mantraObj = SANSKRIT_MANTRAS[primaryKey] || SANSKRIT_MANTRAS["Mithun"];

  // Key Planetary Transits (Gochar for Moon Sign)
  const gocharData = calculateGocharForMoon(chandraKey);

  // Personalized Greeting
  const cleanName = name ? String(name).trim() : "";
  const greeting = cleanName ? `Namaste, ${cleanName} ji! Blessed astrological insights and Jyotish guidance for your journey:` : null;

  // ── Sign-type label ──────────────────────────────────────────────────────
  const signTypeLabel = "Chandra Rashi (Moon Sign)";

  // ── Final output — expanded three-sign schema with 8 Pillars ─────────────
  const output = {
    type:          "daily",
    // Identity
    rashi:         primaryKey,
    lagna:         lagnaKey,
    surya_rashi:   suryaKey,
    chandra_rashi: chandraKey,
    date:          normalizedDate,
    timeframe:     scope,
    sign_basis:    signTypeLabel,

    // 3-Sign Composite Insights
    personality_insight: personalityInsightFinal,
    emotional_state:     emotionalStateFinal,
    daily_guidance:      dailyGuidanceFinal,

    // 8 Structured Pillars:
    // 1. Overview
    overview:               overallText,
    // 2. Career & Business
    career_focus:           careerText,
    career_and_business:    careerText,
    // 3. Finance
    finance_wisdom:         financeText,
    finance:                financeText,
    // 4. Love & Relationships
    love_harmony:           loveText,
    love_and_relationships: loveText,
    // 5. Health
    health_vitality:        healthText,
    health:                 healthText,
    // 6. Education (for students)
    education_focus:        educationText,
    education:              educationText,
    // 7. Remedies (Upay)
    remedies:               remediesList,
    // 8. Luck Factors
    lucky_color:            luckyColor,
    lucky_number:           luckyNumber,
    shubh_muhurat:          shubhMuhurat.best_window,
    shubh_details:          shubhMuhurat,
    cosmic_tip:             tipText,

    // Vedic Enhancements
    sanskrit_mantra:       mantraObj,
    gochar:                gocharData,
    personalized_greeting: greeting,
    user_input: {
      name: cleanName || null,
      dob: dob || null,
      tob: tob || null,
      pob: pob || null
    },
    inferred_kundli: inferredKundli,

    // Legacy compatibility fields (mirrors above for older UI consumers)
    overall:  overallText,
    career:   careerText,
    love:     loveText,
    finance:  financeText,
    health:   healthText,
    tip:      tipText
  };

  if (lang !== "en") {
    output.language = lang;
    if (MULTILINGUAL_DATA.names[primaryKey] && MULTILINGUAL_DATA.names[primaryKey][lang]) {
      output.rashi_localized = MULTILINGUAL_DATA.names[primaryKey][lang];
    }
  }

  return output;
}


/**
 * Advanced Feature: Infer Lagna (Ascendant), Surya Rashi (Sun Sign), and Chandra Rashi (Moon Sign) from DOB & Time
 */
function inferRashiFromDOB(dobString, timeString = "") {
  if (!dobString) {
    return { error: "Please provide a valid Date of Birth (YYYY-MM-DD or DD-MM-YYYY)." };
  }

  let day, month, year;
  const parts = dobString.split(/[-/.]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else {
      // DD-MM-YYYY
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    }
  } else {
    const d = new Date(dobString);
    if (isNaN(d.getTime())) {
      return { error: "Invalid date format. Use YYYY-MM-DD or DD-MM-YYYY." };
    }
    day = d.getDate();
    month = d.getMonth() + 1;
    year = d.getFullYear();
  }

  const rashisList = [
    "Mesh", "Vrishabh", "Mithun", "Kark", "Singh", "Kanya",
    "Tula", "Vrischik", "Dhanu", "Makar", "Kumbh", "Meen"
  ];

  // 1. Surya Rashi (Sidereal Sun sign calculation)
  let sunIndex = 0;
  if ((month === 4 && day >= 14) || (month === 5 && day <= 14)) sunIndex = 0; // Mesh
  else if ((month === 5 && day >= 15) || (month === 6 && day <= 14)) sunIndex = 1; // Vrishabh
  else if ((month === 6 && day >= 15) || (month === 7 && day <= 15)) sunIndex = 2; // Mithun
  else if ((month === 7 && day >= 16) || (month === 8 && day <= 16)) sunIndex = 3; // Kark
  else if ((month === 8 && day >= 17) || (month === 9 && day <= 16)) sunIndex = 4; // Singh
  else if ((month === 9 && day >= 17) || (month === 10 && day <= 16)) sunIndex = 5; // Kanya
  else if ((month === 10 && day >= 17) || (month === 11 && day <= 15)) sunIndex = 6; // Tula
  else if ((month === 11 && day >= 16) || (month === 12 && day <= 15)) sunIndex = 7; // Vrischik
  else if ((month === 12 && day >= 16) || (month === 1 && day <= 13)) sunIndex = 8; // Dhanu
  else if ((month === 1 && day >= 14) || (month === 2 && day <= 12)) sunIndex = 9; // Makar
  else if ((month === 2 && day >= 13) || (month === 3 && day <= 13)) sunIndex = 10; // Kumbh
  else sunIndex = 11; // Meen

  const suryaRashi = rashisList[sunIndex];

  // 2. Lagna (Ascendant / Rising Sign calculation based on time of birth)
  // At sunrise (~6:00 AM), Lagna matches Surya Rashi. Every 2 hours, Lagna advances 1 sign.
  let birthHour = 6; // default sunrise
  let birthMinute = 0;
  if (timeString) {
    const tParts = timeString.split(":");
    if (tParts.length >= 2) {
      birthHour = parseInt(tParts[0], 10) || 6;
      birthMinute = parseInt(tParts[1], 10) || 0;
    }
  }
  const hoursAfterSunrise = (birthHour + birthMinute / 60 - 6 + 24) % 24;
  const lagnaShift = Math.floor(hoursAfterSunrise / 2);
  const lagnaIndex = (sunIndex + lagnaShift) % 12;
  const lagnaRashi = rashisList[lagnaIndex];

  // 3. Chandra Rashi (Moon Sign estimation)
  // Moon shifts 1 sign every ~2.25 days. Calculate day of year offset.
  const dayOfYear = Math.floor((month - 1) * 30.43 + day);
  const chandraShift = Math.floor((dayOfYear * 13.36) / 30) % 12;
  const chandraIndex = (sunIndex + chandraShift) % 12;
  const chandraRashi = rashisList[chandraIndex];

  const suryaMeta = RASHI_DATA[suryaRashi];
  const lagnaMeta = RASHI_DATA[lagnaRashi];
  const chandraMeta = RASHI_DATA[chandraRashi];

  return {
    dob: `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`,
    time_of_birth: timeString || "06:00 (Estimated Sunrise)",
    inferred_rashi: suryaRashi, // Sidereal Solar Ingress sign
    surya_rashi: {
      key: suryaRashi,
      english: suryaMeta.englishName,
      sanskrit: suryaMeta.sanskritName,
      lord: suryaMeta.lord,
      element: suryaMeta.element
    },
    lagna_rashi: {
      key: lagnaRashi,
      english: lagnaMeta.englishName,
      sanskrit: lagnaMeta.sanskritName,
      lord: lagnaMeta.lord,
      element: lagnaMeta.element
    },
    chandra_rashi: {
      key: chandraRashi,
      english: chandraMeta.englishName,
      sanskrit: chandraMeta.sanskritName,
      lord: chandraMeta.lord,
      element: chandraMeta.element
    },
    note: "Vedic Sidereal calculation: Janma Chandra Rashi (Moon Sign) transit analysis."
  };
}

/**
 * Advanced Feature: Vedic Astrology Compatibility between two Rashis
 */
function compareCompatibility(rashi1, rashi2) {
  const norm1 = normalizeRashiName(rashi1);
  const norm2 = normalizeRashiName(rashi2);
  const info1 = RASHI_DATA[norm1];
  const info2 = RASHI_DATA[norm2];

  const elementMap = {
    "Agni (Fire)": "Fire",
    "Prithvi (Earth)": "Earth",
    "Vayu (Air)": "Air",
    "Jal (Water)": "Water"
  };

  const elem1 = elementMap[info1.element];
  const elem2 = elementMap[info2.element];

  // Elemental harmony table
  let harmonyScore = 75;
  let dynamicSummary = "";

  if (elem1 === elem2) {
    harmonyScore = 90;
    dynamicSummary = `Both share the ${elem1} element, giving them immediate mutual understanding, shared pace, and effortless empathy.`;
  } else if (
    (elem1 === "Fire" && elem2 === "Air") ||
    (elem1 === "Air" && elem2 === "Fire")
  ) {
    harmonyScore = 88;
    dynamicSummary = "Fire and Air invigorate one another. Ideas spark enthusiasm, creating an inspiring and dynamic partnership.";
  } else if (
    (elem1 === "Earth" && elem2 === "Water") ||
    (elem1 === "Water" && elem2 === "Earth")
  ) {
    harmonyScore = 92;
    dynamicSummary = "Earth and Water form a deeply nourishing bond. Stability and emotional tenderness support mutual growth.";
  } else if (
    (elem1 === "Fire" && elem2 === "Water") ||
    (elem1 === "Water" && elem2 === "Fire")
  ) {
    harmonyScore = 68;
    dynamicSummary = "Fire and Water bring intense passion and emotional depth, but require patient dialogue to avoid steam.";
  } else if (
    (elem1 === "Air" && elem2 === "Earth") ||
    (elem1 === "Earth" && elem2 === "Air")
  ) {
    harmonyScore = 72;
    dynamicSummary = "Air brings visionary ideas while Earth builds structure. Practical collaboration bridges different speeds.";
  } else {
    harmonyScore = 70;
    dynamicSummary = "Complementary traits provide fertile ground for mutual learning and maturity.";
  }

  // Ruling planet relationship boost
  if (info1.lord.split(" ")[0] === info2.lord.split(" ")[0]) {
    harmonyScore = Math.min(harmonyScore + 5, 96);
  }

  return {
    rashi1: {
      name: norm1,
      english: info1.englishName,
      element: info1.element,
      lord: info1.lord
    },
    rashi2: {
      name: norm2,
      english: info2.englishName,
      element: info2.element,
      lord: info2.lord
    },
    compatibility_score: `${harmonyScore}%`,
    rating: harmonyScore >= 85 ? "Excellent Harmony" : harmonyScore >= 75 ? "Very Good Compatibility" : "Moderate Harmony with Growth",
    elemental_dynamic: dynamicSummary,
    advice: `Focus on appreciating each other's natural rhythm: ${info1.englishName}'s ${info1.nature} nature blends best with ${info2.englishName}'s ${info2.nature} qualities when mutual respect is prioritized.`
  };
}

// ============================================================================
// ADVANCED VEDIC ASTROLOGY AI SYSTEM
// Supports Mode 1 (Daily Horoscope), Mode 2 (Sun Sign Analysis),
// and Mode 3 (Full Kundli Summary) with exact strict JSON schemas.
// ============================================================================

const SUN_ANALYSIS_DATA = {
  Mesh: {
    core_personality: "A pioneering fire spirit fueled by Mars, carrying boundless initiative, directness, and courageous resolve.",
    strengths: ["Pioneering vision", "Fearless determination", "Inspirational vitality", "Decisive initiative"],
    weaknesses: ["Impulsive reactions", "Restlessness with slow pace", "Resistance to compromise"],
    career_tendency: "Commands success in entrepreneurship, engineering, crisis management, leadership, and competitive innovation.",
    leadership_style: "Leads from the front line with energetic boldness, inspiring immediate action over lengthy deliberation.",
    love_style: "Passionate, upfront, and fiercely protective; values a partner who respects their sovereign independence.",
    growth_advice: "Cultivate strategic patience and reflective listening to transform spontaneous sparks into lasting triumphs."
  },
  Vrishabh: {
    core_personality: "A grounded Venusian sanctuary of steadfast endurance, practical sensibility, and refined appreciation for beauty and lasting worth.",
    strengths: ["Steadfast loyalty", "Exceptional patience", "Financial pragmatism", "Sensory refinement"],
    weaknesses: ["Resistance to change", "Possessiveness", "Over-attachment to comfort"],
    career_tendency: "Excels in finance, luxury arts, real estate, architecture, design, and sustained asset management.",
    leadership_style: "Leads with calm methodical stability, creating reliable systems and trustworthy security for teams.",
    love_style: "Deeply affectionate, loyal, and tactile; builds relationships slowly on pillars of mutual trust and peaceful comfort.",
    growth_advice: "Embrace purposeful change as natural growth rather than a threat to your security."
  },
  Mithun: {
    core_personality: "A mercurial intellectual explorer driven by insatiable curiosity, quick wit, and multifaceted social adaptability.",
    strengths: ["Intellectual versatility", "Articulate eloquence", "Rapid learning", "Diplomatic charm"],
    weaknesses: ["Scattered focus", "Nervous restlessness", "Superficial detachment under stress"],
    career_tendency: "Shines in media, communications, technology, journalism, commerce, and strategic negotiation.",
    leadership_style: "Leads through open information exchange, collaborative brainstorming, and agile problem solving.",
    love_style: "Requires lively mental stimulation, engaging conversations, and playful companionship with mutual freedom.",
    growth_advice: "Focus your vibrant mental energy on one high-impact goal at a time to achieve monumental mastery."
  },
  Kark: {
    core_personality: "A deeply intuitive, lunar-guided soul imbued with protective empathy, profound emotional memory, and nurturing wisdom.",
    strengths: ["Empathetic intuition", "Tenacious protection", "Emotional resilience", "Nurturing wisdom"],
    weaknesses: ["Defensive mood shifts", "Clinging to past grievances", "Over-sensitivity to criticism"],
    career_tendency: "Excels in healthcare, counseling, culinary arts, education, real estate, and human-centric leadership.",
    leadership_style: "Leads with empathetic mentorship, prioritizing psychological safety, team unity, and familial trust.",
    love_style: "Devoted and deeply affectionate; seeks soulful emotional security and an unconditionally safe haven.",
    growth_advice: "Practice healthy emotional boundaries and let go of bygone hurts to liberate your creative genius."
  },
  Singh: {
    core_personality: "A radiant solar monarch endowed with natural dignity, magnanimous warmth, and a dramatic creative flair.",
    strengths: ["Inspirational charisma", "Noble generosity", "Unyielding loyalty", "Creative vitality"],
    weaknesses: ["Vulnerability to pride", "Reluctance to delegate", "Impatience when excitement is not matched"],
    career_tendency: "Thrives in executive management, performing arts, entrepreneurship, politics, and prestigious creative direction.",
    leadership_style: "Leads by majestic example and uplifting praise, infusing projects with royal passion and clear vision.",
    love_style: "Grand, romantic, and proudly devoted; thrives when honored and celebrated as their partner's treasure.",
    growth_advice: "Temper ego with humble receptivity, letting true inner confidence speak without requiring constant applause."
  },
  Kanya: {
    core_personality: "A disciplined, analytical craftsperson guided by Mercury, dedicated to purity, practical utility, and meticulous service.",
    strengths: ["Discerning intellect", "Methodical precision", "Selfless service", "Reliable problem solving"],
    weaknesses: ["Overthinking minor flaws", "Self-critical perfectionism", "Worry over uncontrollable factors"],
    career_tendency: "Excels in data analytics, medicine, editorial review, quality assurance, research, and holistic wellness.",
    leadership_style: "Leads with quiet efficiency, optimizing workflows and removing operational friction with surgical care.",
    love_style: "Shows love through tangible acts of helpfulness, considerate gestures, and honest intellectual bonding.",
    growth_advice: "Celebrate progress over unattainable perfection, allowing room for organic spontaneity and self-compassion."
  },
  Tula: {
    core_personality: "An aesthetic ambassador of Venus seeking balance, social harmony, justice, and refined interpersonal connection.",
    strengths: ["Diplomatic poise", "Impartial fairness", "Aesthetic discernment", "Harmonious charm"],
    weaknesses: ["Chronic indecision", "Avoiding constructive conflict", "People-pleasing at personal expense"],
    career_tendency: "Flourishes in legal advocacy, diplomacy, public relations, design, architecture, and luxury partnerships.",
    leadership_style: "Leads through consensus building, mutual compromise, and fostering an environment of dignified respect.",
    love_style: "Romantic, egalitarian, and attentive; blooms in partnership where balance and mutual admiration flourish.",
    growth_advice: "Trust your internal moral compass decisively, recognizing that healthy conflict often clarifies truth."
  },
  Vrischik: {
    core_personality: "An intense, perceptive mystic ruled by Mars and Ketu, possessing immense emotional willpower and transformative depth.",
    strengths: ["Penetrating intuition", "Fearless resilience", "Unwavering loyalty", "Transformative power"],
    weaknesses: ["Excessive suspicion", "Obsessive control", "Guarded emotional secrecy"],
    career_tendency: "Commands authority in investigative research, surgery, psychology, occult sciences, finance, and intelligence.",
    leadership_style: "Leads with strategic silence, decisive acumen, and magnetic presence that commands quiet respect.",
    love_style: "All-or-nothing emotional intensity, profound loyalty, and soulful intimacy that pierces superficial masks.",
    growth_advice: "Practice active forgiveness and emotional vulnerability, discovering that true strength lies in opening up."
  },
  Dhanu: {
    core_personality: "A philosophical, Jupiterian pilgrim blessed with cosmic optimism, truth-seeking curiosity, and expansive vision.",
    strengths: ["Philosophical breadth", "Uplifting optimism", "Honest courage", "Adventurous spirit"],
    weaknesses: ["Tactless bluntness", "Overpromising beyond limits", "Impatience with routine details"],
    career_tendency: "Thrives in higher education, international law, spiritual philosophy, publishing, travel, and coaching.",
    leadership_style: "Leads by painting the grand philosophical picture, inspiring teams to venture beyond comfort zones.",
    love_style: "Freedom-loving, cheerful, and intellectually honest; connects through shared adventures and philosophical quests.",
    growth_advice: "Anchor your grand ideals with methodical follow-through and conscious gentleness in speech."
  },
  Makar: {
    core_personality: "A steadfast, Saturnian architect of destiny, driven by patience, relentless endurance, and enduring legacy.",
    strengths: ["Iron discipline", "Strategic foresight", "Structural mastery", "Pragmatic integrity"],
    weaknesses: ["Pessimistic caution", "Emotional stiffness", "Workaholism at personal expense"],
    career_tendency: "Dominates in corporate executive roles, civil administration, civil engineering, finance, and industrial infrastructure.",
    leadership_style: "Leads through structured accountability, enduring calm under pressure, and setting benchmark standards.",
    love_style: "Reserved initially but exceptionally reliable; shows devotion through long-term loyalty and concrete support.",
    growth_advice: "Allow vulnerability and joy into your daily routine, remembering that life is to be lived, not just managed."
  },
  Kumbh: {
    core_personality: "A visionary humanitarian and intellectual rebel guided by Saturn and Rahu, championing progress and egalitarian truth.",
    strengths: ["Inventive genius", "Humanitarian ideals", "Original perspective", "Egalitarian fairness"],
    weaknesses: ["Emotional aloofness", "Stubborn contrarianism", "Dogmatic detachment"],
    career_tendency: "Leads revolutions in cutting-edge tech, scientific innovation, social reform, aerospace, and community movements.",
    leadership_style: "Leads democratically, empowering individual uniqueness while uniting people toward a futuristic mission.",
    love_style: "Unconventional, deeply intellectual, and friendship-first; values freedom, mental rapport, and shared ideals.",
    growth_advice: "Connect with personal emotions in the present moment instead of living solely in abstract mental futures."
  },
  Meen: {
    core_personality: "A boundless, Jupiterian ocean of mystic imagination, spiritual compassion, and transcendent sensitivity.",
    strengths: ["Spiritual empathy", "Boundless artistic imagination", "Deep intuition", "Selfless kindness"],
    weaknesses: ["Escapist tendencies", "Vague boundaries", "Idealizing reality to avoid harsh facts"],
    career_tendency: "Flourishes in cinema, creative arts, healing professions, marine pursuits, counseling, and poetry.",
    leadership_style: "Leads through compassionate intuition, inspiring teams through poetic vision and subtle psychic encouragement.",
    love_style: "Deeply romantic, selfless, and soulful; merges hearts and seeks divine unity with their partner.",
    growth_advice: "Ground your boundless oceanic sensitivity with practical disciplines, clear boundaries, and earthly routines."
  }
};

const SUN_ANALYSIS_DATA_HI = {
  Mesh: {
    core_personality: "मंगल की अग्नि से ओतप्रोत एक साहसी, अग्रणी आत्मा, जिसमें असीम ऊर्जा, स्पष्टता और दृढ़ निश्चय है।",
    strengths: ["अग्रणी दृष्टिकोण", "निर्भीक संकल्प", "प्रेरणादायक जीवंतता", "निर्णायक पहल"],
    weaknesses: ["आवेगी प्रतिक्रियाएं", "धीमी गति से अधीरता", "समझौते से बचना"],
    career_tendency: "उद्यमिता, इंजीनियरिंग, संकट प्रबंधन, नेतृत्व और नवाचार में सर्वोच्च सफलता प्राप्त करते हैं।",
    leadership_style: "आगे बढ़कर ऊर्जावान साहस के साथ नेतृत्व करते हैं और तुरंत कार्य करने की प्रेरणा देते हैं।",
    love_style: "उत्साही, मुखर और सुरक्षात्मक; अपने साथी से स्वतंत्रता और सम्मान की अपेक्षा रखते हैं।",
    growth_advice: "धैर्य और ध्यानपूर्वक सुनने की आदत डालें ताकि त्वरित विचार स्थायी सफलता में बदल सकें।"
  },
  Vrishabh: {
    core_personality: "शुक्र के प्रभाव से स्थिर, धैर्यवान और व्यावहारिक, जो सौंदर्य और स्थायी मूल्यों का सम्मान करते हैं।",
    strengths: ["अटूट निष्ठा", "अद्भुत धैर्य", "आर्थिक समझदारी", "कलात्मक रुचि"],
    weaknesses: ["बदलाव का विरोध", "अधिकार भावना", "आराम से अत्यधिक लगाव"],
    career_tendency: "वित्त, कला, रियल एस्टेट, वास्तुकला, डिजाइन और परिसंपत्ति प्रबंधन में उत्कृष्ट प्रदर्शन करते हैं।",
    leadership_style: "शांत, व्यवस्थित स्थिरता के साथ नेतृत्व करते हैं और टीम के लिए विश्वसनीय सुरक्षा बनाते हैं।",
    love_style: "गहरे स्नेही, निष्ठावान और सुखद; विश्वास और शांति के आधार पर संबंध बनाते हैं।",
    growth_advice: "सार्थक परिवर्तन को अपनी सुरक्षा के लिए खतरा मानने के बजाय स्वाभाविक विकास के रूप में स्वीकार करें।"
  },
  Mithun: {
    core_personality: "बुध के प्रभाव से तीव्र बुद्धि, हास्यबोध, जिज्ञासा और असाधारण संवाद कौशल वाले व्यक्तित्व।",
    strengths: ["बौद्धिक बहुमुखी प्रतिभा", "प्रभावी अभिव्यक्ति", "त्वरित सीखने की क्षमता", "कूटनीतिक आकर्षण"],
    weaknesses: ["बिखरा हुआ ध्यान", "मानसिक बेचैनी", "तनाव में सतहीपन"],
    career_tendency: "मीडिया, संचार, प्रौद्योगिकी, पत्रकारिता, व्यापार और रणनीतिक वार्ता में चमकते हैं।",
    leadership_style: "सूचनाओं के खुले आदान-प्रदान, सामूहिक विचार-विमर्श और त्वरित समाधान से नेतृत्व करते हैं।",
    love_style: "मानसिक तालमेल, रोचक बातचीत और आपसी स्वतंत्रता आधारित मित्रता पसंद करते हैं।",
    growth_advice: "अपनी ऊर्जा को एक समय में एक मुख्य लक्ष्य पर केंद्रित करें ताकि स्थायी उपलब्धियां मिल सकें।"
  },
  Kark: {
    core_personality: "चंद्रमा द्वारा संचालित गहरी संवेदनशीलता, सुरक्षात्मक ममता और अंतर्ज्ञान से परिपूर्ण व्यक्तित्व।",
    strengths: ["सहानुभूतिपूर्ण अंतर्ज्ञान", "सुरक्षात्मक निष्ठा", "भावनात्मक लचीलापन", "पोषण करने वाली समझ"],
    weaknesses: ["मनोदशा में त्वरित बदलाव", "पुरानी बातें न भूलना", "आलोचना के प्रति अत्यधिक संवेदनशीलता"],
    career_tendency: "स्वास्थ्य सेवा, परामर्श, शिक्षा, कला और मानव-केंद्रित नेतृत्व में सफलता पाते हैं।",
    leadership_style: "सहानुभूतिपूर्ण मार्गदर्शन और टीम की भावनात्मक सुरक्षा को प्राथमिकता देकर नेतृत्व करते हैं।",
    love_style: "समर्पित और गहरे स्नेही; भावनात्मक सुरक्षा और अटूट विश्वास की तलाश करते हैं।",
    growth_advice: "स्वस्थ भावनात्मक सीमाएं बनाएं और पुरानी बातों को छोड़कर अपनी रचनात्मक ऊर्जा को मुक्त करें।"
  },
  Singh: {
    core_personality: "सूर्य की महिमा से युक्त स्वाभाविक गरिमा, उदार हृदय और रचनात्मक आत्मविश्वास वाले व्यक्तित्व।",
    strengths: ["प्रेरणादायक आकर्षण", "उदार निष्ठा", "रचनात्मक साहस", "स्वाभाविक नेतृत्व"],
    weaknesses: ["अहंकार के प्रति संवेदनशीलता", "काम दूसरों को सौंपने में झिझक", "उत्साह की कमी पर अधीरता"],
    career_tendency: "प्रबंधन, अभिनय, राजनीति, उद्यमिता और प्रतिष्ठावान रचनात्मक क्षेत्रों में शीर्ष स्थान पाते हैं।",
    leadership_style: "उदात्त उदाहरण और प्रोत्साहन से नेतृत्व करते हैं, जिससे टीम में उत्साह और स्पष्टता आती है।",
    love_style: "भव्य, रोमांटिक और समर्पित; सम्मान और सच्ची निष्ठा की सराहना करते हैं।",
    growth_advice: "अहंकार को विनम्रता से संतुलित करें; सच्चा आत्मविश्वास दूसरों को सशक्त बनाने में झलकता है।"
  },
  Kanya: {
    core_personality: "बुध के प्रभाव से अनुशासित, विश्लेषणात्मक और व्यावहारिक, जो स्वच्छता और सेवा भावना के प्रति समर्पित हैं।",
    strengths: ["सूक्ष्म बुद्धि", "व्यवस्थित सटीकता", "निस्वार्थ सेवा", "समस्या समाधान कौशल"],
    weaknesses: ["छोटी कमियों पर अधिक सोचना", "आत्म-आलोचनात्मक पूर्णतावाद", "अनावश्यक चिंता"],
    career_tendency: "डेटा विश्लेषण, चिकित्सा, संपादन, गुणवत्ता नियंत्रण, अनुसंधान और स्वास्थ्य क्षेत्र में अग्रणी हैं।",
    leadership_style: "शांत कार्यकुशलता के साथ प्रक्रियाओं को सुगम और त्रुटिरहित बनाकर नेतृत्व करते हैं।",
    love_style: "मददगार कार्यों, विचारशील व्यवहार और ईमानदार बौद्धिक जुड़ाव से प्रेम व्यक्त करते हैं।",
    growth_advice: "असंभव पूर्णता की जगह प्रगति का आनंद लें और स्वयं के प्रति दयालुता रखें।"
  },
  Tula: {
    core_personality: "शुक्र के प्रभाव से संतुलन, सामाजिक सौहार्द, न्याय और सौंदर्य बोध के प्रतीक।",
    strengths: ["कूटनीतिक संतुलन", "निष्पक्ष न्यायप्रियता", "सौंदर्य बोध", "सौम्य आकर्षण"],
    weaknesses: ["निर्णय लेने में संकोच", "टकराव से बचना", "दूसरों को खुश करने में आत्म-हानि"],
    career_tendency: "विधि, कूटनीति, जनसंपर्क, फैशन, वास्तुकला और साझेदारी आधारित कार्यों में खिलते हैं।",
    leadership_style: "आम सहमति, सम्मानजनक संवाद और गरिमापूर्ण वातावरण बनाकर नेतृत्व करते हैं।",
    love_style: "रोमांटिक, समतावादी और विचारशील; आपसी प्रशंसा और संतुलन वाले संबंधों में पनपते हैं।",
    growth_advice: "अपने आंतरिक विवेक पर भरोसा रखकर दृढ़ निर्णय लें; स्वस्थ संवाद से सच सामने आता है।"
  },
  Vrischik: {
    core_personality: "मंगल और केतु से प्रभावित तीव्र इच्छाशक्ति, अंतर्दृष्टि और गहन रूपांतरणकारी शक्ति वाले व्यक्तित्व।",
    strengths: ["तीक्ष्ण अंतर्ज्ञान", "निर्भीक जीवटता", "अडिग निष्ठा", "रूपांतरण क्षमता"],
    weaknesses: ["अत्यधिक संदेह", "नियंत्रण रखने की जिद", "रहस्यमय दूरी"],
    career_tendency: "जांच अनुसंधान, शल्य चिकित्सा, मनोविज्ञान, वित्त और रहस्य विज्ञान में प्रभावशाली रहते हैं।",
    leadership_style: "रणनीतिक चुप्पी, निर्णायक बुद्धि और चुंबकीय प्रभाव से सम्मान हासिल करते हैं।",
    love_style: "गहरी भावनात्मक निष्ठा और आत्मिक निकटता; सतही मुखौटों को बर्दाश्त नहीं करते।",
    growth_advice: "क्षमा और भावनात्मक खुलापन अपनाएं; वास्तविक शक्ति स्वयं को सहज रखने में है।"
  },
  Dhanu: {
    core_personality: "बृहस्पति की कृपा से दार्शनिक सोच, ब्रह्मांडीय आशावाद और सत्य की खोज करने वाले खोजी।",
    strengths: ["दार्शनिक दृष्टिकोण", "उत्साही आशावाद", "सच्चा साहस", "साहसिक भावना"],
    weaknesses: ["स्पष्टवादिता से ठेस पहुंचाना", "क्षमता से अधिक वादे करना", "बारीकियों से ऊबना"],
    career_tendency: "उच्च शिक्षा, अंतरराष्ट्रीय कानून, आध्यात्मिक दर्शन, प्रकाशन, पर्यटन और कोचिंग में सफल होते हैं।",
    leadership_style: "बड़ा दृष्टिकोण प्रस्तुत करके टीम को नए क्षितिज खोजने के लिए प्रेरित करते हैं।",
    love_style: "स्वतंत्रता-प्रेमी, प्रसन्नचित्त और ईमानदार; साझा ज्ञान और यात्राओं से जुड़ते हैं।",
    growth_advice: "अपने बड़े आदर्शों को नियमित कार्ययोजना और वाणी की मधुरता के साथ साकार करें।"
  },
  Makar: {
    core_personality: "शनि के प्रभाव से धैर्यवान, दीर्घकालिक दृष्टि वाले और अविचल संकल्प के धनी व्यक्तित्व।",
    strengths: ["कठोर अनुशासन", "रणनीतिक दूरदर्शिता", "संरचनात्मक महारत", "व्यावहारिक ईमानदारी"],
    weaknesses: ["निराशावादी सावधानी", "भावनात्मक कठोरता", "अत्यधिक काम का बोझ लेना"],
    career_tendency: "कॉर्पोरेट प्रबंधन, सिविल सेवा, इंजीनियरिंग, वित्त और बुनियादी ढांचा परियोजनाओं में शीर्ष पर रहते हैं।",
    leadership_style: "जवाबदेही, दबाव में शांति और उच्च मानक स्थापित करके नेतृत्व करते हैं।",
    love_style: "शुरुआत में संकोची किंतु अत्यंत भरोसेमंद; दीर्घकालिक समर्थन से प्रेम निभाते हैं।",
    growth_advice: "दैनिक जीवन में सहजता और आनंद को स्थान दें; जीवन केवल जिम्मेदारियों का नाम नहीं है।"
  },
  Kumbh: {
    core_personality: "शनि और राहु से प्रेरित प्रगतिशील विचारक, मानवतावादी और सामाजिक बदलाव के अग्रदूत।",
    strengths: ["नवाचारी प्रतिभा", "मानवतावादी आदर्श", "मौलिक दृष्टिकोण", "समानता की भावना"],
    weaknesses: ["भावनात्मक दूरी", "विद्रोही हठ", "अति-सैद्धांतिक रुख"],
    career_tendency: "अत्याधुनिक तकनीक, वैज्ञानिक शोध, सामाजिक सुधार, विमानन और सामुदायिक विकास में नेतृत्व करते हैं।",
    leadership_style: "लोकतांत्रिक तरीके से सबकी विशेषता को पहचानते हुए साझा लक्ष्य की ओर ले जाते हैं।",
    love_style: "अपरंपरागत, बौद्धिक और मित्रता-प्रधान; स्वतंत्रता और वैचारिक तालमेल को महत्व देते हैं।",
    growth_advice: "भविष्य की अमूर्त सोच के साथ-साथ वर्तमान की भावनाओं से भी जुड़ना सीखें।"
  },
  Meen: {
    core_personality: "बृहस्पति के प्रभाव से करुणा, आध्यात्मिक संवेदनशीलता और असीम कलात्मक कल्पना के सागर।",
    strengths: ["आध्यात्मिक सहानुभूति", "कलात्मक कल्पना", "गहरा अंतर्ज्ञान", "निस्वार्थ दयालुता"],
    weaknesses: ["पलायनवादी प्रवृत्ति", "अस्पष्ट सीमाएं", "कड़वी सच्चाई से बचना"],
    career_tendency: "सिनेमा, ललित कला, चिकित्सा, परामर्श, समुद्री उद्योग और साहित्य में चमकते हैं।",
    leadership_style: "करुणामय अंतर्ज्ञान और प्रेरणादायक दृष्टि से टीम का मनोबल बढ़ाते हैं।",
    love_style: "गहरे रोमांटिक, आत्मिक और समर्पित; जीवनसाथी के साथ दिव्य एकात्मता चाहते हैं।",
    growth_advice: "अपनी संवेदनशीलता को व्यावहारिक अनुशासन और स्पष्ट सीमाओं के साथ सुरक्षित रखें।"
  }
};

/**
 * STEP 1 & STEP 2: Intent Classification and Input Handler
 */
function classifyVedicIntent(input) {
  let queryText = "";
  let explicitMode = null;
  let explicitIntent = null;
  let lagna = null;
  let surya = null;
  let chandra = null;
  let dob = null;
  let tob = null;
  let pob = null;
  let name = null;
  let rashiFallback = null;

  if (typeof input === "string") {
    queryText = input.trim();
  } else if (input && typeof input === "object") {
    queryText = input.query || input.prompt || input.text || "";
    explicitMode = input.mode || null;
    explicitIntent = input.intent || null;
    lagna = input.lagna || null;
    surya = input.surya_rashi || input.surya || null;
    chandra = input.chandra_rashi || input.chandra || null;
    dob = input.dob || input.date_of_birth || null;
    tob = input.tob || input.time_of_birth || input.time || null;
    pob = input.pob || input.place_of_birth || input.place || input.city || null;
    name = input.name || null;
    rashiFallback = input.rashi || null;
  }

  const q = queryText.toLowerCase();

  // 1. Natural Language Extraction of Name, Time, Place
  const nameMatch = queryText.match(/(?:my name is|name\s*[:=]|i am)\s*([A-Za-z]+)/i);
  if (nameMatch && !name) name = nameMatch[1].trim();

  const timeMatch = queryText.match(/\b([0-2]?[0-9]:[0-5][0-9](?:\s*[AaPp][Mm])?)\b/);
  if (timeMatch && !tob) tob = timeMatch[1].trim();

  const placeMatch = queryText.match(/(?:born in|birthplace|place\s*[:=]|city\s*[:=])\s*([A-Za-z\s]+?)(?:,|\.|$)/i);
  if (placeMatch && !pob) pob = placeMatch[1].trim();

  // Lagna extraction
  const lagnaMatch = queryText.match(/(?:lagna|ascendant|rising sign)\s*(?:is|:|=)?\s*([a-zA-Z]+)/i) ||
                     queryText.match(/\b([a-zA-Z]+)\s*(?:lagna|ascendant)\b/i);
  if (lagnaMatch && !lagna) {
    const candidate = normalizeRashiName(lagnaMatch[1]);
    if (RASHI_DATA[candidate]) lagna = candidate;
  }

  // Moon extraction
  const moonMatch = queryText.match(/(?:moon sign|chandra rashi|moon|chandra)\s*(?:is|:|=)?\s*([a-zA-Z]+)/i) ||
                    queryText.match(/\b([a-zA-Z]+)\s*(?:moon sign|chandra rashi|moon|chandra)\b/i);
  if (moonMatch && !chandra) {
    const candidate = normalizeRashiName(moonMatch[1]);
    if (RASHI_DATA[candidate]) chandra = candidate;
  }

  // Sun extraction
  const sunMatch = queryText.match(/(?:sun sign|surya rashi|sun|surya)\s*(?:is|:|=)?\s*([a-zA-Z]+)/i) ||
                    queryText.match(/\b([a-zA-Z]+)\s*(?:sun sign|surya rashi|sun|surya)\b/i);
  if (sunMatch && !surya) {
    const candidate = normalizeRashiName(sunMatch[1]);
    if (RASHI_DATA[candidate]) surya = candidate;
  }

  // DOB extraction
  const dobMatch = queryText.match(/\b([0-9]{4}-[0-9]{2}-[0-9]{2})\b/) ||
                   queryText.match(/\b([0-9]{2}-[0-9]{2}-[0-9]{4})\b/);
  if (dobMatch && !dob) {
    dob = dobMatch[1];
  }

  // Generic Rashi mention in query if no specific label matched
  if (!lagna && !chandra && !surya) {
    for (const [alias, canonical] of Object.entries(RASHI_ALIASES)) {
      const regex = new RegExp(`\\b${alias}\\b`, "i");
      if (regex.test(q)) {
        if (!rashiFallback) rashiFallback = canonical;
        break;
      }
    }
  }

  // Step 2 Rules: If DOB is given, estimate Sun sign, Moon sign, and Lagna (using TOB if available)
  if (dob) {
    const inferred = inferRashiFromDOB(dob, tob || "");
    if (!inferred.error) {
      if (!surya) surya = inferred.surya_rashi.key;
      if (!chandra) chandra = inferred.chandra_rashi.key;
      if (!lagna) lagna = inferred.lagna_rashi.key;
    }
  }

  // STEP 1: UNDERSTAND USER INTENT
  let classifiedIntent = "daily horoscope";
  let targetMode = "daily";

  // Check explicit mode first
  if (explicitMode === "lagna" || explicitMode === "ascendant") {
    classifiedIntent = "life path / health";
    targetMode = "lagna";
  } else if (explicitMode === "sun_analysis" || explicitMode === "sun" || explicitMode === "surya") {
    classifiedIntent = "personality / career / self";
    targetMode = "sun_analysis";
  } else if (explicitMode === "kundli") {
    classifiedIntent = "full astrology / kundli";
    targetMode = "kundli";
  } else if (explicitMode === "daily") {
    classifiedIntent = "daily horoscope";
    targetMode = "daily";
  } else if (explicitMode === "compatibility") {
    classifiedIntent = "compatibility";
    targetMode = "compatibility";
  }
  // 5. "compatibility" → Compare Moon + Lagna or two rashis
  else if (/compare|compatibility|compatible|versus|match|harmony|\bvs\b/i.test(q)) {
    classifiedIntent = "compatibility";
    targetMode = "compatibility";
  }
  // 4. "full astrology / kundli" → Combine all
  else if (
    (lagna && chandra && surya) ||
    /kundli|birth chart|full astrology|complete reading|all signs|three signs/i.test(q) ||
    (lagna && (chandra || surya))
  ) {
    classifiedIntent = "full astrology / kundli";
    targetMode = "kundli";
  }
  // 2. "personality / career / self" → Use Sun (Surya Rashi)
  else if (
    /sun sign|surya rashi|personality|career tendency|leadership|love style|growth advice|core personality|who am i|identity|self/i.test(q) ||
    (surya && !chandra && !lagna && !/today|daily|aaj|horoscope/i.test(q))
  ) {
    classifiedIntent = "personality / career / self";
    targetMode = "sun_analysis";
  }
  // 3. "life path / health" → Use Lagna
  else if (/life path|physical life|physical health|vitality|destiny|real world/i.test(q)) {
    classifiedIntent = "life path / health";
    targetMode = "kundli";
  }
  // 1. "daily horoscope" → Use Moon (Chandra Rashi)
  else {
    classifiedIntent = "daily horoscope";
    targetMode = "daily";
  }

  // Priority Rule: 1. Lagna, 2. Moon, 3. Sun
  const effectivePrimary = lagna || chandra || surya || rashiFallback || "Mithun";

  if (!chandra) chandra = effectivePrimary;
  if (!surya) surya = effectivePrimary;
  if (!lagna) lagna = effectivePrimary;

  return {
    intent: classifiedIntent,
    mode: targetMode,
    lagna: normalizeRashiName(lagna),
    surya_rashi: normalizeRashiName(surya),
    chandra_rashi: normalizeRashiName(chandra),
    rashi: normalizeRashiName(effectivePrimary),
    name: name || null,
    dob: dob || null,
    tob: tob || null,
    pob: pob || null,
    raw_query: queryText
  };
}

/**
 * ⚡ MODE 1: DAILY HOROSCOPE (Moon-focused, Complete 8 Pillars)
 */
function generateDailyMode({ rashi, chandra_rashi, date = "today", language = "en", name = "", dob = "", tob = "", pob = "" }) {
  const targetSign = normalizeRashiName(chandra_rashi || rashi || "Mithun");
  const base = generateRashiFal({
    rashi: targetSign,
    chandra: targetSign,
    date,
    timeframe: "daily",
    language,
    signType: "chandra",
    name,
    dob,
    tob,
    pob
  });

  return {
    type: "daily",
    rashi: targetSign,
    overall: base.overall,
    overview: base.overview,
    career: base.career,
    career_focus: base.career_focus,
    love: base.love,
    love_harmony: base.love_harmony,
    finance: base.finance,
    finance_wisdom: base.finance_wisdom,
    health: base.health,
    health_vitality: base.health_vitality,
    education: base.education,
    education_focus: base.education_focus,
    remedies: base.remedies,
    shubh_muhurat: base.shubh_muhurat,
    shubh_details: base.shubh_details,
    sanskrit_mantra: base.sanskrit_mantra,
    gochar: base.gochar,
    personalized_greeting: base.personalized_greeting,
    user_input: base.user_input,
    lucky_color: base.lucky_color,
    lucky_number: base.lucky_number,
    tip: base.tip
  };
}

/**
 * ⚡ MODE 2: SUN SIGN ANALYSIS
 * Exact JSON schema:
 * {
 *   "type": "sun_analysis",
 *   "surya_rashi": "",
 *   "core_personality": "",
 *   "strengths": [],
 *   "weaknesses": [],
 *   "career_tendency": "",
 *   "leadership_style": "",
 *   "love_style": "",
 *   "growth_advice": ""
 * }
 */
function generateSunAnalysisMode({ surya_rashi, rashi, language = "en" }) {
  const targetSign = normalizeRashiName(surya_rashi || rashi || "Singh");
  const lang = String(language || "en").toLowerCase();
  const isHi = lang === "hi";

  const dataSource = isHi ? SUN_ANALYSIS_DATA_HI : SUN_ANALYSIS_DATA;
  const data = dataSource[targetSign] || dataSource["Singh"];

  return {
    type: "sun_analysis",
    surya_rashi: targetSign,
    core_personality: data.core_personality,
    strengths: [...data.strengths],
    weaknesses: [...data.weaknesses],
    career_tendency: data.career_tendency,
    leadership_style: data.leadership_style,
    love_style: data.love_style,
    growth_advice: data.growth_advice
  };
}

/**
 * ⚡ MODE: LAGNA (ASCENDANT / RISING SIGN) ANALYSIS
 */
function generateLagnaMode({ lagna, rashi, language = "en" }) {
  const targetSign = normalizeRashiName(lagna || rashi || "Singh");
  const meta = RASHI_DATA[targetSign] || RASHI_DATA["Singh"];
  const lang = String(language || "en").toLowerCase();
  const isHi = lang === "hi";

  if (isHi) {
    return {
      type: "lagna",
      lagna: targetSign,
      title: `${meta.sanskritName} लग्न (उदय राशि)`,
      element: meta.element,
      lord: meta.lord,
      vitality: `${meta.sanskritName} लग्न आपको प्रभावशाली, गरिमामय शारीरिक आभा और स्वाभाविक आकर्षण प्रदान करता है।`,
      temperament: `आपका स्वभाव दृढ़ संकल्पी, स्वतंत्र और स्वाभिमानी है। आप अपने वातावरण में स्वाभाविक रूप से प्रभाव स्थापित करते हैं।`,
      life_path: `जीवन का मूल उद्देश्य आत्मनिर्भरता, अपनी पहचान का निर्माण और अपने सिद्धांतों पर अडिग रहकर सफलता प्राप्त करना है।`,
      growth_advice: `अपने लग्नेश ${meta.lord.split(" ")[0]} की सकारात्मक ऊर्जा के लिए आत्म-अनुशासन, प्रातःकालीन ध्यान और संतुलित दिनचर्या अपनाएं।`
    };
  }

  return {
    type: "lagna",
    lagna: targetSign,
    title: `${meta.englishName} Lagna (Ascendant / Rising Sign)`,
    element: meta.element,
    lord: meta.lord,
    vitality: `Your ${meta.englishName} Ascendant confers robust physical vitality, natural personal authority, and an unmistakable aura of dignity.`,
    temperament: `You possess a driven, principled, and expressive temperament with a natural instinct to take the initiative and lead with honor.`,
    life_path: `Your core life path centers around building personal sovereignty, establishing an authentic reputation, and overcoming worldly challenges through resilience.`,
    growth_advice: `Cultivate alignment with your Lagna Lord ${meta.lord.split(" ")[0]} through intentional daily routines, purposeful discipline, and grounded mindfulness.`
  };
}

/**
 * ⚡ MODE 3: FULL KUNDLI SUMMARY
 * Exact JSON schema:
 * {
 *   "type": "kundli",
 *   "lagna": "",
 *   "surya_rashi": "",
 *   "chandra_rashi": "",
 *   "summary": "",
 *   "career": "",
 *   "love": "",
 *   "finance": "",
 *   "health": "",
 *   "planetary_hint": "",
 *   "tip": ""
 * }
 */
function generateKundliMode({ lagna, surya_rashi, chandra_rashi, rashi, date = "today", language = "en" }) {
  const lagnaKey   = normalizeRashiName(lagna || rashi || "Singh");
  const suryaKey   = normalizeRashiName(surya_rashi || rashi || "Mesh");
  const chandraKey = normalizeRashiName(chandra_rashi || rashi || "Mithun");

  const lang = String(language || "en").toLowerCase();
  const isHi = lang === "hi";

  const lagnaInfo   = RASHI_DATA[lagnaKey]   || RASHI_DATA["Singh"];
  const suryaInfo   = RASHI_DATA[suryaKey]   || RASHI_DATA["Mesh"];
  const chandraInfo = RASHI_DATA[chandraKey] || RASHI_DATA["Mithun"];

  let summary, career, love, finance, health, planetaryHint, tip;

  if (isHi) {
    summary = `आपकी ${lagnaInfo.sanskritName} लग्न आपको गरिमामय भौतिक उपस्थिति देती है; ${suryaInfo.sanskritName} सूर्य अदम्य महत्वाकांक्षा भरता है, और ${chandraInfo.sanskritName} चंद्रमा तीव्र मानसिक चपलता प्रदान करता है।`;
    career = `उच्च प्रभाव वाले नेतृत्व, रणनीतिक प्रबंधन और उद्यमशीलता में श्रेष्ठ सफलता के योग हैं, जहाँ आप स्वतंत्र रूप से नई पहल कर सकें।`;
    love = `आप एक ऐसे बौद्धिक व स्नेही साथी के साथ खिलते हैं जो आपके सम्मान का आदर करे और स्पष्ट, मधुर संवाद को प्राथमिकता दे।`;
    finance = `स्थिर परिसंपत्तियों, रणनीतिक उद्यमों और बुद्धिमत्तापूर्ण निवेश से धन संचय में निरंतर वृद्धि होगी।`;
    health = `शारीरिक स्फूर्ति व रीढ़ की हड्डी के आसन का ध्यान रखें; नियमित प्राणायाम और शांत विश्राम से मानसिक तनाव को दूर रखें।`;
    planetaryHint = `${lagnaInfo.lord.split(" ")[0]}, ${suryaInfo.lord.split(" ")[0]} और ${chandraInfo.lord.split(" ")[0]} की त्रिकोणीय ऊर्जा आपके साहस, बुद्धि और संकल्प को संतुलित करती है।`;
    tip = `प्रातःकालीन अनुशासन और स्पष्ट प्राथमिकताओं के साथ आगे बढ़ें, धैर्य और विवेक आपके सबसे बड़े सहायक हैं।`;
  } else {
    summary = `Your ${lagnaInfo.englishName} Lagna bestows an authoritative physical presence; your ${suryaInfo.englishName} Sun fuels pioneering ambition, while your ${chandraInfo.englishName} Moon provides quick-witted mental adaptability.`;
    career = `High success in visionary leadership, strategic execution, and dynamic enterprise where you possess autonomy to pioneer bold initiatives.`;
    love = `You thrive with an intellectually engaging and affectionate partner who honors your dignity and participates in candid, heartwarming dialogue.`;
    finance = `Wealth steadily manifests through bold strategic ventures, high-visibility milestones, and intelligent commercial diversification.`;
    health = `Nurture physical vitality and spinal alignment; soothe mental restlessness through regular breathwork and mindful pauses.`;
    planetaryHint = `Harmonious synergy between ${lagnaInfo.lord.split(" ")[0]}, ${suryaInfo.lord.split(" ")[0]}, and ${chandraInfo.lord.split(" ")[0]} aligns your physical drive, inner mind, and soul purpose.`;
    tip = `Anchor your expansive aspirations through structured morning discipline and purposeful, patient follow-through.`;
  }

  return {
    type: "kundli",
    lagna: lagnaKey,
    surya_rashi: suryaKey,
    chandra_rashi: chandraKey,
    summary,
    career,
    love,
    finance,
    health,
    planetary_hint: planetaryHint,
    tip
  };
}

/**
 * Master Vedic Astrology AI System Entry Point
 * Executes Step 1 (Understand Intent), Step 2 (Handle Input),
 * applies Vedic Astrology Logic, and returns valid strict JSON.
 */
function generateVedicAstrologyAI(input = {}) {
  const analysis = classifyVedicIntent(input);
  const lang = (typeof input === "object" && input !== null) ? (input.language || input.lang || "en") : "en";
  const date = (typeof input === "object" && input !== null) ? (input.date || "today") : "today";

  if (analysis.mode === "lagna") {
    return generateLagnaMode({
      lagna: analysis.lagna || analysis.rashi,
      rashi: analysis.rashi,
      language: lang
    });
  }

  if (analysis.mode === "sun_analysis") {
    return generateSunAnalysisMode({
      surya_rashi: analysis.surya_rashi,
      rashi: analysis.rashi,
      language: lang
    });
  }

  if (analysis.mode === "kundli") {
    return generateKundliMode({
      lagna: analysis.lagna,
      surya_rashi: analysis.surya_rashi,
      chandra_rashi: analysis.chandra_rashi,
      rashi: analysis.rashi,
      date,
      language: lang
    });
  }

  if (analysis.mode === "compatibility") {
    const r1 = analysis.chandra_rashi || analysis.rashi;
    const r2 = analysis.lagna !== r1 ? analysis.lagna : analysis.surya_rashi;
    const compat = compareCompatibility(r1, r2 !== r1 ? r2 : "Singh");
    return {
      type: "compatibility",
      rashi1: compat.rashi1.name,
      rashi2: compat.rashi2.name,
      compatibility_score: compat.compatibility_score,
      rating: compat.rating,
      elemental_dynamic: compat.elemental_dynamic,
      advice: compat.advice
    };
  }

  const name = (typeof input === "object" && input !== null) ? (input.name || analysis.name || "") : (analysis.name || "");
  const dob  = (typeof input === "object" && input !== null) ? (input.dob || analysis.dob || "") : (analysis.dob || "");
  const tob  = (typeof input === "object" && input !== null) ? (input.tob || analysis.tob || "") : (analysis.tob || "");
  const pob  = (typeof input === "object" && input !== null) ? (input.pob || analysis.pob || "") : (analysis.pob || "");

  // Default: Mode 1 (Daily Horoscope)
  return generateDailyMode({
    rashi: analysis.rashi,
    chandra_rashi: analysis.chandra_rashi,
    date,
    language: lang,
    name,
    dob,
    tob,
    pob
  });
}

module.exports = {
  RASHI_DATA,
  RASHI_ALIASES,
  SUN_ANALYSIS_DATA,
  SUN_ANALYSIS_DATA_HI,
  normalizeRashiName,
  normalizeDate,
  generateRashiFal,
  inferRashiFromDOB,
  compareCompatibility,
  classifyVedicIntent,
  generateDailyMode,
  generateLagnaMode,
  generateSunAnalysisMode,
  generateKundliMode,
  generateVedicAstrologyAI
};

