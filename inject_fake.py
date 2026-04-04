from backend import app, db
from backend.models import EbayReview, EbayProduct
from datetime import datetime

with app.app_context():
    product = EbayProduct.query.first()
    pid = product.id if product else 1
    purl = product.url if product else "http://dummy.com"
    
    r1 = EbayReview(product_id=pid, product_url=purl, body='WOWWWWW THIS IS SOOOOOOO GOOOOOD', sentiment='positive', date='2026-03-26')
    r2 = EbayReview(product_id=pid, product_url=purl, body='good', sentiment='positive', date='2026-03-26')
    r3 = EbayReview(product_id=pid, product_url=purl, body='THIS COMPANY SCAMMED ME I LOST ALL MY MONEY DO NOT BUY', sentiment='negative', date='2026-03-26')
    
    db.session.add_all([r1, r2, r3])
    db.session.commit()
    print('✅ Demo Fake reviews successfully injected into database!')
