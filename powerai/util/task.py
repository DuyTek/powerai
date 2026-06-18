from dataclasses import dataclass
from typing import List, Optional


@dataclass
class TestStep:
    """Represents a test step with a name and action."""

    stepId: int
    stepDescription: str
    testData: str
    isSensitive: bool

    def __init__(self, stepId: int, stepDescription: str, testData: str, isSensitive: bool):
        self.stepId = stepId
        self.stepDescription = stepDescription
        self.testData = testData
        self.isSensitive = isSensitive

    def to_dict(self):
        """Convert the TestStep instance to a dictionary."""
        return {
            "stepId": self.stepId,
            "stepDescription": self.stepDescription,
            "testData": self.testData,
            "isSensitive": self.isSensitive
        }

    @classmethod
    def from_dict(cls, data):
        """Create a TestStep instance from a dictionary."""
        return cls(
            stepId=data.get("stepId"),
            stepDescription=data.get("description"),
            testData=data.get("testData"),
            isSensitive=data.get("isSensitive")
        )

    def to_string(self):
        """Return a string representation of the TestStep."""
        if self.testData is None:
            return f"Step {self.stepId}: {self.stepDescription}"

        return f"Step {self.stepId}: {self.stepDescription} with test data {self.testData}"


@dataclass
class Task:
    """Represents a task with a name, description, and test steps."""
    testName: str
    description: Optional[str]
    expectedResult: str
    precondition: Optional[str]
    testSteps: Optional[List[TestStep]]

    def __init__(self, testName: str, expectedResult: str, description: Optional[str],
                 precondition: Optional[str], testSteps: Optional[List[TestStep]]):
        self.testName = testName
        self.description = description
        self.expectedResult = expectedResult
        self.precondition = precondition
        self.testSteps = testSteps

    def to_dict(self):
        """Convert the Task instance to a dictionary."""
        return {
            "testName": self.testName,
            "description": self.description,
            "testSteps": [step.to_dict() for step in self.testSteps]
        }

    @classmethod
    def from_dict(cls, data):
        """Create a Task instance from a dictionary."""
        test_steps = [TestStep.from_dict(step)
                      for step in data.get("testSteps", [])]
        return cls(
            testName=data.get("testName"),
            description=data.get("description"),
            expectedResult=data.get("expectedResult"),
            precondition=data.get("precondition"),
            testSteps=test_steps
        )

    def to_string(self):
        """Return a string representation of the Task."""
        # TODO: Test assertion seriously relies on Expected Result.
        # Need to be more flexible and dynamic.
        return (
            f"Test Name: {self.testName}\n"
            f"Expected Result: {self.expectedResult}\n"
            f"Description: {self.description}\n"
            f"Precondition: {self.precondition}\n"
            f"Steps:\n" + "\n".join(step.to_string()
                                    for step in self.testSteps)
        )
