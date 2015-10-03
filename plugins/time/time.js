function time() {
    var start = new Date;

    setInterval(function() {
        $('#time .time_now').text((new Date ));
    }, 1000);
}
