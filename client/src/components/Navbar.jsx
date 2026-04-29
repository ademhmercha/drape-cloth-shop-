import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import CartDrawer from './CartDrawer';
import api from '../utils/api';

function useDebounce(v, d) {
  const [val, setVal] = useState(v);
  useEffect(() => { const t = setTimeout(() => setVal(v), d); return () => clearTimeout(t); }, [v, d]);
  return val;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  const { user, logout } = useAuth();
  const { count, setIsOpen, clearCart } = useCart();

  const handleLogout = async () => {
    clearCart();
    await logout();
  };
  const { dark, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang } = useLang();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);

  // Autocomplete
  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setSuggestions([]); setSuggestOpen(false); return;
    }
    api.get('/products', { params: { search: debouncedQuery, limit: 5 } })
      .then(res => {
        setSuggestions(res.data.products || []);
        setSuggestOpen(true);
      }).catch(() => {});
  }, [debouncedQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
      setSuggestOpen(false);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/products/${product._id}`);
    setSearchOpen(false);
    setQuery('');
    setSuggestOpen(false);
  };

  const navBg = scrolled
    ? 'navbar-blur bg-cream/90 dark:bg-charcoal/90 border-b border-charcoal/10 dark:border-cream/10 py-3'
    : 'bg-transparent py-5';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

          {/* Hamburger (mobile) */}
          <button className="lg:hidden flex flex-col gap-1.5 p-1" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <span className="w-6 h-px bg-charcoal dark:bg-cream block" />
            <span className="w-4 h-px bg-charcoal dark:bg-cream block" />
            <span className="w-6 h-px bg-charcoal dark:bg-cream block" />
          </button>

          {/* Logo */}
          <Link to="/" className="font-display text-2xl tracking-[0.25em] text-charcoal dark:text-cream hover:text-gold transition-colors">
            DRAPE
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: t('nav.shop'), href: '/shop' },
              { label: t('nav.newArrivals'), href: '/shop?sort=newest' },
              { label: t('nav.women'), href: '/shop?category=women' },
              { label: t('nav.men'), href: '/shop?category=men' },
              { label: t('nav.about'), href: '/about' },
              { label: t('nav.contact'), href: '/contact' }
            ].map(({ label, href }) => (
              <Link key={href} to={href}
                className="text-xs tracking-widest uppercase font-medium text-charcoal dark:text-cream hover:text-gold transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative">
                    <input
                      autoFocus
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
                      placeholder="Rechercher…"
                      className="w-48 sm:w-64 border-b border-charcoal/30 dark:border-cream/30 bg-transparent text-xs py-1.5 outline-none text-charcoal dark:text-cream placeholder-charcoal/40 dark:placeholder-cream/40"
                    />
                    {/* Suggestions dropdown */}
                    {suggestOpen && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-cream dark:bg-charcoal-soft border border-charcoal/10 dark:border-cream/10 shadow-lg z-50">
                        {suggestions.map(p => (
                          <button
                            key={p._id}
                            type="button"
                            onMouseDown={() => handleSuggestionClick(p)}
                            className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-charcoal/5 dark:hover:bg-cream/5 transition-colors text-left"
                          >
                            {p.images?.[0] && (
                              <img src={p.images[0]} alt={p.name} className="w-8 h-10 object-cover flex-shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate dark:text-cream">{p.name}</p>
                              <p className="text-xs text-charcoal/50 dark:text-cream/50">{p.price.toFixed(2)} DT</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => { setSearchOpen(false); setQuery(''); }} className="ml-2 text-charcoal/50 dark:text-cream/50 hover:text-charcoal dark:hover:text-cream text-lg leading-none">×</button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="p-1 text-charcoal dark:text-cream hover:text-gold transition-colors" aria-label="Rechercher">
                  <SearchIcon />
                </button>
              )}
            </div>

            {/* Dark mode toggle */}
            <button onClick={toggleTheme} className="p-1 text-charcoal dark:text-cream hover:text-gold transition-colors" aria-label="Toggle theme">
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Language toggle */}
            <button onClick={toggleLang} className="text-[10px] tracking-widest font-medium text-charcoal dark:text-cream hover:text-gold transition-colors border border-charcoal/20 dark:border-cream/20 px-2 py-1">
              {lang === 'fr' ? 'عربي' : 'FR'}
            </button>

            {/* Account (desktop) */}
            {user ? (
              <div className="hidden lg:flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-xs tracking-widest uppercase text-gold font-medium hover:underline">Admin</Link>
                )}
                <Link to="/dashboard" className="flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-charcoal dark:text-cream hover:text-gold transition-colors">
                  <Avatar user={user} size={26} />
                  {t('nav.myAccount')}
                </Link>
                <button onClick={handleLogout} className="text-xs tracking-widest uppercase font-medium text-charcoal/50 dark:text-cream/50 hover:text-gold transition-colors">
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden lg:block text-xs tracking-widest uppercase font-medium text-charcoal dark:text-cream hover:text-gold transition-colors">
                {t('nav.login')}
              </Link>
            )}

            {/* Cart */}
            <button onClick={() => setIsOpen(true)} className="relative p-1 text-charcoal dark:text-cream hover:text-gold transition-colors" aria-label="Panier">
              <CartIcon />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <nav className="relative bg-cream dark:bg-charcoal w-72 h-full flex flex-col py-10 px-8">
            <button onClick={() => setMenuOpen(false)} className="absolute top-5 right-5 text-2xl text-charcoal dark:text-cream">×</button>
            <Link to="/" className="font-display text-xl tracking-[0.25em] mb-10 text-charcoal dark:text-cream">DRAPE</Link>
            {[
              { label: t('nav.shop'), href: '/shop' },
              { label: t('nav.women'), href: '/shop?category=women' },
              { label: t('nav.men'), href: '/shop?category=men' },
              { label: t('nav.kids'), href: '/shop?category=kids' },
              { label: t('nav.accessories'), href: '/shop?category=accessories' },
              { label: t('nav.about'), href: '/about' },
              { label: t('nav.contact'), href: '/contact' }
            ].map(({ label, href }) => (
              <Link key={href} to={href} className="py-3 text-sm tracking-widest uppercase font-medium border-b border-charcoal/10 dark:border-cream/10 hover:text-gold transition-colors text-charcoal dark:text-cream">
                {label}
              </Link>
            ))}
            <div className="mt-auto flex flex-col gap-3">
              <div className="flex items-center gap-3 pb-3 border-b border-charcoal/10 dark:border-cream/10">
                <button onClick={toggleTheme} className="text-xs text-charcoal/60 dark:text-cream/60 flex items-center gap-1.5">
                  {dark ? <SunIcon size={14} /> : <MoonIcon size={14} />}
                  {dark ? 'Mode clair' : 'Mode sombre'}
                </button>
                <span className="text-charcoal/20 dark:text-cream/20">·</span>
                <button onClick={toggleLang} className="text-xs text-charcoal/60 dark:text-cream/60">
                  {lang === 'fr' ? 'عربي' : 'Français'}
                </button>
              </div>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-sm tracking-widest uppercase font-medium hover:text-gold text-charcoal dark:text-cream flex items-center gap-2">
                    <Avatar user={user} size={24} />{t('nav.myAccount')}
                  </Link>
                  <button onClick={handleLogout} className="text-sm tracking-widest uppercase font-medium text-left hover:text-gold text-charcoal dark:text-cream">
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm tracking-widest uppercase font-medium hover:text-gold text-charcoal dark:text-cream">{t('nav.login')}</Link>
                  <Link to="/register" className="text-sm tracking-widest uppercase font-medium hover:text-gold text-charcoal dark:text-cream">{t('nav.register')}</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      <CartDrawer />
    </>
  );
}

function Avatar({ user, size = 28 }) {
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="rounded-full overflow-hidden flex-shrink-0 bg-gold/20 flex items-center justify-center border border-charcoal/10 dark:border-cream/10"
      style={{ width: size, height: size }}>
      {user?.avatar
        ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        : <span className="font-display text-gold leading-none" style={{ fontSize: size * 0.38 }}>{initials}</span>
      }
    </div>
  );
}

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
  </svg>
);
const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const MoonIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const SunIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
