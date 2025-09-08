import { useState, useCallback } from 'react';
import { createContainer } from 'unstated-next';
import type { CartItem, AddToCartRequest, UpdateCartItemRequest } from '../types/product';
import { cartApi } from '../services/api';

interface CartState {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  isCartVisible: boolean;
}

function useCartState() {
  const [state, setState] = useState<CartState>({
    cartItems: [],
    loading: false,
    error: null,
    isCartVisible: false,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setCartItems = useCallback((cartItems: CartItem[]) => {
    setState(prev => ({ ...prev, cartItems }));
  }, []);

  const toggleCartVisibility = useCallback(() => {
    setState(prev => ({ ...prev, isCartVisible: !prev.isCartVisible }));
  }, []);

  const setCartVisibility = useCallback((isVisible: boolean) => {
    setState(prev => ({ ...prev, isCartVisible: isVisible }));
  }, []);

  const fetchCartItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cartItems = await cartApi.getCartItems();
      setCartItems(cartItems);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setCartItems]);

  const addToCart = useCallback(async (request: AddToCartRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newCartItem = await cartApi.addToCart(request);
      setState(prev => {
        // Check if item already exists (update case)
        const existingIndex = prev.cartItems.findIndex(item => item.product_id === request.product_id);
        if (existingIndex >= 0) {
          // Update existing item
          const updatedItems = [...prev.cartItems];
          updatedItems[existingIndex] = newCartItem;
          return { ...prev, cartItems: updatedItems };
        } else {
          // Add new item
          return { ...prev, cartItems: [...prev.cartItems, newCartItem] };
        }
      });
      return newCartItem;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add to cart');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateCartItem = useCallback(async (cartItemId: number, request: UpdateCartItemRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedItem = await cartApi.updateCartItem(cartItemId, request);
      setState(prev => ({
        ...prev,
        cartItems: prev.cartItems.map(item => item.id === cartItemId ? updatedItem : item)
      }));
      return updatedItem;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update cart item');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const removeFromCart = useCallback(async (cartItemId: number) => {
    setLoading(true);
    setError(null);
    try {
      await cartApi.removeFromCart(cartItemId);
      setState(prev => ({
        ...prev,
        cartItems: prev.cartItems.filter(item => item.id !== cartItemId)
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to remove from cart');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await cartApi.clearCart();
      setCartItems([]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to clear cart');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setCartItems]);

  const getTotalQuantity = useCallback(() => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [state.cartItems]);

  const getTotalPrice = useCallback(() => {
    return state.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [state.cartItems]);

  return {
    ...state,
    toggleCartVisibility,
    setCartVisibility,
    fetchCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getTotalQuantity,
    getTotalPrice,
  };
}

export const CartContainer = createContainer(useCartState);
