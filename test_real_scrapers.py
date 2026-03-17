from backend import app

def test_snapdeal():
    print("--- SNAPDEAL ---")
    with app.app_context():
        try:
            from backend.ML.snapdeal_searchsc import snapdeal_product_search
            snapdeal_product_search("watch", max_products=1)
        except Exception as e:
            print(f"Snapdeal Error: {e}")

def test_shopclues():
    print("--- SHOPCLUES ---")
    with app.app_context():
        try:
            from backend.ML.shopclues_searchsc import shopclues_product_search
            shopclues_product_search("watch", max_products=1)
        except Exception as e:
            print(f"ShopClues Error: {e}")

if __name__ == "__main__":
    test_snapdeal()
    test_shopclues()
