from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json


def amazon_prod(name):
    def get_amazon_product_details(product_name):
        # Specify the path to the Edge WebDriver executable
        edge_driver_path = r"C:\Users\sudee\Downloads\edgedriver_win64\msedgedriver.exe"
        options = webdriver.EdgeOptions()
        options.add_argument("--headless")  # Run in headless mode
        driver = webdriver.Edge(service=Service(edge_driver_path), options=options)

        # URL
        amazon_search_url = f"https://www.amazon.in/s?k={'+'.join(product_name.split())}"

        # Open the URL
        driver.get(amazon_search_url)
        time.sleep(3)  # Wait for the page to load

        # Find products
        products = driver.find_elements(By.CSS_SELECTOR, 'div[data-component-type="s-search-result"]')

        product_details = []

        for product in products[:3]:  # Limit to 3 products for testing
            try:
                # Extract the title of the product
                title = product.find_element(By.TAG_NAME, 'h2').text.strip()

                # Navigate to the product details page
                product_link = product.find_element(By.TAG_NAME, 'a').get_attribute('href')
                driver.get(product_link)
                time.sleep(3)

                # Wait for reviews to load
                try:
                    reviews = []
                    review_elements = WebDriverWait(driver, 10).until(
                        EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'span[data-hook="review-body"]'))
                    )
                    for review in review_elements:
                        reviews.append(review.text.strip())
                except Exception as e:
                    reviews.append("No reviews found.")

                product_details.append({
                    'title': title,
                    'reviews': reviews,
                })

                # Go back to the search results page
                driver.back()
                time.sleep(2)
            except Exception as e:
                print(f"Error extracting product details: {e}")
                continue

        driver.quit()
        return product_details

    # Get product details
    product_name = name
    product_info = get_amazon_product_details(product_name)

    # Save the results to a JSON file
    json_dir = "amazon_reviews.json"
    with open(json_dir, 'w') as f:
        json.dump(product_info, f, indent=4)

    print(f"Saved product reviews to {json_dir}")


# Example usage
amazon_prod("laptop")
