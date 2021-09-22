var city = "";
var searchCity = $("#search-city");
var searchBtn = $("#search-button");
var clearBtn = $("#clear-history");
var currentCity = $("#current-city");
var currentTemp = $("#temperature");
var currentHumidty = $("#humidity");
var currentSpeed = $("#wind-speed");
var currentUVIndex = $("#uv-index");
var savedCity = [];
var apiKey = "8389ade4bea93e4c884a55821b19ecb5";

function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}

function currentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        var weathericon = response.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
        var date = new Date(response.dt * 1000).toLocaleDateString();
        $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconurl + ">");
        var tempFarenht = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemp).html((tempFarenht).toFixed(2) + "&#8457");
        $(currentHumidty).html(response.main.humidity + "%");
        var windSpeed = response.wind.speed;
        var windMiles = (windSpeed * 2.237).toFixed(1);
        $(currentSpeed).html(windMiles + "MPH");

        uvIndex(response.coord.lon, response.coord.lat);
        forecast(response.id);
        if (response.cod == 200) {
            savedCity = JSON.parse(localStorage.getItem("cityname"));
            console.log(savedCity);
            if (savedCity == null) {
                savedCity = [];
                savedCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname", JSON.stringify(savedCity));
                addToList(city);
            }
            else {
                if (find(city) > 0) {
                    savedCity.push(city.toUpperCase());
                    localStorage.setItem("cityname", JSON.stringify(savedCity));
                    addToList(city);
                }
            }
        }
    })
}

function uvIndex(lat, long) {
    var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + long;
    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function (response) {
        $(currentUVIndex).html(response.value);
    });
}

function forecast(cityCode) {
    var queryforcastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityCode + "&appid=" + apiKey;
    $.ajax({
        url: queryforcastURL,
        method: "GET"
    }).then(function (response) {

        for (i = 0; i < 5; i++) {
            var date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
            var iconcode = response.list[((i + 1) * 8) - 1].weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
            var tempK = response.list[((i + 1) * 8) - 1].main.temp;
            var tempF = (((tempK - 273.5) * 1.80) + 32).toFixed(2);
            var humidity = response.list[((i + 1) * 8) - 1].main.humidity;

            $("#futureDate" + i).html(date);
            $("#futureImg" + i).html("<img src=" + iconurl + ">");
            $("#futureTemp" + i).html(tempF + "&#8457");
            $("#futureHumidity" + i).html(humidity + "%");
        }

    });
}