from traductor.translators.base import BaseTranslator

class Net(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--net=%s" % value