from traductor.translators.base import BaseTranslator

class Ports(BaseTranslator):
    """
    Port Mapping
    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if type(value) is not list:
            return ""

        return "--publish=%s" % " --publish=".join(value)