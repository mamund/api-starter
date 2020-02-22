#!/bin/bash

#######################################
# quick end-point test script
# 2020-02 mamund
#
# assumes:
# - npm run dev
# - curl
#
#######################################

#######################################
# kill associated procs when done
trap "kill 0" EXIT 

echo
echo "(QET) Quick Endpoint Tester"
echo "================================"
date

#######################################
# load array
declare -a req
req[0]="curl http://localhost:8181/" 
req[1]="curl http://localhost:8181/list/"
req[2]="curl http://localhost:8181/filter?status=active"
req[3]="curl http://localhost:8181/ -X POST -d id=q1w2e3r4&status=pending&email=test@example.org"
req[4]="curl http://localhost:8181/q1w2e3r4 -X PUT -d givenName=Mike&familyName=Mork&telephone=123-456-7890"
req[5]="curl http://localhost:8181/status/q1w2e3r4 -X PATCH -d status=active"
req[6]="curl http://localhost:8181/q1w2e3r4 -X DELETE"

#######################################
# start target service
echo
echo start API service...
npm run dev &

#######################################
# allow service to spin up
echo
echo sleeping...
sleep 5 

#######################################
# run requests
echo 
echo start request run...
for i in "${req[@]}" 
do 
  echo
  echo "$i" 
  $i
done

#######################################
# EOF
#######################################

