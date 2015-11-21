function computer_information(){

    var password = "password";
    var username = "username";
    var adress = "localhost";
    var port = "5000";
    var url = "http://" + adress + ":" + port + "/API/info";

    $.getJSON(url, function(data){
        $("#computer-information-os").text(data["os"]);
        $("#computer-information-architecture").text(data["architecture"]);
        $("#computer-information-name").text(data["name"]);
    });
}
