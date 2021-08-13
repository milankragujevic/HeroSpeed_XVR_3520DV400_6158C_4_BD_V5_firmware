#!/bin/sh

test -e /data/mac.txt

if [ $? == 0 ];then
    mac=`cat /data/mac.txt`
else
   echo "no file: /data/mac.txt"
   exit 1;
fi

ifconfig eth0 down
ifconfig eth0 hw ether $mac
ifconfig eth0 up
