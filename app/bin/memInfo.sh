

name1=demo
name2=main_gui
count=0

while true
do

day=`date -I`;
tmp=`uptime`;
time=`echo ${tmp%up*}`;
daytime=`echo $day $time`;

tmp=`echo ${tmp#*up}`;
tmp=`echo ${tmp%load*}`;
runtime=`echo ${tmp%,}`;

MemTotal=`cat /proc/meminfo | grep "MemTotal" | awk '{ print $2 $3 }'`;
MemFree=`cat /proc/meminfo | grep "MemFree" | awk '{ print $2 $3 }'`;
Cached=`cat /proc/meminfo | grep "^Cached" | awk '{ print $2 $3 }'`;

pid1=`ps | grep -v grep | grep $name1 | awk '{print $1}'`;
VmSize1=`cat /proc/$pid1/status | grep "VmSize" | awk '{ print $2 $3 }'`;
VmRSS1=`cat /proc/$pid1/status | grep "VmRSS" | awk '{ print $2 $3 }'`;
thread1=`ls /proc/$pid1/task/ | wc -l`;

pid2=`ps | grep -v grep | grep $name2 | awk '{print $1}'`;
VmSize2=`cat /proc/$pid2/status | grep "VmSize" | awk '{ print $2 $3 }'`;
VmRSS2=`cat /proc/$pid2/status | grep "VmRSS" | awk '{ print $2 $3 }'`;
thread2=`ls /proc/$pid2/task/ | wc -l`;

if [ $count = 0 ];then
	printf "\n\n%19s | %19s | %10s | %10s | %10s | %8s | %10s | %10s | %6s | %8s | %10s | %10s | %6s\n" "NowTime" "RunTime" "MemTotal" "MemFree" "MemCached" "Name" "VMSize" "VMRss" "Thread" "Name" "VMSize" "VMRss" "Thread" 
fi
printf "%19s | %19s | %10s | %10s | %10s | %8s | %10s | %10s | %6s | %8s | %10s | %10s | %6s\n" "$daytime" "$runtime" "$MemTotal" "$MemFree" "$Cached" "$name1" "$VmSize1" "$VmRSS1" "$thread1" "$name2" "$VmSize2" "$VmRSS2" "$thread2"

sleep 10;

let "count+=1";
if [ $count = 5 ];then
	count=0;	
fi

done
