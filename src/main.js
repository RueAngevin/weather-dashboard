import './style.css';
import { fetchWeatherData, fetchSevenDaysWeather } from "./api.js";
import { updateUI, updateChart, updateSevenDaysStats } from "./ui.js";

const tabs = document.querySelectorAll("nav ul li a");
const timespanSelector = document.getElementById("timespan-selector");

let currentType = "temperature_2m"; // Default type
let currentTimespan = "20"; // Default timespan

function setActiveTab(selectedTab) {
    tabs.forEach(tab => tab.classList.remove("bg-pink-500", "text-white", "rounded-lg", "px-4", "py-2"));
    selectedTab.classList.add("bg-pink-500", "text-white", "rounded-lg", "px-4", "py-2");
}

async function updateData() {
    const data = await fetchWeatherData(currentType, currentTimespan);
    updateUI(data, getUnit(currentType));

    if (currentType !== "temperature_2m") {
        updateChart(data, getLabel(currentType));
        const sevenDaysData = await fetchSevenDaysWeather(currentType, currentTimespan);
        updateSevenDaysStats(sevenDaysData, currentType);
    } else {
        document.getElementById("chart-container").style.display = "none";
        document.getElementById("statistics").style.display = "none";
    }
}

document.getElementById("temperature-tab").addEventListener("click", async (event) => {
    setActiveTab(event.target);
    currentType = "temperature_2m";
    await updateData();
});

document.getElementById("wind-tab").addEventListener("click", async (event) => {
    setActiveTab(event.target);
    currentType = "wind_speed_10m";
    await updateData();
});

document.getElementById("cloud_cover").addEventListener("click", async (event) => {
    setActiveTab(event.target);
    currentType = "cloud_cover";
    await updateData();
});

timespanSelector.addEventListener("change", async (event) => {
    currentTimespan = event.target.value;
    await updateData();
});

// helper functions for unit and label
function getUnit(type) {
    switch (type) {
        case "temperature_2m": return "°C";
        case "wind_speed_10m": return "m/s";
        case "cloud_cover": return "%";
        default: return "";
    }
}

function getLabel(type) {
    switch (type) {
        case "temperature_2m": return "Temperature (°C)";
        case "wind_speed_10m": return "Wind Speed (m/s)";
        case "cloud_cover": return "Cloud Cover (%)";
        default: return "";
    }
}