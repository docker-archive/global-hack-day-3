import argparse
import redis
import os
import logging

__author__ = 'Emmanuel CARRE'


def get_redis_config(redisInstance, application, environment):
    return redisInstance.hgetall(application + "-" + environment)


def build_command_args(config):
    command_args = ""

    logging.debug("Config: " + str(config))
    if {b'daemon'}.issubset(config):
        command_args += '-d '
    if {b'memory'}.issubset(config):
        command_args += "-m " + str(config[b'memory'], 'UTF-8') + " "
    if {b'swap'}.issubset(config):
        command_args += "--memory-swap=\"" + str(config[b'swap'], 'UTF-8') + "\" "
    if {b'image'}.issubset(config):
        command_args += str(config[b'image'], 'UTF-8')
    else:
        logging.error('An entry config \'image\' is required')
        exit(-1)

    logging.debug("Arguments: " + command_args)
    return command_args


def execute_docker_command(args):
    logging.info(os.popen("docker run " + args).read())


def run(args):
    redis_instance = redis.StrictRedis(host=args.host, port=args.port, db=0)
    container_config = get_redis_config(redis_instance, args.name, args.environment)
    command_args = build_command_args(container_config)
    execute_docker_command(command_args)


def config(args):
    logging.debug('add - arguments: ' + str(args))
    redis_instance = redis.StrictRedis(host=args.host, port=args.port, db=0)
    name = args.name + "-" + args.environment
    if args.image:
        redis_instance.hset(name, 'image', args.image)
    if args.daemon:
        redis_instance.hset(name, 'daemon', args.daemon)
    if args.memory:
        redis_instance.hset(name, 'memory', args.memory)
    if args.swap:
        redis_instance.hset(name, 'swap', args.swap)


def main():
    parser = argparse.ArgumentParser(description='Test.')
    parser.add_argument('--host', type=str, help='Host for config manager')
    parser.add_argument('--port', type=int, help='Port for config manager')
    parser.add_argument('--application', '-a', help='Application run')
    parser.add_argument('--environment', '-e', help='Environment to use')
    subparsers = parser.add_subparsers(help='sub-command help')
    parser_config = subparsers.add_parser('config', help='Configure an application')
    parser_run = subparsers.add_parser('run', help='Run an container')

    parser_config.add_argument('--name', '-n', required=True, help='Configuration name')
    parser_config.add_argument('--environment', '-e', required=True, help='Environment configuration')
    parser_config.add_argument('--image', '-i', help='Docker image name')
    parser_config.add_argument('--daemon', '-d', help='Container will run in daemon mode')
    parser_config.add_argument('--memory', '-m', help='Container memory limit')
    parser_config.add_argument('--swap', '-s', help='Container swap limit')
    parser_config.set_defaults(func=config)

    parser_run.add_argument('--name', '-n', required=True, help='Configuration name to use')
    parser_run.add_argument('--environment', '-e', required=True, help='Environment configuration to use')
    parser_run.set_defaults(func=run)

    logging.basicConfig(level=logging.DEBUG)

    args = parser.parse_args()
    args.func(args)


if __name__ == '__main__':
    main()

