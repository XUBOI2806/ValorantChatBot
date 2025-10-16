import requests
import json
import os

RIOT_API_KEY = os.getenv("RIOT_API_KEY")

def fetch_match_data(region, name, tag):
    url = f"https://api.henrikdev.xyz/valorant/v4/matches/{region}/pc/{name}/{tag}?mode=competitive&size=1"
    res = requests.get(url, headers={"Authorization":"HDEV-e9f973eb-6425-497d-9693-3451e23e238d","Accept":"*/*"},)
    data = res.json()
    with open("match_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    return data

#fetch_match_data("ap","Swift728","OC")