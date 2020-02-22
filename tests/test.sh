# quick end-point exercise

clear
echo Quick DARRT Library end-point exercise 
echo ======================================
date

echo 
echo curl http://localhost:8181/
curl http://localhost:8181/

echo 
echo curl http://localhost:8181/list/
curl http://localhost:8181/list/ 

echo 
echo curl http://localhost:8181/filter?status=active
curl http://localhost:8181/filter?status=active

echo 
echo curl http://localhost:8181/ -X POST -d "id=q1w2e3r4&status=pending&email=test@example.org"
curl http://localhost:8181/ -X POST -d "id=q1w2e3r4&status=pending&email=test@example.org"

echo 
echo curl http://localhost:8181/q1w2e3r4 -X PUT -d "givenName=Mike&familyName=Mork&telephone=123-456-7890"
curl http://localhost:8181/q1w2e3r4 -X PUT -d "givenName=Mike&familyName=Mork&telephone=123-456-7890"

echo 
echo curl http://localhost:8181/status/q1w2e3r4 -X PATCH -d"status=active"
curl http://localhost:8181/status/q1w2e3r4 -X PATCH -d"status=active"

echo 
echo curl http://localhost:8181/q1w2e3r4 -X DELETE
curl http://localhost:8181/q1w2e3r4 -X DELETE

#
# EOF
#

