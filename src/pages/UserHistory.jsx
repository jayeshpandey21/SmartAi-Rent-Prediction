import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * History Page - Saved Predictions
 */

const getPredictions = () => {
  try {
    const predictions = localStorage.getItem('smartrent_predictions');
    return predictions ? JSON.parse(predictions) : [];
  } catch (error) {
    console.error('Error reading predictions:', error);
    return [];
  }
};

const deletePrediction = (id) => {
  try {
    const predictions = getPredictions();
    const filtered = predictions.filter(p => p._id !== id);
    localStorage.setItem('smartrent_predictions', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting prediction:', error);
    return false;
  }
};

export default function UserHistory() {
  const [predictions, setPredictions] = useState(getPredictions());
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareItems, setCompareItems] = useState([]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredAndSortedPredictions = useMemo(() => {
    let result = [...predictions];

    // Filter
    if (filterBy !== 'all') {
      result = result.filter(p => {
        if (filterBy === 'high') return p.predictedRent > 30000;
        if (filterBy === 'medium') return p.predictedRent >= 15000 && p.predictedRent <= 30000;
        if (filterBy === 'low') return p.predictedRent < 15000;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'rent-high') return b.predictedRent - a.predictedRent;
      if (sortBy === 'rent-low') return a.predictedRent - b.predictedRent;
      if (sortBy === 'city') return a.city.localeCompare(b.city);
      return 0;
    });

    return result;
  }, [predictions, sortBy, filterBy]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this prediction?')) {
      deletePrediction(id);
      setPredictions(getPredictions());
    }
  };

  const handleCompareToggle = (pred) => {
    if (compareItems.find(c => c._id === pred._id)) {
      setCompareItems(compareItems.filter(c => c._id !== pred._id));
    } else {
      if (compareItems.length < 2) {
        setCompareItems([...compareItems, pred]);
      }
    }
  };

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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Prediction History</h1>
              <p className="text-gray-400">{predictions.length} predictions saved</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Predictions</option>
              <option value="high">High Rent (₹30K+)</option>
              <option value="medium">Medium Rent (₹15K-30K)</option>
              <option value="low">Low Rent (Below 15000)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
            >
              <option value="date">Sort by Date</option>
              <option value="rent-high">Rent (High to Low)</option>
              <option value="rent-low">Rent (Low to High)</option>
              <option value="city">Sort by City</option>
            </select>

            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setCompareItems([]);
              }}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                compareMode
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white'
              }`}
            >
              {compareMode ? '✕ Cancel Compare' : '⚖️ Compare'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Compare Section */}
      {compareMode && compareItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Compare Properties</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {compareItems.map((item) => (
              <div key={item._id} className="p-4 bg-dark-800/50 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-medium">{item.city}, {item.state}</h3>
                    <p className="text-gray-400 text-sm">{item.bhk} BHK • {item.sqft} sqft • {item.propertyType}</p>
                  </div>
                  <p className="text-primary-400 font-bold">{formatCurrency(item.predictedRent)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Furnishing</p>
                    <p className="text-white">{item.furnishing}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Floor</p>
                    <p className="text-white">{item.floorNumber}{item.hasLift ? ' (Lift)' : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Predictions List */}
      {filteredAndSortedPredictions.length > 0 ? (
        <div className="space-y-3">
          {filteredAndSortedPredictions.map((pred, index) => (
            <motion.div
              key={pred._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`glass rounded-xl p-5 hover:bg-dark-800/50 transition-all ${
                compareItems.find(c => c._id === pred._id) ? 'border border-primary-500' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {compareMode && (
                  <input
                    type="checkbox"
                    checked={!!compareItems.find(c => c._id === pred._id)}
                    onChange={() => handleCompareToggle(pred)}
                    className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500"
                  />
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{pred.city}, {pred.state}</h3>
                      <p className="text-gray-400 text-sm">
                        {pred.bhk} BHK • {pred.sqft} sqft • {pred.propertyType} • {pred.furnishing}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(pred.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary-400 font-bold text-xl">{formatCurrency(pred.predictedRent)}</p>
                      <p className="text-gray-500 text-sm">{pred.confidenceScore}% confidence</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // In a real app, this would load the prediction into the form
                      alert('Re-predict feature - Would load this prediction into the form');
                    }}
                    className="px-3 py-1.5 bg-dark-700 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-dark-600 transition-colors"
                  >
                    🔄 Re-predict
                  </button>
                  <button
                    onClick={() => handleDelete(pred._id)}
                    className="px-3 py-1.5 bg-red-500/20 rounded-lg text-sm text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-12 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-dark-800 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Predictions Yet</h3>
          <p className="text-gray-400 mb-4">Start making predictions to see them here</p>
          <a
            href="/user/prediction"
            className="inline-block px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-lg transition-all"
          >
            Make a Prediction
          </a>
        </motion.div>
      )}
    </div>
  );
}
