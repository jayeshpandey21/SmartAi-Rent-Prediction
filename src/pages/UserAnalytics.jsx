import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * Analytics Dashboard Page
 * Features:
 * - Rent trend over months (Line Chart)
 * - Average rent by BHK (Bar Chart)
 * - Furnishing distribution (Pie Chart)
 * - City-wise rent comparison (Area Chart)
 * - Filters: City, BHK, Property Type
 * - Insights section
 */

// Mock data for analytics
const rentTrendData = [
  { month: 'Jan', avgRent: 18500, predictions: 120 },
  { month: 'Feb', avgRent: 19200, predictions: 145 },
  { month: 'Mar', avgRent: 18800, predictions: 162 },
  { month: 'Apr', avgRent: 20500, predictions: 189 },
  { month: 'May', avgRent: 21500, predictions: 210 },
  { month: 'Jun', avgRent: 22800, predictions: 245 },
  { month: 'Jul', avgRent: 23500, predictions: 278 },
  { month: 'Aug', avgRent: 24200, predictions: 312 },
  { month: 'Sep', avgRent: 23800, predictions: 298 },
  { month: 'Oct', avgRent: 24500, predictions: 334 },
  { month: 'Nov', avgRent: 25200, predictions: 367 },
  { month: 'Dec', avgRent: 25800, predictions: 398 }
];

const rentByBHKData = [
  { bhk: '1 BHK', avgRent: 12500, demand: 35, color: '#8B5CF6' },
  { bhk: '2 BHK', avgRent: 22000, demand: 45, color: '#06B6D4' },
  { bhk: '3 BHK', avgRent: 35000, demand: 15, color: '#EC4899' },
  { bhk: '4 BHK', avgRent: 52000, demand: 4, color: '#F59E0B' },
  { bhk: '5 BHK', avgRent: 75000, demand: 1, color: '#10B981' }
];

const furnishingData = [
  { name: 'Unfurnished', value: 25, color: '#6B7280' },
  { name: 'Semi-Furnished', value: 52, color: '#8B5CF6' },
  { name: 'Fully Furnished', value: 23, color: '#06B6D4' }
];

const cityRentComparisonData = [
  { city: 'Mumbai', rent: 45000, properties: 1250 },
  { city: 'Delhi', rent: 32000, properties: 980 },
  { city: 'Bangalore', rent: 38000, properties: 890 },
  { city: 'Pune', rent: 28000, properties: 650 },
  { city: 'Hyderabad', rent: 26000, properties: 580 },
  { city: 'Chennai', rent: 24000, properties: 520 },
  { city: 'Ahmedabad', rent: 18000, properties: 340 },
  { city: 'Kolkata', rent: 16000, properties: 420 }
];

const insights = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: '2 BHK Most Popular',
    description: '2BHK properties account for 45% of all rental searches and bookings.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'Semi-Furnished Dominates',
    description: '52% of renters prefer semi-furnished properties for the best value.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Rising Market Trends',
    description: 'Average rent increased by 18% compared to last year.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      </svg>
    ),
    title: 'Mumbai Leads',
    description: 'Mumbai has the highest average rent but also most active market.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20'
  }
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export default function UserAnalytics() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedBHK, setSelectedBHK] = useState('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');

  const filteredData = useMemo(() => {
    // In a real app, this would filter based on API data
    return {
      trend: rentTrendData,
      bhk: rentByBHKData,
      furnishing: furnishingData,
      cityComparison: cityRentComparisonData
    };
  }, [selectedCity, selectedBHK, selectedPropertyType]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Insights and trends from rental market data</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Cities</option>
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="bangalore">Bangalore</option>
              <option value="pune">Pune</option>
            </select>
            
            <select
              value={selectedBHK}
              onChange={(e) => setSelectedBHK(e.target.value)}
              className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
            >
              <option value="all">All BHK</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
            </select>
            
            <select
              value={selectedPropertyType}
              onChange={(e) => setSelectedPropertyType(e.target.value)}
              className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="flat">Flat</option>
              <option value="villa">Villa</option>
              <option value="house">Independent House</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Predictions', value: '3,456', change: '+12%', icon: '📊' },
          { label: 'Average Rent', value: formatCurrency(24500), change: '+8%', icon: '💰' },
          { label: 'Cities Covered', value: '12', change: '+2', icon: '🌍' },
          { label: 'User Satisfaction', value: '94%', change: '+3%', icon: '⭐' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-green-400 text-sm">{stat.change}</span>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Rent Trend Over Months */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Rent Trend Over Months</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={filteredData.trend}>
              <defs>
                <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tickFormatter={(value) => `₹${value / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => [formatCurrency(value), 'Avg Rent']}
              />
              <Area
                type="monotone"
                dataKey="avgRent"
                stroke="#8B5CF6"
                fillOpacity={1}
                fill="url(#colorRent)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Average Rent by BHK */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Average Rent by BHK</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData.bhk}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="bhk" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tickFormatter={(value) => `₹${value / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => [formatCurrency(value), 'Avg Rent']}
              />
              <Bar dataKey="avgRent" radius={[4, 4, 0, 0]}>
                {filteredData.bhk.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Furnishing Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Furnishing Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredData.furnishing}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {filteredData.furnishing.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* City-wise Rent Comparison */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">City-wise Rent Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData.cityComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
              <XAxis type="number" stroke="#9CA3AF" tickFormatter={(value) => `₹${value / 1000}k`} />
              <YAxis dataKey="city" type="category" stroke="#9CA3AF" width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => [formatCurrency(value), 'Avg Rent']}
              />
              <Bar dataKey="rent" fill="#06B6D4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Key Insights</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-dark-800/50 rounded-xl p-4 hover:bg-dark-700/50 transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl ${insight.bgColor} ${insight.color} flex items-center justify-center mb-3`}>
                {insight.icon}
              </div>
              <h4 className="text-white font-medium mb-1">{insight.title}</h4>
              <p className="text-gray-400 text-sm">{insight.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
