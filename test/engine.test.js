/**
 * Unit Test Suite for Vedic Astrology Rashi Fal Engine
 * Verifies strict JSON compliance, schema keys, rule bounds, and helper features.
 */

const assert = require("assert");
const {
  RASHI_DATA,
  generateRashiFal,
  normalizeRashiName,
  normalizeDate,
  inferRashiFromDOB,
  compareCompatibility
} = require("../astrologyEngine");

console.log("🕉️ Running Vedic Astrology Engine Test Suite...\n");

// Test 1: Verify all 12 Rashis in RASHI_DATA
const expectedRashis = [
  "Mesh", "Vrishabh", "Mithun", "Kark", "Singh", "Kanya",
  "Tula", "Vrischik", "Dhanu", "Makar", "Kumbh", "Meen"
];

assert.strictEqual(
  Object.keys(RASHI_DATA).length,
  12,
  "Must contain exactly 12 Rashis"
);
expectedRashis.forEach((r) => {
  assert.ok(RASHI_DATA[r], `Rashi ${r} should exist in knowledge base`);
});
console.log("✅ Test 1 Passed: All 12 Rashis present in Knowledge Base");

// Test 2: Strict JSON Output Structure Check
const sample = generateRashiFal({ rashi: "Mithun", date: "today" });
const requiredKeys = [
  "rashi",
  "date",
  "overall",
  "career",
  "love",
  "finance",
  "health",
  "lucky_color",
  "lucky_number",
  "tip"
];

requiredKeys.forEach((key) => {
  assert.ok(
    Object.prototype.hasOwnProperty.call(sample, key),
    `Output missing required key: ${key}`
  );
  assert.ok(
    sample[key] !== undefined && sample[key] !== null && sample[key] !== "",
    `Key ${key} should not be empty`
  );
});

assert.strictEqual(sample.rashi, "Mithun");
assert.strictEqual(typeof sample.lucky_number, "number");
assert.strictEqual(typeof sample.lucky_color, "string");
assert.match(sample.date, /^\d{2}-\d{2}-\d{4}$/, "Date should be formatted as DD-MM-YYYY");
console.log("✅ Test 2 Passed: Strict JSON schema validated successfully");
console.log("   Sample Output:\n", JSON.stringify(sample, null, 2));

// Test 3: Verify line-length constraint (1-2 lines max, realistic tone)
expectedRashis.forEach((r) => {
  const pred = generateRashiFal({ rashi: r, date: "today" });
  ["overall", "career", "love", "finance", "health", "tip"].forEach((field) => {
    const text = pred[field];
    assert.ok(
      typeof text === "string" && text.length > 10 && text.length < 350,
      `${r} field ${field} length (${text.length} chars) should be concise (1-2 lines max)`
    );
    // Ensure no extreme fear-mongering words
    assert.ok(
      !/disaster|doom|death|curse|ruin/i.test(text),
      `Fear-based words prohibited in ${r} ${field}`
    );
  });
});
console.log("✅ Test 3 Passed: 1-2 lines length and positive/realistic tone confirmed across all 12 Rashis");

// Test 4: Weekly and Monthly timeframes
const weeklyPred = generateRashiFal({ rashi: "Singh", timeframe: "weekly" });
const monthlyPred = generateRashiFal({ rashi: "Kumbh", timeframe: "monthly" });
assert.ok(weeklyPred.overall.length > 0, "Weekly prediction generated");
assert.ok(monthlyPred.overall.length > 0, "Monthly prediction generated");
console.log("✅ Test 4 Passed: Weekly and Monthly predictions functional");

// Test 5: DOB Inference
const dobResult = inferRashiFromDOB("1995-07-25");
assert.strictEqual(dobResult.inferred_rashi, "Kark", "July 25 falls under Sidereal Kark");
console.log("✅ Test 5 Passed: DOB inference functional (July 25 -> Kark)");

// Test 6: Rashi Compatibility
const compat = compareCompatibility("Mesh", "Singh");
assert.ok(compat.compatibility_score, "Compatibility score returned");
assert.ok(compat.advice, "Compatibility advice returned");
// Test 7: Multilingual Rashi Fal Generation (Hindi, Tamil, Telugu, Sanskrit)
const languages = ["hi", "ta", "te", "sa"];
languages.forEach((lang) => {
  const pred = generateRashiFal({ rashi: "Mithun", date: "today", language: lang });
  assert.strictEqual(pred.language, lang, `Prediction should have language flag ${lang}`);
  assert.ok(pred.rashi_localized, `Prediction should have localized rashi name for ${lang}`);
  assert.ok(pred.overall.length > 5, `Localized overall should exist for ${lang}`);
  assert.ok(pred.career.length > 5, `Localized career should exist for ${lang}`);
  assert.ok(pred.love.length > 5, `Localized love should exist for ${lang}`);
  assert.ok(pred.finance.length > 5, `Localized finance should exist for ${lang}`);
  assert.ok(pred.health.length > 5, `Localized health should exist for ${lang}`);
  assert.ok(pred.tip.length > 5, `Localized tip should exist for ${lang}`);
  assert.ok(pred.lucky_color.length > 0, `Localized lucky color should exist for ${lang}`);
});
console.log("✅ Test 7 Passed: Multilingual predictions verified in Hindi, Tamil, Telugu, and Sanskrit");

// Test 8: Advanced Vedic Astrology AI - Mode 1 (Daily Horoscope)
const { generateVedicAstrologyAI, classifyVedicIntent } = require("../astrologyEngine");

const testMode1 = generateVedicAstrologyAI("Mithun rashi today");
assert.strictEqual(testMode1.type, "daily");
assert.strictEqual(testMode1.rashi, "Mithun");
const mode1Keys = ["type", "rashi", "overall", "career", "love", "finance", "health", "lucky_color", "lucky_number", "tip"];
mode1Keys.forEach(k => {
  assert.ok(testMode1[k] !== undefined && testMode1[k] !== null, `Mode 1 missing key: ${k}`);
});
console.log("✅ Test 8 Passed: Mode 1 (Daily Horoscope) verified with 'Mithun rashi today'");

// Test 9: Advanced Vedic Astrology AI - Mode 2 (Sun Sign Analysis)
const testMode2 = generateVedicAstrologyAI("My sun sign is Leo");
assert.strictEqual(testMode2.type, "sun_analysis");
assert.strictEqual(testMode2.surya_rashi, "Singh");
const mode2Keys = ["type", "surya_rashi", "core_personality", "strengths", "weaknesses", "career_tendency", "leadership_style", "love_style", "growth_advice"];
mode2Keys.forEach(k => {
  assert.ok(testMode2[k] !== undefined && testMode2[k] !== null, `Mode 2 missing key: ${k}`);
});
assert.ok(Array.isArray(testMode2.strengths) && testMode2.strengths.length > 0, "Strengths should be an array");
assert.ok(Array.isArray(testMode2.weaknesses) && testMode2.weaknesses.length > 0, "Weaknesses should be an array");
console.log("✅ Test 9 Passed: Mode 2 (Sun Sign Analysis) verified with 'My sun sign is Leo'");

// Test 10: Advanced Vedic Astrology AI - Mode 3 (Full Kundli Summary)
const testMode3 = generateVedicAstrologyAI("Lagna Leo, Moon Gemini, Sun Aries");
assert.strictEqual(testMode3.type, "kundli");
assert.strictEqual(testMode3.lagna, "Singh");
assert.strictEqual(testMode3.chandra_rashi, "Mithun");
assert.strictEqual(testMode3.surya_rashi, "Mesh");
const mode3Keys = ["type", "lagna", "surya_rashi", "chandra_rashi", "summary", "career", "love", "finance", "health", "planetary_hint", "tip"];
mode3Keys.forEach(k => {
  assert.ok(testMode3[k] !== undefined && testMode3[k] !== null, `Mode 3 missing key: ${k}`);
});
console.log("✅ Test 10 Passed: Mode 3 (Full Kundli Summary) verified with 'Lagna Leo, Moon Gemini, Sun Aries'");

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!\n");


