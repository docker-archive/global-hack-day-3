from traductor.translators.base import BaseTranslator

class WorkingDir(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--workdir=%s" % value