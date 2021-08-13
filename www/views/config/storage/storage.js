var storageVariables={diskCount:0,ipeycfgurl:"",bindCloudType:1,userCode:""};function onLoad(){initDot();bindTagHead();initStorageDevice()}var cloudVariables={};function initStorageDevice(){initDiskManageEvent();initStorageDeviceEvent()}function onDiskLoad(){initDisk()}function onCloudLoad(){initCloud()}function initDiskManageEvent(){$(".J-disk-format").on("click",function(){diskFormat()})}function initStorageDeviceEvent(){$(".J-ipeye-channel").change(ipeyeChannelChange);$(".J-cloud-save").on("click",function(){cloudSave()});$(".J-dropbox-enable").on("click",function(){checkDropbBox()});$(".J-dropbox-bind").on("click",function(){dropboxBind()});$("#googleEnable").on("click",function(){googleCheck()});$("#googleBind").on("click",function(){googleBind()});$("#cloudTest").on("click",function(){cloudTest()})}function initDisk(){$(".J-disk-format").val(lang.sdformat);if(!window.top.nSynConfigDatabit[3]){$("input").prop("disabled",true);rightPopup(lang.nolimit);return}loadDiskSetting();setTitle(lang.optiondiskmanage)}function diskFormat(){var g=0;for(var f=0;f<$(".tabler").length;f++){var d="#diskcheck"+f;if($(d).is(":checked")){g++}}if(g==0){rightPopup(lang.diskformattip1);return}for(var e=0;e<$(".tabler").length;e++){var b="#diskcheck"+e;if($(b).is(":checked")){if($(".tabler span").eq(e*5+4).html()=="USB"){rightPopup(lang.Usbnoformat);return}}}if(confirm(lang.diskformattip)){var a=[];var c=0;for(var e=0;e<$(".tabler").length;e++){var b="#diskcheck"+e;if($(b).is(":checked")){a.push(parseInt($(".tabler span input").eq(e).val()));c++}}api.diskManager("format",{diskNoList:a},function(h,i){if(h!=CODE_SUCCESS){return}setTimeout(formatProcess,1000);window.top.modeformatAlert();return})}}function loadDiskSetting(){$(".J-disk-list").html("");api.diskManager(REQUEST_GET,{},function(b,d){if(b!=CODE_SUCCESS){return}if(d.diskInfo.length==0){rightPopup(lang.noconnectdisk);return}var g=d.diskInfo;var f="";for(j=0;j<g.length;j++){var i=g[j].diskNo;var c=g[j].diskStatus;switch(c){case 0:c=lang.diskunmount;break;case 1:c=lang.disknormal;break;case 2:c=lang.diskused;break;default:c=lang.noconnectdisk;break}var a=parseInt(g[j].capability)/1024;a=a.toFixed(3)+"GB";var e=parseInt(g[j].freesSapce)/1024;e=e.toFixed(3)+"GB";var h=g[j].devType;switch(h){case 0:h="SATA";break;case 1:h="USB";break;default:break}f=j%2==0?"tableeven":"tableodd";$(".J-disk-list").append('<div class="tabler '+f+'"><span class="tablece width55"><input type="checkbox" id="diskcheck'+j+'"  value="'+i+'"/> '+i+'</span><span class="tablece width145">'+c+'</span><span class="tablece width180">'+a+'</span><span class="tablece width180">'+e+'</span><span class="tablece width110">'+h+"</span></div>")}var k=(369-g.length*25)+"px";if(parseInt(k)>0){$(".J-disk-list").append('<div class="tablebottom tableeven"><span class="tablece width55" style="height: '+k+';">&nbsp;</span><span class="tablece width145" style="height: '+k+';">&nbsp;</span><span class="tablece width180" style="height: '+k+';">&nbsp;</span><span class="tablece width180" style="height: '+k+';">&nbsp;</span><span class="tablece width110" style="height: '+k+';">&nbsp;</span></div>')}})}function formatProcess(){api.diskManager("process",{},function(a,b){if(a!=CODE_SUCCESS){return}var c=b.process;if(c*1<100){window.top.modeformatwaitOne(c);setTimeout(formatProcess,1000)}else{window.top.modeformatwaitOne(c);deviceRestart()}})}function initCloud(){if(!window.top.nSynConfigDatabit[0]){$("input").prop("disabled",true);rightPopup(lang.nolimit);return}setTitle(lang.optioncloud);loadCloudSetting();initIpeyeChannel();ipeyeChannelChange();$(".J-ipeye-enable").click(function(){if($(".J-ipeye-enable").prop("checked")){$(".J-ipeye-url").val(storageVariables.ipeycfgurl)}else{$(".J-ipeye-url").val("")}});getDevConf("platformType")=="CPU_3520DV400_4AHD_NRT_6158C_2G"&&$(".J-ip-eye").hide()}function initIpeyeChannel(){var a=new Array(getTotalChannelNum());var b=$(".J-ipeye-channel");isXVR()?initChannelSelect(b,a.length,function(c){return window.top.vChannelConfig[c]==0||window.top.vChannelConfig[c]==1}):initChannelSelect(b,a.length,function(c){return getTotalChannelNum()})}function cloudTest(){$("#cloudTest").attr("disabled","disabled").val(lang.testing);api.cloudStorage("test",{},function(a,b){$("#cloudTest").removeAttr("disabled").val(lang.sttest);if(a!=1){rightPopup(lang.cloudfail)}else{rightPopup(lang.cloudsuccess)}})}function cloudSave(){var a={enable:$(".J-storagr-enable").is(":checked"),bindCloudType:storageVariables.bindCloudType,storageDir:$("#getCloudStorageStorageDir").val()};api.cloudStorage(REQUEST_SET,a,function(b,c){if(b!=CODE_SUCCESS){return}rightPopup(lang.saved)});ipeyeSave()}function loadCloudSetting(){$(".J-upnp-list").html("");api.cloudStorage(REQUEST_GET,{},function(c,d){if(c!=CODE_SUCCESS){return}autoFillValue("cloudSetting",d);storageVariables.bindCloudType=d.bindCloudType;storageVariables.userCode=d.deviceCode;if(storageVariables.bindCloudType==1){$(".J-dropbox-enable").prop("checked",false);$("#googleEnable").prop("checked",true);$(".J-dropbox-bind").val(lang.binding);isNVR()&&$("#googleBind").val(lang.unbind);isNVR()&&$("#googleEnable").attr("disabled","disabled");$(".J-dropbox-enable").attr("disabled","disabled");!isXVR()&&$(".J-storagr-enable").attr("disabled","disabled")}else{if(storageVariables.bindCloudType==2){$(".J-dropbox-enable").prop("checked",true);$("#googleEnable").prop("checked",false);$(".J-dropbox-bind").val(lang.unbind);isNVR()&&$("#googleBind").val(lang.binding);isNVR()&&$("#googleEnable").attr("disabled","disabled");$(".J-dropbox-enable").attr("disabled","disabled");$(".J-storagr-enable").attr("disabled","disabled")}else{if(storageVariables.bindCloudType==3){$(".J-dropbox-enable").prop("checked",false);$("#googleEnable").prop("checked",false);$(".J-dropbox-bind").val(lang.binding);$("#googleBind").val(lang.binding)}}}var e=d.username?d.username:"",a=d.totalSize,b=d.usedSize;$(".J-upnp-list").append('<tr id="upnpindex" class="even"><td style="width: 245px; text-align:left;"><span > '+e+'</span></td>        <td><span style="width: 245px;" >'+a+'MB</span></td>        <td><span style="width: 245px;" >'+b+"MB</span></td></tr>");if(d.username!=""){$("#googleBind").val(lang.unbind);$("#googleEnable").attr("disabled","disabled")}})}function checkDropbBox(){if($(".J-dropbox-enable").is(":checked")){$("#googleEnable").prop("checked",false);$("#getCloudStorageUrl").val("");$("#getCloudStorageUserCode").val("")}}function googleCheck(){if(isXVR()){var a={enable:$(".J-storagr-enable").is(":checked"),bindCloudType:1,storageDir:$("#getCloudStorageStorageDir").val()};api.cloudStorage(REQUEST_SET,a,function(b,c){if(b!=CODE_SUCCESS){return}loadCloudSetting()})}else{if($("#googleEnable").is(":checked")){$(".J-dropbox-enable").prop("checked",false);$("#getCloudStorageUrl").val("");$("#getCloudStorageUserCode").val("");getBindStatus(1)}}}function dropboxBind(){if($(".J-dropbox-bind").val()==lang.binding){if($(".J-dropbox-enable").is(":checked")){setBind(2)}}else{if($(".J-dropbox-enable").is(":checked")){RemoveBind(2)}}}function googleBind(){if($("#googleBind").val()==lang.binding){if($("#googleEnable").is(":checked")){setBind(1)}}else{if($("#googleEnable").is(":checked")){RemoveBind(1)}}}function setBind(a){var b=isXVR()?storageVariables.userCode:"FKSD-KFSD";api.cloudStorage("bind",{userCode:b},function(c,d){if((isNVR()&&c!==1)||(isXVR()&&c!=0)){rightPopup(lang.bindfail);if(a==2){$(".J-dropbox-bind").val(lang.binding)}else{$("#googleBind").val(lang.binding)}isXVR()&&loadCloudSetting()}else{if((isNVR()&&c==1)||(isXVR()&&c==0)){$("#googleEnable").attr("disabled","disabled");$(".J-dropbox-enable").attr("disabled","disabled");$(".J-storagr-enable").attr("disabled","disabled");if(isXVR()){if(d.bindStatus===1){rightPopup(lang.bindsuccess);if(a==2){$(".J-dropbox-bind").val(lang.unbind)}else{$("#googleBind").val(lang.unbind)}$("#googleEnable").attr("disabled","disabled")}else{return rightPopup(lang.bindfail)}}else{if(a==2){$(".J-dropbox-bind").val(lang.unbind)}else{$("#googleBind").val(lang.unbind)}}loadCloudSetting()}}})}function RemoveBind(a){api.cloudStorage("unbind",{},function(b,c){if((isNVR()&&b!==1)||(isXVR()&&b!=0)){rightPopup(lang.unbindfail);if(a==2){$(".J-dropbox-bind").val(lang.unbind)}else{$("#googleBind").val(lang.unbind)}}else{if((isNVR()&&b==1)||(isXVR()&&b==0)){loadCloudSetting();$("#getCloudStorageUrl").val("");$("#getCloudStorageUserCode").val("");$(".J-upnp-list").html("");$("#googleEnable").removeAttr("disabled");$(".J-dropbox-enable").removeAttr("disabled");$(".J-storagr-enable").removeAttr("disabled");$(".J-dropbox-enable").prop("checked",false);$("#googleEnable").prop("checked",false);$(".J-storagr-enable").prop("checked",false);if(isXVR()){if(c.bindStatus===1){rightPopup(lang.unbindsuccess);$("#googleEnable").attr("disabled","disabled");if(a==2){$(".J-dropbox-bind").val(lang.binding)}else{$("#googleBind").val(lang.binding)}}else{return rightPopup(lang.unbindfail)}}else{if(a==2){$(".J-dropbox-bind").val(lang.binding)}else{$("#googleBind").val(lang.binding)}}}}})}function getBindStatus(a){}function ipeyeChannelChange(){if(!$(".J-ipeye-channel").val()){rightPopup(lang.nolimit);return}var a=parseInt($(".J-ipeye-channel").val());api.ipeyeStorage(REQUEST_GET,{channel:a},function(b,c){if(b!=CODE_SUCCESS){return}storageVariables.ipeycfgurl=c.url;if(c.enable){$(".J-ipeye-url").val(c.url);$(".J-ipeye-enable").prop("checked",true)}else{$(".J-ipeye-url").val("");$(".J-ipeye-enable").prop("checked",false)}})}function ipeyeSave(){var a=$(".J-ipeye-channel").val();if(!a){return}loading(true);var b={channel:parseInt(a),enable:$(".J-ipeye-enable").prop("checked")?true:false,url:storageVariables.ipeycfgurl};api.ipeyeStorage(REQUEST_SET,b,function(c,d){if(c!=CODE_SUCCESS){return}if(b.enable){$(".J-ipeye-url").val(d.url);$(".J-ipeye-enable").prop("checked",true);storageVariables.ipeycfgurl=d.url}else{$(".J-ipeye-url").val("");$(".J-ipeye-enable").prop("checked",false)}})};