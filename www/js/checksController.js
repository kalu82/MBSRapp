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
