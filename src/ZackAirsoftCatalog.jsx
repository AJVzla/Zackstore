import React, { useState, useEffect } from 'react';

export default function ZackAirsoftCatalog() {
  const [catalog, setCatalog] = useState({});
  const [query, setQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetch('/zack_airsoft_store.json')
      .then(res => res.json())
      .then(data => setCatalog(data))
      .catch(err => console.error('Error loading catalog JSON:', err));
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const formatPrice = (n) => (typeof n === 'number' ? n.toLocaleString('es-AR') : '-');
  const matches = (p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (p.name || '').toLowerCase().includes(q) || (String(p.pdf_id) === q);
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <header className="flex items-center justify-between mb-6 flex-wrap">
        <h1 className="text-4xl font-bold text-lime-400">Zack Airsoft Store</h1>
        <div className="flex gap-3 items-center pt-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar... Producto o Marca"
            className="px-3 py-2 rounded border text-black"
          />
          {/* <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-2 rounded border border-lime-400 text-lime-400">
            {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
          </button> */}
        </div>
      </header>

      <main className="space-y-8">
        {Object.keys(catalog).length === 0 && <p>Cargando catálogo...</p>}

        {Object.entries(catalog).map(([category, items]) => {
          const visible = items.filter(matches);
          if (visible.length === 0) return null;
          return (
            <section key={category}>
              <h2 className="text-2xl font-semibold mb-4 text-lime-400">{category} <span className="text-sm text-gray-400">({visible.length})</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {visible.map(p => (
                  <article key={category + '-' + p.pdf_id} className="border rounded-lg p-3 bg-zinc-900 text-white">
                    <div className="h-40 flex items-center justify-center mb-3 bg-white rounded">
                      {p.image ? <img src={p.image} alt={p.name} className="max-h-full object-contain" /> : <div className="text-sm text-gray-400">Sin imagen</div>}
                    </div>
                    <h3 className="font-bold text-sm mb-1 ">{p.name}</h3>
                    <p className="text-xs text-gray-400 mb-2 text-right">{p.link ? <a href={p.link} target="_blank" rel="noreferrer" className="underline text-lime-400">Ver Producto</a> : 'Sin link'}</p>
                    <div className="flex items-baseline gap-2 justify-end">
                      <span className="line-through text-xs text-gray-500">${p.price ? formatPrice(p.price) : '-'}</span>
                      <span className="font-semibold text-lime-400">${p.promo ? formatPrice(p.promo) : '-'}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
