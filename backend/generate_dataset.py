"""
generate_dataset.py
--------------------
Generates a realistic synthetic dataset of rental property listings
for SmartRent AI. Real-world rent data is hard to get for free in bulk,
so we simulate listings using price-driving factors that actually matter
in the Indian rental market (city tier, locality, BHK, area, furnishing,
floor, building age, amenities, distance to metro/transit).

Run: python3 generate_dataset.py
Output: rental_data.csv
"""

import numpy as np
import pandas as pd

np.random.seed(42)

N = 3000  # number of listings

cities = ["Bangalore", "Ghaziabad", "Noida", "Pune", "Hyderabad"]
# base price per sqft per city (INR/month) - reflects real relative rent levels
city_base_rate = {
    "Bangalore": 28,
    "Ghaziabad": 14,
    "Noida": 18,
    "Pune": 22,
    "Hyderabad": 20,
}

furnishing_types = ["Unfurnished", "Semi-Furnished", "Fully-Furnished"]
furnishing_multiplier = {"Unfurnished": 1.0, "Semi-Furnished": 1.15, "Fully-Furnished": 1.35}

city = np.random.choice(cities, N)
bhk = np.random.choice([1, 2, 3, 4], N, p=[0.25, 0.4, 0.25, 0.10])
area_sqft = (bhk * np.random.normal(420, 60, N)).clip(250, 3200)
furnishing = np.random.choice(furnishing_types, N, p=[0.4, 0.4, 0.2])
floor = np.random.randint(0, 20, N)
total_floors = floor + np.random.randint(1, 15, N)
building_age_years = np.random.randint(0, 30, N)
distance_to_metro_km = np.random.exponential(2.5, N).clip(0.1, 15)
amenities_score = np.random.randint(0, 11, N)  # 0-10 scale (gym, pool, security, parking, etc.)

# ---- Price generation formula (ground truth the model must learn) ----
base_rate = np.array([city_base_rate[c] for c in city])
furn_mult = np.array([furnishing_multiplier[f] for f in furnishing])

price = area_sqft * base_rate * furn_mult
price *= (1 + amenities_score * 0.015)                 # amenities add value
price *= (1 - building_age_years * 0.004)               # older buildings lose value
price *= (1 - distance_to_metro_km * 0.01)               # farther from metro = cheaper
price *= (1 + (floor / (total_floors + 1)) * 0.05)       # higher floor, slight premium
price += np.random.normal(0, price * 0.06)               # add ~6% market noise

price = price.clip(4000, None).round(-2)  # round to nearest 100, floor at 4000

df = pd.DataFrame({
    "city": city,
    "bhk": bhk,
    "area_sqft": area_sqft.round(0).astype(int),
    "furnishing": furnishing,
    "floor": floor,
    "total_floors": total_floors,
    "building_age_years": building_age_years,
    "distance_to_metro_km": distance_to_metro_km.round(2),
    "amenities_score": amenities_score,
    "monthly_rent": price.astype(int),
})

df.to_csv("rental_data.csv", index=False)
print(f"Generated {len(df)} rows -> rental_data.csv")
print(df.head())
print("\nRent stats:\n", df["monthly_rent"].describe())
