import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const TABS = ['Description', 'Guide des tailles', 'Livraison & Retours'];

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem, setIsOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setLoading(true);
    setSelectedSize(null);
    setSelectedColor(null);
    setQuantity(1);
    setMainImage(0);

    api.get(`/products/${id}`).then(res => {
      setProduct(res.data);
      // Auto-select first available color
      if (res.data.colors?.length) setSelectedColor(res.data.colors[0].name);
      // Fetch related products
      return api.get(`/products?category=${res.data.category}&limit=4`);
    }).then(res => {
      setRelated(res.data.products.filter(p => p._id !== id));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const selectedSizeData = product?.sizes?.find(s => s.size === selectedSize);
  const stockAvailable = selectedSizeData?.stock || 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Veuillez choisir une taille');
      return;
    }
    if (!selectedColor) {
      toast.error('Veuillez choisir une couleur');
      return;
    }
    if (quantity > stockAvailable) {
      toast.error(`Stock insuffisant (${stockAvailable} disponible${stockAvailable > 1 ? 's' : ''})`);
      return;
    }
    addItem(product, selectedSize, selectedColor, quantity);
    toast.success('Ajouté au panier !');
    setIsOpen(true);
  };

  if (loading) {
    return (
      <div className="pt-24 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-4">
            <div className="aspect-[3/4] skeleton" />
            <div className="flex gap-2">
              {Array(4).fill(0).map((_, i) => <div key={i} className="w-16 h-20 skeleton" />)}
            </div>
          </div>
          <div className="space-y-4 py-4">
            <div className="h-8 skeleton w-3/4" />
            <div className="h-5 skeleton w-1/4" />
            <div className="h-10 skeleton w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 text-center">
        <p className="font-display text-2xl">Produit introuvable</p>
        <Link to="/shop" className="btn-gold mt-8 inline-block">Retour boutique</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-charcoal/50 tracking-wider uppercase mb-12">
          <Link to="/" className="hover:text-gold">Accueil</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold">Boutique</Link>
          <span>/</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* LEFT: Image gallery */}
          <div>
            {/* Main image */}
            <div className="relative overflow-hidden aspect-[3/4] group bg-gray-100 mb-4">
              {product.images?.[mainImage] ? (
                <img
                  src={product.images[mainImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    className={`flex-none w-16 h-20 overflow-hidden border-2 transition-colors ${
                      i === mainImage ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product info */}
          <div className="py-4">
            <p className="text-xs tracking-widest uppercase text-gold mb-2">{product.brand}</p>
            <h1 className="font-display text-3xl sm:text-4xl leading-tight mb-3">{product.name}</h1>
            <p className="font-display text-3xl mb-8">{product.price.toFixed(2)} DT</p>

            {/* Color selector */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs tracking-widest uppercase font-medium mb-3">
                  Couleur — <span className="text-gold">{selectedColor}</span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map(c => (
                    <button
                      key={c.hex}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      className={`w-8 h-8 rounded-full transition-all ${
                        selectedColor === c.name
                          ? 'ring-2 ring-gold ring-offset-2 scale-110'
                          : 'hover:scale-110'
                      } ${c.hex === '#FFFFFF' || c.hex === '#FAF9F6' ? 'border border-charcoal/20' : ''}`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <p className="text-xs tracking-widest uppercase font-medium mb-3">Taille</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => {
                    const outOfStock = s.stock === 0;
                    return (
                      <button
                        key={s.size}
                        onClick={() => !outOfStock && setSelectedSize(s.size)}
                        disabled={outOfStock}
                        title={outOfStock ? 'Rupture de stock' : s.size}
                        className={`min-w-[44px] h-11 px-3 text-xs border transition-colors relative ${
                          outOfStock
                            ? 'border-charcoal/10 text-charcoal/25 cursor-not-allowed line-through'
                            : selectedSize === s.size
                              ? 'bg-charcoal text-cream border-charcoal'
                              : 'border-charcoal/20 hover:border-gold hover:text-gold'
                        }`}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
                {selectedSizeData && (
                  <p className="text-xs text-charcoal/50 mt-2">
                    {stockAvailable <= 5 && stockAvailable > 0
                      ? `⚠️ Plus que ${stockAvailable} en stock`
                      : `${stockAvailable} en stock`}
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <p className="text-xs tracking-widest uppercase font-medium">Quantité</p>
              <div className="flex items-center border border-charcoal/20">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-charcoal hover:text-cream transition-colors"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(stockAvailable || 99, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-charcoal hover:text-cream transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className="btn-gold w-full mb-4 py-4 text-sm"
            >
              Ajouter au Panier
            </button>

            {/* Payment badge */}
            <div className="flex items-center gap-2 justify-center text-xs text-charcoal/50 mb-8">
              <span>💵</span>
              <span>Paiement en espèces à la livraison uniquement</span>
            </div>

            {/* Tabs */}
            <div className="border-t border-charcoal/10">
              <div className="flex">
                {TABS.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
                    className={`flex-1 py-4 text-xs tracking-widest uppercase border-b-2 transition-colors ${
                      activeTab === i
                        ? 'border-gold text-gold'
                        : 'border-transparent text-charcoal/50 hover:text-charcoal'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="py-6 text-sm text-charcoal/70 leading-relaxed">
                {activeTab === 0 && <p>{product.description}</p>}
                {activeTab === 1 && (
                  <div className="space-y-2">
                    <p>Consultez le guide des tailles ci-dessous pour trouver votre taille parfaite.</p>
                    <table className="w-full text-xs border-collapse mt-4">
                      <thead>
                        <tr className="border-b border-charcoal/10">
                          {['Taille', 'Tour de poitrine', 'Tour de taille', 'Tour de hanches'].map(h => (
                            <th key={h} className="py-2 pr-4 text-left font-medium text-charcoal">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['XS', '80–84', '60–64', '88–92'],
                          ['S', '84–88', '64–68', '92–96'],
                          ['M', '88–92', '68–72', '96–100'],
                          ['L', '92–96', '72–76', '100–104'],
                          ['XL', '96–100', '76–80', '104–108']
                        ].map(row => (
                          <tr key={row[0]} className="border-b border-charcoal/5">
                            {row.map((cell, i) => (
                              <td key={i} className="py-2 pr-4 text-charcoal/70">{cell} {i > 0 ? 'cm' : ''}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {activeTab === 2 && (
                  <div className="space-y-4">
                    <p>📦 <strong>Livraison</strong> — 3 à 5 jours ouvrables dans toute la Tunisie.</p>
                    <p>💵 <strong>Paiement</strong> — En espèces à la livraison uniquement.</p>
                    <p>↩️ <strong>Retours</strong> — Articles non portés et non lavés acceptés dans les 14 jours suivant la livraison.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/shop?search=${tag}`}
                    className="text-[10px] tracking-widest uppercase border border-charcoal/10 px-2.5 py-1 text-charcoal/50 hover:border-gold hover:text-gold transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-display text-2xl mb-10">Vous aimerez aussi</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {related.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
