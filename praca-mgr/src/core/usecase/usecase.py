import abc


class UseCase(metaclass=abc.ABCMeta):
    @abc.abstractmethod
    def execute(self):
        pass
