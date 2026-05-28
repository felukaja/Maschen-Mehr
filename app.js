/* ═══════════════════════════════════════════════════════════════
   MASCHEN & MASSE — app.js
   Core: State, Routing, Login, Todos, Export/Import, Settings
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── PASSWORD ────────────────────────────────────────────────
// Ersetze MEINPASSWORT mit deinem Passwort
const APP_PWD = 'MEINPASSWORT';

// ─── STATE ───────────────────────────────────────────────────
let appState = {
  patterns: [
    {id:1, emoji:'🧶', title:'Boho Schultertasche', needle:'4,5 mm', mat:'Baumwolle', diff:2, status:'open',
     kat:'Tasche', tags:['Sommer','Baumwolle'], maschen:['Feste Maschen','Shell / Muschel'],
     gaugeM:18, gaugeR:12, baseBust:91, images:[], text:'', schnitt:[], yarns:[], notes:[], counters:[], markers:[]},
    {id:2, emoji:'🌿', title:'Frühlingscardigan', needle:'3,5 mm', mat:'Bambus-Blend', diff:2, status:'draft',
     kat:'Cardigan', tags:['Frühling','Bambus'], maschen:['Stäbchen','Rippenmuster (FP/BP)'],
     gaugeM:20, gaugeR:14, baseBust:91, images:[], text:'', schnitt:[], yarns:[], notes:[], counters:[], markers:[]},
    {id:3, emoji:'🍀', title:'Granny Deckchen', needle:'2,5 mm', mat:'Baumwolle', diff:1, status:'pub',
     kat:'Accessoire', tags:['Granny Square'], maschen:['Granny Square','Kettmasche'],
     gaugeM:22, gaugeR:16, baseBust:null, images:[], text:'', schnitt:[], yarns:[], notes:[], counters:[], markers:[]},
  ],
  todos: [
    {id:1, text:'Fotos für „Frühlingscardigan" machen', date:'2026-05-30', cat:'Fotos', done:false},
    {id:2, text:'Maschenprobe für „Boho Decke"', date:'2026-05-27', cat:'Testen', done:true},
    {id:3, text:'Garnbestellung aufgeben', date:'', cat:'', done:false},
  ],
  notizen: [
    {id:1, text:'Garnbestellung Drops — Farbton Waldgrün (Nr. 18) für Frühlingscardigan. Eventuell auch Terrakotta testen.', date:'Heute'},
  ],
  profil: { name:'Hannah', groesse:'damen_m', brust:'', taille:'', hufte:'', hoehe:'', kopf:'', fuss:'' },
  settings: { unit:'cm', yarnSys:'cyc' },
  nextPatternId: 4,
  nextTodoId: 4,
  nextNotizId: 2,
};

let currentScreen = 'login';
let historyStack = [];
let currentPatternId = null;
let lastRemovedTodo = null;
let snackTimer = null;

// ─── BODY MEASUREMENTS (CYC 2018) ───────────────────────────
const BODY_MEASUREMENTS = {
  damen_xxs: { bust:73.5, waist:58.5, hip:81.5, back:38.5, sleeve:42.5, shoulder:34.5, armhole:16.5 },
  damen_xs:  { bust:78.5, waist:63.5, hip:86.5, back:39.5, sleeve:43,   shoulder:35.5, armhole:17 },
  damen_s:   { bust:83.5, waist:68.5, hip:91.5, back:40.5, sleeve:43.5, shoulder:36.5, armhole:17.5 },
  damen_m:   { bust:93.5, waist:78.5, hip:101.5,back:42,   sleeve:44.5, shoulder:38,   armhole:18.5 },
  damen_l:   { bust:103.5,waist:88.5, hip:111.5,back:43.5, sleeve:45,   shoulder:40,   armhole:19.5 },
  damen_xl:  { bust:113.5,waist:98.5, hip:121.5,back:44.5, sleeve:46,   shoulder:41.5, armhole:20.5 },
  damen_2xl: { bust:124,  waist:109,  hip:132,  back:45.5, sleeve:46.5, shoulder:43,   armhole:21.5 },
  damen_3xl: { bust:134.5,waist:119,  hip:142.5,back:46,   sleeve:47,   shoulder:44.5, armhole:22 },
  damen_4xl: { bust:144.5,waist:129,  hip:152.5,back:46.5, sleeve:47,   shoulder:46,   armhole:22.5 },
  damen_5xl: { bust:155,  waist:139.5,hip:162.5,back:47,   sleeve:47.5, shoulder:47,   armhole:23 },
  herren_xs: { bust:83.5, waist:68.5, hip:86.5, back:40.5, sleeve:47,   shoulder:37,   armhole:19 },
  herren_s:  { bust:88.5, waist:73.5, hip:91.5, back:41.5, sleeve:47.5, shoulder:38,   armhole:19.5 },
  herren_m:  { bust:98.5, waist:83.5, hip:101.5,back:43,   sleeve:48.5, shoulder:40,   armhole:21 },
  herren_l:  { bust:108.5,waist:93.5, hip:111.5,back:44.5, sleeve:50,   shoulder:42,   armhole:22 },
  herren_xl: { bust:118.5,waist:103.5,hip:121.5,back:45.5, sleeve:51,   shoulder:44,   armhole:23 },
  herren_2xl:{ bust:129.5,waist:114.5,hip:132.5,back:46.5, sleeve:51.5, shoulder:46,   armhole:24 },
  herren_3xl:{ bust:139.5,waist:124.5,hip:142.5,back:47,   sleeve:52,   shoulder:47,   armhole:24.5 },
  herren_4xl:{ bust:149.5,waist:134.5,hip:152.5,back:48,   sleeve:52.5, shoulder:49,   armhole:25 },
  kind_2j:   { bust:53,   waist:52,   hip:53,   back:25,   sleeve:25 },
  kind_4j:   { bust:57,   waist:53,   hip:58,   back:28,   sleeve:29 },
  kind_6j:   { bust:60,   waist:55,   hip:62,   back:31,   sleeve:33 },
  kind_8j:   { bust:64,   waist:57,   hip:67,   back:34,   sleeve:37 },
  kind_10j:  { bust:68,   waist:60,   hip:72,   back:37,   sleeve:41 },
  kind_12j:  { bust:74,   waist:63,   hip:79,   back:40,   sleeve:46 },
  kind_14j:  { bust:80,   waist:66,   hip:86,   back:43,   sleeve:50 },
  kind_16j:  { bust:86,   waist:69,   hip:92,   back:44.5, sleeve:52 },
  baby_nb:   { bust:37,   waist:37,   hip:37,   back:29 },
  baby_0_3:  { bust:39.5, waist:39.5, hip:39.5, back:30.5 },
  baby_3_6:  { bust:42,   waist:42,   hip:42,   back:34 },
  baby_6_12: { bust:45.5, waist:45.5, hip:45.5, back:38.5 },
  baby_12_18:{ bust:49.5, waist:49.5, hip:49.5, back:42.5 },
  baby_18_24:{ bust:52,   waist:52,   hip:52,   back:45.5 },
};

// ─── ROUTING ─────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (!el) return;
  el.classList.add('active');
  currentScreen = id;
  const sb = el.querySelector('.scroll-body');
  if (sb) sb.scrollTop = 0;

  // Nav highlight
  ['dashboard','anleitungen','rechner','notizen','mehr'].forEach(n => {
    const nb = document.getElementById('nav-' + n);
    if (nb) nb.classList.toggle('active', n === id);
  });
}

function navTo(id) {
  if (currentScreen === id) return;
  historyStack.push(currentScreen);
  showScreen(id);
  // Screen-specific init
  if (id === 'dashboard')    { updateGreeting(); renderDashPatterns(); renderDashTodos(); }
  if (id === 'anleitungen')  { renderAnleitungen('alle'); }
  if (id === 'todos')        { renderTodoFull(); }
  if (id === 'notizen')      { renderNotizen(); }
  if (id === 'rechner')      { /* nothing */ }
  if (id === 'calc-nadel')   { renderNadelTable(); }
  if (id === 'calc-staerke') { renderStaerkeTable(); }
  if (id === 'calc-mp')      { renderCalcMP(); }
  if (id === 'calc-groesse') { renderCalcGroesse(); }
  if (id === 'calc-mass')    { renderCalcMass(); }
  if (id === 'calc-garn')    { renderCalcGarn(); }
}

function goBack() {
  if (historyStack.length > 0) {
    showScreen(historyStack.pop());
  }
}

// ─── LOGIN ────────────────────────────────────────────────────
function doLogin() {
  const val = document.getElementById('login-pwd').value;
  if (val === APP_PWD) {
    document.getElementById('bottom-nav').style.display = 'block';
    document.getElementById('login-err').style.display = 'none';
    historyStack = [];
    loadState();
    navTo('dashboard');
  } else {
    document.getElementById('login-err').style.display = 'block';
    document.getElementById('login-pwd').value = '';
  }
}

function doLogout() {
  document.getElementById('bottom-nav').style.display = 'none';
  historyStack = [];
  currentPatternId = null;
  showScreen('login');
}

// ─── STATE PERSISTENCE ───────────────────────────────────────
function saveState() {
  try {
    localStorage.setItem('mm_state', JSON.stringify(appState));
  } catch(e) { console.warn('Save failed:', e); }
}

function loadState() {
  try {
    const saved = localStorage.getItem('mm_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge carefully to preserve structure
      if (parsed.patterns)  appState.patterns  = parsed.patterns;
      if (parsed.todos)     appState.todos      = parsed.todos;
      if (parsed.notizen)   appState.notizen    = parsed.notizen;
      if (parsed.profil)    appState.profil     = { ...appState.profil, ...parsed.profil };
      if (parsed.settings)  appState.settings   = { ...appState.settings, ...parsed.settings };
      if (parsed.nextPatternId) appState.nextPatternId = parsed.nextPatternId;
      if (parsed.nextTodoId)    appState.nextTodoId    = parsed.nextTodoId;
      if (parsed.nextNotizId)   appState.nextNotizId   = parsed.nextNotizId;
    }
  } catch(e) { console.warn('Load failed:', e); }

  // Apply profil
  if (appState.profil.name) {
    const el = document.getElementById('profil-name');
    if (el) el.value = appState.profil.name;
  }
  applySettings();
}

function exportData() {
  const blob = new Blob([JSON.stringify(appState, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'maschen-masze-backup.json';
  a.click();
  URL.revokeObjectURL(url);
  showSnackbar('Backup gespeichert ✓');
}

function importData(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.patterns) {
        appState = { ...appState, ...data };
        saveState();
        showSnackbar('Import erfolgreich ✓');
        navTo('dashboard');
      } else {
        showSnackbar('Ungültige Datei');
      }
    } catch { showSnackbar('Fehler beim Import'); }
  };
  reader.readAsText(file);
}

// ─── GREETING ────────────────────────────────────────────────
function updateGreeting() {
  const h = new Date().getHours();
  let g = h>=5&&h<12 ? 'Guten Morgen,' : h>=12&&h<18 ? 'Schön, dass du wieder da bist,' : h>=18&&h<22 ? 'Guten Abend,' : 'Noch wach? 🌙';
  const name = appState.profil.name || 'Hannah';
  const dg = document.getElementById('dash-greeting');
  const dn = document.getElementById('dash-name');
  if (dg) dg.textContent = g;
  if (dn) dn.innerHTML = `${name} <span class="dash-name-arrow">↗</span>`;
}

// ─── SEARCH ──────────────────────────────────────────────────
function toggleSearch() {
  const w = document.getElementById('search-wrap');
  w.classList.toggle('show');
  if (w.classList.contains('show')) document.getElementById('search-input').focus();
  else closeSearch();
}

function closeSearch() {
  const w = document.getElementById('search-wrap');
  w.classList.remove('show');
  document.getElementById('search-input').value = '';
  const dd = document.getElementById('search-dropdown');
  dd.innerHTML = ''; dd.classList.remove('show');
}

function doSearch(q) {
  const dd = document.getElementById('search-dropdown');
  if (!q.trim()) { dd.classList.remove('show'); dd.innerHTML = ''; return; }
  const res = appState.patterns.filter(p =>
    p.title.toLowerCase().includes(q.toLowerCase()) ||
    (p.mat && p.mat.toLowerCase().includes(q.toLowerCase())) ||
    (p.kat && p.kat.toLowerCase().includes(q.toLowerCase()))
  ).slice(0, 5);
  dd.innerHTML = res.length === 0
    ? '<div style="padding:1rem;text-align:center;color:var(--textLight);font-size:0.85rem;">Keine Ergebnisse</div>'
    : res.map(p => `<div class="search-result-item" onclick="openEditor(${p.id});closeSearch();">${p.emoji} <span>${p.title}</span> <span style="margin-left:auto;font-size:0.7rem;color:var(--textFaint);">${p.kat||''}</span></div>`).join('');
  dd.classList.add('show');
}

// ─── DASHBOARD PATTERNS ──────────────────────────────────────
function renderDashPatterns() {
  const heroEl    = document.getElementById('dash-hero-pattern');
  const miniWrap  = document.getElementById('dash-mini-grid-wrap');
  const miniGrid  = document.getElementById('dash-mini-grid');
  if (!heroEl) return;

  const active = [...appState.patterns].filter(p => p.status !== 'arch');
  if (active.length === 0) {
    heroEl.innerHTML = '<p class="txt-light" style="text-align:center;padding:2rem;">Noch keine Anleitungen.</p>';
    if (miniWrap) miniWrap.style.display = 'none';
    return;
  }

  // Hero — erste Anleitung
  const hero = active[0];
  const heroThumb = hero.images && hero.images.length > 0
    ? `<img class="hero-pattern-img" src="${hero.images[0]}" alt="">`
    : `<div class="hero-pattern-emoji">${hero.emoji||'🧶'}</div>`;
  const badgeLabel = hero.status === 'pub' ? 'Veröffentlicht' : hero.status === 'arch' ? 'Archiviert' : 'In Arbeit';

  heroEl.innerHTML = `<div class="hero-pattern-card" onclick="openEditor(${hero.id})">
    ${heroThumb}
    <div class="hero-pattern-overlay"></div>
    <div class="hero-pattern-content">
      <span class="hero-pattern-badge">${badgeLabel}</span>
      <div class="hero-pattern-title">${hero.title}</div>
      <div class="hero-pattern-sub">${hero.kat||''} ${hero.needle ? '· '+hero.needle : ''}</div>
    </div>
    <div class="hero-pattern-arrow">→</div>
  </div>`;

  // Mini Grid — weitere Anleitungen
  const rest = active.slice(1, 5);
  if (rest.length > 0 && miniWrap && miniGrid) {
    miniWrap.style.display = 'block';
    miniGrid.innerHTML = rest.map(p => {
      const thumb = p.images && p.images.length > 0
        ? `<img class="mini-pattern-img" src="${p.images[0]}" alt="">`
        : `<div class="mini-pattern-emoji">${p.emoji||'🧶'}</div>`;
      const badgeCls = p.status === 'pub' ? 'mini-badge-pub' : p.status === 'arch' ? 'mini-badge-arch' : 'mini-badge-draft';
      const badgeTxt = p.status === 'pub' ? 'Veröffentlicht' : p.status === 'arch' ? 'Archiviert' : 'Entwurf';
      return `<div class="mini-pattern-card" onclick="openEditor(${p.id})">
        ${thumb}
        <div class="mini-pattern-overlay"></div>
        <div class="mini-pattern-content">
          <div class="mini-pattern-title">${p.title}</div>
          <span class="mini-pattern-badge ${badgeCls}">${badgeTxt}</span>
        </div>
      </div>`;
    }).join('');
  } else if (miniWrap) {
    miniWrap.style.display = 'none';
  }
}

function patternRowHTML(p) {
  const thumb = p.images && p.images.length > 0
    ? `<img src="${p.images[0]}" alt="">`
    : p.emoji;
  return `<div class="pattern-row" onclick="openEditor(${p.id})">
    <div class="p-thumb">${thumb}</div>
    <div class="p-info">
      <div class="p-title">${p.title}</div>
      <div class="p-meta">⚙ ${p.needle||'—'} · ${p.mat||'—'}</div>
      <div class="p-diff">${getDots(p.diff||1)} ${['','Einfach','Mittel','Fortgeschritten'][p.diff||1]}</div>
    </div>
    ${getBadge(p.status)}
  </div>`;
}

function getBadge(s) {
  if (s==='draft' || s==='open') return '<span class="badge badge-draft">Entwurf</span>';
  if (s==='pub')   return '<span class="badge badge-pub">Veröffentlicht</span>';
  if (s==='arch')  return '<span class="badge badge-arch">Archiviert</span>';
  return '<span class="badge badge-draft">Entwurf</span>';
}

function getDots(d) {
  return [1,2,3].map(i => `<span class="dot ${i<=d?'dot-on':'dot-off'}"></span>`).join('');
}

// ─── TODOS ────────────────────────────────────────────────────
function renderDashTodos() {
  const el = document.getElementById('dash-todo-list');
  if (!el) return;
  const active = appState.todos.filter(t => !t.done).slice(0, 3);
  el.innerHTML = active.length === 0
    ? '<p class="txt-light" style="text-align:center;padding:0.75rem;">Keine offenen Aufgaben 🎉</p>'
    : active.map(t => todoRowHTML(t, 'dash')).join('');
}

function renderTodoFull() {
  const el = document.getElementById('todo-full-list');
  if (!el) return;
  el.innerHTML = appState.todos.length === 0
    ? '<p class="txt-light" style="text-align:center;padding:1.5rem;">Keine Aufgaben vorhanden.</p>'
    : appState.todos.map(t => todoRowHTML(t, 'full')).join('');
}

function todoRowHTML(t, mode) {
  const checkIcon = t.done ? `<svg width="11" height="11" fill="none" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>` : '';
  return `<div class="todo-row" id="todo-row-${t.id}-${mode}">
    <div class="todo-cb ${t.done?'done':''}" onclick="checkTodo(${t.id},'${mode}')">${checkIcon}</div>
    <div style="flex:1;">
      <div class="todo-txt ${t.done?'done':''}">${t.text}</div>
      ${t.date ? `<div class="todo-date">${formatDate(t.date)}${t.cat?' · '+t.cat:''}</div>` : ''}
    </div>
    <button class="btn-delete" onclick="deleteTodo(${t.id},'${mode}')">
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 6V4h6v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  </div>`;
}

function formatDate(d) {
  if (!d || d === '') return '';
  try {
    const date = new Date(d + 'T12:00:00'); // Timezone fix
    const today = new Date();
    today.setHours(12,0,0,0);
    const diff = Math.round((date - today) / 86400000);
    if (diff === 0) return 'Heute';
    if (diff === 1) return 'Morgen';
    if (diff === -1) return 'Gestern';
    return date.toLocaleDateString('de-DE', {day:'numeric', month:'short'});
  } catch { return d; }
}

function addTodo() {
  const text = document.getElementById('todo-new-text').value.trim();
  if (!text) return;
  const dateInput = document.getElementById('todo-new-date');
  const catInput  = document.getElementById('todo-new-cat');
  const date = dateInput.value || '';
  const cat  = catInput.value.trim();
  appState.todos.unshift({ id: appState.nextTodoId++, text, date, cat, done: false });
  document.getElementById('todo-new-text').value = '';
  dateInput.value = '';
  catInput.value  = '';
  saveState();
  renderTodoFull();
  renderDashTodos();
}

function checkTodo(id, mode) {
  const todo = appState.todos.find(t => t.id === id);
  if (!todo) return;
  lastRemovedTodo = { ...todo, origIndex: appState.todos.indexOf(todo) };
  // Animiere alle sichtbaren Instanzen dieser Todo-Zeile
  ['dash','full','notiz'].forEach(m => {
    const row = document.getElementById(`todo-row-${id}-${m}`);
    if (row) row.classList.add('removing');
  });
  setTimeout(() => {
    appState.todos = appState.todos.filter(t => t.id !== id);
    saveState();
    renderTodoFull();
    renderDashTodos();
    if (document.getElementById('notiz-todo-list')) renderNotizen();
  }, 300);
  showSnackbar('Erledigt ✓', true);
}

function deleteTodo(id, mode) {
  const todo = appState.todos.find(t => t.id === id);
  if (!todo) return;
  lastRemovedTodo = { ...todo, origIndex: appState.todos.indexOf(todo) };
  ['dash','full','notiz'].forEach(m => {
    const row = document.getElementById(`todo-row-${id}-${m}`);
    if (row) row.classList.add('removing');
  });
  setTimeout(() => {
    appState.todos = appState.todos.filter(t => t.id !== id);
    saveState();
    renderTodoFull();
    renderDashTodos();
    if (document.getElementById('notiz-todo-list')) renderNotizen();
  }, 300);
  showSnackbar('Aufgabe gelöscht', true);
}

function undoTodo() {
  if (!lastRemovedTodo) return;
  const { origIndex, ...t } = lastRemovedTodo;
  // done zurücksetzen falls es ein checkTodo war
  t.done = false;
  appState.todos.splice(Math.min(origIndex, appState.todos.length), 0, t);
  lastRemovedTodo = null;
  saveState();
  hideSnackbar();
  renderTodoFull();
  renderDashTodos();
  if (document.getElementById('notiz-todo-list')) renderNotizen();
}

function sortTodos(by) {
  if (by === 'date') appState.todos.sort((a,b) => (a.date||'zzzz').localeCompare(b.date||'zzzz'));
  else if (by === 'cat') appState.todos.sort((a,b) => (a.cat||'').localeCompare(b.cat||''));
  renderTodoFull();
}

// ─── SNACKBAR ────────────────────────────────────────────────
function showSnackbar(msg, withUndo = false) {
  clearTimeout(snackTimer);
  document.getElementById('snackbar-msg').textContent = msg;
  const btn = document.querySelector('#snackbar button');
  if (btn) btn.style.display = withUndo ? 'block' : 'none';
  document.getElementById('snackbar').classList.add('show');
  snackTimer = setTimeout(hideSnackbar, 4000);
}

function hideSnackbar() {
  document.getElementById('snackbar').classList.remove('show');
}

// ─── PROFIL ───────────────────────────────────────────────────
function saveProfil() {
  appState.profil.name    = document.getElementById('profil-name').value.trim() || 'Hannah';
  appState.profil.groesse = document.getElementById('profil-groesse').value;
  appState.profil.brust   = document.getElementById('profil-brust').value;
  appState.profil.taille  = document.getElementById('profil-taille').value;
  appState.profil.hufte   = document.getElementById('profil-hufte').value;
  appState.profil.hoehe   = document.getElementById('profil-hoehe').value;
  appState.profil.kopf    = document.getElementById('profil-kopf').value;
  appState.profil.fuss    = document.getElementById('profil-fuss').value;
  appState.profil.ankle   = document.getElementById('profil-ankle')?.value || '';
  appState.profil.sleeve  = document.getElementById('profil-sleeve')?.value || '';
  appState.profil.back    = document.getElementById('profil-back')?.value || '';
  appState.profil.inseam  = document.getElementById('profil-inseam')?.value || '';
  saveState();
  updateGreeting();
  showSnackbar('Profil gespeichert ✓');
}

// Lädt Profil-Maße in Körpermaß-Rechner
function ladeProfilInRechner() {
  const p = appState.profil;
  const fields = [
    ['mass-brust', p.brust], ['mass-taille', p.taille],
    ['mass-hufte', p.hufte], ['mass-hoehe', p.hoehe],
  ];
  let loaded = false;
  fields.forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && val) { el.value = val; loaded = true; }
  });
  if (loaded) { calcMass(); showSnackbar('Profilmaße geladen ✓'); }
  else showSnackbar('Keine Maße im Profil gespeichert');
}

// Garn: Lauflänge-Info anzeigen
function updateLauflaenge(n) {
  const g    = +document.getElementById(`yarn-${n}-g`)?.value;
  const lauf = +document.getElementById(`yarn-${n}-lauf`)?.value;
  const el   = document.getElementById(`yarn-${n}-lauf-info`);
  if (!el) return;
  if (g > 0 && lauf > 0) {
    const per100 = (lauf / g * 100).toFixed(0);
    el.textContent = `= ${per100} m/100g`;
  } else {
    el.textContent = '';
  }
}

// Material-Hinweis beim Garn
function updateGarnHinweis(n) {
  const mat = document.getElementById(`yarn-${n}-material`)?.value;
  const el  = document.getElementById(`yarn-${n}-hinweis`);
  if (!el) return;
  const HINTS = {
    'Alpaka (100%)': '⚠ Hängt sich stark aus — Länge kürzer einplanen',
    'Alpaka-Blend (30%+)': 'Etwas stabiler als 100% Alpaka',
    'Baumwolle': 'Erste Wäsche: ~6% Einlauf einplanen',
    'Bambus / Viskose': 'Sehr fließend — Länge kürzer einplanen',
    'Merino (Superwash)': 'Kann nach Waschen wachsen',
    'Mohair': 'Probe schwierig zu messen — großzügig schätzen',
  };
  el.textContent = HINTS[mat] || '';
}

// Garn-Werte in Garnmengenrechner übertragen
function openPrintView() {
  if (currentPatternId === null) {
    showSnackbar('Bitte zuerst speichern');
    return;
  }
  window.open(`print.html?id=${currentPatternId}`, '_blank');
}

function openGarnImRechner(n) {
  const lauf   = document.getElementById(`yarn-${n}-lauf`)?.value;
  const g      = document.getElementById(`yarn-${n}-g`)?.value || '100';
  const anzahl = document.getElementById(`yarn-${n}-anzahl`)?.value;
  const mat    = document.getElementById(`yarn-${n}-material`)?.value;

  navTo('calc-garn');
  setTimeout(() => {
    if (lauf) { const el = document.getElementById('garn-ol'); if (el) el.value = lauf; }
    if (g)    { const el = document.getElementById('garn-og'); if (el) el.value = g; }
    if (anzahl){ const el = document.getElementById('garn-ok'); if (el) el.value = anzahl; }
    if (mat)  { const el = document.getElementById('garn-material-orig'); if (el) el.value = mat; }
    calcGarn();
    showSnackbar('Garnwerte übertragen ✓');
  }, 300);
}

function uploadAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    appState.profil.avatar = e.target.result;
    const av = document.getElementById('profil-avatar');
    if (av) av.innerHTML = `<img src="${e.target.result}" alt="">`;
    saveState();
  };
  reader.readAsDataURL(file);
}

// Load profil fields when screen opens
function loadProfilFields() {
  const p = appState.profil;
  ['name','groesse','brust','taille','hufte','hoehe','kopf','fuss','ankle','sleeve','back','inseam'].forEach(k => {
    const el = document.getElementById('profil-' + k);
    if (el && p[k]) el.value = p[k];
  });
  if (p.avatar) {
    const av = document.getElementById('profil-avatar');
    if (av) av.innerHTML = `<img src="${p.avatar}" alt="">`;
  }
}

// ─── SETTINGS ────────────────────────────────────────────────
function setUnit(u) {
  appState.settings.unit = u;
  document.getElementById('unit-cm').className    = u==='cm'   ? 'btn btn-terra btn-sm' : 'btn btn-ghost btn-sm';
  document.getElementById('unit-inch').className  = u==='inch' ? 'btn btn-terra btn-sm' : 'btn btn-ghost btn-sm';
  saveState();
}

function setYarnSys(s) {
  appState.settings.yarnSys = s;
  ['cyc','ply','de'].forEach(k => {
    document.getElementById('yarn-' + k).className = k===s ? 'btn btn-terra btn-sm' : 'btn btn-ghost btn-sm';
  });
  saveState();
}

function applySettings() {
  const s = appState.settings;
  if (s.unit) setUnit(s.unit);
  if (s.yarnSys) setYarnSys(s.yarnSys);
}

function changePwd() {
  const np = document.getElementById('new-pwd').value;
  if (!np || np.length < 3) { showSnackbar('Passwort zu kurz'); return; }
  showSnackbar('Passwort geändert — bitte in index.html eintragen');
  document.getElementById('new-pwd').value = '';
}

// ─── BOTTOM SHEETS ───────────────────────────────────────────
function openSheet(id) {
  document.getElementById('sheet-' + id).style.display = 'block';
}
function closeSheet(id) {
  document.getElementById('sheet-' + id).style.display = 'none';
}

// ─── SCALING ENGINE ──────────────────────────────────────────
// Core skalierungsfunktion für Größenanpassung
function scaleStitches(original, gaugeM_orig, gaugeM_own) {
  if (!original || !gaugeM_orig || !gaugeM_own) return original;
  return Math.round(original * (gaugeM_own / gaugeM_orig));
}

function scaleRows(original, gaugeR_orig, gaugeR_own) {
  if (!original || !gaugeR_orig || !gaugeR_own) return original;
  return Math.round(original * (gaugeR_own / gaugeR_orig));
}

function getScalingFactors(pattern, targetSizeKey) {
  // Pattern hat: gaugeM (M/10cm), gaugeR (R/10cm), baseBust (Brust-cm der Bassgröße)
  const targetMeasures = BODY_MEASUREMENTS[targetSizeKey];
  if (!targetMeasures || !pattern.gaugeM || !pattern.baseBust) return null;

  // Finde Bassgröße aus Brustmaß des patterns
  const baseBust = pattern.baseBust;
  const targetBust = targetMeasures.bust;

  // Skalierungsfaktor Breite aus Brustmaßen
  const bustRatio = targetBust / baseBust;

  return {
    sfBust: bustRatio,
    targetBust,
    baseBust,
    targetMeasures
  };
}

// Render skalierte Maschenzahl mit Hervorhebung
function scaledHTML(value, isScaled) {
  if (!isScaled || value === null || value === undefined) return value;
  return `<span class="scaled-value">${value}</span>`;
}

// ─── ANDROID BACK ─────────────────────────────────────────────
window.history.pushState(null, '');
window.addEventListener('popstate', () => {
  if (historyStack.length > 0) { goBack(); window.history.pushState(null, ''); }
});

// ─── LESEMODUS DARK TOGGLE ────────────────────────────────────
function toggleLeseMode() {
  const screen = document.getElementById('screen-lesemodus');
  const btn    = screen.querySelector('.lese-dark-toggle');
  screen.classList.toggle('dark-mode');
  if (btn) btn.textContent = screen.classList.contains('dark-mode') ? '☀️' : '🌙';
}

// ─── INIT ─────────────────────────────────────────────────────
// Screens ohne Padding für Sub-Screens initialisieren
['calc-mp','calc-groesse','calc-mass','calc-garn','calc-nadel','calc-staerke'].forEach(id => {
  // Rechner-Screens bekommen ihren Inhalt via rechner.js
});
