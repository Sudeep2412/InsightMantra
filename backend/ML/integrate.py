import importlib.util
import json
import sys
import os

# Load ebay_searchsc module
spec_search = importlib.util.spec_from_file_location("ebay_searchsc", "./ebay_searchsc.py")
ebay_searchsc = importlib.util.module_from_spec(spec_search)
spec_search.loader.exec_module(ebay_searchsc)

# Load ebay_reviewsc module
spec_reviews = importlib.util.spec_from_file_location("ebay_reviewsc", "./ebay_reviewsc.py")
ebay_reviewsc = importlib.util.module_from_spec(spec_reviews)
spec_reviews.loader.exec_module(ebay_reviewsc)

def run_ebay_analysis(product_name, max_products=10, min_reviews=10):
    print(f"Starting analysis for product: {product_name}")

    # Step 1: Fetch product URLs using ebay_searchsc
    print("Fetching product URLs...")
    product_urls = ebay_searchsc.ebay_product_search(product_name, max_products=max_products, get_reviews=False)

    if not product_urls:
        print("No products found. Exiting.")
        return

    # Step 2: Extract reviews using ebay_reviewsc
    all_reviews = []
    for i, url in enumerate(product_urls):
        print(f"Fetching reviews for product {i + 1}/{len(product_urls)}: {url}")
        reviews = ebay_reviewsc.get_ebay_reviews(url, min_reviews=min_reviews)
        all_reviews.extend(reviews)

    if not all_reviews:
        print("No reviews extracted. Exiting.")
        return

    # Step 3: Save the results
    result = {
        "product_name": product_name,
        "product_urls": product_urls,
        "reviews": all_reviews
    }

    output_filename = f"{product_name.replace(' ', '_')}_analysis.json"
    with open(output_filename, 'w') as outfile:
        json.dump(result, outfile, indent=4)

    print(f"Analysis complete. Results saved to {output_filename}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python integrated_script.py <product_name>")
        sys.exit(1)

    product_name = " ".join(sys.argv[1:])
    run_ebay_analysis(product_name)
