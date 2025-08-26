/* Catálogo con búsqueda, filtros, orden, paginación y carrito */
(function(){
  // === DATA =============================================================
  const PRODUCTS = [
    {id:1,  name:'Carta suelta Rare Holográfica',  price:25000,  cat:'singles',     img:'images/catalogo/img.1.jpg', stock:6,  created:'2025-08-01'},
    {id:2,  name:'Booster Pack – Set X',           price:18000,  cat:'boosters',    img:'images/catalogo/img.2.jpg', stock:24, created:'2025-08-10'},
    {id:3,  name:'Sobre Display – Set X (24u)',    price:420000, cat:'boosters',    img:'images/catalogo/img.3.jpg', stock:3,  created:'2025-07-30'},
    {id:4,  name:'Fundas Pro Matte (100u)',        price:38000,  cat:'accessories', img:'',                           stock:15, created:'2025-07-18'},
    {id:5,  name:'Top Loader Ultra Clear (25u)',   price:26000,  cat:'accessories', img:'',                           stock:20, created:'2025-07-22'},
    {id:6,  name:'Carta suelta Mítica',            price:120000, cat:'singles',     img:'',                           stock:1,  created:'2025-08-15'},
    {id:7,  name:'Carta suelta Común',             price:3000,   cat:'singles',     img:'',                           stock:40, created:'2025-06-12'},
    {id:8,  name:'Deck de Inicio',                 price:89000,  cat:'boosters',    img:'',                           stock:8,  created:'2025-08-11'},
    {id:9,  name:'Álbum 9-pocket (negro)',         price:69000,  cat:'accessories', img:'',                           stock:5,  created:'2025-07-09'},
    {id:10, name:'Carta suelta Rare',              price:12000,  cat:'singles',     img:'',                           stock:20, created:'2025-08-14'},
  ];

  // === ELEMENTOS ========================================================
  const grid   = document.getElementById('grid');
  const q      = document.getElementById('q');
  const catSel = document.getElementById('category');
  const sort   = document.getElementById('sort');
  const stat   = document.getElementById('results-count');
  const chips  = document.getElementById('active-filters');
  const pag    = document.getElementById('pagination');

  const cartHero = document.getElementById('cart-hero');
  const btnKeep  = document.getElementById('btn-keep-shopping');

  // === ESTADO ===========================================================
  let state = { q:'', cat:'all', sort:'relevance', page:1, perPage:8 };

  // === HELPERS ==========================================================
  function format(n){ return n.toLocaleString('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}); }
  function labelCat(c){ return c==='singles'?'Cartas': c==='boosters'?'Boosters':'Accesorios'; }
  function escapeHtml(s){ return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  window.makePh = (label)=>{ const s=document.createElement('div');
    Object.assign(s.style,{width:'100%',height:'100%',display:'grid',placeItems:'center',color:'#cbd0ff',fontWeight:'700',background:'linear-gradient(135deg,#161823,#0f0f14)'}); s.textContent=label||'Sin imagen'; return s; };
  function toast(msg){ let t=document.getElementById('toast'); if(!t){ t=document.createElement('div'); t.id='toast';
      Object.assign(t.style,{position:'fixed',left:'50%',bottom:'24px',transform:'translateX(-50%)',background:'#111',color:'#fff',padding:'10px 14px',borderRadius:'12px',zIndex:'9999',boxShadow:'0 10px 30px rgba(0,0,0,.25)'}); document.body.appendChild(t);}
    t.textContent=msg; t.style.opacity='1'; clearTimeout(window.__t); window.__t=setTimeout(()=>{t.style.opacity='0'},1600); }

  // === CARRITO (localStorage) ==========================================
  const KEY='mc_cart';
  function getCart(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch{ return []; } }
  function setCart(c){ localStorage.setItem(KEY, JSON.stringify(c)); }
  function addToCart(prod){
    const cart = getCart();
    const found = cart.find(i=>i.id===prod.id);
    if(found){ found.qty += 1; } else { cart.push({id:prod.id, name:prod.name, price:prod.price, qty:1}); }
    setCart(cart);
    updateCartHero();
    toast(`Añadido: ${prod.name}`);
  }
  function updateCartHero(){
    if(!cartHero) return;
    const hasItems = getCart().length > 0;
    cartHero.classList.toggle('hidden', hasItems); // si hay items => ocultar hero
  }

  // === RENDER ===========================================================
  function apply(){
    let list = PRODUCTS.slice();

    if (state.q){
      const s = state.q.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(s));
    }
    if (state.cat!=='all'){ list = list.filter(p => p.cat===state.cat); }

    switch(state.sort){
      case 'price-asc':  list.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
      case 'new':        list.sort((a,b)=>new Date(b.created)-new Date(a.created)); break;
      default: break;
    }

    const total = list.length;
    stat.textContent = `${total} producto${total!==1?'s':''}`;
    chips.innerHTML = renderChips();

    const pages = Math.max(1, Math.ceil(total/state.perPage));
    if (state.page>pages) state.page=pages;
    const start = (state.page-1)*state.perPage;
    const pageItems = list.slice(start, start+state.perPage);

    grid.innerHTML = pageItems.map(renderCard).join('') || `<div class="muted">Sin resultados.</div>`;
    pag.innerHTML = renderPagination(pages);
    attachEvents();
  }

  function renderChips(){
    const c=[];
    if (state.q)   c.push(`<button class="pill" data-x="q">Buscar: “${escapeHtml(state.q)}” ✕</button>`);
    if (state.cat!=='all'){
      const map={singles:'Cartas individuales',boosters:'Sellos y boosters',accessories:'Accesorios'};
      c.push(`<button class="pill" data-x="cat">${map[state.cat]} ✕</button>`);
    }
    return c.join('');
  }

  function renderCard(p){
    const hasImg = !!(p.img && p.img.trim());
    const img = hasImg
      ? `<img src="${p.img}" alt="${escapeHtml(p.name)}" onerror="this.replaceWith(makePh('${escapeHtml(p.name)}'))">`
      : `<span>${escapeHtml(p.name)}</span>`;
    return `
      <article class="card" data-id="${p.id}">
        <div class="thumb">${img}</div>
        <div class="meta">
          <div class="title">${escapeHtml(p.name)}</div>
          <div class="row">
            <div>
              <div class="price">${format(p.price)}</div>
              <div class="muted">${labelCat(p.cat)} · Stock: ${p.stock}</div>
            </div>
            <button class="btn add" ${p.stock===0?'disabled':''}>Agregar</button>
          </div>
        </div>
      </article>`;
  }

  function renderPagination(pages){
    if (pages<=1) return '';
    let html=''; for(let i=1;i<=pages;i++){
      html+=`<button data-p="${i}" ${i===state.page?'style="background:#111;color:#fff"':''}>${i}</button>`;
    } return html;
  }

  function attachEvents(){
    grid.querySelectorAll('.add').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const id = Number(e.currentTarget.closest('.card').dataset.id);
        const prod = PRODUCTS.find(x=>x.id===id);
        if (!prod) return;
        addToCart(prod);
      });
    });
    pag.querySelectorAll('button[data-p]').forEach(b=>{
      b.addEventListener('click', ()=>{ state.page=Number(b.dataset.p); apply(); window.scrollTo({top:0,behavior:'smooth'}); });
    });
    chips.querySelectorAll('button[data-x]').forEach(b=>{
      const k=b.dataset.x; b.addEventListener('click', ()=>{ if(k==='q')state.q=''; if(k==='cat')state.cat='all'; state.page=1; apply(); });
    });
  }

  // Inputs
  q.addEventListener('input', e=>{ state.q=e.target.value.trim(); state.page=1; apply(); });
  catSel.addEventListener('change', e=>{ state.cat=e.target.value; state.page=1; apply(); });
  sort.addEventListener('change', e=>{ state.sort=e.target.value; state.page=1; apply(); });

  // CTA "Seguir comprando"
  if(btnKeep){
    btnKeep.addEventListener('click', ()=>{
      document.getElementById('grid')?.scrollIntoView({behavior:'smooth', block:'start'});
    });
  }

  // Init
  apply();
  updateCartHero();
})();
