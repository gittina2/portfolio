// Main UI scripts: mobile nav toggle and accessible helpers

// Dev cache-bust: append a timestamp query to `style.css` so browsers fetch the latest file.
(() => {
  try {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .filter(l => l.href && l.getAttribute('href').includes('style.css'));
    links.forEach(link => {
      const href = link.getAttribute('href');
      const sep = href.indexOf('?') === -1 ? '?' : '&';
      link.setAttribute('href', href + sep + 'v=' + Date.now());
    });
  } catch (e) {
    // no-op if DOM isn't ready or in non-browser environments
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const open = primaryNav.getAttribute('data-open') === 'true';
      primaryNav.setAttribute('data-open', String(!open));
      navToggle.setAttribute('aria-expanded', String(!open));
    });
  }

  // Improve keyboard navigation for gallery buttons: allow Enter/Space on thumbs
  document.querySelectorAll('.thumb').forEach(btn => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
});
