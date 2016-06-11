var _count = 0;
var LEDTimer;
var SensorTimer;
var HTTPrequest = new XMLHttpRequest();


function postTokenValue(Token, Data) {
    // var params = Token;
    // params = params + Data;
    // HTTPrequest.open("POST", "No_content", true);
    // HTTPrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // HTTPrequest.setRequestHeader("Content-length", params.length);
    // HTTPrequest.setRequestHeader("Connection", "close");
    // HTTPrequest.onreadystatechange = function() {
    //     if (HTTPrequest.readyState == 4 && HTTPrequest.status == 200) {}
    // }
    // HTTPrequest.send(params);


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
        LEDTimer = setInterval(getLEDStatus(), 5000);
    } else {
        clearInterval(LEDTimer);
        _count = _count + 1;
        $("#LEDError").value = _count;
    }

    if (navbar == 2) {
        SensorTimer = setInterval(getSensorStatus(), 5000);
    } else {
        clearInterval(SensorTimer);
        _count = _count + 1;
        $("#LEDError").value = _count;
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
    if (IPaddress.value.length != 0 && PortNumber.value.length != 0) {
        postTokenValue("__SL_P_UF1", IPaddress.value + ":" + PortNumber.value);

    } else {

    }


}
