function onLoad(){initDot();initAudioConf()}function initAudioConf(){setTitle(lang.optAudio);initChannelSelect($("#listCh"),getTotalChannelNum(),function(a){return true});$("#slideInVol").slider({min:0,max:100,slide:function(a,b){$("#iptInVol").val(b.value)}});$("#slideOutVol").slider({min:0,max:100,slide:function(a,b){$("#iptOutVol").val(b.value)}});setEditNumberStyle("#iptInVol",false,function(a,c,b){$("#slideInVol").slider("value",b)});setEditNumberStyle("#iptOutVol",false,function(a,c,b){$("#slideOutVol").slider("value",b)});if(!$("#listCh").val()){rightPopup(lang.nolimit);return}$("#listCh").change(loadSetting).change();$("#btnSave").click(saveSetting)}function loadSetting(){var a=parseInt($(this).val());api.audioEncode(REQUEST_GET,{channel:a},function(d,e){if(d!=CODE_SUCCESS){rightPopup(lang.optionexception);return}if(isXVR()){if(typeof e.inputVolume=="undefined"){$(".J-volume").hide();$(".J-audio-enable").hide()}else{$(".J-volume").show();$(".J-audio-enable").show()}}$(".J-input-mode, .J-encode-type").empty();for(var b=0;b<e.encodeTypeList.length;++b){$(".J-encode-type").append($("<option></option>").val(e.encodeTypeList[b]).html(e.encodeTypeList[b]))}var c=[];if(typeof e.inputVolume=="undefined"){c[0]=["AIN"];e.inputModeList[2]&&(c[2]=["COAX"]);$(".J-audio-input").hide()}else{$(".J-audio-input").show();c=[lang.audioModeMic,lang.audioModeSrc]}for(var b=0;b<c.length;++b){c[b]&&$(".J-input-mode").append($("<option></option>").val(b).html(c[b]))}autoFillValue("audio",e)})}function saveSetting(){var a=getMatchValue("audio");a.channel=parseInt($("#listCh").val());loading(true);if(isXVR()){if($(".J-volume").is(":hidden")){objKeyDeal(a,["inputVolume","outputVolume","enable"],true)}}api.audioEncode(REQUEST_SET,a,function(b,c){loading(false);rightPopup(b==0?lang.saved:lang.savedfail)})};