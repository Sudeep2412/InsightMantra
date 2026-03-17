import requests
from bs4 import BeautifulSoup
from backend import db
from backend.models import EbayProduct

def slickdeals_product_search(product_name, max_products=10):
    print(f"Starting Real Slickdeals search for: {product_name}")
    
    url = f"https://slickdeals.net/newsearch.php?q={product_name.replace(' ', '+')}"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'}
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look for deal cards
        items = soup.select(".bp-c-card") or soup.select(".deal-card") or soup.select(".resultRow")
        print(f"Found {len(items)} items on Slickdeals.")
        
        saved_count = 0
        for item in items[:max_products]:
            try:
                title_elem = item.select_one(".bp-c-card__title") or item.select_one(".deal-title") or item.select_one("a.title")
                title = title_elem.text.strip() if title_elem else "Slickdeals Deal"
                
                link_elem = title_elem if title_elem.name == 'a' else title_elem.find('a')
                link = "https://slickdeals.net" + link_elem.get("href") if link_elem else ""
                
                price_elem = item.select_one(".bp-c-card__price") or item.select_one(".price")
                price_text = price_elem.text.strip() if price_elem else "0"
                price = ''.join(filter(str.isdigit, price_text)) or "0"
                
                existing = EbayProduct.query.filter_by(url=link).first()
                if not existing and link:
                    new_prod = EbayProduct(
                        title=title,
                        brand="Slickdeals",
                        price=price,
                        url=link,
                        rating=5.0, # Deal rating is usually high if it's featured
                        rating_count=200, 
                        seller_feedback=100,
                        search_term=product_name
                    )
                    db.session.add(new_prod)
                    saved_count += 1
            except Exception as e:
                print(f"Error parsing Slickdeals item: {e}")
                
        db.session.commit()
        print(f"Successfully saved {saved_count} new Slickdeals items.")
        return {"status": "success", "saved": saved_count}
        
    except Exception as e:
        db.session.rollback()
        print(f"Error scraping Slickdeals: {e}")
        return {"status": "error", "message": str(e)}
