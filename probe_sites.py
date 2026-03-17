from selenium import webdriver
from bs4 import BeautifulSoup
import time

def probe_site(name, url, search_selector):
    print(f"\n--- Probing {name} ---")
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(options=options)
    try:
        driver.get(url)
        time.sleep(4)
        soup = BeautifulSoup(driver.page_source, "html.parser")
        
        # Check against common block signatures
        title = soup.title.string.lower() if soup.title else ""
        text = soup.get_text().lower()
        if "captcha" in title or "access denied" in title or "are you a human" in text or "security measure" in text:
            print(f"❌ BLOCKED: Appears to be blocked by bot protection.")
            return False
            
        items = soup.select(search_selector)
        if len(items) > 0:
            print(f"✅ SUCCESS: Found {len(items)} items matching '{search_selector}'")
            return True
        else:
            print(f"⚠️ NO MATCHES: Loaded page but CSS selector '{search_selector}' found nothing.")
            print(f"Page Title: {soup.title.string if soup.title else 'No Title'}")
            return False
    except Exception as e:
        print(f"❌ ERROR: Exception occurred - {e}")
        return False
    finally:
        driver.quit()

if __name__ == "__main__":
    # Test Barnes & Noble
    probe_site("Barnes & Noble", "https://www.barnesandnoble.com/s/harry+potter", "div.product-shelf-info")
    
    # Test Micro Center
    probe_site("Micro Center", "https://www.microcenter.com/search/search_results.aspx?Ntt=laptop", "li.product_wrapper")
    
    # Test Woot
    probe_site("Woot", "https://www.woot.com/category/computers", "div.feed-item")
    
    # Test Adorama
    probe_site("Adorama", "https://www.adorama.com/l/?searchinfo=camera", "div.item")
