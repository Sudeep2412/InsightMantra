# deep learning
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch.nn.functional as F

#functional
import pandas as pd
import tqdm
import numpy as np
import matplotlib.pyplot as plt
from transformers import pipeline
import re
import json

# your source of data in form of CSV
DATA_DIR = "/home/aman/code/ML/demand_prd/REFACTORED /DATA/amazon_reviews.csv"
df = pd.read_csv(DATA_DIR)


def data_preprocess(df):
    '''
    preprocess the date column and make it into pandas.datetime format 
    '''
    for text_date in df['date']:
        # Check if there's a match before attempting to access the group
        if match := re.search(r'\d{2} \w+ \d{4}', text_date):
            date_str = match.group(0)
            date_obj = pd.to_datetime(date_str, format='%d %B %Y')
            
            # print(date_obj)  # Do something with the date object
        else:
            date_str = text_date[21:]
            date_obj = pd.to_datetime(date_str, format="%d %B %Y")
            # print(f"{date_obj}")  # Handle missing dates

        df["date_obj"] = date_obj
        df.drop('date' , axis=1)

# preprocessing the dataframe
data_preprocess(df)

# applying sentimentt analysis
sentiment_analysis = pipeline("sentiment-analysis",model="siebert/sentiment-roberta-large-english")
model_name = "cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(model_name)
# model => roberta-base
model = AutoModelForSequenceClassification.from_pretrained(model_name)

def analyze_sentiment(text):
    '''function to return sentiments mapping to given text'''
    inputs = tokenizer(text , return_tensors="pt")
    
    outputs = model(**inputs)
    probs = F.softmax(outputs.logits , dim=1)
    sentiment = torch.argmax(probs , dim=-1).item()
    sentiment_map = {0 : "negative" , 1 : "neutral" , 2  :"positive"}
    return sentiment_map[sentiment]

def senti_score(dataset):
    '''adding labels column in the dataframe for the respective text'''
    sentiment_mapper = {"positive" : 1 , "neutral" : 0 , "negative" : -1}
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

# additional column storing all the sentiment scores correspoinding to the body
df["labels"] = senti_score(dataset=df)

# list of all the score
all_labels = [1,0,-1]
all_labels_list = list(df["labels"].values)
# qty of scores in each list
counts_of_labels = [all_labels_list.count(1) , all_labels_list.count(0) , all_labels_list.count(-1)]

# making final dataframe for plotting all the derived data into graphs
data_for_plotting = {"x" : all_labels , "y" : counts_of_labels}


plotting_data = pd.DataFrame(data_for_plotting)
plotting_data_json = plotting_data.to_json()

# converting into json for export
with open('plotting_data.json', 'w') as f:
    json.dump(plotting_data_json, f)




