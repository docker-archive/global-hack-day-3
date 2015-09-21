from traductor.translators.base import BaseTranslator

class Volumes(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if type(value) is not list:
            return ""

        return "--volume=%s" % " --volume=".join(value)