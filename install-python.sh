#!/bin/bash

su jenkins

apt-get update
out_put=$?

if [ $out_put -eq 0 ]
then
   apt-get -y upgrade
   apt-get -y install software-properties-common
   add-apt-repository -y ppa:deadsnakes/ppa
   apt-get update
   apt-get -y install python3.7

   apt-get -y install python3-pip

   pip install requests
   pip install json
   pip install sys
   
   echo 'Done Python Setup!'