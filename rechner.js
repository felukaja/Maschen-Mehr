/* ═══════════════════════════════════════════════════════════════
   MASCHEN & MASSE — rechner.js v5.3
   Vollständige Rechner-Logik mit Material & Maschenart
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── MATERIAL-KORREKTURFAKTOREN ───────────────────────────────
// Basierend auf Projektdatei Teil0 — reales Faserverhalten
const MATERIAL_FAKTOREN = {
  'Merino (normal)':       { breite: 1.00, hoehe: 1.00, note: 'Probe nach Waschen + Blocking messen. Superwash +7% Dehnung möglich.' },
  'Merino (Superwash)':    { breite: 1.00, hoehe: 1.05, note: 'Neigt nach Waschen zu wachsen — Länge 5% kürzer anlegen.' },
  'Schurwolle':            { breite: 1.00, hoehe: 1.00, note: 'Hohe Elastizität. Probe nach Waschen messen.' },
  'Alpaka (100%)':         { breite: 1.00, hoehe: 0.88, note: '⚠ Hängt sich stark aus. Länge 10–15% kürzer anlegen!' },
  'Alpaka-Blend (30%+)':   { breite: 1.00, hoehe: 0.96, note: 'Stabiler als 100% Alpaka. Trotzdem Länge 3–5% kürzer.' },
  'Baumwolle':             { breite: 1.03, hoehe: 1.06, note: 'Dehnt sich unter Schwerkraft. Erste Wäsche: ~6% Längeneinlauf.' },
  'Bambus / Viskose':      { breite: 1.00, hoehe: 0.90, note: 'Sehr hoher Drape. Länge 8–12% kürzer anlegen.' },
  'Leinen':                { breite: 1.00, hoehe: 1.00, note: 'Wird mit Waschen weicher. Sehr stabiles Maschenbild.' },
  'Mohair':                { breite: 1.00, hoehe: 1.00, note: 'Florig — Maschenprobe schwierig zu messen. Großzügig messen.' },
  'Kaschmir':              { breite: 1.00, hoehe: 1.00, note: 'Ähnlich Merino. Sehr weich, etwas weniger Elastizität.' },
  'Acryl':                 { breite: 1.00, hoehe: 1.00, note: 'Sehr stabil, wenig Dehnung. Maschinenwaschbar.' },
  'Baumwolle-Blend':       { breite: 1.02, hoehe: 1.03, note: 'Je nach Mischverhältnis. Probe immer nach Waschen messen.' },
  'Seide / Silk':          { breite: 1.00, hoehe: 0.92, note: 'Sehr fließend. Länge 6–8% kürzer anlegen.' },
  'Kunstfaser (Polyester)':{ breite: 1.00, hoehe: 1.00, note: 'Sehr stabil, formbeständig. Kein Einlauf.' },
  'Unbekannt / Anderes':   { breite: 1.00, hoehe: 1.00, note: 'Probe immer nach Waschen und Trocknen messen.' },
};

// ─── MASCHENART-KORREKTURFAKTOREN ─────────────────────────────
// Maschenart beeinflusst Breite (Dichte) und Höhe (Stichhöhe) separat
// Basierend auf Stichhöhen-Verhältnis sc:hdc:dc:tr ≈ 1:2:3:4:5
const MASCHEN_FAKTOREN = {
  'Feste Maschen (sc)':          { breite: 1.00, hoehe: 1.00, note: 'Dichter, fester Stoff. Standard-Referenz.' },
  'Halbe Stäbchen (hdc)':        { breite: 1.05, hoehe: 1.80, note: 'Etwas weicher als fM. Reihen ~80% höher als fM.' },
  'Stäbchen (dc)':               { breite: 1.10, hoehe: 2.70, note: 'Locker, viel Drape. Reihen ~2,7× höher als fM.' },
  'Doppelstäbchen (tr)':         { breite: 1.15, hoehe: 3.60, note: 'Sehr locker. Reihen ~3,6× höher als fM.' },
  'Shell / Muschel':             { breite: 1.10, hoehe: 2.50, note: 'Rapport 6+1. Breiter als Standard. Viel Drape.' },
  'V-Stitch':                    { breite: 1.15, hoehe: 2.60, note: 'Rapport 3+2. Sehr offen und luftig.' },
  'Granny Square':               { breite: 1.00, hoehe: 1.00, note: 'Quadratisches Verhältnis. Rapport 3+2.' },
  'Rippenmuster (FP/BP)':        { breite: 0.85, hoehe: 2.70, note: 'Zieht sich in Breite zusammen! ~15% enger.' },
  'Moss / Linen Stitch':         { breite: 1.00, hoehe: 1.10, note: 'Rapport 2+1. Dicht, stabil.' },
  'Basket Weave':                { breite: 0.95, hoehe: 2.70, note: 'Leicht enger in Breite durch Überkreuzungen.' },
  'Ripple / Chevron':            { breite: 1.00, hoehe: 2.50, note: 'Rapport 14+3. Wellenlänge beachten.' },
  'Tunisisch (TSS)':             { breite: 0.90, hoehe: 1.50, note: 'Eigene Gauge-Welt. Immer mit Tunisischer Nadel messen.' },
  'Filet-Häkeln':                { breite: 1.00, hoehe: 2.80, note: 'Raster aus dc + ch. Sehr locker, viel Drape.' },
  'C2C (Corner to Corner)':      { breite: 1.00, hoehe: 1.00, note: 'Diagonales Muster. Rapport in Kacheln messen.' },
  'Magischer Ring (Runden)':     { breite: 1.00, hoehe: 1.00, note: 'In Runden häkeln. Gauge in Runden messen!' },
};

// ─── NADEL-TABELLE ────────────────────────────────────────────
const NADEL_DATA = [
  ['2,0','B-1','14','—'],['2,25','B-1','13','2/0'],['2,5','C-2','12','—'],
  ['2,75','C-2','12','3/0'],['3,0','D-3','11','—'],['3,25','D-3','10','4/0'],
  ['3,5','E-4','9','—'],['3,75','F-5','9','5/0'],['4,0','G-6','8','6'],
  ['4,5','7','7','7/0'],['5,0','H-8','6','8/0'],['5,5','I-9','5','—'],
  ['6,0','J-10','4','10/0'],['6,5','K-10½','3','—'],['7,0','—','2','—'],
  ['8,0','L-11','0','—'],['9,0','M/N-13','00','—'],['10,0','N/P-15','000','—'],
  ['12,0','P/Q','—','—'],['15,0','S','—','—'],['16,0','Q','—','—'],
];

// ─── GARNSTÄRKEN-TABELLE (CYC) ────────────────────────────────
const STAERKE_DATA = [
  ['0','Lace','1–2 ply','2-fädig','600–800+','1,5–2,5'],
  ['1','Super Fine','3–4 ply','3–4-fädig','350–600','2,25–3,5'],
  ['2','Fine','5 ply','5-fädig','250–350','3,5–4,5'],
  ['3','Light / DK','DK / 8 ply','8-fädig','200–250','4,5–5,5'],
  ['4','Medium / Worsted','Worsted / 10 ply','10-fädig','120–200','5,5–6,5'],
  ['5','Bulky','Chunky / 12 ply','12-fädig','80–130','6,5–9,0'],
  ['6','Super Bulky','Super Chunky / 16 ply','—','unter 100','9,0–15,0'],
  ['7','Jumbo','—','—','unter 100','15,0+'],
];

// ─── DE/EU DAMEN KONFEKTIONSGRÖSSEN ──────────────────────────
const DE_GROESSEN_DAMEN = [
  {de:'32',bust_from:76,bust_to:78,waist_from:60,waist_to:62,hip_from:84,hip_to:86},
  {de:'34',bust_from:80,bust_to:82,waist_from:64,waist_to:66,hip_from:88,hip_to:90},
  {de:'36',bust_from:84,bust_to:86,waist_from:68,waist_to:70,hip_from:92,hip_to:94},
  {de:'38',bust_from:88,bust_to:90,waist_from:72,waist_to:74,hip_from:96,hip_to:98},
  {de:'40',bust_from:92,bust_to:94,waist_from:76,waist_to:78,hip_from:100,hip_to:102},
  {de:'42',bust_from:96,bust_to:98,waist_from:80,waist_to:82,hip_from:104,hip_to:106},
  {de:'44',bust_from:100,bust_to:102,waist_from:84,waist_to:86,hip_from:108,hip_to:110},
  {de:'46',bust_from:104,bust_to:106,waist_from:88,waist_to:90,hip_from:112,hip_to:114},
  {de:'48',bust_from:108,bust_to:110,waist_from:92,waist_to:94,hip_from:116,hip_to:118},
  {de:'50',bust_from:112,bust_to:114,waist_from:96,waist_to:98,hip_from:120,hip_to:122},
  {de:'52',bust_from:116,bust_to:118,waist_from:100,waist_to:102,hip_from:124,hip_to:126},
  {de:'54',bust_from:120,bust_to:122,waist_from:104,waist_to:106,hip_from:128,hip_to:130},
  {de:'56',bust_from:124,bust_to:126,waist_from:108,waist_to:110,hip_from:132,hip_to:134},
  {de:'58',bust_from:128,bust_to:130,waist_from:112,waist_to:114,hip_from:136,hip_to:138},
];

const CYC_DAMEN = [
  {cyc:'XXS',bust_from:71,bust_to:76},{cyc:'XS',bust_from:76,bust_to:81},
  {cyc:'S',bust_from:81,bust_to:86},{cyc:'M',bust_from:91,bust_to:96},
  {cyc:'L',bust_from:101,bust_to:106},{cyc:'XL',bust_from:111,bust_to:116},
  {cyc:'2XL',bust_from:121,bust_to:127},{cyc:'3XL',bust_from:132,bust_to:137},
  {cyc:'4XL',bust_from:142,bust_to:147},{cyc:'5XL',bust_from:152,bust_to:158},
];

const EASE_DEFAULTS = {
  'Pullover (klassisch)':  { bust:10, waist:7,  hip:8,  note:'Standard Pullover' },
  'Pullover (oversized)':  { bust:20, waist:18, hip:15, note:'Bewusst weit' },
  'Cardigan':              { bust:12, waist:9,  hip:10, note:'+für offenes Vorderteil' },
  'Jacke':                 { bust:15, waist:12, hip:12, note:'' },
  'Top / Crop':            { bust:4,  waist:2,  hip:0,  note:'Knapp anliegend' },
  'Kleid (klassisch)':     { bust:8,  waist:8,  hip:12, note:'' },
  'Hose':                  { bust:0,  waist:5,  hip:8,  note:'Bezieht sich auf Hüfte/Taille' },
  'Rock':                  { bust:0,  waist:5,  hip:8,  note:'Bezieht sich auf Hüfte' },
  'Mütze':                 { head:-3, note:'Negativer Ease am Kopfumfang — nicht Brust!' },
  'Socken':                { ankle:-3, foot:0,  note:'Negativer Ease am Knöchelumfang' },
  'Handschuhe':            { hand:0,  note:'Zero Ease am Handumfang' },
  'Baby-Jäckchen':         { bust:5,  waist:3,  hip:3,  note:'' },
};

// ─── SCREEN RENDERERS ─────────────────────────────────────────

// ── MASCHENPROBE (vollständig mit Material + Maschenart) ──────
function renderCalcMP() {
  const el = document.getElementById('screen-calc-mp');
  el.innerHTML = `
    <div class="editor-header">
      <button class="back-btn" onclick="goBack()"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <h2 style="font-family:var(--serif);font-size:1.1rem;color:var(--text);font-weight:600;">Maschenprobe-Rechner</h2>
    </div>
    <div class="scroll-body"><div class="p-main flex-col gap-lg">

      <div class="card card-terra">
        <label class="lbl">Deine Probe (mind. 15×15 cm häkeln, waschen, blocken, messen)</label>
        <div class="grid-2 mt-sm">
          <div><label class="lbl">Maschen gezählt</label><input type="number" id="mp-m" placeholder="z.B. 20" inputmode="numeric" oninput="calcMP()"></div>
          <div><label class="lbl">Reihen gezählt</label><input type="number" id="mp-r" placeholder="z.B. 15" inputmode="numeric" oninput="calcMP()"></div>
          <div><label class="lbl">Breite gemessen (cm)</label><input type="number" id="mp-w" value="10" inputmode="decimal" oninput="calcMP()"></div>
          <div><label class="lbl">Höhe gemessen (cm)</label><input type="number" id="mp-h" value="10" inputmode="decimal" oninput="calcMP()"></div>
        </div>
      </div>

      <div class="card card-green">
        <label class="lbl">Material</label>
        <select id="mp-material" onchange="calcMP()">
          ${Object.keys(MATERIAL_FAKTOREN).map(m => `<option value="${m}">${m}</option>`).join('')}
        </select>
        <p id="mp-material-note" class="txt-light mt-sm" style="font-size:0.72rem;"></p>
      </div>

      <div class="card card-green">
        <label class="lbl">Hauptmaschenart</label>
        <select id="mp-maschen" onchange="calcMP()">
          ${Object.keys(MASCHEN_FAKTOREN).map(m => `<option value="${m}">${m}</option>`).join('')}
        </select>
        <p id="mp-maschen-note" class="txt-light mt-sm" style="font-size:0.72rem;"></p>
      </div>

      <div id="mp-res" class="result-box terra"><label class="lbl">Ergebnis</label><p class="txt-light">Werte eingeben →</p></div>

      <div class="card card-pale-terra">
        <label class="lbl">Umrechnung: Gewünschtes Maß → Maschen</label>
        <div class="grid-2 mt-sm">
          <div><label class="lbl">Gewünschte Breite (cm)</label><input type="number" id="mp-target-w" placeholder="50" inputmode="decimal" oninput="calcMP()"></div>
          <div><label class="lbl">Gewünschte Höhe (cm)</label><input type="number" id="mp-target-h" placeholder="60" inputmode="decimal" oninput="calcMP()"></div>
        </div>
        <div id="mp-target-res" class="mt-sm"></div>
      </div>

      <div class="card">
        <label class="lbl">Rapport (optional)</label>
        <div class="grid-2">
          <div><label class="lbl">Vielfaches von X</label><input type="number" id="mp-rapport" placeholder="z.B. 6" inputmode="numeric" oninput="calcMP()"></div>
          <div><label class="lbl">Plus Y</label><input type="number" id="mp-rapport-plus" placeholder="z.B. 1" inputmode="numeric" oninput="calcMP()"></div>
        </div>
        <p class="txt-light mt-sm" style="font-size:0.72rem;">Shell=6+1 · V-Stitch=3+2 · Ripple=14+3 · Leer lassen wenn kein Rapport</p>
      </div>

    </div></div>`;
}

function calcMP() {
  const m = +document.getElementById('mp-m')?.value;
  const r = +document.getElementById('mp-r')?.value;
  const w = +document.getElementById('mp-w')?.value || 10;
  const h = +document.getElementById('mp-h')?.value || 10;
  const matKey    = document.getElementById('mp-material')?.value;
  const maschenKey= document.getElementById('mp-maschen')?.value;
  const rapport   = +document.getElementById('mp-rapport')?.value || 0;
  const rapportPl = +document.getElementById('mp-rapport-plus')?.value || 0;

  const matF = MATERIAL_FAKTOREN[matKey] || {breite:1,hoehe:1,note:''};
  const masF = MASCHEN_FAKTOREN[maschenKey] || {breite:1,hoehe:1,note:''};

  const noteEl = document.getElementById('mp-material-note');
  const mNoteEl= document.getElementById('mp-maschen-note');
  if (noteEl) noteEl.textContent = matF.note;
  if (mNoteEl) mNoteEl.textContent = masF.note;

  const el = document.getElementById('mp-res');
  if (!el) return;

  if (m > 0 && r > 0) {
    // Rohe Gauge
    const mpc_raw = m / w; // M/cm gemessen
    const rpc_raw = r / h; // R/cm gemessen

    // Korrigierte Gauge (Material + Maschenart berücksichtigt)
    const mpc = mpc_raw * matF.breite * masF.breite;
    const rpc = rpc_raw * matF.hoehe  * masF.hoehe;

    const mpcm = (1 / mpc).toFixed(2);
    const rpcm = (1 / rpc).toFixed(2);

    el.innerHTML = `<label class="lbl">Deine Gauge</label>
      <div class="grid-2 mt-sm">
        <div><p class="result-num">${(mpc*10).toFixed(2)}</p><p class="result-unit">Maschen / 10 cm (korrigiert)</p></div>
        <div><p class="result-num">${(rpc*10).toFixed(2)}</p><p class="result-unit">Reihen / 10 cm (korrigiert)</p></div>
      </div>
      <p class="txt-light mt-sm" style="font-size:0.75rem;font-family:var(--mono);">Roh: ${(mpc_raw*10).toFixed(2)} M · ${(rpc_raw*10).toFixed(2)} R / 10cm</p>
      <p class="txt-light" style="font-size:0.72rem;">SF Material Breite: ×${matF.breite} · SF Maschen Breite: ×${masF.breite}</p>
      <p class="txt-light" style="font-size:0.72rem;">SF Material Höhe: ×${matF.hoehe} · SF Maschen Höhe: ×${masF.hoehe}</p>`;

    // Ziel-Umrechnung
    const tw = +document.getElementById('mp-target-w')?.value;
    const th = +document.getElementById('mp-target-h')?.value;
    const tres = document.getElementById('mp-target-res');
    if ((tw > 0 || th > 0) && tres) {
      let html = '';
      if (tw > 0) {
        const rawM = tw * mpc;
        const adjM = rapport > 0 ? roundToRapportCalc(rawM, rapport, rapportPl) : Math.round(rawM);
        const abwCm = Math.abs(adjM - rawM) / mpc;
        html += `<p style="font-family:var(--mono);color:var(--green);font-size:0.9rem;font-weight:700;">${adjM} Maschen</p>
          <p class="result-unit">für ${tw} cm Breite${rapport > 0 ? ` · Rapport ${rapport}+${rapportPl}` : ''}</p>
          ${abwCm > 0.5 ? `<p style="font-size:0.7rem;color:var(--textLight);">Rapport-Abw.: ${abwCm.toFixed(1)} cm</p>` : ''}`;
      }
      if (th > 0) {
        const adjR = Math.round(th * rpc);
        html += `<p style="font-family:var(--mono);color:var(--green);font-size:0.9rem;font-weight:700;margin-top:0.4rem;">${adjR} Reihen</p>
          <p class="result-unit">für ${th} cm Höhe</p>`;
      }
      tres.innerHTML = html;
    }
  } else {
    el.innerHTML = '<label class="lbl">Deine Gauge</label><p class="txt-light">Werte eingeben →</p>';
  }
}

function roundToRapportCalc(raw, mult, plus) {
  plus = plus || 0;
  if (mult <= 1) return Math.round(raw);
  const nLow  = Math.floor((raw - plus) / mult);
  const nHigh = Math.ceil( (raw - plus) / mult);
  const vLow  = nLow  * mult + plus;
  const vHigh = nHigh * mult + plus;
  return Math.abs(vLow - raw) <= Math.abs(vHigh - raw) ? vLow : vHigh;
}

// ── GRÖßENRECHNER (mit Material + Maschenart + eigene Gauge) ──
function renderCalcGroesse() {
  const el = document.getElementById('screen-calc-groesse');
  el.innerHTML = `
    <div class="editor-header">
      <button class="back-btn" onclick="goBack()"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <h2 style="font-family:var(--serif);font-size:1.1rem;color:var(--text);font-weight:600;">Größenrechner</h2>
    </div>
    <div class="scroll-body"><div class="p-main flex-col gap-lg">

      <div class="card card-pale-green">
        <p class="txt-light"><strong style="color:var(--green);">So funktioniert es:</strong> Trage die Gauge der Anleitung ein, dann deine eigene Gauge. Material und Maschenart werden als Korrekturfaktoren eingerechnet — SF_Breite und SF_Höhe werden immer separat berechnet.</p>
      </div>

      <div class="card card-terra">
        <label class="lbl">Maschenprobe der Anleitung (Original)</label>
        <div class="grid-2">
          <div><label class="lbl">Maschen / 10 cm</label><input type="number" id="gr-om" placeholder="18" inputmode="decimal" oninput="calcGR()"></div>
          <div><label class="lbl">Reihen / 10 cm</label><input type="number" id="gr-or" placeholder="12" inputmode="decimal" oninput="calcGR()"></div>
        </div>
      </div>

      <div class="card card-green">
        <label class="lbl">Deine eigene Maschenprobe</label>
        <div class="grid-2">
          <div><label class="lbl">Maschen / 10 cm</label><input type="number" id="gr-nm" placeholder="20" inputmode="decimal" oninput="calcGR()"></div>
          <div><label class="lbl">Reihen / 10 cm</label><input type="number" id="gr-nr" placeholder="11" inputmode="decimal" oninput="calcGR()"></div>
        </div>
      </div>

      <div class="card">
        <label class="lbl">Material deines Garns</label>
        <select id="gr-material" onchange="calcGR()">
          ${Object.keys(MATERIAL_FAKTOREN).map(m => `<option value="${m}">${m}</option>`).join('')}
        </select>
        <p id="gr-mat-note" class="txt-light mt-sm" style="font-size:0.72rem;"></p>
      </div>

      <div class="card">
        <label class="lbl">Hauptmaschenart</label>
        <select id="gr-maschen" onchange="calcGR()">
          ${Object.keys(MASCHEN_FAKTOREN).map(m => `<option value="${m}">${m}</option>`).join('')}
        </select>
        <p id="gr-mas-note" class="txt-light mt-sm" style="font-size:0.72rem;"></p>
      </div>

      <div class="card">
        <label class="lbl">Original-Werte der Anleitung</label>
        <div class="grid-2">
          <div><label class="lbl">Maschen</label><input type="number" id="gr-os" placeholder="90" inputmode="numeric" oninput="calcGR()"></div>
          <div><label class="lbl">Reihen</label><input type="number" id="gr-rw" placeholder="36" inputmode="numeric" oninput="calcGR()"></div>
        </div>
      </div>

      <div class="card">
        <label class="lbl">Muster-Rapport (optional)</label>
        <div class="grid-2">
          <div><label class="lbl">Vielfaches von X</label><input type="number" id="gr-mult" placeholder="1" inputmode="numeric" oninput="calcGR()"></div>
          <div><label class="lbl">Plus Y</label><input type="number" id="gr-plus" placeholder="0" inputmode="numeric" oninput="calcGR()"></div>
        </div>
      </div>

      <div id="gr-res" class="result-box"><label class="lbl">Deine Werte</label><p class="txt-light">Werte eingeben →</p></div>
    </div></div>`;
}

function calcGR() {
  const om = +document.getElementById('gr-om')?.value;
  const or_= +document.getElementById('gr-or')?.value;
  const nm = +document.getElementById('gr-nm')?.value;
  const nr = +document.getElementById('gr-nr')?.value;
  const os = +document.getElementById('gr-os')?.value;
  const rw = +document.getElementById('gr-rw')?.value;
  const mult = +document.getElementById('gr-mult')?.value || 1;
  const plus = +document.getElementById('gr-plus')?.value || 0;
  const matKey = document.getElementById('gr-material')?.value;
  const masKey = document.getElementById('gr-maschen')?.value;
  const el = document.getElementById('gr-res');
  if (!el) return;

  const matF = MATERIAL_FAKTOREN[matKey] || {breite:1,hoehe:1,note:''};
  const masF = MASCHEN_FAKTOREN[masKey]  || {breite:1,hoehe:1,note:''};
  const noteEl  = document.getElementById('gr-mat-note');
  const mNoteEl = document.getElementById('gr-mas-note');
  if (noteEl) noteEl.textContent = matF.note;
  if (mNoteEl) mNoteEl.textContent = masF.note;

  if (om > 0 && or_ > 0 && nm > 0 && nr > 0) {
    // SF getrennt für Breite und Höhe — beide mit Material + Maschenart
    const sfB_raw = nm / om;
    const sfH_raw = nr / or_;
    const sfB = sfB_raw * matF.breite * masF.breite;
    const sfH = sfH_raw * matF.hoehe  * masF.hoehe;

    let warn = '';
    if (sfB < 0.7 || sfB > 1.3) warn = '<div class="warning-box mt-sm">Skalierungsfaktor Breite > 30% — Neukonstruktion empfohlen</div>';
    if (sfH < 0.7 || sfH > 1.3) warn += '<div class="warning-box mt-sm">Skalierungsfaktor Höhe > 30% — Reihenzahl kritisch prüfen</div>';

    if (os > 0 && rw > 0) {
      let rawM = os * sfB;
      let adjM = roundToRapportCalc(rawM, mult, plus);
      let adjR = Math.round(rw * sfH);
      const abwCm = Math.abs(adjM - rawM) / (nm/10);

      el.innerHTML = `<label class="lbl">Deine Werte</label>
        <div class="grid-2 mt-sm">
          <div><p class="result-num">${adjM}</p><p class="result-unit">Maschen</p>${mult>1?`<p class="txt-light" style="font-size:0.7rem;">Rapport ${mult}+${plus} ✓</p>`:''}</div>
          <div><p class="result-num">${adjR}</p><p class="result-unit">Reihen</p></div>
        </div>
        <div class="mt-sm" style="background:var(--bgWarm);border-radius:var(--r-sm);padding:0.65rem 0.85rem;">
          <p style="font-size:0.72rem;color:var(--textLight);font-family:var(--mono);">SF Breite: ${sfB.toFixed(3)} (roh: ${sfB_raw.toFixed(3)})</p>
          <p style="font-size:0.72rem;color:var(--textLight);font-family:var(--mono);">SF Höhe: ${sfH.toFixed(3)} (roh: ${sfH_raw.toFixed(3)})</p>
          ${abwCm > 0.5 ? `<p style="font-size:0.7rem;color:var(--terra);">Rapport-Abw.: ${abwCm.toFixed(1)} cm</p>` : ''}
        </div>
        ${warn}`;
    } else {
      el.innerHTML = `<label class="lbl">Skalierungsfaktoren</label>
        <div class="grid-2 mt-sm">
          <div><p class="result-num">${sfB.toFixed(3)}</p><p class="result-unit">SF Breite</p></div>
          <div><p class="result-num">${sfH.toFixed(3)}</p><p class="result-unit">SF Höhe</p></div>
        </div>
        <p class="txt-light mt-sm">Original-Maschen/-Reihen eingeben für konkrete Werte.</p>${warn}`;
    }
  } else {
    el.innerHTML = '<label class="lbl">Deine Werte</label><p class="txt-light">Werte eingeben →</p>';
  }
}

// ── KÖRPERMASSE ────────────────────────────────────────────────
function renderCalcMass() {
  const el = document.getElementById('screen-calc-mass');
  el.innerHTML = `
    <div class="editor-header">
      <button class="back-btn" onclick="goBack()"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <h2 style="font-family:var(--serif);font-size:1.1rem;color:var(--text);font-weight:600;">Körpermaße &amp; Konfektionsgröße</h2>
    </div>
    <div class="scroll-body"><div class="p-main flex-col gap-lg">
      <div class="card card-terra">
        <label class="lbl">Deine Körpermaße</label>
        <div class="grid-2">
          <div><label class="lbl">Brustumfang (cm)</label><input type="number" id="mass-brust" inputmode="decimal" oninput="calcMass()"></div>
          <div><label class="lbl">Taillenumfang (cm)</label><input type="number" id="mass-taille" inputmode="decimal" oninput="calcMass()"></div>
          <div><label class="lbl">Hüftumfang (cm)</label><input type="number" id="mass-hufte" inputmode="decimal" oninput="calcMass()"></div>
          <div><label class="lbl">Körpergröße (cm)</label><input type="number" id="mass-hoehe" inputmode="decimal" oninput="calcMass()"></div>
        </div>
      </div>
      <div id="mass-res" class="result-box terra"><label class="lbl">Deine Konfektionsgröße</label><p class="txt-light">Maße eingeben →</p></div>
      <div id="mass-fits" class="card" style="display:none;">
        <label class="lbl">Fertigmaße nach Passform (Brust)</label>
        <div id="mass-fits-body"></div>
      </div>
      <div class="card">
        <label class="lbl">Kleidungstyp für Ease</label>
        <select id="mass-kleidung" onchange="calcMass()">
          ${Object.keys(EASE_DEFAULTS).map(k=>`<option value="${k}">${k}</option>`).join('')}
        </select>
        <div id="mass-ease-res" class="mt-sm"></div>
      </div>
    </div></div>`;
}

function calcMass() {
  const brust  = +document.getElementById('mass-brust')?.value;
  const taille = +document.getElementById('mass-taille')?.value;
  const hufte  = +document.getElementById('mass-hufte')?.value;
  const el = document.getElementById('mass-res');
  if (!el) return;

  if (brust > 0) {
    let cycMatch = CYC_DAMEN.find(s => brust >= s.bust_from && brust <= s.bust_to);
    if (!cycMatch) cycMatch = CYC_DAMEN.reduce((p,c) => Math.abs((p.bust_from+p.bust_to)/2-brust) <= Math.abs((c.bust_from+c.bust_to)/2-brust) ? p : c);
    let deMatch = DE_GROESSEN_DAMEN.reduce((p,c) => Math.abs((p.bust_from+p.bust_to)/2-brust) <= Math.abs((c.bust_from+c.bust_to)/2-brust) ? p : c);

    el.innerHTML = `<label class="lbl">Deine Konfektionsgröße</label>
      <div class="flex gap-lg mt-sm align-c">
        <div><p class="result-num">${cycMatch.cyc}</p><p class="result-unit">CYC / International</p></div>
        <div><p class="result-num">DE ${deMatch.de}</p><p class="result-unit">Deutsch / EU</p></div>
      </div>
      <p class="txt-light mt-sm" style="font-size:0.72rem;">Basiert auf Brustumfang ${brust} cm</p>`;

    // Passform-Tabelle
    const fitsEl = document.getElementById('mass-fits');
    const fitsBody = document.getElementById('mass-fits-body');
    if (fitsEl && fitsBody) {
      fitsBody.innerHTML = [['Sehr eng',-8],['Eng',0],['Klassisch',10],['Locker',15],['Oversized',25]].map(([n,e]) =>
        `<div style="display:flex;justify-content:space-between;padding:0.45rem 0;border-bottom:1px solid var(--borderLight);">
          <span style="font-size:0.82rem;">${n}</span>
          <span style="font-family:var(--mono);font-size:0.82rem;color:var(--green);font-weight:600;">${brust+e} cm</span>
        </div>`).join('');
      fitsEl.style.display = 'block';
    }

    // Ease
    const kleidung = document.getElementById('mass-kleidung')?.value;
    const easeEl = document.getElementById('mass-ease-res');
    if (kleidung && EASE_DEFAULTS[kleidung] && easeEl) {
      const e = EASE_DEFAULTS[kleidung];
      let html = `<div style="background:var(--greenFaint);border:1px solid var(--greenPale);border-radius:var(--r-sm);padding:0.65rem;">`;
      html += `<p class="lbl">Empfohlener Ease für ${kleidung}</p>`;
      html += `<p class="txt-light" style="font-size:0.72rem;margin-bottom:0.4rem;">${e.note||''}</p>`;
      if (e.bust !== undefined) html += `<p style="font-family:var(--mono);font-size:0.85rem;color:var(--green);">Brust: +${e.bust} cm → <strong>${brust+e.bust}</strong> cm</p>`;
      if (e.head !== undefined) html += `<p style="font-family:var(--mono);font-size:0.85rem;color:var(--green);">Kopfumfang: ${e.head > 0 ? '+' : ''}${e.head} cm (negativer Ease für Halt)</p>`;
      if (e.ankle !== undefined) html += `<p style="font-family:var(--mono);font-size:0.85rem;color:var(--green);">Knöchelumfang: ${e.ankle > 0 ? '+' : ''}${e.ankle} cm</p>`;
      if (e.hand !== undefined) html += `<p style="font-family:var(--mono);font-size:0.85rem;color:var(--green);">Handumfang: ${e.hand > 0 ? '+' : ''}${e.hand} cm (Zero Ease)</p>`;
      if (e.waist !== undefined && taille > 0) html += `<p style="font-family:var(--mono);font-size:0.82rem;color:var(--green);">Taille: +${e.waist} cm → ${taille+e.waist} cm</p>`;
      if (e.hip !== undefined && hufte > 0) html += `<p style="font-family:var(--mono);font-size:0.82rem;color:var(--green);">Hüfte: +${e.hip} cm → ${hufte+e.hip} cm</p>`;
      html += `</div>`;
      easeEl.innerHTML = html;
    }
  } else {
    el.innerHTML = '<label class="lbl">Deine Konfektionsgröße</label><p class="txt-light">Brustumfang eingeben →</p>';
    const fitsEl = document.getElementById('mass-fits');
    if (fitsEl) fitsEl.style.display = 'none';
  }
}

// ── GARNMENGE ─────────────────────────────────────────────────
function renderCalcGarn() {
  const el = document.getElementById('screen-calc-garn');
  el.innerHTML = `
    <div class="editor-header">
      <button class="back-btn" onclick="goBack()"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <h2 style="font-family:var(--serif);font-size:1.1rem;color:var(--text);font-weight:600;">Garnmengenrechner</h2>
    </div>
    <div class="scroll-body"><div class="p-main flex-col gap-lg">
      <div class="card card-terra">
        <label class="lbl">Original-Garn (in der Anleitung)</label>
        <div class="grid-2">
          <div><label class="lbl">Lauflänge m/100g</label><input type="number" id="garn-ol" placeholder="200" inputmode="decimal" oninput="calcGarn()"></div>
          <div><label class="lbl">Anzahl Knäuel</label><input type="number" id="garn-ok" placeholder="5" inputmode="numeric" oninput="calcGarn()"></div>
        </div>
        <div class="mt-sm"><label class="lbl">Gramm pro Knäuel</label><input type="number" id="garn-og" placeholder="100" inputmode="numeric" oninput="calcGarn()"></div>
      </div>
      <div class="card card-green">
        <label class="lbl">Dein Substitutions-Garn</label>
        <div class="grid-2">
          <div><label class="lbl">Lauflänge m/100g</label><input type="number" id="garn-nl" placeholder="250" inputmode="decimal" oninput="calcGarn()"></div>
          <div><label class="lbl">Gramm pro Knäuel</label><input type="number" id="garn-ng" placeholder="100" inputmode="numeric" oninput="calcGarn()"></div>
        </div>
      </div>
      <div class="card">
        <label class="lbl">Material (Korrekturfaktor für Verbrauch)</label>
        <select id="garn-material" onchange="calcGarn()">
          ${Object.keys(MATERIAL_FAKTOREN).map(m => `<option value="${m}">${m}</option>`).join('')}
        </select>
      </div>
      <div id="garn-res" class="result-box"><label class="lbl">Benötigte Menge</label><p class="txt-light">Werte eingeben →</p></div>
    </div></div>`;
}

function calcGarn() {
  const ol=+document.getElementById('garn-ol')?.value;
  const ok=+document.getElementById('garn-ok')?.value;
  const og=+document.getElementById('garn-og')?.value||100;
  const nl=+document.getElementById('garn-nl')?.value;
  const ng=+document.getElementById('garn-ng')?.value||100;
  const matKey = document.getElementById('garn-material')?.value;
  const matF = MATERIAL_FAKTOREN[matKey] || {breite:1,hoehe:1};
  const el = document.getElementById('garn-res');
  if (!el) return;

  if (ol>0 && ok>0 && nl>0) {
    const totalM  = ol * (og/100) * ok;
    // Materialfaktor: schwere/fließende Materialien verbrauchen mehr
    const matKorr = (matF.breite + matF.hoehe) / 2;
    const neededG = Math.ceil(totalM / nl * 100 * matKorr);
    const knauel  = Math.ceil(neededG / ng);
    el.innerHTML = `<label class="lbl">Benötigte Menge</label>
      <div class="grid-2 mt-sm">
        <div><p class="result-num">${neededG}g</p><p class="result-unit">Gramm gesamt</p></div>
        <div><p class="result-num">${knauel}</p><p class="result-unit">Knäuel (à ${ng}g)</p></div>
      </div>
      <p class="txt-light mt-sm" style="font-family:var(--mono);font-size:0.75rem;">Meter gesamt: ${Math.round(totalM*matKorr)} m</p>
      <p style="font-size:0.72rem;color:var(--green);">+10% Reserve: ${Math.ceil(knauel*1.1)} Knäuel empfohlen</p>`;
  } else {
    el.innerHTML = '<label class="lbl">Benötigte Menge</label><p class="txt-light">Werte eingeben →</p>';
  }
}

// ── NADELUMRECHNER ────────────────────────────────────────────
function renderNadelTable() {
  const el = document.getElementById('screen-calc-nadel');
  el.innerHTML = `
    <div class="editor-header">
      <button class="back-btn" onclick="goBack()"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <h2 style="font-family:var(--serif);font-size:1.1rem;color:var(--text);font-weight:600;">Nadelgrößen-Umrechner</h2>
    </div>
    <div class="scroll-body"><div class="p-main">
      <div class="card" style="padding:0;overflow:hidden;">
        <table class="data-table">
          <thead><tr><th>mm</th><th>US</th><th>UK</th><th>JP</th></tr></thead>
          <tbody>${NADEL_DATA.map(r=>`<tr><td style="color:var(--green);font-weight:700;">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody>
        </table>
      </div>
    </div></div>`;
}

// ── GARNSTÄRKEN ───────────────────────────────────────────────
function renderStaerkeTable() {
  const el = document.getElementById('screen-calc-staerke');
  el.innerHTML = `
    <div class="editor-header">
      <button class="back-btn" onclick="goBack()"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <h2 style="font-family:var(--serif);font-size:1.1rem;color:var(--text);font-weight:600;">Garnstärken-Umrechner</h2>
    </div>
    <div class="scroll-body"><div class="p-main flex-col gap-lg">
      <div class="card" style="padding:0;overflow:hidden;">
        <table class="data-table">
          <thead><tr><th>CYC</th><th>Name</th><th>UK Ply</th><th>DE</th><th>m/100g</th><th>Nadel mm</th></tr></thead>
          <tbody>${STAERKE_DATA.map(r=>`<tr>
            <td style="color:var(--green);font-weight:700;">${r[0]}</td>
            <td style="font-family:var(--sans);font-size:0.75rem;">${r[1]}</td>
            <td style="font-size:0.72rem;">${r[2]}</td>
            <td style="font-size:0.72rem;">${r[3]}</td>
            <td>${r[4]}</td>
            <td style="font-size:0.72rem;">${r[5]}</td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
      <div class="card card-pale-terra">
        <label class="lbl">Lauflänge → CYC Kategorie</label>
        <input type="number" id="laufl-input" placeholder="Lauflänge in m/100g" inputmode="decimal" oninput="calcLaufl()">
        <div id="laufl-res" class="mt-sm"></div>
      </div>
      <div class="card card-pale-green">
        <label class="lbl">Material-Eigenschaften vergleichen</label>
        <select id="mat-compare" onchange="showMatCompare()">
          <option value="">— Material wählen —</option>
          ${Object.keys(MATERIAL_FAKTOREN).map(m => `<option value="${m}">${m}</option>`).join('')}
        </select>
        <div id="mat-compare-res" class="mt-sm"></div>
      </div>
    </div></div>`;
}

function calcLaufl() {
  const l = +document.getElementById('laufl-input')?.value;
  const el = document.getElementById('laufl-res');
  if (!el || !l) return;
  let match = STAERKE_DATA[7];
  if (l >= 600) match = STAERKE_DATA[0];
  else if (l >= 350) match = STAERKE_DATA[1];
  else if (l >= 250) match = STAERKE_DATA[2];
  else if (l >= 200) match = STAERKE_DATA[3];
  else if (l >= 100) match = STAERKE_DATA[4];
  else if (l >= 80)  match = STAERKE_DATA[5];
  else if (l >= 60)  match = STAERKE_DATA[6];
  el.innerHTML = `<p style="font-family:var(--mono);color:var(--green);font-weight:700;">CYC ${match[0]} — ${match[1]}</p>
    <p class="txt-light" style="font-size:0.75rem;">Empfohlene Nadel: ${match[5]} mm</p>`;
}

function showMatCompare() {
  const key = document.getElementById('mat-compare')?.value;
  const el  = document.getElementById('mat-compare-res');
  if (!el || !key) return;
  const f = MATERIAL_FAKTOREN[key];
  if (!f) return;
  el.innerHTML = `<div style="background:var(--greenFaint);border-radius:var(--r-sm);padding:0.65rem 0.85rem;">
    <p style="font-size:0.82rem;color:var(--greenDark);line-height:1.6;">${f.note}</p>
    <p style="font-family:var(--mono);font-size:0.75rem;color:var(--textLight);margin-top:0.35rem;">
      Korrekturfaktor Breite: ×${f.breite} · Höhe: ×${f.hoehe}
    </p>
  </div>`;
}
