// 私有变量
var recordVariables = {
    currentRecordType: '', // 当前选中录像类型
    mainModeListDisable: true,
    subModeListDisable: true
};

function onLoad() {
    initDot();
    bindTagHead();
    getRecordChannel()
    initRecSetEx();
    listenEvent();
    initEncodeEvent();
    isXVR() && initEncodeXvr();
    getDevConf('analogChannelNumMax') == 8;
}

function initRecSetEx() {
    setTitle(lang.recsetup);

    setConf("isMoreStEn", isNVR() || isXVR());
    window.g_arrCate = [{
        "name": lang.recordTime,
        "color": "rgb(66, 175, 46)",
        "disabled": false
    },
    {
        "name": lang.recordMotion,
        "color": "rgb(255, 228, 43)",
        "disabled": false
    },
    {
        "name": lang.recordAlarm,
        "color": "rgb(255, 79, 47)",
        "disabled": false
    },
    {
        "name": lang.motionAndAlarm,
        "color": "rgb(191, 252, 255)",
        "disabled": false
    },
    {
        "name": lang.recordSmart,
        "color": "rgb(5, 82, 255)",
        "disabled": false
    }
    ];

    isXVR() && window.g_arrCate.splice(window.g_arrCate.length - 1, 1);

    /*增加报警输入置灰报警时间*/
    if (!getConf("isNvrAlarmInEn")) {
        window.g_arrCate[3].color = "rgb(170, 170 ,170)";
        window.g_arrCate[2].color = "rgb(170, 170 ,170)";
        window.g_arrCate[3].disabled = true; // motion And Alarm
        window.g_arrCate[2].disabled = true; // Alarm
    } else {
        if (getConf("isXvrNoMotionAlarmType")) {
            window.g_arrCate[3].color = "rgb(170, 170 ,170)";
            window.g_arrCate[3].disabled = true;
        }
    }

    // wifiV5 文件类型只保留移动侦测
    if (isWifiNvr()) {
        window.g_arrCate[4].color = "rgb(170, 170 ,170)";
        window.g_arrCate[4].disabled = true;
    }

    var startIndex = 0;
    window.g_mapCate = {};
    window.g_mapCate[RECORD_TYPE_NORMAL] = window.g_arrCate[0];
    window.g_mapCate[RECORD_TYPE_MOTION] = window.g_arrCate[1];
    window.g_mapCate[RECORD_TYPE_ALARM] = window.g_arrCate[2];
    window.g_mapCate[RECORD_TYPE_RECORD_TYPE_MOTION_AND_ALARM] = window.g_arrCate[3];
    // window.g_arrCate[3].disabled = true;

    if (!isXVR()) {
        startIndex = 1;
        window.g_mapCate[RECORD_TYPE_SMART_EVENT] = window.g_arrCate[4];
    }

    $(".J-time-seltor").timeSegSelect({
        "lang": {
            "week": [
                lang.stweek7,
                lang.stweek1,
                lang.stweek2,
                lang.stweek3,
                lang.stweek4,
                lang.stweek5,
                lang.stweek6
            ],
            "del": lang.del,
            "save": lang.save,
            "selectAll": lang.stselectall,
            "confirm": lang.confirm,
            "cancel": lang.cancel,
            "copyTo": lang.stcopyto1,
            "allchannel": lang.allchannel,
        },
        "cate": window.g_arrCate,
        "buttons": [{
            "name": '<span class="ui-icon ui-icon-circle-close"></span>' + lang.del,
            "classes": "ui-state-error-text J-btn-del",
            "click": onBtnDelClk
        },
        {
            "name": '<span class="ui-icon ui-icon-circle-close"></span>' + lang.stdelall,
            "classes": "ui-state-error-text J-btn-del-all",
            "click": onBtnDelAllClk
        },
        {
            "name": '<span class="ui-icon ui-icon-circle-check"></span>' + lang.selAll,
            "classes": "btnSelAll",
            "click": onBtnSelAllClk
        }
        ],
        "height": 10,
        "onSelect": onSegSel,
        "onSegChg": onTimeSegChg,
        "onDrawBegin": onSegDrawBegin,
        "onDrawEnd": onSegDrawEnd
    });

    var checkList = $(".J-check-type");
    var funcGetChkHtml = function (name) {
        return '<label><input type="checkbox" name="' + name + '"/>' + name + '</label>';
    };

    startIndex && checkList.append(funcGetChkHtml(window.g_arrCate[0].name));

    for (var i = startIndex; i < window.g_arrCate.length; i++) { // 循环checkbox选择项
        checkList.append(funcGetChkHtml(window.g_arrCate[i].name))
    }

    // 设置数字框
    setEditNumberStyle($(".J-time-edit>input"));
    $(".J-check-type input").change(onEdtChkChg);

    // 点击其他地方会关闭
    $(".J-close-popup").click(function () {
        $(".J-time-popup-block").hide();
    });

    if (getConf("isMoreStEn")) {
        $(".J-more-setting-btn").show();
        $(".J-more-setting").attr("title", lang.more);
    }

    if (getConf("nvrNew")) {
        $(".J-record-time").removeClass("hide");
        $(".J-pre-time").eq(1).removeClass("hide");
    } else {
        $(".J-record-time").addClass("hide");
        $(".J-pre-time").eq(1).addClass("hide");
    }
    $(".J-check-type").removeClass("hide");
    onChChg()
}

/**
 * 获取通道列表
 */
function getRecordChannel() {
    initChannelSelect($(".J-channal-sel"), getTotalChannelNum(), function (iCh) {
        return window.top.nRecordDatabit[iCh] && isChEn(iCh);
    });

    if ($(".J-channal-sel").val() == null) {
        rightPopup(lang.nolimit);
        return;
    }
}

function onEdtChkChg() {
    var that = $(this);
    var name = that.attr("name"),
        beCheck = that.prop("checked");
    var checkList = that.parents(".J-check-type");

    if (name === "chkAll") {
        if (beCheck) {
            checkList.find("input")
                .prop("checked", false)
                .end().find("input")
                .not("[name='" + recType2name(RECORD_TYPE_RECORD_TYPE_MOTION_AND_ALARM) + "']")
                // .not("[name='" + recType2name(RECORD_TYPE_MOTION) + "']")
                .not("[disabled]")
                .prop("checked", true);

            var MOTION = checkList.find("[name='" + recType2name(RECORD_TYPE_MOTION) + "']");
            var M_AND_A = checkList.find("[name='" + recType2name(RECORD_TYPE_RECORD_TYPE_MOTION_AND_ALARM) + "']");
            var ALARM = checkList.find("[name='" + recType2name(RECORD_TYPE_ALARM) + "']");
            var typeChecked = MOTION.prop("checked") && ALARM.prop("checked");
            if (window.top.m_devicetype === "NVR") {
                if (typeChecked) {
                    MOTION.prop("checked", false);
                    ALARM.prop("checked", true);
                    M_AND_A.prop("checked", true);

                    if (ALARM.prop("diabled", false)) {
                        MOTION.prop("checked", true)
                        M_AND_A.prop("checked", false);
                    }
                }
            }
        } else {
            checkList.find("input")
                .prop("checked", false)
                .end().find("[name='" + recordVariables.currentRecordType + "']")
                .prop("checked", true);
        }
    } else if (beCheck && (name === recType2name(RECORD_TYPE_ALARM) || name === recType2name(RECORD_TYPE_MOTION))) {
        checkList.find("[name='" + recType2name(RECORD_TYPE_RECORD_TYPE_MOTION_AND_ALARM) + "']").prop("checked", false);
    } else if (beCheck && name === recType2name(RECORD_TYPE_RECORD_TYPE_MOTION_AND_ALARM)) {
        checkList.find("[name='" + recType2name(RECORD_TYPE_ALARM) + "'],[name='" + recType2name(RECORD_TYPE_MOTION) + "']").prop("checked", false);
    }
}

function name2recIdx(name) {
    for (var i = 0; i < window.g_arrCate.length; ++i) {
        if (window.g_arrCate[i].name === name) return i;
    }
    return -1;
}

/**
 * 鼠标点击选中某个时间段
 * @param  {int} weekIdx 星期下标
 * @param  {string} name    选中时间段种类名称
 * @param  {int} idx     DOM所在的index(第几段)
 * @param  {JQuery obj} $ele    选中的DOM
 * @return {void}
 */
function onSegSel(weekIdx, name, idx, $ele) {
    recordVariables.currentRecordType = name;

    $(".J-time-edit > input").eq(3).change(function () {
        if (parseInt($(".J-time-edit > input").eq(2).val()) == 24) {
            $("div.J-time-edit>input").eq(3).val("0")
        }
    })

    $(".J-time-seltor .J-btn-del").attr({
        "w": weekIdx,
        "n": name,
        "i": idx
    }).prop("disabled", false);

    var timeData = $(".J-time-seltor").timeSegSelect("getCateTimeData", weekIdx, name);

    $(".J-time-popup-block").show().position({
        of: $ele,
        at: "top",
        my: "bottom"
    }).find(".J-time-edit>input")
        .eq(0).val(Math.floor(timeData[idx][0] / 60))
        .next().val(timeData[idx][0] % 60)
        .next().val(Math.floor(timeData[idx][1] / 60))
        .next().val(timeData[idx][1] % 60)

    // 清空所有选中再选择
    $(".J-check-type input").prop("checked", false);
    $(".J-check-type input[name='" + name + "']").prop("checked", true);

    var left = $(".J-time-popup-block").css("left").split("px");
    if (parseInt(left[0]) < 0) {
        $(".J-time-popup-block").css("left", 0)
    }

    // 给不支持事件disabled
    var inputs = $(".J-check-type").find("input").not(".J-check-all");
    for (var i = 0; i < inputs.length; i++) {
        if (window.g_arrCate[i].disabled) {
            inputs[i].disabled = true;
        }

        inputs.eq(3)
    }
}

function onBtnDelClk(e) {
    var that = $(this),
        checkList = $(".J-check-type input:checked").not(".J-check-all"),
        btnDel = $(".J-time-seltor").find(".J-btn-del"),
        week = parseInt(btnDel.attr("w")),
        getTimeObj = $(".J-time-edit input"),
        beginTime = getTimeObj.eq(0).val() * 60 + ParseInt(getTimeObj.eq(1).val()),
        endTime = getTimeObj.eq(2).val() * 60 + ParseInt(getTimeObj.eq(3).val());

    for (var i = 0; i < checkList.length; ++i) {
        var name = checkList.eq(i).attr("name");
        $(".J-time-seltor").timeSegSelect("delCateTimeInTime", week, name, beginTime, endTime);
    }

    that.prop("disabled", true);
}

function onBtnDelAllClk(e) {
    $(".J-time-seltor").timeSegSelect("clearAll").find(".J-btn-del").prop("disabled", true);
}

function onBtnSelAllClk(e) {
    var fullTime = [
        [0, 1440]
    ];
    var fullType = [
        recType2name(RECORD_TYPE_NORMAL), // 定时
        recType2name(RECORD_TYPE_SMART_EVENT), // 智能
        recType2name(RECORD_TYPE_ALARM),
        recType2name(RECORD_TYPE_MOTION)
        // recType2name(RECORD_TYPE_RECORD_TYPE_MOTION_AND_ALARM) // 动测且报警
    ];

    //if not alarm add motion
    if (window.g_arrCate[3].disabled) {

        // wifiV5 去除智能
        if (isWifiNvr()) {
            fullType.splice(1, 1);
            fullType = fullType.slice(0, 1);
        } else {
            fullType = fullType.slice(0, 2);
        }

        if (!getConf("isXvrNoMotionAlarmType")) {
            fullType.push(recType2name(RECORD_TYPE_MOTION));
        }

        if (getConf("isXvrNoMotionAlarmType")) {
            if (getConf("isXvrAlarmInEn") > 0) {
                fullType.push(recType2name(RECORD_TYPE_MOTION));
                fullType.push(recType2name(RECORD_TYPE_ALARM));
            } else {
                fullType.push(recType2name(RECORD_TYPE_MOTION));
            }
        }
    }

    onBtnDelAllClk();
    var timeSeltor = $(".J-time-seltor");
    for (var i = 0; i < 7; ++i) {
        for (var j = 0; j < fullType.length; ++j) {
            timeSeltor.timeSegSelect("setCateTimeData", i, fullType[j], fullTime);
        }
    }
}

function recType2name(type) {
    type = ParseInt(type);
    return window.g_mapCate[type] ? window.g_mapCate[type].name : window.g_mapCate[RECORD_TYPE_NORMAL].name;
}

/**
 * 获取数据
 */
function onChChg() {
    loading(true);
    var timeSeltor = $(".J-time-seltor");
    var beginTime, endTime, recordType, type,
        channel = ParseInt($(".J-channal-sel").val());
    onBtnDelAllClk();

    api.record(REQUEST_GET, { "channel": channel }, function (code, str) {
        loading(false);
        if (code != CODE_SUCCESS) {
            return;
        }
        autoFillValue('record', str);
        var schedTime = str.schedTime;

        // 时间段赋值
        for (var j = 0; j < schedTime.length; ++j) {
            for (var i = 0; i < schedTime[j].oneDay.length; ++i) {

                // 秒转为分钟
                beginTime = schedTime[j].oneDay[i].startTime / 60;
                endTime = schedTime[j].oneDay[i].endTime / 60;
                if (beginTime === 0 && endTime === 0) continue;

                for (var index in window.g_mapCate) {
                    type = ParseInt(schedTime[j].oneDay[i].recordType);
                    index = ParseInt(index);

                    if ((type & index) !== 0) {
                        recordType = recType2name(index);
                        timeSeltor.timeSegSelect("addCateTimeData", j, recordType, beginTime, endTime);
                    }
                }
            }
        }
    });
}

function onDelSegClk() {
    $(".J-time-seltor .J-btn-del").click();
    $(".J-time-popup-block").hide();
}

function onSaveSegClk() {
    var timeSeltor = $(".J-time-seltor");
    var btnDel = timeSeltor.find(".J-btn-del");
    var checkList = $(".J-check-type input:checked").not(".J-check-all");
    var getTimeObj = $(".J-time-edit input");
    var beginTime = getTimeObj.eq(0).val() * 60 + ParseInt(getTimeObj.eq(1).val()),
        endTime = getTimeObj.eq(2).val() * 60 + ParseInt(getTimeObj.eq(3).val()),
        week = ParseInt(btnDel.attr("w"));

    if (beginTime >= endTime) {
        rightPopup(lang.setTimeTips2);
        return;
    }

    timeSeltor.timeSegSelect("backup");

    // 删除旧数据重新添加
    var bDelMAed = false;
    var nameAlarm = recType2name(RECORD_TYPE_ALARM),
        nameMotion = recType2name(RECORD_TYPE_MOTION),
        nameMA = recType2name(RECORD_TYPE_RECORD_TYPE_MOTION_AND_ALARM);

    for (var i = 0; i < checkList.length; ++i) {
        var name = checkList.eq(i).attr("name");
        timeSeltor.timeSegSelect("delCateTimeData", week, name, btnDel.attr("i")); // 先删除
        if (!bDelMAed && (name === nameAlarm || name === nameMotion)) {
            bDelMAed = true;
            timeSeltor.timeSegSelect("delCateTimeInTime", week, recType2name(RECORD_TYPE_RECORD_TYPE_MOTION_AND_ALARM), beginTime, endTime);
        } else if (name === nameMA) {
            timeSeltor.timeSegSelect("delCateTimeInTime", week, recType2name(RECORD_TYPE_MOTION), beginTime, endTime);
            timeSeltor.timeSegSelect("delCateTimeInTime", week, recType2name(RECORD_TYPE_ALARM), beginTime, endTime);
        }
        timeSeltor.timeSegSelect("addCateTimeData", week, name, beginTime, endTime);
    }

    if (getWeekSegNum(week) > MAX_SEG_NUM) {
        rightPopup(lang.tipSegOverflow);

        // 回滚
        timeSeltor.timeSegSelect("rollback");
        return;
    }
    checkList.length == 0 ? "" : rightPopup(lang.saved);
    $(".J-time-popup-block").hide();
    onRecSaveClk();
}

function onTimeSegChg(weekIdx, name, timeData) {
    if (name === recType2name(RECORD_TYPE_ALARM) || name === recType2name(RECORD_TYPE_MOTION)) {
        var nameMA = recType2name(RECORD_TYPE_RECORD_TYPE_MOTION_AND_ALARM);

        for (var i = 0; i < timeData.length; ++i) {
            this.delCateTimeInTime(weekIdx, nameMA, timeData[i][0], timeData[i][1]);
        }

    } else if (name === recType2name(RECORD_TYPE_RECORD_TYPE_MOTION_AND_ALARM)) {
        var nameAlarm = recType2name(RECORD_TYPE_ALARM),
            nameMotion = recType2name(RECORD_TYPE_MOTION);

        for (var i = 0; i < timeData.length; ++i) {
            this.delCateTimeInTime(weekIdx, nameAlarm, timeData[i][0], timeData[i][1]);
            this.delCateTimeInTime(weekIdx, nameMotion, timeData[i][0], timeData[i][1]);
        }
    }

    if (getWeekSegNum(weekIdx) > MAX_SEG_NUM) {
        setTimeout(function () {
            rightPopup(lang.tipSegOverflow);
        }, 1);
        $(".J-time-seltor").timeSegSelect("rollback");
    }

    $(".J-time-seltor .J-btn-del").prop("disabled", true);
}

function onMoreSettingClk() {
    var dlgSetting = {
        "resizable": false,
        "height": "auto",
        "width": "400px",
        "draggable": false,
        "modal": true,
        "buttons": {},
        "position": {
            "of": $(".J-time-seltor"),
            "at": "center",
            "my": "right"
        }
    };

    dlgSetting.buttons[lang.default] = function () {
        var $recTime = $("[matchval='getrecstateexpectedtime']");
        var $recDelayTime = $("[matchval='getrecstatedelaytime']");
        $recTime.val($recTime.attr("def"));
        $recDelayTime.val($recDelayTime.attr("def"));
        $(this).dialog("destroy");
        loading(true);
        var defaultItemList = isXVR() ? [34] : [32]
        api.default(REQUEST_SET, {
            "channel": 250,
            "defaultItemList": defaultItemList
        }, function (code, data) {
            loading(false);
            if (code != CODE_SUCCESS) return;
            rightPopup(lang.saved);
            onChChg();
        })
    };

    dlgSetting.buttons[lang.save] = onMoreSettingSave;
    dlgSetting.buttons[lang.cancel] = function () {
        $(this).dialog("destroy");
    };

    $(".J-more-setting").dialog(dlgSetting);
}

function onMoreSettingSave() {
    $(this).dialog("destroy");
    onRecSaveClk();
}

/**
 * 时间段保存
 */
function onRecSaveClk() {
    var recData = getValidRecData();

    if (!recData) {
        rightPopup(lang.recinvalidsce);
        return;
    }

    loading(true);
    var data = [], dayArr = [], startTime, endTime;

    // 获取时间小段数据
    var getDayArr = function (i) {
        dayArr = [];

        for (var j = 0; j < 6; ++j) {
            var sHour = recData[i][j] ? recData[i][j].sHour : 0,
                eHour = recData[i][j] ? recData[i][j].eHour : 0,
                sMin = recData[i][j] ? recData[i][j].sMin : 0,
                eMin = recData[i][j] ? recData[i][j].eMin : 0,
                type = recData[i][j] ? recData[i][j].type : 0;

            startTime = (sHour * 3600 + sMin * 60);
            endTime = (eHour * 3600 + eMin * 60);
            dayArr.push({
                recordType: type,
                startTime: startTime,
                endTime: endTime
            })
        }

        return dayArr;
    }

    // 拼接一周时间数据
    for (var i = 0; i < recData.length; ++i) {
        data.push({
            weekDay: i,
            segNum: recData[i].length,
            oneDay: getDayArr(i),
        })
    }

    var recordData = getMatchValue('record');
    var params = {
        channel: recordData.curChannel,
        enableSchedTime: recordData.enableSchedTime,
        schedTime: data,
        expectedTime: recordData.expectedTime,
        delayTime: recordData.delayTime
    }

    api.record(REQUEST_SET, params, function (code, str) {
        loading(false);
        rightPopup(code == 0 ? lang.saved : lang.savedfail);
    });
}

function getValidRecData(bNoRet) {
    var weekSet = new Array(7);
    var timeSeltor = $(".J-time-seltor");

    for (var week = 0; week < 7; ++week) {
        weekSet[week] = {};
        for (var type in window.g_mapCate) {
            type = ParseInt(type);
            var timeData = timeSeltor.timeSegSelect("getCateTimeData", week, window.g_mapCate[type]["name"]);
            for (var j = 0; j < timeData.length; ++j) {
                var key = timeData[j][0] + "-" + timeData[j][1];
                if (weekSet[week][key]) {
                    // 已有重复时间段
                    weekSet[week][key]["type"] |= type;
                } else if (mapSize(weekSet[week]) >= MAX_SEG_NUM) {
                    return null;
                } else {
                    weekSet[week][key] = {
                        "type": type,
                        "time": timeData[j]
                    };
                }
            }
        }
    }
    if (bNoRet) return true;

    var ret = new Array(7);
    for (var w = 0; w < weekSet.length; ++w) {
        ret[w] = [];
        for (var k in weekSet[w]) {
            weekSet[w][k]
            ret[w].push({
                "type": weekSet[w][k].type,
                "sHour": Math.floor(weekSet[w][k]["time"][0] / 60),
                "sMin": weekSet[w][k].time[0] % 60,
                "eHour": Math.floor(weekSet[w][k]["time"][1] / 60),
                "eMin": weekSet[w][k].time[1] % 60
            });
        }
    }
    return ret;
}

function onSegDrawBegin(week, name) {
    $(".J-time-seltor").timeSegSelect("backup");
    if (getWeekSegNum(week) >= MAX_SEG_NUM) {
        setTimeout(function () {
            rightPopup(lang.tipSegOverflow);
        }, 1);
        return false;
    }
    return true;
}

function onSegDrawEnd(week, name) {
    if (getWeekSegNum(week) > MAX_SEG_NUM) {
        setTimeout(function () {
            rightPopup(lang.tipSegOverflow);
        }, 1);
        return false;
    }
    return true;
}

function getWeekSegNum(week) {
    var timeSeltor = $(".J-time-seltor");
    var container = {},
        segNum = 0;;
    for (var type in window.g_mapCate) {
        type = ParseInt(type);
        var timeData = timeSeltor.timeSegSelect("getCateTimeData", week, window.g_mapCate[type].name);
        for (var j = 0; j < timeData.length; ++j) {
            var key = timeData[j][0] + "-" + timeData[j][1];
            if (!container[key]) {
                container[key] = 1;
                ++segNum;
            }
        }
    }
    return segNum;
}

function listenEvent() {
    $('.J-channal-sel').on('change', function () {
        onChChg();
    });

    $(".J-del-of-in").on("click", function () {
        onDelSegClk();
    })

    $(".J-more-setting-btn").click(function () {
        onMoreSettingClk();
    })

    $(".J-save-of-in").click(function () {
        onSaveSegClk();
    })

    $(".J-record-save").click(function () {
        onRecSaveClk();
    })
}

/**
 * 加载encode
 */
function onEncodeLoad() {
    isXVR() ? loadXvrEncode(0) : initEncodeNvr();
}

/* 编码参数NVR */
var encodeVariables = {
    //私有变量
    mainResolution: new Array(), // 主分辨率
    subresolution: new Array(), // 子分辨率
    protocol: 0,
    loadData: {},
    encode254265: false
};

function isChEnb(chIdx) {
    return window.top.nRecordDatabit[chIdx] == 1;
}

/**
 * 初始化nvr编码
 */
function initEncodeNvr() {
    $(".J-nvr-encode").show();
    setTitle(lang.optionencodeparam);

    if (!isNVR()) {
        $('.J-encode-mode').append('<option value="1">A/V</option>');
        $('#getahdencodemainencodemode2').append('<option value="1">A/V</option>');
    }

    setEditNumberStyle(".J-sub-bitrate");

    initChannelSelect($(".J-nvr-encode-chn"), encodXvrVariables.channelNum, function (iCh) {
        return window.top.nRecordDatabit[iCh] && isChEn(iCh);
    });

    // 通道处理
    var firstChannel = $(".J-nvr-encode-chn").val();
    if (!firstChannel && firstChannel != 0) {
        rightPopup(lang.nolimit);
        $(".J-save-code-nvr").attr("disabled", true);
        return;
    }

    if (window.top.m_nEncodeSelChannel !== undefined) {
        firstChannel = window.top.m_nEncodeSelChannel;
        window.top.m_nEncodeSelChannel = undefined;
        $(".J-nvr-encode-chn").val(firstChannel);
    }

    $(".J-nvr-encode-chn").change();

    if (getConf("nvrNew")) {
        $("#streamhide").removeClass("hide");
        var getEncodeType = function (i) {
            var data = encodeVariables.loadData;
            if (data[i].encodeType) {
                initSelect($(".J-nvr-code-type"), data[i].encodeTypeList)
            } else {
                $(".J-nvr-code-type").empty();
            }

            $(".J-nvr-code-type").val(data[i].encodeType).change();
        }

        $(".J-stream-type").change(function () {
            if ($(this).val() == '0') {
                $("#mainhide").removeClass("hide");
                $("#subhide").addClass("hide");
                $(".J-code-type").removeClass("hide");
                getEncodeType(0)
            } else {
                $("#subhide").removeClass("hide");
                $("#mainhide").addClass("hide");
                $(".J-sub-code-type").removeClass("hide");
                getEncodeType(1)
            }
        });
        return;
    }

    $("#streamhide").addClass("hide");
    $("#mainhide").removeClass("hide");
    $("#subhide").removeClass("hide");
}

/**
 * 获取NvrEncode设置
 * @param {int} num 通道号
 **/
function loadEncodeSetting(num) {
    $(".J-frame-rate-range").html('');
    $(".J-sub-frame-rate-range").html('');
    $(".J-H264-H265").hide();
    api.videoEncode(REQUEST_GET, { "channel": parseInt(num) }, function (code, str) {
        if (code != CODE_SUCCESS) {
            $("#mainhide,#subhide").hide();
            $(".J-stream-type, .J-nvr-code-type, .J-save-code-nvr").attr("disabled", true);
            return;
        }

        $("#mainhide,#subhide").show();
        $(".J-stream-type, .J-nvr-code-type, .J-save-code-nvr").attr("disabled", false);

        var data = encodeVariables.loadData = str.streamEncode
        encodeVariables.encode254265 = str.supportSmartEncode;
        if (encodeVariables.encode254265) {
            $(".J-H264-H265").show();
        }

        // 分辨率
        if (data[0].encodeResolution) {
            initSelect($(".J-resolution"), data[0].encodeResolutionList)
            encodeVariables.mainResolution = data[0].encodeResolutionList;
        } else {
            $(".J-resolution").empty();
        }

        if (data[1].encodeResolution) {
            initSelect($(".J-sub-resultion"), data[1].encodeResolutionList)
            encodeVariables.subResolution = data[1].encodeResolutionList;
        } else {
            $(".J-sub-resultion").empty();
        }

        // 帧率范围
        for (var k = parseInt(data[0].encodeFrameRateMin); k <= parseInt(data[0].encodeFrameRateMax); ++k) {
            $(".J-frame-rate-range").append("<option value='" + k + "'>" + k + "</option>");
        }

        for (var k = parseInt(data[1].encodeFrameRateMin); k <= parseInt(data[1].encodeFrameRateMax); ++k) {
            $(".J-sub-frame-rate-range").append("<option value='" + k + "'>" + k + "</option>");
        }

        // 数据赋值
        autoFillValue("encode", data[0])
        autoFillValue("encodeSub", data[1])

        str.enableSmartH264 ? str.enableSmartH264 = 1 : str.enableSmartH264 = 0;
        str.enableSmartH265 ? str.enableSmartH265 = 1 : str.enableSmartH265 = 0

        autoFillValue("codeType", str)

        $(".J-resolution").change();
        $(".J-frame-rate-range").change();
        $(".J-sub-resultion").change();
        $(".J-sub-frame-rate-range").change();

        // NVR默认范围
        var min = data[1].encodeBiterateMin, max = data[1].encodeBiterateMax, def = 64;
        if (!isNVR()) {
            min = 0;
            if (getDevConf('platformType') != 12 && getDevConf('platformType') != 8) {
                max = 12000;
            }
        }

        // 码率(Kb/S)
        $(".J-sub-bitrate").attr({
            "min": min,
            "max": max,
            "def": def
        });

        $("#mainhide").data("main-code", data[0])
        $("#subhide").data("sub-code", data[1])

        // xvr.getChanDevInfo_Manual(num, false, function (code, str) {
        //     window["g_onvifDisSc"] = false;
        //     if (code == HTTP_OK) {
        //         var dt = splitOkVal(str);
        //         // 私有协议且支持编码时
        //         if (dt.getchanmanprotocoltype == 4 && encodeVariables.encode254265) {
        //             $("#getahencode264enable,#getahencode265enable").prop("disabled", false);
        //         } else {
        //             $("#getahencode264enable,#getahencode265enable").prop("disabled", true);
        //         }
        //     }
        // });
    });
}

/**
 * 保存操作
 */
function encodeSaveNvr() {
    var streamType = ParseInt($(".J-stream-type").val());
    if ($(".J-bite-rate").val() < 64 && !streamType) {
        lightTipDom($(".J-bite-rate"));
        rightPopup(lang.bitrateType + lang.fanwei + "64--12000");
        return;
    }

    if ($(".J-sub-bitrate").val() < 64 && streamType) {
        lightTipDom($(".J-sub-bitrate"));
        if (getDevConf('platformType') == 12 || getDevConf('platformType') == 8 || getDevConf('platformType') == 11) {
            rightPopup(lang.bitrateType + lang.fanwei + "64--2048");
        } else {
            rightPopup(lang.bitrateType + lang.fanwei + "64--12000");
        }
        return;
    }

    if (getDevConf('platformType') == 10 && streamType) {
        if (window.top.is4K) {
            if (Number($(".J-sub-frame-rate-range").val()) > 25) {
                rightPopup(lang.nosupport12);
                return;
            }
        }
    }

    // 待优化
    var parms = {
        "channel": parseInt($(".J-nvr-encode-chn").val()),
        "streamEncode": [{
            "streamNo": 0,
            "encodeType": $(".J-nvr-code-type").data('code-type'),
            "streamType": 0,
            "encodeBiterate": parseInt($(".J-bite-rate").val()),
            "encodeFrameRate": parseInt($(".J-frame-rate-range").val()),
            "encodeResolution": $(".J-resolution").val(),
            "encodeBitrateType": parseInt($(".J-encode-bitrate-type").val()),
        }, {
            "streamNo": 1,
            "encodeType": $(".J-nvr-code-type").data('sub-code-type'),
            "streamType": 0,
            "encodeBiterate": parseInt($(".J-sub-bitrate").val()),
            "encodeFrameRate": parseInt($(".J-sub-frame-rate-range").val()),
            "encodeResolution": $(".J-sub-resultion").val(),
            "encodeBitrateType": parseInt($(".J-sub-bitrate-type").val()),

        }],
        "enableSmartH264": $(".J-264-enable").val() == 0 ? false : true,
        "enableSmartH265": $(".J-265-enable").val() == 0 ? false : true
    };

    api.videoEncode(REQUEST_SET, parms, function (code, str) {
        if (code != CODE_SUCCESS) {
            rightPopup(lang.savedfail);
            return;
        }
        rightPopup(lang.saved);
    })
}

function initSelect(ele, list) {
    var $node = ele;
    $node.empty();
    for (var i = 0; i < list.length; ++i) {
        $node.append("<option value='" + list[i] + "'>" + list[i] + "</option>");
    }
}

function initEncodeEvent() {
    $(".J-nvr-encode-chn").on("change", function () {
        loadEncodeSetting(($(this).val()));
    });
    // mjpeg下隐藏
    $(".J-nvr-code-type").change(function () {
        var selected = $(this).val();
        if (selected == "MJPEG" || !encodeVariables.encode254265) {
            $(".J-H264-H265").hide();
        } else {
            $(".J-H264-H265").show();
        }
    });

    $(".J-nvr-code-type").change(function () {
        var selected = $(this).val();
        if (selected == 'H265') {
            $("#H264").hide();
            $("#H265").show();
        }

        if (selected == 'H264') {
            $("#H265").hide();
            $("#H264").show();
        }

        var streamType = $('.J-stream-type').val();
        if (streamType == 0) {
            $(this).data('code-type', selected)
        } else {
            $(this).data('sub-code-type', selected)
        }
        encodeVariables.loadData[Number(streamType)].encodeType = selected

    });

    // $("#getahencode264enable").change(function () {
    //     var tmp = $("#getahencode264enable").val();
    //     $("#getahencode265enable").val(tmp);
    // });

    // $("#getahencode265enable").change(function () {
    //     var tmp = $("#getahencode265enable").val();
    //     $("#getahencode264enable").val(tmp);
    // });

    $(".J-resolution").change(function () {
        var val = $(this).val();
        var frame = $(".J-frame-rate-range").val();
        setBitRateRange($(".J-bite-rate-range"), val, frame, 768, 1280);
    });

    $(".J-frame-rate-range").change(function () {
        var res = $(".J-resolution").val();
        var val = $(this).val();
        setBitRateRange($(".J-bite-rate-range"), res, val, 768, 1280);
    });

    $(".J-sub-resultion").change(function () {
        var val = $(this).val();
        var frame = $(".J-sub-frame-rate-range").val();
        setBitRateRange($("#subbitrateVal"), val, frame, 768, 1280);
    });

    $(".J-sub-frame-rate-range").change(function () {
        var res = $(".J-sub-resultion").val();
        var val = $(this).val();
        setBitRateRange($("#subbitrateVal"), res, val, 768, 1280);
    });

    // 码率
    setEditNumberStyle(".J-bite-rate", false, null);
}

/**
 * @funtion 码率取值范围
 * @Author x_yu
 * @DateTime 2020-01-10
 */
function setBitRateRange($ele, resolution, framerate, bitrateMin, bitrateMax) {
    if (!resolution) {
        $ele.html("");
        return
    };
    var bitMin = '';
    var bitMax = '';
    var bitX = "";  //分辨率系数
    var W = resolution.split("x")[0];
    var H = resolution.split("x")[1];
    if (W * H >= 1920 * 1080) {
        bitX = Math.floor(W * H / 200000);
    } else {
        bitX = Math.floor(W * H / 150000);
    }
    if (framerate >= 10) {
        bitMin = Math.round(bitrateMin * bitX * framerate / 60);
        bitMax = Math.round(bitrateMax * bitX * framerate / 60);
    } else {
        bitMin = Math.round(bitrateMin * bitX * 10 / 60 - (10 - framerate) * ((bitrateMin * bitX * 10 / 60) * (2 / 3) / 9));
        bitMax = Math.round(bitrateMax * bitX * 10 / 60 - (10 - framerate) * ((bitrateMax * bitX * 10 / 60) * (2 / 3) / 9));
    }
    if (bitMax > 12000) {   //如果范围的上限超过12M，范围提示为6M-12M
        bitMin = 6000;
        bitMax = 12000;
    }
    $ele.html(bitMin + "~" + bitMax);
}

/********************************* 编码参数XVR ***************************************/
var encodXvrVariables = {
    //私有变量
    channelNum: getTotalChannelNum(),
    bitRate264: [],
    bitRate265: [],
    mainFrameRate: [],
    subFrameRate: [],
    mainMaxFRate: [],
    subMaxfRate: [],
    mainSelChn: 0, // 主码选择的通道
    chnnEcodeEnable: false,
    encodeSupport: false,
    encodeSupport265: false,
    resValue: { // 跟本地约定好各分辨率对应的值
        "CIF": "0",
        "D1": "1",
        "960H": "2",
        "720P": "3",
        "1080N": "4",
        "3MP_LITE": "5",
        "4MP_LITE": "6",
        "1080P": "7",
        "5MP_LITE": "8",
        "3MP": "9",
        "4MP": "10",
        "8MP_LITE": "11",
        "5MP": "12",
        "8MP": "13"
    },
    // 特化设备, 使用定制分辨率列表
    specDev: [
        "CPU_3521D",
        "CPU_3521D_SMARTKITS",
        "CPU_3531D",
        "CPU_3531D_4AHD_4M_RT",
        "CPU_3521D_8AHD_NRT",
        "CPU_3521D_8AHD_NRT_6168C",
        "CPU_3531D_16AHD_NRT",
        "CPU_3531D_16AHD_NRT_6168C",
        "CPU_3531D_16AHD_NRT_6158C",
        "CPU_3521D_16AHD_NRT",
        "CPU_3531D_32AHD_NRT",
        "CPU_3531DCAS_32AHD_1080P_NRT",
        "CPU_3531DCAS_16AHD_RT",
        "CPU_3531DCAS_16AHD_8SATA_RT",
        "CPU_3531DCAS_16SDI_334S",
        "CPU_3531DCAS_8AHD_4M_RT",
        "CPU_3520DV400",
        "CPU_3520DV400_8AHD_NRT",
        "CPU_3521D_4SDI_334S",
        "CPU_3531D_8SDI_334S",
        "CPU_3520DV400_4AHD_NRT_6158C_2G",
        "CPU_3531D_16AHD_NRT_6158C_2",
        "CPU_3531D_16AHD_NRT_6158C",
        "CPU_3531D_16AHD_NRT_6168C_X1",
        "CPU_3520DV400_4AHD_1080N_RT_6158C",
        "CPU_3520DV400_8AHD_1080N_NRT_6158C",
        "CPU_3520DV400_4AHD_NRT_6158C",
        "CPU_3521D_16AHD_1080N_NRT_6158C",
        "CPU_3521D_8AHD_NRT_6158C",
        "CPU_MC6630_4AHD_NRT_2830",
        "CPU_MC6630_4AHD_1080N_RT_2830",
        "CPU_MC6630_8AHD_1080N_NRT_2830"
    ],
};
encodXvrVariables.isSpecDev = encodXvrVariables.specDev.indexOf(getDevConf('platformType')) !== -1

function initEncodeXvr() {
    setConf("watermarkEn", isXVR());
    $(".J-xvr-encode").show();

    if (getConf("watermarkEn")) {
        $('#iptWatermark').bind("keydown keyup blur", function () {
            checkStringValid($(this).val(), this, 1, true, true);
        });
    }

    setTitle(lang.optionencodeparam);
    if (encodXvrVariables.isSpecDev) {
        // 设备特化, 统一设置主子编码类型
        // 隐藏原本属于主子码流的编码设置
        $("#getahdencodemainencodetype").parents(".form-item").hide();
        $("#getahdencodesubencodetype").parents(".form-item").hide();

        // 克隆主码流的编码设置到统一设置栏最后面
        $("#getahdencodemainencodetype").parents(".form-item").clone().show()
            .insertAfter($("#xvrStreamtype").parents(".form-item"));

        $("#getahdencodemainencodetype").attr("id", "specEncodeType")

        $(document).on("change", ".J-xvr-encode-type", function () {
            var val = $(this).val();

            if (encodXvrVariables.encodeSupport) {
                if (val == 'H265') {
                    $("#getahencode264enable").prop("disabled", true).parents(".form-item").hide();
                    $("#getahencode265enable").prop("disabled", false).parents(".form-item").show().prop("checked", false).change();

                    // 开启265固定编码等级
                    $("#getahdencodeencodetype").val(1).prop("disabled", true);
                } else {

                    $("#getahencode264enable").prop("disabled", false).parents(".form-item").show();
                    $("#getahencode265enable").prop("disabled", true).parents(".form-item").hide();
                    $("#getahencode264enable").prop("checked", false).change();

                    if (window.top.vChannelConfig[$(".J-xvr-encode-channel").val()] == 1) {
                        $("#getahdencodeencodetype").prop("disabled", false);
                    }
                }
            }
        });
    } else {
        $("#getahdencodemainencodetype").change(function () {
            reflushBitrate();
            var $this = $(this);
            if ($this.val() == "1") {
                $("#getahencode265enable").change();
            } else {
                $("#getahencode264enable").change();
            }
        });
        $("#getahdencodesubencodetype").change(function () {
            reflushBitrate();
            var $this = $(this);
            if ($this.val() == "1") {
                $("#getahencode265enable").change();
            } else {
                $("#getahencode264enable").change();
            }
        });
    }

    initChannelSelect($(".J-xvr-encode-channel"), encodXvrVariables.channelNum, function (iCh) {
        return window.top.nRecordDatabit[iCh] && isChEn(iCh);
    });

    // 是否添加通道跳转编辑
    var firstChannel = $(".J-xvr-encode-channel").val();
    if (!firstChannel) {
        rightPopup(lang.nolimit);
        return;
    }

    //初始化 第一通道发送请求
    getEncodeFramerate(0);
    if (window.top.m_nEncodeSelChannel !== undefined) {
        firstChannel = window.top.m_nEncodeSelChannel;
        $(".J-xvr-encode-channel").val(firstChannel);
        window.top.m_nEncodeSelChannel = undefined;
    }

    $("#childStream").hide();
    $("#mainStream").show();

    $(".J-xvr-encode-channel").change(function () {
        var ch = ParseInt($(this).val());
        loadXvrEncode(ch);
        encodXvrVariables.mainSelChn = ch;
    }).change();

    $("#xvrStreamtype").change(function () {
        var encodeVal = '';

        if ($(this).val() == 0) {
            encodeVal = $("#getahdencodemainencodetype").val();
            $("#childStream").hide();
            $("#mainStream").show();
            $(".J-xvr-encode-type").parents(".form-item").show();
            reflushBitrate();
        } else if ($(this).val() == 1) {
            $("#mainStream").hide();
            $("#childStream").show();
            $(".J-xvr-encode-type").parents(".form-item").hide();
            reflushBitrate();
            encodeVal = $("#getahdencodesubencodetype").val();
        }

        if (!encodXvrVariables.encodeSupport) return;
        if (encodeVal == 'H264') {
            $("#getahencode265enable").parents(".form-item").hide();
            $("#getahencode264enable").parents(".form-item").show();
        } else {
            $("#getahencode264enable").parents(".form-item").hide();
            $("#getahencode265enable").parents(".form-item").show();
        }
    });

    setEditNumberStyle("#mainBitrate", false, null);
    setEditNumberStyle("#subBitrate", false, null);

    //1:模拟机   0:IPC
    $("#mainRes").change(function () {
        reflushBitrate();
        if (isHD($(".J-xvr-encode-channel").val())) {
            $("#getahdencodemainframerate").val(encodXvrVariables.mainFrameRate[$("#mainRes").val()]);
        }
    });

    $("#mainQuality").change(function () {
        reflushBitrate();
    });

    $("#subRes").change(function () {
        $("#getahdencodesubframerate").val(encodXvrVariables.subFrameRate[$("#subRes").val()]);
        reflushBitrate();
        var subThis = $(this).val();
        // 切换分辨率时 获取帧率
        subFrameRate(encodXvrVariables.subFrameRate[subThis])
    });

    $("#subQuality").change(function () {
        reflushBitrate();
    });

    var funAhdChg = function (bEnable) {
        if (bEnable) {
            $("#getahdencodemainstreamcontrol").val(0).prop('disabled', true);
            $("#getahdencodesubstreamcontrol").val(0).prop('disabled', true);
            // $("#getahdencodemainiframeinterval").prop('disabled', true);
            // $("#getahdencodesubiframeinterval").prop('disabled', true);
            // $("[name='iframeintervalslide']").slider('disable');
            // $("[name='subiframeintervalslide']").slider('disable');
        } else {
            $("#getahdencodemainstreamcontrol").prop('disabled', encodXvrVariables.mainModeListDisable);
            $("#getahdencodesubstreamcontrol").prop('disabled', encodXvrVariables.subModeListDisable);
            $("#getahdencodemainiframeinterval").prop('disabled', false);
            $("#getahdencodesubiframeinterval").prop('disabled', false);
            $("[name='iframeintervalslide']").slider('enable');
            $("[name='subiframeintervalslide']").slider('enable');
        }
    };

    $("#getahencode264enable").change(function () {
        funAhdChg($(this).val() == "1");
    });

    $("#getahencode265enable").change(function () {
        funAhdChg($(this).val() == "1");
    });

    if (isCpuEq("CPU_3520DV400_4AHD_NRT_6158C_2G")) {
        $("#getahdencodemainencodemode option").last().remove();
        $("#getahdencodesubencodemode option").last().remove();
    }
    getConf("isCPUMC6630") && $('#getahdaudioencodetype option').eq(2).remove();
    isNVR() && $("#audioInputType").hide();
}

function loadXvrEncode(num) {
    $("#cameraresolution").val("");
    $(".J-xvr-encode-channel").val(num);
    encodXvrVariables.mainSelChn = num;
    num = ParseInt(num);
    var mainminframerate = 0;
    var mainbiterate = 0;

    var mainmaxframeratectrl = 0;
    var mainminframeratectrl = 0;
    var submaxframeratectrl = 0;
    var subminframeratectrl = 0;
    var cameraresolution = '';
    var mainresolution = 0;

    // 根据通道类型禁用
    if (vChannelConfig[num] == 0) { // 为ipc时
        $(".J-is-ipc-disabled").attr("disabled", true);
    } else {
        $(".J-is-ipc-disabled").attr("disabled", false);
    }

    $("#xvrStreamtype").val(0).change();

    var funcLoaded = function (code, data) {
        if (code != CODE_SUCCESS) {
            $("#cameraresolution").val("NO VIDEO");
            return;
        };
        data.enableSmartH264 = data.enableSmartH264 ? 1 : 0;
        data.enableSmartH265 = data.enableSmartH265 ? 1 : 0;

        $("#iptWatermarkEn").attr("checked", data.enableWatermarking)
        $("#iptWatermark").val(data.watermarkingText)

        var dealData = function (data) {
            var mainEncodeType = []
            for (var i = 0; i < data.length; i++) {
                mainEncodeType.push({
                    val: data[i],
                    name: data[i].toUpperCase()
                })
            }
            return mainEncodeType
        }

        var renderSelect = function (ele, config) {
            ele.html('')
            ele.append(
                dotRender("formSelectModel", config)
            )
        }

        renderSelect($(".J-xvr-encode-type-main"), {
            "list": dealData(data.streamEncode[0].videoEncodeTypeList),
            "attr": { "id": "getahdencodemainencodetype", "class": "medium-select J-xvr-encode-type", "matchval": "xvrStreamEncodeMain.videoEncodeType.", "str": "1" }
        })

        renderSelect($(".J-xvr-resolution-select"), {
            "list": dealData(data.streamEncode[0].encodeResolutionList),
            "attr": { "id": "mainRes", "class": "medium-select", "matchval": "xvrStreamEncodeMain.encodeResolution.", "str": "1" }
        })


        if (data.streamEncode[1]) {
            renderSelect($(".J-xvr-encode-type-sub"), {
                "list": dealData(data.streamEncode[1].videoEncodeTypeList),
                "attr": { "id": "getahdencodesubencodetype", "class": "medium-select J-xvr-encode-type", "matchval": "xvrStreamEncodeSub.videoEncodeType.", "str": "1" }
            })

            renderSelect($(".J-xvr-resolution-select-sub"), {
                "list": dealData(data.streamEncode[1].encodeResolutionList),
                "attr": { "id": "subRes", "class": "medium-select", "matchval": "xvrStreamEncodeSub.encodeResolution.", "str": "1" }
            })
        }

        renderSlide(data);
        var streamEncodeMain = data.streamEncode[0],
            streamEncodeSub = data.streamEncode[1];

        // 当然值大于最大值时就取最大值
        streamEncodeMain.encodeFrameRate > streamEncodeMain.encodeFrameRateMax && (streamEncodeMain.encodeFrameRate = streamEncodeMain.encodeFrameRateMax);
        streamEncodeSub.encodeFrameRate > streamEncodeSub.encodeFrameRateMax && (streamEncodeSub.encodeFrameRate = streamEncodeSub.encodeFrameRateMax);

        encodXvrVariables.encodeSupport = data.supportSmartEncode;
        encodXvrVariables.encodeSupport ? $(".J-xvr-h265-4").show() : $(".J-xvr-h265-4").hide();

        for (var i = 1; i <= encodXvrVariables.channelNum; i++) {
            if (window.top.nRecordDatabit[i - 1]) {
                encodXvrVariables.chnnEcodeEnable = true;
                break;
            }
        }

        // 码流控制根据码流list长度判断
        encodXvrVariables.mainModeListDisable = streamEncodeMain.streamModeList.length == 1;
        encodXvrVariables.subModeListDisable = streamEncodeSub.streamModeList.length == 1;

        $('#getahdencodemainstreamcontrol').prop("disabled", encodXvrVariables.mainModeListDisable);
        $('#getahdencodesubstreamcontrol').prop("disabled", encodXvrVariables.subModeListDisable);
        $('#mainBitrate').prop("disabled", streamEncodeMain.encodeBiterate == streamEncodeMain.encodeBiterateMax);
        $('#subBitrate').prop("disabled", streamEncodeSub.encodeBiterate == streamEncodeSub.encodeBiterateMax);

        autoFillValue("xvrEncode", data);
        autoFillValue("xvrStreamEncodeMain", streamEncodeMain);
        autoFillValue("xvrStreamEncodeSub", streamEncodeSub);
        renderSlide(data);

        return

        var reg = new RegExp(/OK (.+?)=(.+?)\r?\n/g);
        var match = null,
            map = {};
        while (match = reg.exec(str)) {
            map[match[1]] = match[2];
        }
        if (map["get264biteratevalue"]) {
            var arrTmp = map["get264biteratevalue"].split("@");
            encodXvrVariables.bitRate264 = [];
            for (var i = 0; i < arrTmp.length; ++i) {
                encodXvrVariables.bitRate264.push(arrTmp[i].split(";"));
            }
        }
        if (map["get265biteratevalue"]) {
            var arrTmp = map["get265biteratevalue"].split("@");
            encodXvrVariables.bitRate265 = [];
            for (var i = 0; i < arrTmp.length; ++i) {
                encodXvrVariables.bitRate265.push(arrTmp[i].split(";"));
            }
        }


        if (ParseInt(window.top.vChannelConfig[encodXvrVariables.mainSelChn]) == 1) {
            switch (map["getahdencodechannelstd"]) {
                case '0':
                    cameraresolution = "TVI ";
                    break;
                case '1':
                    cameraresolution = "AHD ";
                    break;
                case '2':
                    cameraresolution = "CVI ";
                    break;
                case '3':
                    cameraresolution = "CVBS ";
                    break;
                case '5':
                    cameraresolution = "EX-SDI ";
                    break;
            }
        }

        mainresolution = ParseInt(map["getahdencodemainresolution"]);
        mainResVal = parseInt(map["getahdencodemainresolution"]);
        subResVal = parseInt(map["getahdencodesubresolution"]);
        map["getahdencodemainmaxframerate"] &&
            isHD(num) ? (encodXvrVariables.mainMaxFRate = encodXvrVariables.mainFrameRate[mainResVal]) : (encodXvrVariables.mainMaxFRate = map["getahdencodemainmaxframerate"].split(";")[0]);
        map["getahdencodemainminframerate"] &&
            (mainminframerate = map["getahdencodemainminframerate"].split(";")[0]);
        map["getahdencodesubmaxframerate"] &&
            isHD(num) ? (encodXvrVariables.subMaxfRate = encodXvrVariables.subFrameRate[subResVal]) : (encodXvrVariables.subMaxfRate = map["getahdencodesubmaxframerate"].split(";")[0]);
        map["getahdencodesubminframerate"] &&
            (subminframerate = map["getahdencodesubminframerate"].split(";")[0]);
        map["getahdencodemainmaxiframeinterval"] &&
            (mainmaxframeratectrl = map["getahdencodemainmaxiframeinterval"].split(";")[0]);
        map["getahdencodemainminiframeinterval"] &&
            (mainminframeratectrl = map["getahdencodemainminiframeinterval"].split(";")[0]);
        map["getahdencodesubmaxiframeinterval"] &&
            (submaxframeratectrl = map["getahdencodesubmaxiframeinterval"].split(";")[0]);
        map["getahdencodesubminiframeinterval"] &&
            (subminframeratectrl = map["getahdencodesubminiframeinterval"].split(";")[0]);
        if (map["getahdencodemainresolutionjoin"]) {
            var res = map["getahdencodemainresolutionjoin"].split(";");
            if (res[res.length - 1] == "") {
                res.splice(res.length - 1, 1);
            }
            var $node = $("#mainRes");
            $node.empty();
            for (var i = 0; i < res.length; ++i) {
                var showText = res[i];
                if (encodXvrVariables.isSpecDev && parseInt(window.top.vChannelConfig[num]) == 1) {
                    $node.append("<option value='" + encodXvrVariables.resValue[res[i]] + "'>" + showText + "</option>");
                } else {
                    $node.append("<option value='" + i + "'>" + showText + "</option>");
                }
            }
            if (ParseInt(window.top.vChannelConfig[encodXvrVariables.mainSelChn]) == 1) {
                var last = res[res.length - 1];
                if (last.substr(last.length - 1) === "N") {
                    last = last.substr(0, last.length - 1) + "P";
                } else if (last.substr(last.length - 5) === "_LITE") {
                    last = last.substr(0, last.length - 5);
                }
                cameraresolution = cameraresolution + last;
            } else if (ParseInt(window.top.vChannelConfig[encodXvrVariables.mainSelChn]) == 0) {
                cameraresolution = "IPC " + map["getahdencodemainresolutionjoin"].split(';')[mainresolution];
                $("#cameraresolution").val(cameraresolution);
            } else {
                $("#cameraresolution").val("NO VIDEO");
            }
        } else {
            $("#mainRes").empty();
            $("#cameraresolution").val("NO VIDEO");
        }
        if (map["getahdencodesubresolutionjoin"]) {
            var res = map["getahdencodesubresolutionjoin"].split(";");
            var $node = $("#subRes");
            $node.empty();
            for (var i = 0; i < res.length; ++i) {
                res[i] && $node.append("<option value='" + i + "'>" + res[i] + "</option>");
            }
        } else {
            $("#subRes").empty();
        }
        if (cameraresolution && (window.top.vChannelConfig[encodXvrVariables.mainSelChn]) == 1) {
            if (cameraresolution && cameraresolution != "NO VIDEO") {
                cameraresolution = cameraresolution + map["getahdencodeviframerate"];
                if (map["getahdencodeviframerate"] == 0) {
                    cameraresolution = "NO VIDEO";
                }
            }
            $("#cameraresolution").val(cameraresolution);
        }

        var $framerateslideInputs = $('[name="framerate"]');
        var $framerateslide = $('.slide[name="framerateslide"]');
        $framerateslideInputs.each(function (index) {
            var $this = $(this);
            $this.keyup(function (event) {
                if (event.keyCode == 13) {
                    var tmpVal = ParseInt($this.val());
                    if (tmpVal >= mainminframerate && tmpVal <= encodXvrVariables.mainMaxFRate) {
                        $this.val(tmpVal);
                        $framerateslide.eq(index).slider("value", tmpVal);
                    }
                }
            })
        });
        split_span_val_type2(str);

        if (ParseInt(window.top.vChannelConfig[encodXvrVariables.mainSelChn]) == 1) {
            $framerateslide.each(function (index) {
                $(this).slider({
                    max: ParseInt(encodXvrVariables.mainMaxFRate),
                    min: ParseInt(mainminframerate),
                    value: $framerateslideInputs.eq(index).val(),
                    slide: function (event, ui) {
                        $framerateslideInputs.eq(index).val(ui.value);
                        reflushBitrate();
                    }
                })
            });
        } else if (ParseInt(window.top.vChannelConfig[encodXvrVariables.mainSelChn]) == 0) {
            $framerateslide.each(function (index) {
                $(this).slider({
                    max: ParseInt(encodXvrVariables.mainMaxFRate),
                    min: ParseInt(mainminframerate),
                    value: $framerateslideInputs.eq(index).val(),
                    slide: function (event, ui) {
                        $framerateslideInputs.eq(index).val(ui.value);
                    },
                    change: function (event, ui) {
                        return false;
                    }
                })
            });
        }
        subFrameRate(encodXvrVariables.subMaxfRate)


        reflushBitrate();

        if ($("[matchval='getahdencodemainframerate']").val() > ParseInt(encodXvrVariables.mainMaxFRate)) {
            $("[matchval='getahdencodemainframerate']").val(ParseInt(encodXvrVariables.mainMaxFRate));
            $("#getahdencodemainframerate").val(ParseInt(encodXvrVariables.mainMaxFRate));
        }
        if ($("[matchval='getahdencodesubframerate']").val() > ParseInt(encodXvrVariables.subMaxfRate)) {
            $("[matchval='getahdencodesubframerate']").val(ParseInt(encodXvrVariables.subMaxfRate));
            $("#getahdencodesubframerate").val(ParseInt(encodXvrVariables.subMaxfRate));
        }

        if (encodXvrVariables.isSpecDev) {
            var $node = $("#specEncodeType");
            $node.empty();
            if (map["getahdencodemainencodetype"]) {
                var cts = map["getahdencodemainencodetype"].split(";");
                var encodetype = Math.min(map["getahdencodemainencodetype"].split("_")[0], cts.length - 1);
                for (var i = 0; i < cts.length - 1; ++i) {
                    if (cts[i].indexOf("_") != -1) {
                        var tmp = cts[i].split("_");
                        $node.append("<option value='" + i + "'>" + (String(tmp[1]).toUpperCase()) + "</option>");
                    } else {
                        $node.append("<option value='" + i + "'>" + (String(cts[i]).toUpperCase()) + "</option>");
                    }
                }
                $("#getahdencodemainencodetype").remove();
                $("#getahdencodesubencodetype").remove();
                $node.clone().hide().attr({
                    "matchval": "getahdencodemainencodetype",
                    "id": "getahdencodemainencodetype"
                }).insertAfter($node);
                $node.clone().hide().attr({
                    "matchval": "getahdencodesubencodetype",
                    "id": "getahdencodesubencodetype"
                }).insertAfter($node);
            }

            $node.val(encodetype).change();
        } else {
            $("#xvrStreamtype").val() == "1" ?
                $("#getahdencodesubencodetype").change() :
                $("#getahdencodemainencodetype").change();
        }
    };

    // api.getEncodeSet_EX(num, ParseInt(window.top.vChannelConfig[encodXvrVariables.mainSelChn]), funcLoaded);
    api.videoEncode(REQUEST_GET, { channel: num }, funcLoaded)

    return

    if (isIPC(num)) {
        $('#getahdencodeencodetype').prop("disabled", "disabled");
        $('#getahdencodemainencodemode').prop("disabled", "disabled");
        $('#getahdencodemainstreamcontrol').prop("disabled", "disabled");
        $('#mainQuality').prop("disabled", "disabled");
        $('#getahdencodesubencodemode').prop("disabled", "disabled");
        $('#getahdencodesubstreamcontrol').prop("disabled", "disabled");
        $('#subQuality').prop("disabled", "disabled");
        $('#mainBitrate').prop("disabled", false);
        $('#subBitrate').prop("disabled", false);
        $("#cankaobitrate1").show();
        $("#cankaobitrate2").show();
        xvr.getChanDevInfo_Manual(num, false, function (code, str) {
            window["g_onvifDisSc"] = false;
            if (code == HTTP_OK) {
                var dt = splitOkVal(str);
                var PT_ONVIF = 2;
                window["g_onvifDisSc"] = dt["getchanmanprotocoltype"] == PT_ONVIF;
            }
            getEncodeFramerate(encodXvrVariables.mainSelChn, function () {
                xvr.getEncodeSet_EX(num, ParseInt(window.top.vChannelConfig[encodXvrVariables.mainSelChn]), funcLoaded);
            })
        });
    } else if (isHD(num)) {
        $('#getahdencodeencodetype').prop("disabled", false);
        $('#getahdencodemainencodemode').prop("disabled", false);
        $('#getahdencodemainstreamcontrol').prop("disabled", false);
        $('#mainQuality').prop("disabled", false);
        $('#getahdencodesubencodemode').prop("disabled", false);
        $('#getahdencodesubstreamcontrol').prop("disabled", false);
        $('#subQuality').prop("disabled", false);
        $('#mainBitrate').prop("disabled", "disabled");
        $('#subBitrate').prop("disabled", "disabled");
        $("#cankaobitrate1").hide();
        $("#cankaobitrate2").hide();
        $('#getahdaudioinputtype').prop("disabled", false);
        getEncodeFramerate(encodXvrVariables.mainSelChn, function () {
            xvr.getEncodeSet_EX(num, ParseInt(window.top.vChannelConfig[encodXvrVariables.mainSelChn]), funcLoaded);
        })
    }

    if (isIPC(num)) {
        $("[id^='divWatermark']").hide();
        $("#getahdaudioencodetype").prop("disabled", true)
        $('#getahdaudioinputtype').prop("disabled", "disabled");
    } else if (getConf("watermarkEn")) {
        $("[id^='divWatermark']").show();
        $("#getahdaudioencodetype").prop("disabled", false).parent().parent().show();
    }
    if (isCpuEq("CPU_3520DV400_4AHD_NRT_6158C_2G")) {
        $("#getahdaudioencodetype").prop("disabled", true)
    }
}

function encodeSaveXvr() {
    if (!encodXvrVariables.chnnEcodeEnable) {
        rightPopup(lang.nolimit);
        return;
    }

    var funCb = counter(1, function (code, str) {
        if (code != HTTP_OK) {
            rightPopup(lang["savedfail"]);
            return;
        }

        loadXvrEncode($(".J-xvr-encode-channel").val());
        rightPopup(lang.saved);
    });

    var params = getMatchValue("xvrEncode")
    params.enableSmartH264 = params.enableSmartH264 ? true : false;
    params.enableSmartH265 = params.enableSmartH265 ? true : false;
    params.channel = parseInt($(".J-xvr-encode-channel").val());

    params.streamEncode = []
    params.streamEncode[0] = getMatchValue("xvrStreamEncodeMain");
    params.streamEncode[0].streamNo = 0;

    params.streamEncode[1] = getMatchValue("xvrStreamEncodeSub");
    params.streamEncode[1].videoEncodeType = params.streamEncode[0].videoEncodeType;
    params.streamEncode[1].streamNo = 1;

    delete params.previewInfo;

    // return
    api.videoEncode(REQUEST_SET, params, function (code, str) {
        if (code != CODE_SUCCESS) {
            rightPopup(lang.savedfail);
            return;
        }

        loadXvrEncode($(".J-xvr-encode-channel").val());
        rightPopup(lang.saved);
    })

    return;
    xvr.setEncodeSet_EX(
        String(ParseInt($(".J-xvr-encode-channel").val())),
        Number($("[matchval='getahdencodeencodetype']").val()),
        Number($("[matchval='getahdaudioencodetype']").val()),
        Number($("[matchval='getahdaudioinputtype']").val()),
        Number($("[matchval='getahdencodemainencodetype']").val()),
        Number($("[matchval='getahdencodemainresolution']").val()),
        Number($("[matchval='getahdencodemainencodemode']").val()),
        Number($("[matchval='getahdencodemainframerate']").val()),
        Number($("[matchval='getahdencodemainbiterate']").val()),
        Number($("[matchval='getahdencodemainstreamcontrol']").val()),
        Number($("[matchval='getahdencodemainiframeinterval']").val()),
        Number($("[matchval='getahdencodemainpictrualquality']").val()),
        Number($("[matchval='getahdencodesubencodetype']").val()),
        Number($("[matchval='getahdencodesubresolution']").val()),
        Number($("[matchval='getahdencodesubencodemode']").val()),
        Number($("[matchval='getahdencodesubbitrate']").val()),
        Number($("[matchval='getahdencodesubframerate']").val()),
        Number($("[matchval='getahdencodesubstreamcontrol']").val()),
        Number($("[matchval='getahdencodesubiframeinterval']").val()),
        $("#getahencode264enable").val(),
        $("#getahencode265enable").val(),
        Number($("[matchval='getahdencodesubpictrualquaity']").val()),
        $("[matchval='getahencodewatermarkenable']").prop("checked"),
        $("[matchval='getahencodewatermarkstring']").val().substr(0, 31),
        funCb
    );
}

function getCurBitrate() {
    var res = getRes(),
        qua = getQuality();
    var srcDt = getEncodeType() == "1" ? encodXvrVariables.bitRate265[res] : encodXvrVariables.bitRate264[res];
    var minP = ParseInt(srcDt[0]),
        maxP = ParseInt(srcDt[1]),
        minI = ParseInt(srcDt[2]),
        maxI = ParseInt(srcDt[3]);
    return minI + Math.floor((maxI - minI) / 6) * qua +
        (minP + Math.floor((maxP - minP) / 6) * qua) * (getFrameRate() - 1);
}

function getEncodeType() {
    return encodXvrVariables.isSpecDev ?
        $("#specEncodeType").val() :
        ($("#xvrStreamtype").val() == "0" ?
            $("#getahdencodemainencodetype").val() :
            $("#getahdencodesubencodetype").val()
        );
}

function getQuality() {
    return ParseInt($("#xvrStreamtype").val() == "0" ?
        $("#mainQuality").val() :
        $("#subQuality").val());
}

function getRes() {
    return ParseInt($("#xvrStreamtype").val() == "0" ?
        $("#mainRes").val() :
        $("#subRes").val());
}

function getFrameRate() {
    return ParseInt($("#xvrStreamtype").val() == "0" ?
        $("#getahdencodemainframerate").val() :
        $("#getahdencodesubframerate").val());
}

function getNewBitrate() {
    var encodeType = getEncodeType();
    if (encodeType == "0" && encodXvrVariables.bitRate264.length > 0) {
        return g_264bitrate[getRes()][getQuality()];
    }
    if (encodeType == "1" && encodXvrVariables.bitRate265.length > 0) {
        return encodXvrVariables.bitRate265[getRes()][getQuality()];
    }

    return false;
}

// 根据当前配置刷新需要显示的主/子码率
function reflushBitrate() {
    return
    var selCh = ParseInt($(".J-xvr-encode-channel").val());
    if (window.top["vChannelConfig"][selCh] != "1") return;

    if ($("#xvrStreamtype").val() == "0") {
        $("#mainBitrate").val(getCurBitrate());

    } else {
        $("#subBitrate").val(getCurBitrate());

    }
}
// 获取帧率
function getEncodeFramerate(num, callback) {
    xvr.getEncodeFramerate(
        num,
        function (code, str) {
            var data = split_span_val_type2(str);
            encodXvrVariables.mainFrameRate = data["getahdencodemainframeratevaule"].split(";");
            encodXvrVariables.subFrameRate = data["getahdencodesubframeratevaule"].split(";");
            callback && callback();
        }
    )
}

function subFrameRate(subMaxfRate) {
    var $framerateslideInputssub = $('[name="subframerate"]');
    var $framerateslidesub = $('.slide[name="subframerateslide"]');
    $framerateslideInputssub.each(function (index) {
        var $this = $(this);
        $this.keyup(function (event) {
            if (event.keyCode == 13) {
                var tmpVal = ParseInt($this.val());
                if (tmpVal >= subminframerate && tmpVal <= subMaxfRate) {
                    $this.val(tmpVal);
                    $framerateslidesub.eq(index).slider("value", tmpVal);
                }
            }
        })
    });
    if (ParseInt(window.top.vChannelConfig[encodXvrVariables.mainSelChn]) == 1) {
        $framerateslidesub.each(function (index) {
            $(this).slider({
                max: ParseInt(encodXvrVariables.subMaxfRate),
                min: ParseInt(subminframerate),
                value: $framerateslideInputssub.eq(index).val(),
                slide: function (event, ui) {
                    $framerateslideInputssub.eq(index).val(ui.value);
                    reflushBitrate();
                }
            })
        });
    } else if (ParseInt(window.top.vChannelConfig[encodXvrVariables.mainSelChn]) == 0) {
        $framerateslidesub.each(function (index) {
            $(this).slider({
                max: ParseInt(encodXvrVariables.subMaxfRate),
                min: ParseInt(subminframerate),
                value: $framerateslideInputssub.eq(index).val(),
                slide: function (event, ui) {
                    $framerateslideInputssub.eq(index).val(ui.value);
                },
                change: function (event, ui) {
                    return false;
                }
            })
        });
    }
}

function renderSlide(data) {
    var $framerateslideInputs = $('[name="framerate"]');
    var $framerateslide = $('.slide[name="framerateslide"]');
    $framerateslideInputs.each(function (index) {
        var $this = $(this);
        $this.keyup(function (event) {
            if (event.keyCode == 13) {
                var tmpVal = ParseInt($this.val());
                if (tmpVal >= mainminframerate && tmpVal <= encodXvrVariables.mainMaxFRate) {
                    $this.val(tmpVal);
                    $framerateslide.eq(index).slider("value", tmpVal);
                }
            }
        })
    });

    $framerateslide.each(function (index) {
        $(this).slider({
            max: parseInt(data.streamEncode[0].encodeFrameRateMax),
            min: parseInt(data.streamEncode[0].encodeFrameRateMin),
            value: $framerateslideInputs.val(),
            slide: function (event, ui) {
                $framerateslideInputs.val(ui.value);
            },
            change: function (evt, ui) {
                $framerateslideInputs.val(ui.value);
            }
        })
    });

    var $iframeintervalslideInputs = $('[name="iframeinterval"]');
    var $iframeintervalslide = $('.slide[name="iframeintervalslide"]');
    $iframeintervalslideInputs.each(function (index) {
        var $this = $(this);
        $this.keyup(function (event) {
            if (event.keyCode == 13) {
                var tmpVal = ParseInt($this.val());
                if (tmpVal >= mainminframeratectrl && tmpVal <= mainmaxframeratectrl) {
                    $this.val(tmpVal);
                    $iframeintervalslide.eq(index).slider("value", tmpVal);
                }
            }
        })
    });
    $iframeintervalslide.each(function (index) {
        $(this).slider({
            max: ParseInt(data.streamEncode[0].iframeIntervalMax),
            min: ParseInt(data.streamEncode[0].iframeIntervalMin),
            value: $iframeintervalslideInputs.val(),
            slide: function (event, ui) {
                $iframeintervalslideInputs.val(ui.value);
            },
            change: function (evt, ui) {
                $iframeintervalslideInputs.val(ui.value);
            }
        })
    });

    var $iframeintervalslideInputssub = $('[name="subiframeinterval"]');
    var $iframeintervalslidesub = $('.slide[name="subiframeintervalslide"]');
    $iframeintervalslideInputssub.each(function (index) {
        var $this = $(this);
        $this.keyup(function (event) {
            if (event.keyCode == 13) {
                var tmpVal = ParseInt($this.val());
                if (tmpVal >= subminframeratectrl && tmpVal <= submaxframeratectrl) {
                    $this.val(tmpVal);
                    $iframeintervalslidesub.eq(index).slider("value", tmpVal);
                }
            }
        })
    });
    $iframeintervalslidesub.each(function (index) {
        $(this).slider({
            max: ParseInt(data.streamEncode[1].iframeIntervalMax),
            min: ParseInt(data.streamEncode[1].iframeIntervalMin),
            value: $iframeintervalslideInputssub.eq(index).val(),
            slide: function (event, ui) {
                $iframeintervalslideInputssub.eq(index).val(ui.value);
            },
            change: function (evt, ui) {
                $iframeintervalslideInputssub.val(ui.value);
            }
        })
    });

    var $framerateslideInputssub = $('[name="subframerate"]');
    var $framerateslidesub = $('.slide[name="subframerateslide"]');
    $framerateslideInputssub.each(function (index) {
        var $this = $(this);
        $this.keyup(function (event) {
            if (event.keyCode == 13) {
                var tmpVal = ParseInt($this.val());
                if (tmpVal >= subminframerate && tmpVal <= subMaxfRate) {
                    $this.val(tmpVal);
                    $framerateslidesub.eq(index).slider("value", tmpVal);
                }
            }
        })
    });

    $framerateslidesub.each(function (index) {
        $(this).slider({
            max: ParseInt(data.streamEncode[1].encodeFrameRateMax),
            min: ParseInt(data.streamEncode[1].encodeFrameRateMin),
            value: $framerateslideInputssub.eq(index).val(),
            slide: function (event, ui) {
                $framerateslideInputssub.eq(index).val(ui.value);
                reflushBitrate();
            },
            change: function (evt, ui) {
                $framerateslideInputssub.val(ui.value);
            }
        })
    });
}