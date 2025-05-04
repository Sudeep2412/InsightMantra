# from backend import app, db
# with app.app_context():  ### Create the .db file
#     db.drop_all()


from backend import app, db

# with app.app_context():
#     db.create_all()
#     print("Database tables created.")



### Add data into the db
# from app import app, db, Item

# with app.app_context():
#     item2 = Item(name="Laptop", price=2343, barcode='3454453245435', descriptin='lap')
#     db.session.add(item2)
#     db.session.commit()




### Querry
# from app import app, db, Item

# with app.app_context():
#     print(Item.query.all())




## Accessing each field

# from market import  app
# from market.models import Item

# with app.app_context():
#     for item in Item.query.all():
#         print(item.name)
#         print(item.price)
#         print(item.barcode)


# Item.query.filter_by(price=500) ## Filter




# from market import app
# from market.models import db

# with app.app_context():
#     db.drop_all()



# from backend import db, app
# from backend.models import User, Data
# if __name__ == '__main__':
#     with app.app_context():
#         db.create_all()
#         u1=User(name='ifv', email_address='sadf@gmail.com',password_hash='3234234')
#         db.session.add(u1)
#         db.session.commit()
#         print(User.query.all())


#         i1 = Data(name='If')
#         i1.owner = User.query.filter_by(name='Ifv').first()
#         # db.session.add(i1)
#         db.session.commit()

#         print(Data.query.all)


