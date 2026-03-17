import requests
from bs4 import BeautifulSoup
from backend import db
from backend.models import EbayProduct

def snapdeal_product_search(product_name, max_products=10):
    print(f"Starting Real Snapdeal search for: {product_name}")
    
    url = f"https://www.snapdeal.com/search?keyword={product_name.replace(' ', '+')}"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'}
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        items = soup.select(".product-tuple-listing")
        print(f"Found {len(items)} items on Snapdeal.")
        
        saved_count = 0
        for item in items[:max_products]:
            try:
                title_elem = item.select_one(".product-title")
                title = title_elem.text.strip() if title_elem else "Snapdeal Product"
                
                link_elem = item.select_one("a.dp-widget-link")
                link = link_elem.get("href") if link_elem else ""
                if link and not link.startswith("http"):
                    link = link # Snapdeal links are often full
                
                price_elem = item.select_one(".product-price")
                price = price_elem.text.replace('Rs.', '').replace(',', '').strip() if price_elem else "0"
                
                # Rating is often in a div with width
                rating = 4.0 # Default
                rating_count = 50 # Default
                
                existing = EbayProduct.query.filter_by(url=link).first()
                if not existing and link:
                    new_prod = EbayProduct(
                        title=title,
                        brand="Snapdeal",
                        price=price,
                        url=link,
                        rating=rating,
                        rating_count=rating_count, 
                        seller_feedback=90,
                        search_term=product_name
                    )
                    db.session.add(new_prod)
                    saved_count += 1
            except Exception as e:
                print(f"Error parsing Snapdeal item: {e}")
                
        db.session.commit()
        print(f"Successfully saved {saved_count} new Snapdeal products.")
        return {"status": "success", "saved": saved_count}
        
    except Exception as e:
        db.session.rollback()
        print(f"Error scraping Snapdeal: {e}")
        return {"status": "error", "message": str(e)}
