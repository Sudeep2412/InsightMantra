import requests
from bs4 import BeautifulSoup

def probe_advanced(name, url):
    print(f"\n--- Advanced Probe: {name} ---")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
    }
    try:
        r = requests.get(url, headers=headers, timeout=15)
        print(f"Status: {r.status_code}")
        soup = BeautifulSoup(r.text, 'html.parser')
        title = (soup.title.string or "No Title").strip()
        print(f"Title: {title}")
        
        if r.status_code == 200 and "security" not in title.lower() and "captcha" not in title.lower() and "moment" not in title.lower():
            print(f"✅ {name} looks GOOD.")
            # Quick check for product count
            if name == "ShopClues":
                items = soup.select(".column") or soup.select(".search_result_item")
                print(f"Potential items: {len(items)}")
            return True
        else:
            print(f"❌ {name} BLOCKED.")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

probe_advanced("ShopClues", "https://www.shopclues.com/search?q=laptop")
probe_advanced("MicroCenter", "https://www.microcenter.com/search/search_results.aspx?Ntt=laptop")
probe_advanced("Snapdeal", "https://www.snapdeal.com/search?keyword=laptop")
