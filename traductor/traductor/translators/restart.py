from traductor.translators.base import BaseTranslator

class Restart(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--restart=%s" % value
