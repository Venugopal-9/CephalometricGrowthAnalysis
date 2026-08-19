import time
import random
import requests
import statistics
from typing import List, Dict, Any
from concurrent.futures import ThreadPoolExecutor, as_completed

from tests.load_testing.config.load_config import LoadConfig
from tests.e2e.utils.logger import get_logger

logger = get_logger("LoadTester")

class RequestMetric:
    def __init__(self, endpoint: str, status_code: int, latency_ms: float, success: bool):
        self.endpoint = endpoint
        self.status_code = status_code
        self.latency_ms = latency_ms
        self.success = success

class LoadTestSummary:
    def __init__(self, virtual_users: int, duration_sec: float, metrics: List[RequestMetric]):
        self.virtual_users = virtual_users
        self.duration_sec = duration_sec
        self.total_requests = len(metrics)
        self.rps = round(self.total_requests / duration_sec, 2) if duration_sec > 0 else 0.0
        
        successful = [m for m in metrics if m.success]
        self.successful_requests = len(successful)
        self.failed_requests = self.total_requests - self.successful_requests
        self.success_rate = round((self.successful_requests / self.total_requests * 100), 2) if self.total_requests > 0 else 0.0
        
        latencies = [m.latency_ms for m in metrics] if metrics else [0.0]
        self.min_latency = round(min(latencies), 2)
        self.max_latency = round(max(latencies), 2)
        self.avg_latency = round(statistics.mean(latencies), 2) if latencies else 0.0
        
        sorted_latencies = sorted(latencies)
        p95_idx = int(len(sorted_latencies) * 0.95)
        self.p95_latency = round(sorted_latencies[min(p95_idx, len(sorted_latencies) - 1)], 2)

class LoadTester:
    def __init__(self, base_url: str = LoadConfig.BASE_URL, virtual_users: int = LoadConfig.VIRTUAL_USERS, duration_seconds: int = LoadConfig.DURATION_SECONDS):
        self.base_url = base_url.rstrip("/") + "/"
        self.virtual_users = virtual_users
        self.duration_seconds = duration_seconds
        self.metrics: List[RequestMetric] = []

    def _user_session_loop(self, user_id: int, stop_time: float) -> List[RequestMetric]:
        session = requests.Session()
        session.headers.update({"User-Agent": f"CephGrow-LoadTestUser-{user_id}"})
        local_metrics: List[RequestMetric] = []
        
        while time.time() < stop_time:
            endpoint = random.choice(LoadConfig.ENDPOINTS)
            target_url = f"{self.base_url}{endpoint}"
            
            start_t = time.perf_counter()
            try:
                response = session.get(target_url, timeout=LoadConfig.REQUEST_TIMEOUT)
                elapsed_ms = (time.perf_counter() - start_t) * 1000.0
                is_success = (200 <= response.status_code < 400)
                metric = RequestMetric(endpoint, response.status_code, elapsed_ms, is_success)
            except Exception as e:
                elapsed_ms = (time.perf_counter() - start_t) * 1000.0
                metric = RequestMetric(endpoint, 500, elapsed_ms, False)
                
            local_metrics.append(metric)
            # Micro sleep between requests (0.01s to 0.05s) to simulate realistic browser interaction
            time.sleep(random.uniform(0.01, 0.05))
            
        return local_metrics

    def run_baseline_load_test(self) -> LoadTestSummary:
        logger.info(f"Starting Baseline Load Test: {self.virtual_users} Virtual Users running continuously for {self.duration_seconds} seconds.")
        logger.info(f"Target Base URL: {self.base_url}")
        
        start_time = time.time()
        stop_time = start_time + self.duration_seconds
        
        all_metrics: List[RequestMetric] = []
        with ThreadPoolExecutor(max_workers=self.virtual_users) as executor:
            futures = [
                executor.submit(self._user_session_loop, i, stop_time)
                for i in range(self.virtual_users)
            ]
            for future in as_completed(futures):
                try:
                    user_metrics = future.result()
                    all_metrics.extend(user_metrics)
                except Exception as e:
                    logger.error(f"Error in virtual user thread: {e}")
                    
        actual_duration = round(time.time() - start_time, 2)
        summary = LoadTestSummary(self.virtual_users, actual_duration, all_metrics)
        
        logger.info("=" * 60)
        logger.info("Baseline Load Test Completed Successfully")
        logger.info(f"Total Requests Sent: {summary.total_requests}")
        logger.info(f"Requests Per Second (RPS): {summary.rps} req/sec")
        logger.info(f"Response Time (Avg): {summary.avg_latency} ms")
        logger.info(f"Response Time (Min): {summary.min_latency} ms")
        logger.info(f"Response Time (Max): {summary.max_latency} ms")
        logger.info(f"Response Time (P95): {summary.p95_latency} ms")
        logger.info(f"Success Rate: {summary.success_rate}%")
        logger.info("=" * 60)
        
        return summary
