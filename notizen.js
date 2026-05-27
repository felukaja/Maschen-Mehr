/* ═══════════════════════════════════════════════════════════════
   MASCHEN & MASSE — notizen.js
   Notizen-Screen, Todo-Verknüpfung, Anleitungsnotizen
   ═══════════════════════════════════════════════════════════════ */

'use strict';

function toggleNotizAdd() {
  const f = document.getElementById('notiz-add-form');
  if (!f) return;
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
  if (f.style.display === 'block') document.getElementById('notiz-new-text').focus();
}

function saveNewNotiz() {
  const text = document.getElementById('notiz-new-text').value.trim();
  if (!text) return;
  appState.notizen.unshift({ id: appState.nextNotizId++, text, date: 'Heute' });
  document.getElementById('notiz-new-text').value = '';
  document.getElementById('notiz-add-form').style.display = 'none';
  saveState();
  renderNotizen();
}

function renderNotizen() {
  // Allgemeine Notizen
  const nl = document.getElementById('notiz-list');
  if (nl) {
    nl.innerHTML = appState.notizen.length === 0
      ? '<p class="txt-light" style="text-align:center;padding:1rem;">Noch keine Notizen.</p>'
      : appState.notizen.map(n => `
        <div class="notiz-card">
          <div class="flex justify-sb align-c mb-sm">
            <span style="font-size:0.7rem;color:var(--textFaint);">${n.date||''}</span>
            <button onclick="deleteNotiz(${n.id})" style="background:none;border:none;cursor:pointer;color:var(--textFaint);font-size:0.85rem;">🗑</button>
          </div>
          <p style="font-size:0.86rem;color:var(--text);line-height:1.6;">${n.text}</p>
        </div>`).join('');
  }

  // Todos
  const tl = document.getElementById('notiz-todo-list');
  if (tl) {
    const open = appState.todos.filter(t => !t.done).slice(0, 4);
    tl.innerHTML = open.length === 0
      ? '<p class="txt-light" style="text-align:center;padding:0.75rem;">Keine offenen Aufgaben 🎉</p>'
      : open.map(t => todoRowHTML(t, 'notiz')).join('');
  }

  // Anleitungs-Notizen
  const pl = document.getElementById('notiz-pattern-list');
  if (pl) {
    const withNotes = appState.patterns.filter(p => p.notes && p.notes.some(n => n.text));
    pl.innerHTML = withNotes.length === 0
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
}

function deleteNotiz(id) {
  appState.notizen = appState.notizen.filter(n => n.id !== id);
  saveState();
  renderNotizen();
}
