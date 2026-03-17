import requests
from bs4 import BeautifulSoup
from backend import db
from backend.models import EbayProduct

def shopclues_product_search(product_name, max_products=10):
    print(f"Starting Real ShopClues search for: {product_name}")
    
    url = f"https://www.shopclues.com/search?q={product_name.replace(' ', '+')}"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'}
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        items = soup.select(".column")
        print(f"Found {len(items)} items on ShopClues.")
        
        saved_count = 0
        for item in items[:max_products]:
            try:
                title_elem = item.select_one("h2")
                title = title_elem.text.strip() if title_elem else "ShopClues Product"
                
                link_elem = item.select_one("a")
                link = link_elem.get("href") if link_elem else ""
                if link and not link.startswith("http"):
                    link = "https:" + link
                
                price_elem = item.select_one(".p_price")
                price = price_elem.text.replace('Rs.', '').replace(',', '').strip() if price_elem else "0"
                
                existing = EbayProduct.query.filter_by(url=link).first()
                if not existing and link:
                    new_prod = EbayProduct(
                        title=title,
                        brand="ShopClues",
                        price=price,
                        url=link,
                        rating=4.0,
                        rating_count=30, 
                        seller_feedback=85,
                        search_term=product_name
                    )
                    db.session.add(new_prod)
                    saved_count += 1
            except Exception as e:
                print(f"Error parsing ShopClues item: {e}")
                
        db.session.commit()
        print(f"Successfully saved {saved_count} new ShopClues products.")
        return {"status": "success", "saved": saved_count}
        
    except Exception as e:
        db.session.rollback()
        print(f"Error scraping ShopClues: {e}")
        return {"status": "error", "message": str(e)}
