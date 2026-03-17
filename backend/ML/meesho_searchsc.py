import requests
from bs4 import BeautifulSoup
from backend import db
from backend.models import EbayProduct

def meesho_product_search(product_name, max_products=10):
    print(f"Starting Real Meesho search for: {product_name}")
    
    url = f"https://www.meesho.com/search?q={product_name.replace(' ', '+')}"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'}
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Meesho uses data-testid or specific class structures
        items = soup.find_all('div', attrs={'class': lambda x: x and 'NewProductCard' in x}) or soup.select('div[class*="ProductCard"]')
        print(f"Found {len(items)} items on Meesho.")
        
        saved_count = 0
        for item in items[:max_products]:
            try:
                title_elem = item.find('p')
                title = title_elem.text.strip() if title_elem else "Meesho Product"
                
                link_elem = item.find('a', href=True)
                link = "https://www.meesho.com" + link_elem.get("href") if link_elem else ""
                
                price_elem = item.find('h5') or item.select_one('h4')
                price_text = price_elem.text.strip() if price_elem else "0"
                price = ''.join(filter(str.isdigit, price_text)) or "0"
                
                existing = EbayProduct.query.filter_by(url=link).first()
                if not existing and link:
                    new_prod = EbayProduct(
                        title=title,
                        brand="Meesho",
                        price=price,
                        url=link,
                        rating=4.2,
                        rating_count=150, 
                        seller_feedback=88,
                        search_term=product_name
                    )
                    db.session.add(new_prod)
                    saved_count += 1
            except Exception as e:
                print(f"Error parsing Meesho item: {e}")
                
        db.session.commit()
        print(f"Successfully saved {saved_count} new Meesho products.")
        return {"status": "success", "saved": saved_count}
        
    except Exception as e:
        db.session.rollback()
        print(f"Error scraping Meesho: {e}")
        return {"status": "error", "message": str(e)}
