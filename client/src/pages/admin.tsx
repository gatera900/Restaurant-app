import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalMenuItems: number;
  totalFarms: number;
  todayOrders: number;
  pendingOrders: number;
}

export default function Admin() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalMenuItems: 0,
    totalFarms: 0,
    todayOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch data from multiple endpoints
      const [ordersRes, menuRes, farmRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/menu'),
        fetch('/api/farm-stats'),
      ]);

      const [orders, menuItems, farms] = await Promise.all([
        ordersRes.json(),
        menuRes.json(),
        farmRes.json(),
      ]);

      // Calculate stats
      const today = new Date().toDateString();
      const todayOrders = orders.filter((order: any) => 
        new Date(order.createdAt).toDateString() === today
      ).length;

      const pendingOrders = orders.filter((order: any) => 
        order.status === 'pending' || order.status === 'confirmed'
      ).length;

      const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalMenuItems: menuItems.length,
        totalFarms: farms.length,
        todayOrders,
        pendingOrders,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-green-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto"></div>
            <p className="mt-4 text-charcoal">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-sage mb-8 text-center">Admin Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-charcoal mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-sage">{stats.totalOrders}</p>
            <p className="text-sm text-gray-600">All time</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-charcoal mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-sage">${stats.totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Total earnings</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-charcoal mb-2">Today's Orders</h3>
            <p className="text-3xl font-bold text-sage">{stats.todayOrders}</p>
            <p className="text-sm text-gray-600">Orders today</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-charcoal mb-2">Pending Orders</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
            <p className="text-sm text-gray-600">Need attention</p>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🍽️</span>
              <h3 className="text-xl font-semibold text-charcoal">Menu Management</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Manage menu items, pricing, and availability. Current items: {stats.totalMenuItems}
            </p>
            <Link href="/menu">
              <button className="bg-sage text-white px-4 py-2 rounded-lg hover:bg-sage/90 transition-colors">
                Manage Menu
              </button>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">📋</span>
              <h3 className="text-xl font-semibold text-charcoal">Order Management</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View and update order statuses. Pending orders: {stats.pendingOrders}
            </p>
            <Link href="/orders">
              <button className="bg-sage text-white px-4 py-2 rounded-lg hover:bg-sage/90 transition-colors">
                View Orders
              </button>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🌾</span>
              <h3 className="text-xl font-semibold text-charcoal">Farm Statistics</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Monitor farm performance and metrics. Connected farms: {stats.totalFarms}
            </p>
            <Link href="/farm-stats">
              <button className="bg-sage text-white px-4 py-2 rounded-lg hover:bg-sage/90 transition-colors">
                View Stats
              </button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">📊</span>
              <h3 className="text-xl font-semibold text-charcoal">Analytics</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View detailed analytics and reports for business insights.
            </p>
            <button className="bg-sage text-white px-4 py-2 rounded-lg hover:bg-sage/90 transition-colors">
              View Analytics
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">👥</span>
              <h3 className="text-xl font-semibold text-charcoal">User Management</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Manage customer accounts, roles, and permissions.
            </p>
            <button className="bg-sage text-white px-4 py-2 rounded-lg hover:bg-sage/90 transition-colors">
              Manage Users
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">⚙️</span>
              <h3 className="text-xl font-semibold text-charcoal">Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Configure restaurant settings, payment methods, and notifications.
            </p>
            <button className="bg-sage text-white px-4 py-2 rounded-lg hover:bg-sage/90 transition-colors">
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
