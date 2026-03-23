import requests
import time

print("1. Scraping Gaming Laptop...")
res = requests.post("http://localhost:2000/api/scrape", json={
    "product_name": "Gaming Laptop", "product_url": "", "sources": ["ebay"]
})
print(res.text)

print("Waiting 3 seconds for fallback generator to finish threading...")
time.sleep(3)

print("\n2. Fetching Forecast Dashboard Data...")
res2 = requests.get("http://localhost:2000/api/forecast")
print(res2.json()['kpis'])

print("\n3. Fetching Market Analysis Data...")
res3 = requests.get("http://localhost:2000/api/analysis/brand_market_share")
print(res3.json())
