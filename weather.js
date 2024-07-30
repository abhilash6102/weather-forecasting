// Select elements
const input = document.querySelector("#search");
const btn = document.querySelector(".btn");
const icon = document.querySelector(".weather-icon");
const weatherWrapper = document.querySelector(".weather-wrapper");
const suggestionsContainer = document.querySelector("#suggestions");

// Define API key and URL
const apiKey = "be26faed440929fcd5a4f534130b1389";
const apiURL =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const geoURL = "https://api.openweathermap.org/geo/1.0/direct?limit=10&q=";

let selectedIndex = -1; // Track the currently selected suggestion

// Function to fetch weather forecast
async function weatherForecast(city) {
  try {
    const response = await fetch(apiURL + city + `&appid=${apiKey}`);
    const data = await response.json();

    // Update weather information
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + " °C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + " %";
    document.querySelector(".wind").innerHTML = data.wind.speed + " Kmph";
    document.querySelector(".pressure").innerHTML = data.main.pressure + " mb";
    document.querySelector(".visibility").innerHTML =
      Math.ceil(((data.visibility / 1000) * 100) / 100) + " Kms";
    console.log(data);
    // Update weather icon based on weather condition
    switch (data.weather[0].main) {
      case "Clouds":
        icon.src = "images/clouds.png";
        break;
      case "Clear":
        icon.src = "images/clear.png";
        break;
      case "Rain":
        icon.src = "images/rain.png";
        break;
      case "Drizzle":
        icon.src = "images/drizzle.png";
        break;
      case "Mist":
        icon.src = "images/mist.png";
        break;
      default:
        icon.src = "images/default.png"; // Fallback image
    }

    // Display weather wrapper
    weatherWrapper.style.display = "block";
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Function to fetch city suggestions
async function fetchCitySuggestions(query) {
  try {
    const response = await fetch(geoURL + query + `&appid=${apiKey}`);
    const data = await response.json();

    // Clear existing suggestions
    suggestionsContainer.innerHTML = "";

    // Create suggestion items
    data.forEach((city, index) => {
      const div = document.createElement("div");
      div.textContent = `${city.name}, ${city.country}`;
      div.classList.add("suggestion-item");
      div.dataset.index = index;
      div.addEventListener("click", function () {
        input.value = `${city.name}, ${city.country}`;
        suggestionsContainer.innerHTML = "";
        weatherForecast(city.name);
      });
      suggestionsContainer.appendChild(div);
    });

    selectedIndex = -1; // Reset the selected index
    weatherWrapper.style.display = "none";
  } catch (error) {
    console.error("Error fetching city suggestions:", error);
  }
}

// Function to handle arrow key navigation and Enter key press
function handleKeyboardNavigation(event) {
  const suggestionItems = document.querySelectorAll(".suggestion-item");

  if (event.key === "ArrowDown") {
    if (suggestionItems.length > 0) {
      selectedIndex = (selectedIndex + 1) % suggestionItems.length;
      updateSuggestionHighlight();
    }
  } else if (event.key === "ArrowUp") {
    if (suggestionItems.length > 0) {
      selectedIndex =
        (selectedIndex - 1 + suggestionItems.length) % suggestionItems.length;
      updateSuggestionHighlight();
    }
  } else if (event.key === "Enter") {
    if (selectedIndex >= 0 && selectedIndex < suggestionItems.length) {
      suggestionItems[selectedIndex].click();
    } else {
      const city = input.value.trim();
      if (city) {
        weatherForecast(city);
      }
    }
  }
}

// Function to update the highlight of the selected suggestion
function updateSuggestionHighlight() {
  const suggestionItems = document.querySelectorAll(".suggestion-item");
  suggestionItems.forEach((item, index) => {
    item.classList.toggle("highlighted", index === selectedIndex);
  });
}

// Event listener for input field
input.addEventListener("input", function () {
  const inputValue = this.value.toLowerCase();
  if (inputValue.length >= 1) {
    fetchCitySuggestions(inputValue);
  } else {
    suggestionsContainer.innerHTML = "";
  }
});

// Event listener for search button
btn.addEventListener("click", () => {
  const city = input.value.trim();
  if (city) {
    weatherForecast(city);
  } else {
    alert("Please enter a city.");
  }
});

// Event listener for keyboard navigation
input.addEventListener("keydown", handleKeyboardNavigation);
