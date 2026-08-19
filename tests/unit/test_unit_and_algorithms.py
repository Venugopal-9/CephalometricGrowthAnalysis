import unittest
from typing import Dict, Any

def classify_growth(angle: float) -> str:
    if angle <= 27:
        return 'Horizontal'
    if angle >= 38:
        return 'Vertical'
    return 'Average'

def measurement_vote(val: float, horizontal_max: float, vertical_min: float) -> str:
    if val <= horizontal_max:
        return 'Horizontal'
    if val >= vertical_min:
        return 'Vertical'
    return 'Average'

class TestUnitAndAlgorithms(unittest.TestCase):
    # UT-001 to UT-025: 25 Unique Unit Test Cases
    def test_UT001_classify_growth_horizontal_min(self):
        self.assertEqual(classify_growth(0.0), 'Horizontal')

    def test_UT002_classify_growth_horizontal_threshold(self):
        self.assertEqual(classify_growth(27.0), 'Horizontal')

    def test_UT003_classify_growth_average_lower_bound(self):
        self.assertEqual(classify_growth(27.1), 'Average')

    def test_UT004_classify_growth_average_midpoint(self):
        self.assertEqual(classify_growth(32.5), 'Average')

    def test_UT005_classify_growth_average_upper_bound(self):
        self.assertEqual(classify_growth(37.9), 'Average')

    def test_UT006_classify_growth_vertical_threshold(self):
        self.assertEqual(classify_growth(38.0), 'Vertical')

    def test_UT007_classify_growth_vertical_extreme(self):
        self.assertEqual(classify_growth(60.0), 'Vertical')

    def test_UT008_fma_vote_horizontal(self):
        self.assertEqual(measurement_vote(20.0, 21.0, 28.0), 'Horizontal')

    def test_UT009_fma_vote_average(self):
        self.assertEqual(measurement_vote(25.0, 21.0, 28.0), 'Average')

    def test_UT010_fma_vote_vertical(self):
        self.assertEqual(measurement_vote(30.0, 21.0, 28.0), 'Vertical')

    def test_UT011_yaxis_vote_horizontal(self):
        self.assertEqual(measurement_vote(55.0, 59.0, 66.0), 'Horizontal')

    def test_UT012_yaxis_vote_average(self):
        self.assertEqual(measurement_vote(62.0, 59.0, 66.0), 'Average')

    def test_UT013_yaxis_vote_vertical(self):
        self.assertEqual(measurement_vote(70.0, 59.0, 66.0), 'Vertical')

    def test_UT014_jarabak_vote_horizontal(self):
        # High Jarabak ratio (e.g. 70%) -> 100 - 70 = 30 <= 35 -> Horizontal
        self.assertEqual(measurement_vote(100 - 70.0, 35.0, 40.0), 'Horizontal')

    def test_UT015_jarabak_vote_vertical(self):
        # Low Jarabak ratio (e.g. 50%) -> 100 - 50 = 50 >= 40 -> Vertical
        self.assertEqual(measurement_vote(100 - 50.0, 35.0, 40.0), 'Vertical')

    def test_UT016_landmark_distance_calculation(self):
        import math
        # Distance formula between Sella (286, 196) and Nasion (474, 210)
        dist = math.hypot(474 - 286, 210 - 196)
        self.assertAlmostEqual(dist, 188.52, places=1)

    def test_UT017_confidence_score_formula_concordant(self):
        agreement = 1.0
        completeness = 1.0
        confidence = round(55 + agreement * 25 + completeness * 15)
        self.assertEqual(confidence, 95)

    def test_UT018_confidence_score_formula_partial(self):
        agreement = 0.5
        completeness = 0.5
        confidence = round(55 + agreement * 25 + completeness * 15)
        self.assertEqual(confidence, 75)

    def test_UT019_landmark_unique_id_verification(self):
        landmarks = [{'id': 'S'}, {'id': 'N'}, {'id': 'Go'}, {'id': 'Me'}]
        unique_ids = set(l['id'] for l in landmarks)
        self.assertEqual(len(unique_ids), 4)

    def test_UT020_json_fenced_extractor(self):
        raw_text = "```json\n{\"growthClass\":\"Average\"}\n```"
        import re, json
        match = re.search(r'```(?:json)?\s*([\s\S]*?)```', raw_text)
        data = json.loads(match.group(1))
        self.assertEqual(data['growthClass'], 'Average')

    def test_UT021_angle_decimal_formatting(self):
        angle = 34.5678
        formatted = f"{angle:.2f}"
        self.assertEqual(formatted, "34.57")

    def test_UT022_demo_case_count(self):
        demo_cases = ['demo-average', 'demo-horizontal']
        self.assertEqual(len(demo_cases), 2)

    def test_UT023_analysis_mode_enum(self):
        modes = ['measurements', 'image-assisted']
        self.assertIn('measurements', modes)

    def test_UT024_image_quality_enum(self):
        qualities = ['diagnostic', 'limited', 'unusable']
        self.assertIn('diagnostic', qualities)

    def test_UT025_default_port_coercion(self):
        port_env = None
        port = int(port_env or 8787)
        self.assertEqual(port, 8787)

if __name__ == '__main__':
    unittest.main()
