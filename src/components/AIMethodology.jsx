import { motion } from 'framer-motion';

/**
 * AI & ML Methodology Section
 * Explains how SmartRent AI predicts property rent
 */

const methodologySteps = [
  {
    step: '01',
    title: 'Data Collection',
    description: 'Gathering rental data from multiple sources including property listings, market reports, and historical transactions.',
    icon: '📊'
  },
  {
    step: '02',
    title: 'Data Preprocessing',
    description: 'Cleaning data, handling missing values, removing outliers, and standardizing formats for consistency.',
    icon: '🧹'
  },
  {
    step: '03',
    title: 'Feature Engineering',
    description: 'Creating meaningful features like location score, amenities index, and property quality metrics.',
    icon: '⚙️'
  },
  {
    step: '04',
    title: 'Feature Scaling',
    description: 'Normalizing numerical features using StandardScaler to ensure equal contribution from all inputs.',
    icon: '📏'
  },
  {
    step: '05',
    title: 'Model Training',
    description: 'Training Random Forest Regressor on processed data to learn rental price patterns.',
    icon: '🧠'
  },
  {
    step: '06',
    title: 'Model Inference',
    description: 'Using trained model to predict rent for new properties with real-time feature input.',
    icon: '🚀'
  }
];

const algorithms = [
  {
    name: 'Random Forest Regressor',
    description: 'Ensemble learning method using multiple decision trees for robust predictions',
    icon: '🌲',
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Linear Regression',
    description: 'Baseline comparison model for understanding linear relationships',
    icon: '📈',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'NumPy',
    description: 'High-performance numerical computations and array operations',
    icon: '🔢',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Pandas',
    description: 'Data manipulation and analysis with DataFrame structures',
    icon: '🐼',
    color: 'from-orange-500 to-red-500'
  },
  {
    name: 'Joblib',
    description: 'Efficient model serialization and deserialization',
    icon: '💾',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'FastAPI',
    description: 'High-performance ML inference API with automatic documentation',
    icon: '⚡',
    color: 'from-teal-500 to-cyan-500'
  }
];

export default function AIMethodology() {
  return (
    <>
      {/* AI & ML Methodology Section */}
      <section id="ai-methodology" className="py-20 bg-dark-950">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How SmartRent AI Predicts Property Rent
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Our hybrid prediction model combines machine learning with rule-based heuristics 
              to deliver accurate, transparent, and market-aligned rent estimates.
            </p>
          </motion.div>

          {/* Hybrid Model Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 mb-16"
          >
            <h3 className="text-xl font-semibold text-white mb-8 text-center">Hybrid Prediction Architecture</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl p-6 text-center border border-primary-500/30">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">ML Primary Engine</h4>
                <p className="text-gray-400 text-sm">Random Forest Regressor trained on 50,000+ rental records</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 md:w-0.5 md:h-16" />
              </div>
              <div className="bg-gradient-to-br from-accent-500/20 to-purple-500/20 rounded-2xl p-6 text-center border border-accent-500/30">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-500 to-purple-500 flex items-center justify-center">
                  <span className="text-2xl">📐</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Rule-Based Fallback</h4>
                <p className="text-gray-400 text-sm">Mathematical formula ensures market realism</p>
              </div>
            </div>
          </motion.div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {methodologySteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 hover:bg-dark-800/50 transition-all"
              >
                <div className="text-6xl font-bold text-dark-700 mb-2">{item.step}</div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Python Algorithms Section */}
      <section id="algorithms" className="py-20 bg-dark-900">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Python Algorithms & Libraries
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Built with industry-standard Python libraries for reliable and efficient AI inference.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {algorithms.map((algo, index) => (
              <motion.div
                key={algo.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 hover:bg-dark-800/50 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${algo.color} flex items-center justify-center text-white mb-4`}>
                  <span className="text-xl">{algo.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{algo.name}</h3>
                <p className="text-gray-400 text-sm">{algo.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Why Random Forest */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 glass rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Why Random Forest?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400 mb-2">85%</div>
                <p className="text-gray-400 text-sm">Accuracy on test data</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-400 mb-2">100+</div>
                <p className="text-gray-400 text-sm">Decision trees ensemble</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">Auto</div>
                <p className="text-gray-400 text-sm">Feature importance ranking</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mathematical Formula Section */}
      <section id="formula" className="py-20 bg-dark-950">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explainable AI: The Mathematical Formula
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Our transparent approach lets you understand exactly how your rent prediction is calculated.
            </p>
          </motion.div>

          {/* Formula Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 mb-12"
          >
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Final Rent Calculation</h3>
            <div className="bg-dark-800/50 rounded-2xl p-6 overflow-x-auto">
              <code className="text-lg text-primary-400 whitespace-nowrap">
                Rent = [Base City Rent + Area × Base Rate + BHK Weight + Furnishing Bonus + Amenities Score + Floor Adjustment − Age Depreciation] × Market Trend Multiplier
              </code>
            </div>
          </motion.div>

          {/* Formula Components */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Base City Rent', desc: 'Location-specific base rate from city model data', color: 'border-l-4 border-primary-500' },
              { name: 'Area Contribution', desc: 'Square footage × City base rate per sqft', color: 'border-l-4 border-accent-500' },
              { name: 'BHK Weight', desc: 'Multiplier based on number of bedrooms (1-5 BHK)', color: 'border-l-4 border-purple-500' },
              { name: 'Furnishing Bonus', desc: 'Extra value for semi/furnished properties', color: 'border-l-4 border-pink-500' },
              { name: 'Amenities Score', desc: 'Sum of selected amenities (capped at ₹8,000)', color: 'border-l-4 border-orange-500' },
              { name: 'Floor Adjustment', desc: 'Premium for higher floors with lift access', color: 'border-l-4 border-green-500' },
              { name: 'Age Depreciation', desc: 'Reduction for older properties', color: 'border-l-4 border-red-500' },
              { name: 'Market Trend', desc: 'Multipliers: Low (0.92), Medium (1.00), High (1.08)', color: 'border-l-4 border-cyan-500' },
              { name: 'Minimum Constraint', desc: 'Hard floor of ₹5,000 (realistic market rate)', color: 'border-l-4 border-yellow-500' }
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`glass rounded-xl p-5 ${item.color}`}
              >
                <h4 className="text-white font-semibold mb-2">{item.name}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Transparency & Ethics */}
      <section id="transparency" className="py-20 bg-dark-900">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              AI Transparency & Ethics
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              We believe in Explainable AI - no hidden pricing, no black boxes, complete transparency.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: '🔍',
                title: 'No Hidden Pricing',
                description: 'Every factor that goes into your rent prediction is visible and explainable.'
              },
              {
                icon: '📊',
                title: 'Transparent Breakdown',
                description: 'Get a detailed breakdown showing exactly how each feature affects the final rent.'
              },
              {
                icon: '🏙️',
                title: 'City-Based Realism',
                description: 'Predictions are calibrated to real market conditions in each city.'
              },
              {
                icon: '💵',
                title: '₹5,000 Minimum Floor',
                description: 'Hard constraint ensures predictions are realistic for the Indian rental market.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="text-4xl">{item.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section id="architecture" className="py-20 bg-dark-950">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              System Architecture
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              A complete end-to-end AI pipeline from data to prediction.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8"
          >
            <div className="grid gap-6">
              {/* Frontend */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold">
                  R
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">React Frontend</h4>
                  <p className="text-gray-400 text-sm">User interface with real-time predictions and interactive charts</p>
                </div>
                <div className="text-2xl text-gray-600">→</div>
              </div>

              {/* Auth Server */}
              <div className="flex items-center gap-4 ml-8">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                  N
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">Node.js Auth Server</h4>
                  <p className="text-gray-400 text-sm">JWT-based authentication and user management</p>
                </div>
                <div className="text-2xl text-gray-600">→</div>
              </div>

              {/* AI Engine */}
              <div className="flex items-center gap-4 ml-16">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                  F
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">FastAPI AI Engine</h4>
                  <p className="text-gray-400 text-sm">ML model serving with automatic API documentation</p>
                </div>
                <div className="text-2xl text-gray-600">→</div>
              </div>

              {/* ML Model */}
              <div className="flex items-center gap-4 ml-24">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold">
                  M
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">ML Model Layer</h4>
                  <p className="text-gray-400 text-sm">Random Forest Regressor with rule-based fallback</p>
                </div>
              </div>
            </div>

            {/* Database (Optional) */}
            <div className="mt-8 pt-8 border-t border-dark-700">
              <div className="flex items-center gap-4 justify-center">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xl font-bold">
                  D
                </div>
                <div className="text-center">
                  <h4 className="text-white font-semibold">MongoDB Database</h4>
                  <p className="text-gray-400 text-sm">User data and prediction history storage (future scope)</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
