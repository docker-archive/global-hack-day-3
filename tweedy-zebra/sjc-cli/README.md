# SJC cli

A command-line utility for SJC

## Installation

There are several installation methods.

### Quick install for OSX and Linux

Does not work on Windows as install.sh is dependent upon sudo.

    git clone https://github.com/stjosephcontent/sjc-cli.git
    cd sjc-cli
    bash install.sh

### Manual Install (OSX and Linux)

    node --version (should be 4.x)
    mkdir -p ~/.sjc/cli
    rm -rvf ~/.sjc/cli
    cd ~/.sjc
    git clone https://github.com/stjosephcontent/sjc-cli.git cli
    cd cli
    npm install (might need sudo)
    npm link (might need sudo)
    # now test your installation
    sjc up

### Manual Install (Windows)

Note that the installation and SJC-CLI in general have a dependency on Git bash. Ensure you have the latest version of bash available.

Copy and paste each line of the following into a Git bash console, ignoring the comments. You will be prompted for your Github credentials.

```bash
node -v                 # Confirm you have a minimum of NodeJS 4.0.x
rm -r -f ~/.sjc/cli/     # Remove any existing cli directory
git clone https://github.com/stjosephcontent/sjc-cli.git ~/.sjc/cli #  Clone, creating target directory at the same time
cd ~/.sjc/cli           # Switch to the target directory
npm install             # Install Node dependencies
npm link                # Link the folder to NPM modules so it is in the path
cd /                    # Move out of the cli directory to anywhere else
sjc help                # Test sjc shell works by executing help 
```

Instructions coming soon to cURL a windows specific bash script.

## Next Steps


