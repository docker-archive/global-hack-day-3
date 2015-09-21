#!/bin/bash

DIR=$(git rev-parse --show-toplevel)
source $DIR/vars.sh

servicename=$1
malleability=$2
containername=$project-$appname-$branch-$servicename
imagename=$imagebase-$servicename:$branch
IS_AMBASSADOR="$(jshon -e services -e $servicename -e ambassador -u < $appdef)"

if [ "$malleability" == "hard" ]; then
    docker run -P -d \
        --name $containername \
        --label io.sjc.orchestra.version="$ORCHESTRA_VERSION" \
        --label io.sjc.orchestra.project="$project" \
        --label io.sjc.orchestra.app.name="$appname" \
        --label io.sjc.orchestra.app.slug="$appslug" \
        --label io.sjc.orchestra.ref="$branch" \
        --label io.sjc.orchestra.service.name="$servicename" \
        --label io.sjc.orchestra.service.ambassador="$IS_AMBASSADOR" \
        --label io.sjc.orchestra.service.volumeMounted="no" \
        --name $containername \
        $imagename
else
    docker run -P -d \
        --name $containername \
        --label io.sjc.orchestra.version="$ORCHESTRA_VERSION" \
        --label io.sjc.orchestra.project="$project" \
        --label io.sjc.orchestra.app.name="$appname" \
        --label io.sjc.orchestra.app.slug="$appslug" \
        --label io.sjc.orchestra.ref="$branch" \
        --label io.sjc.orchestra.service.name="$servicename" \
        --label io.sjc.orchestra.service.ambassador="$IS_AMBASSADOR" \
        --label io.sjc.orchestra.service.volumeMounted="yes" \
        --name $containername \
        -v $DIR/services/$servicename:/usr/src/app \
        $imagename
fi
