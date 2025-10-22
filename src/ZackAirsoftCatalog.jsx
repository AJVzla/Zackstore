import React, { useState, useEffect } from "react";

export default function ZackAirsoftCatalog() {
  const [catalog, setCatalog] = useState({});
  const [query, setQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Cargar catálogo
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/zack_airsoft_store.json`)
      .then((res) => res.json())
      .then((data) => setCatalog(data))
      .catch((err) => console.error("Error cargando catálogo:", err));
  }, []);

  // Guardar en localStorage
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(
    () => localStorage.setItem("wishlist", JSON.stringify(wishlist)),
    [wishlist]
  );

  const formatPrice = (n) =>
    typeof n === "number" ? n.toLocaleString("es-AR") : "-";

  const matches = (p) => {
    const q = query.trim().toLowerCase();
    return !q || (p.name || "").toLowerCase().includes(q);
  };

  const addToCart = (item) => {
    if (!cart.find((i) => i.pdf_id === item.pdf_id)) {
      setCart([...cart, item]);
      setShowCart(true);
    }
  };

  const addToWishlist = (item) => {
    if (!wishlist.find((i) => i.pdf_id === item.pdf_id)) {
      setWishlist([...wishlist, item]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter((p) => p.pdf_id !== id));
  const removeFromWishlist = (id) =>
    setWishlist(wishlist.filter((p) => p.pdf_id !== id));

  const total = cart.reduce((acc, p) => acc + (p.promo || 0), 0);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (window.scrollY > 40) {
        header.classList.add("bg-black/90", "py-2");
      } else {
        header.classList.remove("bg-black/90", "py-2");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-orbitron relative">
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-lime-400 shadow-md">
        <div className="max-w-8xl mx-auto flex items-center justify-between gap-4 py-3 px-6 border-lime-400">
          <a href="https://zackstore-seven.vercel.app/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-9" />
            <h1 className="text-xl text-lime-400 px-3">Zack Airsoft Store</h1>
          </a>
          
          {/* Desktop */}


          {/* Search and buttons */}
          <div className="hidden md:flex items-center gap-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto..."
              className="py-1 px-2 text-black rounded outline-none border border-lime-400"
            />
            <button
              onClick={() => setShowWishlist(true)}
              className="text-lime-400 hover:text-white"
            >
              💙 Favoritos ({wishlist.length})
            </button>
            {/* <button
              onClick={() => setShowCart(true)}
              className="text-lime-400 hover:text-white"
            >
              🛒 Carrito ({cart.length})
            </button> */}
          </div>

          {/* Mobile button */}
          <button
            className="md:hidden text-lime-400 text-3xl"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>
          <nav className="hidden md:flex gap-2 mx-auto text-sm justify-between max-w-8xl mx-auto py-2 px-7 border-lime-400">
            {Object.keys(catalog).map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  document
                    .getElementById(cat)
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="text-white hover:text-lime-400 transition-colors"
              >
                {cat}
              </button>
            ))}
          </nav>
      </header>
      

      {/* Mobile Fullscreen Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black flex flex-col justify-center items-center gap-6 z-[9998]">
          {Object.keys(catalog).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                document
                  .getElementById(cat)
                  .scrollIntoView({ behavior: "smooth" });
                setMenuOpen(false);
              }}
              className="text-lime-400 text-xl hover:text-white transition-all"
            >
              {cat}
            </button>
          ))}
          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              onClick={() => {
                setShowWishlist(true);
                setMenuOpen(false);
              }}
              className="text-lime-400 hover:text-white"
            >
              💙 Favoritos ({wishlist.length})
            </button>
            <button
              onClick={() => {
                setShowCart(true);
                setMenuOpen(false);
              }}
              className="text-lime-400 hover:text-white"
            >
              🛒 Carrito ({cart.length})
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(false)}
            className="absolute bottom-10 text-lime-400 text-3xl"
          >
            ✖
          </button>
        </div>
      )}

      {/* MAIN CATALOG */}
      <main className="space-y-10 pt-28 max-w-8xl mx-auto p-6">
        {Object.entries(catalog).map(([category, items]) => {
          const filtered = items.filter(matches);
          if (filtered.length === 0) return null;

          return (
            <section id={category} key={category}>
              <h2 className="text-2xl text-lime-400 mb-4">{category}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filtered.map((p) => {
                  const inCart = cart.some((i) => i.pdf_id === p.pdf_id);
                  return (
                    <article
                      key={p.pdf_id}
                      className="relative border border-lime-400 rounded-lg p-3 bg-zinc-900 text-white overflow-hidden group hover:shadow-lg hover:shadow-lime-400/30 transition-all duration-300"
                    >
                      {/* Imagen */}
                      <div className="relative h-40 flex items-center justify-center mb-3 bg-gray-800 rounded bg-white">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-sm text-gray-400">
                            Sin imagen
                          </div>
                        )}

                        {/* Overlay hover */}
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {inCart ? (
                            <button
                              className="bg-lime-400 text-black px-2 py-1 rounded text-xs font-semibold hover:bg-lime-500 w-42"
                              onClick={() => setShowCart(true)}
                            >
                              🛒 Ir a la compra
                            </button>
                          ) : (
                            <button
                              className="bg-transparent border border-lime-400 text-lime-400 px-2 py-1 rounded text-xs font-semibold hover:bg-lime-400 hover:text-black w-42"
                              onClick={() => addToCart(p)}
                            >
                              🛒 Añadir al carrito
                            </button>
                          )}
                          <button
                            className="bg-transparent border border-lime-400 text-lime-400 px-8 py-1 rounded text-xs font-semibold hover:bg-lime-400 hover:text-black w-42"
                            onClick={() => addToWishlist(p)}
                          >
                            💙 Favoritos
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-sm mb-1">{p.name}</h3>
                      <div className="flex w-full justify-end py-2">
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          className="underline text-lime-400 text-xs"
                        >
                          Ver Producto
                        </a>
                      </div>
                      <div className="flex gap-2 items-baseline justify-end">
                      {p.price ? (
                        <span className="line-through text-gray-500 text-xs">
                          ${formatPrice(p.price)}
                        </span>
                      ) : null}
                       {p.promo ? (
                      <span className="text-lime-400 font-semibold text-lg">
                        ${formatPrice(p.promo)}
                      </span>
                       ) : null}
                    </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      
      </main>

      {/* 🛒 Modal Carrito */}
      {showCart && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999]">
          <div className="bg-zinc-900 border border-lime-400 rounded-xl p-6 w-11/12 max-w-md relative animate-fadeIn">
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-2 right-3 text-lime-400 hover:text-white text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl text-lime-400 mb-4 text-center">
              🛒 Carrito
            </h2>

            {cart.length === 0 ? (
              <p className="text-gray-400 text-center">
                Tu carrito está vacío.
              </p>
            ) : (
              <>
                <ul className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <li
                      key={item.pdf_id}
                      className="flex justify-between items-center border-b border-gray-700 pb-1"
                    >
                      <span className="text-sm p-2">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lime-400 text-sm">
                          ${formatPrice(item.promo)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.pdf_id)}
                          className="text-red-500 text-xs hover:text-red-400"
                        >
                          ❌
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                  <span className="text-lime-400 font-semibold">
                    Total: ${formatPrice(total)}
                  </span>

                  <button
                    className="bg-lime-400 text-black px-4 py-1 rounded font-semibold hover:bg-lime-500"
                    onClick={(e) => {
                      e.preventDefault(); // evita cualquier doble acción

                      const phone = "5491154100534";
                      const message = [
                        "🛒 *Nueva compra desde Zack Airsoft Store!*",
                        "",
                        ...cart.map(
                          (p, i) => `${i + 1}. ${p.name}\n   💵 Precio: $${formatPrice(p.promo)}`
                        ),
                        "",
                        `💰 *Total:* $${formatPrice(total)}`,
                        "",
                        "Gracias por tu compra! 🔫",
                      ].join("\n");

                      const encodedMessage = encodeURIComponent(message);
                      const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

                      window.open(waUrl, "_blank", "noopener,noreferrer");
                    }}
                  >
                    Finalizar compra
                  </button>
                </div>

              </>
            )}
          </div>
        </div>
      )}

      {/* ❤️ Modal Wishlist */}
      {showWishlist && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999]">
          <div className="bg-zinc-900 border border-lime-400 rounded-xl p-6 w-11/12 max-w-md relative animate-fadeIn">
            <button
              onClick={() => setShowWishlist(false)}
              className="absolute top-2 right-3 text-lime-400 hover:text-white text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl text-lime-400 mb-4 text-center">
              ❤️ Wishlist
            </h2>

            {wishlist.length === 0 ? (
              <p className="text-gray-400 text-center">Tu lista está vacía.</p>
            ) : (
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {wishlist.map((item) => (
                  <li
                    key={item.pdf_id}
                    className="flex justify-between items-center border-b border-gray-700 pb-1"
                  >
                    <span className="text-sm">{item.name}</span>
                    <button
                      onClick={() => removeFromWishlist(item.pdf_id)}
                      className="text-red-500 text-xs hover:text-red-400"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {/* 🛒 Botón flotante de carrito */}
<button
  onClick={() => setShowCart(true)}
  className="fixed bottom-6 right-6 bg-lime-400 text-black p-4 rounded-full shadow-lg hover:bg-lime-500 transition-all z-[10000]"
  aria-label="Abrir carrito"
>
  <div className="relative">
    {/* Ícono del carrito */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.293 2.293a1 1 0 0 0 .707 1.707h12.172a1 1 0 0 0 .707-1.707L17 13M9 21h.01M15 21h.01"
      />
    </svg>

    {/* 🔴 Notificación de cantidad */}
    {cart.length > 0 && (
      <span className="absolute -top-6 -right-4 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-[2px] shadow-md">
        {cart.length}
      </span>
    )}
  </div>
</button>

    </div>
  );
}
