#!/bin/bash

# **************************************
# run a postman collection of tests
#
# see "Design and Build Great Web APIs"
# 2020-04 : @mamund
#
# assumes target API is up and running
#   and available at environment's URL
#
# utility dependencies:
#   - newman w/ htmlextra reporter
#   - curl
#
# **************************************

# **************************************
# load local env values
if [ ! -f "postman.env" ]
then
  echo "Set POSTMAN_KEY in postman.env file first."
  exit 1
fi

source postman.env

# **************************************
# set up local args
svr="https://api.getpostman.com"
apikey=$POSTMAN_KEY
envid="na"
arg="na"

# **************************************
# load loal config values
if [ ! -f "test-run.config" ]
then
  echo "Missing test-run.config"
  exit 1
fi

source test-run.config

# **************************************
# heading
echo 
echo $title
echo "===================================================="
date

# **************************************
# parse environment selection
# valid values:
#   "local" or "remote"
if [ -z "$1" ]
then
  echo "*** missing environment - job cancelled. ***"
  exit 1
fi

arg=$1

if [ "$arg" == "local" ]
then
  envid=$local_envid
fi

if [ "$arg" == "remote" ]
then
  envid=$remote_envid
fi

echo "Running $arg environment..."

# **************************************
# clean up
echo "Initializing..."
if [ -f "$testfile" ]
then
  rm $testfile
fi

if [ -f "$envfile" ]
then
  rm $envfile
fi

if [ -f "$outfile" ]
then
  rm $outfile
fi

if [ "$(ls -A newman)" ]
then
  rm newman/*
fi

# **************************************
# pull collection 
echo "Pulling postman data..."
curl -s -X GET $svr/collections/$collid -H "X-Api-Key:$apikey" \
  -H "Cache-Control:no-cache" -o $testfile
curl -s -X GET $svr/environments/$envid -H "X-Api-Key:$apikey" \
  -H "Cache-Control:no-cache" -o $envfile

# **************************************
# run the tests
echo "Running tests..."
if [ -z "$outfile" ]
then 
  newman run $testfile -e $envfile --bail -r cli,htmlextra
else
  newman run $testfile -e $envfile --bail -r cli,htmlextra > $outfile
fi

# **************************************
# check exist code
if [ $? -eq 1 ]
then 
  echo "One or more tests failed!"
  ex=1
else
  echo "All tests passed."
  ex=0
fi

# **************************************
# clean up
if [ -f "$envfile" ]
then
  rm $envfile
fi

if [ -f "$testfile" ]
then
  rm $testfile
fi

if [ ! -z "$outfile" ]
then
  echo
  echo "Test run completed and saved to $outfile."
fi

echo
exit $ex

# **************************************
# EOF
# **************************************

