import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertMenuItemSchema, insertOrderSchema, insertReviewSchema, insertChatMessageSchema } from "@shared/schema";
import { generateMenuRecommendations, analyzeReviewSentiment, generateCropInsights, handleChatbotQuery, predictOrderDemand } from "./services/openai";
import { getCurrentWeather, getGrowingConditions } from "./services/weather";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Menu routes
  app.get("/api/menu", async (req, res) => {
    try {
      const category = req.query.category as string;
      const items = category 
        ? await storage.getMenuItemsByCategory(category)
        : await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getMenuItem(id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });

  app.post("/api/menu", async (req, res) => {
    try {
      const validatedData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create menu item" });
    }
  });

  app.put("/api/menu/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const item = await storage.updateMenuItem(id, updates);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to update menu item" });
    }
  });

  app.delete("/api/menu/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMenuItem(id);
      if (!deleted) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json({ message: "Menu item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete menu item" });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const orders = userId 
        ? await storage.getOrdersByUser(parseInt(userId))
        : await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Farm stats routes
  app.get("/api/farm-stats", async (req, res) => {
    try {
      const cropType = req.query.cropType as string;
      const stats = cropType 
        ? await storage.getFarmStatsByType(cropType)
        : await storage.getFarmStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farm statistics" });
    }
  });

  app.get("/api/farm-stats/weather", async (req, res) => {
    try {
      const weather = await getCurrentWeather();
      res.json(weather);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  app.get("/api/farm-stats/conditions", async (req, res) => {
    try {
      const conditions = await getGrowingConditions();
      res.json(conditions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch growing conditions" });
    }
  });

  // AI-powered routes
  app.post("/api/ai/recommendations", async (req, res) => {
    try {
      const { userId, preferences, orderHistory } = req.body;
      const recommendations = await generateMenuRecommendations(preferences, orderHistory);
      
      // Store recommendations
      await storage.createRecommendation({
        userId,
        type: "menu",
        recommendations: recommendations.recommendations,
        confidence: recommendations.confidence
      });

      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  app.post("/api/ai/crop-insights", async (req, res) => {
    try {
      const farmData = await storage.getFarmStats();
      const weatherData = await getCurrentWeather();
      const insights = await generateCropInsights(farmData, weatherData);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate crop insights" });
    }
  });

  app.post("/api/ai/predict-demand", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      const weatherData = await getCurrentWeather();
      const seasonalFactors = { season: "spring", temperature: weatherData.temperature };
      
      const predictions = await predictOrderDemand(orders, weatherData, seasonalFactors);
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ message: "Failed to predict demand" });
    }
  });

  // Review routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const orderId = req.query.orderId as string;
      const reviews = orderId 
        ? await storage.getReviewsByOrder(parseInt(orderId))
        : await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      
      // Analyze sentiment if comment exists
      if (review.comment) {
        const sentiment = await analyzeReviewSentiment(review.comment);
        // Update review with sentiment data (in a real app, you'd update the database)
        review.sentiment = sentiment.sentiment;
        review.sentimentConfidence = sentiment.confidence;
      }
      
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Chatbot routes
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { sessionId, message } = req.body;
      
      // Store user message
      await storage.createChatMessage({
        sessionId,
        message,
        isBot: false
      });

      // Generate bot response
      const botResponse = await handleChatbotQuery(message, {});
      
      // Store bot response
      await storage.createChatMessage({
        sessionId,
        message: botResponse,
        isBot: true
      });

      res.json({ response: botResponse });
    } catch (error) {
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/popular-items", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      const itemCounts = new Map<number, number>();
      
      orders.forEach(order => {
        order.items.forEach(item => {
          const count = itemCounts.get(item.menuItemId) || 0;
          itemCounts.set(item.menuItemId, count + item.quantity);
        });
      });

      const popularItems = Array.from(itemCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([itemId, count]) => ({ itemId, orderCount: count }));

      res.json(popularItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular items" });
    }
  });

  app.get("/api/analytics/revenue", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      const completedOrders = orders.filter(order => order.status === 'completed');
      
      const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
      const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
      
      res.json({
        totalRevenue,
        avgOrderValue,
        totalOrders: completedOrders.length,
        pendingOrders: orders.filter(order => order.status === 'pending').length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
