'use strict';

var activate_link = "https://api.springrole.com/authorize?scope=Basic&redirect_uri=https://springrole.com/user/dashboard&response_type=token&client_id="+client_id;

var first_run_value = localStorage['first_run'];
if (typeof first_run_value === 'undefined')
{
    go_for_outh();
    localStorage['first_run'] = 1;
    localStorage['access_token'] = 0;
    localStorage['user_id'] = 0;
}

chrome.runtime.onInstalled.addListener(function(details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage")
    {
        sendResponse({data: localStorage[request.key]});
    }
    else if (request.method == "setLocalStorage")
    {
        localStorage[request.key] = request.value;
    }
    else if (request.method == "call_first_time")
    {
        run_first_time();
    }
    else if (request.method == "getauthdata")
    {
        var data_auth = {};
        data_auth['plugin_status'] = localStorage['plugin_status'];
        data_auth['access_token'] = localStorage['access_token'];
        data_auth['user_id'] = localStorage['user_id'];
        sendResponse({data: data_auth});
    }
    else
    {
        sendResponse({}); // snub them.   
    }
});

function go_for_outh()
{
    var key_value = localStorage['plugin_status'];
    if (typeof key_value === 'undefined')
    {
        chrome.tabs.create({url: activate_link});
    }
}

function get_all_jobs()
{
    var plugin_status = is_plugin_active();
    if (plugin_status)
    {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.springrole.com/beta/jobs?page_size=10000&access_token=" + localStorage['access_token'] + "&user_id=" + localStorage['user_id'] + "&page=1", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var data = xhr.responseText;
                localStorage['all_jobs'] = data;
                return data;
            }
        };
        xhr.send();
    }
}
function fetch_potential_referrals()
{
    var plugin_status = is_plugin_active();
    if (plugin_status)
    {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.springrole.com/beta/me/referrals/potential?page_size=10000&access_token=" + localStorage['access_token'] + "&user_id=" + localStorage['user_id'], true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var data = xhr.responseText;
                localStorage['potential_referrals'] = data;
                var parsed = JSON.parse(data);
                chrome.browserAction.setBadgeText({text: String(parsed.data.length)});
            }
        };
        xhr.send();
    }
}

function recommended_jobs()
{
    var plugin_status = is_plugin_active();
    if (plugin_status)
    {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.springrole.com/beta/recommendations/me?page_size=10000&access_token=" + localStorage['access_token'] + "&user_id=" + localStorage['user_id'], true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var data = xhr.responseText;
                localStorage['recommended_jobs'] = data;
                var parsed = JSON.parse(data);                
            }
        };
        xhr.send();
    }
}

function refer_user(link)
{
    var plugin_status = is_plugin_active();
    if (plugin_status)
    {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.springrole.com/beta/recommendations/referrals", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                fetch_potential_referrals();
            }
        };
        var post='{"access_token": "'+localStorage['access_token']+'","user_id":"'+localStorage['user_id']+'","link":"'+link+'"}';
        xhr.send(post);
    }
}

function is_plugin_active()
{
    var key_value = localStorage['plugin_status'];
    if (typeof key_value === 'undefined')
    {
        return false;
    }
    return true;
}

setInterval(function() {
    get_all_jobs();
    fetch_potential_referrals();
    recommended_jobs();
}, 1800000);



//running function 1st time
function run_first_time()
{
    get_all_jobs();
    fetch_potential_referrals();
    recommended_jobs();    
}