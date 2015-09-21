from traductor.translators.base import BaseTranslator

class Dns(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if type(value) is not list:
            if not value:
                return ""
            value = [value]

        return "--dns=%s" % " --dns=".join(value)