/**
 * Express REST API Server & Web Server for Vedic Astrology Rashi Fal AI
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const {
  RASHI_DATA,
  generateRashiFal,
  normalizeRashiName,
  inferRashiFromDOB,
  compareCompatibility
} = require("./astrologyEngine");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static web application assets
app.use(express.static(path.join(__dirname, "public")));

/**
 * GET & POST /api/rashifal
 * Strict JSON Horoscope Endpoint
 * Params / Body:
 * - rashi: string (e.g. "Mesh", "Mithun", "Aries")
 * - date: string (optional, e.g. "DD-MM-YYYY", defaults to today)
 * - timeframe: string (optional: "daily", "weekly", "monthly", defaults to daily)
 * - intent: string (optional: "career", "love", "finance", "health")
 */
function handleRashiFal(req, res) {
  try {
    const params = req.method === "POST" ? req.body : req.query;
    const { rashi, date, timeframe, intent } = params;

    const prediction = generateRashiFal({
      rashi: rashi || "Mithun",
      date: date || "today",
      timeframe: timeframe || "daily",
      intent: intent || null
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

    if (!dob) {
      return res.status(400).json({
        error: "Please provide 'dob' in YYYY-MM-DD or DD-MM-YYYY format."
      });
    }

    const result = inferRashiFromDOB(dob);
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
