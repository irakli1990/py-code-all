import abc
from src.feature.data.models import RuleData

class RuleRepository(metaclass=abc.ABCMeta):

    @abc.abstractmethod
    def get_rule_data(self) -> RuleData:
        pass
