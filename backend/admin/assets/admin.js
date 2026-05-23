/* =============================================
   AMA Admin Panel — Shared JavaScript
   ============================================= */

const API = window.location.origin + '/api';

// ── Token helpers ──────────────────────────────
function getToken()       { return localStorage.getItem('ama_token'); }
function setToken(t)      { localStorage.setItem('ama_token', t); }
function clearToken()     { localStorage.removeItem('ama_token'); }

// ── Auth headers ───────────────────────────────
function authHeaders(extra = {}) {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}`, ...extra };
}

// ── Fetch wrapper ──────────────────────────────
async function apiFetch(path, opts = {}) {
  const res = await fetch(API + path, { headers: authHeaders(), ...opts });
  const data = await res.json();
  if (res.status === 401) { clearToken(); window.location.href = '/admin/login.html'; return; }
  return data;
}

// ── Toast notifications ────────────────────────
function showToast(message, type = 'success', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.success}" style="color:var(--${type==='success'?'success':type==='error'?'danger':'info'})"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100px)'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, duration);
}

// ── Auth guard ─────────────────────────────────
async function requireAuth() {
  const token = getToken();
  if (!token) { window.location.href = '/admin/login.html'; return false; }
  try {
    const res = await fetch(API + '/auth/verify', { headers: authHeaders() });
    if (!res.ok) { clearToken(); window.location.href = '/admin/login.html'; return false; }
    const data = await res.json();
    const el = document.getElementById('adminUsername');
    if (el) el.textContent = data.admin?.username || 'admin';
    return true;
  } catch { clearToken(); window.location.href = '/admin/login.html'; return false; }
}

// ── Logout ─────────────────────────────────────
function logout() {
  clearToken();
  window.location.href = '/admin/login.html';
}

// ── Sidebar toggle (mobile) ────────────────────
function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) sidebar.classList.remove('open');
    });
  }
  // Highlight active nav link
  const links = document.querySelectorAll('.sidebar-nav a');
  links.forEach(l => { if (l.href === window.location.href) l.classList.add('active'); });
}

// ── Modal helpers ──────────────────────────────
function openModal(id)  { const m = document.getElementById(id); if (m) m.classList.add('open'); }
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('open'); }

// ── Format date ────────────────────────────────
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── Status badge ───────────────────────────────
function statusBadge(status) {
  const labels = { new: 'New', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled' };
  return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
}

// ── Init on load ───────────────────────────────
document.addEventListener('DOMContentLoaded', initSidebar);
