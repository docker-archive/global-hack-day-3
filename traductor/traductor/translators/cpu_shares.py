from traductor.translators.base import BaseTranslator

class CpuShares(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--cpu-shares=%s" % value