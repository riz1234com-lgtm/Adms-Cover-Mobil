import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Category, Product, StoreSettings } from '../types';
import { defaultSettings } from '../../server/seedData';

interface ToastInfo {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface StoreContextType {
  settings: StoreSettings;
  categories: Category[];
  cart: CartItem[];
  wishlist: string[]; // array of product IDs
  isCartOpen: boolean;
  isSearchOpen: boolean;
  quickViewProduct: Product | null;
  toasts: ToastInfo[];
  isLoadingSettings: boolean;
  refreshSettings: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  addToCart: (product: Product, size: string, color: string, quantity?: number, notes?: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  trackWaClick: (productId: string) => void;
  trackProductView: (productId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'adms_cart_items';
const WISHLIST_STORAGE_KEY = 'adms_wishlist_ids';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingSettings, setIsLoadingSettings] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Persistent Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  // Save Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to persist wishlist:', e);
    }
  }, [wishlist]);

  // Fetch Settings
  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.error('Failed to fetch settings:', e);
    } finally {
      setIsLoadingSettings(false);
    }
  }, []);

  // Fetch Categories
  const refreshCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
    refreshCategories();
  }, [refreshSettings, refreshCategories]);

  // Toast Notifications
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Cart Handlers
  const addToCart = (product: Product, size: string, color: string, quantity = 1, notes = '') => {
    const effectivePrice = product.discountPrice || product.sellingPrice;
    const cartItemId = `${product.id}_${size}_${color}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: newQty * effectivePrice,
          notes: notes || updated[existingIndex].notes
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          product,
          size,
          color,
          quantity,
          price: effectivePrice,
          subtotal: effectivePrice * quantity,
          notes
        };
        return [...prev, newItem];
      }
    });

    showToast(`"${product.name}" berhasil dimasukkan ke keranjang!`, 'success');
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              subtotal: newQty * item.price
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showToast('Produk dihapus dari keranjang.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((acc, item) => acc + item.subtotal, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  // Wishlist Handlers
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Dihapus dari daftar favorit.', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Ditambahkan ke daftar favorit!', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // Tracking Handlers
  const trackWaClick = (productId: string) => {
    fetch(`/api/products/${productId}/track-wa-click`, { method: 'POST' }).catch(() => {});
  };

  const trackProductView = (productId: string) => {
    fetch(`/api/products/${productId}/track-view`, { method: 'POST' }).catch(() => {});
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        categories,
        cart,
        wishlist,
        isCartOpen,
        isSearchOpen,
        quickViewProduct,
        toasts,
        isLoadingSettings,
        refreshSettings,
        refreshCategories,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemCount,
        toggleWishlist,
        isInWishlist,
        setIsCartOpen,
        setIsSearchOpen,
        setQuickViewProduct,
        showToast,
        removeToast,
        trackWaClick,
        trackProductView
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
