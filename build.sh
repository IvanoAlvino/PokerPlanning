#!/usr/bin/env bash

cd backend || exit
mvn compile jib:build
