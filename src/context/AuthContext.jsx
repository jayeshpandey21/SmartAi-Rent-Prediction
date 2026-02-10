import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AuthContext - LocalStorage-based Authentication
 * 
 * This is a DEMO version using LocalStorage instead of backend.
 * For production, replace with actual API calls to Node.js backend.
 * 
 * LocalStorage Keys:
 * - smartrent_users: Array of user objects
 * - smartrent_token: JWT simulation token
 * - smartrent_currentUser: Currently logged in user
 */

const AuthContext = createContext(null);

// Generate simulated JWT token
const generateToken = () => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    iat: Date.now()
  }));
  const signature = btoa('simulated_signature_' + Date.now());
  return `${header}.${payload}.${signature}`;
};

// Generate unique ID
const generateId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Simple hash simulation (for demo purposes)
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash);
};

/**
 * Get users from LocalStorage
 */
const getUsers = () => {
  try {
    const users = localStorage.getItem('smartrent_users');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error reading users from LocalStorage:', error);
    return [];
  }
};

/**
 * Save users to LocalStorage
 */
const saveUsers = (users) => {
  try {
    localStorage.setItem('smartrent_users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to LocalStorage:', error);
  }
};

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('smartrent_token'));
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('smartrent_currentUser');
    const storedToken = localStorage.getItem('smartrent_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  /**
   * Register new user
   * LOCALSTORAGE DEMO VERSION
   */
  const register = useCallback(async (userData) => {
    try {
      const users = getUsers();
      
      // Check if email already exists
      const existingUser = users.find(u => u.email === userData.email.toLowerCase());
      if (existingUser) {
        return { 
          success: false, 
          message: 'Email already registered' 
        };
      }

      // Create new user with simulated hashed password
      const newUser = {
        _id: generateId(),
        fullName: userData.fullName.trim(),
        email: userData.email.toLowerCase().trim(),
        password: simpleHash(userData.password), // Simulated hash
        city: userData.city,
        role: 'USER',
        status: 'Active',
        createdAt: new Date().toISOString()
      };

      // Save user
      users.push(newUser);
      saveUsers(users);

      // Simulate JWT token
      const newToken = generateToken();
      
      // Set session
      localStorage.setItem('smartrent_token', newToken);
      localStorage.setItem('smartrent_currentUser', JSON.stringify({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        city: newUser.city,
        role: newUser.role,
        status: newUser.status
      }));

      setToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: 'Registration failed. Please try again.' 
      };
    }
  }, []);

  /**
   * Login user
   * LOCALSTORAGE DEMO VERSION
   */
  const login = useCallback(async (credentials) => {
    try {
      const users = getUsers();
      
      // Find user by email
      const userFound = users.find(u => u.email === credentials.email.toLowerCase());
      
      if (!userFound) {
        return { 
          success: false, 
          message: 'Invalid credentials' 
        };
      }

      // Check password (simulated hash comparison)
      const hashedPassword = simpleHash(credentials.password);
      if (userFound.password !== hashedPassword) {
        return { 
          success: false, 
          message: 'Invalid credentials' 
        };
      }

      // Check if user is blocked
      if (userFound.status === 'Blocked') {
        return { 
          success: false, 
          message: 'Your account has been blocked' 
        };
      }

      // Generate token
      const newToken = generateToken();

      // Set session
      localStorage.setItem('smartrent_token', newToken);
      localStorage.setItem('smartrent_currentUser', JSON.stringify({
        _id: userFound._id,
        fullName: userFound.fullName,
        email: userFound.email,
        city: userFound.city,
        role: userFound.role,
        status: userFound.status
      }));

      setToken(newToken);
      setUser(userFound);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Login failed. Please try again.' 
      };
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    localStorage.removeItem('smartrent_token');
    localStorage.removeItem('smartrent_currentUser');
    setUser(null);
    setToken(null);
  }, []);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback(() => {
    return !!user && !!token;
  }, [user, token]);

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
