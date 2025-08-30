import {
  users,
  menuItems,
  orders,
  farmStats,
  reviews,
  aiRecommendations,
  chatMessages,
  type User,
  type InsertUser,
  type MenuItem,
  type InsertMenuItem,
  type Order,
  type InsertOrder,
  type FarmStats,
  type InsertFarmStats,
  type Review,
  type InsertReview,
  type AIRecommendation,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";

// Check if we have database connection
const hasDatabase = process.env.DATABASE_URL;

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(
    id: number,
    updates: Partial<MenuItem>
  ): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Farm Stats
  getFarmStats(): Promise<FarmStats[]>;
  getFarmStatsByType(cropType: string): Promise<FarmStats[]>;
  createFarmStats(stats: InsertFarmStats): Promise<FarmStats>;
  updateFarmStats(
    id: number,
    updates: Partial<FarmStats>
  ): Promise<FarmStats | undefined>;

  // Reviews
  getReviews(): Promise<Review[]>;
  getReviewsByOrder(orderId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // AI Recommendations
  getRecommendations(userId: number, type: string): Promise<AIRecommendation[]>;
  createRecommendation(
    recommendation: Omit<AIRecommendation, "id" | "createdAt">
  ): Promise<AIRecommendation>;

  // Chat Messages
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private menuItems: Map<number, MenuItem> = new Map();
  private orders: Map<number, Order> = new Map();
  private farmStats: Map<number, FarmStats> = new Map();
  private reviews: Map<number, Review> = new Map();
  private aiRecommendations: Map<number, AIRecommendation> = new Map();
  private chatMessages: Map<number, ChatMessage> = new Map();

  private currentUserId = 1;
  private currentMenuItemId = 1;
  private currentOrderId = 1;
  private currentFarmStatsId = 1;
  private currentReviewId = 1;
  private currentRecommendationId = 1;
  private currentChatMessageId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample menu items
    const sampleMenuItems: MenuItem[] = [
      {
        id: 1,
        name: "Garden Fresh Salad",
        description:
          "Mixed greens with seasonal vegetables, goat cheese, and herb vinaigrette",
        price: 14,
        category: "mains",
        ingredients: [
          "mixed greens",
          "goat cheese",
          "cherry tomatoes",
          "cucumber",
          "herb vinaigrette",
        ],
        allergens: ["dairy"],
        dietary: ["vegetarian", "gluten-free", "organic"],
        imageUrl:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
        available: true,
        seasonalScore: 0.95,
        popularityScore: 0.85,
      },
      {
        id: 2,
        name: "Herb Crusted Salmon",
        description:
          "Wild-caught salmon with roasted root vegetables and lemon herb sauce",
        price: 24,
        category: "mains",
        ingredients: [
          "wild salmon",
          "root vegetables",
          "herbs",
          "lemon",
          "olive oil",
        ],
        allergens: ["fish"],
        dietary: ["gluten-free", "high-protein"],
        imageUrl:
          "https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
        available: true,
        seasonalScore: 0.88,
        popularityScore: 0.92,
      },
      {
        id: 3,
        name: "Seasonal Vegetable Soup",
        description:
          "Daily changing soup made with seasonal vegetables and herbs",
        price: 9,
        category: "starters",
        ingredients: ["seasonal vegetables", "vegetable broth", "fresh herbs"],
        allergens: [],
        dietary: ["vegan", "gluten-free", "organic"],
        imageUrl:
          "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
        available: true,
        seasonalScore: 1.0,
        popularityScore: 0.78,
      },
      {
        id: 4,
        name: "Farm Apple Pie",
        description:
          "Made with apples from our orchard partners, served with vanilla cream",
        price: 8,
        category: "desserts",
        ingredients: ["local apples", "pastry", "vanilla cream", "cinnamon"],
        allergens: ["gluten", "dairy", "eggs"],
        dietary: ["vegetarian"],
        imageUrl:
          "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
        available: true,
        seasonalScore: 0.92,
        popularityScore: 0.88,
      },
      {
        id: 5,
        name: "Fresh Pressed Juice",
        description:
          "Daily selection of fresh-pressed juices from local fruits",
        price: 6,
        category: "beverages",
        ingredients: ["seasonal fruits"],
        allergens: [],
        dietary: ["vegan", "gluten-free", "organic"],
        imageUrl:
          "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
        available: true,
        seasonalScore: 0.98,
        popularityScore: 0.75,
      },
      {
        id: 6,
        name: "Farm Burger",
        description:
          "Grass-fed beef with local cheese, greens, and house-made bun",
        price: 18,
        category: "mains",
        ingredients: [
          "grass-fed beef",
          "local cheese",
          "greens",
          "house-made bun",
        ],
        allergens: ["gluten", "dairy"],
        dietary: ["grass-fed"],
        imageUrl:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
        available: true,
        seasonalScore: 0.85,
        popularityScore: 0.95,
      },
    ];

    sampleMenuItems.forEach((item) => {
      this.menuItems.set(item.id, item);
      this.currentMenuItemId = Math.max(this.currentMenuItemId, item.id + 1);
    });

    // Initialize farm stats
    const sampleFarmStats: FarmStats[] = [
      {
        id: 1,
        farmName: "Valley Green Farm",
        location: "15 miles north",
        distance: 15,
        cropType: "Leafy Greens",
        freshness: 97,
        organic: true,
        lastHarvest: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        lastDelivery: new Date(),
        weatherConditions: {
          temperature: 75,
          humidity: 65,
          condition: "Clear",
          forecast: [],
        },
        growthRate: 92,
        soilMoisture: 78,
        sunlightHours: 8.5,
      },
      {
        id: 2,
        farmName: "Hillside Harvest",
        location: "22 miles east",
        distance: 22,
        cropType: "Root Vegetables",
        freshness: 93,
        organic: true,
        lastHarvest: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        lastDelivery: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        weatherConditions: {
          temperature: 72,
          humidity: 70,
          condition: "Partly Cloudy",
          forecast: [],
        },
        growthRate: 88,
        soilMoisture: 82,
        sunlightHours: 7.5,
      },
      {
        id: 3,
        farmName: "Garden Farm",
        location: "8 miles south",
        distance: 8,
        cropType: "Herbs",
        freshness: 99,
        organic: true,
        lastHarvest: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        lastDelivery: new Date(),
        weatherConditions: {
          temperature: 78,
          humidity: 60,
          condition: "Sunny",
          forecast: [],
        },
        growthRate: 95,
        soilMoisture: 75,
        sunlightHours: 9.0,
      },
      {
        id: 4,
        farmName: "Sunset Orchard",
        location: "35 miles west",
        distance: 35,
        cropType: "Tree Fruits",
        freshness: 91,
        organic: true,
        lastHarvest: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
        lastDelivery: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        weatherConditions: {
          temperature: 73,
          humidity: 68,
          condition: "Clear",
          forecast: [],
        },
        growthRate: 85,
        soilMoisture: 80,
        sunlightHours: 8.0,
      },
    ];

    sampleFarmStats.forEach((stats) => {
      this.farmStats.set(stats.id, stats);
      this.currentFarmStatsId = Math.max(this.currentFarmStatsId, stats.id + 1);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Menu item methods
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      (item) => item.category === category
    );
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const item: MenuItem = { ...insertItem, id };
    this.menuItems.set(id, item);
    return item;
  }

  async updateMenuItem(
    id: number,
    updates: Partial<MenuItem>
  ): Promise<MenuItem | undefined> {
    const item = this.menuItems.get(id);
    if (!item) return undefined;

    const updatedItem = { ...item, ...updates };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
      completedAt: null,
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(
    id: number,
    status: string
  ): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder = {
      ...order,
      status,
      completedAt: status === "completed" ? new Date() : order.completedAt,
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Farm stats methods
  async getFarmStats(): Promise<FarmStats[]> {
    return Array.from(this.farmStats.values());
  }

  async getFarmStatsByType(cropType: string): Promise<FarmStats[]> {
    return Array.from(this.farmStats.values()).filter(
      (stats) => stats.cropType === cropType
    );
  }

  async createFarmStats(insertStats: InsertFarmStats): Promise<FarmStats> {
    const id = this.currentFarmStatsId++;
    const stats: FarmStats = { ...insertStats, id };
    this.farmStats.set(id, stats);
    return stats;
  }

  async updateFarmStats(
    id: number,
    updates: Partial<FarmStats>
  ): Promise<FarmStats | undefined> {
    const stats = this.farmStats.get(id);
    if (!stats) return undefined;

    const updatedStats = { ...stats, ...updates };
    this.farmStats.set(id, updatedStats);
    return updatedStats;
  }

  // Review methods
  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async getReviewsByOrder(orderId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.orderId === orderId
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date(),
      sentiment: null,
      sentimentConfidence: null,
    };
    this.reviews.set(id, review);
    return review;
  }

  // AI Recommendations methods
  async getRecommendations(
    userId: number,
    type: string
  ): Promise<AIRecommendation[]> {
    return Array.from(this.aiRecommendations.values()).filter(
      (rec) => rec.userId === userId && rec.type === type
    );
  }

  async createRecommendation(
    recommendation: Omit<AIRecommendation, "id" | "createdAt">
  ): Promise<AIRecommendation> {
    const id = this.currentRecommendationId++;
    const rec: AIRecommendation = {
      ...recommendation,
      id,
      createdAt: new Date(),
    };
    this.aiRecommendations.set(id, rec);
    return rec;
  }

  // Chat methods
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((msg) => msg.sessionId === sessionId)
      .sort(
        (a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0)
      );
  }

  async createChatMessage(
    insertMessage: InsertChatMessage
  ): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
