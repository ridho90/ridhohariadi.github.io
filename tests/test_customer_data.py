import importlib.util
from pathlib import Path
import unittest

SPEC = importlib.util.spec_from_file_location('audit', Path(__file__).parents[1] / 'scripts/audit_customer_data.py')


class CleaningRules(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.audit = importlib.util.module_from_spec(SPEC)
        SPEC.loader.exec_module(cls.audit)

    def test_known_generator_dates_and_quarantined_marker(self):
        self.assertEqual(self.audit.normalize_date('04/05/2026'), '2026-04-05')
        self.assertEqual(self.audit.normalize_date('05-04-2026'), '2026-04-05')
        self.assertEqual(self.audit.normalize_date('03/04/2026'), '')
        with self.assertRaises(ValueError):
            self.audit.normalize_date('2026-02-30')

    def test_duplicate_keeps_first_and_does_not_sum_spend(self):
        first = dict(Customer_ID='C1', Full_Name='  SAMPLE   NAME ', Email=' ',
                     Phone_Number='0812 7000 001', Address='', City=' surabya ',
                     Registration_Date='03/04/2026', Last_Purchase_Date='2026-05-01', Total_Spent=' 100 ')
        duplicate = dict(first, Total_Spent='200')
        clean, queue = self.audit.transform([first, duplicate])
        self.assertEqual(len(clean), 1)
        self.assertEqual(clean[0]['Total_Spent'], '100')
        self.assertEqual(clean[0]['Full_Name'], 'Sample Name')
        self.assertEqual(clean[0]['City'], 'Surabaya')
        self.assertEqual(clean[0]['Email'], '')
        self.assertEqual(clean[0]['Registration_Date'], '')
        self.assertEqual(len(queue), 4)
        self.assertEqual(queue[-1]['Issue'], 'Duplicate Customer_ID')
        self.assertEqual(queue[-1]['Raw_Row'], '3')


if __name__ == '__main__':
    unittest.main()
