// Toggle menú móvil
document.querySelector('[data-menu-toggle]')?.addEventListener('click', () => {
  document.querySelector('.menu')?.classList.toggle('is-open');
}, { passive:true });

// Cerrar menú al elegir una opción (móvil)
document.querySelectorAll('.menu a').forEach(a =>
  a.addEventListener('click', () => document.querySelector('.menu')?.classList.remove('is-open'))
);

// Marcar enlace activo según URL
(() => {
  const path = location.pathname.replace(/\/+$/, '');
  document.querySelectorAll('.menu a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/+$/, '');
    if (href && path.endsWith(href)) a.setAttribute('aria-current', 'page');
  });
})();
