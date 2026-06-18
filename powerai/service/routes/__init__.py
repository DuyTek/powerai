from .test_scenario import test_scenario_bp
from .llm_api import llm_config_bp

SCENARIO = '/api/scenario'
LLM_CONFIG = '/api/llm'


def register_routes(app):
    app.register_blueprint(test_scenario_bp, url_prefix=SCENARIO)
    app.register_blueprint(llm_config_bp, url_prefix=LLM_CONFIG)
