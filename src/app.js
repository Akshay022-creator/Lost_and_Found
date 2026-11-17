/* =============================================
   RNSIT Lost & Found — app.js
   Full Application Logic + Smart Match & Handover
   ============================================= */

'use strict';

// =============================================
//  STORAGE & KEYS
// =============================================
const KEYS = {
  users: 'rnsit_lf_users',
  items: 'rnsit_lf_items',
  claims: 'rnsit_lf_claims',
  currentUser: 'rnsit_lf_current_user',
  theme: 'rnsit_lf_theme',
};

function getStore(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}
function setStore(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(KEYS.currentUser)) || null; }
  catch { return null; }
}
function setCurrentUser(user) {
  localStorage.setItem(KEYS.currentUser, user ? JSON.stringify(user) : null);
}

// =============================================
//  THEME TOGGLE
// =============================================
function initTheme() {
  const saved = localStorage.getItem(KEYS.theme) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(KEYS.theme, next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// =============================================
//  SEED DATA
// =============================================
function seedData() {
  if (!getStore(KEYS.users).length) {
    const users = [
      { id: 'u1', name: 'Admin (Student Affairs / Security)', email: 'admin@rnsit.ac.in', password: 'admin123', usn: 'STAFF-SEC-01', role: 'admin', dept: 'STAFF', createdAt: '2026-10-01' },
      { id: 'u2', name: 'Akshay Kaushik', email: 'akshaykaushik25cs@rnsit.ac.in', password: 'pass1234', usn: '1RN25CS016', role: 'user', dept: 'CSE', createdAt: '2026-10-10' },
      { id: 'u3', name: 'Leona Marilyn Rego', email: 'leonamarilynrego25cs@rnsit.ac.in', password: 'pass1234', usn: '1IB25CS101', role: 'user', dept: 'CSE', createdAt: '2026-10-11' },
      { id: 'u4', name: 'Atul Shrivastava', email: 'atulshrivastava25cs@rnsit.ac.in', password: 'pass1234', usn: '1RX25CS032', role: 'user', dept: 'CSE', createdAt: '2026-10-12' },
    ];
    setStore(KEYS.users, users);
  }

  if (!getStore(KEYS.items).length) {
    const items = [
      {
        id: 'i1', type: 'Lost', status: 'Open', category: 'Electronics',
        name: 'Apple AirPods Pro (White in Matte Case)', location: 'Central Library – 2nd Floor Study Desk',
        date: '2026-11-14', desc: 'Lost my AirPods Pro in white case. Has a small blue sticker on the lid and small scratch near bottom.',
        contact: 'akshaykaushik25cs@rnsit.ac.in', phone: '9380838591', photo: '', reportedBy: 'u2', isUrgent: false, createdAt: '2026-11-14',
      },
      {
        id: 'i2', type: 'Found', status: 'Open', category: 'ID/Cards',
        name: 'VTU Exam Hall Ticket & RNSIT ID Card', location: 'Block B – Ground Floor Classroom B-104',
        date: '2026-11-16', desc: 'Found student ID card along with VTU 3rd Semester Hall ticket left on desk in B-104.',
        contact: 'leonamarilynrego25cs@rnsit.ac.in', phone: '9482985685', photo: '', reportedBy: 'u3', isUrgent: true, createdAt: '2026-11-16',
      },
      {
        id: 'i3', type: 'Found', status: 'Claim Pending', category: 'Keys',
        name: 'Set of Bike Keys with Honda Keychain', location: 'Main Canteen – Nescafe Counter',
        date: '2026-11-15', desc: 'Set of 3 keys found near Nescafe counter. Includes an ignition key and a mini brass locker key.',
        contact: 'admin@rnsit.ac.in', phone: '9740571690', photo: '', reportedBy: 'u1', isUrgent: true, createdAt: '2026-11-15',
      },
      {
        id: 'i4', type: 'Lost', status: 'Returned', category: 'Bags',
        name: 'Navy Blue Wildcraft Backpack', location: 'Block A – 1st Floor Corridor',
        date: '2026-11-09', desc: 'Navy blue backpack containing OS notes and Casio scientific calculator fx-991EX. Successfully returned to owner!',
        contact: 'atulshrivastava25cs@rnsit.ac.in', phone: '9740571690', photo: '', reportedBy: 'u4', isUrgent: false, createdAt: '2026-11-09',
      },
      {
        id: 'i5', type: 'Found', status: 'Open', category: 'Accessories',
        name: 'Casio Vintage Digital Watch (Silver)', location: 'Sports Ground – Basketball Court Bench',
        date: '2026-11-17', desc: 'Found vintage stainless steel digital watch lying on the spectator bench near basketball court.',
        contact: 'admin@rnsit.ac.in', phone: '9380838591', photo: '', reportedBy: 'u1', isUrgent: false, createdAt: '2026-11-17',
      },
      {
        id: 'i6', type: 'Lost', status: 'Open', category: 'Books',
        name: 'Operating Systems (Silberschatz) 10th Ed', location: 'Central Library – Reading Hall A',
        date: '2026-11-16', desc: 'Hardcover textbook with handwritten sticky notes on Chapter 5 Process Synchronization.',
        contact: 'akshaykaushik25cs@rnsit.ac.in', phone: '9380838591', photo: '', reportedBy: 'u2', isUrgent: false, createdAt: '2026-11-16',
      },
      {
        id: 'i7', type: 'Found', status: 'Open', category: 'Electronics',
        name: 'Apple White Wireless Earbuds with Blue Sticker', location: 'Central Library – Ground Floor Return Desk',
        date: '2026-11-15', desc: 'Found wireless earbuds inside white case submitted by library attendant.',
        contact: 'admin@rnsit.ac.in', phone: '9740571690', photo: '', reportedBy: 'u1', isUrgent: false, createdAt: '2026-11-15',
      }
    ];
    setStore(KEYS.items, items);
  }

  if (!getStore(KEYS.claims).length) {
    const claims = [
      {
        id: 'c1', itemId: 'i3', userId: 'u2', userName: 'Akshay Kaushik',
        userUSN: '1RN25CS016',
        proof: 'The Honda key has an RNSIT engraved silver tag, and there is a small black rubber band wrapped around the ring.',
        phone: '9380838591', status: 'Pending', submittedAt: '2026-11-15',
      },
    ];
    setStore(KEYS.claims, claims);
  }
}

// =============================================
//  CATEGORY ICONS
// =============================================
const CATEGORY_ICONS = {
  Electronics: '📱', Bags: '🎒', 'ID/Cards': '🪪', Keys: '🔑',
  Clothing: '👕', Books: '📚', Accessories: '⌚', Sports: '⚽', Other: '📦',
};
function categoryIcon(cat) { return CATEGORY_ICONS[cat] || '📦'; }

// =============================================
//  NAVIGATION & ROUTING
// =============================================
let previousPage = 'home';
let currentPage = 'home';
let selectedZone = '';
let filterUrgent = false;

function showPage(page) {
  const protectedPages = ['report', 'myclaims', 'admin'];
  if (protectedPages.includes(page) && !getCurrentUser()) {
    showToast('Please login to access this section.', 'warning');
    showPage('login');
    return;
  }
  if (page === 'admin' && getCurrentUser()?.role !== 'admin') {
    showToast('Admin access required.', 'error');
    return;
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (!target) return;
  target.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add('active');

  previousPage = currentPage;
  currentPage = page;

  // Close mobile nav
  document.getElementById('navLinks')?.classList.remove('open');

  if (page === 'home') renderHome();
  if (page === 'browse') renderBrowse();
  if (page === 'admin') renderAdmin();
  if (page === 'myclaims') renderMyClaims();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() { showPage(previousPage || 'browse'); }

// Hamburger listener
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('navLinks')?.classList.toggle('open');
});

// =============================================
//  AUTH
// =============================================
function login(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const users = getStore(KEYS.users);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    showError('loginError', 'Invalid email or password.');
    return;
  }

  setCurrentUser(user);
  updateNavAuth(user);
  showToast(`Welcome back, ${user.name.split(' ')[0]}! 👋`, 'success');
  showPage('home');
}

function register(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const usn = document.getElementById('regUSN').value.trim().toUpperCase();
  const dept = document.getElementById('regDept').value;
  const password = document.getElementById('regPassword').value;

  const users = getStore(KEYS.users);
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    showError('regError', 'An account with this email already exists.');
    return;
  }

  const newUser = {
    id: genId(), name, email, usn, dept, password, role: 'user', createdAt: today(),
  };
  users.push(newUser);
  setStore(KEYS.users, users);
  setCurrentUser(newUser);
  updateNavAuth(newUser);
  showToast(`Account registered for ${name}! 🎉`, 'success');
  showPage('home');
}

function logout() {
  setCurrentUser(null);
  updateNavAuth(null);
  showToast('Logged out successfully.', 'info');
  showPage('home');
}

function updateNavAuth(user) {
  const authBtn = document.getElementById('authBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminNavItem = document.getElementById('adminNavItem');
  const userName = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');

  if (user) {
    if (authBtn) authBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = '';
    if (userName) userName.textContent = user.name.split(' ')[0];
    if (userAvatar) userAvatar.textContent = user.name[0].toUpperCase();
    if (adminNavItem) adminNavItem.style.display = user.role === 'admin' ? '' : 'none';
  } else {
    if (authBtn) authBtn.style.display = '';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (adminNavItem) adminNavItem.style.display = 'none';
  }
}

function togglePwd(id) {
  const inp = document.getElementById(id);
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.style.display = ''; el.textContent = msg; }
}

// =============================================
//  HOME PAGE RENDERING
// =============================================
function renderHome() {
  const items = getStore(KEYS.items);
  const claims = getStore(KEYS.claims);

  const statTotal = document.getElementById('statTotal');
  const statFound = document.getElementById('statFound');
  const statOpen = document.getElementById('statOpen');
  const statClaims = document.getElementById('statClaims');

  if (statTotal) statTotal.textContent = items.length;
  if (statFound) statFound.textContent = items.filter(i => i.status === 'Returned').length;
  if (statOpen) statOpen.textContent = items.filter(i => i.status === 'Open').length;
  if (statClaims) statClaims.textContent = claims.filter(c => c.status === 'Approved').length;

  // Urgent Banner
  const urgentCount = items.filter(i => i.isUrgent && i.status !== 'Returned').length;
  const strip = document.getElementById('urgentStrip');
  const stripText = document.getElementById('urgentAlertText');
  if (strip && stripText) {
    if (urgentCount > 0) {
      strip.style.display = '';
      stripText.textContent = `${urgentCount} urgent item(s) (Exam ID / Keys / Hall Tickets) actively reported on campus!`;
    } else {
      strip.style.display = 'none';
    }
  }

  const recent = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const container = document.getElementById('recentItems');
  if (container) container.innerHTML = recent.map(itemCard).join('');
}

function filterUrgentOnly() {
  filterUrgent = true;
  showPage('browse');
  const urgentChip = document.querySelector('.chip-urgent');
  if (urgentChip) urgentChip.classList.add('active');
  filterItems();
}

// =============================================
//  BROWSE & FILTERS
// =============================================
function renderBrowse() {
  filterItems();
}

function setZoneFilter(zone, btn) {
  selectedZone = zone;
  document.querySelectorAll('.zone-chips-bar .chip').forEach(c => {
    if (!c.classList.contains('chip-urgent')) c.classList.remove('active');
  });
  if (btn) btn.classList.add('active');
  filterItems();
}

function setUrgentFilter(btn) {
  filterUrgent = !filterUrgent;
  if (btn) btn.classList.toggle('active', filterUrgent);
  filterItems();
}

function filterItems() {
  const q = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  const cat = document.getElementById('filterCategory')?.value || '';
  const type = document.getElementById('filterType')?.value || '';
  const status = document.getElementById('filterStatus')?.value || '';

  const items = getStore(KEYS.items);
  let filtered = items.filter(item => {
    const matchQ = !q || item.name.toLowerCase().includes(q) ||
                          item.desc.toLowerCase().includes(q) ||
                          item.location.toLowerCase().includes(q);
    const matchCat = !cat || item.category === cat;
    const matchType = !type || item.type === type;
    const matchStatus = !status || item.status === status;
    const matchZone = !selectedZone || item.location.toLowerCase().includes(selectedZone.toLowerCase());
    const matchUrgent = !filterUrgent || item.isUrgent;
    return matchQ && matchCat && matchType && matchStatus && matchZone && matchUrgent;
  });

  filtered.sort((a, b) => {
    // Prioritize urgent open items
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  const grid = document.getElementById('browseItems');
  const empty = document.getElementById('browseEmpty');
  const info = document.getElementById('resultsInfo');

  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = '';
    if (info) info.textContent = 'No matching campus reports found.';
  } else {
    if (empty) empty.style.display = 'none';
    if (info) info.textContent = `Showing ${filtered.length} verified item${filtered.length !== 1 ? 's' : ''}`;
    grid.innerHTML = filtered.map(itemCard).join('');
  }
}

function clearFilters() {
  const searchInput = document.getElementById('searchInput');
  const filterCat = document.getElementById('filterCategory');
  const filterType = document.getElementById('filterType');
  const filterStatus = document.getElementById('filterStatus');

  if (searchInput) searchInput.value = '';
  if (filterCat) filterCat.value = '';
  if (filterType) filterType.value = '';
  if (filterStatus) filterStatus.value = '';
  selectedZone = '';
  filterUrgent = false;

  document.querySelectorAll('.zone-chips-bar .chip').forEach(c => c.classList.remove('active'));
  document.querySelector('.zone-chips-bar .chip')?.classList.add('active');

  filterItems();
}

// =============================================
//  ITEM CARD COMPONENT
// =============================================
function itemCard(item) {
  const statusClass = { Open: 'badge-open', 'Claim Pending': 'badge-claim', Returned: 'badge-returned' }[item.status] || 'badge-open';
  const photoHtml = item.photo
    ? `<div class="card-image"><img src="${item.photo}" alt="${escHtml(item.name)}" /></div>`
    : `<div class="card-image">${categoryIcon(item.category)}</div>`;

  const urgentFlag = item.isUrgent ? `<div class="card-urgent-flag">🚨 Urgent</div>` : '';

  return `
  <div class="item-card ${item.isUrgent ? 'is-urgent' : ''}" onclick="showDetail('${item.id}')">
    ${urgentFlag}
    ${photoHtml}
    <div class="card-body">
      <div class="card-badges">
        <span class="badge ${item.type === 'Lost' ? 'badge-lost' : 'badge-found'}">${item.type}</span>
        <span class="badge ${statusClass}">${item.status}</span>
        <span class="badge badge-category">${item.category}</span>
      </div>
      <div class="card-title">${escHtml(item.name)}</div>
      <div class="card-meta">
        <span>📍 ${escHtml(item.location)}</span>
        <span>📅 ${formatDate(item.date)}</span>
      </div>
      <div class="card-desc">${escHtml(item.desc)}</div>
    </div>
  </div>`;
}

// =============================================
//  ITEM DETAIL & SMART MATCH
// =============================================
function showDetail(id) {
  const items = getStore(KEYS.items);
  const item = items.find(i => i.id === id);
  if (!item) return;

  const user = getCurrentUser();
  const claims = getStore(KEYS.claims);
  const userHasClaim = user && claims.find(c => c.itemId === id && c.userId === user.id);
  const isOwner = user && item.reportedBy === user.id;
  const isAdmin = user?.role === 'admin';

  const statusClass = { Open: 'badge-open', 'Claim Pending': 'badge-claim', Returned: 'badge-returned' }[item.status] || '';

  const photoHtml = item.photo
    ? `<div class="detail-image"><img src="${item.photo}" alt="${escHtml(item.name)}" /></div>`
    : `<div class="detail-image" style="font-size:7rem; height:240px;">${categoryIcon(item.category)}</div>`;

  // WhatsApp Share button
  const shareText = encodeURIComponent(`*🚨 RNSIT Lost & Found Alert*\nItem: ${item.name}\nType: ${item.type}\nLocation: ${item.location}\nDate: ${item.date}\nPortal: Check RNSIT Lost & Found Community Portal`);
  const shareButtonsEl = document.getElementById('detailShareButtons');
  if (shareButtonsEl) {
    shareButtonsEl.innerHTML = `
      <a href="https://api.whatsapp.com/send?text=${shareText}" target="_blank" class="btn btn-sm btn-whatsapp">
        <span>📲</span> Share on WhatsApp
      </a>
      <button class="btn btn-sm btn-outline" onclick="copyItemLink('${item.id}')">
        <span>🔗</span> Copy Link
      </button>
    `;
  }

  let actionBtns = '';
  if (item.type === 'Found' && item.status === 'Open' && user && !isOwner && !userHasClaim) {
    actionBtns += `<button class="btn btn-primary btn-lg" onclick="openClaimModal('${item.id}')">🛡️ Submit Ownership Claim</button>`;
  }
  if (userHasClaim) {
    actionBtns += `<span class="badge status-${userHasClaim.status.toLowerCase()}" style="padding:.6rem 1.2rem; font-size:.9rem;">Your Claim Status: ${userHasClaim.status}</span>`;
  }
  if (item.status === 'Returned' || userHasClaim?.status === 'Approved') {
    actionBtns += `<button class="btn btn-secondary" onclick="openReceiptModal('${item.id}')">🖨️ View Handover Receipt</button>`;
  }
  if (isOwner && item.status !== 'Returned') {
    actionBtns += `<button class="btn btn-danger btn-sm" onclick="deleteItem('${item.id}')">🗑 Delete My Report</button>`;
  }
  if (isAdmin) {
    actionBtns += `
      <div style="display:flex; align-items:center; gap:.5rem;">
        <span style="font-size:.85rem; font-weight:700;">Admin Status:</span>
        <select onchange="adminChangeStatus('${item.id}', this.value)" class="filter-select" style="font-size:.85rem; padding:.35rem .75rem;">
          <option ${item.status==='Open'?'selected':''}>Open</option>
          <option ${item.status==='Claim Pending'?'selected':''}>Claim Pending</option>
          <option ${item.status==='Returned'?'selected':''}>Returned</option>
        </select>
      </div>
    `;
  }

  document.getElementById('detailCard').innerHTML = `
    ${photoHtml}
    <div class="detail-body">
      <div class="detail-header">
        <div>
          <div class="card-badges" style="margin-bottom:.75rem;">
            <span class="badge ${item.type === 'Lost' ? 'badge-lost' : 'badge-found'}">${item.type}</span>
            <span class="badge ${statusClass}">${item.status}</span>
            <span class="badge badge-category">${item.category}</span>
            ${item.isUrgent ? '<span class="badge badge-lost">🚨 URGENT</span>' : ''}
          </div>
          <div class="detail-title">${escHtml(item.name)}</div>
        </div>
      </div>

      <div class="detail-meta">
        <div class="detail-meta-item">
          <span class="label">📍 Campus Location</span>
          <span class="value">${escHtml(item.location)}</span>
        </div>
        <div class="detail-meta-item">
          <span class="label">📅 Date Reported</span>
          <span class="value">${formatDate(item.date)}</span>
        </div>
        <div class="detail-meta-item">
          <span class="label">📂 Category</span>
          <span class="value">${item.category}</span>
        </div>
        <div class="detail-meta-item">
          <span class="label">📧 Primary Contact</span>
          <span class="value"><a href="mailto:${item.contact}">${item.contact}</a></span>
        </div>
        ${item.phone ? `
        <div class="detail-meta-item">
          <span class="label">📞 Phone / WhatsApp</span>
          <span class="value"><a href="tel:${item.phone}">${item.phone}</a></span>
        </div>` : ''}
      </div>

      <div class="detail-desc">
        <h4>Item Visual Description</h4>
        <p>${escHtml(item.desc)}</p>
      </div>

      <div class="detail-actions">${actionBtns}</div>
    </div>
  `;

  // Check for Smart Match (AI / Match Simulation)
  checkSmartMatch(item);

  showPage('detail');
}

function checkSmartMatch(currentItem) {
  const container = document.getElementById('smartMatchContainer');
  if (!container) return;

  const items = getStore(KEYS.items);
  // If viewing a Lost item, find matching Found items (and vice-versa)
  const oppositeType = currentItem.type === 'Lost' ? 'Found' : 'Lost';

  const matches = items.filter(other => {
    if (other.id === currentItem.id) return false;
    if (other.type !== oppositeType) return false;
    if (other.status === 'Returned') return false;

    // Check category match or title keyword match
    const sameCategory = other.category === currentItem.category;
    const wordsCurrent = currentItem.name.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const hasWordMatch = wordsCurrent.some(w => other.name.toLowerCase().includes(w) || other.desc.toLowerCase().includes(w));

    return sameCategory || hasWordMatch;
  });

  if (matches.length > 0) {
    container.style.display = '';
    container.innerHTML = `
      <div class="smart-match-header">
        <span style="font-size:1.8rem;">🤖</span>
        <div>
          <h3>Smart Match Engine Found Potential ${oppositeType} Items!</h3>
          <p style="font-size:.85rem; color:var(--text-muted);">We detected ${matches.length} active report(s) on campus with similar traits</p>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:1rem; margin-top:1rem;">
        ${matches.map(m => `
          <div style="background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:1rem; display:flex; flex-direction:column; gap:.4rem;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="badge ${m.type === 'Lost' ? 'badge-lost' : 'badge-found'}">${m.type}</span>
              <small style="color:var(--text-muted);">${formatDate(m.date)}</small>
            </div>
            <strong>${escHtml(m.name)}</strong>
            <small style="color:var(--text-muted);">📍 ${escHtml(m.location)}</small>
            <button class="btn btn-outline btn-sm" onclick="showDetail('${m.id}')" style="margin-top:.4rem;">Compare Item →</button>
          </div>
        `).join('')}
      </div>
    `;
  } else {
    container.style.display = 'none';
  }
}

function copyItemLink(id) {
  const url = `${window.location.origin}${window.location.pathname}#item-${id}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast('Link copied to clipboard! 📋', 'success');
  }).catch(() => {
    showToast('Failed to copy link.', 'error');
  });
}

// =============================================
//  REPORT FORM
// =============================================
let reportType = 'Lost';
let photoBase64 = '';

function setReportType(type) {
  reportType = type;
  document.getElementById('toggleLost')?.classList.toggle('active', type === 'Lost');
  document.getElementById('toggleFound')?.classList.toggle('active', type === 'Found');
}

function handleLocationSelect(sel) {
  const customLoc = document.getElementById('itemLocation');
  if (sel.value && sel.value !== 'Other Location') {
    customLoc.value = sel.value + ' – ';
    customLoc.focus();
  }
}

function previewPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Photo must be under 5MB.', 'error'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    photoBase64 = ev.target.result;
    const preview = document.getElementById('photoPreview');
    const container = document.getElementById('photoPreviewContainer');
    if (preview && container) {
      preview.src = photoBase64;
      container.style.display = 'inline-block';
    }
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  photoBase64 = '';
  const preview = document.getElementById('photoPreview');
  const container = document.getElementById('photoPreviewContainer');
  const input = document.getElementById('itemPhoto');
  if (preview) preview.src = '';
  if (container) container.style.display = 'none';
  if (input) input.value = '';
}

function submitReport(e) {
  e.preventDefault();
  const user = getCurrentUser();
  if (!user) { showPage('login'); return; }

  const name = document.getElementById('itemName').value.trim();
  const category = document.getElementById('itemCategory').value;
  const date = document.getElementById('itemDate').value;
  const location = document.getElementById('itemLocation').value.trim();
  const desc = document.getElementById('itemDesc').value.trim();
  const contact = document.getElementById('itemContact').value.trim();
  const phone = document.getElementById('itemPhone').value.trim();
  const isUrgent = document.getElementById('itemIsUrgent')?.checked || false;

  const newItem = {
    id: genId(), type: reportType, status: 'Open',
    name, category, date, location, desc, contact, phone,
    isUrgent, photo: photoBase64 || '', reportedBy: user.id, createdAt: today(),
  };

  const items = getStore(KEYS.items);
  items.unshift(newItem);
  setStore(KEYS.items, items);

  document.getElementById('reportForm').reset();
  removePhoto();
  setReportType('Lost');

  showToast('Item successfully logged in campus records! 🎉', 'success');
  showPage('browse');
}

// =============================================
//  CLAIM SUBMISSION
// =============================================
function openClaimModal(itemId) {
  const user = getCurrentUser();
  if (!user) { showPage('login'); return; }

  const items = getStore(KEYS.items);
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  document.getElementById('claimItemId').value = itemId;
  document.getElementById('claimItemTitleDisplay').textContent = item.name;
  document.getElementById('claimProof').value = '';
  document.getElementById('claimPhone').value = user.phone || '';
  document.getElementById('claimUSN').value = user.usn || '';

  document.getElementById('claimModal').classList.add('open');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

function submitClaim(e) {
  e.preventDefault();
  const user = getCurrentUser();
  if (!user) { showPage('login'); return; }

  const itemId = document.getElementById('claimItemId').value;
  const proof = document.getElementById('claimProof').value.trim();
  const phone = document.getElementById('claimPhone').value.trim();
  const usn = document.getElementById('claimUSN').value.trim().toUpperCase() || user.usn;

  const claims = getStore(KEYS.claims);
  if (claims.find(c => c.itemId === itemId && c.userId === user.id)) {
    showToast('You already submitted a claim for this item.', 'warning');
    closeModal('claimModal');
    return;
  }

  const newClaim = {
    id: genId(), itemId, userId: user.id, userName: user.name,
    userUSN: usn, proof, phone, status: 'Pending', submittedAt: today(),
  };
  claims.push(newClaim);
  setStore(KEYS.claims, claims);

  // Update item status
  const items = getStore(KEYS.items);
  const idx = items.findIndex(i => i.id === itemId);
  if (idx !== -1) {
    items[idx].status = 'Claim Pending';
    setStore(KEYS.items, items);
  }

  closeModal('claimModal');
  showToast('Claim submitted for security/admin verification! 🛡️', 'success');
  showDetail(itemId);
}

// =============================================
//  PRINTABLE HANDOVER SLIP (RECEIPT)
// =============================================
function openReceiptModal(itemId) {
  const items = getStore(KEYS.items);
  const claims = getStore(KEYS.claims);
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  const claim = claims.find(c => c.itemId === itemId && c.status === 'Approved') ||
                claims.find(c => c.itemId === itemId);

  const claimantName = claim ? claim.userName : (getCurrentUser()?.name || 'Verified Claimant');
  const claimantUSN = claim?.userUSN || '1RN25CS016';
  const receiptNo = 'RNSIT-LF-' + item.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-6);

  document.getElementById('receiptPrintArea').innerHTML = `
    <div class="receipt-paper">
      <div class="receipt-header">
        <img src="assets/rnsit-logo.png" alt="RNSIT" class="receipt-emblem" />
        <div>
          <div class="receipt-title">R. N. S. INSTITUTE OF TECHNOLOGY</div>
          <div class="receipt-college">Autonomous Institution · Affiliated to VTU · Channasandra, Bengaluru</div>
          <div style="font-weight:700; color:#1e3a8a; margin-top:2px;">OFFICIAL PROPERTY HANDOVER ACKNOWLEDGMENT SLIP</div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; font-size:.85rem; margin-bottom:.75rem;">
        <div><strong>Receipt No:</strong> ${receiptNo}</div>
        <div><strong>Date:</strong> ${formatDate(today())}</div>
      </div>

      <table class="receipt-table">
        <tr><td style="width:35%;"><strong>Item Description:</strong></td><td>${escHtml(item.name)}</td></tr>
        <tr><td><strong>Category / Zone:</strong></td><td>${item.category} (${escHtml(item.location)})</td></tr>
        <tr><td><strong>Original Date Reported:</strong></td><td>${formatDate(item.date)}</td></tr>
        <tr><td><strong>Claimant Name:</strong></td><td>${escHtml(claimantName)}</td></tr>
        <tr><td><strong>Claimant USN:</strong></td><td><strong>${escHtml(claimantUSN)}</strong></td></tr>
        <tr><td><strong>Handover Status:</strong></td><td><span style="color:#059669; font-weight:800;">VERIFIED &amp; RETURNED</span></td></tr>
      </table>

      <div style="font-size:.8rem; color:#64748b; margin-top:.5rem;">
        * This document certifies that the aforementioned belonging was surrendered and successfully reclaimed through the RNSIT Lost &amp; Found Portal after verification of identity and private ownership marks.
      </div>

      <div class="receipt-signatures">
        <div class="sig-box">Signature of Claimant (Student)</div>
        <div class="sig-box">Security / Department In-Charge Stamp</div>
      </div>
    </div>
  `;

  document.getElementById('receiptModal').classList.add('open');
}

function printReceipt() {
  window.print();
}

// =============================================
//  MY CLAIMS & MY REPORTS
// =============================================
function renderMyClaims() {
  const user = getCurrentUser();
  if (!user) { showPage('login'); return; }

  const claims = getStore(KEYS.claims).filter(c => c.userId === user.id);
  const items = getStore(KEYS.items);
  const el = document.getElementById('myClaimsContent');

  if (!claims.length) {
    el.innerHTML = `<div class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>No submitted claims</h3>
      <p>Browse campus listings and submit a claim if you spot your lost item.</p>
      <button class="btn btn-primary" onclick="showPage('browse')">Browse Campus Items</button>
    </div>`;
  } else {
    el.innerHTML = claims.map(c => {
      const item = items.find(i => i.id === c.itemId);
      const statusCls = { Pending: 'status-pending', Approved: 'status-approved', Rejected: 'status-rejected' }[c.status] || '';
      return `
      <div class="claim-card">
        <div class="claim-card-header">
          <div>
            <h4>${item ? escHtml(item.name) : 'Item Record'}</h4>
            <p style="font-size:.82rem; color:var(--text-muted);">Category: ${item?.category || '—'} · Location: ${item?.location || '—'}</p>
          </div>
          <span class="status-badge ${statusCls}">${c.status}</span>
        </div>
        <p><strong>Submitted Proof:</strong> ${escHtml(c.proof)}</p>
        <p style="font-size:.8rem; color:var(--text-muted); margin-top:.4rem;">Filed on ${formatDate(c.submittedAt)}</p>
        <div style="margin-top:1rem; display:flex; gap:.75rem;">
          ${item ? `<button class="btn btn-outline btn-sm" onclick="showDetail('${item.id}')">View Item Details</button>` : ''}
          ${c.status === 'Approved' && item ? `<button class="btn btn-secondary btn-sm" onclick="openReceiptModal('${item.id}')">🖨️ Handover Slip</button>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  // Render My Reports
  const myReports = items.filter(i => i.reportedBy === user.id);
  const repEl = document.getElementById('myReportsContent');
  if (repEl) {
    if (!myReports.length) {
      repEl.innerHTML = `<div class="empty-state"><div class="empty-icon">📦</div><h3>No items reported by you yet</h3></div>`;
    } else {
      repEl.innerHTML = myReports.map(itemCard).join('');
    }
  }
}

function switchMyTab(tabId, btn) {
  document.querySelectorAll('.myclaims-tab-pane').forEach(p => p.style.display = 'none');
  const target = document.getElementById(tabId);
  if (target) target.style.display = '';
  document.querySelectorAll('.myclaims-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// =============================================
//  ADMIN DASHBOARD
// =============================================
function renderAdmin() {
  renderAdminItems();
  renderAdminClaims();
  renderAdminUsers();
  renderAdminStats();
}

function switchTab(id, btn) {
  document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
  const target = document.getElementById(id);
  if (target) target.style.display = '';
  document.querySelectorAll('.admin-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function renderAdminItems() {
  const items = getStore(KEYS.items);
  const el = document.getElementById('adminItems');
  if (!el) return;
  el.innerHTML = `
  <div style="overflow-x:auto;">
  <table class="admin-table">
    <thead><tr>
      <th>Item</th><th>Type</th><th>Category</th><th>Campus Location</th><th>Date</th><th>Status</th><th>Actions</th>
    </tr></thead>
    <tbody>${items.map(item => `<tr>
      <td><strong>${escHtml(item.name)}</strong>${item.isUrgent ? ' <span class="badge badge-lost">🚨 Urgent</span>' : ''}</td>
      <td><span class="badge ${item.type === 'Lost' ? 'badge-lost' : 'badge-found'}">${item.type}</span></td>
      <td>${item.category}</td>
      <td>${escHtml(item.location)}</td>
      <td>${formatDate(item.date)}</td>
      <td>
        <select onchange="adminChangeStatus('${item.id}', this.value)" class="filter-select" style="font-size:.78rem; padding:.25rem .5rem;">
          <option ${item.status==='Open'?'selected':''}>Open</option>
          <option ${item.status==='Claim Pending'?'selected':''}>Claim Pending</option>
          <option ${item.status==='Returned'?'selected':''}>Returned</option>
        </select>
      </td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="showDetail('${item.id}')">View</button>
        <button class="btn btn-sm btn-danger" onclick="adminDeleteItem('${item.id}')">Delete</button>
      </td>
    </tr>`).join('')}
    </tbody>
  </table></div>`;
}

function renderAdminClaims() {
  const claims = getStore(KEYS.claims);
  const items = getStore(KEYS.items);
  const el = document.getElementById('adminClaims');
  if (!el) return;
  if (!claims.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><h3>No claim requests in queue</h3></div>';
    return;
  }
  el.innerHTML = `
  <div style="overflow-x:auto;">
  <table class="admin-table">
    <thead><tr>
      <th>Claimant</th><th>USN</th><th>Target Item</th><th>Confidential Proof</th><th>Phone</th><th>Status</th><th>Verification Action</th>
    </tr></thead>
    <tbody>${claims.map(c => {
      const item = items.find(i => i.id === c.itemId);
      const statusCls = { Pending: 'status-pending', Approved: 'status-approved', Rejected: 'status-rejected' }[c.status] || '';
      return `<tr>
        <td><strong>${escHtml(c.userName)}</strong></td>
        <td><code>${escHtml(c.userUSN || '—')}</code></td>
        <td>${item ? escHtml(item.name) : '—'}</td>
        <td style="max-width:240px; font-size:.82rem;">${escHtml(c.proof)}</td>
        <td><a href="tel:${c.phone}">${c.phone || '—'}</a></td>
        <td><span class="status-badge ${statusCls}">${c.status}</span></td>
        <td style="display:flex; gap:.4rem; flex-wrap:wrap;">
          ${c.status === 'Pending' ? `
            <button class="btn btn-sm btn-success" onclick="adminApproveClaim('${c.id}')">✓ Approve &amp; Release</button>
            <button class="btn btn-sm btn-danger" onclick="adminRejectClaim('${c.id}')">✗ Reject</button>
          ` : `
            <button class="btn btn-sm btn-outline" onclick="openReceiptModal('${c.itemId}')">🖨️ Receipt</button>
          `}
        </td>
      </tr>`;
    }).join('')}
    </tbody>
  </table></div>`;
}

function renderAdminUsers() {
  const users = getStore(KEYS.users);
  const el = document.getElementById('adminUsers');
  if (!el) return;
  el.innerHTML = `
  <div style="overflow-x:auto;">
  <table class="admin-table">
    <thead><tr><th>Name</th><th>Email</th><th>USN</th><th>Branch</th><th>Role</th><th>Joined Date</th></tr></thead>
    <tbody>${users.map(u => `<tr>
      <td><strong>${escHtml(u.name)}</strong></td>
      <td>${escHtml(u.email)}</td>
      <td><code>${u.usn || '—'}</code></td>
      <td>${u.dept || 'CSE'}</td>
      <td><span class="badge ${u.role === 'admin' ? 'badge-found' : 'badge-category'}">${u.role}</span></td>
      <td>${formatDate(u.createdAt)}</td>
    </tr>`).join('')}
    </tbody>
  </table></div>`;
}

function renderAdminStats() {
  const items = getStore(KEYS.items);
  const claims = getStore(KEYS.claims);
  const users = getStore(KEYS.users);
  const el = document.getElementById('adminStats');
  if (!el) return;

  const catCounts = {};
  items.forEach(i => { catCounts[i.category] = (catCounts[i.category] || 0) + 1; });

  el.innerHTML = `
  <div class="stats-grid">
    <div class="stats-card"><div class="big">${items.length}</div><div class="label">Total Campus Items</div></div>
    <div class="stats-card"><div class="big">${items.filter(i=>i.type==='Lost').length}</div><div class="label">Lost Inquiries</div></div>
    <div class="stats-card"><div class="big">${items.filter(i=>i.type==='Found').length}</div><div class="label">Found Surrenders</div></div>
    <div class="stats-card"><div class="big">${items.filter(i=>i.status==='Returned').length}</div><div class="label">Reclaimed (Returned)</div></div>
    <div class="stats-card"><div class="big">${claims.length}</div><div class="label">Total Ownership Claims</div></div>
    <div class="stats-card"><div class="big">${claims.filter(c=>c.status==='Pending').length}</div><div class="label">Pending Review</div></div>
    <div class="stats-card"><div class="big">${users.length}</div><div class="label">Registered Students &amp; Staff</div></div>
    <div class="stats-card"><div class="big">${items.filter(i=>i.isUrgent).length}</div><div class="label">Urgent Tagged Items</div></div>
  </div>

  <h3 style="margin-bottom:1rem; font-size:1.15rem;">Breakdown by Item Category</h3>
  <div style="display:flex; flex-wrap:wrap; gap:.75rem; margin-bottom:2rem;">
    ${Object.entries(catCounts).map(([cat, count]) => `
      <div style="background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:.75rem 1.25rem; display:flex; gap:.65rem; align-items:center;">
        <span style="font-size:1.6rem;">${categoryIcon(cat)}</span>
        <div><div style="font-weight:800; font-size:1.1rem;">${count}</div><div style="font-size:.78rem; color:var(--text-muted);">${cat}</div></div>
      </div>
    `).join('')}
  </div>

  <div class="guidelines-card">
    <h3>🌍 SDG Audit Summary (Institutional Transparency)</h3>
    <p>• <strong>SDG 11:</strong> Average recovery resolution cycle maintained within 48 hours for academic materials.</p>
    <p>• <strong>SDG 16:</strong> 100% of released items verified through confidential proof logs and digital acknowledgment slips.</p>
  </div>`;
}

function adminChangeStatus(itemId, status) {
  const items = getStore(KEYS.items);
  const idx = items.findIndex(i => i.id === itemId);
  if (idx !== -1) {
    items[idx].status = status;
    setStore(KEYS.items, items);
    showToast(`Status updated to "${status}"`, 'success');
    if (currentPage === 'admin') renderAdmin();
    if (currentPage === 'detail') showDetail(itemId);
  }
}

function adminDeleteItem(itemId) {
  if (!confirm('Are you sure you want to delete this campus report?')) return;
  const items = getStore(KEYS.items).filter(i => i.id !== itemId);
  setStore(KEYS.items, items);
  showToast('Report removed from records.', 'info');
  renderAdmin();
}

function adminApproveClaim(claimId) {
  const claims = getStore(KEYS.claims);
  const idx = claims.findIndex(c => c.id === claimId);
  if (idx !== -1) {
    const itemId = claims[idx].itemId;
    claims[idx].status = 'Approved';
    setStore(KEYS.claims, claims);
    adminChangeStatus(itemId, 'Returned');
    showToast('Claim approved! Item marked as RETURNED. Handover slip ready.', 'success');
    renderAdmin();
  }
}

function adminRejectClaim(claimId) {
  const claims = getStore(KEYS.claims);
  const idx = claims.findIndex(c => c.id === claimId);
  if (idx !== -1) {
    const itemId = claims[idx].itemId;
    claims[idx].status = 'Rejected';
    setStore(KEYS.claims, claims);
    const remaining = claims.filter(c => c.itemId === itemId && c.status === 'Pending');
    if (!remaining.length) adminChangeStatus(itemId, 'Open');
    showToast('Claim rejected.', 'error');
    renderAdmin();
  }
}

function deleteItem(itemId) {
  if (!confirm('Are you sure you want to delete your item report?')) return;
  const items = getStore(KEYS.items).filter(i => i.id !== itemId);
  setStore(KEYS.items, items);
  showToast('Your report has been deleted.', 'info');
  showPage('browse');
}

// =============================================
//  CSV EXPORT FUNCTION
// =============================================
function exportItemsToCSV() {
  const items = getStore(KEYS.items);
  if (!items.length) { showToast('No records to export.', 'warning'); return; }

  const headers = ['Item ID', 'Type', 'Status', 'Category', 'Item Name', 'Campus Location', 'Date', 'Urgent Flag', 'Contact Email', 'Contact Phone'];
  const rows = items.map(i => [
    i.id,
    i.type,
    i.status,
    i.category,
    `"${(i.name || '').replace(/"/g, '""')}"`,
    `"${(i.location || '').replace(/"/g, '""')}"`,
    i.date,
    i.isUrgent ? 'YES' : 'NO',
    i.contact,
    i.phone || ''
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `RNSIT_Lost_and_Found_Audit_${today()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Audit records downloaded as CSV! 📥', 'success');
}

// =============================================
//  TOAST ALERTS
// =============================================
function showToast(msg, type = 'success') {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all .3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// =============================================
//  HELPERS
// =============================================
function genId() { return 'rns_' + Math.random().toString(36).substr(2, 7) + '_' + Date.now().toString(36); }
function today() { return new Date().toISOString().split('T')[0]; }
function formatDate(d) {
  if (!d) return '—';
  try {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return d; }
}
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// =============================================
//  INITIALIZATION
// =============================================
(function init() {
  initTheme();
  const dateInp = document.getElementById('itemDate');
  if (dateInp) dateInp.value = today();

  seedData();
  const user = getCurrentUser();
  if (user) {
    updateNavAuth(user);
    const contactField = document.getElementById('itemContact');
    if (contactField) contactField.value = user.email;
    const phoneField = document.getElementById('itemPhone');
    if (phoneField && user.phone) phoneField.value = user.phone;
  }

  renderHome();
})();
