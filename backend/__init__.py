# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_bcrypt import Bcrypt
# from flask_wtf.csrf import CSRFProtect
# from flask_login import LoginManager



# app = Flask(__name__)

# # Configuration for SQLite
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)
# app.config['SECRET_KEY'] = 'mysecretkey'
# bcrypt = Bcrypt(app)
# loginManager = LoginManager(app)

# from backend import routes 



import pandas as pd
import sqlite3
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS
from flask import Flask, request, jsonify
from flask_login import UserMixin
from flask_bcrypt import check_password_hash
from flask_login import LoginManager







app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////mnt/c/Users/sudee/OneDrive/Desktop/InsightMantra-master/database/sales_forecasting.db'
app.config['WTF_CSRF_ENABLED'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
loginManager = LoginManager(app)
CORS(app)  # Enable CORS



@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    try:
        # Retrieve table name and file from request
        table_name = request.form['table_name']
        file = request.files['file']
        print(f"Received file: {file.filename}")
        print(f"Table name: {table_name}")

        # Save the uploaded file
        file_path = f"/tmp/{file.filename}"
        file.save(file_path)
        print(f"File saved to: {file_path}")

        # Insert CSV data into the database
        insert_csv_to_table(file_path, table_name)
        return jsonify({"status": "success", "message": f"Data inserted into {table_name}"}), 200
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 400

def insert_csv_to_table(file_path, table_name):
    try:
        import os
        # Read CSV
        df = pd.read_csv(file_path)

        print(f"Inserting into table: {table_name}")
        print("CSV columns:", df.columns.tolist())

        # Use absolute path to the correct database
        db_path = '/mnt/c/Users/sudee/OneDrive/Desktop/InsightMantra-master/database/sales_forecasting.db'
        print("Using DB file at:", db_path)

        # Insert using pandas
        conn = sqlite3.connect(db_path)
        df.to_sql(table_name, conn, if_exists='replace', index=False)
        conn.close()

        print(f"Successfully inserted {len(df)} records into '{table_name}'")

    except Exception as e:
        print(f"Failed to insert data: {e}")
        raise

with app.app_context():
    db.create_all()

from backend import routes






