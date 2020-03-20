#!/bin/bash

# **************************************
# get postman collections & environments
#
# see "Design and Build Great Web APIs"
# 2020-04 : @mamund
#
# utility dependencies:
#   - curl
#   - jq
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
# share vars
apikey=$POSTMAN_KEY

title="Postman Collections and Environments"
svr="https://api.getpostman.com"

collfile="collection-list.json"
envfile="environment-list.json"
temp="_temp.json"

# **************************************
# heading
clear
echo $title
echo "===================================================="
date

# **************************************
# clean up
echo "Initializing..."
if [ -f "$collfile" ]
then
  rm $collfile
fi

if [ -f "$envfile" ]
then
  rm $envfile
fi

if [ -f "$temp" ]
then
  rm $temp
fi

# **************************************
# pull collection & environment info
echo "Pulling postman data..."
curl -s -X GET $svr/collections/ -H "X-Api-Key:$apikey" \
  -H "Cache-Control:no-cache" -o $temp
cat $temp | jq "." > $collfile

curl -s -X GET $svr/environments/ -H "X-Api-Key:$apikey" \
  -H "Cache-Control:no-cache" -o $temp
cat $temp | jq "." > $envfile

# **************************************
# clean up
if [ -f "$temp" ]
then
  rm $temp
fi

echo
echo "Run completed and saved to $collfile and $envfile."
echo

# **************************************
# EOF
# **************************************

