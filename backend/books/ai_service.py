import os
import requests

def get_ai_config():
    """Resolve the AI API endpoint, authorization headers, and model name."""
    groq_api_key = os.getenv("GROQ_API_KEY", "")
    openai_api_key = os.getenv("OPENAI_API_KEY", "")
    generic_api_key = os.getenv("AI_API_KEY", "")

    api_key = groq_api_key or openai_api_key or generic_api_key
    url = os.getenv("AI_API_URL", "")
    model = os.getenv("AI_MODEL", "")

    if not url:
        if groq_api_key or (api_key and api_key.startswith("gsk_")):
            url = "https://api.groq.com/openai/v1/chat/completions"
            if not model:
                model = "llama-3.1-8b-instant"
        elif openai_api_key or (api_key and api_key.startswith("sk-")):
            url = "https://api.openai.com/v1/chat/completions"
            if not model:
                model = "gpt-4o-mini"
        else:
            # Default to local LM Studio endpoint
            url = os.getenv("LM_STUDIO_URL", "http://127.0.0.1:1234/v1/chat/completions")
            if not model:
                model = "tinyllama-1.1b-chat-v0.6"

    if not model:
        model = "llama-3.1-8b-instant" if "groq" in url else "tinyllama-1.1b-chat-v0.6"

    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    return url, headers, model


def ask_lm_studio(prompt):
    """
    Send a prompt to the configured AI API (Groq, OpenAI, OpenRouter, or LM Studio)
    and return the assistant text.
    """
    url, headers, model = get_ai_config()

    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=45)
        if response.status_code == 401:
            return "AI Error: Unauthorized. Please check your GROQ_API_KEY or OPENAI_API_KEY."
        response.raise_for_status()
        data = response.json()

        # Handle choices format
        if "choices" in data and len(data["choices"]) > 0:
            choice = data["choices"][0]
            if "message" in choice and choice["message"].get("content"):
                return choice["message"]["content"].strip()
            elif "text" in choice and choice.get("text"):
                return choice["text"].strip()
        return "Could not generate response from AI model."
    except requests.exceptions.ConnectionError:
        if "127.0.0.1" in url or "localhost" in url:
            return "AI service unavailable: LM Studio is not running locally. Set GROQ_API_KEY in environment variables for cloud AI."
        return "AI service unavailable: Could not connect to AI provider."
    except requests.exceptions.Timeout:
        return "AI request timed out. Please try again."
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