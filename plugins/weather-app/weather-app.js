// Please enter the name of your city here.
var city = "Binn";

function weather_app(){

    var open_weather_api = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=2de143494c0b295cca9337e1e96b00e0";
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

function parse_weather_response(data) {
    $('#weather-app-now').text(data.weather[0]["main"]);
    if (data.weather[0]["id"] === 800) {
        $('#weather-app-image').attr("src","../plugins/weather-app/img/sunny1.png");

    }else if ( data.weather[0]["id"] >= 900 && data.weather[0]["id"] <= 906) {
        // Extreme !
        $('#weather-app-image').attr("src","../plugins/weather-app/img/extreme.png");

    }else if (data.weather[0]["id"] >= 800 && data.weather[0]["id"] <= 804) {
        // Clouds !
        $('#weather-app-image').attr("src","../plugins/weather-app/img/cloudy.png");

    }else if (data.weather[0]["id"] >= 701 && data.weather[0]["id"] <= 781) {
        // Atmosphere ?
        $('#weather-app-image').attr("src","../plugins/weather-app/img/atmosphere.png");

    }else if (data.weather[0]["id"] >= 600 && data.weather[0]["id"] <= 622) {
        // Snow !
        $('#weather-app-image').attr("src","../plugins/weather-app/img/snow.png");

    }else if (data.weather[0]["id"] >= 500 && data.weather[0]["id"] <= 531) {
        // Rain
        $('#weather-app-image').attr("src","../plugins/weather-app/img/rain.png");

    }else if (data.weather[0]["id"] >= 300 && data.weather[0]["id"] <= 321) {
        // Drizzle
        $('#weather-app-image').attr("src","../plugins/weather-app/img/sunny0.png");

    }else if (data.weather[0]["id"] >= 200 && data.weather[0]["id"] <= 232) {
        // THUNDER !
        $('#weather-app-image').attr("src","../plugins/weather-app/img/thunder.png");
    }else {
        // Wtf ?
        $('#weather-app-image').attr("src","../plugins/weather-app/img/wtf.png");
    }
}
