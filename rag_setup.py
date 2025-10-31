from langchain_chroma import Chroma
from langchain.agents import create_agent
from langchain.tools import tool
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_community.document_loaders import JSONLoader
from langchain_core.documents import Document
from data_parser import extract_player_data
import os
import shutil

DATA_DIR = "data_summary"
VECTOR_DB_PATH = "vector_db"
model = ChatOllama(model="gpt-oss:120b-cloud", temperature=0.3)

def make_documents(raw_data, player_name):
    s = extract_player_data(raw_data, player_name)

    text_content = (
        f"Match on {s['map']} as {s['agent']} ({s['tier']})\n"
        f"K/D/A: {s['kills']}/{s['deaths']}/{s['assists']}, "
        f"Headshot%: {s['headshot_percent']}%\n"
        f"First bloods won: {s['first_bloods_won']}"
        f"First Deaths: {s['first_deaths']}"
        f"Multi-kills: {s['multi_kills']}"
        f"Clutch wins: {s['clutch_wins']}"
        f"Clutch 1vx total: {s['clutch_1vx_total']}"
    )

    # Each round as a mini-document
    # for i, r in enumerate(rounds_summary):
    #     round_text = f"Round {i+1}: Result: {r['round_result']}, Locations: {r['locations']}"
    #     docs.append(Document(page_content=round_text, metadata={"type": "round", "round_num": i+1}))

    doc = Document(
        page_content=text_content,
        metadata={
            "match_id": s["match_id"],
            "map": s["map"],
            "agent": s["agent"],
            "tier": s["tier"],
            "kills": s["kills"],
            "deaths": s["deaths"],
            "assists": s["assists"],
            "headshot_percent": s["headshot_percent"]
        }
    )

    docs = []
    docs.append(doc)

    return docs


def preprocess_json_data(raw_data, player_name):
    docs = make_documents(raw_data, player_name)
    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    shutil.rmtree("./chroma_db", ignore_errors=True)
    vectorstore = Chroma.from_documents(docs, embeddings, persist_directory="./chroma_db")

    return vectorstore

# Construct a tool for retrieving context
def build_retrieve_context_tool(vectorstore):
    @tool(response_format="content_and_artifact", description="Retrieve relevant Valorant match data for a given query from the vectorstore.")
    def retrieve_context(query: str):
        retrieved_docs = vectorstore.similarity_search(query, k=2)
        serialized = "\n\n".join(
            f"Source: {doc.metadata}\nContent: {doc.page_content}" 
            for doc in retrieved_docs
        )
        return serialized, retrieved_docs
    return retrieve_context

def create_conversational_chain(vectorstore):
    retrieve_context = build_retrieve_context_tool(vectorstore)
    tools = [retrieve_context]

    prompt = (
        "You are a Valorant coach. You have access to a tool that retrieves match data for a player. "
        "Use the tool to provide actionable feedback on the player's performance."
    )

    agent = create_agent(model, tools, system_prompt=prompt)
    return agent

def query_chatbot(agent, query):
    for step in agent.stream(
        {"messages": [{"role": "user", "content": query}]},
        stream_mode="values",
    ):
        step["messages"][-1].pretty_print()