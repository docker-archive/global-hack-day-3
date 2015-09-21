# SJC Comand Line Utility
sjc is a command line utility that works with git, docker, jira, and slack to allow developers to spin up, spin down, deploy, and undeploy any number of apps, and any number of versions of the same app.

# Invocation Pattern
sjc <command> [<target>:<branch>] [--flags] [--more-flags]

# examples
sjc start cerebrum ( starts a docker container of cerebrum develop branch )
sjc test flyertool:FT-89-parse-section-headings ( run the tests on the specified branch )
sjc deploy highlandfarms:HF-90-use-sizeify-snow stage ( deploy the branch to staging )

# Commands
