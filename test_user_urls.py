from backend import app, db
from backend.models import EbayProduct

urls = {
    "ebay": "https://www.ebay.com/p/12072564491?iid=127566307829&var=428692659207",
    "indiamart": "https://www.indiamart.com/proddetail/ss-passenger-lifts-11620143891.html",
    "snapdeal": "https://www.snapdeal.com/product/campus-asend-navy-mens-lifestyle/5188147393262992704#bcrumbLabelId:18",
    "shopclues": "https://www.shopclues.com/generic-unbranded-neoprene-half-face-bike-riding-mask-black-1.html",
    "meesho": "https://www.meesho.com/womans-rayon-kurti-with-palazzo/p/jmhwn",
    "slickdeals": "https://slickdeals.net/f/19311573-asus-zenbook-s-16-laptop-ryzen-ai-9-365-16-oled-touch-24gb-ram-radeon-880m-949-99-free-shipping?src=category_page",
    "nykaa": "https://www.nykaa.com/nykaa-matte-to-last-liquid-lipstick/p/303851?ptype=product&skuId=303847"
}

search_terms = {
    "ebay": "laptop",
    "indiamart": "ss passenger lifts",
    "snapdeal": "lifestyle shoes",
    "shopclues": "bike riding mask black",
    "meesho": "kurti palazzo",
    "slickdeals": "asus laptop",
    "nykaa": "liquid lipstick"
}

def setup_dummy_products():
    print("Setting up dummy products for review testing...")
    with app.app_context():
        for source, url in urls.items():
            prod = EbayProduct.query.filter_by(url=url).first()
            if not prod:
                prod = EbayProduct(
                    title=f"Dummy {source.capitalize()} Product",
                    brand=source.capitalize(),
                    price="100",
                    url=url,
                    search_term="test_term_" + source
                )
                db.session.add(prod)
        try:
            db.session.commit()
        except:
            db.session.rollback()

def test_searches():
    with app.app_context():
        for source, term in search_terms.items():
            print(f"\n--- Testing Search Scraper: {source.capitalize()} ---")
            try:
                module = __import__(f"backend.ML.{source}_searchsc", fromlist=[f"{source}_product_search"])
                func = getattr(module, f"{source}_product_search")
                # Many search scrapers accept max_products
                try:
                    func(product_name=term, max_products=1)
                except TypeError:
                    # Fallback if max_products is not a valid kwarg
                    func(product_name=term)
            except Exception as e:
                print(f"Error testing search {source}: {e}")

def test_reviews():
    with app.app_context():
        for source, url in urls.items():
            print(f"\n--- Testing Review Scraper: {source.capitalize()} ---")
            try:
                module = __import__(f"backend.ML.{source}_reviewsc", fromlist=[f"get_{source}_reviews"])
                func = getattr(module, f"get_{source}_reviews")
                func(product_url=url, search_term="test_term_" + source)
            except Exception as e:
                print(f"Error testing review {source}: {e}")

if __name__ == "__main__":
    setup_dummy_products()
    test_searches()
    test_reviews()
