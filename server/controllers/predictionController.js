import localStorageService from '../services/localStorageService.js';
import { calculatePrediction, getAvailableCities, getAvailableAmenities } from '../services/predictionService.js';

/**
 * @desc    Create new prediction
 * @route   POST /api/predictions
 * @access  Private (USER only)
 */
export const createPrediction = async (req, res) => {
  try {
    const {
      city,
      location,
      propertyType,
      bhk,
      area,
      furnishing,
      propertyAge,
      floorNumber,
      nearbyAmenities,
      marketTrend
    } = req.body;

    // Validate required fields
    if (!city || !bhk || !area || !furnishing || !marketTrend) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Calculate AI prediction
    const predictionResult = calculatePrediction({
      city,
      area,
      bhk,
      furnishing,
      marketTrend,
      propertyAge: propertyAge || 0,
      floorNumber: floorNumber || 0,
      nearbyAmenities: nearbyAmenities || []
    });

    // Save prediction to local storage
    const prediction = await localStorageService.createPrediction({
      userId: req.user.id,
      city,
      location,
      propertyType,
      bhk,
      area,
      furnishing,
      propertyAge,
      floorNumber,
      nearbyAmenities,
      marketTrend,
      predictedRent: predictionResult.predictedRent,
      confidenceScore: predictionResult.confidenceScore,
      priceBreakdown: predictionResult.priceBreakdown
    });

    res.status(201).json({
      success: true,
      message: 'Prediction created successfully',
      data: prediction
    });
  } catch (error) {
    console.error('Prediction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during prediction'
    });
  }
};

/**
 * @desc    Get user's prediction history
 * @route   GET /api/predictions/my-predictions
 * @access  Private (USER only)
 */
export const getMyPredictions = async (req, res) => {
  try {
    const predictions = await localStorageService.getPredictionsByUserId(req.user.id);

    res.json({
      success: true,
      count: predictions.length,
      data: predictions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching predictions'
    });
  }
};

/**
 * @desc    Get single prediction by ID
 * @route   GET /api/predictions/:id
 * @access  Private (USER/ADMIN)
 */
export const getPrediction = async (req, res) => {
  try {
    const prediction = await localStorageService.getPredictionById(req.params.id);

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    // Check if user owns this prediction or is admin
    if (prediction.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this prediction'
      });
    }

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get all predictions (Admin only)
 * @route   GET /api/predictions/admin/all
 * @access  Private (ADMIN only)
 */
export const getAllPredictions = async (req, res) => {
  try {
    const { city, page = 1, limit = 20 } = req.query;

    let predictions = await localStorageService.getAllPredictions();
    
    // Filter by city if provided
    if (city) {
      predictions = predictions.filter(p => p.city === city);
    }

    // Sort by createdAt descending
    predictions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const total = predictions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPredictions = predictions.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedPredictions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get prediction analytics (Admin only)
 * @route   GET /api/predictions/admin/analytics
 * @access  Private (ADMIN only)
 */
export const getAnalytics = async (req, res) => {
  try {
    // Get all predictions
    const predictions = await localStorageService.getAllPredictions();

    // Total predictions
    const totalPredictions = predictions.length;

    // Predictions by city
    const cityMap = {};
    predictions.forEach(pred => {
      if (!cityMap[pred.city]) {
        cityMap[pred.city] = { count: 0, totalRent: 0 };
      }
      cityMap[pred.city].count++;
      cityMap[pred.city].totalRent += pred.predictedRent;
    });

    const predictionsByCity = Object.entries(cityMap)
      .map(([city, data]) => ({
        _id: city,
        count: data.count,
        avgRent: data.totalRent / data.count
      }))
      .sort((a, b) => b.count - a.count);

    // Average predicted rent
    const totalRent = predictions.reduce((sum, pred) => sum + pred.predictedRent, 0);
    const avgRent = totalPredictions > 0 ? totalRent / totalPredictions : 0;

    // Recent predictions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentPredictions = predictions.filter(pred => 
      new Date(pred.createdAt) >= sevenDaysAgo
    ).length;

    // Average confidence score
    const totalConfidence = predictions.reduce((sum, pred) => sum + pred.confidenceScore, 0);
    const avgConfidence = totalPredictions > 0 ? totalConfidence / totalPredictions : 0;

    res.json({
      success: true,
      data: {
        totalPredictions,
        predictionsByCity,
        averageRent: avgRent,
        recentPredictions,
        averageConfidence: avgConfidence
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get dropdown options
 * @route   GET /api/predictions/options
 * @access  Public
 */
export const getOptions = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        cities: getAvailableCities(),
        amenities: getAvailableAmenities()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Delete prediction
 * @route   DELETE /api/predictions/:id
 * @access  Private (USER/ADMIN)
 */
export const deletePrediction = async (req, res) => {
  try {
    const prediction = await localStorageService.getPredictionById(req.params.id);

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    // Check ownership
    if (prediction.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this prediction'
      });
    }

    await localStorageService.deletePrediction(req.params.id);

    res.json({
      success: true,
      message: 'Prediction deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
