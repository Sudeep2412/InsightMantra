from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
import time
import json


def amazon_prod(name):
    def get_amazon_product_details(product_name):
        # Specify the path to the Edge WebDriver executable
        edge_driver_path = r"C:\Users\sudee\Downloads\edgedriver_win64\msedgedriver.exe"
        options = webdriver.EdgeOptions()
        options.add_argument("--headless")  
        driver = webdriver.Edge(service=Service(edge_driver_path), options=options)
        
        # URL
        amazon_search_url = f"https://www.amazon.in/s?k={'+'.join(product_name.split())}"
        
        # Open the URL
        driver.get(amazon_search_url)
        time.sleep(3)  # Wait for the page to load

        # Product listing
        products = driver.find_elements(By.CSS_SELECTOR, 'div[data-component-type="s-search-result"]')

        product_details = []

        for product in products:
            try:
                # Extract the title of the product
                title = product.find_element(By.TAG_NAME, 'h2').text.strip()
                
                # Extract the number of reviews (or rating summary)
                try:
                    reviews = product.find_element(By.CSS_SELECTOR, 'span.a-size-base').text.strip()
                except Exception:
                    reviews = "0"  # Default to 0 if no reviews are found
                
                product_details.append({
                    'title': title,
                    'reviews': reviews,
                })
            except Exception as e:
                print(f"Error extracting product details: {e}")
                continue

        driver.quit()
        return product_details

    # Get product details
    product_name = name
    product_info = get_amazon_product_details(product_name)

    # Consolidate company information
    company = []
    for product in product_info:
        try:
            company_name = (product['title'].split())[:1]
            review_count = int(product['reviews'].replace(',', '')) if product['reviews'].isdigit() else 0
            if company_name not in company:
                company.append({company_name[0]: review_count})
        except ValueError:
            continue  # Skip invalid review counts

    # Consolidate data function
    def consolidate_data(data):
        """Consolidates data by summing values for duplicate keys."""
        result = {}
        for d in data:
            key, value = list(d.items())[0]
            result[key] = result.get(key, 0) + value  # Add or create key with cumulative sum
        return result

    cons_company = consolidate_data(company)

    # Calculate ratios
    def calculate_ratios(data_dict):
        """Calculates ratios for each company based on the total sum."""
        total_value = sum(data_dict.values())
        ratios = {key: value / total_value for key, value in data_dict.items() if total_value > 0}
        return ratios

    ratios = calculate_ratios(cons_company)

    # Save the results to a JSON file
    json_dir = "name.json"
    with open(json_dir, 'w') as f:
        json.dump(ratios, f)


# Example usage
amazon_prod("Phones")
