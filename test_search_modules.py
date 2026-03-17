from backend import app
import sys

def test_etsy():
    print("--- ETSY ---")
    with app.app_context():
        from backend.ML.etsy_searchsc import etsy_product_search
        etsy_product_search("iphone 15")

def test_newegg():
    print("--- NEWEGG ---")
    with app.app_context():
        from backend.ML.newegg_searchsc import newegg_product_search
        newegg_product_search("iphone 15")

def test_flipkart():
    print("--- FLIPKART ---")
    with app.app_context():
        from backend.ML.flipkart_searchsc import flipkart_product_search
        flipkart_product_search("iphone")

def test_bandh():
    print("--- B&H ---")
    with app.app_context():
        from backend.ML.bandh_searchsc import bandh_product_search
        bandh_product_search("iphone 15")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == 'etsy': test_etsy()
        elif sys.argv[1] == 'newegg': test_newegg()
        elif sys.argv[1] == 'flipkart': test_flipkart()
        elif sys.argv[1] == 'bandh': test_bandh()
