#! /usr/bin/env python

from __future__ import print_function

import os
import sys
import yaml
import errno
import jinja2
import argparse
import importlib

def mkdir_p(path):
    """
    Create a directory similar to mkdir -p
    """
    try:
        os.makedirs(path)
    except OSError as exc: # Python >2.5
        if exc.errno == errno.EEXIST and os.path.isdir(path):
            pass
        else: raise


def underscore_to_camelcase(value):
    """
    Translate a snake_case to CamelCase
    """
    def upperfirst(x):
        return x[0].upper() + x[1:]
    def camelcase():
        yield str.lower
        while True:
            yield str.capitalize
    c = camelcase()
    return upperfirst("".join(c.next()(x) if x else '_' for x in value.split("_")))


class Traductor(object):
    """
    Handles logic for translating docker-compose yaml files to systemd services
    """
    def translate(self, files, destination):
        """

        """
        docker_services = self._parse_yaml_from_files(files)

        for service_name, service_specs in docker_services.iteritems():

            template_vars = self._translate_to_run_template_vars(service_name=service_name, service_specs=service_specs)
            generated_template = self._generate_service(service_name=service_name, template_vars=template_vars, destination_folder = destination)

            print(generated_template)


    def _parse_yaml_from_files(self, files):
        """
        Convert the given docker-compose files into python objects
        """
        docker_services = {}

        # Loop through given files
        for file in files:

            # Load YAML into python
            with open(file, 'r') as stream:
                services_set = yaml.load(stream)

            # Loop through services from YAML file
            for service_name, service_specs in services_set.iteritems():

                # Add service to main services list.
                # If the service name already exists we will override
                docker_services[service_name] = service_specs

        return docker_services


    def _translate_to_run_template_vars(self, service_name, service_specs):
        """
        Translate each docker-compose service into docker run cli command
        """
        image = ""
        options = ""
        command = ""

        # Save image and remove from service specs
        if "image" in service_specs:
            image = service_specs["image"]
            del service_specs["image"]


        # Get the run command if specified
        if "command" in service_specs:
            command = service_specs["command"]
            del service_specs["command"]

        for attr_name, attr_value in service_specs.iteritems():

            translator = None

            try:
                module = importlib.import_module('traductor.translators.%s' % attr_name)
                translator = getattr(module, underscore_to_camelcase(attr_name))
                translator = translator()
            except AttributeError:
                print("The docker-compose command \"%s\" is either not valid or is not " +
                      "supported as a run command" % attr_name)
                continue

            # Add returned string to docker run options
            options = "%s %s" % (options, translator.translate(attr_value),)

        return {
            "service": {
                "name": underscore_to_camelcase(service_name),
                "description": "%s service" % service_name,
                "image": image,
                "options": options,
                "command": command,
            }
        }


    def _generate_service(self, service_name, template_vars, destination_folder):
        """
        Create a systemd service file using template vars
        """
        # Build the systemd service file using Jinja2
        template_loader = jinja2.FileSystemLoader(searchpath="/")
        template_env = jinja2.Environment(loader=template_loader)

        # Render systemd service file
        template_file = os.path.join(os.path.dirname(os.path.realpath(__file__)), "templates/systemd.jinja2.service")
        template = template_env.get_template(template_file)
        output_text = template.render(template_vars)

        # Ensure destination folder exists
        mkdir_p(destination_folder)

        # Use print to send generated template to file
        print(output_text, file=open(os.path.join(destination_folder, "%s.service" % service_name), "w"))

        return output_text


class Cli(object):
    """
    Cli handler
    """
    def __init__(self):
        """
        Initialise Cli
        """
        # Setup cli handler
        parser = argparse.ArgumentParser(description="Translate docker-compose templates to process" +
                                                     " manage service files (systemd currently supported).")

        parser.add_argument(
            '-d',
            '--dest',
            dest='dest',
            default='./',
            help='Destination for generated systemd service files (default: ./)',
        )

        parser.add_argument(
            '-f',
            '--file',
            dest='file',
            action='append',
            help='Specify docker-compose files (default: docker-compose.yml)',
        )

        # Get cli arguments
        args = parser.parse_args()

        if not args.file:
            args.file = ['docker-compose.yml']

        Traductor().translate(files=args.file, destination=args.dest)


if __name__ == "__main__":
    Cli()
