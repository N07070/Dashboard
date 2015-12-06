function time() {


    setInterval(function() {
        var time = new Date;
        $('#time .time_now').text(time.toLocaleTimeString());
    }, 1000);
}
