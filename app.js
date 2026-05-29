/* ═══════════════════════════════════════════════════════════════
   MASCHEN & MASSE — app.js v6.0
   Core: State, Routing, Login, Todos, Supabase-Sync
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── PASSWORD ────────────────────────────────────────────────
const APP_PWD = 'BuBu1581!?!';

// ─── SUPABASE ────────────────────────────────────────────────
const SUPA_URL = 'https://gqeicdlcjnqzevbwljrs.supabase.co';
const SUPA_KEY = 'sb_publishable_RaxtAZnuwjljXFKop8dpvw_DsYbTHDG';
const USER_ID  = 'user_julia';

async function supaFetch(path, method = 'GET', body = null, extra = '') {
  const opts = {
    method,
    headers: {
      'apikey': SUPA_KEY,
      'Authorization': `Bearer ${SUPA_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : (method === 'PATCH' ? 'return=representation' : ''),
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${SUPA_URL}/rest/v1/${path}${extra}`, opts);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase ${method} ${path}: ${err}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ─── STATE ───────────────────────────────────────────────────
let appState = {
  patterns: [],
  todos: [],
  notizen: [],
  profil: { name:'Hannah', groesse:'damen_m', brust:'', taille:'', hufte:'', hoehe:'', kopf:'', fuss:'' },
  settings: { unit:'cm', yarnSys:'cyc' },
  nextPatternId: 1,
  nextTodoId: 1,
  nextNotizId: 1,
};

let currentScreen  = 'login';
let historyStack   = [];
let currentPatternId = null;
let lastRemovedTodo  = null;
let snackTimer       = null;
let _syncPending     = false;

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
  kind_2j:   { bust:53,   waist:52,   hip:53,   back:25,   sleeve:25,   shoulder:22,   armhole:11 },
  kind_4j:   { bust:57,   waist:53,   hip:58,   back:28,   sleeve:29,   shoulder:24,   armhole:12 },
  kind_6j:   { bust:60,   waist:55,   hip:62,   back:31,   sleeve:33,   shoulder:25,   armhole:13 },
  kind_8j:   { bust:64,   waist:57,   hip:67,   back:34,   sleeve:37,   shoulder:27,   armhole:14 },
  kind_10j:  { bust:68,   waist:60,   hip:72,   back:37,   sleeve:41,   shoulder:28,   armhole:14.5 },
  kind_12j:  { bust:74,   waist:63,   hip:79,   back:40,   sleeve:46,   shoulder:30,   armhole:15.5 },
  baby_nb:   { bust:37,   waist:37,   hip:37,   back:19,   sleeve:16,   shoulder:16,   armhole:8 },
  baby_0_3:  { bust:39.5, waist:39.5, hip:39.5, back:20.5, sleeve:17.5, shoulder:17,   armhole:8.5 },
  baby_3_6:  { bust:42,   waist:42,   hip:42,   back:22,   sleeve:19,   shoulder:18,   armhole:9 },
  baby_6_12: { bust:45.5, waist:45.5, hip:45.5, back:24,   sleeve:21,   shoulder:19,   armhole:9.5 },
  baby_12_18:{ bust:49.5, waist:49.5, hip:49.5, back:26,   sleeve:23,   shoulder:20,   armhole:10.5 },
  baby_18_24:{ bust:52,   waist:52,   hip:52,   back:27.5, sleeve:24.5, shoulder:21,   armhole:11 },
};

// ─── LOGIN ───────────────────────────────────────────────────
function doLogin() {
  const val = document.getElementById('login-pwd').value;
  const err = document.getElementById('login-err');
  if (val === APP_PWD) {
    err.style.display = 'none';
    sessionStorage.setItem('mm_auth', '1');
    showScreen('dashboard');
    document.getElementById('bottom-nav').style.display = 'flex';
    loadFromSupabase();
  } else {
    err.style.display = 'block';
    document.getElementById('login-pwd').value = '';
  }
}

function doLogout() {
  sessionStorage.removeItem('mm_auth');
  appState.patterns = [];
  appState.todos    = [];
  appState.notizen  = [];
  currentPatternId  = null;
  historyStack      = [];
  document.getElementById('bottom-nav').style.display = 'none';
  showScreen('login');
}

// Auto-Login wenn Session noch aktiv
function checkAutoLogin() {
  if (sessionStorage.getItem('mm_auth') === '1') {
    showScreen('dashboard');
    document.getElementById('bottom-nav').style.display = 'flex';
    loadFromSupabase();
  }
}

// ─── ROUTING ─────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');
  currentScreen = id;

  // Nav-Tabs
  const navMap = { dashboard:'nav-dashboard', anleitungen:'nav-anleitungen', rechner:'nav-rechner', notizen:'nav-notizen', mehr:'nav-mehr' };
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navMap[id]) {
    const nav = document.getElementById(navMap[id]);
    if (nav) nav.classList.add('active');
  }
}

function navTo(screen) {
  historyStack.push(currentScreen);
  showScreen(screen);

  if (screen === 'dashboard')    { updateGreeting(); renderDashPatterns(); renderDashTodos(); }
  if (screen === 'anleitungen')  { renderAnleitungen('alle'); }
  if (screen === 'notizen')      { renderNotizen(); }
  if (screen === 'mehr')         {}
  if (screen === 'profil')       { loadProfilFields(); }
  if (screen === 'einstellungen'){ applySettings(); }
  if (screen === 'todos')        { renderTodoFull(); }
  if (screen.startsWith('calc')) { renderRechnerScreen(screen); }
}

function goBack() {
  if (historyStack.length > 0) {
    const prev = historyStack.pop();
    showScreen(prev);
    if (prev === 'dashboard')   { updateGreeting(); renderDashPatterns(); renderDashTodos(); }
    if (prev === 'anleitungen') { renderAnleitungen(window._anlFilter || 'alle'); }
    if (prev === 'notizen')     { renderNotizen(); }
    if (prev === 'todos')       { renderTodoFull(); }
  }
}

// ─── SUPABASE: LADEN ─────────────────────────────────────────
async function loadFromSupabase() {
  showLoadingOverlay(true);
  try {
    // Patterns
    const patterns = await supaFetch(
      `patterns?user_id=eq.${USER_ID}&order=updated_at.desc`
    );
    if (patterns) {
      appState.patterns = patterns.map(dbToPattern);
    }

    // Todos
    const todos = await supaFetch(
      `todos?user_id=eq.${USER_ID}&order=created_at.desc`
    );
    if (todos) appState.todos = todos.map(t => ({
      id: t.id, text: t.text, date: t.date||'', cat: t.cat||'', done: t.done
    }));

    // Notizen
    const notizen = await supaFetch(
      `notizen?user_id=eq.${USER_ID}&order=created_at.desc`
    );
    if (notizen) appState.notizen = notizen.map(n => ({
      id: n.id, text: n.text, date: n.date||''
    }));

    // Profil
    const profil = await supaFetch(
      `profil?user_id=eq.${USER_ID}`
    );
    if (profil && profil.length > 0) {
      const p = profil[0];
      appState.profil   = { ...appState.profil, ...p, ...(p.settings||{}) };
      appState.settings = p.settings || appState.settings;
    }

    // Nach Laden: Dashboard aktualisieren
    updateGreeting();
    renderDashPatterns();
    renderDashTodos();
    applySettings();

  } catch(e) {
    console.error('Supabase load error:', e);
    // Fallback: localStorage
    loadStateLocal();
    showSnackbar('Offline — lokale Daten geladen');
  } finally {
    showLoadingOverlay(false);
  }
}

function showLoadingOverlay(show) {
  let el = document.getElementById('loading-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loading-overlay';
    el.style.cssText = `
      position:fixed;inset:0;background:var(--walnut);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      z-index:9999;gap:1rem;
    `;
    el.innerHTML = `
      <svg width="44" height="44" fill="none" viewBox="0 0 44 44" class="spin-yarn">
        <circle cx="22" cy="22" r="18" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
        <path d="M22 8 C14 8 8 14 8 22 C8 30 14 36 22 36" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M22 8 C30 8 36 14 36 22 C36 30 30 36 22 36" stroke="rgba(196,122,88,0.8)" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="22" cy="22" r="4" fill="rgba(196,122,88,0.6)"/>
      </svg>
      <p style="color:rgba(255,255,255,0.5);font-family:'DM Sans',sans-serif;font-size:0.85rem;">Wird geladen…</p>
    `;
    document.getElementById('app').appendChild(el);
    // Spin-Animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spinYarn { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .spin-yarn { animation: spinYarn 1.2s linear infinite; }
    `;
    document.head.appendChild(style);
  }
  el.style.display = show ? 'flex' : 'none';
}

// ─── DB <→ APP MAPPING ────────────────────────────────────────
function dbToPattern(r) {
  return {
    id:               r.id,
    emoji:            r.emoji            || '🧶',
    title:            r.title            || '',
    kat:              r.kat              || '',
    tags:             r.tags             || [],
    maschen:          r.maschen          || [],
    needle:           r.needle           || '',
    mat:              r.mat              || '',
    diff:             r.diff             || 2,
    status:           r.status           || 'draft',
    gaugeM:           r.gauge_m          || 0,
    gaugeR:           r.gauge_r          || 0,
    baseBust:         r.base_bust        || null,
    images:           r.images           || [],
    text:             r.text             || '',
    schnitt:          r.schnitt          || [],
    yarns:            r.yarns            || [],
    notes:            r.notes            || [],
    counters:         r.counters         || [],
    markers:          r.markers          || [],
    anleitungSchritte:r.anleitung_schritte || {},
    abbr:             r.abbr             || '',
    _existsInDB:      true,
  };
}

function patternToDB(p) {
  return {
    user_id:            USER_ID,
    emoji:              p.emoji            || '🧶',
    title:              p.title            || '',
    kat:                p.kat              || '',
    tags:               p.tags             || [],
    maschen:            p.maschen          || [],
    needle:             p.needle           || '',
    mat:                p.mat              || '',
    diff:               p.diff             || 2,
    status:             p.status           || 'draft',
    gauge_m:            p.gaugeM           || 0,
    gauge_r:            p.gaugeR           || 0,
    base_bust:          p.baseBust         || null,
    images:             p.images           || [],
    text:               p.text             || '',
    schnitt:            p.schnitt          || [],
    yarns:              p.yarns            || [],
    notes:              p.notes            || [],
    counters:           p.counters         || [],
    markers:            p.markers          || [],
    anleitung_schritte: p.anleitungSchritte|| {},
    abbr:               p.abbr             || '',
  };
}

// ─── SUPABASE: PATTERN SPEICHERN ─────────────────────────────
async function savePatternToSupabase(pattern) {
  const data = patternToDB(pattern);

  // Größencheck — warnen wenn Payload > 3MB
  const size = JSON.stringify(data).length;
  if (size > 3_000_000) {
    showSnackbar('⚠ Zu viele/große Bilder — bitte Bilder reduzieren');
    return pattern;
  }

  try {
    if (pattern.id && pattern._existsInDB) {
      const res = await supaFetch(
        `patterns?id=eq.${pattern.id}&user_id=eq.${USER_ID}`,
        'PATCH', data
      );
      return res && res[0] ? dbToPattern(res[0]) : pattern;
    } else {
      const res = await supaFetch('patterns', 'POST', data);
      return res && res[0] ? { ...dbToPattern(res[0]), _existsInDB: true } : pattern;
    }
  } catch(e) {
    console.error('Pattern save error:', e);
    showSnackbar('⚠ Speichern fehlgeschlagen — offline?');
    return pattern;
  }
}

async function deletePatternFromSupabase(id) {
  try {
    await supaFetch(`patterns?id=eq.${id}&user_id=eq.${USER_ID}`, 'DELETE');
  } catch(e) {
    console.error('Pattern delete error:', e);
  }
}

// ─── SUPABASE: TODO ───────────────────────────────────────────
async function saveTodoToSupabase(todo) {
  const data = { user_id: USER_ID, text: todo.text, date: todo.date||'', cat: todo.cat||'', done: todo.done };
  try {
    if (todo._existsInDB) {
      await supaFetch(`todos?id=eq.${todo.id}&user_id=eq.${USER_ID}`, 'PATCH', data);
    } else {
      const res = await supaFetch('todos', 'POST', data);
      if (res && res[0]) { todo.id = res[0].id; todo._existsInDB = true; }
    }
  } catch(e) { console.error('Todo save error:', e); }
}

async function deleteTodoFromSupabase(id) {
  try { await supaFetch(`todos?id=eq.${id}&user_id=eq.${USER_ID}`, 'DELETE'); }
  catch(e) { console.error('Todo delete error:', e); }
}

// ─── SUPABASE: NOTIZ ──────────────────────────────────────────
async function saveNotizToSupabase(notiz) {
  const data = { user_id: USER_ID, text: notiz.text, date: notiz.date||'' };
  try {
    if (notiz._existsInDB) {
      await supaFetch(`notizen?id=eq.${notiz.id}&user_id=eq.${USER_ID}`, 'PATCH', data);
    } else {
      const res = await supaFetch('notizen', 'POST', data);
      if (res && res[0]) { notiz.id = res[0].id; notiz._existsInDB = true; }
    }
  } catch(e) { console.error('Notiz save error:', e); }
}

async function deleteNotizFromSupabase(id) {
  try { await supaFetch(`notizen?id=eq.${id}&user_id=eq.${USER_ID}`, 'DELETE'); }
  catch(e) { console.error('Notiz delete error:', e); }
}

// ─── SUPABASE: PROFIL ─────────────────────────────────────────
async function saveProfilToSupabase() {
  const p = appState.profil;
  const data = {
    user_id: USER_ID,
    name: p.name||'Hannah', groesse: p.groesse||'damen_m',
    brust: p.brust||'', taille: p.taille||'', hufte: p.hufte||'',
    hoehe: p.hoehe||'', kopf: p.kopf||'', fuss: p.fuss||'',
    settings: appState.settings,
  };
  try {
    // Upsert (Insert oder Update)
    await supaFetch('profil', 'POST', data,
      '?on_conflict=user_id'
    );
    // Fallback: PATCH wenn POST scheitert
  } catch(e) {
    try {
      await supaFetch(`profil?user_id=eq.${USER_ID}`, 'PATCH', data);
    } catch(e2) { console.error('Profil save error:', e2); }
  }
}

// ─── STATE PERSISTENCE (localStorage Fallback) ───────────────
function saveState() {
  try { localStorage.setItem('mm_state', JSON.stringify(appState)); }
  catch(e) {}
}

function loadStateLocal() {
  try {
    const saved = localStorage.getItem('mm_state');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.patterns)  appState.patterns  = p.patterns;
      if (p.todos)     appState.todos     = p.todos;
      if (p.notizen)   appState.notizen   = p.notizen;
      if (p.profil)    appState.profil    = { ...appState.profil, ...p.profil };
      if (p.settings)  appState.settings  = { ...appState.settings, ...p.settings };
    }
  } catch(e) {}
  applySettings();
}

// ─── GREETING ────────────────────────────────────────────────
function updateGreeting() {
  const h = new Date().getHours();
  const g = h>=5&&h<12 ? 'Guten Morgen,' : h>=12&&h<18 ? 'Schön, dass du wieder da bist,' : h>=18&&h<22 ? 'Guten Abend,' : 'Noch wach? 🌙';
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
    : res.map(p => `<div class="search-result-item" onclick="openEditor(${p.id});closeSearch();">${p.emoji} <span>${p.title}</span><span style="margin-left:auto;font-size:0.7rem;color:var(--textFaint);">${p.kat||''}</span></div>`).join('');
  dd.classList.add('show');
}

// ─── DASHBOARD PATTERNS ──────────────────────────────────────
function renderDashPatterns() {
  const heroEl   = document.getElementById('dash-hero-pattern');
  const miniWrap = document.getElementById('dash-mini-grid-wrap');
  const miniGrid = document.getElementById('dash-mini-grid');
  if (!heroEl) return;

  const active = [...appState.patterns].filter(p => p.status !== 'arch');
  if (active.length === 0) {
    heroEl.innerHTML = `<div class="card" style="text-align:center;padding:2.5rem 1rem;">
      <svg width="48" height="48" fill="none" viewBox="0 0 52 52" style="margin:0 auto 1rem;display:block;opacity:0.3;">
        <circle cx="26" cy="26" r="20" stroke="#241a10" stroke-width="1.2"/>
        <path d="M10 20 Q20 14 30 22 Q40 30 46 24" stroke="#241a10" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M8 28 Q18 22 28 30 Q38 38 48 30" stroke="#241a10" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
      <p class="txt-light" style="margin-bottom:1rem;">Noch keine Anleitungen.</p>
      <button class="btn btn-green btn-sm" onclick="openEditor(null)">+ Erste Anleitung erstellen</button>
    </div>`;
    if (miniWrap) miniWrap.style.display = 'none';
    return;
  }

  const hero = active[0];
  const heroThumb = hero.images && hero.images.length > 0
    ? `<img class="hero-pattern-img" src="${hero.images[0]}" alt="">`
    : `<div class="hero-pattern-emoji">${hero.emoji||'🧶'}</div>`;
  const badgeLabel = hero.status === 'pub' ? 'Veröffentlicht' : 'In Arbeit';

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
        ${thumb}<div class="mini-pattern-overlay"></div>
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

function getBadge(s) {
  if (s==='draft'||s==='open') return '<span class="badge badge-draft">Entwurf</span>';
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
    const date = new Date(d + 'T12:00:00');
    const today = new Date(); today.setHours(12,0,0,0);
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
  const date = document.getElementById('todo-new-date').value || '';
  const cat  = document.getElementById('todo-new-cat').value.trim();
  const todo = { id: Date.now(), text, date, cat, done: false, _existsInDB: false };
  appState.todos.unshift(todo);
  document.getElementById('todo-new-text').value = '';
  document.getElementById('todo-new-date').value = '';
  document.getElementById('todo-new-cat').value  = '';
  renderTodoFull(); renderDashTodos();
  saveTodoToSupabase(todo);
}

function checkTodo(id, mode) {
  const todo = appState.todos.find(t => t.id === id);
  if (!todo) return;
  lastRemovedTodo = { ...todo, origIndex: appState.todos.indexOf(todo) };
  ['dash','full','notiz'].forEach(m => {
    const row = document.getElementById(`todo-row-${id}-${m}`);
    if (row) row.classList.add('removing');
  });
  setTimeout(() => {
    appState.todos = appState.todos.filter(t => t.id !== id);
    renderTodoFull(); renderDashTodos();
    if (document.getElementById('notiz-todo-list')) renderNotizen();
    deleteTodoFromSupabase(id);
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
    renderTodoFull(); renderDashTodos();
    if (document.getElementById('notiz-todo-list')) renderNotizen();
    deleteTodoFromSupabase(id);
  }, 300);
  showSnackbar('Aufgabe gelöscht', true);
}

function undoTodo() {
  if (!lastRemovedTodo) return;
  const { origIndex, ...t } = lastRemovedTodo;
  t.done = false;
  appState.todos.splice(Math.min(origIndex, appState.todos.length), 0, t);
  lastRemovedTodo = null;
  hideSnackbar();
  renderTodoFull(); renderDashTodos();
  if (document.getElementById('notiz-todo-list')) renderNotizen();
  saveTodoToSupabase(t);
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
  appState.profil.ankle   = document.getElementById('profil-ankle')?.value   || '';
  appState.profil.sleeve  = document.getElementById('profil-sleeve')?.value  || '';
  appState.profil.back    = document.getElementById('profil-back')?.value    || '';
  appState.profil.inseam  = document.getElementById('profil-inseam')?.value  || '';
  saveProfilToSupabase();
  updateGreeting();
  showSnackbar('Profil gespeichert ✓');
}

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

function uploadAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    appState.profil.avatar = e.target.result;
    const av = document.getElementById('profil-avatar');
    if (av) av.innerHTML = `<img src="${e.target.result}" alt="">`;
    saveProfilToSupabase();
  };
  reader.readAsDataURL(file);
}

// ─── SETTINGS ────────────────────────────────────────────────
function setUnit(u) {
  appState.settings.unit = u;
  document.getElementById('unit-cm').className   = u==='cm'   ? 'btn btn-terra btn-sm' : 'btn btn-ghost btn-sm';
  document.getElementById('unit-inch').className = u==='inch' ? 'btn btn-terra btn-sm' : 'btn btn-ghost btn-sm';
}

function setYarnSys(s) {
  appState.settings.yarnSys = s;
  ['cyc','ply','de'].forEach(k => {
    document.getElementById('yarn-' + k).className = k===s ? 'btn btn-terra btn-sm' : 'btn btn-ghost btn-sm';
  });
}

function applySettings() {
  const s = appState.settings;
  if (s.unit) setUnit(s.unit);
  if (s.yarnSys) setYarnSys(s.yarnSys);
}

function changePwd() {
  showSnackbar('Passwort ändern — bitte in app.js (Zeile APP_PWD) eintragen');
  document.getElementById('new-pwd').value = '';
}

// ─── EXPORT / IMPORT ─────────────────────────────────────────
function exportData() {
  const blob = new Blob([JSON.stringify(appState, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'maschen-masze-backup.json'; a.click();
  URL.revokeObjectURL(url);
  showSnackbar('Backup gespeichert ✓');
}

function importData(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.patterns) {
        // Alle Patterns in Supabase hochladen
        showLoadingOverlay(true);
        for (const p of data.patterns) {
          delete p.id;
          p._existsInDB = false;
          const saved = await savePatternToSupabase(p);
          appState.patterns.push({ ...saved, _existsInDB: true });
        }
        if (data.profil) { appState.profil = { ...appState.profil, ...data.profil }; await saveProfilToSupabase(); }
        showLoadingOverlay(false);
        showSnackbar('Import erfolgreich ✓');
        renderDashPatterns();
      } else {
        showSnackbar('Ungültige Datei');
      }
    } catch { showSnackbar('Fehler beim Import'); }
  };
  reader.readAsText(file);
}

// ─── GARN-HILFSFUNKTIONEN ────────────────────────────────────
function updateLauflaenge(n) {
  const g    = +document.getElementById(`yarn-${n}-g`)?.value;
  const lauf = +document.getElementById(`yarn-${n}-lauf`)?.value;
  const el   = document.getElementById(`yarn-${n}-lauf-info`);
  if (!el) return;
  el.textContent = (g > 0 && lauf > 0) ? `= ${(lauf/g*100).toFixed(0)} m/100g` : '';
}

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

function openPrintView() {
  if (currentPatternId === null) { showSnackbar('Bitte zuerst speichern'); return; }
  window.open(`print.html?id=${currentPatternId}`, '_blank');
}

function openGarnImRechner(n) {
  const lauf   = document.getElementById(`yarn-${n}-lauf`)?.value;
  const g      = document.getElementById(`yarn-${n}-g`)?.value || '100';
  const anzahl = document.getElementById(`yarn-${n}-anzahl`)?.value;
  const mat    = document.getElementById(`yarn-${n}-material`)?.value;
  navTo('calc-garn');
  setTimeout(() => {
    if (lauf)   { const el = document.getElementById('garn-ol');            if (el) el.value = lauf; }
    if (g)      { const el = document.getElementById('garn-og');            if (el) el.value = g; }
    if (anzahl) { const el = document.getElementById('garn-ok');            if (el) el.value = anzahl; }
    if (mat)    { const el = document.getElementById('garn-material-orig'); if (el) el.value = mat; }
    calcGarn();
    showSnackbar('Garnwerte übertragen ✓');
  }, 300);
}

// ─── BOTTOM SHEETS ───────────────────────────────────────────
function openSheet(id)  { document.getElementById('sheet-' + id).style.display = 'block'; }
function closeSheet(id) { document.getElementById('sheet-' + id).style.display = 'none'; }

// ─── SKALIERUNG ──────────────────────────────────────────────
function scaleStitches(original, gaugeM_orig, gaugeM_own) {
  if (!original || !gaugeM_orig || !gaugeM_own) return original;
  return Math.round(original * (gaugeM_own / gaugeM_orig));
}

function scaleRows(original, gaugeR_orig, gaugeR_own) {
  if (!original || !gaugeR_orig || !gaugeR_own) return original;
  return Math.round(original * (gaugeR_own / gaugeR_orig));
}

function getScalingFactors(pattern, targetSizeKey) {
  const targetMeasures = BODY_MEASUREMENTS[targetSizeKey];
  if (!targetMeasures || !pattern.gaugeM || !pattern.baseBust) return null;
  return {
    sfBust: targetMeasures.bust / pattern.baseBust,
    targetBust: targetMeasures.bust,
    baseBust: pattern.baseBust,
    targetMeasures,
  };
}

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
function renderRechnerScreen(screen) {
  // Screens werden einmalig beim ersten Aufruf gerendert
  const map = {
    'calc-mp':      () => typeof renderCalcMP      === 'function' && renderCalcMP(),
    'calc-groesse': () => typeof renderCalcGroesse === 'function' && renderCalcGroesse(),
    'calc-mass':    () => typeof renderCalcMass    === 'function' && renderCalcMass(),
    'calc-garn':    () => typeof renderCalcGarn    === 'function' && renderCalcGarn(),
    'calc-nadel':   () => typeof renderNadelTable  === 'function' && renderNadelTable(),
    'calc-staerke': () => typeof renderStaerkeTable=== 'function' && renderStaerkeTable(),
  };
  const el = document.getElementById('screen-' + screen);
  if (el && (!el.dataset.rendered)) {
    map[screen]?.();
    el.dataset.rendered = '1';
  }
}

// Auto-Login prüfen sobald DOM bereit
document.addEventListener('DOMContentLoaded', () => {
  checkAutoLogin();
  // Alle Rechner-Screens vorab rendern
  ['calc-mp','calc-groesse','calc-mass','calc-garn','calc-nadel','calc-staerke'].forEach(s => {
    renderRechnerScreen(s);
  });
});
