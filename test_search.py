from backend import app, db
from backend.models import EbayProduct

def test_search():
    with app.app_context():
        print("Testing Etsy Search...")
        from backend.ML.etsy_searchsc import etsy_product_search
        etsy_product_search(product_name="iPhone 15 case", max_products=1)
        
        print("\nTesting Newegg Search...")
        from backend.ML.newegg_searchsc import newegg_product_search
        newegg_product_search(product_name="iPhone 15 case", max_products=1)

        print("\nTesting Flipkart Search...")
        from backend.ML.flipkart_searchsc import flipkart_product_search
        flipkart_product_search(product_name="iPhone 15 case", max_products=1)

        print("\nTesting B&H Search...")
        from backend.ML.bandh_searchsc import bandh_product_search
        bandh_product_search(product_name="iPhone 15 case", max_products=1)

if __name__ == "__main__":
    test_search()
