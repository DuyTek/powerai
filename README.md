# AI-Generated Test Scripts: A Data-Driven Evaluation Framework

This project creates a platform that leverages AI to generate test scripts from natural language descriptions. It consists of a web application frontend and a backend API service that integrates with Large Language Models.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Usage Guide](#usage-guide)

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software

- **Node.js** (v21.0 or higher)
  - [Download Node.js](https://nodejs.org/en/download/)
  - Verify installation: `node -v` and `npm -v`

- **Python** (v3.12.0 recommended)
  - [Download Python](https://www.python.org/downloads/)
  - Verify installation: `python --version` or `python3 --version`

- **Git**
  - [Download Git](https://git-scm.com/downloads)
  - Verify installation: `git --version`

### Environment Setup

- A modern web browser (Chrome, Firefox, Edge, etc.)
- A text editor or IDE (VSCode recommended)
- Internet connection for API access to LLMs
- Google Gemini API key (free tier available)

## Backend Setup

The backend is built with Python and handles the LLM integration and test script generation.

### 1. Clone the Repository

```bash
git clone https://github.com/DuyTek/powerai.git
cd powerai
```

### 2. Set Up Python Virtual Environment

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# For Windows:
venv\Scripts\activate
# For macOS/Linux:
source venv/bin/activate
```

### 3. Install Backend Dependencies

```bash
# Create a virtual environment (optional but recommended)
python -m venv .venv

# Activate the virtual environment
# For Windows:
.venv\Scripts\activate
# For macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirement.txt
```

### 4. Set Up Environment Variables

You need to set up environment variables for the AI model APIs. You can use one or more of these depending on which model you want to use:

```bash
# For Google Gemini (recommended - free tier available)
export GEMINI_API_KEY=your_gemini_api_key

# Optional: For Anthropic Claude
export ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional: For OpenAI models
export OPENAI_API_KEY=your_openai_api_key
```

For Google's Gemini API key (recommended), you can get a free key from [Google AI Studio](https://makersuite.google.com/app/apikey). The free tier offers a generous quota that's sufficient for testing and development purposes.

### 5. Start the Backend Server

```bash
cd powerai
python main.py
```

The backend server should now be running at `http://127.0.0.1:9092`.

## Frontend Setup

The frontend is built with React, TypeScript, and Material UI.

### 1. Navigate to the Frontend Directory

```bash
cd ../webapp
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

The frontend development server should now be running, and your browser should open to `http://localhost:5173`.

## Usage Guide

Once both the backend and frontend are running, you can use the application to create and generate test scripts:

1. **Create a New Test Scenario**:
   - Navigate to the home page
   - Fill in details like website URL, test name, and test steps
   - Click "Submit" to create the scenario

2. **Element Verification**:
   - After submitting a scenario, you'll be redirected to the verification page
   - Review and verify the elements that AI has identified
   - Accept or reject each element using the provided buttons

3. **Generate Test Scripts**:
   - After verification, click "Finish Verification"
   - The system will generate Python Selenium test scripts based on your scenario

4. **View Results**:
   - The generated test scripts will be displayed on the Results page
   - You can copy or download the scripts for use in your testing environment

## Troubleshooting

- **Backend Connection Issues**: 
  - Ensure the backend server is running on port 9092
  - Check that you've exported the API keys correctly
  - Verify that Flask is running without errors

- **Frontend Display Issues**: 
  - Try clearing your browser cache or using incognito mode
  - Check browser console for any JavaScript errors
  - Ensure you're using a compatible browser version

- **LLM API Issues**: 
  - Verify your Gemini API key is correct and active
  - Check that you haven't exceeded rate limits (though the free tier is quite generous)
  - If using other models, ensure the corresponding API keys are correctly set

- **Browser-Use Package Issues**:
  - The project relies on `browser-use` for browser automation
  - If you encounter issues, check that your Chrome/browser installation is compatible

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Features

- **AI-powered browser automation** for interacting with web applications
- **Smart element detection** to identify and capture web elements
- **Test script generation** using various LLM providers (Google, Anthropic, OpenAI)
- **Element verification interface** for reviewing and approving detected elements
- **Customizable test scenarios** with detailed test steps and configuration
- **Automatic Selenium code generation** based on AI interactions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
