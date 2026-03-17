import requests
from bs4 import BeautifulSoup

def test_req(name, url):
    print(f"Testing {name} with requests...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
    }
    try:
        r = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {r.status_code}, Length: {len(r.text)}")
        soup = BeautifulSoup(r.text, 'html.parser')
        print(f"Title: {soup.title.string if soup.title else 'No title'}")
        
        # basic check
        if r.status_code == 200 and len(r.text) > 50000 and "captcha" not in (soup.title.string or "").lower():
            print("✅ Looks promising!")
            return True
        else:
            print("❌ Probably blocked")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

test_req("Target", "https://www.target.com/s?searchTerm=iphone")
test_req("BestBuy", "https://www.bestbuy.com/site/searchpage.jsp?st=iphone")
test_req("Etsy", "https://www.etsy.com/search?q=iphone")
test_req("Walmart", "https://www.walmart.com/search?q=iphone")
test_req("B&H", "https://www.bhphotovideo.com/c/search?q=iphone")
