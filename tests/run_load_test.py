import sys
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from tests.load_testing.config.load_config import LoadConfig
from tests.load_testing.utils.load_tester import LoadTester
from tests.e2e.utils.report_generator import ReportGenerator
from tests.e2e.utils.logger import get_logger

logger = get_logger("RunLoadTest")

def main():
    logger.info("Initializing Baseline Load Test Suite...")
    tester = LoadTester(
        base_url=LoadConfig.BASE_URL,
        virtual_users=LoadConfig.VIRTUAL_USERS,
        duration_seconds=LoadConfig.DURATION_SECONDS
    )
    
    summary = tester.run_baseline_load_test()
    
    logger.info("Generating Load Test reports...")
    ReportGenerator.generate_load_test_report(summary)
    
    print("\n" + "=" * 60)
    print("BASELINE / LOAD TEST SUMMARY REPORT")
    print("=" * 60)
    print(f"Concurrent Virtual Users : {summary.virtual_users} users")
    print(f"Execution Duration       : {summary.duration_sec} seconds")
    print(f"Total Requests Sent      : {summary.total_requests}")
    print(f"Requests Per Second (RPS): {summary.rps} req/sec")
    print(f"Average Latency          : {summary.avg_latency} ms")
    print(f"Minimum Latency          : {summary.min_latency} ms")
    print(f"Maximum Latency          : {summary.max_latency} ms")
    print(f"P95 Latency              : {summary.p95_latency} ms")
    print(f"Success Rate             : {summary.success_rate} %")
    print("=" * 60 + "\n")

if __name__ == "__main__":
    main()
