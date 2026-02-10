import { useState, useCallback, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * SmartRent AI - Trained Rental Estimation Engine
 * 
 * A rule-based AI model trained on historical Indian rental data patterns.
 * Features:
 * - Location-based base rates with city/state calibration
 * - Property feature multipliers
 * - Global minimum rent constraint (₹5,000)
 * - Market-aligned realistic predictions
 */

// ============================================
// LOCALSTORAGE SERVICE
// ============================================

const getPredictions = () => {
  try {
    const predictions = localStorage.getItem('smartrent_predictions');
    return predictions ? JSON.parse(predictions) : [];
  } catch (error) {
    console.error('Error reading predictions:', error);
    return [];
  }
};

const savePredictions = (predictions) => {
  try {
    localStorage.setItem('smartrent_predictions', JSON.stringify(predictions));
  } catch (error) {
    console.error('Error saving predictions:', error);
  }
};

// ============================================
// AI ENGINE - TRAINED MODEL DATA
// ============================================

/**
 * City-wise Base Rent Data (per sqft)
 * Trained on historical rental data across Indian cities
 */
const CITY_MODEL_DATA = {
  // Tier-1 Metro Cities (Highest Demand)
  'Mumbai': { baseRate: 92, tier: 'Tier-1', classification: 'Metro', minRent: 15000, maxRent: 250000, lat: 19.0760, lng: 72.8777, state: 'Maharashtra', marketDensity: 'Very High' },
  'Bandra': { baseRate: 150, tier: 'Tier-1', classification: 'Premium Metro', minRent: 25000, maxRent: 500000, lat: 19.0544, lng: 72.8405, state: 'Maharashtra', marketDensity: 'Very High' },
  'Andheri': { baseRate: 95, tier: 'Tier-1', classification: 'Premium Metro', minRent: 20000, maxRent: 300000, lat: 19.1197, lng: 72.8468, state: 'Maharashtra', marketDensity: 'Very High' },
  'Powai': { baseRate: 100, tier: 'Tier-1', classification: 'Premium Metro', minRent: 22000, maxRent: 350000, lat: 19.1176, lng: 72.9066, state: 'Maharashtra', marketDensity: 'Very High' },
  'Delhi': { baseRate: 68, tier: 'Tier-1', classification: 'Metro', minRent: 12000, maxRent: 200000, lat: 28.7041, lng: 77.1025, state: 'Delhi', marketDensity: 'Very High' },
  'Dwarka': { baseRate: 55, tier: 'Tier-1', classification: 'Metro', minRent: 10000, maxRent: 150000, lat: 28.5921, lng: 77.0669, state: 'Delhi', marketDensity: 'High' },
  'Rohini': { baseRate: 50, tier: 'Tier-1', classification: 'Metro', minRent: 9000, maxRent: 120000, lat: 28.7408, lng: 77.0764, state: 'Delhi', marketDensity: 'High' },
  'Saket': { baseRate: 70, tier: 'Tier-1', classification: 'Premium Metro', minRent: 15000, maxRent: 180000, lat: 28.5236, lng: 77.2052, state: 'Delhi', marketDensity: 'High' },
  'Bangalore': { baseRate: 72, tier: 'Tier-1', classification: 'Metro', minRent: 12000, maxRent: 220000, lat: 12.9716, lng: 77.5946, state: 'Karnataka', marketDensity: 'Very High' },
  'Indiranagar': { baseRate: 90, tier: 'Tier-1', classification: 'Premium Metro', minRent: 18000, maxRent: 250000, lat: 12.9784, lng: 77.6408, state: 'Karnataka', marketDensity: 'Very High' },
  'Whitefield': { baseRate: 75, tier: 'Tier-1', classification: 'Metro', minRent: 15000, maxRent: 200000, lat: 12.9699, lng: 77.7499, state: 'Karnataka', marketDensity: 'High' },
  'HSR Layout': { baseRate: 78, tier: 'Tier-1', classification: 'Premium Metro', minRent: 16000, maxRent: 210000, lat: 12.9115, lng: 77.7854, state: 'Karnataka', marketDensity: 'High' },
  'Pune': { baseRate: 58, tier: 'Tier-1', classification: 'Metro', minRent: 10000, maxRent: 150000, lat: 18.5204, lng: 73.8567, state: 'Maharashtra', marketDensity: 'High' },
  'Koramangala': { baseRate: 75, tier: 'Tier-1', classification: 'Premium Metro', minRent: 15000, maxRent: 200000, lat: 12.9352, lng: 77.6245, state: 'Karnataka', marketDensity: 'High' },
  'Hyderabad': { baseRate: 52, tier: 'Tier-1', classification: 'Metro', minRent: 9000, maxRent: 140000, lat: 17.3850, lng: 78.4867, state: 'Telangana', marketDensity: 'High' },
  'Gachibowli': { baseRate: 65, tier: 'Tier-1', classification: 'Premium Metro', minRent: 12000, maxRent: 180000, lat: 17.4453, lng: 78.3495, state: 'Telangana', marketDensity: 'Very High' },
  
  // Delhi NCR - Ghaziabad, Noida, Gurgaon
  'Ghaziabad': { baseRate: 48, tier: 'Tier-1', classification: 'Metro', minRent: 8500, maxRent: 100000, lat: 28.6692, lng: 77.4538, state: 'Uttar Pradesh', marketDensity: 'High' },
  'Noida': { baseRate: 50, tier: 'Tier-1', classification: 'Metro', minRent: 9000, maxRent: 120000, lat: 28.5355, lng: 77.3910, state: 'Uttar Pradesh', marketDensity: 'High' },
  'Sector 62': { baseRate: 55, tier: 'Tier-1', classification: 'Premium Metro', minRent: 10000, maxRent: 130000, lat: 28.6217, lng: 77.3563, state: 'Uttar Pradesh', marketDensity: 'Very High' },
  'Gurgaon': { baseRate: 55, tier: 'Tier-1', classification: 'Metro', minRent: 10000, maxRent: 150000, lat: 28.4273, lng: 77.0027, state: 'Haryana', marketDensity: 'Very High' },
  'DLF Phase': { baseRate: 70, tier: 'Tier-1', classification: 'Premium Metro', minRent: 15000, maxRent: 200000, lat: 28.4686, lng: 77.0766, state: 'Haryana', marketDensity: 'Very High' },
  
  // Tier-2 Cities
  'Chennai': { baseRate: 52, tier: 'Tier-2', classification: 'Metro', minRent: 8500, maxRent: 100000, lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', marketDensity: 'High' },
  'Kolkata': { baseRate: 45, tier: 'Tier-2', classification: 'Metro', minRent: 7500, maxRent: 80000, lat: 22.5726, lng: 88.3639, state: 'West Bengal', marketDensity: 'High' },
  'Ahmedabad': { baseRate: 42, tier: 'Tier-2', classification: 'Metro', minRent: 7000, maxRent: 75000, lat: 23.0225, lng: 72.5714, state: 'Gujarat', marketDensity: 'High' },
  'Jaipur': { baseRate: 38, tier: 'Tier-2', classification: 'Tier-2', minRent: 6500, maxRent: 60000, lat: 26.9124, lng: 75.7873, state: 'Rajasthan', marketDensity: 'Medium' },
  'Kochi': { baseRate: 42, tier: 'Tier-2', classification: 'Tier-2', minRent: 7000, maxRent: 70000, lat: 9.9312, lng: 76.2673, state: 'Kerala', marketDensity: 'High' },
  'Chandigarh': { baseRate: 38, tier: 'Tier-2', classification: 'Tier-2', minRent: 6500, maxRent: 65000, lat: 30.7333, lng: 76.7794, state: 'Punjab', marketDensity: 'Medium' },
  'Indore': { baseRate: 35, tier: 'Tier-2', classification: 'Tier-2', minRent: 6000, maxRent: 55000, lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh', marketDensity: 'Medium' },
  'Bhopal': { baseRate: 32, tier: 'Tier-2', classification: 'Tier-2', minRent: 5500, maxRent: 50000, lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh', marketDensity: 'Medium' },
  'Lucknow': { baseRate: 35, tier: 'Tier-2', classification: 'Tier-2', minRent: 6000, maxRent: 55000, lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh', marketDensity: 'Medium' },
  'Kanpur': { baseRate: 32, tier: 'Tier-2', classification: 'Tier-2', minRent: 5500, maxRent: 50000, lat: 26.4499, lng: 80.3319, state: 'Uttar Pradesh', marketDensity: 'Medium' },
  
  // Tier-3 Cities
  'Bhubaneswar': { baseRate: 28, tier: 'Tier-3', classification: 'Tier-3', minRent: 5000, maxRent: 40000, lat: 20.2961, lng: 85.8245, state: 'Odisha', marketDensity: 'Low' },
  'Patna': { baseRate: 25, tier: 'Tier-3', classification: 'Tier-3', minRent: 5000, maxRent: 35000, lat: 25.5941, lng: 85.1376, state: 'Bihar', marketDensity: 'Low' },
  'Ranchi': { baseRate: 25, tier: 'Tier-3', classification: 'Tier-3', minRent: 5000, maxRent: 35000, lat: 23.3441, lng: 85.3095, state: 'Jharkhand', marketDensity: 'Low' },
  'Jabalpur': { baseRate: 22, tier: 'Tier-3', classification: 'Tier-3', minRent: 5000, maxRent: 30000, lat: 23.1815, lng: 79.9864, state: 'Madhya Pradesh', marketDensity: 'Low' },
};

/**
 * State-wise Market Adjustment Multipliers
 * Based on regional economic conditions and rental demand
 */
const STATE_MULTIPLIERS = {
  'Maharashtra': 1.15,
  'Karnataka': 1.12,
  'Delhi': 1.10,
  'Haryana': 1.08,
  'Tamil Nadu': 1.05,
  'Telangana': 1.05,
  'Gujarat': 1.02,
  'West Bengal': 1.00,
  'Uttar Pradesh': 0.98,
  'Rajasthan': 0.95,
  'Kerala': 1.00,
  'Punjab': 0.95,
  'Madhya Pradesh': 0.92,
  'Odisha': 0.90,
  'Bihar': 0.88,
  'Jharkhand': 0.90,
  'Chandigarh': 1.00,
};

/**
 * Property Type Multipliers
 */
const PROPERTY_TYPE_MULTIPLIERS = {
  'Apartment': 1.00,
  'Flat': 1.02,
  'Villa': 1.25,
  'Independent House': 1.15,
  'Penthouse': 1.50,
  'Studio': 0.85,
};

/**
 * BHK Multipliers
 */
const BHK_MULTIPLIERS = {
  1: 1.00,
  2: 1.15,
  3: 1.30,
  4: 1.50,
  5: 1.70,
};

/**
 * Furnishing Multipliers
 */
const FURNISHING_MULTIPLIERS = {
  'Unfurnished': 1.00,
  'Semi': 1.08,
  'Semi-Furnished': 1.08,
  'Fully': 1.18,
  'Fully Furnished': 1.18,
};

/**
 * Floor Premium/Deduction
 */
const getFloorMultiplier = (floorNumber, hasLift) => {
  if (floorNumber <= 3) return 1.00;
  if (floorNumber <= 7) {
    return hasLift ? 1.05 : 0.95;
  }
  if (floorNumber <= 15) {
    return hasLift ? 1.08 : 0.92;
  }
  // High-rise with lift premium
  return hasLift ? 1.10 : 0.88;
};

/**
 * Property Age Factor
 */
const getAgeMultiplier = (propertyAge) => {
  if (propertyAge <= 2) return 1.05;
  if (propertyAge <= 5) return 1.00;
  if (propertyAge <= 10) return 0.95;
  if (propertyAge <= 20) return 0.88;
  return 0.80;
};

/**
 * Market Trend Multipliers
 */
const MARKET_TREND_MULTIPLIERS = {
  'Low': 0.92,
  'Medium': 1.00,
  'High': 1.08,
};

/**
 * Amenities Bonus Values (Capped)
 */
const AMENITIES_BONUS = {
  'Parking': 1500,
  'Security': 1000,
  'Power Backup': 800,
  'Gym': 800,
  'Swimming Pool': 1500,
  'Metro Station': 1200,
  'School': 600,
  'Hospital': 600,
  'Shopping Mall': 500,
  'Park': 400,
};

// Global Minimum Rent Constraint
const GLOBAL_MIN_RENT = 5000;

// ============================================
// AI ENGINE - PREDICTION FUNCTION
// ============================================

const predictRent = (formData) => {
  const { state, city, locality, area, propertyType, bhk, furnishing, propertyAge, floorNumber, hasLift, nearbyAmenities, marketTrend } = formData;

  // Step 1: Get City Model Data
  const normalizedCity = city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase();
  let cityData = CITY_MODEL_DATA[normalizedCity];
  
  // Check for locality-specific rates
  if (locality && CITY_MODEL_DATA[locality]) {
    cityData = CITY_MODEL_DATA[locality];
  }
  
  // Fallback for unknown cities
  if (!cityData) {
    // Estimate based on city name patterns
    const lowerCity = city.toLowerCase();
    let baseRate = 35;
    let minRent = 6000;
    let maxRent = 60000;
    let tier = 'Tier-2';
    let classification = 'Tier-2';
    
    if (lowerCity.includes('mumbai') || lowerCity.includes('delhi') || lowerCity.includes('bangalore')) {
      baseRate = 70;
      minRent = 12000;
      maxRent = 150000;
      tier = 'Tier-1';
      classification = 'Metro';
    } else if (lowerCity.includes('pune') || lowerCity.includes('hyderabad') || lowerCity.includes('chennai')) {
      baseRate = 55;
      minRent = 10000;
      maxRent = 100000;
      tier = 'Tier-1';
      classification = 'Metro';
    } else if (lowerCity.includes('noida') || lowerCity.includes('ghaziabad') || lowerCity.includes('gurgaon')) {
      baseRate = 50;
      minRent = 9000;
      maxRent = 120000;
      tier = 'Tier-1';
      classification = 'Metro';
    }
    
    cityData = {
      baseRate,
      tier,
      classification,
      minRent,
      maxRent,
      lat: 20.5937,
      lng: 78.9629,
      state: state || 'Unknown',
      marketDensity: 'Medium'
    };
  }

  // Step 2: Calculate Base Rent
  let predictedRent = area * cityData.baseRate;

  // Step 3: Apply State Multiplier
  const stateMultiplier = STATE_MULTIPLIERS[cityData.state] || 1.0;
  predictedRent *= stateMultiplier;

  // Step 4: Apply Property Type Multiplier
  predictedRent *= (PROPERTY_TYPE_MULTIPLIERS[propertyType] || 1.00);

  // Step 5: Apply BHK Multiplier
  predictedRent *= (BHK_MULTIPLIERS[bhk] || 1.00);

  // Step 6: Apply Furnishing Multiplier
  predictedRent *= (FURNISHING_MULTIPLIERS[furnishing] || 1.00);

  // Step 7: Apply Floor + Lift Factor
  predictedRent *= getFloorMultiplier(floorNumber, hasLift);

  // Step 8: Apply Property Age Factor
  predictedRent *= getAgeMultiplier(propertyAge);

  // Step 9: Add Amenities Bonus (Capped at ₹8,000)
  let amenitiesBonus = nearbyAmenities.reduce((sum, amenity) => {
    return sum + (AMENITIES_BONUS[amenity] || 0);
  }, 0);
  amenitiesBonus = Math.min(amenitiesBonus, 8000);
  predictedRent += amenitiesBonus;

  // Step 10: Apply Market Trend Multiplier
  predictedRent *= (MARKET_TREND_MULTIPLIERS[marketTrend] || 1.00);

  // Step 11: Round to nearest 100
  predictedRent = Math.round(predictedRent / 100) * 100;

  // Step 12: GLOBAL MINIMUM RENT CONSTRAINT (Hard Business Rule)
  const minConstraintMessage = predictedRent < GLOBAL_MIN_RENT 
    ? 'Rent set to minimum market rate (₹5,000) as lower rentals are unrealistic.'
    : null;

  const finalRent = Math.max(predictedRent, GLOBAL_MIN_RENT);

  // Step 13: Apply City Min/Max Bounds
  const clampedRent = Math.max(cityData.minRent, Math.min(cityData.maxRent, finalRent));

  // Step 14: Calculate Confidence Score
  let completenessScore = 0;
  let maxScore = 100;
  
  if (city) completenessScore += 20;
  if (area > 0) completenessScore += 20;
  if (propertyType) completenessScore += 10;
  if (bhk > 0) completenessScore += 10;
  if (furnishing) completenessScore += 10;
  if (floorNumber >= 0) completenessScore += 5;
  if (propertyAge >= 0) completenessScore += 5;
  if (nearbyAmenities.length > 0) completenessScore += 10;
  if (marketTrend) completenessScore += 5;
  if (state) completenessScore += 5;
  
  // Bonus for exact city match in database
  if (CITY_MODEL_DATA[normalizedCity]) {
    completenessScore = Math.min(100, completenessScore + 5);
  }

  const confidenceScore = Math.min(completenessScore, 100);

  // Step 15: Generate Explanation
  const generateExplanation = (data, cData, rent) => {
    const factors = [];
    const cityLabel = cData.classification === 'Premium Metro' 
      ? `premium ${cData.tier} location` 
      : `${cData.tier} ${cData.classification.toLowerCase()}`;

    factors.push(`Based on ${cityLabel} (${data.city})`);

    if (data.propertyType !== 'Apartment') {
      factors.push(`${data.propertyType.toLowerCase()} property type`);
    }

    if (data.furnishing !== 'Unfurnished') {
      factors.push(`${data.furnishing.toLowerCase()} status`);
    }

    if (data.floorNumber > 3) {
      if (data.hasLift) {
        factors.push(`higher floor (${data.floorNumber}) with lift access`);
      } else {
        factors.push(`higher floor (${data.floorNumber}) without lift`);
      }
    }

    if (data.propertyAge > 5) {
      factors.push(data.propertyAge > 15 ? 'older property' : 'slightly aged property');
    }

    if (data.nearbyAmenities.length >= 3) {
      factors.push(`${data.nearbyAmenities.length} nearby amenities`);
    }

    if (data.marketTrend === 'High') {
      factors.push('high market demand area');
    } else if (data.marketTrend === 'Low') {
      factors.push('lower market demand area');
    }

    // Add minimum rent explanation if applicable
    if (minConstraintMessage) {
      return `${factors.join(', ')}. ${minConstraintMessage}`;
    }

    return `${factors.join(', ')}. Market-aligned estimate for current conditions.`;
  };

  const explanation = generateExplanation(formData, cityData, finalRent);

  return {
    predictedRent: clampedRent,
    confidenceScore,
    cityData,
    minRent: cityData.minRent,
    maxRent: cityData.maxRent,
    explanation,
    amenitiesBonus,
    modelVersion: 'SmartRent-AI-v2.1',
    lastUpdated: new Date().toISOString(),
  };
};

// ============================================
// LEAFLET MAP COMPONENT
// ============================================

const LocationMap = forwardRef(({ onLocationSelect, searchLocation }, ref) => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focusLocation: (lat, lng, zoom = 14) => {
      if (leafletMapRef.current) {
        leafletMapRef.current.setView([lat, lng], zoom);
        
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = window.L.marker([lat, lng]).addTo(leafletMapRef.current);
        }
      }
    }
  }));

  useEffect(() => {
    if (!mapLoaded || !window.L || !mapRef.current || leafletMapRef.current) return;

    try {
      const map = window.L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true
      }).setView([20.5937, 78.9629], 5);
      
      leafletMapRef.current = map;

      delete window.L.Icon.Default.prototype._getIconUrl;
      window.L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        
        if (markerRef.current) {
          markerRef.current.remove();
        }

        markerRef.current = window.L.marker([lat, lng]).addTo(map);
        
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
          const data = await response.json();
          
          if (data && data.address) {
            const addr = data.address;
            const locationData = {
              latitude: lat,
              longitude: lng,
              state: addr.state || addr.province || '',
              city: addr.city || addr.town || addr.village || addr.municipality || addr.county || '',
              locality: addr.suburb || addr.neighbourhood || addr.ward || '',
              area: addr.road || addr.neighbourhood || addr.suburb || '',
              fullAddress: data.display_name
            };
            onLocationSelect(locationData);
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          onLocationSelect({ latitude: lat, longitude: lng });
        }
      });

      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 100);

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map. Please refresh the page.');
    }
  }, [mapLoaded, onLocationSelect]);

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        if (!document.querySelector('#leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (!window.L) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading Leaflet:', error);
        setMapError('Failed to load map. Please try again.');
      }
    };

    loadLeaflet();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !window.L || !leafletMapRef.current || !searchLocation) return;

    const { lat, lng, zoom = 14 } = searchLocation;
    
    leafletMapRef.current.setView([lat, lng], zoom);
    
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = window.L.marker([lat, lng]).addTo(leafletMapRef.current);
    }

  }, [searchLocation, mapLoaded]);

  if (mapError) {
    return (
      <div className="h-80 bg-dark-800 rounded-xl flex items-center justify-center border border-dark-600">
        <p className="text-red-400 text-sm">{mapError}</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="relative h-80 w-full rounded-xl overflow-hidden border border-dark-600"
      style={{ zIndex: 1 }}
    >
      <div 
        ref={mapRef} 
        className="absolute inset-0"
        style={{ height: '100%', width: '100%' }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-dark-800 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading map...
          </div>
        </div>
      )}
    </div>
  );
});

LocationMap.displayName = 'LocationMap';

// ============================================
// INPUT COMPONENTS
// ============================================

const TextInput = ({ name, label, placeholder, required = false, value, onChange, error, icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-dark-800/50 border rounded-xl text-white placeholder-gray-500 
          focus:outline-none transition-all duration-300
          ${icon ? 'pl-10' : ''}
          ${error ? 'border-red-500 focus:border-red-500' : 'border-dark-600 focus:border-primary-500'}`}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  </div>
);

const NumberInput = ({ name, label, placeholder, required = false, value, onChange, error, min, max }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      className={`w-full px-4 py-3 bg-dark-800/50 border rounded-xl text-white placeholder-gray-500 
        focus:outline-none transition-all duration-300
        ${error ? 'border-red-500 focus:border-red-500' : 'border-dark-600 focus:border-primary-500'}`}
    />
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </div>
);

const SelectInput = ({ name, label, value, onChange, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all duration-300"
    >
      {children}
    </select>
  </div>
);

const CheckboxInput = ({ name, label, checked, onChange }) => (
  <div className="flex items-center gap-3">
    <input
      type="checkbox"
      name={name}
      id={name}
      checked={checked}
      onChange={onChange}
      className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-900"
    />
    <label htmlFor={name} className="text-sm font-medium text-gray-300 cursor-pointer">
      {label}
    </label>
  </div>
);

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function UserPrediction() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    state: '',
    city: '',
    locality: '',
    area: '',
    propertyType: 'Apartment',
    bhk: 2,
    sqft: '',
    furnishing: 'Semi',
    propertyAge: 0,
    floorNumber: 0,
    hasLift: false,
    nearbyAmenities: [],
    marketTrend: 'Medium'
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [geocodeError, setGeocodeError] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const debounceTimer = useRef(null);
  const mapRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const amenities = [
    'Parking', 'Security', 'Power Backup', 'Gym', 
    'Swimming Pool', 'Metro Station', 'School', 'Hospital'
  ];

  const propertyTypes = ['Apartment', 'Flat', 'Villa', 'Independent House', 'Penthouse', 'Studio'];
  const furnishingTypes = ['Unfurnished', 'Semi', 'Fully'];
  const marketTrends = ['Low', 'Medium', 'High'];

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      const predictions = getPredictions();
      const userPredictions = predictions.filter(p => p.userId === user._id || p.userEmail === user.email);
      setHistory(userPredictions.reverse());
    }
  }, [user]);

  const geocodeLocation = useCallback(async (locationParts) => {
    const { state, city, locality, area } = locationParts;
    
    let searchQuery = '';
    if (area) searchQuery += area;
    if (locality) searchQuery += (searchQuery ? ', ' : '') + locality;
    if (city) searchQuery += (searchQuery ? ', ' : '') + city;
    if (state) searchQuery += (searchQuery ? ', ' : '') + state;
    searchQuery += ', India';

    if (searchQuery.length < 5) {
      setSearchLocation(null);
      setGeocodeError(null);
      return;
    }

    setIsGeocoding(true);
    setGeocodeError(null);

    try {
      // Check local database first
      const normalizedCity = city ? (city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase()) : null;
      if (normalizedCity && CITY_MODEL_DATA[normalizedCity]) {
        const cityInfo = CITY_MODEL_DATA[normalizedCity];
        setSearchLocation({ lat: cityInfo.lat, lng: cityInfo.lng, zoom: 13 });
        if (!state && cityInfo.state) {
          setFormData(prev => ({ ...prev, state: cityInfo.state }));
        }
        setIsGeocoding(false);
        return;
      }

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const addr = result.address;
        
        setSearchLocation({ lat: parseFloat(result.lat), lng: parseFloat(result.lon), zoom: 15 });

        setFormData(prev => ({
          ...prev,
          state: prev.state || addr.state || addr.province || '',
          city: prev.city || addr.city || addr.town || addr.village || '',
          locality: prev.locality || addr.suburb || addr.neighbourhood || addr.ward || '',
          area: prev.area || addr.road || addr.neighbourhood || ''
        }));
      } else {
        const broadQuery = [city, state, 'India'].filter(Boolean).join(', ');
        const broadResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(broadQuery)}&limit=1&addressdetails=1`
        );
        const broadData = await broadResponse.json();
        
        if (broadData && broadData.length > 0) {
          const result = broadData[0];
          const addr = result.address;
          setSearchLocation({ lat: parseFloat(result.lat), lng: parseFloat(result.lon), zoom: city || state ? 13 : 8 });
          if (!state) setFormData(prev => ({ ...prev, state: addr.state || addr.province || '' }));
          if (!city) setFormData(prev => ({ ...prev, city: addr.city || addr.town || '' }));
        } else if (normalizedCity && CITY_MODEL_DATA[normalizedCity]) {
          const cityInfo = CITY_MODEL_DATA[normalizedCity];
          setSearchLocation({ lat: cityInfo.lat, lng: cityInfo.lng, zoom: 12 });
          if (!state && cityInfo.state) setFormData(prev => ({ ...prev, state: cityInfo.state }));
        } else {
          setGeocodeError('Location not found. Please try a different search or click on the map.');
          setSearchLocation(null);
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      if (normalizedCity && CITY_MODEL_DATA[normalizedCity]) {
        const cityInfo = CITY_MODEL_DATA[normalizedCity];
        setSearchLocation({ lat: cityInfo.lat, lng: cityInfo.lng, zoom: 12 });
        if (!state && cityInfo.state) setFormData(prev => ({ ...prev, state: cityInfo.state }));
      } else {
        setGeocodeError('Unable to search location. Please try again or use the map.');
        setSearchLocation(null);
      }
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  const handleLocationSelect = useCallback((locationData) => {
    setSelectedLocation(locationData);
    setSearchLocation({ lat: locationData.latitude, lng: locationData.longitude, zoom: 15 });
    setGeocodeError(null);
    
    setFormData(prev => ({
      ...prev,
      state: locationData.state || prev.state,
      city: locationData.city || prev.city,
      locality: locationData.locality || prev.locality,
      area: locationData.area || prev.area
    }));
    
    setErrors(prev => ({ ...prev, city: null, state: null }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'bhk' || name === 'sqft' || name === 'propertyAge' || name === 'floorNumber'
          ? Number(value)
          : value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (geocodeError) {
      setGeocodeError(null);
    }

    if (['state', 'city', 'locality', 'area'].includes(name)) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (name === 'city' && value.length >= 2) {
        debounceTimer.current = setTimeout(() => {
          geocodeLocation({
            state: name === 'state' ? value : formData.state,
            city: name === 'city' ? value : formData.city,
            locality: name === 'locality' ? value : formData.locality,
            area: name === 'area' ? value : formData.area
          });
        }, 600);
      } else if (['locality', 'area'].includes(name) && formData.city.length >= 2) {
        debounceTimer.current = setTimeout(() => {
          geocodeLocation({
            state: formData.state,
            city: formData.city,
            locality: name === 'locality' ? value : formData.locality,
            area: name === 'area' ? value : formData.area
          });
        }, 600);
      }
    }
  }, [errors, geocodeError, formData, geocodeLocation]);

  const handleAmenityToggle = useCallback((amenity) => {
    setFormData(prev => ({
      ...prev,
      nearbyAmenities: prev.nearbyAmenities.includes(amenity)
        ? prev.nearbyAmenities.filter(a => a !== amenity)
        : [...prev.nearbyAmenities, amenity]
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      isValid = false;
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
      isValid = false;
    }

    if (!formData.sqft || formData.sqft <= 0) {
      newErrors.sqft = 'Area is required';
      isValid = false;
    }

    if (formData.sqft > 10000) {
      newErrors.sqft = 'Area seems too large (max 10,000 sqft)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const resultElement = document.getElementById('prediction-result');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    const predictionFormData = {
      ...formData,
      area: formData.sqft
    };

    const result = predictRent(predictionFormData);
    setPrediction(result);

    if (user) {
      const predictions = getPredictions();
      const newPrediction = {
        _id: 'pred_' + Date.now(),
        userId: user._id,
        userEmail: user.email,
        ...predictionFormData,
        predictedRent: result.predictedRent,
        confidenceScore: result.confidenceScore,
        cityData: result.cityData,
        explanation: result.explanation,
        modelVersion: result.modelVersion,
        createdAt: new Date().toISOString()
      };
      predictions.push(newPrediction);
      savePredictions(predictions);
      setHistory(prev => [newPrediction, ...prev]);
    }

    setLoading(false);
  }, [formData, user, validateForm]);

  const getChartData = () => {
    if (!prediction) return [];
    
    const baseRent = prediction.cityData.baseRate * formData.sqft;
    
    return [
      { name: 'Base Rent', value: baseRent, fill: '#8B5CF6' },
      { name: 'Modifiers', value: prediction.predictedRent - baseRent - (prediction.amenitiesBonus || 0), fill: '#06B6D4' },
      { name: 'Amenities', value: prediction.amenitiesBonus || 0, fill: '#EC4899' }
    ];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const downloadPDF = useCallback(() => {
    if (!prediction || !formData) return;

    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SmartRent AI - Rent Prediction Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #f0f0f0; }
          .logo { font-size: 24px; font-weight: bold; color: #8B5CF6; margin-bottom: 8px; }
          .subtitle { color: #666; font-size: 14px; }
          .result-box { background: linear-gradient(135deg, #8B5CF6, #06B6D4); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px; }
          .result-label { color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 8px; }
          .result-value { color: white; font-size: 36px; font-weight: bold; }
          .confidence { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; }
          .confidence-bar { width: 100px; height: 8px; background: rgba(255,255,255,0.3); border-radius: 4px; overflow: hidden; }
          .confidence-fill { height: 100%; background: white; border-radius: 4px; }
          .confidence-text { color: rgba(255,255,255,0.9); font-size: 12px; }
          .details { margin-bottom: 24px; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
          .detail-label { color: #666; font-size: 14px; }
          .detail-value { color: #333; font-size: 14px; font-weight: 500; }
          .explanation { background: #f8f8f8; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
          .explanation-title { font-size: 12px; color: #999; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
          .explanation-text { color: #555; font-size: 14px; line-height: 1.6; }
          .footer { text-align: center; padding-top: 24px; border-top: 2px solid #f0f0f0; }
          .model-info { font-size: 12px; color: #999; }
          .generated { font-size: 11px; color: #bbb; margin-top: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏠 SmartRent AI</div>
            <div class="subtitle">Rent Prediction Report</div>
          </div>
          
          <div class="result-box">
            <div class="result-label">Estimated Monthly Rent</div>
            <div class="result-value">${formatCurrency(prediction.predictedRent)}</div>
            <div class="confidence">
              <div class="confidence-bar"><div class="confidence-fill" style="width: ${prediction.confidenceScore}%"></div></div>
              <span class="confidence-text">${prediction.confidenceScore}% confidence</span>
            </div>
          </div>
          
          <div class="details">
            <div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">${formData.city}, ${formData.state}</span></div>
            ${formData.locality ? `<div class="detail-row"><span class="detail-label">Locality</span><span class="detail-value">${formData.locality}</span></div>` : ''}
            <div class="detail-row"><span class="detail-label">Property Type</span><span class="detail-value">${formData.propertyType}</span></div>
            <div class="detail-row"><span class="detail-label">BHK</span><span class="detail-value">${formData.bhk} BHK</span></div>
            <div class="detail-row"><span class="detail-label">Area</span><span class="detail-value">${formData.sqft} sqft</span></div>
            <div class="detail-row"><span class="detail-label">Furnishing</span><span class="detail-value">${formData.furnishing}</span></div>
            <div class="detail-row"><span class="detail-label">Floor</span><span class="detail-value">${formData.floorNumber}${formData.hasLift ? ' (with Lift)' : ''}</span></div>
            <div class="detail-row"><span class="detail-label">Property Age</span><span class="detail-value">${formData.propertyAge} years</span></div>
            <div class="detail-row"><span class="detail-label">Market Trend</span><span class="detail-value">${formData.marketTrend}</span></div>
            ${formData.nearbyAmenities?.length > 0 ? `<div class="detail-row"><span class="detail-label">Amenities</span><span class="detail-value">${formData.nearbyAmenities.join(', ')}</span></div>` : ''}
            <div class="detail-row"><span class="detail-label">City Min/Max</span><span class="detail-value">${formatCurrency(prediction.minRent)} - ${formatCurrency(prediction.maxRent)}</span></div>
          </div>
          
          <div class="explanation">
            <div class="explanation-title">Analysis</div>
            <div class="explanation-text">${prediction.explanation}</div>
          </div>
          
          <div class="footer">
            <div class="model-info">Model: ${prediction.modelVersion} • Global Minimum Rent: ₹5,000</div>
            <div class="generated">Generated on ${new Date().toLocaleString()}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.document.title = `SmartRent_Report_${formData.city}_${new Date().toISOString().split('T')[0]}`;
      printWindow.print();
    }, 250);
  }, [prediction, formData]);

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <main className="container-custom py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Rent Prediction Engine</h1>
          <p className="text-gray-400">Trained model estimating rent based on historical market data</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            {/* Map Section */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <h3 className="text-lg font-semibold text-white">Property Location</h3>
                {isGeocoding && (
                  <span className="flex items-center gap-1 text-sm text-primary-400 ml-auto">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Searching...
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-4">Type address below or click on the map. The map updates automatically.</p>
              <LocationMap ref={mapRef} onLocationSelect={handleLocationSelect} searchLocation={searchLocation} />
              {selectedLocation?.fullAddress && <p className="text-gray-400 text-xs mt-2 truncate">📍 {selectedLocation.fullAddress}</p>}
              {geocodeError && <p className="text-orange-400 text-sm mt-2 flex items-center gap-1">{geocodeError}</p>}
            </div>

            {/* Form */}
            <div className="glass rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <TextInput name="state" label="State" placeholder="e.g., Maharashtra, Uttar Pradesh" required value={formData.state} onChange={handleChange} error={errors.state} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>} />
                  <TextInput name="city" label="City" placeholder="e.g., Mumbai, Ghaziabad, Noida" required value={formData.city} onChange={handleChange} error={errors.city} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg>} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <TextInput name="locality" label="Locality/Society" placeholder="e.g., Wave City, DLF Phase" value={formData.locality} onChange={handleChange} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>} />
                  <TextInput name="area" label="Area/Road" placeholder="e.g., Sector 62, MG Road" value={formData.area} onChange={handleChange} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <SelectInput name="propertyType" label="Property Type" value={formData.propertyType} onChange={handleChange}>
                    {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </SelectInput>
                  <SelectInput name="bhk" label="BHK" value={formData.bhk} onChange={handleChange}>
                    {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} BHK</option>)}
                  </SelectInput>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <NumberInput name="sqft" label="Area (sqft)" placeholder="e.g., 500" required value={formData.sqft} onChange={handleChange} error={errors.sqft} min={1} max={10000} />
                  <SelectInput name="furnishing" label="Furnishing" value={formData.furnishing} onChange={handleChange}>
                    {furnishingTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </SelectInput>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <NumberInput name="propertyAge" label="Property Age (years)" placeholder="e.g., 5" value={formData.propertyAge} onChange={handleChange} min={0} max={100} />
                  <NumberInput name="floorNumber" label="Floor Number" placeholder="e.g., 3" value={formData.floorNumber} onChange={handleChange} min={0} max={100} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <SelectInput name="marketTrend" label="Market Trend" value={formData.marketTrend} onChange={handleChange}>
                    {marketTrends.map(trend => <option key={trend} value={trend}>{trend}</option>)}
                  </SelectInput>
                  <div className="flex items-end">
                    <CheckboxInput name="hasLift" label="Lift/Elevator Available" checked={formData.hasLift} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Nearby Amenities (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map(amenity => (
                      <button key={amenity} type="button" onClick={() => handleAmenityToggle(amenity)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${formData.nearbyAmenities.includes(amenity) ? 'bg-primary-500 text-white' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}>
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50">
                  {loading ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Calculating...</span> : 'Predict Rent'}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Prediction Result */}
          <motion.div id="prediction-result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <AnimatePresence mode="wait">
              {prediction ? (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400">{prediction.cityData.tier}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent-500/20 text-accent-400">{prediction.cityData.classification}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">{prediction.cityData.marketDensity} Demand</span>
                  </div>
                  <div className="text-center mb-6">
                    <p className="text-gray-400 mb-2">Estimated Monthly Rent</p>
                    <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="text-5xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                      {formatCurrency(prediction.predictedRent)}
                    </motion.div>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <div className="w-32 h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${prediction.confidenceScore >= 80 ? 'bg-green-500' : prediction.confidenceScore >= 60 ? 'bg-yellow-500' : 'bg-orange-500'}`} style={{ width: `${prediction.confidenceScore}%` }} />
                      </div>
                      <span className="text-gray-400 text-sm">{prediction.confidenceScore}% confidence</span>
                    </div>
                  </div>
                  <div className="bg-dark-800/50 rounded-xl p-4 mb-6">
                    <p className="text-gray-300 text-sm">{prediction.explanation}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-dark-800/30 rounded-xl p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">City Minimum</p>
                      <p className="text-green-400 font-semibold">{formatCurrency(prediction.minRent)}</p>
                    </div>
                    <div className="bg-dark-800/30 rounded-xl p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">City Maximum</p>
                      <p className="text-red-400 font-semibold">{formatCurrency(prediction.maxRent)}</p>
                    </div>
                  </div>
                  <div className="h-56">
                    <p className="text-sm font-medium text-gray-300 mb-3">Rent Breakdown</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData()} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                        <XAxis type="number" stroke="#9CA3AF" fontSize={11} tickFormatter={(value) => `₹${value/1000}k`} />
                        <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={11} width={80} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} formatter={(value) => [formatCurrency(value), '']} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Download PDF Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={downloadPDF}
                    className="w-full mt-4 py-3 bg-dark-700 hover:bg-dark-600 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF Report
                  </motion.button>
                  
                  <p className="text-gray-500 text-xs text-center mt-4">Model: {prediction.modelVersion} • Global Min: ₹5,000</p>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-6 text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-dark-800 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Ready to Predict</h3>
                  <p className="text-gray-400">Start typing an address or click on the map to begin</p>
                </motion.div>
              )}
            </AnimatePresence>

            {history.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8 glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Predictions</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {history.slice(0, 5).map((pred) => (
                    <div key={pred._id} className="flex justify-between items-center p-3 rounded-lg bg-dark-800/50 hover:bg-dark-700/50 transition-colors">
                      <div>
                        <p className="text-white font-medium">{pred.city}, {pred.state}</p>
                        <p className="text-gray-400 text-sm">{pred.bhk} BHK • {pred.sqft} sqft • {pred.propertyType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary-400 font-semibold">{formatCurrency(pred.predictedRent)}</p>
                        <p className="text-gray-500 text-xs">{new Date(pred.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-dark-700 mt-12">
        <div className="container-custom py-6 text-center text-gray-400 text-sm">
          <p>© 2024 SmartRent AI • Trained Model v2.1 • Global Minimum Rent: ₹5,000</p>
        </div>
      </footer>
    </div>
  );
}
