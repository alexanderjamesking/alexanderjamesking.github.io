(function () {
  const root = document.documentElement;

  try {
    const stored = localStorage.getItem('ajk.theme');
    if (stored) root.dataset.theme = stored;
    else root.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (e) { root.dataset.theme = 'light'; }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('ajk.theme', root.dataset.theme); } catch(e) {}
    });
  });
})();
