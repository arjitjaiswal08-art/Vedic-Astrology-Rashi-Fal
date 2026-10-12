/**
 * Express REST API Server & Web Server for Vedic Astrology Rashi Fal AI
 * + PanditConnect — Vedic Pandit Discovery & Booking Platform
 * + Secure Authentication Layer (bcrypt + JWT)
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const {
  RASHI_DATA,
  SUN_ANALYSIS_DATA,
  generateRashiFal,
  normalizeRashiName,
  inferRashiFromDOB,
  compareCompatibility,
  classifyVedicIntent,
  generateVedicAstrologyAI
} = require("./astrologyEngine");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({
  limit: "5mb",
  verify: (req, res, buf) => {
    req.rawBody = buf.toString('utf8');
  }
}));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Serve static web application assets
app.use(express.static(path.join(__dirname, "public")));

// ─── PanditConnect In-Memory Data Store ─────────────────────────────────────
// In production, replace with PostgreSQL + Prisma ORM
const DATA_FILE = path.join(__dirname, "pandit_data.json");

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    }
  } catch (e) { /* ignore */ }
  return { pandits: [], bookings: [], consultations: [], reviews: [] };
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(pcData, null, 2), "utf8");
  } catch (e) { /* ignore write errors in read-only environments */ }
}

const pcData = loadData();
// Share pcData globally so auth.js and payments.js can cross-reference
global.pcData = pcData;

// Generate unique Pandit ID
function genPanditId() {
  const existing = pcData.pandits.map(p => parseInt(p.id.replace("PND-", "")) || 100000);
  const maxId = existing.length ? Math.max(...existing) : 100000;
  return "PND-" + (maxId + 1);
}

// ─── Mount Authentication & Payment Routers ──────────────────────────────────
const { router: authRouter } = require('./auth');
app.use('/api/auth', authRouter);

const { router: paymentsRouter } = require('./payments');
app.use('/api/payments', paymentsRouter);

// Razorpay Webhook direct route (as per Section 5 spec: POST /api/webhooks/razorpay)
app.post('/api/webhooks/razorpay', (req, res, next) => {
  req.url = '/razorpay';
  paymentsRouter(req, res, next);
});

// Serve auth.html for /auth and /login routes
app.get('/auth', (req, res) => res.sendFile(path.join(__dirname, 'public', 'auth.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'auth.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'public', 'auth.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'auth.html')));

// ─── PanditConnect API Routes ─────────────────────────────────────────────

/**
 * POST /api/pandit/register
 * Register a new Pandit
 */
app.post("/api/pandit/register", (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.phone) {
      return res.status(400).json({ error: "Name and phone are required." });
    }
    // Duplicate phone check
    if (pcData.pandits.find(p => p.phone === data.phone)) {
      return res.status(409).json({ error: "A Pandit with this phone number already exists." });
    }
    const pandit = {
      ...data,
      id: data.id || genPanditId(),
      verified: false,
      createdAt: new Date().toISOString(),
      rating: 0,
      reviewCount: 0,
    };
    pcData.pandits.push(pandit);
    saveData();
    return res.status(201).json({
      success: true,
      panditId: pandit.id,
      message: "Registration successful. Pending admin verification.",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/pandit/pandits
 * List all verified pandits (public search)
 * Query: state, city, pincode, service, language, minExp, minRating, homeVisit
 */
app.get("/api/pandit/pandits", (req, res) => {
  try {
    const { state, city, pincode, service, language, minExp, minRating, homeVisit } = req.query;
    let results = pcData.pandits.filter(p => p.verified);
    if (state)     results = results.filter(p => p.state === state);
    if (city)      results = results.filter(p => p.city?.toLowerCase().includes(city.toLowerCase()));
    if (pincode)   results = results.filter(p => p.pincode === pincode);
    if (language)  results = results.filter(p => p.languages?.includes(language));
    if (minExp)    results = results.filter(p => p.experience >= parseInt(minExp));
    if (minRating) results = results.filter(p => p.rating >= parseFloat(minRating));
    if (homeVisit === "yes") results = results.filter(p => p.homeVisit);
    if (service)   results = results.filter(p => p.services?.some(s => s.toLowerCase().includes(service.toLowerCase())));
    // Strip private fields
    const safe = results.map(({ phone, email, password, ...pub }) => pub);
    return res.status(200).json({ pandits: safe, total: safe.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/pandit/pandits/:id
 * Get a single Pandit public profile
 */
app.get("/api/pandit/pandits/:id", (req, res) => {
  const pandit = pcData.pandits.find(p => p.id === req.params.id && p.verified);
  if (!pandit) return res.status(404).json({ error: "Pandit not found." });
  const { phone, email, password, ...safe } = pandit;
  return res.status(200).json(safe);
});

/**
 * POST /api/pandit/bookings
 * Create a booking request
 */
app.post("/api/pandit/bookings", (req, res) => {
  try {
    const { panditId, service, date, time, address, pin, contact } = req.body;
    if (!panditId || !service || !date || !time || !address || !contact) {
      return res.status(400).json({ error: "Missing required booking fields." });
    }
    // Conflict check: same pandit, same date+time, not rejected/cancelled
    const conflict = pcData.bookings.find(b =>
      b.panditId === panditId && b.date === date && b.time === time &&
      !["rejected", "cancelled"].includes(b.status)
    );
    if (conflict) {
      return res.status(409).json({ error: "This time slot is already booked. Please choose another." });
    }
    const booking = {
      ...req.body,
      id: req.body.id || "BKG-" + Date.now(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    pcData.bookings.push(booking);
    saveData();
    return res.status(201).json({ success: true, bookingId: booking.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/pandit/bookings/:id/status
 * Update booking status (accept/reject/complete/cancel)
 * Body: { status: 'accepted'|'rejected'|'completed'|'cancelled' }
 */
app.patch("/api/pandit/bookings/:id/status", (req, res) => {
  const booking = pcData.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });
  const allowed = ["accepted", "rejected", "confirmed", "completed", "cancelled"];
  if (!allowed.includes(req.body.status)) {
    return res.status(400).json({ error: "Invalid status." });
  }
  booking.status = req.body.status;
  booking.updatedAt = new Date().toISOString();
  saveData();
  return res.status(200).json({ success: true, booking });
});

/**
 * GET /api/pandit/bookings
 * Get bookings (filtered by panditId or userId via query param)
 */
app.get("/api/pandit/bookings", (req, res) => {
  const { panditId, userId } = req.query;
  let results = pcData.bookings;
  if (panditId) results = results.filter(b => b.panditId === panditId);
  if (userId)   results = results.filter(b => b.userId   === userId);
  return res.status(200).json({ bookings: results, total: results.length });
});

/**
 * POST /api/pandit/consultations
 * Submit a consultation question
 */
app.post("/api/pandit/consultations", (req, res) => {
  try {
    const { name, question } = req.body;
    if (!name || !question) {
      return res.status(400).json({ error: "Name and question are required." });
    }
    const consult = {
      ...req.body,
      id: req.body.id || "CST-" + Date.now(),
      status: "pending",
      answer: null,
      createdAt: new Date().toISOString(),
    };
    pcData.consultations.push(consult);
    saveData();
    return res.status(201).json({ success: true, consultationId: consult.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/pandit/reviews
 * Submit a review (only for completed bookings)
 */
app.post("/api/pandit/reviews", (req, res) => {
  try {
    const { bookingId, panditId, rating, text } = req.body;
    if (!bookingId || !panditId || !rating) {
      return res.status(400).json({ error: "bookingId, panditId, and rating are required." });
    }
    // Verify booking exists and is completed
    const booking = pcData.bookings.find(b => b.id === bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found." });
    if (booking.status !== "completed") {
      return res.status(403).json({ error: "Reviews can only be submitted for completed bookings." });
    }
    // Duplicate review check
    if (pcData.reviews.find(r => r.bookingId === bookingId)) {
      return res.status(409).json({ error: "You have already reviewed this booking." });
    }
    const review = {
      ...req.body,
      id: "REV-" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    pcData.reviews.push(review);
    // Update pandit average rating
    const pandit = pcData.pandits.find(p => p.id === panditId);
    if (pandit) {
      const panditReviews = pcData.reviews.filter(r => r.panditId === panditId);
      pandit.rating = panditReviews.reduce((sum, r) => sum + r.rating, 0) / panditReviews.length;
      pandit.reviewCount = panditReviews.length;
    }
    saveData();
    return res.status(201).json({ success: true, reviewId: review.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/pandit/admin/pandits
 * Admin: list all pandits including unverified (would require auth in production)
 */
app.get("/api/pandit/admin/pandits", (req, res) => {
  return res.status(200).json({ pandits: pcData.pandits, total: pcData.pandits.length });
});

/**
 * PATCH /api/pandit/admin/pandits/:id/verify
 * Admin: approve or reject a Pandit's verification
 * Body: { approved: true|false }
 */
app.patch("/api/pandit/admin/pandits/:id/verify", (req, res) => {
  const pandit = pcData.pandits.find(p => p.id === req.params.id);
  if (!pandit) return res.status(404).json({ error: "Pandit not found." });
  pandit.verified = req.body.approved === true;
  pandit.verifiedAt = new Date().toISOString();
  saveData();
  return res.status(200).json({ success: true, panditId: pandit.id, verified: pandit.verified });
});

/**
 * GET /api/pandit/stats
 * Public platform statistics
 */
app.get("/api/pandit/stats", (req, res) => {
  return res.status(200).json({
    totalPandits:    pcData.pandits.length,
    verifiedPandits: pcData.pandits.filter(p => p.verified).length,
    totalBookings:   pcData.bookings.length,
    totalReviews:    pcData.reviews.length,
    states:          [...new Set(pcData.pandits.map(p => p.state).filter(Boolean))].length,
  });
});

/**
 * GET & POST /api/vedic-ai
 * GET & POST /api/ai-query
 * Advanced Vedic Astrology AI endpoint
 * Supports:
 * - Natural language queries: "Mithun rashi today", "My sun sign is Leo", "Lagna Leo, Moon Gemini, Sun Aries"
 * - Output Modes: Mode 1 (daily), Mode 2 (sun_analysis), Mode 3 (kundli), Mode 4 (compatibility)
 */
function handleVedicAI(req, res) {
  try {
    const params = req.method === "POST" ? req.body : req.query;
    const result = generateVedicAstrologyAI(params);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in Vedic AI:", error);
    return res.status(500).json({
      error: "Internal server error in Vedic Astrology AI.",
      message: error.message
    });
  }
}

app.get("/api/vedic-ai", handleVedicAI);
app.post("/api/vedic-ai", handleVedicAI);
app.get("/api/ai-query", handleVedicAI);
app.post("/api/ai-query", handleVedicAI);

/**
 * GET & POST /api/rashifal
 * Strict JSON Horoscope Endpoint
 * Params / Body:
 * - rashi: string (e.g. "Mesh", "Mithun", "Aries")
 * - date: string (optional, e.g. "DD-MM-YYYY", defaults to today)
 * - timeframe: string (optional: "daily", "weekly", "monthly", defaults to daily)
 * - intent: string (optional: "career", "love", "finance", "health")
 * - mode: string (optional: "daily", "sun_analysis", "kundli")
 */
function handleRashiFal(req, res) {
  try {
    const params = req.method === "POST" ? req.body : req.query;

    // If explicit mode or natural query is provided, route directly to Vedic AI
    if (params.mode || params.query) {
      const aiResult = generateVedicAstrologyAI(params);
      return res.status(200).json(aiResult);
    }

    const { rashi, date, timeframe, intent, language, lang, signType, sign_type,
            lagna, surya, chandra, name, dob, tob, pob } = params;

    const prediction = generateRashiFal({
      rashi: rashi || "Mithun",
      date: date || "today",
      timeframe: timeframe || "daily",
      intent: intent || null,
      language: language || lang || "en",
      signType: signType || sign_type || "chandra",
      lagna: lagna || null,
      surya: surya || null,
      chandra: chandra || null,
      name: name || "",
      dob: dob || "",
      tob: tob || "",
      pob: pob || ""
    });

    // Return STRICT JSON output as required by specification
    return res.status(200).json(prediction);
  } catch (error) {
    console.error("Error generating Rashi Fal:", error);
    return res.status(500).json({
      error: "Internal server error generating horoscope.",
      message: error.message
    });
  }
}

app.get("/api/rashifal", handleRashiFal);
app.post("/api/rashifal", handleRashiFal);

/**
 * GET & POST /api/compatibility
 * Compare two Rashis
 */
function handleCompatibility(req, res) {
  try {
    const params = req.method === "POST" ? req.body : req.query;
    const { rashi1, rashi2 } = params;

    if (!rashi1 || !rashi2) {
      return res.status(400).json({
        error: "Please provide both rashi1 and rashi2 parameters (e.g., rashi1=Mesh&rashi2=Singh)."
      });
    }

    const result = compareCompatibility(rashi1, rashi2);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

app.get("/api/compatibility", handleCompatibility);
app.post("/api/compatibility", handleCompatibility);

/**
 * GET & POST /api/infer-rashi
 * Infer likely Rashi from DOB
 */
function handleInferRashi(req, res) {
  try {
    const params = req.method === "POST" ? req.body : req.query;
    const dob = params.dob || params.date_of_birth;
    const time = params.time || params.time_of_birth || "";

    if (!dob) {
      return res.status(400).json({
        error: "Please provide 'dob' in YYYY-MM-DD or DD-MM-YYYY format."
      });
    }

    const result = inferRashiFromDOB(dob, time);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

app.get("/api/infer-rashi", handleInferRashi);
app.post("/api/infer-rashi", handleInferRashi);

/**
 * GET /api/rashis
 * Directory of all 12 Rashis with metadata
 */
app.get("/api/rashis", (req, res) => {
  return res.status(200).json(RASHI_DATA);
});

// Fallback to index.html for single-page routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n✨ Vedic Astrology AI Server running at: http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/rashifal?rashi=Mithun&date=today\n`);
  });
}

module.exports = app;
