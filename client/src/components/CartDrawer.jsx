import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-cream z-50 flex flex-col shadow-2xl transform transition-transform duration-500 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-charcoal/10">
          <h2 className="font-display text-xl">Mon Panier</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-charcoal hover:text-gold transition-colors text-2xl leading-none"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <svg className="text-charcoal/15 mb-6" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p className="font-display text-xl mb-2">Votre panier est vide</p>
              <p className="text-sm text-charcoal/60 mb-8">Découvrez nos collections exclusives</p>
              <Link
                to="/shop"
                onClick={() => setIsOpen(false)}
                className="btn-gold"
              >
                Explorer la boutique
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-charcoal/10">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 p-5">
                  <div className="w-20 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-charcoal/60 mt-1">
                      {item.size} · {item.color}
                    </p>
                    <p className="font-display text-sm mt-1">{(item.price * item.quantity).toFixed(2)} DT</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="w-6 h-6 border border-charcoal/30 flex items-center justify-center text-sm hover:border-gold hover:text-gold transition-colors"
                      >
                        −
                      </button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="w-6 h-6 border border-charcoal/30 flex items-center justify-center text-sm hover:border-gold hover:text-gold transition-colors"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        className="ml-auto text-charcoal/40 hover:text-red-500 transition-colors text-xs tracking-widest uppercase"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-charcoal/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm tracking-widest uppercase text-charcoal/60">Total</span>
              <span className="font-display text-2xl">{total.toFixed(2)} DT</span>
            </div>
            <p className="text-xs text-charcoal/50">Livraison calculée à la caisse</p>
            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="btn-gold w-full text-center block"
            >
              Commander
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
