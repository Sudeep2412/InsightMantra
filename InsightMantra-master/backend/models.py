from backend import db, bcrypt, loginManager
from flask_login import UserMixin

@loginManager.user_loader
def load_user(email_address):
    return User.query.get(str(email_address))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(length=30), nullable=False)
    email_address = db.Column(db.String(length=30), nullable=False, unique=True)
    password_hash = db.Column(db.String(length=60), nullable=False)
    data = db.relationship('Data', backref='owned_user', lazy=True)

    @property
    def password(self):
        raise AttributeError("Password is not a readable attribute")
    
    @password.setter
    def password(self, plain_text_password):
        self.password_hash = bcrypt.generate_password_hash(plain_text_password).decode('utf-8')

    def check_password_correct(self, attempted_password):
        return bcrypt.check_password_hash(self.password_hash, attempted_password)

class Data(db.Model):
    productUrl = db.Column(db.String(), nullable = False)
    productName = db.Column(db.String(), nullable = False)
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(length=30), nullable=False)
    owner_id = db.Column(db.Integer(), db.ForeignKey('user.id'))  # Corrected ForeignKey

    def __repr__(self):
        return f'Hello, {self.name}'
