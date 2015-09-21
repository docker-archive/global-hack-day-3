#!/bin/bash
rm -r -f ~/.sjc/cli/     # Remove any existing cli directory
git clone https://github.com/stjosephcontent/sjc-cli.git ~/.sjc/cli #  Clone, creating target directory at the same time
cd ~/.sjc/cli           # Switch to the target directory
npm install             # Install Node dependencies
npm link                # Link the folder to NPM modules so it is in the path
cd /                    # Move out of the cli directory to anywhere else
sjc help                # Test sjc shell works by executing help 