from backend import app

def test_books():
    print("--- BOOKS ---")
    with app.app_context():
        from backend.ML.books_searchsc import books_product_search
        books_product_search("Harry Potter", max_products=1)

def test_scrapeme():
    print("--- SCRAPEME ---")
    with app.app_context():
        from backend.ML.scrapeme_searchsc import scrapeme_product_search
        scrapeme_product_search("Bulbasaur", max_products=1)

def test_laptops():
    print("--- LAPTOPS ---")
    with app.app_context():
        from backend.ML.webscraperio_searchsc import webscraperio_product_search
        webscraperio_product_search("Asus", max_products=1)

if __name__ == "__main__":
    test_books()
    test_scrapeme()
    test_laptops()
