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




from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['WTF_CSRF_ENABLED'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
loginManager = LoginManager(app)

from backend import routes






