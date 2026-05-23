# 🚀 Deploy Akshat Jain Portfolio to Render.com

**Single Web Service** — Express serves both the REST API and the frontend.  
Total time: ~20 minutes.

---

## 📁 Project Structure (what each file does)

```
akshat-portfolio/
│
├── server.js              ← Main entry point — starts Express server
├── package.json           ← Dependencies (express, mongoose, stripe, etc.)
├── render.yaml            ← Render deployment config
├── .env.example           ← Copy to .env and fill your keys
│
├── models/                ← MongoDB database schemas
│   ├── Admin.js           ← Admin user (login to dashboard)
│   ├── Project.js         ← Portfolio projects
│   ├── Contact.js         ← Contact form submissions
│   └── Order.js           ← Stripe payment orders
│
├── routes/                ← REST API endpoints
│   ├── auth.js            ← POST /api/auth/login, GET /api/auth/me
│   ├── projects.js        ← GET/POST/PUT/DELETE /api/projects
│   ├── contact.js         ← POST /api/contact (form), GET (admin)
│   └── payment.js         ← Stripe services, create-intent, orders
│
├── middleware/
│   └── auth.js            ← JWT token verification guard
│
├── config/
│   └── seed.js            ← Seeds DB with your projects + admin account
│
└── frontend/              ← Static HTML/CSS/JS served by Express
    ├── index.html         ← Home page with particle hero
    ├── admin.html         ← Admin dashboard (login protected)
    ├── images/akshat.png  ← Your professional photo
    ├── css/styles.css     ← Global dark theme design system
    ├── js/main.js         ← API client + scroll animations
    └── pages/
        ├── gallery.html   ← All projects with filter
        ├── case-study.html← Dynamic project detail page
        ├── about.html     ← Skills, timeline, certifications
        ├── contact.html   ← Contact form + Stripe payment
        └── services.html  ← Services & pricing
```

---

## STEP 1 — MongoDB Atlas (Free Cloud Database)

1. Go to **https://cloud.mongodb.com** → Sign Up (free)
2. Click **"Build a Database"** → **M0 FREE** → Region: **Mumbai (ap-south-1)**
3. Set a **Username** and **Password** (save these)
4. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
5. **Connect** → **Drivers** → Copy the connection string:
   ```
   mongodb+srv://akshat:<password>@cluster0.xxxxx.mongodb.net/akshat_portfolio
   ```
   Replace `<password>` with your actual password. Save this string.

---

## STEP 2 — Push to GitHub

1. Create a new repo at **https://github.com/new**  
   Name: `akshat-portfolio` | Visibility: Public | No README

2. In terminal, inside this project folder:
   ```bash
   git init
   git add .
   git commit -m "🚀 Initial portfolio deployment"
   git branch -M main
   git remote add origin https://github.com/Akshatj0707/akshat-portfolio.git
   git push -u origin main
   ```

---

## STEP 3 — Stripe Keys (Payment Feature)

1. **https://dashboard.stripe.com** → Sign Up → Stay in **Test Mode**
2. **Developers** → **API Keys** → Copy:
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`
3. Open **`frontend/pages/contact.html`** → Find:
   ```javascript
   stripe = Stripe('pk_test_your_stripe_publishable_key_here');
   ```
   Replace with your real `pk_test_...` key → Save → commit & push:
   ```bash
   git add . && git commit -m "Add Stripe publishable key" && git push
   ```

---

## STEP 4 — Deploy on Render

1. Go to **https://render.com** → Sign Up with GitHub
2. **New +** → **Web Service**
3. Connect GitHub → Select `akshat-portfolio` repo
4. Configure:

   | Setting | Value |
   |---------|-------|
   | **Name** | `akshat-portfolio` |
   | **Region** | Singapore |
   | **Branch** | `main` |
   | **Runtime** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `node server.js` |
   | **Plan** | Free |

5. **Environment Variables** — click "Add Environment Variable":

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | *(your Atlas connection string from Step 1)* |
   | `JWT_SECRET` | `AkshatJain_PortfolioJWT_SecretKey_2024!` |
   | `STRIPE_SECRET_KEY` | `sk_test_...` |
   | `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |
   | `ADMIN_EMAIL` | `akshatjain9804@gmail.com` |
   | `ADMIN_PASSWORD` | `Admin@Akshat2024!` |

6. Click **"Create Web Service"** → Wait 3–5 minutes

---

## STEP 5 — Seed Your Database

After the deployment shows **"Live"** in Render:

1. Open **Render Dashboard** → Your service → **Shell** tab
2. Run:
   ```bash
   node config/seed.js
   ```
3. You'll see:
   ```
   ✅  Connected to MongoDB
   ✅  Admin created: akshatjain9804@gmail.com
     ✓ E-Nagarpalika — Government Municipal Portal
     ✓ Uber Clone — Full-Stack Ride-Hailing
     ✓ Productivity Analytics Dashboard
     ✓ E-Nagarpalika: User ID & Authorization Portal
     ✓ Face Recognition Attendance System
   ✅  5 projects seeded successfully
   🎉  Database ready!
   ```

---

## STEP 6 — Set FRONTEND_URL

1. Copy your live Render URL (e.g. `https://akshat-portfolio.onrender.com`)
2. Render → **Environment** → Add:
   - Key: `FRONTEND_URL`
   - Value: `https://akshat-portfolio.onrender.com`
3. Render auto-redeploys (~2 min)

---

## ✅ Your Live URLs

| Page | URL |
|------|-----|
| Portfolio Home | `https://akshat-portfolio.onrender.com` |
| Projects Gallery | `.../pages/gallery.html` |
| About & Skills | `.../pages/about.html` |
| Contact & Hire | `.../pages/contact.html` |
| **Admin Dashboard** | `.../admin.html` |
| API Health | `.../api/health` |

**Admin Login:**
- Email: `akshatjain9804@gmail.com`
- Password: `Admin@Akshat2024!`

---

## 🧪 Test Stripe Payment

Use Stripe test card (no real charge):
- Card: `4242 4242 4242 4242`
- Expiry: `12/34`
- CVC: `123`
- Name: anything

---

## 🔄 Push Future Updates

```bash
git add .
git commit -m "Update portfolio"
git push
# Render auto-deploys in ~3 minutes
```

---

## ⚠️ Free Tier Notes

- Render Free spins down after 15 min idle → first request takes ~30 sec to wake up
- MongoDB Atlas M0 = 512 MB (plenty for a portfolio)
- Upgrade to Render Starter ($7/mo) for always-on + no spin-down

---

## 📱 Custom Domain (Free)

1. Render → **Settings** → **Custom Domains** → Add domain
2. Update DNS with the provided CNAME record
3. SSL is automatic

