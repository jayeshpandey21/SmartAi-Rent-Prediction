"""
train_model.py
---------------
Trains a rental price prediction model for SmartRent AI.

Pipeline:
1. Load raw listing data
2. Feature engineering (derived features that help the model)
3. Preprocessing (scaling numeric features, one-hot encoding categoricals)
4. Train/test split
5. Train and compare two models: Linear Regression (baseline) and
   Random Forest Regressor (main model)
6. Evaluate with RMSE, MAE, and R^2
7. Save the best model + preprocessing pipeline to disk (model.joblib)
   so the Flask API (app.py) can load it and serve predictions.

Run: python3 train_model.py
"""

import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# ---------------------------------------------------------------
# 1. Load data
# ---------------------------------------------------------------
df = pd.read_csv("rental_data.csv")

# ---------------------------------------------------------------
# 2. Feature engineering
#    Raw columns alone don't capture everything useful - we derive
#    a couple of features that typically improve rent-prediction models.
# ---------------------------------------------------------------
df["rent_per_sqft_city_avg"] = df.groupby("city")["monthly_rent"].transform("mean") / \
                                 df.groupby("city")["area_sqft"].transform("mean")
df["floor_ratio"] = df["floor"] / df["total_floors"].replace(0, 1)
df["is_ground_floor"] = (df["floor"] == 0).astype(int)
df["is_new_building"] = (df["building_age_years"] <= 3).astype(int)

target = "monthly_rent"
numeric_features = [
    "bhk", "area_sqft", "floor", "total_floors", "building_age_years",
    "distance_to_metro_km", "amenities_score", "floor_ratio",
    "is_ground_floor", "is_new_building",
]
categorical_features = ["city", "furnishing"]

X = df[numeric_features + categorical_features]
y = df[target]

# ---------------------------------------------------------------
# 3. Preprocessing pipeline
#    - numeric features: standard scaling
#    - categorical features: one-hot encoding
# ---------------------------------------------------------------
preprocessor = ColumnTransformer(transformers=[
    ("num", StandardScaler(), numeric_features),
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
])

# ---------------------------------------------------------------
# 4. Train/test split (80/20)
# ---------------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ---------------------------------------------------------------
# 5. Train + compare models
# ---------------------------------------------------------------
models = {
    "Linear Regression": LinearRegression(),
    "Random Forest": RandomForestRegressor(
        n_estimators=200, max_depth=12, random_state=42, n_jobs=-1
    ),
}

results = {}
fitted_pipelines = {}

for name, model in models.items():
    pipe = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("model", model),
    ])
    pipe.fit(X_train, y_train)
    preds = pipe.predict(X_test)

    rmse = np.sqrt(mean_squared_error(y_test, preds))
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)

    results[name] = {"RMSE": rmse, "MAE": mae, "R2": r2}
    fitted_pipelines[name] = pipe

# ---------------------------------------------------------------
# 6. Report results
# ---------------------------------------------------------------
print("\nModel comparison on held-out test set (20% of data):")
print(f"{'Model':<20}{'RMSE (Rs)':<15}{'MAE (Rs)':<15}{'R2':<10}")
for name, m in results.items():
    print(f"{name:<20}{m['RMSE']:<15.0f}{m['MAE']:<15.0f}{m['R2']:<10.4f}")

# Pick the best model by R2
best_name = max(results, key=lambda n: results[n]["R2"])
best_pipe = fitted_pipelines[best_name]
print(f"\nBest model: {best_name} (R2={results[best_name]['R2']:.4f})")

# ---------------------------------------------------------------
# 7. Feature importance (Random Forest only - helps explain the model)
# ---------------------------------------------------------------
if best_name == "Random Forest":
    ohe = best_pipe.named_steps["preprocessor"].named_transformers_["cat"]
    cat_names = list(ohe.get_feature_names_out(categorical_features))
    feature_names = numeric_features + cat_names
    importances = best_pipe.named_steps["model"].feature_importances_
    fi = pd.Series(importances, index=feature_names).sort_values(ascending=False)
    print("\nTop 5 most important features:")
    print(fi.head(5).round(4))

# ---------------------------------------------------------------
# 8. Save the trained pipeline (preprocessing + model together)
# ---------------------------------------------------------------
joblib.dump(best_pipe, "model.joblib")
print("\nSaved trained pipeline -> model.joblib")
