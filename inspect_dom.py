import requests
from bs4 import BeautifulSoup

def inspect(name, url):
    print(f"--- Inspecting {name} ---")
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.text, 'html.parser')
    
    if name == "Snapdeal":
        # Look for product cards
        cards = soup.select(".product-tuple-listing")
        print(f"Cards found: {len(cards)}")
        if cards:
            c = cards[0]
            print("Title:", c.select_one(".product-title").text if c.select_one(".product-title") else "N/A")
            print("Price:", c.select_one(".product-price").text if c.select_one(".product-price") else "N/A")
            print("Link:", c.select_one("a.dp-widget-link").get("href") if c.select_one("a.dp-widget-link") else "N/A")

    if name == "Overstock":
        # Overstock uses data-component
        cards = soup.select('div[data-component="ProductCard"]') or soup.select('.product-card')
        print(f"Cards found: {len(cards)}")
        if cards:
            c = cards[0]
            print("Text:", c.text[:100].strip())

inspect("Snapdeal", "https://www.snapdeal.com/search?keyword=laptop")
inspect("Overstock", "https://www.overstock.com/search?keywords=laptop")
