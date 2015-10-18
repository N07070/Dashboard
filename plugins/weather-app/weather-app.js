// Please enter the name of your city here.
var city = "Binn";

function weather_app(){

    var open_weather_api = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=bd82977b86bf27fb59a04b61b657fb6f";
    var weather;

    $.getJSON(open_weather_api, function(data){
        console.log("[ weather-app ] Got the weather data !");

        $('#weather-app-city').text(city);

        $('#weather-app-now').text(data.weather[0]["main"]);
        if (data.weather[0]["id"] === 800) {
            $('#weather-app-image').attr("src","../plugins/weather-app/img/weather-sunny.png");
        }
        else if ( data.weather[0]["id"] >= 900 && data.weather[0]["id"] <= 906) {
            // Extreme !
            $('#weather-app-image').attr("src","../plugins/weather-app/img/weather-lightning.png");
        }else if (data.weather[0]["id"] >= 800 && data.weather[0]["id"] <= 804) {
            // Clouds !
            $('#weather-app-image').attr("src","../plugins/weather-app/img/weather-cloudy.png");
        }else if (data.weather[0]["id"] >= 701 && data.weather[0]["id"] <= 781) {
            // Atmosphere ?
            $('#weather-app-image').attr("src","../plugins/weather-app/img/weather-windy.png");
        }else if (data.weather[0]["id"] >= 600 && data.weather[0]["id"] <= 622) {
            // Snow !
            $('#weather-app-image').attr("src","../plugins/weather-app/img/weather-snowy.png");
        }else if (data.weather[0]["id"] >= 500 && data.weather[0]["id"] <= 531) {
            // Rain
            $('#weather-app-image').attr("src","../plugins/weather-app/img/weather-rainy.png");
        }else if (data.weather[0]["id"] >= 300 && data.weather[0]["id"] <= 321) {
            // Drizzle
            $('#weather-app-image').attr("src","../plugins/weather-app/img/weather-partlycloudy.png");
        }else if (data.weather[0]["id"] >= 200 && data.weather[0]["id"] <= 232) {
            // THUNDER !
            $('#weather-app-image').attr("src","../plugins/weather-app/img/weather-lightning.png");
        }
    });


}
