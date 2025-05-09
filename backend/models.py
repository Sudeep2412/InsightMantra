from backend import db, bcrypt, loginManager
from flask_login import UserMixin
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey

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
    productUrl = db.Column(db.String(), nullable=False)
    productName = db.Column(db.String(), nullable=False)
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(length=30), nullable=False)
    owner_id = db.Column(db.Integer(), db.ForeignKey('user.id'))

    def __repr__(self):
        return f'Hello, {self.name}'



class EbayReview(db.Model):
    """
    Model for eBay product reviews
    """
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('search.id'), nullable=False)  # Foreign key to Search table
    product_url = db.Column(db.String(255), nullable=False)  # URL of the product
    body = db.Column(db.Text, nullable=False)  # Review text
    date = db.Column(db.String(100), nullable=True)  # Date of the review as extracted
    sentiment = db.Column(db.String(20), nullable=True)  # Sentiment (positive, neutral, negative)
    sentiment_score = db.Column(db.Float, nullable=True)  # Sentiment score
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # When the review was added to our database

    # Relationship to access the associated product
    product = relationship("EbayProduct", back_populates="reviews")
    
    def __repr__(self):
        return f"EbayReview('{self.product_id}', '{self.sentiment}', '{self.date}')"

class EbayProduct(db.Model):
    """
    Model for eBay product listings
    """
    __tablename__ = 'search'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    brand = db.Column(db.String(100))
    price = db.Column(db.String(50))
    url = db.Column(db.String(500), unique=True)
    rating = db.Column(db.Float)
    rating_count = db.Column(db.Integer, default=0)
    seller_feedback = db.Column(db.Integer, default=0)
    search_term = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to access the associated reviews
    reviews = relationship("EbayReview", back_populates="product", cascade="all, delete-orphan")

class EbayBrandAnalysis(db.Model):
    """Model for eBay brand market analysis"""
    __tablename__ = 'Analysis'
    
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(100), nullable=False)
    search_term = db.Column(db.String(100))
    product_count = db.Column(db.Integer, default=0)
    market_share = db.Column(db.Float)
    average_rating = db.Column(db.Float)
    feedback_count = db.Column(db.Integer, default=0)
    review_count = db.Column(db.Integer, default=0)
    analysis_date = db.Column(db.DateTime, default=datetime.utcnow)
