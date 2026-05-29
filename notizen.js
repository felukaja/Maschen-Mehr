/* ═══════════════════════════════════════════════════════════════
   MASCHEN & MASSE — notizen.js v2
   Supabase-Sync, Inline-Editing
   ═══════════════════════════════════════════════════════════════ */

'use strict';

function toggleNotizAdd() {
  const f = document.getElementById('notiz-add-form');
  if (!f) return;
  const open = f.style.display !== 'none' && f.style.display !== '';
  f.style.display = open ? 'none' : 'block';
  if (!open) {
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
  const date = now.toLocaleDateString('de-DE', { day:'numeric', month:'short' });
  const notiz = { id: Date.now(), text, date, _existsInDB: false };
  appState.notizen = appState.notizen || [];
  appState.notizen.unshift(notiz);
  ta.value = '';
  document.getElementById('notiz-add-form').style.display = 'none';
  renderNotizen();
  await saveNotizToSupabase(notiz);
  showSnackbar('Notiz gespeichert ✓');
}

async function saveNotizText(id, text) {
  const n = (appState.notizen || []).find(x => x.id === id);
  if (!n || n.text === text) return;
  n.text = text;
  await saveNotizToSupabase(n);
}

async function deleteNotiz(id) {
  appState.notizen = (appState.notizen || []).filter(n => n.id !== id);
  renderNotizen();
  await deleteNotizFromSupabase(id);
  showSnackbar('Notiz gelöscht');
}

function renderNotizen() {
  renderNotizenList();
  renderNotizTodos();
  renderNotizPatterns();
}

function renderNotizenList() {
  const el = document.getElementById('notiz-list');
  if (!el) return;
  const notizen = appState.notizen || [];
  if (notizen.length === 0) {
    el.innerHTML = '<p class="txt-light" style="text-align:center;padding:1.5rem;">Noch keine Notizen.</p>';
    return;
  }
  el.innerHTML = notizen.map(n => `
    <div class="notiz-card" id="notiz-card-${n.id}">
      <div class="flex justify-sb align-c mb-sm">
        <span style="font-size:0.7rem;color:var(--textFaint);">${n.date||''}</span>
        <button class="btn-delete" onclick="deleteNotiz(${n.id})">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <textarea
        style="width:100%;border:none;background:transparent;resize:vertical;font-size:0.86rem;color:var(--text);line-height:1.6;outline:none;font-family:var(--sans);min-height:52px;"
        onblur="saveNotizText(${n.id}, this.value)"
      >${n.text||''}</textarea>
    </div>`).join('');
}

function renderNotizTodos() {
  const el = document.getElementById('notiz-todo-list');
  if (!el) return;
  const open = (appState.todos || []).filter(t => !t.done).slice(0, 4);
  el.innerHTML = open.length === 0
    ? '<p class="txt-light" style="text-align:center;padding:0.75rem;">Keine offenen Aufgaben 🎉</p>'
    : open.map(t => todoRowHTML(t, 'notiz')).join('');
}

function renderNotizPatterns() {
  const el = document.getElementById('notiz-pattern-list');
  if (!el) return;
  const withNotes = (appState.patterns || []).filter(p => p.notes && p.notes.some(n => n.text));
  el.innerHTML = withNotes.length === 0
    ? '<p class="txt-light" style="text-align:center;padding:1rem;">Noch keine Anleitungsnotizen.</p>'
    : withNotes.map(p => `
      <div class="notiz-pattern-card" onclick="openEditor(${p.id})">
        <div class="notiz-pattern-thumb">${p.emoji||'🧶'}</div>
        <div style="flex:1;min-width:0;">
          <p style="font-size:0.88rem;color:var(--text);font-weight:600;">${p.title}</p>
          <p class="txt-light" style="font-size:0.78rem;">${p.notes.filter(n=>n.text).length} Notiz(en)</p>
        </div>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" stroke="var(--textFaint)" stroke-width="2"/></svg>
      </div>`).join('');
}
