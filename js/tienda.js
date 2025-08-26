(() => {
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ========= Datos =========
  // products.lanzamiento.js concatena en window.PRODUCTS
  const SOURCE = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];

  // ========= Config =========
  const PAGE_SIZE = 12;

  // ========= Estado / Filtros =========
  const state = {
    q: "",
    sort: "name-asc",
    onlyInStock: false,
    category: "all",      // 'all' | 'boardgame' | 'TCG / Cartas' | 'Accesorios'
    tag: null,            // p.e. 'lanzamiento'
    min: null,
    max: null,
    density: "standard",  // compact | standard | roomy
    page: 1,
  };

  // ========= Helpers =========
  const fmt = (n) => n.toLocaleString("es-CO", { minimumFractionDigits: 0 });

  const bySort = {
    "name-asc":  (a, b) => a.name.localeCompare(b.name),
    "name-desc": (a, b) => b.name.localeCompare(a.name),
    "price-asc": (a, b) => (a.price ?? 0) - (b.price ?? 0),
    "price-desc":(a, b) => (b.price ?? 0) - (a.price ?? 0),
  };

  const parseNum = v => {
    const n = Number(String(v).replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : null;
  };

  const passes = (p) => {
    if (state.onlyInStock && (!p.stock || p.stock <= 0)) return false;

    if (state.category !== "all") {
      const cat = String(p.category || "").toLowerCase();
      const wanted = String(state.category).toLowerCase();
      if (!cat.includes(wanted)) return false;
    }

    if (state.tag) {
      const tags = (p.tags || []).map(t => String(t).toLowerCase());
      if (!tags.includes(String(state.tag).toLowerCase())) return false;
    }

    if (state.q) {
      const q = state.q.toLowerCase();
      const hay = (p.name || "").toLowerCase().includes(q) ||
                  (p.vendor || "").toLowerCase().includes(q);
      if (!hay) return false;
    }

    if (state.min != null && p.price < state.min) return false;
    if (state.max != null && p.price > state.max) return false;
    return true;
  };

  // --------- URL helpers (deep links) ---------
  const buildQuery = (overrides = {}) => {
    const s = { ...state, ...overrides };
    const qs = new URLSearchParams();
    if (s.q) qs.set("q", s.q);
    if (s.sort && s.sort !== "name-asc") qs.set("sort", s.sort);
    if (s.onlyInStock) qs.set("stock", "1");
    if (s.category !== "all") qs.set("cat", s.category);
    if (s.tag) qs.set("tag", s.tag);
    if (s.min != null) qs.set("min", String(s.min));
    if (s.max != null) qs.set("max", String(s.max));
    if (s.density !== "standard") qs.set("density", s.density);
    if (s.page && s.page > 1) qs.set("page", String(s.page));
    return qs.toString();
  };

  const updateURL = () => {
    const qs = buildQuery();
    const hash = "#product-grid";
    const newUrl = qs ? `?${qs}${hash}` : hash;
    history.replaceState(null, "", newUrl);
  };

  // ========= Render =========
  const $grid  = $("#product-grid");
  const $count = $("#count");
  const $pager = $("#pager");

  const card = (p) => {
    const oos   = !p.stock || p.stock <= 0;
    const offer = Number.isFinite(p.compareAtPrice) && p.compareAtPrice > p.price;

    return `
<li>
  <a class="fc-card ${oos ? "is-out" : ""}" href="producto.html?id=${encodeURIComponent(p.id)}" aria-label="${p.name}">
    <img src="${p.img}" alt="${p.name}">
    ${oos ? `<span class="fc-badge out">Agotado</span>` : ""}
    <div class="fc-info">
      <h3 class="fc-title">${p.name}</h3>
      <div class="fc-price">
        ${offer
          ? `<span class="price-old">$ ${fmt(p.compareAtPrice)}</span> <span class="price">$ ${fmt(p.price)}</span>`
          : `<span class="price">$ ${fmt(p.price)}</span>`}
      </div>
    </div>
  </a>
</li>`;
  };

  const renderPager = (total, page, perPage) => {
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    if (totalPages <= 1) {
      $pager.innerHTML = "";
      return;
    }

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    page = clamp(page, 1, totalPages);

    const linkTo = (n, label = n, cls = "") => {
      const qs = buildQuery({ page: n });
      const href = qs ? `tienda.html?${qs}#product-grid` : `tienda.html#product-grid`;
      return `<a class="page ${cls}" href="${href}" ${n === page ? 'aria-current="page"' : ""}>${label}</a>`;
    };

    const parts = [];
    // «Anterior»
    parts.push(linkTo(Math.max(1, page - 1), "‹", "prev" + (page === 1 ? " is-disabled" : "")));

    // Ventana numerada con elipsis
    const totalSpan = 5;
    let start = Math.max(1, page - 2);
    let end   = Math.min(totalPages, page + 2);

    if (start > 1) {
      parts.push(linkTo(1, 1));
      if (start > 2) parts.push(`<span class="page gap">…</span>`);
    }

    for (let i = start; i <= end; i++) {
      parts.push(linkTo(i, i, i === page ? "is-active" : ""));
    }

    if (end < totalPages) {
      if (end < totalPages - 1) parts.push(`<span class="page gap">…</span>`);
      parts.push(linkTo(totalPages, totalPages));
    }

    // «Siguiente»
    parts.push(linkTo(Math.min(totalPages, page + 1), "›", "next" + (page === totalPages ? " is-disabled" : "")));

    $pager.innerHTML = parts.join("");
  };

  const render = () => {
    const filtered = SOURCE.filter(passes).sort(bySort[state.sort]);

    // Paginación
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    state.page = Math.max(1, Math.min(state.page, totalPages));

    const start = (state.page - 1) * PAGE_SIZE;
    const end   = start + PAGE_SIZE;
    const pageItems = filtered.slice(start, end);

    $grid.innerHTML = pageItems.map(card).join("");
    $count && ($count.textContent = String(pageItems.length));
    renderPager(total, state.page, PAGE_SIZE);

    updateURL(); // deep link
  };

  // ========= UI bindings =========
  $("#q").addEventListener("input", e => { state.q = e.target.value.trim(); state.page = 1; render(); });
  $("#sort").addEventListener("change", e => { state.sort = e.target.value; state.page = 1; render(); });

  $$(".chip[data-cat]").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".chip[data-cat]").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.category = btn.dataset.cat;
      state.page = 1;
      render();
    });
  });

  $$(".chip[data-tag]").forEach(btn => {
    btn.addEventListener("click", () => {
      const active = !btn.classList.contains("is-active");
      $$(".chip[data-tag]").forEach(b => b.classList.remove("is-active"));
      if (active) { btn.classList.add("is-active"); state.tag = btn.dataset.tag; }
      else { state.tag = null; }
      state.page = 1;
      render();
    });
  });

  $("#onlyInStock").addEventListener("change", e => {
    state.onlyInStock = e.target.checked;
    state.page = 1;
    render();
  });

  $("#minPrice").addEventListener("input", e => { state.min = parseNum(e.target.value); state.page = 1; render(); });
  $("#maxPrice").addEventListener("input", e => { state.max = parseNum(e.target.value); state.page = 1; render(); });

  const setDensity = (key) => {
    state.density = key;
    document.body.classList.remove("density-compact", "density-roomy");
    if (key === "compact") document.body.classList.add("density-compact");
    if (key === "roomy")   document.body.classList.add("density-roomy");
    $("#densCompact").classList.toggle("is-active", key === "compact");
    $("#densStandard").classList.toggle("is-active", key === "standard");
    $("#densRoomy").classList.toggle("is-active", key === "roomy");
    updateURL();
  };
  $("#densCompact").addEventListener("click", () => setDensity("compact"));
  $("#densStandard").addEventListener("click", () => setDensity("standard"));
  $("#densRoomy").addEventListener("click", () => setDensity("roomy"));

  $("#clear").addEventListener("click", () => {
    state.q = ""; $("#q").value = "";
    state.sort = "name-asc"; $("#sort").value = "name-asc";
    state.onlyInStock = false; $("#onlyInStock").checked = false;
    state.category = "all";
    state.tag = null;
    state.min = state.max = null; $("#minPrice").value = ""; $("#maxPrice").value = "";
    state.page = 1;

    $$(".chip[data-cat]").forEach(b => b.classList.toggle("is-active", b.dataset.cat === "all"));
    $$(".chip[data-tag]").forEach(b => b.classList.remove("is-active"));
    setDensity("standard");
    render();
  });

  // --------- Inicializar desde la URL ---------
  const initFromURL = () => {
    const params = new URLSearchParams(location.search);

    if (params.has("q"))   { state.q = params.get("q"); $("#q").value = state.q; }
    if (params.has("sort")){ state.sort = params.get("sort"); $("#sort").value = state.sort; }
    if (params.has("stock")){
      state.onlyInStock = /^(1|true)$/i.test(params.get("stock"));
      $("#onlyInStock").checked = state.onlyInStock;
    }
    if (params.has("cat")) {
      state.category = params.get("cat");
      $$(".chip[data-cat]").forEach(b => b.classList.toggle("is-active", b.dataset.cat === state.category));
    }
    if (params.has("tag")) {
      state.tag = params.get("tag");
      $$(".chip[data-tag]").forEach(b => b.classList.toggle("is-active", b.dataset.tag === state.tag));
    }
    if (params.has("min")) { state.min = parseNum(params.get("min")); $("#minPrice").value = state.min ?? ""; }
    if (params.has("max")) { state.max = parseNum(params.get("max")); $("#maxPrice").value = state.max ?? ""; }
    if (params.has("density")) {
      const d = params.get("density");
      if (["compact","standard","roomy"].includes(d)) state.density = d;
    }
    if (params.has("page")) {
      const p = parseInt(params.get("page"), 10);
      if (Number.isFinite(p) && p >= 1) state.page = p;
    }
  };

  // inicio
  initFromURL();
  setDensity(state.density);
  render();
})();
