import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-sage mb-8 text-center">About BiteHarvest</h1>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-lg text-charcoal mb-6">
            BiteHarvest is a farm-to-table restaurant that connects local farmers with food lovers. 
            We believe in the power of fresh, seasonal ingredients and sustainable agriculture.
          </p>
          <p className="text-lg text-charcoal mb-6">
            Our mission is to support local farmers while providing our customers with the freshest 
            and most delicious meals possible. Every ingredient tells a story of sustainability and care.
          </p>
          <p className="text-lg text-charcoal">
            Join us in celebrating the bounty of local farms and the joy of seasonal eating.
          </p>
        </div>
      </div>
    </div>
  );
}
