from traductor.translators.base import BaseTranslator

class ReadOnly(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--read-only=%s" % value