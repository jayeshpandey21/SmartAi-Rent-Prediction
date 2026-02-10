import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

/**
 * Profile & Settings Page
 * Features:
 * - User details display
 * - Change password (UI only)
 * - Preferred city setting
 * - Saved predictions
 * - Theme & language toggle
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

export default function UserProfile() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [preferences, setPreferences] = useState({
    preferredCity: user?.city || '',
    language: 'English',
    notifications: true,
    darkMode: true
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      const predictions = getPredictions();
      const userPredictions = predictions.filter(p => p.userId === user._id || p.userEmail === user.email);
      setHistory(userPredictions.reverse());
    }
  }, [user]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: null }));
    }
    setPasswordSuccess(false);
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwords.current) errors.current = 'Current password is required';
    if (!passwords.new) errors.new = 'New password is required';
    else if (passwords.new.length < 6) errors.new = 'Password must be at least 6 characters';
    if (passwords.new !== passwords.confirm) errors.confirm = 'Passwords do not match';
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      // Simulate API call
      setTimeout(() => {
        setPasswordSuccess(true);
        setPasswords({ current: '', new: '', confirm: '' });
      }, 1000);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'history', label: 'History', icon: '📊' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Profile & Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="glass rounded-2xl p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-gray-400 hover:bg-dark-800 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="glass rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user?.fullName}</h2>
                  <p className="text-gray-400">{user?.email}</p>
                  <p className="text-primary-400 text-sm mt-1 capitalize">{user?.role?.toLowerCase()} Account</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-dark-700">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={user?.fullName || ''}
                    disabled
                    className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600 rounded-xl text-white opacity-60 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600 rounded-xl text-white opacity-60 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                  <input
                    type="text"
                    value={user?.city || ''}
                    disabled
                    className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600 rounded-xl text-white opacity-60 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Account Status</label>
                  <input
                    type="text"
                    value={user?.status || 'Active'}
                    disabled
                    className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600 rounded-xl text-green-400 opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="glass rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Change Password</h2>
              
              {passwordSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3"
                >
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-400">Password updated successfully!</span>
                </motion.div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className={`w-full px-4 py-3 bg-dark-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                      passwordErrors.current ? 'border-red-500' : 'border-dark-600 focus:border-primary-500'
                    }`}
                  />
                  {passwordErrors.current && <p className="text-red-400 text-sm mt-1">{passwordErrors.current}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                  <input
                    type="password"
                    name="new"
                    value={passwords.new}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className={`w-full px-4 py-3 bg-dark-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                      passwordErrors.new ? 'border-red-500' : 'border-dark-600 focus:border-primary-500'
                    }`}
                  />
                  {passwordErrors.new && <p className="text-red-400 text-sm mt-1">{passwordErrors.new}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className={`w-full px-4 py-3 bg-dark-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                      passwordErrors.confirm ? 'border-red-500' : 'border-dark-600 focus:border-primary-500'
                    }`}
                  />
                  {passwordErrors.confirm && <p className="text-red-400 text-sm mt-1">{passwordErrors.confirm}</p>}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-lg transition-all"
                >
                  Update Password
                </motion.button>
              </form>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="glass rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Preferences</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preferred City</label>
                  <input
                    type="text"
                    value={preferences.preferredCity}
                    onChange={(e) => setPreferences(prev => ({ ...prev, preferredCity: e.target.value }))}
                    placeholder="e.g., Mumbai, Bangalore"
                    className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <p className="text-gray-500 text-xs mt-1">Your default city for predictions</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-dark-700">
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-gray-500 text-sm">Receive updates about predictions</p>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, notifications: !prev.notifications }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.notifications ? 'bg-primary-500' : 'bg-dark-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      preferences.notifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-dark-700">
                  <div>
                    <p className="text-white font-medium">Dark Mode</p>
                    <p className="text-gray-500 text-sm">Use dark theme (already enabled)</p>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.darkMode ? 'bg-primary-500' : 'bg-dark-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      preferences.darkMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="glass rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Saved Predictions</h2>
                <span className="text-gray-400 text-sm">{history.length} predictions</span>
              </div>
              
              {history.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((pred) => (
                    <motion.div
                      key={pred._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl hover:bg-dark-700/50 transition-colors"
                    >
                      <div>
                        <p className="text-white font-medium">{pred.city}, {pred.state}</p>
                        <p className="text-gray-400 text-sm">
                          {pred.bhk} BHK • {pred.sqft} sqft • {pred.propertyType}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(pred.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary-400 font-semibold text-lg">
                          {formatCurrency(pred.predictedRent)}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {pred.confidenceScore}% confidence
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-400">No predictions yet</p>
                  <p className="text-gray-500 text-sm mt-1">Your saved predictions will appear here</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
