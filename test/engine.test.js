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
console.log("✅ Test 6 Passed: Rashi compatibility evaluation functional");

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!\n");
