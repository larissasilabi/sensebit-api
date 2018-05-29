#/bin/bash
scp -Cp -o StrictHostKeyChecking=no -i $1 -r ../package.json ubuntu@gcpvm-api-dev.disputeclick.com.br:/var/www/api
scp -Cp -o StrictHostKeyChecking=no -i $1 -r ../start-release.json ubuntu@gcpvm-api-dev.disputeclick.com.br:/var/www/api
scp -Cp -o StrictHostKeyChecking=no -i $1 -r ../server/* ubuntu@gcpvm-api-dev.disputeclick.com.br:/var/www/api/server
scp -Cp -o StrictHostKeyChecking=no -i $1 -r ../common/* ubuntu@gcpvm-api-dev.disputeclick.com.br:/var/www/api/common
