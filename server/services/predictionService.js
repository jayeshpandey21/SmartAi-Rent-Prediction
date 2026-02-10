/**
 * AI Prediction Service
 * Contains realistic rent prediction logic for MCA viva explanation
 */

/**
 * City-wise base rent configuration
 * Base rent represents average rent for a standard 1BHK unfurnished apartment
 */
const cityBaseRent = {
  'Mumbai': 35000,
  'Delhi': 28000,
  'Bangalore': 32000,
  'Hyderabad': 22000,
  'Chennai': 24000,
  'Pune': 22000,
  'Kolkata': 18000,
  'Ahmedabad': 16000,
  'Jaipur': 14000,
  'Kochi': 18000,
  'Indore': 12000,
  'Noida': 20000,
  'Gurgaon': 24000,
  'Bhubaneswar': 14000,
  'Chandigarh': 16000
};

/**
 * Area weight per sqft by city tier
 */
const areaWeightByCity = {
  'Mumbai': 18,
  'Delhi': 15,
  'Bangalore': 16,
  'Hyderabad': 12,
  'Chennai': 12,
  'Pune': 12,
  'Kolkata': 10,
  'Ahmedabad': 9,
  'Jaipur': 8,
  'Kochi': 10,
  'Indore': 8,
  'Noida': 12,
  'Gurgaon': 14,
  'Bhubaneswar': 8,
  'Chandigarh': 9
};

/**
 * BHK factor - additional rent per bedroom
 */
const bhkFactor = {
  1: 0,
  2: 5000,
  3: 10000,
  4: 15000,
  5: 20000
};

/**
 * Furnishing bonuses
 */
const furnishingBonus = {
  'Unfurnished': 0,
  'Semi': 3000,
  'Fully': 6000
};

/**
 * Market trend multipliers
 */
const marketTrendMultiplier = {
  'Low': 0.90,
  'Medium': 1.0,
  'High': 1.15
};

/**
 * Property age adjustment (per year of age)
 */
const ageAdjustmentPerYear = -200;

/**
 * Floor adjustment
 * Higher floors (except ground) get premium
 */
const floorAdjustment = (floorNumber) => {
  if (floorNumber === 0) return -500; // Ground floor
  if (floorNumber >= 1 && floorNumber <= 3) return 0; // Low rise
  if (floorNumber >= 4 && floorNumber <= 10) return 1000; // Mid rise premium
  if (floorNumber > 10) return 2000; // High rise premium
  return 0;
};

/**
 * Nearby amenities bonus
 */
const amenityBonuses = {
  'Metro Station': 2000,
  'School': 1500,
  'Hospital': 1500,
  'Shopping Mall': 1000,
  'Park': 1000,
  'Gym': 800,
  'Swimming Pool': 2000,
  'Parking': 1000,
  'Security': 500,
  'Power Backup': 500
};

/**
 * Calculate AI Rent Prediction
 * @param {Object} propertyData - Property details
 * @returns {Object} - Prediction result with breakdown
 */
export const calculatePrediction = (propertyData) => {
  const {
    city,
    area,
    bhk,
    furnishing,
    marketTrend,
    propertyAge,
    floorNumber,
    nearbyAmenities = []
  } = propertyData;

  // Get city base rent
  const baseCityRent = cityBaseRent[city] || 20000;
  
  // Calculate area contribution
  const areaContribution = area * (areaWeightByCity[city] || 12);
  
  // Calculate BHK weight
  const bhkWeight = bhkFactor[bhk] || 0;
  
  // Calculate furnishing bonus
  const furnishingBonusValue = furnishingBonus[furnishing] || 0;
  
  // Calculate demand factor (market trend)
  const demandFactor = marketTrendMultiplier[marketTrend] || 1.0;
  
  // Calculate age adjustment
  const ageAdjustment = propertyAge * ageAdjustmentPerYear;
  
  // Calculate floor adjustment
  const floorAdjustmentValue = floorAdjustment(floorNumber);
  
  // Calculate amenities bonus
  const amenitiesBonus = nearbyAmenities.reduce((total, amenity) => {
    return total + (amenityBonuses[amenity] || 0);
  }, 0);

  /**
   * MAIN PREDICTION FORMULA:
   * Predicted Rent = (Base + Area + BHK + Furnishing + Amenities + Floor) × Demand
   *                 + Age Adjustment
   */
  let predictedRent = (
    baseCityRent +
    areaContribution +
    bhkWeight +
    furnishingBonusValue +
    amenitiesBonus +
    floorAdjustmentValue
  );

  // Apply market trend multiplier
  predictedRent = predictedRent * demandFactor;
  
  // Apply age adjustment
  predictedRent = predictedRent + ageAdjustment;

  // Ensure minimum rent
  predictedRent = Math.max(predictedRent, 5000);
  
  // Round to nearest hundred
  predictedRent = Math.round(predictedRent / 100) * 100;

  // Calculate confidence score based on data quality
  const confidenceScore = calculateConfidenceScore(propertyData);

  return {
    predictedRent: Math.round(predictedRent),
    confidenceScore,
    priceBreakdown: {
      baseCityRent: baseCityRent,
      areaContribution: Math.round(areaContribution),
      bhkWeight: bhkWeight,
      furnishingBonus: furnishingBonusValue,
      demandFactor: Math.round(predictedRent * (1 - 1/demandFactor)),
      ageAdjustment: ageAdjustment,
      floorAdjustment: floorAdjustmentValue,
      amenitiesBonus: amenitiesBonus
    }
  };
};

/**
 * Calculate confidence score
 * Higher score when we have more data points and known cities
 */
const calculateConfidenceScore = (data) => {
  let score = 70; // Base score

  // Known city gets bonus
  if (cityBaseRent[data.city]) score += 10;
  
  // BHK in range
  if (data.bhk >= 1 && data.bhk <= 5) score += 5;
  
  // Reasonable area
  if (data.area >= 200 && data.area <= 5000) score += 5;
  
  // Has amenities
  if (data.nearbyAmenities && data.nearbyAmenities.length > 0) score += 5;
  
  // Reasonable age
  if (data.propertyAge <= 50) score += 5;
  
  return Math.min(score, 98); // Cap at 98%
};

/**
 * Get available cities for dropdown
 */
export const getAvailableCities = () => {
  return Object.keys(cityBaseRent);
};

/**
 * Get available amenities for checkboxes
 */
export const getAvailableAmenities = () => {
  return Object.keys(amenityBonuses);
};
