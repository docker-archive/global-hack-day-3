#!/bin/bash
DIR="$(git rev-parse --show-toplevel)"
. $DIR/vars.sh
if [ "$(which tmux)" == "" ]; then
	tail -f $DIR/logz/*
else
	tmux new-session -s "logz" -d "cd $DIR && tail -f logz/$appname.$branch.access.log"
	tmux split-window -h "cd $DIR && tail -f logz/$appname.$branch.error.log"
	tmux -2 attach-session -d 
fi
