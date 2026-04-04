from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

options = Options()
options.add_argument("--headless")
options.add_argument("--log-level=3")

try:
    driver = webdriver.Chrome(options=options)
    driver.get("http://127.0.0.1:5173/")
    time.sleep(3)
    logs = driver.get_log('browser')
    for log in logs:
        print(f"[{log['level']}] {log['message']}")
    driver.quit()
    print("Done checking console logs.")
except Exception as e:
    print(f"Error starting webdriver: {e}")
