import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useApp } from '@/context/app-context';

interface OrderItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  customizations?: string;
}

interface Order {
  id: number;
  userId?: number;
  status: string;
  total: number;
  items: OrderItem[];
  specialInstructions?: string;
  estimatedTime?: number;
  createdAt: string;
  completedAt?: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useApp();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-sage/20 text-sage';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-green-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto"></div>
            <p className="mt-4 text-charcoal">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-sage mb-8 text-center">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4">
              <span className="text-6xl">🍽️</span>
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">No orders yet!</h3>
            <p className="text-gray-600 mb-6">Start by browsing our delicious menu and placing your first order.</p>
            <Link href="/menu">
              <button className="bg-sage text-white px-6 py-3 rounded-lg font-semibold hover:bg-sage/90 transition-colors">
                Browse Menu
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal">Order #{order.id}</h3>
                    <p className="text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-charcoal mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <span className="font-medium text-charcoal">{item.name}</span>
                          {item.customizations && (
                            <p className="text-sm text-gray-600">{item.customizations}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-charcoal">Qty: {item.quantity}</span>
                          <p className="font-semibold text-sage">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.specialInstructions && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-charcoal mb-1">Special Instructions:</h4>
                    <p className="text-gray-600 italic">{order.specialInstructions}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div>
                    {order.estimatedTime && (
                      <p className="text-sm text-gray-600">
                        Estimated time: {order.estimatedTime} minutes
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-sage">Total: ${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
