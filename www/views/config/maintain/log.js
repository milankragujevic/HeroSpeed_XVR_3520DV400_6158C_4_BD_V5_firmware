var logVariables={};var searchlog_page=0;var loginpsw=window.top.loginpsw;var bsearching=false;function onLoad(){initDot();setTitle(lang.optionloginfo);setConf("logExportEn",isXVR()||isNVR());var c=new Date();var a=new Date(c.getFullYear(),c.getMonth(),c.getDate());var b=new Date(c.getFullYear(),c.getMonth(),c.getDate(),23,59,59);$("#log_start_time").val(a.Format("yyyy-MM-dd hh:mm:ss"));$("#log_end_time").val(b.Format("yyyy-MM-dd hh:mm:ss"));load_device_time();$("#log_search").click(function(){load_log_search()});$("#log_delete").click(function(){call_log_delete()});$("#log_pre").click(function(){if(searchlog_page>0){searchlog_page--;$(".tablesearch").hide();for(k=0;k<8;k++){var d=searchlog_page*8+k;$("#nvr_logsearch_"+d).css("display","block")}}});$("#log_next").click(function(){var d=$(".tablesearch").size();if(searchlog_page>=0&&((searchlog_page+1)*8<=d)){searchlog_page++;$(".tablesearch").hide();for(k=0;k<8;k++){var e=searchlog_page*8+k;$("#nvr_logsearch_"+e).css("display","block")}}});if(getConf("logExportEn")){$("#log_export_all").show();$("#log_export").show()}$("#log_start_time,#log_end_time").Timepicker({timeFormat:"HH:mm:ss",dateFormat:"yy-mm-dd",showSecond:true,changeYear:true,changeMonth:true})}function load_device_time(){$("#log_start_time,#log_end_time").datetimepicker({timeFormat:"HH:mm:ss",dateFormat:"yy-mm-dd",showSecond:true,changeYear:true,changeMonth:true})}function call_log_delete(){if(!confirm(lang.clearalllog)){return}api.logManeger("delete",null,function(a,b){if(a!=CODE_SUCCESS){return}setTimeout(load_log_search(),10)})}function load_log_search(d,h){if(bsearching){return rightPopup(lang.logsearching)}if($("#log_start_time").val()==""||$("#log_end_time").val()==""){return rightPopup(lang.setTimeTips1)}var g=parseInt($("#log_start_time").val().replace(/-/g,"").replace(/\s/g,"").replace(/:/g,""));var b=parseInt($("#log_end_time").val().replace(/-/g,"").replace(/\s/g,"").replace(/:/g,""));if(g>=b){return rightPopup(lang.setTimeTips2)}bsearching=true;h||$("#logTab").html("");var j=$("#log_start_time").val();var f=j.split(" ");var a=f[0];var i=f[1];a=a.split("-");i=i.split(":");f=$("#log_end_time").val().split(" ");var e=f[0];var c=f[1];e=e.split("-");c=c.split(":");getLog($("#selectType").val(),function(r){bsearching=false;if(r.itemList.length===0){rightPopup(lang.lognologtip);return}var q="";for(var p=0;p<r.itemList.length;p++){var n=parseInt(r.itemList[p].idx)+1;var m=r.itemList[p].time;var s=get_mes_val(r.itemList[p].logId);var o=r.itemList[p].username;q=p%2==0?"tableeven":"tableodd";$("#logTab").append('<div class="tabler '+q+'"><span class="tablece" style="width:55px;">'+n+'</span><span class="tablece" style="width:145px;">'+m+'</span><span class="tablece" style="width:365px;">'+s+'</span><span class="tablece" style="width:105px;">'+o+"</span></div>")}var l=(369-(r.itemList[0].idx.length-1)*26)+"px";if(parseInt(l)>0){$("#logTab").append('<div class="tablebottom tableeven"><span class="tablece" style="width: 55px; height: '+l+';">&nbsp;</span><span class="tablece" style="width: 145px; height: '+l+';">&nbsp;</span><span class="tablece" style="width: 365px; height: '+l+';">&nbsp;</span><span class="tablece" style="width: 105px; height: '+l+';">&nbsp;</span></div>')}})}function getLog(d,g){var c=new Date($("#log_start_time").val().replace(/-/g,"/"));var e=new Date($("#log_end_time").val().replace(/-/g,"/"));var a=(c.getTime()-c.getTimezoneOffset()*60000)/1000,b=(e.getTime()-e.getTimezoneOffset()*60000)/1000;var f={type:parseInt(d),pageIndex:parseInt($("#logOffset").val()),pageItems:parseInt($("#logGetNum").val()),startTime:a+"",endTime:b+""};loading(true);api.logManeger(REQUEST_GET,f,function(h,i){if(h!=CODE_SUCCESS){bsearching=false;return}if(!i){rightPopup(lang.lognologtip);bsearching=false;return}g&&g(i)})}function get_mes_val(str){var ch=0,isMain=true;if(str.length>5){var val=eval(str);ch=(val>>24)&255;isMain=((val>>16)&255)===1;str="0x"+str.substr(-3)}var valuetran="";switch(str.substr(2,1)){case"1":switch(str.substr(2).substr(1)){case"01":valuetran=lang.logopendevie;break;case"02":valuetran=lang.logclosedevice;break;case"03":valuetran=lang.logrestartdevice;break;case"04":valuetran=lang.logsystemypdate;break;case"05":valuetran=lang.logrestore;break;default:break}break;case"2":switch(str.substr(2).substr(1)){case"01":valuetran=lang.loglogin;break;case"02":valuetran=lang.loglogout;break;case"03":valuetran=lang.logadduer;break;case"04":valuetran=lang.logdeleteuer;break;case"05":valuetran=lang.logmodifyuser;break;case"06":valuetran=lang.logadduergroup;break;case"07":valuetran=lang.logdeleteusergroup;break;case"08":valuetran=lang.logmodifyusergrop;break;default:break}break;case"3":switch(str.substr(2).substr(1)){case"01":valuetran=lang.logcommcfg;break;case"02":valuetran=lang.logrescom;break;case"03":valuetran=lang.logencode;break;case"04":valuetran=lang.logresencode;break;case"05":valuetran=lang.logrecordvideo;break;case"06":valuetran=lang.logresrecord;break;case"07":valuetran=lang.lognet;break;case"08":valuetran=lang.logresnet;break;case"09":valuetran=lang.logalarm;break;case"0a":valuetran=lang.logresalarm;break;case"0b":valuetran=lang.logmotiondet;break;case"0c":valuetran=lang.logresmotiondet;break;case"0d":valuetran=lang.logcruise1;break;case"0e":valuetran=lang.logrescruise;break;case"0f":valuetran=lang.logoutputmode;break;case"10":valuetran=lang.logresoutputmode;break;case"11":valuetran=lang.logchannel;break;case"12":valuetran=lang.logreschannel;break;case"13":valuetran=lang.logimagecol;break;case"14":valuetran=lang.logresimagecol;break;case"15":valuetran=lang.logpreview;break;case"16":valuetran=lang.logrespreview;break;case"17":valuetran=lang.logresusercfg;break;case"18":valuetran=lang.logsen;break;case"19":valuetran=lang.logressen;break;case"1a":valuetran=lang.logddns;break;case"1b":valuetran=lang.logsmtp;break;case"1c":valuetran=lang.logcloud;break;case"1d":valuetran=lang.logupnp;break;case"1e":valuetran=lang.logserial;break;case"1f":valuetran=lang.logserial;break;case"20":valuetran=lang.LOG_DDNS_DEFAULT;break;case"21":valuetran=lang.LOG_SMTP_DEFAULT;break;case"22":valuetran=lang.LOG_UPNP_DEFAULT;break;case"23":valuetran=lang.LOG_CRUISE_SETUP;break;case"24":valuetran=lang.LOG_CRUISE_DEFAULT;break;case"25":valuetran=lang.LOG_NTP_SETUP;break;case"26":valuetran=lang.LOG_NTP_DEFAULT;break;case"27":valuetran=lang.LOG_P2P_SETUP;break;case"28":valuetran=lang.LOG_P2P_DEFAULT;break;case"29":valuetran=lang.LOG_VEDIOOUTCOLOR_SETUP;break;case"2a":valuetran=lang.LOG_VEDIOOUTCOLOR_DEFAULT;break;case"2b":valuetran=lang.LOG_POLL_SETUP;break;case"2c":valuetran=lang.LOG_POLL_DEFAULT;break;case"2d":valuetran=lang.LOG_AUTOMAINTAIN_SETUP;break;case"2e":valuetran=lang.LOG_AUTOMAINTAIN_DEFAULT;break;case"2f":valuetran=lang.LOG_FTP_SETUP;break;case"30":valuetran=lang.LOG_FTP_DEFAULT;break;case"31":valuetran=lang.LOG_CLOUD_STORAGE_SETUP;break;case"32":valuetran=lang.LOG_CLOUD_STORAGE_DEFAULT;break;case"33":valuetran=lang.LOG_VOL_SETUP;break;case"34":valuetran=lang.LOG_CHANNEL_NAME_SETUP;break;case"35":valuetran=lang.LOG_CHANNEL_NAME_DEFAULT;break;case"36":valuetran=lang.LOG_PPPOE_SETUP;break;case"37":valuetran=lang.LOG_PPPOE_DEFAULT;break;case"38":valuetran=lang.LOG_OVERLAY_SETUP;break;case"3a":valuetran=lang.LOG_FACE_DETECT_SETUP;break;case"3b":valuetran=lang.LOG_REGIONAL_INVASION_SETUP;break;case"3c":valuetran=lang.LOG_CROSS_BORDER_SETUP;break;case"3d":valuetran=lang.LOG_SCENE_CHANGE_SETUP;break;case"3e":case"39":valuetran=lang.LOG_FACE_COMPARE_SETUP;break;case"3f":valuetran=lang.LOG_PEOPLE_STAY_DETECTION_SETUP;break;case"40":valuetran=lang.LOG_PEOPLE_GATHERING_DETECTION_SETUP;break;case"41":valuetran=lang.LOG_CHANNEL_DEV_NAME_SETUP;break;default:break}break;case"4":switch(str.substr(2).substr(1)){case"01":valuetran=lang.logup;break;case"02":valuetran=lang.logdown;break;case"03":valuetran=lang.logdiskformat;break;case"04":valuetran=lang.logdiskread;break;case"05":valuetran=lang.logdiskwrite;break;case"06":valuetran=lang.logvideobackup;break;case"07":valuetran=lang.LOG_OP_MANUAL_DEL_REC;break;default:break}break;case"5":switch(str.substr(2).substr(1)){case"01":valuetran=lang.logntp;break;case"02":valuetran=lang.logopendefend;break;case"03":valuetran=lang.logclosedefend;break;case"04":valuetran=lang.logopenvidereca;break;case"05":valuetran=lang.logclosevideoreca;break;case"06":valuetran=lang.logopenvideorecm;break;case"07":valuetran=lang.logclosevideorecm;break;case"08":valuetran=lang.logopenvideoreco;break;case"09":valuetran=lang.logclosevideoreco;break;case"0a":valuetran=lang.logopendhcp;break;case"0b":valuetran=lang.logmcfgnet;break;case"0c":valuetran=lang.logomovedec;break;case"0d":valuetran=lang.logcmovedec;break;case"0e":valuetran=lang.logobuzzer;break;case"0f":valuetran=lang.logcbuzzer;break;case"10":valuetran=lang.logolinkagerrec;break;case"11":valuetran=lang.logclinkagerec;break;case"12":valuetran=lang.logosenalarm;break;case"13":valuetran=lang.logcsenalarm;break;case"14":valuetran=lang.logoruise;break;case"15":valuetran=lang.logcruise2;break;case"16":valuetran=lang.logaddcruise;break;case"17":valuetran=lang.logdelcruise;break;case"18":valuetran=lang.logoscan;break;case"19":valuetran=lang.logcscan;break;case"1a":valuetran=lang.logoddns;break;case"1b":valuetran=lang.logoupnp;break;case"1c":valuetran=lang.logcupnp;break;case"1d":valuetran=lang.logop2p;break;case"1e":valuetran=lang.logcp2p;break;case"1f":valuetran=lang.logosmtp;break;case"20":valuetran=lang.logcsmtp;break;case"21":valuetran=lang.logosound;break;case"22":valuetran=lang.logcsound;break;case"23":valuetran=lang.LOG_STATUS_DDNS_OFF;break;case"24":valuetran=lang.LOG_STATUS_CLOUD_STRAGE_ON;break;case"25":valuetran=lang.LOG_STATUS_CLOUD_STRAGE_OFF;break;case"26":valuetran=lang.LOG_STATUS_EVENT_ON;break;case"27":valuetran=lang.LOG_STATUS_EVENT_OFF;break;case"28":valuetran=lang.LOG_STATUS_FTP_ON;break;case"29":valuetran=lang.LOG_STATUS_FTP_OFF;break;case"2a":valuetran=lang.LOG_STATUS_POLL_ON;break;case"2b":valuetran=lang.LOG_STATUS_POLL_OFF;break;case"2c":valuetran=lang.LOG_STATUS_PPPOE_ON;break;case"2d":valuetran=lang.LOG_STATUS_PPPOE_OFF;break;case"2e":valuetran=lang.LOG_STA_P2P_ONLINE;break;case"2f":valuetran=lang.LOG_STA_P2P_OFFLINE;break;default:break}break;case"6":switch(str.substr(2).substr(1)){case"01":valuetran=lang.lognodisk;break;case"02":valuetran=lang.logdiskfmtfail;break;case"03":valuetran=lang.logdiskfmfok;break;case"04":valuetran=lang.logdiskexc;break;case"05":valuetran=lang.logdiskspace;break;case"06":valuetran=lang.loggetencodefail;break;case"07":valuetran=lang.logsaveencodefail;break;case"08":valuetran=lang.logencodeexc;break;case"09":valuetran=lang.logdelalllog;break;case"0a":valuetran=lang.logrecerdexc;break;case"0b":valuetran=lang.logdisconnect;break;case"0c":valuetran=lang.logconnetok;break;case"0d":valuetran=lang.logipclash;break;case"0e":valuetran=lang.logmacclash;break;case"0f":valuetran=lang.logddnsfail;break;case"10":valuetran=lang.logddnsok;break;case"11":valuetran=lang.logntpupdatefail;break;case"12":valuetran=lang.logntpupdateok;break;case"13":valuetran=lang.logupnpfail;break;case"14":valuetran=lang.logupnpok;break;case"15":valuetran=lang.logemailsendfail;break;case"16":valuetran=lang.logemailsendok;break;case"17":valuetran=lang.logp2pconnectfail;break;case"18":valuetran=lang.logp2pconnectok;break;case"19":valuetran=lang.logfileupfail;break;case"1a":valuetran=lang.logfileupok;break;case"1b":valuetran=lang.logfiledownfail;break;case"1c":valuetran=lang.logfiledownok;break;case"1d":valuetran=lang.logsenalarm;break;case"1e":if(ch===0){valuetran=lang.logvideolost;break}if(isXVR()){valuetran="CH["+ch+"]"+(isMain?lang.mainStream:lang.childStream)+lang.logvideolost}else{valuetran="CH["+ch+"]"+lang.logvideolost}break;case"1f":valuetran=lang.logfilebackupfail;break;case"20":valuetran=lang.logunfinddev;break;case"21":valuetran=lang.lognoptz;break;case"22":valuetran=lang.logAlarmStart;break;case"23":if(isXVR()){valuetran="CH["+ch+"]"+(isMain?lang.mainStream:lang.childStream)+lang.videoLossRec}else{valuetran="CH["+ch+"]"+lang.videoLossRec}break;case"24":if(isXVR()){valuetran="CH["+ch+"]"+(isMain?lang.mainStream:lang.childStream)+lang.dropped}else{valuetran="CH["+ch+"]"+lang.dropped}break;case"25":valuetran="CH["+ch+"]"+lang.logmotion;break;case"26":valuetran="CH["+ch+"]"+lang.logmotionorsensor;break;case"27":valuetran="CH["+ch+"]"+lang.logmotionandsensor;break;case"28":valuetran="CH["+ch+"]"+lang.logface;break;case"29":valuetran="CH["+ch+"]"+lang.logintrusion;break;case"2a":valuetran="CH["+ch+"]"+lang.logcrossborder;break;case"2b":valuetran="CH["+ch+"]"+lang.logscenechange;break;case"2c":valuetran="CH["+ch+"]"+lang.loggoodslegacy;break;case"2d":valuetran="CH["+ch+"]"+lang.loggoodstake;break;case"2e":valuetran="CH["+ch+"]"+lang.logfacecompare;break;case"2f":valuetran="CH["+ch+"]"+lang.logpeoplestay;break;case"30":valuetran="CH["+ch+"]"+lang.logpeoplegathering;break;case"31":valuetran="CH["+ch+"]"+lang.logsmoke;break;case"32":valuetran="CH["+ch+"]"+lang.loginfrare;break;default:break}break}return valuetran}function get_tran_val(b){var a=b;if(a*1<10){a="0"+a*1}return a}function getExpContent(h){var a="\n";var d="\t";var g=lang.logNum+d+lang.logTime+d+lang.logEvent+d+lang.userName+a;h=h.split("<br>");for(var f=0;f<h.length;++f){if(!h[f]){break}var e=h[f].split(",");var b=[];for(var c=0;c<e.length;++c){if(c==0){b.push(parseInt(e[c].split("=")[1])+1)}else{b.push(e[c].split("=")[1])}}b[2]=get_mes_val(b[2]);g+=b.join(d)+a}g+=a;return g}function onBtnExpClk(){getLog($("#selectType").val(),function(d){var c=[];var b=d.itemList;for(var a=0;a<b.length;++a){c.push({idx:b[a].idx+1,time:b[a].time,logId:get_mes_val(b[a].logId),username:b[a].username})}doExpLog(c,"Loginfo.txt")})}function doExpLog(d,a){var c="";for(var b=0;b<d.length;b++){c+=[d[b]["idx"],d[b]["time"],d[b]["logId"],d[b].username].join("\t")+"\r\n"}createAndDownloadFile(a,c)}function onBtnExpAllClk(){loading(true);getLog(0,function(d){var c=[];var b=d.itemList;for(var a=0;a<b.length;++a){c.push({idx:b[a].idx+1,time:b[a].time,logId:get_mes_val(b[a].logId),username:b[a].username})}doExpLog(c,"Loginfo.txt")})}function createAndDownloadFile(i,l){try{var e=document.createElement("a");var h=new Blob([l]);if("msSaveOrOpenBlob" in navigator){window.navigator.msSaveOrOpenBlob(h,i)}else{e.href=URL.createObjectURL(h);e.download=i;var m=document.createEvent("MouseEvents");m.initMouseEvent("click",true,false,window,0,0,0,0,0,false,false,false,false,0,null);e.dispatchEvent(m)}return true}catch(j){return false}};