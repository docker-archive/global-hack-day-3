from traductor.translators.base import BaseTranslator
import six

class Environment(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if type(value) is not dict and type(value) is not list:
            return ""

        environments = []

        if type(value) is dict:
            for env_key, env_val in six.iteritems(value):
                environments.append("%s:%s" % (env_key, env_val,))

        if type(value) is list:
            for env in value:
                if "=" not in env:
                    env = "%s=" % env
                environments.append(env.replace("=", ":"))

        return "--env=%s" % " --env=".join(environments)