#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../
. $DIR/vars.sh
docker push $db_imagename:$branch
docker push $app_imagename:$branch
#git push origin $branch