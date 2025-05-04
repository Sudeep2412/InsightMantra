from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import json


def amazon_prod(name):
    def get_amazon_product_details(product_name):
        # Setup for Chromium browser
        options = Options()
        options.add_argument("--headless")  # Run in headless mode (no GUI)
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")

        # Initialize driver (assumes chromedriver is in PATH)
        driver = webdriver.Chrome(options=options)

        # Build search URL
        amazon_search_url = f"https://www.amazon.in/s?k={'+'.join(product_name.split())}"

        # Open Amazon search page
        driver.get(amazon_search_url)
        time.sleep(3)

        # Find product elements
        products = driver.find_elements(By.CSS_SELECTOR, 'div[data-component-type="s-search-result"]')

        product_details = []

        for product in products[:3]:  # Limit to top 3 results
            try:
                title = product.find_element(By.TAG_NAME, 'h2').text.strip()
                product_link = product.find_element(By.TAG_NAME, 'a').get_attribute('href')

                driver.get(product_link)
                time.sleep(3)

                try:
                    reviews = []
                    review_elements = WebDriverWait(driver, 10).until(
                        EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'span[data-hook="review-body"]'))
                    )
                    for review in review_elements:
                        reviews.append(review.text.strip())
                except Exception:
                    reviews.append("No reviews found.")

                product_details.append({
                    'title': title,
                    'reviews': reviews,
                })

                driver.back()
                time.sleep(2)
            except Exception as e:
                print(f"Error extracting product details: {e}")
                continue

        driver.quit()
        return product_details

    # Run the scraper
    product_name = name
    product_info = get_amazon_product_details(product_name)

    # Save to JSON
    json_dir = "amazon_reviews.json"
    with open(json_dir, 'w') as f:
        json.dump(product_info, f, indent=4)

    print(f"Saved product reviews to {json_dir}")


# Example usage
amazon_prod("laptop")
