"""
SmartRent AI - Model Training Script
===================================
This script trains the rent prediction model using scikit-learn
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

# Output directories
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
os.makedirs(MODEL_DIR, exist_ok=True)


def generate_sample_data(n_samples=5000):
    """
    Generate realistic sample rental data for training
    """
    np.random.seed(42)
    
    cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
              'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Kochi',
              'Indore', 'Noida', 'Gurgaon', 'Bhubaneswar', 'Chandigarh']
    
    property_types = ['Apartment', 'Villa', 'Independent House']
    furnishing_types = ['Unfurnished', 'Semi', 'Fully']
    trends = ['Low', 'Medium', 'High']
    
    data = {
        'city': np.random.choice(cities, n_samples),
        'propertyType': np.random.choice(property_types, n_samples),
        'bhk': np.random.randint(1, 5, n_samples),
        'area': np.random.randint(300, 3000, n_samples),
        'furnishing': np.random.choice(furnishing_types, n_samples),
        'propertyAge': np.random.randint(0, 30, n_samples),
        'floorNumber': np.random.randint(0, 20, n_samples),
        'marketTrend': np.random.choice(trends, n_samples),
        'numAmenities': np.random.randint(0, 6, n_samples)
    }
    
    # Calculate realistic rent with some noise
    base_rents = {
        'Mumbai': 35000, 'Delhi': 28000, 'Bangalore': 32000,
        'Hyderabad': 22000, 'Chennai': 24000, 'Pune': 22000,
        'Kolkata': 18000, 'Ahmedabad': 16000, 'Jaipur': 14000,
        'Kochi': 18000, 'Indore': 12000, 'Noida': 20000,
        'Gurgaon': 24000, 'Bhubaneswar': 14000, 'Chandigarh': 16000
    }
    
    area_weights = {
        'Mumbai': 18, 'Delhi': 15, 'Bangalore': 16, 'Hyderabad': 12,
        'Chennai': 12, 'Pune': 12, 'Kolkata': 10, 'Ahmedabad': 9,
        'Jaipur': 8, 'Kochi': 10, 'Indore': 8, 'Noida': 12,
        'Gurgaon': 14, 'Bhubaneswar': 8, 'Chandigarh': 9
    }
    
    bhk_factors = {1: 0, 2: 5000, 3: 10000, 4: 15000}
    furnishing_bonus = {'Unfurnished': 0, 'Semi': 3000, 'Fully': 6000}
    trend_multiplier = {'Low': 0.9, 'Medium': 1.0, 'High': 1.15}
    
    rents = []
    for i in range(n_samples):
        city = data['city'][i]
        base = base_rents[city]
        area_contrib = data['area'][i] * area_weights[city]
        bhk_contrib = bhk_factors.get(data['bhk'][i], 0)
        furnish_contrib = furnishing_bonus[data['furnishing'][i]]
        trend_mult = trend_multiplier[data['marketTrend'][i]]
        amenities_contrib = data['numAmenities'][i] * 500
        
        rent = (base + area_contrib + bhk_contrib + furnish_contrib + amenities_contrib) * trend_mult
        rent -= data['propertyAge'][i] * 200
        
        # Add noise
        rent += np.random.normal(0, rent * 0.05)
        rents.append(max(rent, 3000))
    
    data['rent'] = rents
    
    return pd.DataFrame(data)


def encode_features(df):
    """
    Encode categorical features
    """
    # City encoding
    city_encoding = {
        'Mumbai': 0, 'Delhi': 1, 'Bangalore': 2, 'Hyderabad': 3, 'Chennai': 4,
        'Pune': 5, 'Kolkata': 6, 'Ahmedabad': 7, 'Jaipur': 8, 'Kochi': 9,
        'Indore': 10, 'Noida': 11, 'Gurgaon': 12, 'Bhubaneswar': 13, 'Chandigarh': 14
    }
    
    property_encoding = {'Apartment': 0, 'Villa': 1, 'Independent House': 2}
    furnishing_encoding = {'Unfurnished': 0, 'Semi': 1, 'Fully': 2}
    trend_encoding = {'Low': 0, 'Medium': 1, 'High': 2}
    
    df['city_encoded'] = df['city'].map(city_encoding)
    df['propertyType_encoded'] = df['propertyType'].map(property_encoding)
    df['furnishing_encoded'] = df['furnishing'].map(furnishing_encoding)
    df['marketTrend_encoded'] = df['marketTrend'].map(trend_encoding)
    
    return df


def train_model():
    """
    Main training function
    """
    print("🚀 SmartRent AI Model Training")
    print("=" * 50)
    
    # Generate sample data
    print("📊 Generating sample training data...")
    df = generate_sample_data(10000)
    print(f"   Generated {len(df)} samples")
    
    # Encode features
    print("🔄 Encoding features...")
    df = encode_features(df)
    
    # Features and target
    feature_cols = [
        'city_encoded', 'propertyType_encoded', 'bhk', 'area',
        'furnishing_encoded', 'propertyAge', 'floorNumber',
        'marketTrend_encoded', 'numAmenities'
    ]
    
    X = df[feature_cols]
    y = df['rent']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"   Training samples: {len(X_train)}")
    print(f"   Test samples: {len(X_test)}")
    
    # Scale features
    print("📐 Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest
    print("🌲 Training Random Forest model...")
    rf_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = rf_model.predict(X_test_scaled)
    
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    print("\n📈 Model Performance:")
    print(f"   Mean Absolute Error: ₹{mae:,.0f}")
    print(f"   Root Mean Squared Error: ₹{rmse:,.0f}")
    print(f"   R² Score: {r2:.4f}")
    
    # Feature importance
    print("\n🎯 Feature Importance:")
    importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': rf_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    for _, row in importance.iterrows():
        print(f"   {row['feature']}: {row['importance']:.4f}")
    
    # Save models
    print("\n💾 Saving models...")
    joblib.dump(rf_model, os.path.join(MODEL_DIR, 'rent_model.pkl'))
    joblib.dump(scaler, os.path.join(MODEL_DIR, 'scaler.pkl'))
    
    # Save encoder mappings
    encoder_config = {
        'city_encoding': {
            'Mumbai': 0, 'Delhi': 1, 'Bangalore': 2, 'Hyderabad': 3, 'Chennai': 4,
            'Pune': 5, 'Kolkata': 6, 'Ahmedabad': 7, 'Jaipur': 8, 'Kochi': 9,
            'Indore': 10, 'Noida': 11, 'Gurgaon': 12, 'Bhubaneswar': 13, 'Chandigarh': 14
        },
        'property_encoding': {'Apartment': 0, 'Villa': 1, 'Independent House': 2},
        'furnishing_encoding': {'Unfurnished': 0, 'Semi': 1, 'Fully': 2},
        'trend_encoding': {'Low': 0, 'Medium': 1, 'High': 2}
    }
    joblib.dump(encoder_config, os.path.join(MODEL_DIR, 'encoder.pkl'))
    
    print("\n✅ Training complete!")
    print(f"   Models saved to: {MODEL_DIR}")
    
    return rf_model, scaler


if __name__ == "__main__":
    train_model()
