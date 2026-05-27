/* ═══════════════════════════════════════════════════════════════
   MASCHEN & MASSE — anleitungen.js
   Anleitungen, Editor, Chips, Bilder, Lesemodus, Zähler, Marker
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── MASCHEN-DATEN (vollständig aus Projektdateien) ──────────
const ALLE_MASCHEN = [
  // Grundmaschen
  'Anfangsschlinge','Luftmasche (Lm)','Kettmasche (Km)','Feste Masche (fM)',
  'Halbes Stäbchen (hStb)','Stäbchen (Stb)','Doppelstäbchen (DStb)',
  'Dreifachstäbchen (3-fStb)','Vierfachstäbchen (4-fStb)',
  // Kombinierte Maschen
  'Shell / Muschel','V-Stitch','Cluster / Büschelmasche','Popcornmasche',
  'Noppe / Bobble','Puffmasche','Granny Square',
  // Loop & Post
  'FP-Stäbchen (FPdc)','BP-Stäbchen (BPdc)','FP-Doppelstäbchen','BP-Doppelstäbchen',
  'BLO (hinteres Maschenglied)','FLO (vorderes Maschenglied)',
  // Zunahmen/Abnahmen
  'Zunahme (2 fM in 1 M)','Abnahme (2 fM zsm)','Zunahme Stäbchen','Abnahme Stäbchen',
  // Spezial
  'Magischer Ring','Picot','Foundation Single Crochet (FSC)',
  'Foundation Double Crochet (FDC)','Spike Stitch','Linked Stitch',
  'Bullion Stitch','Crocodile Stitch','Broomstick Lace','Hairpin Lace',
  // Muster
  'Rippenmuster (FP/BP)','Mosaic / Mosaikmuster','Tunisisch Einfach',
  'Tunisisch Fullstitch','C2C (Corner to Corner)','Filet-Häkeln',
  'Ripple / Chevron','Basket Weave','Moss Stitch / Linen Stitch',
  'Granny Stripe','Overlay-Crochet','Intarsia',
  // Ränder
  'Krebsmasche (Crab Stitch)','Muschel-Abschlussrand','Picot-Rand',
];

const KATEGORIEN_LIST = [
  'Pullover','Cardigan','Weste','Jacke','Mantel',
  'Kleid','Rock','Hose','Shorts','Overall',
  'Top / Crop Top','T-Shirt','Bluse',
  'Mütze','Beanie','Stirnband','Cowl','Schal','Tuch / Stola',
  'Socken','Handschuhe / Fäustlinge',
  'Tasche','Rucksack','Tote Bag',
  'Decke','Kissen','Wanddekoration',
  'Baby-Jäckchen','Baby-Mütze','Baby-Strampler','Baby-Söckchen',
  'Amigurumi','Spielzeug',
  'Schmuck / Accessoire','Haarband','Ohrringe',
  'Untersetzer','Topflappen',
];

const TAGS_LIST = [
  'Frühling','Sommer','Herbst','Winter',
  'Wolle','Baumwolle','Merino','Alpaka','Bambus','Leinen','Acryl','Mohair',
  'Anfänger','Fortgeschritten','Experte',
  'Oversized','Fitted','Cropped',
  'Colorwork','Streifen','Einfarbig',
  'Schnell','Wochenenedprojekt','Langzeitprojekt',
  'Geschenk','Für mich','Für Kinder','Für Baby',
];

const SCHNITT_LISTE = [
  'Vorderteil','Rückenteil','Ärmel links','Ärmel rechts','Ärmel (×2)',
  'Kragen','Bündchen','Tasche','Kapuze','Hosenbein links','Hosenbein rechts',
  'Rockbahn','Krempe','Manschette','Schulterpartie','Besatz','Gürtel',
  'Kragen-Blende','Seitennaht-Besatz','Armausschnitt-Besatz',
];

const MARKER_COLORS = {
  raglan: '#c47a58',
  seite: '#4a6b40',
  rapport: '#5a7098',
  abnahme: '#a05a3a',
  zunahme: '#7a6b3a',
  eigen: '#9c7b5a',
};

// ─── CURRENT EDITOR STATE ────────────────────────────────────
let currentTags    = [];
let currentMaschen = [];
let currentImages  = [];
let currentCounters = [];
let currentMarkers  = [];
let currentNotes    = [];
let leseRows       = [];
let leseCurrentRow = 0;

// ─── ANLEITUNGEN RENDER ──────────────────────────────────────
function renderAnleitungen(filter) {
  const list = document.getElementById('anl-list');
  if (!list) return;
  const f = filter === 'alle' ? appState.patterns : appState.patterns.filter(p => p.status === filter);
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

// ─── EDITOR OPEN ─────────────────────────────────────────────
function openEditor(id) {
  historyStack.push(currentScreen);
  showScreen('editor');

  if (id === null) {
    // Neue Anleitung — komplett leeres Formular
    currentPatternId = null;
    currentTags    = [];
    currentMaschen = [];
    currentImages  = [];
    currentCounters = [];
    currentMarkers  = [];
    currentNotes    = [];

    document.getElementById('ed-heading').textContent = 'Neue Anleitung';
    document.getElementById('ed-title').value = '';
    document.getElementById('ed-kat').value = '';
    document.getElementById('ed-nadel').value = '';
    document.getElementById('ed-diff').value = '2';
    document.getElementById('ed-status').value = 'open';
    document.getElementById('ed-gauge-m').value = '';
    document.getElementById('ed-gauge-r').value = '';
    document.getElementById('ed-base-bust').value = '';
    document.getElementById('ed-text').value = '';
    document.getElementById('ed-abbr').value = '';

    // Reset size to profil default or M
    const defaultSize = appState.profil.groesse || 'damen_m';
    document.getElementById('ed-size-select').value = defaultSize;
  } else {
    // Bestehende Anleitung laden
    currentPatternId = id;
    const p = appState.patterns.find(x => x.id === id);
    if (!p) return;

    document.getElementById('ed-heading').textContent = p.title || 'Anleitung';
    document.getElementById('ed-title').value   = p.title   || '';
    document.getElementById('ed-kat').value     = p.kat     || '';
    document.getElementById('ed-nadel').value   = p.needle  || '';
    document.getElementById('ed-diff').value    = p.diff    || '2';
    document.getElementById('ed-status').value  = p.status  || 'open';
    document.getElementById('ed-gauge-m').value = p.gaugeM  || '';
    document.getElementById('ed-gauge-r').value = p.gaugeR  || '';
    document.getElementById('ed-base-bust').value = p.baseBust || '';
    document.getElementById('ed-text').value    = p.text    || '';
    document.getElementById('ed-abbr').value    = p.abbr    || '';

    currentTags    = [...(p.tags    || [])];
    currentMaschen = [...(p.maschen || [])];
    currentImages  = [...(p.images  || [])];
    currentCounters = [...(p.counters || [])];
    currentMarkers  = [...(p.markers  || [])];
    currentNotes    = [...(p.notes    || [])];
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

// ─── SAVE PATTERN ─────────────────────────────────────────────
function savePattern() {
  const title   = document.getElementById('ed-title').value.trim();
  const kat     = document.getElementById('ed-kat').value.trim();
  const needle  = document.getElementById('ed-nadel').value.trim();
  const diff    = +document.getElementById('ed-diff').value;
  const status  = document.getElementById('ed-status').value;
  const gaugeM  = +document.getElementById('ed-gauge-m').value || null;
  const gaugeR  = +document.getElementById('ed-gauge-r').value || null;
  const baseBust= +document.getElementById('ed-base-bust').value || null;
  const text    = document.getElementById('ed-text').value;
  const abbr    = document.getElementById('ed-abbr').value;

  // Schnittteil-Daten sammeln
  const schnitt = collectSchnittteilData();

  const data = {
    title: title || 'Unbenannte Anleitung',
    emoji: currentImages.length > 0 ? '📷' : '🧶',
    kat, needle, diff, status, gaugeM, gaugeR, baseBust, text, abbr,
    tags: [...currentTags],
    maschen: [...currentMaschen],
    images: [...currentImages],
    schnitt,
    counters: [...currentCounters],
    markers:  [...currentMarkers],
    notes:    [...currentNotes],
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

  // Update Anleitungsliste falls sichtbar
  if (currentScreen === 'editor') {
    // bleibt im Editor
  }
}

// ─── TABS ─────────────────────────────────────────────────────
function switchEdTab(btn, panelId) {
  document.querySelectorAll('.e-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

// ─── SIZE CHANGE ──────────────────────────────────────────────
function onSizeChange() {
  renderSchnittteilList();
}

function triggerScalePreview() {
  renderSchnittteilList();
}

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
  if (type === 'tags') { currentTags.splice(i,1); renderChips('tags', currentTags); }
  else if (type === 'maschen') { currentMaschen.splice(i,1); renderChips('maschen', currentMaschen, true); }
}

function addTagChip(e) {
  if (e.key !== 'Enter' && e.key !== ',') return;
  e.preventDefault();
  const val = e.target.value.trim().replace(/,/g,'');
  if (val && !currentTags.includes(val)) {
    currentTags.push(val);
    renderChips('tags', currentTags);
  }
  e.target.value = '';
  closeAC('tags');
}

function addMaschenChip(e) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const val = e.target.value.trim();
  if (val && !currentMaschen.includes(val)) {
    currentMaschen.push(val);
    renderChips('maschen', currentMaschen, true);
  }
  e.target.value = '';
  closeAC('maschen');
}

function addMaschenFromAC(val) {
  if (val && !currentMaschen.includes(val)) {
    currentMaschen.push(val);
    renderChips('maschen', currentMaschen, true);
  }
  document.getElementById('ed-maschen-input').value = '';
  closeAC('maschen');
}

function addTagFromAC(val) {
  if (val && !currentTags.includes(val)) {
    currentTags.push(val);
    renderChips('tags', currentTags);
  }
  document.getElementById('ed-tag-input').value = '';
  closeAC('tags');
}

// ─── AUTOCOMPLETE ─────────────────────────────────────────────
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

// Close ACs on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.ac-wrap') && !e.target.closest('.search-inner')) {
    document.querySelectorAll('.ac-dropdown').forEach(d => d.classList.remove('show'));
    document.querySelectorAll('.search-dropdown').forEach(d => d.classList.remove('show'));
  }
});

// ─── IMAGE UPLOAD ─────────────────────────────────────────────
function handleImgUpload(input) {
  const files = Array.from(input.files);
  if (!files.length) return;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      currentImages.push(e.target.result);
      renderImagePreviews();
    };
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

function removeImage(i) {
  currentImages.splice(i, 1);
  renderImagePreviews();
}

// ─── SCHNITTTEIL ──────────────────────────────────────────────
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

function addSchnittFromSheet(name) {
  closeSheet('schnitt');
  // Lade aktuelle Anleitung für Gauge-Daten
  const gaugeM = +document.getElementById('ed-gauge-m').value || null;
  const gaugeR = +document.getElementById('ed-gauge-r').value || null;

  const part = { name, maschen: '', reihen: '', breite: '', laenge: '', abnahmen: '' };

  // Initialisiere Schnittteil-Array falls nötig
  if (!window._currentSchnitt) window._currentSchnitt = [];
  window._currentSchnitt.push(part);
  renderSchnittteilList();
}

function renderSchnittteilList() {
  const list = document.getElementById('schnitt-list');
  if (!list) return;

  // Bestimme Skalierungsparameter
  const sizeKey  = document.getElementById('ed-size-select')?.value;
  const gaugeM   = +document.getElementById('ed-gauge-m')?.value || null;
  const baseBust = +document.getElementById('ed-base-bust')?.value || null;
  const targetM  = sizeKey ? BODY_MEASUREMENTS[sizeKey] : null;

  let sfBust = 1;
  let isScaled = false;
  if (targetM && baseBust && baseBust > 0) {
    sfBust = targetM.bust / baseBust;
    isScaled = Math.abs(sfBust - 1) > 0.02;
  }

  const parts = window._currentSchnitt || [];
  if (parts.length === 0) {
    list.innerHTML = '<p class="txt-light" style="text-align:center;padding:1.5rem;">Noch keine Schnittteile. Tippe auf + um eines hinzuzufügen.</p>';
    return;
  }

  list.innerHTML = parts.map((p, idx) => {
    const scaledM = p.maschen ? Math.round(+p.maschen * sfBust) : null;
    const scaledR = p.reihen  ? Math.round(+p.reihen  * sfBust) : null;

    return `<div class="schnitt-part">
      <div class="schnitt-part-header" onclick="toggleSchnitt(${idx})">
        <h4>${p.name}</h4>
        <div class="flex align-c gap-sm">
          ${isScaled && scaledM ? `<span style="font-family:var(--mono);font-size:0.75rem;color:var(--terra);">${scaledM} M</span>` : ''}
          <button onclick="event.stopPropagation();removeSchnitt(${idx})" style="background:none;border:none;cursor:pointer;color:var(--textFaint);">✕</button>
        </div>
      </div>
      <div class="schnitt-part-body ${p._open?'open':''}" id="schnitt-body-${idx}">
        ${isScaled ? `<div class="warning-box mb-sm" style="font-size:0.72rem;">Werte skaliert für ${sizeKey} · Faktor: ${sfBust.toFixed(3)} · Original in Grau</div>` : ''}
        <div class="grid-2 mb-sm">
          <div>
            <label class="lbl">Maschen (Original)</label>
            <input type="number" value="${p.maschen||''}" placeholder="0"
              style="font-family:var(--mono);font-weight:600;color:var(--text);"
              oninput="updateSchnitt(${idx},'maschen',this.value)">
            ${isScaled && scaledM ? `<p style="font-family:var(--mono);font-size:0.78rem;color:var(--terra);margin-top:0.3rem;">→ ${scaledM} M (skaliert)</p>` : ''}
          </div>
          <div>
            <label class="lbl">Reihen (Original)</label>
            <input type="number" value="${p.reihen||''}" placeholder="0"
              style="font-family:var(--mono);font-weight:600;color:var(--text);"
              oninput="updateSchnitt(${idx},'reihen',this.value)">
            ${isScaled && scaledR ? `<p style="font-family:var(--mono);font-size:0.78rem;color:var(--terra);margin-top:0.3rem;">→ ${scaledR} R (skaliert)</p>` : ''}
          </div>
        </div>
        <div class="grid-2 mb-sm">
          <div><label class="lbl">Breite (cm)</label><input type="number" value="${p.breite||''}" placeholder="—" style="font-family:var(--mono);" oninput="updateSchnitt(${idx},'breite',this.value)"></div>
          <div><label class="lbl">Länge (cm)</label><input type="number" value="${p.laenge||''}" placeholder="—" style="font-family:var(--mono);" oninput="updateSchnitt(${idx},'laenge',this.value)"></div>
        </div>
        <div><label class="lbl">Abnahmen / Zunahmen</label><input type="text" value="${p.abnahmen||''}" placeholder="z.B. alle 6 R 1 Abnahme ×8" oninput="updateSchnitt(${idx},'abnahmen',this.value)"></div>
      </div>
    </div>`;
  }).join('');
}

function toggleSchnitt(idx) {
  if (!window._currentSchnitt) return;
  window._currentSchnitt[idx]._open = !window._currentSchnitt[idx]._open;
  renderSchnittteilList();
}

function updateSchnitt(idx, field, val) {
  if (!window._currentSchnitt) return;
  window._currentSchnitt[idx][field] = val;
  // Trigger re-render für Skalierung
  setTimeout(renderSchnittteilList, 50);
}

function removeSchnitt(idx) {
  if (!window._currentSchnitt) return;
  window._currentSchnitt.splice(idx, 1);
  renderSchnittteilList();
}

function collectSchnittteilData() {
  return window._currentSchnitt ? [...window._currentSchnitt] : [];
}

// ─── GARN ─────────────────────────────────────────────────────
let yarnN = 1;
function addYarn() {
  yarnN++;
  const div = document.createElement('div');
  div.className = 'card';
  div.id = `yarn-block-${yarnN}`;
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

// ─── PROJEKT-NOTIZEN ─────────────────────────────────────────
function addProjectNote() {
  const id = Date.now();
  currentNotes.push({ id, text: '' });
  renderProjectNotes();
  // Focus neu erstelltes Feld
  setTimeout(() => {
    const ta = document.getElementById(`pnote-${id}`);
    if (ta) ta.focus();
  }, 50);
}

function renderProjectNotes() {
  const el = document.getElementById('project-notes-list');
  if (!el) return;
  if (currentNotes.length === 0) {
    el.innerHTML = '<p class="txt-light" style="text-align:center;padding:1rem 0;">Noch keine Notizen. Tippe auf + um eine hinzuzufügen.</p>';
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

function updateProjectNote(id, val) {
  const n = currentNotes.find(x => x.id === id);
  if (n) n.text = val;
}

function removeProjectNote(id) {
  currentNotes = currentNotes.filter(n => n.id !== id);
  renderProjectNotes();
}

// ─── REIHENZÄHLER ─────────────────────────────────────────────
function addCounter() {
  const id = Date.now();
  currentCounters.push({ id, label: 'Zähler', count: 0, target: null });
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
          <input type="text" value="${c.label}"
            style="border:none;background:transparent;font-family:var(--serif);font-weight:600;font-size:0.9rem;color:var(--text);padding:0;width:100%;outline:none;"
            onchange="updateCounterLabel(${c.id},this.value)">
        </div>
        <button onclick="removeCounter(${c.id})" style="background:none;border:none;cursor:pointer;color:var(--textFaint);font-size:1rem;flex-shrink:0;">✕</button>
      </div>
      <div class="counter-display" style="padding:0.5rem 0;">
        <span class="counter-number">${c.count}</span>
        ${c.target ? `
          <div style="height:4px;background:var(--border);border-radius:2px;margin-top:0.5rem;">
            <div style="height:100%;background:var(--green);border-radius:2px;width:${Math.min(100,(c.count/c.target)*100)}%;transition:width 0.2s;"></div>
          </div>
          <p style="font-family:var(--mono);font-size:0.7rem;color:var(--textLight);margin-top:0.2rem;">Reihe ${c.count} von ${c.target}</p>
        ` : ''}
      </div>
      <div class="counter-btns">
        <button class="counter-big-btn counter-dec" onclick="counterDec(${c.id})">−</button>
        <button onclick="counterReset(${c.id})" style="background:var(--bgWarm);border:1px solid var(--border);cursor:pointer;border-radius:var(--r-sm);padding:0.4rem 0.85rem;font-size:0.75rem;color:var(--textLight);">Reset</button>
        <button class="counter-big-btn counter-inc" onclick="counterInc(${c.id})">+</button>
      </div>
      <div class="mt-sm">
        <label class="lbl">Ziel-Reihe (optional)</label>
        <input type="number" inputmode="numeric" value="${c.target||''}" placeholder="z.B. 82"
          style="font-family:var(--mono);font-size:0.88rem;"
          onchange="updateCounterTarget(${c.id},this.value)">
      </div>
    </div>`).join('');
}

function counterInc(id) {
  const c = currentCounters.find(x => x.id === id);
  if (c) { c.count++; renderCounters(); }
}
function counterDec(id) {
  const c = currentCounters.find(x => x.id === id);
  if (c && c.count > 0) { c.count--; renderCounters(); }
}
function counterReset(id) {
  const c = currentCounters.find(x => x.id === id);
  if (c) { c.count = 0; renderCounters(); }
}
function updateCounterLabel(id, val) {
  const c = currentCounters.find(x => x.id === id);
  if (c) c.label = val;
}
function updateCounterTarget(id, val) {
  const c = currentCounters.find(x => x.id === id);
  if (c) { c.target = +val || null; renderCounters(); }
}
function removeCounter(id) {
  currentCounters = currentCounters.filter(c => c.id !== id);
  renderCounters();
}

// ─── MASCHENMARKIERUNGEN — inline wie Zähler ─────────────────
function addMarker() {
  currentMarkers.push({
    id: Date.now(), row: 0, stitch: 0, type: 'raglan', note: ''
  });
  renderMarkers();
}

function renderMarkers() {
  const el    = document.getElementById('markers-list');
  const empty = document.getElementById('markers-empty');
  if (!el) return;

  if (currentMarkers.length === 0) {
    el.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  el.innerHTML = currentMarkers.map((m, i) => `
    <div class="card" style="padding:0.75rem;">
      <div class="flex justify-sb align-c mb-sm">
        <div class="flex align-c gap-sm">
          <div class="marker-type-dot" style="background:${MARKER_COLORS[m.type]||'#9c7b5a'};width:12px;height:12px;border-radius:50%;flex-shrink:0;"></div>
          <span style="font-size:0.8rem;font-weight:600;color:var(--text);">${markerTypeLabel(m.type)}</span>
        </div>
        <button onclick="removeMarker(${m.id})" style="background:none;border:none;cursor:pointer;color:var(--textFaint);font-size:1rem;">✕</button>
      </div>
      <div class="grid-2 mb-sm">
        <div>
          <label class="lbl">Reihe</label>
          <input type="number" inputmode="numeric" value="${m.row||''}" placeholder="0"
            style="font-family:var(--mono);"
            onchange="updateMarker(${m.id},'row',this.value)">
        </div>
        <div>
          <label class="lbl">Masche</label>
          <input type="number" inputmode="numeric" value="${m.stitch||''}" placeholder="0"
            style="font-family:var(--mono);"
            onchange="updateMarker(${m.id},'stitch',this.value)">
        </div>
      </div>
      <div class="mb-sm">
        <label class="lbl">Typ</label>
        <select onchange="updateMarker(${m.id},'type',this.value)">
          <option value="raglan" ${m.type==='raglan'?'selected':''}>Raglan</option>
          <option value="seite" ${m.type==='seite'?'selected':''}>Seitennaht</option>
          <option value="rapport" ${m.type==='rapport'?'selected':''}>Musterwiederholung</option>
          <option value="abnahme" ${m.type==='abnahme'?'selected':''}>Abnahme</option>
          <option value="zunahme" ${m.type==='zunahme'?'selected':''}>Zunahme</option>
          <option value="eigen" ${m.type==='eigen'?'selected':''}>Eigener Typ</option>
        </select>
      </div>
      <div>
        <label class="lbl">Notiz (optional)</label>
        <input type="text" value="${m.note||''}" placeholder="z.B. ab hier Raglan-Abnahmen"
          onchange="updateMarker(${m.id},'note',this.value)">
      </div>
    </div>`).join('');
}

function updateMarker(id, field, val) {
  const m = currentMarkers.find(x => x.id === id);
  if (!m) return;
  m[field] = field === 'row' || field === 'stitch' ? +val || 0 : val;
  // Neu sortieren nach Reihe
  currentMarkers.sort((a,b) => a.row - b.row || a.stitch - b.stitch);
  renderMarkers();
}

function markerTypeLabel(t) {
  return {raglan:'Raglan',seite:'Seitennaht',rapport:'Rapport',abnahme:'Abnahme',zunahme:'Zunahme',eigen:'Eigener'}[t]||t;
}

function removeMarker(id) {
  currentMarkers = currentMarkers.filter(m => m.id !== id);
  renderMarkers();
}

// ─── LESEMODUS ────────────────────────────────────────────────
function openLesemodus() {
  const text = document.getElementById('ed-text').value.trim();
  if (!text) { showSnackbar('Kein Anleitungstext vorhanden'); return; }

  // Zeilen parsen — jede nicht-leere Zeile = eine Reihe
  leseRows = text.split('\n').filter(r => r.trim().length > 0);
  leseCurrentRow = 0;

  const title = document.getElementById('ed-title').value || 'Anleitung';
  document.getElementById('lese-title').textContent = title;
  document.getElementById('lese-tot').textContent = leseRows.length;

  historyStack.push(currentScreen);
  showScreen('lesemodus');
  renderLesemodus();
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
      <span class="lese-row-num">REIHE ${i+1}</span>
      ${row}
    </div>`;
  }).join('');
  document.getElementById('lese-counter').textContent = leseCurrentRow + 1;

  // Scroll aktuelle Reihe in Sicht
  setTimeout(() => {
    const current = body.querySelector('.lese-row.current');
    if (current) current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 50);
}

function leseNext() {
  if (leseCurrentRow < leseRows.length - 1) {
    leseCurrentRow++;
    renderLesemodus();
  }
}

function leseBack() {
  if (leseCurrentRow > 0) {
    leseCurrentRow--;
    renderLesemodus();
  }
}

function jumpToRow(i) {
  leseCurrentRow = i;
  renderLesemodus();
}
