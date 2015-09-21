#!/usr/bin/env python
# vim: set ts=4; shiftwidth=4; expandtab

from os import execlp

def session(container):
    SESSION_TEMPLATE = """bash --init-file <(echo '{instrumentation}')"""
    INSTRUMENTATION = '''
SESSION_ROOT=/tmp/record;
mkdir -p $SESSION_ROOT;
function __instrument() {
  echo $EUID >> $SESSION_ROOT/euid &&
  echo $BASH_COMMAND >> $SESSION_ROOT/cmd &&
  echo $PWD >> $SESSION_ROOT/pwd &&
  echo $(export | tr "\\n" ";") >> $SESSION_ROOT/env ||
  exit;
};
shopt -s extdebug;
trap __instrument DEBUG;'''
    SESSION_COMMAND = SESSION_TEMPLATE.format(instrumentation = INSTRUMENTATION.replace('\n', ' '))
    # docker exec
    execlp('docker', 'docker', 'exec', '-ti', container, 'bash', '-c', SESSION_COMMAND)
