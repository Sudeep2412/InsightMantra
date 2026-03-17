import pandas as pd
import numpy as np
from datetime import timedelta
import logging

try:
    from prophet import Prophet
except ImportError:
    Prophet = None
    
try:
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.preprocessing import StandardScaler
except ImportError:
    RandomForestRegressor = None
    StandardScaler = None

logger = logging.getLogger(__name__)

class SalesPredictor:
    def __init__(self):
        self.prophet_model = None
        self.rf_model = None
        self.scaler = None
        self.is_trained = False
        
    def prepare_features(self, df):
        """
        Calculates rolling averages and lag features for the RF model.
        """
        df = df.copy()
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.sort_values('Date')
        
        # Create lag features
        df['Price_Lag_7'] = df['Average_Market_Price'].shift(7)
        df['Sentiment_Lag_7'] = df['Daily_Sentiment_Score'].shift(7)
        
        # Rolling averages
        df['Sales_MA_7'] = df['Units_Sold'].rolling(window=7).mean()
        df['Sales_MA_30'] = df['Units_Sold'].rolling(window=30).mean()
        
        df = df.dropna()
        return df

    def train(self, df):
        """
        Trains the Prophet + Random Forest hybrid model.
        """
        if Prophet is None or RandomForestRegressor is None:
            logger.warning("Prophet or scikit-learn is not installed. Falling back to simple heuristic for predictions.")
            # We don't fail, we just fallback to a dummy model during inference
            return False
            
        df['Date'] = pd.to_datetime(df['Date'])
        
        # 1. Train Prophet for baseline seasonality
        prophet_df = df[['Date', 'Units_Sold']].rename(columns={'Date': 'ds', 'Units_Sold': 'y'})
        self.prophet_model = Prophet(yearly_seasonality=True, weekly_seasonality=True)
        self.prophet_model.fit(prophet_df)
        
        # Get prophet predictions for training set as a feature
        prophet_pred = self.prophet_model.predict(prophet_df)
        df['Prophet_Baseline'] = prophet_pred['yhat'].values
        
        # 2. Train Random Forest on the residuals
        features_df = self.prepare_features(df)
        
        features = [
            'Prophet_Baseline', 'Average_Market_Price', 'Daily_Sentiment_Score',
            'Price_Lag_7', 'Sentiment_Lag_7', 'Sales_MA_7', 'Sales_MA_30'
        ]
        
        X = features_df[features]
        y = features_df['Units_Sold']
        
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        self.rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.rf_model.fit(X_scaled, y)
        
        self.is_trained = True
        return True

    def predict(self, df_recent, days=30):
        """
        Generates forecast for the next `days`.
        `df_recent` should be the most recent 30+ days of data.
        """
        last_date = pd.to_datetime(df_recent['Date'].max())
        future_dates = pd.DataFrame({'ds': [last_date + timedelta(days=i) for i in range(1, days + 1)]})
        
        if not self.is_trained:
            logger.warning("Models are not trained yet, returning dummy heuristic forecast.")
            dates = future_dates['ds'].dt.strftime('%Y-%m-%d').tolist()
            # Simple heuristic
            avg_sales = df_recent['Units_Sold'].mean()
            return {
                "dates": dates,
                "predictions": [int(avg_sales + np.random.normal(0, 2)) for _ in range(days)],
                "confidence_lower": [int(avg_sales * 0.8) for _ in range(days)],
                "confidence_upper": [int(avg_sales * 1.2) for _ in range(days)]
            }

        # 1. Get Prophet baseline
        prophet_forecast = self.prophet_model.predict(future_dates)
        
        # 2. Simulate future features for RF (simplified: carry forward last known values)
        # In a real scenario, you'd auto-regressively predict the features or use Prophet for each feature
        # For this prototype, we'll fuse Prophet's output natively.
        
        predictions = []
        lower_bound = []
        upper_bound = []
        
        for idx, row in prophet_forecast.iterrows():
            base_pred = row['yhat']
            predictions.append(int(max(0, base_pred)))
            lower_bound.append(int(max(0, row['yhat_lower'])))
            upper_bound.append(int(max(0, row['yhat_upper'])))
            
        return {
            "dates": future_dates['ds'].dt.strftime('%Y-%m-%d').tolist(),
            "predictions": predictions,
            "confidence_lower": lower_bound,
            "confidence_upper": upper_bound
        }
