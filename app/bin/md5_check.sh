#!/bin/sh

test -e /config/system.db
if [ $? != 0 ];then
    echo "######## be the first init! ########";
    md5sum /dev/mtdblock1 > /config/md5rec/COREMD5_R;
    md5sum /dev/mtdblock2 > /config/md5rec/BASEMD5_R;
    md5sum /dev/mtdblock3 > /config/md5rec/LOGOMD5_R;
    md5sum /dev/mtdblock0 > /config/md5rec/UBOOTMD5_R;
else
   echo "######## not the first init! ########"
   
   test -e /config/md5rec/COREMD5_R
   if [ $? != 0 ];then
       echo "######## update the COREMD5_R! ########";
       md5sum /dev/mtdblock1 > /config/md5rec/COREMD5_R;
   fi
   
   test -e /config/md5rec/BASEMD5_R
   if [ $? != 0 ];then
       echo "######## update the BASEMD5_R! ########";
       md5sum /dev/mtdblock2 > /config/md5rec/BASEMD5_R;
   fi

   test -e /config/md5rec/LOGOMD5_R
   if [ $? != 0 ];then
       echo "######## update the LOGOMD5_R! ########";
       md5sum /dev/mtdblock3 > /config/md5rec/LOGOMD5_R;
   fi

   test -e /config/md5rec/UBOOTMD5_R
   if [ $? != 0 ];then
       echo "######## update the UBOOTMD5_R! ########";
       md5sum /dev/mtdblock0 > /config/md5rec/UBOOTMD5_R;
   fi   
fi
