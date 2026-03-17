import undetected_chromedriver as uc
from bs4 import BeautifulSoup
import time

def probe_uc():
    print("Starting UC test on B&H...")
    options = uc.ChromeOptions()
    options.headless = True
    driver = uc.Chrome(options=options)
    
    try:
        driver.get("https://www.bhphotovideo.com/c/search?q=camera")
        time.sleep(5)
        soup = BeautifulSoup(driver.page_source, "html.parser")
        
        items = soup.select('div[data-selenium="miniProductPage"]')
        
        print("Title:", soup.title.string if soup.title else "No Title")
        print("Found items:", len(items))
        if len(items) == 0:
            print(driver.page_source[:500])
    except Exception as e:
        print("Error:", e)
    finally:
        driver.quit()

if __name__ == '__main__':
    probe_uc()
