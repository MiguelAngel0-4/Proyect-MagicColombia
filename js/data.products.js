// js/data.products.js
// Fuente original depurada y unificada (sin reasignaciones repetidas de window.PRODUCTS).

window.PRODUCTS = [
  // ====== COLECCIÓN DESTACADA ======
  {
    id: "p-binder",
    name: "Binder Collection | Black Bolt & White Flare",
    price: 160000,
    category: "accesorio",
    img: "../images/coleccion destacada/img.1.jpg",
    images: ["../images/coleccion destacada/img.1.jpg"],
    tags: ["binder","carpeta","protección"],
    createdAt: "2025-01-05",
    stock: 8,
    descriptionHTML: "Carpeta premium para coleccionistas con acabado Black Bolt & White Flare.",
    specs: ["12 anillas","200 hojas","Tamaño A4"],
    shipping: "Envío nacional 2–5 días. Devoluciones en 7 días."
  },
  {
    id: "p-aqualin",
    name: "Aqualin",
    price: 129000,
    category: "boardgame",
    img: "../images/coleccion destacada/img.2.jpg",
    images: ["../images/coleccion destacada/img.2.jpg"],
    tags: ["familia","abstracto","estrategia"],
    createdAt: "2025-01-10",
    stock: 12,
    descriptionHTML: "Juego abstracto de mayorías con temática marina (2 jugadores, ~20 min).",
    specs: ["2 jugadores","20 min","8+"],
    shipping: "Envío nacional 2–5 días. Devoluciones en 7 días."
  },
  {
    id: "p-fb04",
    name: "Booster Box - ULTRA LIMIT - [FB04]",
    price: 450000,
    category: "tcg",
    img: "../images/coleccion destacada/img.3.jpg",
    images: ["../images/coleccion destacada/img.3.jpg"],
    tags: ["dragon ball","booster","tcg"],
    createdAt: "2025-02-03",
    stock: 3,
    descriptionHTML: "Caja booster edición ULTRA LIMIT FB04.",
    specs: ["24 sobres","Lenguaje: Español","Sello oficial"],
    shipping: "Envío nacional 2–5 días. Devoluciones en 7 días."
  },
  {
    id: "p-digimon",
    name: "Booster Box Cyber Eden Digimon",
    price: 500000,
    category: "tcg",
    img: "../images/coleccion destacada/img.4.jpg",
    images: ["../images/coleccion destacada/img.4.jpg"],
    tags: ["digimon","booster","tcg"],
    createdAt: "2025-02-01",
    stock: 0, // agotado
    descriptionHTML: "Caja booster Digimon: Cyber Eden.",
    specs: ["24 sobres","Lenguaje: Español","Sello oficial"],
    shipping: "Envío nacional 2–5 días. Devoluciones en 7 días."
  },

  // ====== NUEVOS (images/productos/) ======
  {
    id: "p-ygo-duelist-advance",
    name: "Booster Box Duelist’s Advance",
    price: 500000,
    category: "tcg",
    img: "../images/productos/img.1.jpg",
    images: ["../images/productos/img.1.jpg"],
    tags: ["yugioh","booster","tcg"],
    createdAt: "2025-08-24",
    stock: 6,
    descriptionHTML: "Expansión Duelist’s Advance. Ideal para renovar tu deck.",
    specs: ["24 sobres","Idioma: Español"],
    shipping: "Envío nacional 2–5 días."
  },
  {
    id: "p-ygo-justice-hunter",
    name: "Booster Box Justice Hunter",
    price: 500000,
    category: "tcg",
    img: "../images/productos/img.2.jpg",
    images: ["../images/productos/img.2.jpg"],
    tags: ["yugioh","booster","tcg"],
    createdAt: "2025-08-24",
    stock: 5,
    descriptionHTML: "Edición Justice Hunter para duelistas.",
    specs: ["24 sobres","Idioma: Español"],
    shipping: "Envío nacional 2–5 días."
  },
  {
    id: "p-ygo-versus-monsters",
    name: "Booster Box Versus Monsters",
    price: 500000,
    category: "tcg",
    img: "../images/productos/img.3.jpg",
    images: ["../images/productos/img.3.jpg"],
    tags: ["yugioh","booster","tcg"],
    createdAt: "2025-08-24",
    stock: 4,
    descriptionHTML: "Versus Monsters: potencia tus estrategias.",
    specs: ["24 sobres","Idioma: Español"],
    shipping: "Envío nacional 2–5 días."
  },
  {
    id: "p-op-treasure-pack",
    name: "BOOSTER PACK: Treasure Boosters Set",
    price: 100000,
    category: "tcg",
    img: "../images/productos/img.4.jpg",
    images: ["../images/productos/img.4.jpg"],
    tags: ["one piece","booster","tcg"],
    createdAt: "2025-08-24",
    stock: 0, // agotado
    descriptionHTML: `
      <p>Set promocional con selección al azar de packs OP01–OP05 del juego de cartas One Piece y 1 carta promocional.</p>
      <ul><li>Contenido variable.</li><li>Producto oficial.</li></ul>
    `,
    specs: ["Formato: Booster Pack","Idioma: Inglés"],
    shipping: "Envío nacional 2–5 días. Devoluciones en 7 días."
  },

  // ====== POKÉMON (para /html/pokemon.html) ======
  {
    id: "pkm-charizard-ex",
    name: "Pokémon TCG | Charizard ex Special Collection",
    price: 180000,
    compareAtPrice: null,
    stock: 5,
    category: "TCG / Cartas",
    brand: "Pokémon",
    vendor: "Pokémon",
    img: "../images/coleccion destacada/img.8.jpg",
    images: ["../images/coleccion destacada/img.8.jpg"],
    lang: "es",
    desc: "Caja especial de Charizard ex con promos y accesorios para coleccionar o jugar."
  },
  {
    id: "pkm-lillie-premium",
    name: "Pokemon TCG | Lillie Premium Tournament Collection",
    price: 160000,
    compareAtPrice: 175000,
    stock: 8,
    category: "TCG / Cartas",
    brand: "Pokémon",
    vendor: "Pokémon",
    img: "../images/coleccion destacada/img.6.jpg",
    images: ["../images/coleccion destacada/img.6.jpg"],
    lang: "en",
    desc: "Tournament Collection de Lillie: deck box, fundas y cartas para competitivo."
  },
  {
    id: "pkm-booster-bundle",
    name: "Pokemon TCG | Scarlet & Violet 09 Journey Together | Booster Bundle",
    price: 120000,
    compareAtPrice: null,
    stock: 0,
    category: "TCG / Cartas",
    brand: "Pokémon",
    vendor: "Pokémon",
    img: "../images/coleccion destacada/img.7.jpg",
    images: ["../images/coleccion destacada/img.7.jpg"],
    lang: "es",
    desc: "Booster Bundle con 6 sobres de la expansión Journey Together."
  },
  {
    id: "pkm-elite-trainer-journey",
    name: "Pokemon TCG | Scarlet & Violet 09 Journey Together | Elite Trainer Box",
    price: 250000,
    compareAtPrice: null,
    stock: 12,
    category: "TCG / Cartas",
    brand: "Pokémon",
    vendor: "Pokémon",
    img: "../images/coleccion destacada/img.5.jpg",
    images: ["../images/coleccion destacada/img.5.jpg"],
    lang: "en",
    desc: "Elite Trainer Box con sobres, fundas, dados y guía del jugador."
  }
];
