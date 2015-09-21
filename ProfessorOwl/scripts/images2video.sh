#!/usr/bin/env bash
SCREENCAPS_DIR=~/Desktop/dockerhackday
DATE_STAMP_MASK=$(date +"%Y%m%d")
# DATE_STAMP_MASK=$1
IMAGE_COUNT=$(ls $SCREENCAPS_DIR/$DATE_STAMP_MASK-*.png | wc -l)
DATE_STAMP_DIR=$SCREENCAPS_DIR/$DATE_STAMP_MASK
mkdir -p $DATE_STAMP_DIR/temp
mv $SCREENCAPS_DIR/$DATE_STAMP_MASK*.png $DATE_STAMP_DIR/
convert -delay 4 $DATE_STAMP_DIR/$DATE_STAMP_MASK-*.png $DATE_STAMP_DIR/temp/%05d.jpg
ffmpeg -i $DATE_STAMP_DIR/temp/%05d.jpg -c:v libx264 -vf fps=25 -pix_fmt yuv420p $SCREENCAPS_DIR/dockerhackday-$DATE_STAMP_MASK.mp4

# reference
# convert -delay 4 20150916-*.png temp/%05d.jpg
# ffmpeg -i temp/%05d.jpg -c:v libx264 -vf fps=25 -pix_fmt yuv420p output.mp4
