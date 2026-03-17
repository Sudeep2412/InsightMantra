from backend import app, db
from flask import render_template, redirect, url_for, flash, request, jsonify, make_response
from backend.models import Data, User
from backend.forms import Regfrom, LogForm 
from flask_login import login_user, logout_user, login_required, current_user
import threading
from .ML.ebay_searchsc import ebay_product_search
from .ML.ebay_reviewsc import get_ebay_reviews
from flask import session
 # or just: import routes





@app.route('/register', methods=['GET', 'POST'])
def register_page():
    form = Regfrom()
    if form.validate_on_submit():
        user_to_create = User(name=form.name.data,
                              email_address=form.email_address.data,
                              password=form.password1.data)
        db.session.add(user_to_create)
        db.session.commit()
        flash('Your account has been created successfully!', category='success')
        return redirect(url_for('login_page'))  # Redirect to login after successful registration

    if form.errors != {}:
        for field, errors in form.errors.items():
            for error in errors:
                if field == 'email_address':
                    flash('Invalid email address or email already exists. Please provide a valid email.', category='danger')
                elif field == 'password1' or field == 'password2':
                    flash('Password fields must be at least 6 characters long and match each other.', category='danger')
                else:
                    flash(f'There was an error with creating a user: {error}', category='danger')

    return render_template('register.html', form=form)


@app.route('/process_product', methods=['GET' , 'POST'])
@login_required
def process_product():
    try:
        # Get form data
        product_url = session.pop('product_url', None)
        product_type = session.pop('product_name', None)
        data_source = session.pop('data_source', 'ebay')
        
        # Validate form inputs
        if not product_url or not product_type:
            flash("Both Product URL and Product Type are required!", "danger")
            return redirect(url_for('dashboard_page'))
        
        # Define functions to trigger the appropriate scrapers based on data_source
        def run_url_scraper():
            with app.app_context():
                try:
                    if data_source == 'ebay':
                        from .ML.ebay_searchsc import ebay_product_search
                        ebay_product_search(product_name=product_type)
                    elif data_source == 'snapdeal':
                        from .ML.snapdeal_searchsc import snapdeal_product_search
                        snapdeal_product_search(product_name=product_type)
                    elif data_source == 'shopclues':
                        from .ML.shopclues_searchsc import shopclues_product_search
                        shopclues_product_search(product_name=product_type)
                    elif data_source == 'indiamart':
                        from .ML.indiamart_searchsc import indiamart_product_search
                        indiamart_product_search(product_name=product_type)
                    elif data_source == 'meesho':
                        from .ML.meesho_searchsc import meesho_product_search
                        meesho_product_search(product_name=product_type)
                    elif data_source == 'nykaa':
                        from .ML.nykaa_searchsc import nykaa_product_search
                        nykaa_product_search(product_name=product_type)
                    elif data_source == 'slickdeals':
                        from .ML.slickdeals_searchsc import slickdeals_product_search
                        slickdeals_product_search(product_name=product_type)
                    else:
                        print(f"URL scraper not implemented yet for source: {data_source}")
                except Exception as e:
                    print(f"Error in run_url_scraper: {e}")

        def run_type_scraper():
            with app.app_context():
                try:
                    if data_source == 'ebay':
                        from .ML.ebay_reviewsc import get_ebay_reviews
                        get_ebay_reviews(product_url=product_url, search_term=product_type)
                    elif data_source == 'snapdeal':
                        from .ML.snapdeal_reviewsc import get_snapdeal_reviews
                        get_snapdeal_reviews(product_url=product_url, search_term=product_type)
                    elif data_source == 'shopclues':
                        from .ML.shopclues_reviewsc import get_shopclues_reviews
                        get_shopclues_reviews(product_url=product_url, search_term=product_type)
                    elif data_source == 'indiamart':
                        from .ML.indiamart_reviewsc import get_indiamart_reviews
                        get_indiamart_reviews(product_url=product_url, search_term=product_type)
                    elif data_source == 'meesho':
                        from .ML.meesho_reviewsc import get_meesho_reviews
                        get_meesho_reviews(product_url=product_url, search_term=product_type)
                    elif data_source == 'nykaa':
                        from .ML.nykaa_reviewsc import get_nykaa_reviews
                        get_nykaa_reviews(product_url=product_url, search_term=product_type)
                    elif data_source == 'slickdeals':
                        from .ML.slickdeals_reviewsc import get_slickdeals_reviews
                        get_slickdeals_reviews(product_url=product_url, search_term=product_type)
                    else:
                        print(f"Review scraper not implemented yet for source: {data_source}")
                except Exception as e:
                    print(f"Error in run_type_scraper: {e}")

        
        # Run the scrapers in parallel using threads
        threading.Thread(target=run_url_scraper).start()
        threading.Thread(target=run_type_scraper).start()
        
        # Notify the user that scrapers are running
        flash("Scrapers are running. You’ll see results shortly.", "success")
        return redirect(url_for('dashboard_page'))
    
    except Exception as e:
        # Handle any errors
        flash(f"An error occurred: {str(e)}", "danger")
        return redirect(url_for('dashboard_page'))


@app.route('/login', methods=['GET', 'POST'])
def login_page():
    form = LogForm()
    if form.validate_on_submit():
        attempted_user = User.query.filter_by(email_address=form.email_address.data).first()
        if attempted_user and attempted_user.check_password_correct(attempted_password=form.password.data):
            login_user(attempted_user)

            # ✅ Store the product details in session
            session['product_url'] = form.productUrl.data
            session['product_name'] = form.productName.data
            session['data_source'] = form.dataSource.data

            # ✅ Trigger the scraping in the next route
            return redirect(url_for('process_product'))

        else:
            flash('Username and Password didn’t match! Please try again', category='danger')

    return render_template('login.html', form=form)



from flask import Blueprint, render_template
import sqlite3
import pandas as pd




@app.route('/api/reviews')
def get_all_reviews():
    from backend.models import EbayReview
    reviews = EbayReview.query.all()
    return jsonify([
        {'id': r.id, 'body': r.body, 'date': r.date, 'sentiment': r.sentiment}
        for r in reviews
    ])


@app.route('/logout')
def logout_page():
    logout_user()
    flash("You have been logged out!", category='info')
    response = make_response(redirect(url_for("login_page")))  # Create response to set headers
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    return response

@app.route('/dashboard')
@login_required
def dashboard_page():
    response = make_response(render_template('dashboard.html'))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    return response


@login_required
@app.route('/sales')
def sales_page():
    # return render_template('sales.html')
    sle_response = make_response(render_template('sales.html'))
    sle_response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    sle_response.headers['Pragma'] = 'no-cache'
    return sle_response

@app.route('/about')
def about_page():
    return render_template('about.html')


@app.route('/contact')
def contact_page():
    return render_template('contact.html')

@app.route('/drag')
def drag():
    return render_template('drag.html')


@app.route('/analysis')
def analysis_page():
    return render_template('analysis.html')


@app.route('/api/analysis/<analysis_type>', methods=['GET'])
@login_required
def fetch_analysis(analysis_type):
    import os
    basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    db_path = os.path.join(basedir, 'database', 'sales_forecasting.db')
    conn = sqlite3.connect(db_path)
    try:
        # Get the latest search term to filter data for the current product
        cursor = conn.cursor()
        cursor.execute("SELECT search_term FROM search ORDER BY created_at DESC LIMIT 1")
        latest_term_row = cursor.fetchone()
        latest_term = latest_term_row[0] if latest_term_row else ""

        if analysis_type == "brand_market_share":
            query = f"""
                SELECT brand, ROUND(SUM(market_share), 2) AS market_share
                FROM Analysis
                WHERE search_term = '{latest_term}'
                GROUP BY brand
                ORDER BY market_share DESC
            """
            chart_title = f"Market Share by Brand ({latest_term})"
            
        elif analysis_type == "product_sales":
            # Repurposed to show Product Feedback Count (since eBay doesn't provide exact sales volume publicly here)
            query = f"""
                SELECT substr(title, 1, 30) AS short_title, seller_feedback 
                FROM search
                WHERE search_term = '{latest_term}'
                ORDER BY seller_feedback DESC
                LIMIT 10
            """
            chart_title = f"Top Seller Feedback for ({latest_term})"
            
        elif analysis_type == "search_popularity":
            # Repurposed to show Rating Counts across different products in the search
            query = f"""
                SELECT substr(title, 1, 30) AS short_title, rating_count
                FROM search
                WHERE search_term = '{latest_term}'
                ORDER BY rating_count DESC
                LIMIT 10
            """
            chart_title = f"Product Rating Volumes ({latest_term})"
            
        elif analysis_type == "review_sentiment":
            # Filter reviews by the latest scraped product's ID
            query = f"""
                SELECT sentiment, COUNT(*) AS count
                FROM reviews
                WHERE product_id IN (SELECT id FROM search WHERE search_term = '{latest_term}')
                GROUP BY sentiment
            """
            chart_title = f"Review Sentiment Analysis ({latest_term})"
            
        elif analysis_type == "price_vs_rating":
            # Query the actual eBay products table instead of legacy `Products`
            query = f"""
                SELECT brand, AVG(rating) AS avg_rating
                FROM search
                WHERE search_term = '{latest_term}' AND rating > 0 AND brand IS NOT NULL
                GROUP BY brand
            """
            chart_title = f"Average Rating by Brand ({latest_term})"
            
        else:
            return jsonify({"error": "Invalid analysis type"}), 400

        df = pd.read_sql_query(query, conn)
        
        # If the dataframe is empty (e.g., scrape failed or captcha blocked it), return empty lists
        if df.empty:
            return jsonify({"labels": ["No Data"], "values": [0], "chartTitle": chart_title + " - No Data Found"})

        labels = df.iloc[:, 0].astype(str).tolist()  # First column as labels
        values = df.iloc[:, 1].fillna(0).tolist()  # Second column as values
        return jsonify({"labels": labels, "values": values, "chartTitle": chart_title})
    finally:
        conn.close()


import os
from werkzeug.utils import secure_filename
import json

app.config['UPLOAD_FOLDER'] = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ['csv', 'json']

@app.route('/api/upload_data', methods=['POST'])
@login_required
def upload_data():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Validate and parse the file
        try:
            if filename.endswith('.csv'):
                data = pd.read_csv(filepath)
                records = data.to_dict(orient='records')
            elif filename.endswith('.json'):
                with open(filepath, 'r') as f:
                    records = json.load(f)
                    
            # Here we would typically save 'records' to the database.
            return jsonify({
                "message": "File successfully uploaded and processed", 
                "records_processed": len(records),
                "filename": filename
            }), 200
            
        except Exception as e:
            return jsonify({"error": f"Error processing file: {str(e)}"}), 500
            
    else:
        return jsonify({"error": "Allowed file types are csv, json"}), 400

from backend.ML.predictive_pipeline import SalesPredictor

predictor = SalesPredictor()

@app.route('/api/forecast', methods=['GET', 'POST'])
@login_required
def get_forecast():
    # Attempt to train if not trained
    if not predictor.is_trained:
        try:
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'synthetic_sales_data.csv')
            if os.path.exists(filepath):
                df = pd.read_csv(filepath)
                predictor.train(df)
            else:
                from backend.ML.synthetic_data_gen import generate_synthetic_sales_data
                df = generate_synthetic_sales_data(days=365)
                predictor.train(df)
        except Exception as e:
            print(f"Error training model: {e}")
            
    # Use recent data to predict
    try:
        from backend.ML.synthetic_data_gen import generate_synthetic_sales_data
        recent_data = generate_synthetic_sales_data(days=40)
        
        forecast = predictor.predict(recent_data, days=30)
        
        # Calculate KPIs
        projected_demand = sum(forecast['predictions'])
        
        return jsonify({
            "forecast": forecast,
            "kpis": {
                "projected_30_day_demand": projected_demand,
                "sentiment_correlation": "+12.4%", # Mocked metric
                "competitor_price_index": "98.5", # Mocked metric
                "stockout_risk_days": 18 # Mocked metric
            }
        })
    except Exception as e:
        return jsonify({"error": f"Internal Error: {str(e)}"}), 500