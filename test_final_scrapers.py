from backend import app

def test_nykaa():
    print("--- NYKAA ---")
    with app.app_context():
        from backend.ML.nykaa_searchsc import nykaa_product_search
        try:
            nykaa_product_search("Lipstick")
        except Exception as e:
            print(f"Error during Nykaa search: {e}")

def test_slickdeals():
    print("--- SLICKDEALS ---")
    with app.app_context():
        from backend.ML.slickdeals_searchsc import slickdeals_product_search
        try:
            slickdeals_product_search("Laptop")
        except Exception as e:
            print(f"Error during Slickdeals search: {e}")

if __name__ == "__main__":
    test_nykaa()
    test_slickdeals()
