/* =============================================
   RNSIT Lost & Found — app.js
   Full client-side application with localStorage
   ============================================= */

'use strict';

// =============================================
//  DATA STORE (localStorage)
// =============================================
const KEYS = {
  users: 'lf_users',
  items: 'lf_items',
  claims: 'lf_claims',
  currentUser: 'lf_current_user',
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
//  SEED DATA
// =============================================
function seedData() {
  // Seed admin user
  if (!getStore(KEYS.users).length) {
    const users = [
      { id: 'u1', name: 'Admin', email: 'admin@rnsit.ac.in', password: 'admin123', usn: '', role: 'admin', createdAt: '2026-10-01' },
      { id: 'u2', name: 'Akshay Kaushik', email: 'akshaykaushik25cs@rnsit.ac.in', password: 'pass1234', usn: '1RN25CS016', role: 'user', createdAt: '2026-10-10' },
      { id: 'u3', name: 'Leona Marilyn Rego', email: 'leonamarilynrego25cs@rnsit.ac.in', password: 'pass1234', usn: '1IB25CS101', role: 'user', createdAt: '2026-10-11' },
    ];
    setStore(KEYS.users, users);
  }

  if (!getStore(KEYS.items).length) {
    const items = [
      {
        id: 'i1', type: 'Lost', status: 'Open', category: 'Electronics',
        name: 'Apple AirPods Pro (White)', location: 'Library – 2nd Floor',
        date: '2026-11-10', desc: 'Lost my AirPods Pro in white charging case near the study tables on the 2nd floor of the library. Has a small blue sticker on the case lid.',
        contact: 'akshaykaushik25cs@rnsit.ac.in', photo: '', reportedBy: 'u2', createdAt: '2026-11-10',
      },
      {
        id: 'i2', type: 'Found', status: 'Open', category: 'ID/Cards',
        name: 'RNSIT Student ID Card', location: 'Block A – Ground Floor Corridor',
        date: '2026-11-12', desc: 'Found an RNSIT student ID card near the main staircase. Contact to claim with student details.',
        contact: 'leonamarilynrego25cs@rnsit.ac.in', photo: '', reportedBy: 'u3', createdAt: '2026-11-12',
      },
      {
        id: 'i3', type: 'Found', status: 'Claim Pending', category: 'Keys',
        name: 'Set of Keys (3 keys on a blue keychain)', location: 'Canteen',
        date: '2026-11-14', desc: 'Found a set of 3 keys on a blue keychain near the canteen entrance. Keys have a small bike key among them.',
        contact: 'admin@rnsit.ac.in', photo: '', reportedBy: 'u1', createdAt: '2026-11-14',
      },
      {
        id: 'i4', type: 'Lost', status: 'Returned', category: 'Bags',
        name: 'Black JanSport Backpack', location: 'Computer Lab – Block C',
        date: '2026-11-08', desc: 'Black JanSport backpack with laptop and notebook inside. Has a "RN26" written tag. Returned successfully!',
        contact: 'akshaykaushik25cs@rnsit.ac.in', photo: '', reportedBy: 'u2', createdAt: '2026-11-08',
      },
      {
        id: 'i5', type: 'Found', status: 'Open', category: 'Accessories',
        name: 'Silver Wristwatch (Casio)', location: 'Sports Ground',
        date: '2026-11-15', desc: 'Found a silver Casio digital wristwatch near the basketball court on the sports ground.',
        contact: 'admin@rnsit.ac.in', photo: '', reportedBy: 'u1', createdAt: '2026-11-15',
      },
      {
        id: 'i6', type: 'Lost', status: 'Open', category: 'Books',
        name: 'Operating Systems Textbook (Silberschatz)', location: 'Block B – Classroom 204',
        date: '2026-11-16', desc: 'Lost my blue-covered OS textbook by Silberschatz. Has my name "Pranay" written inside the front cover.',
        contact: 'admin@rnsit.ac.in', photo: '', reportedBy: 'u1', createdAt: '2026-11-16',
      },
    ];
    setStore(KEYS.items, items);
  }

  if (!getStore(KEYS.claims).length) {
    const claims = [
      {
        id: 'c1', itemId: 'i3', userId: 'u2', userName: 'Akshay Kaushik',
        proof: 'The bike key is a Honda Activa key and there is a small red rubber band on the keychain.',
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
//  NAVIGATION
// =============================================
let previousPage = 'home';
let currentPage = 'home';

function showPage(page) {
  // Auth guard
  const protectedPages = ['report', 'myclaims', 'admin'];
  if (protectedPages.includes(page) && !getCurrentUser()) {
    showToast('Please login to access this page.', 'warning');
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
  document.getElementById('navLinks').classList.remove('open');

  // Page-specific init
  if (page === 'home') renderHome();
  if (page === 'browse') { renderBrowse(); }
  if (page === 'admin') renderAdmin();
  if (page === 'myclaims') renderMyClaims();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() { showPage(previousPage || 'browse'); }

// Hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// =============================================
//  AUTH
// =============================================
function login(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const users = getStore(KEYS.users);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    showError('loginError', 'Invalid email or password.');
    return;
  }
  setCurrentUser(user);
  updateNavAuth(user);
  showToast(`Welcome back, ${user.name}! 👋`, 'success');
  showPage('home');
}

function register(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const usn = document.getElementById('regUSN').value.trim();
  const password = document.getElementById('regPassword').value;

  const users = getStore(KEYS.users);
  if (users.find(u => u.email === email)) {
    showError('regError', 'An account with this email already exists.');
    return;
  }
  const newUser = {
    id: genId(), name, email, password, usn, role: 'user', createdAt: today(),
  };
  users.push(newUser);
  setStore(KEYS.users, users);
  setCurrentUser(newUser);
  updateNavAuth(newUser);
  showToast(`Account created! Welcome, ${name}! 🎉`, 'success');
  showPage('home');
}

function logout() {
  setCurrentUser(null);
  updateNavAuth(null);
  showToast('Logged out successfully.', 'success');
  showPage('home');
}

function updateNavAuth(user) {
  const authBtn = document.getElementById('authBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminNavItem = document.getElementById('adminNavItem');
  const userName = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');

  if (user) {
    authBtn.style.display = 'none';
    logoutBtn.style.display = '';
    userName.textContent = user.name.split(' ')[0];
    userAvatar.textContent = user.name[0].toUpperCase();
    adminNavItem.style.display = user.role === 'admin' ? '' : 'none';
  } else {
    authBtn.style.display = '';
    logoutBtn.style.display = 'none';
    adminNavItem.style.display = 'none';
  }
}

function togglePwd(id) {
  const inp = document.getElementById(id);
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function showError(id, msg) {
  const el = document.getElementById(id);
  el.style.display = '';
  el.textContent = msg;
}

// =============================================
//  RENDER HOME
// =============================================
function renderHome() {
  const items = getStore(KEYS.items);
  document.getElementById('statTotal').textContent = items.length;
  document.getElementById('statFound').textContent = items.filter(i => i.status === 'Returned').length;
  document.getElementById('statOpen').textContent = items.filter(i => i.status === 'Open').length;

  const recent = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  document.getElementById('recentItems').innerHTML = recent.map(itemCard).join('');
}

// =============================================
//  RENDER BROWSE
// =============================================
let reportType = 'Lost';

function renderBrowse() {
  filterItems();
}

function filterItems() {
  const q = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  const cat = document.getElementById('filterCategory')?.value || '';
  const type = document.getElementById('filterType')?.value || '';
  const status = document.getElementById('filterStatus')?.value || '';

  const items = getStore(KEYS.items);
  let filtered = items.filter(item => {
    const matchQ = !q || item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
    const matchCat = !cat || item.category === cat;
    const matchType = !type || item.type === type;
    const matchStatus = !status || item.status === status;
    return matchQ && matchCat && matchType && matchStatus;
  });

  filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const grid = document.getElementById('browseItems');
  const empty = document.getElementById('browseEmpty');
  const info = document.getElementById('resultsInfo');

  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = '';
    info.textContent = 'No items match your search.';
  } else {
    empty.style.display = 'none';
    info.textContent = `Showing ${filtered.length} item${filtered.length !== 1 ? 's' : ''}`;
    grid.innerHTML = filtered.map(itemCard).join('');
  }
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('filterCategory').value = '';
  document.getElementById('filterType').value = '';
  document.getElementById('filterStatus').value = '';
  filterItems();
}

// =============================================
//  ITEM CARD
// =============================================
function itemCard(item) {
  const statusClass = { Open: 'badge-open', 'Claim Pending': 'badge-claim', Returned: 'badge-returned' }[item.status] || 'badge-open';
  const photoHtml = item.photo
    ? `<div class="card-image"><img src="${item.photo}" alt="${escHtml(item.name)}" /></div>`
    : `<div class="card-image">${categoryIcon(item.category)}</div>`;
  return `
  <div class="item-card" onclick="showDetail('${item.id}')">
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
//  ITEM DETAIL
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
    : `<div class="detail-image" style="font-size:7rem; height:220px;">${categoryIcon(item.category)}</div>`;

  let actionBtns = '';
  if (item.type === 'Found' && item.status === 'Open' && user && !isOwner && !userHasClaim) {
    actionBtns += `<button class="btn btn-primary" onclick="openClaimModal('${item.id}')">📝 Submit a Claim</button>`;
  }
  if (userHasClaim) {
    const cl = userHasClaim;
    actionBtns += `<span class="badge status-${cl.status.toLowerCase()}" style="padding:.5rem 1rem; font-size:.85rem;">Your claim: ${cl.status}</span>`;
  }
  if (isOwner && item.status !== 'Returned') {
    actionBtns += `<button class="btn btn-danger btn-sm" onclick="deleteItem('${item.id}')">🗑 Delete Report</button>`;
  }
  if (isAdmin) {
    const statuses = ['Open', 'Claim Pending', 'Returned'];
    actionBtns += `<select onchange="adminChangeStatus('${item.id}', this.value)" class="filter-select" style="font-size:.8rem;">
      ${statuses.map(s => `<option ${s === item.status ? 'selected' : ''}>${s}</option>`).join('')}
    </select>`;
  }

  document.getElementById('detailCard').innerHTML = `
    ${photoHtml}
    <div class="detail-body">
      <div class="detail-header">
        <div>
          <div class="card-badges" style="margin-bottom:.6rem;">
            <span class="badge ${item.type === 'Lost' ? 'badge-lost' : 'badge-found'}">${item.type}</span>
            <span class="badge ${statusClass}">${item.status}</span>
            <span class="badge badge-category">${item.category}</span>
          </div>
          <div class="detail-title">${escHtml(item.name)}</div>
        </div>
      </div>
      <div class="detail-meta">
        <div class="detail-meta-item">
          <span class="label">📍 Location</span>
          <span class="value">${escHtml(item.location)}</span>
        </div>
        <div class="detail-meta-item">
          <span class="label">📅 Date</span>
          <span class="value">${formatDate(item.date)}</span>
        </div>
        <div class="detail-meta-item">
          <span class="label">📂 Category</span>
          <span class="value">${item.category}</span>
        </div>
        <div class="detail-meta-item">
          <span class="label">📧 Contact</span>
          <span class="value"><a href="mailto:${item.contact}">${item.contact}</a></span>
        </div>
      </div>
      <div class="detail-desc">
        <h4>Description</h4>
        <p>${escHtml(item.desc)}</p>
      </div>
      <div class="detail-actions">${actionBtns}</div>
    </div>`;

  showPage('detail');
}

// =============================================
//  REPORT ITEM
// =============================================
function setReportType(type) {
  reportType = type;
  document.getElementById('toggleLost').classList.toggle('active', type === 'Lost');
  document.getElementById('toggleFound').classList.toggle('active', type === 'Found');
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

  const newItem = {
    id: genId(), type: reportType, status: 'Open',
    name, category, date, location, desc, contact,
    photo: photoBase64 || '', reportedBy: user.id, createdAt: today(),
  };

  const items = getStore(KEYS.items);
  items.push(newItem);
  setStore(KEYS.items, items);

  document.getElementById('reportForm').reset();
  document.getElementById('photoPreview').style.display = 'none';
  photoBase64 = '';
  setReportType('Lost');

  showToast('Item reported successfully! 🎉', 'success');
  showPage('browse');
}

let photoBase64 = '';
function previewPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Photo must be under 5MB.', 'error'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    photoBase64 = ev.target.result;
    const preview = document.getElementById('photoPreview');
    preview.src = photoBase64;
    preview.style.display = '';
  };
  reader.readAsDataURL(file);
}

// =============================================
//  CLAIM
// =============================================
function openClaimModal(itemId) {
  if (!getCurrentUser()) { showPage('login'); return; }
  document.getElementById('claimItemId').value = itemId;
  document.getElementById('claimProof').value = '';
  document.getElementById('claimPhone').value = '';
  document.getElementById('claimModal').classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function submitClaim(e) {
  e.preventDefault();
  const user = getCurrentUser();
  if (!user) { showPage('login'); return; }

  const itemId = document.getElementById('claimItemId').value;
  const proof = document.getElementById('claimProof').value.trim();
  const phone = document.getElementById('claimPhone').value.trim();

  const claims = getStore(KEYS.claims);
  if (claims.find(c => c.itemId === itemId && c.userId === user.id)) {
    showToast('You already submitted a claim for this item.', 'warning');
    closeModal('claimModal');
    return;
  }

  const newClaim = {
    id: genId(), itemId, userId: user.id, userName: user.name,
    proof, phone, status: 'Pending', submittedAt: today(),
  };
  claims.push(newClaim);
  setStore(KEYS.claims, claims);

  // Update item status
  const items = getStore(KEYS.items);
  const idx = items.findIndex(i => i.id === itemId);
  if (idx !== -1) { items[idx].status = 'Claim Pending'; setStore(KEYS.items, items); }

  closeModal('claimModal');
  showToast('Claim submitted! Admin will review it shortly. 📝', 'success');
  showDetail(itemId);
}

// =============================================
//  MY CLAIMS
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
      <h3>No claims yet</h3>
      <p>Browse items and submit a claim if you find something that belongs to you.</p>
      <button class="btn btn-primary" onclick="showPage('browse')">Browse Items</button>
    </div>`;
    return;
  }

  el.innerHTML = `<div class="claims-list">${claims.map(c => {
    const item = items.find(i => i.id === c.itemId);
    const statusCls = { Pending: 'status-pending', Approved: 'status-approved', Rejected: 'status-rejected' }[c.status] || '';
    return `<div class="claim-card">
      <div class="claim-card-header">
        <div>
          <h4>${item ? escHtml(item.name) : 'Item not found'}</h4>
          <p>Category: ${item?.category || '—'} · Location: ${item?.location || '—'}</p>
        </div>
        <span class="status-badge ${statusCls}">${c.status}</span>
      </div>
      <p><strong>Your proof:</strong> ${escHtml(c.proof)}</p>
      <p class="mt-1" style="font-size:.8rem; color:var(--text-light);">Submitted: ${formatDate(c.submittedAt)}</p>
      ${item ? `<button class="btn btn-outline btn-sm mt-2" onclick="showDetail('${item.id}')">View Item</button>` : ''}
    </div>`;
  }).join('')}</div>`;
}

// =============================================
//  ADMIN
// =============================================
function renderAdmin() {
  renderAdminItems();
  renderAdminClaims();
  renderAdminUsers();
  renderAdminStats();
}

function switchTab(id, btn) {
  document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = '';
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function renderAdminItems() {
  const items = getStore(KEYS.items);
  const el = document.getElementById('adminItems');
  if (!el) return;
  el.innerHTML = `
  <div style="overflow-x:auto;">
  <table class="admin-table">
    <thead><tr>
      <th>Name</th><th>Type</th><th>Category</th><th>Location</th><th>Date</th><th>Status</th><th>Actions</th>
    </tr></thead>
    <tbody>${items.map(item => `<tr>
      <td><strong>${escHtml(item.name)}</strong></td>
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
  if (!claims.length) { el.innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><h3>No claims yet</h3></div>'; return; }
  el.innerHTML = `
  <div style="overflow-x:auto;">
  <table class="admin-table">
    <thead><tr><th>Claimant</th><th>Item</th><th>Proof</th><th>Phone</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>${claims.map(c => {
      const item = items.find(i => i.id === c.itemId);
      const statusCls = { Pending: 'status-pending', Approved: 'status-approved', Rejected: 'status-rejected' }[c.status] || '';
      return `<tr>
        <td><strong>${escHtml(c.userName)}</strong></td>
        <td>${item ? escHtml(item.name) : '—'}</td>
        <td style="max-width:200px; font-size:.8rem;">${escHtml(c.proof.substring(0,80))}…</td>
        <td>${c.phone || '—'}</td>
        <td>${formatDate(c.submittedAt)}</td>
        <td><span class="status-badge ${statusCls}">${c.status}</span></td>
        <td style="display:flex; gap:.4rem; flex-wrap:wrap;">
          ${c.status === 'Pending' ? `
            <button class="btn btn-sm btn-success" onclick="adminApproveClaim('${c.id}')">✓ Approve</button>
            <button class="btn btn-sm btn-danger" onclick="adminRejectClaim('${c.id}')">✗ Reject</button>
          ` : ''}
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
    <thead><tr><th>Name</th><th>Email</th><th>USN</th><th>Role</th><th>Joined</th></tr></thead>
    <tbody>${users.map(u => `<tr>
      <td><strong>${escHtml(u.name)}</strong></td>
      <td>${escHtml(u.email)}</td>
      <td>${u.usn || '—'}</td>
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
    <div class="stats-card"><div class="big">${items.length}</div><div class="label">Total Items</div></div>
    <div class="stats-card"><div class="big">${items.filter(i=>i.type==='Lost').length}</div><div class="label">Lost Reports</div></div>
    <div class="stats-card"><div class="big">${items.filter(i=>i.type==='Found').length}</div><div class="label">Found Reports</div></div>
    <div class="stats-card"><div class="big">${items.filter(i=>i.status==='Returned').length}</div><div class="label">Items Returned</div></div>
    <div class="stats-card"><div class="big">${claims.length}</div><div class="label">Total Claims</div></div>
    <div class="stats-card"><div class="big">${claims.filter(c=>c.status==='Pending').length}</div><div class="label">Pending Claims</div></div>
    <div class="stats-card"><div class="big">${users.length}</div><div class="label">Registered Users</div></div>
    <div class="stats-card"><div class="big">${items.filter(i=>i.status==='Open').length}</div><div class="label">Open Reports</div></div>
  </div>
  <h3 style="margin-bottom:1rem; font-size:1.1rem;">Items by Category</h3>
  <div style="display:flex; flex-wrap:wrap; gap:.75rem;">
    ${Object.entries(catCounts).map(([cat, count]) => `
      <div style="background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:.75rem 1.25rem; display:flex; gap:.5rem; align-items:center;">
        <span style="font-size:1.5rem;">${categoryIcon(cat)}</span>
        <div><div style="font-weight:700;">${count}</div><div style="font-size:.78rem; color:var(--text-muted);">${cat}</div></div>
      </div>
    `).join('')}
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
  if (!confirm('Delete this item report? This cannot be undone.')) return;
  const items = getStore(KEYS.items).filter(i => i.id !== itemId);
  setStore(KEYS.items, items);
  showToast('Item deleted.', 'success');
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
    showToast('Claim approved! Item marked as Returned.', 'success');
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
    // Reset item to Open if no more pending claims
    const remaining = claims.filter(c => c.itemId === itemId && c.status === 'Pending');
    if (!remaining.length) adminChangeStatus(itemId, 'Open');
    showToast('Claim rejected.', 'error');
    renderAdmin();
  }
}

function deleteItem(itemId) {
  if (!confirm('Delete your report?')) return;
  const items = getStore(KEYS.items).filter(i => i.id !== itemId);
  setStore(KEYS.items, items);
  showToast('Report deleted.', 'success');
  showPage('browse');
}

// =============================================
//  TOAST NOTIFICATIONS
// =============================================
function showToast(msg, type = 'success') {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = 'all .3s'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// =============================================
//  UTILS
// =============================================
function genId() { return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now(); }
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
//  INIT
// =============================================
(function init() {
  // Set today's date as default for report form
  document.getElementById('itemDate').value = today();

  seedData();
  const user = getCurrentUser();
  if (user) updateNavAuth(user);

  // Set default contact from logged-in user
  const contactField = document.getElementById('itemContact');
  if (user && contactField) contactField.value = user.email;

  renderHome();
})();
