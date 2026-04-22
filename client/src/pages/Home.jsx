import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

// Intersection Observer hook for reveal animations
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(el => {
          if (el.isIntersecting) {
            el.target.classList.add('visible');
            observer.unobserve(el.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// Hero parallax effect on scroll
function useParallax(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const scrollY = window.scrollY;
      el.style.transform = `translateY(${scrollY * 0.3}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);
}

const CATEGORIES = [
  { id: 'women', label: 'Femmes', image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&auto=format' },
  { id: 'men', label: 'Hommes', image: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=600&auto=format' },
  { id: 'kids', label: 'Enfants', image: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&auto=format' },
  { id: 'accessories', label: 'Accessoires', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format' }
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroImageRef = useRef(null);

  useReveal();
  useParallax(heroImageRef);

  useEffect(() => {
    Promise.all([
      api.get('/products?isFeatured=true&limit=6'),
      api.get('/products?limit=8&sort=newest')
    ]).then(([featuredRes, newRes]) => {
      setFeatured(featuredRes.data.products || []);
      setNewArrivals(newRes.data.products || []);
    }).catch(() => {
      // API unavailable — stay with empty arrays, loading stops
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative h-screen flex items-end pb-20 overflow-hidden">
        {/* Parallax background image */}
        <div ref={heroImageRef} className="absolute inset-0 scale-110">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&auto=format&fit=crop&q=90"
            alt="DRAPE editorial hero"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-6 animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
              Nouvelle Collection 2025
            </p>
            {/* Letter-reveal headline */}
            <h1 className="font-display text-5xl sm:text-7xl text-cream leading-none mb-6 animate-fade-up" style={{ opacity: 0 }}>
              L'Art de<br />
              <em>s'habiller</em>
            </h1>
            <p className="text-cream/70 text-lg mb-10 font-light animate-fade-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              Des pièces intemporelles pour ceux qui comprennent que le style est une forme d'expression silencieuse.
            </p>
            <div className="flex gap-4 animate-fade-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
              <Link to="/shop" className="btn-gold">
                Explorer la Collection
              </Link>
              <Link to="/shop?category=women" className="btn-ghost border-cream text-cream hover:bg-cream hover:text-charcoal">
                Femmes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS HORIZONTAL SCROLL ── */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl reveal">Nouveautés</h2>
          <Link to="/shop?sort=newest" className="text-xs tracking-widest uppercase hover:text-gold transition-colors reveal">
            Voir tout →
          </Link>
        </div>

        {/* Horizontally scrollable strip — drag on desktop, swipe on mobile */}
        <HorizontalScroll>
          {loading
            ? Array(6).fill(0).map((_, i) => (
                <div key={i} className="flex-none w-56 sm:w-72">
                  <SkeletonCard />
                </div>
              ))
            : newArrivals.map(p => (
                <div key={p._id} className="flex-none w-56 sm:w-72">
                  <ProductCard product={p} />
                </div>
              ))
          }
        </HorizontalScroll>
      </section>

      {/* ── CATEGORY GRID ── */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <h2 className="font-display text-3xl text-center mb-12 reveal">Explorez</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group relative overflow-hidden aspect-[3/4] reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <img
                src={cat.image}
                alt={cat.label}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-charcoal/30 group-hover:bg-charcoal/50 transition-colors duration-300" />
              <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-cream text-xs tracking-[0.3em] uppercase font-medium whitespace-nowrap">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display text-3xl reveal">Coups de Cœur</h2>
          <Link to="/shop" className="text-xs tracking-widest uppercase hover:text-gold transition-colors reveal">
            Tout voir →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : featured.map(p => (
                <div key={p._id} className="reveal" style={{ transitionDelay: `${(featured.indexOf(p) % 3) * 0.1}s` }}>
                  <ProductCard product={p} />
                </div>
              ))
          }
        </div>
      </section>

      {/* ── BRAND STORY ── */}
      <section className="py-24 bg-charcoal text-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-6 reveal">Notre Histoire</p>
          <h2 className="font-display text-4xl sm:text-5xl leading-tight mb-8 reveal">
            Le luxe n'est pas un prix.<br />
            <em>C'est une intention.</em>
          </h2>
          <p className="text-cream/60 text-lg leading-relaxed max-w-2xl mx-auto reveal">
            DRAPE est né de la conviction qu'une garde-robe bien pensée peut transformer la façon dont vous traversez le monde. Chaque pièce est sélectionnée avec soin — des matières, des coupes, des silhouettes qui résistent au temps et aux tendances.
          </p>
          <div className="mt-12 reveal">
            <Link to="/shop" className="btn-ghost border-cream text-cream hover:bg-cream hover:text-charcoal">
              Découvrir DRAPE
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Drag-to-scroll horizontal strip
function HorizontalScroll({ children }) {
  const ref = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
    ref.current.style.cursor = 'grabbing';
  };
  const onMouseUp = () => {
    isDragging.current = false;
    ref.current.style.cursor = 'grab';
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    ref.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div
      ref={ref}
      className="flex gap-5 overflow-x-auto no-scrollbar px-6 cursor-grab select-none"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {children}
    </div>
  );
}
