var city = "";
var searchCity = $("#search-city");
var searchBtn = $("#search-btn");
var clearBtn = $("#clear-btn");
var currentCity = $("#current-city");
var currentTemp = $("#temperature");
var currentHumidity = $("#humidity");
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
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey;
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
        $(currentHumidity).html(response.main.humidity + "%");
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
    var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + long;
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
            var tempKelvin = response.list[((i + 1) * 8) - 1].main.temp;
            var tempFarenht = (((tempKelvin - 273.5) * 1.80) + 32).toFixed(2);
            var humidity = response.list[((i + 1) * 8) - 1].main.humidity;

            $("#futureDate" + i).html(date);
            $("#futureImg" + i).html("<img src=" + iconurl + ">");
            $("#futureTemp" + i).html(tempFarenht + "&#8457");
            $("#futureHumidity" + i).html(humidity + "%");
        }

    });
}
function addToList(c) {
    var listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl);
}
function invokePastSearch(event) {
    var liEl = event.target;
    if (event.target.matches("li")) {
        city = liEl.textContent.trim();
        currentWeather(city);
    }

}
function loadlastCity() {
    $("ul").empty();
    var savedCity = JSON.parse(localStorage.getItem("cityname"));
    if (savedCity !== null) {
        savedCity = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < savedCity.length; i++) {
            addToList(savedCity[i]);
        }
        city = savedCity[i - 1];
        currentWeather(city);
    }


}
function clearHistory(event) {
    event.preventDefault();
    savedCity = [];
    localStorage.removeItem("cityname");
    document.location.reload();

}
function find(c) {
    for (var i = 0; i < savedCity.length; i++) {
        if (c.toUpperCase() === savedCity[i]) {
            return -1;
        }
    }
    return 1;
}
$("#search-btn").on("click", displayWeather);
$(document).on("click", invokePastSearch);
$(window).on("load", loadlastCity);
$("#clear-btn").on("click", clearHistory);
