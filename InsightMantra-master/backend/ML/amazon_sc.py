from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time
from bs4 import BeautifulSoup
import pandas as pd
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch.nn.functional as F
import tqdm
import numpy as np
import matplotlib.pyplot as plt
from transformers import pipeline
import re
import json
import nltk
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
import sys

def amazon_review_analyzer(product_url=None):
    """
    Main function that accepts a product URL as input and performs the entire analysis pipeline.
    If no URL is provided, it will prompt the user to enter one.
    """
    if product_url is None:
        product_url = input("Please enter the Amazon product URL: ")
    
    print(f"Analyzing reviews for: {product_url}")
    
    # Call the amazon_url function with the provided URL
    results = amazon_url(product_url)
    
    return results

def amazon_url(product_url):
    def get_amazon_reviews(product_url, min_reviews=100):
        # Path to the Edge WebDriver executable
        edge_driver_path = r'C:\Users\sudee\Downloads\edgedriver_win64\msedgedriver.exe'

        options = webdriver.EdgeOptions()
        options.add_argument("--headless")
        driver = webdriver.Edge(service=Service(edge_driver_path), options=options)
        
        reviews = []

        try:
            driver.get(product_url)
            wait = WebDriverWait(driver, 10)
            reviews_section = wait.until(EC.presence_of_element_located((By.ID, 'reviewsMedley')))
            ActionChains(driver).move_to_element(reviews_section).perform()
            time.sleep(2)

            while len(reviews) < min_reviews:
                soup = BeautifulSoup(driver.page_source, 'html.parser')
                review_elements = soup.find_all('div', {'data-hook': 'review'})
                for review_element in review_elements:
                    try:
                        review_body = review_element.find('span', {'data-hook': 'review-body'}).text.strip()
                        review_date = review_element.find('span', {'data-hook': 'review-date'}).text.strip()
                        reviews.append({'body': review_body, 'date': review_date})
                        if len(reviews) >= min_reviews:
                            break
                    except Exception as e:
                        print(f"Error extracting review: {e}")
                try:
                    next_button = driver.find_element(By.XPATH, '//li[@class="a-last"]/a')
                    if next_button:
                        next_button.click()
                        time.sleep(3)
                    else:
                        break
                except Exception:
                    break
        except Exception as e:
            print(f"Error during review extraction: {e}")
        finally:
            driver.quit()

        return reviews

    reviews = get_amazon_reviews(product_url)

    df = pd.DataFrame(reviews)
    # Save the DataFrame to a CSV file
    df.to_csv("amazon_reviews.csv", index=False)

    DATA_DIR = "amazon_reviews.csv"
    df = pd.read_csv(DATA_DIR)

    def data_preprocess(df):
        date_objects = []
        for text_date in df['date']:
            try:
                # Try to extract date using regex
                if match := re.search(r'\d{1,2} \w+ \d{4}', text_date):
                    date_str = match.group(0)
                    date_obj = pd.to_datetime(date_str, format='%d %B %Y', errors='coerce')
                else:
                    # If regex fails, try to extract from a known position
                    date_str = text_date.split('on ')[-1] if 'on ' in text_date else text_date
                    date_obj = pd.to_datetime(date_str, errors='coerce')
                
                date_objects.append(date_obj)
            except Exception as e:
                print(f"Error processing date '{text_date}': {e}")
                date_objects.append(pd.NaT)
        
        df["date_obj"] = date_objects
        return df

    # Process the dates
    df = data_preprocess(df)

    sentiment_analysis = pipeline("sentiment-analysis", model="siebert/sentiment-roberta-large-english")
    model_name = "cardiffnlp/twitter-roberta-base-sentiment"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)

    def analyze_sentiment(text):
        '''function to return sentiments mapping to given text'''
        inputs = tokenizer(text, return_tensors="pt")
        
        outputs = model(**inputs)
        probs = F.softmax(outputs.logits, dim=1)
        sentiment = torch.argmax(probs, dim=-1).item()
        sentiment_map = {0: "negative", 1: "neutral", 2: "positive"}
        return sentiment_map[sentiment]

    def senti_score(dataset):
        '''adding labels column in the dataframe for the respective text'''
        sentiment_mapper = {"positive": 1, "neutral": 0, "negative": -1}
        list_of_senti = []

        for i in tqdm.tqdm(range(len(df['body']))):
            try:
                text = dataset["body"][i]
            except KeyError:
                pass
        
            if((len(text)) >= 514):
                text = text[:514]
            sentiment = analyze_sentiment(text=text)
            senti_value = sentiment_mapper[sentiment]
            list_of_senti.append(senti_value)
        
        return list_of_senti

    df["labels"] = senti_score(dataset=df)

    all_labels = [1, 0, -1]
    all_labels_list = list(df["labels"].values)

    counts_of_labels = [all_labels_list.count(1), all_labels_list.count(0), all_labels_list.count(-1)]

    data_for_plotting = {"x": all_labels, "y": counts_of_labels}

    plotting_data = pd.DataFrame(data_for_plotting)

    print(plotting_data.head())
    plotting_data_json = plotting_data.to_json()

    json_file_path = 'plotting.json'

    with open(json_file_path, 'w') as json_file:
        json_file.write(plotting_data_json)

    nltk.download('stopwords', quiet=True)
    nltk.download('punkt', quiet=True)
    stop_words = set(stopwords.words('english'))

    def preprocess(text):
        tokens = nltk.word_tokenize(text)
        tokens = [word for word in tokens if word.lower() not in stop_words]
        return ' '.join(tokens)

    tokenizer = AutoTokenizer.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')
    model = AutoModelForSequenceClassification.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')

    def get_sentiment(text):
        inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512)
        outputs = model(**inputs)
        sentiment = torch.argmax(outputs.logits).item()
        return sentiment

    def analyze_reviews(reviews):
        aspects = {'positive': [], 'negative': []}
        for review in reviews:
            preprocessed_review = preprocess(review)
            sentiment = get_sentiment(preprocessed_review)
            if sentiment >= 3:  # Assuming 3 or higher is positive sentiment
                aspects['positive'].append(preprocessed_review)
            else:
                aspects['negative'].append(preprocessed_review)
        return aspects

    def extract_keywords(reviews, top_n=10):
        vectorizer = TfidfVectorizer(max_features=top_n)
        X = vectorizer.fit_transform(reviews)
        keywords = vectorizer.get_feature_names_out()
        return keywords

    def summarize_aspects(aspects):
        summary = {}
        for sentiment, reviews in aspects.items():
            keywords = extract_keywords(reviews)
            summary[sentiment] = keywords
        return summary

    data_dir = "amazon_reviews.csv"
    datarframe = pd.read_csv(data_dir)

    text_data = datarframe['body'][:100].values

    aspects = analyze_reviews(text_data)

    # Summarize aspects to get the main problems and positive points
    summary = summarize_aspects(aspects)

    summary["negative"] = [i for i in summary["negative"] if i not in summary["positive"]]

    print(summary)
    
    # Return the summary and dataframe for further use
    return {
        "dataframe": df,
        "sentiment_summary": summary,
        "sentiment_counts": plotting_data
    }

# If the script is run directly (not imported), execute the analyzer
if __name__ == "__main__":
    # Check if a URL was provided as a command-line argument
    if len(sys.argv) > 1:
        product_url = sys.argv[1]
        amazon_review_analyzer(product_url)
    else:
        # No URL provided, the function will prompt for one
        amazon_review_analyzer()