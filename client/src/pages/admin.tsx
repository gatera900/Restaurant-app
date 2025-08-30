import React from 'react';

export default function Admin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-sage mb-8 text-center">Admin Dashboard</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-charcoal mb-4">Menu Management</h3>
            <p className="text-gray-600 mb-4">Add, edit, or remove menu items</p>
            <button className="bg-sage text-white px-4 py-2 rounded-lg hover:bg-sage/90 transition-colors">
              Manage Menu
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-charcoal mb-4">Order Management</h3>
            <p className="text-gray-600 mb-4">View and update order statuses</p>
            <button className="bg-sage text-white px-4 py-2 rounded-lg hover:bg-sage/90 transition-colors">
              View Orders
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-charcoal mb-4">Farm Statistics</h3>
            <p className="text-gray-600 mb-4">Monitor farm performance and metrics</p>
            <button className="bg-sage text-white px-4 py-2 rounded-lg hover:bg-sage/90 transition-colors">
              View Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
