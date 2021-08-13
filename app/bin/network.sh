#!/bin/bash
# Almost everything of this is shamelessly copied from
# http://www.lugmen.org.ar/~conan/tmp/wmii/status

while true;
do
    RX0=`/bin/grep eth0 /proc/net/dev | tr ':' ' ' | awk {'print $2'}`
    TX0=`/bin/grep eth0 /proc/net/dev | tr ':' ' ' | awk {'print $10'}`
    sleep 1
    RX1=`/bin/grep eth0 /proc/net/dev | tr ':' ' ' | awk {'print $2'}`
    TX1=`/bin/grep eth0 /proc/net/dev | tr ':' ' ' | awk {'print $10'}`
    RX="$(((RX1-RX0)/1024*8))"
    TX="$(((TX1-TX0)/1024*8))"

    RX=`echo | awk "{print $RX/1024}"`
    TX=`echo | awk "{print $TX/1024}"`

    RX="RX `printf %0.2f $RX` Mb/s"
    TX="TX `printf %0.2f $TX` Mb/s"
    echo "$RX $TX"
done
