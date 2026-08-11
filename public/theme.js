const toggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Load saved preference, or fall back to OS setting
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initial = saved || (prefersDark ? 'dark' : 'light');
root.setAttribute('data-theme', initial);
toggle.textContent = initial === 'dark' ? '☀️' : '🌙';

toggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  toggle.textContent = next === 'dark' ? '☀️' : '🌙';
});
