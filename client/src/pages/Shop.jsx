import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = [
  { id: 'women', label: 'Femmes' },
  { id: 'men', label: 'Hommes' },
  { id: 'kids', label: 'Enfants' },
  { id: 'accessories', label: 'Accessoires' }
];
const COLORS = [
  { name: 'Noir', hex: '#1C1C1C' },
  { name: 'Blanc', hex: '#FFFFFF' },
  { name: 'Beige', hex: '#E8DCC8' },
  { name: 'Camel', hex: '#C19A6B' },
  { name: 'Or', hex: '#C9A84C' },
  { name: 'Rouge', hex: '#CB4154' },
  { name: 'Bleu', hex: '#2563EB' }
];

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Read filters from URL
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const size = searchParams.get('size') || '';
  const color = searchParams.get('color') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page') || 1);

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page'); // reset page on filter change
    setSearchParams(next);
  };

  const clearAll = () => {
    setSearchInput('');
    setSearchParams({});
  };

  // Sync debounced search to URL
  useEffect(() => {
    setParam('search', debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    setLoading(true);
    const params = { limit: 10, page };
    if (search) params.search = search;
    if (category) params.category = category;
    if (size) params.size = size;
    if (color) params.color = color;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sort) params.sort = sort;

    api.get('/products', { params })
      .then(res => {
        setProducts(res.data.products);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [searchParams.toString()]);

  const activeFilters = [
    category && { label: CATEGORIES.find(c => c.id === category)?.label, key: 'category' },
    size && { label: `Taille ${size}`, key: 'size' },
    color && { label: color, key: 'color' },
    minPrice && { label: `Min ${minPrice} DT`, key: 'minPrice' },
    maxPrice && { label: `Max ${maxPrice} DT`, key: 'maxPrice' }
  ].filter(Boolean);

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="font-display text-4xl">Boutique</h1>
            {!loading && (
              <p className="text-sm text-charcoal/50 mt-1">{total} article{total !== 1 ? 's' : ''}</p>
            )}
          </div>
          <button
            className="lg:hidden btn-ghost text-xs py-2.5 px-5"
            onClick={() => setFiltersOpen(true)}
          >
            Filtres {activeFilters.length > 0 && `(${activeFilters.length})`}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Rechercher par nom, marque, tag..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full border border-charcoal/20 py-3 pl-11 pr-4 text-sm outline-none focus:border-gold transition-colors bg-transparent"
          />
          <svg className="absolute left-4 top-3.5 w-4 h-4 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" /><path d="M21 21l-4.35-4.35" strokeWidth="2" />
          </svg>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map(f => (
              <button
                key={f.key}
                onClick={() => setParam(f.key, '')}
                className="flex items-center gap-1.5 bg-charcoal text-cream text-xs px-3 py-1.5 tracking-wider hover:bg-gold transition-colors"
              >
                {f.label} <span>×</span>
              </button>
            ))}
            <button
              onClick={clearAll}
              className="text-xs tracking-wider text-charcoal/50 underline hover:text-charcoal transition-colors"
            >
              Tout effacer
            </button>
          </div>
        )}

        <div className="flex gap-10">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <FiltersPanel
              category={category} size={size} color={color}
              minPrice={minPrice} maxPrice={maxPrice} sort={sort}
              setParam={setParam}
            />
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex items-center justify-end mb-6">
              <select
                value={sort}
                onChange={e => setParam('sort', e.target.value)}
                className="text-xs tracking-wider border border-charcoal/20 py-2 px-3 bg-transparent outline-none focus:border-gold cursor-pointer"
              >
                <option value="">Trier: Nouveautés</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading
                ? Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)
                : products.length === 0
                  ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                      <svg className="text-charcoal/15 mb-5" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                        <path d="M8 11h6M11 8v6" strokeLinecap="round" />
                      </svg>
                      <p className="font-display text-2xl mb-2">Aucun résultat</p>
                      <p className="text-sm text-charcoal/50 mb-6">Essayez d'ajuster vos filtres ou votre recherche</p>
                      <button onClick={clearAll} className="btn-ghost text-xs py-2 px-6">Effacer les filtres</button>
                    </div>
                  )
                  : products.map(p => <ProductCard key={p._id} product={p} />)
              }
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setParam('page', String(p))}
                    className={`w-9 h-9 text-sm transition-colors ${
                      p === page
                        ? 'bg-charcoal text-cream'
                        : 'border border-charcoal/20 hover:border-gold hover:text-gold'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="relative ml-auto bg-cream w-80 h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-xl">Filtres</h3>
              <button onClick={() => setFiltersOpen(false)} className="text-2xl">×</button>
            </div>
            <FiltersPanel
              category={category} size={size} color={color}
              minPrice={minPrice} maxPrice={maxPrice} sort={sort}
              setParam={setParam}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FiltersPanel({ category, size, color, minPrice, maxPrice, sort, setParam }) {
  return (
    <div className="space-y-8">
      {/* Category */}
      <div>
        <h4 className="text-xs tracking-[0.2em] uppercase font-medium mb-4">Catégorie</h4>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setParam('category', category === cat.id ? '' : cat.id)}
              className={`block text-sm transition-colors w-full text-left py-1 ${
                category === cat.id ? 'text-gold font-medium' : 'text-charcoal/70 hover:text-charcoal'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-xs tracking-[0.2em] uppercase font-medium mb-4">Taille</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(s => (
            <button
              key={s}
              onClick={() => setParam('size', size === s ? '' : s)}
              className={`w-10 h-10 text-xs border transition-colors ${
                size === s
                  ? 'bg-charcoal text-cream border-charcoal'
                  : 'border-charcoal/20 hover:border-gold hover:text-gold'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="text-xs tracking-[0.2em] uppercase font-medium mb-4">Couleur</h4>
        <div className="flex flex-wrap gap-2.5">
          {COLORS.map(c => (
            <button
              key={c.name}
              onClick={() => setParam('color', color === c.name ? '' : c.name)}
              title={c.name}
              className={`w-7 h-7 rounded-full transition-transform ${
                color === c.name ? 'scale-125 ring-2 ring-gold ring-offset-2' : 'hover:scale-110'
              } ${c.hex === '#FFFFFF' ? 'border border-charcoal/20' : ''}`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="text-xs tracking-[0.2em] uppercase font-medium mb-4">Prix (DT)</h4>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => setParam('minPrice', e.target.value)}
            className="w-full border border-charcoal/20 py-1.5 px-2 text-sm outline-none focus:border-gold bg-transparent"
            min="0"
          />
          <span className="text-charcoal/30">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setParam('maxPrice', e.target.value)}
            className="w-full border border-charcoal/20 py-1.5 px-2 text-sm outline-none focus:border-gold bg-transparent"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}
