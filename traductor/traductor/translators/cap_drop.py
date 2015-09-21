from traductor.translators.base import BaseTranslator

class CapDrop(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if type(value) is not list:
            return ""

        return "--cap-drop=%s" % " --cap-drop=".join(value)