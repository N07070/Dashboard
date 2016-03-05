function time() {


    setInterval(function() {
        var time = new Date;
        // Use of more advanced way of describing time.
        $('#time .time_now').text(time.toLocaleTimeString('fr-FR'));
    }, 1000);
}
