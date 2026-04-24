import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import SEOHead from '../components/SEOHead';

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
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useParallax(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.innerWidth < 768) return;
    const onScroll = () => {
      el.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);
}

const CATEGORY_IMAGES = {
  women: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&auto=format&fit=crop&q=80',
  men: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=600&auto=format&fit=crop&q=80',
  kids: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&auto=format&fit=crop&q=80',
  accessories: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80'
};

export default function Home() {
  const { t } = useTranslation();
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
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const CATEGORIES = [
    { id: 'women', label: t('home.categories.women') },
    { id: 'men', label: t('home.categories.men') },
    { id: 'kids', label: t('home.categories.kids') },
    { id: 'accessories', label: t('home.categories.accessories') }
  ];

  return (
    <>
      <SEOHead />
      <div className="overflow-hidden pb-20 lg:pb-0 dark:bg-charcoal">

        {/* ── HERO ── */}
        <section className="relative h-screen min-h-[600px] flex items-end pb-24 sm:pb-20 overflow-hidden">
          <div ref={heroImageRef} className="absolute inset-0 scale-110">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=90"
              alt="DRAPE luxury fashion editorial"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-charcoal/10" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full">
            <div className="max-w-xl">
              <p className="text-gold text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-4 sm:mb-6 animate-fade-in"
                style={{ animationDelay: '0.2s', opacity: 0 }}>
                {t('home.heroLabel')}
              </p>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-cream leading-none mb-4 sm:mb-6 animate-fade-up"
                style={{ opacity: 0 }}>
                {t('home.heroTitle').split('\n').map((line, i) => (
                  <span key={i}>{i > 0 ? <><br /><em>{line}</em></> : line}</span>
                ))}
              </h1>
              <p className="text-cream/70 text-sm sm:text-lg mb-8 sm:mb-10 font-light leading-relaxed animate-fade-up"
                style={{ animationDelay: '0.3s', opacity: 0 }}>
                {t('home.heroDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up"
                style={{ animationDelay: '0.5s', opacity: 0 }}>
                <Link to="/shop" className="btn-gold text-center">{t('home.exploreCollection')}</Link>
                <Link to="/shop?category=women"
                  className="btn-ghost border-cream text-cream hover:bg-cream hover:text-charcoal text-center">
                  {t('home.womenBtn')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── NEW ARRIVALS ── */}
        <section className="py-14 sm:py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 mb-6 sm:mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl sm:text-3xl reveal dark:text-cream">{t('home.newArrivals')}</h2>
            <Link to="/shop?sort=newest" className="text-xs tracking-widest uppercase hover:text-gold transition-colors reveal dark:text-cream/70">
              {t('home.seeAll')}
            </Link>
          </div>
          <HorizontalScroll>
            {loading
              ? Array(6).fill(0).map((_, i) => (
                  <div key={i} className="flex-none w-40 sm:w-64"><SkeletonCard /></div>
                ))
              : newArrivals.map(p => (
                  <div key={p._id} className="flex-none w-40 sm:w-64">
                    <ProductCard product={p} />
                  </div>
                ))
            }
          </HorizontalScroll>
        </section>

        {/* ── CATEGORY GRID ── */}
        <section className="py-10 sm:py-16 max-w-7xl mx-auto px-5 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl text-center mb-8 sm:mb-12 reveal dark:text-cream">{t('home.explore')}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link key={cat.id} to={`/shop?category=${cat.id}`}
                className="group relative overflow-hidden aspect-[3/4] reveal"
                style={{ transitionDelay: `${i * 0.08}s` }}>
                <img src={CATEGORY_IMAGES[cat.id]} alt={cat.label} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-charcoal/30 group-hover:bg-charcoal/50 transition-colors duration-300" />
                <span className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-cream text-[10px] sm:text-xs tracking-[0.3em] uppercase font-medium whitespace-nowrap">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FEATURED ── */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-5 sm:px-6">
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl reveal dark:text-cream">{t('home.featured')}</h2>
            <Link to="/shop" className="text-xs tracking-widest uppercase hover:text-gold transition-colors reveal dark:text-cream/70">
              {t('home.seeAll2')}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {loading
              ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : featured.map((p, i) => (
                  <div key={p._id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
                    <ProductCard product={p} />
                  </div>
                ))
            }
          </div>
        </section>

        {/* ── BRAND STORY ── */}
        <section className="py-20 sm:py-24 bg-charcoal text-cream">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-5 sm:mb-6 reveal">{t('home.brandLabel')}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6 sm:mb-8 reveal">
              {t('home.brandTitle')}<br /><em>{t('home.brandTitleItalic')}</em>
            </h2>
            <p className="text-cream/60 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto reveal">
              {t('home.brandDesc')}
            </p>
            <div className="mt-10 sm:mt-12 reveal">
              <Link to="/shop" className="btn-ghost border-cream text-cream hover:bg-cream hover:text-charcoal">
                {t('home.brandCta')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

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
    if (ref.current) ref.current.style.cursor = 'grab';
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5;
  };

  return (
    <div ref={ref}
      className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar px-5 sm:px-6 cursor-grab select-none"
      onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onMouseMove={onMouseMove}>
      {children}
    </div>
  );
}
