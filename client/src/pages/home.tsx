import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Image } from '@/components/ui/image';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  seasonalScore: number;
}

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const response = await fetch('/api/menu');
      if (response.ok) {
        const data = await response.json();
        // Get top 3 items by seasonal score
        const featured = data
          .sort((a: MenuItem, b: MenuItem) => b.seasonalScore - a.seasonalScore)
          .slice(0, 3);
        setFeaturedItems(featured);
      }
    } catch (error) {
      console.error('Failed to fetch featured items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-sage mb-6" style={{ fontFamily: 'Dancing Script, cursive' }}>
            Welcome to BiteHarvest
          </h1>
          <p className="text-xl text-charcoal mb-8 max-w-3xl mx-auto">
            Farm-to-table dining experience with fresh, seasonal ingredients sourced directly from local farms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <button className="bg-sage text-white px-8 py-3 rounded-lg font-semibold hover:bg-sage/90 transition-colors">
                View Menu
              </button>
            </Link>
            <Link href="/about">
              <button className="border-2 border-sage text-sage px-8 py-3 rounded-lg font-semibold hover:bg-sage hover:text-white transition-colors">
                Learn More
              </button>
            </Link>
          </div>
        </div>
        
        {/* Featured Menu Items */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-charcoal mb-8 text-center">Featured Seasonal Dishes</h2>
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto"></div>
              <p className="mt-4 text-charcoal">Loading featured dishes...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <Image 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="hover:scale-105 transition-transform duration-300"
                      fallbackEmoji={
                        item.category === 'starters' ? '🥗' : 
                        item.category === 'mains' ? '🍽️' : 
                        item.category === 'desserts' ? '🍰' : 
                        item.category === 'beverages' ? '🥤' : '🌱'
                      }
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-charcoal mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-sage">${item.price}</span>
                      <span className="text-sm text-sage bg-sage/20 px-2 py-1 rounded-full">
                        {Math.round(item.seasonalScore * 100)}% Seasonal
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">Fresh Ingredients</h3>
            <p className="text-gray-600">Sourced directly from local farms within 24 hours of harvest</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🍽️</span>
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">Seasonal Menu</h3>
            <p className="text-gray-600">Our menu changes with the seasons to ensure peak freshness</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌿</span>
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">Sustainable</h3>
            <p className="text-gray-600">Supporting local farmers and sustainable agriculture practices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
