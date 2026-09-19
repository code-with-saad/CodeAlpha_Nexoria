import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const getCartKey = (uid) => (uid ? `nexoria_cart_${uid}` : 'nexoria_cart_guest');

function loadCartFromStorage(uid) {
  try {
    const key = getCartKey(uid);
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    // If guest, check legacy key for backward compatibility
    if (!uid) {
      const legacy = localStorage.getItem('nexoria_cart');
      if (legacy) return JSON.parse(legacy);
    }
    return [];
  } catch {
    return [];
  }
}

function mergeCarts(baseItems, incomingItems) {
  if (!incomingItems || incomingItems.length === 0) return baseItems;
  const result = [...baseItems];
  for (const item of incomingItems) {
    const idx = result.findIndex((r) => r.product === item.product);
    if (idx > -1) {
      const maxStock = item.stock || result[idx].stock || 99;
      result[idx] = {
        ...result[idx],
        quantity: Math.min(result[idx].quantity + item.quantity, maxStock),
        stock: maxStock
      };
    } else {
      result.push(item);
    }
  }
  return result;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();

  const userId = user?._id || user?.id || null;
  const prevUserIdRef = useRef(userId);

  const [cartItems, setCartItems] = useState(() => {
    return loadCartFromStorage(userId);
  });

  // Watch authenticated user's ID to reload, merge, or clear the cart
  useEffect(() => {
    const prevId = prevUserIdRef.current;
    if (prevId === userId) return;

    if (userId && !prevId) {
      // Guest -> Logged in: merge guest cart into user's account-scoped cart
      const guestCart = loadCartFromStorage(null);
      const userCart = loadCartFromStorage(userId);
      const merged = mergeCarts(userCart, guestCart);

      // Clean up guest cart keys from localStorage
      localStorage.removeItem('nexoria_cart_guest');
      localStorage.removeItem('nexoria_cart');

      // Persist merged user cart
      localStorage.setItem(getCartKey(userId), JSON.stringify(merged));
      setCartItems(merged);
    } else if (!userId && prevId) {
      // Logged in -> Logout: clear active cart from in-memory state
      // (previous user's cart is safely kept under nexoria_cart_<prevId>)
      setCartItems([]);
    } else if (userId && prevId && userId !== prevId) {
      // User A -> User B switch: load User B's cart
      const userCart = loadCartFromStorage(userId);
      setCartItems(userCart);
    }

    prevUserIdRef.current = userId;
  }, [userId]);

  // Save to user-scoped localStorage whenever cart or user changes
  useEffect(() => {
    try {
      const key = getCartKey(userId);
      localStorage.setItem(key, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart items to localStorage', e);
    }
  }, [cartItems, userId]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);
    const productId = product._id || product.product;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product === productId);
      const maxStock = product.stock || 99;

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = Math.min(updated[existingIndex].quantity + qty, maxStock);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          stock: maxStock
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product: productId,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            stock: maxStock,
            category: product.category,
            quantity: Math.min(qty, maxStock)
          }
        ];
      }
    });

    toast.success(`Added ${qty} × ${product.name} to cart!`, { title: 'Cart Updated' });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    const qty = Number(quantity);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product === productId) {
          const maxStock = item.stock || 99;
          return { ...item, quantity: Math.min(qty, maxStock) };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const itemToRemove = cartItems.find((item) => item.product === productId);
    setCartItems((prevItems) => prevItems.filter((item) => item.product !== productId));

    if (itemToRemove) {
      toast.info(`Removed ${itemToRemove.name} from cart.`, { title: 'Item Removed' });
    }
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    const key = getCartKey(userId);
    localStorage.removeItem(key);
    if (!userId) {
      localStorage.removeItem('nexoria_cart');
    }
  };

  // Calculations
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsPrice = Number(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  );
  // Free shipping over $100, otherwise $10
  const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0.0 : 10.0;
  // 8% estimated sales tax
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value = {
    cartItems,
    totalItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    openCart,
    closeCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

