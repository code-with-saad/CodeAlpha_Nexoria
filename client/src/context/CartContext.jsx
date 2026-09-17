import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const toast = useToast();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('nexoria_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('nexoria_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart items to localStorage', e);
    }
  }, [cartItems]);

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
    localStorage.removeItem('nexoria_cart');
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

  const value = {
    cartItems,
    totalItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
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
