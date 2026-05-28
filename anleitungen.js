/* ═══════════════════════════════════════════════════════════════
   MASCHEN & MASSE — anleitungen.js v5.2
   Strukturiertes Anleitungs-Formular mit Größenskalierung
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── KONSTANTEN ───────────────────────────────────────────────
const ALLE_MASCHEN = [
  'Anfangsschlinge','Luftmasche (Lm)','Kettmasche (Km)','Feste Masche (fM)',
  'Halbes Stäbchen (hStb)','Stäbchen (Stb)','Doppelstäbchen (DStb)',
  'Dreifachstäbchen (3-fStb)','Vierfachstäbchen (4-fStb)',
  'Shell / Muschel','V-Stitch','Cluster / Büschelmasche','Popcornmasche',
  'Noppe / Bobble','Puffmasche','Granny Square',
  'FP-Stäbchen (FPdc)','BP-Stäbchen (BPdc)','FP-Doppelstäbchen','BP-Doppelstäbchen',
  'BLO (hinteres Maschenglied)','FLO (vorderes Maschenglied)',
  'Zunahme (2 fM in 1 M)','Abnahme (2 fM zsm)','Zunahme Stäbchen','Abnahme Stäbchen',
  'Magischer Ring','Picot','Foundation Single Crochet (FSC)',
  'Foundation Double Crochet (FDC)','Spike Stitch','Linked Stitch',
  'Bullion Stitch','Crocodile Stitch','Broomstick Lace','Hairpin Lace',
  'Rippenmuster (FP/BP)','Mosaic / Mosaikmuster','Tunisisch Einfach',
  'Tunisisch Fullstitch','C2C (Corner to Corner)','Filet-Häkeln',
  'Ripple / Chevron','Basket Weave','Moss Stitch / Linen Stitch',
  'Granny Stripe','Overlay-Crochet','Intarsia',
  'Krebsmasche (Crab Stitch)','Muschel-Abschlussrand','Picot-Rand',
];

const KATEGORIEN_LIST = [
  'Pullover','Cardigan','Weste','Jacke','Mantel','Kleid','Rock','Hose','Shorts','Overall',
  'Top / Crop Top','T-Shirt','Bluse','Mütze','Beanie','Stirnband','Cowl','Schal','Tuch / Stola',
  'Socken','Handschuhe / Fäustlinge','Tasche','Rucksack','Tote Bag',
  'Decke','Kissen','Wanddekoration','Baby-Jäckchen','Baby-Mütze','Baby-Strampler','Baby-Söckchen',
  'Amigurumi','Spielzeug','Schmuck / Accessoire','Haarband','Ohrringe','Untersetzer','Topflappen',
];

const TAGS_LIST = [
  'Frühling','Sommer','Herbst','Winter',
  'Wolle','Baumwolle','Merino','Alpaka','Bambus','Leinen','Acryl','Mohair',
  'Anfänger','Fortgeschritten','Experte','Oversized','Fitted','Cropped',
  'Colorwork','Streifen','Einfarbig','Schnell','Wochenenedprojekt','Langzeitprojekt',
  'Geschenk','Für mich','Für Kinder','Für Baby',
];

const SCHNITT_LISTE = [
  'Vorderteil','Rückenteil','Ärmel links','Ärmel rechts','Ärmel (×2)',
  'Kragen','Bündchen','Tasche','Kapuze','Hosenbein links','Hosenbein rechts',
  'Rockbahn','Krempe','Manschette','Schulterpartie','Besatz','Gürtel',
  'Kragen-Blende','Seitennaht-Besatz','Armausschnitt-Besatz',
];

const MARKER_COLORS = {
  raglan:'#c47a58', seite:'#4a6b40', rapport:'#5a7098',
  abnahme:'#a05a3a', zunahme:'#7a6b3a', eigen:'#9c7b5a',
};

// Schritt-Typen
const SCHRITT_TYPEN = [
  { key:'anschlag',  label:'Anschlag',           icon:'🧶', hasM:true,  hasR:false, hasSeiten:false },
  { key:'gerade',    label:'Gerade häkeln',       icon:'↕',  hasM:false, hasR:true,  hasSeiten:false },
  { key:'abketten',  label:'Abketten',            icon:'✂',  hasM:true,  hasR:false, hasSeiten:true  },
  { key:'zunehmen',  label:'Zunehmen',            icon:'↗',  hasM:true,  hasR:false, hasSeiten:true  },
  { key:'abnehmen',  label:'Abnehmen',            icon:'↘',  hasM:true,  hasR:false, hasSeiten:true  },
  { key:'verteilt',  label:'Abnahmen verteilt',   icon:'📐', hasM:true,  hasR:true,  hasSeiten:true  },
  { key:'zuverteilt',label:'Zunahmen verteilt',   icon:'📐', hasM:true,  hasR:true,  hasSeiten:true  },
  { key:'freitext',  label:'Freitext / Hinweis',  icon:'💬', hasM:false, hasR:false, hasSeiten:false },
];

// Steuernde Maße pro Schnittteil
const SCHNITT_MASS_OPTIONS = [
  { key:'bust',    label:'Brustumfang',       icon:'👕' },
  { key:'hip',     label:'Hüftumfang',         icon:'👖' },
  { key:'waist',   label:'Taillenumfang',      icon:'📏' },
  { key:'sleeve',  label:'Ärmellänge',         icon:'💪' },
  { key:'back',    label:'Rückenlänge',        icon:'📐' },
  { key:'shoulder',label:'Schulterbreite',     icon:'↔'  },
  { key:'armhole', label:'Armlochhöhe',        icon:'🔵' },
  { key:'head',    label:'Kopfumfang',         icon:'🧢' },
  { key:'foot',    label:'Fußlänge',           icon:'🧦' },
  { key:'ankle',   label:'Knöchelumfang',      icon:'🦵' },
  { key:'inseam',  label:'Innenbeinlänge',     icon:'📏' },
  { key:'thigh',   label:'Oberschenkelumfang', icon:'🦵' },
  { key:'none',    label:'Kein Maß (fix)',     icon:'🔒' },
];

const SCHNITT_DEFAULT_MASS = {
  'Vorderteil':'bust','Rückenteil':'bust',
  'Ärmel links':'sleeve','Ärmel rechts':'sleeve','Ärmel (×2)':'sleeve',
  'Kragen':'head','Bündchen':'bust','Tasche':'none','Kapuze':'head',
  'Hosenbein links':'inseam','Hosenbein rechts':'inseam',
  'Rockbahn':'hip','Krempe':'head','Manschette':'ankle',
  'Schulterpartie':'shoulder','Besatz':'bust','Gürtel':'waist',
};

// Vollständige Körpermaße (CYC 2018)
const BODY_MEAS_FULL = {
  damen_xxs:{bust:73.5,hip:81.5,waist:58.5,sleeve:42.5,back:38.5,shoulder:34.5,armhole:16.5,head:53,foot:23,ankle:20,inseam:76,thigh:51},
  damen_xs: {bust:78.5,hip:86.5,waist:63.5,sleeve:43,  back:39.5,shoulder:35.5,armhole:17,  head:53,foot:23,ankle:20.5,inseam:77,thigh:53},
  damen_s:  {bust:83.5,hip:91.5,waist:68.5,sleeve:43.5,back:40.5,shoulder:36.5,armhole:17.5,head:54,foot:24,ankle:21,inseam:78,thigh:55},
  damen_m:  {bust:93.5,hip:101.5,waist:78.5,sleeve:44.5,back:42, shoulder:38,  armhole:18.5,head:55,foot:24.5,ankle:22,inseam:79,thigh:59},
  damen_l:  {bust:103.5,hip:111.5,waist:88.5,sleeve:45,back:43.5,shoulder:40, armhole:19.5,head:56,foot:25,ankle:23,inseam:80,thigh:64},
  damen_xl: {bust:113.5,hip:121.5,waist:98.5,sleeve:46,back:44.5,shoulder:41.5,armhole:20.5,head:57,foot:25.5,ankle:24,inseam:80,thigh:68},
  damen_2xl:{bust:124,  hip:132,  waist:109, sleeve:46.5,back:45.5,shoulder:43,armhole:21.5,head:57,foot:26,ankle:25,inseam:81,thigh:73},
  damen_3xl:{bust:134.5,hip:142.5,waist:119, sleeve:47, back:46,  shoulder:44.5,armhole:22, head:58,foot:26,ankle:26,inseam:81,thigh:77},
  damen_4xl:{bust:144.5,hip:152.5,waist:129, sleeve:47, back:46.5,shoulder:46, armhole:22.5,head:58,foot:26.5,ankle:27,inseam:82,thigh:82},
  damen_5xl:{bust:155,  hip:162.5,waist:139.5,sleeve:47.5,back:47,shoulder:47, armhole:23,  head:59,foot:27,ankle:28,inseam:82,thigh:86},
  herren_xs:{bust:83.5,hip:86.5,waist:68.5,sleeve:47,  back:40.5,shoulder:37, armhole:19,  head:55,foot:25,ankle:22,inseam:79,thigh:52},
  herren_s: {bust:88.5,hip:91.5,waist:73.5,sleeve:47.5,back:41.5,shoulder:38, armhole:19.5,head:56,foot:26,ankle:22.5,inseam:80,thigh:54},
  herren_m: {bust:98.5,hip:101.5,waist:83.5,sleeve:48.5,back:43, shoulder:40, armhole:21,  head:57,foot:27,ankle:23.5,inseam:81,thigh:57},
  herren_l: {bust:108.5,hip:111.5,waist:93.5,sleeve:50,back:44.5,shoulder:42, armhole:22,  head:58,foot:28,ankle:24.5,inseam:82,thigh:61},
  herren_xl:{bust:118.5,hip:121.5,waist:103.5,sleeve:51,back:45.5,shoulder:44,armhole:23,  head:59,foot:28.5,ankle:25.5,inseam:83,thigh:65},
  herren_2xl:{bust:129.5,hip:132.5,waist:114.5,sleeve:51.5,back:46.5,shoulder:46,armhole:24,head:60,foot:29,ankle:26.5,inseam:83,thigh:69},
  kind_2j:  {bust:53,hip:53,waist:52,sleeve:25,back:25,shoulder:22,armhole:11,head:49,foot:13,ankle:14,inseam:31,thigh:30},
  kind_4j:  {bust:57,hip:58,waist:53,sleeve:29,back:28,shoulder:24,armhole:12,head:50,foot:15,ankle:15,inseam:38,thigh:33},
  kind_6j:  {bust:60,hip:62,waist:55,sleeve:33,back:31,shoulder:25,armhole:13,head:51,foot:17,ankle:16,inseam:45,thigh:36},
  kind_8j:  {bust:64,hip:67,waist:57,sleeve:37,back:34,shoulder:27,armhole:14,head:52,foot:19,ankle:17,inseam:52,thigh:39},
  kind_10j: {bust:68,hip:72,waist:60,sleeve:41,back:37,shoulder:28,armhole:14.5,head:52,foot:21,ankle:18,inseam:58,thigh:42},
  kind_12j: {bust:74,hip:79,waist:63,sleeve:46,back:40,shoulder:30,armhole:15.5,head:53,foot:22,ankle:19,inseam:64,thigh:46},
  baby_nb:  {bust:37,hip:37,waist:37,sleeve:16,back:19,shoulder:16,armhole:8,head:35,foot:8.5,ankle:12,inseam:17,thigh:21},
  baby_0_3: {bust:39.5,hip:39.5,waist:39.5,sleeve:17.5,back:20.5,shoulder:17,armhole:8.5,head:37,foot:9.5,ankle:12.5,inseam:19,thigh:22},
  baby_3_6: {bust:42,hip:42,waist:42,sleeve:19,back:22,shoulder:18,armhole:9,head:41,foot:10.5,ankle:13,inseam:22,thigh:24},
  baby_6_12:{bust:45.5,hip:45.5,waist:45.5,sleeve:21,back:24,shoulder:19,armhole:9.5,head:44,foot:11.5,ankle:14,inseam:25,thigh:26},
  baby_12_18:{bust:49.5,hip:49.5,waist:49.5,sleeve:23,back:26,shoulder:20,armhole:10.5,head:46,foot:12.5,ankle:14.5,inseam:28,thigh:28},
  baby_18_24:{bust:52,hip:52,waist:52,sleeve:24.5,back:27.5,shoulder:21,armhole:11,head:47,foot:13,ankle:15,inseam:30,thigh:30},
};

// ─── SKALIERUNGS-MATHEMATIK ───────────────────────────────────

function calcScaleFactors(massKey, baseMassVal, targetSizeKey) {
  if (!massKey || massKey === 'none' || !baseMassVal || baseMassVal <= 0) {
    return { sfB:1, sfH:1, targetMass:null, warning:null };
  }
  const target = BODY_MEAS_FULL[targetSizeKey];
  if (!target) return { sfB:1, sfH:1, targetMass:null, warning:null };
  const targetMass = target[massKey];
  if (!targetMass) return { sfB:1, sfH:1, targetMass:null, warning:null };
  const sfB = targetMass / baseMassVal;
  const sfH = sfB; // Höhe proportional zur Breite
  const warning = (sfB < 0.7 || sfB > 1.3)
    ? `Großer Größensprung (×${sfB.toFixed(2)}) — Konstruktion prüfen`
    : null;
  return { sfB, sfH, targetMass, warning };
}

function roundToRapport(raw, mult, plus) {
  mult = +mult || 0; plus = +plus || 0;
  if (mult <= 1) return Math.round(raw);
  const nLow  = Math.floor((raw - plus) / mult);
  const nHigh = Math.ceil( (raw - plus) / mult);
  const vLow  = nLow  * mult + plus;
  const vHigh = nHigh * mult + plus;
  return Math.abs(vLow - raw) <= Math.abs(vHigh - raw) ? vLow : vHigh;
}

// Magic Formula: verteilt X Events auf Y Reihen
function magicFormula(reihen, events) {
  if (!events || events <= 0) return null;
  if (events > reihen) return { text: `Alle ${Math.ceil(reihen/events)} R`, count: events };
  const c = Math.floor(reihen / events);
  const d = reihen % events;
  const e = events - d;
  if (d === 0) return { text: `Alle ${c} R, ${events}×` };
  return { text: `${e}× alle ${c} R, dann ${d}× alle ${c+1} R` };
}

// Skaliere eine Maschen-Zahl (Breite)
function scaleM(val, sfB, rapport, rapportPlus) {
  if (!val || val === '') return '';
  const raw = +val * sfB;
  return roundToRapport(raw, rapport, rapportPlus);
}

// Skaliere eine Reihen-Zahl (Höhe)
function scaleR(val, sfH) {
  if (!val || val === '') return '';
  return Math.round(+val * sfH);
}

// ─── EDITOR STATE ─────────────────────────────────────────────
let currentTags     = [];
let currentMaschen  = [];
let currentImages   = [];
let currentCounters = [];
let currentMarkers  = [];
let currentNotes    = [];
let leseRows        = [];
let leseCurrentRow  = 0;

// ─── ANLEITUNGEN RENDER ───────────────────────────────────────
function renderAnleitungen(filter) {
  const list = document.getElementById('anl-list');
  if (!list) return;
  const f = filter === 'alle'
    ? appState.patterns
    : appState.patterns.filter(p => p.status === filter || (filter === 'draft' && p.status === 'open'));
  if (f.length === 0) {
    list.innerHTML = '<p class="txt-light" style="text-align:center;padding:2.5rem;">Keine Anleitungen in dieser Kategorie.</p>';
    return;
  }
  list.innerHTML = f.map(p => patternRowHTML(p)).join('');
}

function filterAnl(btn, filter) {
  document.querySelectorAll('.f-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAnleitungen(filter);
}

// ─── EDITOR ───────────────────────────────────────────────────
function openEditor(id) {
  historyStack.push(currentScreen);
  showScreen('editor');

  if (id === null) {
    currentPatternId = null;
    currentTags = []; currentMaschen = []; currentImages = [];
    currentCounters = []; currentMarkers = []; currentNotes = [];
    window._currentSchnitt = [];
    window._anleitungSchritte = {};

    document.getElementById('ed-heading').textContent = 'Neue Anleitung';
    document.getElementById('ed-title').value = '';
    document.getElementById('ed-kat').value = '';
    document.getElementById('ed-nadel').value = '';
    document.getElementById('ed-diff').value = '2';
    document.getElementById('ed-status').value = 'draft';
    document.getElementById('ed-gauge-m').value = '';
    document.getElementById('ed-gauge-r').value = '';
    document.getElementById('ed-base-bust').value = '';
    document.getElementById('ed-abbr').value = '';
    // Reset Schnittteil-Select
    const sel = document.getElementById('anl-schnitt-select');
    if (sel) sel.innerHTML = '<option value="__allgemein__">Allgemeine Anleitung</option>';
    const defaultSize = appState.profil.groesse || 'damen_m';
    document.getElementById('ed-size-select').value = defaultSize;
  } else {
    currentPatternId = id;
    const p = appState.patterns.find(x => x.id === id);
    if (!p) return;

    document.getElementById('ed-heading').textContent = p.title || 'Anleitung';
    document.getElementById('ed-title').value   = p.title   || '';
    document.getElementById('ed-kat').value     = p.kat     || '';
    document.getElementById('ed-nadel').value   = p.needle  || '';
    document.getElementById('ed-diff').value    = p.diff    || '2';
    document.getElementById('ed-status').value  = p.status  || 'draft';
    document.getElementById('ed-gauge-m').value = p.gaugeM  || '';
    document.getElementById('ed-gauge-r').value = p.gaugeR  || '';
    document.getElementById('ed-base-bust').value = p.baseBust || '';
    document.getElementById('ed-text').value    = p.text    || '';
    document.getElementById('ed-abbr').value    = p.abbr    || '';

    currentTags     = [...(p.tags     || [])];
    currentMaschen  = [...(p.maschen  || [])];
    currentImages   = [...(p.images   || [])];
    currentCounters = [...(p.counters || [])];
    currentMarkers  = [...(p.markers  || [])];
    currentNotes    = [...(p.notes    || [])];
    window._currentSchnitt = p.schnitt ? JSON.parse(JSON.stringify(p.schnitt)) : [];
    loadAnleitungData(p.anleitungSchritte || {});
  }

  renderChips('tags', currentTags);
  renderChips('maschen', currentMaschen, true);
  renderImagePreviews();
  renderSchnittteilList();
  renderCounters();
  renderMarkers();
  renderProjectNotes();
  switchEdTab(document.querySelector('.e-tab'), 'tp-details');
}

function savePattern() {
  const title    = document.getElementById('ed-title').value.trim();
  const kat      = document.getElementById('ed-kat').value.trim();
  const needle   = document.getElementById('ed-nadel').value || '';
  const diff     = +document.getElementById('ed-diff').value;
  const status   = document.getElementById('ed-status').value;
  const gaugeM   = +document.getElementById('ed-gauge-m').value || null;
  const gaugeR   = +document.getElementById('ed-gauge-r').value || null;
  const baseBust = +document.getElementById('ed-base-bust').value || null;
  const text     = document.getElementById('ed-text').value;
  const abbr     = document.getElementById('ed-abbr').value;

  const data = {
    title: title || 'Unbenannte Anleitung',
    emoji: currentImages.length > 0 ? '📷' : '🧶',
    kat, needle, diff, status, gaugeM, gaugeR, baseBust, text, abbr,
    tags: [...currentTags], maschen: [...currentMaschen],
    images: [...currentImages],
    schnitt: window._currentSchnitt ? JSON.parse(JSON.stringify(window._currentSchnitt)) : [],
    anleitungSchritte: collectAnleitungData(),
    counters: [...currentCounters], markers: [...currentMarkers], notes: [...currentNotes],
    mat: kat || needle || 'Handarbeit',
  };

  if (currentPatternId === null) {
    data.id = appState.nextPatternId++;
    appState.patterns.unshift(data);
  } else {
    const idx = appState.patterns.findIndex(p => p.id === currentPatternId);
    if (idx >= 0) appState.patterns[idx] = { ...appState.patterns[idx], ...data };
  }

  saveState();
  showSnackbar('Gespeichert ✓');
  document.getElementById('ed-heading').textContent = data.title;
}

function switchEdTab(btn, panelId) {
  document.querySelectorAll('.e-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

function onSizeChange() { renderSchnittteilList(); }
function triggerScalePreview() { renderSchnittteilList(); }

// ─── CHIPS ────────────────────────────────────────────────────
function renderChips(type, arr, green = false) {
  const wrap = document.getElementById(`chip-${type}`);
  if (!wrap) return;
  wrap.innerHTML = arr.map((c, i) => `
    <span class="chip ${green?'chip-green':''}">
      ${c}
      <button class="chip-remove" onclick="removeChip('${type}',${i})">×</button>
    </span>`).join('');
}

function removeChip(type, i) {
  if (type === 'tags')    { currentTags.splice(i,1);    renderChips('tags', currentTags); }
  else if (type === 'maschen') { currentMaschen.splice(i,1); renderChips('maschen', currentMaschen, true); }
}

function addTagChip(e) {
  if (e.key !== 'Enter' && e.key !== ',') return;
  e.preventDefault();
  addTagFromInput();
}

// Mobiler Fallback: keyup für Enter
function addTagChipMobile(e) {
  if (e.key === 'Enter') { e.preventDefault(); addTagFromInput(); }
}

function addTagFromBtn() {
  addTagFromInput();
}

function addTagFromInput() {
  const input = document.getElementById('ed-tag-input');
  if (!input) return;
  const val = input.value.trim().replace(/,/g,'');
  if (val && !currentTags.includes(val)) {
    currentTags.push(val);
    renderChips('tags', currentTags);
  }
  input.value = '';
  closeAC('tags');
}

function addMaschenChip(e) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const val = e.target.value.trim();
  if (val && !currentMaschen.includes(val)) { currentMaschen.push(val); renderChips('maschen', currentMaschen, true); }
  e.target.value = ''; closeAC('maschen');
}

function addMaschenFromAC(val) {
  if (val && !currentMaschen.includes(val)) { currentMaschen.push(val); renderChips('maschen', currentMaschen, true); }
  document.getElementById('ed-maschen-input').value = ''; closeAC('maschen');
}

function addTagFromAC(val) {
  if (val && !currentTags.includes(val)) { currentTags.push(val); renderChips('tags', currentTags); }
  document.getElementById('ed-tag-input').value = ''; closeAC('tags');
}

function acKat(q) {
  const dd = document.getElementById('ac-kat');
  if (!q) { dd.classList.remove('show'); return; }
  const hits = KATEGORIEN_LIST.filter(k => k.toLowerCase().includes(q.toLowerCase())).slice(0,6);
  if (!hits.length) { dd.classList.remove('show'); return; }
  dd.innerHTML = hits.map(k => `<div class="ac-item" onclick="document.getElementById('ed-kat').value='${k}';document.getElementById('ac-kat').classList.remove('show');">${k}</div>`).join('');
  dd.classList.add('show');
}

function acTags(q) {
  const dd = document.getElementById('ac-tags');
  if (!q) { dd.classList.remove('show'); return; }
  const hits = TAGS_LIST.filter(t => t.toLowerCase().includes(q.toLowerCase()) && !currentTags.includes(t)).slice(0,6);
  if (!hits.length) { dd.classList.remove('show'); return; }
  dd.innerHTML = hits.map(t => `<div class="ac-item" onclick="addTagFromAC('${t}')">${t}</div>`).join('');
  dd.classList.add('show');
}

function acMaschen(q) {
  const dd = document.getElementById('ac-maschen');
  if (!q) { dd.classList.remove('show'); return; }
  const hits = ALLE_MASCHEN.filter(m => m.toLowerCase().includes(q.toLowerCase()) && !currentMaschen.includes(m)).slice(0,8);
  if (!hits.length) { dd.classList.remove('show'); return; }
  dd.innerHTML = hits.map(m => `<div class="ac-item" onclick="addMaschenFromAC('${m.replace(/'/g,"\\'")}')"><span style="color:var(--green);">●</span> ${m}</div>`).join('');
  dd.classList.add('show');
}

function closeAC(id) {
  const dd = document.getElementById('ac-' + id);
  if (dd) dd.classList.remove('show');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.ac-wrap') && !e.target.closest('.search-inner')) {
    document.querySelectorAll('.ac-dropdown').forEach(d => d.classList.remove('show'));
    document.querySelectorAll('.search-dropdown').forEach(d => d.classList.remove('show'));
  }
});

// ─── BILDER ───────────────────────────────────────────────────
function handleImgUpload(input) {
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => { currentImages.push(e.target.result); renderImagePreviews(); };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function renderImagePreviews() {
  const grid = document.getElementById('img-preview-grid');
  if (!grid) return;
  if (currentImages.length === 0) { grid.innerHTML = ''; return; }
  grid.innerHTML = currentImages.map((src, i) => `
    <div class="img-preview-item ${i===0?'is-title':''}">
      <img src="${src}" alt="">
      <button class="img-remove" onclick="removeImage(${i})">✕</button>
    </div>`).join('');
}

function removeImage(i) { currentImages.splice(i, 1); renderImagePreviews(); }

// ─── STRUKTURIERTE SCHNITTTEILE ───────────────────────────────

function addSchnittSheet() {
  const el = document.getElementById('schnitt-vorschlaege');
  el.innerHTML = SCHNITT_LISTE.map(s =>
    `<button class="btn btn-ghost btn-full" style="justify-content:flex-start;border-radius:var(--r-sm);padding:0.65rem 1rem;margin-bottom:0.25rem;" onclick="addSchnittFromSheet('${s}')">${s}</button>`
  ).join('');
  openSheet('schnitt');
}

function addCustomSchnitt() {
  const v = document.getElementById('schnitt-custom').value.trim();
  if (v) { addSchnittFromSheet(v); document.getElementById('schnitt-custom').value = ''; }
}

// Ease-Vorlagen nach Teiltyp und Maß
const EASE_VORLAGEN = {
  'Eng':       { bust:-2, hip:-2, waist:-2, sleeve:0, back:0, shoulder:0, armhole:0, head:-3, foot:-2, ankle:-3, inseam:0, thigh:-2 },
  'Klassisch': { bust:8,  hip:8,  waist:6,  sleeve:0, back:0, shoulder:0, armhole:0, head:0,  foot:0,  ankle:2,  inseam:0, thigh:4  },
  'Locker':    { bust:15, hip:15, waist:12, sleeve:1, back:1, shoulder:0, armhole:1, head:2,  foot:0,  ankle:4,  inseam:0, thigh:8  },
  'Oversized': { bust:22, hip:20, waist:18, sleeve:2, back:2, shoulder:1, armhole:2, head:3,  foot:0,  ankle:6,  inseam:0, thigh:12 },
};

// Teiltyp: bestimmt ob Ease ÷2 gerechnet wird
const TEILTYP_OPTIONS = [
  { key:'halb',  label:'Halbstück',   note:'z.B. Vorder-/Rückenteil, Hosenbein → Ease ÷ 2' },
  { key:'rund',  label:'Rundstück',   note:'z.B. Ärmel, Mütze, Socke → Ease ÷ 2' },
  { key:'ganz',  label:'Ganzes Teil', note:'z.B. Tasche, Decke, Schal → Ease direkt' },
];

// Standard-Teiltyp
const SCHNITT_DEFAULT_TEILTYP = {
  'Vorderteil':'halb','Rückenteil':'halb',
  'Ärmel links':'rund','Ärmel rechts':'rund','Ärmel (×2)':'rund',
  'Kragen':'rund','Bündchen':'rund','Tasche':'ganz','Kapuze':'halb',
  'Hosenbein links':'halb','Hosenbein rechts':'halb',
  'Rockbahn':'halb','Krempe':'rund','Manschette':'rund',
  'Schulterpartie':'halb','Besatz':'ganz','Gürtel':'ganz',
};

function addSchnittFromSheet(name) {
  closeSheet('schnitt');
  if (!window._currentSchnitt) window._currentSchnitt = [];
  const massKey  = SCHNITT_DEFAULT_MASS[name] || 'bust';
  const teiltyp  = SCHNITT_DEFAULT_TEILTYP[name] || 'halb';
  const baseBust = +document.getElementById('ed-base-bust')?.value || '';
  window._currentSchnitt.push({
    name,
    massKey,
    teiltyp,
    baseMassVal: massKey === 'bust' ? baseBust : '',
    ease: '',
    rapport: '', rapportPlus: '',
    _open: true,
  });
  renderSchnittteilList();
}

function renderSchnittteilList() {
  const list = document.getElementById('schnitt-list');
  if (!list) return;

  const sizeKey = document.getElementById('ed-size-select')?.value || 'damen_m';
  const parts   = window._currentSchnitt || [];

  if (parts.length === 0) {
    list.innerHTML = '<p class="txt-light" style="text-align:center;padding:1.5rem;">Noch keine Schnittteile. Tippe auf + um eines hinzuzufügen.</p>';
    return;
  }

  list.innerHTML = parts.map((p, idx) => {
    const massKey     = p.massKey || 'bust';
    const baseMassVal = +p.baseMassVal || 0;
    const ease        = +p.ease || 0;
    const teiltyp     = p.teiltyp || 'halb';
    const rapport     = +p.rapport || 0;
    const rapportPlus = +p.rapportPlus || 0;

    // Ease ÷ 2 für Halb- und Rundstücke
    const easeDivisor = (teiltyp === 'ganz') ? 1 : 2;
    const easeProTeil = ease / easeDivisor;

    // Fertigmaße: Basis + Ease pro Teil
    const basisMitEase = baseMassVal + easeProTeil;

    // Zielmaß aus Größentabelle
    const targetMeas = BODY_MEAS_FULL[sizeKey];
    let sfB = 1, sfH = 1, targetMass = null, warning = null;

    if (massKey !== 'none' && baseMassVal > 0 && targetMeas) {
      const zielKoerper = targetMeas[massKey];
      if (zielKoerper) {
        const zielMitEase = zielKoerper + easeProTeil;
        sfB = basisMitEase > 0 ? zielMitEase / basisMitEase : zielKoerper / baseMassVal;
        sfH = sfB;
        targetMass = zielMitEase.toFixed(1);
        if (sfB < 0.7 || sfB > 1.3) warning = `Großer Größensprung (×${sfB.toFixed(2)}) — Konstruktion prüfen`;
      }
    }

    const isScaled = Math.abs(sfB - 1) > 0.02 && massKey !== 'none' && baseMassVal > 0;
    const massLabel = SCHNITT_MASS_OPTIONS.find(o => o.key === massKey)?.label || 'Brustumfang';
    const teiltypLabel = TEILTYP_OPTIONS.find(o => o.key === teiltyp)?.label || 'Halbstück';

    return `<div class="schnitt-part">
      <div class="schnitt-part-header" onclick="toggleSchnitt(${idx})">
        <div>
          <h4>${p.name}</h4>
          <p style="font-size:0.65rem;color:var(--textFaint);margin-top:0.1rem;">
            ${massLabel} · ${teiltypLabel}${ease ? ` · Ease +${ease} cm` : ''}${isScaled&&targetMass?' → '+targetMass+' cm fertig':''}
          </p>
        </div>
        <div class="flex align-c gap-sm">
          ${isScaled ? `<span style="font-size:0.65rem;color:var(--green);font-family:var(--mono);">×${sfB.toFixed(3)}</span>` : ''}
          <button onclick="event.stopPropagation();removeSchnitt(${idx})" style="background:none;border:none;cursor:pointer;color:var(--textFaint);">✕</button>
        </div>
      </div>

      <div class="schnitt-part-body ${p._open?'open':''}" id="schnitt-body-${idx}">
        ${warning ? `<div class="warning-box mb-sm">⚠️ ${warning}</div>` : ''}
        ${isScaled ? `<div style="background:var(--greenFaint);border:1px solid var(--greenPale);border-radius:var(--r-sm);padding:0.5rem 0.75rem;font-size:0.72rem;margin-bottom:0.75rem;color:var(--greenDark);">
          ✓ Fertigmaß Basis: ${basisMitEase.toFixed(1)} cm · Ziel: ${targetMass} cm · SF: ×${sfB.toFixed(3)}
        </div>` : ''}

        <div class="grid-2 mb-sm">
          <div>
            <label class="lbl">Steuerndes Maß</label>
            <select onchange="updateSchnittField(${idx},'massKey',this.value)">
              ${SCHNITT_MASS_OPTIONS.map(o => `<option value="${o.key}" ${massKey===o.key?'selected':''}>${o.icon} ${o.label}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="lbl">Teiltyp</label>
            <select onchange="updateSchnittField(${idx},'teiltyp',this.value)">
              ${TEILTYP_OPTIONS.map(o => `<option value="${o.key}" ${teiltyp===o.key?'selected':''}>${o.label}</option>`).join('')}
            </select>
            <p style="font-size:0.65rem;color:var(--textFaint);margin-top:0.2rem;">${TEILTYP_OPTIONS.find(o=>o.key===teiltyp)?.note||''}</p>
          </div>
        </div>

        <div class="grid-2 mb-sm">
          <div>
            <label class="lbl">${massLabel} Basisgröße (cm)</label>
            <input type="number" inputmode="decimal" value="${p.baseMassVal||''}"
              placeholder="z.B. 94"
              style="font-family:var(--mono);"
              onchange="updateSchnittField(${idx},'baseMassVal',this.value)">
            <p style="font-size:0.65rem;color:var(--textFaint);margin-top:0.2rem;">Körpermaß für das du gehäkelt hast</p>
          </div>
          <div>
            <label class="lbl">Ease gesamt (cm)</label>
            <input type="number" inputmode="decimal" value="${p.ease||''}"
              placeholder="z.B. 20"
              style="font-family:var(--mono);"
              onchange="updateSchnittField(${idx},'ease',this.value)">
            <p style="font-size:0.65rem;color:var(--textFaint);margin-top:0.2rem;">÷${easeDivisor} = ${easeProTeil.toFixed(1)} cm pro Teil</p>
          </div>
        </div>

        <!-- Ease Vorlagen -->
        <div class="mb-sm">
          <label class="lbl">Ease-Vorlage</label>
          <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">
            ${Object.keys(EASE_VORLAGEN).map(v => {
              const easeVal = EASE_VORLAGEN[v][massKey] || 0;
              return `<button class="btn btn-ghost btn-xs" onclick="applyEaseVorlage(${idx},'${v}')">${v} (+${easeVal} cm)</button>`;
            }).join('')}
          </div>
        </div>

        <div class="grid-2 mb-sm">
          <div>
            <label class="lbl">Rapport (Vielfaches)</label>
            <input type="number" inputmode="numeric" value="${p.rapport||''}" placeholder="z.B. 6"
              style="font-family:var(--mono);" onchange="updateSchnittField(${idx},'rapport',this.value)">
          </div>
          <div>
            <label class="lbl">Plus</label>
            <input type="number" inputmode="numeric" value="${p.rapportPlus||''}" placeholder="z.B. 1"
              style="font-family:var(--mono);" onchange="updateSchnittField(${idx},'rapportPlus',this.value)">
          </div>
        </div>
        <p style="font-size:0.68rem;color:var(--textFaint);margin-bottom:0.5rem;">Shell=6+1 · Granny=4+0 · Leer lassen wenn kein Rapport</p>
      </div>
    </div>`;
  }).join('');
}

function applyEaseVorlage(idx, vorlage) {
  if (!window._currentSchnitt) return;
  const p = window._currentSchnitt[idx];
  const easeVal = EASE_VORLAGEN[vorlage]?.[p.massKey||'bust'] || 0;
  p.ease = easeVal.toString();
  renderSchnittteilList();
}

function renderSchrittRow(s, pIdx, sIdx, sfB, sfH, rapport, rapportPlus, isScaled) {
  const typ = SCHRITT_TYPEN.find(t => t.key === s.typ) || SCHRITT_TYPEN[0];

  // Skalierte Werte berechnen
  const scaledM = (s.maschen && isScaled) ? scaleM(s.maschen, sfB, rapport, rapportPlus) : s.maschen;
  const scaledR = (s.reihen  && isScaled) ? scaleR(s.reihen, sfH) : s.reihen;

  // Vorschau-Text je Typ
  let preview = '';
  if (s.typ === 'anschlag' && scaledM) {
    const seiteText = s.seiten === 'beide' ? ' (×2 Seiten)' : '';
    preview = `${scaledM} Maschen anschlagen${seiteText}`;
  } else if (s.typ === 'gerade' && scaledR) {
    preview = `${scaledR} Reihen gerade häkeln`;
  } else if (s.typ === 'abketten' && scaledM) {
    const seiteText = s.seiten === 'beide' ? ` (je Seite ${scaledM} M)` : '';
    preview = `${scaledM} Maschen abketten${seiteText}`;
  } else if (s.typ === 'zunehmen' && scaledM) {
    const seiteText = s.seiten === 'beide' ? ' je Seite' : '';
    preview = `${scaledM} Maschen zunehmen${seiteText}`;
  } else if (s.typ === 'abnehmen' && scaledM) {
    const seiteText = s.seiten === 'beide' ? ' je Seite' : '';
    preview = `${scaledM} Maschen abnehmen${seiteText}`;
  } else if (s.typ === 'verteilt' && scaledM && scaledR) {
    const wdh = s.wiederholungen || 1;
    const mf  = magicFormula(scaledR, wdh);
    const seiteText = s.seiten === 'beide' ? ' je Seite' : '';
    preview = mf ? `${scaledM} M abnehmen${seiteText} — ${mf.text}` : '';
  } else if (s.typ === 'zuverteilt' && scaledM && scaledR) {
    const wdh = s.wiederholungen || 1;
    const mf  = magicFormula(scaledR, wdh);
    const seiteText = s.seiten === 'beide' ? ' je Seite' : '';
    preview = mf ? `${scaledM} M zunehmen${seiteText} — ${mf.text}` : '';
  } else if (s.typ === 'freitext') {
    preview = s.freitext || '';
  }

  return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-sm);padding:0.75rem;position:relative;">
    <div class="flex justify-sb align-c mb-sm">
      <span style="font-size:0.75rem;font-weight:700;color:var(--green);">${typ.icon} ${typ.label}</span>
      <button onclick="removeSchritt(${pIdx},${sIdx})" style="background:none;border:none;cursor:pointer;color:var(--textFaint);font-size:0.85rem;">✕</button>
    </div>

    ${s.typ !== 'freitext' ? `
    <div class="grid-2 mb-sm">
      ${typ.hasM ? `<div>
        <label class="lbl">Maschen (Basisgröße)</label>
        <input type="number" inputmode="numeric" value="${s.maschen||''}" placeholder="0"
          style="font-family:var(--mono);font-weight:700;"
          onchange="updateSchritt(${pIdx},${sIdx},'maschen',this.value)">
      </div>` : '<div></div>'}
      ${typ.hasR ? `<div>
        <label class="lbl">Reihen (Basisgröße)</label>
        <input type="number" inputmode="numeric" value="${s.reihen||''}" placeholder="0"
          style="font-family:var(--mono);font-weight:700;"
          onchange="updateSchritt(${pIdx},${sIdx},'reihen',this.value)">
      </div>` : '<div></div>'}
    </div>
    ` : ''}

    ${(s.typ === 'verteilt' || s.typ === 'zuverteilt') ? `
    <div class="mb-sm">
      <label class="lbl">Anzahl Wiederholungen</label>
      <input type="number" inputmode="numeric" value="${s.wiederholungen||''}" placeholder="z.B. 8"
        style="font-family:var(--mono);"
        onchange="updateSchritt(${pIdx},${sIdx},'wiederholungen',this.value)">
    </div>` : ''}

    ${typ.hasSeiten ? `
    <div class="mb-sm">
      <label class="lbl">Seiten</label>
      <div class="flex gap-sm mt-xs">
        <button class="btn btn-xs ${(s.seiten||'eine')==='eine'?'btn-green':'btn-ghost'}"
          onclick="updateSchritt(${pIdx},${sIdx},'seiten','eine')">Eine Seite</button>
        <button class="btn btn-xs ${s.seiten==='beide'?'btn-green':'btn-ghost'}"
          onclick="updateSchritt(${pIdx},${sIdx},'seiten','beide')">Beide Seiten</button>
      </div>
    </div>` : ''}

    ${s.typ === 'freitext' ? `
    <textarea placeholder="Hinweis oder freier Text…" style="width:100%;min-height:60px;resize:vertical;font-size:0.85rem;"
      onchange="updateSchritt(${pIdx},${sIdx},'freitext',this.value)">${s.freitext||''}</textarea>
    ` : ''}

    ${preview ? `
    <div style="background:var(--greenFaint);border:1px solid var(--greenPale);border-radius:4px;padding:0.5rem 0.75rem;margin-top:0.5rem;">
      <span style="font-size:0.65rem;color:var(--textLight);text-transform:uppercase;letter-spacing:0.08em;font-weight:700;display:block;margin-bottom:0.1rem;">Ausgabe ${isScaled?'(skaliert)':'(Basisgröße)'}:</span>
      <span style="font-family:var(--mono);font-size:0.88rem;color:var(--green);font-weight:700;">${preview}</span>
    </div>` : ''}
  </div>`;
}

function addSchritt(pIdx, typ) {
  if (!window._currentSchnitt) return;
  const p = window._currentSchnitt[pIdx];
  if (!p.schritte) p.schritte = [];
  p.schritte.push({ typ, maschen:'', reihen:'', seiten:'eine', wiederholungen:'', freitext:'' });
  renderSchnittteilList();
}

function updateSchritt(pIdx, sIdx, field, val) {
  if (!window._currentSchnitt) return;
  window._currentSchnitt[pIdx].schritte[sIdx][field] = val;
  renderSchnittteilList();
}

function removeSchritt(pIdx, sIdx) {
  if (!window._currentSchnitt) return;
  window._currentSchnitt[pIdx].schritte.splice(sIdx, 1);
  renderSchnittteilList();
}

function toggleSchnitt(idx) {
  if (!window._currentSchnitt) return;
  window._currentSchnitt[idx]._open = !window._currentSchnitt[idx]._open;
  renderSchnittteilList();
}

function updateSchnittField(idx, field, val) {
  if (!window._currentSchnitt) return;
  window._currentSchnitt[idx][field] = val;
  if (field === 'massKey') window._currentSchnitt[idx].baseMassVal = '';
  renderSchnittteilList();
}

function removeSchnitt(idx) {
  if (!window._currentSchnitt) return;
  window._currentSchnitt.splice(idx, 1);
  renderSchnittteilList();
}

function collectSchnittteilData() {
  return window._currentSchnitt ? JSON.parse(JSON.stringify(window._currentSchnitt)) : [];
}

// ─── GARN ─────────────────────────────────────────────────────
let yarnN = 1;
function addYarn() {
  yarnN++;
  const div = document.createElement('div');
  div.className = 'card'; div.id = `yarn-block-${yarnN}`;
  div.innerHTML = `
    <div class="flex justify-sb align-c mb-md">
      <label class="lbl" style="margin:0;">Garn ${yarnN}</label>
      <button onclick="this.closest('.card').remove()" style="background:none;border:none;cursor:pointer;color:var(--textLight);">✕</button>
    </div>
    <div class="flex-col gap-sm">
      <div class="grid-2">
        <div><label class="lbl">Garnname</label><input type="text" placeholder="z.B. Merino DK"></div>
        <div><label class="lbl">Marke</label><input type="text" placeholder="z.B. Drops"></div>
      </div>
      <div class="grid-2">
        <div><label class="lbl">Farbe</label><input type="text" placeholder="—"></div>
        <div><label class="lbl">Lot-Nr.</label><input type="text" placeholder="—"></div>
      </div>
      <div><label class="lbl">Garnstärke (CYC)</label>
        <select><option>0 – Lace</option><option>1 – Super Fine</option><option>2 – Fine</option><option selected>3 – Light/DK</option><option>4 – Worsted</option><option>5 – Bulky</option><option>6 – Super Bulky</option><option>7 – Jumbo</option></select>
      </div>
      <div class="grid-3">
        <div><label class="lbl">g/Knäuel</label><input type="number" placeholder="100" style="font-family:var(--mono);"></div>
        <div><label class="lbl">Lauflänge m</label><input type="number" placeholder="200" style="font-family:var(--mono);"></div>
        <div><label class="lbl">Anzahl</label><input type="number" placeholder="3" style="font-family:var(--mono);"></div>
      </div>
      <div class="grid-2">
        <div><label class="lbl">Material</label><input type="text" placeholder="100% Merino"></div>
        <div><label class="lbl">€/Knäuel</label><input type="number" step="0.01" placeholder="8,90" style="font-family:var(--mono);"></div>
      </div>
    </div>`;
  document.getElementById('yarn-blocks').appendChild(div);
}

// ─── PROJEKTNOTIZEN ───────────────────────────────────────────
function addProjectNote() {
  const id = Date.now();
  currentNotes.push({ id, text: '' });
  renderProjectNotes();
  setTimeout(() => { const ta = document.getElementById(`pnote-${id}`); if (ta) ta.focus(); }, 50);
}

function renderProjectNotes() {
  const el = document.getElementById('project-notes-list');
  if (!el) return;
  if (currentNotes.length === 0) {
    el.innerHTML = '<p class="txt-light" style="text-align:center;padding:1rem 0;">Noch keine Notizen.</p>';
    return;
  }
  el.innerHTML = currentNotes.map((n, i) => `
    <div class="notiz-card">
      <div class="flex justify-sb align-c mb-sm">
        <p style="font-size:0.7rem;color:var(--textFaint);">Notiz ${i+1}</p>
        <button onclick="removeProjectNote(${n.id})" style="background:none;border:none;cursor:pointer;color:var(--textLight);">🗑</button>
      </div>
      <textarea id="pnote-${n.id}" style="width:100%;border:none;background:transparent;resize:vertical;font-size:0.86rem;color:var(--text);line-height:1.6;outline:none;font-family:var(--sans);min-height:60px;" placeholder="Notiz eingeben…" oninput="updateProjectNote(${n.id},this.value)">${n.text||''}</textarea>
    </div>`).join('');
}

function updateProjectNote(id, val) { const n = currentNotes.find(x => x.id === id); if (n) n.text = val; }
function removeProjectNote(id) { currentNotes = currentNotes.filter(n => n.id !== id); renderProjectNotes(); }

// ─── REIHENZÄHLER ─────────────────────────────────────────────
function addCounter() {
  currentCounters.push({ id: Date.now(), label: 'Zähler', count: 0, target: null });
  renderCounters();
}

function renderCounters() {
  const el = document.getElementById('counters-list');
  if (!el) return;
  if (currentCounters.length === 0) {
    el.innerHTML = '<p class="txt-light" style="text-align:center;padding:0.5rem 0;">Noch kein Zähler.</p>';
    return;
  }
  el.innerHTML = currentCounters.map(c => `
    <div class="card" style="padding:0.75rem;">
      <div class="flex justify-sb align-c mb-sm">
        <div style="flex:1;border:1.5px solid var(--border);border-radius:var(--r-sm);background:var(--bgWarm);padding:0.3rem 0.6rem;margin-right:0.5rem;">
          <input type="text" value="${c.label}" style="border:none;background:transparent;font-family:var(--serif);font-weight:600;font-size:0.9rem;color:var(--text);padding:0;width:100%;outline:none;" onchange="updateCounterLabel(${c.id},this.value)">
        </div>
        <button onclick="removeCounter(${c.id})" style="background:none;border:none;cursor:pointer;color:var(--textFaint);font-size:1rem;">✕</button>
      </div>
      <div class="counter-display" style="padding:0.5rem 0;">
        <span class="counter-number">${c.count}</span>
        ${c.target ? `<div style="height:4px;background:var(--border);border-radius:2px;margin-top:0.5rem;"><div style="height:100%;background:var(--green);border-radius:2px;width:${Math.min(100,(c.count/c.target)*100)}%;transition:width 0.2s;"></div></div><p style="font-family:var(--mono);font-size:0.7rem;color:var(--textLight);margin-top:0.2rem;">Reihe ${c.count} von ${c.target}</p>` : ''}
      </div>
      <div class="counter-btns">
        <button class="counter-big-btn counter-dec" onclick="counterDec(${c.id})">−</button>
        <button onclick="counterReset(${c.id})" style="background:var(--bgWarm);border:1px solid var(--border);cursor:pointer;border-radius:var(--r-sm);padding:0.4rem 0.85rem;font-size:0.75rem;color:var(--textLight);">Reset</button>
        <button class="counter-big-btn counter-inc" onclick="counterInc(${c.id})">+</button>
      </div>
      <div class="mt-sm"><label class="lbl">Ziel-Reihe (optional)</label>
        <input type="number" inputmode="numeric" value="${c.target||''}" placeholder="z.B. 82" style="font-family:var(--mono);font-size:0.88rem;" onchange="updateCounterTarget(${c.id},this.value)">
      </div>
    </div>`).join('');
}

function counterInc(id) { const c = currentCounters.find(x=>x.id===id); if(c){c.count++;renderCounters();} }
function counterDec(id) { const c = currentCounters.find(x=>x.id===id); if(c&&c.count>0){c.count--;renderCounters();} }
function counterReset(id) { const c = currentCounters.find(x=>x.id===id); if(c){c.count=0;renderCounters();} }
function updateCounterLabel(id,val) { const c = currentCounters.find(x=>x.id===id); if(c) c.label=val; }
function updateCounterTarget(id,val) { const c = currentCounters.find(x=>x.id===id); if(c){c.target=+val||null;renderCounters();} }
function removeCounter(id) { currentCounters=currentCounters.filter(c=>c.id!==id); renderCounters(); }

// ─── MASCHENMARKIERUNGEN ──────────────────────────────────────
function addMarker() {
  currentMarkers.push({ id:Date.now(), row:0, stitch:0, type:'raglan', note:'' });
  renderMarkers();
}

function renderMarkers() {
  const el    = document.getElementById('markers-list');
  const empty = document.getElementById('markers-empty');
  if (!el) return;
  if (currentMarkers.length === 0) {
    el.innerHTML = ''; if (empty) empty.style.display = 'block'; return;
  }
  if (empty) empty.style.display = 'none';
  el.innerHTML = currentMarkers.map((m, i) => `
    <div class="card" style="padding:0.75rem;">
      <div class="flex justify-sb align-c mb-sm">
        <div class="flex align-c gap-sm">
          <div style="width:12px;height:12px;border-radius:50%;background:${MARKER_COLORS[m.type]||'#9c7b5a'};flex-shrink:0;"></div>
          <span style="font-size:0.8rem;font-weight:600;color:var(--text);">${markerTypeLabel(m.type)}</span>
        </div>
        <button onclick="removeMarker(${m.id})" style="background:none;border:none;cursor:pointer;color:var(--textFaint);font-size:1rem;">✕</button>
      </div>
      <div class="grid-2 mb-sm">
        <div><label class="lbl">Reihe</label><input type="number" inputmode="numeric" value="${m.row||''}" placeholder="0" style="font-family:var(--mono);" onchange="updateMarker(${m.id},'row',this.value)"></div>
        <div><label class="lbl">Masche</label><input type="number" inputmode="numeric" value="${m.stitch||''}" placeholder="0" style="font-family:var(--mono);" onchange="updateMarker(${m.id},'stitch',this.value)"></div>
      </div>
      <div class="mb-sm"><label class="lbl">Typ</label>
        <select onchange="updateMarker(${m.id},'type',this.value)">
          <option value="raglan" ${m.type==='raglan'?'selected':''}>Raglan</option>
          <option value="seite" ${m.type==='seite'?'selected':''}>Seitennaht</option>
          <option value="rapport" ${m.type==='rapport'?'selected':''}>Musterwiederholung</option>
          <option value="abnahme" ${m.type==='abnahme'?'selected':''}>Abnahme</option>
          <option value="zunahme" ${m.type==='zunahme'?'selected':''}>Zunahme</option>
          <option value="eigen" ${m.type==='eigen'?'selected':''}>Eigener Typ</option>
        </select>
      </div>
      <div><label class="lbl">Notiz (optional)</label><input type="text" value="${m.note||''}" placeholder="z.B. ab hier Raglan-Abnahmen" onchange="updateMarker(${m.id},'note',this.value)"></div>
    </div>`).join('');
}

function updateMarker(id, field, val) {
  const m = currentMarkers.find(x => x.id === id);
  if (!m) return;
  m[field] = (field==='row'||field==='stitch') ? +val||0 : val;
  currentMarkers.sort((a,b) => a.row-b.row || a.stitch-b.stitch);
  renderMarkers();
}

function removeMarker(id) { currentMarkers=currentMarkers.filter(m=>m.id!==id); renderMarkers(); }
function markerTypeLabel(t) { return {raglan:'Raglan',seite:'Seitennaht',rapport:'Rapport',abnahme:'Abnahme',zunahme:'Zunahme',eigen:'Eigener'}[t]||t; }

// ─── LESEMODUS ────────────────────────────────────────────────
function openLesemodus() {
  // Versuche strukturierte Schritte, dann Fallback auf Freitext
  const key = getAktuellesSchnitteil ? getAktuellesSchnitteil() : '__allgemein__';
  const schritte = (window._anleitungSchritte && window._anleitungSchritte[key]) || [];

  if (schritte.length > 0) {
    openLesemodusStrukturiert();
    return;
  }

  // Fallback: Freitext
  const text = document.getElementById('ed-text')?.value?.trim() || '';
  if (!text) { showSnackbar('Kein Anleitungstext vorhanden'); return; }
  leseRows = text.split('\n').filter(r => r.trim().length > 0);
  leseCurrentRow = 0;
  const title = document.getElementById('ed-title').value || 'Anleitung';
  document.getElementById('lese-title').textContent = title;
  document.getElementById('lese-tot').textContent = leseRows.length;
  historyStack.push(currentScreen);
  showScreen('lesemodus');
  renderLesemodus();
  renderLeseCounters();
  renderLeseMarkers();
}

function renderLesemodus() {
  const body = document.getElementById('lese-body');
  if (!body) return;
  document.getElementById('lese-cur').textContent = leseCurrentRow + 1;
  body.innerHTML = leseRows.map((row, i) => {
    let cls = '';
    if (i < leseCurrentRow) cls = 'past';
    else if (i === leseCurrentRow) cls = 'current';
    else if (i === leseCurrentRow + 1) cls = 'next';
    else cls = 'future' + (i <= leseCurrentRow + 3 ? ' visible' : '');
    return `<div class="lese-row ${cls}" onclick="jumpToRow(${i})">
      <span class="lese-row-num">REIHE ${i+1}</span>${row}
    </div>`;
  }).join('');
  document.getElementById('lese-counter').textContent = leseCurrentRow + 1;
  renderLeseMarkers();
  setTimeout(() => {
    const cur = body.querySelector('.lese-row.current');
    if (cur) cur.scrollIntoView({ behavior:'smooth', block:'center' });
  }, 50);
}

function leseNext() {
  if (leseCurrentRow < leseRows.length-1) {
    leseCurrentRow++;
    renderLesemodus();
    savePatternCounters();
  }
}
function leseBack() {
  if (leseCurrentRow > 0) {
    leseCurrentRow--;
    renderLesemodus();
  }
}
function jumpToRow(i) { leseCurrentRow = i; renderLesemodus(); }

// Strukturierter Lesemodus
function openLesemodusStrukturiert() {
  const key = getAktuellesSchnitteil ? getAktuellesSchnitteil() : '__allgemein__';
  const schritte = window._anleitungSchritte?.[key] || [];
  if (!schritte.length) { showSnackbar('Keine Schritte vorhanden'); return; }
  const sizeKey = document.getElementById('ed-size-select')?.value || 'damen_m';
  const schnittTeil = (window._currentSchnitt||[]).find(s => s.name === key);
  let sfB=1, sfH=1, rapport=0, rapportPlus=0;
  if (schnittTeil) {
    const r = calcScaleFactors(schnittTeil.massKey, +schnittTeil.baseMassVal||0, sizeKey);
    sfB=r.sfB; sfH=r.sfH; rapport=+schnittTeil.rapport||0; rapportPlus=+schnittTeil.rapportPlus||0;
  }
  leseRows = generiereAusgabe(schritte, sfB, sfH, rapport, rapportPlus).filter(a=>a.text).map(a=>a.text);
  leseCurrentRow = 0;
  const title = document.getElementById('ed-title').value || 'Anleitung';
  const label = key === '__allgemein__' ? title : `${title} — ${key}`;
  document.getElementById('lese-title').textContent = label;
  document.getElementById('lese-tot').textContent = leseRows.length;
  historyStack.push(currentScreen);
  showScreen('lesemodus');
  renderLesemodus();
  renderLeseCounters();
  renderLeseMarkers();
}

// Zähler im Lesemodus
function renderLeseCounters() {
  const wrap = document.getElementById('lese-counters');
  const inner = document.getElementById('lese-counters-inner');
  if (!wrap||!inner) return;
  if (!currentCounters.length) { wrap.style.display='none'; return; }
  wrap.style.display = 'block';
  inner.innerHTML = currentCounters.map(c => `
    <div style="display:flex;align-items:center;gap:0.5rem;background:var(--bgWarm);border:1px solid var(--border);border-radius:var(--r-md);padding:0.4rem 0.75rem;flex-shrink:0;">
      <span style="font-size:0.72rem;color:var(--textLight);font-weight:600;">${c.label}</span>
      <button onclick="leseCounterDec(${c.id})" style="background:var(--border);border:none;border-radius:50%;width:26px;height:26px;cursor:pointer;font-size:1rem;font-weight:700;color:var(--textMid);">−</button>
      <span style="font-family:var(--mono);font-size:1.1rem;font-weight:700;color:var(--green);min-width:24px;text-align:center;">${c.count}</span>
      <button onclick="leseCounterInc(${c.id})" style="background:var(--green);border:none;border-radius:50%;width:26px;height:26px;cursor:pointer;font-size:1rem;font-weight:700;color:white;">+</button>
      ${c.target?`<span style="font-size:0.68rem;color:var(--textFaint);font-family:var(--mono);">/ ${c.target}</span>`:''}
    </div>`).join('');
}
function leseCounterInc(id) { const c=currentCounters.find(x=>x.id===id); if(c){c.count++;renderLeseCounters();renderCounters();savePatternCounters();} }
function leseCounterDec(id) { const c=currentCounters.find(x=>x.id===id); if(c&&c.count>0){c.count--;renderLeseCounters();renderCounters();savePatternCounters();} }
function savePatternCounters() {
  if (currentPatternId===null) return;
  const idx = appState.patterns.findIndex(p=>p.id===currentPatternId);
  if (idx>=0) { appState.patterns[idx].counters=JSON.parse(JSON.stringify(currentCounters)); saveState(); }
}

// Markierungen im Lesemodus (nur Hinweis)
function renderLeseMarkers() {
  const wrap = document.getElementById('lese-markers-hint');
  const inner = document.getElementById('lese-markers-inner');
  if (!wrap||!inner) return;
  const atRow = currentMarkers.filter(m=>m.row===(leseCurrentRow+1));
  if (!atRow.length) { wrap.style.display='none'; return; }
  wrap.style.display = 'block';
  inner.innerHTML = `<span style="font-size:0.7rem;color:var(--green);font-weight:700;">📍</span>` +
    atRow.map(m=>`<span style="background:var(--surface);border:1px solid var(--greenPale);border-radius:20px;padding:0.15rem 0.6rem;font-size:0.75rem;color:var(--greenDark);">${markerTypeLabel(m.type)}${m.stitch?` M${m.stitch}`:''}${m.note?` — ${m.note}`:''}</span>`).join('');
}

// Feste Maße + Profil-Option
const FIXED_SIZES = {
  fix_baby_decke:{width:90,height:110,label:'Baby-Decke'},
  fix_ueberwurf:{width:130,height:180,label:'Überwurf'},
  fix_single:{width:150,height:200,label:'Einzelbett-Decke'},
  fix_double:{width:200,height:220,label:'Doppelbett-Decke'},
  fix_kissen:{width:40,height:40,label:'Kissenbezug'},
  fix_tischlaeufer:{width:40,height:120,label:'Tischläufer'},
  fix_untersetzer:{width:15,height:15,label:'Untersetzer'},
};

function onSizeChange() {
  const val = document.getElementById('ed-size-select')?.value;
  if (val === 'profil') {
    const p = appState.profil;
    if (p&&p.brust) {
      const bust=+p.brust; let closest='damen_m'; let minDiff=999;
      Object.entries(BODY_MEAS_FULL).forEach(([key,m])=>{ if(m&&m.bust){const d=Math.abs(m.bust-bust);if(d<minDiff){minDiff=d;closest=key;}} });
      document.getElementById('ed-size-select').value = closest;
    } else { showSnackbar('Bitte zuerst Körpermaße im Profil eintragen'); }
  }
  renderSchnittteilList();
}
function triggerScalePreview() { renderSchnittteilList(); }
// ═══════════════════════════════════════════════════════════════

// ─── SYNTAX-DEFINITIONEN ─────────────────────────────────────
const SYNTAX_BEFEHLE = [
  // Maschen (Breite)
  { code:'[___M AS]',         label:'Anschlag',              typ:'anschlag',   einheit:'M' },
  { code:'[___M Abket. bds.]',label:'Abketten beide Seiten', typ:'abket_bds',  einheit:'M' },
  { code:'[___M Abket. eins.]',label:'Abketten eine Seite',  typ:'abket_eins', einheit:'M' },
  { code:'[___M Abn. bds.]',  label:'Abnehmen beide Seiten', typ:'abn_bds',    einheit:'M' },
  { code:'[___M Abn. eins.]', label:'Abnehmen eine Seite',   typ:'abn_eins',   einheit:'M' },
  { code:'[___M Zun. bds.]',  label:'Zunehmen beide Seiten', typ:'zun_bds',    einheit:'M' },
  { code:'[___M Zun. eins.]', label:'Zunehmen eine Seite',   typ:'zun_eins',   einheit:'M' },
  { code:'[___M Abn. bds. / ___R / ___x]', label:'Abnahmen verteilt bds.', typ:'abn_vert_bds', einheit:'M' },
  { code:'[___M Abn. eins. / ___R / ___x]',label:'Abnahmen verteilt eins.',typ:'abn_vert_eins',einheit:'M' },
  { code:'[___M Zun. bds. / ___R / ___x]', label:'Zunahmen verteilt bds.', typ:'zun_vert_bds', einheit:'M' },
  { code:'[___M Zun. eins. / ___R / ___x]',label:'Zunahmen verteilt eins.',typ:'zun_vert_eins',einheit:'M' },
  { code:'[Rest Abket. bds.]',label:'Rest abketten bds.',    typ:'rest_bds',   einheit:null },
  { code:'[Rest Abket. eins.]',label:'Rest abketten eins.',  typ:'rest_eins',  einheit:null },
  // Reihen (Höhe)
  { code:'[___R Ger.]',       label:'Gerade häkeln',         typ:'gerade',     einheit:'R' },
  { code:'[___R Wend.]',      label:'Wendetour',             typ:'wende',      einheit:'R' },
  { code:'[___R Rd.]',        label:'Runde häkeln',          typ:'runde',      einheit:'R' },
  // Spezial
  { code:'[___M MR]',         label:'Magischer Ring',        typ:'mr',         einheit:'M' },
  { code:'[___M Lm]',         label:'Luftmaschenring',       typ:'lm_ring',    einheit:'M' },
  { code:'[Farbe: ___]',      label:'Farbwechsel',           typ:'farbe',      einheit:null },
  { code:'[Marker setzen]',   label:'Marker setzen',         typ:'marker',     einheit:null },
  { code:'[Naht schließen]',  label:'Naht schließen',        typ:'naht',       einheit:null },
  { code:'[Faden abschneiden]',label:'Faden abschneiden',    typ:'faden',      einheit:null },
];

// ─── DSL PARSER ───────────────────────────────────────────────
// Parst einen Schritt-String und gibt strukturierte Daten zurück
function parseSchrittCode(input) {
  if (!input || !input.trim()) return null;

  // Extrahiere alle [ ] Blöcke und ( ) Blöcke
  const parts = [];
  let i = 0;
  const str = input.trim();

  while (i < str.length) {
    if (str[i] === '[') {
      const end = str.indexOf(']', i);
      if (end === -1) break;
      parts.push({ typ: 'code', raw: str.slice(i+1, end) });
      i = end + 1;
    } else if (str[i] === '(') {
      const end = str.indexOf(')', i);
      if (end === -1) break;
      parts.push({ typ: 'notiz', raw: str.slice(i+1, end) });
      i = end + 1;
    } else {
      // Überspringe Leerzeichen zwischen Blöcken
      i++;
    }
  }

  return parts;
}

// Skaliere einen einzelnen [ ]-Block
function skalierteAusgabe(codeRaw, sfB, sfH, rapport, rapportPlus, laufendeMaschen) {
  const c = codeRaw.trim();

  // Zahlen extrahieren
  const nums = [];
  c.replace(/(\d+(?:\.\d+)?)/g, (m, n) => nums.push(+n));

  // Pattern matching
  if (/^(\d+)M AS$/.test(c)) {
    const sM = roundToRapport(nums[0] * sfB, rapport, rapportPlus);
    return { text: `${sM} Maschen anschlagen`, maschen: sM, delta: sM };
  }
  if (/^(\d+)R Ger\.$/.test(c)) {
    const sR = scaleR(nums[0], sfH);
    return { text: `${sR} Reihen gerade häkeln`, reihen: sR, delta: 0 };
  }
  if (/^(\d+)R Wend\.$/.test(c)) {
    const sR = scaleR(nums[0], sfH);
    return { text: `${sR} Wendetouren`, reihen: sR, delta: 0 };
  }
  if (/^(\d+)R Rd\.$/.test(c)) {
    const sR = scaleR(nums[0], sfH);
    return { text: `${sR} Runden häkeln`, reihen: sR, delta: 0 };
  }
  if (/^(\d+)M Abket\. bds\.$/.test(c)) {
    const sM = roundToRapport(nums[0] * sfB, rapport, rapportPlus);
    return { text: `${sM} Maschen abketten je Seite`, maschen: sM, delta: -(sM * 2) };
  }
  if (/^(\d+)M Abket\. eins\.$/.test(c)) {
    const sM = roundToRapport(nums[0] * sfB, rapport, rapportPlus);
    return { text: `${sM} Maschen abketten`, maschen: sM, delta: -sM };
  }
  if (/^(\d+)M Abn\. bds\.$/.test(c)) {
    const sM = roundToRapport(nums[0] * sfB, rapport, rapportPlus);
    return { text: `${sM} Maschen abnehmen je Seite`, maschen: sM, delta: -(sM * 2) };
  }
  if (/^(\d+)M Abn\. eins\.$/.test(c)) {
    const sM = roundToRapport(nums[0] * sfB, rapport, rapportPlus);
    return { text: `${sM} Maschen abnehmen`, maschen: sM, delta: -sM };
  }
  if (/^(\d+)M Zun\. bds\.$/.test(c)) {
    const sM = roundToRapport(nums[0] * sfB, rapport, rapportPlus);
    return { text: `${sM} Maschen zunehmen je Seite`, maschen: sM, delta: sM * 2 };
  }
  if (/^(\d+)M Zun\. eins\.$/.test(c)) {
    const sM = roundToRapport(nums[0] * sfB, rapport, rapportPlus);
    return { text: `${sM} Maschen zunehmen`, maschen: sM, delta: sM };
  }
  // Verteilte Abnahmen: [___M Abn. bds. / ___R / ___x]
  if (/^(\d+)M Abn\. bds\. \/ (\d+)R \/ (\d+)x$/.test(c)) {
    const sM  = roundToRapport(nums[0] * sfB, rapport, rapportPlus);
    const sR  = scaleR(nums[1], sfH);
    const wdh = nums[2]; // Wiederholungen bleiben gleich
    const mf  = magicFormula(sR, wdh);
    return { text: `${sM} Maschen abnehmen je Seite — ${mf}`, delta: -(sM * 2 * wdh) };
  }
  if (/^(\d+)M Abn\. eins\. \/ (\d+)R \/ (\d+)x$/.test(c)) {
    const sM  = roundToRapport(nums[0] * sfB, rapport, rapportPlus);
    const sR  = scaleR(nums[1], sfH);
    const wdh = nums[2];
    const mf  = magicFormula(sR, wdh);
    return { text: `${sM} Maschen abnehmen — ${mf}`, delta: -(sM * wdh) };
  }
  if (/^(\d+)M Zun\. bds\. \/ (\d+)R \/ (\d+)x$/.test(c)) {
    const sM  = roundToRapport(nums[0] * sfB, rapport, rapportPlus);
    const sR  = scaleR(nums[1], sfH);
    const wdh = nums[2];
    const mf  = magicFormula(sR, wdh);
    return { text: `${sM} Maschen zunehmen je Seite — ${mf}`, delta: sM * 2 * wdh };
  }
  if (/^(\d+)M Zun\. eins\. \/ (\d+)R \/ (\d+)x$/.test(c)) {
    const sM  = roundToRapport(nums[0] * sfB, rapport, rapportPlus);
    const sR  = scaleR(nums[1], sfH);
    const wdh = nums[2];
    const mf  = magicFormula(sR, wdh);
    return { text: `${sM} Maschen zunehmen — ${mf}`, delta: sM * wdh };
  }
  // Rest abketten
  if (/^Rest Abket\. bds\.$/.test(c)) {
    const je = Math.floor(laufendeMaschen / 2);
    return { text: `${je} Maschen abketten je Seite`, maschen: je, delta: -laufendeMaschen };
  }
  if (/^Rest Abket\. eins\.$/.test(c)) {
    return { text: `${laufendeMaschen} Maschen abketten`, maschen: laufendeMaschen, delta: -laufendeMaschen };
  }
  // Magischer Ring
  if (/^(\d+)M MR$/.test(c)) {
    const sM = roundToRapport(nums[0] * sfB, rapport, rapportPlus);
    return { text: `Magischen Ring mit ${sM} Maschen schließen`, maschen: sM, delta: sM };
  }
  if (/^(\d+)M Lm$/.test(c)) {
    const sM = roundToRapport(nums[0] * sfB, rapport, rapportPlus);
    return { text: `${sM} Luftmaschen anschlagen`, maschen: sM, delta: sM };
  }
  // Farbwechsel
  if (/^Farbe: (.+)$/.test(c)) {
    const match = c.match(/^Farbe: (.+)$/);
    return { text: `Farbe wechseln zu: ${match[1]}`, delta: 0 };
  }
  // Fix-Befehle
  if (c === 'Marker setzen') return { text: 'Marker setzen', delta: 0 };
  if (c === 'Naht schließen') return { text: 'Naht schließen', delta: 0 };
  if (c === 'Faden abschneiden') return { text: 'Faden abschneiden und vernähen', delta: 0 };

  // Unbekannt → 1:1 ausgeben
  return { text: codeRaw, delta: 0 };
}

// Hauptfunktion: generiere Ausgabe für eine Schnittteil-Anleitung
function generiereAusgabe(schritte, sfB, sfH, rapport, rapportPlus) {
  let laufendeMaschen = 0;
  const ausgabe = [];

  schritte.forEach((schritt, idx) => {
    const parts = parseSchrittCode(schritt.code);
    if (!parts) return;

    let zeilenText = '';
    let totalDelta = 0;

    parts.forEach(part => {
      if (part.typ === 'code') {
        const result = skalierteAusgabe(part.raw, sfB, sfH, rapport, rapportPlus, laufendeMaschen);
        if (result) {
          zeilenText += result.text;
          totalDelta += result.delta || 0;
        }
      } else if (part.typ === 'notiz') {
        zeilenText += ` — ${part.raw}`;
      }
    });

    laufendeMaschen += totalDelta;

    ausgabe.push({
      nr: idx + 1,
      text: zeilenText,
      maschen: laufendeMaschen > 0 ? laufendeMaschen : null,
    });
  });

  return ausgabe;
}

// ─── EDITOR STATE für Anleitungen ─────────────────────────────
// Anleitungen sind pro Schnittteil gespeichert
// window._anleitungSchritte = { '__allgemein__': [...], 'Vorderteil': [...], ... }

function getAktuellesSchnitteil() {
  return document.getElementById('anl-schnitt-select')?.value || '__allgemein__';
}

function getSchritte(key) {
  if (!window._anleitungSchritte) window._anleitungSchritte = {};
  if (!window._anleitungSchritte[key]) window._anleitungSchritte[key] = [];
  return window._anleitungSchritte[key];
}

function switchAnlSchnitt(key) {
  const label = key === '__allgemein__' ? 'Allgemeine Anleitung' : key;
  document.getElementById('anl-schnitt-label').textContent = `Schritte — ${label}`;
  renderAnlSchritte();
}

function updateSchnittSelect() {
  const sel = document.getElementById('anl-schnitt-select');
  if (!sel) return;
  const current = sel.value;
  const teile = (window._currentSchnitt || []).map(s => s.name);
  sel.innerHTML = `<option value="__allgemein__">Allgemeine Anleitung</option>` +
    teile.map(t => `<option value="${t}">${t}</option>`).join('');
  if (teile.includes(current)) sel.value = current;
}

function addAnlSchritt() {
  const key = getAktuellesSchnitteil();
  getSchritte(key).push({ id: Date.now(), code: '' });
  renderAnlSchritte();
  // Focus letztes Feld
  setTimeout(() => {
    const inputs = document.querySelectorAll('.anl-schritt-input');
    if (inputs.length) inputs[inputs.length-1].focus();
  }, 50);
}

function updateAnlSchritt(id, val) {
  const key = getAktuellesSchnitteil();
  const s = getSchritte(key).find(x => x.id === id);
  if (s) s.code = val;
  // Live-Vorschau aktualisieren
  renderSchrittVorschau(id, val);
}

function removeAnlSchritt(id) {
  const key = getAktuellesSchnitteil();
  const arr = getSchritte(key);
  const idx = arr.findIndex(x => x.id === id);
  if (idx >= 0) arr.splice(idx, 1);
  renderAnlSchritte();
}

function renderAnlSchritte() {
  const el = document.getElementById('anl-schritte-list');
  if (!el) return;
  updateSchnittSelect();

  const key      = getAktuellesSchnitteil();
  const schritte = getSchritte(key);
  const sizeKey  = document.getElementById('ed-size-select')?.value || 'damen_m';

  const schnittTeil = (window._currentSchnitt||[]).find(s => s.name === key);
  let sfB = 1, sfH = 1, rapport = 0, rapportPlus = 0;
  if (schnittTeil) {
    const r = calcScaleFactors(schnittTeil.massKey, +schnittTeil.baseMassVal||0, sizeKey);
    sfB = r.sfB; sfH = r.sfH;
    rapport = +schnittTeil.rapport || 0;
    rapportPlus = +schnittTeil.rapportPlus || 0;
  }

  if (schritte.length === 0) {
    el.innerHTML = `<p class="txt-light" style="text-align:center;padding:1rem;">Noch keine Schritte.</p>`;
    return;
  }

  const ausgabe = generiereAusgabe(schritte, sfB, sfH, rapport, rapportPlus);

  el.innerHTML = schritte.map((s, i) => {
    const vorschau = ausgabe[i];
    return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:0.75rem;">
      <div class="flex align-c gap-sm mb-sm">
        <span style="font-family:var(--mono);font-size:0.72rem;color:var(--textFaint);font-weight:700;min-width:22px;">S${i+1}</span>
        <input type="text"
          class="anl-schritt-input"
          data-id="${s.id}"
          value="${(s.code||'').replace(/"/g,'&quot;')}"
          placeholder="z.B. [90M AS] oder (Notiz hier)"
          style="font-family:var(--mono);font-size:0.85rem;border-color:var(--border);"
          onblur="updateAnlSchrittSave(${s.id},this.value)">
        <button onclick="removeAnlSchritt(${s.id})" style="background:none;border:none;cursor:pointer;color:var(--textFaint);flex-shrink:0;">✕</button>
      </div>
      ${vorschau && vorschau.text ? `
        <div style="background:var(--greenFaint);border-radius:4px;padding:0.4rem 0.65rem;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:0.82rem;color:var(--greenDark);">→ ${vorschau.text}</span>
          ${vorschau.maschen ? `<span style="font-family:var(--mono);font-size:0.7rem;color:var(--textLight);">${vorschau.maschen}M</span>` : ''}
        </div>` : ''}
    </div>`;
  }).join('');
}

// onblur statt oninput — verhindert Tastatur-Schließen beim Tippen
function updateAnlSchrittSave(id, val) {
  const key = getAktuellesSchnitteil();
  const s = getSchritte(key).find(x => x.id === id);
  if (s) { s.code = val; renderAnlSchritte(); }
}

// Lesemodus für strukturierte Anleitung
function openLesemodusStrukturiert() {
  const key = getAktuellesSchnitteil();
  const schritte = getSchritte(key);
  if (!schritte || schritte.length === 0) {
    showSnackbar('Keine Schritte vorhanden'); return;
  }
  const sizeKey = document.getElementById('ed-size-select')?.value || 'damen_m';
  const schnittTeil = (window._currentSchnitt||[]).find(s => s.name === key);
  let sfB = 1, sfH = 1, rapport = 0, rapportPlus = 0;
  if (schnittTeil) {
    const r = calcScaleFactors(schnittTeil.massKey, +schnittTeil.baseMassVal||0, sizeKey);
    sfB = r.sfB; sfH = r.sfH;
    rapport = +schnittTeil.rapport || 0;
    rapportPlus = +schnittTeil.rapportPlus || 0;
  }
  const ausgabe = generiereAusgabe(schritte, sfB, sfH, rapport, rapportPlus);
  leseRows = ausgabe.filter(a => a.text).map(a => a.text);
  leseCurrentRow = 0;
  const title = document.getElementById('ed-title').value || 'Anleitung';
  const label = key === '__allgemein__' ? title : `${title} — ${key}`;
  document.getElementById('lese-title').textContent = label;
  document.getElementById('lese-tot').textContent = leseRows.length;
  historyStack.push(currentScreen);
  showScreen('lesemodus');
  renderLesemodus();
  renderLeseCounters();
  renderLeseMarkers();
}

// Syntax chips — ersetzt Inhalt des fokussierten Schritts, oder erstellt neuen
function insertSyntax(code) {
  const key = getAktuellesSchnitteil();
  const schritte = getSchritte(key);

  // Prüfe ob ein Schritt-Input gerade fokussiert ist
  const focused = document.querySelector('.anl-schritt-input:focus');
  if (focused) {
    // Ersetze Inhalt des fokussierten Feldes
    const id = +focused.getAttribute('data-id');
    const s = schritte.find(x => x.id === id);
    if (s) { s.code = code; }
  } else if (schritte.length > 0 && schritte[schritte.length-1].code === '') {
    // Letzter Schritt ist leer → fülle ihn
    schritte[schritte.length-1].code = code;
  } else {
    // Neuen Schritt erstellen
    schritte.push({ id: Date.now(), code });
  }

  document.getElementById('syntax-guide').style.display = 'none';
  renderAnlSchritte();
}

// ─── SYNTAX GUIDE ─────────────────────────────────────────────
function toggleSyntaxGuide() {
  const guide = document.getElementById('syntax-guide');
  if (!guide) return;
  const isOpen = guide.style.display !== 'none';
  guide.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) renderSyntaxChips();
}

function renderSyntaxChips() {
  const el = document.getElementById('syntax-chips');
  if (!el) return;
  el.innerHTML = SYNTAX_BEFEHLE.map(b =>
    `<button onclick="insertSyntax('${b.code.replace(/'/g,"\\'").replace(/\\/g,'\\\\')}')"
      style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:0.3rem 0.75rem;font-family:var(--mono);font-size:0.72rem;color:rgba(255,255,255,0.85);cursor:pointer;white-space:nowrap;margin-bottom:2px;">
      ${b.code}
    </button>`
  ).join('');
}
// Wird in savePattern() aufgerufen — speichert _anleitungSchritte in Pattern
function collectAnleitungData() {
  return window._anleitungSchritte ? JSON.parse(JSON.stringify(window._anleitungSchritte)) : {};
}

function loadAnleitungData(data) {
  window._anleitungSchritte = data ? JSON.parse(JSON.stringify(data)) : {};
}
