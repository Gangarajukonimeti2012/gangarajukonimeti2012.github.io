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
  'bronze -> silver -> gold',
  'databricks | fabric | power bi',
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

document.getElementById('year').textContent = new Date().getFullYear();
