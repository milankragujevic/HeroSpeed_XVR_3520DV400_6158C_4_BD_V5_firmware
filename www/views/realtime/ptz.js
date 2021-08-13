var ptzVariables={ptzTimeout:null,curiseIndex:0,patrolNodeInit:false,cruiseData:[]};function initPresetConfig(){presetListClick("con1");presetListClick("con2")}function presetListClick(a){$("#"+a+" div").on("click",function(){$("#"+a+" div").removeClass("select");!$(this).hasClass("select")&&$(this).addClass("select")})}function getCurrentChannel(){var a=isIE()?ParseInt($("#videoBlock").isPlayer("getCurrentChannel")):realtimeVariables.windowPlayStatus[getConf("selectWindowIndex")];return a?a:0}function savePtz(e,c,a,b){if(!b){b=getCurrentChannel()}if(!realtimeVariables.channelPlayStatus[priviewVariables.currentChannel]){return rightPopup(lang.upgradeTips1)}if(!nPtzctrlDatabit[b]){return rightPopup(lang.nolimit)}if(!realtimeVariables.channelPlayStatus[b]){return}var d={channel:parseInt(b),speed:parseInt(e),controlCmd:parseInt(a),preset:null};api.ptzControl(REQUEST_SET,d,function(f,g){if(f==3004){rightPopup(lang.cruising)}})}function ptzMouseDown(a){priviewVariables.currentChannel=getCurrentChannel();if(a==PTZ_ENTER&&!isXVR()){return}if(m_bDVR&&vChannelConfig[priviewVariables.currentChannel]==1){savePtz($(".J-input-speed").val(),"1",a);ptzVariables.ptzTimeout=setInterval(function(){savePtz($(".J-input-speed").val(),"1",a)},300)}else{savePtz($(".J-input-speed").val(),"1",a)}}function ptzMouseUp(a){if(a==PTZ_ENTER+1&&!isXVR()){return}if(m_bDVR&&vChannelConfig[priviewVariables.currentChannel]==1){clearInterval(ptzVariables.ptzTimeout);ptzVariables.ptzTimeout=null}a!=PTZ_ENTER+1&&savePtz($(".J-input-speed").val(),"1",a)}function setPreset(b){priviewVariables.currentChannel=getCurrentChannel();var a=$("#con1 div.select").index()+1;if(!realtimeVariables.channelPlayStatus[priviewVariables.currentChannel]){return rightPopup(lang.upgradeTips1)}if(!nPtzctrlDatabit[priviewVariables.currentChannel]){return rightPopup(lang.nolimit)}var c={channel:Number(priviewVariables.currentChannel),speed:4,controlCmd:Number(b),preset:{presetIdx:Number(a),enablePreset:1}};api.ptzControl(REQUEST_SET,c,function(d,e){if(d==3004){rightPopup(lang.cruising)}d==CODE_SUCCESS&&rightPopup(lang.setsuccessfully)})}function startCruise(){priviewVariables.currentChannel=getCurrentChannel();var a=$("#con2 div.select").index();if(!realtimeVariables.channelPlayStatus[priviewVariables.currentChannel]){return rightPopup(lang.upgradeTips1)}if(!nPtzctrlDatabit[priviewVariables.currentChannel]){return rightPopup(lang.nolimit)}a=ParseInt(a);loadPtzCurise(realtimeVariables.windowPlayStatus[getConf("selectWindowIndex")],a,function(b){saveCruiseList(priviewVariables.currentChannel,a,1,b,true)})}function endCruise(){var a=eventIndex();if(!realtimeVariables.channelPlayStatus[priviewVariables.currentChannel]){return rightPopup(lang.upgradeTips1)}$(".select .J-end-cruise").css("pointer-events","none");loadPtzCurise(realtimeVariables.windowPlayStatus[getConf("selectWindowIndex")],a,function(b){saveCruiseList(priviewVariables.currentChannel,a,0,b,false)})}function setCruise(){var a=eventIndex();if(realtimeVariables.windowPlayStatus[getConf("selectWindowIndex")]==-1){return rightPopup(lang.upgradeTips1)}$(".J-patrol-list>div").addClass("hide");$("#patrolRoute").text((lang.yyAddPatrol+(a+1)));showRightTab(2);ptzVariables.curiseIndex=a;loadPtzCurise(realtimeVariables.windowPlayStatus[getConf("selectWindowIndex")],a,initPresetList)}function delCruise(){if(!realtimeVariables.channelPlayStatus[priviewVariables.currentChannel]){return rightPopup(lang.upgradeTips1)}saveCruiseList(priviewVariables.currentChannel,ptzVariables.curiseIndex,0,[])}function eventIndex(){priviewVariables.currentChannel=getCurrentChannel();var a=$("#con2 div.select").index();if(!realtimeVariables.channelPlayStatus[priviewVariables.currentChannel]){return}if(!nPtzctrlDatabit[priviewVariables.currentChannel]){return rightPopup(lang.nolimit)}return ParseInt(a)}function loadPtzCurise(a,c,b){api.getCursieList(REQUEST_GET,{channel:Number(a),cruiseIdx:c},function(e,f){if(e!=CODE_SUCCESS){return}var g=f.cruisePresetList;for(var d=0;d<g.length;d++){g[d].en=f.enableCruise;if(isNVR()){g[d].enablePreset?g[d].enablePreset=1:g[d].enablePreset=0}else{g[d].enablePreset=g[d].enablePreset}}ptzVariables.cruiseData[c]=g;b&&b(g)})}function saveCruiseList(c,e,a,d,b){e=ParseInt(e);if(!d){d=getCruiseData();ptzVariables.cruiseData[e]=d}var f=getCruiseListPrm(0,31,d);api.getCursieList(REQUEST_SET,{channel:Number(c),cruiseIdx:e,enableCruise:ParseInt(a),cruisePresetNum:32,cruisePresetList:f},function(g,h){if(g!=CODE_SUCCESS){return}if(a==250){rightPopup(lang.setsuccessfully)}if(a==0){$(".select .J-end-cruise").css("pointer-events","auto")}});showRightTab(1)}function initPresetList(f){var c=$("#tempPatrolNode");if(!ptzVariables.patrolNodeInit){ptzVariables.patrolNodeInit=true;c.click(function(){$(".J-patrol-list>div.select").removeClass("select");$(this).addClass("select")});var g=null;var d=function(n,m){var p=n.val();var i=String(intLimit(ParseInt(n.val().replace(/[^\d]/g,"")),n.attr("lsdata-min"),n.attr("lsdata-max")));if(p!==i){if($.isNumeric(i)){n.val(i)}else{var o=n.attr("lsdata-def");n.val(o?o:n.attr("lsdata-min"))}!m&&n.select()}g=null};c.find("input.patrol-text").on("keyup",function(){g!=null&&clearTimeout(g);var o=$(this);var n=o.parents(".line-normal");var m=n.find(".patrol-select");ParseInt(m.val())===0&&m.val(1);var i=n.find(".patrol-text").not("[name="+o.attr("name")+"]");d(i,true);g=setTimeout(function(){d(o,false)},CHECK_INPUT_VALUE_TIME)}).on("change",function(){g&&d($(this),false)});c.find("select.patrol-select").change(function(n){var m=$(this);var i=m.parents("div.line-normal");if(ParseInt(m.val())===0){i.find("input.patrol-text").val("0")}else{i.find("input.patrol-text").each(function(o){var p=$(this);ParseInt(p.val())===0&&p.val(p.attr("lsdata-def"))})}})}var a=$(".J-patrol-list>div");a.addClass("hide");var l=a.length;var j=-1,h,k,b;for(var e=0;e<CRUISE_NUM;++e){if(e>=f.length&&e>=l){break}if(e<f.length){h=ParseInt(f[e]["presetIdx"]);k=ParseInt(f[e]["presetDweelTime"]);b=ParseInt(f[e]["speed"])}else{h=0;k=0;b=0}while(e>=l){addCruiseNode();++l}setCruiseNode(e,h,b,k);if(!h){j===-1&&(j=e)}else{j=-1}}j!==-1&&$(".J-patrol-list>div").eq(j).prevAll().removeClass("hide")}function setCruiseNode(a,e,f,h,c,g){e=ParseInt(e);var b=true;if(e===0){f=0;h=0;c=0;g=isNVR()?0:false;b=false}else{c||(c=0);g||(g=isNVR()?0:false)}var d=$(".J-patrol-list>div").eq(a);b&&d.removeClass("hide");d.find("select.patrol-select").val(e);d.find("[name=yyPatrolSpeed]").val(f);d.find("[name=yyPatrolTime]").val(h);d.attr("lsdata-en",c).attr("lsdata-preEn",g);return d}function addCruiseNode(){var a=$("#tempPatrolNode").clone(true,true);return a.removeAttr("id").appendTo($(".J-patrol-list")).index()}function getCruiseData(){var e=[];var d=$(".J-patrol-list input[name=yyPatrolSpeed]");var c=ParseInt(d.attr("lsdata-min")),g=ParseInt(d.attr("lsdata-max"));var f=$(".J-patrol-list input[name=yyPatrolTime]");var a=ParseInt(f.attr("lsdata-min")),b=ParseInt(f.attr("lsdata-max"));$(".J-patrol-list>div").not(".hide").each(function(){var h=$(this);e.push({en:h.attr("lsdata-en"),speed:intLimit(h.find("input[name=yyPatrolSpeed]").val(),c,g),presetDweelTime:intLimit(h.find("input[name=yyPatrolTime]").val(),a,b),presetIdx:ParseInt(h.find("select.patrol-select").val()),enablePreset:h.attr("lsdata-preEn")})});return e}function getCruiseListPrm(d,f,j){var m=[];var l="&setptzcrupreset"+d+"_"+f+"=";var a,b,c,e,k;for(var h=d;h<=f;++h){var g={};if(h>=j.length){a="0";b="0";c="0";e="0";k="0";g={presetIdx:0,speed:0,presetDweelTime:0,enablePreset:false};m.push(g)}else{a=j[h]["en"];b=j[h]["speed"];c=j[h]["presetDweelTime"];e=j[h]["presetIdx"];k=j[h]["enablePreset"];g={presetIdx:parseInt(e),speed:parseInt(b),presetDweelTime:parseInt(c),enablePreset:isNVR()?parseInt(k):k};m.push(g)}l+="set_cru_en"+h+":"+a+",set_cru_sp"+h+":"+b+",set_cru_dt"+h+":"+c+",set_cru_pre"+h+"_num:"+e+",set_cru_pre"+h+"_en:"+k+";"}return m}function addPatrolPreset(){var d=$(".J-patrol-list>div");var c=d.not(".hide");if(c.length>=CRUISE_NUM){return}c.removeClass("select");var b=$("#tempPatrolNode");var f=b.find(".patrol-select").attr("lsdata-def");var e=b.find("[name=yyPatrolSpeed]").attr("lsdata-def");var a=b.find("[name=yyPatrolTime]").attr("lsdata-def");if(d.length>c.length){setCruiseNode(c.length,f,e,a).addClass("select")}else{setCruiseNode(addCruiseNode,f,e,a).addClass("select")}}function deletePatrolPreset(){var a=$(".J-patrol-list>div.select");a.next().hasClass("hide")||a.next().addClass("select");a.remove()}function downPatrolPreset(){var a=$(".J-patrol-list>div.select");if(!a.length){return}var b=a.next();if(!b.length||b.hasClass("hide")){return}swapCruiseNode(a,b);a.removeClass("select");b.addClass("select")}function upPatrolPreset(){var a=$(".J-patrol-list>div.select");if(!a.length||!a.index()){return}var b=a.prev();swapCruiseNode(a,b);a.removeClass("select");b.addClass("select")}function swapCruiseNode(i,k){var m=i.find("select.patrol-select");var c=m.val();var o=i.find("input[name='yyPatrolSpeed']");var n=o.val();var d=i.find("input[name='yyPatrolTime']");var e=d.val();var r=i.attr("lsdata-en");var b=i.attr("lsdata-preEn");var a=k.find("select.patrol-select");var f=a.val();var q=k.find("input[name='yyPatrolSpeed']");var h=q.val();var p=k.find("input[name='yyPatrolTime']");var g=p.val();var j=k.attr("lsdata-en");var l=k.attr("lsdata-preEn");a.val(c);q.val(n);p.val(e);k.attr("lsdata-en",r);k.attr("lsdata-preEn",b);m.val(f);o.val(h);d.val(g);i.attr("lsdata-en",j);i.attr("lsdata-preEn",l)}function confirmPatrol(){saveCruiseList(priviewVariables.currentChannel,ptzVariables.curiseIndex,250)}function cancelPatrol(){showRightTab(1)}function showRightTab(a){a=ParseInt(a)+1;$("#tabContainer .tab-content").addClass("hide").filter("#con"+a).removeClass("hide")};