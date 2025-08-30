import React from 'react';

export default function Orders() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-sage mb-8 text-center">Your Orders</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-center text-gray-600">No orders yet. Start by browsing our menu!</p>
        </div>
      </div>
    </div>
  );
}
