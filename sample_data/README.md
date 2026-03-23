# 🌟 InsightMantra Sample Datasets

This directory contains advanced, industry-grade synthetic datasets ready to be uploaded to the **InsightMantra** Deep Data Fusion Hub. These datasets simulate real-world e-commerce velocity and signals.

## 📂 Available Datasets

### 1. `premium_sales_data.csv`
A high-tech, 365-day telemetry dataset simulating enterprise-level sales performance.
- **Data Points Include:**
  - `Date`: Timestamp corresponding to operational days.
  - `Units_Sold`: Simulated sales velocity with seasonal sin-wave trends and poisson noise.
  - `Average_Market_Price`: Simulated competitor pricing matrix.
  - `Daily_Sentiment_Score`: NLP-driven brand sentiment (between 0.6 and 0.95).
  - `Ad_Spend`: Daily marketing expenditure in USD.
  - `Inventory_Levels`: Warehouse stock telemetry.
- **Usage:** Upload this to the frontend Dashboard to instantly trigger a retraining of the Random Forest & Prophet hybrid model, and watch the 30-day forecast dynamically adjust!

### 2. `competitor_market_share.csv`
Simulates live scraping data capturing the top 5 brands in your niche.
- **Data Points Include:** Market Share (%), Average Rating, Feedback Count, Product Volume.
- **Usage:** Used primarily by the Flask backend scripts for constructing the Spider webs and Brand matrices.

---

*To generate fresh variations of this telemetry, refer to the underlying data generation scripts in `backend/ML/synthetic_data_gen.py`.*
