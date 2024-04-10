document.addEventListener("DOMContentLoaded", (event) => {
    const searchInputEl = document.getElementById("search-input");
    const searchButtonEl = document.getElementById("search-button");
    const searchHistoryEl = document.getElementById("search-history");
  
    // Load search history from local storage
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  
    // Convert temperature from Kelvin to Fahrenheit
    function kelvinToFahrenheit(kelvin) {
      return (((kelvin - 273.15) * 9) / 5 + 32).toFixed(2);
    }
  
    // Convert wind speed from meters per second to miles per hour
    function mpsToMph(mps) {
      return (mps * 2.23694).toFixed(2);
    }
  
    // Display search history
    searchHistory.forEach((city) => {
      const historyItemEl = document.createElement("li");
      historyItemEl.textContent = city;
      historyItemEl.addEventListener("click", () => {
        searchWeather(city);
      });
      searchHistoryEl.appendChild(historyItemEl);
    });
  
    searchButtonEl.addEventListener("click", () => {
      const city = searchInputEl.value.trim();
      searchWeather(city);
  
      // Save to search history
      if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  
        const historyItemEl = document.createElement("li");
        historyItemEl.textContent = city;
        historyItemEl.addEventListener("click", () => {
          searchWeather(city);
        });
        searchHistoryEl.appendChild(historyItemEl);
      }
    });
  
    function searchWeather(city) {
      const apiKey = "8bb60b5a1317fc4b434f7f1d94b4f63a";
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  
      fetch(geocodingUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const latitude = data[0].lat;
          const longitude = data[0].lon;
          const fetchUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  
          fetch(fetchUrl)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              const cityNameEl = document.getElementById("city-name");
              const cityInfoEl = document.getElementById("city-info");
              const forecastEls = [
                document.getElementById("day1"),
                document.getElementById("day2"),
                document.getElementById("day3"),
                document.getElementById("day4"),
                document.getElementById("day5"),
              ];
  
              cityNameEl.textContent = `${data.city.name} (${new Date().toLocaleDateString()})`;
  
              cityInfoEl.innerHTML = `
                <img src="http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png" alt="${data.list[0].weather[0].description}">
                Temperature: ${kelvinToFahrenheit(data.list[0].main.temp)}°F
                Humidity: ${data.list[0].main.humidity}%
                Wind Speed: ${mpsToMph(data.list[0].wind.speed)} mph
              `;
  
              for (let i = 0; i < 5; i++) {
                forecastEls[i].innerHTML = `
                  <h3>${new Date(data.list[i * 8].dt_txt).toLocaleDateString()}</h3>
                  <img src="http://openweathermap.org/img/wn/${data.list[i * 8].weather[0].icon}.png" alt="${data.list[i * 8].weather[0].description}">
                  Temperature: ${kelvinToFahrenheit(data.list[i * 8].main.temp)}°F
                  Wind Speed: ${mpsToMph(data.list[i * 8].wind.speed)} mph
                  Humidity: ${data.list[i * 8].main.humidity}%
                `;
              }
            });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  });