import json
from collections import defaultdict

def extract_player_data(raw_data, player_name):
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

# def extract_player_kills(match_data, player_name):
#     kills = []
#     for match in match_data["data"]:
#         for kill in match.get("kills", []):
#             if kill["killer"]["name"] == player_name:
#                 kills.append({
#                     "round": kill["round"],
#                     "victim": kill["victim"]["name"],
#                     "weapon": kill["weapon"]["name"],
#                     "location": kill["location"],
#                     "time": kill["time_in_round_in_ms"]
#                 })

#     return kills

# def extract_player_deaths(match_data, player_name):
#     deaths = []
#     for match in match_data["data"]:
#         for kill in match.get("kills", []):
#             if kill["victim"]["name"] == player_name:
#                 deaths.append({
#                     "round": kill["round"],
#                     "killer": kill["killer"]["name"],
#                     "weapon": kill["weapon"]["name"],
#                     "location": kill["location"],
#                     "time": kill["time_in_round_in_ms"]
#                 })

#     return deaths

def extract_player_combat_summary(raw_data, player_name):
    kills = []
    deaths = []
    first_bloods_won = 0
    first_deaths = 0
    multi_kills_count = defaultdict(int)  # double/triple/quad/ace
    clutch_wins = 0
    clutch_1vx_total = 0

    for match in raw_data["data"]:
        # track kills per round
        kills_by_round = defaultdict(list)
        for kill in match.get("kills", []):
            kills_by_round[kill["round"]].append(kill)

        for round_num, round_kills in kills_by_round.items():
            # Sort kills by time in round
            sorted_kills = sorted(round_kills, key=lambda k: k["time_in_round_in_ms"])

            # First blood / first death
            first_kill = sorted_kills[0]
            if first_kill["killer"]["name"] == player_name:
                first_bloods_won += 1
            if first_kill["victim"]["name"] == player_name:
                first_deaths += 1

            # Multi-kills for the player in this round
            player_kills_in_round = [k for k in sorted_kills if k["killer"]["name"] == player_name]
            if len(player_kills_in_round) >= 2:
                multi_kills_count[len(player_kills_in_round)] += 1

            # Track all kills/deaths
            for k in sorted_kills:
                if k["killer"]["name"] == player_name:
                    kills.append(k)
                if k["victim"]["name"] == player_name:
                    deaths.append(k)

        # Clutch detection
        rounds = match.get("rounds", [])
        for r in rounds:
            player_team = None
            remaining_players = {"Red": set(), "Blue": set()}

            # Initialize which players were alive at round start
            for p in r.get("stats", []):
                team = p["player"]["team"]
                name = p["player"]["name"]
                remaining_players[team].add(name)
                if name == player_name:
                    player_team = team
            if not player_team:
                continue

            # Simulate kills chronologically
            for kill in sorted(r.get("kills", []), key=lambda k: k["time_in_round_in_ms"]):
                remaining_players[kill["victim"]["team"]].discard(kill["victim"]["name"])

            player_alive = player_name in remaining_players[player_team]
            teammates_alive = len(remaining_players[player_team]) - (1 if player_alive else 0)
            enemies_alive = len(remaining_players["Red" if player_team == "Blue" else "Blue"])

            # ✅ True clutch condition: player is last alive vs X enemies
            if player_alive and teammates_alive == 0 and enemies_alive >= 1:
                clutch_1vx_total += 1
                if r["winning_team"] == player_team:
                    clutch_wins += 1

    summary = {
        "total_kills": len(kills),
        "total_deaths": len(deaths),
        "first_bloods_won": first_bloods_won,
        "first_deaths": first_deaths,
        "multi_kills": dict(multi_kills_count),  # keys: 2,3,4,5 for double/triple/quad/ace
        "clutch_1vx_total": clutch_1vx_total,
        "clutch_wins": clutch_wins
    }

    return summary