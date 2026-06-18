# Written by claude-3.5-sonnet-latest
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


class LoginTest(unittest.TestCase):
    """Test case for verifying student login functionality"""

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

        # Create screenshots directory if it doesn't exist
        self.screenshot_dir = "screenshots"
        if not os.path.exists(self.screenshot_dir):
            os.makedirs(self.screenshot_dir)

    def take_screenshot(self, name):
        """Take a screenshot and save it with timestamp"""
        if not hasattr(self, "_test_count"):
            self._test_count = 1
        else:
            self._test_count += 1

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.screenshot_dir}/{timestamp}_{self._test_count}_{name}.png"
        self.driver.save_screenshot(filename)
        print(f"Screenshot saved: {filename}")

    def test_student_login(self):
        """Test that verifies a student can sign in successfully"""
        # Open the website
        self.driver.get("https://edusoftweb.hcmiu.edu.vn")
        self.take_screenshot("initial_page")

        # Find username input field and enter username
        username_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located(
                (By.ID, "ContentPlaceHolder1_ctl00_ucDangNhap_txtTaiKhoa"))
        )
        username_input.clear()
        # Using the username from test data
        username_input.send_keys("ITITWE19021")
        self.take_screenshot("username_entered")

        # Find password input field and enter password
        password_input = self.driver.find_element(
            By.ID, "ContentPlaceHolder1_ctl00_ucDangNhap_txtMatKhau")
        password_input.clear()
        # Using the password from test data
        password_input.send_keys("vuduy0913876222")
        self.take_screenshot("password_entered")

        # Find login button and click it
        login_button = self.driver.find_element(
            By.ID, "ContentPlaceHolder1_ctl00_ucDangNhap_btnDangNhap")
        login_button.click()

        # Wait for page to load after login
        time.sleep(3)
        self.take_screenshot("after_login")

        # Check if login was successful by verifying the student's name and ID are visible
        try:
            # Wait for page to load completely
            time.sleep(2)

            # Look for elements containing student name and ID
            # You may need to adjust these XPaths based on the actual page structure
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, "//*[contains(text(), 'Nguyễn Đăng Vũ Duy')]"))
            )

            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, "//*[contains(text(), 'ITITWE19021')]"))
            )

            self.take_screenshot("login_success_with_student_info")
            print("Login successful! Student name and ID verified.")

            # Additional assertion to confirm login success
            page_source = self.driver.page_source
            self.assertTrue("Nguyễn Đăng Vũ Duy" in page_source,
                            "Student full name not found on page")
            self.assertTrue("ITITWE19021" in page_source,
                            "Student ID not found on page")

        except Exception as e:
            self.take_screenshot("login_verification_error")
            self.fail(f"Login verification failed: {str(e)}")

    def tearDown(self):
        """Clean up after each test case"""
        # Close the browser
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
