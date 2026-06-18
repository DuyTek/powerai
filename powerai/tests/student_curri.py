import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class TestStudentLogin:
    """Test class to verify student login functionality."""

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

    def test_student_login_and_view_curriculum(self):
        """
        Test student login and curriculum view functionality.
        """
        try:
            # When: Student enters username
            username_field = self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//*[@id='ContentPlaceHolder1_ctl00_ucDangNhap_txtTaiKhoa']"))
            )
            username_field.clear()
            username_field.send_keys("ITITWE19021")

            # And: Student enters password
            password_field = self.driver.find_element(By.XPATH, "//*[@id='ContentPlaceHolder1_ctl00_ucDangNhap_txtMatKhau']")
            password_field.clear()
            password_field.send_keys("vuduy0913876222")

            # And: Student clicks login button
            login_button = self.driver.find_element(By.XPATH, "//*[@id='ContentPlaceHolder1_ctl00_ucDangNhap_btnDangNhap']")
            login_button.click()

            # Then: Student should be logged in successfully
            self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//a[contains(@href, 'Default.aspx?page=ctdtkhoisv')]"))
            )

            # When: Student clicks on curriculum view
            curriculum_link = self.driver.find_element(By.XPATH, "//a[contains(@href, 'Default.aspx?page=ctdtkhoisv')]")
            curriculum_link.click()

            # Then: Curriculum table should be visible
            self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'grid-roll2')]"))
            )

            # And: Verify the presence of completed subjects
            subjects = self.driver.find_elements(By.XPATH, "//table[@class='body-table']//tr")
            assert len(subjects) >= 38, "Expected at least 38 subjects in the curriculum"

        except TimeoutException as e:
            pytest.fail(f"Timeout waiting for element: {str(e)}")
        except NoSuchElementException as e:
            pytest.fail(f"Element not found: {str(e)}")
        except Exception as e:
            pytest.fail(f"Test failed: {str(e)}")

if __name__ == "__main__":
    pytest.main(["-v", __file__])