from backend import app, db
from flask import render_template, redirect, url_for, flash, request, jsonify, make_response
from backend.models import Data, User
from backend.forms import Regfrom, LogForm 
from flask_login import login_user, logout_user, login_required, current_user
from backend.ML.amazon_sc import amazon_url
from backend.ML.amazon_web import amazon_prod
import threading
from .ML.ebay_searchsc import ebay_product_search
from .ML.ebay_reviewsc import get_ebay_reviews
from flask import session




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
        
        # Validate form inputs
        if not product_url or not product_type:
            flash("Both Product URL and Product Type are required!", "danger")
            return redirect(url_for('dashboard_page'))
        
        # Define functions to trigger the eBay scrapers
        def run_url_scraper():
            try:
                ebay_product_search(product_name=product_type)
            except Exception as e:
                print(f"[ERROR] run_url_scraper failed: {e}")

        def run_type_scraper():
            try:
                get_ebay_reviews(product_url=product_url)
            except Exception as e:
                print(f"[ERROR] run_type_scraper failed: {e}")

        
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
@login_required
def analysis_page():
    analysis_type = request.args.get('analysis_type', 'brand_market_share')  # Default type
    return render_template('analysis.html', analysis_type=analysis_type)


@app.route('/api/analysis/<analysis_type>', methods=['GET'])
@login_required
def fetch_analysis(analysis_type):
    conn = sqlite3.connect('/mnt/c/Users/sudee/OneDrive/Desktop/InsightMantra-master/database/sales_forecasting.db')
    try:
        if analysis_type == "brand_market_share":
            query = """
                SELECT brand, SUM(product_count) AS total_products,
                       ROUND(SUM(market_share), 2) AS market_share
                FROM Analysis
                GROUP BY brand
                ORDER BY market_share DESC
            """
            chart_title = "Market Share by Brand"
        elif analysis_type == "product_sales":
            query = """
                SELECT ProductName, SUM(UnitsSold) AS total_units_sold
                FROM SalesData
                JOIN Products ON SalesData.ProductID = Products.ProductID
                GROUP BY ProductName
                ORDER BY total_units_sold DESC
            """
            chart_title = "Product-wise Sales Performance"
        elif analysis_type == "search_popularity":
            query = """
                SELECT search_term, COUNT(*) AS search_count
                FROM search
                GROUP BY search_term
                ORDER BY search_count DESC
            """
            chart_title = "Search Popularity Trends"
        elif analysis_type == "review_sentiment":
            query = """
                SELECT sentiment, COUNT(*) AS count
                FROM reviews
                GROUP BY sentiment
            """
            chart_title = "Review Sentiment Analysis"
        elif analysis_type == "price_vs_rating":
            query = """
                SELECT Category, AVG(Price) AS avg_price, AVG(rating) AS avg_rating
                FROM Products
                JOIN search ON Products.ProductID = search.id
                GROUP BY Category
            """
            chart_title = "Price vs Rating by Category or Brand"
        else:
            return jsonify({"error": "Invalid analysis type"}), 400

        df = pd.read_sql_query(query, conn)
        labels = df.iloc[:, 0].tolist()  # First column as labels
        values = df.iloc[:, 1].tolist()  # Second column as values
        return jsonify({"labels": labels, "values": values, "chartTitle": chart_title})
    finally:
        conn.close()


# @app.route('/upload', methods=['POST'])
# def upload_file():
#     if 'file' not in request.files:
#         flash('No file part')
#         return redirect(request.url)
    
#     file = request.files['file']
    
#     if file.filename == '':
#         flash('No selected file')
#         return redirect(request.url)
    
#     if file and allowed_file(file.filename):
#         filename = secure_filename(file.filename)
#         filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#         file.save(filepath)
        
#         # Process the CSV file
#         data = pd.read_csv(filepath)
#         # You can do further processing with the 'data' DataFrame
        
#         flash('File successfully uploaded and processed')
#         return redirect(url_for('index'))
#     else:
#         flash('Allowed file types are csv')
#         return redirect(request.url)

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'csv'