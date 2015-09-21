from traductor.translators.base import BaseTranslator

class Devices(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if type(value) is not list:
            return ""

        return "--device=%s" % " --device=".join(value)