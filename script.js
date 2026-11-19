// Theme toggle
const root = document.documentElement;
document.getElementById('themeToggle').addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Mobile menu
const navLinks = document.getElementById('navLinks');
document.getElementById('menuBtn').addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Nav border on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

// Typing effect
const phrases = [
  'SELECT insights FROM raw_data;',
  'CALCULATE([Total Sales], DATESYTD(dim_date[date]))',
  'bronze -> silver -> gold -> power bi',
  'validate(source) == report',
];
const typed = document.getElementById('typed');
let p = 0, c = 0, deleting = false;
function tick() {
  const word = phrases[p];
  typed.textContent = word.slice(0, c);
  if (!deleting && c < word.length) { c++; setTimeout(tick, 60); }
  else if (!deleting) { deleting = true; setTimeout(tick, 1600); }
  else if (c > 0) { c--; setTimeout(tick, 30); }
  else { deleting = false; p = (p + 1) % phrases.length; setTimeout(tick, 300); }
}
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) typed.textContent = phrases[0];
else tick();

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Project filters
document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#filters button').forEach(b => b.classList.toggle('active', b === btn));
  const f = btn.dataset.filter;
  document.querySelectorAll('.project').forEach(card => {
    card.classList.toggle('hidden', f !== 'all' && !card.dataset.cat.split(' ').includes(f));
  });
});

// 3D tilt on the avatar card
(function () {
  const card = document.getElementById('avatarCard');
  if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.02)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
})();

// Animated data-network background
(function () {
  const canvas = document.getElementById('network');
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LINK = 140, MOUSE = 180;
  let w, h, dpr, nodes = [], mouse = { x: -9999, y: -9999 }, rgb = '34, 211, 238';

  function readColor() {
    rgb = getComputedStyle(root).getPropertyValue('--net-dot').trim() || rgb;
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(90, Math.max(30, (w * h) / 16000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.8,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      if (!reduce) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
        if (d < MOUSE && d > 1) { n.x += dx / d * 0.25; n.y += dy / d * 0.25; }
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(${rgb}, ${0.18 * (1 - d / LINK)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (md < MOUSE) {
        ctx.strokeStyle = `rgba(${rgb}, ${0.35 * (1 - md / MOUSE)})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = `rgba(${rgb}, 0.55)`;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduce && !document.hidden) requestAnimationFrame(draw);
  }
  readColor(); resize(); draw();
  window.addEventListener('resize', () => { resize(); if (reduce) draw(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('mouseout', () => { mouse.x = mouse.y = -9999; });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduce) draw(); });
  new MutationObserver(() => { readColor(); if (reduce) draw(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
})();

document.getElementById('year').textContent = new Date().getFullYear();
