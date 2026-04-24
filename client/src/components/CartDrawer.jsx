import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';

export default function CartDrawer() {
  const { t } = useTranslation();
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={() => setIsOpen(false)} />
      )}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-cream dark:bg-charcoal z-50 flex flex-col shadow-2xl transform transition-transform duration-500 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-charcoal/10 dark:border-cream/10">
          <h2 className="font-display text-xl dark:text-cream">{t('cart.title')}</h2>
          <button onClick={() => setIsOpen(false)}
            className="text-charcoal dark:text-cream hover:text-gold transition-colors text-2xl leading-none" aria-label="Fermer">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <svg className="text-charcoal/15 dark:text-cream/15 mb-6" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p className="font-display text-xl mb-2 dark:text-cream">{t('cart.empty')}</p>
              <p className="text-sm text-charcoal/60 dark:text-cream/60 mb-8">{t('cart.emptyDesc')}</p>
              <Link to="/shop" onClick={() => setIsOpen(false)} className="btn-gold">{t('cart.explore')}</Link>
            </div>
          ) : (
            <ul className="divide-y divide-charcoal/10 dark:divide-cream/10">
              {items.map(item => (
                <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 p-5">
                  <div className="w-20 h-24 bg-gray-100 dark:bg-charcoal-soft flex-shrink-0 overflow-hidden">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                      : <div className="w-full h-full bg-gray-200 dark:bg-charcoal-soft" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate dark:text-cream">{item.name}</h3>
                    <p className="text-xs text-charcoal/60 dark:text-cream/60 mt-1">{item.size} · {item.color}</p>
                    <p className="font-display text-sm mt-1 dark:text-cream">{(item.price * item.quantity).toFixed(2)} DT</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="w-6 h-6 border border-charcoal/30 dark:border-cream/30 flex items-center justify-center text-sm hover:border-gold hover:text-gold transition-colors dark:text-cream">−</button>
                      <span className="text-sm w-4 text-center dark:text-cream">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="w-6 h-6 border border-charcoal/30 dark:border-cream/30 flex items-center justify-center text-sm hover:border-gold hover:text-gold transition-colors dark:text-cream">+</button>
                      <button onClick={() => removeItem(item.productId, item.size, item.color)}
                        className="ml-auto text-charcoal/40 dark:text-cream/40 hover:text-red-500 transition-colors text-xs tracking-widest uppercase">
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-charcoal/10 dark:border-cream/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm tracking-widest uppercase text-charcoal/60 dark:text-cream/60">{t('cart.total')}</span>
              <span className="font-display text-2xl dark:text-cream">{total.toFixed(2)} DT</span>
            </div>
            <p className="text-xs text-charcoal/50 dark:text-cream/50">{t('cart.shippingNote')}</p>
            <Link to="/checkout" onClick={() => setIsOpen(false)} className="btn-gold w-full text-center block">
              {t('cart.checkout')}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
