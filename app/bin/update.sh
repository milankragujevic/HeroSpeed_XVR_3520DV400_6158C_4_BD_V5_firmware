#!/bin/sh

echo 0 > /tmp/update.txt

sleep 1
echo "UUUUUUUUUUUUUUUUUUUUUU update system UUUUUUUUUUUUUUUUUUUUUU"

#MOUNT_PATH=$1
UPDATA_PATH=$1

DBG_LOG_DEVICE=/dev/null

REBOOT=false
SKIPFWCHECK=true
#DEVICE_ALIAS=`cat /proc/gxvboard/dev_info/dev_id 2> ${DBG_LOG_DEVICE}|tr -d '[A-Z]' '[a-z]' |tr -d '-'`
CPU_TYPE=`cat /config/config.dat | grep CPU_TYPE | awk '{print $2}' -F"="`
if  [ ${CPU_TYPE} -eq 26 ];then
	DEVICE_ALIAS=XVR_3520DV400;
else
    echo "##now we do not support the device update, CPU_TYPE = ${CPU_TYPE}##";
	exit 1;
fi
echo "CPU_TYPE=${CPU_TYPE}";

AD_TYPE=`cat /config/config.dat | grep AD_TYPE | awk '{print $2}' -F"="`
if [ ${AD_TYPE} -eq 25 ];then
	DEVICE_ALIAS=$DEVICE_ALIAS"_6158C_4_BD_V5";
else
    echo "#############now we do not support the device updat, AD_TYPE = ${AD_TYPE}e###########";
	exit 1;
fi

echo "AD_TYPE=${AD_TYPE}";

#DEVICE_ALIAS=HI3531
FW_DOWNLOAD_PIPE=/tmp/fw_down
PROG_STOPPED=false
SETZERO=0
UPDATE_LOCAL_VERSION=false
LOCAL_VERSION_FILE="/data/version"

UBOOT_IMAGE="UBOOT"
CORE_IMAGE="CORE"
BASE_IMAGE="BASE"
LOGO_IMAGE="LOGO"
UPGRADE_BUFFER="Buffer"


CORE_MASK_BIT=1
BASE_MASK_BIT=2
LOGO_MASK_BIT=4
UBOOT_MASK_BIT=8



stop_prog() {
    if [ "$PROG_STOPPED" = "false" ]; then

        PROG_STOPPED=true
	echo -n stop_prog
	echo "provision killapp ..........."
    fi
}

check_ongoing_call_status () {
    TIME_OUT=1  #45 minutes
    local i=1

    while [ "$i" -ge 1 -a "$i" -le $TIME_OUT ]
    do
        i=$(($i+1))
        save_msg "Waiting ongoing calls to finish..."
        sleep 5 2> ${DBG_LOG_DEVICE} 
    done

    return 0
}

syslog() {
        echo $* > ${DBG_LOG_DEVICE}
}

save_msg() {
    syslog $*
}


cd ${UPDATA_PATH}

app=`ps | grep -v grep | grep "appStart.sh" | awk '{print $1}'`
if [ -n $app ] ; then
kill -9 $app
fi
killall -9 appStart.sh

gui=`ps | grep -v grep | grep "checkGUI.sh" | awk '{print $1}'`
if [ -n $gui ] ; then
kill -9 $gui
fi

killall -9 checkGUI.sh

#check version
full_image_filename="${DEVICE_ALIAS}version"
version_remote_file="${UPDATA_PATH}/version"

. $version_remote_file

COREMD5_S=`echo $COREMD5|cut -c1-32`
BASEMD5_S=`echo $BASEMD5|cut -c1-32`
LOGOMD5_S=`echo $LOGOMD5|cut -c1-32`
UBOOTMD5_S=`echo $UBOOTMD5|cut -c1-32`

echo "COREMD5_S = $COREMD5_S"
echo "BASEMD5_S = $BASEMD5_S"
echo "LOGOMD5_S = $LOGOMD5_S"
echo "UBOOTMD5_S = $UBOOTMD5_S"

COREMD5_R=`cat /config/md5rec/COREMD5_R |cut -c1-32`
BASEMD5_R=`cat /config/md5rec/BASEMD5_R|cut -c1-32`
LOGOMD5_R=`cat /config/md5rec/LOGOMD5_R|cut -c1-32`
UBOOTMD5_R=`cat /config/md5rec/UBOOTMD5_R|cut -c1-32`

COREMD5_N=`md5sum /dev/mtdblock1 |cut -c1-32`
BASEMD5_N=`md5sum /dev/mtdblock2 |cut -c1-32`
LOGOMD5_N=`md5sum /dev/mtdblock3 |cut -c1-32`
UBOOTMD5_N=`md5sum /dev/mtdblock0 |cut -c1-32`

echo "#############MD5 CMP BEGIN############"
echo "COREMD5:  R = $COREMD5_R,  N = $COREMD5_N"
echo "BASEMD5:  R = $BASEMD5_R,  N = $BASEMD5_N"
echo "LOGOMD5:  R = $LOGOMD5_R,  N = $LOGOMD5_N"
echo "UBOOTMD5: R = $UBOOTMD5_R, N = $UBOOTMD5_N"
echo "#############MD5 CMP END############"

if [ -f $LOCAL_VERSION_FILE ]
then	
	. $LOCAL_VERSION_FILE
	COREMD5_D=`echo $COREMD5|cut -c1-32`
	BASEMD5_D=`echo $BASEMD5|cut -c1-32`
	LOGOMD5_D=`echo $LOGOMD5|cut -c1-32`
	UBOOTMD5_D=`echo $UBOOTMD5|cut -c1-32`
	echo "COREMD5:  D = $COREMD5_D    S = $COREMD5_S"
	echo "BASEMD5:  D = $BASEMD5_D    S = $BASEMD5_S"
	echo "LOGOMD5:  D = $LOGOMD5_D    S = $LOGOMD5_S"
	echo "UBOOTMD5: D = $UBOOTMD5_D   S = $UBOOTMD5_S"

	echo "UBOOTMD5_D =$UBOOTMD5_D"
	retVersion=0

	if [ $COREMD5_S != $COREMD5_D ];then
		retVersion=$(($retVersion+1))
	fi

	if [ $BASEMD5_S != $BASEMD5_D ];then
		retVersion=$(($retVersion+2))
	fi

	if [ $LOGOMD5_S != $LOGOMD5_D ];then
		retVersion=$(($retVersion+4))
	fi

	if [ $UBOOTMD5_S != $UBOOTMD5_D ];then
		retVersion=$(($retVersion+8))
	fi

	if [ $COREMD5_R != $COREMD5_N ];then
		retVersion=$((${retVersion} | ${CORE_MASK_BIT}));
	fi

	if [ $BASEMD5_R != $BASEMD5_N ];then
		retVersion=$((${retVersion} | ${BASE_MASK_BIT}));
	fi

	if [ $LOGOMD5_R != $LOGOMD5_N ];then
		retVersion=$((${retVersion} | ${LOGO_MASK_BIT}));
	fi

	if [ $UBOOTMD5_R != $UBOOTMD5_N ];then
		retVersion=$((${retVersion} | ${UBOOT_MASK_BIT}));
	fi

#For upgrade all
	echo "retVersion = $retVersion"
	if [ $retVersion -gt $SETZERO ]
	then
		echo "provision killapp ...... "
		#REBOOT=true;	# add by lwx, if have upgrade, must reboot system 
	else
		echo "FW is not valid for upgrade, or same version"
		echo 4 > /tmp/update.txt
		sleep 5
		reboot
		sleep 3
		reboot
		exit 1
	fi

else
	retVersion=63 
	echo "provision killapp ...... "
fi

cd ${UPDATA_PATH}/

updateStatus=0


#echo "upgrate core ..."
full_image_filename=${firmware_prefix}${DEVICE_ALIAS}${CORE_IMAGE}.bin
local_file=`basename $full_image_filename`
full_image_filename=${full_image_filename}${firmware_postfix}
versionMask=$((${retVersion}&${CORE_MASK_BIT}))
echo $local_file
if [ $versionMask -eq $CORE_MASK_BIT ]
then
	echo "**************** UPDATE ${DEVICE_ALIAS}${CORE_IMAGE}.bin *****************"
	{
##		check_ongoing_call_status && 
		{			
			COREMD5_D=`md5sum ${UPDATA_PATH}/$local_file | awk '{printf $1}'`
			if [ $COREMD5_S = $COREMD5_D ]
			then						
  		 		stop_prog
       		 		#prompt upgrade info
		 		REBOOT=true
				UPDATE_LOCAL_VERSION=true

				#flash_eraseall  /dev/mtd1
				flashcp -v  ${UPDATA_PATH}/$local_file  /dev/mtd1
				updateStatus=$((${updateStatus}|${CORE_MASK_BIT}))
				rm -rf /config/md5rec/COREMD5_R
				echo "${DEVICE_ALIAS}${CORE_IMAGE}.bin"
			else
				echo "$full_image_filename md5 check error:"				
				echo "$COREMD5_S"
				echo "$COREMD5_D"
				echo "image is not valid for upgrade"
				echo 4 > /tmp/update.txt
				sleep 3
				reboot
				exit 1
			fi
		}
	}
	rm -f ${UPDATA_PATH}/$local_file
else
	echo "$full_image_filename is not valid for upgrade, or same version"
fi

echo 1 > /tmp/update.txt

echo "upgrate base ..."
full_image_filename=${firmware_prefix}${DEVICE_ALIAS}${BASE_IMAGE}.bin
local_file=`basename $full_image_filename`
full_image_filename=${full_image_filename}${firmware_postfix}
versionMask=$((${retVersion}&${BASE_MASK_BIT}))
echo $local_file
if [ $versionMask -eq $BASE_MASK_BIT ]
then
	echo "**************** UPDATE ${DEVICE_ALIAS}${BASE_IMAGE}.bin *****************"
	{
##		check_ongoing_call_status && 
		{			
			BASEMD5_D=`md5sum ${UPDATA_PATH}/$local_file | awk '{printf $1}'`
			if [ $BASEMD5_S = $BASEMD5_D ]
			then						
  		 		stop_prog
       		 		#prompt upgrade info
		 		REBOOT=true
				UPDATE_LOCAL_VERSION=true

				#flash_eraseall  /dev/mtd2
				flashcp -v  ${UPDATA_PATH}/$local_file  /dev/mtd2
				updateStatus=$((${updateStatus}|${BASE_MASK_BIT}))
				rm -rf /config/md5rec/BASEMD5_R
				echo "${DEVICE_ALIAS}${BASE_IMAGE}.bin"
			else
				echo "$full_image_filename md5 check error:"				
				echo "$BASEMD5_S"
				echo "$BASEMD5_D"
			fi
		}
	}
	rm -f ${UPDATA_PATH}/$local_file
else
	echo "$full_image_filename is not valid for upgrade, or same version"
fi

echo 2 > /tmp/update.txt

echo "upgrate logo ..."
full_image_filename=${firmware_prefix}${DEVICE_ALIAS}${LOGO_IMAGE}.bin
local_file=`basename $full_image_filename`
full_image_filename=${full_image_filename}${firmware_postfix}
versionMask=$((${retVersion}&${LOGO_MASK_BIT}))
echo $local_file
if [ $versionMask -eq $LOGO_MASK_BIT ]
then
	echo "************ UPDATE LOGO **************"
	{
	    {		
		LOGOMD5_D=`md5sum ${UPDATA_PATH}/$local_file | awk '{printf $1}'`
		if [ $LOGOMD5_S = $LOGOMD5_D ]
		then
			stop_prog
			#prompt upgrade info
			REBOOT=true
			UPDATE_LOCAL_VERSION=true

			#flash_eraseall  /dev/mtd5
			flashcp -v  ${UPDATA_PATH}/$local_file  /dev/mtd3
			updateStatus=$((${updateStatus}|${LOGO_MASK_BIT}))
			rm -rf /config/md5rec/LOGOMD5_R
		else
			echo "$full_image_filename md5 check error:"
			echo "$LOGOMD5_S"
			echo "$LOGOMD5_D"
		fi
	    }
	}
	rm -f ${UPDATA_PATH}/$local_file
else
	echo "$full_image_filename is not valid for upgrade, or same version"
fi

echo "upgrate uboot ..."
full_image_filename=${firmware_prefix}${DEVICE_ALIAS}${UBOOT_IMAGE}.bin
local_file=`basename $full_image_filename`
full_image_filename=${full_image_filename}${firmware_postfix}
versionMask=$((${retVersion}&${UBOOT_MASK_BIT}))
echo $local_file
if [ $versionMask -eq $UBOOT_MASK_BIT ]
then
	echo "************ UPDATE UBOOT **************"
	{
	    {		
		UBOOTMD5_D=`md5sum ${UPDATA_PATH}/$local_file | awk '{printf $1}'`
		if [ $UBOOTMD5_D ]; then
		echo "444444444444444444444  $UBOOTMD5_S   UBOOTMD5_D   $UBOOTMD5_D"
			if [ $UBOOTMD5_S = $UBOOTMD5_D ]
			then
				stop_prog
				#prompt upgrade info
				REBOOT=true
				UPDATE_LOCAL_VERSION=true

				#flash_eraseall  /dev/mtd0
				flashcp -v  ${UPDATA_PATH}/$local_file  /dev/mtd0
				updateStatus=$((${updateStatus}|${UBOOT_MASK_BIT}))
				rm -rf /config/md5rec/UBOOTMD5_R
			else
				echo "$full_image_filename md5 check error:"
				echo "$UBOOTMD5_S"
				echo "$UBOOTMD5_D"
			fi
		fi
	    }
	}
	rm -f ${UPDATA_PATH}/$local_file
else
	echo "$full_image_filename is not valid for upgrade, or same version"
fi


echo 3 > /tmp/update.txt
if [ $UPDATE_LOCAL_VERSION ]; then
	if [ ${updateStatus} -eq ${retVersion} ]; then
		echo "update version file !"
		cp $version_remote_file $LOCAL_VERSION_FILE -f
	fi
fi


if $PROG_STOPPED; then
    echo nothing to do 
fi

if $REBOOT; then
    check_ongoing_call_status && {
	    syslog "Reboot after provision" 
		cd /
		echo 4 > /tmp/update.txt
		sync;
		sleep 5
		reboot
    }
else
	syslog "No image upgraded"
	echo 4 > /tmp/update.txt
	sync;
	sleep 5
	reboot 
fi








