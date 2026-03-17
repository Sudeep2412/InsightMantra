import abc
import time
import random
import requests
from bs4 import BeautifulSoup
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BaseScraper(abc.ABC):
    def __init__(self, use_proxies=False):
        self.use_proxies = use_proxies
        # Provide your proxy lists here or tie into a rotating proxy service
        self.proxies_list = [
            # "http://proxy1",
            # "http://proxy2"
        ]
        
    def get_random_user_agent(self):
        user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
        ]
        return random.choice(user_agents)

    def get_proxy(self):
        if self.use_proxies and self.proxies_list:
            return {"http": random.choice(self.proxies_list), "https": random.choice(self.proxies_list)}
        return None

    def fetch_page(self, url, retries=3, delay_range=(2, 5)):
        for attempt in range(retries):
            try:
                headers = {"User-Agent": self.get_random_user_agent()}
                proxies = self.get_proxy()
                
                # randomized delay to handle anti-bot measures gracefully
                time.sleep(random.uniform(*delay_range))
                
                response = requests.get(url, headers=headers, proxies=proxies, timeout=10)
                response.raise_for_status()
                return response.text
                
            except requests.exceptions.RequestException as e:
                logger.warning(f"Attempt {attempt+1} failed for {url}: {e}")
                if attempt == retries - 1:
                    logger.error(f"Failed to fetch {url} after {retries} attempts.")
                    return None
                    
    def parse_html(self, html_content):
        if not html_content:
            return None
        return BeautifulSoup(html_content, 'html.parser')

    @abc.abstractmethod
    def extract_features(self, parsed_html):
        """
        Must return a dictionary containing standard keys:
        - title
        - price
        - stock_status
        - review_count
        - rating
        - competitor_badges (e.g., 'Amazon Choice', 'Best Seller')
        """
        pass
        
    def scrape(self, url):
        html = self.fetch_page(url)
        parsed = self.parse_html(html)
        if parsed:
            return self.extract_features(parsed)
        return None
