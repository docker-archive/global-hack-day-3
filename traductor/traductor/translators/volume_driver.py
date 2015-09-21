from traductor.translators.base import BaseTranslator

class VolumeDriver(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if not value:
            return ""

        return "--volume-driver=%s" % value