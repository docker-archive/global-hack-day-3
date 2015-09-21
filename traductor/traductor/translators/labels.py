from traductor.translators.base import BaseTranslator
import six

class Labels(BaseTranslator):
    """

    """
    def translate(self, value):
        """
        :param value:
        :return:
        """
        if type(value) is not dict and type(value) is not list:
            return ""

        labels = []

        if type(value) is dict:
            for env_key, env_val in six.iteritems(value):
                labels.append("%s:%s" % (env_key, env_val,))

        if type(value) is list:
            for label in value:
                if "=" not in label:
                    label = "%s=" % label

                labels.append(label.replace("=", ":"))

        return "--label=%s" % " --label=".join(labels)