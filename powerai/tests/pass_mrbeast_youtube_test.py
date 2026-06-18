import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException


class TestYoutubeVideo:
    """Test class to verify YouTube video playback functionality."""

    @pytest.fixture(autouse=True)
    def setup_teardown(self):
        """Setup and teardown for each test."""
        # Given: Browser is launched and YouTube is opened
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)
        self.driver.get("https://youtube.com")

        yield

        # Cleanup
        self.driver.quit()

    def test_play_pause_mrbeast_video(self):
        """Test to verify playing and pausing a Mr Beast video."""
        try:
            # When: User searches for Mr Beast video
            search_box = self.wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//input[@name='search_query']"))
            )
            search_box.clear()
            search_box.send_keys("Mr Beast")
            search_box.send_keys(Keys.RETURN)

            # Then: Search results should appear
            self.wait.until(
                EC.presence_of_element_located((By.ID, "contents"))
            )

            # When: User clicks on the first video
            first_video = self.wait.until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, "ytd-video-renderer"))
            )
            first_video.click()

            # Then: Video should start playing
            video_player = self.wait.until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, ".html5-main-video"))
            )

            # Wait for video to actually start playing
            self.wait.until(
                lambda driver: video_player.get_attribute("currentTime") > "0")

            # When: User clicks on the video to pause
            video_player.click()

            # Then: Video should be paused
            self.wait.until(
                lambda driver: video_player.get_attribute("paused") == "true")

            # Verify video is actually paused
            assert video_player.get_attribute(
                "paused") == "true", "Video did not pause"

        except TimeoutException as e:
            pytest.fail(f"Timeout waiting for element: {str(e)}")
        except NoSuchElementException as e:
            pytest.fail(f"Element not found: {str(e)}")
        except Exception as e:
            pytest.fail(f"Test failed: {str(e)}")


if __name__ == "__main__":
    pytest.main(["-v", __file__])
