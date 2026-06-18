import os
import asyncio
import json
from pydantic import BaseModel
from typing import List, Optional
from langchain_anthropic import ChatAnthropic
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from browser_use import Browser, BrowserConfig, BrowserContextConfig, Controller, Agent, ActionResult, SystemPrompt
from browser_use.browser.context import BrowserContext
from .llm import LLMService
from .llm_config import LLM_CONFIG


controller = Controller()

browser = Browser(
    config=BrowserConfig(
        # chrome_instance_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless=True,
        disable_security=True,
    )
)


class BrowserLLMService:

    def __init__(self, website_url: str, task: str = "", sensitive_data: Optional[dict[str, str]] = None, initial_actions: Optional[List[dict]] = None):
        internal_actions = [
            {
                'open_tab': {'url': website_url}
            }
            if initial_actions is None else initial_actions
        ]

        # Create LLM instance using current configuration
        self.llm = LLMService().llm  # This will use the current LLM_CONFIG

        self.agent = Agent(
            task=task,
            llm=self.llm,  # Use the instance llm
            controller=controller,
            browser=browser,
            initial_actions=internal_actions,
            sensitive_data=sensitive_data,
            generate_gif=True,
        )

    def get_agent(self):
        return self.agent

    async def close_browser(self):
        await browser.close()
