#!/usr/bin/env node

/**
 * Command Line Interface for Vedic Astrology Rashi Fal AI
 * Usage:
 *   node cli.js --rashi Mithun --date today
 *   node cli.js -r Singh -t weekly -i career
 *   node cli.js --dob 1995-07-25
 *   node cli.js --compat Mesh Singh
 */

const {
  generateRashiFal,
  inferRashiFromDOB,
  compareCompatibility,
  RASHI_DATA
} = require("./astrologyEngine");

const args = process.argv.slice(2);

function getArgValue(flags) {
  for (let i = 0; i < args.length; i++) {
    if (flags.includes(args[i])) {
      return args[i + 1];
    }
  }
  return null;
}

const hasFlag = (flags) => args.some((a) => flags.includes(a));

if (hasFlag(["-h", "--help"]) || args.length === 0) {
  console.log(`
🕉️  VEDIC ASTROLOGY RASHI FAL AI - CLI

Usage:
  node cli.js --rashi <name> [--date <DD-MM-YYYY|today>] [--timeframe <daily|weekly|monthly>] [--intent <career|love|finance|health>]
  node cli.js --dob <YYYY-MM-DD>
  node cli.js --compat <Rashi1> <Rashi2>
  node cli.js --list

Examples:
  node cli.js --rashi Mithun --date today
  node cli.js --rashi Singh --timeframe weekly --intent career
  node cli.js --compat Mesh Tula
  node cli.js --dob 1996-08-20
`);
  process.exit(0);
}

if (hasFlag(["-l", "--list"])) {
  console.log("\n🪐 12 Vedic Rashis (Moon Signs):");
  Object.entries(RASHI_DATA).forEach(([key, val], idx) => {
    console.log(`  ${idx + 1}. ${key} (${val.englishName} - ${val.sanskritName}) | Lord: ${val.lord} | Element: ${val.element}`);
  });
  console.log("");
  process.exit(0);
}

// DOB Inference
const dobVal = getArgValue(["--dob", "-b"]);
if (dobVal) {
  const res = inferRashiFromDOB(dobVal);
  console.log(JSON.stringify(res, null, 2));
  process.exit(0);
}

// Compatibility check
if (hasFlag(["--compat", "-c"])) {
  const idx = args.findIndex((a) => a === "--compat" || a === "-c");
  const r1 = args[idx + 1];
  const r2 = args[idx + 2];
  if (!r1 || !r2) {
    console.error("Error: Please provide two Rashis, e.g. --compat Mesh Singh");
    process.exit(1);
  }
  const res = compareCompatibility(r1, r2);
  console.log(JSON.stringify(res, null, 2));
  process.exit(0);
}

// Standard Rashi Fal
const rashi = getArgValue(["--rashi", "-r"]) || "Mithun";
const date = getArgValue(["--date", "-d"]) || "today";
const timeframe = getArgValue(["--timeframe", "-t"]) || "daily";
const intent = getArgValue(["--intent", "-i"]) || null;

const result = generateRashiFal({ rashi, date, timeframe, intent });

// Output STRICT JSON as requested
console.log(JSON.stringify(result, null, 2));
