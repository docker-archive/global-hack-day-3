from traductor.translators.base import BaseTranslator

class Expose(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if type(value) is not list:
            return ""

        return "--expose=%s" % " --expose=".join(value)