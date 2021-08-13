#/bin/sh

# 默认设置一个无效的路径
echo "/NULL/NULL/core" > /proc/sys/kernel/core_pattern
ulimit -c unlimited

# IPEYE
app_min_pid=`pidof app_min_v500`
#echo "ipeye pid: $app_min_pid"
if [ -z $app_min_pid ] ; then
	killall -9 app_min_v500
	echo   "there   isn't   app_min_v500   process!"
	/app/bin/app_min_v500 &
	sleep 2
fi

demo_pid=`pidof demo`
#echo "demo pid: $demo_pid"
if [ -z $demo_pid ] ; then
	killall -9 demo main_gui
	killall -9 demo main_gui
	echo   "there   isn't   demo   process!"
	sh /app/bin/MacSet.sh
	ulimit -s 4096
	/app/bin/demo &
	sleep 30
fi

# 检测是否需要开启coredump，是则开启并返回1，否则返回0
check_and_enable_coredump()
{
	for i in 0 1 2 3 4 5 6 7; do
		usb_dir="/usb/usb000$i"
		#echo "check $usb_dir/xvr_enable_coredump"
		if [ -f "$usb_dir/xvr_enable_coredump" ]; then
			echo "enable coredump and set dump path to $usb_dir"
			kd # 关闭看门狗
			echo "1" > /proc/sys/kernel/core_uses_pid
			echo "$usb_dir/core-%e-%p-%t" > /proc/sys/kernel/core_pattern
			return 1
		fi
	done

	return 0
}

coredump_enabled=0 # 是否已开启coredump

while :
do

if [ $coredump_enabled -ne 1 ]; then
	#echo "check if enable coredump"
	check_and_enable_coredump
	coredump_enabled=$?
fi

#echo "check IPEye"
app_min_pid=`pidof app_min_v500`
if [ -z "$app_min_pid" ] ; then
	killall -9 app_min_v500
	echo   "there   isn't   app_min_v500   process!"
	/app/bin/app_min_v500 &
	sleep 2
fi

#echo "check demo"
demo_pid=`pidof demo`
#echo "demo pid: $demo_pid"
if [ -z $demo_pid ] ; then
	echo   "there   isn't   demo   process!"
	echo "coredump_enabled: $coredump_enabled"
	if [ $coredump_enabled -eq 1 ]; then
		# 此时coredump已完成
		sync
		echo "demo has crashed, please check the coredump file in the USB drive"
	fi
	echo "Rebooting system"
	reboot
fi

#echo "check free mem"
free=`free | grep "Mem:" | awk '{print $4}'`
if [ $free -lt 15360 ] ; then 
	echo "memory is less"
	echo $free
	sync;
	echo 3 > /proc/sys/vm/drop_caches;
fi

sleep 5


done;


