# SmartRent AI — ML Rent Prediction Backend

This adds a real machine learning backend to the existing SmartRent AI
React frontend: a trained model that predicts monthly rent for a
property based on its features, served over a small Flask API.

## How it works (pipeline)

1. **`generate_dataset.py`** — builds a dataset of 3,000 synthetic rental
   listings (`rental_data.csv`) across 5 cities, using realistic pricing
   rules (city rate, BHK, area, furnishing, floor, building age, distance
   to metro, amenities) plus random noise, so it behaves like real market
   data.
2. **`train_model.py`** — the actual ML step:
   - **Feature engineering**: derives `floor_ratio`, `is_ground_floor`,
     `is_new_building` from the raw columns.
   - **Preprocessing**: `StandardScaler` on numeric features,
     `OneHotEncoder` on categorical features (`city`, `furnishing`),
     combined via `ColumnTransformer` in a single `Pipeline`.
   - **Model training**: trains and compares **Linear Regression**
     (baseline) vs **Random Forest Regressor**.
   - **Evaluation**: RMSE, MAE, and R² on a held-out 20% test set.
   - Saves the winning pipeline to `model.joblib`.
3. **`app.py`** — a Flask API with a `/predict` endpoint that loads
   `model.joblib` and returns a predicted rent for a JSON payload of
   property details. This is what your React app calls (it already has
   `axios` in `package.json`, so no new frontend dependency is needed).

## Results on this run

| Model             | RMSE (₹) | MAE (₹) | R²     |
|-------------------|---------:|--------:|-------:|
| Linear Regression | 2,980    | 2,116   | 0.9415 |
| Random Forest      | 2,155    | 1,512   | 0.9694 |

Random Forest was selected automatically (higher R², lower error).
Top predictive features: `area_sqft`, `city`, `furnishing`.

## Running it

```bash
pip install -r requirements.txt
python3 generate_dataset.py   # creates rental_data.csv
python3 train_model.py        # trains model, saves model.joblib
python3 app.py                # starts API on http://localhost:5000
```

Then from your existing React app:

```js
import axios from "axios";

const res = await axios.post("http://localhost:5000/predict", {
  city: "Bangalore",
  bhk: 2,
  area_sqft: 950,
  furnishing: "Semi-Furnished",
  floor: 4,
  total_floors: 12,
  building_age_years: 5,
  distance_to_metro_km: 1.2,
  amenities_score: 7,
});

console.log(res.data.predicted_rent); // e.g. 31700
```

## Notes for interviews

- The dataset is **synthetic but rule-based**, not random — it was
  generated using real rent-driving factors (location, size, furnishing,
  amenities, metro distance) with added noise, since large free real
  rental datasets aren't readily available. Be upfront about this if asked.
- The pipeline structure (feature engineering → preprocessing →
  train/test split → model comparison → evaluation) mirrors a real
  production ML workflow and is exactly what to walk an interviewer
  through.
