/* Shared site behavior: theme toggle, tweaks, masthead injection */
(function () {
  const root = document.documentElement;

  // ---- Theme ----
  try {
    const stored = localStorage.getItem('ajk.theme');
    if (stored) root.dataset.theme = stored;
    else root.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (e) { root.dataset.theme = 'light'; }

  function bindToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('ajk.theme', root.dataset.theme); } catch(e) {}
    });
  }

  // ---- Tweaks ----
  const defaults = { fonts: 'serif', density: 'airy', accent: 'none', blog: 'excerpts', layout: 'index' };
  function readTweaks() {
    try {
      const s = localStorage.getItem('ajk.tweaks');
      if (s) return Object.assign({}, defaults, JSON.parse(s));
    } catch(e) {}
    return Object.assign({}, defaults);
  }
  function writeTweaks(t) { try { localStorage.setItem('ajk.tweaks', JSON.stringify(t)); } catch(e) {} }

  const tweaks = readTweaks();

  function applyOne(k, v) {
    if (k === 'fonts')   root.dataset.fonts   = v === 'serif' ? '' : v;
    if (k === 'density') root.dataset.density = v === 'airy' ? '' : v;
    if (k === 'accent')  root.dataset.accent  = v === 'none' ? '' : v;
    if (k === 'blog')    root.dataset.blog    = v === 'excerpts' ? '' : v;
    if (k === 'layout')  root.dataset.layout  = v === 'index' ? '' : v;
    document.querySelectorAll(`.seg[data-key="${k}"] button`).forEach(b => {
      b.classList.toggle('sel', b.dataset.val === v);
    });
  }
  Object.entries(tweaks).forEach(([k, v]) => applyOne(k, v));

  function bindTweaks() {
    document.querySelectorAll('.tweaks .seg').forEach(seg => {
      const k = seg.dataset.key;
      seg.querySelectorAll('button').forEach(b => {
        b.addEventListener('click', () => {
          tweaks[k] = b.dataset.val;
          applyOne(k, b.dataset.val);
          writeTweaks(tweaks);
          try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: b.dataset.val } }, '*'); } catch(e) {}
        });
      });
    });
  }

  // Edit-mode contract
  window.addEventListener('message', (e) => {
    const d = e.data;
    if (!d || typeof d !== 'object') return;
    if (d.type === '__activate_edit_mode') {
      const el = document.getElementById('tweaks');
      if (el) el.classList.add('on');
    }
    if (d.type === '__deactivate_edit_mode') {
      const el = document.getElementById('tweaks');
      if (el) el.classList.remove('on');
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    bindToggle();
    bindTweaks();
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(e) {}
  });
})();
