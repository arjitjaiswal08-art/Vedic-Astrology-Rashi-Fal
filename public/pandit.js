/**
 * PanditConnect — Frontend Application Logic
 * Vedic Pandit Discovery & Puja Booking Platform
 * 
 * Architecture: localStorage-based data layer with Express API integration.
 * All writes go through /api/pandit/* endpoints (server.js).
 * Reads use in-memory + localStorage cache for performance.
 */

'use strict';

// ── Constants ────────────────────────────────────────────────────────────
const API_BASE = '/api/pandit';

const PUJA_SERVICES = [
  { id: 'griha-pravesh', name: 'Griha Pravesh Puja', icon: '🏠', desc: 'Auspicious house warming ceremony invoking positive energies into your new home.', duration: '2–3 hrs', basePrice: 2100, purpose: 'New home blessings' },
  { id: 'satyanarayan', name: 'Satyanarayan Katha', icon: '📖', desc: 'Devotional recitation of Bhagwat Katha of Lord Vishnu for prosperity and blessings.', duration: '3–4 hrs', basePrice: 1501, purpose: 'Prosperity & fulfillment' },
  { id: 'rudrabhishek', name: 'Rudrabhishek', icon: '🕉️', desc: 'Sacred abhishek of Shiva Linga with Vedic mantras for divine protection and peace.', duration: '2–3 hrs', basePrice: 2501, purpose: 'Shiva blessings & peace' },
  { id: 'ganesh-puja', name: 'Ganesh Puja', icon: '🐘', desc: 'Worship of Lord Ganesha to remove obstacles and ensure success in new endeavors.', duration: '1–2 hrs', basePrice: 1100, purpose: 'Obstacle removal & success' },
  { id: 'navgraha-shanti', name: 'Navgraha Shanti Puja', icon: '🪐', desc: 'Propitiation of nine planetary deities to harmonize cosmic influences on one\'s life.', duration: '3–4 hrs', basePrice: 3101, purpose: 'Planetary peace & harmony' },
  { id: 'vivah-puja', name: 'Vivah / Marriage Puja', icon: '💒', desc: 'Complete Vedic wedding ceremony with all sixteen rituals performed with Sanskrit mantras.', duration: '3–6 hrs', basePrice: 11000, purpose: 'Sacred union & family blessings' },
  { id: 'mundan-sanskar', name: 'Mundan Sanskar', icon: '✂️', desc: 'Traditional first hair-cutting ceremony for infants as per Vedic rites.', duration: '1–2 hrs', basePrice: 1501, purpose: 'Child wellness & longevity' },
  { id: 'namkaran', name: 'Namkaran Sanskar', icon: '🍼', desc: 'Baby naming ceremony performed according to Vedic horoscope and Nakshatra.', duration: '1–2 hrs', basePrice: 1100, purpose: 'Baby naming & blessings' },
  { id: 'vastu-shanti', name: 'Vastu Shanti Puja', icon: '🧭', desc: 'Vedic ritual to harmonize the five elements of a property and remove Vastu dosha.', duration: '2–4 hrs', basePrice: 3500, purpose: 'Property harmony & peace' },
  { id: 'shraddh', name: 'Shraddh / Pitru Puja', icon: '🙏', desc: 'Ancestral rites and Pind Daan for the peace of departed souls and removing Pitru Dosh.', duration: '2–4 hrs', basePrice: 1501, purpose: 'Ancestral peace & liberation' },
  { id: 'kali-puja', name: 'Kali Puja / Durga Saptashati', icon: '🔱', desc: 'Powerful worship of Goddess Kali or recitation of Durga Saptashati for protection.', duration: '3–5 hrs', basePrice: 3100, purpose: 'Divine protection & power' },
  { id: 'lakshmi-puja', name: 'Lakshmi Puja', icon: '🌸', desc: 'Worship of Goddess Lakshmi for wealth, abundance, and material well-being.', duration: '1–2 hrs', basePrice: 1100, purpose: 'Wealth & abundance' },
  { id: 'saraswati-puja', name: 'Saraswati Puja', icon: '📚', desc: 'Worship of Goddess Saraswati for knowledge, arts, wisdom, and academic success.', duration: '1–2 hrs', basePrice: 1100, purpose: 'Knowledge & learning' },
  { id: 'bhoomi-puja', name: 'Bhoomi Puja', icon: '🌍', desc: 'Ground-breaking ceremony before construction to seek earth goddess blessings.', duration: '1–2 hrs', basePrice: 2100, purpose: 'Construction blessings' },
  { id: 'annaprashan', name: 'Annaprashan Sanskar', icon: '🍚', desc: 'First solid food feeding ceremony for infants as a sacred Hindu rite of passage.', duration: '1–2 hrs', basePrice: 1101, purpose: 'Infant nourishment ceremony' },
  { id: 'sudha-shuddhi', name: 'Sudha Shuddhi Puja', icon: '🌿', desc: 'Purification ritual to cleanse negative energies from a home or property.', duration: '1–2 hrs', basePrice: 1500, purpose: 'Space purification' },
];

const DEMO_PANDITS = [
  {
    id: 'PND-100001',
    name: 'Pandit Ramchandra Sharma',
    photo: '🕉️',
    verified: true,
    experience: 25,
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    city: 'Varanasi',
    area: 'Assi Ghat',
    pincode: '221001',
    rating: 4.9,
    reviewCount: 142,
    startingPrice: 1100,
    languages: ['Hindi', 'Sanskrit', 'English'],
    services: ['Griha Pravesh Puja', 'Rudrabhishek', 'Satyanarayan Katha', 'Navgraha Shanti'],
    homeVisit: true,
    tradition: 'Shaiva (Shiva tradition)',
    bio: 'Kashi-trained Brahmin with 25+ years of experience in Shaiva tradition. Specializes in Rudrabhishek, Shivaratri Puja, and Navgraha Shanti. Taught by Shri Mahesh Shastri at the Kashi Vidyapith.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeFrom: '6:00 AM',
    timeTo: '8:00 PM',
    onlineConsult: true,
    travelRadius: 50,
    reviews: [
      { reviewer: 'Ankit Gupta', rating: 5, text: 'Excellent Rudrabhishek. Pandit ji performed with great devotion and explained every ritual. Highly recommended!', date: '2026-09-15' },
      { reviewer: 'Sunita Verma', rating: 5, text: 'We booked for Griha Pravesh. The ceremony was authentic and Pandit ji was very punctual and respectful.', date: '2026-10-01' },
      { reviewer: 'Ravi Shankar', rating: 4, text: 'Very knowledgeable. The Navgraha puja was performed perfectly. Only suggestion — bring an extra helper.', date: '2026-10-08' },
    ]
  },
  {
    id: 'PND-100002',
    name: 'Pandit Suresh Mishra',
    photo: '🪔',
    verified: true,
    experience: 18,
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    city: 'Prayagraj',
    area: 'Civil Lines',
    pincode: '211001',
    rating: 4.7,
    reviewCount: 87,
    startingPrice: 1500,
    languages: ['Hindi', 'Sanskrit'],
    services: ['Satyanarayan Katha', 'Vivah / Marriage Puja', 'Mundan Sanskar', 'Namkaran Sanskar'],
    homeVisit: true,
    tradition: 'Vaishnava (Vishnu tradition)',
    bio: 'Experienced Vaishnava pandit from Prayagraj specializing in family sanskars — Namkaran, Annaprashan, Mundan, and Vivah. 18 years of experience with deep knowledge of all 16 Samskaras.',
    availability: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
    timeFrom: '7:00 AM',
    timeTo: '7:00 PM',
    onlineConsult: false,
    travelRadius: 30,
    reviews: [
      { reviewer: 'Priya Singh', rating: 5, text: 'Our baby\'s Namkaran was beautiful! Pandit Suresh ji was very gentle and thorough.', date: '2026-09-20' },
      { reviewer: 'Manish Tiwari', rating: 4, text: 'Vivah puja was well-performed. Pandit ji is very experienced and knows all the mantras by heart.', date: '2026-08-30' },
    ]
  },
  {
    id: 'PND-100003',
    name: 'Pandit Narayana Iyer',
    photo: '🌺',
    verified: true,
    experience: 30,
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    area: 'Mylapore',
    pincode: '600004',
    rating: 4.8,
    reviewCount: 214,
    startingPrice: 2000,
    languages: ['Tamil', 'Sanskrit', 'English'],
    services: ['Rudrabhishek', 'Navgraha Shanti', 'Kali Puja / Durga Saptashati', 'Vastu Shanti Puja'],
    homeVisit: true,
    tradition: 'Smarta (all-tradition)',
    bio: 'Agama Shastra expert trained at Tiruvannamalai. 30 years of experience in South Indian temple traditions, Agamic puja vidhi, and Navgraha homam. Certified by Tamil Nadu Archakar Board.',
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'],
    timeFrom: '5:30 AM',
    timeTo: '9:00 PM',
    onlineConsult: true,
    travelRadius: 20,
    reviews: [
      { reviewer: 'Lakshmi Rajan', rating: 5, text: 'Pandit Narayana Iyer is simply the best. Our Navgraha Homam was majestic and properly performed.', date: '2026-10-05' },
      { reviewer: 'Venkat Subramanian', rating: 5, text: 'We have been booking him for Vastu Puja for 5 years. Always excellent.', date: '2026-09-28' },
    ]
  },
  {
    id: 'PND-100004',
    name: 'Pandit Bholanath Joshi',
    photo: '🔱',
    verified: true,
    experience: 12,
    state: 'Rajasthan',
    district: 'Jaipur',
    city: 'Jaipur',
    area: 'Mansarovar',
    pincode: '302020',
    rating: 4.6,
    reviewCount: 56,
    startingPrice: 1200,
    languages: ['Hindi', 'Rajasthani', 'Sanskrit'],
    services: ['Ganesh Puja', 'Lakshmi Puja', 'Griha Pravesh Puja', 'Bhoomi Puja'],
    homeVisit: true,
    tradition: 'Shakta (Devi tradition)',
    bio: 'Young, energetic Pandit with 12 years of dedicated study and practice. Specializes in Shakta tradition pujas. Very well-versed in explaining rituals to the family in simple Hindi.',
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    timeFrom: '7:00 AM',
    timeTo: '8:00 PM',
    onlineConsult: true,
    travelRadius: 40,
    reviews: [
      { reviewer: 'Rekha Sharma', rating: 5, text: 'Very knowledgeable and explains everything clearly. Our Ganesh Puja was wonderful.', date: '2026-10-10' },
      { reviewer: 'Sanjay Garg', rating: 4, text: 'Good experience overall. Would book again for our next event.', date: '2026-09-12' },
    ]
  },
  {
    id: 'PND-100005',
    name: 'Pandit Krishnadas Bhatt',
    photo: '🌸',
    verified: false,
    experience: 8,
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Pune',
    area: 'Kothrud',
    pincode: '411038',
    rating: 4.4,
    reviewCount: 28,
    startingPrice: 1000,
    languages: ['Marathi', 'Hindi', 'Sanskrit'],
    services: ['Satyanarayan Katha', 'Ganesh Puja', 'Shraddh / Pitru Puja'],
    homeVisit: true,
    tradition: 'Vaishnava (Vishnu tradition)',
    bio: 'Trained under Pune Brahmin Sangh. Proficient in Maharashtrian and pan-Indian puja traditions. 8 years of active service in and around Pune.',
    availability: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    timeFrom: '8:00 AM',
    timeTo: '6:00 PM',
    onlineConsult: false,
    travelRadius: 15,
    reviews: [
      { reviewer: 'Asha Kulkarni', rating: 4, text: 'Good Satyanarayan katha. The narration was very engaging. Came on time.', date: '2026-09-30' },
    ]
  },
];

// ── Application State ────────────────────────────────────────────────────
const PC = {
  pandits: [],
  filteredPandits: [],
  sortMode: 'rating',
  currentPanditId: null,
  currentUser: null, // { name, role:'user'|'pandit'|'admin', id }
  bookings: [],
  consultations: [],
  reviews: [],
  regStep: 1,
  regData: {},
  selectedServices: [],
  selectedAvailDays: [],
  reviewRating: 0,
  loginRole: 'user',
  bookingPanditId: null,
  priceMax: 5000,
};

// ── Storage Helpers ───────────────────────────────────────────────────────
function store(key, val) {
  try { localStorage.setItem('pc_' + key, JSON.stringify(val)); } catch(e){}
}
function retrieve(key, def = null) {
  try {
    const v = localStorage.getItem('pc_' + key);
    return v ? JSON.parse(v) : def;
  } catch(e){ return def; }
}

// ── Toast Notifications ───────────────────────────────────────────────────
function showToast(msg, type = 'info', duration = 3500) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-text">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ── Section Navigation ────────────────────────────────────────────────────
function showSection(id) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Update nav active states
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const navMap = {
    sectionSearch: 'navSearch',
    sectionPujaServices: 'navPujas',
    sectionAskPandit: 'navAsk',
    sectionUserDashboard: 'navDashboard',
  };
  if (navMap[id]) {
    document.getElementById(navMap[id])?.classList.add('active');
  }
}

// ── Modal Helpers ─────────────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
  document.body.style.overflow = '';
}
// Close modals on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── Price Range ───────────────────────────────────────────────────────────
function updatePriceLabel(val) {
  PC.priceMax = parseInt(val);
  document.getElementById('priceRangeLabel').textContent = parseInt(val).toLocaleString('en-IN');
  const input = document.getElementById('filterPrice');
  const pct = ((val - 500) / (50000 - 500)) * 100;
  input.style.background = `linear-gradient(to right, var(--saffron) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
}

// ── Use My Location ───────────────────────────────────────────────────────
function useMyLocation() {
  if (!navigator.geolocation) {
    showToast('Geolocation not supported by your browser.', 'error');
    return;
  }
  const btn = document.getElementById('btnUseLocation');
  btn.textContent = '📡 Locating...';
  btn.disabled = true;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      btn.textContent = '✅ Location Detected';
      btn.disabled = false;
      showToast('Location detected! Filtering nearby Pandits.', 'success');
      // With real geocoding, we would convert coords → city/pincode.
      // For now, show existing results sorted by availability.
      searchPandits();
    },
    (err) => {
      btn.textContent = '📍 Use My Location';
      btn.disabled = false;
      showToast('Could not detect location. Please select area manually.', 'warning');
    },
    { timeout: 8000 }
  );
}

// ── Search Pandits ────────────────────────────────────────────────────────
function searchPandits() {
  const pujaType   = document.getElementById('filterPujaType').value;
  const state      = document.getElementById('filterState').value;
  const city       = document.getElementById('filterCity').value.trim().toLowerCase();
  const pincode    = document.getElementById('filterPincode').value.trim();
  const language   = document.getElementById('filterLanguage').value;
  const minExp     = parseInt(document.getElementById('filterMinExp').value) || 0;
  const minRating  = parseFloat(document.getElementById('filterMinRating').value) || 0;
  const homeVisit  = document.getElementById('filterHomeVisit').value;
  const priceMax   = PC.priceMax;

  let results = PC.pandits.filter(p => {
    // Only show approved pandits in search
    if (!p.verified) return false;
    if (state && p.state !== state) return false;
    if (city && !p.city.toLowerCase().includes(city) && !p.area?.toLowerCase().includes(city) && !p.district?.toLowerCase().includes(city)) return false;
    if (pincode && p.pincode !== pincode) return false;
    if (language && !p.languages.includes(language)) return false;
    if (minExp && p.experience < minExp) return false;
    if (minRating && p.rating < minRating) return false;
    if (homeVisit === 'yes' && !p.homeVisit) return false;
    if (homeVisit === 'no' && p.homeVisit) return false;
    if (pujaType && !p.services.some(s => s.toLowerCase().includes(pujaType.toLowerCase()))) return false;
    if (priceMax < 50000 && p.startingPrice > priceMax) return false;
    return true;
  });

  PC.filteredPandits = results;
  sortAndRenderPandits();

  document.getElementById('searchResultsSection').style.display = 'block';
  document.getElementById('searchResultsSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearFilters() {
  ['filterPujaType','filterState','filterCity','filterPincode','filterLanguage','filterMinExp','filterMinRating','filterHomeVisit'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('filterPrice').value = 50000;
  updatePriceLabel(50000);
  document.getElementById('searchResultsSection').style.display = 'none';
}

function setSortMode(mode, btn) {
  PC.sortMode = mode;
  document.querySelectorAll('.sort-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  sortAndRenderPandits();
}

function sortAndRenderPandits() {
  let sorted = [...PC.filteredPandits];
  switch (PC.sortMode) {
    case 'rating':     sorted.sort((a, b) => b.rating - a.rating); break;
    case 'experience': sorted.sort((a, b) => b.experience - a.experience); break;
    case 'price_asc':  sorted.sort((a, b) => a.startingPrice - b.startingPrice); break;
    case 'price_desc': sorted.sort((a, b) => b.startingPrice - a.startingPrice); break;
  }
  document.getElementById('resultsCountNum').textContent = sorted.length;
  renderPanditCards(sorted, 'panditsGrid');
}

// ── Render Pandit Cards ───────────────────────────────────────────────────
function renderPanditCards(pandits, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!pandits.length) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-state-icon">🔍</div>
        <h3 class="empty-state-title">No Pandits Found</h3>
        <p class="empty-state-text">No verified Pandits match your search criteria in this area. Try expanding your search radius or changing the locality.</p>
        <button class="btn-hero-secondary" onclick="clearFilters()">Clear Filters</button>
      </div>`;
    return;
  }

  container.innerHTML = pandits.map(p => renderPanditCard(p)).join('');
}

function renderPanditCard(p) {
  const stars = renderStars(p.rating);
  const verifiedBadge = p.verified
    ? `<span class="badge badge-verified">✓ Verified</span>`
    : `<span class="badge badge-pending">⏳ Pending</span>`;
  const homeVisitBadge = p.homeVisit ? `<span class="badge badge-home-visit">🏠 Home Visit</span>` : '';
  const expBadge = `<span class="badge badge-experience">🏅 ${p.experience} yrs</span>`;

  const serviceTagsHtml = p.services.slice(0, 3).map(s =>
    `<span class="service-tag">${s}</span>`
  ).join('') + (p.services.length > 3 ? `<span class="service-tag">+${p.services.length - 3} more</span>` : '');

  const languages = p.languages.join(', ');

  return `
    <div class="pandit-card" onclick="viewPanditProfile('${p.id}')" role="article" aria-label="Pandit ${p.name}">
      <div class="pandit-card-header">
        <div class="pandit-avatar">${p.photo}</div>
        <div class="pandit-info">
          <div class="pandit-name">${p.name}</div>
          <div class="pandit-id">${p.id}</div>
          <div class="pandit-badges">
            ${verifiedBadge}
            ${expBadge}
            ${homeVisitBadge}
          </div>
        </div>
      </div>
      <div class="pandit-card-body">
        <div class="pandit-location">📍 ${p.area ? p.area + ', ' : ''}${p.city}, ${p.state}</div>
        <div class="pandit-rating-row">
          <div class="stars-display">${stars}<span class="rating-number">${p.rating.toFixed(1)}</span></div>
          <span class="review-count">(${p.reviewCount} reviews)</span>
          <div class="pandit-price">From <strong>₹${p.startingPrice.toLocaleString('en-IN')}</strong></div>
        </div>
        <div class="pandit-services-tags">${serviceTagsHtml}</div>
        <div class="pandit-languages">🗣️ ${languages}</div>
      </div>
      <div class="pandit-card-footer" onclick="event.stopPropagation()">
        <button class="btn-view-profile" onclick="viewPanditProfile('${p.id}')">View Profile</button>
        <button class="btn-book-now" onclick="openBookingModal('${p.id}')">Book Now</button>
      </div>
    </div>`;
}

function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      html += `<span class="star">★</span>`;
    } else if (rating >= i - 0.5) {
      html += `<span class="star">⭑</span>`;
    } else {
      html += `<span class="star empty">☆</span>`;
    }
  }
  return html;
}

// ── Pandit Profile Page ───────────────────────────────────────────────────
function viewPanditProfile(panditId) {
  const p = PC.pandits.find(x => x.id === panditId);
  if (!p) { showToast('Pandit not found.', 'error'); return; }
  PC.currentPanditId = panditId;

  const verifiedBadge = p.verified
    ? `<span class="badge badge-verified" style="font-size:0.82rem;padding:4px 12px;">✓ Verified Pandit</span>`
    : `<span class="badge badge-pending" style="font-size:0.82rem;padding:4px 12px;">⏳ Pending Verification</span>`;

  const servicesList = p.services.map(s =>
    `<span class="service-tag" style="font-size:0.82rem;padding:5px 12px;">${s}</span>`
  ).join('');

  const reviewsHtml = (p.reviews || []).map(r => `
    <div class="review-item">
      <div class="review-top">
        <div>
          <div class="reviewer-name">👤 ${r.reviewer}</div>
          <div class="stars-display" style="margin-top:3px;">${renderStars(r.rating)}</div>
        </div>
        <div class="review-date">${formatDate(r.date)}</div>
      </div>
      <p class="review-text">"${r.text}"</p>
    </div>`).join('') || `<div class="empty-state" style="padding:30px;">
      <div class="empty-state-icon">⭐</div>
      <p class="empty-state-text">No reviews yet. Be the first to book and review!</p>
    </div>`;

  const availHtml = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => {
    const avail = p.availability.includes(day);
    return `<div class="avail-day-chip ${avail ? '' : 'unavailable'}">${avail ? '✅' : '❌'} ${day}</div>`;
  }).join('');

  document.getElementById('profileContent').innerHTML = `
    <div class="profile-hero">
      <div class="profile-avatar-large">${p.photo}</div>
      <div class="profile-info-main">
        <div class="profile-name-row">
          <h1 class="profile-name">${p.name}</h1>
          <span class="profile-id-badge">${p.id}</span>
        </div>
        <div class="profile-meta-tags">
          ${verifiedBadge}
          <span class="badge badge-experience">🏅 ${p.experience} Years Experience</span>
          ${p.homeVisit ? '<span class="badge badge-home-visit">🏠 Home Visit Available</span>' : ''}
          ${p.onlineConsult ? '<span class="badge" style="background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.25);color:#34d399;">💻 Online Consultation</span>' : ''}
        </div>
        <div class="profile-rating-block">
          <div class="big-rating">${p.rating.toFixed(1)}★</div>
          <div>
            <div class="stars-display">${renderStars(p.rating)}</div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">${p.reviewCount} verified reviews</div>
          </div>
        </div>
        <div class="profile-stats-mini">
          <div class="profile-stat">
            <div class="profile-stat-num">${p.experience}</div>
            <div class="profile-stat-lbl">Years Exp.</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-num">${p.services.length}</div>
            <div class="profile-stat-lbl">Services</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-num">${p.reviewCount}</div>
            <div class="profile-stat-lbl">Reviews</div>
          </div>
        </div>
        <div class="profile-action-row" style="margin-top:20px;">
          <button class="btn-book-primary" onclick="openBookingModal('${p.id}')">🪔 Book for Puja</button>
          <button class="btn-ask-question" onclick="openAskModal('${p.id}')">💬 Ask a Question</button>
        </div>
      </div>
    </div>

    <!-- Location & Languages -->
    <div class="section-card">
      <div class="section-card-header"><h2 class="section-card-title">📍 Location & Details</h2></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;">
        <div>
          <div class="filter-label mb-4">Location</div>
          <div style="font-size:0.92rem;color:var(--text-soft);">${p.area ? p.area + ', ' : ''}${p.city}, ${p.district ? p.district + ', ' : ''}${p.state}</div>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-top:3px;">PIN: ${p.pincode}</div>
        </div>
        <div>
          <div class="filter-label mb-4">Languages</div>
          <div style="font-size:0.92rem;color:var(--text-soft);">${p.languages.join(', ')}</div>
        </div>
        <div>
          <div class="filter-label mb-4">Tradition</div>
          <div style="font-size:0.92rem;color:var(--text-soft);">${p.tradition}</div>
        </div>
        <div>
          <div class="filter-label mb-4">Service Radius</div>
          <div style="font-size:0.92rem;color:var(--text-soft);">${p.travelRadius ? 'Up to ' + p.travelRadius + ' km' : 'No travel'}</div>
        </div>
        <div>
          <div class="filter-label mb-4">Available Hours</div>
          <div style="font-size:0.92rem;color:var(--text-soft);">${p.timeFrom} – ${p.timeTo}</div>
        </div>
        <div>
          <div class="filter-label mb-4">Starting Price</div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--saffron-light);">₹${p.startingPrice.toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>

    <!-- Bio -->
    <div class="section-card">
      <div class="section-card-header"><h2 class="section-card-title">📖 About & Specialization</h2></div>
      <p class="profile-bio">${p.bio}</p>
    </div>

    <!-- Services -->
    <div class="section-card">
      <div class="section-card-header">
        <h2 class="section-card-title">🪔 Puja Services Offered</h2>
        <button class="btn-book-now" onclick="openBookingModal('${p.id}')">Book a Service</button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">${servicesList}</div>
    </div>

    <!-- Availability -->
    <div class="section-card">
      <div class="section-card-header"><h2 class="section-card-title">📅 Availability</h2></div>
      <div class="availability-grid">${availHtml}</div>
      <p style="margin-top:12px;font-size:0.82rem;color:var(--text-muted);">⏰ Available ${p.timeFrom} – ${p.timeTo}</p>
    </div>

    <!-- Reviews -->
    <div class="section-card">
      <div class="section-card-header">
        <h2 class="section-card-title">⭐ Customer Reviews (${p.reviewCount})</h2>
        <div class="big-rating" style="font-size:1.5rem;">${p.rating.toFixed(1)}★</div>
      </div>
      <div class="reviews-list">${reviewsHtml}</div>
    </div>
  `;

  showSection('sectionProfile');
}

// ── Booking Modal ─────────────────────────────────────────────────────────
function openBookingModal(panditId) {
  const p = PC.pandits.find(x => x.id === panditId);
  if (!p) return;
  PC.bookingPanditId = panditId;

  // Pandit strip
  document.getElementById('bookingPanditStrip').innerHTML = `
    <div style="font-size:2rem;">${p.photo}</div>
    <div>
      <div style="font-weight:700;color:var(--text-main);">${p.name}</div>
      <div style="font-size:0.78rem;color:var(--saffron-light);">${p.id}</div>
    </div>
    <div style="margin-left:auto;text-align:right;">
      <div style="font-size:1rem;font-weight:800;color:var(--saffron-light);">From ₹${p.startingPrice.toLocaleString('en-IN')}</div>
      <div style="font-size:0.76rem;color:var(--text-muted);">${p.rating}★ (${p.reviewCount} reviews)</div>
    </div>`;

  // Populate services dropdown
  const serviceSelect = document.getElementById('bookService');
  serviceSelect.innerHTML = p.services.map(s => {
    const svc = PUJA_SERVICES.find(ps => ps.name === s);
    return `<option value="${s}" data-price="${svc ? svc.basePrice : p.startingPrice}">${s}${svc ? ' – ₹' + svc.basePrice.toLocaleString('en-IN') : ''}</option>`;
  }).join('');

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('bookDate').min = tomorrow.toISOString().split('T')[0];
  document.getElementById('bookDate').value = '';

  updateBookingPrice();
  serviceSelect.addEventListener('change', updateBookingPrice);
  document.getElementById('bookPin')?.addEventListener('input', updateBookingPrice);
  openModal('bookingModal');
}

let currentPriceEstimate = null;

async function updateBookingPrice() {
  const serviceSelect = document.getElementById('bookService');
  const service = serviceSelect?.value;
  const pin = document.getElementById('bookPin')?.value || '';
  const priceContainer = document.getElementById('bookingPriceDetails');
  const btnPayText = document.getElementById('btnPayText');

  if (!service || !priceContainer) return;

  try {
    const res = await fetch('/api/payments/calculate-estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        panditId: PC.bookingPanditId,
        service,
        pincode: pin
      })
    });
    const data = await res.json();
    if (data.success && data.estimate) {
      currentPriceEstimate = data.estimate;
      const est = data.estimate;
      priceContainer.innerHTML = `
        <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
          <span>Puja Vidhi & Ritual Fee</span>
          <span style="font-weight:600;color:var(--text-main);">₹${est.serviceAmount.toLocaleString('en-IN')}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
          <span>Pandit Travel Allowance</span>
          <span style="color:${est.travelAmount > 0 ? 'var(--text-main)' : 'var(--cosmic-emerald)'};">
            ${est.travelAmount > 0 ? '₹' + est.travelAmount.toLocaleString('en-IN') : 'Included (Local Area)'}
          </span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
          <span>Platform Escrow Facilitation</span>
          <span style="color:var(--text-main);">₹${est.platformFee.toLocaleString('en-IN')}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span>GST (18%) on facilitation</span>
          <span style="color:var(--text-main);">₹${est.taxAmount.toLocaleString('en-IN')}</span>
        </div>
        <div style="display:flex;justify-content:space-between;border-top:1px dashed rgba(245,197,24,0.3);padding-top:8px;margin-top:6px;font-size:1.02rem;font-weight:800;color:var(--gold-primary);">
          <span>Total Upfront Amount</span>
          <span>₹${est.totalAmount.toLocaleString('en-IN')}</span>
        </div>
      `;
      if (btnPayText) {
        btnPayText.textContent = `Pay ₹${est.totalAmount.toLocaleString('en-IN')} with Razorpay`;
      }
    }
  } catch (e) {
    const opt = serviceSelect.options[serviceSelect.selectedIndex];
    const base = parseInt(opt?.dataset.price) || 2100;
    const total = base + 49 + Math.round(49 * 0.18);
    priceContainer.innerHTML = `
      <div style="display:flex;justify-content:space-between;"><span>Service fee</span><span>₹${base.toLocaleString('en-IN')}</span></div>
      <div style="display:flex;justify-content:space-between;"><span>Platform & Taxes</span><span>₹58</span></div>
      <div style="display:flex;justify-content:space-between;border-top:1px dashed rgba(245,197,24,0.3);margin-top:6px;padding-top:6px;font-weight:800;color:var(--gold-primary);"><span>Total Amount</span><span>₹${total.toLocaleString('en-IN')}</span></div>
    `;
    if (btnPayText) btnPayText.textContent = `Pay ₹${total.toLocaleString('en-IN')} with Razorpay`;
  }
}

async function submitBooking(e) {
  e.preventDefault();
  const pandit = PC.pandits.find(x => x.id === PC.bookingPanditId);
  const service = document.getElementById('bookService').value;
  const date    = document.getElementById('bookDate').value;
  const time    = document.getElementById('bookTime').value;
  const address = document.getElementById('bookAddress').value;
  const pin     = document.getElementById('bookPin').value;
  const contact = document.getElementById('bookContact').value;
  const attendees = document.getElementById('bookAttendees')?.value || 10;
  const samagri = document.getElementById('bookSamagri')?.value || 'pandit';
  const instructions = document.getElementById('bookInstructions')?.value || '';

  if (!service || !date || !time || !address || !pin || !contact) {
    showToast('Please fill all required fields.', 'error');
    return;
  }

  const btnPay = document.getElementById('btnPayRazorpay');
  const originalBtnHTML = btnPay.innerHTML;
  btnPay.disabled = true;
  btnPay.innerHTML = '<span>⏳</span> Initializing Razorpay Checkout...';

  try {
    // 1. Create order on backend (Server calculates price and locks 15-min reservation)
    const orderRes = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        panditId: PC.bookingPanditId,
        service,
        date,
        time,
        address,
        pin,
        contact,
        contactName: PC.currentUser?.name || 'Devotee',
        attendees,
        samagri,
        instructions,
        userId: PC.currentUser?.id || 'guest'
      })
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      throw new Error(orderData.error || 'Failed to initialize payment order.');
    }

    // Show temporary reservation notice
    const resNotice = document.getElementById('slotReservationNotice');
    if (resNotice) resNotice.style.display = 'flex';

    // 2. Open Razorpay Standard Checkout
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'PanditConnect • Vedic Astrology',
      description: `${service} • ${pandit?.name}`,
      image: 'https://cdn-icons-png.flaticon.com/512/5778/5778443.png',
      order_id: orderData.orderId,
      prefill: {
        name: orderData.user?.name || PC.currentUser?.name || 'Devotee',
        contact: orderData.user?.contact || contact || '',
        email: PC.currentUser?.email || ''
      },
      notes: {
        bookingId: orderData.bookingId,
        panditId: PC.bookingPanditId,
        service
      },
      theme: {
        color: '#F5C518'
      },
      modal: {
        ondismiss: function() {
          btnPay.disabled = false;
          btnPay.innerHTML = originalBtnHTML;
          showToast('⚠️ Payment window closed. You have 15 minutes to complete payment before the slot reservation expires.', 'info', 6000);
        }
      },
      handler: async function(razorpayResp) {
        btnPay.innerHTML = '<span>⏳</span> Verifying payment with banking network...';
        try {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: razorpayResp.razorpay_order_id,
              razorpay_payment_id: razorpayResp.razorpay_payment_id,
              razorpay_signature: razorpayResp.razorpay_signature,
              bookingId: orderData.bookingId,
              paymentId: orderData.paymentId,
              userId: PC.currentUser?.id || 'guest'
            })
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            throw new Error(verifyData.error || 'Payment verification failed');
          }

          // Update local bookings state
          if (verifyData.booking) {
            PC.bookings = PC.bookings.filter(b => b.id !== verifyData.booking.id);
            PC.bookings.unshift(verifyData.booking);
            store('bookings', PC.bookings);
          }

          closeModal('bookingModal');
          document.getElementById('bookingForm').reset();
          if (resNotice) resNotice.style.display = 'none';

          showToast(`🎉 Payment verified! Booking ${verifyData.booking.public_booking_reference || verifyData.booking.id} is CONFIRMED!`, 'success', 6000);
          refreshUserDashboard();

          // Open official receipt modal
          if (verifyData.payment?.id) {
            setTimeout(() => viewReceipt(verifyData.payment.id), 500);
          }
        } catch (err) {
          showToast('❌ Payment verification error: ' + err.message, 'error', 7000);
          btnPay.disabled = false;
          btnPay.innerHTML = originalBtnHTML;
        }
      }
    };

    // If Razorpay SDK is available, open checkout modal
    if (typeof Razorpay !== 'undefined') {
      const rzpInstance = new Razorpay(options);
      rzpInstance.on('payment.failed', function(resp) {
        showToast('❌ Payment failed: ' + (resp.error.description || 'Transaction declined by bank'), 'error', 6000);
        btnPay.disabled = false;
        btnPay.innerHTML = originalBtnHTML;
      });
      rzpInstance.open();
    } else {
      simulateDeveloperCheckout(orderData, options);
    }

  } catch (err) {
    showToast('❌ ' + err.message, 'error', 6000);
    btnPay.disabled = false;
    btnPay.innerHTML = originalBtnHTML;
  }
}

/**
 * Developer / Offline Sandbox Checkout Simulator
 * Activated when Razorpay external checkout script is offline or in simulated test environment
 */
function simulateDeveloperCheckout(orderData, options) {
  const simulatePaymentId = 'pay_sim_' + Date.now();
  // Call server verification with simulated payload
  const secret = 'vedic_secret_key_change_in_prod';
  // If in browser without secret, we can invoke test callback
  fetch('/api/payments/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: orderData.orderId,
      razorpay_payment_id: simulatePaymentId,
      razorpay_signature: 'test_mode_simulation',
      bookingId: orderData.bookingId,
      paymentId: orderData.paymentId,
      userId: PC.currentUser?.id || 'guest'
    })
  }).then(r => r.json()).then(data => {
    if (options.handler) {
      options.handler({
        razorpay_order_id: orderData.orderId,
        razorpay_payment_id: simulatePaymentId,
        razorpay_signature: 'test_mode_simulation'
      });
    }
  }).catch(() => {
    showToast('Please check internet connection to load Razorpay checkout.', 'error');
  });
}

// ── Ask / Consultation Modal ──────────────────────────────────────────────
function openAskModal(panditId) {
  const p = PC.pandits.find(x => x.id === panditId);
  if (!p) return;
  PC.bookingPanditId = panditId;

  document.getElementById('askModalPanditStrip').innerHTML = `
    <div style="font-size:2rem;">${p.photo}</div>
    <div>
      <div style="font-weight:700;color:var(--text-main);">Asking: ${p.name}</div>
      <div style="font-size:0.78rem;color:var(--cosmic-purple);">${p.id} • ${p.tradition}</div>
    </div>`;

  openModal('askModal');
}

function submitAskQuestion(e) {
  e.preventDefault();
  const name = document.getElementById('askModalName').value;
  const q    = document.getElementById('askModalQ').value;
  if (!name || !q) { showToast('Please complete all fields.', 'error'); return; }

  const consult = {
    id: 'CST-' + Date.now(),
    panditId: PC.bookingPanditId,
    panditName: PC.pandits.find(x => x.id === PC.bookingPanditId)?.name,
    name, question: q,
    status: 'pending',
    answer: null,
    createdAt: new Date().toISOString(),
  };
  PC.consultations.push(consult);
  store('consultations', PC.consultations);

  closeModal('askModal');
  showToast('Your question has been sent! You will be notified when the Pandit responds.', 'success');
  document.getElementById('askModalName').value = '';
  document.getElementById('askModalQ').value = '';
  renderConsultationsList();
}

// ── Consultation Form (Ask a Pandit page) ────────────────────────────────
function submitConsultation(e) {
  e.preventDefault();
  const name = document.getElementById('askName').value;
  const contact = document.getElementById('askPhone').value;
  const q = document.getElementById('askQuestion').value;
  const panditId = document.getElementById('askPanditSelect').value;
  const category = document.getElementById('askCategory').value;

  if (!name || !contact || !q) {
    showToast('Please fill all required fields.', 'error');
    return;
  }

  const consult = {
    id: 'CST-' + Date.now(),
    panditId: panditId || null,
    panditName: panditId ? PC.pandits.find(x => x.id === panditId)?.name : 'Any Available Pandit',
    name, contact, question: q, category,
    status: 'pending',
    answer: null,
    createdAt: new Date().toISOString(),
  };
  PC.consultations.push(consult);
  store('consultations', PC.consultations);

  showToast('Your question has been submitted. A Pandit will respond soon.', 'success');
  document.getElementById('askForm').reset();
  renderConsultationsList();
}

function renderConsultationsList() {
  const container = document.getElementById('consultationsList');
  if (!container) return;
  if (!PC.consultations.length) {
    container.innerHTML = `<div class="empty-state" style="padding:30px;"><div class="empty-state-icon">💬</div><p class="empty-state-text">No questions submitted yet.</p></div>`;
    return;
  }
  container.innerHTML = PC.consultations.slice().reverse().map(c => `
    <div class="consultation-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
        <div>
          <span style="font-weight:700;color:var(--text-main);">${c.name}</span>
          <span style="margin:0 8px;color:var(--text-dim);">→</span>
          <span style="color:var(--cosmic-purple);">${c.panditName || 'Any Pandit'}</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span class="status-badge ${c.answer ? 'status-completed' : 'status-pending'}">${c.answer ? '✅ Answered' : '⏳ Awaiting Response'}</span>
          <span style="font-size:0.75rem;color:var(--text-dim);">${formatDate(c.createdAt)}</span>
        </div>
      </div>
      <div style="font-size:0.88rem;color:var(--text-soft);margin-bottom:${c.answer ? '10px' : '0'};">❓ ${c.question}</div>
      ${c.answer ? `
        <div style="background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.15);border-radius:var(--radius-sm);padding:12px;margin-top:8px;">
          <div style="font-size:0.76rem;font-weight:600;color:var(--cosmic-emerald);margin-bottom:6px;">🙏 Pandit's Response:</div>
          <div style="font-size:0.88rem;color:var(--text-soft);">${c.answer}</div>
        </div>` : ''}
    </div>`).join('');
}

// ── Registration Multi-Step ───────────────────────────────────────────────
function gotoRegStep(step) {
  PC.regStep = step;
  for (let i = 1; i <= 5; i++) {
    const stepEl = document.getElementById(`regStep${i}`);
    const stepItem = document.getElementById(`step${i}Item`);
    if (stepEl) stepEl.classList.toggle('active', i === step);
    if (stepItem) {
      stepItem.classList.toggle('active', i === step);
      stepItem.classList.toggle('done', i < step);
    }
    if (i < 5) {
      const connector = document.getElementById(`step${i}Con`);
      if (connector) connector.classList.toggle('done', i < step);
    }
  }

  if (step === 5) showRegSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function regStep1Next() {
  const phone = document.getElementById('regPhone').value.trim();
  const pass  = document.getElementById('regPassword').value;
  const conf  = document.getElementById('regConfirmPass').value;

  if (!phone || phone.length < 10) {
    showToast('Please enter a valid phone number.', 'error');
    document.getElementById('regPhone').classList.add('invalid');
    return;
  }
  if (pass.length < 8) {
    showToast('Password must be at least 8 characters.', 'error');
    return;
  }
  if (pass !== conf) {
    showToast('Passwords do not match.', 'error');
    return;
  }

  PC.regData.phone = phone;
  PC.regData.email = document.getElementById('regEmail').value;
  // OTP is simulated – show section but mark verified for demo
  document.getElementById('otpSection').style.display = 'block';
  showToast('📱 Demo Mode: OTP sent! Use any 6 digits to proceed.', 'info');
  gotoRegStep(2); // In production: wait for OTP verify
}

function regStep2Next() {
  const name = document.getElementById('regFullName').value.trim();
  const dob  = document.getElementById('regDOB').value;
  const exp  = document.getElementById('regExperience').value;
  const bio  = document.getElementById('regBio').value.trim();
  const langs = document.getElementById('regLanguages').value.trim();

  if (!name || !dob || !exp || !bio || !langs) {
    showToast('Please fill all required fields.', 'error');
    return;
  }
  PC.regData.name = name;
  PC.regData.dob  = dob;
  PC.regData.experience = parseInt(exp);
  PC.regData.bio  = bio;
  PC.regData.languages = langs.split(',').map(l => l.trim()).filter(Boolean);
  PC.regData.tradition  = document.getElementById('regVedicTradition').value;
  gotoRegStep(3);
}

function showRegSummary() {
  const summary = document.getElementById('regSummaryPreview');
  const content = document.getElementById('regSummaryContent');
  const selServices = Array.from(document.querySelectorAll('.service-checkbox:checked')).map(cb => cb.value);
  const selDays = PC.selectedAvailDays;

  content.innerHTML = `
    <b>Name:</b> ${PC.regData.name || '—'} &nbsp;|&nbsp; <b>Experience:</b> ${PC.regData.experience || 0} Years<br>
    <b>Phone:</b> ${PC.regData.phone || '—'} &nbsp;|&nbsp; <b>Tradition:</b> ${PC.regData.tradition || '—'}<br>
    <b>Languages:</b> ${(PC.regData.languages || []).join(', ')}<br>
    <b>Location:</b> ${document.getElementById('regCity')?.value || '—'}, ${document.getElementById('regState')?.value || '—'} – ${document.getElementById('regPincode')?.value || '—'}<br>
    <b>Home Visit:</b> ${document.getElementById('regHomeVisit')?.value === 'yes' ? 'Yes' : 'No'} &nbsp;|&nbsp; <b>Travel Radius:</b> ${document.getElementById('regTravelRadius')?.value || 0} km<br>
    <b>Starting Price:</b> ₹${document.getElementById('regStartingPrice')?.value || '—'}<br>
    <b>Services:</b> ${selServices.length ? selServices.join(', ') : '—'}<br>
    <b>Available Days:</b> ${selDays.length ? selDays.join(', ') : '—'}<br>
    <b>Hours:</b> ${document.getElementById('regTimeFrom')?.value || '—'} – ${document.getElementById('regTimeTo')?.value || '—'}`;
  summary.style.display = 'block';
}

function submitPanditRegistration(e) {
  e.preventDefault();
  const selServices = Array.from(document.querySelectorAll('.service-checkbox:checked')).map(cb => cb.value);
  const startingPrice = parseInt(document.getElementById('regStartingPrice').value);
  const city    = document.getElementById('regCity').value.trim();
  const state   = document.getElementById('regState').value;
  const pincode = document.getElementById('regPincode').value.trim();

  if (!city || !state || !pincode) {
    showToast('Please complete location details.', 'error');
    return;
  }
  if (!startingPrice || startingPrice < 100) {
    showToast('Please enter a valid starting price.', 'error');
    return;
  }

  const panditId = 'PND-' + (100010 + PC.pandits.length);
  const newPandit = {
    id: panditId,
    name: PC.regData.name || 'Pandit',
    photo: '🕉️',
    verified: false, // Pending admin approval
    experience: PC.regData.experience || 0,
    state, city,
    district: document.getElementById('regDistrict').value,
    area: document.getElementById('regArea').value,
    pincode,
    rating: 0,
    reviewCount: 0,
    startingPrice,
    languages: PC.regData.languages || ['Hindi'],
    services: selServices.length ? selServices : ['Ganesh Puja'],
    homeVisit: document.getElementById('regHomeVisit').value === 'yes',
    tradition: PC.regData.tradition || '',
    bio: PC.regData.bio || '',
    availability: PC.selectedAvailDays,
    timeFrom: document.getElementById('regTimeFrom').value,
    timeTo: document.getElementById('regTimeTo').value,
    onlineConsult: document.getElementById('regOnlineConsult').value === 'yes',
    travelRadius: parseInt(document.getElementById('regTravelRadius').value) || 0,
    reviews: [],
    phone: PC.regData.phone,
    email: PC.regData.email,
  };

  PC.pandits.push(newPandit);
  store('pandits', PC.pandits);

  // Register to API
  fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPandit)
  }).catch(() => {});

  // Auto-login as pandit
  PC.currentUser = { name: newPandit.name, role: 'pandit', id: panditId };
  store('currentUser', PC.currentUser);
  updateNavForUser();

  showToast(`🎉 Registration successful! Your Pandit ID is ${panditId}. Your profile is pending admin verification.`, 'success', 7000);

  // Show Pandit dashboard
  setTimeout(() => {
    initPanditDashboard(newPandit);
    showSection('sectionPanditDashboard');
  }, 1500);
}

// ── Availability Days Checkboxes ──────────────────────────────────────────
function initAvailDaysGrid() {
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const container = document.getElementById('availDaysGrid');
  if (!container) return;
  container.innerHTML = days.map(day => `
    <label style="cursor:pointer;display:flex;align-items:center;gap:8px;padding:10px 16px;background:rgba(255,107,0,0.06);border:1px solid rgba(255,107,0,0.2);border-radius:var(--radius-sm);transition:var(--transition);">
      <input type="checkbox" class="avail-day-check" value="${day}" onchange="updateSelectedDays()" style="accent-color:var(--saffron);" />
      <span style="font-size:0.88rem;color:var(--text-soft);">${day}</span>
    </label>`).join('');
}

function updateSelectedDays() {
  PC.selectedAvailDays = Array.from(document.querySelectorAll('.avail-day-check:checked')).map(cb => cb.value);
}

// ── Service Checkboxes ────────────────────────────────────────────────────
function initServiceCheckboxGrid() {
  const container = document.getElementById('serviceCheckboxGrid');
  if (!container) return;
  container.innerHTML = PUJA_SERVICES.map(s => `
    <label style="cursor:pointer;display:flex;align-items:center;gap:10px;padding:12px 14px;background:rgba(16,22,46,0.8);border:1px solid rgba(255,255,255,0.06);border-radius:var(--radius-sm);transition:var(--transition);" class="svc-label">
      <input type="checkbox" class="service-checkbox" value="${s.name}" style="accent-color:var(--saffron);" />
      <span style="font-size:1.2rem;">${s.icon}</span>
      <div>
        <div style="font-size:0.84rem;font-weight:600;color:var(--text-main);">${s.name}</div>
        <div style="font-size:0.72rem;color:var(--text-muted);">From ₹${s.basePrice.toLocaleString('en-IN')}</div>
      </div>
    </label>`).join('');

  // Highlight on check
  container.addEventListener('change', (e) => {
    if (e.target.classList.contains('service-checkbox')) {
      const label = e.target.closest('label');
      label.style.borderColor = e.target.checked ? 'rgba(255,107,0,0.4)' : 'rgba(255,255,255,0.06)';
      label.style.background  = e.target.checked ? 'rgba(255,107,0,0.08)' : 'rgba(16,22,46,0.8)';
    }
  });
}

// ── OTP Input Helpers ─────────────────────────────────────────────────────
function otpNext(el, nextId) {
  if (el.value.length === 1 && nextId) {
    document.getElementById(nextId)?.focus();
  }
}
function otpBack(e, el, prevId) {
  if (e.key === 'Backspace' && !el.value && prevId) {
    document.getElementById(prevId)?.focus();
  }
}
function sendOTP() {
  showToast('Demo Mode: OTP resent! Use any 6 digits.', 'info');
}

// ── Puja Services Catalogue Page ──────────────────────────────────────────
function renderAllServices() {
  const container = document.getElementById('allServicesGrid');
  if (!container) return;
  container.innerHTML = PUJA_SERVICES.map(s => `
    <div class="service-card">
      <div class="service-icon">${s.icon}</div>
      <div class="service-name">${s.name}</div>
      <div class="service-desc">${s.desc}</div>
      <div class="service-meta-row">
        <div class="service-duration">⏱️ ${s.duration}</div>
        <div class="service-price-tag">₹${s.basePrice.toLocaleString('en-IN')}+</div>
      </div>
      <div style="font-size:0.78rem;color:var(--text-dim);margin-bottom:12px;">🎯 ${s.purpose}</div>
      <div class="service-features">
        <span class="feature-chip home">🏠 Home Visit</span>
        <span class="feature-chip online">💻 Online Consult</span>
        <span class="feature-chip samagri">📦 Samagri Available</span>
      </div>
      <button class="btn-book-service" onclick="showSection('sectionSearch');setTimeout(()=>document.getElementById('filterPujaType').value='${s.name}',100)">
        🔍 Find Pandits for this Puja
      </button>
    </div>`).join('');
}

// ── Home Puja Categories ──────────────────────────────────────────────────
function renderHomePujaGrid() {
  const container = document.getElementById('homePujaGrid');
  if (!container) return;
  const featured = PUJA_SERVICES.slice(0, 8);
  container.innerHTML = featured.map(s => `
    <div class="puja-category-card" onclick="document.getElementById('filterPujaType').value='${s.name}';searchPandits();showSection('sectionSearch')">
      <div class="puja-category-icon">${s.icon}</div>
      <div class="puja-category-name">${s.name}</div>
      <div class="puja-category-count">${s.duration}</div>
    </div>`).join('');
}

// ── User Dashboard ────────────────────────────────────────────────────────
function refreshUserDashboard() {
  const userBookings = PC.bookings.filter(b => b.userId === (PC.currentUser?.id || 'guest'));
  document.getElementById('userTotalBookings').textContent     = userBookings.length;
  document.getElementById('userPendingBookings').textContent   = userBookings.filter(b => b.status === 'pending').length;
  document.getElementById('userConfirmedBookings').textContent = userBookings.filter(b => ['accepted','confirmed'].includes(b.status)).length;
  document.getElementById('userCompletedBookings').textContent = userBookings.filter(b => b.status === 'completed').length;

  setDashTab('bookings', document.querySelector('.sidebar-nav-item'));
}

function setDashTab(tab, btn) {
  document.querySelectorAll('.sidebar-nav-item').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const container = document.getElementById('dashTabContent');
  const userBookings = PC.bookings.filter(b => b.userId === (PC.currentUser?.id || 'guest'));

  switch (tab) {
    case 'bookings':
      container.innerHTML = `
        <div class="section-card-header"><h2 class="section-card-title">📋 My Bookings</h2></div>
        ${userBookings.length ? `<div style="overflow-x:auto;"><table class="bookings-table">
          <thead><tr>
            <th>Booking ID / Ref</th><th>Pandit</th><th>Service</th><th>Date</th><th>Booking Status</th><th>Payment</th><th>Action</th>
          </tr></thead>
          <tbody>
            ${userBookings.map(b => `
              <tr>
                <td style="font-family:monospace;font-size:0.8rem;color:var(--saffron-light);">
                  ${b.public_booking_reference || b.id}
                </td>
                <td>${b.pandit_name || b.panditName || '—'}</td>
                <td>${b.service}</td>
                <td>${formatDate(b.date)}</td>
                <td><span class="status-badge status-${b.booking_status || b.status}">${statusLabel(b.booking_status || b.status)}</span></td>
                <td>
                  <span class="status-badge ${['Paid','paid'].includes(b.payment_status) ? 'status-confirmed' : 'status-pending'}">
                    ${b.payment_status === 'Paid' ? '✅ Paid (Escrow)' : (b.payment_status || 'Pending')}
                  </span>
                </td>
                <td style="display:flex;gap:6px;flex-wrap:wrap;">
                  ${['Paid','paid'].includes(b.payment_status) ? `<button class="admin-action-btn" style="background:rgba(245,197,24,0.12);color:var(--gold-primary);border-color:rgba(245,197,24,0.3);" onclick="viewReceiptByBooking('${b.id}')">🧾 Receipt</button>` : ''}
                  ${b.status === 'completed' && !hasReview(b.id) ? `<button class="admin-action-btn admin-approve" onclick="openReviewForBooking('${b.id}','${b.panditId}')">⭐ Review</button>` : ''}
                  ${['pending','confirmed','accepted','Confirmed'].includes(b.booking_status || b.status) ? `<button class="admin-action-btn" style="background:rgba(251,113,133,0.1);border-color:rgba(251,113,133,0.25);color:var(--cosmic-crimson);" onclick="requestRefund('${b.id}', ${b.total_amount || 2158})">Cancel & Refund</button>` : ''}
                </td>
              </tr>`).join('')}
          </tbody>
        </table></div>` : `<div class="empty-state"><div class="empty-state-icon">📋</div><h3 class="empty-state-title">No Bookings Yet</h3><p class="empty-state-text">Start by finding a verified Pandit for your puja.</p><button class="btn-hero-secondary" onclick="showSection('sectionSearch')">Find a Pandit</button></div>`}`;
      break;

    case 'payments':
      container.innerHTML = `
        <div class="section-card-header" style="display:flex;justify-content:space-between;align-items:center;">
          <h2 class="section-card-title">💳 Payments & Upfront Escrow Transactions</h2>
          <span style="font-size:0.78rem;padding:4px 10px;border-radius:var(--radius-full);background:rgba(52,211,153,0.12);color:var(--cosmic-emerald);border:1px solid rgba(52,211,153,0.3);">
            🔒 Razorpay Standard Checkout
          </span>
        </div>
        <div style="background:rgba(10,14,34,0.6);border:1px solid rgba(255,255,255,0.06);border-radius:var(--radius-md);padding:14px;margin-bottom:18px;font-size:0.82rem;color:var(--text-muted);line-height:1.6;">
          <strong style="color:var(--gold-primary);">🛡️ PanditConnect Upfront Escrow Assurance:</strong>
          Every booking is 100% pre-paid via Razorpay. Your funds are secured in platform escrow and only released after your ceremony is completed. You are eligible for a 100% full refund upon cancellation 24+ hours in advance.
        </div>
        <div id="paymentsTabTableWrap">
          <div style="text-align:center;padding:30px;color:var(--text-muted);">⏳ Loading transactions...</div>
        </div>
      `;
      loadUserTransactions();
      break;

    case 'consultations':
      container.innerHTML = `<div class="section-card-header"><h2 class="section-card-title">💬 My Consultations</h2></div>`;
      renderConsultationsList();
      container.appendChild(document.getElementById('consultationsList') || document.createElement('div'));
      break;
    case 'favourites':
      container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">❤️</div><h3 class="empty-state-title">No Saved Pandits</h3><p class="empty-state-text">Save your favourite Pandits for quick access.</p><button class="btn-hero-secondary" onclick="showSection('sectionSearch')">Browse Pandits</button></div>`;
      break;
    case 'reviews':
      const reviews = PC.reviews.filter(r => r.userId === (PC.currentUser?.id || 'guest'));
      container.innerHTML = reviews.length
        ? reviews.map(r => `<div class="review-item"><div class="review-top"><div class="reviewer-name">You → ${PC.pandits.find(p=>p.id===r.panditId)?.name || r.panditId}</div><div class="review-date">${formatDate(r.date)}</div></div><div class="stars-display">${renderStars(r.rating)}</div><p class="review-text">${r.text}</p></div>`).join('')
        : `<div class="empty-state"><div class="empty-state-icon">⭐</div><p class="empty-state-text">Your verified reviews will appear here after completed bookings.</p></div>`;
      break;
    case 'profile':
      container.innerHTML = `<div class="section-card-header"><h2 class="section-card-title">👤 My Profile</h2></div>
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Name</label><input class="form-input" value="${PC.currentUser?.name || 'Devotee'}" readonly/></div>
          <div class="form-group"><label class="form-label">Role</label><input class="form-input" value="User / Devotee" readonly/></div>
        </div>`;
      break;
  }
}

async function loadUserTransactions() {
  const wrap = document.getElementById('paymentsTabTableWrap');
  if (!wrap) return;

  try {
    const res = await fetch(`/api/payments/user-transactions?userId=${encodeURIComponent(PC.currentUser?.id || 'guest')}`);
    const data = await res.json();
    if (!res.ok || !data.transactions || !data.transactions.length) {
      wrap.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">💳</div>
          <h3 class="empty-state-title">No Payment Transactions Yet</h3>
          <p class="empty-state-text">When you book a Pandit and complete upfront payment, your official Razorpay receipts and transaction history will appear here.</p>
          <button class="btn-hero-secondary" onclick="showSection('sectionSearch')">Find a Pandit</button>
        </div>
      `;
      return;
    }

    wrap.innerHTML = `
      <div style="overflow-x:auto;">
        <table class="bookings-table">
          <thead>
            <tr>
              <th>Booking Ref</th>
              <th>Puja Service</th>
              <th>Pandit</th>
              <th>Date</th>
              <th>Amount Paid</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${data.transactions.map(t => `
              <tr>
                <td style="font-family:monospace;font-size:0.8rem;color:var(--saffron-light);">
                  ${t.bookingReference || t.bookingId}
                </td>
                <td style="font-weight:600;color:var(--text-main);">${t.service}</td>
                <td>${t.panditName}</td>
                <td>${t.appointmentDate ? formatDate(t.appointmentDate) : '—'}</td>
                <td style="font-weight:700;color:var(--gold-primary);">₹${(t.amount || 0).toLocaleString('en-IN')}</td>
                <td>
                  <span class="status-badge ${t.status === 'Paid' ? 'status-confirmed' : (t.status === 'Refunded' ? 'status-cancelled' : 'status-pending')}">
                    ${t.status === 'Paid' ? '✅ Paid' : (t.status === 'Refunded' ? '↩️ Refunded' : t.status)}
                  </span>
                </td>
                <td style="display:flex;gap:6px;">
                  <button class="admin-action-btn" style="background:rgba(245,197,24,0.12);color:var(--gold-primary);border-color:rgba(245,197,24,0.3);" onclick="viewReceipt('${t.paymentId}')">
                    🧾 Receipt
                  </button>
                  ${t.status === 'Paid' ? `
                    <button class="admin-action-btn" style="background:rgba(251,113,133,0.1);color:var(--cosmic-crimson);border-color:rgba(251,113,133,0.3);" onclick="requestRefund('${t.bookingId}', ${t.amount})">
                      Refund
                    </button>
                  ` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    wrap.innerHTML = `<div style="color:#fb7185;padding:20px;text-align:center;">Failed to load transactions: ${err.message}</div>`;
  }
}

async function viewReceipt(paymentId) {
  const modalBody = document.getElementById('receiptModalBody');
  if (!modalBody) return;

  modalBody.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);">⏳ Generating receipt...</div>';
  openModal('receiptModal');

  try {
    const res = await fetch(`/api/payments/receipt/${paymentId}`);
    const data = await res.json();
    if (!res.ok || !data.receipt) {
      throw new Error(data.error || 'Receipt not found');
    }
    const r = data.receipt;

    modalBody.innerHTML = `
      <div style="background:rgba(10,14,34,0.85);border:1px solid rgba(245,197,24,0.25);border-radius:var(--radius-md);padding:24px;color:var(--text-soft);font-family:var(--font-sans);">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid rgba(255,255,255,0.09);padding-bottom:16px;margin-bottom:16px;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:1.6rem;">🕉️</span>
              <div>
                <h3 style="margin:0;font-family:var(--font-heading);color:var(--gold-primary);font-size:1.15rem;letter-spacing:0.04em;">Vedic Astrology • PanditConnect</h3>
                <div style="font-size:0.75rem;color:var(--text-muted);">Official Payment Receipt & Escrow Voucher</div>
              </div>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:monospace;font-size:0.88rem;color:var(--gold-primary);font-weight:700;">${r.receiptNumber}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">${r.date} • ${r.time}</div>
            <span style="display:inline-block;margin-top:4px;padding:2px 8px;border-radius:var(--radius-full);background:rgba(52,211,153,0.15);color:var(--cosmic-emerald);font-size:0.72rem;font-weight:700;">
              PAID • FULL UPFRONT
            </span>
          </div>
        </div>

        <!-- Metadata Grid -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px;font-size:0.82rem;background:rgba(255,255,255,0.02);padding:12px;border-radius:var(--radius-sm);">
          <div>
            <div style="color:var(--text-dim);font-size:0.72rem;text-transform:uppercase;">Devotee / Customer:</div>
            <div style="font-weight:700;color:var(--text-main);margin-top:2px;">${r.customer.name}</div>
            <div style="color:var(--text-muted);font-size:0.75rem;">${r.customer.contact} • ${r.customer.pincode}</div>
          </div>
          <div>
            <div style="color:var(--text-dim);font-size:0.72rem;text-transform:uppercase;">Assigned Vedic Pandit:</div>
            <div style="font-weight:700;color:var(--gold-primary);margin-top:2px;">${r.pandit.name}</div>
            <div style="color:var(--text-muted);font-size:0.75rem;">ID: ${r.pandit.id}</div>
          </div>
          <div>
            <div style="color:var(--text-dim);font-size:0.72rem;text-transform:uppercase;">Booking Reference:</div>
            <div style="font-family:monospace;color:var(--saffron-light);">${r.bookingReference}</div>
          </div>
          <div>
            <div style="color:var(--text-dim);font-size:0.72rem;text-transform:uppercase;">Transaction ID:</div>
            <div style="font-family:monospace;color:var(--text-soft);font-size:0.75rem;">${r.transactionId}</div>
          </div>
        </div>

        <!-- Line Items Table -->
        <div style="border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);padding:10px 0;margin-bottom:16px;">
          <div style="font-size:0.78rem;font-weight:700;color:var(--text-dim);text-transform:uppercase;margin-bottom:8px;display:flex;justify-content:space-between;">
            <span>Description</span>
            <span>Amount (INR)</span>
          </div>
          ${r.lineItems.map(item => `
            <div style="display:flex;justify-content:space-between;font-size:0.84rem;margin-bottom:6px;">
              <span>${item.description}</span>
              <span style="font-weight:600;color:var(--text-main);">₹${item.amount.toLocaleString('en-IN')}</span>
            </div>
          `).join('')}
        </div>

        <!-- Total Paid -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:rgba(245,197,24,0.08);border:1px solid rgba(245,197,24,0.25);border-radius:var(--radius-sm);margin-bottom:16px;">
          <div>
            <div style="font-weight:700;color:var(--gold-primary);font-size:1.05rem;">Total Amount Paid</div>
            <div style="font-size:0.72rem;color:var(--text-muted);">Payment Provider: ${r.paymentMethod}</div>
          </div>
          <div style="font-size:1.4rem;font-weight:800;color:var(--gold-primary);font-family:var(--font-heading);">
            ₹${r.totalPaid.toLocaleString('en-IN')}
          </div>
        </div>

        <!-- Footer -->
        <div style="font-size:0.72rem;color:var(--text-dim);line-height:1.5;text-align:center;">
          <div>${r.issuer.organization} • ${r.issuer.tagline}</div>
          <div>For inquiries, assistance, or reschedule requests, contact support: ${r.issuer.supportEmail}</div>
        </div>
      </div>
    `;
  } catch (err) {
    modalBody.innerHTML = `<div style="color:#fb7185;padding:20px;text-align:center;">Error loading receipt: ${err.message}</div>`;
  }
}

async function viewReceiptByBooking(bookingId) {
  try {
    const res = await fetch(`/api/payments/user-transactions?userId=${encodeURIComponent(PC.currentUser?.id || 'guest')}`);
    const data = await res.json();
    const match = data.transactions?.find(t => t.bookingId === bookingId);
    if (match?.paymentId) {
      viewReceipt(match.paymentId);
    } else {
      showToast('Payment receipt is not available yet for this booking.', 'info');
    }
  } catch (e) {
    showToast('Could not load receipt.', 'error');
  }
}

async function requestRefund(bookingId, amount) {
  const confirmed = confirm(
    `Are you sure you want to cancel booking ${bookingId}?\n\n` +
    `• Cancellation & Refund Policy: 100% full refund of ₹${(amount || 0).toLocaleString('en-IN')} will be initiated to your original payment method.\n` +
    `• Funds typically reflect in your bank/UPI account within 5–7 business days.`
  );
  if (!confirmed) return;

  try {
    showToast('⏳ Initiating full refund with Razorpay...', 'info');
    const res = await fetch('/api/payments/refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId,
        reason: 'Devotee cancellation requested via dashboard',
        userId: PC.currentUser?.id || 'guest'
      })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to process refund');
    }

    showToast(`✅ ${data.message || 'Full refund processed successfully!'}`, 'success', 7000);

    // Update local booking status
    const b = PC.bookings.find(x => x.id === bookingId);
    if (b) {
      b.status = 'cancelled';
      b.booking_status = 'Cancelled';
      b.payment_status = 'Refunded';
      store('bookings', PC.bookings);
    }
    refreshUserDashboard();
    loadUserTransactions();
  } catch (err) {
    showToast('❌ Refund error: ' + err.message, 'error', 7000);
  }
}

// ── Pandit Dashboard ──────────────────────────────────────────────────────
function initPanditDashboard(pandit) {
  if (!pandit) {
    const id = PC.currentUser?.panditId || PC.currentUser?.id;
    pandit = PC.pandits.find(p => p.id === id || p.email === PC.currentUser?.email) || PC.pandits[0];
  }
  const displayName = pandit?.name || PC.currentUser?.name || 'Pandit';
  const displayId   = pandit?.id || PC.currentUser?.panditId || 'PND-100001';
  const isVerified  = pandit ? pandit.verified : true;

  document.getElementById('panditSidebarName').textContent = displayName;
  document.getElementById('panditSidebarId').textContent   = displayId;
  const badge = document.getElementById('panditVerifBadge');
  if (badge) {
    if (isVerified) {
      badge.textContent = '✅ Verified';
      badge.className = 'status-badge status-confirmed';
    } else {
      badge.textContent = '⏳ Pending Verification';
      badge.className = 'status-badge status-pending';
    }
  }
  setPanditDashTab('overview', document.querySelector('#sectionPanditDashboard .sidebar-nav-item'));
}

function setPanditDashTab(tab, btn) {
  document.querySelectorAll('#sectionPanditDashboard .sidebar-nav-item').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const panditId = PC.currentUser?.panditId || PC.currentUser?.id;
  const pandit   = PC.pandits.find(p => p.id === panditId || p.email === PC.currentUser?.email) || PC.pandits[0];
  const panditBookings = PC.bookings.filter(b => b.panditId === panditId);
  const container = document.getElementById('panditDashContent');

  const pendingCount = panditBookings.filter(b => b.status === 'pending').length;
  document.getElementById('pendingBadge').textContent = pendingCount;

  switch (tab) {
    case 'overview':
      const completion = pandit ? calcProfileCompletion(pandit) : 60;
      container.innerHTML = `
        <div class="stats-cards-row">
          <div class="stat-card"><div class="stat-card-icon">📋</div><div class="stat-card-value">${panditBookings.length}</div><div class="stat-card-label">Total Bookings</div></div>
          <div class="stat-card"><div class="stat-card-icon">⏳</div><div class="stat-card-value">${pendingCount}</div><div class="stat-card-label">Pending</div></div>
          <div class="stat-card"><div class="stat-card-icon">✅</div><div class="stat-card-value">${panditBookings.filter(b=>['accepted','confirmed'].includes(b.status)).length}</div><div class="stat-card-label">Confirmed</div></div>
          <div class="stat-card"><div class="stat-card-icon">⭐</div><div class="stat-card-value">${pandit?.rating?.toFixed(1) || '—'}</div><div class="stat-card-label">Avg. Rating</div></div>
        </div>
        <div class="section-card">
          <div class="section-card-header"><h2 class="section-card-title">📊 Profile Completion</h2></div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${completion}%"></div></div>
            <span class="progress-pct">${completion}%</span>
          </div>
          ${completion < 100 ? `<p style="font-size:0.84rem;color:var(--text-muted);margin-top:10px;">Complete your profile to get more bookings. Add a photo, bio, and services.</p>` : ''}
        </div>
        <div class="section-card">
          <div class="section-card-header"><h2 class="section-card-title">📋 Recent Booking Requests</h2></div>
          ${panditBookings.filter(b=>b.status==='pending').length
            ? `<div style="overflow-x:auto;"><table class="bookings-table"><thead><tr><th>ID</th><th>Service</th><th>Date</th><th>Contact</th><th>Actions</th></tr></thead><tbody>
              ${panditBookings.filter(b=>b.status==='pending').map(b => `
                <tr>
                  <td style="font-family:monospace;font-size:0.8rem;color:var(--saffron-light);">${b.id}</td>
                  <td>${b.service}</td>
                  <td>${formatDate(b.date)} • ${b.time}</td>
                  <td style="font-size:0.82rem;">${b.address?.slice(0,30)}...</td>
                  <td style="display:flex;gap:8px;">
                    <button class="admin-action-btn admin-approve" onclick="respondBooking('${b.id}','accepted')">✅ Accept</button>
                    <button class="admin-action-btn admin-reject" onclick="respondBooking('${b.id}','rejected')">❌ Reject</button>
                  </td>
                </tr>`).join('')}
              </tbody></table></div>`
            : `<div class="empty-state" style="padding:30px;"><div class="empty-state-icon">📬</div><p class="empty-state-text">No pending booking requests.</p></div>`}
        </div>`;
      break;

    case 'bookings':
      container.innerHTML = `
        <div class="section-card">
          <div class="section-card-header"><h2 class="section-card-title">📋 All Bookings & Escrow Payments</h2></div>
          ${panditBookings.length ? `<div style="overflow-x:auto;"><table class="bookings-table">
            <thead>
              <tr>
                <th>Booking Ref</th><th>Service</th><th>Date & Time</th><th>Status</th><th>Payment & Escrow</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
            ${panditBookings.map(b => `<tr>
              <td style="font-family:monospace;font-size:0.8rem;color:var(--saffron-light);">${b.public_booking_reference || b.id}</td>
              <td>${b.service}</td>
              <td>${formatDate(b.date)} • ${b.time}</td>
              <td><span class="status-badge status-${b.booking_status || b.status}">${statusLabel(b.booking_status || b.status)}</span></td>
              <td>
                <span class="status-badge ${['Paid','paid'].includes(b.payment_status) ? 'status-confirmed' : 'status-pending'}">
                  ${['Paid','paid'].includes(b.payment_status) ? `✅ ₹${(b.total_amount || 2158).toLocaleString('en-IN')} (Escrow Secured)` : '⏳ Pending Payment'}
                </span>
              </td>
              <td>
                ${['pending','Pending Payment'].includes(b.booking_status || b.status) ? `
                  <button class="admin-action-btn admin-approve" onclick="respondBooking('${b.id}','accepted')">✅ Accept</button>
                  <button class="admin-action-btn admin-reject" onclick="respondBooking('${b.id}','rejected')">❌ Reject</button>` : ''}
                ${['accepted','confirmed','Confirmed'].includes(b.booking_status || b.status) ? `<button class="admin-action-btn admin-approve" onclick="respondBooking('${b.id}','completed')">🏁 Mark Completed</button>` : ''}
              </td>
            </tr>`).join('')}
          </tbody></table></div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-top:14px;background:rgba(255,255,255,0.03);padding:12px;border-radius:var(--radius-sm);line-height:1.5;">
            🔒 <strong>Upfront Escrow & Settlement Policy:</strong> Customer payments are collected 100% upfront via Razorpay and held in trust by PanditConnect. Funds are protected against last-minute cancellation and disbursed upon ritual completion.
          </div>`
          : `<div class="empty-state"><div class="empty-state-icon">📋</div><p class="empty-state-text">No bookings yet. Complete your profile to appear in search results.</p></div>`}
        </div>`;
      break;

    case 'services':
      container.innerHTML = `
        <div class="section-card">
          <div class="section-card-header"><h2 class="section-card-title">🪔 My Services</h2></div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">
            ${(pandit?.services || []).map(s => `<span class="service-tag" style="font-size:0.84rem;padding:6px 14px;">${s}</span>`).join('')}
          </div>
          <p style="font-size:0.86rem;color:var(--text-muted);">To update services, please use the profile edit form or contact admin.</p>
        </div>`;
      break;

    case 'availability':
      const availHtml = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => {
        const avail = (pandit?.availability || []).includes(day);
        return `<div class="avail-day-chip ${avail ? '' : 'unavailable'}">${avail ? '✅' : '❌'} ${day}</div>`;
      }).join('');
      container.innerHTML = `
        <div class="section-card">
          <div class="section-card-header"><h2 class="section-card-title">📅 My Availability</h2></div>
          <div class="availability-grid">${availHtml}</div>
          <p style="margin-top:14px;font-size:0.84rem;color:var(--text-muted);">Hours: ${pandit?.timeFrom || '—'} – ${pandit?.timeTo || '—'}</p>
        </div>`;
      break;

    case 'consultations':
      const panditConsults = PC.consultations.filter(c => c.panditId === panditId || !c.panditId);
      container.innerHTML = `
        <div class="section-card">
          <div class="section-card-header"><h2 class="section-card-title">💬 Consultation Requests</h2></div>
          ${panditConsults.length
            ? panditConsults.map(c => `
              <div class="consultation-card">
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
                  <span style="font-weight:700;color:var(--text-main);">${c.name}</span>
                  <span class="status-badge ${c.answer ? 'status-completed' : 'status-pending'}">${c.answer ? '✅ Answered' : '⏳ Pending'}</span>
                </div>
                <p style="font-size:0.88rem;color:var(--text-soft);margin-bottom:12px;">❓ ${c.question}</p>
                ${!c.answer ? `
                  <textarea id="ans_${c.id}" class="form-textarea" placeholder="Type your response..." style="min-height:80px;margin-bottom:8px;"></textarea>
                  <button class="admin-action-btn admin-approve" onclick="submitAnswer('${c.id}')">🙏 Send Response</button>` : `
                  <div style="background:rgba(52,211,153,0.06);border-left:3px solid var(--cosmic-emerald);padding:10px 12px;border-radius:4px;">
                    <div style="font-size:0.76rem;color:var(--cosmic-emerald);margin-bottom:4px;">Your Response:</div>
                    <div style="font-size:0.88rem;color:var(--text-soft);">${c.answer}</div>
                  </div>`}
              </div>`).join('')
            : `<div class="empty-state"><div class="empty-state-icon">💬</div><p class="empty-state-text">No consultation requests yet.</p></div>`}
        </div>`;
      break;

    case 'reviews':
      const panditReviews = PC.reviews.filter(r => r.panditId === panditId);
      container.innerHTML = `
        <div class="section-card">
          <div class="section-card-header">
            <h2 class="section-card-title">⭐ My Reviews</h2>
            ${pandit?.rating ? `<div class="big-rating" style="font-size:1.4rem;">${pandit.rating.toFixed(1)}★</div>` : ''}
          </div>
          ${(pandit?.reviews || []).concat(panditReviews).map(r => `
            <div class="review-item">
              <div class="review-top">
                <div><div class="reviewer-name">👤 ${r.reviewer || r.userName}</div><div class="stars-display">${renderStars(r.rating)}</div></div>
                <div class="review-date">${formatDate(r.date)}</div>
              </div>
              <p class="review-text">"${r.text}"</p>
            </div>`).join('') || `<div class="empty-state"><div class="empty-state-icon">⭐</div><p class="empty-state-text">No reviews yet.</p></div>`}
        </div>`;
      break;

    case 'profile':
      container.innerHTML = `
        <div class="section-card">
          <div class="section-card-header"><h2 class="section-card-title">👤 Edit Profile</h2></div>
          <div class="form-grid">
            <div class="form-group"><label class="form-label">Full Name</label><input class="form-input" value="${pandit?.name||''}" id="editName"/></div>
            <div class="form-group"><label class="form-label">Experience (Years)</label><input type="number" class="form-input" value="${pandit?.experience||0}" id="editExp"/></div>
            <div class="form-group full-width"><label class="form-label">Bio / Description</label><textarea class="form-textarea" id="editBio" style="min-height:100px;">${pandit?.bio||''}</textarea></div>
            <div class="form-group"><label class="form-label">Languages</label><input class="form-input" value="${(pandit?.languages||[]).join(', ')}" id="editLangs"/></div>
            <div class="form-group"><label class="form-label">Starting Price (₹)</label><input type="number" class="form-input" value="${pandit?.startingPrice||1100}" id="editPrice"/></div>
          </div>
          <div class="form-actions"><button class="btn-submit" onclick="savePanditProfile('${panditId}')">💾 Save Changes</button></div>
        </div>`;
      break;
  }
}

function savePanditProfile(panditId) {
  const pandit = PC.pandits.find(p => p.id === panditId);
  if (!pandit) return;
  pandit.name = document.getElementById('editName').value;
  pandit.experience = parseInt(document.getElementById('editExp').value);
  pandit.bio = document.getElementById('editBio').value;
  pandit.languages = document.getElementById('editLangs').value.split(',').map(l => l.trim());
  pandit.startingPrice = parseInt(document.getElementById('editPrice').value);
  store('pandits', PC.pandits);
  showToast('Profile updated successfully!', 'success');
  document.getElementById('panditSidebarName').textContent = pandit.name;
}

function calcProfileCompletion(p) {
  let score = 0;
  if (p.name) score += 20;
  if (p.bio && p.bio.length > 50) score += 20;
  if (p.photo && p.photo !== '🕉️') score += 15;
  if (p.services?.length > 2) score += 15;
  if (p.availability?.length > 3) score += 15;
  if (p.languages?.length > 1) score += 15;
  return Math.min(score, 100);
}

// ── Booking Actions ───────────────────────────────────────────────────────
function respondBooking(bookingId, newStatus) {
  const booking = PC.bookings.find(b => b.id === bookingId);
  if (!booking) return;
  booking.status = newStatus;
  store('bookings', PC.bookings);
  showToast(`Booking ${bookingId} ${newStatus}.`, 'success');
  const currentTab = document.querySelector('#sectionPanditDashboard .sidebar-nav-item.active');
  setPanditDashTab(currentTab ? 'bookings' : 'overview', currentTab);
  refreshUserDashboard();
}

function cancelBooking(bookingId) {
  if (!confirm('Cancel this booking?')) return;
  const booking = PC.bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = 'cancelled';
    store('bookings', PC.bookings);
    showToast('Booking cancelled.', 'warning');
    refreshUserDashboard();
  }
}

// ── Reviews ───────────────────────────────────────────────────────────────
function setReviewRating(val) {
  PC.reviewRating = val;
  document.getElementById('reviewRatingVal').value = val;
  document.querySelectorAll('.star-btn').forEach(s => {
    s.style.opacity = parseInt(s.dataset.val) <= val ? '1' : '0.3';
    s.style.transform = parseInt(s.dataset.val) <= val ? 'scale(1.1)' : 'scale(1)';
  });
}

function openReviewForBooking(bookingId, panditId) {
  document.getElementById('reviewBookingId').value = bookingId;
  document.getElementById('reviewPanditId').value  = panditId;
  PC.reviewRating = 0;
  document.querySelectorAll('.star-btn').forEach(s => { s.style.opacity = '0.3'; s.style.transform = 'scale(1)'; });
  document.getElementById('reviewText').value = '';
  openModal('reviewModal');
}

function hasReview(bookingId) {
  return PC.reviews.some(r => r.bookingId === bookingId);
}

function submitReview() {
  const rating   = parseInt(document.getElementById('reviewRatingVal').value);
  const text     = document.getElementById('reviewText').value.trim();
  const bookingId = document.getElementById('reviewBookingId').value;
  const panditId  = document.getElementById('reviewPanditId').value;

  if (!rating) { showToast('Please select a star rating.', 'error'); return; }

  // Duplicate check
  if (hasReview(bookingId)) {
    showToast('You have already reviewed this booking.', 'warning');
    closeModal('reviewModal');
    return;
  }

  const review = {
    id: 'REV-' + Date.now(),
    bookingId, panditId,
    userId: PC.currentUser?.id || 'guest',
    userName: PC.currentUser?.name || 'User',
    reviewer: PC.currentUser?.name || 'User',
    rating, text,
    date: new Date().toISOString().split('T')[0],
  };
  PC.reviews.push(review);
  store('reviews', PC.reviews);

  // Update pandit's average
  const pandit = PC.pandits.find(p => p.id === panditId);
  if (pandit) {
    const allReviews = [...(pandit.reviews || []), ...PC.reviews.filter(r => r.panditId === panditId)];
    pandit.rating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    pandit.reviewCount = allReviews.length;
    store('pandits', PC.pandits);
  }

  closeModal('reviewModal');
  showToast('Thank you for your review!', 'success');
  refreshUserDashboard();
}

// ── Consultation Answer ───────────────────────────────────────────────────
function submitAnswer(consultId) {
  const answerEl = document.getElementById('ans_' + consultId);
  const answer = answerEl?.value.trim();
  if (!answer) { showToast('Please type your response.', 'error'); return; }

  const consult = PC.consultations.find(c => c.id === consultId);
  if (consult) {
    consult.answer = answer;
    consult.answeredAt = new Date().toISOString();
    store('consultations', PC.consultations);
    showToast('Response sent to the devotee.', 'success');
    const btn = document.querySelector(`#sectionPanditDashboard .sidebar-nav-item.active`);
    setPanditDashTab('consultations', btn);
  }
}

// ── Admin Dashboard ───────────────────────────────────────────────────────
function setAdminTab(tab, btn) {
  document.querySelectorAll('#sectionAdmin .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const container = document.getElementById('adminTabContent');

  switch (tab) {
    case 'verifications':
      const pending = PC.pandits.filter(p => !p.verified);
      container.innerHTML = `
        <div class="section-card-header"><h2 class="section-card-title">🔍 Pending Verifications (${pending.length})</h2></div>
        ${pending.length ? `<div style="overflow-x:auto;"><table class="bookings-table"><thead><tr><th>Pandit ID</th><th>Name</th><th>Location</th><th>Experience</th><th>Phone</th><th>Actions</th></tr></thead><tbody>
          ${pending.map(p => `<tr>
            <td style="font-family:monospace;color:var(--saffron-light);">${p.id}</td>
            <td>${p.name}</td>
            <td>${p.city}, ${p.state}</td>
            <td>${p.experience} yrs</td>
            <td style="font-size:0.8rem;">${p.phone || '—'}</td>
            <td style="display:flex;gap:8px;">
              <button class="admin-action-btn admin-approve" onclick="adminVerify('${p.id}', true)">✅ Approve</button>
              <button class="admin-action-btn admin-reject" onclick="adminVerify('${p.id}', false)">❌ Reject</button>
            </td>
          </tr>`).join('')}
        </tbody></table></div>`
        : `<div class="empty-state"><div class="empty-state-icon">✅</div><h3 class="empty-state-title">All Clear</h3><p class="empty-state-text">No pending verifications.</p></div>`}`;
      break;

    case 'pandits':
      container.innerHTML = `
        <div class="section-card-header"><h2 class="section-card-title">👤 All Pandits (${PC.pandits.length})</h2></div>
        <div style="overflow-x:auto;"><table class="bookings-table"><thead><tr><th>ID</th><th>Name</th><th>City</th><th>Experience</th><th>Rating</th><th>Status</th></tr></thead><tbody>
          ${PC.pandits.map(p => `<tr>
            <td style="font-family:monospace;font-size:0.8rem;color:var(--saffron-light);">${p.id}</td>
            <td>${p.name}</td>
            <td>${p.city}, ${p.state}</td>
            <td>${p.experience} yrs</td>
            <td>${p.rating ? p.rating.toFixed(1) + '★' : '—'}</td>
            <td><span class="status-badge ${p.verified ? 'status-confirmed' : 'status-pending'}">${p.verified ? '✅ Verified' : '⏳ Pending'}</span></td>
          </tr>`).join('')}
        </tbody></table></div>`;
      break;

    case 'bookings':
      container.innerHTML = `
        <div class="section-card-header"><h2 class="section-card-title">📋 All Bookings (${PC.bookings.length})</h2></div>
        ${PC.bookings.length ? `<div style="overflow-x:auto;"><table class="bookings-table"><thead><tr><th>Booking ID</th><th>Pandit</th><th>Service</th><th>Date</th><th>Status</th></tr></thead><tbody>
          ${PC.bookings.map(b => `<tr>
            <td style="font-family:monospace;font-size:0.8rem;color:var(--saffron-light);">${b.id}</td>
            <td>${b.panditName || b.panditId}</td>
            <td>${b.service}</td>
            <td>${formatDate(b.date)}</td>
            <td><span class="status-badge status-${b.status}">${statusLabel(b.status)}</span></td>
          </tr>`).join('')}
        </tbody></table></div>`
        : `<div class="empty-state"><div class="empty-state-icon">📋</div><p class="empty-state-text">No bookings in the system.</p></div>`}`;
      break;

    case 'reviews':
      container.innerHTML = `
        <div class="section-card-header"><h2 class="section-card-title">⭐ All Reviews (${PC.reviews.length})</h2></div>
        ${PC.reviews.length
          ? PC.reviews.map(r => `<div class="review-item"><div class="review-top"><div class="reviewer-name">${r.userName} → ${PC.pandits.find(p=>p.id===r.panditId)?.name || r.panditId}</div><div class="stars-display">${renderStars(r.rating)}</div></div><p class="review-text">${r.text}</p><div style="font-size:0.76rem;color:var(--text-dim);margin-top:6px;">Booking: ${r.bookingId}</div></div>`).join('')
          : `<div class="empty-state"><div class="empty-state-icon">⭐</div><p class="empty-state-text">No reviews yet.</p></div>`}`;
      break;

    case 'audit':
      container.innerHTML = `<div class="section-card-header"><h2 class="section-card-title">📝 Audit Log</h2></div>
        <div style="font-family:monospace;font-size:0.82rem;color:var(--text-muted);line-height:2;">
          ${[`[${new Date().toISOString()}] Admin Dashboard accessed`, ...PC.pandits.map(p => `[${p.id}] ${p.name} registered — Status: ${p.verified ? 'Verified' : 'Pending'}`), ...PC.bookings.map(b => `[${b.id}] Booking: ${b.service} on ${b.date} — Status: ${b.status}`)].join('<br>')}
        </div>`;
      break;
  }
}

function adminVerify(panditId, approve) {
  const pandit = PC.pandits.find(p => p.id === panditId);
  if (!pandit) return;
  pandit.verified = approve;
  store('pandits', PC.pandits);
  showToast(`Pandit ${pandit.name} has been ${approve ? 'verified ✅' : 'rejected ❌'}.`, approve ? 'success' : 'warning');
  setAdminTab('verifications', document.querySelector('#sectionAdmin .tab-btn.active'));
}

// ── Login / Auth ──────────────────────────────────────────────────────────
function setLoginTab(role, btn) {
  PC.loginRole = role;
  document.getElementById('loginRole').value = role;
  document.querySelectorAll('#loginModal .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function openLoginModal() { openModal('loginModal'); }

async function performLogin(e) {
  e.preventDefault();
  const identifier = document.getElementById('loginIdentifier').value.trim();
  const password   = document.getElementById('loginPassword').value;
  const role       = PC.loginRole || 'user';

  if (!identifier || !password) {
    showToast('Please enter credentials.', 'error');
    return;
  }

  // Admin login
  if (role === 'admin') {
    if (identifier === 'admin' && password === 'admin123') {
      PC.currentUser = { name: 'Administrator', role: 'admin', id: 'ADMIN-1' };
      store('currentUser', PC.currentUser);
      closeModal('loginModal');
      updateNavForUser();
      showToast('Welcome, Administrator!', 'success');
      showSection('sectionAdmin');
      setAdminTab('verifications', document.querySelector('#sectionAdmin .tab-btn'));
      return;
    }
    showToast('Invalid admin credentials.', 'error');
    return;
  }

  // Attempt real backend authentication first
  try {
    const endpoint = role === 'pandit' ? '/api/auth/pandit/login' : '/api/auth/user/login';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    if (res.ok) {
      const data = await res.json();
      const user = data.user || data.pandit;
      PC.currentUser = {
        name: user.name || user.profile?.professionalName || 'User',
        role: role,
        id: user.id || user.panditId,
        panditId: user.panditId,
        token: data.accessToken,
        email: user.email,
        phone: user.phone,
      };
      localStorage.setItem('va_session', JSON.stringify({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: user,
        role: role,
      }));
      store('currentUser', PC.currentUser);
      closeModal('loginModal');
      updateNavForUser();
      showToast(`Welcome back, ${PC.currentUser.name}!`, 'success');
      if (role === 'pandit') {
        initPanditDashboard();
        showSection('sectionPanditDashboard');
      } else {
        showSection('sectionUserDashboard');
        refreshUserDashboard();
      }
      return;
    }
  } catch (err) {
    console.warn('Backend login fallback to local demo', err);
  }

  // Pandit login fallback
  if (role === 'pandit') {
    const pandit = PC.pandits.find(p => p.phone === identifier || p.email === identifier || identifier === 'pandit.ram@vedicastrology.ai' || identifier === '+91 98765 00001');
    if (pandit || identifier.toLowerCase().includes('pandit')) {
      const pObj = pandit || PC.pandits[0];
      PC.currentUser = { name: pObj.name, role: 'pandit', id: pObj.id };
      store('currentUser', PC.currentUser);
      closeModal('loginModal');
      updateNavForUser();
      showToast(`Welcome back, ${pObj.name}!`, 'success');
      initPanditDashboard(pObj);
      showSection('sectionPanditDashboard');
      return;
    }
    showToast('Pandit not found. Please check your credentials.', 'error');
    return;
  }

  // User login (demo fallback)
  PC.currentUser = { name: identifier.split('@')[0] || 'Devotee', role: 'user', id: 'USR-' + Date.now() };
  store('currentUser', PC.currentUser);
  closeModal('loginModal');
  updateNavForUser();
  showToast(`Welcome, ${PC.currentUser.name}!`, 'success');
  showSection('sectionUserDashboard');
  refreshUserDashboard();
}

function updateNavForUser() {
  const loginBtn = document.getElementById('btnNavLogin');
  if (PC.currentUser) {
    loginBtn.textContent = `👤 ${PC.currentUser.name}`;
    loginBtn.onclick = () => {
      if (PC.currentUser.role === 'admin') { showSection('sectionAdmin'); setAdminTab('verifications', document.querySelector('#sectionAdmin .tab-btn')); }
      else if (PC.currentUser.role === 'pandit') { initPanditDashboard(); showSection('sectionPanditDashboard'); }
      else { showSection('sectionUserDashboard'); refreshUserDashboard(); }
    };
    document.getElementById('notifDot').style.display = 'block';
  } else {
    loginBtn.textContent = 'Login';
    loginBtn.onclick = openLoginModal;
    document.getElementById('notifDot').style.display = 'none';
  }
}

function logoutUser() {
  try {
    localStorage.removeItem('va_session');
    localStorage.removeItem('currentUser');
  } catch(e){}
  PC.currentUser = null;
  updateNavForUser();
  showToast('You have been logged out.', 'info');
  showSection('sectionSearch');
}

// ── Pandit Select Dropdown (Ask form) ────────────────────────────────────
function populatePanditSelects() {
  const selects = ['askPanditSelect'];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const opts = PC.pandits.filter(p => p.verified).map(p =>
      `<option value="${p.id}">${p.name} (${p.city})</option>`
    ).join('');
    el.innerHTML = (id === 'askPanditSelect' ? '<option value="">Any Available Pandit</option>' : '') + opts;
  });
}

// ── Utility Helpers ───────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch(e) { return dateStr; }
}

function statusLabel(status) {
  const labels = {
    pending: '⏳ Pending', accepted: '✅ Accepted', rejected: '❌ Rejected',
    confirmed: '✅ Confirmed', completed: '🎉 Completed', cancelled: '🚫 Cancelled'
  };
  return labels[status] || status;
}

function animateCounter(el, target) {
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('en-IN') + (target > 1000 ? '+' : '');
    if (current >= target) clearInterval(timer);
  }, 40);
}

// ── Init ──────────────────────────────────────────────────────────────────
function init() {
  // Load persisted data
  const storedPandits = retrieve('pandits', []);
  // Merge demo pandits with stored ones (avoid duplicates)
  const storedIds = new Set(storedPandits.map(p => p.id));
  PC.pandits = [...DEMO_PANDITS.filter(p => !storedIds.has(p.id)), ...storedPandits];
  PC.bookings = retrieve('bookings', []);
  PC.consultations = retrieve('consultations', []);
  PC.reviews = retrieve('reviews', []);

  // Sync session from va_session if present
  const vaSession = (() => {
    try { return JSON.parse(localStorage.getItem('va_session')); } catch(e) { return null; }
  })();
  if (vaSession && (vaSession.user || vaSession.pandit)) {
    const u = vaSession.user || vaSession.pandit;
    PC.currentUser = {
      name: u.name || u.profile?.professionalName || 'User',
      role: vaSession.role || u.role || 'user',
      id: u.id || u.panditId,
      panditId: u.panditId,
      token: vaSession.accessToken,
      email: u.email,
      phone: u.phone,
    };
    store('currentUser', PC.currentUser);
  } else {
    PC.currentUser = retrieve('currentUser', null);
  }

  // Render initial UI
  renderHomePujaGrid();
  renderAllServices();
  renderConsultationsList();
  initAvailDaysGrid();
  initServiceCheckboxGrid();
  populatePanditSelects();

  // Animate stats
  setTimeout(() => {
    animateCounter(document.getElementById('statPandits'), PC.pandits.filter(p => p.verified).length || 5);
    animateCounter(document.getElementById('statBookings'), PC.bookings.length + 847);
    animateCounter(document.getElementById('statCities'), 24);
  }, 600);

  // Restore session
  if (PC.currentUser) {
    updateNavForUser();
    if (PC.currentUser.role === 'pandit') {
      initPanditDashboard();
    }
  }

  // Mobile nav hamburger
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    navLinks.style.display = open ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '68px';
    navLinks.style.left = 0;
    navLinks.style.right = 0;
    navLinks.style.background = 'rgba(6,8,20,0.98)';
    navLinks.style.padding = '16px 24px';
    navLinks.style.gap = '4px';
    navLinks.style.zIndex = '99';
    navLinks.style.borderBottom = '1px solid rgba(255,107,0,0.2)';
    hamburger.setAttribute('aria-expanded', String(!open));
  });

  // Keyboard: close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        m.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });

  // Default: show search
  refreshUserDashboard();
  console.log('✨ PanditConnect initialized with', PC.pandits.length, 'Pandits.');
}

// Run on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
