const gallery = document.getElementById('gallery-grid');
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('.lb-content img');
const lbCaption = lightbox.querySelector('.lb-caption');
const btnClose = lightbox.querySelector('.lb-close');
const btnPrev = lightbox.querySelector('.lb-prev');
const btnNext = lightbox.querySelector('.lb-next');
let current = 0;
let links = [];

function show(index) {
  const idx = (index + links.length) % links.length;
  const item = links[idx];
  if (!item) return;

  lbImg.src = item.href;
  lbImg.alt = item.querySelector('img')?.alt || '';
  lbCaption.textContent = item.dataset.caption || '';
  current = idx;

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function close() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lbImg.src = '';
  lbCaption.textContent = '';
  document.body.style.overflow = '';
}

// delegazione: cattura click su qualsiasi <a> dentro gallery
gallery.addEventListener('click', e => {
  const link = e.target.closest('a');
  if (!link) return;
  e.preventDefault();

  links = Array.from(gallery.querySelectorAll('a'));
  const index = links.indexOf(link);
  show(index);
});

// pulsanti
btnClose.addEventListener('click', close);
btnPrev.addEventListener('click', () => show(current - 1));
btnNext.addEventListener('click', () => show(current + 1));

// click fuori immagine chiude
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) close();
});

// tastiera
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') close();
  else if (e.key === 'ArrowLeft') show(current - 1);
  else if (e.key === 'ArrowRight') show(current + 1);
});

const params = new URLSearchParams(window.location.search);
const album = params.get('album') || 'BN_edi';

fetch(`/api/album/${album}`)
  .then(res => res.json())
  .then(images => {
    gallery.innerHTML = images.map(img => `
      <a href="${img.url}" data-caption="${img.name}">
        <img src="${img.url}" alt="${img.name}" loading="lazy">
      </a>
    `).join('');
  });