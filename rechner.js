/* ═══════════════════════════════════════════════════════════════
   MASCHEN & MASSE — rechner.js
   Maschenprobe · Größen · Körpermaße · Garnmenge · Nadel · Stärken
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── NADEL-TABELLE ────────────────────────────────────────────
const NADEL_DATA = [
  ['2,0','B-1','14','—'],['2,25','B-1','13','2/0'],['2,5','C-2','12','—'],
  ['2,75','C-2','12','3/0'],['3,0','D-3','11','—'],['3,25','D-3','10','4/0'],
  ['3,5','E-4','9','—'],['3,75','F-5','9','5/0'],['4,0','G-6','8','6'],
  ['4,5','7','7','7/0'],['5,0','H-8','6','8/0'],['5,5','I-9','5','—'],
  ['6,0','J-10','4','10/0'],['6,5','K-10½','3','—'],['7,0','—','2','—'],
  ['8,0','L-11','0','—'],['9,0','M/N-13','00','—'],['10,0','N/P-15','000','—'],
  ['12,0','P/Q','—','—'],['15,0','S','—','—'],['16,0','Q','—','—'],
  ['19,0','S','—','—'],['25,0','U','—','—'],
];

// ─── GARNSTÄRKEN-TABELLE (CYC) ────────────────────────────────
const STAERKE_DATA = [
  ['0','Lace','1–2 ply','2-fädig','600–800+','2,25–3,5','B-1–E-4'],
  ['1','Super Fine','3–4 ply','3–4-fädig','350–600','3,5–4,5','E-4–7'],
  ['2','Fine','5 ply','5-fädig','250–350','4,5–5,5','7–I-9'],
  ['3','Light / DK','DK / 8 ply','8-fädig','200–250','5,5–6,5','I-9–K-10½'],
  ['4','Medium / Worsted','Worsted / 10 ply','10-fädig','120–200','6,5–9,0','K-10½–M-13'],
  ['5','Bulky','Chunky / 12 ply','12-fädig','80–130','9,0–15,0','M-13–S'],
  ['6','Super Bulky','Super Chunky / 16 ply','—','unter 100','15,0–20,0','S–U'],
  ['7','Jumbo','—','—','unter 80','25,0+','—'],
];

// ─── EASE-DEFAULTS nach Kleidungstyp ─────────────────────────
const EASE_DEFAULTS = {
  'Pullover (klassisch)':   { bust:10, waist:7,  hip:8,  note:'Standard' },
  'Pullover (oversized)':   { bust:20, waist:18, hip:15, note:'Weit' },
  'Cardigan':               { bust:12, waist:9,  hip:10, note:'+für offenes Vorderteil' },
  'Jacke':                  { bust:15, waist:12, hip:12, note:'' },
  'Top / Crop':             { bust:4,  waist:2,  hip:0,  note:'Knapp' },
  'Kleid (klassisch)':      { bust:8,  waist:8,  hip:12, note:'' },
  'Mütze':                  { bust:-3, waist:0,  hip:0,  note:'Negativer Ease am Kopf' },
  'Socken':                 { bust:-3, waist:0,  hip:0,  note:'Negativer Ease am Fußumfang' },
};

// ─── DE/EU DAMEN KONFEKTIONSGRÖSSEN ──────────────────────────
// Quelle: CYC 2018 + DE-Äquivalenzen
const DE_GROESSEN_DAMEN = [
  {de:'32',eu:'32',bust_from:76,bust_to:78,waist_from:60,waist_to:62,hip_from:84,hip_to:86},
  {de:'34',eu:'34',bust_from:80,bust_to:82,waist_from:64,waist_to:66,hip_from:88,hip_to:90},
  {de:'36',eu:'36',bust_from:84,bust_to:86,waist_from:68,waist_to:70,hip_from:92,hip_to:94},
  {de:'38',eu:'38',bust_from:88,bust_to:90,waist_from:72,waist_to:74,hip_from:96,hip_to:98},
  {de:'40',eu:'40',bust_from:92,bust_to:94,waist_from:76,waist_to:78,hip_from:100,hip_to:102},
  {de:'42',eu:'42',bust_from:96,bust_to:98,waist_from:80,waist_to:82,hip_from:104,hip_to:106},
  {de:'44',eu:'44',bust_from:100,bust_to:102,waist_from:84,waist_to:86,hip_from:108,hip_to:110},
  {de:'46',eu:'46',bust_from:104,bust_to:106,waist_from:88,waist_to:90,hip_from:112,hip_to:114},
  {de:'48',eu:'48',bust_from:108,bust_to:110,waist_from:92,waist_to:94,hip_from:116,hip_to:118},
  {de:'50',eu:'50',bust_from:112,bust_to:114,waist_from:96,waist_to:98,hip_from:120,hip_to:122},
  {de:'52',eu:'52',bust_from:116,bust_to:118,waist_from:100,waist_to:102,hip_from:124,hip_to:126},
  {de:'54',eu:'54',bust_from:120,bust_to:122,waist_from:104,waist_to:106,hip_from:128,hip_to:130},
  {de:'56',eu:'56',bust_from:124,bust_to:126,waist_from:108,waist_to:110,hip_from:132,hip_to:134},
  {de:'58',eu:'58',bust_from:128,bust_to:130,waist_from:112,waist_to:114,hip_from:136,hip_to:138},
];

// CYC Damen-Größen
const CYC_DAMEN = [
  {cyc:'XXS',bust_from:71,bust_to:76,waist_from:56,waist_to:61},
  {cyc:'XS', bust_from:76,bust_to:81,waist_from:61,waist_to:66},
  {cyc:'S',  bust_from:81,bust_to:86,waist_from:66,waist_to:71},
  {cyc:'M',  bust_from:91,bust_to:96,waist_from:76,waist_to:81},
  {cyc:'L',  bust_from:101,bust_to:106,waist_from:86,waist_to:91},
  {cyc:'XL', bust_from:111,bust_to:116,waist_from:96,waist_to:101},
  {cyc:'2XL',bust_from:121,bust_to:127,waist_from:106,waist_to:112},
  {cyc:'3XL',bust_from:132,bust_to:137,waist_from:116,waist_to:122},
  {cyc:'4XL',bust_from:142,bust_to:147,waist_from:126,waist_to:132},
  {cyc:'5XL',bust_from:152,bust_to:158,waist_from:137,waist_to:142},
];

// ─── SCREEN RENDERERS ─────────────────────────────────────────

function renderCalcMP() {
  const el = document.getElementById('screen-calc-mp');
  el.innerHTML = `
    <div class="editor-header">
      <button class="back-btn" onclick="goBack()"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <h2 style="font-family:var(--serif);font-size:1.1rem;color:var(--text);font-weight:600;">Maschenprobe-Rechner</h2>
    </div>
    <div class="scroll-body"><div class="p-main flex-col gap-lg">
      <div class="card card-terra">
        <label class="lbl">Deine Probe</label>
        <p class="txt-light mb-md">Mind. 15×15 cm häkeln, waschen, flach trocknen, dann messen.</p>
        <div class="grid-2 mb-md">
          <div><label class="lbl">Maschen in Probe</label><input type="number" id="mp-m" placeholder="20" oninput="calcMP()"></div>
          <div><label class="lbl">Reihen in Probe</label><input type="number" id="mp-r" placeholder="15" oninput="calcMP()"></div>
        </div>
        <div class="grid-2">
          <div><label class="lbl">Breite der Probe (cm)</label><input type="number" id="mp-w" value="10" oninput="calcMP()"></div>
          <div><label class="lbl">Höhe der Probe (cm)</label><input type="number" id="mp-h" value="10" oninput="calcMP()"></div>
        </div>
      </div>
      <div id="mp-res" class="result-box terra"><label class="lbl">Ergebnis</label><p class="txt-mono" style="color:var(--textLight);">Werte eingeben →</p></div>
      <div class="card card-pale-terra">
        <label class="lbl">Umrechnung: Gewünschtes Maß → Maschen</label>
        <div class="grid-2 mt-sm">
          <div><label class="lbl">Gewünschte Breite (cm)</label><input type="number" id="mp-target-w" placeholder="50" oninput="calcMP()"></div>
          <div><label class="lbl">Gewünschte Höhe (cm)</label><input type="number" id="mp-target-h" placeholder="60" oninput="calcMP()"></div>
        </div>
        <div id="mp-target-res" class="mt-sm"></div>
      </div>
    </div></div>`;
}

function calcMP() {
  const m=+document.getElementById('mp-m').value, r=+document.getElementById('mp-r').value;
  const w=+document.getElementById('mp-w').value||10, h=+document.getElementById('mp-h').value||10;
  const el = document.getElementById('mp-res');
  if (m>0 && r>0) {
    const mpc=(m/w).toFixed(3), rpc=(r/h).toFixed(3);
    const mpcm=(w/m).toFixed(3), rpcm=(h/r).toFixed(3);
    el.innerHTML = `<label class="lbl">Ergebnis</label>
      <div class="grid-2 mt-sm">
        <div><p class="result-num">${(m/w*10).toFixed(1)}</p><p class="result-unit">Maschen / 10 cm</p></div>
        <div><p class="result-num">${(r/h*10).toFixed(1)}</p><p class="result-unit">Reihen / 10 cm</p></div>
      </div>
      <p class="txt-light mt-sm" style="font-family:var(--mono);font-size:0.75rem;">1 M = ${mpcm} cm · 1 R = ${rpcm} cm</p>`;

    // Target conversion
    const tw=+document.getElementById('mp-target-w')?.value, th=+document.getElementById('mp-target-h')?.value;
    const tres=document.getElementById('mp-target-res');
    if ((tw||th) && tres) {
      let html = '';
      if (tw>0) html += `<p style="font-family:var(--mono);color:var(--terra);font-weight:700;">${Math.round(tw*m/w)} Maschen</p><p class="result-unit">für ${tw} cm Breite</p>`;
      if (th>0) html += `<p style="font-family:var(--mono);color:var(--terra);font-weight:700;margin-top:0.4rem;">${Math.round(th*r/h)} Reihen</p><p class="result-unit">für ${th} cm Höhe</p>`;
      tres.innerHTML = html;
    }
  } else {
    el.innerHTML = '<label class="lbl">Ergebnis</label><p class="txt-light">Werte eingeben →</p>';
  }
}

function renderCalcGroesse() {
  const el = document.getElementById('screen-calc-groesse');
  el.innerHTML = `
    <div class="editor-header">
      <button class="back-btn" onclick="goBack()"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <h2 style="font-family:var(--serif);font-size:1.1rem;color:var(--text);font-weight:600;">Größenrechner</h2>
    </div>
    <div class="scroll-body"><div class="p-main flex-col gap-lg">
      <div class="card card-pale-terra">
        <p class="txt-light"><strong style="color:var(--terra);">So funktioniert es:</strong> Trage die Maschenprobe der Anleitung ein, dann deine eigene Maschenprobe — die App berechnet automatisch alle skalierten Maschen- und Reihenzahlen.</p>
      </div>
      <div class="card card-terra">
        <label class="lbl">Maschenprobe der Anleitung (Original)</label>
        <div class="grid-2">
          <div><label class="lbl">Maschen / 10 cm</label><input type="number" id="gr-om" placeholder="18" oninput="calcGR()"></div>
          <div><label class="lbl">Reihen / 10 cm</label><input type="number" id="gr-or" placeholder="12" oninput="calcGR()"></div>
        </div>
      </div>
      <div class="card card-green">
        <label class="lbl">Deine eigene Maschenprobe</label>
        <div class="grid-2">
          <div><label class="lbl">Maschen / 10 cm</label><input type="number" id="gr-nm" placeholder="20" oninput="calcGR()"></div>
          <div><label class="lbl">Reihen / 10 cm</label><input type="number" id="gr-nr" placeholder="11" oninput="calcGR()"></div>
        </div>
      </div>
      <div class="card">
        <label class="lbl">Original-Werte der Anleitung</label>
        <div class="grid-2">
          <div><label class="lbl">Maschen</label><input type="number" id="gr-os" placeholder="90" oninput="calcGR()"></div>
          <div><label class="lbl">Reihen</label><input type="number" id="gr-rw" placeholder="36" oninput="calcGR()"></div>
        </div>
      </div>
      <div class="card">
        <label class="lbl">Muster-Rapport (optional)</label>
        <div class="grid-2">
          <div><label class="lbl">Vielfaches von X</label><input type="number" id="gr-mult" placeholder="1" oninput="calcGR()"></div>
          <div><label class="lbl">Plus Y</label><input type="number" id="gr-plus" placeholder="0" oninput="calcGR()"></div>
        </div>
        <p class="txt-light mt-sm" style="font-size:0.72rem;">z.B. Shell-Muster: X=6, Y=1. Leer lassen wenn kein Rapport.</p>
      </div>
      <div id="gr-res" class="result-box terra"><label class="lbl">Deine Werte</label><p class="txt-light">Werte eingeben →</p></div>
    </div></div>`;
}

function calcGR() {
  const om=+document.getElementById('gr-om').value, or_=+document.getElementById('gr-or').value;
  const nm=+document.getElementById('gr-nm').value, nr=+document.getElementById('gr-nr').value;
  const os=+document.getElementById('gr-os').value, rw=+document.getElementById('gr-rw').value;
  const mult=+document.getElementById('gr-mult').value||1;
  const plus=+document.getElementById('gr-plus').value||0;
  const el = document.getElementById('gr-res');
  if (!el) return;
  if (om>0 && or_>0 && nm>0 && nr>0) {
    const sfB = nm/om, sfH = nr/or_;
    let warn = '';
    if (sfB < 0.7 || sfB > 1.3) warn = '<div class="warning-box mt-sm">Skalierungsfaktor > 30% — Neukonstruktion empfohlen</div>';

    if (os>0 && rw>0) {
      let rawM = os * sfB;
      let rawR = Math.round(rw * sfH);

      // Rapport-Anpassung
      let adjM = Math.round(rawM);
      if (mult > 1) {
        const nLow  = Math.floor((rawM - plus) / mult);
        const nHigh = Math.ceil( (rawM - plus) / mult);
        const vLow  = nLow  * mult + plus;
        const vHigh = nHigh * mult + plus;
        adjM = Math.abs(vLow - rawM) <= Math.abs(vHigh - rawM) ? vLow : vHigh;
      }

      const devCm = Math.abs(adjM - rawM) / (nm/10);
      const devWarn = devCm > 2.0 ? `<p class="txt-light mt-sm" style="color:var(--draft);">Rapport-Abweichung: ${devCm.toFixed(1)} cm</p>` : '';

      el.innerHTML = `<label class="lbl">Deine Werte</label>
        <div class="grid-2 mt-sm">
          <div><p class="result-num">${adjM}</p><p class="result-unit">Maschen</p>${mult>1?`<p class="txt-light" style="font-size:0.7rem;">Rapport ${mult}+${plus} ✓</p>`:''}</div>
          <div><p class="result-num">${rawR}</p><p class="result-unit">Reihen</p></div>
        </div>
        <p class="txt-light mt-sm" style="font-family:var(--mono);font-size:0.72rem;">SF Breite: ${sfB.toFixed(3)} · SF Höhe: ${sfH.toFixed(3)}</p>
        ${devWarn}${warn}`;
    } else {
      el.innerHTML = `<label class="lbl">Skalierungsfaktoren</label>
        <div class="grid-2 mt-sm">
          <div><p class="result-num">${sfB.toFixed(3)}</p><p class="result-unit">Faktor Breite</p></div>
          <div><p class="result-num">${sfH.toFixed(3)}</p><p class="result-unit">Faktor Höhe</p></div>
        </div>
        <p class="txt-light mt-sm">Gib Original-Maschen/-Reihen ein für konkrete Werte.</p>
        ${warn}`;
    }
  } else {
    el.innerHTML = '<label class="lbl">Deine Werte</label><p class="txt-light">Werte eingeben →</p>';
  }
}

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
          <div><label class="lbl">Brustumfang (cm)</label><input type="number" id="mass-brust" placeholder="—" oninput="calcMass()"></div>
          <div><label class="lbl">Taillenumfang (cm)</label><input type="number" id="mass-taille" placeholder="—" oninput="calcMass()"></div>
          <div><label class="lbl">Hüftumfang (cm)</label><input type="number" id="mass-hufte" placeholder="—" oninput="calcMass()"></div>
          <div><label class="lbl">Körpergröße (cm)</label><input type="number" id="mass-hoehe" placeholder="—" oninput="calcMass()"></div>
        </div>
      </div>
      <div id="mass-res" class="result-box terra">
        <label class="lbl">Deine Konfektionsgröße</label>
        <p class="txt-light">Maße eingeben →</p>
      </div>
      <div id="mass-fits" class="card" style="display:none;">
        <label class="lbl">Fertigmaße nach Passform (Brustumfang)</label>
        <div id="mass-fits-body"></div>
      </div>
      <div class="card">
        <label class="lbl">Kleidungstyp für Ease-Berechnung</label>
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
  const el     = document.getElementById('mass-res');
  const fitsEl = document.getElementById('mass-fits');
  const fitsBody = document.getElementById('mass-fits-body');
  if (!el) return;

  if (brust > 0) {
    // CYC Größe finden (Brustumfang als primäres Maß)
    let cycMatch = null;
    for (const s of CYC_DAMEN) {
      if (brust >= s.bust_from && brust <= s.bust_to) { cycMatch = s; break; }
    }
    if (!cycMatch) {
      // Nächste Größe suchen
      cycMatch = CYC_DAMEN.reduce((prev, curr) => {
        const d1 = Math.abs((prev.bust_from+prev.bust_to)/2 - brust);
        const d2 = Math.abs((curr.bust_from+curr.bust_to)/2 - brust);
        return d2 < d1 ? curr : prev;
      });
    }

    // DE-Größe finden
    let deMatch = DE_GROESSEN_DAMEN.reduce((prev, curr) => {
      const d1 = Math.abs((prev.bust_from+prev.bust_to)/2 - brust);
      const d2 = Math.abs((curr.bust_from+curr.bust_to)/2 - brust);
      return d2 < d1 ? curr : prev;
    });

    el.innerHTML = `<label class="lbl">Deine Konfektionsgröße</label>
      <div class="flex gap-lg mt-sm align-c">
        <div><p class="result-num">${cycMatch.cyc}</p><p class="result-unit">CYC / International</p></div>
        <div><p class="result-num">DE ${deMatch.de}</p><p class="result-unit">Deutsch / EU</p></div>
      </div>
      <p class="txt-light mt-sm" style="font-size:0.75rem;">Basiert auf Brustumfang ${brust} cm · Richtwert, immer Körpermaße als Primärwert verwenden</p>`;

    // Passform-Übersicht
    const fits = [
      ['Sehr eng',   -8], ['Eng',    0],  ['Klassisch', +10],
      ['Locker',    +15], ['Oversized', +25]
    ];
    fitsBody.innerHTML = fits.map(([name, ease]) =>
      `<div style="display:flex;justify-content:space-between;padding:0.45rem 0;border-bottom:1px solid var(--borderLight);">
        <span style="font-size:0.82rem;color:var(--text);">${name}</span>
        <span style="font-family:var(--mono);font-size:0.82rem;color:var(--terra);font-weight:600;">${brust+ease} cm Brust fertig</span>
      </div>`).join('');
    fitsEl.style.display = 'block';

    // Ease-Anzeige
    const kleidung = document.getElementById('mass-kleidung')?.value;
    const easeEl = document.getElementById('mass-ease-res');
    if (kleidung && EASE_DEFAULTS[kleidung] && easeEl) {
      const e = EASE_DEFAULTS[kleidung];
      easeEl.innerHTML = `<div class="card-pale-terra" style="border-radius:var(--r-sm);padding:0.65rem 0.85rem;border:1px solid var(--terraPale);">
        <p class="lbl" style="margin-bottom:0.35rem;">Empfohlener Ease für ${kleidung}</p>
        <p style="font-family:var(--mono);color:var(--terra);font-size:0.85rem;">Brust: +${e.bust} cm → Fertigmaß: <strong>${brust+e.bust}</strong> cm</p>
        ${e.waist&&taille>0 ? `<p style="font-family:var(--mono);color:var(--terra);font-size:0.82rem;">Taille: +${e.waist} cm → ${taille+e.waist} cm</p>`:''}
        ${e.hip&&hufte>0 ? `<p style="font-family:var(--mono);color:var(--terra);font-size:0.82rem;">Hüfte: +${e.hip} cm → ${hufte+e.hip} cm</p>`:''}
        ${e.note?`<p class="txt-light" style="font-size:0.7rem;margin-top:0.25rem;">${e.note}</p>`:''}
      </div>`;
    }
  } else {
    el.innerHTML = '<label class="lbl">Deine Konfektionsgröße</label><p class="txt-light">Brustumfang eingeben →</p>';
    if (fitsEl) fitsEl.style.display = 'none';
  }
}

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
          <div><label class="lbl">Lauflänge m/100g</label><input type="number" id="garn-ol" placeholder="200" oninput="calcGarn()"></div>
          <div><label class="lbl">Anzahl Knäuel</label><input type="number" id="garn-ok" placeholder="5" oninput="calcGarn()"></div>
        </div>
        <div class="mt-sm"><label class="lbl">Gramm pro Knäuel</label><input type="number" id="garn-og" placeholder="100" oninput="calcGarn()"></div>
      </div>
      <div class="card card-green">
        <label class="lbl">Dein Substitutions-Garn</label>
        <div class="grid-2">
          <div><label class="lbl">Lauflänge m/100g</label><input type="number" id="garn-nl" placeholder="250" oninput="calcGarn()"></div>
          <div><label class="lbl">Gramm pro Knäuel</label><input type="number" id="garn-ng" placeholder="100" oninput="calcGarn()"></div>
        </div>
      </div>
      <div id="garn-res" class="result-box terra"><label class="lbl">Benötigte Menge</label><p class="txt-light">Werte eingeben →</p></div>
    </div></div>`;
}

function calcGarn() {
  const ol=+document.getElementById('garn-ol').value, ok=+document.getElementById('garn-ok').value;
  const og=+document.getElementById('garn-og').value||100;
  const nl=+document.getElementById('garn-nl').value, ng=+document.getElementById('garn-ng').value||100;
  const el = document.getElementById('garn-res');
  if (!el) return;
  if (ol>0 && ok>0 && nl>0) {
    const totalM    = ol * (og/100) * ok;
    const neededG   = Math.ceil(totalM / nl * 100);
    const knauel    = Math.ceil(neededG / ng);
    const knauelPls = Math.ceil((totalM * 1.1) / nl / ng * ng / ng); // +10% Reserve
    el.innerHTML = `<label class="lbl">Benötigte Menge</label>
      <div class="grid-2 mt-sm">
        <div><p class="result-num">${neededG}g</p><p class="result-unit">Gramm gesamt</p></div>
        <div><p class="result-num">${knauel}</p><p class="result-unit">Knäuel (à ${ng}g)</p></div>
      </div>
      <p class="txt-light mt-sm" style="font-family:var(--mono);font-size:0.75rem;">Original-Meter gesamt: ${Math.round(totalM)} m</p>
      <p class="txt-light" style="font-size:0.72rem;color:var(--terra);">+10% Reserve: ${Math.ceil(knauel*1.1)} Knäuel empfohlen</p>`;
  } else {
    el.innerHTML = '<label class="lbl">Benötigte Menge</label><p class="txt-light">Werte eingeben →</p>';
  }
}

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
          <tbody>${NADEL_DATA.map(r=>
            `<tr><td style="color:var(--terra);font-weight:700;">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`
          ).join('')}</tbody>
        </table>
      </div>
    </div></div>`;
}

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
          <tbody>${STAERKE_DATA.map(r=>
            `<tr><td style="color:var(--terra);font-weight:700;">${r[0]}</td><td style="font-family:var(--sans);font-size:0.75rem;">${r[1]}</td><td style="font-size:0.72rem;">${r[2]}</td><td style="font-size:0.72rem;">${r[3]}</td><td>${r[4]}</td><td style="font-size:0.72rem;">${r[5]}</td></tr>`
          ).join('')}</tbody>
        </table>
      </div>
      <div class="card card-pale-terra">
        <label class="lbl">Lauflänge → CYC Kategorie</label>
        <input type="number" id="laufl-input" placeholder="Lauflänge in m/100g" oninput="calcLaufl()">
        <div id="laufl-res" class="mt-sm"></div>
      </div>
    </div></div>`;
}

function calcLaufl() {
  const l = +document.getElementById('laufl-input')?.value;
  const el = document.getElementById('laufl-res');
  if (!el || !l) return;
  let match = null;
  // Rough lookup
  if (l >= 600) match = STAERKE_DATA[0];
  else if (l >= 350) match = STAERKE_DATA[1];
  else if (l >= 250) match = STAERKE_DATA[2];
  else if (l >= 200) match = STAERKE_DATA[3];
  else if (l >= 100) match = STAERKE_DATA[4];
  else if (l >= 80)  match = STAERKE_DATA[5];
  else if (l >= 60)  match = STAERKE_DATA[6];
  else match = STAERKE_DATA[7];

  el.innerHTML = `<p style="font-family:var(--mono);color:var(--terra);font-weight:700;">CYC ${match[0]} — ${match[1]}</p>
    <p class="txt-light" style="font-size:0.75rem;">Empfohlene Nadel: ${match[5]} mm</p>`;
}
