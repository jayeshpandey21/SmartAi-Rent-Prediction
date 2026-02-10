import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * AI Insights Page
 * AI-generated insights for rental decisions
 */

const insights = [
  {
    type: 'best-value',
    icon: '💰',
    title: 'Best Value BHK',
    description: '2 BHK properties offer the best value for money in most Indian cities. They provide ample space at a reasonable price point.',
    recommendation: 'Consider 2 BHK for families of 3-4 members.',
    trend: 'up'
  },
  {
    type: 'overpriced',
    icon: '⚠️',
    title: 'Overpriced Detection',
    description: 'Properties listed 20% above AI predictions may be overvalued. These could be due to premium locations or unique features.',
    recommendation: 'Negotiate or look for similar properties nearby.',
    trend: 'down'
  },
  {
    type: 'underpriced',
    icon: '🎯',
    title: 'Underpriced Gems',
    description: 'Properties listed below AI predictions are rare opportunities. These may have hidden issues or be desperate rentals.',
    recommendation: 'Verify property condition before booking.',
    trend: 'up'
  },
  {
    type: 'market-trend',
    icon: '📈',
    title: 'Rising Markets',
    description: 'Bangalore and Hyderabad show 15% YoY rent growth, making them investment-friendly cities.',
    recommendation: 'Consider long-term leases in these cities.',
    trend: 'up'
  }
];

const budgetRecommendations = [
  {
    budget: '₹10,000 - ₹15,000',
    recommendation: 'Look in Tier-2 cities like Indore, Bhopal, or suburban areas of major cities. 1 BHK or shared accommodation works well.',
    cities: ['Indore', 'Bhopal', 'Jaipur', 'Chandigarh'],
    trend: 'stable'
  },
  {
    budget: '₹15,000 - ₹25,000',
    recommendation: 'Good options in most metro suburbs. 1-2 BHK available in Pune, Delhi NCR suburbs, and Chennai outskirts.',
    cities: ['Pune', 'Noida', 'Gurgaon', 'Hyderabad'],
    trend: 'rising'
  },
  {
    budget: '₹25,000 - ₹40,000',
    recommendation: 'Prime locations in metros. 2-3 BHK available in areas like Andheri (Mumbai), Whitefield (Bangalore).',
    cities: ['Mumbai', 'Bangalore', 'Delhi', 'Chennai'],
    trend: 'stable'
  },
  {
    budget: '₹40,000+',
    recommendation: 'Premium locations with top amenities. Villa or penthouse options available in upscale neighborhoods.',
    cities: ['Bandra', 'DLF Phase', 'Powai', 'Indiranagar'],
    trend: 'rising'
  }
];

const bhkAnalysis = [
  { name: '1 BHK', value: 35, color: '#8B5CF6', analysis: 'Best for singles, highest demand in metro suburbs' },
  { name: '2 BHK', value: 45, color: '#06B6D4', analysis: 'Best value, ideal for small families' },
  { name: '3 BHK', value: 15, color: '#EC4899', analysis: 'Premium segment, lower availability' },
  { name: '4+ BHK', value: 5, color: '#F59E0B', analysis: 'Luxury segment, niche market' }
];

const areaAnalysis = [
  { range: '300-500 sqft', recommendation: 'Ideal for singles, compact living', trend: 'high' },
  { range: '500-800 sqft', recommendation: 'Best seller category, suitable for couples', trend: 'very-high' },
  { range: '800-1200 sqft', recommendation: 'Family size, good for 2-3 members', trend: 'high' },
  { range: '1200+ sqft', recommendation: 'Premium, spacious living', trend: 'medium' }
];

export default function UserInsights() {
  const [selectedInsight, setSelectedInsight] = useState(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Insights</h1>
            <p className="text-gray-400">AI-generated recommendations for your rental decisions</p>
          </div>
        </div>
      </motion.div>

      {/* BHK Analysis Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid lg:grid-cols-2 gap-6"
      >
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">BHK Value Analysis</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bhkAnalysis}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bhkAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => [`${value}%`, 'Demand']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">AI Analysis Summary</h2>
          <div className="space-y-4">
            {bhkAnalysis.map((item, index) => (
              <div key={item.name} className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="text-white font-medium">{item.name} - {item.value}%</p>
                  <p className="text-gray-400 text-sm">{item.analysis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-6">Key AI Insights</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => setSelectedInsight(insight)}
              className={`p-5 rounded-xl cursor-pointer transition-all ${
                selectedInsight?.type === insight.type
                  ? 'bg-primary-500/20 border border-primary-500/50'
                  : 'bg-dark-800/50 hover:bg-dark-700/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">{insight.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      insight.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {insight.trend === 'up' ? '↑ Rising' : '↓ Falling'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{insight.description}</p>
                  <div className="mt-3 p-3 bg-dark-900/50 rounded-lg">
                    <p className="text-primary-400 text-sm">
                      <span className="font-medium">💡 Recommendation:</span> {insight.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Budget Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-6">Budget-Based Recommendations</h2>
        <div className="space-y-4">
          {budgetRecommendations.map((item, index) => (
            <motion.div
              key={item.budget}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-5 bg-dark-800/50 rounded-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">{item.budget}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.trend === 'rising' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {item.trend === 'rising' ? '📈 Rising' : '➡️ Stable'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{item.recommendation}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.cities.map((city) => (
                      <span key={city} className="px-2 py-1 bg-dark-700 rounded-lg text-xs text-gray-300">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Area Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-6">Area-Based Insights</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {areaAnalysis.map((item, index) => (
            <motion.div
              key={item.range}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-4 bg-dark-800/50 rounded-xl text-center"
            >
              <h3 className="text-white font-medium mb-2">{item.range}</h3>
              <p className="text-gray-400 text-sm mb-3">{item.recommendation}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.trend === 'very-high' ? 'bg-green-500/20 text-green-400' :
                item.trend === 'high' ? 'bg-blue-500/20 text-blue-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {item.trend === 'very-high' ? '🔥 Very High Demand' :
                 item.trend === 'high' ? '📈 High Demand' : '➡️ Moderate Demand'}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Natural Language Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass rounded-2xl p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">AI Summary</h2>
            <p className="text-gray-300 leading-relaxed">
              Based on your search patterns and current market data, <span className="text-primary-400 font-medium">2 BHK apartments in the ₹20,000-30,000 range</span> offer the best value in most Indian cities. 
              Properties in <span className="text-accent-400 font-medium">Pune, Hyderabad, and Noida</span> show consistent rental growth with lower entry prices compared to Mumbai and Bangalore. 
              Consider negotiating for 11-month leases to secure better rates.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
