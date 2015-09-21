#!/usr/bin/env bash
echo Starting tmux server
tmux new -A -s prowl docker-machine ssh dev
