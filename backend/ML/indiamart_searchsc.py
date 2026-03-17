import requests
from bs4 import BeautifulSoup
from backend import db
from backend.models import EbayProduct

def indiamart_product_search(product_name, max_products=10):
    print(f"Starting Real IndiaMART search for: {product_name}")
    
    url = f"https://dir.indiamart.com/search.mp?ss={product_name.replace(' ', '+')}"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'}
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look for product cards
        items = soup.select(".m-lstng") or soup.select(".lst_cl")
        print(f"Found {len(items)} items on IndiaMART.")
        
        saved_count = 0
        for item in items[:max_products]:
            try:
                title_elem = item.select_one(".m-nme") or item.select_one(".nme")
                title = title_elem.text.strip() if title_elem else "IndiaMART Product"
                
                link_elem = title_elem.find('a') if title_elem else item.select_one("a")
                link = link_elem.get("href") if link_elem else ""
                
                price_elem = item.select_one(".m-pr") or item.select_one(".prc")
                price_text = price_elem.text.strip() if price_elem else "0"
                # Strip currency symbols and commas
                price = ''.join(filter(str.isdigit, price_text)) or "0"
                
                existing = EbayProduct.query.filter_by(url=link).first()
                if not existing and link:
                    new_prod = EbayProduct(
                        title=title,
                        brand="IndiaMART",
                        price=price,
                        url=link,
                        rating=4.5,
                        rating_count=100, 
                        seller_feedback=95,
                        search_term=product_name
                    )
                    db.session.add(new_prod)
                    saved_count += 1
            except Exception as e:
                print(f"Error parsing IndiaMART item: {e}")
                
        db.session.commit()
        print(f"Successfully saved {saved_count} new IndiaMART products.")
        return {"status": "success", "saved": saved_count}
        
    except Exception as e:
        db.session.rollback()
        print(f"Error scraping IndiaMART: {e}")
        return {"status": "error", "message": str(e)}
