import React from 'react';

export default function FarmStats() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-sage mb-8 text-center">Farm Statistics</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-charcoal mb-4">Local Farms</h3>
            <p className="text-3xl font-bold text-sage">12</p>
            <p className="text-gray-600">Active partnerships</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-charcoal mb-4">Freshness Score</h3>
            <p className="text-3xl font-bold text-sage">95%</p>
            <p className="text-gray-600">Average ingredient freshness</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-charcoal mb-4">Delivery Time</h3>
            <p className="text-3xl font-bold text-sage">24h</p>
            <p className="text-gray-600">From farm to table</p>
          </div>
        </div>
      </div>
    </div>
  );
}
