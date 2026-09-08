/**
 * Palm Scan Engine — Camera-based Vedic Palmistry Analysis
 * Uses Canvas API pixel analysis (brightness, edge density, contrast zones)
 * across anatomically mapped palm regions to infer line & mount characteristics.
 */

class PalmScanner {
  constructor() {
    this.stream = null;
    this.capturedImageData = null;
    this.analysisResult = null;
    this.isScanning = false;

    // Palm region map (normalized 0-1 coords for 300×400 canonical palm)
    // Each region targets a specific line or mount zone
    this.REGIONS = {
      // Lines — slices across the palm
      heartLine:   { x: 0.15, y: 0.28, w: 0.70, h: 0.08 },  // upper palm horizontal
      headLine:    { x: 0.20, y: 0.40, w: 0.65, h: 0.08 },  // mid-palm horizontal
      lifeLine:    { x: 0.10, y: 0.28, w: 0.22, h: 0.50 },  // thumb-side arc
      fateLine:    { x: 0.42, y: 0.20, w: 0.12, h: 0.60 },  // center vertical
      sunLine:     { x: 0.58, y: 0.20, w: 0.10, h: 0.50 },  // ring-finger vertical
      marriageLine:{ x: 0.75, y: 0.24, w: 0.18, h: 0.06 },  // mercury side, upper

      // Mounts — fleshy pads below fingers and edges
      mountJupiter:{ x: 0.10, y: 0.08, w: 0.18, h: 0.14 },  // index base
      mountSaturn: { x: 0.30, y: 0.06, w: 0.18, h: 0.14 },  // middle base
      mountSun:    { x: 0.50, y: 0.08, w: 0.18, h: 0.14 },  // ring base
      mountMercury:{ x: 0.70, y: 0.10, w: 0.18, h: 0.12 },  // pinky base
      mountVenus:  { x: 0.05, y: 0.40, w: 0.22, h: 0.28 },  // thumb base pad
      mountMoon:   { x: 0.73, y: 0.52, w: 0.20, h: 0.28 },  // opposite thumb
    };
  }

  // ─────────────────────── CAMERA LIFECYCLE ───────────────────────

  async startCamera(videoEl) {
    try {
      // Request rear camera first (better for palm), fallback to front
      const constraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 960 }
        }
      };
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoEl.srcObject = this.stream;
      await videoEl.play();
      return true;
    } catch (err) {
      // Fallback: try front camera
      try {
        const fallback = { video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } } };
        this.stream = await navigator.mediaDevices.getUserMedia(fallback);
        videoEl.srcObject = this.stream;
        await videoEl.play();
        return true;
      } catch (err2) {
        console.error("Camera access failed:", err2);
        return false;
      }
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }

  captureFrame(videoEl, canvasEl) {
    const ctx = canvasEl.getContext("2d");
    canvasEl.width = videoEl.videoWidth || 640;
    canvasEl.height = videoEl.videoHeight || 480;
    ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
    this.capturedImageData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
    return ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
  }

  // ─────────────────────── IMAGE ANALYSIS ───────────────────────

  /**
   * Analyze a specific rectangular region of the captured image.
   * Returns brightness, edgeDensity, contrast, variance, hEdge (horizontal),
   * vEdge (vertical), and darkLineScore (lines are darker than surround).
   */
  analyzeRegion(imgData, region) {
    const W = imgData.width;
    const H = imgData.height;
    const data = imgData.data;

    // Step pixels to keep performance reasonable on large images
    const step = Math.max(1, Math.floor(Math.min(W, H) / 200));

    const x0 = Math.floor(region.x * W);
    const y0 = Math.floor(region.y * H);
    const x1 = Math.min(W - 1, x0 + Math.floor(region.w * W));
    const y1 = Math.min(H - 1, y0 + Math.floor(region.h * H));

    const grays = [];
    const xs = [], ys = [];
    for (let y = y0; y <= y1; y += step) {
      for (let x = x0; x <= x1; x += step) {
        const i = (y * W + x) * 4;
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        grays.push(gray);
        xs.push(x); ys.push(y);
      }
    }

    if (!grays.length) return {
      brightness: 128, edgeDensity: 0.5, contrast: 64, variance: 500,
      hEdge: 0.5, vEdge: 0.5, darkLineScore: 0.5
    };

    const mean = grays.reduce((a, b) => a + b, 0) / grays.length;
    const variance = grays.reduce((s, v) => s + (v - mean) ** 2, 0) / grays.length;
    const sorted = [...grays].sort((a, b) => a - b);
    // Use IQR-based contrast (p10–p90) for robustness to outliers
    const p10 = sorted[Math.floor(sorted.length * 0.10)];
    const p90 = sorted[Math.floor(sorted.length * 0.90)];
    const contrast = p90 - p10;

    const rowW = Math.round((x1 - x0) / step) + 1;
    let hEdges = 0, vEdges = 0, totalEdges = 0, darkLines = 0;
    const threshold = 12;

    for (let i = 1; i < grays.length; i++) {
      // Horizontal edges (neighboring pixels in same row)
      if (i % rowW !== 0) {
        const diff = Math.abs(grays[i] - grays[i - 1]);
        if (diff > threshold) { hEdges++; totalEdges++; }
      }
      // Vertical edges (pixel vs row above)
      if (i >= rowW) {
        const diff = Math.abs(grays[i] - grays[i - rowW]);
        if (diff > threshold) { vEdges++; totalEdges++; }
      }
      // Dark line score: pixels significantly darker than mean
      if (grays[i] < mean - 18) darkLines++;
    }

    const totalComparisons = grays.length * 1.5;
    const edgeDensity = Math.min(1, totalEdges / totalComparisons);
    const hEdge = Math.min(1, hEdges / totalComparisons);
    const vEdge = Math.min(1, vEdges / totalComparisons);
    const darkLineScore = darkLines / grays.length;

    return { brightness: mean, edgeDensity, contrast, variance, hEdge, vEdge, darkLineScore, pixelCount: grays.length };
  }

  /**
   * Validate whether the captured/uploaded image actually contains a human palm.
   * Uses RGB & YCbCr skin tone segmentation + central region texture/variance checks.
   * Returns { isValid: boolean, reason?: string, skinRatio?: number }
   */
  validatePalm(imgData) {
    if (!imgData || !imgData.width || !imgData.height) {
      return { isValid: false, reason: "Invalid or empty image data." };
    }

    const W = imgData.width;
    const H = imgData.height;
    const data = imgData.data;

    // Sample central 70% region (x: 0.15 - 0.85, y: 0.15 - 0.85)
    const step = Math.max(1, Math.floor(Math.min(W, H) / 160));
    const x0 = Math.floor(0.15 * W);
    const x1 = Math.floor(0.85 * W);
    const y0 = Math.floor(0.15 * H);
    const y1 = Math.floor(0.85 * H);

    let totalPixels = 0;
    let skinPixels = 0;
    const grays = [];

    for (let y = y0; y <= y1; y += step) {
      for (let x = x0; x <= x1; x += step) {
        const i = (y * W + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        totalPixels++;
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        grays.push(gray);

        // YCbCr skin color components:
        const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
        const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

        // Human skin tone rules (across pale, fair, olive, brown, dark skin under ambient lighting):
        const isSkinRGB = (r > g) && (r > b) && (r - g >= 4) && (r >= 35) && (g >= 20);
        const isSkinYCbCr = (cr >= 130 && cr <= 178) && (cb >= 75 && cb <= 130);

        if (isSkinRGB && isSkinYCbCr) {
          skinPixels++;
        }
      }
    }

    if (totalPixels === 0) {
      return { isValid: false, reason: "Unable to process image pixels." };
    }

    const skinRatio = skinPixels / totalPixels;
    const meanGray = grays.reduce((a, b) => a + b, 0) / grays.length;
    const variance = grays.reduce((s, v) => s + (v - meanGray) ** 2, 0) / grays.length;

    // Check 1: Skin ratio must be at least 25% of central palm region
    if (skinRatio < 0.25) {
      return {
        isValid: false,
        reason: "No human palm detected in the frame. Please align your open palm clearly inside the guides and avoid background objects or plain surfaces."
      };
    }

    // Check 2: Surface texture check (reject flat blank surfaces like paper, smooth walls)
    if (variance < 20) {
      return {
        isValid: false,
        reason: "The scanned surface appears flat and lacks palm crease textures. Please present a real human palm to the camera."
      };
    }

    return { isValid: true, skinRatio, variance };
  }

  /**
   * Compute a deterministic fingerprint from the image — unique per image.
   * Returns a Float64Array of 16 values in [0,1], each derived from different
   * spatial samples and edge gradients. Used to seed variation in interpretation.
   */
  computeFingerprint(imgData) {
    const W = imgData.width;
    const H = imgData.height;
    const data = imgData.data;
    const fp = new Float64Array(16);

    const zones = [
      [0.05, 0.05, 0.20, 0.20], [0.28, 0.05, 0.20, 0.20], [0.52, 0.05, 0.20, 0.20], [0.75, 0.05, 0.20, 0.20],
      [0.05, 0.28, 0.20, 0.20], [0.28, 0.28, 0.20, 0.20], [0.52, 0.28, 0.20, 0.20], [0.75, 0.28, 0.20, 0.20],
      [0.05, 0.52, 0.20, 0.20], [0.28, 0.52, 0.20, 0.20], [0.52, 0.52, 0.20, 0.20], [0.75, 0.52, 0.20, 0.20],
      [0.05, 0.75, 0.20, 0.20], [0.28, 0.75, 0.20, 0.20], [0.52, 0.75, 0.20, 0.20], [0.75, 0.75, 0.20, 0.20],
    ];

    zones.forEach(([rx, ry, rw, rh], idx) => {
      const x0 = Math.floor(rx * W);
      const y0 = Math.floor(ry * H);
      const x1 = Math.min(W - 1, x0 + Math.floor(rw * W));
      const y1 = Math.min(H - 1, y0 + Math.floor(rh * H));
      const step = Math.max(1, Math.floor(Math.min(W, H) / 100));

      let sumR = 0, sumG = 0, sumB = 0, edgeSum = 0, count = 0;
      let prevG = 128;
      for (let y = y0; y <= y1; y += step) {
        for (let x = x0; x <= x1; x += step) {
          const i = (y * W + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];
          sumR += r; sumG += g; sumB += b;
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          edgeSum += Math.abs(gray - prevG);
          prevG = gray;
          count++;
        }
      }
      if (count > 0) {
        const avgR = sumR / count;
        const avgG = sumG / count;
        const avgB = sumB / count;
        const avgEdge = edgeSum / count;
        const raw = (avgR * 1.73 + avgG * 2.81 + avgB * 0.47 + avgEdge * 5.19) % 100;
        fp[idx] = raw / 100;
      }
    });

    return fp;
  }

  /**
   * Run full palm analysis across all defined regions.
   */
  analyzePalm(imgData) {
    const results = {};
    for (const [key, region] of Object.entries(this.REGIONS)) {
      results[key] = this.analyzeRegion(imgData, region);
    }
    return results;
  }

  // ─────────────────────── INTERPRETATION ENGINE ───────────────────────

  /**
   * Map raw pixel metrics → palm line & mount descriptors using RELATIVE ranking.
   */
  interpretResults(regionMetrics, imgData) {
    const allKeys = Object.keys(regionMetrics);
    const allEdges = allKeys.map(k => regionMetrics[k].edgeDensity);
    const allBrights = allKeys.map(k => regionMetrics[k].brightness);
    const allVariances = allKeys.map(k => regionMetrics[k].variance);
    const allDarkLines = allKeys.map(k => regionMetrics[k].darkLineScore || 0);

    const edgeMean = allEdges.reduce((a, b) => a + b, 0) / allEdges.length;
    const edgeStd = Math.sqrt(allEdges.reduce((s, v) => s + (v - edgeMean) ** 2, 0) / allEdges.length) || 0.01;

    const brightMean = allBrights.reduce((a, b) => a + b, 0) / allBrights.length;
    const brightStd = Math.sqrt(allBrights.reduce((s, v) => s + (v - brightMean) ** 2, 0) / allBrights.length) || 1;

    const ez = (k) => (regionMetrics[k].edgeDensity - edgeMean) / edgeStd;
    const bz = (k) => (regionMetrics[k].brightness - brightMean) / brightStd;

    let fp;
    if (imgData) {
      fp = this.computeFingerprint(imgData);
    } else {
      fp = new Float64Array(16);
      allKeys.forEach((k, i) => {
        fp[i % 16] = (fp[i % 16] + ((regionMetrics[k].variance % 97) / 97)) % 1;
      });
    }

    const seed = (i, salt = 0) => {
      const v = fp[i % 16] + fp[(i + 3) % 16] * 0.3 + fp[(i + 7) % 16] * 0.1 + salt;
      return ((v * 137.508) % 1 + 1) % 1;
    };

    // ── Line interpretations using relative Z-scores + fingerprint ──

    // Life Line
    const lifeZ = ez("lifeLine");
    const lifeDark = regionMetrics.lifeLine.darkLineScore || 0;
    const lifeHV = (regionMetrics.lifeLine.hEdge || 0.1) / ((regionMetrics.lifeLine.vEdge || 0.1) + 0.001);
    const lifeSeed = seed(0);
    let lifeLine;
    if (lifeZ > 0.6) lifeLine = lifeDark > 0.14 ? "long_deep" : "long_faint";
    else if (lifeZ > 0.1) lifeLine = lifeHV > 1.1 ? "curved" : (lifeSeed > 0.5 ? "long_faint" : "short_deep");
    else if (lifeZ > -0.4) lifeLine = lifeSeed > 0.65 ? "curved" : (lifeSeed > 0.35 ? "short_faint" : "forked");
    else lifeLine = lifeDark > 0.12 ? "short_deep" : "short_faint";

    // Heart Line
    const heartZ = ez("heartLine");
    const heartDark = regionMetrics.heartLine.darkLineScore || 0;
    const heartSeed = seed(2);
    let heartLine;
    if (heartZ > 0.6) heartLine = heartDark > 0.14 ? "long_deep" : "curved_upward";
    else if (heartZ > 0.15) heartLine = heartSeed > 0.6 ? "curved_upward" : (heartSeed > 0.3 ? "straight" : "forked");
    else if (heartZ > -0.3) heartLine = heartSeed > 0.6 ? "straight" : (heartSeed > 0.3 ? "long_faint" : "chained");
    else heartLine = heartSeed > 0.5 ? "chained" : "short_deep";

    // Head Line
    const headZ = ez("headLine");
    const headDark = regionMetrics.headLine.darkLineScore || 0;
    const headSeed = seed(4);
    let headLine;
    if (headZ > 0.6) headLine = headDark > 0.14 ? "long_deep" : "forked";
    else if (headZ > 0.15) headLine = headSeed > 0.6 ? "curved" : (headSeed > 0.3 ? "straight" : "long_faint");
    else if (headZ > -0.3) headLine = headSeed > 0.65 ? "straight" : (headSeed > 0.35 ? "forked" : "short_deep");
    else headLine = headSeed > 0.5 ? "short_deep" : "long_faint";

    // Fate Line
    const fateZ = ez("fateLine");
    const fateSeed = seed(6);
    let fateLine;
    if (fateZ > 0.6) fateLine = "strong";
    else if (fateZ > 0.2) fateLine = fateSeed > 0.6 ? "starts_from_life" : (fateSeed > 0.3 ? "starts_from_moon" : "starts_late");
    else if (fateZ > -0.3) fateLine = fateSeed > 0.65 ? "starts_late" : (fateSeed > 0.35 ? "broken" : "absent");
    else fateLine = fateSeed > 0.6 ? "broken" : "absent";

    // Sun Line
    const sunZ = ez("sunLine");
    const sunSeed = seed(8);
    let sunLine;
    if (sunZ > 0.6) sunLine = "strong";
    else if (sunZ > 0.2) sunLine = sunSeed > 0.6 ? "multiple" : (sunSeed > 0.3 ? "faint" : "late");
    else if (sunZ > -0.3) sunLine = sunSeed > 0.6 ? "faint" : (sunSeed > 0.3 ? "late" : "absent");
    else sunLine = "absent";

    // Marriage Line
    const marriageZ = ez("marriageLine");
    const marriageSeed = seed(10);
    let marriageLine;
    if (marriageZ > 0.6) marriageLine = "one_deep";
    else if (marriageZ > 0.15) marriageLine = marriageSeed > 0.55 ? "two_lines" : "one_deep";
    else if (marriageZ > -0.3) marriageLine = marriageSeed > 0.6 ? "two_lines" : (marriageSeed > 0.3 ? "short" : "absent");
    else marriageLine = "absent";

    // ── Relative Mount Ranking ──
    const mountKeys = ["mountJupiter","mountSaturn","mountSun","mountMercury","mountVenus","mountMoon"];
    const mountBrights = mountKeys.map(k => regionMetrics[k].brightness);
    const mountBrightMean = mountBrights.reduce((a,b)=>a+b,0) / mountBrights.length;
    const mountBrightStd = Math.sqrt(mountBrights.reduce((s,v)=>s+(v-mountBrightMean)**2,0)/mountBrights.length) || 1;
    const mountEdges = mountKeys.map(k => regionMetrics[k].edgeDensity);
    const mountEdgeMean = mountEdges.reduce((a,b)=>a+b,0) / mountEdges.length;

    const mountScores = mountKeys.map((key, idx) => {
      const bZ = (regionMetrics[key].brightness - mountBrightMean) / mountBrightStd;
      const eZ = (regionMetrics[key].edgeDensity - mountEdgeMean) / (edgeStd || 0.01);
      const darkZ = ((regionMetrics[key].darkLineScore || 0) - (allDarkLines.reduce((a,b)=>a+b,0)/allDarkLines.length)) / 0.05;
      const s = seed(20 + idx);
      const score = bZ * 0.4 + eZ * 0.35 + darkZ * 0.15 + (s - 0.5) * 0.5;
      return { key, score };
    });

    // Rank mounts by relative score
    mountScores.sort((a, b) => b.score - a.score);

    const mountSelections = {};
    // Rank 1: overdeveloped if exceptionally high, else prominent
    mountSelections[mountScores[0].key] = mountScores[0].score > 0.8 ? "overdeveloped" : "prominent";
    // Rank 2: prominent
    mountSelections[mountScores[1].key] = "prominent";
    // Rank 3: prominent if score > 0.1, else flat
    mountSelections[mountScores[2].key] = mountScores[2].score > 0.1 ? "prominent" : "flat";
    // Rank 4, 5, 6: flat
    mountSelections[mountScores[3].key] = "flat";
    mountSelections[mountScores[4].key] = "flat";
    mountSelections[mountScores[5].key] = "flat";

    // Inner & Outer Mars derived from Venus & Moon
    mountSelections["mars_inner"] = mountSelections["mountVenus"] === "prominent" || mountSelections["mountVenus"] === "overdeveloped" ? "prominent" : "flat";
    mountSelections["mars_outer"] = mountSelections["mountMoon"] === "prominent" || mountSelections["mountMoon"] === "overdeveloped" ? "prominent" : "flat";

    // ── Hand Type Selection ──
    const lineEdges = ["heartLine","headLine","lifeLine","fateLine"].map(k => regionMetrics[k].edgeDensity);
    const lineEdgeMean = lineEdges.reduce((a,b)=>a+b,0)/lineEdges.length;
    const contrastAvg = allKeys.reduce((s,k)=>s+regionMetrics[k].contrast,0)/allKeys.length;

    let handType;
    const htSeed = seed(14);
    const htSeed2 = seed(15);

    if (lineEdgeMean > edgeMean + 0.4 * edgeStd && contrastAvg > 40) {
      handType = "fire";
    } else if (brightMean > 110 && htSeed > 0.4) {
      handType = "earth";
    } else if (regionMetrics.heartLine.hEdge > edgeMean && regionMetrics.headLine.hEdge > edgeMean) {
      handType = htSeed2 > 0.5 ? "air" : "earth";
    } else if (contrastAvg < 35) {
      handType = "water";
    } else {
      const v = htSeed * 0.6 + htSeed2 * 0.4;
      if (v > 0.75) handType = "fire";
      else if (v > 0.5) handType = "earth";
      else if (v > 0.25) handType = "air";
      else handType = "water";
    }

    return {
      lineSelections: {
        life: lifeLine,
        heart: heartLine,
        head: headLine,
        fate: fateLine,
        sun: sunLine,
        marriage: marriageLine
      },
      mountSelections,
      handType,
      imageMetrics: {
        baseline: Math.round(brightMean),
        isLowLight: brightMean < 60,
        isHighLight: brightMean > 210,
        palmEdgeDensity: Math.round(edgeMean * 1000) / 10
      }
    };
  }

  /**
   * Full pipeline: analyze image → interpret → return selections
   */
  runFullAnalysis(imgData) {
    const metrics = this.analyzePalm(imgData);
    return this.interpretResults(metrics, imgData);
  }
}



class PalmScanUI {
  constructor(palmistryPanel) {
    this.palmistryPanel = palmistryPanel;
    this.scanner = new PalmScanner();
    this.state = "idle"; // idle | requesting | live | captured | analyzing | done | error
    this.uploadMode = false;
  }

  init() {
    this.bindScanButton();
    this.buildScanModal();
  }

  bindScanButton() {
    const btn = document.getElementById("btnOpenPalmScan");
    if (btn) btn.addEventListener("click", () => this.openScanModal());
  }

  buildScanModal() {
    // Create modal overlay if not exists
    if (document.getElementById("palmScanModal")) return;

    const modal = document.createElement("div");
    modal.id = "palmScanModal";
    modal.className = "palm-scan-modal";
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-label", "Palm Scan Camera");
    modal.innerHTML = `
      <div class="palm-scan-backdrop" id="palmScanBackdrop"></div>
      <div class="palm-scan-panel">
        <!-- Header -->
        <div class="scan-panel-header">
          <div class="scan-header-brand">
            <span class="scan-om">✋</span>
            <div>
              <h3 class="scan-title" data-i18n="palm_scan_title">Hast Rekha Scanner</h3>
              <p class="scan-subtitle" data-i18n="palm_scan_sub">Vedic Palm Analysis via AI Vision</p>
            </div>
          </div>
          <button type="button" id="btnClosePalmScan" class="scan-close-btn" aria-label="Close">✕</button>
        </div>

        <!-- Instruction state -->
        <div class="scan-state" id="scanStateInstruct">
          <div class="scan-guide-card">
            <div class="scan-guide-icon">🖐️</div>
            <h4 data-i18n="palm_how_to_scan">How to Scan Your Palm</h4>
            <ol class="scan-instructions">
              <li data-i18n="palm_scan_inst1">Hold your dominant hand open, palm facing the camera</li>
              <li data-i18n="palm_scan_inst2">Ensure good lighting — natural light or bright lamp works best</li>
              <li data-i18n="palm_scan_inst3">Keep your palm flat and steady, fingers slightly apart</li>
              <li data-i18n="palm_scan_inst4">Center your palm within the frame guide</li>
            </ol>
            <div class="scan-action-row">
              <button type="button" id="btnStartCamera" class="btn-primary scan-btn">
                <span class="btn-sparkle">📷</span> <span data-i18n="palm_btn_open_cam">Open Camera</span>
              </button>
              <div class="scan-or-divider" data-i18n="palm_or">or</div>
              <label class="scan-upload-label" for="palmImageUpload">
                <span>📁</span> <span data-i18n="palm_btn_upload">Upload Palm Photo</span>
                <input type="file" id="palmImageUpload" accept="image/*" class="scan-file-input" capture="environment" />
              </label>
            </div>
          </div>
        </div>

        <!-- Camera live state -->
        <div class="scan-state scan-hidden" id="scanStateLive">
          <div class="scan-viewfinder-wrapper">
            <div class="scan-viewfinder">
              <video id="palmScanVideo" class="scan-video" autoplay muted playsinline></video>
              <!-- Overlay guides -->
              <div class="scan-overlay">
                <div class="scan-frame-guide">
                  <div class="scan-corner tl"></div>
                  <div class="scan-corner tr"></div>
                  <div class="scan-corner bl"></div>
                  <div class="scan-corner br"></div>
                  <div class="scan-frame-label" data-i18n="palm_frame_label">Place palm here</div>
                </div>
                <div class="scan-palm-outline" aria-hidden="true">
                  <svg viewBox="0 0 120 180" class="scan-palm-svg">
                    <path d="M 35 160 Q 20 140 18 110 Q 16 80 20 60 Q 22 45 26 36 Q 28 28 32 26 Q 37 24 38 32 Q 39 42 39 52
                             Q 42 34 46 24 Q 49 14 56 14 Q 63 14 64 24 Q 65 36 64 52
                             Q 67 30 70 22 Q 73 12 80 12 Q 87 12 88 22 Q 89 34 87 52
                             Q 91 32 93 24 Q 97 14 103 15 Q 109 17 109 28 Q 109 42 106 55
                             Q 110 64 113 78 Q 116 95 116 115 Q 116 138 110 156 Q 104 168 95 172
                             Q 75 180 55 180 Q 38 180 35 160 Z"
                          fill="none" stroke="rgba(139,92,246,0.5)" stroke-width="1.5" stroke-dasharray="5,4"/>
                  </svg>
                </div>
              </div>
              <!-- Lighting meter -->
              <div class="scan-light-meter" id="scanLightMeter">
                <span class="light-dot" id="lightDot"></span>
                <span id="lightLabel">Checking light...</span>
              </div>
            </div>
          </div>
          <div class="scan-live-controls">
            <p class="scan-tip" id="scanLiveTip" data-i18n="palm_scan_tip">Center your open palm in the frame and hold steady</p>
            <button type="button" id="btnCapturePalm" class="scan-capture-btn" aria-label="Capture palm">
              <div class="capture-ring"></div>
              <div class="capture-inner"></div>
            </button>
            <button type="button" id="btnCancelCamera" class="btn-sm scan-cancel-btn">Cancel</button>
          </div>
        </div>

        <!-- Captured / analyzing state -->
        <div class="scan-state scan-hidden" id="scanStateAnalyzing">
          <div class="scan-analyzing-card">
            <canvas id="palmScanCanvas" class="scan-canvas"></canvas>
            <div class="scan-analyzing-overlay">
              <div class="scan-orb-wrapper">
                <div class="scan-analysis-orb" id="scanOrb">
                  <span id="scanOrbIcon">✋</span>
                </div>
                <div class="scan-orb-ring r1"></div>
                <div class="scan-orb-ring r2"></div>
                <div class="scan-orb-ring r3"></div>
              </div>
              <div class="scan-progress-steps" id="scanProgressSteps">
                <div class="scan-step" id="scanStep1" data-i18n="palm_scan_step1">📷 Capturing palm image...</div>
                <div class="scan-step" id="scanStep2" data-i18n="palm_scan_step2">🔍 Mapping palm regions...</div>
                <div class="scan-step" id="scanStep3" data-i18n="palm_scan_step3">📐 Analyzing line patterns...</div>
                <div class="scan-step" id="scanStep4" data-i18n="palm_scan_step4">⛰️ Reading mount energies...</div>
                <div class="scan-step" id="scanStep5" data-i18n="palm_scan_step5">✨ Consulting Hast Rekha Vidya...</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Result preview state -->
        <div class="scan-state scan-hidden" id="scanStateDone">
          <div class="scan-done-card">
            <div class="scan-done-header">
              <div class="scan-done-icon">✅</div>
              <div>
                <h4 class="scan-done-title" data-i18n="palm_scan_done_title">Palm Analysis Complete</h4>
                <p class="scan-done-sub" data-i18n="palm_scan_done_sub">Your Hast Rekha reading is ready</p>
              </div>
            </div>
            <canvas id="palmScanCanvasDone" class="scan-canvas-done"></canvas>
            <div class="scan-detected-summary" id="scanDetectedSummary"></div>
            <div class="scan-done-actions">
              <button type="button" id="btnApplyScanResult" class="btn-primary scan-btn">
                <span class="btn-sparkle">✦</span> <span data-i18n="palm_btn_apply">Apply & Generate Full Reading</span>
              </button>
              <button type="button" id="btnRescan" class="btn-sm" style="margin-top:10px;" data-i18n="palm_btn_rescan">↺ Scan Again</button>
            </div>
          </div>
        </div>

        <!-- Error state -->
        <div class="scan-state scan-hidden" id="scanStateError">
          <div class="scan-error-card">
            <div class="scan-error-icon">⚠️</div>
            <h4 id="scanErrorTitle">Camera Access Denied</h4>
            <p id="scanErrorMsg">Please allow camera access in your browser settings, or upload a palm photo instead.</p>
            <button type="button" id="btnErrorRetry" class="btn-primary scan-btn" style="margin-top:18px;">Try Again</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Bind internal events
    document.getElementById("btnClosePalmScan").addEventListener("click", () => this.closeScanModal());
    document.getElementById("palmScanBackdrop").addEventListener("click", () => this.closeScanModal());
    document.getElementById("btnStartCamera").addEventListener("click", () => this.startCamera());
    document.getElementById("btnCancelCamera").addEventListener("click", () => this.stopCamera());
    document.getElementById("btnCapturePalm").addEventListener("click", () => this.captureAndAnalyze());
    document.getElementById("btnRescan").addEventListener("click", () => this.goToState("instruct"));
    document.getElementById("btnErrorRetry").addEventListener("click", () => this.goToState("instruct"));
    document.getElementById("btnApplyScanResult").addEventListener("click", () => this.applyResult());
    document.getElementById("palmImageUpload").addEventListener("change", (e) => this.handleFileUpload(e));

    // Keyboard close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeScanModal();
    });
  }

  updateLanguage() {
    if (typeof I18N !== "undefined") {
      I18N.applyLanguage(I18N.currentLang);
    }
  }

  openScanModal() {
    const modal = document.getElementById("palmScanModal");
    if (!modal) return;
    this.updateLanguage();
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    this.goToState("instruct");
  }

  closeScanModal() {
    const modal = document.getElementById("palmScanModal");
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    this.scanner.stopCamera();
    this.stopLightMeter();
  }

  goToState(stateName) {
    const stateMap = {
      instruct: "scanStateInstruct",
      live: "scanStateLive",
      analyzing: "scanStateAnalyzing",
      done: "scanStateDone",
      error: "scanStateError"
    };
    document.querySelectorAll(".scan-state").forEach(el => el.classList.add("scan-hidden"));
    const target = document.getElementById(stateMap[stateName]);
    if (target) target.classList.remove("scan-hidden");
    this.state = stateName;
  }

  // ─────────────────────── CAMERA ───────────────────────

  async startCamera() {
    this.goToState("live");
    const video = document.getElementById("palmScanVideo");
    const ok = await this.scanner.startCamera(video);
    if (!ok) {
      this.showError("Camera Access Denied", "Please allow camera access in your browser, or use the 'Upload Palm Photo' option instead.");
      return;
    }
    this.startLightMeter(video);
    this.startLiveTips();
  }

  stopCamera() {
    this.scanner.stopCamera();
    this.stopLightMeter();
    this.goToState("instruct");
  }

  startLightMeter(videoEl) {
    const dot = document.getElementById("lightDot");
    const label = document.getElementById("lightLabel");
    const canvas = document.createElement("canvas");
    canvas.width = 160; canvas.height = 120;
    const ctx = canvas.getContext("2d");

    this._lightInterval = setInterval(() => {
      try {
        ctx.drawImage(videoEl, 0, 0, 160, 120);
        const d = ctx.getImageData(40, 30, 80, 60).data;
        let total = 0;
        for (let i = 0; i < d.length; i += 4) total += 0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2];
        const avg = total / (d.length / 4);

        if (avg < 60) {
          dot.style.background = "#f43f5e"; label.textContent = "Too dark — add more light";
        } else if (avg > 220) {
          dot.style.background = "#f59e0b"; label.textContent = "Too bright — reduce glare";
        } else {
          dot.style.background = "#10b981"; label.textContent = "Lighting looks good ✓";
        }
      } catch(_) {}
    }, 800);
  }

  stopLightMeter() {
    if (this._lightInterval) {
      clearInterval(this._lightInterval);
      this._lightInterval = null;
    }
    if (this._tipsTimeout) clearTimeout(this._tipsTimeout);
  }

  startLiveTips() {
    const tips = [
      "Center your open palm in the frame and hold steady",
      "Spread fingers slightly for better line visibility",
      "Keep your palm flat — don't curl the fingers",
      "Make sure your palm lines are clearly visible",
      "Good natural light produces the most accurate reading"
    ];
    let i = 0;
    const tipEl = document.getElementById("scanLiveTip");
    const rotateTip = () => {
      if (tipEl) { tipEl.style.opacity = 0; setTimeout(() => { tipEl.textContent = tips[i++ % tips.length]; tipEl.style.opacity = 1; }, 300); }
      this._tipsTimeout = setTimeout(rotateTip, 3500);
    };
    this._tipsTimeout = setTimeout(rotateTip, 3500);
  }

  // ─────────────────────── CAPTURE & ANALYZE ───────────────────────

  async captureAndAnalyze() {
    const video = document.getElementById("palmScanVideo");
    const canvas = document.getElementById("palmScanCanvas");

    // Flash effect
    const flashEl = document.createElement("div");
    flashEl.className = "scan-flash";
    document.getElementById("scanStateLive").appendChild(flashEl);
    setTimeout(() => flashEl.remove(), 400);

    const imgData = this.scanner.captureFrame(video, canvas);
    this.scanner.stopCamera();
    this.stopLightMeter();

    this.goToState("analyzing");
    await this.runAnalysisAnimation(imgData);
  }

  async handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = async () => {
      const canvas = document.getElementById("palmScanCanvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.scanner.capturedImageData = imgData;
      URL.revokeObjectURL(url);
      this.goToState("analyzing");
      await this.runAnalysisAnimation(imgData);
    };
    img.src = url;
  }

  async runAnalysisAnimation(imgData) {
    // Step 0: Validate that the image contains a real human palm
    const val = this.scanner.validatePalm(imgData);
    if (!val.isValid) {
      this.showError(
        "✋ No Palm Detected",
        val.reason || "Please align your open palm clearly inside the camera frame or upload a clear photo of your palm."
      );
      return;
    }

    // Animated steps with genuine analysis running in background
    const steps = ["scanStep1", "scanStep2", "scanStep3", "scanStep4", "scanStep5"];
    const delays = [600, 900, 1100, 1000, 900];

    // Reset steps
    steps.forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.classList.remove("active", "done"); }
    });

    // Run real analysis immediately
    const analysisPromise = new Promise(resolve => {
      setTimeout(() => {
        const result = this.scanner.runFullAnalysis(imgData);
        resolve(result);
      }, 50);
    });

    // Animate steps with delays
    let elapsed = 0;
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, delays[i]));
      const el = document.getElementById(steps[i]);
      if (el) {
        el.classList.add("active");
        await new Promise(r => setTimeout(r, 300));
        el.classList.remove("active");
        el.classList.add("done");
      }
    }

    // Wait for analysis to be ready
    const result = await analysisPromise;
    this.scanner.analysisResult = result;

    // Draw region overlay on done canvas
    await new Promise(r => setTimeout(r, 400));
    this.drawResultOverlay(imgData);
    this.renderDetectedSummary(result);
    this.goToState("done");
  }

  drawResultOverlay(imgData) {
    const doneCanvas = document.getElementById("palmScanCanvasDone");
    if (!doneCanvas) return;
    const srcCanvas = document.getElementById("palmScanCanvas");
    doneCanvas.width = srcCanvas.width;
    doneCanvas.height = srcCanvas.height;
    const ctx = doneCanvas.getContext("2d");
    ctx.putImageData(imgData, 0, 0);

    const W = doneCanvas.width;
    const H = doneCanvas.height;

    // Draw line region highlights
    const lineColors = {
      heartLine: "#f43f5e",
      headLine: "#38bdf8",
      lifeLine: "#10b981",
      fateLine: "#ffd166",
      sunLine: "#f59e0b",
      marriageLine: "#8b5cf6"
    };

    ctx.lineWidth = Math.max(2, W * 0.003);
    for (const [key, color] of Object.entries(lineColors)) {
      const region = this.scanner.REGIONS[key];
      if (!region) continue;
      const rx = region.x * W, ry = region.y * H;
      const rw = region.w * W, rh = region.h * H;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.85;
      ctx.strokeRect(rx, ry, rw, rh);
      ctx.globalAlpha = 0.15;
      ctx.fillRect(rx, ry, rw, rh);
      ctx.globalAlpha = 1;
    }

    // Label
    ctx.font = `bold ${Math.max(12, W * 0.022)}px sans-serif`;
    ctx.fillStyle = "rgba(255,209,102,0.95)";
    ctx.fillText("✋ Palm Analysis", W * 0.03, H * 0.05);
  }

  renderDetectedSummary(result) {
    const container = document.getElementById("scanDetectedSummary");
    if (!container) return;

    const handData = typeof HAND_TYPES !== "undefined" ? HAND_TYPES[result.handType] : null;
    const handLabel = handData ? handData.label : result.handType;

    const lineLabels = {
      life: "Life Line", heart: "Heart Line", head: "Head Line",
      fate: "Fate Line", sun: "Sun Line", marriage: "Union Lines"
    };

    const variantLabels = {
      long_deep: "Long & Deep", long_faint: "Long & Light", short_deep: "Short & Deep",
      short_faint: "Short & Faint", curved: "Curved", curved_upward: "Curved Upward",
      straight: "Straight", forked: "Forked", chained: "Chained",
      strong: "Strong", starts_late: "Starts Late", starts_from_life: "From Life Line",
      starts_from_moon: "From Luna Mount", absent: "Absent", broken: "Broken",
      faint: "Faint", multiple: "Multiple", late: "Late",
      one_deep: "One Deep", two_lines: "Two Lines", short: "Short"
    };

    container.innerHTML = `
      <div class="scan-detected-hand">
        <span>${handData?.icon || "✋"}</span>
        <strong>Detected: ${handLabel}</strong>
      </div>
      <div class="scan-detected-lines">
        ${Object.entries(result.lineSelections).map(([k, v]) => `
          <div class="scan-detected-line">
            <span class="scan-det-label">${lineLabels[k] || k}</span>
            <span class="scan-det-value">${variantLabels[v] || v}</span>
          </div>
        `).join("")}
      </div>
      <div class="scan-quality-note">
        ${result.imageMetrics.isLowLight
          ? "⚠️ Low light detected — reading may vary. Better lighting improves accuracy."
          : result.imageMetrics.isHighLight
          ? "⚠️ Bright glare detected — try reducing direct light for sharper analysis."
          : "✅ Good image quality — confident palm analysis"}
      </div>
    `;
  }

  // ─────────────────────── APPLY RESULT ───────────────────────

  applyResult() {
    const result = this.scanner.analysisResult;
    if (!result || !this.palmistryPanel) return;

    // Update palmistryPanel selections
    this.palmistryPanel.selections.handType = result.handType;
    this.palmistryPanel.selections.lineSelections = { ...result.lineSelections };
    this.palmistryPanel.selections.mountSelections = { ...result.mountSelections };

    // Re-render UI to reflect scanned values
    this.palmistryPanel.renderHandTypeSelector();
    this.palmistryPanel.renderLineSelector();
    this.palmistryPanel.renderMountSelector();

    // Update vedic note
    const note = document.getElementById("palmHandVedicNote");
    if (note && typeof HAND_TYPES !== "undefined") {
      note.textContent = HAND_TYPES[result.handType]?.vedic || "";
    }

    this.closeScanModal();

    // Auto-trigger reading after short delay
    setTimeout(() => {
      this.palmistryPanel.performReading();
      // Scroll to result
      const panel = document.getElementById("panelPalmistry");
      if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }

  showError(title, msg) {
    document.getElementById("scanErrorTitle").textContent = title;
    document.getElementById("scanErrorMsg").textContent = msg;
    this.goToState("error");
  }
}

// Expose globally
window.PalmScanner = PalmScanner;
window.PalmScanUI = PalmScanUI;
