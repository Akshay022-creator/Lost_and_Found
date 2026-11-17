# 🔍 RNSIT Lost & Found

A community web application to help RNSIT students and staff report, discover, and reclaim lost belongings — fast, transparent, and trustworthy.

**Community Project · Course Code: 25BCBPR308 · Section C · Batch C1**

---

## 🚀 Live Demo

> Deploy link will appear here after hosting on Netlify/GitHub Pages.

---

## 📋 Features

| Feature | Description |
|---|---|
| **Report Items** | Report lost or found items with photos, category, location & date |
| **Search & Filter** | Filter by category, type (lost/found), status, and keyword |
| **Claim System** | Submit ownership claims with proof details |
| **Status Tracking** | Open → Claim Pending → Returned lifecycle for every item |
| **Admin Dashboard** | Manage all items, review/approve/reject claims, view stats |
| **Auth System** | Register/Login with role-based access (user/admin) |
| **Responsive UI** | Works on mobile, tablet, and desktop |

---

## 👥 Project Team

| USN | Name | Email |
|---|---|---|
| 1RX25CS032 | Atul Shrivastava | atulshrivastava25cs@rnsit.ac.in |
| 1IB25CS101 | Leona Marilyn Rego | leonamarilynrego25cs@rnsit.ac.in |
| 1RN25CS016 | Akshay Kaushik | akshaykaushik25cs@rnsit.ac.in |
| 1RN25CS013 | Ajjuguttu Pranay Krishna Reddy | ajjuguttupranaykrishnareddy25cs@rnsit.ac.in |

**Internal Guide:** Ms. Aishwarya G

---

## 🌍 SDG Alignment

- **SDG 11 – Sustainable Cities & Communities:** Contributes to safer, better-organised shared campus spaces.
- **SDG 16 – Peace, Justice & Strong Institutions:** Promotes trust and accountability through transparent claim handling.

---

## 🛠 Tech Stack

- **Frontend:** Pure HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage:** Browser `localStorage` (no backend required)
- **Hosting:** Netlify / GitHub Pages (static)
- **No frameworks, no npm, no build step needed**

---

## 🏃 Running Locally

Just open `index.html` in your browser — no server needed!

```bash
git clone https://github.com/YOUR_USERNAME/rnsit-lost-and-found.git
cd rnsit-lost-and-found
# Open index.html in browser
open index.html
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@rnsit.ac.in` | `admin123` |
| User | `akshaykaushik25cs@rnsit.ac.in` | `pass1234` |

---

## 📁 Project Structure

```
rnsit-lost-and-found/
├── index.html          # Main HTML (single-page app)
├── src/
│   ├── style.css       # Complete styles
│   └── app.js          # Full app logic (auth, routing, CRUD)
├── README.md
└── netlify.toml        # Netlify deployment config
```

---

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub
2. Go to **Settings → Pages → Deploy from branch → main → / (root)**
3. Access at `https://YOUR_USERNAME.github.io/rnsit-lost-and-found/`

### Netlify (Recommended)
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → New Site → Import from Git
3. Select the repo → Publish directory: `.` → Deploy
4. Live in ~1 minute with a free `*.netlify.app` URL

---

© 2026 RNSIT Lost & Found · Community Project
