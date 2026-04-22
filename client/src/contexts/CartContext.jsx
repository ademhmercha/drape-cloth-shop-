import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'drape_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, size, color, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.productId === product._id && i.size === size && i.color === color
      );
      if (existing) {
        return prev.map(i =>
          i.productId === product._id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        size,
        color,
        quantity
      }];
    });
  };

  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) return removeItem(productId, size, color);
    setItems(prev =>
      prev.map(i =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      )
    );
  };

  const removeItem = (productId, size, color) => {
    setItems(prev =>
      prev.filter(i => !(i.productId === productId && i.size === size && i.color === color))
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, total, count,
      isOpen, setIsOpen,
      addItem, updateQuantity, removeItem, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
