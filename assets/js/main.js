/* ============================================================
   GLYDE MEDIA — main.js
   All site scripts live here, organized by section.
   ============================================================ */


/* ============================================================
   SECTION: WEB PORTFOLIO — Sliders
   ============================================================ */
const S   = { m: 0, d: 0 };
const CFG = {
  m: { track: 'mt', dots: 'md', count: 'mc', total: 2 },
  d: { track: 'dt', dots: 'dd', count: 'dc', total: 3 }
};

function gt(id, idx) {
  S[id] = idx;
  document.getElementById(CFG[id].track).style.transform = 'translateX(-' + (idx * 100) + '%)';
  document.getElementById(CFG[id].count).textContent = idx + 1;
  document.getElementById(CFG[id].dots)
    .querySelectorAll('.s-dot')
    .forEach((d, i) => d.classList.toggle('active', i === idx));
}

function go(id, dir) {
  gt(id, (S[id] + dir + CFG[id].total) % CFG[id].total);
}

// Auto-advance sliders
setInterval(() => go('m', 1), 4200);
setInterval(() => go('d', 1), 5800);

// Touch/swipe support
['m', 'd'].forEach(id => {
  const el = document.getElementById(CFG[id].track).closest('.slider-col');
  let sx = 0;
  el.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) go(id, dx < 0 ? 1 : -1);
  }, { passive: true });
});

/* Expose to inline onclick handlers in HTML */
window.go = go;
window.gt = gt;


/* ============================================================
   SECTION: WEB PORTFOLIO — DynaPore Canvas Animation
   ============================================================ */
(function () {
  const canvas = document.getElementById('dp-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const TEAL = '#00A8AB';

  const SIM_SPEED  = 1.2;
  const TRACE_LEN  = 400;
  const EV1_START  = 380, EV1_END = 520, EV1_DEPTH = 0.010;
  const EV2_START  = 648, EV2_SHARP = 652, EV2_DEPTH = 0.020;

  function getVal(s) {
    const n = (Math.sin(s*7.3)*0.4 + Math.sin(s*13.1)*0.3 + Math.sin(s*3.7)*0.2 + (Math.random()-0.5)*0.8) * 0.0008;
    let b = 0.012 + n;
    if (s >= EV1_START && s < EV1_END) {
      const p  = (s - EV1_START) / (EV1_END - EV1_START);
      const sh = p < 0.1 ? p/0.1 : p < 0.35 ? 1 : Math.max(0, 1-(p-0.35)/0.65);
      b += sh * EV1_DEPTH;
    }
    if (s >= EV2_START) {
      if (s < EV2_SHARP) b += ((s-EV2_START)/(EV2_SHARP-EV2_START)) * EV2_DEPTH;
      else b += EV2_DEPTH + (s-EV2_SHARP)*0.000018 + n*1.5;
    }
    return Math.max(0.008, Math.min(0.036, b));
  }

  let traceA = [], simTime = 500, t = 0;
  let inEvent = false, eventProg = 0, resetMarkerX = null;

  for (let i = 0; i < TRACE_LEN; i++) traceA.push(getVal(300 + (i / TRACE_LEN) * 200));

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function drawScene() {
    const W = canvas.width, H = canvas.height;
    if (!W || !H) return;
    ctx.clearRect(0, 0, W, H);

    const pX = 96, pW = W - 96;
    const graphTop = H * 0.18, graphBot = H - 72;
    const traceH = (graphBot - graphTop) / 2;
    const baseY  = graphTop + traceH;
    const toY    = v => (baseY - traceH) + (v / 0.036) * traceH * 2;

    // Grid lines
    [0, 0.010, 0.020, 0.030].forEach(v => {
      const y = toY(v);
      if (y < baseY-traceH-2 || y > baseY+traceH+2) return;
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1; ctx.setLineDash([2, 5]);
      ctx.beginPath(); ctx.moveTo(pX, y); ctx.lineTo(pX+pW, y); ctx.stroke();
      ctx.setLineDash([]);
    });

    // Trace fill
    ctx.beginPath();
    traceA.forEach((v, i) => {
      const x = pX + (i / (TRACE_LEN-1)) * pW;
      i === 0 ? ctx.moveTo(x, toY(v)) : ctx.lineTo(x, toY(v));
    });
    ctx.lineTo(pX+pW, toY(0)); ctx.lineTo(pX, toY(0)); ctx.closePath();
    ctx.fillStyle = 'rgba(0,168,171,0.08)'; ctx.fill();

    // Trace line
    const lg = ctx.createLinearGradient(pX, 0, pX+pW, 0);
    lg.addColorStop(0,    'rgba(0,0,0,0)');
    lg.addColorStop(0.03,  TEAL);
    lg.addColorStop(0.97,  TEAL);
    lg.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.beginPath();
    traceA.forEach((v, i) => {
      const x = pX + (i / (TRACE_LEN-1)) * pW;
      i === 0 ? ctx.moveTo(x, toY(v)) : ctx.lineTo(x, toY(v));
    });
    ctx.strokeStyle = lg; ctx.lineWidth = 1.5;
    ctx.shadowColor = TEAL; ctx.shadowBlur = 3; ctx.stroke(); ctx.shadowBlur = 0;

    // Center dot
    const lv = traceA[Math.floor(TRACE_LEN / 2)];
    ctx.beginPath(); ctx.arc(pX+pW/2, toY(lv), 3, 0, Math.PI*2);
    ctx.fillStyle = TEAL; ctx.shadowColor = TEAL; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;

    // X axis
    const xAY = baseY + traceH + 18;
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pX, xAY); ctx.lineTo(pX+pW, xAY); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '11px DM Sans,monospace'; ctx.textAlign = 'center';
    ctx.fillText('Time (seconds)', pX+pW/2, xAY+20);

    // Time labels
    const traceWin   = TRACE_LEN * SIM_SPEED;
    const traceStart = simTime - traceWin;
    [200, 400, 600, 800].forEach(ts => {
      const tx = pX + (ts - traceStart) / traceWin * pW;
      if (tx < pX+5 || tx > pX+pW-5) return;
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(tx, xAY); ctx.lineTo(tx, xAY+4); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '10px DM Sans,monospace'; ctx.textAlign = 'center';
      ctx.fillText(ts+'s', tx, xAY+13);
    });

    // Event markers
    function marker(sTime, label, col) {
      const x = pX + (sTime - traceStart) / traceWin * pW;
      if (x < pX+20 || x > pX+pW-20) return;
      ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(x, baseY-traceH-6); ctx.lineTo(x, baseY+traceH); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = col; ctx.font = '500 11px DM Sans,monospace'; ctx.textAlign = 'center';
      ctx.fillText(label, x, baseY-traceH-10);
    }
    marker(EV1_START, 'Addition (−)', 'rgba(255,255,255,0.5)');
    marker(EV2_START, 'Addition (+)', 'rgba(220,100,100,0.8)');
    if (resetMarkerX !== null) marker(traceStart + resetMarkerX * traceWin, '(reset)', 'rgba(255,255,255,0.45)');

    // Membrane / pore
    const mL = W * 0.18, cx2 = W * 0.5;
    const gC2 = ctx.createLinearGradient(0, baseY-6, 0, baseY+6);
    gC2.addColorStop(0,   'rgba(20,29,62,0.9)');
    gC2.addColorStop(0.5, 'rgba(14,21,38,0.95)');
    gC2.addColorStop(1,   'rgba(20,29,62,0.9)');
    ctx.fillStyle = gC2; ctx.fillRect(mL, baseY-6, W-mL*2, 12);

    // Top/bottom membrane lines
    [[-6, 0.6, 0.6], [6, 0.5, 0.5]].forEach(([offset, s1, s2]) => {
      const lineG = ctx.createLinearGradient(0, 0, W, 0);
      lineG.addColorStop(0,      'rgba(0,168,171,0)');
      lineG.addColorStop(mL/W,   `rgba(0,168,171,${s1})`);
      lineG.addColorStop(1-mL/W, `rgba(0,168,171,${s2})`);
      lineG.addColorStop(1,      'rgba(0,168,171,0)');
      ctx.beginPath(); ctx.moveTo(0, baseY+offset); ctx.lineTo(W, baseY+offset);
      ctx.strokeStyle = lineG; ctx.lineWidth = 1.5;
      ctx.shadowColor = TEAL; ctx.shadowBlur = 5; ctx.stroke(); ctx.shadowBlur = 0;
    });

    // Pore glow
    const poreOpen = 6 + Math.sin(t*1.1)*1.2 - (inEvent ? eventProg*2.5 : 0);
    const pg = ctx.createRadialGradient(cx2, baseY, 0, cx2, baseY, poreOpen+5);
    pg.addColorStop(0,   `rgba(0,168,171,${0.75-(inEvent?eventProg*0.4:0)})`);
    pg.addColorStop(0.5,  'rgba(0,168,171,0.2)');
    pg.addColorStop(1,    'rgba(0,168,171,0)');
    ctx.beginPath(); ctx.arc(cx2, baseY, poreOpen+5, 0, Math.PI*2);
    ctx.fillStyle = pg; ctx.shadowColor = TEAL; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0;

    // Ions
    for (let i = 0; i < 3; i++) {
      const p  = ((t*0.6 + i*0.33) % 1);
      const iy = baseY - 28 + p * 56;
      const ia = Math.sin(p * Math.PI) * 0.95;
      ctx.beginPath(); ctx.arc(cx2, iy, 3, 0, Math.PI*2);
      ctx.fillStyle = `rgba(0,168,171,${ia})`;
      ctx.shadowColor = TEAL; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
    }

    // Y axis
    ctx.strokeStyle = 'rgba(0,168,171,0.2)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pX, H*0.18); ctx.lineTo(pX, H*0.76); ctx.stroke();

    [{v:0,l:'0.000'},{v:0.010,l:'−0.010'},{v:0.020,l:'−0.020'},{v:0.030,l:'−0.030'}].forEach(({v, l}) => {
      const y = toY(v);
      if (y < baseY-traceH-4 || y > baseY+traceH+20) return;
      ctx.strokeStyle = 'rgba(0,168,171,0.3)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pX-4, y); ctx.lineTo(pX, y); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.font = '10px DM Sans,monospace'; ctx.textAlign = 'right';
      ctx.fillText(l, pX-6, y+3);
    });
    ctx.textAlign = 'left';

    // Y label
    ctx.save();
    ctx.translate(24, baseY); ctx.rotate(-Math.PI/2);
    ctx.fillStyle = 'rgba(0,168,171,0.5)';
    ctx.font = '500 10px DM Sans,monospace'; ctx.textAlign = 'center';
    ctx.fillText('Current (nA)', 0, 0);
    ctx.restore();
  }

  let lastT = 0, frame = 0;
  function draw(ts) {
    requestAnimationFrame(draw);
    if (ts - lastT < 33) return;
    lastT = ts; frame++;
    simTime += SIM_SPEED;
    if (simTime > 950) { simTime = 300; resetMarkerX = 1.0; }
    if (resetMarkerX !== null) { resetMarkerX -= 1/TRACE_LEN; if (resetMarkerX < 0) resetMarkerX = null; }
    traceA.push(getVal(simTime));
    if (traceA.length > TRACE_LEN) traceA.shift();
    inEvent    = simTime >= EV2_START;
    eventProg  = inEvent ? Math.min(1, (simTime - EV2_START) / 60) : 0;
    drawScene();
    t += 0.008;
    if (frame % 6 === 0) {
      const raw = traceA[Math.floor(TRACE_LEN / 2)] || 0.012;
      const el  = document.getElementById('dp-cur-val');
      if (el) el.textContent = (-raw).toFixed(3);
    }
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();


/* ============================================================
   SECTION: HERO — (placeholder for future scripts)
   ============================================================ */


/* ============================================================
   SECTION: SERVICES — (placeholder for future scripts)
   ============================================================ */


/* ============================================================
   SECTION: ABOUT — (placeholder for future scripts)
   ============================================================ */
