var storage = window.localStorage;

function checkLogin() {
    if (storage.getItem("username") != null) {
        document.getElementById("i_username").value = storage.getItem("username");
        document.getElementById("i_id").value = storage.getItem("id");
    }
}

// function to logout
function functionLogout() {
    // Log the logout action
    document.getElementById("m_id").value = window.localStorage.getItem("id");
    document.getElementById("m_username").value = window.localStorage.getItem("username");
    document.getElementById("m_week").value = "0";
    document.getElementById("m_day").value = "0";
    document.getElementById("m_device").value = "app";
    document.getElementById("m_action").value = "logout";

    // Log on text file
    this.setLogText();
    if (document.getElementById("m_sent").value == "0") { document.getElementById("log_btn").click(); }

    // Try to send info to the server
    sendAction();

    // Empty local ans session storage
    window.localStorage.clear();
    window.sessionStorage.clear();

    location.reload();
}

function sendAction() {
    alert('Sending info');
    
    // Check if browser is connected, otherwise don't send the data
    if (navigator.onLine) {
        //this.setLogInfo();
        var form_data = new FormData(document.getElementById("action_form"));
        $.ajax({
            url: "http://www.mindfulness-istc.online/php_scripts/sendAction.php",
            type: "POST",
            data: form_data,
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        });
        document.getElementById("m_sent").value = "1";

        // Send also on a secondary db
        $.ajax({
            url: "http://mbsr.x10host.com/php_scripts/setAction.php",
            type: "POST",
            data: form_data,
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        });

        return 1;
    } else {
        document.getElementById("m_sent").value = "0";
        return 0;
    }
    alert('Sent info');
    
}

// Set the information for text local log
function setLogText() {
    document.getElementById("log_text").value = document.getElementById("m_sent").value + " \t" + document.getElementById("m_id").value + " \t" + document.getElementById("m_username").value + " \t" + document.getElementById("m_week").value + " \t" + document.getElementById("m_day").value + " \t" + document.getElementById("m_device").value + " \t" + document.getElementById("m_action").value + " \t" + document.getElementById("m_date").value + " \t" + document.getElementById("m_month").value  + " \t" + document.getElementById("m_year").value + " \t" + document.getElementById("m_hour").value + " \t" + document.getElementById("m_min").value  + " \t" + document.getElementById("m_sec").value + " \t" + document.getElementById("m_timestring").value + document.getElementById("m_playingTrack").value + "\t" +
    document.getElementById("m_progressTrack").value;
    alert('Setting lof text info');    
}

function setLogInfo() {
    var currentdate = new Date();
    
    var actiondate = currentdate.getDate() + "-"
        + (currentdate.getMonth() + 1) + "-"
        + currentdate.getFullYear() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    
    // Set the log information
    document.getElementById("m_date").value = currentdate.getDate().toString();
    document.getElementById("m_month").value = (currentdate.getMonth() + 1).toString();
    document.getElementById("m_year").value = currentdate.getFullYear().toString();
    document.getElementById("m_hour").value = currentdate.getHours().toString();
    document.getElementById("m_min").value = currentdate.getMinutes().toString();
    document.getElementById("m_sec").value = currentdate.getSeconds().toString();
    document.getElementById("m_timestring").value = actiondate.toString();

    document.getElementById("m_playingTrack").value = "none";
    document.getElementById("m_progressTrack").value = "99";
    alert('Setted log info');
}