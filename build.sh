#!/usr/bin/env bash

cd frontend || exit
npm run build
cp dist/frontend/* ../backend/src/main/resources/static
cd ../backend || exit
mvn clean install
cd .. || exit
docker build -t navvis-poker-planning .
