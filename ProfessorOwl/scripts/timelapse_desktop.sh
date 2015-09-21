#!/usr/bin/env bash
# reference for splicing caps into video https://gist.github.com/booyaa/5991347
SCREENCAP_NO_SOUND=-x
SCREENCAP_NO_DELAY=-T0
SCREENCAP_OPTS="${SCREENCAP_NO_SOUND} ${SCREENCAP_NO_DELAY}"
SLEEP_IN_SECONDS=60

while true
do
  # who has two thumbs and forgot to put the date string eval in the loop?
  DATE_STAMP=$(date +"%Y%m%d-%H%M")
  SAVE_TO=~/Desktop/dockerhackday/
  FILE_NAME=${SAVE_TO}${DATE_STAMP}.png
  screencapture ${SCREENCAP_OPTS} ${FILE_NAME}
  echo sleeping for ${SLEEP_IN_SECONDS} seconds
  sleep ${SLEEP_IN_SECONDS}
done
