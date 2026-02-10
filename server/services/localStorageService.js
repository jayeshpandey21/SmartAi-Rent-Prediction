import localforage from 'localforage';

// Initialize local storage
const userStorage = localforage.createInstance({
  name: 'SmartRent',
  storeName: 'users'
});

const predictionStorage = localforage.createInstance({
  name: 'SmartRent',
  storeName: 'predictions'
});

class LocalStorageService {
  // User operations
  async createUser(userData) {
    try {
      const users = await userStorage.getItem('users') || [];
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      await userStorage.setItem('users', users);
      return newUser;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }

  async findUserByEmail(email) {
    try {
      const users = await userStorage.getItem('users') || [];
      return users.find(user => user.email === email) || null;
    } catch (error) {
      return null;
    }
  }

  async findUserById(id) {
    try {
      const users = await userStorage.getItem('users') || [];
      return users.find(user => user.id === id) || null;
    } catch (error) {
      return null;
    }
  }

  async getAllUsers() {
    try {
      return await userStorage.getItem('users') || [];
    } catch (error) {
      return [];
    }
  }

  async updateUser(id, updateData) {
    try {
      const users = await userStorage.getItem('users') || [];
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) return null;
      
      users[userIndex] = { ...users[userIndex], ...updateData };
      await userStorage.setItem('users', users);
      return users[userIndex];
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id) {
    try {
      const users = await userStorage.getItem('users') || [];
      const filteredUsers = users.filter(user => user.id !== id);
      await userStorage.setItem('users', filteredUsers);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Prediction operations
  async createPrediction(predictionData) {
    try {
      const predictions = await predictionStorage.getItem('predictions') || [];
      const newPrediction = {
        id: Date.now().toString(),
        ...predictionData,
        createdAt: new Date().toISOString()
      };
      predictions.push(newPrediction);
      await predictionStorage.setItem('predictions', predictions);
      return newPrediction;
    } catch (error) {
      throw new Error('Failed to create prediction');
    }
  }

  async getPredictionsByUserId(userId) {
    try {
      const predictions = await predictionStorage.getItem('predictions') || [];
      return predictions.filter(prediction => prediction.userId === userId);
    } catch (error) {
      return [];
    }
  }

  async getAllPredictions() {
    try {
      return await predictionStorage.getItem('predictions') || [];
    } catch (error) {
      return [];
    }
  }

  async getPredictionById(id) {
    try {
      const predictions = await predictionStorage.getItem('predictions') || [];
      return predictions.find(prediction => prediction.id === id) || null;
    } catch (error) {
      return null;
    }
  }

  async updatePrediction(id, updateData) {
    try {
      const predictions = await predictionStorage.getItem('predictions') || [];
      const predictionIndex = predictions.findIndex(prediction => prediction.id === id);
      if (predictionIndex === -1) return null;
      
      predictions[predictionIndex] = { ...predictions[predictionIndex], ...updateData };
      await predictionStorage.setItem('predictions', predictions);
      return predictions[predictionIndex];
    } catch (error) {
      throw new Error('Failed to update prediction');
    }
  }

  async deletePrediction(id) {
    try {
      const predictions = await predictionStorage.getItem('predictions') || [];
      const filteredPredictions = predictions.filter(prediction => prediction.id !== id);
      await predictionStorage.setItem('predictions', filteredPredictions);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Admin operations
  async createAdmin(adminData) {
    try {
      const admins = await userStorage.getItem('admins') || [];
      const newAdmin = {
        id: Date.now().toString(),
        ...adminData,
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      admins.push(newAdmin);
      await userStorage.setItem('admins', admins);
      return newAdmin;
    } catch (error) {
      throw new Error('Failed to create admin');
    }
  }

  async findAdminByEmail(email) {
    try {
      const admins = await userStorage.getItem('admins') || [];
      return admins.find(admin => admin.email === email) || null;
    } catch (error) {
      return null;
    }
  }

  async getAllAdmins() {
    try {
      return await userStorage.getItem('admins') || [];
    } catch (error) {
      return [];
    }
  }
}

export default new LocalStorageService();