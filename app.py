from match_fetcher import fetch_match_data
from data_parser import extract_player_data, extract_player_rounds, extract_player_combat_summary
from ai_chat import generate_feedback
import os
import json

region = "ap"
player_name = "Swift728"
tag = "OC"

player_file = "data_summary/player_summary.json"
rounds_file = "data_summary/round_summary.json"
player_combat_file = "data_summary/player_combat_summary.json"

raw_data = fetch_match_data(region, player_name, tag)

def load_or_extract(file_path, extract_func, *args):
    if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        print(f"✅ Loaded cached data from {file_path}")
    else:
        data = extract_func(*args)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print(f"💾 Extracted and saved data to {file_path}")
    return data


if not raw_data:
    print("Could not fetch match data")
else:

    player = load_or_extract(player_file, extract_player_data, raw_data, player_name)
    #rounds = load_or_extract(rounds_file, extract_player_rounds, raw_data, player_name)
    player_combat = load_or_extract(player_combat_file, extract_player_combat_summary, raw_data, player_name)
        
    feedback = generate_feedback(player, player_combat)
    print("AI Feedback:\n", feedback)

