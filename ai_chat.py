from gpt4all import GPT4All

model = GPT4All("Meta-Llama-3-8B-Instruct.Q4_0.gguf")

def generate_feedback(player_summary, player_combat_summary):
    prompt = f"""
    You are a professional Valorant coach.
    Here is the player summary: {player_summary}.
    Here is the player combat summary: {player_combat_summary}.
    Provide actionable feedback on strengths, weaknesses, aim, positioning, and ability usage.
    """
    response = model.generate(prompt, max_tokens=500)
    return response
