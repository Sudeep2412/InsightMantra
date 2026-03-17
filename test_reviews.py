from backend import app

def test_ebay_review():
    url = "https://www.ebay.com/itm/236318376364"
    print(f"--- Testing eBay Reviews for: {url} ---")
    with app.app_context():
        from backend.ML.ebay_reviewsc import get_ebay_reviews
        get_ebay_reviews(product_url=url, search_term="Apple iPhone", min_reviews=5)

def test_newegg_review():
    url = "https://www.newegg.com/gigabyte-gv-n3060gaming-oc-12gd-geforce-rtx-3060-12gb-graphics-card-windforce-3x/p/N82E16814932433?recaptcha=pass"
    print(f"\n--- Testing Newegg Reviews for: {url} ---")
    with app.app_context():
        from backend.ML.newegg_reviewsc import get_newegg_reviews
        get_newegg_reviews(product_url=url, search_term="Gigabyte 3060")

def test_flipkart_review():
    url = "https://www.flipkart.com/samsung-galaxy-s26-ultra-5g-cobalt-violet-512-gb/p/itmf4799d3841c43"
    print(f"\n--- Testing Flipkart Reviews for: {url} ---")
    with app.app_context():
        from backend.ML.flipkart_reviewsc import get_flipkart_reviews
        get_flipkart_reviews(product_url=url, search_term="Samsung S26 Ultra")

def test_bandh_review():
    url = "https://www.bhphotovideo.com/c/product/1726026-REG/sound_devices_a20_rx_dual_channel_digital_receiver.html"
    print(f"\n--- Testing B&H Reviews for: {url} ---")
    with app.app_context():
        from backend.ML.bandh_reviewsc import get_bandh_reviews
        get_bandh_reviews(product_url=url, search_term="Sound Devices RX")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        if sys.argv[1] == 'ebay': test_ebay_review()
        elif sys.argv[1] == 'newegg': test_newegg_review()
        elif sys.argv[1] == 'flipkart': test_flipkart_review()
        elif sys.argv[1] == 'bandh': test_bandh_review()
    else:
        test_ebay_review()
        test_newegg_review()
        test_flipkart_review()
        test_bandh_review()
