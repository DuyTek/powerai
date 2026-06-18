from typing import List, Dict, Any, Optional
import os
from datetime import datetime
from util.task import Task, TestStep
from util.action_util import Element
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from service.llm import LLMService


class SeleniumCodeGenerator:
    """Service for generating Selenium test scripts based on interacted elements and test steps."""

    def __init__(self):
        self.prompt_template = PromptTemplate(
            input_variables=["test_scenario", "elements", "steps"],
            template="""
You are a talented Quality Engineer. Your job is to create and generate Python Selenium test scripts.
When given a TEST SCENARIO, you should think about covering the critical cases and neccessary edge cases to pursuit high coverage.
Create a complete Python Selenium test script that implements the following test scenario using the provided elements and steps.

TEST SCENARIO:
{test_scenario}

INTERACTED ELEMENTS:
{elements}

TEST STEPS:
{steps}

The test script should:
1. Follow the Behavior-Driven Development (Gherkin) format with Given/When/Then comments
2. Use the pytest framework
3. Use relativeXPath for element selection whenever possible. The other selectors are prioritized in this order: ID, CSS Selector, Full XPath
4. Include proper error handling and assertions
5. Be well-structured with clear comments and docstrings
6. Include proper imports, setup, and teardown methods
7. Be directly executable

IMPORTANT: Return ONLY the complete Python code without any markdown formatting, explanation, or additional text. Do NOT include ```python or ``` around the code.
"""
        )

    def generate_code(self,
                      test_scenario: Dict[str, Any],
                      interacted_elements: List[Element]) -> str:
        llm_service = LLMService()

        """
        Generate a Selenium test script based on the test scenario and interacted elements.

        Args:
            test_scenario: Dictionary containing test scenario details
            interacted_elements: List of Element objects representing interacted elements

        Returns:
            str: Generated Selenium test script code
        """
        # Format the elements for the prompt
        elements_text = ""
        for i, element in enumerate(interacted_elements):
            elements_text += f"Element {i+1}:\n"
            elements_text += f"  Tag: {element.tag}\n"
            elements_text += f"  ID: {element.id}\n"
            elements_text += f"  Type: {element.type}\n"
            elements_text += f"  RelativeXPath: {element.relativeXpath}\n"
            elements_text += f"  Full XPath: {element.xpath}\n"
            elements_text += f"  CSS Selector: {element.cssSelector}\n\n"

        # Format the steps for the prompt
        steps_text = ""
        for i, step in enumerate(test_scenario.get("testSteps", [])):
            steps_text += f"Step {i+1}: {step.get('description')}"
            if step.get("testData"):
                steps_text += f" with data: {step.get('testData')}"
            steps_text += "\n"

        # Format the test scenario information
        scenario_text = f"""
            Website URL: {test_scenario.get('websiteUrl')}
            Test Name: {test_scenario.get('testName')}
            Description: {test_scenario.get('description')}
            Precondition: {test_scenario.get('precondition')}
            Expected Result: {test_scenario.get('expectedResult')}
        """

        # Generate the code using the LLM
        chain = LLMChain(llm=llm_service.llm, prompt=self.prompt_template)
        response = chain.run(
            test_scenario=scenario_text,
            elements=elements_text,
            steps=steps_text
        )

        return response.strip()

    def save_to_file(self, code: str, test_name: str) -> str:
        """
        Save the generated code to a file.

        Args:
            code: The generated Selenium code
            test_name: The name of the test scenario

        Returns:
            str: Path to the saved file
        """
        # Create a sanitized filename from the test name
        sanitized_name = test_name.lower().replace(" ", "_").replace("-", "_")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"test_{sanitized_name}_{timestamp}.py"

        # Ensure the tests directory exists
        os.makedirs("tests", exist_ok=True)

        # Save the file
        file_path = os.path.join("tests", filename)
        with open(file_path, "w") as f:
            f.write(code)

        return file_path
