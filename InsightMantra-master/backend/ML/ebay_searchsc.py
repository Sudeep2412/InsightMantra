from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException, TimeoutException
import time
import json
import re
import os

def ebay_product_search(product_name, max_products=20, get_reviews=True):
    """
    Search for products on eBay and analyze their details including reviews.
    
    Args:
        product_name (str): The product to search for
        max_products (int): Maximum number of products to analyze
        get_reviews (bool): Whether to fetch reviews for each product
        
    Returns:
        dict: Analysis results including market share and reviews
    """
    def setup_driver():
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")  # Set a larger window size
        
        return webdriver.Chrome(options=options)
    
    def get_product_listings(driver, search_term):
        # eBay search URL - using sorted by popularity to get more relevant results
        ebay_search_url = f"https://www.ebay.com/sch/i.html?_nkw={'+'.join(search_term.split())}&_ipg=60&_sop=12"
        
        print(f"Navigating to {ebay_search_url}")
        # Open the URL
        driver.get(ebay_search_url)
        
        # Wait for page to load
        try:
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'li.s-item'))
            )
        except TimeoutException:
            print("Warning: Timeout waiting for product listings to load")
        
        # Take a screenshot for debugging
        driver.save_screenshot("ebay_search_results.png")
        
        # Get all product URLs first to avoid stale element issues
        print("Collecting product URLs...")
        product_urls = []
        try:
            items = driver.find_elements(By.CSS_SELECTOR, 'li.s-item')
            for item in items:
                try:
                    # Skip the first item which is often "Shop on eBay"
                    if "Shop on eBay" in item.text:
                        continue
                        
                    link = item.find_element(By.CSS_SELECTOR, 'a.s-item__link')
                    url = link.get_attribute('href')
                    if url and "ebay.com/itm/" in url:
                        product_urls.append(url)
                except Exception as e:
                    print(f"Error getting product URL: {e}")
                    continue
        except Exception as e:
            print(f"Error collecting product listings: {e}")
        
        print(f"Found {len(product_urls)} product URLs")
        return product_urls[:max_products]  # Limit to max_products
    
    def extract_product_data(driver, product_url):
        """Extract data from a product page directly instead of from search results"""
        product_data = {
            'title': "Unknown",
            'brand': "Unknown",
            'feedback': 0,
            'price': "Unknown",
            'url': product_url,
            'rating': None,
            'rating_count': 0,
            'reviews': []
        }
        
        try:
            # Navigate to the product page
            driver.get(product_url)
            
            # Wait for the page to load
            try:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, 'h1.x-item-title__mainTitle'))
                )
            except TimeoutException:
                print(f"Warning: Timeout waiting for product page to load: {product_url}")
            
            # Extract title
            try:
                title_element = driver.find_element(By.CSS_SELECTOR, 'h1.x-item-title__mainTitle')
                product_data['title'] = title_element.text.strip()
            except Exception as e:
                print(f"Error extracting title: {e}")
                # Try alternative selector
                try:
                    title_element = driver.find_element(By.CSS_SELECTOR, 'h1[itemprop="name"]')
                    product_data['title'] = title_element.text.strip()
                except Exception:
                    pass
            
            # Extract price
            try:
                price_element = driver.find_element(By.CSS_SELECTOR, 'span[itemprop="price"], .x-price-primary')
                product_data['price'] = price_element.text.strip()
            except Exception as e:
                print(f"Error extracting price: {e}")
            
            # Extract seller feedback
            try:
                feedback_element = driver.find_element(By.CSS_SELECTOR, 'span.ux-seller-section__item--link')
                feedback_text = feedback_element.text.strip()
                feedback_match = re.search(r'(\d+(?:,\d+)*)', feedback_text)
                if feedback_match:
                    product_data['feedback'] = int(feedback_match.group(1).replace(',', ''))
            except Exception as e:
                print(f"Error extracting seller feedback: {e}")
            
            # Extract rating
            try:
                rating_element = driver.find_element(By.CSS_SELECTOR, 'div.review-ratings-stars, span.review-ratings-stars')
                rating_text = rating_element.get_attribute('aria-label') or rating_element.get_attribute('title') or rating_element.text
                rating_match = re.search(r'(\d+(?:\.\d+)?)\s*out of\s*5', rating_text)
                if rating_match:
                    product_data['rating'] = float(rating_match.group(1))
            except Exception as e:
                print(f"Error extracting rating: {e}")
            
            # Extract rating count
            try:
                rating_count_element = driver.find_element(By.CSS_SELECTOR, 'a[href*="reviews"], span.reviews-count')
                rating_count_text = rating_count_element.text.strip()
                count_match = re.search(r'(\d+(?:,\d+)*)', rating_count_text)
                if count_match:
                    product_data['rating_count'] = int(count_match.group(1).replace(',', ''))
            except Exception as e:
                print(f"Error extracting rating count: {e}")
            
            # Extract brand from item specifics if available
            try:
                item_specifics = driver.find_elements(By.CSS_SELECTOR, 'div.ux-layout-section__item')
                for item in item_specifics:
                    if "Brand" in item.text or "Marke" in item.text or "Marca" in item.text:
                        brand_text = item.text.replace("Brand:", "").replace("Marke:", "").replace("Marca:", "").strip()
                        if brand_text:
                            product_data['brand'] = brand_text
                            break
            except Exception as e:
                print(f"Error extracting brand from item specifics: {e}")
            
            # If brand not found in item specifics, try to extract from title
            if product_data['brand'] == "Unknown" and product_data['title'] != "Unknown":
                # Extract first word as brand as a fallback
                product_data['brand'] = product_data['title'].split()[0]
            
            # Get reviews if requested
            if get_reviews:
                product_data['reviews'] = get_product_reviews(driver, product_url)
            
            return product_data
            
        except Exception as e:
            print(f"Error processing product page {product_url}: {e}")
            return product_data
    
    def get_product_reviews(driver, product_url):
        """Fetch reviews for a specific product"""
        reviews = []
        current_url = driver.current_url
        
        try:
            # Try to find and click on reviews tab/link
            try:
                review_links = driver.find_elements(By.CSS_SELECTOR, 'a[href*="reviews"], a[href*="feedback"]')
                for link in review_links:
                    if any(keyword in link.text.lower() for keyword in ['review', 'feedback', 'rating']):
                        link.click()
                        time.sleep(2)
                        break
            except Exception as e:
                print(f"No review tab found or couldn't click: {e}")
            
            # Look for review elements
            review_elements = []
            
            # Try multiple selectors for reviews
            selectors = [
                'div.ebay-review-section', 
                'div.review', 
                'div.rvw', 
                'div[class*="review"]',
                'div.feedback-text',
                'p.review-content'
            ]
            
            for selector in selectors:
                try:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    if elements:
                        review_elements = elements
                        print(f"Found {len(elements)} reviews using selector: {selector}")
                        break
                except Exception:
                    continue
            
            # If no reviews found using selectors, check if we're on a review page
            if not review_elements and "feedback" in driver.current_url:
                # Look for feedback items
                try:
                    feedback_items = driver.find_elements(By.CSS_SELECTOR, 'tr.fbOuterAddComm')
                    if feedback_items:
                        for item in feedback_items[:5]:  # Limit to 5
                            comment = item.find_element(By.CSS_SELECTOR, 'td.fbOuterAddComm')
                            if comment:
                                reviews.append({
                                    'text': comment.text.strip(),
                                    'rating': None  # Feedback often doesn't have star ratings
                                })
                except Exception as e:
                    print(f"Error getting feedback items: {e}")
            
            # Extract review text and rating from the found elements
            for i, review_element in enumerate(review_elements[:5]):  # Limit to 5 reviews
                try:
                    review_text = review_element.text.strip()
                    if not review_text:
                        continue
                    
                    # Try to extract rating
                    rating = None
                    try:
                        rating_element = review_element.find_element(By.CSS_SELECTOR, 'span[class*="star"], div[class*="star"]')
                        rating_text = rating_element.get_attribute('aria-label') or rating_element.get_attribute('title') or rating_element.text
                        rating_match = re.search(r'(\d+(?:\.\d+)?)', rating_text)
                        if rating_match:
                            rating = float(rating_match.group(1))
                    except Exception:
                        pass
                    
                    reviews.append({
                        'text': review_text[:200] + ('...' if len(review_text) > 200 else ''),
                        'rating': rating
                    })
                except Exception as e:
                    print(f"Error extracting review {i}: {e}")
            
            print(f"Found {len(reviews)} reviews")
            return reviews
            
        except Exception as e:
            print(f"Error fetching reviews: {e}")
            return []
        finally:
            # If we navigated away from the product page, go back
            if driver.current_url != current_url:
                driver.back()
    
    # Main execution flow
    driver = setup_driver()
    
    try:
        print(f"Searching for: {product_name}")
        product_urls = get_product_listings(driver, product_name)
        
        if not product_urls:
            print("No product URLs found. Check if eBay's layout has changed or if there are captchas.")
            return {"error": "No products found"}
        
        product_details = []
        
        for i, url in enumerate(product_urls):
            print(f"\nProcessing product {i+1}/{len(product_urls)}: {url}")
            # Process each product by URL to avoid stale element issues
            product_data = extract_product_data(driver, url)
            if product_data:
                product_details.append(product_data)
                print(f"Successfully processed product: {product_data['title'][:50]}...")
        
        if not product_details:
            print("No product details were successfully extracted.")
            return {"error": "Failed to extract product details"}
        
        # Consolidate company/brand information
        company_data = {}
        for product in product_details:
            brand = product['brand']
            
            # Normalize brand name (lowercase and remove special characters)
            brand = re.sub(r'[^\w\s]', '', brand).lower()
            
            # Skip empty brand names
            if not brand or brand == "unknown":
                continue
            
            if brand not in company_data:
                company_data[brand] = {
                    'feedback_count': 0,
                    'product_count': 0,
                    'total_rating': 0,
                    'rating_count': 0,
                    'review_count': 0,
                    'reviews': []
                }
            
            company_data[brand]['feedback_count'] += product['feedback'] or 0
            company_data[brand]['product_count'] += 1
            
            if product['rating']:
                company_data[brand]['total_rating'] += product['rating']
                company_data[brand]['rating_count'] += 1
            
            company_data[brand]['review_count'] += len(product['reviews'])
            company_data[brand]['reviews'].extend(product['reviews'][:3])  # Keep top 3 reviews per product
        
        # Calculate average ratings
        for brand in company_data:
            if company_data[brand]['rating_count'] > 0:
                company_data[brand]['average_rating'] = company_data[brand]['total_rating'] / company_data[brand]['rating_count']
            else:
                company_data[brand]['average_rating'] = None
        
        # Calculate market share ratios based on product count
        total_products = sum(data['product_count'] for data in company_data.values())
        
        # Avoid division by zero
        if total_products > 0:
            for brand in company_data:
                company_data[brand]['market_share'] = company_data[brand]['product_count'] / total_products
        
        # Sort brands by market share
        sorted_brands = sorted(company_data.items(), key=lambda x: x[1]['market_share'] if 'market_share' in x[1] else 0, reverse=True)
        top_brands = {brand: data for brand, data in sorted_brands[:10]}
        
        # Create a comprehensive result structure
        result = {
            "search_term": product_name,
            "total_products_found": len(product_details),
            "analysis_date": time.strftime("%Y-%m-%d"),
            "top_brands": top_brands,
            "all_brands_count": len(company_data),
            "products": product_details
        }
        
        # Create output directory if it doesn't exist
        os.makedirs("ebay_results", exist_ok=True)
        
        # Save the results to a JSON file
        output_filename = f"ebay_results/ebay_{product_name.replace(' ', '_')}_market_analysis.json"
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=4, ensure_ascii=False)
        
        print(f"\nMarket analysis for '{product_name}' saved to {output_filename}")
        return result
        
    except Exception as e:
        print(f"An error occurred during execution: {e}")
        return {"error": str(e)}
        
    finally:
        driver.quit()

# Example usage
if __name__ == "__main__":
    product_search_term = "PS5 Pro"  # Change to whatever product you want to analyze
    result = ebay_product_search(product_search_term, max_products=10, get_reviews=True)
    
    # Display a summary of results
    if "error" not in result:
        print(f"\nMarket Analysis Summary for: {result['search_term']}")
        print(f"Total products analyzed: {result['total_products_found']}")
        print(f"Number of brands identified: {result['all_brands_count']}")
        print("\nTop 5 Brands by Market Share:")
        
        # Get top 5 for display
        for i, (brand, data) in enumerate(list(result['top_brands'].items())[:5]):
            avg_rating = "N/A"
            if data['average_rating'] is not None:
                avg_rating = f"{data['average_rating']:.1f}"
                
            print(f"{brand}: {data['market_share']*100:.2f}% (Products: {data['product_count']}, " +
                  f"Avg Rating: {avg_rating}, Reviews: {data['review_count']})")
            
            # Show a sample review if available
            if data['reviews']:
                print(f"  Sample review: \"{data['reviews'][0]['text'][:100]}...\"")
    else:
        print(f"Error in analysis: {result['error']}")