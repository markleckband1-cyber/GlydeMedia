/* ============================================================
   GLYDE MEDIA — web-portfolio.js
   Scripts for the Web Portfolio section only.
   ============================================================ */

var S   = { m: 0, d: 0 };
var CFG = {
  m: { track: 'mt', dots: 'md', count: 'mc', total: 3 },
  d: { track: 'dt', dots: 'dd', count: 'dc', total: 2 }
};

function gt(id, idx) {
  S[id] = idx;
  document.getElementById(CFG[id].track).style.transform = 'translateX(-' + (idx * 100) + '%)';
  document.getElementById(CFG[id].count).textContent = idx + 1;
  document.getElementById(CFG[id].dots)
    .querySelectorAll('.s-dot')
    .forEach(function(d, i) { d.classList.toggle('active', i === idx); });
}

function go(id, dir) {
  gt(id, (S[id] + dir + CFG[id].total) % CFG[id].total);
}

setInterval(function() { go('m', 1); }, 4200);
setInterval(function() { go('d', 1); }, 5800);

window.go = go;
window.gt = gt;
