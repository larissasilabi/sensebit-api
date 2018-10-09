@echo off
pscp -i ../../sensebit-misc/keypair.ppk -r ../package.json ubuntu@ec2-54-218-9-199.us-west-2.compute.amazonaws.com:/var/www/api
pscp -i ../../sensebit-misc/keypair.ppk -r ../start-release.json ubuntu@ec2-54-218-9-199.us-west-2.compute.amazonaws.com:/var/www/api
pscp -i ../../sensebit-misc/keypair.ppk -r ../server/* ubuntu@ec2-54-218-9-199.us-west-2.compute.amazonaws.com:/var/www/api/server
pscp -i ../../sensebit-misc/keypair.ppk -r ../common/* ubuntu@ec2-54-218-9-199.us-west-2.compute.amazonaws.com:/var/www/api/common
