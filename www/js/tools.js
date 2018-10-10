var storage = window.localStorage;

function n2digits(n) {
    return n > 9 ? "" + n : "0" + n;
}

function checkLogin() {
    if (storage.getItem("username") != null) {
        document.getElementById("i_username").value = storage.getItem("username");
        document.getElementById("i_id").value = storage.getItem("id");
    }
}

// function to logout
function functionLogout() {
    // Try to send info to the server
    sendAction("logout");

    // Empty local ans session storage
    window.localStorage.clear();
    window.sessionStorage.clear();

    location.reload();
}

function sendAction(act_to_send) {    
    // Check if browser is connected, otherwise don't send the data
    this.setLogInfo();        
    document.getElementById("m_action").value = act_to_send;
    
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
        
        // // Send also on a secondary db
        // $.ajax({
        //     url: "http://mbsr.x10host.com/php_scripts/setAction.php",
        //     type: "POST",
        //     data: form_data,
        //     processData: false,  // tell jQuery not to process the data
        //     contentType: false   // tell jQuery not to set contentType
        // });

        return 1;
    } else {
        document.getElementById("m_sent").value = "0";
        this.setLogText();
        document.getElementById("log_btn").click(); 
        return 0;
    }    
}

function sendActionFromTxt() {
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
        return 1;
    } else {
        document.getElementById("m_sent").value = "0";
        this.setLogText();
        document.getElementById("log_btn").click();
        return 0;
    }
}

// Set the information for text local log
function setLogText() {
    document.getElementById("log_text").value = document.getElementById("m_sent").value + "\t" + document.getElementById("m_id").value + "\t" + document.getElementById("m_username").value + "\t" + document.getElementById("m_action").value + "\t" + document.getElementById("m_week").value + "\t" + document.getElementById("m_day").value + "\t" + document.getElementById("m_device").value + "\t" + document.getElementById("m_date").value + "\t" + document.getElementById("m_month").value + "\t" + document.getElementById("m_year").value + "\t" + document.getElementById("m_hour").value + "\t" + document.getElementById("m_min").value + "\t" + document.getElementById("m_sec").value + "\t" + document.getElementById("m_timestring").value + "\t" + document.getElementById("m_playingTrack").value + "\t" + document.getElementById("m_progressTrack").value;
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
    document.getElementById("m_date").value = n2digits(currentdate.getDate().toString());
    document.getElementById("m_month").value = n2digits((currentdate.getMonth() + 1).toString());
    document.getElementById("m_year").value = n2digits(currentdate.getFullYear().toString());
    document.getElementById("m_hour").value = n2digits(currentdate.getHours().toString());
    document.getElementById("m_min").value = n2digits(currentdate.getMinutes().toString());
    document.getElementById("m_sec").value = n2digits(currentdate.getSeconds().toString());
    document.getElementById("m_timestring").value = actiondate.toString();

    document.getElementById("m_playingTrack").value = what_is_playing;
    document.getElementById("m_progressTrack").value = progression_playing_track;
}

