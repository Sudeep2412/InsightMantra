import requests
from bs4 import BeautifulSoup

def probe_advanced(name, url):
    print(f"\n--- Probing: {name} ---")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    }
    try:
        r = requests.get(url, headers=headers, timeout=15)
        print(f"Status: {r.status_code}")
        soup = BeautifulSoup(r.text, 'html.parser')
        title = (soup.title.string or "No Title").strip()
        print(f"Title: {title}")
        
        if r.status_code == 200 and "security" not in title.lower() and "captcha" not in title.lower() and "moment" not in title.lower():
            print(f"✅ {name} looks GOOD.")
            return True
        else:
            print(f"❌ {name} BLOCKED or Error.")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

targets = [
    ("IndiaMART", "https://dir.indiamart.com/search.mp?ss=laptop"),
    ("Meesho", "https://www.meesho.com/search?q=watch"),
    ("Banggood", "https://www.banggood.com/search/laptop.html"),
    ("DHgate", "https://www.dhgate.com/wholesale/search.do?act=search&sus=&searchkey=watch"),
    ("Slickdeals", "https://slickdeals.net/newsearch.php?src=SearchBarV2&q=laptop"),
    ("Trustpilot", "https://www.trustpilot.com/search?query=apple"),
    ("MicroCenter", "https://www.microcenter.com/search/search_results.aspx?Ntt=laptop"),
    ("Adorama", "https://www.adorama.com/l/?searchredirect=true&query=laptop"),
]

for name, url in targets:
    probe_advanced(name, url)
