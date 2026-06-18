# PowerAI/service/routes/llm_config.py
from flask import Blueprint, jsonify, request
from ..error_handler import BadRequestError
from ..llm_config import LLM_CONFIG, AVAILABLE_MODELS

llm_config_bp = Blueprint('llm_config', __name__)


@llm_config_bp.route('/models', methods=['GET'])
def get_llm_models():
    """Get available LLM models and the currently selected one"""
    return jsonify({
        "models": list(AVAILABLE_MODELS.values()),
        "selectedModel": LLM_CONFIG["model"]
    }), 200


@llm_config_bp.route('/select', methods=['POST'])
def set_llm_model():
    """Set the LLM model and optionally the temperature"""
    data = request.get_json()

    if not data:
        raise BadRequestError("Request body is required")

    model_id = data.get("modelId")
    temperature = data.get("temperature", LLM_CONFIG["temperature"])

    # Validate model exists
    if model_id not in AVAILABLE_MODELS:
        raise BadRequestError(
            f"Invalid model. Available models: {', '.join(AVAILABLE_MODELS.keys())}")

    # Validate temperature
    if not isinstance(temperature, (int, float)) or temperature < 0 or temperature > 1:
        raise BadRequestError("Temperature must be a number between 0 and 1")

    # Update global configuration
    LLM_CONFIG["model"] = model_id
    LLM_CONFIG["temperature"] = temperature

    return jsonify({
        "success": True,
        "message": f"Model set to {AVAILABLE_MODELS[model_id]['name']} with temperature {temperature}"
    }), 200


@llm_config_bp.route('/current', methods=['GET'])
def get_current_config():
    """Get the current LLM configuration"""
    current_model = AVAILABLE_MODELS[LLM_CONFIG["model"]]
    return jsonify({
        "model": current_model,
        "temperature": LLM_CONFIG["temperature"]
    }), 200
