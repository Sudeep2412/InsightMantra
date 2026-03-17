import requests
from bs4 import BeautifulSoup

def inspect_aliexpress():
    print("--- Inspecting AliExpress ---")
    url = "https://www.aliexpress.com/wholesale?SearchText=iphone"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.text, 'html.parser')
    
    # AliExpress often uses complex classes, let's look for search match strings
    links = [a for a in soup.find_all('a', href=True) if '/item/' in a.get('href')]
    print(f"Product links found: {len(links)}")
    if links:
        print("First Link:", links[0].get('href'))

inspect_aliexpress()
