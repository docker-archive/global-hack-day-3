import os
import sys
import argparse

from dockerflow.flow import Flow

def parse_args(argv): 
    parser = argparse.ArgumentParser(description='docker-flow')
    parser.add_argument('-f', '--file', required=True,
                       help='The workflow file')
    parser.add_argument('-b', '--build-dir', default="~/.docker-flow/build",
                       help='Directory docker-flow will save Dockerfile, compose files to')

    args = parser.parse_args(argv)
    return args

def main():  
    args = parse_args(sys.argv[1:])
    workflow_file = args.file
    workflow_name = os.path.basename(workflow_file).split('.')[0]
    build_dir = os.path.join(os.path.expanduser(args.build_dir), workflow_name)
    if not os.path.exists(workflow_file): 
        print 'workflow file {0} does not exist'.format(workflow_file)
        sys.exit(1)
    if not os.path.exists(build_dir): 
        print 'Creating docker-flow build directory {0}'.format(build_dir)
        os.makedirs(build_dir)
    print 'Building workflow from {0}'.format(workflow_file)
    workflow = Flow.from_yaml(workflow_file, context={"build_dir": build_dir})
    print 'Running jobs in workflow {0}'.format(workflow.name)
    workflow.run() 
    print 'Completed workflow {0}'.format(workflow.name)

if __name__ == '__main__': 
    main()
