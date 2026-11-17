"""
app.py
------
Flask backend for SmartRent AI. Loads the trained model (model.joblib)
and exposes a /predict endpoint that the React frontend (Vite/axios)
can call to get a predicted monthly rent for a property.

Run: python3 app.py
Then from your React app (with axios already in package.json):

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
        amenities_score: 7
    });
    console.log(res.data.predicted_rent);
"""

from flask import Flask, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    """Manually allow the React dev server (localhost:3000) to call this API.
    (Avoids needing the extra flask-cors package - one less thing to install.)"""
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

model = joblib.load("model.joblib")

REQUIRED_FIELDS = [
    "city", "bhk", "area_sqft", "furnishing", "floor",
    "total_floors", "building_age_years", "distance_to_metro_km",
    "amenities_score",
]


def engineer_features(payload: dict) -> pd.DataFrame:
    """Apply the same feature engineering used in train_model.py
    to a single incoming request."""
    df = pd.DataFrame([payload])
    df["floor_ratio"] = df["floor"] / df["total_floors"].replace(0, 1)
    df["is_ground_floor"] = (df["floor"] == 0).astype(int)
    df["is_new_building"] = (df["building_age_years"] <= 3).astype(int)
    return df


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)

    missing = [f for f in REQUIRED_FIELDS if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    try:
        features_df = engineer_features(data)
        prediction = model.predict(features_df)[0]
        return jsonify({
            "predicted_rent": round(float(prediction), -2),
            "currency": "INR",
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})


if __name__ == "__main__":
    app.run(debug=False, port=5000)
