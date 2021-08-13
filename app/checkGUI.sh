#/bin/sh

sleep 30

while :
do
gui_pid=`ps | grep -v grep | grep "main_gui" | awk '{print $1}'`
if [ -z $gui_pid ] ; then
   echo    "there   isn't   gui   process!"
   cd /app/minigui/
   ./main_gui &
fi

sleep 5

done;


