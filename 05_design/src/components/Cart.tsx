import { useEffect } from 'react';
import { CartContainer } from '../store/cart';
import { ShoppingCart, Minus, Plus, X, Trash2 } from 'lucide-react';

export function Cart() {
  const {
    cartItems,
    loading,
    error,
    isCartVisible,
    toggleCartVisibility,
    setCartVisibility,
    fetchCartItems,
    updateCartItem,
    removeFromCart,
    clearCart,
    getTotalQuantity,
    getTotalPrice,
  } = CartContainer.useContainer();

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(cartItemId);
    } else {
      try {
        await updateCartItem(cartItemId, { quantity: newQuantity });
      } catch (error) {
        // Error handling is done in the cart container
        console.error('Failed to update quantity:', error);
      }
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  return (
    <>
      {/* Cart toggle button - always visible in bottom left */}
      <button
        onClick={toggleCartVisibility}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 bg-[#030213] hover:bg-gray-800 text-white rounded-[6.75px] shadow-lg transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="font-medium text-sm">Cart</span>
        {getTotalQuantity() > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
            {getTotalQuantity()}
          </span>
        )}
      </button>

      {/* Cart panel */}
      {isCartVisible && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setCartVisibility(false)}
          />

          {/* Cart Panel */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl max-h-[80vh] overflow-hidden md:left-6 md:bottom-6 md:right-auto md:w-96 md:max-h-[500px] md:rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-black">Shopping Cart</h3>
              <div className="flex items-center gap-2">
                {cartItems.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 transition-colors p-1"
                    title="Clear cart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setCartVisibility(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {error && (
                <div className="p-4 bg-red-50 border-b border-red-100">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {loading && cartItems.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">Add some products to get started</p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-black truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          ${item.product.price.toFixed(2)} each
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={loading}
                          className="text-gray-500 hover:text-gray-700 transition-colors p-1 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <span className="text-sm font-medium min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={loading || item.quantity >= item.product.stock}
                          className="text-gray-500 hover:text-gray-700 transition-colors p-1 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={loading}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 ml-2 disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-sm font-medium text-black min-w-[60px] text-right">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with total */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-black">Total:</span>
                  <span className="font-bold text-lg text-black">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <button className="w-full py-2.5 bg-[#030213] hover:bg-gray-800 text-white rounded-[6.75px] transition-colors font-medium text-sm">
                  Checkout ({getTotalQuantity()} items)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
