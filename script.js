
const API_KEY = "6e02a71216a8fc3322688e77e75f6e98";

const weatherBox = document.getElementById("weather");
const historyBox = document.getElementById("history");
const cityInput = document.getElementById("cityInput");

// 👉 Temporary history (clears on refresh)
let history = [];

/* ---------- FETCH WEATHER ---------- */
async function getWeather(city) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!res.ok) {
        alert("city not found");
        throw new Error("City not found");
    }

    return await res.json();
}

/* ---------- RENDER WEATHER ---------- */
function renderWeather(d) {
    weatherBox.innerHTML = `
        <div class="weather-item"><label>City</label><span>${d.name}, ${d.sys.country}</span></div>
        <div class="weather-item"><label>Temperature</label><span>${d.main.temp} °C</span></div>
        <div class="weather-item"><label>Weather</label><span>${d.weather[0].main}</span></div>
        <div class="weather-item"><label>Humidity</label><span>${d.main.humidity}%</span></div>
        <div class="weather-item"><label>Wind Speed</label><span>${d.wind.speed} m/s</span></div>
    `;
}

/* ---------- SAVE HISTORY (TEMP ONLY) ---------- */
function saveHistory(city) {
    // remove duplicates
    history = history.filter(c => c.toLowerCase() !== city.toLowerCase());

    // add on top
    history.unshift(city);

    // limit to 5
    history = history.slice(0, 5);

    showHistory();
}

/* ---------- SHOW HISTORY ---------- */
function showHistory() {
    historyBox.innerHTML = "";

    history.forEach(city => {
        const btn = document.createElement("button");
        btn.textContent = city;

        btn.onclick = () => search(city);

        historyBox.appendChild(btn);
    });
}

/* ---------- SEARCH ---------- */
async function search(city) {
    weatherBox.innerHTML = "";
    try {
        const data = await getWeather(city);
        renderWeather(data);
        saveHistory(data.name);
    } catch (error) {
        weatherBox.innerHTML = `<p style="color:red">${error.message}</p>`;
    }
}

/* ---------- EVENTS ---------- */
document.getElementById("searchBtn").onclick = () => {
    const city = cityInput.value.trim();
    if (city) search(city);
};

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) search(city);
    }
});

