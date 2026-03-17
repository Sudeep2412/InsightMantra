import pandas as pd
import numpy as np
from datetime import timedelta, date

def generate_synthetic_sales_data(product_id="PROD_001", start_date="2024-01-01", days=365):
    """
    Generates synthetic daily sales data with Q4 seasonality.
    Columns: Date, Product_ID, Units_Sold, Average_Market_Price, Daily_Sentiment_Score
    """
    start = pd.to_datetime(start_date)
    dates = [start + timedelta(days=i) for i in range(days)]
    
    data = []
    base_price = 49.99
    base_sales = 50
    
    for d in dates:
        # Base sentiment between 3.5 and 5.0
        sentiment = round(np.random.uniform(3.5, 5.0), 2)
        
        # Price fluctuates slightly around base_price
        price = round(np.random.normal(base_price, 2.0), 2)
        
        # Seasonality: higher sales in Q4 (Oct, Nov, Dec), lower in summer
        month = d.month
        seasonality_factor = 1.0
        if month in [10, 11, 12]:
            seasonality_factor = 1.3 + (0.1 * (month - 10)) # peaks in Dec
        elif month in [6, 7, 8]:
            seasonality_factor = 0.8 # summer slump
            
        # Sales affected by sentiment (higher sentiment = more sales) and negative price elasticity
        sentiment_factor = (sentiment / 5.0)
        price_factor = (base_price / price) # cheaper = more sales
        
        # Calculate daily sales
        daily_sales = int(base_sales * seasonality_factor * sentiment_factor * price_factor)
        
        # Add some random noise
        daily_sales += int(np.random.normal(0, 5))
        daily_sales = max(0, daily_sales) # no negative sales
        
        data.append({
            "Date": d.strftime("%Y-%m-%d"),
            "Product_ID": product_id,
            "Units_Sold": daily_sales,
            "Average_Market_Price": price,
            "Daily_Sentiment_Score": sentiment
        })
        
    df = pd.DataFrame(data)
    return df

if __name__ == "__main__":
    import os
    # Generate 2 years of data
    df = generate_synthetic_sales_data(days=730)
    
    # Save to uploads folder
    upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
    os.makedirs(upload_dir, exist_ok=True)
    
    filepath = os.path.join(upload_dir, 'synthetic_sales_data.csv')
    df.to_csv(filepath, index=False)
    print(f"Generated synthetic data saved to {filepath}")
