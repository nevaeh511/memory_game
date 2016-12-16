/*jslint plusplus: true */

/*
create a Ajax object
making the request
handling the server response
*/
var ajax;

function getAjaxRequestObject() {
    'use strict';
    var ajax2 = null;
    if (window.XMLHttpRequest) {
        ajax2 = new XMLHttpRequest();
    } else {
        ajax2 = new ActiveXObject('MSXML2.XMLHTTP.3.0');
    }
    return ajax2;
}

function getUsername(elementId) {
    'use strict';
    var username;
    username = document.getElementById(elementId).value;
    return username;
}

function getPassword(elementId) {
    'use strict';
    var password;
    password = document.getElementById(elementId).value;
    return password;
}

window.onload = function () {
    'use strict';
    //get ajax object
    var username, pass, data, button, outputDiv, jsonData;
    button = document.getElementById('login_btn');

    button.onclick = function () {
        ajax = getAjaxRequestObject();
        //check if object is valid. if so, make the request
        if (ajax) {
            username = getUsername("username");
            pass = getPassword("password");
            data = "userName=" + username + "&password=" + pass;
            
            ajax.open('POST', 'http://universe.tc.uvu.edu/cs2550/assignments/PasswordCheck/check.php', false);
            
            ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            ajax.send(data);
            
            jsonData = JSON.parse(ajax.responseText);
            outputDiv = document.getElementById('requestData');
            
            if (ajax.status == 200 && jsonData.result == "valid") {
                var loginData = jsonData.userName + " " + jsonData.timestamp;
                //save user info to local storage
                window.localStorage.setItem("cs2550timestamp", loginData);
                outputDiv.innerHTML = "Success!";
                window.open('gameGrid.html');
            }else{
                outputDiv.innerHTML = "Invalid credentials! Please try again.";
            }
        }
    };
};