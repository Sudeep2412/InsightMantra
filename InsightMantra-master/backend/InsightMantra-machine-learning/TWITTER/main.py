
# machin learning libraries 
import torch
from transformers import AutoModelForSequenceClassification , AutoTokenizer
import torch.nn.functional as F

# functional libraries 
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

#importing data
DATA_DIR  = "/home/aman/code/ML/demand_prd/REFACTORED /DATA/apple_edited.csv"

#getting dataframe 
dataframe  = pd.read_csv(DATA_DIR)
dataframe = dataframe[:100]
#model
model_name = "cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(model_name)
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

    for i in range(len(dataframe['tweets'])):
        text = dataset["tweets"][i]
        sentiment = analyze_sentiment(text=text)
        senti_value = sentiment_mapper[sentiment]
        list_of_senti.append(senti_value)
    
    return list_of_senti

dataframe["labels"] = senti_score(dataset=dataframe)



all_labels = dataframe["labels"].unique()
all_labels_list = list(dataframe["labels"].values)

counts_of_labels = [all_labels_list.count(1) , all_labels_list.count(0) , all_labels_list.count(-1)]

data_for_plotting = {"x" : all_labels , "y" : counts_of_labels}
plotting_data = pd.DataFrame(data_for_plotting)

plotting_json_data = plotting_data.to_json()

print(plotting_data)

