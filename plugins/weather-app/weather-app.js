function weather_app(){
    console.log("Hello World");
    var weather = "Cldudy";
    if (weather === "Cloudy"){
        $('#weather-app-now').text("Cloudy");
        $('#weather-app-now').attr("src","./assets/plugins/weather-app/img/cloudy.png");
    }else {
        $('#weather-app').text("Unable to retrieve the weather... Could you look outside and tes us ?");

    }
}
