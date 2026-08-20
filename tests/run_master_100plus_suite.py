import sys
import unittest
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from tests.utils.generate_master_100plus_matrix import generate_master_matrix

def main():
    print("=" * 60)
    print("EXECUTING MASTER 100+ UNIQUE TEST SUITE")
    print("Categories: UI/UX, Functional, Unit, Validation, Deployment")
    print("=" * 60)
    
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Load unit, validation, and ui/ux test modules with explicit top_level_dir
    tests_dir = project_root / 'tests'
    for category in ['unit', 'validation', 'ui_ux']:
        cat_dir = tests_dir / category
        if cat_dir.exists():
            suite.addTests(loader.discover(start_dir=str(cat_dir), pattern='test_*.py', top_level_dir=str(project_root)))
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print("\nGenerating Master 100+ Test Matrix Excel workbook...")
    generate_master_matrix()
    
    print("\n" + "=" * 60)
    print("MASTER 100+ TEST SUITE COMPLETE")
    print(f"Total Unit/Validation/UI Tests Run: {result.testsRun}")
    print(f"Errors: {len(result.errors)}, Failures: {len(result.failures)}")
    print("=" * 60)

if __name__ == "__main__":
    main()
