from traductor.translators.base import BaseTranslator

class MacAddress(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--mac-address=%s" % value