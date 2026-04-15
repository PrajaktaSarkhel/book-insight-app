import requests

LM_STUDIO_URL = "http://127.0.0.1:1234/api/v1/chat/completions"

def ask_lm_studio(prompt):
    """Send a prompt to LM Studio and get a response"""
    payload = {
        "model": "tinyllama-1.1b-chat-v0.6:4",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }
    try:
        response = requests.post(LM_STUDIO_URL, json=payload, timeout=60)
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        return f"AI Error: {str(e)}"


def generate_summary(description):
    """Generate a short summary of the book"""
    if not description:
        return "No description available."
    prompt = f"""Given this book description, write a short 2-3 sentence summary:

Description: {description}

Summary:"""
    return ask_lm_studio(prompt)


def generate_sentiment(description):
    """Analyze the tone/sentiment of the book description"""
    if not description:
        return "Unknown"
    prompt = f"""Analyze the sentiment/tone of this book description in ONE word only (choose from: Positive, Negative, Neutral, Dark, Uplifting, Mysterious, Romantic, Thrilling):

Description: {description}

Tone:"""
    return ask_lm_studio(prompt)