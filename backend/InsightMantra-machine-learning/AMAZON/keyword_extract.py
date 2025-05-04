# NLP lib
import nltk
from nltk.corpus import stopwords
from transformers import BertTokenizer
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from sklearn.feature_extraction.text import TfidfVectorizer

# functional lib
import pandas as pd

# download
nltk.download('stopwords')
nltk.download('punkt')
stop_words = set(stopwords.words('english'))

def preprocess(text):
    ''' reutrns tokenize text '''
    tokens = nltk.word_tokenize(text)
    tokens = [word for word in tokens if word.lower() not in stop_words]
    return ' '.join(tokens)

# bert-base model tokenizer
tokenizer = AutoTokenizer.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')
# bert-base 
model = AutoModelForSequenceClassification.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')

def get_sentiment(text):
    '''returns sentiment scores of input text'''
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512)
    outputs = model(**inputs)
    sentiment = torch.argmax(outputs.logits).item()
    return sentiment

def analyze_reviews(reviews):
    ''' returns positive and negative aspect of the chunk of text in form of dictionaries of list'''
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
    ''' converts words into vectors and return the keywords'''
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

# data place for your csv files
data_dir = "/home/aman/code/ML/demand_prd/REFACTORED /DATA/amazon_reviews.csv"
datarframe = pd.read_csv(data_dir)

# limiting the value for faster processing
text_data = datarframe['body'][:100].values

aspects = analyze_reviews(text_data)

# Summarize aspects to get the main problems and positive points
summary = summarize_aspects(aspects)

# only storing values in negative which are actually negative and not both
summary["negative"]  = [i for i in summary["negative"] if i not in summary["positive"]]

