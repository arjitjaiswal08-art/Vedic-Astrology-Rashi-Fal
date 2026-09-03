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

/**
 * Core Rashi Fal prediction generator.
 * Strictly outputs JSON matching:
 * {
 *   "rashi": "Rashi Name",
 *   "date": "DD-MM-YYYY",
 *   "overall": "...",
 *   "career": "...",
 *   "love": "...",
 *   "finance": "...",
 *   "health": "...",
 *   "lucky_color": "Color",
 *   "lucky_number": number,
 *   "tip": "One actionable advice"
 * }
 */
function generateRashiFal({ rashi, date, timeframe = "daily", intent = null }) {
  const normalizedRashi = normalizeRashiName(rashi);
  const normalizedDate = normalizeDate(date);
  const rashiInfo = RASHI_DATA[normalizedRashi] || RASHI_DATA["Mithun"];
  const scope = (timeframe || "daily").toLowerCase();

  // Deterministic seed ensures consistent response for same date/rashi
  const seed = getAstrologicalSeed(normalizedRashi, normalizedDate, scope);
  const lib = PREDICTION_LIBRARY[normalizedRashi] || PREDICTION_LIBRARY["Mithun"];

  let overallText = "";
  let careerText = "";
  let loveText = "";
  let financeText = "";
  let healthText = "";
  let tipText = "";

  if (scope === "weekly") {
    overallText = lib.weekly.overall;
    careerText = lib.weekly.career;
    loveText = lib.weekly.love;
    financeText = lib.weekly.finance;
    healthText = lib.weekly.health;
    tipText = lib.weekly.tips;
  } else if (scope === "monthly") {
    overallText = lib.monthly.overall;
    careerText = lib.monthly.career;
    loveText = lib.monthly.love;
    financeText = lib.monthly.finance;
    healthText = lib.monthly.health;
    tipText = lib.monthly.tips;
  } else {
    // Daily
    const dailySet = lib.daily;
    overallText = dailySet.overall[seed % dailySet.overall.length];
    careerText = dailySet.career[(seed + 1) % dailySet.career.length];
    loveText = dailySet.love[(seed + 2) % dailySet.love.length];
    financeText = dailySet.finance[(seed + 3) % dailySet.finance.length];
    healthText = dailySet.health[(seed + 4) % dailySet.health.length];
    tipText = dailySet.tips[seed % dailySet.tips.length];
  }

  // Pick lucky color and lucky number deterministically
  const luckyColor = rashiInfo.luckyColors[seed % rashiInfo.luckyColors.length];
  const luckyNumber = rashiInfo.luckyNumbers[seed % rashiInfo.luckyNumbers.length];

  // If user provided a specific intent (e.g. career, love, finance, health), personalize tip/overall
  if (intent) {
    const cleanIntent = String(intent).toLowerCase().trim();
    if (cleanIntent === "career" || cleanIntent === "job" || cleanIntent === "business") {
      tipText = `Focus on career: ${careerText} ${tipText}`;
    } else if (cleanIntent === "love" || cleanIntent === "relationship" || cleanIntent === "marriage") {
      tipText = `Relationship focus: ${loveText} ${tipText}`;
    } else if (cleanIntent === "finance" || cleanIntent === "money" || cleanIntent === "wealth") {
      tipText = `Financial focus: ${financeText} ${tipText}`;
    } else if (cleanIntent === "health" || cleanIntent === "wellness") {
      tipText = `Wellness focus: ${healthText} ${tipText}`;
    }
  }

  // STRICT JSON CONTRACT
  const output = {
    rashi: normalizedRashi,
    date: normalizedDate,
    overall: overallText,
    career: careerText,
    love: loveText,
    finance: financeText,
    health: healthText,
    lucky_color: luckyColor,
    lucky_number: luckyNumber,
    tip: tipText
  };

  return output;
}

/**
 * Advanced Feature: Infer likely Rashi (Sun / Approximate Moon sign) from Date of Birth
 */
function inferRashiFromDOB(dobString) {
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

  // Vedic Sidereal Sun sign approximation (Lahiri Ayanamsha shift of ~23-24 deg from Western)
  // Sidereal Sun ingress dates approximately:
  // Mesh (Aries): Apr 14 - May 14
  // Vrishabh (Taurus): May 15 - Jun 14
  // Mithun (Gemini): Jun 15 - Jul 15
  // Kark (Cancer): Jul 16 - Aug 16
  // Singh (Leo): Aug 17 - Sep 16
  // Kanya (Virgo): Sep 17 - Oct 16
  // Tula (Libra): Oct 17 - Nov 15
  // Vrischik (Scorpio): Nov 16 - Dec 15
  // Dhanu (Sagittarius): Dec 16 - Jan 13
  // Makar (Capricorn): Jan 14 - Feb 12
  // Kumbh (Aquarius): Feb 13 - Mar 13
  // Meen (Pisces): Mar 14 - Apr 13

  let inferredRashi = "Mesh";
  let explanation = "";

  if ((month === 4 && day >= 14) || (month === 5 && day <= 14)) {
    inferredRashi = "Mesh";
    explanation = "Sidereal Sun in Mesha (Aries).";
  } else if ((month === 5 && day >= 15) || (month === 6 && day <= 14)) {
    inferredRashi = "Vrishabh";
    explanation = "Sidereal Sun in Vrishabha (Taurus).";
  } else if ((month === 6 && day >= 15) || (month === 7 && day <= 15)) {
    inferredRashi = "Mithun";
    explanation = "Sidereal Sun in Mithuna (Gemini).";
  } else if ((month === 7 && day >= 16) || (month === 8 && day <= 16)) {
    inferredRashi = "Kark";
    explanation = "Sidereal Sun in Karka (Cancer).";
  } else if ((month === 8 && day >= 17) || (month === 9 && day <= 16)) {
    inferredRashi = "Singh";
    explanation = "Sidereal Sun in Simha (Leo).";
  } else if ((month === 9 && day >= 17) || (month === 10 && day <= 16)) {
    inferredRashi = "Kanya";
    explanation = "Sidereal Sun in Kanya (Virgo).";
  } else if ((month === 10 && day >= 17) || (month === 11 && day <= 15)) {
    inferredRashi = "Tula";
    explanation = "Sidereal Sun in Tula (Libra).";
  } else if ((month === 11 && day >= 16) || (month === 12 && day <= 15)) {
    inferredRashi = "Vrischik";
    explanation = "Sidereal Sun in Vrischika (Scorpio).";
  } else if ((month === 12 && day >= 16) || (month === 1 && day <= 13)) {
    inferredRashi = "Dhanu";
    explanation = "Sidereal Sun in Dhanu (Sagittarius).";
  } else if ((month === 1 && day >= 14) || (month === 2 && day <= 12)) {
    inferredRashi = "Makar";
    explanation = "Sidereal Sun in Makara (Capricorn).";
  } else if ((month === 2 && day >= 13) || (month === 3 && day <= 13)) {
    inferredRashi = "Kumbh";
    explanation = "Sidereal Sun in Kumbha (Aquarius).";
  } else {
    inferredRashi = "Meen";
    explanation = "Sidereal Sun in Meena (Pisces).";
  }

  const meta = RASHI_DATA[inferredRashi];

  return {
    dob: `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`,
    inferred_rashi: inferredRashi,
    english_name: meta.englishName,
    sanskrit_name: meta.sanskritName,
    ruling_planet: meta.lord,
    element: meta.element,
    note: `Calculated using Vedic Sidereal Solar Ingress (${explanation}). Note: Exact Moon Sign (Janma Rashi) additionally requires precise birth time and city.`
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

module.exports = {
  RASHI_DATA,
  RASHI_ALIASES,
  normalizeRashiName,
  normalizeDate,
  generateRashiFal,
  inferRashiFromDOB,
  compareCompatibility
};
