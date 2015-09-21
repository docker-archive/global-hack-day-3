from traductor.translators.base import BaseTranslator

class Privileged(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--privileged=%s" % value