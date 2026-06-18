import time


class Timer:
    def __init__(self, name=""):
        self.name = name

    def __enter__(self):
        self.start_time = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end_time = time.time()
        self.duration = self.end_time - self.start_time
        print(f"[{self.name}] Duration: {self.duration:.2f}s")
