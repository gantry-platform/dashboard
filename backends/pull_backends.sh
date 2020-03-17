#!/bin/sh
echo "updating submodules ......"
git submodule update --remote

while read d branch swagger
do
    echo "====================================="
    echo "[repo: $d / branch: $branch]"
    pushd $d
        echo "git checkout $branch branch ......"
        git fetch
        git checkout $branch

        echo "git pull $branch branch ......"
        git pull origin $branch

        echo "updating swagger yaml ......"
        cp -f "./$swagger.yml" "../$swagger.yml"
    popd
    echo "====================================="
done < backends_repos.txt