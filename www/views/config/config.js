function onLoad(){initDot([{id:"optionsContainer",data:{list:getConf("weekPwdLimit")?OPTIONS_MENU_LIST_SAFE:OPTIONS_MENU_LIST}}]);if(getStorageItem("isIvms")){ivmsConfigEvent()}$(".J-options-menu dd a").eq(0).click();$(".J-options-menu dt").on("click",function(){var i=$(this).next("dd");i.toggleClass("hide")});$(".J-options-menu dd a").on("click",function(){checkMenuClick($(this))});$(".J-options-menu dd a").eq(0).click();setConf("isLiteModeEn",getDevConf("platformType")==="CPU_3520DV400"||getDevConf("platformType")==="CPU_3521D_8AHD_NRT"||getDevConf("platformType")==="CPU_3521D_8AHD_NRT_6168C"||getDevConf("platformType")==="CPU_3531D_16AHD_NRT"||getDevConf("platformType")==="CPU_3531D_16AHD_NRT_6168C"||getDevConf("platformType")==="CPU_3531D_16AHD_NRT_6158C"||getDevConf("platformType")==="CPU_3531DCAS_32AHD_1080P_NRT"||getDevConf("platformType")==="CPU_3520DV400_4AHD_NRT_6158C_2G"||getDevConf("platformType")==="CPU_3531D_16AHD_NRT_6158C_2"||getDevConf("platformType")==="CPU_3531D_16AHD_NRT_6168C_X1"||getDevConf("platformType")==="CPU_3520DV400_4AHD_NRT_6158C"||getDevConf("platformType")==="CPU_MC6630_4AHD_NRT_2830");setConf("isAllowNTPandDST",isNVR()||isXVR());setConf("isExImg",isNVR()||wifiType==="WIFIV5");m_bPlayAll=false;if(checkPluginInstall()){plugin().allStopView()}!isShowPtz()&&$("#ptzTitle").hide();!isShowPrivacyMask()&&$("#privacyMaskTitle,#imageTitle").hide();!isShowChannelName()&&$("#channelNameTitle").hide();!isShowSmartAlarm()&&$("#smartAlarmTitle").hide();!isShowLocalAlarm()&&$("#localAlarmTitle").hide();!isXVR()&&$(" #channelConfigTitle ").hide();!isShowVolume()&&$(" #audioTitle ").hide();!isNVR()&&$("#smartEventsTitle").hide();getConf("isAdminMdy")&&setConf("isAdminMdy",false);var g=0;var c=0;var b=0;var f=0;var h=0;var d=0;var e=0;var a=0;if(isXVR()||isNVR()||isWifiNvr()){g=nSynConfigDatabit[0];c=nSynConfigDatabit[1];b=nSynConfigDatabit[2];f=nSynConfigDatabit[3];h=nSynConfigDatabit[4];d=nSynConfigDatabit[5];e=nSynConfigDatabit[6];a=nSynConfigDatabit[7]}!g&&$("#generalSetTitle,#networkTitle,#channelConfigTitle,#localAlarmTitle,#normalEventsTitle,#smartEventsTitle,#versionTitle").hide();!c&&$("#deviceManageTitle,#osdTitle,#imageTitle,#channelNameTitle,#privacyMaskTitle,#audioTitle").hide();!b&&$("#userManageTitle").hide();!a&&$("#autoRebootTitle").hide();!e&&$("#factorySetTitle").hide();!d&&$("#upgradeTitle").hide();!h&&$("#logTitle").hide();wifiType=="WIFIV5"||isWifiNvr()&&$("#smartEventsTitle").hide();$(document).on("click",".J-plugin-link",function(){window.open(getPluginPath(),"_self")});$(document).on("contextmenu","#videoBlock",function(i){return false})}function checkMenuClick(a){if(ISCLICK){ISCLICK=false;menuClickEvents(a);setTimeout(function(){ISCLICK=true},1000)}}function menuClickEvents(f){$(".J-options-menu dd a").removeClass("current");if(typeof window.onUnload==="function"){window.onUnload();window.onUnload=null}if(!f){return}var a=$(f);a.parents("dd").removeClass("hide");a.addClass("current");var g=a.parent().attr("data-path");var e=g.split("-");var c="/views/config/"+e[0]+"/"+e[1];$(".J-options-main").html("");var b=counter(2,function(h){$(".J-options-main").html(doT.template(h)());if(typeof window.onLoad==="function"){window.onLoad();window.onLoad=null}}),d="";$.ajax({url:c+".html?ver="+versionconfig.web_version,dataType:"text",success:function(h){d=h;b(d)}});$LAB.setOptions({AllowDuplicates:true}).script(c+".js?ver="+versionconfig.web_version).wait(function(){b(d)});$(".J-config-page-css").html("");$.ajax({url:c+".css?ver="+versionconfig.web_version,success:function(h){$(".J-config-page-css").html(h)}})}function bindTagHead(b,c){b||(b=$(".J-options-main ul.tag-head a"));var a=b.click(function(){var h=$(this);var g=h.parents("ul").eq(0);var i=g.find("a.current");if(i.length>0){var e="on"+firstUppercase(i.attr("name"))+"Beforeunload",d="on"+firstUppercase(i.attr("name"))+"Unload";typeof window[e]==="function"&&window[e]();typeof window[d]==="function"&&window[d]();i.removeClass("current")}var f=h.attr("name");if(!f){return}g.siblings("div").hide().filter("#"+f+"").show();setTitle(h.text());h.addClass("current");f="on"+firstUppercase(f)+"Load";typeof window[f]==="function"&&window[f]()}).eq(0);c||a.click()}function showSaveMsg(a){rightPopup(a==CODE_SUCCESS?lang.saved:lang.savedfail)}function showSetMsg(a){rightPopup(a?lang.setsuccessfully:lang.setFaile)}function makeUrlBySort(d,b){var a=[];for(var c=0;c<b.length;c++){if(undefined===d[b[c]]){continue}a.push(b[c]+"="+encodeURIComponent(d[b[c]]))}return a.join("&")}function mapSize(c){var a=0;for(var b in c){++a}return a}function deviceRestart(){api.restart(REQUEST_SET,function(a){if(a!=CODE_SUCCESS){return}});doRestartCount(0)}function keyboardFilter(a){a=a||window.event;if((a.keyCode>=37&&a.keyCode<=40)||(a.keyCode==8)||(a.keyCode==9)){return false}return true}function zeroComplement(b){var a="0";if(ParseInt(b)<10){a=a+b}else{a=b}return a}function numberRangeLimt(b,a,d){var c=($(b).val()).replace(/\D/g,"");if(a!=d){if(c!=""&&c<a){return a}if(c>d){return d}}return c}function setIpEditStyle(d){var a=typeof d==="string"?$("#"+d):$(d);if(a.length===0){return false}var c=function(){var e=$(this);var f=b(e.val());f!==e.val()&&e.val(f)},b=function(l){l||(l="");var k=new Array(4),e=0;for(var h=0;h<l.length&&e<4;++h){var g=chr2num(l[h]);var j=l.charAt(h);if(g!==null){k[e]||(k[e]="");k[e]+=String(g)}else{if(j==="."||j==="．"){++e}}}var f="";for(var h=0;h<k.length;++h){f+=Math.min(ParseInt(k[h]?k[h]:"0"),255)+"."}return f.substr(0,f.length-1)};a.on("blur",function(){c.call(this)});return true}function chr2num(b){var c=b.charCodeAt(0);var a=c-"0".charCodeAt(0);if(a>=0&&a<=9){return a}var d=c-"０".charCodeAt(0);if(d>=0&&d<=9){return d}return null}function getDevHDNum(a,b){switch(a){case"CPU_3521A":case"CPU_3521D_16AHD_NRT":return 16;case"CPU_3531A":case"CPU_3531D_32AHD_NRT":case"CPU_3531DCAS_32AHD_1080P_NRT":return 32;case"CPU_3521A_4AHD":case"CPU_3521A_4AHD_2826":case"CPU_3520DV300_4AHD_2826":case"CPU_3520DV400":case"CPU_3521A_4SDI_334S":case"CPU_3521D_4SDI_334S":case"CPU_3521D":case"CPU_3521D_SMARTKITS":case"CPU_3531D_4AHD_4M_RT":case"CPU_3520DV400_4AHD_NRT_6158C":case"CPU_MC6630":case"CPU_MC6630_4AHD_1080N_RT_2830":case"CPU_MC6630_4AHD_NRT_2830":return 4;case"CPU_3531A_16AHD":case"CPU_3531A_16AHD_NTR_2826":case"CPU_3521D_16AHD_1080N_NRT_6158C":return 16;case"CPU_3521":case"CPU_3520DV300":case"CPU_3520DV400_8AHD_NRT":case"CPU_3531A_8AHD":case"CPU_3531A_8SDI_334S":case"CPU_3531D_8SDI_334S":case"CPU_3531D":case"CPU_3531DCAS_8AHD_4M_RT":case"CPU_3520DV400_8AHD_1080N_NRT_6158C":case"CPU_MC6630_8AHD_1080N_NRT_2830":return 8;default:b=ParseInt(b);switch(b){case 9:return 4;case 16:return 8;case 32:return 16}}return -1}function checkEmail(a){if(typeof a!=="string"){return false}a=$.trim(a);return a.match(/^\w[\w\.-]+@(\w[\w-]+\.)+\w+$/)?true:false}function checkMacAddr(k){if(typeof k!=="string"){return false}k=k.replace(/\s/g,"").toUpperCase();if(k.length!==2*6+5){return false}var j="0".charCodeAt(0),a="9".charCodeAt(0),d="A".charCodeAt(0),b="F".charCodeAt(0),g=":",e="-",m=null;for(var f=0;f<k.length;++f){var l=k.charCodeAt(f);if(l>=j&&l<=a||l>=d&&l<=b){continue}else{if(k[f]===m){continue}else{if(m===null&&(k[f]===g||k[f]===e)){m=k[f];continue}}}return false}var h=k.split(m);if(h.length!==6){return false}for(var f=h.length-1;f>=0;f--){if(h[f].length!==2){return false}}return k}function checkDomain(a){if(typeof a!=="string"){return false}a=$.trim(a);return a.match(/^([A-Za-z0-9][A-Za-z0-9-]+\.)+[A-Za-z0-9]+$/)||a.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)?true:false}function replaceAndSetPos(e,b,c){var d=e.selectionEnd;var a=e.value;e.value=e.value.replace(b,c);if(a==e.value){e.setSelectionRange(d,d)}else{e.setSelectionRange(d-1,d-1)}}function checkStringValid(k,b,a,f,l){if(typeof k!=="string"){return false}var n=[];if(!l){a=1}switch(a){case 0:n=[".","-","_",":",";","/","\\","|","~","[","]","{","}","^","*","+","<",">","(",")","$","@","?"," "];if(f){n.splice(n.length-1,1)}break;case 1:n=[".","-","_","/","|","~","[","]","{","}","^","*","+","<",">","(",")","$","@","?",";"];break;case 2:n=["_"];break}var e="0".charCodeAt(0),o="9".charCodeAt(0),m="A".charCodeAt(0),c="Z".charCodeAt(0),h="a".charCodeAt(0),g="z".charCodeAt(0);for(var d=0;d<k.length;++d){var p=k.charCodeAt(d);if(p>=e&&p<=o||p>=m&&p<=c||p>=h&&p<=g||n.indexOf(k[d])!==-1){continue}var j=k[d];replaceAndSetPos(b,j,"")}}function userInput(c){for(var a=0;a<c.length;a++){var b=c.charCodeAt(a);if(!((b>=48&&b<=57)||(b>=65&&b<=90)||(b>=97&&b<=122)||b==95)){return false}}return true}function findSpace(c){for(var a=0;a<c.length;a++){var b=c.charCodeAt(a);if(b==32){return true}}return false}function checkCharValid(c,a){var i;switch(a){case 0:i=[".","-","_",":",";","/","\\","|","~","[","]","{","}","^","*","+","<",">","(",")","$","@","?"," "];break;case 2:i=["_"];break;default:i=[".","-","_","/","|","~","[","]","{","}","^","*","+","<",">","(",")","$","@","?",";"];break}var d="0".charCodeAt(0),g="9".charCodeAt(0),h="A".charCodeAt(0),b="Z".charCodeAt(0),f="a".charCodeAt(0),e="z".charCodeAt(0);var j=c.charCodeAt(0);if(j>=d&&j<=g||j>=h&&j<=b||j>=f&&j<=e||i.indexOf(c[0])!==-1){return true}return false}function isBitDog(){return true}function setTimeRangeEdit(c,b,d,f,g){var a=[c,b,d,f];var i=[$(c),$(b),$(d),$(f)];var j={min:"0",max:"24",def:"0",padZero:"2",maxlength:"3"},h={min:"0",max:"59",def:"0",padZero:"2",maxlength:"3"};i[0].attr(j);i[2].attr(j);i[1].attr(h);i[3].attr(h);var e=function(t,n,l){var o="#"+t.attr("id");var u=a.indexOf(o);var w=u===0||u===2;var s=w?i[u+1]:i[u-1];var q=w?t:s,r=w?s:t;if(q.val()=="24"){var v=parseInt(r.attr("padZero"));var n="0";if(v>0){n=(strRepeat("0",v)+n).substr(0-v)}r.val(n)}var m=0,p=0;var k=u<2;if(k){m=q.val()*60+ParseInt(r.val());p=i[2].val()*60+ParseInt(i[3].val())}else{m=i[0].val()*60+ParseInt(i[1].val());p=q.val()*60+ParseInt(r.val())}if(k&&m>p){i[2].val(q.val()).blur();i[3].val(r.val()).blur()}else{if(!k&&p<m){i[0].val(q.val()).blur();i[1].val(r.val()).blur()}}g&&g(i)};setEditNumberStyle(c,false,e);setEditNumberStyle(b,false,e);setEditNumberStyle(d,false,e);setEditNumberStyle(f,false,e)}function lightTipDom(a){if(a.length===0){console.log("Add light tip false");return}else{if(isIE9()){return}}a.addClass("error");setTimeout(function(){a.addClass("gradient").removeClass("error");setTimeout(function(){a.removeClass("gradient")},1000)},10)}function checkEmpty(h,j,f){h.hide();j||(j=$(document));f||(f=0);var c=j.find(".J-require");var b=0,a=-1;for(var e=0;e<c.length;++e){var d=c.eq(e);var l=d.prop("tagName").toUpperCase();if(l==="INPUT"){var g=d.attr("type").toUpperCase();if(g==="TEXT"||g==="PASSWORD"){if(!d.val()){++b;a===-1&&(a=e)}}}else{if(l==="SELECT"){if(d.val()=="0"){++b;a===-1&&(a=e)}}}if(b>f){break}}if(b>f){var k=c.eq(a);lightTipDom(k);h.show().position({of:k,at:"right",my:"left"})}return b}function initChannelSelect(a,b,f,d){b=ParseInt(b);d=d?ParseInt(d):0;var c=0;a.html("");for(var e=0;e<b;++e){if(!f(e)){continue}++c;$("<option></option>").val(d+e).html((e<9?"CH0":"CH")+(e+1)).appendTo(a)}if(c>0){a.val(a.find("option").eq(0).val())}return c}function encodeEntity(a){return a.replace(/[\u00A0-\u9999<>\&]/gim,function(b){return"&#"+b.charCodeAt(0)+";"})}function initLsSlide(b,a){b||(b=$("body"));b.find("input.ipt-slide").each(function(){var e=$(this);var d=$(this).prev("div.ls-slide");var f=e.attr("max");d.slider({min:ParseInt(e.attr("min")),max:ParseInt(f),slide:function(g,h){e.val(h.value)},change:function(g,h){e.val(h.value)}});setEditNumberStyle(e,false,function(g,i,h){var h=ParseInt(h);g.prev("div.ls-slide").slider("value",h)});var c=f.length+1;e.attr("maxlength",c).css("width",c*8);a&&e.change()})}function firstUppercase(a){return a.charAt(0).toUpperCase()+a.slice(1)}function initCheckbox(f,b,e,d){var c=d?"divBlock":"";for(var a=0;a<b;a++){f.append('<span class="width50 '+c+'">            <label><input id='+e+a+" matchval="+e+a+' type="checkbox" />'+(a+1)+"</label>            </span>")}}function getVal2Bit(f,c,a){var e=parseInt(c).toString(2).split("");e=e.reverse();for(var b=0;b<a;b++){var d=$("#"+f+b);d.prop("checked",false);if(e[b]>=1){d.click();d.prop("checked",true)}}}function setBit2Val(e,a){var f=[];if(!a){return 0}for(var b=0;b<a;b++){var d=$("[matchval='"+e+b+"']");f.push(d.prop("checked")?"1":"0")}f=f.reverse();var c=parseInt(f.join("").toString(),2);return c}function isHideDst(){return isNVR()||wifiType=="WIFIV5"?false:true}function isShowVolume(){return isNVR()||isWifiNvr()||(isXVR()&&!isCpuEq("CPU_3520DV400_4AHD_NRT_6158C_2G"))}function isShowPtz(){return isXVR()||(isNVR()&&getConf("nvrShowPTZ"))}function isShowPrivacyMask(){return isXVR()||isNVR()||((wifiType=="WIFIV5"||wifiType=="WIFIV5")&&getDevConf("platformType")!=10)}function isShowChannelName(){return isXVR()||isNVR()}function isShowSmartAlarm(){return isXVR()&&(getDevConf("platformType")=="CPU_3521A_4AHD_2826"||getDevConf("platformType")=="CPU_3521D_SMARTKITS")||(wifiType=="WIFIV5"&&getDevConf("platformType")!=10&&getDevConf("platformType")!=40)}function isShowLocalAlarm(){return isXVR()&&parseInt(getDevConf("alarmOutNum"))||isNVR()&&(getConf("isNvrAlarmInEn")||getConf("isNvrAlarmOutEn"))}function isHideVideoLoss(){if(isXVR()&&getDevConf("platformType")=="CPU_3520DV400_4AHD_NRT_6158C_2G"){return true}if(isXVR()||isNVR()){return false}}function isHideFaceComparison(){return isXVR()||(isNVR()&&getDevConf("supportFaceCompare"))}function isHideFaceManage(){return isXVR()||(isNVR()&&getDevConf("supportFaceCompare"))}function isCPUMC6630(){return getDevConf("platformType")==xvrCpuType[50]||getDevConf("platformType")==xvrCpuType[48]||getDevConf("platformType")==xvrCpuType[47]||getDevConf("platformType")==xvrCpuType[46]}function setSdk(){loading(false);window.realtime&&clearTimeout(window.realtime);setConf("selectWindowIndex",0);deviceSdk.initVariable()}function getUserName(){return globalVariable.username?globalVariable.username:null}function isHideBuzzer(){if(getConf("removeBuzzer")){return true}else{return false}};