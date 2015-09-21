from traductor.translators.base import BaseTranslator

class Links(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if type(value) is not list:
            return ""

        return "--link=%s" % " --link=".join(value)