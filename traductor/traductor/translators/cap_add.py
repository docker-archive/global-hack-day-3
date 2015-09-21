from traductor.translators.base import BaseTranslator

class CapAdd(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if type(value) is not list:
            return ""

        return "--cap-add=%s" % " --cap-add=".join(value)
