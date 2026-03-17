from selenium import webdriver
from bs4 import BeautifulSoup

options = webdriver.ChromeOptions()
options.add_argument("--headless=new")
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
options.add_argument("--window-size=1920,1080")

driver = webdriver.Chrome(options=options)
driver.get("https://www.etsy.com/search?q=iphone+15")
import time
time.sleep(3)
html = driver.page_source

soup = BeautifulSoup(html, "html.parser")
cards = soup.select(".v2-listing-card")
print("Found .v2-listing-card:", len(cards))

if len(cards) == 0:
    # Try generic listing selectors
    listings = soup.select("li a, div a")
    possible_products = [a for a in listings if '/listing/' in a.get('href', '')]
    print("Found potential product links:", len(possible_products))
    if len(possible_products) > 0:
        print("First product link class:", possible_products[0].get("class"))
        print("First product href:", possible_products[0].get("href"))
        
driver.quit()
