import requests
from bs4 import BeautifulSoup
import time

def probe(name, url, headers=None):
    if not headers:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    print(f"--- Probing {name} ---")
    try:
        r = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {r.status_code}")
        soup = BeautifulSoup(r.text, 'html.parser')
        title = (soup.title.string or "No Title").lower()
        if r.status_code == 200 and "captcha" not in title and "access denied" not in title and "moment" not in title:
            print("✅ Status 200 and no obvious blocking.")
            return True, r.text
        else:
            print(f"❌ Blocked or Error. Title: {title}")
            return False, None
    except Exception as e:
        print(f"❌ Error: {e}")
        return False, None

# Try some "Mainstream" but potentially easier sites
probe("Snapdeal", "https://www.snapdeal.com/search?keyword=iphone")
probe("Mercari", "https://www.mercari.com/search/?keyword=iphone")
probe("Overstock", "https://www.overstock.com/search?keywords=iphone")
probe("Alibaba", "https://www.alibaba.com/showroom/iphone.html")
probe("AliExpress", "https://www.aliexpress.com/wholesale?SearchText=iphone")
