/* ============================================================
   main.js — Scroll controller & chapter orchestration
   ============================================================ */

const CHAPTERS = ['chapter-0','chapter-1','chapter-2','chapter-3','chapter-4'];
const DRAW_FNS = [null, drawTimeline, drawWho, drawFunnel, drawCharges];
const drawn    = new Set();

let current   = 0;
let animating = false;

document.getElementById('chapter-0').classList.add('active');
document.getElementById('scrollHint').classList.add('ch-0');
updateNav(0);

function goTo(index) {
  if (animating || index === current || index < 0 || index >= CHAPTERS.length) return;
  animating = true;

  const prev = document.getElementById(CHAPTERS[current]);
  const next = document.getElementById(CHAPTERS[index]);

  prev.classList.remove('active');
  prev.classList.add(index > current ? 'exit-up' : 'exit-down');

  next.style.transform = index > current ? 'translateY(30px)' : 'translateY(-30px)';
  next.classList.add('active');

  current = index;
  updateNav(current);

  // Animate chapter title letters
  setTimeout(() => animateTitle(next), 80);

  // Draw viz on first visit
  if (!drawn.has(current) && DRAW_FNS[current]) {
    drawn.add(current);
    setTimeout(() => DRAW_FNS[current](), 150);
  }

  const hint = document.getElementById('scrollHint');
  hint.classList.toggle('hidden', current === CHAPTERS.length - 1);
  hint.className = hint.className.replace(/ch-\d/g, '').trim() + ' ch-' + current;

  setTimeout(() => {
    prev.classList.remove('exit-up', 'exit-down');
    animating = false;
  }, 900);
}

function updateNav(index) {
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// ── Wheel ─────────────────────────────────────────────────
let wheelCooldown = false;
window.addEventListener('wheel', (e) => {
  if (wheelCooldown) return;
  wheelCooldown = true;
  setTimeout(() => wheelCooldown = false, 1000);
  goTo(e.deltaY > 0 ? current + 1 : current - 1);
}, { passive: true });

// ── Keyboard ──────────────────────────────────────────────
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(current + 1);
  if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  goTo(current - 1);
});

// ── Touch ─────────────────────────────────────────────────
let touchStartY = 0;
window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchend', (e) => {
  const dy = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(dy) > 40) goTo(dy > 0 ? current + 1 : current - 1);
});

// ── Nav dots ──────────────────────────────────────────────
document.querySelectorAll('.nav-dot').forEach((dot) => {
  dot.addEventListener('click', () => goTo(+dot.dataset.chapter));
});
