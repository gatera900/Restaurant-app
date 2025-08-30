import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/app-context';
import { Image } from '@/components/ui/image';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  allergens: string[];
  dietary: string[];
  imageUrl: string;
  available: boolean;
  seasonalScore: number;
  popularityScore: number;
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addToCart } = useApp();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const categories = ['all', 'starters', 'mains', 'desserts', 'beverages'];

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-green-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto"></div>
            <p className="mt-4 text-charcoal">Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-sage mb-8 text-center">Our Menu</h1>
        <p className="text-center text-charcoal mb-12 max-w-2xl mx-auto">
          Fresh, seasonal dishes made with ingredients sourced directly from local farms
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-sage text-white'
                  : 'bg-white text-charcoal hover:bg-sage/10'
              }`}
            >
              {category === 'all' ? 'All Items' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
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
                
                {/* Dietary badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.dietary.map((diet) => (
                    <span key={diet} className="px-2 py-1 bg-sage/20 text-sage text-xs rounded-full">
                      {diet}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-sage">${item.price}</span>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="bg-sage text-white px-4 py-2 rounded-lg hover:bg-sage/90 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
