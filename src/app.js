function formatDate(timestamp) {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#currentTime");
  let iconElement = document.querySelector("#weatherIcon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute(
    "alt",
    `http://openweathermap.org/img/wn/${response.data.weather[0].description}@2x.png`
  );

  callForecast(response.data.coord);
}

function callForecast(coordinates) {
  let apiKey = "616d4f1d4c8141d448674e1f1ec401a1";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherForecast);
}

function displayWeatherForecast(response) {
  let forecast = response.data.daily;

  let weatherForecastElement = document.querySelector("#forecast");

  let forecastHtml = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHtml =
        forecastHtml +
        `
      <div class="col-2 weather-forecast">
        <div class="weather-forecast-date">
            ${formatDay(forecastDay.dt)}
        </div>
        <img src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" alt="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].description
        }@2x.png" id="weather-forecast-icon"/>
        <div class="weather-forecast-temperature">
        <div id="max-forecast-temp">${Math.round(forecastDay.temp.max)}°</div>
                <div id="min-forecast-temp"> ${Math.round(
                  forecastDay.temp.min
                )}°</div>
              </div>
              </div>
        `;
    }
  });

  forecastHtml = forecastHtml + `</div>`;
  weatherForecastElement.innerHTML = forecastHtml;
}

function search(city) {
  let apiKey = "616d4f1d4c8141d448674e1f1ec401a1";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#search");
  search(cityInputElement.value);
}

function displayFahrenheitUnit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitConversion = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");

  temperatureElement.innerHTML = Math.round(fahrenheitConversion);
}

function displayCelsiusUnit(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
let celsiusTemperature = null;

let form = document.querySelector(".search-bar");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheitUnit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsiusUnit);

search("Seoul");
