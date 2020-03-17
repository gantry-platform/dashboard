#!/bin/bash
d='./src/app/restapi'

echo "deleting rest api directory ......"
rm -rf $d

for f in $(find backends -maxdepth 1 -name "*.yml");
do
    swaggerfilename=$(basename $f)
    filenameonly=${swaggerfilename%.*}
    ng-openapi-gen --input ./backends/${swaggerfilename} --output ./src/app/restapi/${filenameonly}
done
