#!/bin/sh

d='./src/app/restapi'
rm -rf $d

for f in $(find backends -maxdepth 1 -name "*.yml");
do
    swaggerfilename=$(basename $f)
    filenameonly=${swaggerfilename%.*}
    
    echo "openapi 3 generator ......"
    ng-openapi-gen --input ./backends/${swaggerfilename} --output ./src/app/restapi/${filenameonly}
done
