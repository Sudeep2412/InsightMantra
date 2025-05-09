
# functional libraries
import pandas as pd
import numpy as np
import seaborn as sns

# prophet model for time series forecasting
from prophet import Prophet

# directory for data
DATA_DIR = "../../InsightMantra-machine-learning/DATA/data.csv"
# reading  data
dataframe = pd.read_csv(DATA_DIR)

# data preprocessing
dataframe.dropna(inplace=True)
dataframe['year'] = pd.to_datetime(dataframe['week']).dt.year
dataframe['month'] = pd.to_datetime(dataframe['week']).dt.month
dataframe['day'] = pd.to_datetime(dataframe['week']).dt.day
dataframe['date'] = pd.to_datetime(dataframe[['year', 'month', 'day']])
dataframe.drop('week' , axis=1 , inplace=True)
dataframe.drop(columns=['year', 'month', 'day'], inplace=True)
dataframe.drop('record_ID' , axis=1 , inplace=True)
dataframe = dataframe.groupby('date')['units_sold'].sum().reset_index()
dataframe.sort_values('date')


# dataset for model
prophet_data = dataframe.reset_index()[['date', 'units_sold']]
prophet_data.rename(columns={'date': 'ds', 'units_sold': 'y'}, inplace=True)

# prophet model
model_prophet = Prophet()
model_prophet.fit(prophet_data)

# futre dates generator
future_dates = model_prophet.make_future_dataframe(periods=100)
# future prediction
forecast = model_prophet.predict(future_dates)

# convert forecasted data into json for plotting
forecast_json = forecast.to_json()

json_file_path = 'sales_forecasting.json'

with open(json_file_path , 'w') as json_file:
    json_file.write(forecast_json)
    
