import React, { useState, useEffect } from "react";

export default function ZackAirsoftCatalog() {
  const [catalog, setCatalog] = useState({});
  const [query, setQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

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

  // Cargar carrito y wishlist desde localStorage
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
    setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
  }, []);

  // Guardar en localStorage
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("wishlist", JSON.stringify(wishlist)), [wishlist]);

  const formatPrice = (n) =>
    typeof n === "number" ? n.toLocaleString("es-AR") : "-";

  const matches = (p) => {
    const q = query.trim().toLowerCase();
    return !q || (p.name || "").toLowerCase().includes(q);
  };

  const addToCart = (item) => {
    if (!cart.find((i) => i.pdf_id === item.pdf_id)) {
      setCart([...cart, item]);
    }
  };

  const addToWishlist = (item) => {
    if (!wishlist.find((i) => i.pdf_id === item.pdf_id)) {
      setWishlist([...wishlist, item]);
    }
  };

  useEffect(() => {
  window.addEventListener("beforeunload", () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  });
  return () => window.removeEventListener("beforeunload", () => {});
}, [cart, wishlist]);

  const removeFromCart = (id) => setCart(cart.filter((p) => p.pdf_id !== id));
  const removeFromWishlist = (id) =>
    setWishlist(wishlist.filter((p) => p.pdf_id !== id));

  const total = cart.reduce((acc, p) => acc + (p.promo || 0), 0);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-orbitron relative">
      {/* Header */}
     <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-lime-400 shadow-md">
  <div className="max-w-8xl mx-auto flex flex-wrap items-center justify-between gap-4 p-6">
    <h1 className="text-3xl font-bold text-lime-400">Zack Airsoft Store</h1>
    <div className="flex items-center gap-4 flex-wrap">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar producto..."
        className="p-2 text-black rounded outline-none border border-lime-400"
      />
      <button
        onClick={() => setShowCart(true)}
        className="text-lime-400 text-sm hover:text-white"
      >
        🛒 Carrito ({cart.length})
      </button>
      <button
        onClick={() => setShowWishlist(true)}
        className="text-lime-400 text-sm hover:text-white"
      >
        ❤️ Wishlist ({wishlist.length})
      </button>
    </div>
  </div>
</header>


      {/* Catálogo */}
      <main className="space-y-10 pt-28 max-w-8xl mx-auto p-6">
        {Object.entries(catalog).map(([category, items]) => {
          const filtered = items.filter(matches);
          if (filtered.length === 0) return null;

          return (
            <section key={category}>
              <h2 className="text-2xl text-lime-400 mb-4">{category}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filtered.map((p) => (
                  <article
                    key={p.pdf_id}
                    className="relative border border-lime-400 rounded-lg p-3 bg-zinc-900 text-white overflow-hidden group hover:shadow-lg hover:shadow-lime-400/30 transition-all duration-300"
                  >
                    {/* Imagen */}
                    <div className="relative h-40 flex items-center justify-center mb-3 bg-gray-800 rounded">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-sm text-gray-400">Sin imagen</div>
                      )}

                      {/* Overlay hover */}
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          className="bg-lime-400 text-black px-3 py-1 rounded text-xs font-semibold hover:bg-lime-500 w-32"
                          onClick={() => addToCart(p)}
                        >
                          🛒 Añadir al carrito
                        </button>
                        <button
                          className="bg-transparent border border-lime-400 text-lime-400 px-3 py-1 rounded text-xs font-semibold hover:bg-lime-400 hover:text-black w-32"
                          onClick={() => addToWishlist(p)}
                        >
                          ❤️ Wishlist
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm mb-1">{p.name}</h3>
                    <div className="flex w-100 justify-end py-2">
                      <a href={p.link} target="_blank" rel="noreferrer" class="underline text-lime-400 text-xs ">Ver Producto</a>
                      </div>
                    <div className="flex gap-2 items-baseline justify-end">
                      <span className="line-through text-gray-500 text-xs">
                        ${formatPrice(p.price)}
                      </span>
                      <span className="text-lime-400 font-semibold text-lg">
                        ${formatPrice(p.promo)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* 🛒 Modal Carrito */}
      {showCart && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="bg-zinc-900 border border-lime-400 rounded-xl p-6 w-11/12 max-w-md relative">
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-2 right-3 text-lime-400 hover:text-white text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl text-lime-400 mb-4">🛒 Carrito</h2>

            {cart.length === 0 ? (
              <p className="text-gray-400">Tu carrito está vacío.</p>
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
  onClick={() => {
    const phone = "5491154100534"; // <-- tu número WhatsApp Business (con código país, sin +)
    const message =
      "🛒 *Nueva compra desde Zack Airsoft Store!*\n\n" +
      cart
        .map(
          (p, i) =>
            `${i + 1}. ${p.name}\n   💵 Precio: $${formatPrice(p.promo)}`
        )
        .join("\n") +
      `\n\n💰 *Total:* $${formatPrice(total)}\n\nGracias por tu compra! 🔫`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
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
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="bg-zinc-900 border border-lime-400 rounded-xl p-6 w-11/12 max-w-md relative">
            <button
              onClick={() => setShowWishlist(false)}
              className="absolute top-2 right-3 text-lime-400 hover:text-white text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl text-lime-400 mb-4">❤️ Wishlist</h2>

            {wishlist.length === 0 ? (
              <p className="text-gray-400">Tu lista está vacía.</p>
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
    </div>
  );
}
