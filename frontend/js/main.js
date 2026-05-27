// ═══════════════════════════════════════════════════════════
// AKSHAT JAIN PORTFOLIO — API Client & Common JS
// ═══════════════════════════════════════════════════════════

const API_BASE = '/api'; // Express serves both frontend + API from same origin

const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('admin_token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      },
      ...options
    };
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },
  get    : (endpoint)       => api.request(endpoint),
  post   : (endpoint, body) => api.request(endpoint, { method: 'POST',   body: JSON.stringify(body) }),
  put    : (endpoint, body) => api.request(endpoint, { method: 'PUT',    body: JSON.stringify(body) }),
  patch  : (endpoint, body) => api.request(endpoint, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete : (endpoint)       => api.request(endpoint, { method: 'DELETE' }),
};

// ── Toast Notifications ─────────────────────────────────────
function showToast(message, type = 'info', duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: 'check_circle', error: 'error', info: 'info' };
  const colors = { success: '#4ade80', error: 'var(--error)', info: 'var(--primary)' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined" style="color:${colors[type] || colors.info};font-size:20px;">${icons[type] || 'info'}</span>
    <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Scroll-triggered reveal animations ─────────────────────
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal, .stagger-parent').forEach(el => observer.observe(el));
}

// ── Scroll progress bar ────────────────────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = `${Math.min(pct, 100)}%`;
  }, { passive: true });
}

// ── Topbar scroll state ────────────────────────────────────
function initTopbar() {
  const bar = document.querySelector('.topbar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    bar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── Mobile nav ─────────────────────────────────────────────
function initMobileNav() {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.mobile-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    btn.textContent = nav.classList.contains('open') ? 'close' : 'menu';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    btn.textContent = 'menu';
  }));
}

// ── Active nav link ────────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const isActive =
      (href === '/' && (path === '/' || path === '/index.html')) ||
      (href !== '/' && path.includes(href.replace('/pages/', '').replace('.html', '')));
    link.classList.toggle('active', isActive);
  });
}

// ── Live clock (IST) ───────────────────────────────────────
function initClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;
  const update = () => {
    el.textContent = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
    }) + ' IST';
  };
  update();
  setInterval(update, 30000);
}

// ── Init all on DOM ready ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initScrollProgress();
  initTopbar();
  initMobileNav();
  setActiveNav();
  initClock();
});

// Expose globally
window.api       = api;
window.showToast = showToast;
window.initReveal = initReveal;
