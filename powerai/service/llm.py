import os
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from .llm_config import LLM_CONFIG, AVAILABLE_MODELS


class LLMService:
    def __init__(self, model_name: str = None, temperature: float = None):
        """Initialize the LLM service with a specific model."""
        # If no model is specified, use the global configuration
        if model_name is None:
            model_info = AVAILABLE_MODELS[LLM_CONFIG["model"]]
            model_name = model_info["modelName"]
            provider = model_info["provider"]
        else:
            # If a specific model is requested, determine the provider
            provider = "Anthropic" if "claude" in model_name.lower() else "Google"

        # If no temperature is specified, use the global configuration
        if temperature is None:
            temperature = LLM_CONFIG["temperature"]

        # Initialize the appropriate LLM based on the provider
        if provider == "Anthropic":
            self.llm = ChatAnthropic(
                model_name=model_name,
                api_key=os.getenv("ANTHROPIC_API_KEY"),
                temperature=temperature,
                timeout=100
            )
        elif provider == "Google":
            self.llm = ChatGoogleGenerativeAI(
                model=model_name,
                google_api_key=os.getenv("GOOGLE_API_KEY"),
                temperature=temperature,
                timeout=100
            )
        elif provider == "OpenAI":
            self.llm = ChatOpenAI(
                model_name=model_name,
                openai_api_key=os.getenv("OPENAI_API_KEY"),
                temperature=temperature,
                timeout=100
            )
        else:
            raise ValueError(f"Unsupported provider: {provider}")
