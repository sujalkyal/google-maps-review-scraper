from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
from transformers import pipeline
import undetected_chromedriver as uc

app = FastAPI()

print("🔧 Loading sentiment analysis pipeline...")
sentiment_pipeline = pipeline("sentiment-analysis", model="siebert/sentiment-roberta-large-english")
print("✅ Sentiment pipeline loaded.")

async def analyze_sentiment(text: str):
    print(f"🧠 Analyzing sentiment for text: {text[:60]}...")
    if not text:
        return {"error": "No text provided for sentiment analysis."}
    
    result = sentiment_pipeline(text)
    print(f"🔍 Sentiment result: {result}")
    return {"label": result[0]['label'], "score": result[0]['score']}

@app.post("/scrape")
async def scrape_reviews(req: Request):
    print("📥 Received request to /scrape")
    data = await req.json()
    url = data.get("url")
    print(f"🌐 URL to scrape: {url}")

    if not url:
        print("❌ Missing URL in request")
        return JSONResponse(status_code=400, content={"error": "Missing URL"})

    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    print("🚗 WebDriver initialized")
    driver.get(url)
    print("🌍 Navigated to URL")

    wait = WebDriverWait(driver, 10)

    # Click Reviews tab
    try:
        print("🔍 Looking for Reviews tab...")
        reviews_tab = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@aria-label[contains(.,"Reviews for")]]')))
        reviews_tab.click()
        print("✅ Clicked Reviews tab.")
    except Exception as e:
        print(f"❌ Could not click Reviews tab: {e}")
        driver.quit()
        return JSONResponse(status_code=500, content={"error": "Could not click Reviews tab"})

    time.sleep(2)

    print("🔎 Locating review elements...")
    reviews = driver.find_elements(By.XPATH, '//div[@class="jftiEf fontBodyMedium "]')
    data = []
    print(f"📝 Found {len(reviews)} reviews")

    for i, review in enumerate(reviews):
        print(f"--- Parsing review {i+1} ---")
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
            sentiment_result = await analyze_sentiment(text)
            sentiment_label = sentiment_result.get("label", "N/A")
            sentiment_score = sentiment_result.get("score", "N/A")
        except Exception as e:
            print(f"❌ Sentiment analysis failed: {e}")
            sentiment_label = "N/A"
            sentiment_score = "N/A"

        data.append({
            "name": name,
            "rating": rating,
            "date": date,
            "text": text,
            "sentiment_label": sentiment_label,
            "sentiment_score": sentiment_score
        })

    driver.quit()
    print("🛑 WebDriver closed")

    valid_ratings = [float(r["rating"].split()[0]) for r in data if r["rating"] != "N/A"]
    avg_rating = sum(valid_ratings) / len(valid_ratings) if valid_ratings else 0.0

    summary = {
        "avgRating": avg_rating,
        "total": len(data),
        "positive": sum(1 for r in data if r["sentiment_label"].lower() == "positive"),
        "neutral": sum(1 for r in data if r["sentiment_label"].lower() == "neutral"),
        "negative": sum(1 for r in data if r["sentiment_label"].lower() == "negative"),
    }

    print("📊 Summary:")
    print(summary)

    for d in data[:3]:
        print("\n--- Sample Review ---")
        for k, v in d.items():
            print(f"{k}: {v}")

    return {"reviews": data, "summary": summary}


@app.post("/scraperName")
async def scraper_name(req: Request):
    print("📥 Request received to /scraperName")
    data = await req.json()
    url = data.get("url")
    print(f"🔗 URL provided: {url}")

    if not url:
        print("❌ No URL provided.")
        return {"error": "Missing URL"}

    options = uc.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--disable-gpu")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36")
    # Uncomment the line below if you want headless
    # options.add_argument("--headless=new")

    try:
        driver = uc.Chrome(options=options, version_main=135)
        print("🚗 WebDriver initialized (stealth)")
        driver.get(url)

        wait = WebDriverWait(driver, 10)
        print("🔍 Waiting for the business name element...")

        # Try multiple selectors to improve reliability
        possible_selectors = [
            "div.PZPZlf.ssJ7i.B5dxMb",
            "div.PZPZlf.ssJ7i.xgAzOe",
            "#rhs div.QpPSMb > div > div",  # Based on full XPath you shared
        ]

        business_name = None
        for selector in possible_selectors:
            try:
                name_div = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
                business_name = name_div.text.strip()
                if business_name:
                    break
            except:
                continue

        if business_name:
            print(f"✅ Business name found: {business_name}")
            return {"name": business_name}
        else:
            print("❌ Business name not found after trying all selectors.")
            return {"error": "Business name not found"}

    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return {"error": "An error occurred while scraping"}
    finally:
        if driver:
            driver.quit()
        print("🛑 WebDriver closed")


@app.post("/generate-url")
async def generate_url(req: Request):
    print("📥 Request received to /generate-url")
    data = await req.json()
    name = data.get("businessName")
    print(f"🏷️ Business name provided: {name}")

    if not name:
        print("❌ No business name provided.")
        return {"error": "Missing business name"}

    options = Options()
    options.add_argument("--headless=new")  # classic headless is more stable
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    print("🚗 WebDriver initialized")

    try:
        search_url = f"https://www.google.com/maps/search/{name.replace(' ', '+')}"
        print(f"🔎 Navigating to search URL: {search_url}")
        driver.get(search_url)

        # Wait for some content to load (not strict element)
        WebDriverWait(driver, 10).until(lambda d: "google.com/maps" in d.current_url)
        time.sleep(1)  # Give time for links to render

        try:
            link_elem = driver.find_element(By.CSS_SELECTOR, "a.hfpxzc")
            href = link_elem.get_attribute("href")
            print(f"✅ Found exact link: {href}")
            return {"url": href}
        except Exception as e:
            print(f"⚠️ Could not find <a.hfpxzc>: {e}")
            print("↩️ Returning fallback search URL.")
            return {"url": search_url}

    except Exception as e:
        print(f"❌ Unexpected exception: {e}")
        return {"url": search_url}
    finally:
        driver.quit()
        print("🛑 WebDriver closed")

