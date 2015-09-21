from traductor.translators.base import BaseTranslator

class User(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--user=%s" % value