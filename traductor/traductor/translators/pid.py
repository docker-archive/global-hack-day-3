from traductor.translators.base import BaseTranslator

class Pid(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--pid=%s" % value