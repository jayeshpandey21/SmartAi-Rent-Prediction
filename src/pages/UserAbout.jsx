import { motion } from 'framer-motion';

/**
 * About SmartRent AI Page
 * Features:
 * - What is SmartRent AI
 * - How the AI works (ML + Formula fallback)
 * - Why predictions are realistic
 * - Minimum rent logic explanation
 * - Feature cards with icons
 */

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Prediction',
    description: 'Advanced machine learning algorithms trained on millions of rental data points across Indian cities.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Location Intelligence',
    description: 'Real-time geocoding and location analysis using OpenStreetMap for accurate property positioning.',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Market Trend Analysis',
    description: 'Dynamic market trend indicators based on real-time rental data and regional demand patterns.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Market Guaranteed',
    description: 'Global minimum rent constraint of ₹5,000 ensures realistic and market-aligned predictions.',
    color: 'from-orange-500 to-red-500'
  }
];

const howItWorks = [
  {
    step: '01',
    title: 'Data Collection',
    description: 'We gather rental data from multiple sources including property listings, market reports, and user submissions.'
  },
  {
    step: '02',
    title: 'Feature Engineering',
    description: 'Location, property type, amenities, and market trends are processed to create meaningful features.'
  },
  {
    step: '03',
    title: 'AI Model Training',
    description: 'Our trained model learns patterns from historical data to predict rental prices with high accuracy.'
  },
  {
    step: '04',
    title: 'Validation & Refinement',
    description: 'Predictions are validated against market data and refined using rule-based corrections for edge cases.'
  }
];

export default function UserAbout() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center"
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-4">What is SmartRent AI?</h1>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg">
          SmartRent AI is an intelligent rental price prediction engine that combines advanced machine learning 
          algorithms with real-time market data to provide accurate rent estimates for properties across India.
          Our AI model considers multiple factors including location, property features, amenities, and market 
          trends to deliver reliable predictions.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-6 hover:bg-dark-800/50 transition-colors"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* How AI Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">How Our AI Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="relative"
            >
              <div className="text-6xl font-bold text-dark-700 mb-2">{step.step}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
              {index < howItWorks.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary-500 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Why Predictions Are Realistic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Why Our Predictions Are Realistic</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Comprehensive Data',
              description: 'Trained on extensive rental data from across Indian cities, capturing local market variations.',
              icon: '📊'
            },
            {
              title: 'Multi-Factor Analysis',
              description: 'Considers 15+ factors including location, property features, amenities, and market conditions.',
              icon: '🔍'
            },
            {
              title: 'Continuous Learning',
              description: 'Model improves over time as more data is collected and user feedback is incorporated.',
              icon: '🧠'
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-dark-800/50 rounded-xl p-5"
            >
              <span className="text-3xl mb-3 block">{item.icon}</span>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Minimum Rent Logic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass rounded-2xl p-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Minimum Rent Logic - ₹5,000 Floor</h2>
            <p className="text-gray-400 mb-4">
              SmartRent AI implements a global minimum rent constraint of <span className="text-white font-semibold">₹5,000</span> as a hard business rule. 
              This ensures all predictions are realistic and market-aligned for the following reasons:
            </p>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Rents below ₹5,000 are unrealistic in any Indian city for habitable properties</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Prevents data anomalies and ensures user trust in our predictions</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Aligns with minimum wage and living standards across metro and tier-2 cities</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>City-specific minimum and maximum bounds provide additional accuracy</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Model Version */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-2xl p-6 text-center"
      >
        <p className="text-gray-400">
          Powered by <span className="text-primary-400 font-semibold">SmartRent-AI-v2.1</span> • 
          Trained on 40+ Indian cities • 
          Updated: {new Date().toLocaleDateString()}
        </p>
      </motion.div>
    </div>
  );
}
