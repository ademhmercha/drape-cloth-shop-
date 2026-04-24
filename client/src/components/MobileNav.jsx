import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function MobileNav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { count, setIsOpen } = useCart();
  const { user } = useAuth();
  const isActive = (path) => pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream dark:bg-charcoal border-t border-charcoal/10 dark:border-cream/10 flex items-center justify-around py-2 px-4 pb-safe">
      <NavItem href="/" label={t('mobileNav.home')} active={isActive('/')}>
        <HomeIcon />
      </NavItem>
      <NavItem href="/shop" label={t('mobileNav.shop')} active={isActive('/shop')}>
        <ShopIcon />
      </NavItem>

      <button onClick={() => setIsOpen(true)} className="flex flex-col items-center gap-1 py-1 relative">
        <CartIcon />
        {count > 0 && (
          <span className="absolute -top-0.5 right-0 w-4 h-4 bg-gold text-white text-[9px] rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
        <span className="text-[10px] tracking-wider uppercase font-medium text-charcoal/60 dark:text-cream/60">{t('mobileNav.cart')}</span>
      </button>

      <NavItem
        href={user ? '/dashboard' : '/login'}
        label={user ? t('mobileNav.account') : t('mobileNav.login')}
        active={isActive('/dashboard') || isActive('/login')}>
        <UserIcon />
      </NavItem>
    </nav>
  );
}

function NavItem({ href, label, active, children }) {
  return (
    <Link to={href} className={`flex flex-col items-center gap-1 py-1 transition-colors ${active ? 'text-gold' : 'text-charcoal/60 dark:text-cream/60'}`}>
      {children}
      <span className="text-[10px] tracking-wider uppercase font-medium">{label}</span>
    </Link>
  );
}

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const ShopIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
  </svg>
);
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
