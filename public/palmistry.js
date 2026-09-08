/**
 * Vedic Palmistry (Hast Rekha) Engine — Multilingual Support (en, hi, ta, te, sa)
 * Interactive palm line & mount analysis for the Vedic Astrology AI app.
 */

// ───────────────────────────── DATA LAYER ─────────────────────────────

const PALM_LINES = {
  life: {
    label: "Life Line (Ayu Rekha)",
    icon: "🌿",
    sanskrit: "आयु रेखा",
    colorVar: "--cosmic-emerald",
    color: "#10b981",
    descriptions: {
      long_deep: "A long, deep Life line reveals vibrant vitality, strong constitution, and remarkable endurance. You possess the physical and emotional stamina to overcome formidable challenges. Periods of rest and nature connection will amplify your natural resilience.",
      long_faint: "Your Life line is long yet lighter in depth — you are sensitive and emotionally attuned. While core vitality is solid, guard against mental exhaustion. Grounding practices like morning walks and nourishing meals fortify your energy reserves.",
      short_deep: "A short, deeply etched Life line speaks not of shortened life, but of intensity and focused living. You live fully in each chapter, seeking quality over quantity. Your experiences are rich and deeply felt.",
      short_faint: "A shorter, lighter Life line suggests a more introverted vitality — you are selective with your energy, preferring depth of connection over breadth. Rest, hydration, and stress management are your allies.",
      curved: "A wide arc in your Life line indicates an outgoing, adventurous spirit and zest for new experiences. You thrive in dynamic environments and recover quickly from setbacks.",
      forked: "A fork at the end of the Life line indicates a major life transition or relocation that brings a transformative new chapter. Embrace change — both directions offer growth."
    }
  },
  heart: {
    label: "Heart Line (Hridaya Rekha)",
    icon: "❤️",
    sanskrit: "हृदय रेखा",
    colorVar: "--cosmic-crimson",
    color: "#f43f5e",
    descriptions: {
      long_deep: "A long, well-defined Heart line reveals deep emotional capacity, profound loyalty in relationships, and an expansive ability to love and connect. You feel intensely and inspire warmth in those around you.",
      long_faint: "Your long yet lighter Heart line indicates emotional idealism — you dream of deep connection and may sometimes feel misunderstood. Expressing feelings openly creates the intimacy you seek.",
      short_deep: "A short, strong Heart line points to a practical, self-sufficient approach to love. You value depth over volume and prefer meaningful bonds over casual connections. You give love deliberately and loyally.",
      curved_upward: "A Heart line curving toward the index finger signals a warm, passionate, and openly romantic nature. You fall deeply and express affection freely — a true heart of gold.",
      straight: "A straighter Heart line reflects an analytical approach to emotions. You process feelings thoughtfully, sometimes before fully feeling them. Balance logic with vulnerability for richer relationships.",
      chained: "Small chain links along your Heart line suggest emotional sensitivity and some difficulty in early relationships. Past experiences have made you discerning — trust your intuition in matters of the heart.",
      forked: "A forked Heart line (trident) is auspicious — you balance head and heart harmoniously in love, making you both emotionally rich and practically grounded in relationships."
    }
  },
  head: {
    label: "Head Line (Mastishk Rekha)",
    icon: "🧠",
    sanskrit: "मस्तिष्क रेखा",
    colorVar: "--cosmic-cyan",
    color: "#38bdf8",
    descriptions: {
      long_deep: "A long, deeply carved Head line reveals exceptional analytical power, intellectual depth, and a sharp memory. You think thoroughly before acting and excel in strategic planning, research, and creative problem-solving.",
      long_faint: "Your long, lighter Head line suggests wide-ranging curiosity and a mind that embraces many subjects. Channel this breadth into a few chosen mastery areas for outstanding results.",
      short_deep: "A short, clear Head line indicates rapid, decisive thinking. You trust gut-logic, make quick decisions, and prefer action over extended deliberation — a natural executive mind.",
      curved: "A Head line curving downward toward the Moon mount signals a richly creative, imaginative intellect. You think in narratives and possibilities. Arts, writing, and innovation are your natural domains.",
      straight: "A perfectly straight Head line marks a logical, linear thinker. You are methodical, detail-oriented, and reliable in technical disciplines. Mathematics, engineering, and analysis are natural strengths.",
      forked: "A forked Head line (writer's fork / lawyer's fork) is considered highly auspicious — you can see multiple sides of any issue, combining creative and logical thinking with equal skill."
    }
  },
  fate: {
    label: "Fate Line (Bhagya Rekha)",
    icon: "⭐",
    sanskrit: "भाग्य रेखा",
    colorVar: "--gold-primary",
    color: "#ffd166",
    descriptions: {
      strong: "A strong, unbroken Fate line from wrist to middle finger indicates a person with a clear sense of destiny and purposeful direction in life. Career and life path feel guided and aligned — you often know your calling early.",
      starts_late: "A Fate line beginning midway suggests your true purpose and life direction crystallise in adulthood. Your greatest chapter is ahead — embrace each lesson as preparation for your destiny.",
      starts_from_life: "When the Fate line emerges from the Life line, your destiny is intertwined with family and personal effort. Success comes through self-reliance and using your roots as a launching pad.",
      starts_from_moon: "A Fate line rising from the Luna mount signals that public recognition, creative work, or serving others defines your path. The world takes notice of your contributions.",
      absent: "Absence of a Fate line is not inauspicious — it means you are a free spirit who writes your own destiny without a predetermined script. Life is self-determined, spontaneous, and richly personal.",
      forked: "A forked Fate line indicates a person who successfully pursues two careers, passions, or life paths simultaneously. Versatility is your superpower.",
      broken: "A break in the Fate line marks a significant life pivot — a voluntary career change, relocation, or reinvention. The new segment often rises higher, signifying elevation after transformation."
    }
  },
  sun: {
    label: "Sun Line (Surya Rekha)",
    icon: "☀️",
    sanskrit: "सूर्य रेखा",
    colorVar: "--gold-glow",
    color: "#f59e0b",
    descriptions: {
      strong: "A strong, clear Sun line indicates fame, public recognition, creative brilliance, and lasting success. You possess a natural charisma that draws others to support your ventures.",
      faint: "A lighter Sun line suggests latent creative talent that blossoms when nurtured. Focus, mentorship, and consistent creative output will strengthen your Sun line's promise over time.",
      absent: "Absence of a Sun line does not preclude success — it means your accomplishments stem from effort and persistence rather than effortless charm. Your rewards are earned and deeply satisfying.",
      multiple: "Multiple Sun lines are highly auspicious, indicating talents across several creative domains and the potential for recognition in more than one field during your lifetime.",
      late: "A Sun line appearing only in the upper third of the palm indicates success and recognition arriving in the second half of life — often after 35-40. Stay patient and consistent; your prime is ahead."
    }
  },
  marriage: {
    label: "Union Lines (Vivah Rekha)",
    icon: "💍",
    sanskrit: "विवाह रेखा",
    colorVar: "--cosmic-purple",
    color: "#8b5cf6",
    descriptions: {
      one_deep: "A single, deep Union line indicates a strong, committed primary relationship or marriage — one profound bond that shapes your life. Loyalty and devotion define your approach to love.",
      two_lines: "Two Union lines suggest two significant committed relationships or a deeply important second union after personal growth. Both connections carry meaningful lessons.",
      multiple: "Several Union lines indicate a richly emotional and social nature with deep capacity for connection. You are sought-after in relationships and form bonds easily.",
      short: "Shorter Union lines indicate careful emotional selectivity — you take time before committing fully. This discernment ultimately leads to more authentic partnerships.",
      absent: "Absence of Union lines simply means your primary relationship with life is with your own journey, independence, and personal purpose — deeply fulfilling in its own right."
    }
  }
};

const PALM_MOUNTS = {
  jupiter: {
    label: "Mount of Jupiter (Guru Parvat)",
    icon: "♃",
    planet: "Jupiter (Guru)",
    location: "Below index finger",
    prominent: "Highly developed Jupiter mount speaks of natural leadership, ambition, optimism, and a genuine desire to uplift and inspire others. You are drawn to philosophy, teaching, or positions of authority.",
    flat: "A flatter Jupiter mount suggests humility over ambition — you prefer to lead through service and example rather than overt authority. Quiet influence is your style.",
    overdeveloped: "An overly dominant Jupiter mount may indicate pride or tendency toward overconfidence. Cultivating listening skills and empathy channels Jupiter's power constructively."
  },
  saturn: {
    label: "Mount of Saturn (Shani Parvat)",
    icon: "♄",
    planet: "Saturn (Shani)",
    location: "Below middle finger",
    prominent: "A well-developed Saturn mount reveals seriousness, wisdom, discipline, and deep analytical thinking. You are drawn to research, philosophy, law, or structured creative work.",
    flat: "A flatter Saturn mount suggests a more spontaneous approach to life — you prefer flexibility over rigid structure and tend to learn through lived experience rather than formal study.",
    overdeveloped: "An overdeveloped Saturn mount may bring tendencies toward excessive caution or pessimism. Balance Saturn's discipline with moments of joyful spontaneity."
  },
  sun_mount: {
    label: "Mount of Sun (Surya Parvat)",
    icon: "☀️",
    planet: "Sun (Surya)",
    location: "Below ring finger",
    prominent: "A prominent Sun mount signals natural creativity, aesthetic sensibility, charisma, and a desire for public recognition. You shine in arts, performance, or any stage of life.",
    flat: "A flatter Sun mount suggests your talents are private and personally fulfilling rather than publicly displayed — depth over breadth of recognition.",
    overdeveloped: "Overdevelopment of the Sun mount may manifest as excessive showmanship or ego. Channelling creative energy into genuine artistic service brings true fulfilment."
  },
  mercury: {
    label: "Mount of Mercury (Budh Parvat)",
    icon: "☿",
    planet: "Mercury (Budh)",
    location: "Below little finger",
    prominent: "A developed Mercury mount indicates exceptional communication skills, business acumen, wit, and adaptability. You excel in negotiations, writing, technology, or commercial ventures.",
    flat: "A flatter Mercury mount suggests a more measured, deliberate communication style. You choose words carefully and build trust through consistency rather than charm.",
    overdeveloped: "An overactive Mercury mount may suggest cleverness veering into cunning. Channelling intellect toward transparent and ethical communication unlocks Mercury's highest gifts."
  },
  venus: {
    label: "Mount of Venus (Shukra Parvat)",
    icon: "♀",
    planet: "Venus (Shukra)",
    location: "Thumb base / upper palm",
    prominent: "A well-padded, firm Venus mount reveals sensuality, warmth, physical vitality, artistic appreciation, and an abundant capacity for love. You attract affection and create beauty wherever you go.",
    flat: "A flatter Venus mount suggests a more austere, ascetic energy — you find beauty in simplicity and prefer intellectual or spiritual connection over physical indulgence.",
    overdeveloped: "An overly soft or excessive Venus mount may indicate over-indulgence in pleasures. Channelling this richness into creative arts or nurturing others balances Venus's gifts."
  },
  moon_mount: {
    label: "Mount of Luna (Chandra Parvat)",
    icon: "🌙",
    planet: "Moon (Chandra)",
    location: "Opposite thumb, lower palm",
    prominent: "A full Moon mount speaks of rich imagination, psychic sensitivity, empathy, and a deep connection to the subconscious and intuition. You are drawn to travel, spirituality, dreams, and the mysteries of life.",
    flat: "A flatter Moon mount indicates a pragmatic, grounded approach — you rely on facts over intuition and prefer tangible results over abstract exploration.",
    overdeveloped: "An overdeveloped Moon mount may manifest as excessive fantasy or emotional overwhelm. Grounding practices — meditation, earthing, nature walks — channel lunar energy constructively."
  },
  mars_inner: {
    label: "Inner Mars (Mangal Parvat — Inner)",
    icon: "♂",
    planet: "Mars (Mangal)",
    location: "Thumb side, upper palm",
    prominent: "A well-developed Inner Mars mount indicates courage, physical vitality, assertiveness, and proactive energy. You charge toward challenges without hesitation.",
    flat: "A flatter Inner Mars mount suggests a gentler, more diplomatic approach to conflict. You prefer negotiation and patience over confrontation."
  },
  mars_outer: {
    label: "Outer Mars (Mangal Parvat — Outer)",
    icon: "♂",
    planet: "Mars (Mangal)",
    location: "Opposite thumb, upper palm",
    prominent: "A prominent Outer Mars mount reveals resilience, resistance, and extraordinary endurance under pressure. You persevere through adversity and inspire others by your tenacity.",
    flat: "A flatter Outer Mars suggests a more contemplative nature — you process challenges internally before acting, drawing strength from reflection."
  }
};

const HAND_TYPES = {
  fire: {
    label: "Fire Hand (Agni Hast)",
    icon: "🔥",
    description: "Square palm with short fingers — the hallmark of an energetic, passionate, and action-oriented soul. Fire hand natives are natural leaders, entrepreneurs, and pioneers. You thrive in dynamic, high-energy environments and inspire others through bold initiative.",
    traits: ["Natural leader", "Enthusiastic initiator", "Decisive under pressure", "High physical energy", "Entrepreneurial spirit"],
    vedic: "Dominated by the Agni (Fire) tattva — Mangal and Surya energies are strong."
  },
  earth: {
    label: "Earth Hand (Prithvi Hast)",
    icon: "🌍",
    description: "Square palm with short fingers and thick skin — the signature of a grounded, practical, and deeply reliable person. Earth hand natives are builders, craftspeople, and loyal pillars of their communities. You create lasting, tangible value in everything you touch.",
    traits: ["Steady and dependable", "Practical builder", "Strong work ethic", "Patient and persistent", "Deep-rooted wisdom"],
    vedic: "Dominated by the Prithvi (Earth) tattva — Shani and Shukra energies are prominent."
  },
  air: {
    label: "Air Hand (Vayu Hast)",
    icon: "💨",
    description: "Square palm with long fingers — the mark of an intellectual, communicative, and analytically brilliant soul. Air hand natives are natural thinkers, writers, and visionaries. You connect ideas across domains and communicate insights with elegant clarity.",
    traits: ["Sharp intellectual", "Natural communicator", "Analytical problem-solver", "Visionary thinker", "Socially versatile"],
    vedic: "Dominated by the Vayu (Air) tattva — Budh (Mercury) energy prevails."
  },
  water: {
    label: "Water Hand (Jal Hast)",
    icon: "🌊",
    description: "Long, oval palm with long fingers — the signature of a deeply sensitive, empathic, and creatively gifted soul. Water hand natives are artists, healers, and mystics. You feel the world with exquisite depth and transform experience into art or service.",
    traits: ["Deeply empathic", "Richly creative", "Intuitively gifted", "Emotionally intelligent", "Spiritually inclined"],
    vedic: "Dominated by the Jal (Water) tattva — Chandra (Moon) and Guru (Jupiter) energies guide."
  }
};

// ──────────────────────── MULTILINGUAL DICTIONARIES ────────────────────────

const PALM_LINES_LOCALIZED = {
  hi: {
    life: {
      label: "जीवन रेखा (आयु रेखा)",
      descriptions: {
        long_deep: "लंबी और गहरी जीवन रेखा उत्तम स्वास्थ्य, सुदृढ़ जीवन शक्ति और असाधारण सहनशक्ति को दर्शाती है। आप कठिन परिस्थितियों से आसानी से उबरते हैं।",
        long_faint: "आपकी जीवन रेखा लंबी परंतु हल्की है — आप संवेदनशील और भावनात्मक रूप से जुड़े हुए व्यक्ति हैं। समय पर विश्राम करें।",
        short_deep: "गहरी जीवन रेखा जीवन की गुणवत्ता और तीव्रता को दर्शाती है। आप हर अध्याय को पूर्णता से जीते हैं।",
        short_faint: "छोटी व हल्की जीवन रेखा ऊर्जा के विवेकपूर्ण उपयोग का संकेत देती है।",
        curved: "जीवन रेखा का सुंदर घुमाव आपकी साहसी, ऊर्जावान और नए अनुभवों से भरी प्रकृति का प्रतीक है।",
        forked: "अंत में दो हिस्सों में बंटना जीवन में बड़े सकारात्मक परिवर्तन या नए अध्याय की शुरुआत का संकेत है।"
      }
    },
    heart: {
      label: "हृदय रेखा (हृदय रेखा)",
      descriptions: {
        long_deep: "लंबी और स्पष्ट हृदय रेखा गहरे प्रेम, वफादारी और निस्वार्थ भावनात्मक जुड़ाव का प्रतीक है।",
        long_faint: "भावनात्मक आदर्शवाद का संकेत है — आप गहरे और आत्मीय संबंधों की आकांक्षा रखते हैं।",
        short_deep: "व्यावहारिक दृष्टिकोण का संकेत देती है। आप चुने हुए रिश्तों में बेहद निष्ठावान होते हैं।",
        curved_upward: "तर्जनी की ओर मुड़ती रेखा अत्यंत रोमांटिक, उदार और स्नेहपूर्ण हृदय का संकेत देती है।",
        straight: "तार्किक और संतुलित भावनात्मक दृष्टिकोण को दर्शाती है।",
        chained: "संवेदनशील प्रकृति का संकेत है — अपनी भावनाओं पर भरोसा रखें।",
        forked: "द्विशाखी हृदय रेखा बुद्धि और भावनाओं का उत्कृष्ट सामंजस्य दर्शाती है।"
      }
    },
    head: {
      label: "मस्तिष्क रेखा (मस्तिष्क रेखा)",
      descriptions: {
        long_deep: "लंबी और गहरी मस्तिष्क रेखा तीक्ष्ण बुद्धि, विश्लेषणात्मक क्षमता और दूरदर्शिता का प्रतीक है।",
        long_faint: "व्यापक जिज्ञासा और बहुमुखी सोच को दर्शाती है।",
        short_deep: "त्वरित निर्णय लेने की क्षमता और व्यावहारिक सोच का संकेत देती है।",
        curved: "चंद्र पर्वत की ओर झुकाव रचनात्मकता और समृद्ध कल्पनाशीलता का प्रतीक है।",
        straight: "स्पष्ट, तार्किक और गणितीय सोच की क्षमता दर्शाती है।",
        forked: "द्विशाखी मस्तिष्क रेखा (लेखक रेखा) तार्किक व रचनात्मक सोच का शुभ मिश्रण है।"
      }
    },
    fate: {
      label: "भाग्य रेखा (भाग्य रेखा)",
      descriptions: {
        strong: "स्पष्ट और अटूट भाग्य रेखा उद्देश्यपूर्ण जीवन और करियर में सतत सफलता का प्रतीक है।",
        starts_late: "जीवन के उत्तरार्ध में भाग्य और सफलता का विशेष उदय होने का संकेत है।",
        starts_from_life: "स्वप्रयासों और पारिवारिक सहयोग से सफलता अर्जित होने का योग है।",
        starts_from_moon: "जनता, कला या समाज सेवा के माध्यम से प्रसिद्धि मिलने का योग है।",
        absent: "भाग्य रेखा का न होना मुक्त स्वभाव को दर्शाता है — आप स्वयं अपने भाग्य के निर्माता हैं।",
        forked: "एक साथ दो कार्यक्षेत्रों या प्रतिभाओं में सफलता का प्रतीक है।",
        broken: "करियर या जीवन दिशा में सकारात्मक परिवर्तन का संकेत है।"
      }
    },
    sun: {
      label: "सूर्य रेखा (सूर्य रेखा)",
      descriptions: {
        strong: "स्पष्ट सूर्य रेखा यश, प्रतिष्ठा, कलात्मक सफलता और स्वाभाविक आकर्षण का प्रतीक है।",
        faint: "रचनात्मक प्रतिभा का संकेत है जो निरंतर अभ्यास से निखरेगी।",
        absent: "सफलता कड़ी मेहनत और लगन से प्राप्त होने का संकेत देती है।",
        multiple: "एक से अधिक क्षेत्रों में प्रसिद्धि और कलात्मक निपुणता का योग है।",
        late: "आयु के उत्तरार्ध में विशेष सफलता और मान-सम्मान मिलने का संकेत है।"
      }
    },
    marriage: {
      label: "विवाह रेखा (विवाह रेखा)",
      descriptions: {
        one_deep: "एक गहरी और स्पष्ट रेखा एकनिष्ठ, प्रगाढ़ और स्थायी वैवाहिक संबंध का प्रतीक है।",
        two_lines: "दो रेखाएं जीवन में दो महत्वपूर्ण भावनात्मक संबंधों या परिपक्वता को दर्शाती हैं।",
        multiple: "भावुक और सामाजिक स्वभाव को दर्शाती है।",
        short: "विवाह व संबंधों में सावधानीपूर्वक चयन की प्रवृत्ति दर्शाती है।",
        absent: "स्वतंत्र जीवन शैली और व्यक्तिगत लक्ष्यों को प्राथमिकता देने का संकेत है।"
      }
    }
  },
  ta: {
    life: {
      label: "ஆயுள் ரேகை (Ayu Rekha)",
      descriptions: {
        long_deep: "நீளமான, ஆழமான ஆயுள் ரேகை நல் ஆரோக்கியம், மன உறுதி மற்றும் சகிப்புத்தன்மையைக் காட்டுகிறது.",
        long_faint: "நீளமான மெல்லிய ரேகை உணர்ச்சிப்பூர்வமான குணத்தையும் கவனமான ஓய்வின் அவசியத்தையும் காட்டுகிறது.",
        short_deep: "ஆழமான ரேகை வாழ்க்கையின் தரத்தையும் தீவிரத்தையும் காட்டுகிறது.",
        short_faint: "ஆற்றலை கவனமாக பயன்படுத்த வேண்டியதன் அவசியத்தைக் காட்டுகிறது.",
        curved: "வளைந்த ரேகை சுறுசுறுப்பான, சாகசமான குணத்தைக் காட்டுகிறது.",
        forked: "ரேகையின் இறுதியில் கிளையாகப் பிரிவது வாழ்க்கையில் புதிய மாற்றத்தைக் குறிக்கிறது."
      }
    },
    heart: {
      label: "இதய ரேகை (Hridaya Rekha)",
      descriptions: {
        long_deep: "ஆழமான இதய ரேகை உண்மையான அன்பு, விசுவாசம் மற்றும் உணர்ச்சிப் பெருக்கைக் காட்டுகிறது.",
        long_faint: "ஆழமான அன்பை விரும்பும் உணர்ச்சிகரமான குணத்தைக் குறிக்கிறது.",
        short_deep: "நடைமுறை அன்பையும் உறுதியான பிணைப்பையும் காட்டுகிறது.",
        curved_upward: "வளைந்த ரேகை அன்பான, தாராளமான உள்ளத்தைக் குறிக்கிறது.",
        straight: "பகுத்தறிவுடன் கூடிய அன்பைக் காட்டுகிறது.",
        chained: "உணர்ச்சிவசப்படும் குணத்தைக் காட்டுகிறது.",
        forked: "அறிவும் அன்பும் இணைந்த சமநிலையைக் காட்டுகிறது."
      }
    },
    head: {
      label: "புத்தி ரேகை (Mastishk Rekha)",
      descriptions: {
        long_deep: "நீளமான புத்தி ரேகை கூர்மையான அறிவு, பகுப்பாய்வு திறன் மற்றும் கூர்ந்த சிந்தனையைக் காட்டுகிறது.",
        long_faint: "பல்வேறு விஷயங்களில் ஆர்வமுள்ள மன நிலையை காட்டுகிறது.",
        short_deep: "வேகமான, சரியான முடிவெடுக்கும் திறனைக் காட்டுகிறது.",
        curved: "வளைந்த ரேகை கற்பனைத்திறன் மற்றும் படைப்பாற்றலைக் காட்டுகிறது.",
        straight: "நேர்த்தியான தர்க்கரீதியான சிந்தனையைக் காட்டுகிறது.",
        forked: "படைப்பாற்றலும் தர்க்கமும் இணைந்த திறமையைக் காட்டுகிறது."
      }
    },
    fate: {
      label: "விதி ரேகை (Bhagya Rekha)",
      descriptions: {
        strong: "தெளிவான விதி ரேகை தெளிவான லட்சியம் மற்றும் தொழில் வெற்றியைக் காட்டுகிறது.",
        starts_late: "வாழ்க்கையின் பிற்பகுதியில் பெரிய வெற்றியைக் குறிக்கிறது.",
        starts_from_life: "சுய முயற்சியால் வரும் வெற்றியைக் காட்டுகிறது.",
        starts_from_moon: "மக்கள் ஆதரவு மற்றும் கலைத்துறை புகழைக் காட்டுகிறது.",
        absent: "சுதந்திரமான சிந்தனையையும் சுய முன்னேற்றத்தையும் குறிக்கிறது.",
        forked: "இரட்டைத் தொழில் அல்லது திறமையைக் காட்டுகிறது.",
        broken: "வாழ்க்கைப் பாதையில் நல்ல மாற்றத்தைக் குறிக்கிறது."
      }
    },
    sun: {
      label: "சூரிய ரேகை (Surya Rekha)",
      descriptions: {
        strong: "சூரிய ரேகை புகழ், கலை வெற்றி மற்றும் கவர்ச்சியான ஆளுமையைக் காட்டுகிறது.",
        faint: "பயிற்சியால் வளரும் கலைத் திறனைக் குறிக்கிறது.",
        absent: "உழைப்பால் வரும் நிலையான வெற்றியைக் காட்டுகிறது.",
        multiple: "பல்வேறு துறைகளில் புகழைத் தரும்.",
        late: "பிற்பகுதியில் வரும் புகழைக் குறிக்கிறது."
      }
    },
    marriage: {
      label: "திருமண ரேகை (Vivah Rekha)",
      descriptions: {
        one_deep: "ஆழமான ரேகை உறுதியான, அன்பான திருமண வாழ்க்கையைக் காட்டுகிறது.",
        two_lines: "இரண்டு முக்கிய உணர்வுப்பூர்வ பந்தங்களைக் குறிக்கிறது.",
        multiple: "சமூக அக்கறையும் அன்பான குணமும் கொண்டவர்.",
        short: "கவனமாக தேர்வு செய்யும் குணத்தைக் காட்டுகிறது.",
        absent: "சுதந்திரமான வாழ்வியலைக் குறிக்கிறது."
      }
    }
  },
  te: {
    life: {
      label: "ఆయుష్షు రేఖ (Ayu Rekha)",
      descriptions: {
        long_deep: "పొడవైన, లోతైన ఆయుష్షు రేఖ మంచి ఆరోగ్యం, చైతన్యం మరియు అపారమైన సహనానికి సంకేతం.",
        long_faint: "సున్నితమైన మనస్తత్వం మరియు విశ్రాంతి అవసరాన్ని సూచిస్తుంది.",
        short_deep: "జీవిత నాణ్యత మరియు తీవ్రతను సూచిస్తుంది.",
        short_faint: "శక్తిని సమర్థవంతంగా ఉపయోగించుకోవాలని సూచిస్తుంది.",
        curved: "ఉత్సాహభరితమైన మరియు సాహసవంతమైన స్వభావాన్ని సూచిస్తుంది.",
        forked: "జీవితంలో కొత్త మార్పు లేదా అధ్యాయాన్ని సూచిస్తుంది."
      }
    },
    heart: {
      label: "హృదయ రేఖ (Hridaya Rekha)",
      descriptions: {
        long_deep: "లోతైన హృదయ రేఖ నిజమైన ప్రేమ, నిష్కల్మషమైన బంధాలకు సంకేతం.",
        long_faint: "ఆదర్శవంతమైన ప్రేమను కోరుకునే మనస్తత్వం.",
        short_deep: "వాస్తవిక మరియు నమ్మకమైన ప్రేమ స్వభావం.",
        curved_upward: "ప్రేమపూర్వకమైన, దయాగల హృదయానికి సంకేతం.",
        straight: "సమతుల్య మరియు ఆలోచనాత్మకమైన ప్రేమ స్వభావం.",
        chained: "సున్నితమైన భావోద్వేగాలకు సంకేతం.",
        forked: "జ్ఞానం మరియు ప్రేమ కలగలిసిన సమతుల్యత."
      }
    },
    head: {
      label: "మస్తిష్క రేఖ (Mastishk Rekha)",
      descriptions: {
        long_deep: "పొడవైన మస్తిష్క రేఖ పదునైన తెలివితేటలు, విశ్లేషణ రంగానికి సంకేతం.",
        long_faint: "వివిధ విషయాలపై కుతూహలం ఉన్న మనస్తత్వం.",
        short_deep: "వేగవంతమైన, సరైన నిర్ణయాలు తీసుకునే సామర్థ్యం.",
        curved: "సృజనాత్మకత మరియు ఊహాశక్తికి సంకేతం.",
        straight: "తార్కిక మరియు నిర్దిష్టమైన ఆలోచనా విధానం.",
        forked: "సృజనాత్మకత మరియు తార్కిక ఆలోచనల అద్భుత కలయిక."
      }
    },
    fate: {
      label: "భాగ్య రేఖ (Bhagya Rekha)",
      descriptions: {
        strong: "స్పష్టమైన భాగ్య రేఖ స్పష్టమైన గమ్యం మరియు కెరీర్ విజయానికి సంకేతం.",
        starts_late: "వయస్సు పెరిగే కొద్దీ పెద్ద విజయం సాధిస్తారు.",
        starts_from_life: "స్వయంకృషితో లభించే విజయానికి సంకేతం.",
        starts_from_moon: "ప్రజాదరణ మరియు కళారంగంలో కీర్తి.",
        absent: "స్వేచ్ఛా జీవితం మరియు స్వయం పురోగతికి సంకేతం.",
        forked: "రెండు రంగాలలో విజయానికి సంకేతం.",
        broken: "జీవితంలో మంచి మార్పుకు సంకేతం."
      }
    },
    sun: {
      label: "సూర్య రేఖ (Surya Rekha)",
      descriptions: {
        strong: "సూర్య రేఖ కీర్తి, కళాత్మక విజయం మరియు ఆకర్షణకు సంకేతం.",
        faint: "సాధన ద్వారా పెరిగే కళా నైపుణ్యం.",
        absent: "కష్టపడి సాధించే స్థిరమైన విజయం.",
        multiple: "బహుముఖ ప్రజ్ఞ మరియు కీర్తి.",
        late: "రెండవ భాగంలో లభించే కీర్తి."
      }
    },
    marriage: {
      label: "వివాహ రేఖ (Vivah Rekha)",
      descriptions: {
        one_deep: "లోతైన రేఖ నమ్మకమైన, సంతోషకరమైన దాంపత్యానికి సంకేతం.",
        two_lines: "రెండు ముఖ్యమైన భావోద్వేగ బంధాలు.",
        multiple: "సామాజిక మరియు ప్రేమపూర్వక స్వభావం.",
        short: "జాగ్రత్తగా ఎంచుకునే మనస్తత్వం.",
        absent: "స్వతంత్ర జీవన శైలికి సంకేతం."
      }
    }
  },
  sa: {
    life: {
      label: "आयुःरेखा (Ayu Rekha)",
      descriptions: {
        long_deep: "दीर्घा गभीरा च आयुःरेखा उत्तमस्वास्थ्यं प्राणशक्तिं धैर्यं च दर्शयति।",
        long_faint: "दीर्घा मन्दा रेखा संवेदनशीलभावं विश्रामस्यावश्यकतां च सूचयति।",
        short_deep: "गभीरा रेखा जीवनस्य गुणवत्तां तीव्रतां च दर्शयति।",
        short_faint: "ऊर्जायाः विवेकपूर्णप्रयोगं सूचयति।",
        curved: "वक्ररेखा साहसिकं तेजस्विनं स्वभावं दर्शयति।",
        forked: "रेखायाः अन्ते द्विधा विभाजनं नूतनाध्यायस्य सूचकम्।"
      }
    },
    heart: {
      label: "हृदयरेखा (Hridaya Rekha)",
      descriptions: {
        long_deep: "गभीरा हृदयरेखा सत्यप्रेम निष्कपटसम्बन्धं च दर्शयति।",
        long_faint: "भावनात्मकम् आदर्शवादं सूचयति।",
        short_deep: "व्यावहारिकं निष्ठापूर्णं च स्वभावं दर्शयति।",
        curved_upward: "तर्जनीं प्रति वक्ररेखा उदारं प्रेमीहृदयं सूचयति।",
        straight: "सन्तुलितं विचारपूर्णं च दृष्टिकोणं दर्शयति।",
        chained: "संवेदनशीलस्वभावस्य सूचकम्।",
        forked: "ज्ञानस्य प्रेम्णश्च सुन्दरं सन्तुलनम्।"
      }
    },
    head: {
      label: "मस्तिष्करेखा (Mastishk Rekha)",
      descriptions: {
        long_deep: "दीर्घा मस्तिष्करेखा तीक्ष्णबुद्धिं दूरदर्शितां च दर्शयति।",
        long_faint: "बहुविधविषयेषु जिज्ञासां सूचयति।",
        short_deep: "शीघ्रनिर्णयक्षमतां दर्शयति।",
        curved: "चन्द्रपर्वतं प्रति झुकावः कल्पनाशक्तिं रचनात्मतां च सूचयति।",
        straight: "स्पष्टां तार्किकबुद्धिं दर्शयति।",
        forked: "रचनात्मकतायाः तार्किकबुद्धेश्च उत्तमं मिश्रणम्।"
      }
    },
    fate: {
      label: "भाग्यरेखा (Bhagya Rekha)",
      descriptions: {
        strong: "स्पष्टा भाग्यरेखा स्पष्टं लक्ष्यं वृत्तिसाफलतां च दर्शयति।",
        starts_late: "उत्तरवयसि महतीं सफलतां सूचयति।",
        starts_from_life: "स्वप्रयासेन प्राप्तां सफलतां दर्शयति।",
        starts_from_moon: "लोकप्रियतां कलाक्षेत्रे यशश्च सूचयति।",
        absent: "स्वतंत्रस्वभावं स्वभाग्यनिर्माणं च दर्शयति।",
        forked: "क्षेत्रद्वये सफलतायाः सूचकम्।",
        broken: "जीवनमार्गे शुभपरिवर्तनं सूचयति।"
      }
    },
    sun: {
      label: "सूर्यरेखा (Surya Rekha)",
      descriptions: {
        strong: "सूर्यरेखा प्रतिष्ठां कलासाफलतां तेजश्च दर्शयति।",
        faint: "अभ्यासेन वर्धमानां कलाप्रतिभां सूचयति।",
        absent: "परिश्रमेण प्राप्तां स्थिरां सफलतां दर्शयति।",
        multiple: "बहुविधक्षेत्रेषु यशः सूचयति।",
        late: "उत्तरवयसि प्राप्तां प्रतिष्ठां दर्शयति।"
      }
    },
    marriage: {
      label: "विवाहरेखा (Vivah Rekha)",
      descriptions: {
        one_deep: "गभीरा रेखा निष्ठापूर्णं सुखदं दाम्पत्यं दर्शयति।",
        two_lines: "सम्बन्धद्वयस्य महत्त्वं सूचयति।",
        multiple: "प्रेमपूर्णं सामाजिकं स्वभावं दर्शयति।",
        short: "सावधानतापूर्वकं वरणं सूचयति।",
        absent: "स्वतंत्रजीवनशैलीं सूचयति।"
      }
    }
  }
};

const PALM_MOUNTS_LOCALIZED = {
  hi: {
    jupiter: {
      label: "गुरु पर्वत (Mount of Jupiter)",
      prominent: "उन्नत गुरु पर्वत नेतृत्व क्षमता, महत्वाकांक्षा, आशावाद और समाज का मार्गदर्शन करने की इच्छा का प्रतीक है।",
      flat: "समतल गुरु पर्वत विनम्रता और सेवा भाव का संकेत देता है।",
      overdeveloped: "अत्यधिक विकसित गुरु पर्वत आत्मविश्वास के साथ धैर्य बनाए रखने का संकेत देता है।"
    },
    saturn: {
      label: "शनि पर्वत (Mount of Saturn)",
      prominent: "उन्नत शनि पर्वत गंभीरता, अनुशासन, न्यायप्रियता और शोध-चिंतन की क्षमता दर्शाता है।",
      flat: "समतल शनि पर्वत जीवन में लचीलेपन और सहजता का प्रतीक है।",
      overdeveloped: "अत्यधिक विकसित शनि पर्वत अत्यधिक सावधानी से बचने की सलाह देता है।"
    },
    sun_mount: {
      label: "सूर्य पर्वत (Mount of Sun)",
      prominent: "उन्नत सूर्य पर्वत कलात्मक रुचि, आकर्षण, प्रतिभा और सामाजिक प्रतिष्ठा का प्रतीक है।",
      flat: "समतल सूर्य पर्वत व्यक्तिगत और निजी रूप से कार्य करने की प्रवृत्ति दर्शाता है।",
      overdeveloped: "अत्यधिक विकसित सूर्य पर्वत रचनात्मकता को निस्वार्थ भाव से व्यक्त करने का संकेत देता है।"
    },
    mercury: {
      label: "बुध पर्वत (Mount of Mercury)",
      prominent: "उन्नत बुध पर्वत वाकपटुता, व्यापारिक समझ, वाक्-चातुर्य और तकनीकी दक्षता का प्रतीक है।",
      flat: "समतल बुध पर्वत गंभीर और विचारपूर्वक बोलने का संकेत देता है।",
      overdeveloped: "अत्यधिक विकसित बुध पर्वत बुद्धि का प्रयोग सत्य और पारदर्शिता में करने की प्रेरणा देता है।"
    },
    venus: {
      label: "शुक्र पर्वत (Mount of Venus)",
      prominent: "उन्नत शुक्र पर्वत सौंदर्यबोध, आकर्षण, प्रेम भावना और जीवन में सुख-समृद्धि का प्रतीक है।",
      flat: "समतल शुक्र पर्वत सादगी और आध्यात्मिक जुड़ाव का संकेत देता है।",
      overdeveloped: "अत्यधिक विकसित शुक्र पर्वत ऊर्जा को कलात्मक कार्यों में लगाने की सलाह देता है।"
    },
    moon_mount: {
      label: "चंद्र पर्वत (Mount of Luna)",
      prominent: "उन्नत चंद्र पर्वत समृद्ध कल्पनाशीलता, अंतर्ज्ञान, रचनात्मकता और आध्यात्मिक रुझान का प्रतीक है।",
      flat: "समतल चंद्र पर्वत व्यावहारिक और तथ्य-आधारित सोच को दर्शाता है।",
      overdeveloped: "अत्यधिक विकसित चंद्र पर्वत ध्यान और प्राकृतिक गतिविधियों से मन को शांत रखने का संकेत देता है।"
    },
    mars_inner: {
      label: "मंगल पर्वत - आंतरिक (Inner Mars)",
      prominent: "उन्नत आंतरिक मंगल साहस, निर्भीकता और शारीरिक ऊर्जा का प्रतीक है।",
      flat: "समतल आंतरिक मंगल शांतिपूर्ण और कूटनीतिक दृष्टिकोण को दर्शाता है।"
    },
    mars_outer: {
      label: "मंगल पर्वत - बाह्य (Outer Mars)",
      prominent: "उन्नत बाह्य मंगल सहनशीलता, धैर्य और कठिन परिस्थितियों से लड़ने की क्षमता दर्शाता है।",
      flat: "समतल बाह्य मंगल विचारशील और आत्म-विश्लेषणात्मक प्रकृति को दर्शाता है।"
    }
  },
  ta: {
    jupiter: { label: "குரு மேடு (Mount of Jupiter)" },
    saturn: { label: "சனி மேடு (Mount of Saturn)" },
    sun_mount: { label: "சூரிய மேடு (Mount of Sun)" },
    mercury: { label: "புதன் மேடு (Mount of Mercury)" },
    venus: { label: "சுக்கிரன் மேடு (Mount of Venus)" },
    moon_mount: { label: "சந்திரன் மேடு (Mount of Luna)" },
    mars_inner: { label: "உள் செவ்வாய் (Inner Mars)" },
    mars_outer: { label: "வெளி செவ்வாய் (Outer Mars)" }
  },
  te: {
    jupiter: { label: "గురు పర్వతం (Mount of Jupiter)" },
    saturn: { label: "శని పర్వతం (Mount of Saturn)" },
    sun_mount: { label: "సూర్య పర్వతం (Mount of Sun)" },
    mercury: { label: "బుధ పర్వతం (Mount of Mercury)" },
    venus: { label: "శుక్ర పర్వతం (Mount of Venus)" },
    moon_mount: { label: "చంద్ర పర్వతం (Mount of Luna)" },
    mars_inner: { label: "అంతర కుజ పర్వతం (Inner Mars)" },
    mars_outer: { label: "బాహ్య కుజ పర్వతం (Outer Mars)" }
  },
  sa: {
    jupiter: { label: "गुरुपर्वतः (Mount of Jupiter)" },
    saturn: { label: "शनिपर्वतः (Mount of Saturn)" },
    sun_mount: { label: "सूर्यपर्वतः (Mount of Sun)" },
    mercury: { label: "बुधपर्वतः (Mount of Mercury)" },
    venus: { label: "शुक्रपर्वतः (Mount of Venus)" },
    moon_mount: { label: "चन्द्रपर्वतः (Mount of Luna)" },
    mars_inner: { label: "आन्तरिकमङ्गलपर्वतः (Inner Mars)" },
    mars_outer: { label: "वाह्यमङ्गलपर्वतः (Outer Mars)" }
  }
};

const HAND_TYPES_LOCALIZED = {
  hi: {
    fire: {
      label: "अग्नि हस्त (Agni Hast)",
      description: "वर्गाकार हथेली और छोटी उंगलियां — ऊर्जावान, उत्साही और नेतृत्वप्रिय स्वभाव का प्रतीक। आप निडर होकर पहल करते हैं और दूसरों को प्रेरित करते हैं।",
      traits: ["स्वाभाविक नेता", "उत्साही पहलकर्ता", "साहसी निर्णयकर्ता", "उच्च शारीरिक ऊर्जा", "उद्यमी दृष्टिकोण"],
      vedic: "अग्नि तत्व प्रधान — मंगल एवं सूर्य ग्रह की ऊर्जा बलवान है।"
    },
    earth: {
      label: "पृथ्वी हस्त (Earth Hand)",
      description: "वर्गाकार हथेली और मोटी रेखाएं — व्यावहारिक, स्थिर और भरोसेमंद व्यक्तित्व का प्रतीक। आप ठोस नींव का निर्माण करते हैं।",
      traits: ["स्थिर और भरोसेमंद", "व्यावहारिक निर्माता", "कठिन परिश्रमी", "धैर्यवान", "गंभीर सोच"],
      vedic: "पृथ्वी तत्व प्रधान — शनि एवं शुक्र ग्रह का प्रभाव है।"
    },
    air: {
      label: "वायु हस्त (Air Hand)",
      description: "वर्गाकार हथेली और लंबी उंगलियां — तीक्ष्ण बुद्धि, उत्कृष्ट संवाद कौशल और विश्लेषणात्मक क्षमता का प्रतीक।",
      traits: ["तीक्ष्ण बुद्धि", "कुशल वक्ता", "विश्लेषणात्मक सोच", "विचारशील", "सामाजिक रूप से दक्ष"],
      vedic: "वायु तत्व प्रधान — बुध ग्रह का प्रभाव बलवान है।"
    },
    water: {
      label: "जल हस्त (Water Hand)",
      description: "लंबी हथेली और लंबी उंगलियां — संवेदनशील, भावुक, रचनात्मक और सहज ज्ञान से परिपूर्ण आत्मा का प्रतीक।",
      traits: ["संवेदनशील व दयालु", "रचनात्मक प्रतिभा", "सहज अंतर्ज्ञान", "भावनात्मक परिपक्वता", "आध्यात्मिक रुझान"],
      vedic: "जल तत्व प्रधान — चंद्र एवं गुरु ग्रह का प्रभाव मार्गदर्शक है।"
    }
  },
  ta: {
    fire: { label: "அக்னி கை (Fire Hand)" },
    earth: { label: "பிருத்வி கை (Earth Hand)" },
    air: { label: "வாயு கை (Air Hand)" },
    water: { label: "ஜல கை (Water Hand)" }
  },
  te: {
    fire: { label: "అగ్ని హస్తం (Fire Hand)" },
    earth: { label: "పృథ్వి హస్తం (Earth Hand)" },
    air: { label: "వాయు హస్తం (Air Hand)" },
    water: { label: "జల హస్తం (Water Hand)" }
  },
  sa: {
    fire: { label: "अग्निहस्तः (Fire Hand)" },
    earth: { label: "पृथ्वीहस्तः (Earth Hand)" },
    air: { label: "वायुहस्तः (Air Hand)" },
    water: { label: "जलहस्तः (Water Hand)" }
  }
};

// ───────────────────────────── HELPER FUNCTIONS ─────────────────────────────

function getActiveLang() {
  return (typeof I18N !== "undefined" && I18N.currentLang) ? I18N.currentLang : "en";
}

function getLocalizedHandType(handType, lang = getActiveLang()) {
  const base = HAND_TYPES[handType] || HAND_TYPES.fire;
  if (lang === "en" || !HAND_TYPES_LOCALIZED[lang] || !HAND_TYPES_LOCALIZED[lang][handType]) {
    return base;
  }
  const loc = HAND_TYPES_LOCALIZED[lang][handType];
  return { ...base, ...loc };
}

function getLocalizedLineData(lineKey, chosenVariant, lang = getActiveLang()) {
  const base = PALM_LINES[lineKey];
  if (!base) return null;

  let label = base.label;
  let reading = base.descriptions[chosenVariant] || Object.values(base.descriptions)[0];

  if (lang !== "en" && PALM_LINES_LOCALIZED[lang] && PALM_LINES_LOCALIZED[lang][lineKey]) {
    const loc = PALM_LINES_LOCALIZED[lang][lineKey];
    if (loc.label) label = loc.label;
    if (loc.descriptions && loc.descriptions[chosenVariant]) {
      reading = loc.descriptions[chosenVariant];
    }
  }

  return {
    label,
    icon: base.icon,
    sanskrit: base.sanskrit,
    color: base.color,
    variant: chosenVariant,
    reading
  };
}

function getLocalizedMountData(mountKey, prominence, lang = getActiveLang()) {
  const base = PALM_MOUNTS[mountKey];
  if (!base) return null;

  let label = base.label;
  let reading = base[prominence] || base.prominent;

  if (lang !== "en" && PALM_MOUNTS_LOCALIZED[lang] && PALM_MOUNTS_LOCALIZED[lang][mountKey]) {
    const loc = PALM_MOUNTS_LOCALIZED[lang][mountKey];
    if (loc.label) label = loc.label;
    if (loc[prominence]) {
      reading = loc[prominence];
    }
  }

  return {
    label,
    icon: base.icon,
    planet: base.planet,
    prominence,
    reading
  };
}

// ───────────────────────────── READING LOGIC ─────────────────────────────

/**
 * Generate a palmistry reading based on user selections.
 */
function generatePalmReading(selections, lang = getActiveLang()) {
  const { handType, lineSelections, mountSelections } = selections;

  const handData = getLocalizedHandType(handType, lang);

  // Build line readings
  const lines = {};
  for (const [lineKey, chosenVariant] of Object.entries(lineSelections)) {
    const lineRes = getLocalizedLineData(lineKey, chosenVariant, lang);
    if (lineRes) lines[lineKey] = lineRes;
  }

  // Build mount readings
  const mounts = {};
  for (const [mountKey, prominence] of Object.entries(mountSelections)) {
    const mountRes = getLocalizedMountData(mountKey, prominence, lang);
    if (mountRes) mounts[mountKey] = mountRes;
  }

  // Overall synthesis
  const overallSummary = generateOverallSummary(handType, lineSelections, mountSelections, lang);
  const advice = generateAuspiciousAdvice(handType, lineSelections, lang);

  return {
    handType: {
      key: handType,
      label: handData.label,
      icon: handData.icon,
      description: handData.description,
      traits: handData.traits,
      vedic: handData.vedic
    },
    lines,
    mounts,
    overallSummary,
    auspiciousAdvice: advice,
    timestamp: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
  };
}

function generateOverallSummary(handType, lineSelections, mountSelections, lang = getActiveLang()) {
  const summaries = {
    en: {
      fire: "Your palm resonates with the energy of transformation and leadership. The Fire hand signature combined with your line patterns reveals a soul who leads through action, inspires through courage, and continuously evolves through bold life experiences.",
      earth: "Your palm carries the wisdom of deep roots and patient mastery. The Earth hand signature combined with your line patterns reveals a soul who builds lasting foundations, honours tradition, and creates enduring value through steady, committed effort.",
      air: "Your palm vibrates with the frequency of intellect and inspired communication. The Air hand signature combined with your line patterns reveals a mind that bridges worlds, a voice that illuminates, and a spirit that thrives when sharing ideas and connecting hearts.",
      water: "Your palm flows with the depth of feeling and creative imagination. The Water hand signature combined with your line patterns reveals a soul of extraordinary sensitivity — one who transforms personal experience into beauty, healing, and spiritual insight for all."
    },
    hi: {
      fire: "आपकी हथेली रूपांतरण और नेतृत्व की ऊर्जा से भरपूर है। अग्नि हस्त की रेखाएं दर्शाती हैं कि आप साहसी कर्मों द्वारा दूसरों को प्रेरित करते हैं और निरंतर प्रगति करते हैं।",
      earth: "आपकी हथेली में धैर्य और स्थिरता का निवास है। पृथ्वी हस्त का यह योग दर्शाता है कि आप टिकाऊ नींव का निर्माण करते हैं और निष्ठावान प्रयासों से दीर्घकालिक सफलता अर्जित करते हैं।",
      air: "आपकी हथेली बुद्धि और कुशाग्र संवाद क्षमता का प्रतीक है। वायु हस्त का यह योग दर्शाता है कि आप विचारों का आदान-प्रदान करने और बौद्धिक कार्यों में उत्कृष्टता प्राप्त करते हैं।",
      water: "आपकी हथेली गहरी संवेदनशीलता और समृद्ध कल्पनाशीलता का प्रतीक है। जल हस्त का यह योग दर्शाता है कि आप कला, सेवा और आध्यात्मिक अंतर्दृष्टि द्वारा जीवन को समृद्ध बनाते हैं।"
    },
    ta: {
      fire: "உங்கள் உள்ளங்கை ஆற்றல் மற்றும் தலைமைத்துவத்தைக் காட்டுகிறது. அக்னி கை அமைப்பு தைரியமான செயல்களால் மற்றவர்களை வழிநடத்தும் குணத்தைக் குறிக்கிறது.",
      earth: "உங்கள் உள்ளங்கை அமைதியும் நிலைத்தன்மையும் கொண்டது. பிருத்வி கை அமைப்பு உழைப்பால் நிலையான வெற்றியைத் தரும்.",
      air: "உங்கள் உள்ளங்கை அறிவுக் கூர்மையையும் சிறந்த உரையாடல் திறனையும் காட்டுகிறது. வாயு கை அமைப்பு புதிய சிந்தனைகளுக்கு வழிவகுக்கும்.",
      water: "உங்கள் உள்ளங்கை ஆழ்ந்த உணர்ச்சியையும் கலைத்திறனையும் காட்டுகிறது. ஜல கை அமைப்பு படைப்பாற்றல் மற்றும் ஆன்மீக அறிவைத் தரும்."
    },
    te: {
      fire: "మీ అరచేయి నాయకత్వ శక్తికి సంకేతం. అగ్ని హస్తం ధైర్యవంతమైన పనులతో ఇతరులను ప్రేరేపించే స్వభావాన్ని సూచిస్తుంది.",
      earth: "మీ అరచేయి ఓపిక మరియు స్థిరత్వానికి సంకేతం. పృథ్వి హస్తం కష్టపడి సాధించే స్థిరమైన విజయానికి సూచిక.",
      air: "మీ అరచేయి పదునైన తెలివితేటలు మరియు ఉత్తమ సంభాషణ నైపుణ్యాలకు సంకేతం. వాయు హస్తం నూతన ఆలోచనలకు దారితీస్తుంది.",
      water: "మీ అరచేయి సున్నితమైన భావోద్వేగాలు మరియు సృజనాత్మకతకు సంకేతం. జల హస్తం ఆధ్యాత్మిక జ్ఞానాన్ని ఇస్తుంది."
    },
    sa: {
      fire: "भवतः हस्ततलं तेजसः नेतृत्वस्य च प्रतीकम् अस्ति। अग्निहस्तस्य रेखाः दर्शयन्ति यत् भवान् साहसिककर्मभिः अन्यान् प्रेरयति।",
      earth: "भवतः हस्ततलं धैर्यस्य स्थिरतायाः च प्रतीकम् अस्ति। पृथ्वीहस्तस्य योगः दर्शयति यत् भवान् दृढनीवं रचयति।",
      air: "भवतः हस्ततलं बुद्धेः उत्तमसंवादस्य च प्रतीकम् अस्ति। वायुहस्तस्य योगः बौद्धिकोत्कर्षं दर्शयति।",
      water: "भवतः हस्ततलं भावुकतायाः रचनात्मतायाः च प्रतीकम् अस्ति। जलहस्तस्य योगः कलात्मकतां सूचयति।"
    }
  };

  const dict = summaries[lang] || summaries.en;
  return dict[handType] || dict.fire;
}

function generateAuspiciousAdvice(handType, lineSelections, lang = getActiveLang()) {
  const adviceMap = {
    en: {
      fire: [
        "Wear Ruby (Manikya) or Red Coral on Tuesday mornings to amplify Mars energy.",
        "Chant 'Om Suryaya Namaha' 108 times at sunrise to channel leadership energy.",
        "Perform Surya Namaskar daily — your Fire hand thrives with morning physical activation."
      ],
      earth: [
        "Wear Blue Sapphire (Neelam) or Hessonite Garnet on Saturday after sunrise for Saturn's grounding blessings.",
        "Carry an Aventurine crystal — the stone of stable prosperity aligned with Earth energy.",
        "Maintain a gratitude journal — Earth hand natives flourish when counting their blessings."
      ],
      air: [
        "Wear Emerald (Panna) on Wednesday mornings set in gold or silver for Mercury's intellectual blessings.",
        "Chant 'Om Budhaya Namaha' 108 times on Wednesdays to sharpen Mercury's gifts.",
        "Practice Pranayama (breath work) daily — Air hand natives harmonize mind and breath."
      ],
      water: [
        "Wear Natural Pearl (Moti) or Moonstone on Monday evenings for Moon's intuitive blessings.",
        "Chant 'Om Chandraya Namaha' 108 times on Mondays to deepen psychic and creative gifts.",
        "Moon-gaze and journal on full moon nights — Water hand natives receive profound inspiration under lunar light."
      ]
    },
    hi: {
      fire: [
        "मंगलवार की सुबह माणिक्य या लाल मूंगा धारण करने से मंगल व सूर्य ग्रह की ऊर्जा प्रखर होती है।",
        "सूर्योदय के समय 108 बार 'ॐ सूर्याय नमः' का जाप करें।",
        "प्रतिदिन सूर्य नमस्कार करें — अग्नि हस्त जातकों के लिए सुबह का शारीरिक अभ्यास विशेष फलदायी है।"
      ],
      earth: [
        "शनिवार को सूर्योदय के बाद नीलम या गोमेद धारण करने से शनि देव का आशीर्वाद प्राप्त होता है।",
        "ग्रीन एवेंट्यूरिन रत्न या क्रिस्टल अपने पास रखें।",
        "कृतज्ञता डायरी लिखें — पृथ्वी हस्त जातक धन्यवाद भाव रखने से समृद्ध होते हैं।"
      ],
      air: [
        "बुधवार की सुबह सोने या चांदी में पन्ना धारण करने से बुध देव की कृपा प्राप्त होती है।",
        "बुधवार को 108 बार 'ॐ बुधाय नमः' का जाप करें।",
        "प्रतिदिन प्राणायाम का अभ्यास करें — वायु हस्त जातकों के लिए श्वास संतुलन अत्यंत लाभकारी है।"
      ],
      water: [
        "सोमवार की शाम को सच्चा मोती या मूनस्टोन धारण करने से चंद्रमा का शुभ प्रभाव बढ़ता है।",
        "सोमवार को 108 बार 'ॐ चंद्राय नमः' का जाप करें।",
        "पूर्णिमा की रात को चंद्रमा के दर्शन करें और ध्यान लगाएं — जल हस्त जातक चंद्र प्रकाश से ऊर्जा प्राप्त करते हैं।"
      ]
    },
    ta: {
      fire: [
        "செவ்வாய் காலை மாணிக்கம் அல்லது பவளம் அணிவது செவ்வாய் மற்றும் சூரியனின் ஆற்றலை அதிகரிக்கும்.",
        "சூரிய உதயத்தின் போது 108 முறை 'ஓம் சூர்யாய நமஹ' ஜெபிக்கவும்.",
        "தினமும் சூரிய நமஸ்காரம் செய்யுங்கள் — இது உடலுக்கு புத்துணர்ச்சி தரும்."
      ],
      earth: [
        "சனிக்கிழமை சூரிய உதயத்திற்கு பின் நீலக்கல் அணிவது சனியின் அருளைத் தரும்.",
        "அவென்டூரின் படிகத்தை உங்களுடன் வைத்திருங்கள்.",
        "நன்றி உணர்வுடன் இருங்கள் — இது உங்களுக்கு வளத்தைத் தரும்."
      ],
      air: [
        "புதன்கிழமை காலை மரகதம் அணிவது புதனின் அருளைப் பெற்றுத் தரும்.",
        "புதன்கிழமைகளில் 108 முறை 'ஓம் புதாய நமஹ' ஜெபிக்கவும்.",
        "தினமும் பிராணாயாமம் செய்யுங்கள் — இது மன அமைதியைத் தரும்."
      ],
      water: [
        "திங்கட்கிழமை மாலை இயற்கை முத்து அணிவது சந்திரனின் அருளைத் தரும்.",
        "திங்கட்கிழமைகளில் 108 முறை 'ஓம் சந்திராய நமஹ' ஜெபிக்கவும்.",
        "பௌர்ணமி இரவில் சந்திரனை தியானியுங்கள்."
      ]
    },
    te: {
      fire: [
        "మంగళవారం ఉదయం కెంపు లేదా పగడ ధారణ చేయడం వల్ల కుజ, సూర్య గ్రహాల శక్తి పెరుగుతుంది.",
        "సూర్యోదయం వేళ 108 సార్లు 'ఓం సూర్యాయ నమః' జపించండి.",
        "రోజూ సూర్య నమస్కారాలు చేయండి — ఇది మీకు శారీరక చైతన్యాన్ని ఇస్తుంది."
      ],
      earth: [
        "శనివారం ఉదయం నీలం లేదా గోమేధిక ధారణ చేయడం శని దేవుని అనుగ్రహాన్ని ఇస్తుంది.",
        "అవెంచురైన్ క్రిస్టల్ మీ వద్ద ఉంచుకోండి.",
        "కృతజ్ఞతా భావంతో ఉండండి — ఇది మీ అభివృద్ధికీ దోహదపడుతుంది."
      ],
      air: [
        "బుధవారం ఉదయం పచ్చ (ఎమరాల్డ్) ధరించడం వల్ల బుధ గ్రహ అనుగ్రహం లభిస్తుంది.",
        "బుధవారాలు 108 సార్లు 'ఓం బుధాయ నమః' జపించండి.",
        "రోజూ ప్రాణాయామం చేయండి — ఇది మానసిక ప్రశాంతతను ఇస్తుంది."
      ],
      water: [
        "సోమవారం సాయంత్రం ముత్యం లేదా మూన్‌స్టోన్ ధరించడం చంద్రుని అనుగ్రహాన్ని ఇస్తుంది.",
        "సోమవారాలు 108 సార్లు 'ఓం చంద్రాయ నమః' జపించండి.",
        "పౌర్ణమి నాడు చంద్ర దర్శనం చేసి ధ్యానం చేయండి."
      ]
    },
    sa: {
      fire: [
        "मंगलवारे प्रातःकाले माणिक्यं विद्रुमं वा धृत्वा मङ्गलसूर्ययोः ऊर्जा वर्धते।",
        "सूर्योदये १०८ वारं 'ॐ सूर्याय नमः' इति जपतु।",
        "प्रतिदिनं सूर्यनमस्कारं करोतु — अग्निहस्तजातकानाम् कृते प्रातःकाले शारीरिकक्रिया अतीव फलप्रदा।"
      ],
      earth: [
        "शनिवासरे प्रातः इन्द्रनीलं धृत्वा शनिदेवस्य कृपा लभ्यते।",
        "ग्रीन्-एवेन्ट्युरीन्-मणिं पार्श्वे स्थापयतु।",
        "कृतज्ञताभावेन जीवतु — एतेन समृद्धिः भवति।"
      ],
      air: [
        "बुधवासरे प्रातः मरकतं धृत्वा बुधदेवस्य कृपा लभ्यते।",
        "बुधवासरे १०८ वारं 'ॐ बुधाय नमः' इति जपतु।",
        "प्रतिदिनं प्राणायामं करोतु — वायुहस्तजातकानाम् कृते श्वाससन्तुलनम् अतीव लाभप्रदम्।"
      ],
      water: [
        "सोमवासरे सायं मौक्तिकं धृत्वा चन्द्रस्य शुभप्रभावः वर्धते।",
        "सोमवासरे १०८ वारं 'ॐ चन्द्राय नमः' इति जपतु।",
        "पूर्णिमायां रात्रौ चन्द्रदर्शनं ध्यानं च करोतु।"
      ]
    }
  };

  const dict = adviceMap[lang] || adviceMap.en;
  return dict[handType] || dict.fire;
}

// ─────────────────────────── PALM SVG DIAGRAM ───────────────────────────

function renderPalmSVG(activeLine = null) {
  const lineColors = {
    life: "#10b981",
    heart: "#f43f5e",
    head: "#38bdf8",
    fate: "#ffd166",
    sun: "#f59e0b",
    marriage: "#8b5cf6"
  };

  const getLineStyle = (key) => {
    const isActive = activeLine === key;
    const color = lineColors[key] || "#fff";
    return `stroke="${color}" stroke-width="${isActive ? 4 : 2}" opacity="${isActive ? 1 : 0.55}" stroke-linecap="round" fill="none"`;
  };

  return `
<svg viewBox="0 0 220 320" xmlns="http://www.w3.org/2000/svg" class="palm-svg" role="img" aria-label="Palm diagram showing hand lines">
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="skinGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2a1f3d" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#1a1230" stop-opacity="0.98"/>
    </radialGradient>
  </defs>

  <path d="M 55 280 Q 30 260 28 220 Q 26 170 30 130 Q 32 105 40 90
           Q 45 78 48 55 Q 50 42 58 40 Q 66 38 68 50 Q 70 65 70 80
           Q 75 55 80 42 Q 85 30 94 30 Q 103 30 105 42 Q 107 58 106 80
           Q 110 52 114 40 Q 118 28 128 28 Q 138 28 140 40 Q 142 55 140 80
           Q 146 55 150 45 Q 156 32 166 34 Q 176 36 176 50 Q 175 68 170 85
           Q 178 95 183 115 Q 188 138 188 175 Q 188 220 180 255 Q 172 278 160 285
           Q 130 296 100 296 Q 70 296 55 280 Z"
        fill="url(#skinGrad)" stroke="rgba(139,92,246,0.3)" stroke-width="1.5"/>

  <line x1="70" y1="80" x2="68" y2="50" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <line x1="106" y1="80" x2="105" y2="42" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <line x1="140" y1="80" x2="140" y2="40" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <line x1="170" y1="85" x2="170" y2="50" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

  <path d="M 75 95 Q 65 120 60 155 Q 56 185 58 215 Q 60 245 65 268" ${getLineStyle('life')} data-line="life"/>
  <path d="M 48 130 Q 80 118 115 120 Q 145 122 168 130" ${getLineStyle('heart')} data-line="heart"/>
  <path d="M 58 155 Q 90 148 120 150 Q 148 152 170 160" ${getLineStyle('head')} data-line="head"/>
  <path d="M 108 270 Q 108 240 108 200 Q 108 165 106 130 Q 105 105 108 85" ${getLineStyle('fate')} data-line="fate"/>
  <path d="M 130 240 Q 132 200 134 165 Q 136 135 140 100" ${getLineStyle('sun')} data-line="sun"/>
  <line x1="170" y1="118" x2="185" y2="118" ${getLineStyle('marriage')} data-line="marriage"/>
  <line x1="172" y1="128" x2="185" y2="128" ${getLineStyle('marriage')} data-line="marriage"/>

  <path d="M 62 285 Q 110 295 160 283" stroke="rgba(255,255,255,0.12)" stroke-width="1" fill="none"/>

  <circle cx="80" cy="58" r="3" fill="rgba(255,209,102,0.4)"/>
  <circle cx="110" cy="50" r="3" fill="rgba(255,209,102,0.4)"/>
  <circle cx="143" cy="50" r="3" fill="rgba(255,209,102,0.4)"/>
  <circle cx="167" cy="60" r="3" fill="rgba(255,209,102,0.4)"/>
  <circle cx="55" cy="175" r="4" fill="rgba(139,92,246,0.35)"/>
  <circle cx="173" cy="190" r="4" fill="rgba(56,189,248,0.35)"/>
  <circle cx="45" cy="120" r="3" fill="rgba(244,63,94,0.35)"/>
</svg>`;
}

// ─────────────────────────────── UI INIT ────────────────────────────────

class PalmistryPanel {
  constructor() {
    this.selections = {
      handType: "fire",
      lineSelections: {
        life: "long_deep",
        heart: "long_deep",
        head: "long_deep",
        fate: "strong",
        sun: "strong",
        marriage: "one_deep"
      },
      mountSelections: {
        jupiter: "prominent",
        saturn: "flat",
        sun_mount: "prominent",
        mercury: "prominent",
        venus: "prominent",
        moon_mount: "flat"
      }
    };
    this.currentReading = null;
    this.activeLine = null;
  }

  init() {
    this.renderHandTypeSelector();
    this.renderPalmDiagram();
    this.renderLineSelector();
    this.renderMountSelector();
    this.bindEvents();
  }

  renderHandTypeSelector() {
    const container = document.getElementById("palmHandTypeGrid");
    if (!container) return;
    container.innerHTML = "";
    const lang = getActiveLang();
    Object.keys(HAND_TYPES).forEach((key) => {
      const data = getLocalizedHandType(key, lang);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `palm-hand-btn ${this.selections.handType === key ? "active" : ""}`;
      btn.dataset.handType = key;
      btn.id = `palmHandBtn_${key}`;
      const parts = data.label.split(" (");
      const mainLabel = parts[0];
      const subLabel = parts[1] ? parts[1].replace(")", "") : "";
      btn.innerHTML = `
        <span class="palm-hand-icon">${data.icon}</span>
        <span class="palm-hand-label">${mainLabel}</span>
        <span class="palm-hand-sub">${subLabel}</span>
      `;
      btn.addEventListener("click", () => this.selectHandType(key));
      container.appendChild(btn);
    });

    const note = document.getElementById("palmHandVedicNote");
    if (note) {
      const currentData = getLocalizedHandType(this.selections.handType, lang);
      note.textContent = currentData.vedic || "";
    }
  }

  selectHandType(key) {
    this.selections.handType = key;
    document.querySelectorAll(".palm-hand-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.handType === key);
    });
    const note = document.getElementById("palmHandVedicNote");
    if (note) {
      const currentData = getLocalizedHandType(key, getActiveLang());
      note.textContent = currentData.vedic || "";
    }
  }

  renderPalmDiagram() {
    const container = document.getElementById("palmDiagramContainer");
    if (!container) return;
    container.innerHTML = renderPalmSVG(this.activeLine);

    container.querySelectorAll("[data-line]").forEach(el => {
      el.style.cursor = "pointer";
      el.addEventListener("mouseenter", () => this.highlightLine(el.dataset.line));
      el.addEventListener("mouseleave", () => this.highlightLine(null));
      el.addEventListener("click", () => this.scrollToLine(el.dataset.line));
    });
  }

  highlightLine(lineKey) {
    this.activeLine = lineKey;
    this.renderPalmDiagram();
    document.querySelectorAll(".palm-line-card").forEach(c => {
      c.classList.toggle("highlighted", c.dataset.lineKey === lineKey);
    });
  }

  scrollToLine(lineKey) {
    const card = document.querySelector(`.palm-line-card[data-line-key="${lineKey}"]`);
    if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  renderLineSelector() {
    const container = document.getElementById("palmLinesContainer");
    if (!container) return;
    container.innerHTML = "";
    const lang = getActiveLang();
    const selectLabelText = lang === "hi" ? "रेखा का प्रकार:" : lang === "ta" ? "ரேகை வகை:" : lang === "te" ? "రేఖ రకం:" : lang === "sa" ? "रेखाप्रकारः:" : "Describe your line:";

    Object.entries(PALM_LINES).forEach(([lineKey, lineData]) => {
      const card = document.createElement("div");
      card.className = "palm-line-card";
      card.dataset.lineKey = lineKey;

      const currentVariant = this.selections.lineSelections[lineKey] || Object.keys(lineData.descriptions)[0];
      const variantOptions = Object.keys(lineData.descriptions);
      const locLine = getLocalizedLineData(lineKey, currentVariant, lang);

      card.innerHTML = `
        <div class="palm-line-header">
          <span class="palm-line-icon" style="color:${lineData.color}">${lineData.icon}</span>
          <div>
            <div class="palm-line-title">${locLine.label}</div>
            <div class="palm-line-sanskrit">${lineData.sanskrit}</div>
          </div>
        </div>
        <div class="palm-line-selector">
          <label class="palm-select-label">${selectLabelText}</label>
          <select class="palm-select custom-select" data-line="${lineKey}" id="palmSelect_${lineKey}">
            ${variantOptions.map(v => `<option value="${v}" ${v === currentVariant ? "selected" : ""}>${formatVariantLabel(v, lang)}</option>`).join("")}
          </select>
        </div>
      `;

      card.addEventListener("mouseenter", () => this.highlightLine(lineKey));
      card.addEventListener("mouseleave", () => this.highlightLine(null));

      container.appendChild(card);
    });
  }

  renderMountSelector() {
    const container = document.getElementById("palmMountsContainer");
    if (!container) return;
    container.innerHTML = "";
    const lang = getActiveLang();

    Object.entries(PALM_MOUNTS).forEach(([mountKey, mountData]) => {
      const current = this.selections.mountSelections[mountKey] || "prominent";
      const locMount = getLocalizedMountData(mountKey, current, lang);
      const card = document.createElement("div");
      card.className = "palm-mount-card";
      card.innerHTML = `
        <div class="palm-mount-header">
          <span class="palm-mount-icon">${mountData.icon}</span>
          <div>
            <div class="palm-mount-title">${locMount.label}</div>
            <div class="palm-mount-planet">${mountData.planet} • ${mountData.location}</div>
          </div>
        </div>
        <div class="palm-mount-prominence">
          ${["prominent", "flat", ...(mountData.overdeveloped ? ["overdeveloped"] : [])].map(p => `
            <button type="button" class="palm-prominence-btn ${current === p ? "active" : ""}" 
                    data-mount="${mountKey}" data-prominence="${p}">
              ${prominenceLabel(p, lang)}
            </button>
          `).join("")}
        </div>
      `;
      container.appendChild(card);
    });
  }

  bindEvents() {
    document.addEventListener("change", (e) => {
      if (e.target.matches(".palm-select[data-line]")) {
        this.selections.lineSelections[e.target.dataset.line] = e.target.value;
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target.matches(".palm-prominence-btn")) {
        const { mount, prominence } = e.target.dataset;
        this.selections.mountSelections[mount] = prominence;
        e.target.closest(".palm-mount-prominence").querySelectorAll(".palm-prominence-btn").forEach(b => {
          b.classList.toggle("active", b.dataset.prominence === prominence);
        });
      }
    });

    const readBtn = document.getElementById("btnReadPalm");
    if (readBtn) {
      readBtn.addEventListener("click", () => this.performReading());
    }

    const resetBtn = document.getElementById("btnPalmReset");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetReading());
    }

    const copyBtn = document.getElementById("btnCopyPalmReading");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => this.copyReading());
    }

    // Re-render components dynamically when language changes
    window.addEventListener("languageChanged", () => {
      this.renderHandTypeSelector();
      this.renderLineSelector();
      this.renderMountSelector();
      if (this.currentReading) {
        this.currentReading = generatePalmReading(this.selections, getActiveLang());
        this.renderReading(this.currentReading);
      }
    });
  }

  performReading() {
    const readBtn = document.getElementById("btnReadPalm");
    const lang = getActiveLang();
    readBtn.disabled = true;
    readBtn.innerHTML = `<span class="btn-sparkle">✋</span> ${lang === "hi" ? "हस्तरेखा विश्लेषण जारी है..." : "Reading Your Palm..."}`;

    document.querySelectorAll(".palm-select[data-line]").forEach(sel => {
      this.selections.lineSelections[sel.dataset.line] = sel.value;
    });

    setTimeout(() => {
      this.currentReading = generatePalmReading(this.selections, lang);
      this.renderReading(this.currentReading);
      readBtn.disabled = false;
      const btnText = (typeof I18N !== "undefined") ? I18N.t("btn_read_palm") : "Read My Palm";
      readBtn.innerHTML = `<span class="btn-sparkle">✦</span> ${btnText}`;
    }, 400);
  }

  renderReading(reading) {
    const resultSection = document.getElementById("palmResultSection");
    if (!resultSection) return;
    resultSection.style.display = "block";
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });

    const lang = getActiveLang();

    // Hand type summary
    document.getElementById("palmResHandType").innerHTML = `
      <span class="palm-res-icon">${reading.handType.icon}</span>
      <div>
        <div class="palm-res-hand-label">${reading.handType.label}</div>
        <p class="palm-res-hand-desc">${reading.handType.description}</p>
        <div class="palm-res-traits">
          ${reading.handType.traits.map(t => `<span class="palm-trait-pill">${t}</span>`).join("")}
        </div>
        <div class="palm-res-vedic">${reading.handType.vedic}</div>
      </div>
    `;

    // Overall summary
    document.getElementById("palmResOverall").textContent = reading.overallSummary;

    // Lines readings
    const linesContainer = document.getElementById("palmResLines");
    linesContainer.innerHTML = Object.entries(reading.lines).map(([key, data]) => `
      <div class="palm-res-line-card">
        <div class="palm-res-line-header" style="border-left: 3px solid ${data.color}">
          <span>${data.icon}</span>
          <div>
            <div class="palm-res-line-title">${data.label}</div>
            <div class="palm-res-line-sanskrit">${data.sanskrit}</div>
          </div>
        </div>
        <p class="palm-res-line-text">${data.reading}</p>
      </div>
    `).join("");

    // Mount readings
    const mountsContainer = document.getElementById("palmResMounts");
    mountsContainer.innerHTML = Object.entries(reading.mounts).map(([key, data]) => `
      <div class="palm-res-mount-card">
        <div class="palm-res-mount-header">
          <span class="palm-res-mount-icon">${data.icon}</span>
          <div>
            <div class="palm-res-mount-title">${data.label}</div>
            <span class="palm-prominence-badge prominence-${data.prominence}">${prominenceLabel(data.prominence, lang)}</span>
          </div>
        </div>
        <p class="palm-res-mount-text">${data.reading}</p>
      </div>
    `).join("");

    // Auspicious advice
    const adviceContainer = document.getElementById("palmResAdvice");
    adviceContainer.innerHTML = reading.auspiciousAdvice.map(a => `
      <div class="palm-advice-item">
        <span class="palm-advice-icon">🙏</span>
        <p>${a}</p>
      </div>
    `).join("");

    // Timestamp
    const ts = document.getElementById("palmResTimestamp");
    if (ts) ts.textContent = `Reading conducted: ${reading.timestamp}`;
  }

  resetReading() {
    const resultSection = document.getElementById("palmResultSection");
    if (resultSection) resultSection.style.display = "none";
  }

  copyReading() {
    if (!this.currentReading) return;
    const r = this.currentReading;
    const lang = getActiveLang();
    let text = `✋ VEDIC PALMISTRY READING — Hast Rekha Vidya\n`;
    text += `Date: ${r.timestamp}\n\n`;
    text += `HAND TYPE: ${r.handType.label}\n${r.handType.description}\n\n`;
    text += `OVERALL SYNTHESIS:\n${r.overallSummary}\n\n`;
    text += `─── PALM LINES ───\n`;
    Object.values(r.lines).forEach(l => {
      text += `\n${l.icon} ${l.label} (${l.sanskrit})\n${l.reading}\n`;
    });
    text += `\n─── PALM MOUNTS ───\n`;
    Object.values(r.mounts).forEach(m => {
      text += `\n${m.icon} ${m.label} [${prominenceLabel(m.prominence, lang)}]\n${m.reading}\n`;
    });
    text += `\n─── VEDIC GUIDANCE ───\n`;
    r.auspiciousAdvice.forEach(a => { text += `• ${a}\n`; });

    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById("btnCopyPalmReading");
      if (btn) {
        btn.textContent = (typeof I18N !== "undefined") ? I18N.t("palm_copied") : "✓ Copied!";
        setTimeout(() => { btn.innerHTML = (typeof I18N !== "undefined") ? I18N.t("palm_copy_reading") : "📋 Copy Reading"; }, 2000);
      }
    });
  }
}

function formatVariantLabel(variant, lang = getActiveLang()) {
  const maps = {
    hi: {
      long_deep: "लंबी और गहरी (Long & Deep)",
      long_faint: "लंबी और हल्की (Long & Light)",
      short_deep: "छोटी और गहरी (Short & Deep)",
      short_faint: "छोटी और हल्की (Short & Light)",
      curved: "घुमावदार (Curved)",
      curved_upward: "ऊपर की ओर मुड़ी (Curved Upward)",
      straight: "सीधी (Straight)",
      forked: "द्विशाखी / त्रिशूल (Forked)",
      chained: "खंडित / जंजीरदार (Chained)",
      strong: "मजबूत और स्पष्ट (Strong)",
      starts_late: "मध्य से शुरू (Starts Late)",
      starts_from_life: "जीवन रेखा से (From Life)",
      starts_from_moon: "चंद्र पर्वत से (From Luna)",
      absent: "अस्पष्ट / अनुपस्थित (Absent)",
      broken: "खंडित (Broken)",
      faint: "हल्की (Faint)",
      multiple: "अनेक रेखाएं (Multiple)",
      late: "उंगलियों के पास (Late)",
      one_deep: "एक स्पष्ट रेखा (One Deep)",
      two_lines: "दो रेखाएं (Two Lines)",
      short: "छोटी रेखाएं (Short Lines)"
    },
    ta: {
      long_deep: "நீளமான & ஆழமான (Long & Deep)",
      long_faint: "நீளமான & மெல்லிய (Long & Faint)",
      short_deep: "குட்டையான & ஆழமான (Short & Deep)",
      short_faint: "குட்டையான & மெல்லிய (Short & Faint)",
      curved: "வளைந்த (Curved)",
      curved_upward: "மேல்நோக்கி வளைந்த (Curved Upward)",
      straight: "நேரான (Straight)",
      forked: "கிளையாகப் பிரிந்த (Forked)",
      chained: "சங்கிலி போன்ற (Chained)",
      strong: "உறுதியான (Strong)",
      starts_late: "நடுவில் தொடங்கும் (Starts Late)",
      starts_from_life: "ஆயுள் ரேகையிலிருந்து (From Life)",
      starts_from_moon: "சந்திர மேட்டிலிருந்து (From Luna)",
      absent: "இல்லாத (Absent)",
      broken: "உடைந்த (Broken)",
      faint: "மெல்லிய (Faint)",
      multiple: "பல ரேகைகள் (Multiple)",
      late: "தாமதமாகத் தொடங்கும் (Late)",
      one_deep: "ஒரு ஆழமான ரேகை (One Deep)",
      two_lines: "இரண்டு ரேகைகள் (Two Lines)",
      short: "குட்டையான ரேகைகள் (Short)"
    },
    te: {
      long_deep: "పొడవైన & లోతైన (Long & Deep)",
      long_faint: "పొడవైన & తేలికపాటి (Long & Faint)",
      short_deep: "చిన్నది & లోతైన (Short & Deep)",
      short_faint: "చిన్నది & తేలికపాటి (Short & Faint)",
      curved: "వంగిన (Curved)",
      curved_upward: "పైకి వంగిన (Curved Upward)",
      straight: "నేరుగా (Straight)",
      forked: "రెండుగా విడిపోయిన (Forked)",
      chained: "గొలుసు వంటి (Chained)",
      strong: "బలమైన (Strong)",
      starts_late: "మధ్యలో ప్రారంభమయ్యే (Starts Late)",
      starts_from_life: "ఆయుష్షు రేఖ నుండి (From Life)",
      starts_from_moon: "చంద్ర పర్వతం నుండి (From Luna)",
      absent: "లేని (Absent)",
      broken: "తెగిపోయిన (Broken)",
      faint: "లేతగా ఉన్న (Faint)",
      multiple: "పలు రేఖలు (Multiple)",
      late: "ఆలస్యంగా ప్రారంభం (Late)",
      one_deep: "ఒక లోతైన రేఖ (One Deep)",
      two_lines: "రెండు రేఖలు (Two Lines)",
      short: "చిన్న రేఖలు (Short)"
    },
    sa: {
      long_deep: "दीर्घा गभीरा च (Long & Deep)",
      long_faint: "दीर्घा मन्दा च (Long & Faint)",
      short_deep: "लघ्वी गभीरा च (Short & Deep)",
      short_faint: "लघ्वी मन्दा च (Short & Faint)",
      curved: "वक्रा (Curved)",
      curved_upward: "ऊर्ध्ववक्रा (Curved Upward)",
      straight: "ऋज्वी (Straight)",
      forked: "द्विशाखा (Forked)",
      chained: "शृङ्खलाकारा (Chained)",
      strong: "दृढा (Strong)",
      starts_late: "मध्यतः आरब्धा (Starts Late)",
      starts_from_life: "आयुःरेखातः (From Life)",
      starts_from_moon: "चन्द्रपर्वतः (From Luna)",
      absent: "अनुपस्थिता (Absent)",
      broken: "खण्डिता (Broken)",
      faint: "मन्दा (Faint)",
      multiple: "अनेकाः रेखाः (Multiple)",
      late: "अन्ते आरब्धा (Late)",
      one_deep: "एका गभीरा रेखा (One Deep)",
      two_lines: "द्वे रेखे (Two Lines)",
      short: "लघ्व्यो रेखाः (Short)"
    }
  };

  const map = maps[lang];
  if (map && map[variant]) return map[variant];

  const defaultMap = {
    long_deep: "Long & Deep", long_faint: "Long & Faint", short_deep: "Short & Deep",
    short_faint: "Short & Faint", curved: "Curved / Arched", curved_upward: "Curved Upward",
    straight: "Straight", forked: "Forked (Bifurcated)", chained: "Chained / Broken",
    strong: "Strong & Unbroken", starts_late: "Starts Late (mid-palm)",
    starts_from_life: "Emerges from Life Line", starts_from_moon: "Emerges from Luna Mount",
    absent: "Absent / Very Faint", broken: "Broken (Major Break)", faint: "Faint / Barely Visible",
    multiple: "Multiple Parallel Lines", late: "Appears Only Near Fingers",
    one_deep: "One Strong Line", two_lines: "Two Lines", short: "Short Lines"
  };
  return defaultMap[variant] || variant.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function prominenceLabel(p, lang = getActiveLang()) {
  const maps = {
    hi: { prominent: "उन्नत (Prominent)", flat: "समतल (Flat)", overdeveloped: "अत्यधिक विकसित (Overdeveloped)" },
    ta: { prominent: "உயர்ந்த (Prominent)", flat: "தட்டையான (Flat)", overdeveloped: "அதிக வளர்ச்சி (Overdeveloped)" },
    te: { prominent: "ఎత్తుగా (Prominent)", flat: "సమతలంగా (Flat)", overdeveloped: "అధిక వృద్ధి (Overdeveloped)" },
    sa: { prominent: "उन्नतम् (Prominent)", flat: "समतलम् (Flat)", overdeveloped: "अतीवोन्नतम् (Overdeveloped)" }
  };
  if (maps[lang] && maps[lang][p]) return maps[lang][p];
  return { prominent: "Prominent", flat: "Flat / Absent", overdeveloped: "Overdeveloped" }[p] || p;
}

// Expose globally
window.PalmistryPanel = PalmistryPanel;
window.PALM_LINES = PALM_LINES;
window.PALM_MOUNTS = PALM_MOUNTS;
window.HAND_TYPES = HAND_TYPES;
