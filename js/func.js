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
    getTokenValue('FTPInfo.html',
        // successFn callback, val is the token value
        function(returnData) {
            var textAera = $("#FTPINFO")[0];
            textAera.value += returnData.filter("#FTP_Information").text();
            if (returnData.filter("#FTP_Information").text() == "SUCCESS" || returnData.filter("#FTP_Information").text() == "ERROR") {
                clearInterval(FTPTimer);
                FTP_Status = 0;
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
        LEDTimer = setInterval(getLEDStatus(), 5000);
    } else if (navbar == 2) {
        if (LEDTimer != 0) clearInterval(LEDTimer);
        if (FTP_Status == 1) clearInterval(FTPTimer);
        SensorTimer = setInterval(getSensorStatus(), 5000);
    } else if (navbar == 3) {
        if (LEDTimer != 0) clearInterval(LEDTimer);
        if (SensorTimer != 0) clearInterval(SensorTimer);
        if (FTP_Status == 1) FTPTimer = setInterval(getFTPInformation(), 1000);
    }
}

function LED_turn(index) {
    var statusText = $("#LED" + index + "_status")[0];
    var buttonText = $("#LED" + index)[0];
    if (statusText.textContext == "Off") {
        postTokenValue("__SL_P_UL1", "LED" + index + "ON");
        statusText.textContext = "On";
        buttonText.textContext = "LED Off";
    } else {
        postTokenValue("__SL_P_UL1", "LED" + index + "OFF");
        statusText.textContext = "Off";
        buttonText.textContext = "LED On";
    }
}


function LED_toggle(index) {
    var statusText = $("#LED" + index + "_status")[0];
    var buttonText = $("#LED" + index)[0];
    if (statusText.textContext == "Toggle Off") {
        postTokenValue("__SL_P_UL1", "LED" + index + "TOGGLE_ON");
        statusText.textContext = "Toggle On";
        buttonText.textContext = "Toggle Off";
    } else {
        postTokenValue("__SL_P_UL1", "LED" + index + "TOGGLE_OFF");
        statusText.textContext = "Toggle Off";
        buttonText.textContext = "Toggle On";
    }
}

function send_FTP_address() {
    var IPAddress = $("#FTP_IPA")[0];
    var PortNumber = $("#FTP_Port")[0];
    var FTPButton = $("#FTP_Button")[0];

    if (IPAddress.value.length != 0 && PortNumber.value.length != 0) {
        FTPButton.disabled = "disabled";
        postTokenValue("__SL_P_UF1", IPaddress.value + ":" + PortNumber.value);
        FTPTimer = setInterval(getFTPInformation, 1000);
        FTP_Status = 1;
    } else {
        _count = _count + 1;
    }
}

function send_file_name() {
    var FileName = $("#File_Name")[0];
    var FileButton = $("#File_Button")[0];

    if (FileName.value.length != 0) {
        FileButton.disabled = "disabled";
        postTokenValue("__SL_P_UF2", FileName.value);
        FTPTimer = setInterval(getFTPInformation, 1000);
        FTP_Status = 1;
    } else {
        _count = _count + 1;
    }
}
