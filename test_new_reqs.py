import requests
from bs4 import BeautifulSoup

def test_req(name, url):
    print(f"\n--- Testing {name} ---")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
    }
    try:
        r = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {r.status_code}, Length: {len(r.text)}")
        soup = BeautifulSoup(r.text, 'html.parser')
        title = soup.title.string if soup.title else "No Title"
        print(f"Title: {title.encode('ascii', 'ignore').decode()}")
        
        # basic check
        if r.status_code == 200 and len(r.text) > 20000 and "captcha" not in title.lower() and "just a moment" not in title.lower() and "access denied" not in title.lower():
            print("✅ Looks promising! Can scrape with requests.")
        else:
            print("❌ Probably blocked")
    except Exception as e:
        print(f"Error: {e}")

test_req("Mercari", "https://www.mercari.com/search/?keyword=iphone")
test_req("Zappos", "https://www.zappos.com/iphone")
test_req("Overstock", "https://www.overstock.com/search?keywords=iphone")
test_req("B&H", "https://www.bhphotovideo.com/")
