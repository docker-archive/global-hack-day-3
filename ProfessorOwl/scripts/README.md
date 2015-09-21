# Scripts

## Project related

- demo.sh - runs hello-world image repeatedly
- poc.sh - the Professor Owl proof of concept script. Interacts with tmux,
    has some of the test dialogue from Professor Owl. Also demonstrates how
    to toggle Student session to read-only mode.
- professorowl-screenrc - screen config file used to bootstrap ProfessorOwl.
- say.sh - script interface to tmux display-message command.
- start_server.sh - starts up the initial tmux session.

### Placeholders

These are scripts I haven't yet written, but have file placeholders.

- control.sh - runs demo.sh
- tmux-adm.sh - meant to be run after the initial session has been created by
    start_server.sh.
- tmux-ro.sh - runs gotty which spawns a new read-only client that connects 
    to the tmux session.


## Hackday related

These scripts were used to archive the hackday process by timelapsing desktop 
screencaps. I should move these into their own repo...

- timelapse_desktop.sh - OSX only, grabs the desktop every 60 seconds and 
    saves as a datetime stamped png.
- image2video.sh - Converts images into a mpeg4 video. I've tried to add a 
    delay, but it appears to be ignored by imagemagick's convert.

