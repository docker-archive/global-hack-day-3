from traductor.translators.base import BaseTranslator

class EnvFile(BaseTranslator):
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

        return "--env-file=%s" % " --env-file=".join(value)