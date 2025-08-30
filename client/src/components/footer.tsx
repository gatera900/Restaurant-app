import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-sage mb-4" style={{ fontFamily: 'Dancing Script, cursive' }}>
              BiteHarvest
            </h3>
            <p className="text-gray-300">
              Farm-to-table dining experience with fresh, seasonal ingredients.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-sage transition-colors">Home</a></li>
              <li><a href="/menu" className="text-gray-300 hover:text-sage transition-colors">Menu</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-sage transition-colors">About</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-sage transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>123 Farm Road</p>
              <p>Local City, ST 12345</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@biteharvest.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 BiteHarvest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
