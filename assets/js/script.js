var city="";
var searchCity = $("#search-city");
var searchBtn = $("#search-button");
var clearBtn = $("#clear-history");
var currentCity = $("#current-city");
var currentTemp = $("#temperature");
var currentHumidty= $("#humidity");
var currentSpeed=$("#wind-speed");
var currentUVIndex= $("#uv-index");
var savedCity=[];
var APIKey="8389ade4bea93e4c884a55821b19ecb5";

function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim()!==""){
        city= searchCity.val().trim();
        currentWeather(city);
    }
}

function currentWeather(city){
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){
        console.log(response);
        var weathericon= response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        var date=new Date(response.dt*1000).toLocaleDateString();
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");
    })
}
