import jwt from 'jsonwebtoken';

/**
 * Generate JWT Token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens
 */
export const protect = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Role-Based Authorization Middleware
 * @param  {...string} roles - Allowed roles (e.g., 'USER', 'ADMIN')
 * @returns {Function} Middleware function
 * 
 * Usage: authorize('USER', 'ADMIN') or authorize('ADMIN')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Ensure user is authenticated (protect middleware must run first)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this route.`
      });
    }

    next();
  };
};