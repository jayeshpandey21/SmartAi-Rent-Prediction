import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

/**
 * Register Page Component
 * Fixed: InputField component moved outside to prevent focus loss
 * 
 * Bug Fix Explanation:
 * - InputField was defined INSIDE Register component
 * - This caused InputField to be recreated on EVERY render
 * - React re-mounts component on recreation, losing input focus
 * - Solution: Move InputField outside the main component
 */

// ============================================
// STABLE INPUT FIELD COMPONENT (Outside Register)
// ============================================
function InputField({ name, label, type = "text", placeholder, required = false, error, value, onChange, onBlur }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-dark-800/50 border rounded-xl text-white placeholder-gray-500 
          focus:outline-none transition-all duration-300
          ${error
            ? 'border-red-500 focus:border-red-500' 
            : 'border-dark-600 focus:border-primary-500'
          }`}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-1 text-sm text-red-400 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// ERROR MESSAGE COMPONENT
// ============================================
function FormError({ error }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Convert string to Title Case
 * e.g., "pune" → "Pune", "NEW DELHI" → "New Delhi"
 */
const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Validate city input
 * - Only allows alphabets and spaces
 * - Minimum 3 characters, maximum 30
 */
const validateCity = (city) => {
  const trimmed = city.trim();
  if (!trimmed) return 'City is required';
  if (trimmed.length < 3) return 'City name must be at least 3 characters';
  if (trimmed.length > 30) return 'City name must be less than 30 characters';
  if (!/^[A-Za-z\s]+$/.test(trimmed)) return 'City name can only contain letters and spaces';
  return null;
};

/**
 * Validate email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

/**
 * Main Register Component
 */
export default function Register() {
  // Single form state - stable across renders
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  // useCallback prevents function recreation
  const handleAuthRedirect = useCallback(() => {
    if (isAuthenticated()) {
      navigate('/user/prediction');
    }
  }, [isAuthenticated, navigate]);

  // Only run once on mount
  if (isAuthenticated()) {
    handleAuthRedirect();
  }

  /**
   * Stable input change handler
   * Updates only the changed field without causing unnecessary re-renders
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  /**
   * City blur handler - converts to Title Case
   */
  const handleCityBlur = useCallback(() => {
    const trimmedCity = formData.city.trim();
    const titleCaseCity = toTitleCase(trimmedCity);
    
    setFormData(prev => ({
      ...prev,
      city: titleCaseCity
    }));

    // Validate after formatting
    const cityError = validateCity(titleCaseCity);
    setErrors(prev => ({
      ...prev,
      city: cityError
    }));
  }, [formData.city]);

  /**
   * Validate entire form
   * Returns true if valid, false otherwise
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    // City validation
    const cityError = validateCity(formData.city);
    if (cityError) newErrors.city = cityError;

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Form submission handler
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    // Validate form before submission
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        city: formData.city // Already in title case
      });

      if (result.success) {
        // ✅ Redirect to prediction page after successful registration
        navigate('/user/prediction');
      } else {
        setFormError(result.message);
      }
    } catch (error) {
      setFormError('An unexpected error occurred');
    }

    setLoading(false);
  }, [formData, validateForm, register, navigate]);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-8">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">SmartRent AI</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join SmartRent AI and predict your rent today</p>
        </motion.div>

        {/* Registration Form */}
        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Form-level error */}
            <FormError error={formError} />

            {/* Full Name */}
            <InputField
              name="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              required
              error={errors.fullName}
              value={formData.fullName}
              onChange={handleChange}
            />

            {/* Email */}
            <InputField
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              required
              error={errors.email}
              value={formData.email}
              onChange={handleChange}
            />

            {/* 
             * MANUAL CITY INPUT (Not a dropdown)
             * 
             * Why manual input instead of dropdown:
             * - Scalability: Works with any city, even new ones
             * - Flexibility: Users can enter any city name
             * - Future-ready: Adapts to smart city integration
             * - AI handles normalization internally
             * - No hardcoded city dependencies in frontend
             */}
            <InputField
              name="city"
              label="City"
              placeholder="Enter your city name (e.g., Pune, Delhi, Bengaluru)"
              required
              error={errors.city}
              value={formData.city}
              onChange={handleChange}
              onBlur={handleCityBlur}
            />

            {/* Password */}
            <InputField
              name="password"
              label="Password"
              type="password"
              placeholder="Create a password (min 6 characters)"
              required
              error={errors.password}
              value={formData.password}
              onChange={handleChange}
            />

            {/* Confirm Password */}
            <InputField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              required
              error={errors.confirmPassword}
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white 
                hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-400 text-sm transition-colors inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
