// Lightweight accessible lightbox for the gallery
document.addEventListener('DOMContentLoaded', () => {
  const thumbs = Array.from(document.querySelectorAll('.thumb'));
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox.querySelector('.lb-content img');
  const lbCaption = lightbox.querySelector('.lb-caption');
  const btnClose = lightbox.querySelector('.lb-close');
  const btnPrev = lightbox.querySelector('.lb-prev');
  const btnNext = lightbox.querySelector('.lb-next');
  let current = -1;

  const images = thumbs.map(t => {
    const img = t.querySelector('img');
    return {src: img.src, alt: img.alt, caption: t.closest('figure')?.querySelector('figcaption')?.textContent || ''};
  });

  function open(index){
    current = index;
    const it = images[index];
    lbImg.src = it.src;
    lbImg.alt = it.alt;
    lbCaption.textContent = it.caption;
    lightbox.setAttribute('aria-hidden', 'false');
    btnClose.focus();
  }

  function close(){
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    const thumb = thumbs[current];
    if (thumb) thumb.focus();
    current = -1;
  }

  function prev(){
    if (current > 0) open(current - 1);
    else open(images.length - 1);
  }

  function next(){
    if (current < images.length - 1) open(current + 1);
    else open(0);
  }

  thumbs.forEach((btn, i) => btn.addEventListener('click', () => open(i)));
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false'){
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
  });
});
