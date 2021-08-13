#! /bin/sh

dir=/data/ipeye/
logo=IPEYE
vendor=IPEYE

if [ ! -d $dir ]; then
	mkdir -p $dir
fi

day=`date -I`;
tmp=`uptime`;
time=`echo ${tmp%up*}`;
daytime=`echo $day $time`;

streams=$1

if [ -z "$streams" ];then
	echo "[$daytime] ipeye stop !"
	killall -9 ipeye
else
	echo "[[$daytime]] ipeye start !"
	killall -9 ipeye
	RUNCMD="/app/bin/ipeye -config_dir=$dir -streams=$streams -streams_real_id=1 -streams_pair=1 -http_camera_mode=0 -vendor=$vendor -http_logo_text=$logo -enable_debug=1"
	echo "RUNCMD=$RUNCMD"
	$RUNCMD &
fi