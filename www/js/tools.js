// Access to the local storage
var storage = window.localStorage;

// Compute the actual day of the actual week of course
var now = new Date();
var weekStart = new Date(window.localStorage.getItem('mbsr_week_' + week));
var today = Math.ceil((now.getTime() - weekStart.getTime()) / (1000 * 3600 * 24));

// Check the login
function checkLogin() {
    if (storage.getItem("username") != null) {
        document.getElementById("i_username").value = storage.getItem("username");
        document.getElementById("i_id").value = storage.getItem("id");
        return 1;
    } else {
        return 0;
    }

}

// Set the information for text local log
function setLogText() {
    document.getElementById("log_text").value = document.getElementById("m_sent").value + " \t" + document.getElementById("m_id").value + " \t" + document.getElementById("m_username").value + " \t" + document.getElementById("m_week").value + " \t" + document.getElementById("m_day").value + " \t" + document.getElementById("m_device").value + " \t" + document.getElementById("m_action").value + " \t" + document.getElementById("m_date").value + " \t" + document.getElementById("m_month").value  + " \t" + document.getElementById("m_year").value + " \t" + document.getElementById("m_hour").value + " \t" + document.getElementById("m_min").value  + " \t" + document.getElementById("m_sec").value + " \t" + document.getElementById("m_timestring").value;
}

// function to logout
function functionLogout() {
    sendAction("logout");

    // Empty local ans session storage
    window.localStorage.clear();
    window.sessionStorage.clear();

    // Go to the login page
    location.reload();
}

// Function to send actions to the server
function sendAction(act_to_send) {
    // Check if browser is connected, otherwise don't send the data
    if (navigator.onLine) {
        var currentdate = new Date();
        var actiondate = currentdate.getDate() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getFullYear() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

        // Set the log information
        document.getElementById("m_id").value = window.localStorage.getItem("id").toString();
        document.getElementById("m_username").value = window.localStorage.getItem("username").toString();
        document.getElementById("m_action").value = act_to_send;
        document.getElementById("m_week").value = week;
        document.getElementById("m_day").value = today;
        document.getElementById("m_device").value = "app";
        document.getElementById("m_date").value = currentdate.getDate();
        document.getElementById("m_month").value = (currentdate.getMonth() + 1);
        document.getElementById("m_year").value = currentdate.getFullYear();
        document.getElementById("m_hour").value = currentdate.getHours();
        document.getElementById("m_min").value = currentdate.getMinutes();
        document.getElementById("m_sec").value = currentdate.getSeconds();
        document.getElementById("m_timestring").value = actiondate.toString();

        document.getElementById("m_playingTrack").value = what_is_playing;
        document.getElementById("m_progressTrack").value = progression_playing_track;

        var form_data = new FormData(document.getElementById("action_form"));
        $.ajax({
            url: "http://www.mindfulness-istc.online/php_scripts/sendAction.php",
            type: "POST",
            data: form_data,
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        });
        document.getElementById("m_sent").value = "1";        

        // // Sendl information also to a backup server
        // $.ajax({
        //     url: "http://mbsr.x10host.com/php_scripts/sendAction.php",
        //     type: "POST",
        //     data: form_data,
        //     processData: false,  // tell jQuery not to process the data
        //     contentType: false   // tell jQuery not to set contentType
        // });

        return 1;
    } else {
        // If information is not sent to the server, write it on the local log file and send it later
        document.getElementById("m_sent").value = "0";
        setLogText();
        document.getElementById("log_btn").click();
        return 0;
    }
}

// Function to send actions to the server
function sendActionFromTxtLog() {
    // Check if browser is connected, otherwise don't send the data
    if (navigator.onLine) {
        var form_data = new FormData(document.getElementById("action_form"));
        $.ajax({
            url: "http://www.mindfulness-istc.online/php_scripts/sendAction.php",
            type: "POST",
            data: form_data,
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        });
        document.getElementById("m_sent").value = "1";        

        // Sendl information also to a backup server
        $.ajax({
            url: "http://mbsr.x10host.com/php_scripts/sendAction.php",
            type: "POST",
            data: form_data,
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        });

        return 1;
    } else {
        // If information is not sent to the server, write it on the local log file and send it later
        document.getElementById("m_sent").value = "0";
        setLogText();
        document.getElementById("log_btn").click();
        return 0;
    }
}
