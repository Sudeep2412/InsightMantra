# InsightMantra

# Description<br>
All of machine learning algorithms used in the projects 

# AMAZON[AMAZON]<br>
### Amazon Reviews Scraper
This project uses Selenium and BeautifulSoup to scrape reviews from an Amazon product page. The script extracts a specified number of reviews and saves them to a CSV file.

## Requirements<br>
  * Python 3.7+
  * selenium
  * beautifulsoup4
  * pandas
  * Microsoft Edge WebDriver

## Usage<br>
  Replace the placeholder path to the Edge WebDriver executable with the actual path on your system:
  ```
edge_driver_path = 'C:/msedgedriver.exe'  # Replace with the actual path
```
The script will scrape the reviews and save them to a CSV file named amazon_reviews.csv.<br>

## Amazon Reviews Sentiment Analysis
This project uses Transformer models to analyze the sentiment of Amazon product reviews. The script processes the reviews, performs sentiment analysis, and saves the results to a JSON file for plotting. <br>
## Requirements<br>
  * Python 3.7+<br>
  * torch<br>
  * transformers<br>
  * pandas<br>
  * tqdm<br>
  * numpy<br>
  * matplotlib<br>
  * re<br>
  * json<br>

## Usage<br>
  Place your dataset in the specified directory with the filename amazon_reviews.csv
  ```
DATA_DIR = "/home/aman/code/ML/demand_prd/REFACTORED/DATA/amazon_reviews.csv"
```
  The script will preprocess the data, perform sentiment analysis, and save the results to a JSON file named plotting_data.json.

## Keyword Extraction
This project uses NLTK and Transformer models to analyze the sentiment of Amazon product reviews, preprocess the text, and extract keywords from positive and negative reviews.

## Requirements
  * Python 3.7+
  * nltk
  * torch
  * transformers
  * pandas
  * scikit-learn

## Usage
  Place your dataset in the specified directory with the filename amazon_reviews.csv
  ```
data_dir = "/home/aman/code/ML/demand_prd/REFACTORED/DATA/amazon_reviews.csv"
```
The script will preprocess the data, perform sentiment analysis, extract keywords, and summarize the results.


# DEMAND FORECASTING[DEMAND FORECASTING]<br>

This project uses the Prophet model for time series forecasting to predict future sales. The dataset consists of weekly sales data, which is preprocessed and used to train the model. The forecasted results are saved in a JSON file for further analysis

## Requirements :-<br>
* Python 3.7+<br>
* pandas<br>
*  numpy<br>
* seaborn<br>
* prophet<br>

## Usage :-<br>
Place your dataset in the ./data directory with the filename data.csv. The dataset should have the following columns:
  * week: Date of the week in YYYY-MM-DD format
  * record_ID: Unique identifier for each record
  * units_sold: Number of units sold for that week

# WEB_SCRAPPING[WEB_SCRAPPING]
This project uses Selenium to extract product details from Amazon based on a given product name. It consolidates the data to calculate the ratios of quantities sold for different companies and saves the results to a JSON file basically giving information about the competitors and their market capture

## Requirements
  * Python 3.7+
  * selenium
  * json

## Installation
  * Download the Edge WebDriver and place it in the specified directory:
  * Download: https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/
Place the msedgedriver.exe in a suitable directory and update the path in the script.<br>

# DATA[DATA]
* toy dataset for testing various functionalities

# This file is part of the InsightMantra.
# It is licensed under the MIT License. See the LICENSE file for more details.

               
