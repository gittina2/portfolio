document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const themeToggle = document.querySelector('.theme-toggle');
  const themeMenu = document.querySelector('.theme-menu');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const open = primaryNav.getAttribute('data-open') === 'true';
      primaryNav.setAttribute('data-open', String(!open));
      navToggle.setAttribute('aria-expanded', String(!open));
    });
  }

  // Theme dropdown menu toggle
  if (themeToggle && themeMenu) {
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = themeMenu.getAttribute('data-open') === 'true';
      themeMenu.setAttribute('data-open', String(!isOpen));
      themeToggle.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close theme menu when a link is clicked
    document.querySelectorAll('.theme-menu a').forEach(link => {
      link.addEventListener('click', () => {
        themeMenu.setAttribute('data-open', 'false');
        themeToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close theme menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!themeToggle.contains(e.target) && !themeMenu.contains(e.target)) {
        themeMenu.setAttribute('data-open', 'false');
        themeToggle.setAttribute('aria-expanded', 'false');
      }
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
