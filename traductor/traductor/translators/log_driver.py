from traductor.translators.base import BaseTranslator

class LogDriver(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--log-driver=%s" % value