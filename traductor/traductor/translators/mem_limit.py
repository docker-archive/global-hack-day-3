from traductor.translators.base import BaseTranslator

class MemLimit(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--memory=%s" % value