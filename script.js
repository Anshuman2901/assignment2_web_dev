// ================= API CONFIG =================
const API_KEY = "7b953070fd5a615ea59b73c535d29c00"; // Replace with your API key
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// ================= DOM ELEMENTS =================
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const historyList = document.getElementById("historyList");

// ================= SHOW WEATHER =================
function displayWeather(data) {
    weatherResult.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p>🌡 Temperature: ${(data.main.temp - 273.15).toFixed(1)} °C</p>
        <p>☁ Condition: ${data.weather[0].main}</p>
    `;
}

// ================= SAVE TO LOCAL STORAGE =================
function saveToLocalStorage(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem("weatherHistory", JSON.stringify(history));
    }

    renderHistory();
}

// ================= RENDER HISTORY =================
function renderHistory() {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    historyList.innerHTML = "";

    history.forEach(city => {
        const btn = document.createElement("button");
        btn.textContent = city;

        btn.addEventListener("click", () => {
            fetchWeather(city);
        });

        historyList.appendChild(btn);
    });
}

// ================= FETCH WEATHER (ASYNC/AWAIT) =================
async function fetchWeather(city) {
    try {
        weatherResult.innerHTML = "Loading...";

        console.log("Fetching weather...");
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}`);

        if (!response.ok) {
            throw new Error("City not found!");
        }

        const data = await response.json();
        console.log("Weather data received");

        displayWeather(data);
        saveToLocalStorage(city);

    } catch (error) {
        weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}

// ================= EVENT LISTENER =================
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    fetchWeather(city);
    cityInput.value = "";
});

// ================= LOAD HISTORY ON PAGE LOAD =================
renderHistory();