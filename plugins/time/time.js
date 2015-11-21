function time() {


    setInterval(function() {
        var time = new Date;
        $('#time .time_now').text(time.getHours() + ":"  + time.getMinutes() + ":" + time.getSeconds() );
    }, 1000);
}
