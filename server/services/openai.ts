import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function generateMenuRecommendations(userPreferences: any, orderHistory: any[]): Promise<{
  recommendations: any[],
  confidence: number
}> {
  try {
    const prompt = `Based on the following user preferences and order history, recommend 3-5 menu items from a farm-to-table restaurant. 

User Preferences: ${JSON.stringify(userPreferences)}
Order History: ${JSON.stringify(orderHistory)}

Consider dietary restrictions, past orders, seasonal ingredients, and flavor preferences. Respond with JSON in this format:
{
  "recommendations": [
    {
      "itemId": number,
      "name": "string",
      "reason": "string explaining why this is recommended",
      "confidence": number between 0-1
    }
  ],
  "overallConfidence": number between 0-1
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI sommelier and menu expert for a farm-to-table restaurant. Provide personalized menu recommendations based on user data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      recommendations: result.recommendations || [],
      confidence: result.overallConfidence || 0.5
    };
  } catch (error) {
    console.error("OpenAI menu recommendations error:", error);
    return {
      recommendations: [],
      confidence: 0
    };
  }
}

export async function analyzeReviewSentiment(reviewText: string): Promise<{
  sentiment: number,
  confidence: number
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Analyze the sentiment of restaurant reviews and provide a sentiment score from -1 (very negative) to 1 (very positive) and a confidence score between 0 and 1. Respond with JSON in this format: { 'sentiment': number, 'confidence': number }"
        },
        {
          role: "user",
          content: reviewText
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      sentiment: Math.max(-1, Math.min(1, result.sentiment || 0)),
      confidence: Math.max(0, Math.min(1, result.confidence || 0))
    };
  } catch (error) {
    console.error("OpenAI sentiment analysis error:", error);
    return {
      sentiment: 0,
      confidence: 0
    };
  }
}

export async function generateCropInsights(farmData: any, weatherData: any): Promise<{
  insights: string[],
  predictions: any[],
  recommendations: string[]
}> {
  try {
    const prompt = `Analyze the following farm and weather data to provide agricultural insights, growth predictions, and recommendations:

Farm Data: ${JSON.stringify(farmData)}
Weather Data: ${JSON.stringify(weatherData)}

Provide insights about crop health, optimal harvest times, and sustainability recommendations. Respond with JSON in this format:
{
  "insights": ["string array of key insights"],
  "predictions": [
    {
      "crop": "string",
      "prediction": "string",
      "timeframe": "string",
      "confidence": number
    }
  ],
  "recommendations": ["string array of actionable recommendations"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an agricultural AI expert specializing in sustainable farming and crop optimization for farm-to-table operations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      insights: result.insights || [],
      predictions: result.predictions || [],
      recommendations: result.recommendations || []
    };
  } catch (error) {
    console.error("OpenAI crop insights error:", error);
    return {
      insights: [],
      predictions: [],
      recommendations: []
    };
  }
}

export async function handleChatbotQuery(message: string, context: any): Promise<string> {
  try {
    const systemPrompt = `You are a helpful AI assistant for Bite, a farm-to-table restaurant. You can help customers with:
- Menu questions and recommendations
- Order status and tracking
- Restaurant hours and location
- Farm information and sustainability practices
- Dietary restrictions and allergen information
- General customer service

Restaurant Context:
- Name: Bite
- Type: Farm-to-table restaurant
- Hours: Mon-Thu 11AM-9PM, Fri-Sat 11AM-10PM, Sun 10AM-8PM
- Location: 123 Farm Valley Road, Green Hills, CA 94025
- Phone: (555) 123-BITE
- Specializes in locally sourced, organic ingredients

Be friendly, helpful, and knowledgeable. If you can't answer something, direct them to call the restaurant.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your request. Please try again or call our restaurant at (555) 123-BITE.";
  } catch (error) {
    console.error("OpenAI chatbot error:", error);
    return "I'm experiencing technical difficulties. Please call our restaurant at (555) 123-BITE for assistance.";
  }
}

export async function predictOrderDemand(historicalOrders: any[], weatherData: any, seasonalFactors: any): Promise<{
  predictions: any[],
  insights: string[]
}> {
  try {
    const prompt = `Analyze historical order data, weather conditions, and seasonal factors to predict future order demand:

Historical Orders: ${JSON.stringify(historicalOrders.slice(-50))} // Last 50 orders
Weather Data: ${JSON.stringify(weatherData)}
Seasonal Factors: ${JSON.stringify(seasonalFactors)}

Predict demand for different menu categories and provide insights. Respond with JSON in this format:
{
  "predictions": [
    {
      "category": "string",
      "predictedDemand": "high/medium/low",
      "confidence": number,
      "reasoning": "string"
    }
  ],
  "insights": ["string array of demand insights"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a predictive analytics expert for restaurant operations, specializing in demand forecasting for farm-to-table establishments."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      predictions: result.predictions || [],
      insights: result.insights || []
    };
  } catch (error) {
    console.error("OpenAI demand prediction error:", error);
    return {
      predictions: [],
      insights: []
    };
  }
}
