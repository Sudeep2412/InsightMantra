
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import Length, EqualTo, Email, DataRequired, ValidationError
from backend.models import User

class Regfrom(FlaskForm):
    name = StringField('Name', validators=[Length(min=3, max=30), DataRequired()])
    email_address = StringField('Email Address', validators=[Email(), DataRequired()])
    password1 = PasswordField('Password', validators=[Length(min=6), DataRequired()])
    password2 = PasswordField('Confirm Password', validators=[EqualTo('password1'), DataRequired()])
    submit = SubmitField('Create Account')

    def validate_email_address(self, email_address_to_check):
        email_address = User.query.filter_by(email_address=email_address_to_check.data).first()
        if email_address:
            raise ValidationError('Email Address already exists! Please try a different email address')



class LogForm(FlaskForm):
    productUrl = StringField('Enter the Product Url', validators=[DataRequired()])
    productName = StringField('Enter the Product Name', validators=[DataRequired()])
    email_address = StringField('Email Address', validators=[Email(), DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log in')