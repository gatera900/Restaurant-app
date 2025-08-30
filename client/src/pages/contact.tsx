import React from 'react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-sage mb-8 text-center">Contact Us</h1>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-charcoal mb-4">Get in Touch</h3>
              <p className="text-gray-600 mb-4">
                Have questions about our farm-to-table approach? Want to learn more about our local partnerships?
              </p>
              <div className="space-y-2">
                <p className="text-charcoal"><strong>Email:</strong> info@biteharvest.com</p>
                <p className="text-charcoal"><strong>Phone:</strong> (555) 123-4567</p>
                <p className="text-charcoal"><strong>Address:</strong> 123 Farm Road, Local City</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-charcoal mb-4">Send a Message</h3>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sage"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sage"
                />
                <textarea 
                  placeholder="Your Message" 
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sage"
                ></textarea>
                <button className="w-full bg-sage text-white py-3 rounded-lg font-semibold hover:bg-sage/90 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
