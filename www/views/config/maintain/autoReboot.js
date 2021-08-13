var autoRebootVariables = {
    //私有变量
};

function onLoad() {
    initDot();
    setTitle(lang.setTimeRestart);
    var $ucMinute = $('#getautomaintainmin');
    for (var i = 0; i < 60; i++) {
        $ucMinute.append('<option value="' + i + '">' + zeroComplement(i) + '</option>');
    }

    var $ucHour = $('#getautomaintainhour');
    for (var i = 0; i < 24; i++) {
        $ucHour.append('<option value="' + i + '">' + zeroComplement(i) + '</option>');
    }

    var $ucDay = $('#getautomaintainday');
    for (var i = 1; i <= 31; i++) {
        var help = parseInt(i);
        $ucDay.append('<option value="' + i + '">' + zeroComplement(help) + '</option>');
    }

    if (isWifiNvr()) {
        $("#blkWifiTip").show();
        // 自动维护功能
        $("#chkAllCh").parent().append(lang.allchannel + lang.channel);
        getChannPrivate();
    } else {
        $(".J-is-wifi-nvr").hide();
        $("#btnSave").click(function () {
            autoreboot_save();
        });
    }
    load_autoreboot();
    // 监听时间变化
    listenTimeChange();
}

function autoreboot_save() {
    var params = {
        "type": parseInt($("#getautomaintaintype").val()),
        "enableIpcReboot": $("#resSystemAndIpc").prop('checked'),
        "day": parseInt($("#getautomaintainday").val()),
        "week": parseInt($("#getautomaintainweek").val()),
        "hour": parseInt($("#getautomaintainhour").val()),
        "minute": parseInt($("#getautomaintainmin").val()),
    }
    api.autoMaintain(REQUEST_SET, params, function (code, data) {
        showSaveMsg(code);
        loading(false);
    })

}

function load_autoreboot() {
    api.autoMaintain(REQUEST_GET, null, function (code, data) {
        if (code != CODE_SUCCESS) return;
        autoFillValue('maintain', data);
        var model = data.type;
        if (model == 1) {
            $('#getautomaintainhour').show();
            $('#getautomaintainmin').show();
            $('#weekDay11').show();
            $('#weekDay12').show();
        } else if (model == 2) {
            $('#getautomaintainhour').show();
            $('#getautomaintainmin').show();
            $('#getautomaintainweek').show();
            $('#weekDay11').show();
            $('#weekDay12').show();
        } else if (model == 3) {
            $('#getautomaintainhour').show();
            $('#getautomaintainmin').show();
            $('#getautomaintainday').show();
            $('#weekDay11').show();
            $('#weekDay12').show();
            $('#weekDay10').show();
        }
        $("#getautomaintaintype").show();
        split_span_val_type2(str);
    });
}

/**
 * 监听时间变化
 */
function listenTimeChange() {
    $('#getautomaintaintype').change(function () {
        var $this = $(this);
        switch ($this.val()) {
            case '0':
                $('#getautomaintainhour').hide();
                $('#getautomaintainmin').hide();
                $('#getautomaintainday').hide();
                $('#getautomaintainweek').hide();
                $('#weekDay11').hide();
                $('#weekDay12').hide();
                $('#weekDay10').hide();
                break;
            case '1':
                $('#getautomaintainhour').hide();
                $('#getautomaintainmin').hide();
                $('#getautomaintainday').hide();
                $('#getautomaintainweek').hide();
                $('#weekDay11').hide();
                $('#weekDay12').hide();
                $('#weekDay10').hide();
                $('#getautomaintainhour').show();
                $('#getautomaintainmin').show();
                $('#weekDay11').show();
                $('#weekDay12').show();
                break;
            case '2':
                $('#getautomaintainhour').hide();
                $('#getautomaintainmin').hide();
                $('#getautomaintainday').hide();
                $('#getautomaintainweek').hide();
                $('#weekDay11').hide();
                $('#weekDay12').hide();
                $('#weekDay10').hide();
                $('#getautomaintainhour').show();
                $('#getautomaintainmin').show();
                $('#getautomaintainweek').show();
                $('#weekDay11').show();
                $('#weekDay12').show();
                break;
            case '3':
                $('#getautomaintainhour').hide();
                $('#getautomaintainmin').hide();
                $('#getautomaintainday').hide();
                $('#getautomaintainweek').hide();
                $('#weekDay11').hide();
                $('#weekDay12').hide();
                $('#weekDay10').hide();
                $('#getautomaintainhour').show();
                $('#getautomaintainmin').show();
                $('#getautomaintainday').show();
                $('#weekDay11').show();
                $('#weekDay12').show();
                $('#weekDay10').show();
                break;
        }
    });
}

/**
 * 获取通道权限
 */
function getChannPrivate() {
    xvr.getVal(["getchannalisprivateprotocol"], function (code, str) {
        if (code != HTTP_OK) return rightPopup(lang.optionexception);
        var data = splitOkVal(str);
        var private = binaryToArray(data.getchannalisprivateprotocol);
        var totalChNum = getTotalChannelNum();
        var $listCh = $("#listCh");
        var iEnChNum = 0;
        for (var i = 0; i < totalChNum; ++i) {
            var $chk = $("<input type='checkbox'/>").data("ch", i).attr("disabled", private[i] == 1 ? false : true).click(onChClk);
            ++iEnChNum;
            $("<label class='pointer'></label>").append($chk).append("&nbsp;" + (i + 1)).appendTo($listCh);
        };
        $("#chkAllCh").click(onAllChClk);
        $("#btnSave").click(saveSetting);
        $("#chkAutoRsCh").change(function () {
            if ($(this).prop("checked")) {
                $("#chkRcCh").prop("checked", false);
                setSaveEn(1);
                return;
            }

            $("#blkTwo input:checked").length === 0 && setSaveEn(3);
        });

        $("#chkRcCh").change(function () {
            if ($(this).prop("checked")) {
                $("#chkAutoRsCh").prop("checked", false);
                setSaveEn(1);
                return;
            }

            $("#blkTwo input:checked").length === 0 && setSaveEn(3);
        });

        $("#listCh input").change(function () {
            if ($(this).prop("checked")) {
                setSaveEn(2);
                return;
            }
            $("#listCh input:checked").length === 0 && setSaveEn(3);
        });

        if (iEnChNum === 0) {
            rightPopup(lang.nolimit);
            return $listCh.html(lang.nolimit);
        };
    });
}

/* 通道维护功能 */
function setSaveEn(type) {
    var isFlag;
    switch (type) {
        case 1:
            isFlag = $("#listCh input:checked").length === 0
            return $("#btnSave").prop("disabled", isFlag);
        case 2:
            isFlag = $("#blkTwo input:checked").length === 0
            return $("#btnSave").prop("disabled", isFlag);
        case 3:
            isFlag = !($("#blkTwo input:checked").length === 0 && $("#listCh input:checked").length === 0)
            return $("#btnSave").prop("disabled", isFlag);
    };
}

function onChClk() {
    // 同步全部勾选框
    $("#chkAllCh").prop("checked",
        $("#listCh input:checked:enabled").length === $("#listCh input:enabled").length
    );
    setSaveEn(2);
    $("#listCh input:checked").length === 0 && setSaveEn(3);
}

function onAllChClk() {
    $("#listCh input:enabled").prop("checked", $(this).prop("checked"));
    setSaveEn(2);
    $("#listCh input:checked").length === 0 && setSaveEn(3);
}

function saveSetting() {
    loading(true);
    autoreboot_save();
    var channelList = $("#listCh input:checked");
    if (!channelList.length) return;

    var reboot = $("#chkAutoRsCh").prop("checked"),
        reset = $("#chkRcCh").prop("checked");
    if (!reboot && !reset) return;

    var channel = [];
    $("#listCh input:checked").each(function () {
        var iCh = $(this).data("ch");
        channel.push(iCh)
    });

    var params = {
        "channel": channel,
        "reboot": reboot,
        "reset": reset,
    };
    api.ipcMaintain(REQUEST_SET, params, function (code, data) {
        if (code != CODE_SUCCESS) return;
        rightPopup(lang.setsuccessfully);
    });
}