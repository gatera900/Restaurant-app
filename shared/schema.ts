import { pgTable, text, serial, integer, boolean, timestamp, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"), // customer, admin
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  category: text("category").notNull(), // starters, mains, desserts, beverages
  ingredients: text("ingredients").array(),
  allergens: text("allergens").array(),
  dietary: text("dietary").array(), // vegetarian, vegan, gluten-free, organic
  imageUrl: text("image_url"),
  available: boolean("available").default(true),
  seasonalScore: real("seasonal_score").default(0),
  popularityScore: real("popularity_score").default(0),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  status: text("status").notNull().default("pending"), // pending, confirmed, preparing, ready, completed, cancelled
  total: real("total").notNull(),
  items: json("items").$type<OrderItem[]>().notNull(),
  specialInstructions: text("special_instructions"),
  estimatedTime: integer("estimated_time"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const farmStats = pgTable("farm_stats", {
  id: serial("id").primaryKey(),
  farmName: text("farm_name").notNull(),
  location: text("location").notNull(),
  distance: real("distance").notNull(), // miles from restaurant
  cropType: text("crop_type").notNull(),
  freshness: real("freshness").notNull(), // percentage
  organic: boolean("organic").default(true),
  lastHarvest: timestamp("last_harvest"),
  lastDelivery: timestamp("last_delivery"),
  weatherConditions: json("weather_conditions").$type<WeatherData>(),
  growthRate: real("growth_rate").default(0),
  soilMoisture: real("soil_moisture").default(0),
  sunlightHours: real("sunlight_hours").default(0),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  orderId: integer("order_id"),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  sentiment: real("sentiment"), // AI-analyzed sentiment score
  sentimentConfidence: real("sentiment_confidence"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  type: text("type").notNull(), // menu, order, seasonal
  recommendations: json("recommendations").$type<any[]>().notNull(),
  confidence: real("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  message: text("message").notNull(),
  isBot: boolean("is_bot").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Type definitions
export type OrderItem = {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  customizations?: string;
};

export type WeatherData = {
  temperature: number;
  humidity: number;
  condition: string;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
    icon: string;
  }>;
};

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertFarmStatsSchema = createInsertSchema(farmStats).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  sentiment: true,
  sentimentConfidence: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type FarmStats = typeof farmStats.$inferSelect;
export type InsertFarmStats = z.infer<typeof insertFarmStatsSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type AIRecommendation = typeof aiRecommendations.$inferSelect;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
