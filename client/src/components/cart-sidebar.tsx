import React from 'react';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';

export default function CartSidebar() {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart } = useApp();

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartItemQuantity(id, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      const orderData = {
        items: cart.map(item => ({
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: cartTotal,
        status: 'pending',
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        clearCart();
        alert('Order placed successfully!');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-sage hover:bg-sage/90"
            >
              {cartItemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({cartItemCount} items)
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Your cart is empty</p>
              <p className="text-sm text-gray-500 mt-2">Add some delicious items from our menu!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-charcoal">{item.name}</h4>
                    <p className="text-sage font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-charcoal">Total:</span>
              <span className="text-xl font-bold text-sage">${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleCheckout}
                className="w-full bg-sage hover:bg-sage/90 text-white"
              >
                Checkout
              </Button>
              
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="w-full text-gray-600 hover:text-gray-800"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
