import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

/**
 * Market Trends Page
 * City-wise rent growth and market analysis
 */

const rentGrowthData = [
  { month: 'Jan', Mumbai: 42000, Delhi: 28000, Bangalore: 35000, Pune: 24000 },
  { month: 'Feb', Mumbai: 42500, Delhi: 28500, Bangalore: 35500, Pune: 24500 },
  { month: 'Mar', Mumbai: 43000, Delhi: 29000, Bangalore: 36000, Pune: 25000 },
  { month: 'Apr', Mumbai: 43500, Delhi: 29500, Bangalore: 36500, Pune: 25500 },
  { month: 'May', Mumbai: 44000, Delhi: 30000, Bangalore: 37000, Pune: 26000 },
  { month: 'Jun', Mumbai: 44500, Delhi: 30500, Bangalore: 37500, Pune: 26500 },
  { month: 'Jul', Mumbai: 45000, Delhi: 31000, Bangalore: 38000, Pune: 27000 },
  { month: 'Aug', Mumbai: 45500, Delhi: 31500, Bangalore: 38500, Pune: 27500 },
  { month: 'Sep', Mumbai: 46000, Delhi: 32000, Bangalore: 39000, Pune: 28000 },
  { month: 'Oct', Mumbai: 46500, Delhi: 32500, Bangalore: 39500, Pune: 28500 },
  { month: 'Nov', Mumbai: 47000, Delhi: 33000, Bangalore: 40000, Pune: 29000 },
  { month: 'Dec', Mumbai: 47500, Delhi: 33500, Bangalore: 40500, Pune: 29500 }
];

const demandSupplyData = [
  { city: 'Mumbai', demand: 85, supply: 45, trend: 'high' },
  { city: 'Bangalore', demand: 78, supply: 55, trend: 'high' },
  { city: 'Delhi', demand: 72, supply: 60, trend: 'medium' },
  { city: 'Pune', demand: 65, supply: 58, trend: 'medium' },
  { city: 'Hyderabad', demand: 68, supply: 52, trend: 'rising' },
  { city: 'Chennai', demand: 55, supply: 50, trend: 'stable' },
  { city: 'Ahmedabad', demand: 45, supply: 55, trend: 'stable' },
  { city: 'Kolkata', demand: 42, supply: 48, trend: 'low' }
];

const furnishingPopularity = [
  { type: 'Semi-Furnished', value: 52, color: '#8B5CF6' },
  { type: 'Fully Furnished', value: 28, color: '#06B6D4' },
  { type: 'Unfurnished', value: 20, color: '#6B7280' }
];

const investmentIndicators = [
  {
    city: 'Bangalore',
    score: 85,
    growth: '+15%',
    roi: '12%',
    recommendation: 'Strong rental demand with steady appreciation',
    trend: 'up'
  },
  {
    city: 'Hyderabad',
    score: 78,
    growth: '+12%',
    roi: '10%',
    recommendation: 'IT hub growth driving rental demand',
    trend: 'up'
  },
  {
    city: 'Pune',
    score: 72,
    growth: '+8%',
    roi: '8%',
    recommendation: 'Good for mid-term investments',
    trend: 'stable'
  },
  {
    city: 'Mumbai',
    score: 65,
    growth: '+6%',
    roi: '6%',
    recommendation: 'High entry cost but stable returns',
    trend: 'stable'
  },
  {
    city: 'Delhi',
    score: 60,
    growth: '+5%',
    roi: '5%',
    recommendation: 'Market saturation in some areas',
    trend: 'stable'
  }
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export default function UserTrends() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [timeRange, setTimeRange] = useState('1y');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Market Trends</h1>
              <p className="text-gray-400">City-wise rent growth and market analysis</p>
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Cities</option>
              <option value="mumbai">Mumbai</option>
              <option value="bangalore">Bangalore</option>
              <option value="delhi">Delhi</option>
              <option value="pune">Pune</option>
            </select>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
            >
              <option value="3m">3 Months</option>
              <option value="6m">6 Months</option>
              <option value="1y">1 Year</option>
              <option value="2y">2 Years</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Rent Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Rent Growth Over Time</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={rentGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={(value) => `₹${value / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
              formatter={(value) => [formatCurrency(value), '']}
            />
            <Legend />
            <Line type="monotone" dataKey="Mumbai" stroke="#8B5CF6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Delhi" stroke="#06B6D4" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Bangalore" stroke="#EC4899" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Pune" stroke="#10B981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Demand vs Supply */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Demand vs Supply by City</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demandSupplyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
              <XAxis type="number" stroke="#9CA3AF" domain={[0, 100]} />
              <YAxis dataKey="city" type="category" stroke="#9CA3AF" width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend />
              <Bar dataKey="demand" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Demand" />
              <Bar dataKey="supply" fill="#06B6D4" radius={[0, 4, 4, 0]} name="Supply" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Furnishing Popularity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Furnishing Popularity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={furnishingPopularity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="type" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${value}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => [`${value}%`, 'Popularity']}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {furnishingPopularity.map((entry, index) => (
                  <div key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Investment Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Investment Recommendation Indicators</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investmentIndicators.map((city, index) => (
            <motion.div
              key={city.city}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-5 bg-dark-800/50 rounded-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">{city.city}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  city.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                  city.trend === 'falling' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {city.trend === 'up' ? '↑ Growing' : '➡️ Stable'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-400">{city.score}</p>
                  <p className="text-xs text-gray-500">Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{city.growth}</p>
                  <p className="text-xs text-gray-500">Growth</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent-400">{city.roi}</p>
                  <p className="text-xs text-gray-500">ROI</p>
                </div>
              </div>

              <p className="text-gray-400 text-sm">{city.recommendation}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Market Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6 bg-gradient-to-r from-primary-500/10 to-accent-500/10"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💡</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Market Insights</h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-primary-400">•</span>
                <span>Bangalore and Hyderabad show the highest rental growth at 15% YoY, driven by IT sector expansion.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400">•</span>
                <span>Semi-furnished properties remain most popular (52%) across all major cities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400">•</span>
                <span>Mumbai has the highest demand-supply gap (85% demand vs 45% supply), indicating potential for rental growth.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400">•</span>
                <span>Pune emerging as a cost-effective alternative to Mumbai with 20% lower rents.</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
