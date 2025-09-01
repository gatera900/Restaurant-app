import React, { useState, useEffect } from 'react';

interface FarmStats {
  id: number;
  farmName: string;
  location: string;
  distance: number;
  cropType: string;
  freshness: number;
  organic: boolean;
  lastHarvest?: string;
  lastDelivery?: string;
  growthRate: number;
  soilMoisture: number;
  sunlightHours: number;
}

export default function FarmStats() {
  const [farmStats, setFarmStats] = useState<FarmStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmStats();
  }, []);

  const fetchFarmStats = async () => {
    try {
      const response = await fetch('/api/farm-stats');
      if (response.ok) {
        const data = await response.json();
        setFarmStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch farm stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const averageFreshness = farmStats.length > 0 
    ? Math.round(farmStats.reduce((sum, farm) => sum + farm.freshness, 0) / farmStats.length)
    : 95;

  const organicFarms = farmStats.filter(farm => farm.organic).length;
  const averageDistance = farmStats.length > 0
    ? Math.round(farmStats.reduce((sum, farm) => sum + farm.distance, 0) / farmStats.length)
    : 24;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-green-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto"></div>
            <p className="mt-4 text-charcoal">Loading farm statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-sage mb-8 text-center">Farm Statistics</h1>
        
        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-charcoal mb-4">Local Farms</h3>
            <p className="text-3xl font-bold text-sage">{farmStats.length}</p>
            <p className="text-gray-600">Active partnerships</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-charcoal mb-4">Freshness Score</h3>
            <p className="text-3xl font-bold text-sage">{averageFreshness}%</p>
            <p className="text-gray-600">Average ingredient freshness</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-charcoal mb-4">Organic Farms</h3>
            <p className="text-3xl font-bold text-sage">{organicFarms}</p>
            <p className="text-gray-600">Certified organic</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-charcoal mb-4">Avg Distance</h3>
            <p className="text-3xl font-bold text-sage">{averageDistance}mi</p>
            <p className="text-gray-600">From farm to table</p>
          </div>
        </div>

        {/* Individual Farm Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmStats.map((farm) => (
            <div key={farm.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-charcoal">{farm.farmName}</h3>
                  <p className="text-gray-600">{farm.location}</p>
                </div>
                {farm.organic && (
                  <span className="bg-sage/20 text-sage text-xs px-2 py-1 rounded-full">
                    Organic
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Crop Type:</span>
                  <span className="font-medium text-charcoal">{farm.cropType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Freshness:</span>
                  <span className="font-medium text-sage">{farm.freshness}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium text-charcoal">{farm.distance} miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Rate:</span>
                  <span className="font-medium text-sage">{farm.growthRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Soil Moisture:</span>
                  <span className="font-medium text-charcoal">{farm.soilMoisture}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunlight:</span>
                  <span className="font-medium text-charcoal">{farm.sunlightHours}h/day</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
