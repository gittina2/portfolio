
const CLOUD_BASE = "https://res.cloudinary.com/dqyfoxlko/image/upload/v1771944556/";
const FOLDER = "BN_edi/";

// Dynamically generate gallery grid

const images = [
  `${CLOUD_BASE}w_300,q_auto,f_auto/bn_18_tk715v.jpg`,
  `${CLOUD_BASE}w_300,q_auto,f_auto/bn_17_pr0mpf.jpg`
];

const galleryGrid = document.querySelector('.gallery-grid');
if (galleryGrid) {
  let html = '';
  images.forEach((url, i) => {
    html += `
      <a href="${url}" data-caption="Foto ${i + 1}">
        <img src="${url}" alt="Foto ${i + 1}" loading="lazy" />
      </a>
    `;
  });
  galleryGrid.innerHTML = html;
}

// Lightweight accessible lightbox for the gallery
document.addEventListener('DOMContentLoaded', () => {
  const links = Array.from(document.querySelectorAll('.gallery-grid a'));
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || links.length === 0) return;

  const lbImg = lightbox.querySelector('.lb-content img');
  const lbCaption = lightbox.querySelector('.lb-caption');
  const btnClose = lightbox.querySelector('.lb-close');
  const btnPrev = lightbox.querySelector('.lb-prev');
  const btnNext = lightbox.querySelector('.lb-next');
  let current = 0;
  let lastFocused = null;

  function show(index) {
    const idx = (index + links.length) % links.length;
    const item = links[idx];
    if (!item) return;
    const src = item.getAttribute('href');
    const caption = item.dataset.caption || '';
    const thumb = item.querySelector('img');
    lbImg.src = src;
    lbImg.alt = thumb ? (thumb.alt || '') : '';
    lbCaption.textContent = caption;
    current = idx;
    lastFocused = document.activeElement;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
    // preload prev/next images
    const prevLink = links[(current - 1 + links.length) % links.length];
    const nextLink = links[(current + 1) % links.length];
    [prevLink, nextLink].forEach(l => {
      const p = new Image();
      p.src = l.getAttribute('href');
    });
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    lbCaption.textContent = '';
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function prev() { show(current - 1); }
  function next() { show(current + 1); }

  links.forEach((link, i) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      show(i);
    });
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        show(i);
      }
    });
  });

  btnClose.addEventListener('click', (e) => { e.stopPropagation(); close(); });
  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  // click/tap outside content closes lightbox
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  });

  // simple focus trap inside lightbox while open
  lightbox.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !lightbox.classList.contains('open')) return;
    const focusables = Array.from(lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.hasAttribute('disabled'));
    if (focusables.length === 0) { e.preventDefault(); return; }
    const idx = focusables.indexOf(document.activeElement);
    const dir = e.shiftKey ? -1 : 1;
    e.preventDefault();
    const nextIdx = (idx + dir + focusables.length) % focusables.length;
    focusables[nextIdx].focus();
  });
});