import requests
from bs4 import BeautifulSoup

def probe_overstock():
    url = "https://www.overstock.com/search?keywords=iphone"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html,application/xhtml+xml',
    }
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.text, 'html.parser')
    
    products = soup.select('div[data-component="ProductCard"]') or soup.select('.product-card') or soup.find_all('a', href=True)
    print("Found links:", len(products))
    if len(products) > 0:
        print("First few:")
        for p in products[:3]:
            print(p.text[:50].strip() or p.get('href'))

probe_overstock()
