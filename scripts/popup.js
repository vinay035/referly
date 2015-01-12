'use strict';
$(function() {
    chrome.runtime.sendMessage({method: "getLocalStorage", key: "plugin_status"}, function(response) {
        var key_value = response.data;
        if (typeof key_value === 'undefined')
        {
            $('.page').hide();
            $("#login-plugin").show();
            $("#activate-link").click(function() {
                chrome.extension.getBackgroundPage().go_for_outh();
            });
        }
        else
        {
            $('.page').hide();
            $("#all-jobs").show();
            //top navigation
            $(".nav-link").click(function() {
                var show_id = $(this).attr('rel');
                $('.page').hide();
                $('#' + show_id).show();
            });
            //btn click call fetch data
            $("#refresh_jobs").click(function() {
                fetch_data();
            });
            $("#refer_list").click(function() {
                fetch_potential_referrals();
            });
            $("#recommended_jobs").click(function() {
                recommended_jobs();
            });
            //onclick of top nav ids
            $(".all-job-link").click(function() {
                fetch_data();
            });
            $(".refer_user").click(function() {
                fetch_potential_referrals();
            });
            $(".recommended_jobs").click(function() {
                recommended_jobs();
            });
            chrome.runtime.sendMessage({method: "getauthdata"}, function(response) {
                fetch_data(response.data.access_token, response.data.user_id);
            });
        }
    });
});

function fetch_data()
{
    var template = Handlebars.compile($('#sHomepageContent').html());
    chrome.runtime.sendMessage({method: "getLocalStorage", key: "all_jobs"}, function(response) {
        var all_job = response.data;
        if (typeof all_job === 'undefined')
        {
            $("#jobs-nodisplay").show();
            chrome.extension.getBackgroundPage().get_all_jobs();
        }
        else
        {
            $("#jobs-nodisplay").hide();
            var data = JSON.parse(all_job);
            if (data.data.length > 0)
            {
                $('#jobs-display').html(template(data));
            }
            else
            {
                $("#jobs-nodisplay").show();
                $('#jobs-display').hide();
            }
        }
    });
}
function recommended_jobs()
{
    var template = Handlebars.compile($('#sHomepageContent').html());
    chrome.runtime.sendMessage({method: "getLocalStorage", key: "recommended_jobs"}, function(response) {
        var recommended_jobs = response.data;
        if (typeof recommended_jobs === 'undefined')
        {
            $("#recommended_jobs-nodisplay").show();
            chrome.extension.getBackgroundPage().recommended_jobs();
        }
        else
        {
            $("#recommended_jobs-nodisplay").hide();
            var data = JSON.parse(recommended_jobs);
            if (data.data.length > 0)
            {
                $('#recommended_jobs-display').html(template(data));
            }
            else
            {
                $("#recommended_jobs-nodisplay").show();
                $('#recommended_jobs-display').hide();
            }
        }
    });
}

function fetch_potential_referrals()
{
    var template = Handlebars.compile($('#ContentReferPeople').html());
    chrome.runtime.sendMessage({method: "getLocalStorage", key: "potential_referrals"}, function(response) {
        var potential_referrals = response.data;
        if (typeof potential_referrals === 'undefined')
        {
            $("#refer-list-nodisplay").show();
            $('#refer-list').hide();
            chrome.extension.getBackgroundPage().fetch_potential_referrals();
        }
        else
        {
            $("#refer-list-nodisplay").hide();
            var data = JSON.parse(potential_referrals);
            if (data.data.length > 0)
            {
                $('#refer-list').html(template(data));
                $(".refer_user_button").click(function() {                    
                    chrome.extension.getBackgroundPage().refer_user($(this).attr('rel'));
                    var link=$(this).attr('rel');
                    $(this).parent().parent().hide();
                });
            }
            else
            {
                $("#refer-list-nodisplay").show();
                $('#refer-list').hide();
            }
        }
    });
}

function get_access_tokens()
{
    chrome.runtime.sendMessage({method: "getauthdata"}, function(response) {
        return response.data;
    });
}