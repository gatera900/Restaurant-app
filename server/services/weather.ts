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

export async function getCurrentWeather(location: string = "Green Hills, CA"): Promise<WeatherData> {
  try {
    // Using OpenWeatherMap API
    const apiKey = process.env.OPENWEATHER_API_KEY || process.env.WEATHER_API_KEY || "default_key";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=imperial`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Get 7-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${apiKey}&units=imperial`
    );

    let forecast = [];
    if (forecastResponse.ok) {
      const forecastData = await forecastResponse.json();
      // Process forecast data to get daily forecasts
      const dailyForecasts = new Map();
      
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        if (!dailyForecasts.has(day) && dailyForecasts.size < 7) {
          dailyForecasts.set(day, {
            day,
            temp: Math.round(item.main.temp),
            condition: item.weather[0].main,
            icon: getWeatherIcon(item.weather[0].main)
          });
        }
      });

      forecast = Array.from(dailyForecasts.values());
    }

    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      forecast
    };
  } catch (error) {
    console.error("Weather API error:", error);
    // Return default weather data if API fails
    return {
      temperature: 75,
      humidity: 65,
      condition: "Clear",
      forecast: [
        { day: "Mon", temp: 73, condition: "Sunny", icon: "fas fa-sun" },
        { day: "Tue", temp: 68, condition: "Rain", icon: "fas fa-cloud-rain" },
        { day: "Wed", temp: 76, condition: "Sunny", icon: "fas fa-sun" },
        { day: "Thu", temp: 79, condition: "Sunny", icon: "fas fa-sun" },
        { day: "Fri", temp: 72, condition: "Cloudy", icon: "fas fa-cloud" },
        { day: "Sat", temp: 77, condition: "Sunny", icon: "fas fa-sun" },
        { day: "Sun", temp: 80, condition: "Sunny", icon: "fas fa-sun" }
      ]
    };
  }
}

function getWeatherIcon(condition: string): string {
  const iconMap: { [key: string]: string } = {
    'Clear': 'fas fa-sun',
    'Clouds': 'fas fa-cloud',
    'Rain': 'fas fa-cloud-rain',
    'Drizzle': 'fas fa-cloud-rain',
    'Thunderstorm': 'fas fa-bolt',
    'Snow': 'fas fa-snowflake',
    'Mist': 'fas fa-smog',
    'Fog': 'fas fa-smog'
  };
  
  return iconMap[condition] || 'fas fa-cloud';
}

export async function getGrowingConditions(): Promise<{
  soilMoisture: number;
  sunlightHours: number;
  growthRate: number;
}> {
  // Simulate soil and growing conditions based on weather
  const weather = await getCurrentWeather();
  
  return {
    soilMoisture: Math.max(50, Math.min(90, 85 - (weather.temperature - 70) * 2)),
    sunlightHours: weather.condition === 'Clear' ? 8.5 : weather.condition === 'Clouds' ? 6.0 : 4.0,
    growthRate: Math.max(60, Math.min(95, 85 + (weather.humidity - 50) / 10))
  };
}
