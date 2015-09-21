from traductor.translators.base import BaseTranslator

class VolumesFrom(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if type(value) is not list:
            return ""

        return "--volumes-from=%s" % " --volumes-from=".join(value)