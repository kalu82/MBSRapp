// Timer for player check
var currentPlayerToCheck = null;
var TIMER_PERIOD_FOR_PLAYER_CHECK_MS = 60000;
var what_is_playing = null;
var progression_playing_track = null;

function resetPlayerToCheck() {
    what_is_playing = null;
    progression_playing_track = null;
    currentPlayerToCheck = null;
}

var timerPlayerCheck;

function startCountTimeoutPlayer() {
    timerPlayerCheck = setInterval(function () {
        progression_playing_track = ~~(currentPlayerToCheck.currentTime / currentPlayerToCheck.duration * 100);
        sendAction("playing" + what_is_playing);
    }, TIMER_PERIOD_FOR_PLAYER_CHECK_MS);
}

function stopCountTimeoutPlayer() {
    clearInterval(timerPlayerCheck);
}

function pauseCountTimeoutPlayer() {
    clearInterval(timerPlayerCheck);
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

// Add event listener for track end
function addListenerEnd(trackName, trackToCheck, actToCheck) {
    trackToCheck.onended = function () {
        trackEnd(trackName, trackToCheck);
        check_act(actToCheck);
    }
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
