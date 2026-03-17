# InsightMantra 🛡️

**InsightMantra** is an advanced market intelligence and sentiment analysis platform. It leverages state-of-the-art machine learning models and automated web scraping to provide real-time insights into product performance, brand market share, and customer sentiment across major e-commerce platforms like eBay and Amazon.

---

## 🚀 Key Features

- **Automated Multi-Platform Scraping**: Intelligent drivers for eBay and Amazon that handle dynamic content, pagination, and anti-bot measures.
- **Sentiment Analysis Deep Dive**: Uses **RoBERTa-based** transformer models for high-accuracy sentiment classification (Positive, Neutral, Negative) of customer reviews.
- **Market Share Visualization**: Real-time calculation of brand presence and popularity based on search results and product volumes.
- **Interactive Dashboards**: A modern, responsive UI built with React and Tailwind CSS, featuring interactive charts powered by Chart.js.
- **User Authentication**: Secure JWT-based authentication system with Flask-Login and Bcrypt.
- **Unified Backend API**: A robust Flask REST API that bridges the gap between raw data collection and frontend visualization.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Chart.js](https://www.chartjs.org/)
- **State Management**: React Hooks & Context API

### Backend
- **Framework**: [Flask](https://flask.palletsprojects.com/)
- **Database**: [SQLite](https://www.sqlite.org/) with [SQLAlchemy ORM](https://www.sqlalchemy.org/)
- **Authentication**: Flask-Login, Flask-Bcrypt
- **Concurrency**: Threading for parallel scraping tasks

### Machine Learning & Data Science
- **Scraping**: [Selenium WebDriver](https://www.selenium.dev/), [BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/)
- **NLP Models**: [HuggingFace Transformers](https://huggingface.co/docs/transformers/index) (`cardiffnlp/twitter-roberta-base-sentiment`), [TextBlob](https://textblob.readthedocs.io/)
- **Data Analysis**: [Pandas](https://pandas.pydata.org/), [NumPy](https://numpy.org/)
- **Forecasting**: Facebook [Prophet](https://facebook.github.io/prophet/) (for demand prediction)

---

## 📂 Project Structure

```text
InsightMantra/
├── backend/                # Flask Backend Application
│   ├── ML/                 # Machine Learning & Scraping Logic
│   │   ├── amazon_sc.py    # Amazon Scraper
│   │   ├── ebay_searchsc.py # eBay Product Search & Analysis
│   │   ├── ebay_reviewsc.py # eBay Review Scraping & Sentiment
│   │   └── ...
│   ├── models.py           # SQLAlchemy Database Models
│   ├── routes.py           # REST API Endpoints & Page Routing
│   ├── forms.py            # Flask-WTF Form Definitions
│   └── ...
├── frontend/               # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI Components (Hero, Benefits, Charts)
│   │   ├── assets/         # Static assets and SVGs
│   │   └── App.jsx         # Main Application Entry
│   └── ...
├── database/               # SQLite database files
├── app.py                  # Backend Entry Point
└── package.json            # Frontend Dependencies & Scripts
```

---

## 🔧 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js & npm
- Chrome WebDriver (Automated via Selenium for 4.6+)

### 1. Backend Setup
1. Navigate to the root directory and create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Initialize the database:
   ```python
   # Run in python console
   from backend import app, db
   with app.app_context():
       db.create_all()
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📊 Machine Learning Pipeline

### 1. Data Collection
The scraping engine uses Selenium with a headless Chrome driver. It identifies product listings, extracts pricing, seller feedback, and ratings. For deep analysis, it navigates into individual product pages to find "See all reviews" and scrapes paginated review data.

### 2. Sentiment Analysis
Collected reviews are cleaned and truncated to 512 tokens (compatible with BERT-based models). We use the `cardiffnlp/twitter-roberta-base-sentiment` model to classify sentiment. The scores are then aggregated to provide a "Market Sentiment Score" for specific search categories.

### 3. Market Share Analysis
By analyzing the top search results for a term (e.g., "PS5 Pro"), the system calculates brand density and average ratings across the first 20-50 listings, providing a snapshot of current market dominance.

---

## 📜 License
This project is licensed under the MIT License - see the `License.txt` file for details.

## 🙏 Acknowledgments
- Inspired by modern UI patterns like the Brainwave project.
- Sentiment analysis models provided by Cardiff NLP via HuggingFace.
- Scraper logic optimized for e-commerce search refinement.
