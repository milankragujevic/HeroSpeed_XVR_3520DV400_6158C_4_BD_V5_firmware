#!/bin/sh

sata=`cat /tmp/hdd.txt | awk '{print $2}'`
usb=`cat /tmp/usb.txt | awk '{print $2}'`
iostat -d $sata $usb -k -t 1

