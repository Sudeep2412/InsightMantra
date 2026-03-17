import requests
from bs4 import BeautifulSoup
from backend import db
from backend.models import EbayProduct

def nykaa_product_search(product_name, max_products=10):
    print(f"Starting Real Nykaa search for: {product_name}")
    
    url = f"https://www.nykaa.com/search/result/?q={product_name.replace(' ', '+')}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look for product cards
        items = soup.select(".product-wrapper") or soup.select(".css-d5z3mo") or soup.find_all('div', class_=lambda x: x and 'productCard' in x)
        print(f"Found {len(items)} items on Nykaa.")
        
        saved_count = 0
        for item in items[:max_products]:
            try:
                title_elem = item.select_one(".product-title") or item.select_one(".css-1rd7vky")
                title = title_elem.text.strip() if title_elem else "Nykaa Product"
                
                link_elem = item.select_one("a")
                link = "https://www.nykaa.com" + link_elem.get("href") if link_elem and link_elem.get("href") else ""
                
                price_elem = item.select_one(".price-amount") or item.select_one(".css-11n6zwy")
                price_text = price_elem.text.strip() if price_elem else "0"
                price = ''.join(filter(str.isdigit, price_text)) or "0"
                
                existing = EbayProduct.query.filter_by(url=link).first()
                if not existing and link:
                    new_prod = EbayProduct(
                        title=title,
                        brand="Nykaa",
                        price=price,
                        url=link,
                        rating=4.5,
                        rating_count=200, 
                        seller_feedback=98,
                        search_term=product_name
                    )
                    db.session.add(new_prod)
                    saved_count += 1
            except Exception as e:
                print(f"Error parsing Nykaa item: {e}")
                
        db.session.commit()
        print(f"Successfully saved {saved_count} new Nykaa products.")
        return {"status": "success", "saved": saved_count}
        
    except Exception as e:
        db.session.rollback()
        print(f"Error scraping Nykaa: {e}")
        return {"status": "error", "message": str(e)}
