from util.action_util import Element, map_actions_to_elements
from util.timer import Timer
from typing import List
from service.browser_llm import BrowserLLMService
from service.code_gen import SeleniumCodeGenerator
from ..error_handler import NotFoundError, BadRequestError
from flask import Blueprint, jsonify, request
from util.task import TestStep, Task
import time

test_scenario_bp = Blueprint('test_scenarios', __name__)


@test_scenario_bp.route('/create', methods=['POST'])
async def create_test_scenario():
    """Create a new test scenario"""
    with Timer(name="test_scenario_creation"):
        data = request.get_json()

        required_fields = ['websiteUrl', 'testName', 'expectedResult']
        if not data or not all(field in data for field in required_fields):
            raise BadRequestError(
                f"Missing required fields: {', '.join(required_fields)}")

        new_scenario = {
            "websiteUrl": data["websiteUrl"],
            "testName": data["testName"],
            "expectedResult": data["expectedResult"],
            "description": data.get("description", ""),
            "precondition": data.get("precondition", ""),
            "captureScreenshots": data.get("captureScreenshots", False),
            "sensitiveData": data.get("sensitiveData", None),
            "testSteps": data.get("testSteps", [])
        }

        browserTask = Task.from_dict({
            "testName": new_scenario["testName"],
            "description": new_scenario["description"],
            "expectedResult": new_scenario["expectedResult"],
            "precondition": new_scenario["precondition"],
            "testSteps": new_scenario["testSteps"]
        })

        browserLLMService = BrowserLLMService(website_url=new_scenario["websiteUrl"],
                                              task=browserTask.to_string(),
                                              sensitive_data=new_scenario["sensitiveData"],
                                              initial_actions=data.get("initialActions", None))

        agent = browserLLMService.get_agent()
        print(f"""INFO      [config] Running agent: {agent.model_name}""")

        history = await agent.run()

        # Map the interacted elements
        interacted_elements = map_actions_to_elements(history.model_actions())
        if not interacted_elements:
            raise NotFoundError("No interacted elements found in the history.")

        await browserLLMService.close_browser()

        return jsonify({
            "message": "Test scenario created successfully",
            "data": {
                "scenario": new_scenario,
                "interactedElements": interacted_elements,
            }
        }), 201


@test_scenario_bp.route('/generate-code', methods=['POST'])
def generate_code():
    """Generate Selenium code for an existing scenario with interacted elements"""
    data = request.get_json()

    required_fields = ['scenario', 'interactedElements']
    if not data or not all(field in data for field in required_fields):
        raise BadRequestError(
            f"Missing required fields: {', '.join(required_fields)}")

    scenario = data["scenario"]
    # Convert the interacted elements to Element objects
    interacted_elements = []
    for elem_data in data["interactedElements"]:
        element = Element(
            tag=elem_data.get("tag", ""),
            id=elem_data.get("id"),
            xpath=elem_data.get("xpath", ""),
            relativeXpath=elem_data.get("relativeXpath", ""),
            elementClass=elem_data.get("elementClass"),
            type=elem_data.get("type"),
            tabIndex=elem_data.get("tabIndex"),
            cssSelector=elem_data.get("cssSelector")
        )
        interacted_elements.append(element)

    # Generate the Selenium code
    code_generator = SeleniumCodeGenerator()
    selenium_code = code_generator.generate_code(scenario, interacted_elements)

    # Save the code to a file if requested
    file_path = None
    if data.get("saveToFile", True):
        file_path = code_generator.save_to_file(
            selenium_code, scenario["testName"])

    return jsonify({
        "message": "Selenium code generated successfully",
        "data": {
            "seleniumCode": selenium_code,
            "seleniumFilePath": file_path
        }
    }), 200
