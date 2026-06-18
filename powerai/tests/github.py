import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.keys import Keys
import time

class TestGithubFriendSearch:
    """Test class to verify finding a friend on Github."""

    @pytest.fixture(autouse=True)
    def setup_teardown(self):
        """Setup and teardown for each test."""
        # Given: Browser is launched and navigated to Github
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)
        self.driver.get("https://github.com")
        
        yield
        
        # Cleanup
        self.driver.quit()

    def test_find_friend(self):
        """Test to verify finding a friend named DuyTek on Github."""
        try:
            # Given: User clicks on the sign in link
            sign_in_button = self.wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "a.HeaderMenu-link--sign-in"))
            )
            sign_in_button.click()

            # When: User enters email
            email_field = self.wait.until(
                EC.presence_of_element_located((By.ID, "login_field"))
            )
            email_field.send_keys("vduy.dev@gmail.com")

            # And: User enters password
            password_field = self.driver.find_element(By.ID, "password")
            password_field.send_keys("dudikun13@")

            # And: User clicks sign in button
            sign_in_submit = self.driver.find_element(
                By.CSS_SELECTOR, "input[type='submit'].btn-primary"
            )
            sign_in_submit.click()

            # And: User clicks on search button
            search_button = self.wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button.AppHeader-searchButton"))
            )
            search_button.click()

            # And: User searches for friend
            search_input = self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "[data-target='qbsearch-input.inputButton']"))
            )
            search_input.send_keys("DuyTek")
            search_input.send_keys(Keys.RETURN)

            # Then: Search results should contain friend's profile
            time.sleep(2)  # Allow search results to load
            search_results = self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".codesearch-results"))
            )
            
            # Assert friend's profile is found
            assert "DuyTek" in search_results.text, "Friend's profile not found in search results"

        except TimeoutException as e:
            pytest.fail(f"Timeout waiting for element: {str(e)}")
        except NoSuchElementException as e:
            pytest.fail(f"Element not found: {str(e)}")
        except Exception as e:
            pytest.fail(f"Test failed: {str(e)}")

if __name__ == "__main__":
    pytest.main(["-v"])