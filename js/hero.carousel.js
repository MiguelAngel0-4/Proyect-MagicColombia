(() => {
  const root = document.querySelector('#heroCarousel');
  if (!root) return;

  const track = root.querySelector('.carousel-track');
  const slides = Array.from(root.querySelectorAll('.slide'));
  const btnPrev = root.querySelector('.prev');
  const btnNext = root.querySelector('.next');
  const dotsBox = root.querySelector('.dots');

  let i = 0, timer;

  const renderDots = () => {
    dotsBox.innerHTML = slides
      .map((_, idx) => `<button class="dot${idx===i?' is-active':''}" aria-label="Ir al slide ${idx+1}"></button>`)
      .join('');
    dotsBox.querySelectorAll('.dot').forEach((b, idx) =>
      b.addEventListener('click', () => { stop(); go(idx); start(); }, { passive:true })
    );
  };

  const go = (idx) => {
    i = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(${-i * 100}%)`;
    renderDots();
  };

  const next = () => go(i + 1);
  const prev = () => go(i - 1);

  const start = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(next, 5000);
  };
  const stop  = () => clearInterval(timer);

  // Controles
  btnNext?.addEventListener('click', () => { stop(); next(); start(); });
  btnPrev?.addEventListener('click', () => { stop(); prev(); start(); });

  // Pausar cuando la pestaña no está visible
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  // Pausar si no está en viewport (cuando hay soporte)
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting ? start() : stop()))
    : null;
  io?.observe(root);

  // Teclado
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { stop(); next(); start(); }
    if (e.key === 'ArrowLeft')  { stop(); prev(); start(); }
  });

  go(0); renderDots(); start();

  // ----- Auto-fit inteligente (menos recortes) -----
  const updateFit = () => {
    const contRect  = root.getBoundingClientRect();
    const contRatio = contRect.width / contRect.height;

    // Margen de tolerancia (10%)
    const TOL = 0.10;

    slides.forEach(slide => {
      const img = slide.querySelector('img');
      if (!img || !img.naturalWidth) return;

      const imgRatio = img.naturalWidth / img.naturalHeight;

      // Si la imagen es "más angosta" que el contenedor de forma apreciable -> contain
      if (imgRatio < contRatio * (1 - TOL)) slide.classList.add('contain');
      else slide.classList.remove('contain');

      // Enfoque opcional por data-focus
      const focus = slide.dataset.focus;
      if (focus) img.style.objectPosition =
        focus === 'left'   ? 'left center'   :
        focus === 'right'  ? 'right center'  :
        focus === 'top'    ? 'center top'    :
        focus === 'bottom' ? 'center bottom' : 'center';
    });
  };

  // Espera a que carguen las imágenes y reevalúa en resize
  const imgs = slides.map(s => s.querySelector('img')).filter(Boolean);
  Promise.all(imgs.map(i => (i.complete ? Promise.resolve() : i.decode().catch(()=>{}))))
    .then(updateFit);

  window.addEventListener('resize', () => {
    clearTimeout(window.__fitT);
    window.__fitT = setTimeout(updateFit, 150);
  });
})();
