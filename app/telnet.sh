#/bin/sh

telnet_enable()
{
	if [ $1 = 1 ];then
		mba=`cat $2/telnet.dat`
		mda=`cat /app/telnet.dat`
		
		if [ "$mba" = "$mda" ];then
			telnet=`ps | grep -v grep | grep "telnetd" | awk '{print $1}'`
			if [ -z "$telnet" ];then
				telnetd &
				echo "open telnet"
			fi
		fi
		
		if [ "$mba" != "$mda" ];then
			echo "can not open telnet,please check the code"
		fi
	fi
	
	if [ $1 = 0 ];then
		telnet=`ps | grep -v grep | grep "telnetd" | awk '{print $1}'`
		if [ -n "$telnet" ];then
			killall telnetd 
			echo "close telnet"
		fi
	fi

}


while :
do
enable=0
usb=/usb/usb0000
#########################################
if [ $enable = 0 ];then
	test -e /usb/usb0000/telnet.dat
	if [ $? = 0 ];then
		enable=1
		usb=/usb/usb0000
	fi
fi
#########################################
if [ $enable = 0 ];then
	test -e /usb/usb0001/telnet.dat
	if [ $? = 0 ];then
		enable=1
		usb=/usb/usb0001
	fi
fi
#########################################
if [ $enable = 0 ];then
	test -e /usb/usb0002/telnet.dat
	if [ $? = 0 ];then
		enable=1
		usb=/usb/usb0002
	fi
fi
#########################################
if [ $enable = 0 ];then
	test -e /usb/usb0003/telnet.dat
	if [ $? = 0 ];then
		enable=1
		usb=/usb/usb0003
	fi
fi
#########################################
telnet_enable $enable $usb

sleep 5
done
