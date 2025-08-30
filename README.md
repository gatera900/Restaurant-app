# 🍽️ BiteHarvest - Farm-to-Table Restaurant Management System

A modern, full-stack web application that connects local farmers with food lovers through a beautiful, responsive interface. BiteHarvest manages the entire farm-to-table experience from menu planning to order fulfillment.

## ✨ Features

### 🥗 **Menu Management**

- **Dynamic Menu Display**: Real-time menu with seasonal items
- **Category Filtering**: Browse by starters, mains, desserts, and beverages
- **High-Quality Images**: Beautiful food photography with fallback emojis
- **Dietary Information**: Allergen warnings and dietary preferences
- **Seasonal Scoring**: Freshness indicators for each dish

### 🛒 **Order System**

- **Shopping Cart**: Add items with quantity management
- **Order Tracking**: Real-time status updates
- **User Management**: Customer accounts and order history
- **Payment Integration**: Ready for payment gateway integration

### 🌾 **Farm Integration**

- **Farm Statistics**: Real-time crop monitoring
- **Weather Data**: Local weather conditions and forecasts
- **Freshness Tracking**: Harvest-to-delivery timing
- **Sustainability Metrics**: Organic certification and practices

### 🤖 **AI-Powered Features**

- **Menu Recommendations**: Personalized suggestions based on preferences
- **Sentiment Analysis**: Customer review analysis
- **Demand Prediction**: Order forecasting for better planning
- **Chatbot Support**: AI-powered customer service

### 🎨 **Modern UI/UX**

- **Responsive Design**: Works on all devices
- **Beautiful Animations**: Smooth transitions and hover effects
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Dark/Light Mode**: Theme switching capability

## 🏗️ Architecture

### **Frontend**

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Wouter** for routing
- **React Query** for state management
- **Framer Motion** for animations

### **Backend**

- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **PostgreSQL** database (with in-memory fallback)

### **Development Tools**

- **Vite** for fast development and building
- **ESBuild** for server bundling
- **Cross-env** for cross-platform compatibility
- **Hot reload** for both frontend and backend

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (optional - uses in-memory storage by default)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd BiteHarvest
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:5000](http://localhost:5000)

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration (optional)
DATABASE_URL=postgresql://username:password@localhost:5432/biteharvest

# OpenAI Configuration (optional - for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Weather API Configuration (optional - for weather features)
WEATHER_API_KEY=your_weather_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 📁 Project Structure

```
BiteHarvest/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── lib/           # Utility functions
│   │   └── hooks/         # Custom React hooks
│   └── index.html         # HTML template
├── server/                 # Express backend
│   ├── services/          # Business logic services
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage layer
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schemas and types
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🛠️ Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production
- **`npm run start`** - Start production server
- **`npm run check`** - TypeScript type checking
- **`npm run db:push`** - Push database schema changes

## 🌐 API Endpoints

### Menu Management

- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get specific menu item
- `POST /api/menu` - Create new menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get specific order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status

### Farm Statistics

- `GET /api/farm-stats` - Get farm performance data
- `GET /api/farm-stats/:type` - Get stats by crop type

### User Management

- `GET /api/users/:id` - Get user profile
- `POST /api/users` - Create user account
- `PUT /api/users/:id` - Update user profile

## 🎯 Key Features in Detail

### **Smart Image Handling**

- Automatic fallback to emojis if images fail to load
- Loading states with smooth transitions
- Optimized image URLs with quality parameters
- Responsive image sizing

### **Real-time Data**

- Live menu updates
- Dynamic pricing
- Seasonal availability tracking
- Real-time order status

### **Responsive Design**

- Mobile-first approach
- Touch-friendly interfaces
- Adaptive layouts for all screen sizes
- Progressive enhancement

## 🔧 Development

### Adding New Features

1. Create components in `client/src/components/`
2. Add pages in `client/src/pages/`
3. Update API routes in `server/routes.ts`
4. Add types to `shared/schema.ts`

### Database Changes

1. Update schemas in `shared/schema.ts`
2. Run `npm run db:push` to apply changes
3. Update storage layer in `server/storage.ts`

### Styling

- Use Tailwind CSS classes
- Follow the established color scheme (sage, charcoal)
- Maintain consistent spacing and typography
- Add hover states and transitions

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Setup

- Set `NODE_ENV=production`
- Configure `DATABASE_URL` for production database
- Set up environment variables for API keys
- Configure reverse proxy (nginx) if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Unsplash** for beautiful food photography
- **Tailwind CSS** for the amazing utility-first CSS framework
- **React Team** for the incredible frontend library
- **Express.js** for the robust backend framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Review the documentation
3. Create a new issue with detailed information

---

**BiteHarvest** - Bringing farm-fresh goodness to your table, one bite at a time! 🌱🍽️
