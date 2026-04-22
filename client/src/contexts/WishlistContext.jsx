import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user) { setProducts([]); return; }
    api.get('/users/me/wishlist').then(res => setProducts(res.data)).catch(() => {});
  }, [user]);

  const ids = new Set(products.map(p => p._id));

  const toggle = async (product) => {
    if (!user) return false;
    const productId = typeof product === 'string' ? product : product._id;
    const inList = ids.has(productId);

    // Optimistic update
    setProducts(prev =>
      inList ? prev.filter(p => p._id !== productId) : [...prev, product]
    );

    try {
      if (inList) {
        await api.delete(`/users/me/wishlist/${productId}`);
      } else {
        await api.post(`/users/me/wishlist/${productId}`);
      }
    } catch {
      // Revert on failure
      api.get('/users/me/wishlist').then(res => setProducts(res.data)).catch(() => {});
    }
    return true;
  };

  const isInWishlist = (productId) => ids.has(productId);

  return (
    <WishlistContext.Provider value={{ products, toggle, isInWishlist, count: ids.size }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
