$(document).ready(function () {
    $('#searchForm form').submit(function (e) {
        e.preventDefault();
        const cityName = $('#cityInput').val();
        if (cityName) {
            getWeatherData(cityName);
        }
    });

    $('#currentWeatherLink').click(function (e) {
        e.preventDefault();
        getCurrentLocationWeather();
    });

    $('#forecastLink').click(function (e) {
        e.preventDefault();
        getCurrentLocationForecast();
    });
});

function getCurrentLocationWeather() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherDataByCoordinates(lat, lon);
        });
    } else {
        $('#weatherDisplay').text('La geolocalización no está disponible en este navegador.');
    }
}

function getCurrentLocationForecast() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getForecastDataByCoordinates(lat, lon);
        });
    } else {
        $('#weatherDisplay').text('La geolocalización no está disponible en este navegador.');
    }
}

function getWeatherDataByCoordinates(lat, lon) {
    const apiKey = '354be36feea42dec896a3b29a2d964cb'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

    $.ajax({
        url: apiUrl,
        type: 'GET',
        success: function (data) {
            displayWeather(data);
        },
        error: function (error) {
            $('#weatherDisplay').html('No se pudo obtener el pronóstico del tiempo.');
        }
    });
}

function getForecastDataByCoordinates(lat, lon) {
    const apiKey = '354be36feea42dec896a3b29a2d964cb'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

    $.ajax({
        url: apiUrl,
        type: 'GET',
        success: function (data) {
            displayForecast(data);
        },
        error: function (error) {
            $('#weatherDisplay').html('No se pudo obtener el pronóstico de 5 días.');
        }
    });
}

function displayForecast(data) {
    const weatherDisplay = $('#weatherDisplay');
    weatherDisplay.empty();

    if (data.list && data.list.length > 0) {
        const forecastList = data.list;
        const titleElement = $('<h2>').text('Predicción de 5 Días');
        const forecastContainer = $('<div>');

        forecastList.forEach((forecastItem) => {
            const timestamp = forecastItem.dt * 1000;
            const date = new Date(timestamp);
            const day = date.toLocaleDateString('es-ES', { weekday: 'long' });
            const temperature = Math.round(forecastItem.main.temp);
            const weatherIcon = forecastItem.weather[0].icon;

            const dayElement = $('<div>').addClass('forecast-day');
            const dayNameElement = $('<p>').text(day);
            const iconElement = $('<img>').attr('src', `https://openweathermap.org/img/wn/${weatherIcon}.png`);
            const temperatureElement = $('<p>').text(`${temperature}°C`);

            dayElement.append(dayNameElement, iconElement, temperatureElement);
            forecastContainer.append(dayElement);
        });
        weatherDisplay.append(titleElement, forecastContainer);
    } else {
        weatherDisplay.text('No se pudo obtener la predicción de 5 días.');
    }
}


function displayWeather(data) {
    const weatherDisplay = $('#weatherDisplay');

    weatherDisplay.empty();

    if (data.weather && data.weather.length > 0) {
        const weatherInfo = data.weather[0];
        const mainInfo = data.main;
        const windInfo = data.wind;

        const weatherIcon = weatherInfo.icon;
        const weatherDescription = weatherInfo.description;
        const temperature = Math.round(mainInfo.temp);
        const humidity = mainInfo.humidity;
        const windSpeed = windInfo.speed;

        const weatherIconElement = $('<img>').attr('src', `https://openweathermap.org/img/wn/${weatherIcon}.png`);
        const descriptionElement = $('<p>').text(weatherDescription);
        const temperatureElement = $('<p>').text(`Temperatura: ${temperature}°C`);
        const humidityElement = $('<p>').text(`Humedad: ${humidity}%`);
        const windElement = $('<p>').text(`Velocidad del viento: ${windSpeed} m/s`);

        weatherDisplay.append(weatherIconElement, descriptionElement, temperatureElement, humidityElement, windElement);
    } else {
        weatherDisplay.text('No se encontraron datos de tiempo para esta ciudad.');
    }
}

