/* Lee ?id=, pinta el detalle, bloquea compra si está agotado, tabs y relacionados */
(function(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const money = n => Number(n).toLocaleString('es-CO');

  const $img   = document.getElementById('pImage');
  const $badge = document.getElementById('pStockBadge');
  const $thumbs= document.getElementById('pThumbs');
  const $name  = document.getElementById('pName');
  const $price = document.getElementById('pPrice');
  const $cat   = document.getElementById('pCategory');
  const $desc  = document.getElementById('tab-desc');
  const $specs = document.getElementById('tab-specs');
  const $ship  = document.getElementById('tab-ship');
  const $qty   = document.getElementById('qty');
  const $add   = document.getElementById('addToCart');
  const $buy   = document.getElementById('buyNow');
  const $related = document.getElementById('related');

  const all = (window.PRODUCTS || []);
  const p = all.find(x => String(x.id) === String(id));

  if (!p) {
    $name.textContent = "Producto no encontrado";
    $price.textContent = "";
    $img.alt = "No disponible";
    $img.style.display = "none";
    return;
  }

  // Datos básicos
  $name.textContent = p.name;
  const onSale = p.compareAtPrice && p.compareAtPrice > p.price;
  const pct = onSale ? Math.max(0, Math.round((1 - (p.price / p.compareAtPrice)) * 100)) : 0;
  $price.innerHTML = onSale
    ? `<span style="color:#9ca3af;text-decoration:line-through;margin-right:6px">$ ${money(p.compareAtPrice)}</span>
       $ ${money(p.price)} <span class="cur">COP</span>
       <span style="color:#059669;font-weight:700;margin-left:6px">−${pct}%</span>`
    : `$ ${money(p.price)} <span class="cur">COP</span>`;
  $cat.textContent = (p.category || "").toUpperCase();

  // Stock badge + estado de botones
  const inStock = (p.stock == null) ? true : Number(p.stock) > 0;
  $badge.textContent = inStock ? "Disponible" : "Agotado";
  $badge.className = `p-badge ${inStock ? 'ok' : 'out'}`;
  $add.disabled = !inStock;
  $buy.disabled = !inStock;

  // Imagen principal y galería
  const images = (p.images && p.images.length) ? p.images : [p.img];
  function show(idx){
    const src = images[idx] || images[0];
    $img.src = src;
    $img.alt = p.name;
    [...$thumbs.querySelectorAll('button')].forEach((b,i)=>b.classList.toggle('active', i===idx));
  }
  $thumbs.innerHTML = images.map((src,i)=>`
    <button type="button" class="${i===0?'active':''}">
      <img src="${src}" alt="Vista ${i+1} de ${p.name}">
    </button>`).join('');
  [...$thumbs.querySelectorAll('button')].forEach((b,i)=>b.addEventListener('click',()=>show(i)));
  show(0);

  // Descripción / specs / shipping
  if (p.descriptionHTML) $desc.innerHTML = p.descriptionHTML;
  else $desc.textContent = p.description || "Sin descripción.";
  $specs.innerHTML = (p.specs && p.specs.length)
    ? `<ul>${p.specs.map(s => `<li>${s}</li>`).join("")}</ul>` : "—";
  $ship.textContent = p.shipping || "Verifica tiempos de envío al finalizar la compra.";

  // Tabs
  const tabs = [...document.querySelectorAll('.tab')];
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  // Acciones (demo)
  $add.addEventListener('click', () => {
    const q = Math.max(1, Number($qty.value||1));
    alert(`Añadido al carrito: ${p.name} × ${q}`);
  });
  $buy.addEventListener('click', () => {
    const q = Math.max(1, Number($qty.value||1));
    alert(`Comprar ahora: ${p.name} × ${q} (demo)`);
  });

  // Relacionados
  const related = all.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  $related.innerHTML = related.map(r => `
    <li>
      <a class="fc-card" href="producto.html?id=${encodeURIComponent(r.id)}" aria-label="${r.name}">
        <img src="${(r.images && r.images[0]) || r.img}" alt="${r.name}" loading="lazy" width="600" height="440">
        <div class="fc-info">
          <h3 class="fc-title">${r.name}</h3>
          <span class="fc-price">$ ${money(r.price)} <span class="cur">COP</span></span>
        </div>
      </a>
    </li>
  `).join("");
})();

