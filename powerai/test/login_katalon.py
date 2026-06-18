import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import os
from datetime import datetime


class KatalonLoginTest(unittest.TestCase):
    """Test case for verifying Katalon platform login functionality"""

    def setUp(self):
        """Set up the test environment before each test case"""
        # Configure Chrome options
        chrome_options = Options()
        # Uncomment the line below to run in headless mode
        # chrome_options.add_argument("--headless")
        chrome_options.add_argument("--start-maximized")

        # Initialize WebDriver
        self.driver = webdriver.Chrome(service=Service(
            ChromeDriverManager().install()), options=chrome_options)
        self.driver.implicitly_wait(10)

    def test_katalon_platform_login(self):
        """Test that verifies a user can sign in to Katalon platform and see the home page"""
        # Open the website
        self.driver.get("https://platform.katalon.com")

        # Step 1: Click "Continue with email" button
        email_signin_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "btn_signin_with_email_id"))
        )
        email_signin_button.click()

        # Step 2: Input email
        email_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "username"))
        )
        email_input.clear()
        email_input.send_keys("blabla@blabla.com")

        # Step 3: Input password
        password_input = self.driver.find_element(
            By.ID, "login-password-email")
        password_input.clear()
        password_input.send_keys("Top@12345")

        # Step 4: Click Login button
        login_button = self.driver.find_element(
            By.XPATH, "//input[@type='submit' and @name='login']")
        login_button.click()

        # Wait for account selection page to load
        WebDriverWait(self.driver, 15).until(
            EC.presence_of_element_located(
                (By.XPATH, "//input[@type='radio' and @name='selected_account']"))
        )

        # Step 5: Choose any account and click continue
        # Select the first available account
        account_radio = self.driver.find_element(
            By.XPATH, "//input[@type='radio' and @name='selected_account']")
        account_radio.click()

        # Click the continue button
        continue_button = self.driver.find_element(
            By.XPATH, "//input[@type='submit' and @class='choose_account_continue_btn']")
        continue_button.click()

        # Verify successful login by waiting for the specific text to appear
        # Wait for the page to load completely (adjust timeout as needed)
        try:
            # Look specifically for "Test Execution Results Distribution" text
            WebDriverWait(self.driver, 30).until(
                EC.presence_of_element_located(
                    (By.XPATH, "//*[contains(text(), 'Test Execution Results Distribution')]"))
            )

            # Additional check to verify the text is actually visible on the page
            result_distribution_element = self.driver.find_element(
                By.XPATH, "//*[contains(text(), 'Test Execution Results Distribution')]")

            # Check if the element is displayed
            if result_distribution_element.is_displayed():
                print(
                    "Successfully verified: 'Test Execution Results Distribution' is visible on the screen!")
            else:
                self.fail(
                    "'Test Execution Results Distribution' element was found but is not visible on the screen")

            # Assert that the text is in the page content as a final verification
            page_source = self.driver.page_source
            self.assertTrue("Test Execution Results Distribution" in page_source,
                            "Expected text 'Test Execution Results Distribution' not found in page source")

        except Exception as e:
            self.fail(
                f"Home page verification failed: {str(e)}. 'Test Execution Results Distribution' text not found.")

    def tearDown(self):
        """Clean up after each test case"""
        # Close the browser
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
