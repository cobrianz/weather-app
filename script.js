document.addEventListener("DOMContentLoaded", () => {
  const apiBaseUrl = "https://api.sunrisesunset.io/json";
  const locationSelect = document.getElementById("location-select");
  const cityNameDisplay = document.querySelector(".selected-city-name");
  const datetimeDisplay = document.getElementById("datetime-display");
  const sunriseDisplay = document.getElementById("sunrise");
  const sunsetDisplay = document.getElementById("sunset");
  const timezoneDisplay = document.querySelector(".timezone-info-display");
  const locationCountryDisplay = document.getElementById("location-country");
  const locationNameDisplay = document.getElementById("location-name");
  const dayLabel = document.getElementById("day-label");
  const tomorrowButton = document.getElementById("tommorrow");
  const errorMessage = document.getElementById("error-message");

  // Elements to display additional info
  const dawnDisplay = document.querySelector(".dawn-info-display");
  const duskDisplay = document.querySelector(".dusk-info-display");
  const solarNoonDisplay = document.querySelector(".solar-noon-display");
  const dayLengthDisplay = document.querySelector(".day-length-display");

  let isTomorrow = false;

  // Fetch sunrise and sunset data from the API with a specified date
  async function fetchSunriseSunsetData(latitude, longitude, date) {
    try {
      const response = await fetch(`${apiBaseUrl}?lat=${latitude}&lng=${longitude}&date=${date}`);
      const data = await response.json();
      
      // Hide error message on successful response
      errorMessage.style.display = "none";

      if (data && data.results) {
        updateDisplay(data.results);
        updateDatetimeDisplay(date);
        updateLocationDisplay();
      } else {
        showError("Error retrieving data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showError("Error fetching data.");
    }
  }

  // Display error message
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }

  // Update display with the API data
  function updateDisplay(results) {
    sunriseDisplay.textContent = results.sunrise || "--:--";
    sunsetDisplay.textContent = results.sunset || "--:--";
    dawnDisplay.textContent = results.dawn || "--:--";
    duskDisplay.textContent = results.dusk || "--:--";
    solarNoonDisplay.textContent = results.solar_noon || "--:--";
    dayLengthDisplay.textContent = results.day_length || "--:--";
    timezoneDisplay.textContent = results.timezone || "--:--";
    cityNameDisplay.textContent = locationSelect.options[locationSelect.selectedIndex].text || "Select a Location";
  }

  // Update the date and city display
  function updateDatetimeDisplay(date) {
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: 'long' });
    const formattedDate = dateObj.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    datetimeDisplay.textContent = `${dayName}, ${formattedDate}`;
  }

  // Update the location info (country and name)
  function updateLocationDisplay() {
    const location = locationSelect.options[locationSelect.selectedIndex].text;
    locationCountryDisplay.textContent = location;
    locationNameDisplay.textContent = location;
  }

  // Get initial data for today's date on page load
  const todayDate = new Date().toISOString().split('T')[0];
  const [initialLat, initialLng] = locationSelect.value.split(",");
  fetchSunriseSunsetData(initialLat, initialLng, todayDate);

  // Event listener for location selection change
  locationSelect.addEventListener("change", () => {
    const [latitude, longitude] = locationSelect.value.split(",");
    const date = isTomorrow ? getTomorrowDate() : todayDate;
    fetchSunriseSunsetData(latitude, longitude, date);
    updateLocationDisplay();
  });

  // Event listener for "Tomorrow" button to toggle between Today and Tomorrow data
  tomorrowButton.addEventListener("click", () => {
    isTomorrow = !isTomorrow;
    const [latitude, longitude] = locationSelect.value.split(",");
    const date = isTomorrow ? getTomorrowDate() : todayDate;
    fetchSunriseSunsetData(latitude, longitude, date);
    tomorrowButton.textContent = isTomorrow ? "Today" : "Tomorrow";
    dayLabel.textContent = isTomorrow ? "Tomorrow" : "Today";
  });

  // Helper function to get tomorrow’s date in YYYY-MM-DD format
  function getTomorrowDate() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }
});
