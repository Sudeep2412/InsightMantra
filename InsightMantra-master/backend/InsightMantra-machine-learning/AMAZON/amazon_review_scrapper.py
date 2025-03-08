from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time
from bs4 import BeautifulSoup
import pandas as pd

def get_amazon_reviews(product_url, min_reviews=100):
    '''
    input = product url of amazon , min_reviews = default set to 100
    output = list of all the revies body and their respective date
    '''
    
    # Path to the Edge WebDriver executable
    edge_driver_path = 'C:/msedgedriver.exe'  # replace the path with your path of msedgedriver

    # Initialize the Selenium WebDriver for Microsoft Edge
    options = webdriver.EdgeOptions()
    options.add_argument("--headless")  # Run in headless mode
    driver = webdriver.Edge(service=Service(edge_driver_path), options=options)
    
    reviews = []  # Initialize the list to store reviews

    try:
        # Open the product page
        driver.get(product_url)
        wait = WebDriverWait(driver, 10)

        # Scroll to the reviews section
        reviews_section = wait.until(EC.presence_of_element_located((By.ID, 'reviewsMedley')))
        ActionChains(driver).move_to_element(reviews_section).perform()
        time.sleep(2)

        while len(reviews) < min_reviews:
            # Get the page source and parse it with BeautifulSoup
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            
            # Collect reviews
            review_elements = soup.find_all('div', {'data-hook': 'review'})
            for review_element in review_elements:
                try:
                    review_body = review_element.find('span', {'data-hook': 'review-body'}).text.strip()
                    review_date = review_element.find('span', {'data-hook': 'review-date'}).text.strip()
                    
                    reviews.append({
                        'body': review_body,
                        'date': review_date
                    })

                    # Stop if we have collected enough reviews
                    if len(reviews) >= min_reviews:
                        break
                except Exception as e:
                    print(f"Error extracting review details: {e}")

            # Check for the 'Next' button to load more reviews
            try:
                next_button = driver.find_element(By.XPATH, '//li[@class="a-last"]/a')
                if next_button:
                    next_button.click()
                    time.sleep(3)  # Wait for the next page of reviews to load
                else:
                    break
            except Exception:
                break

    except Exception as e:
        print(f"Error during review extraction: {e}")
    finally:
        driver.quit()
    
    return reviews

# place your product URL here
product_url = ""
# getting the reviews
reviews = get_amazon_reviews(product_url)

df = pd.DataFrame(reviews)
# Save the DataFrame to a CSV file
df.to_csv("amazon_reviews.csv", index=False)
