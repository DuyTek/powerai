import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException

class TestStudentLogin:
    """Test class for student login functionality."""

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
        """Test student login functionality."""
        try:
            # When: Student enters credentials
            username_field = self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//*[@id='ContentPlaceHolder1_ctl00_ucDangNhap_txtTaiKhoa']"))
            )
            username_field.clear()
            username_field.send_keys("ITITWE19021")

            password_field = self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//*[@id='ContentPlaceHolder1_ctl00_ucDangNhap_txtMatKhau']"))
            )
            password_field.clear()
            password_field.send_keys("vuduy0913876222")

            # And: Clicks the login button
            login_button = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//*[@id='ContentPlaceHolder1_ctl00_ucDangNhap_btnDangNhap']"))
            )
            login_button.click()

            # Then: Student should be logged in successfully
            # Wait for the page to load after login
            self.wait.until(
                EC.presence_of_element_located((By.ID, "ContentPlaceHolder1_ctl00_ucThongTinSV_lblTenSinhVien"))
            )

            # Verify student information is displayed
            student_name = self.driver.find_element(By.ID, "ContentPlaceHolder1_ctl00_ucThongTinSV_lblTenSinhVien")
            student_id = self.driver.find_element(By.ID, "ContentPlaceHolder1_ctl00_ucThongTinSV_lblMaSinhVien")

            assert student_name.is_displayed(), "Student name is not displayed"
            assert student_id.is_displayed(), "Student ID is not displayed"
            assert "ITITWE19021" in student_id.text, "Student ID does not match"

        except TimeoutException as e:
            pytest.fail(f"Element not found within timeout period: {str(e)}")
        except WebDriverException as e:
            pytest.fail(f"WebDriver exception occurred: {str(e)}")
        except Exception as e:
            pytest.fail(f"Unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    pytest.main(["-v", __file__])