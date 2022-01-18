import unittest

from src.feature.domain.repository.rule_repository import RuleRepository
from src.feature.domain.usecase.get_rule_data_usecase import GetRuleDataUseCase


class TestGetRuleDataUseCase(unittest.TestCase):
    def test_execute(self):
        """Arrange"""
        repo = RuleRepository()
        use_case = GetRuleDataUseCase(repo)
        """Act"""
        data = use_case.execute()
        """Assert"""
        self.assert_(data)


if __name__ == '__main__':
    unittest.main()
