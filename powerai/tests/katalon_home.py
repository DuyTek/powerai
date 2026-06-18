import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


class TestKatalonLogin:
    """Test class for verifying Katalon Platform login functionality."""

    @pytest.fixture(autouse=True)
    def setup_teardown(self):
        """Setup and teardown for each test."""
        # Given: Browser is launched and navigated to Katalon Platform
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 20)
        self.driver.get("https://platform.qa.katalon.com")

        yield

        # Cleanup
        self.driver.quit()

    def test_login_and_view_dashboard(self):
        """Test to verify user can login and view dashboard."""
        try:
            # When: User clicks on continue with email button
            email_btn = self.wait.until(
                EC.element_to_be_clickable((By.ID, "btn_signin_with_email_id"))
            )
            email_btn.click()

            # And: User enters email
            email_field = self.wait.until(
                EC.presence_of_element_located((By.ID, "username"))
            )
            email_field.send_keys("blablae@blabla.com")

            # And: User enters password
            password_field = self.driver.find_element(
                By.ID, "login-password-email")
            password_field.send_keys("QETest@gen5")

            # And: User clicks login button
            login_button = self.driver.find_element(
                By.CSS_SELECTOR, "input[type='submit'][name='login']"
            )
            login_button.click()

            # And: User selects domain and continues
            domain_radio = self.wait.until(
                EC.element_to_be_clickable((
                    By.CSS_SELECTOR,
                    "input[type='radio'][value='10502']"  # TODO: I fixed here
                ))
            )
            domain_radio.click()

            continue_button = self.driver.find_element(
                By.CSS_SELECTOR, "input.choose_account_continue_btn"
            )
            continue_button.click()

            # Then: Dashboard should load and display charts
            chart_title = self.wait.until(
                EC.presence_of_element_located((
                    By.XPATH,
                    "//*[contains(text(), 'Test Execution Results Distribution')]"
                ))
            )

            # And: Verify chart is visible
            assert chart_title.is_displayed(), "Dashboard chart is not visible"

            # And: Verify no loading indicators are present
            try:
                self.wait.until(
                    EC.invisibility_of_element_located((
                        By.CSS_SELECTOR,
                        "[class*='loading']"
                    ))
                )
            except TimeoutException:
                raise AssertionError(
                    "Page loading indicators did not disappear")

        except (TimeoutException, NoSuchElementException) as e:
            pytest.fail(f"Test failed: {str(e)}")


if __name__ == "__main__":
    pytest.main(["-v", __file__])
