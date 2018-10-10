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

// Add event listener for track end
function addListenerEnd(trackName, trackToCheck, actToCheck) {
    trackToCheck.onended = function () {
        trackEnd(trackName, trackToCheck);
        check_act(actToCheck);
    }
}

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
        this.endCount(medDuration);
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

function endCount(medDuration) {
    sendAction("end_" + medDuration);
    disable_play_btns(false);
    bell.pause();
    bell.currentTime = 0;
    $('#btn_pause' + medDuration).prop('disabled', true);
    $('#btn_stop' + medDuration).prop('disabled', true);
    resetPlayerToCheck();
    clearTimeout(timerMed);
    timerSec = 0;
    $('#act1').prop('checked', true);
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
