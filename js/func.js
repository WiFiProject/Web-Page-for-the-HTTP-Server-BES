var _count = 0;
var LEDTimer = 0;
var SensorTimer = 0;
var FTPTimer = 0;
var FTP_Status = 0;


function postTokenValue(Token, Data) {
    $.ajax({
        "type": "POST",
        "url": "No_content",
        "data": Token + "=" + Data
    })
}


function getTokenValue(paramPage, successFn, failFn) {
    $.ajax({
            "type": "GET",
            "url": paramPage,
            "cache": false,
            "dataType": "html"
        })
        // define callback for get request success
        .done(function(getdata, status, xhr) {
            successFn($(getdata));
        })
        .fail(function(jqxhr, settings, exception) {
            failFn();
        });

}

function getFTPInformation() {
    var FTPButton = $("#FTP_Button")[0];
    var FileButton = $("#File_Button")[0];
    getTokenValue('FTPInfo.html',
        // successFn callback, val is the token value
        function(returnData) {
            var textAera = $("#FTPINFO")[0];
            textAera.value += returnData.filter("#FTP_Information").text();
            if (returnData.filter("#FTP_Information").text().slice(0, 3) == "END") {
                clearInterval(FTPTimer);
                FTP_Status = 0;
                FTPButton.removeAttribute("disabled");
            }
        },
        // failFn callback
        function() {
            _count = _count + 1;
            $("#FTPError").value = _count;
        });
}




function getLEDStatus() {
    getTokenValue('paramLED.html',
        // successFn callback, val is the token value
        function(returnData) {
            for (var i = 1; i <= 4; i++) {
                var temp;
                temp = $("#LED" + i + "_status")[0];
                temp.textContent = returnData.filter('#' + "LED" + i).text();

            }
        },
        // failFn callback
        function() {
            _count = _count + 1;
            $("#LEDError").value = _count;
        });
}

function getSensorStatus() {
    getTokenValue('paramSensor.html',
        // successFn callback, val is the token value
        function(returnData) {
            var allData = $("#page2").find("th[id]");
            for (var i = 0; i < allData.length; i++) {
                allData[i].textContent = returnData.filter('#' + allData[i].id).text();
            }
        },
        // failFn callback
        function() {
            _count = _count + 1;
            $("#SensorError").value = _count;
        });
}

function UpdateStatusOn(navbar) {
    if (navbar == 1) {
        if (SensorTimer != 0) clearInterval(SensorTimer);
        if (FTP_Status == 1) clearInterval(FTPTimer);
        LEDTimer = setInterval("getLEDStatus()", 5000);
    } else if (navbar == 2) {
        if (LEDTimer != 0) clearInterval(LEDTimer);
        if (FTP_Status == 1) clearInterval(FTPTimer);
        SensorTimer = setInterval("getSensorStatus()", 5000);
    } else if (navbar == 3) {
        if (LEDTimer != 0) clearInterval(LEDTimer);
        if (SensorTimer != 0) clearInterval(SensorTimer);
        if (FTP_Status == 1) FTPTimer = setInterval("getFTPInformation()", 5000);
    } else {
        if (LEDTimer != 0) clearInterval(LEDTimer);
        if (SensorTimer != 0) clearInterval(SensorTimer);
        if (FTP_Status == 1) clearInterval(FTPTimer);
    }
}

function LED_turn(index) {
    var statusText = $("#LED" + index + "_status")[0];
    var buttonText = $("#LED" + index)[0];
    if (statusText.textContent == "Off") {
        postTokenValue("__SL_P_UL1", "LED" + index + "ON");
        statusText.textContent = "On";
        buttonText.textContent = "LED Off";
    } else {
        postTokenValue("__SL_P_UL1", "LED" + index + "OFF");
        statusText.textContent = "Off";
        buttonText.textContent = "LED On";
    }
}


function LED_toggle(index) {
    var statusText = $("#LED" + index + "_status")[0];
    var buttonText = $("#LED" + index)[0];
    if (statusText.textContent == "Toggle Off") {
        postTokenValue("__SL_P_UL1", "LED" + index + "TOGGLE_ON");
        statusText.textContent = "Toggle On";
        buttonText.textContent = "Toggle Off";
    } else {
        postTokenValue("__SL_P_UL1", "LED" + index + "TOGGLE_OFF");
        statusText.textContent = "Toggle Off";
        buttonText.textContent = "Toggle On";
    }
}

function send_FTP_address() {
    var IPAddress = $("#FTP_IPA")[0];
    var PortNumber = $("#FTP_Port")[0];
    var FileName = $("#File_Name")[0];
    var Username = $("#FTP_USER")[0];
    var PassWord = $("#FTP_PASS")[0];
    var FTPButton = $("#FTP_Button")[0];


    if (IPAddress.value.length != 0 && PortNumber.value.length != 0 && FileName.value.length != 0 && Username.value.length != 0 && PassWord.value.length != 0) {
        FTPButton.disabled = "disabled";
        postTokenValue("__SL_P_UF1", IPAddress.value + ":" + PortNumber.value + "," + FileName.value + "," + Username.value + "," + PassWord.value);
        FTPTimer = setInterval("getFTPInformation()", 2000);
        FTP_Status = 1;
    } else {
        _count = _count + 1;
    }
}

function turn_to_UDP_Server() {
    var FTPButton = $("#UDP_Button")[0];
    postTokenValue("__SL_P_UUS", "STARTUP");
    FTPButton.textContent = "UDP服务器已经启动。";
    FTPButton.disabled = "disabled";

}
