import json

def parse_player_data(raw_data, player_name):
    match = raw_data["data"][0]
    player_data = next(p for p in match["players"] if p["name"] == player_name)

    stats = player_data["stats"]
    abilities = player_data["ability_casts"]
    tier = player_data["tier"]
    agent = player_data["agent"]
    economy = player_data["economy"]

    total_shots = stats["headshots"] + stats["bodyshots"] + stats["legshots"]
    headshot_percent = round(stats["headshots"] / max(1, total_shots) * 100, 1)

    summary = {
        "player": player_data["name"],
        "agent": agent["name"],
        "tier": tier["name"],
        "kills": stats["kills"],
        "deaths": stats["deaths"],
        "assists": stats["assists"],
        "headshot_percent": headshot_percent,
        "ability_usage": abilities,
        "credits_spent_total": economy["spent"]["overall"],
        "credits_spent_avg": round(economy["spent"]["average"], 1)
    }

    return summary

def extract_player_rounds(raw_data, player_name):
    rounds = raw_data["data"][0]["rounds"]
    player_rounds = []

    for r in rounds:
        stats = None
        location = None

        # Find player stats
        for p in r["stats"]:
            if p["player"]["name"] == player_name:
                stats = p
                break

        # Find player location at defuse or plant
        all_locations = []
        for phase in ["plant", "defuse"]:
            if r.get(phase) and r[phase].get("player_locations"):
                for loc in r[phase]["player_locations"]:
                    if loc["player"]["name"] == player_name:
                        all_locations.append(loc)

        if stats:
            player_rounds.append({
                "round_result": r["winning_team"],
                "player_stats": stats,
                "locations": all_locations,
                "plant_site": r["plant"]["site"] if r.get("plant") else None
            })

    return player_rounds

def extract_player_kills(match_data, player_name):
    kills = []
    for match in match_data["data"]:
        for kill in match.get("kills", []):
            if kill["killer"]["name"] == player_name:
                kills.append({
                    "round": kill["round"],
                    "victim": kill["victim"]["name"],
                    "weapon": kill["weapon"]["name"],
                    "location": kill["location"],
                    "time": kill["time_in_round_in_ms"]
                })

    return kills

def extract_player_deaths(match_data, player_name):
    deaths = []
    for match in match_data["data"]:
        for kill in match.get("kills", []):
            if kill["victim"]["name"] == player_name:
                deaths.append({
                    "round": kill["round"],
                    "killer": kill["killer"]["name"],
                    "weapon": kill["weapon"]["name"],
                    "location": kill["location"],
                    "time": kill["time_in_round_in_ms"]
                })

    return deaths