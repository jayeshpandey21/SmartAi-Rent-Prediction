import mongoose from 'mongoose';

/**
 * Prediction Schema for MongoDB
 * Stores AI rent prediction results with breakdown
 */
const predictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Property Details
  city: {
    type: String,
    required: [true, 'City is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  propertyType: {
    type: String,
    enum: ['Apartment', 'Villa', 'Independent House'],
    required: true
  },
  bhk: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  area: {
    type: Number,
    required: true,
    min: 100,
    max: 10000
  },
  furnishing: {
    type: String,
    enum: ['Unfurnished', 'Semi', 'Fully'],
    required: true
  },
  propertyAge: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  floorNumber: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  nearbyAmenities: [{
    type: String
  }],
  marketTrend: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },

  // AI Prediction Results
  predictedRent: {
    type: Number,
    required: true
  },
  confidenceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

  // Price Breakdown for Explanation
  priceBreakdown: {
    baseCityRent: Number,
    areaContribution: Number,
    bhkWeight: Number,
    furnishingBonus: Number,
    demandFactor: Number,
    ageAdjustment: Number,
    floorAdjustment: Number
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
predictionSchema.index({ user: 1, createdAt: -1 });
predictionSchema.index({ city: 1 });
predictionSchema.index({ createdAt: -1 });

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;
