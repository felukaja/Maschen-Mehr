/* ═══════════════════════════════════════════════════════════════
   MASCHEN & MASSE — notizen.js
   Notizen-Screen: Render, Add, Delete + Supabase-Sync
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── NOTIZEN RENDERN ─────────────────────────────────────────
function renderNotizen() {
  renderNotizenList();
  renderNotizTodos();
}

function renderNotizenList() {
  const el = document.getElementById('notiz-list');
  if (!el) return;
  const notizen = appState.notizen || [];
  if (notizen.length === 0) {
    el.innerHTML = `<div class="card" style="text-align:center;padding:2rem;color:var(--textLight);">
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24" style="margin:0 auto 0.75rem;display:block;opacity:0.3;">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <p style="font-size:0.85rem;">Noch keine Notizen.</p>
    </div>`;
    return;
  }
  el.innerHTML = notizen.map(n => notizRowHTML(n)).join('');
}

function notizRowHTML(n) {
  const preview = (n.text || '').slice(0, 120).replace(/\n/g, ' ');
  const dateStr = n.date ? `<span style="font-size:0.7rem;color:var(--textFaint);margin-left:auto;">${n.date}</span>` : '';
  return `<div class="card notiz-card" id="notiz-card-${n.id}">
    <div class="flex align-c gap-sm" style="margin-bottom:0.4rem;">
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" style="color:var(--green);flex-shrink:0;">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
      ${dateStr}
      <button class="btn-delete" onclick="deleteNotiz(${n.id})" style="margin-left:auto;">
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
    <textarea class="notiz-textarea"
      id="notiz-ta-${n.id}"
      rows="3"
      onblur="saveNotizText(${n.id}, this.value)"
      style="width:100%;border:none;background:transparent;resize:vertical;font-size:0.86rem;
             color:var(--text);line-height:1.65;outline:none;font-family:var(--sans);
             min-height:56px;"
    >${escapeHtml(n.text||'')}</textarea>
  </div>`;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── NOTIZ HINZUFÜGEN ────────────────────────────────────────
function toggleNotizAdd() {
  const wrap = document.getElementById('notiz-add-wrap');
  if (!wrap) return;
  const isOpen = wrap.style.display !== 'none';
  wrap.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) {
    const ta = document.getElementById('notiz-new-text');
    if (ta) { ta.value = ''; ta.focus(); }
  }
}

async function saveNewNotiz() {
  const ta = document.getElementById('notiz-new-text');
  if (!ta) return;
  const text = ta.value.trim();
  if (!text) { showSnackbar('Bitte Text eingeben'); return; }

  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE', { day:'numeric', month:'short' });
  const notiz = {
    id: Date.now(),
    text,
    date: dateStr,
    _existsInDB: false,
  };

  appState.notizen = appState.notizen || [];
  appState.notizen.unshift(notiz);
  ta.value = '';
  toggleNotizAdd();
  renderNotizenList();

  // Supabase speichern
  await saveNotizToSupabase(notiz);
  showSnackbar('Notiz gespeichert ✓');
}

// ─── NOTIZ TEXT BEARBEITEN ────────────────────────────────────
async function saveNotizText(id, text) {
  const n = (appState.notizen || []).find(x => x.id === id);
  if (!n) return;
  if (n.text === text) return; // keine Änderung
  n.text = text;
  await saveNotizToSupabase(n);
}

// ─── NOTIZ LÖSCHEN ───────────────────────────────────────────
async function deleteNotiz(id) {
  const card = document.getElementById(`notiz-card-${id}`);
  if (card) card.classList.add('removing');
  setTimeout(async () => {
    appState.notizen = (appState.notizen || []).filter(n => n.id !== id);
    renderNotizenList();
    await deleteNotizFromSupabase(id);
  }, 250);
  showSnackbar('Notiz gelöscht');
}

// ─── TODO-LISTE IN NOTIZEN-SCREEN ────────────────────────────
function renderNotizTodos() {
  const el = document.getElementById('notiz-todo-list');
  if (!el) return;
  const active = (appState.todos || []).filter(t => !t.done).slice(0, 5);
  el.innerHTML = active.length === 0
    ? '<p class="txt-light" style="text-align:center;padding:0.75rem;font-size:0.82rem;">Keine offenen Aufgaben 🎉</p>'
    : active.map(t => todoRowHTML(t, 'notiz')).join('');
}
