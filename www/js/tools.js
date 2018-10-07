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
    // Check if browser is connected, otherwise don't send the data
    if (navigator.onLine) {
        var form_data = new FormData(document.getElementById("action_form"));
        $.ajax({
            url: "http://mbsr.x10host.com/php_scripts/setAction.php",
            type: "POST",
            data: form_data,
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        });
        document.getElementById("m_sent").value = "1";

        // Send also on a secondary db
        $.ajax({
            url: "http://mbsr-server.000webhostapp.com/php_scripts/sendAction.php",
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
}

function setLogText() {
    document.getElementById("log_text").value = document.getElementById("m_sent").value + " \t" + document.getElementById("m_id").value + " \t" + document.getElementById("m_username").value + " \t" + document.getElementById("m_action").value + " \t" + document.getElementById("m_week").value + " \t" + document.getElementById("m_day").value + " \t" + document.getElementById("m_device").value + " \t";    
}

// Timer for player check
var currentPlayerToCheck = null;
var TIMER_PERIOD_FOR_PLAYER_CHECK_MS = 10000;
var what_is_playing = null;
var progression_playing_track = null;

function sendPlayingInfo(elapsedProgress) {
    sendAction("playing" + what_is_playing + "_" + elapsedProgress + "%");
}

function resetPlayerToCheck() {
    what_is_playing = null;
    progression_playing_track = null;
    currentPlayerToCheck = null;
}

var countTimeoutPlayer = 0;
var timerPlayerCheck;
function timedCountCheckPlayer() {
    countTimeoutPlayer = countTimeoutPlayer + 1;
    timerPlayerCheck = setTimeout(function () { timedCountCheckPlayer() }, 1000);
    if (countTimeoutPlayer == TIMER_PERIOD_FOR_PLAYER_CHECK_MS / 1000) {
        progression_playing_track = ~~(currentPlayerToCheck.currentTime / currentPlayerToCheck.duration * 100);
        sendPlayingInfo(progression_playing_track);
        countTimeoutPlayer = 0;
    }
}

function startCountTimeoutPlayer() {
    countTimeoutPlayer = 0;
    timedCountCheckPlayer();
}

function stopCountTimeoutPlayer() {
    countTimeoutPlayer = 0;
    clearTimeout(timerPlayerCheck);
}

function pauseCountTimeoutPlayer() {
    clearTimeout(timerPlayerCheck);
}

// Functions for music players
function trackPlay(trackName, trackPlayer) {
    what_is_playing = trackName;
    sendAction("play_" + trackName);
    currentPlayerToCheck = trackPlayer;
    trackPlayer.play();
    progression_playing_track = 0;
    startCountTimeoutPlayer();
    disable_play_btns(true);
    $('#btn_pause' + trackName).prop('disabled', false);
    $('#btn_stop' + trackName).prop('disabled', false);
}

function trackPause(trackName, trackPlayer) {
    sendAction("pause_" + trackName);
    trackPlayer.pause();
    pauseCountTimeoutPlayer();
    $('#btn_play' + trackName).prop('disabled', false);
    $('#btn_pause' + trackName).prop('disabled', true);
    $('#btn_stop' + trackName).prop('disabled', false);
}

function trackStop(trackName, trackPlayer) {
    sendAction("stop_" + trackName);
    trackPlayer.pause();
    trackPlayer.currentTime = 0;
    resetPlayerToCheck();
    disable_play_btns(false);
    stopCountTimeoutPlayer();
    $('#btn_pause' + trackName).prop('disabled', true);
    $('#btn_stop' + trackName).prop('disabled', true);
}

function trackEnd(trackName, trackPlayer) {
    sendAction("end_" + trackName);
    trackPlayer.pause();
    trackPlayer.currentTime = 0;
    resetPlayerToCheck();
    disable_play_btns(false);
    stopCountTimeoutPlayer();
    $('#btn_pause' + trackName).prop('disabled', true);
    $('#btn_stop' + trackName).prop('disabled', true);

    if (trackName == 'MR' && week < 5) {
        $('#act2').prop('checked', true);
    } else {
        $('#act1').prop('checked', true);
    }
}

// Add listeners for check tracks ending
var BS = null;
var BSprima = null;
var MC = null;
var MR = null;
var MS = null;
var bell = null;

function setPlayers(tBS, tBSprima, tMC, tMR, tMS, tbell) {
    BS = tBS;
    BSprima = tBSprima;
    MC = tMC;
    MR = tMR;
    MS = tMS;
    bell = tbell;
}

BS.addEventListener("ended", trackEnd('BS', BS));
BSprima.addEventListener("ended", trackEnd('BSprima', BSprima));
MC.addEventListener("ended", trackEnd('MC', MC));
MR.addEventListener("ended", trackEnd('MR', MR));
MS.addEventListener("ended", trackEnd('MS', MS));


// Free meditation with timer
var timerSec = 0;
var timerMed;

function timedCountMeditation(medDuration) {
    var medDurationInSec = medDuration * 60;
    timerSec = timerSec + 1;
    timerMed = setTimeout(function () { timedCountMeditation(medDuration) }, 1000);
    if (timerSec == 1) {
        bell.play();
    }
    if (timerSec == medDurationInSec) {
        bell.play();
        sendAction("end_" + medDuration);
    }

    // Send progress information at scheduled interval
    if (~~(timerSec % (TIMER_PERIOD_FOR_PLAYER_CHECK_MS / 1000)) == 0) {
        progression_playing_track = ~~(timerSec / medDurationInSec * 100);
        sendPlayingInfo(progression_playing_track);
    }
}

function startCount(medDuration) {
    sendAction("play_" + medDuration);
    disable_play_btns(true);
    $('#btn_pause' + medDuration).prop('disabled', false);
    $('#btn_stop' + medDuration).prop('disabled', false);
    what_is_playing = medDuration;
    progression_playing_track = 0;
    timerSec = 0;
    timedCountMeditation(medDuration);
}

function stopCount(medDuration) {
    sendAction("stop_" + medDuration);
    disable_play_btns(false);
    bell.pause();
    bell.currentTime = 0;
    $('#btn_pause' + medDuration).prop('disabled', true);
    $('#btn_stop' + medDuration).prop('disabled', true);
    resetPlayerToCheck();
    clearTimeout(timerMed);
    timerSec = 0;
}

function pauseCount(medDuration) {
    sendAction("pause_" + medDuration);
    bell.pause();
    bell.currentTime = 0;
    $('#btn_play' + medDuration).prop('disabled', false);
    $('#btn_pause' + medDuration).prop('disabled', true);
    $('#btn_stop' + medDuration).prop('disabled', false);
    clearTimeout(timerMed);
}

// Controls overall buttons
function disable_play_btns(onoff) {
    $('#btn_playBSprima').prop('disabled', onoff);
    $('#btn_playBS').prop('disabled', onoff);
    $('#btn_playMC').prop('disabled', onoff);
    $('#btn_playMR').prop('disabled', onoff);
    $('#btn_playMS').prop('disabled', onoff);
    $('#btn_play15').prop('disabled', onoff);
    $('#btn_play30').prop('disabled', onoff);
    $('#btn_play45').prop('disabled', onoff);
}

// Check the daily activities already done 
function check_boxes() {
    var i;
    for (i = 1; i <= 5; i++) {
        if (window.localStorage.getItem('week' + week + '_actw' + i + '_done') == '1') {
            $('#actw' + i).prop('checked', true);
        }
        if (window.localStorage.getItem('week' + week + '_act' + i + '_done') == '1') {
            $('#act' + i).prop('checked', true);
            $('#row_act' + i).addClass('animated pulse');
        }
    }
}

// On checks, set a cookie to memorize the checked boxes
function check_actweek(numact) {
    if (document.getElementById('actw' + numact).checked) {
        window.localStorage.setItem('week' + week + '_actw' + numact + '_done', '1');
        sendAction('do_w' + numact);
    } else {
        window.localStorage.setItem('week' + week + '_actw' + numact + '_done', '0');
        sendAction('undo_w' + numact);
    }
}

function check_act(numact) {
    if (document.getElementById('act' + numact).checked) {
        window.localStorage.setItem('week' + week + '_act' + i + '_done','1');
        sendAction('do' + numact);
        $('#row_act' + numact).addClass('animated pulse');
    } else {
        window.localStorage.setItem('week' + week + '_act' + i + '_done','0');
        sendAction('undo' + numact);
    }
}
