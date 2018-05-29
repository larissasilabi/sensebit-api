@echo off
pscp -i ../../sensebit-misc/sensebit.ppk -r ../package.json ec2-52-38-128-216.us-west-2.compute.amazonaws.com:/var/www/api
pscp -i ../../sensebit-misc/sensebit.ppk -r ../start-release.json ec2-52-38-128-216.us-west-2.compute.amazonaws.com:/var/www/api
pscp -i ../../sensebit-misc/sensebit.ppk -r ../server/* ec2-52-38-128-216.us-west-2.compute.amazonaws.com:/var/www/api/server
pscp -i ../../sensebit-misc/sensebit.ppk -r ../common/* ec2-52-38-128-216.us-west-2.compute.amazonaws.com:/var/www/api/common
