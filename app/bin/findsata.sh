#!/bin/sh 

####################sata
	#find /sys/devices/platform/ahci.0/ | awk '/capability/ { print }' | awk -F '\/' '{ print $9 " " $11 }' > /tmp/hdd.txt
	find /sys/devices/soc/11010000.sata/ | awk '/capability/ { print }' | awk -F '\/' '{ print $9 " " $11 }' > /tmp/hdd.txt

SIZE=0	
SATA_NAME=0		
#SIZE_PATH=`find /sys/devices/platform/ahci.0/ | awk -F 'capa' '/capability/ { print $1"size" }'`
SIZE_PATH=`find /sys/devices/soc/11010000.sata/ | awk -F 'capa' '/capability/ { print $1"size" }'`

	echo "">/tmp/diskSize.txt
	for i in $SIZE_PATH; do
		echo ${i}	
		SATA_NAME=`echo ${i} | awk -F '\/' '{ print "/dev/"$11 }'`
		SIZE=`cat ${i}`
		SIZE=`expr $SIZE \* 512`
		echo $SATA_NAME" "$SIZE >> /tmp/diskSize.txt
	done	

##########################usb
	#find /sys/devices/platform/hiusb-*/ | awk '/capability/ { print }' | awk -F '\/' '{ print $8 " " $13 }' > /tmp/usb.txt
	find /sys/devices/soc/*.*hci/ | awk '/capability/ { print }'  | awk -F '\/' '{ print $8 " " $13 }' > /tmp/usb.txt

SIZE=0	
SATA_NAME=0		
#SIZE_PATH=`find /sys/devices/platform/hiusb-*/ | awk -F 'capa' '/capability/ { print $1"size" }'`
SIZE_PATH=`find /sys/devices/soc/*.*hci/ | awk -F 'capa' '/capability/ { print $1"size" }'`

	echo "">/tmp/usbSize.txt
	for i in $SIZE_PATH; do
		echo ${i}	
		SATA_NAME=`echo ${i} | awk -F '\/' '{ print "/dev/"$14 }'`
		SIZE=`cat ${i}`
		SIZE=`expr $SIZE \* 512`
		echo $SATA_NAME" "$SIZE >> /tmp/usbSize.txt
	done	

##################merge

	cat /tmp/hdd.txt /tmp/usb.txt > /var/hdd.txt
	cat /tmp/diskSize.txt /tmp/usbSize.txt > /var/diskSize.txt


	
