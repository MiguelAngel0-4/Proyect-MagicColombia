// js/pokemon.js — MagicColombia (colección Pokémon)

(function () {
  // === MAPA DE DESCRIPCIONES (coherencia sin editar el data) ===
  // clave = título normalizado (minúsculas y sin acentos)
  const DESC_MAP = {
    "pokemon tcg | scarlet & violet 09 journey together | elite trainer box":
      "Caja Elite Trainer de Scarlet & Violet 09 con sobres, fundas, dados y accesorios para jugar y coleccionar.",
    "pokemon tcg | lillie premium tournament collection":
      "Edición Premium de Lillie con cartas promocionales, deck box, fundas y accesorios de torneo.",
    "pokemon tcg | scarlet & violet 09 journey together | booster bundle":
      "Bundle con 6 sobres de Scarlet & Violet 09 para impulsar tu colección.",
    "pokémon tcg | charizard ex special collection":
      "Colección especial Charizard ex con carta promo foil, carta jumbo y sobres temáticos."
  };

  // Normaliza un string (quita acentos/diacríticos y pone minúsculas)
  const norm = (s) =>
    String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const ALL =
    (typeof window !== "undefined" && (window.PRODUCTS || window.products || window.ALL_PRODUCTS)) || [];

  const isPokemon = (p) => {
    const hay = `${p.title || ""} ${p.brand || ""} ${
      Array.isArray(p.tags) ? p.tags.join(" ") : p.tags || ""
    }`;
    return /pok(é|e)mon/i.test(hay);
  };

  const list = ALL.filter(isPokemon).sort((a, b) => {
    const ad = a.featured ? 0 : 1;
    const bd = b.featured ? 0 : 1;
    if (ad !== bd) return ad - bd;
    return (a.title || "").localeCompare(b.title || "");
  });

  const $grid = document.getElementById("pokemon-grid");
  const $count = document.getElementById("pkm-count");

  const money = (v) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(
      Number(v) || 0
    );

  const numberish = (v) => Number(String(v ?? "").replace(/[^\d.-]/g, "")) || 0;

  const getPrice = (p) => numberish(p.price ?? p.precio ?? p.priceNow ?? p.price_now);
  const getLang = (p) => String(p.lang ?? p.language ?? p.idioma ?? "es").toLowerCase().slice(0, 2);
  const getPop = (p) => numberish(p.popularity ?? p.sales ?? p.sold ?? p.vendidos ?? p.rank);

  const isAgotado = (p) => {
    const t = `${p.status || ""} ${p.label || ""} ${
      Array.isArray(p.tags) ? p.tags.join(" ") : p.tags || ""
    } ${p.title || ""}`;
    if (/agotado|sold\s*out/i.test(t)) return true;
    if (p.stock === 0 || p.available === false) return true;
    return false;
  };

  const makeCard = (p) => {
    const href =
      p.url || p.href || `./producto.html?id=${encodeURIComponent(p.id || p.sku || p.slug || p.title || "")}`;

    const $item = document.createElement("article");
    $item.className = "card card-product pkm-card";

    const priceNum = getPrice(p);
    const lang = getLang(p);
    const pop = getPop(p);
    $item.dataset.price = String(priceNum);
    $item.dataset.lang = lang;
    $item.dataset.popularity = String(pop);

    const $media = document.createElement("a");
    $media.className = "card-media";
    $media.href = href;

    const $img = document.createElement("img");
    $img.src = p.img || p.image || p.thumbnail || "";
    $img.alt = p.title || "Producto Pokémon";
    $img.onerror = () => {
      $img.onerror = null;
      $img.src = "../images/pokemon/img.1.png";
    };
    $media.appendChild($img);

    if (isAgotado(p)) {
      const $b = document.createElement("span");
      $b.className = "badge-out";
      $b.textContent = "Agotado";
      $media.appendChild($b);
    }

    const $body = document.createElement("div");
    $body.className = "card-body";

    const $title = document.createElement("h3");
    $title.className = "card-title";
    const $link = document.createElement("a");
    $link.href = href;
    $link.textContent = p.title || "Producto Pokémon";
    $title.appendChild($link);

    // === DESCRIPCIÓN (si existe en el data o en nuestro mapa) ===
    const desc = p.desc || DESC_MAP[norm(p.title)];
    if (desc) {
      const $desc = document.createElement("p");
      $desc.className = "card-desc";
      $desc.textContent = desc;
      $body.appendChild($title);
      $body.appendChild($desc);
    } else {
      $body.appendChild($title);
    }

    const $priceRow = document.createElement("div");
    $priceRow.className = "price-row";
    if (p.priceBefore && p.price && Number(p.priceBefore) > Number(p.price)) {
      const $old = document.createElement("span");
      $old.className = "price-old";
      $old.textContent = money(p.priceBefore);
      $priceRow.appendChild($old);
    }
    const $now = document.createElement("span");
    $now.className = "price-now";
    $now.textContent = money(priceNum);
    $priceRow.appendChild($now);

    $body.appendChild($priceRow);

    $item.appendChild($media);
    $item.appendChild($body);
    return $item;
  };

  if ($grid) {
    $grid.innerHTML = "";
    list.forEach((p) => $grid.appendChild(makeCard(p)));
  }

  if ($count) $count.textContent = String(($grid && $grid.querySelectorAll(".pkm-card").length) || 0);
})();

// ---------- Estado filtros/orden ----------
const PKM_STATE = { price: "all", lang: "all", sort: "bestsellers" };
const moneyToNumber = (n) => Number(String(n).replace(/[^\d]/g, "")) || 0;

// ---------- Aplicar filtros + orden ----------
function applyActiveFilters() {
  const grid = document.getElementById("pokemon-grid");
  const cards = Array.from(grid ? grid.querySelectorAll(".pkm-card, .card-product") : []);
  const countEl = document.getElementById("pkm-count");
  let visible = [];

  cards.forEach((card) => {
    const price = moneyToNumber(card.dataset.price);
    const lang = (card.dataset.lang || "es").toLowerCase();
    let ok = true;
    if (PKM_STATE.price === "le150") ok = ok && price <= 150000;
    else if (PKM_STATE.price === "150-200") ok = ok && price >= 150000 && price <= 200000;
    else if (PKM_STATE.price === "ge200") ok = ok && price >= 200000;
    if (PKM_STATE.lang !== "all") ok = ok && lang === PKM_STATE.lang;

    card.style.display = ok ? "" : "none";
    if (ok) visible.push(card);
  });

  visible.sort((a, b) => {
    const pa = moneyToNumber(a.dataset.price);
    const pb = moneyToNumber(b.dataset.price);
    const sa = Number(a.dataset.popularity || 0);
    const sb = Number(b.dataset.popularity || 0);
    if (PKM_STATE.sort === "price-asc") return pa - pb;
    if (PKM_STATE.sort === "price-desc") return pb - pa;
    return sb - sa;
  });

  if (grid) visible.forEach((card) => grid.appendChild(card));
  if (countEl) countEl.textContent = String(visible.length);
}

// ---------- Menús (flyouts) ----------
function bindFlyout(btnId, menuId, onPick) {
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(menuId);
  if (!btn || !menu) return;

  function closeAll() {
    document.querySelectorAll(".pkm-flyout").forEach((m) => (m.hidden = true));
    document.querySelectorAll('.pkm-pill[aria-expanded="true"]').forEach((b) =>
      b.setAttribute("aria-expanded", "false")
    );
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = btn.getAttribute("aria-expanded") === "true";
    closeAll();
    btn.setAttribute("aria-expanded", String(!open));
    menu.hidden = open ? true : false;
  });

  menu.querySelectorAll("button").forEach((opt) => {
    opt.addEventListener("click", () => {
      onPick(opt);
      closeAll();
      applyActiveFilters();
    });
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== btn) {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
  });

  menu.hidden = true; // arranca oculto
}

bindFlyout("btn-price", "menu-price", (opt) => {
  PKM_STATE.price = opt.getAttribute("data-price");
  const btn = document.getElementById("btn-price");
  btn.firstChild.nodeValue = opt.textContent.trim() + " ▾";
});

bindFlyout("btn-lang", "menu-lang", (opt) => {
  PKM_STATE.lang = opt.getAttribute("data-lang");
  const btn = document.getElementById("btn-lang");
  btn.firstChild.nodeValue = opt.textContent.trim() + " ▾";
});

bindFlyout("btn-sort", "menu-sort", (opt) => {
  PKM_STATE.sort = opt.getAttribute("data-sort");
  const btn = document.getElementById("btn-sort");
  btn.firstChild.nodeValue = opt.textContent.trim() + " ▾";
});

applyActiveFilters();

window.addEventListener("load", () => {
  document.querySelectorAll(".pkm-flyout").forEach((m) => (m.hidden = true));
  document.querySelectorAll(".pkm-pill").forEach((b) => b.setAttribute("aria-expanded", "false"));
});
