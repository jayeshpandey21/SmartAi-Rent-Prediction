import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema for MongoDB
 * Stores user information with role-based access control
 */
const userSchema = new mongoose.Schema({
  /**
   * User's full name
   */
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
    minlength: [2, 'Name must be at least 2 characters']
  },

  /**
   * User's email address
   * Unique, lowercase, trimmed
   */
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },

  /**
   * Hashed password
   */
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },

  /**
   * User's city
   * Stored in Title Case for consistency
   * WHY MANUAL INPUT (MCA Justification):
   * - Allows scalability for any city without dataset limitation
   * - Makes system adaptable for future smart city integration
   * - AI model normalizes city input internally
   * - Avoids hardcoded dependency in frontend
   */
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    minlength: [3, 'City name must be at least 3 characters'],
    maxlength: [30, 'City name must be less than 30 characters'],
    /**
     * Custom validator to ensure only letters and spaces
     * Prevents numeric or special character inputs
     */
    validate: {
      validator: function(v) {
        return /^[A-Za-z\s]+$/.test(v);
      },
      message: 'City name can only contain letters and spaces'
    }
  },

  /**
   * User role for RBAC
   */
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  },

  /**
   * User account status
   * For future admin moderation features
   */
  status: {
    type: String,
    enum: ['Active', 'Blocked'],
    default: 'Active'
  },

  /**
   * Timestamps
   */
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

/**
 * Pre-save middleware to normalize city to Title Case
 * Ensures consistent storage format
 */
userSchema.pre('save', function(next) {
  // Normalize city to Title Case
  if (this.isModified('city') && this.city) {
    this.city = toTitleCase(this.city);
  }

  // Hash password if modified
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

/**
 * Helper function to convert string to Title Case
 * e.g., "pune" → "Pune", "NEW DELHI" → "New Delhi"
 */
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Compare password method
 * @param {string} enteredPassword - Password to compare
 * @returns {boolean} - True if passwords match
 */
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Get user public profile (without sensitive data)
 */
userSchema.methods.toPublicProfile = function() {
  return {
    _id: this._id,
    fullName: this.fullName,
    email: this.email,
    city: this.city,
    role: this.role,
    status: this.status,
    createdAt: this.createdAt
  };
};

const User = mongoose.model('User', userSchema);

export default User;
