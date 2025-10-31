from rag_setup import query_chatbot, preprocess_json_data, create_conversational_chain
from match_fetcher import fetch_match_data

region = "ap"
player_name = "Swift728"
tag = "OC"


raw_data = fetch_match_data(region, player_name, tag)

vectorstore = preprocess_json_data(raw_data, player_name)

agent = create_conversational_chain(vectorstore)

match_id = raw_data["data"][0]["metadata"]["match_id"]

query_chatbot(agent, f"Review match {match_id} for {player_name} and provide improvement tips")