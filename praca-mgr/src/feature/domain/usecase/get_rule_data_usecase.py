from src.core.usecase.usecase import UseCase
from src.feature.domain.repository.rule_repository import RuleRepository


class GetRuleDataUseCase(UseCase):
    rule_data: RuleRepository

    def __init__(self, rule_repository):
        self.rule_data = rule_repository

    def execute(self):
        return self.rule_data.get_rule_data()
