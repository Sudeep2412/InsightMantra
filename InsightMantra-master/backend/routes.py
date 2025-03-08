from backend import app, db
from flask import render_template, redirect, url_for, flash, request, jsonify, make_response
from backend.models import Data, User
from backend.forms import Regfrom, LogForm 
from flask_login import login_user, logout_user, login_required, current_user
from backend.ML.amazon_sc import amazon_url
from backend.ML.amazon_web import amazon_prod
import threading

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

@app.route('/login', methods=['GET', 'POST'])
def login_page():
    form = LogForm()
    if form.validate_on_submit():
        attempted_user = User.query.filter_by(email_address=form.email_address.data).first()
        if attempted_user and attempted_user.check_password_correct(attempted_password=form.password.data):
            login_user(attempted_user)
            x = (form.productName.data)
            y = (form.productUrl.data)


            def amazon_scraper():
                amazon_url(y)
            
            def amazon_pro():
                amazon_prod(x)

            scraper_thread = threading.Thread(target=amazon_scraper)
            web_thread = threading.Thread(target=amazon_pro)
            scraper_thread.start()
            web_thread.start()

            return redirect(url_for('dashboard_page'))

        else:
            flash('Username and Password didn’t match! Please try again', category='danger')

    return render_template('login.html', form=form)



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