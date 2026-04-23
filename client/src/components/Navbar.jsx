import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count, setIsOpen } = useCart();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'navbar-blur bg-cream/80 border-b border-charcoal/10 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className="w-6 h-px bg-charcoal block" />
            <span className="w-4 h-px bg-charcoal block" />
            <span className="w-6 h-px bg-charcoal block" />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="font-display text-2xl tracking-[0.25em] text-charcoal hover:text-gold transition-colors"
          >
            DRAPE
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { label: 'Boutique', href: '/shop' },
              { label: 'Nouveautés', href: '/shop?sort=newest' },
              { label: 'Femmes', href: '/shop?category=women' },
              { label: 'Hommes', href: '/shop?category=men' }
            ].map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className="text-xs tracking-widest uppercase font-medium text-charcoal hover:text-gold transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden lg:flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-xs tracking-widest uppercase text-gold font-medium hover:underline"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-xs tracking-widest uppercase font-medium hover:text-gold transition-colors"
                >
                  <Avatar user={user} size={28} />
                  Mon Compte
                </Link>
                <button
                  onClick={logout}
                  className="text-xs tracking-widest uppercase font-medium hover:text-gold transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:block text-xs tracking-widest uppercase font-medium hover:text-gold transition-colors"
              >
                Connexion
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-1 hover:text-gold transition-colors"
              aria-label="Open cart"
            >
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

      {/* Mobile slide-in drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <nav className="relative bg-cream w-72 h-full flex flex-col py-10 px-8 animate-fade-in">
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-5 right-5 text-2xl text-charcoal"
              aria-label="Close menu"
            >
              ✕
            </button>
            <Link to="/" className="font-display text-xl tracking-[0.25em] mb-10">DRAPE</Link>
            {[
              { label: 'Boutique', href: '/shop' },
              { label: 'Femmes', href: '/shop?category=women' },
              { label: 'Hommes', href: '/shop?category=men' },
              { label: 'Enfants', href: '/shop?category=kids' },
              { label: 'Accessoires', href: '/shop?category=accessories' }
            ].map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className="py-3 text-sm tracking-widest uppercase font-medium border-b border-charcoal/10 hover:text-gold transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="mt-auto flex flex-col gap-3">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-sm tracking-widest uppercase font-medium hover:text-gold">
                    Mon Compte
                  </Link>
                  <button onClick={logout} className="text-sm tracking-widest uppercase font-medium text-left hover:text-gold">
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm tracking-widest uppercase font-medium hover:text-gold">
                    Connexion
                  </Link>
                  <Link to="/register" className="text-sm tracking-widest uppercase font-medium hover:text-gold">
                    S'inscrire
                  </Link>
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
    <div
      className="rounded-full overflow-hidden flex-shrink-0 bg-gold/20 flex items-center justify-center border border-charcoal/10"
      style={{ width: size, height: size }}
    >
      {user?.avatar ? (
        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-display text-gold leading-none" style={{ fontSize: size * 0.38 }}>{initials}</span>
      )}
    </div>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
