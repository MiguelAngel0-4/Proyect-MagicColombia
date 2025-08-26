// /js/products.lanzamiento.js
(function () {
  // Desde /html/tienda.html las imágenes están una carpeta arriba:
  const IMG = (n) => `../images/lanzamiento/img.${n}.jpg`;

  const nuevos = [
    {
      id: "p-ub-ff-display",
      name: "MTG: Universes Beyond | Final Fantasy — Commander Deck Display (4 Motivos)",
      price: 320000,
      compareAtPrice: 350000, // mostrará “En oferta”
      category: "TCG / Cartas",
      vendor: "Magic: The Gathering",
      tags: ["tcg", "magic", "lanzamiento"],
      stock: 0, // agotado
      img: IMG(1),
      images: [IMG(1)],
      description: "Display con los 4 Commander Decks de Final Fantasy (Universes Beyond).",
      specs: ["Idioma: Inglés", "Formato: Commander", "Universes Beyond"],
      shipping: "Los gastos de envío se calculan en el checkout.",
    },
    {
      id: "p-ub-ff-collector",
      name: "MTG: Universes Beyond | Final Fantasy — Commander Deck, Collector Edition Display (4 variantes)",
      price: 599000,
      compareAtPrice: null,
      category: "TCG / Cartas",
      vendor: "Magic: The Gathering",
      tags: ["tcg", "magic", "lanzamiento"],
      stock: 0,
      img: IMG(2),
      images: [IMG(2)],
      description: "Display Collector Edition con 4 variantes de Commander Deck.",
      specs: ["Idioma: Inglés", "Edición: Collector", "Universes Beyond"],
      shipping: "Los gastos de envío se calculan en el checkout.",
    },
    {
      id: "p-ub-ff-bundle",
      name: "MTG: Universes Beyond | Final Fantasy — Bundle",
      price: 300000,
      compareAtPrice: 320000, // oferta
      category: "TCG / Cartas",
      vendor: "Magic: The Gathering",
      tags: ["tcg", "magic", "lanzamiento"],
      stock: 15,
      img: IMG(3),
      images: [IMG(3)],
      description: "Bundle del set Universes Beyond Final Fantasy.",
      specs: ["Idioma: Inglés", "Incluye sobres + accesorios", "Universes Beyond"],
      shipping: "Los gastos de envío se calculan en el checkout.",
    },
    {
      id: "p-ub-ff-starter",
      name: "MTG: Universes Beyond | Final Fantasy — Starter Kit",
      price: 120000,
      compareAtPrice: null,
      category: "TCG / Cartas",
      vendor: "Magic: The Gathering",
      tags: ["tcg", "magic", "lanzamiento"],
      stock: 0,
      img: IMG(4),
      images: [IMG(4)],
      description: "Starter Kit ideal para empezar a jugar con temática Final Fantasy.",
      specs: ["Idioma: Inglés", "2 Mazos listos para jugar", "Universes Beyond"],
      shipping: "Los gastos de envío se calculan en el checkout.",
    },
  ];

  // Inicializa y concatena sin pisar lo que ya tienes
  window.PRODUCTS = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  window.PRODUCTS = window.PRODUCTS.concat(nuevos);
})();
