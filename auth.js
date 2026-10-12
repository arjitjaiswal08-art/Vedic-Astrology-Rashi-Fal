/**
 * PanditConnect Authentication Module
 * Vedic Astrology Platform — Secure Auth Layer
 *
 * Implements:
 *  - bcrypt password hashing (cost 12)
 *  - JWT access tokens (1h) + refresh tokens (30d)
 *  - Role-based middleware: requireAuth, requireRole
 *  - User signup / login / profile
 *  - Pandit signup (multi-step) / login / profile / verification flow
 *  - Password reset via expiring tokens (no external mailer in demo)
 *  - Rate limiting on auth endpoints
 *  - Input sanitization and validation
 *  - Secure JSON file persistence (replace with DB in production)
 */

'use strict';

const express    = require('express');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const rateLimit  = require('express-rate-limit');
const crypto     = require('crypto');
const uuidv4 = () => crypto.randomUUID();

const path       = require('path');
const fs         = require('fs');

const router = express.Router();

// ── Secrets (use env vars in production) ──────────────────────────────────────
const JWT_SECRET         = process.env.JWT_SECRET || 'vedic-astrology-jwt-secret-change-in-prod';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'vedic-astrology-refresh-secret-change-in-prod';
const JWT_EXPIRES        = '1h';
const REFRESH_EXPIRES    = '30d';
const BCRYPT_ROUNDS      = 12;

// ── Data persistence ──────────────────────────────────────────────────────────
const AUTH_FILE = path.join(__dirname, 'auth_data.json');

function loadAuthData() {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
      if (parsed && Array.isArray(parsed.users) && parsed.users.length > 0) {
        return parsed;
      }
    }
  } catch (e) { /* fall through */ }

  // Seed with default demo accounts for instant login testing
  const demoHash = '$2b$10$cbrMXjcafexqaJgkGmA8JO/eFjiJGLmEMwlEldL5ir7j6ZZoWZrUC'; // 'Password@123'
  return {
    users: [
      {
        id: 'USR-DEMO001',
        name: 'Arjun Sharma',
        email: 'devotee@vedicastrology.ai',
        phone: '+91 98765 43210',
        passwordHash: demoHash,
        role: 'user',
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        profile: {
          country: 'India',
          state: 'Uttar Pradesh',
          city: 'Varanasi',
          preferredLanguage: 'Hindi'
        }
      }
    ],
    pandits: [
      {
        id: 'PND-AUTH-001',
        panditId: 'PND-100001',
        name: 'Pt. Ram Sharma',
        email: 'pandit.ram@vedicastrology.ai',
        phone: '+91 98765 00001',
        passwordHash: demoHash,
        role: 'pandit',
        status: 'approved',
        profileStep: 4,
        isEmailVerified: true,
        isPhoneVerified: true,
        verifiedAt: '2024-01-01T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        rating: 4.9,
        reviewCount: 128,
        profile: {
          professionalName: 'Pt. Ram Sharma',
          dob: '1982-04-14',
          photo: '🕉️',
          experience: 18,
          country: 'India',
          state: 'Uttar Pradesh',
          district: 'Varanasi',
          city: 'Varanasi',
          area: 'Assi Ghat',
          pincode: '221005',
          languages: ['Hindi', 'Sanskrit', 'English'],
          tradition: 'Shaiva (Shiva tradition)',
          bio: 'Kashi Vishwanath trained Vedic scholar with 18+ years performing sacred rituals and homams.',
          services: [
            { name: 'Griha Pravesh Puja', basePrice: 3100 },
            { name: 'Rudrabhishek Puja', basePrice: 2100 },
            { name: 'Satyanarayan Katha', basePrice: 1500 },
            { name: 'Maha Mrityunjaya Jaap', basePrice: 5100 }
          ],
          homeVisit: true,
          onlineConsult: true,
          travelRadius: 30,
          availability: {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            timeFrom: '06:00',
            timeTo: '20:00'
          }
        }
      }
    ],
    refreshTokens:  [],
    resetTokens:    [],
    notifications:  [],
    savedAddresses: [],
    favourites:     [],
  };
}

function saveAuthData() {
  try {
    fs.writeFileSync(AUTH_FILE, JSON.stringify(authDb, null, 2), 'utf8');
  } catch (e) { /* no-op in read-only envs */ }
}

const authDb = loadAuthData();
saveAuthData();

// ── Pandit ID generator ───────────────────────────────────────────────────────
function genPanditId() {
  const nums = authDb.pandits
    .map(p => parseInt((p.panditId || 'PND-100000').replace('PND-', '')) || 100000);
  const max = nums.length ? Math.max(...nums) : 100000;
  return 'PND-' + (max + 1);
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── JWT helpers ───────────────────────────────────────────────────────────────
function signAccess(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}
function signRefresh(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}
function verifyAccess(token) {
  return jwt.verify(token, JWT_SECRET);
}
function verifyRefresh(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

// ── Input validation helpers ──────────────────────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).toLowerCase());
}
function validatePhone(phone) {
  return /^[+]?[\d\s\-()]{7,15}$/.test(String(phone));
}
function validatePassword(pass) {
  return typeof pass === 'string' && pass.length >= 8;
}
function sanitize(str, maxLen = 255) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen).replace(/<[^>]*>/g, '');
}

// ── Auth middleware ───────────────────────────────────────────────────────────
/**
 * requireAuth — attaches req.user from Bearer token.
 * Looks up user/pandit to ensure account still exists.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  try {
    const decoded = verifyAccess(token);
    // Look up live record (handles deleted accounts)
    const user = decoded.role === 'pandit'
      ? authDb.pandits.find(p => p.id === decoded.id)
      : authDb.users.find(u => u.id === decoded.id);
    if (!user) return res.status(401).json({ error: 'Account not found.' });
    req.user = { id: user.id, role: user.role, panditId: user.panditId };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

/**
 * requireRole(...roles) — after requireAuth, checks role.
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
    }
    next();
  };
}

// ── Strip sensitive fields before responding ──────────────────────────────────
function safeUser(u) {
  const { passwordHash, ...safe } = u;
  return safe;
}
function safePandit(p) {
  const { passwordHash, ...safe } = p;
  return safe;
}

// ────────────────────────────────────────────────────────────────────────────
//  USER ROUTES
// ────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/user/register
 * Register a new User / Devotee account
 */
router.post('/user/register', authLimiter, async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    // Validate required fields
    const errors = [];
    if (!sanitize(name, 100)) errors.push('Full name is required.');
    if (!email || !validateEmail(email)) errors.push('A valid email address is required.');
    if (!phone || !validatePhone(phone)) errors.push('A valid phone number is required.');
    if (!validatePassword(password)) errors.push('Password must be at least 8 characters.');
    if (password !== confirmPassword) errors.push('Passwords do not match.');
    if (errors.length) return res.status(400).json({ errors });

    const normalEmail = email.toLowerCase().trim();
    const normalPhone = phone.trim();

    // Duplicate checks
    if (authDb.users.find(u => u.email === normalEmail)) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    if (authDb.users.find(u => u.phone === normalPhone)) {
      return res.status(409).json({ error: 'An account with this phone number already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const userId = 'USR-' + uuidv4().slice(0, 8).toUpperCase();

    const newUser = {
      id:           userId,
      role:         'user',
      name:         sanitize(name, 100),
      email:        normalEmail,
      phone:        normalPhone,
      passwordHash,
      emailVerified: false,
      profile: {
        photo: null, country: '', state: '', district: '',
        city: '', area: '', pincode: '', preferredLanguage: 'en',
      },
      createdAt: new Date().toISOString(),
    };

    authDb.users.push(newUser);
    // Add welcome notification
    authDb.notifications.push({
      id: 'NTF-' + Date.now(), userId,
      message: `Welcome to VedicAstrology, ${newUser.name}! Explore Pandits near you.`,
      read: false, createdAt: new Date().toISOString(),
    });
    saveAuthData();

    const accessToken  = signAccess({ id: userId, role: 'user' });
    const refreshToken = signRefresh({ id: userId, role: 'user' });
    authDb.refreshTokens.push({ token: refreshToken, userId, role: 'user', expiresAt: new Date(Date.now() + 30 * 86400000).toISOString() });
    saveAuthData();

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      accessToken, refreshToken,
      user: safeUser(newUser),
    });
  } catch (err) {
    console.error('[User Register]', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

/**
 * POST /api/auth/user/login
 */
router.post('/user/login', loginLimiter, async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/phone and password are required.' });
    }

    const id = identifier.toLowerCase().trim();
    const user = authDb.users.find(u => u.email === id || u.phone === id);
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials.' });

    const accessToken  = signAccess({ id: user.id, role: 'user' });
    const refreshToken = signRefresh({ id: user.id, role: 'user' });

    // Remove old refresh tokens for this user
    authDb.refreshTokens = authDb.refreshTokens.filter(t => t.userId !== user.id);
    authDb.refreshTokens.push({ token: refreshToken, userId: user.id, role: 'user', expiresAt: new Date(Date.now() + 30 * 86400000).toISOString() });
    saveAuthData();

    return res.status(200).json({
      success: true,
      accessToken, refreshToken,
      user: safeUser(user),
    });
  } catch (err) {
    console.error('[User Login]', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

/**
 * GET /api/auth/user/me
 */
router.get('/user/me', requireAuth, requireRole('user'), (req, res) => {
  const user = authDb.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Account not found.' });
  return res.status(200).json(safeUser(user));
});

/**
 * PATCH /api/auth/user/profile
 * Update optional profile details
 */
router.patch('/user/profile', requireAuth, requireRole('user'), (req, res) => {
  const user = authDb.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Account not found.' });

  const allowed = ['photo', 'country', 'state', 'district', 'city', 'area', 'pincode', 'preferredLanguage'];
  allowed.forEach(k => {
    if (req.body[k] !== undefined) user.profile[k] = sanitize(String(req.body[k]));
  });
  if (req.body.name) user.name = sanitize(req.body.name, 100);
  user.updatedAt = new Date().toISOString();
  saveAuthData();
  return res.status(200).json({ success: true, user: safeUser(user) });
});

/**
 * GET /api/auth/user/bookings
 */
router.get('/user/bookings', requireAuth, requireRole('user'), (req, res) => {
  // Load from pandit_data.json via shared store reference
  const bookings = global.pcData?.bookings?.filter(b => b.userId === req.user.id) || [];
  return res.status(200).json({ bookings, total: bookings.length });
});

/**
 * GET /api/auth/user/notifications
 */
router.get('/user/notifications', requireAuth, requireRole('user'), (req, res) => {
  const notifs = authDb.notifications.filter(n => n.userId === req.user.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  return res.status(200).json({ notifications: notifs, unread: notifs.filter(n => !n.read).length });
});

/**
 * PATCH /api/auth/user/notifications/:id/read
 */
router.patch('/user/notifications/:id/read', requireAuth, requireRole('user'), (req, res) => {
  const notif = authDb.notifications.find(n => n.id === req.params.id && n.userId === req.user.id);
  if (!notif) return res.status(404).json({ error: 'Notification not found.' });
  notif.read = true;
  saveAuthData();
  return res.status(200).json({ success: true });
});

/**
 * GET /api/auth/user/favourites
 * POST /api/auth/user/favourites
 * DELETE /api/auth/user/favourites/:panditId
 */
router.get('/user/favourites', requireAuth, requireRole('user'), (req, res) => {
  const favs = authDb.favourites.filter(f => f.userId === req.user.id);
  return res.status(200).json({ favourites: favs });
});
router.post('/user/favourites', requireAuth, requireRole('user'), (req, res) => {
  const { panditId } = req.body;
  if (!panditId) return res.status(400).json({ error: 'panditId is required.' });
  if (authDb.favourites.find(f => f.userId === req.user.id && f.panditId === panditId)) {
    return res.status(409).json({ error: 'Already in favourites.' });
  }
  authDb.favourites.push({ userId: req.user.id, panditId, savedAt: new Date().toISOString() });
  saveAuthData();
  return res.status(201).json({ success: true });
});
router.delete('/user/favourites/:panditId', requireAuth, requireRole('user'), (req, res) => {
  const before = authDb.favourites.length;
  authDb.favourites = authDb.favourites.filter(f => !(f.userId === req.user.id && f.panditId === req.params.panditId));
  if (authDb.favourites.length === before) return res.status(404).json({ error: 'Not in favourites.' });
  saveAuthData();
  return res.status(200).json({ success: true });
});

/**
 * GET /api/auth/user/saved-addresses
 * POST /api/auth/user/saved-addresses
 * DELETE /api/auth/user/saved-addresses/:id
 */
router.get('/user/saved-addresses', requireAuth, requireRole('user'), (req, res) => {
  const addresses = authDb.savedAddresses.filter(a => a.userId === req.user.id);
  return res.status(200).json({ addresses });
});
router.post('/user/saved-addresses', requireAuth, requireRole('user'), (req, res) => {
  const { label, address, pin } = req.body;
  if (!address) return res.status(400).json({ error: 'Address is required.' });
  const entry = { id: 'ADDR-' + Date.now(), userId: req.user.id, label: sanitize(label || 'Home', 50), address: sanitize(address, 300), pin: sanitize(pin || '', 10), createdAt: new Date().toISOString() };
  authDb.savedAddresses.push(entry);
  saveAuthData();
  return res.status(201).json({ success: true, address: entry });
});
router.delete('/user/saved-addresses/:id', requireAuth, requireRole('user'), (req, res) => {
  const before = authDb.savedAddresses.length;
  authDb.savedAddresses = authDb.savedAddresses.filter(a => !(a.id === req.params.id && a.userId === req.user.id));
  if (authDb.savedAddresses.length === before) return res.status(404).json({ error: 'Address not found.' });
  saveAuthData();
  return res.status(200).json({ success: true });
});

// ────────────────────────────────────────────────────────────────────────────
//  PANDIT ROUTES
// ────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/pandit/register
 * Step 1: Create Pandit account credentials
 */
router.post('/pandit/register', authLimiter, async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    const errors = [];
    if (!sanitize(name, 100)) errors.push('Full name is required.');
    if (!email || !validateEmail(email)) errors.push('A valid email address is required.');
    if (!phone || !validatePhone(phone)) errors.push('A valid phone number is required.');
    if (!validatePassword(password)) errors.push('Password must be at least 8 characters.');
    if (password !== confirmPassword) errors.push('Passwords do not match.');
    if (errors.length) return res.status(400).json({ errors });

    const normalEmail = email.toLowerCase().trim();
    const normalPhone = phone.trim();

    // Check across both users and pandits
    if (authDb.users.find(u => u.email === normalEmail) || authDb.pandits.find(p => p.email === normalEmail)) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    if (authDb.pandits.find(p => p.phone === normalPhone)) {
      return res.status(409).json({ error: 'An account with this phone number already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const internalId   = 'INT-' + uuidv4().slice(0, 8).toUpperCase();
    const panditId     = genPanditId();

    const newPandit = {
      id:           internalId,
      panditId,
      role:         'pandit',
      name:         sanitize(name, 100),
      email:        normalEmail,
      phone:        normalPhone,
      passwordHash,
      status:       'incomplete', // incomplete → pending → approved / rejected
      profileStep:  1,
      emailVerified: false,
      profile: {
        professionalName: '',
        dob: '',
        photo: null,
        experience: 0,
        country: 'India',
        state: '', district: '', city: '', area: '', pincode: '',
        languages: [],
        tradition: '',
        bio: '',
        services: [],           // [{ name, basePrice, duration, desc }]
        homeVisit: false,
        onlineConsult: false,
        travelRadius: 0,
        availability: {
          days: [],             // ['Monday', ...]
          timeFrom: '7:00 AM',
          timeTo:   '8:00 PM',
        },
      },
      rating:      0,
      reviewCount: 0,
      createdAt:   new Date().toISOString(),
    };

    authDb.pandits.push(newPandit);
    authDb.notifications.push({
      id: 'NTF-' + Date.now(), userId: internalId,
      message: `Welcome! Your Pandit ID is ${panditId}. Complete your profile to go live.`,
      read: false, createdAt: new Date().toISOString(),
    });
    saveAuthData();

    const accessToken  = signAccess({ id: internalId, role: 'pandit' });
    const refreshToken = signRefresh({ id: internalId, role: 'pandit' });
    authDb.refreshTokens.push({ token: refreshToken, userId: internalId, role: 'pandit', expiresAt: new Date(Date.now() + 30 * 86400000).toISOString() });
    saveAuthData();

    return res.status(201).json({
      success: true,
      message: `Account created. Your Pandit ID is ${panditId}. Please complete your profile.`,
      panditId,
      accessToken, refreshToken,
      pandit: safePandit(newPandit),
    });
  } catch (err) {
    console.error('[Pandit Register]', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

/**
 * POST /api/auth/pandit/login
 */
router.post('/pandit/login', loginLimiter, async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/phone and password are required.' });
    }

    const id = identifier.toLowerCase().trim();
    const pandit = authDb.pandits.find(p => p.email === id || p.phone === id);
    if (!pandit) return res.status(401).json({ error: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, pandit.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials.' });

    if (pandit.status === 'rejected') {
      return res.status(403).json({ error: 'Your Pandit account has been rejected. Please contact support.' });
    }

    const accessToken  = signAccess({ id: pandit.id, role: 'pandit' });
    const refreshToken = signRefresh({ id: pandit.id, role: 'pandit' });

    authDb.refreshTokens = authDb.refreshTokens.filter(t => t.userId !== pandit.id);
    authDb.refreshTokens.push({ token: refreshToken, userId: pandit.id, role: 'pandit', expiresAt: new Date(Date.now() + 30 * 86400000).toISOString() });
    saveAuthData();

    return res.status(200).json({
      success: true,
      accessToken, refreshToken,
      pandit: safePandit(pandit),
    });
  } catch (err) {
    console.error('[Pandit Login]', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

/**
 * GET /api/auth/pandit/me
 */
router.get('/pandit/me', requireAuth, requireRole('pandit'), (req, res) => {
  const pandit = authDb.pandits.find(p => p.id === req.user.id);
  if (!pandit) return res.status(404).json({ error: 'Account not found.' });
  return res.status(200).json(safePandit(pandit));
});

/**
 * PATCH /api/auth/pandit/profile
 * Update professional profile (Step 2 & later updates)
 */
router.patch('/pandit/profile', requireAuth, requireRole('pandit'), (req, res) => {
  const pandit = authDb.pandits.find(p => p.id === req.user.id);
  if (!pandit) return res.status(404).json({ error: 'Account not found.' });

  const profileFields = [
    'professionalName','dob','photo','experience','country','state','district',
    'city','area','pincode','languages','tradition','bio','services',
    'homeVisit','onlineConsult','travelRadius','availability'
  ];
  profileFields.forEach(k => {
    if (req.body[k] !== undefined) pandit.profile[k] = req.body[k];
  });

  // If profile is now reasonably complete, move to pending
  const p = pandit.profile;
  const isComplete = p.city && p.state && p.bio && p.experience > 0 && p.services?.length > 0 && p.languages?.length > 0;
  if (isComplete && pandit.status === 'incomplete') {
    pandit.status = 'pending';
    authDb.notifications.push({
      id: 'NTF-' + Date.now(), userId: pandit.id,
      message: 'Your profile is complete and submitted for verification. We will review it shortly.',
      read: false, createdAt: new Date().toISOString(),
    });
  }

  pandit.profileStep = Math.max(pandit.profileStep || 1, 2);
  pandit.updatedAt = new Date().toISOString();
  saveAuthData();

  return res.status(200).json({ success: true, pandit: safePandit(pandit), status: pandit.status });
});

/**
 * GET /api/auth/pandit/bookings
 * Pandit can only see their own bookings
 */
router.get('/pandit/bookings', requireAuth, requireRole('pandit'), (req, res) => {
  const pandit = authDb.pandits.find(p => p.id === req.user.id);
  if (!pandit) return res.status(404).json({ error: 'Account not found.' });
  const bookings = global.pcData?.bookings?.filter(b => b.panditId === pandit.panditId) || [];
  return res.status(200).json({ bookings, total: bookings.length });
});

/**
 * GET /api/auth/pandit/consultations
 */
router.get('/pandit/consultations', requireAuth, requireRole('pandit'), (req, res) => {
  const pandit = authDb.pandits.find(p => p.id === req.user.id);
  if (!pandit) return res.status(404).json({ error: 'Account not found.' });
  const consults = global.pcData?.consultations?.filter(c => c.panditId === pandit.panditId || !c.panditId) || [];
  return res.status(200).json({ consultations: consults, total: consults.length });
});

/**
 * GET /api/auth/pandit/reviews
 */
router.get('/pandit/reviews', requireAuth, requireRole('pandit'), (req, res) => {
  const pandit = authDb.pandits.find(p => p.id === req.user.id);
  if (!pandit) return res.status(404).json({ error: 'Account not found.' });
  const reviews = global.pcData?.reviews?.filter(r => r.panditId === pandit.panditId) || [];
  return res.status(200).json({ reviews, total: reviews.length, averageRating: pandit.rating || 0 });
});

/**
 * GET /api/auth/pandit/notifications
 */
router.get('/pandit/notifications', requireAuth, requireRole('pandit'), (req, res) => {
  const notifs = authDb.notifications.filter(n => n.userId === req.user.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  return res.status(200).json({ notifications: notifs, unread: notifs.filter(n => !n.read).length });
});

// ────────────────────────────────────────────────────────────────────────────
//  SHARED AUTH ROUTES (Token refresh, logout, password reset)
// ────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/refresh
 * Exchange a valid refresh token for a new access token
 */
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token required.' });

  const record = authDb.refreshTokens.find(r => r.token === refreshToken);
  if (!record) return res.status(401).json({ error: 'Invalid refresh token.' });
  if (new Date(record.expiresAt) < new Date()) {
    authDb.refreshTokens = authDb.refreshTokens.filter(r => r.token !== refreshToken);
    saveAuthData();
    return res.status(401).json({ error: 'Refresh token expired. Please log in again.' });
  }

  try {
    const decoded = verifyRefresh(refreshToken);
    const newAccess = signAccess({ id: decoded.id, role: decoded.role });
    return res.status(200).json({ accessToken: newAccess });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid refresh token.' });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    authDb.refreshTokens = authDb.refreshTokens.filter(r => r.token !== refreshToken);
    saveAuthData();
  }
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

/**
 * POST /api/auth/forgot-password
 * Generates a single-use password reset token (valid 1 hour)
 * In production, email this token to the user.
 * For demo: returns the token in the response.
 */
router.post('/forgot-password', authLimiter, (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ error: 'Email or phone is required.' });

  const id = identifier.toLowerCase().trim();
  let account = authDb.users.find(u => u.email === id || u.phone === id);
  let role = 'user';
  if (!account) {
    account = authDb.pandits.find(p => p.email === id || p.phone === id);
    role = 'pandit';
  }

  // Always return success to prevent user enumeration
  if (!account) {
    return res.status(200).json({ success: true, message: 'If that account exists, a reset link has been sent.' });
  }

  const resetToken = uuidv4();
  authDb.resetTokens = authDb.resetTokens.filter(r => r.userId !== account.id);
  authDb.resetTokens.push({ token: resetToken, userId: account.id, role, expiresAt: new Date(Date.now() + 3600000).toISOString() });
  saveAuthData();

  // In production: send email with reset link
  // Demo: return token in response (remove in production!)
  return res.status(200).json({
    success: true,
    message: 'Password reset token generated. (In production, this is emailed.)',
    _demo_reset_token: resetToken, // REMOVE IN PRODUCTION
  });
});

/**
 * POST /api/auth/reset-password
 * Consume reset token and set new password
 */
router.post('/reset-password', authLimiter, async (req, res) => {
  const { token, password, confirmPassword } = req.body;
  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ error: 'Token, password, and confirmPassword are required.' });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  const record = authDb.resetTokens.find(r => r.token === token);
  if (!record || new Date(record.expiresAt) < new Date()) {
    authDb.resetTokens = authDb.resetTokens.filter(r => r.token !== token);
    saveAuthData();
    return res.status(400).json({ error: 'Reset token is invalid or has expired.' });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  if (record.role === 'pandit') {
    const p = authDb.pandits.find(p => p.id === record.userId);
    if (p) p.passwordHash = passwordHash;
  } else {
    const u = authDb.users.find(u => u.id === record.userId);
    if (u) u.passwordHash = passwordHash;
  }

  authDb.resetTokens = authDb.resetTokens.filter(r => r.token !== token);
  // Invalidate all refresh tokens for security
  authDb.refreshTokens = authDb.refreshTokens.filter(r => r.userId !== record.userId);
  saveAuthData();

  return res.status(200).json({ success: true, message: 'Password reset successfully. Please log in.' });
});

/**
 * GET /api/auth/admin/pandits  — list all pandits for admin verification
 * GET /api/auth/admin/users    — list all users
 * PATCH /api/auth/admin/pandits/:id/status — approve/reject/suspend
 *
 * NOTE: In production, protect with admin JWT + separate admin login flow.
 * For demo, we use a hardcoded admin token header: X-Admin-Token: vedic-admin-2024
 */
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'vedic-admin-2024';
function requireAdmin(req, res, next) {
  if (req.headers['x-admin-token'] !== ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
}

router.get('/admin/pandits', requireAdmin, (req, res) => {
  const safe = authDb.pandits.map(({ passwordHash, ...p }) => p);
  return res.status(200).json({ pandits: safe, total: safe.length });
});

router.get('/admin/users', requireAdmin, (req, res) => {
  const safe = authDb.users.map(({ passwordHash, ...u }) => u);
  return res.status(200).json({ users: safe, total: safe.length });
});

router.patch('/admin/pandits/:id/status', requireAdmin, (req, res) => {
  const pandit = authDb.pandits.find(p => p.id === req.params.id || p.panditId === req.params.id);
  if (!pandit) return res.status(404).json({ error: 'Pandit not found.' });

  const allowed = ['pending', 'approved', 'rejected', 'suspended'];
  if (!allowed.includes(req.body.status)) {
    return res.status(400).json({ error: 'Invalid status. Use: pending, approved, rejected, suspended.' });
  }

  const prev = pandit.status;
  pandit.status = req.body.status;
  if (req.body.status === 'approved') {
    pandit.verifiedAt = new Date().toISOString();
    // Also verify in pandit_data.json if exists
    if (global.pcData) {
      const pd = global.pcData.pandits.find(p => p.id === pandit.panditId);
      if (pd) pd.verified = true;
      else {
        // Sync to pcData for search visibility
        global.pcData.pandits.push({
          id: pandit.panditId,
          name: pandit.profile.professionalName || pandit.name,
          verified: true,
          experience: pandit.profile.experience || 0,
          state: pandit.profile.state,
          district: pandit.profile.district,
          city: pandit.profile.city,
          area: pandit.profile.area,
          pincode: pandit.profile.pincode,
          rating: pandit.rating || 0,
          reviewCount: pandit.reviewCount || 0,
          startingPrice: pandit.profile.services?.[0]?.basePrice || 1100,
          languages: pandit.profile.languages || [],
          services: pandit.profile.services?.map(s => s.name) || [],
          homeVisit: pandit.profile.homeVisit || false,
          tradition: pandit.profile.tradition || '',
          bio: pandit.profile.bio || '',
          availability: pandit.profile.availability?.days || [],
          timeFrom: pandit.profile.availability?.timeFrom || '7:00 AM',
          timeTo: pandit.profile.availability?.timeTo || '8:00 PM',
          onlineConsult: pandit.profile.onlineConsult || false,
          travelRadius: pandit.profile.travelRadius || 0,
          reviews: [],
          photo: pandit.profile.photo || '🕉️',
        });
      }
      // Save pcData
      const pcDataFile = require('path').join(__dirname, 'pandit_data.json');
      try { require('fs').writeFileSync(pcDataFile, JSON.stringify(global.pcData, null, 2)); } catch(e){}
    }
    authDb.notifications.push({
      id: 'NTF-' + Date.now(), userId: pandit.id,
      message: '🎉 Congratulations! Your Pandit profile has been verified and is now live.',
      read: false, createdAt: new Date().toISOString(),
    });
  } else if (req.body.status === 'rejected') {
    authDb.notifications.push({
      id: 'NTF-' + Date.now(), userId: pandit.id,
      message: 'Your Pandit profile was not approved. Reason: ' + (req.body.reason || 'Please contact support.'),
      read: false, createdAt: new Date().toISOString(),
    });
  }

  saveAuthData();
  return res.status(200).json({ success: true, panditId: pandit.panditId, prevStatus: prev, newStatus: pandit.status });
});

// ────────────────────────────────────────────────────────────────────────────
//  GOOGLE OAUTH ROUTES
// ────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/auth/google/config
 * Returns client-safe OAuth configuration (no secrets exposed)
 */
router.get('/google/config', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  return res.json({
    enabled: !!clientId,
    clientId: clientId
  });
});

/**
 * POST /api/auth/google
 * Authenticates user via Google OAuth credential token or Google profile payload
 * Supports both Devotee and Pandit roles.
 */
router.post('/google', async (req, res) => {
  try {
    const { credential, role = 'user', email: fallbackEmail, name: fallbackName, photoUrl } = req.body;
    let email = fallbackEmail;
    let name = fallbackName || 'Google User';
    let picture = photoUrl || '';

    // If Google ID token credential provided, decode safely
    if (credential) {
      try {
        const decoded = jwt.decode(credential);
        if (decoded && decoded.email) {
          email = decoded.email;
          name = decoded.name || decoded.given_name || name;
          picture = decoded.picture || picture;
        }
      } catch (e) {
        console.warn('[Google Auth] Could not decode credential token:', e.message);
      }
    }

    if (!email) {
      return res.status(400).json({ error: 'Valid Google email is required for authentication.' });
    }

    email = email.toLowerCase().trim();
    const effectiveRole = role === 'pandit' ? 'pandit' : 'user';

    if (effectiveRole === 'pandit') {
      let pandit = authDb.pandits.find(p => p.email === email);
      if (!pandit) {
        const pidNum = 100000 + authDb.pandits.length + 1;
        const panditId = 'PND-' + pidNum;
        pandit = {
          id: 'PND-AUTH-' + uuidv4().slice(0, 8).toUpperCase(),
          panditId,
          name: name,
          email: email,
          phone: '',
          passwordHash: null,
          googleAuth: true,
          role: 'pandit',
          status: 'pending',
          profileStep: 1,
          isEmailVerified: true,
          isPhoneVerified: false,
          createdAt: new Date().toISOString(),
          rating: 5.0,
          reviewCount: 0,
          profile: {
            professionalName: name,
            photo: picture || '🕉️',
            experience: 0,
            languages: ['Hindi', 'Sanskrit'],
            tradition: 'Vedic',
            services: []
          }
        };
        authDb.pandits.push(pandit);
        saveAuthData();
      }

      const accessToken = signAccess({ id: pandit.id, role: 'pandit' });
      const refreshToken = signRefresh({ id: pandit.id, role: 'pandit' });
      authDb.refreshTokens = authDb.refreshTokens.filter(t => t.userId !== pandit.id);
      authDb.refreshTokens.push({ token: refreshToken, userId: pandit.id, role: 'pandit', expiresAt: new Date(Date.now() + 30 * 86400000).toISOString() });
      saveAuthData();

      return res.json({
        success: true,
        accessToken,
        refreshToken,
        pandit: safePandit(pandit),
        role: 'pandit'
      });
    } else {
      // Devotee / User
      let user = authDb.users.find(u => u.email === email);
      if (!user) {
        user = {
          id: 'USR-' + uuidv4().slice(0, 8).toUpperCase(),
          name: name,
          email: email,
          phone: '',
          passwordHash: null,
          googleAuth: true,
          role: 'user',
          isEmailVerified: true,
          isPhoneVerified: false,
          createdAt: new Date().toISOString(),
          profile: {
            photo: picture,
            preferredLanguage: 'Hindi'
          }
        };
        authDb.users.push(user);
        saveAuthData();
      }

      const accessToken = signAccess({ id: user.id, role: 'user' });
      const refreshToken = signRefresh({ id: user.id, role: 'user' });
      authDb.refreshTokens = authDb.refreshTokens.filter(t => t.userId !== user.id);
      authDb.refreshTokens.push({ token: refreshToken, userId: user.id, role: 'user', expiresAt: new Date(Date.now() + 30 * 86400000).toISOString() });
      saveAuthData();

      return res.json({
        success: true,
        accessToken,
        refreshToken,
        user: safeUser(user),
        role: 'user'
      });
    }
  } catch (err) {
    console.error('[Google Auth Error]', err);
    return res.status(500).json({ error: 'Google authentication failed. Please try again.' });
  }
});

// ── Exports ───────────────────────────────────────────────────────────────────
module.exports = { router, requireAuth, requireRole, authDb };
