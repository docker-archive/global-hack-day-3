from traductor.translators.base import BaseTranslator

class MemswapLimit(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--memory-swap=%s" % value