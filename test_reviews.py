from backend import app

def test_ebay_review():
    url = "https://www.ebay.com/itm/236318376364"
    print(f"--- Testing eBay Reviews for: {url} ---")
    with app.app_context():
        from backend.ML.ebay_reviewsc import get_ebay_reviews
        get_ebay_reviews(product_url=url, search_term="Apple iPhone")

def test_meesho_review():
    url = "https://www.meesho.com/s/p/SomeProductUrl"
    print(f"\n--- Testing Meesho Reviews for: {url} ---")
    with app.app_context():
        from backend.ML.meesho_reviewsc import get_meesho_reviews
        get_meesho_reviews(product_url=url, search_term="Something")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        if sys.argv[1] == 'ebay': test_ebay_review()
        elif sys.argv[1] == 'meesho': test_meesho_review()
    else:
        test_ebay_review()
        test_meesho_review()
