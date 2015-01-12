'use strict';

console.log('\'Allo \'Allo! Content script');

var successURL = 'https://springrole.com/user/dashboard';

chrome.runtime.sendMessage({method: "getLocalStorage", key: "plugin_status"}, function(response) {
    var key_value = response.data;
    if (typeof key_value === 'undefined')
    {
        if (top.location.href.indexOf(successURL) == 0) {
            var user_id = getUrlVars()["user_id"];
            var access_token = getUrlVars()["access_token"];

            if (user_id !== 'undefined' && access_token !== 'undefined')
            {
                chrome.runtime.sendMessage({method: "setLocalStorage", key: "access_token", value: access_token}, function(response) {

                });

                chrome.runtime.sendMessage({method: "setLocalStorage", key: "user_id", value: user_id}, function(response) {

                });

                chrome.runtime.sendMessage({method: "setLocalStorage", key: "plugin_status", value: '1'}, function(response) {
                    
                });
                
                chrome.runtime.sendMessage({method: "call_first_time"}, function(response) {
                    
                });
            }
        }
    }
});

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}
