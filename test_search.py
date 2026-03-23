from backend import app, db
from backend.models import EbayProduct

def test_search():
    with app.app_context():
        print("Testing eBay Search...")
        from backend.ML.ebay_searchsc import ebay_product_search
        try:
            ebay_product_search(product_name="iPhone 15 case")
        except Exception as e:
            print(f"Error during eBay search: {e}")
        
        print("\nTesting IndiaMart Search...")
        from backend.ML.indiamart_searchsc import indiamart_product_search
        try:
            indiamart_product_search(product_name="iPhone 15 case")
        except Exception as e:
            print(f"Error during IndiaMart search: {e}")

if __name__ == "__main__":
    test_search()
