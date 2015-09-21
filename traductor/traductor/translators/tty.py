from traductor.translators.base import BaseTranslator

class Tty(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--tty=%s" % value