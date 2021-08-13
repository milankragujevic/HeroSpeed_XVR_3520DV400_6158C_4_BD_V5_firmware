#!/bin/sh

#mount -t squashfs /dev/mtdblock3 /app/
#if [ $? != 0 ];then
#	sleep 10
#	mount -t squashfs /dev/mtdblock3 /app/
#fi
#mount -t squashfs /dev/mtdblock4 /www/
#if [ $? != 0 ];then
#	sleep 10
#	mount -t squashfs /dev/mtdblock4 /www/
#fi
mount -t jffs2 /dev/mtdblock4 /data/
if [ $? != 0 ];then
	sleep 10
	mount -t jffs2 /dev/mtdblock4 /data/
fi
mount /data/config /config
if [ $? != 0 ];then
	sleep 10
	mount /data/config /config
fi


ifconfig eth0 192.168.1.168
ifconfig lo up
#**PPPOE**#
#mkdir /var/run
cp /app/resolv.conf    /var/  -fv
#cp /etc/adsl-bak/ppp /var -fr   #yl


set_path_before()
{
	        [ -d $1 ] && PATH="$1:$PATH"
}
PATH="/usr/bin:/usr/sbin:/bin:/sbin:/app/bin"
set_path_before /usr/local/sbin
set_path_before /usr/local/bin
#LD_LIBRARY_PATH="/usr/local/lib:/usr/lib"
export PATH
#export LD_LIBRARY_PATH
export QT_PATH=/qt
export DIRECTFB_PATH=$QT_PATH/directfb
export LD_LIBRARY_PATH=$DIRECTFB_PATH/lib:$DIRECTFB_PATH/lib/directfb-1.5-0/inputdrivers:$DIRECTFB_PATH/lib/directfb-1.5-0/interfaces/IDirectFBFont:$DIRECTFB_PATH/lib/directfb-1.5-0/interfaces/IDirectFBImageProvider:$DIRECTFB_PATH/lib/directfb-1.5-0/interfaces/IDirectFBVideoProvider:$DIRECTFB_PATH/lib/directfb-1.5-0:$DIRECTFB_PATH/lib/directfb-1.5-0/systems:$DIRECTFB_PATH/lib/directfb-1.5-0/wm:/$QT_PATH/lib:/usr/local/lib:/usr/lib:/app/lib
#/app/bin/initf&
echo 1024 > /proc/sys/vm/min_free_kbytes
echo 100 > /proc/sys/vm/dirty_writeback_centisecs
echo 5 > /proc/sys/vm/dirty_background_ratio
echo 10 > /proc/sys/vm/dirty_ratio
echo 0 > /proc/sys/vm/swappiness
echo 200 > /proc/sys/vm/dirty_writeback_centisecs
echo 600 > /proc/sys/vm/dirty_expire_centisecs
echo 200 > /proc/sys/vm/vfs_cache_pressure
echo 3 > /proc/sys/vm/drop_caches;

mkdir /dev/fb
ln -sf /dev/fb0 /dev/fb/0 
ln -sf /dev/fb3 /dev/fb/1 
#ln -sf  /dev/input/mouse0 /dev/mouse0
ln -sf  /dev/input/mice /dev/mouse0
export DFBARGS=module-dir=$DIRECTFB_PATH/lib/directfb-1.5-0
export QT_QWS_FONTDIR=$QT_PATH/fonts
# ANSI COLORS

NORMAL=""
RED=""
GREEN=""
YELLOW=""
BLUE=""
MAGENTA=""
CYAN=""
WHITE=""
umask 022
echo "${GREEN}Welcome to HiLinux.${NORMAL}"

#P2P端需求修改以下TCP参数 原历史数据 120 2 1  //2019.2.13
echo " app start "
echo 300 > /proc/sys/net/ipv4/tcp_keepalive_time
echo 2 > /proc/sys/net/ipv4/tcp_keepalive_intvl
echo 3 > /proc/sys/net/ipv4/tcp_keepalive_probes

ntpd -l &

sh /app/bin/md5_check.sh
#alarm_out_num=`cat /config/config.dat | grep ALARM_OUT_NUM | awk '{print $2}' -F "="`;
#if [ $alarm_out_num == 250 ];then 
test -e /data/1
if [ $? = 0 ];then
   #PrintfEn
   telnetd & 
#else
#    sh /app/telnet.sh & 
fi


#加载驱动
cd /root/ko
./load3521d -i
echo "=== Init OK ==="


#debug shell
test -e /data/debug.sh
if [ $? = 0 ];then
sh /data/debug.sh &
else
/app/appStart.sh &
fi

