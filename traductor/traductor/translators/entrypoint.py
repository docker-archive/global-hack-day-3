from traductor.translators.base import BaseTranslator

class Entrypoint(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--entrypoint=%s" % value