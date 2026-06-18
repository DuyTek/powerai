LLM_CONFIG = {
    "model": "claude",
    "temperature": 0.0
}

AVAILABLE_MODELS = {
    "claude": {
        "id": "claude",
        "name": "Claude 3.5 Sonnet",
        "provider": "Anthropic",
        "isAvailable": True,
        "requiresApiKey": True,
        "modelName": "claude-3-5-sonnet-latest"
    },
    "gemini": {
        "id": "gemini",
        "name": "Gemini 2.0 Flash",
        "provider": "Google",
        "isAvailable": True,
        "requiresApiKey": True,
        "modelName": "gemini-2.0-flash"
    },
    # TODO: Ask for API key FROM anh Son Dao.
    "gpt-4": {
        "id": "gpt-4",
        "name": "GPT-4o",
        "provider": "OpenAI",
        "isAvailable": True,
        "requiresApiKey": True,
        "modelName": "gpt-4o"
    },
}
