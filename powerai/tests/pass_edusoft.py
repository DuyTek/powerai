import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class TestStudentLogin:
    """Test class for verifying student login functionality."""

    @pytest.fixture(autouse=True)
    def setup_teardown(self):
        """Setup and teardown for each test."""
        # Given: Browser is launched and navigated to the login page
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)
        self.driver.get("https://edusoftweb.hcmiu.edu.vn")
        
        yield
        
        # Cleanup
        self.driver.quit()

    def test_student_login(self):
        """Test student login with valid credentials."""
        try:
            # When: Student enters valid credentials
            username_field = self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//*[@id='ContentPlaceHolder1_ctl00_ucDangNhap_txtTaiKhoa']"))
            )
            username_field.clear()
            username_field.send_keys("ITITWE19021")

            password_field = self.driver.find_element(By.XPATH, "//*[@id='ContentPlaceHolder1_ctl00_ucDangNhap_txtMatKhau']")
            password_field.clear()
            password_field.send_keys("vuduy0913876222")

            # And: Clicks the login button
            login_button = self.driver.find_element(By.XPATH, "//*[@id='ContentPlaceHolder1_ctl00_ucDangNhap_btnDangNhap']")
            login_button.click()

            # Then: Student should be successfully logged in
            # Wait for the page to load and verify student information is present
            student_info = self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'ITITWE19021')]"))
            )
            
            # Assert that student information is displayed
            assert student_info.is_displayed(), "Student information is not displayed after login"
            assert "ITITWE19021" in student_info.text, "Student ID is not present in the displayed information"

        except TimeoutException:
            pytest.fail("Timeout waiting for element to be present")
        except NoSuchElementException:
            pytest.fail("Required element not found on the page")
        except Exception as e:
            pytest.fail(f"Test failed with exception: {str(e)}")

if __name__ == "__main__":
    pytest.main(["-v", __file__])