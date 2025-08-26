/* Listado simple de posts con filtro por categoría y búsqueda */
(function(){
  const POSTS = [
    {id:1, title:'Cómo proteger tus cartas: guía de fundas y top loaders', cat:'guias',
      date:'2025-08-12', img:'images/blog/guide-sleeves.jpg',
      excerpt:'Consejos para escoger la protección correcta según el tipo de carta, grosor y uso competitivo.'},
    {id:2, title:'Boosters vs. Caja: ¿qué conviene más?', cat:'reseñas',
      date:'2025-08-08', img:'images/blog/boosters-vs-box.jpg',
      excerpt:'Hablamos de probabilidades y del valor esperado según formato, edición y objetivos del jugador.'},
    {id:3, title:'Nuevas preventas y reposiciones', cat:'noticias',
      date:'2025-08-15', img:'images/blog/restocks.jpg',
      excerpt:'Fechas clave, cantidades y cómo asegurar tu producto a tiempo.'}
  ];

  const grid = document.getElementById('post-grid');
  const bq   = document.getElementById('bq');
  const bcat = document.getElementById('bcat');

  function escapeHtml(s){ return s.replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

  function renderCard(p){
    const img = p.img ? `<img src="${p.img}" alt="${escapeHtml(p.title)}" onerror="this.style.display='none'">` : '';
    const date = new Date(p.date).toLocaleDateString('es-CO', {year:'numeric', month:'short', day:'2-digit'});
    const label = p.cat==='guias'?'Guía':p.cat==='reseñas'?'Reseña':'Noticia';
    return `
      <article class="p-card">
        <div class="p-thumb">${img}</div>
        <div class="p-body">
          <div class="p-title">${escapeHtml(p.title)}</div>
          <div class="p-meta">${label} · ${date}</div>
          <p class="muted">${escapeHtml(p.excerpt)}</p>
          <a class="p-more" href="#">Leer más →</a>
        </div>
      </article>
    `;
  }

  function apply(){
    const q = (bq.value||'').toLowerCase();
    const c = bcat.value;
    let list = POSTS.slice();
    if (q) list = list.filter(x => x.title.toLowerCase().includes(q) || x.excerpt.toLowerCase().includes(q));
    if (c!=='all') list = list.filter(x => x.cat===c);
    list.sort((a,b)=> new Date(b.date)-new Date(a.date));
    grid.innerHTML = list.map(renderCard).join('') || `<div class="muted">Sin posts por ahora.</div>`;
  }

  bq.addEventListener('input', apply);
  bcat.addEventListener('change', apply);
  apply();
})();
