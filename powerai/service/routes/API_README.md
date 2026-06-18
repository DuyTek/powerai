# PowerAI API Documentation

PowerAI provides APIs for automated test scenario creation and LLM configuration. The system uses AI-powered browser automation to interact with web applications and generate executable Selenium test scripts.

## Table of Contents
1. [LLM Configuration API](#llm-configuration-api)
2. [Test Scenario API](#test-scenario-api)
3. [Common Error Responses](#common-error-responses)
4. [Environment Setup](#environment-setup)

---

## LLM Configuration API

The LLM Configuration API allows you to dynamically switch between different language models (Claude and Gemini) and configure their parameters.

### Base URL
```
/api/llm
```

### Endpoints

#### GET `/api/llm/models`
Get all available LLM models and the currently selected model.

**Response:**
```json
{
  "models": [
    {
      "id": "claude",
      "name": "Claude 3.5 Sonnet",
      "provider": "Anthropic",
      "isAvailable": true,
      "requiresApiKey": true,
      "modelName": "claude-3-5-sonnet-latest"
    },
    {
      "id": "gemini",
      "name": "Gemini Pro",
      "provider": "Google",
      "isAvailable": true,
      "requiresApiKey": true,
      "modelName": "gemini-pro"
    }
  ],
  "selectedModel": "claude"
}
```

#### POST `/api/llm/select`
Set the LLM model and optionally the temperature.

**Request Body:**
```json
{
  "modelId": "gemini",
  "temperature": 0.7
}
```

**Response:**
```json
{
  "success": true,
  "message": "Model set to Gemini Pro with temperature 0.7"
}
```

#### GET `/api/llm/current`
Get the current LLM configuration.

**Response:**
```json
{
  "model": {
    "id": "claude",
    "name": "Claude 3.5 Sonnet",
    "provider": "Anthropic",
    "isAvailable": true,
    "requiresApiKey": true,
    "modelName": "claude-3-5-sonnet-latest"
  },
  "temperature": 0.0
}
```

---

## Test Scenario API

The Test Scenario API allows you to create automated test scenarios and generate Selenium test scripts for web applications.

### Base URL
```
/api/scenario
```

### Endpoints

#### POST `/api/scenario/create`
Creates a new test scenario and executes it using an AI-powered browser agent to capture interacted elements.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| websiteUrl | string | Yes | The URL of the website to test |
| testName | string | Yes | Name of the test scenario |
| expectedResult | string | Yes | Expected outcome of the test |
| description | string | No | Detailed description of the test scenario |
| precondition | string | No | Any preconditions required before testing |
| captureScreenshots | boolean | No | Whether to capture screenshots (default: false) |
| sensitiveData | object | No | Key-value pairs of sensitive data |
| testSteps | array | No | Array of test step objects |
| initialActions | array | No | Array of initial actions to perform |

**Test Step Structure:**
```json
{
  "description": "Enter username",
  "testData": "testuser"
}
```

**Example Request:**
```json
{
  "websiteUrl": "https://example.com",
  "testName": "Login Test",
  "expectedResult": "User successfully logs in",
  "description": "Test the login functionality",
  "testSteps": [
    {
      "description": "Enter username",
      "testData": "testuser"
    },
    {
      "description": "Click login button"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "message": "Test scenario created successfully",
  "data": {
    "scenario": { ... },
    "interactedElements": [
      {
        "tag": "input",
        "id": "username",
        "xpath": "/html/body/div/form/input[1]",
        "relativeXpath": "//input[@id='username']",
        "cssSelector": "#username"
      }
    ]
  }
}
```

#### POST `/api/scenario/generate-code`
Generates executable Selenium test code based on a scenario and interacted elements.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| scenario | object | Yes | The test scenario object |
| interactedElements | array | Yes | Array of element objects |
| saveToFile | boolean | No | Save to file (default: true) |

**Response (200 OK):**
```json
{
  "message": "Selenium code generated successfully",
  "data": {
    "seleniumCode": "import pytest\n...",
    "seleniumFilePath": "tests/test_login_test_20240415_143022.py"
  }
}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Missing required fields: websiteUrl, testName"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## Environment Setup

### Required Environment Variables
- `ANTHROPIC_API_KEY`: For Claude models
- `GOOGLE_API_KEY`: For Gemini models

### Dependencies
```bash
pip install langchain-anthropic langchain-google-genai google-generativeai
```

### Directory Structure
```
PowerAI/
├── main.py
├── service/
│   ├── __init__.py
│   ├── browser_llm.py
│   ├── code_gen.py
│   ├── error_handler.py
│   ├── llm.py
│   ├── llm_config.py
│   └── routes/
│       ├── __init__.py
│       ├── llm_config.py
│       └── test_scenario.py
├── tests/                 # Generated test files
└── util/
    ├── action_util.py
    ├── task.py
    └── timer.py
```

## Usage Examples

### Complete Workflow

1. Select the LLM model:
   ```bash
   curl -X POST http://localhost:9092/api/llm/select \
     -H "Content-Type: application/json" \
     -d '{"modelId": "claude", "temperature": 0.2}'
   ```

2. Create a test scenario:
   ```bash
   curl -X POST http://localhost:9092/api/scenario/create \
     -H "Content-Type: application/json" \
     -d '{
       "websiteUrl": "https://example.com",
       "testName": "Login Test",
       "expectedResult": "User logs in successfully",
       "testSteps": [
         {"description": "Enter credentials"},
         {"description": "Click login"}
       ]
     }'
   ```

3. Generate Selenium code:
   ```bash
   curl -X POST http://localhost:9092/api/scenario/generate-code \
     -H "Content-Type: application/json" \
     -d '{
       "scenario": { ... },
       "interactedElements": [ ... ]
     }'
   ```

The generated test files are saved in the `tests/` directory and can be executed with pytest:
```bash
pytest tests/test_login_test_20240415_143022.py
```