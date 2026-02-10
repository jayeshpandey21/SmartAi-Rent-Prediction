import localStorageService from '../services/localStorageService.js';
import { generateToken } from '../middlewares/auth.js';
import bcrypt from 'bcryptjs';

/**
 * Helper function to convert string to Title Case
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
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 * 
 * Backend Validation for City:
 * - Sanitize input to prevent injection
 * - Reject numeric or special characters
 * - Store city as normalized Title Case string
 */
export const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, city, role } = req.body;

    // ========================================
    // SERVER-SIDE VALIDATION
    // ========================================
    
    // Check for required fields
    if (!fullName || !email || !password || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate full name
    if (fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 2 characters'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // ========================================
    // CITY VALIDATION (Server-side)
    // ========================================
    
    // Trim extra spaces
    const trimmedCity = city.trim();
    
    // Check minimum length
    if (trimmedCity.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'City name must be at least 3 characters'
      });
    }
    
    // Check maximum length
    if (trimmedCity.length > 30) {
      return res.status(400).json({
        success: false,
        message: 'City name must be less than 30 characters'
      });
    }
    
    // Only allow alphabets and spaces (prevent injection)
    if (!/^[A-Za-z\s]+$/.test(trimmedCity)) {
      return res.status(400).json({
        success: false,
        message: 'City name can only contain letters and spaces'
      });
    }

    // Convert to Title Case for consistent storage
    const normalizedCity = toTitleCase(trimmedCity);

    // ========================================
    // PASSWORD VALIDATION
    // ========================================
    
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user exists
    const existingUser = await localStorageService.findUserByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ========================================
    // CREATE USER
    // ========================================
    
    const user = await localStorageService.createUser({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      city: normalizedCity,
      role: role === 'ADMIN' ? 'ADMIN' : 'USER',
      status: 'Active'
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        city: user.city,
        role: user.role,
        status: user.status,
        token
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const user = await localStorageService.findUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is blocked
    if (user.status === 'Blocked') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact support.'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        city: user.city,
        role: user.role,
        status: user.status,
        token
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await localStorageService.findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: {
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        city: user.city,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
