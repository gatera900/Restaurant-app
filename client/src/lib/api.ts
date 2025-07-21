import { apiRequest } from "./queryClient";

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  allergens: string[];
  dietary: string[];
  imageUrl?: string;
  available: boolean;
  seasonalScore: number;
  popularityScore: number;
}

export interface Order {
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

export interface OrderItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  customizations?: string;
}

export interface FarmStats {
  id: number;
  farmName: string;
  location: string;
  distance: number;
  cropType: string;
  freshness: number;
  organic: boolean;
  lastHarvest?: string;
  lastDelivery?: string;
  weatherConditions?: WeatherData;
  growthRate: number;
  soilMoisture: number;
  sunlightHours: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
    icon: string;
  }>;
}

export interface Review {
  id: number;
  userId?: number;
  orderId?: number;
  rating: number;
  comment?: string;
  sentiment?: number;
  sentimentConfidence?: number;
  createdAt: string;
}

export interface ChatMessage {
  id: number;
  sessionId: string;
  message: string;
  isBot: boolean;
  timestamp: string;
}

// Menu API
export const menuApi = {
  getAll: () => apiRequest("GET", "/api/menu"),
  getByCategory: (category: string) => apiRequest("GET", `/api/menu?category=${category}`),
  getById: (id: number) => apiRequest("GET", `/api/menu/${id}`),
  create: (item: Omit<MenuItem, 'id'>) => apiRequest("POST", "/api/menu", item),
  update: (id: number, updates: Partial<MenuItem>) => apiRequest("PUT", `/api/menu/${id}`, updates),
  delete: (id: number) => apiRequest("DELETE", `/api/menu/${id}`),
};

// Order API
export const orderApi = {
  getAll: () => apiRequest("GET", "/api/orders"),
  getByUser: (userId: number) => apiRequest("GET", `/api/orders?userId=${userId}`),
  getById: (id: number) => apiRequest("GET", `/api/orders/${id}`),
  create: (order: Omit<Order, 'id' | 'createdAt' | 'completedAt'>) => apiRequest("POST", "/api/orders", order),
  updateStatus: (id: number, status: string) => apiRequest("PUT", `/api/orders/${id}/status`, { status }),
};

// Farm Stats API
export const farmApi = {
  getStats: () => apiRequest("GET", "/api/farm-stats"),
  getStatsByType: (cropType: string) => apiRequest("GET", `/api/farm-stats?cropType=${cropType}`),
  getWeather: () => apiRequest("GET", "/api/farm-stats/weather"),
  getConditions: () => apiRequest("GET", "/api/farm-stats/conditions"),
};

// AI API
export const aiApi = {
  getRecommendations: (userId: number, preferences: any, orderHistory: any[]) =>
    apiRequest("POST", "/api/ai/recommendations", { userId, preferences, orderHistory }),
  getCropInsights: () => apiRequest("POST", "/api/ai/crop-insights"),
  predictDemand: () => apiRequest("POST", "/api/ai/predict-demand"),
};

// Review API
export const reviewApi = {
  getAll: () => apiRequest("GET", "/api/reviews"),
  getByOrder: (orderId: number) => apiRequest("GET", `/api/reviews?orderId=${orderId}`),
  create: (review: Omit<Review, 'id' | 'createdAt' | 'sentiment' | 'sentimentConfidence'>) =>
    apiRequest("POST", "/api/reviews", review),
};

// Chat API
export const chatApi = {
  getMessages: (sessionId: string) => apiRequest("GET", `/api/chat/${sessionId}`),
  sendMessage: (sessionId: string, message: string) =>
    apiRequest("POST", "/api/chat", { sessionId, message }),
};

// Analytics API
export const analyticsApi = {
  getPopularItems: () => apiRequest("GET", "/api/analytics/popular-items"),
  getRevenue: () => apiRequest("GET", "/api/analytics/revenue"),
};
