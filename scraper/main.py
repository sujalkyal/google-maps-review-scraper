from fastapi import FastAPI, Request
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

app = FastAPI()



@app.post("/scrape")
async def scrape_reviews(req: Request):
    data = await req.json()
    url = data.get("url")

    if not url:
        return {"error": "Missing URL"}

    options = Options()
    options.add_argument("--headless=new")  # Use "new" mode for stability
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--no-sandbox")
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get(url)

    wait = WebDriverWait(driver, 10)

    # Step 1: Click the "Reviews" tab
    try:
        reviews_tab = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@aria-label[contains(.,"Reviews for")]]')))
        reviews_tab.click()
        print("Clicked Reviews tab.")
    except:
        print("Could not find or click Reviews tab.")
        driver.quit()
        return

    time.sleep(2)

    # Step 2: Scroll to load more reviews
    # scrollable_div_xpath = '//div[contains(@class, "m6QErb") and contains(@class, "DxyBCb") and contains(@class, "XiKgde")]'

    # scrollable_div = wait.until(EC.presence_of_element_located(
    # (By.CSS_SELECTOR, 'div.m6QErb.DxyBCb.XiKgde')))

    # prev_height = driver.execute_script("return arguments[0].scrollHeight", scrollable_div)
    # while True:
    #     driver.execute_script("arguments[0].scrollTo(0, arguments[0].scrollHeight)", scrollable_div)
    #     time.sleep(2)
    #     new_height = driver.execute_script("return arguments[0].scrollHeight", scrollable_div)
    #     if new_height == prev_height:
    #         break
    #     prev_height = new_height

    # print("Finished scrolling reviews.")

    # Step 3: Extract reviews
    reviews = driver.find_elements(By.XPATH, '//div[@class="jftiEf fontBodyMedium "]')
    data = []

    for review in reviews:
        try:
            name = review.find_element(By.CLASS_NAME, "d4r55").text
        except:
            name = "N/A"
        try:
            rating = review.find_element(By.CSS_SELECTOR, '[role="img"]').get_attribute("aria-label")
        except:
            rating = "N/A"
        try:
            date = review.find_element(By.CLASS_NAME, "rsqaWe").text
        except:
            date = "N/A"
        try:
            text = review.find_element(By.CLASS_NAME, "MyEned").text
        except:
            text = "N/A"
        try:
            images = review.find_elements(By.CLASS_NAME, "Tya61d")
            image_urls = [img.get_attribute("style").split('url("')[1].split('")')[0] for img in images]
        except:
            image_urls = []

        data.append({
            "name": name,
            "rating": rating,
            "date": date,
            "text": text,
            "images": image_urls
        })

    driver.quit()

    # Print sample
    for d in data[:3]:  # Show first 3 reviews
        print("\n--- Review ---")
        for k, v in d.items():
            print(f"{k}: {v}")

    return {"reviews": data}
