# InsightMantra

## Description
InsightMantra is a comprehensive project encompassing multiple facets including a frontend built with React, a backend with Flask, machine learning algorithms, and data visualization. The project aims to provide insights through data visualization and machine learning models.

## Table of Contents
1. [Frontend Project](#frontend-project)
    - [Description](#frontend-description)
    - [Installation](#frontend-installation)
    - [Usage](#frontend-usage)
    - [Project Structure](#frontend-project-structure)
    - [Available Scripts](#frontend-available-scripts)
    - [Configuration](#frontend-configuration)
    - [Contributing](#frontend-contributing)
    - [Credits](#frontend-credits)
2. [Backend Project](#backend-project)
    - [Description](#backend-description)
    - [Installation](#backend-installation)
    - [Usage](#backend-usage)
    - [Endpoints](#backend-endpoints)
    - [Configuration](#backend-configuration)
    - [Running Tests](#backend-running-tests)
    - [Contributing](#backend-contributing)
3. [Amazon Reviews Scraper](#amazon-reviews-scraper)
    - [Description](#amazon-reviews-scraper-description)
    - [Requirements](#amazon-reviews-scraper-requirements)
    - [Usage](#amazon-reviews-scraper-usage)
4. [Demand Forecasting](#demand-forecasting)
    - [Description](#demand-forecasting-description)
    - [Requirements](#demand-forecasting-requirements)
    - [Usage](#demand-forecasting-usage)
5. [Web Scraping](#web-scraping)
    - [Description](#web-scraping-description)
    - [Requirements](#web-scraping-requirements)
    - [Installation](#web-scraping-installation)
6. [Visualization Branch](#visualization-branch)
    - [Description](#visualization-branch-description)
    - [Requirements](#visualization-branch-requirements)
    - [Installation](#visualization-branch-installation)
    - [Usage](#visualization-branch-usage)
    - [Contributing](#visualization-branch-contributing)
7. [Acknowledgments](#acknowledgments)
8. [License](#license)

## Frontend Project

### Description
This is a frontend project built with HTML, CSS, JavaScript, React, Chart.js, and Tailwind CSS. The project visualizes data using interactive charts and provides a responsive user interface.

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/your-repo-name.git
    ```
2. Navigate to the project directory:
    ```sh
    cd your-repo-name
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

### Usage

1. Start the development server:
    ```sh
    npm run dev
    ```
    The application will run on http://localhost:3000.

### Project Structure

your-repo-name/
├── public/
│ ├── index.html
│ └── ...
├── src/
│ ├── components/
│ │ ├── Hero.jsx (Landing Page)
│ │ └── ...
│ ├── styles/
│ │ ├── tailwind.css
│ │ └── ...
│ ├── App.js
│ ├── index.js
│ └── ...
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md


### Available Scripts

- `npm start`: Runs the app in development mode. Open http://localhost:3000 to view it in the browser.
- `npm run build`: Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### Configuration

Configuration for Tailwind CSS is managed in the `tailwind.config.js` file. You can customize the Tailwind CSS configuration to suit your needs.

Example Configuration:
```javascript
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```
### Contributing
Contributions are welcome! Please follow these steps to contribute:

* Fork the repository.
* Create a new branch (git checkout -b feature-branch).
* Make your changes.
* Commit your changes (git commit -m 'Add some feature').
* Push to the branch (git push origin feature-branch).
* Open a pull request.
### Credits
This project was inspired by and uses code from the Brainwave repository by Adrian Hajdin for Frontend only.

### Backend Project
#### Description
This is a Flask backend project designed to handle the Insight Mantra Backend. The project provides a RESTful API.

### Installation
Clone the repository:
sh
Copy code
git clone https://github.com/yourusername/your-repo-name.git
Navigate to the project directory:
sh
Copy code
cd your-repo-name
Create a virtual environment:
sh
Copy code
python -m venv venv
### Activate the virtual environment:
### On Windows:
sh
Copy code
venv\Scripts\activate
### On macOS/Linux:
sh
Copy code
source venv/bin/activate
Install the dependencies:
sh
Copy code
pip install -r requirements.txt
Usage
Set up environment variables:

Create a .env file in the root directory.
Add necessary environment variables as shown in the .env.example file.
### Run the Flask application:

sh
Copy code
flask run
By default, the application will run on http://127.0.0.1:5000.

### Configuration
Configuration is managed using environment variables. You can set these variables in a .env file or export them in your shell.

* Example Configuration:

sh
Copy code
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URI=sqlite:///your-database.db
SECRET_KEY=your_secret_key

### Running Tests
To run tests, use the following command:

sh
Copy code
pytest
Ensure you have installed the test dependencies listed in requirements.txt.


### Amazon Reviews Scraper
#### Description
This project uses Selenium and BeautifulSoup to scrape reviews from an Amazon product page. The script extracts a specified number of reviews and saves them to a CSV file.

### Requirements
Python 3.7+
selenium
beautifulsoup4
pandas
Microsoft Edge WebDriver
Usage
Replace the placeholder path to the Edge WebDriver executable with the actual path on your system:

### python
Copy code
edge_driver_path = 'C:/msedgedriver.exe'  # Replace with the actual path
The script will scrape the reviews and save them to a CSV file named amazon_reviews.csv.

### Amazon Reviews Sentiment Analysis
Description
This project uses Transformer models to analyze the sentiment of Amazon product reviews. The script processes the reviews, performs sentiment analysis, and saves the results to a JSON file for plotting.

### Requirements
Python 3.7+
torch
transformers
pandas
tqdm
numpy
matplotlib
re
json
### Usage
Place your dataset in the specified directory with the filename amazon_reviews.csv:
python
Copy code
DATA_DIR = "/home/aman/code/ML/demand_prd/REFACTORED/DATA/amazon_reviews.csv"
The script will preprocess the data, perform sentiment analysis, and save the results to a JSON file named plotting_data.json.
### Demand Forecasting
#### Description
This project uses the Prophet model for time series forecasting to predict future sales. The dataset consists of weekly sales data, which is preprocessed and used to train the model. The forecasted results are saved in a JSON file for further analysis.

### Requirements
Python


