import requests
import json
import os


RIOT_API_KEY = os.getenv("RIOT_API_KEY")

response = requests.get("https://api.henrikdev.xyz/valorant/v4/by-puuid/matches/ap/pc/1054288b-0d96-5fc9-bb12-cc09aee3b5d4?mode=competitive&size=1",
    headers={"Authorization":RIOT_API_KEY,"Accept":"*/*"},)
data = response.json()

with open("match_data.json", "w", encoding="utf-8") as file:
    json.dump(data, file, indent=2)

print("Saved formatted data to match_data.txt")