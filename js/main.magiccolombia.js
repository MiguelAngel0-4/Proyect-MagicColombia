/* =========  MAIN SITE ENHANCEMENTS ========= */
(() => {
  // Helpers
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  // -------------------------
  // Preloader (spinner CSS)
  // -------------------------
  const preloader = $('#preloader');

  function hidePreloader(reason = 'load') {
    preloader?.classList.add('is-hidden');
    document.body.classList.add('is-ready');
  }

  on(window, 'load', () => hidePreloader('window:load'));
  setTimeout(() => hidePreloader('timer:4.5s'), 4500);

  // -------------------------
  // Burger / menú
  // -------------------------
  const menuToggle  = document.querySelector('[data-menu-toggle]');
  const primaryMenu = document.getElementById('primary-menu');
  if (menuToggle && primaryMenu) {
    on(menuToggle, 'click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      primaryMenu.classList.toggle('is-open', !expanded);
    });
  }

  // -------------------------
  // Smooth scroll para #anclas
  // -------------------------
  $$('a[href^="#"]').forEach(a => {
    on(a, 'click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', `#${id}`);
      }
    });
  });

  // -------------------------
  // Año en el footer
  // -------------------------
  const yearEl = $('#current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
