import './style.css';
import { fetchWeatherData, fetchSevenDaysWeather } from "./api.js";
import { updateUI, updateChart, updateSevenDaysStats } from "./ui.js";

const tabs = document.querySelectorAll("nav ul li a");
const timespanSelector = document.getElementById("timespan-selector");
const parameterSelector = document.getElementById("parameter-selector");
const errorPopup = document.getElementById("error-popup");
const errorMessage = document.getElementById("error-message");
const closeErrorButton = document.getElementById("close-error");

let currentType = "temperature_2m"; // Default type
let currentTimespan = "20"; // Default timespan

function setActiveTab(selectedTab) {
    tabs.forEach(tab => tab.classList.remove("bg-pink-500", "text-white", "rounded-lg", "px-4", "py-2"));
    selectedTab.classList.add("bg-pink-500", "text-white", "rounded-lg", "px-4", "py-2");
}

async function updateData() {
    try {
        const data = await fetchWeatherData(currentType, currentTimespan);
        updateUI(data, getUnit(currentType));

        // Always show chart and statistics for Search tab
        document.getElementById("chart-container").style.display = "block";
        document.getElementById("statistics").style.display = "block";

        updateChart(data, getLabel(currentType));
        const sevenDaysData = await fetchSevenDaysWeather(currentType);
        updateSevenDaysStats(sevenDaysData, currentType);

        // Hide error pop-up if data is fetched successfully
        hideError();
    } catch (error) {
        showError(error.message);
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorPopup.classList.remove("hidden");
}

function hideError() {
    errorPopup.classList.add("hidden");
}

closeErrorButton.addEventListener("click", hideError);

document.getElementById("search-tab").addEventListener("click", async (event) => {
    setActiveTab(event.target);
    currentType = parameterSelector.value; // Use selected parameter
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

parameterSelector.addEventListener("change", async (event) => {
    currentType = event.target.value;
    if (document.getElementById("search-tab").classList.contains("bg-pink-500")) {
        await updateData();
    }
});

// Helper functions
function getUnit(type) {
    const units = {
        temperature_2m: "°C",
        relative_humidity_2m: "%",
        apparent_temperature: "°C",
        surface_pressure: "hPa",
        wind_speed_80m: "m/s",
        wind_direction_10m: "°",
        wind_direction_80m: "°",
        wind_direction_120m: "°",
        wind_direction_180m: "°",
        wind_gusts_10m: "m/s",
        shortwave_radiation: "W/m²",
        direct_radiation: "W/m²",
        direct_normal_irradiance: "W/m²",
        global_tilted_irradiance: "W/m²",
        evapotranspiration: "mm",
        precipitation: "mm",
        snowfall: "cm",
        rain: "mm",
        showers: "mm",
        weather_code: "",
        freezing_level_height: "m",
        soil_temperature_0cm: "°C",
        soil_temperature_6cm: "°C",
        soil_temperature_18cm: "°C",
        soil_temperature_54cm: "°C",
        soil_moisture_0_to_1cm: "m³/m³",
        soil_moisture_1_to_3cm: "m³/m³",
        soil_moisture_3_to_9cm: "m³/m³",
        soil_moisture_9_to_27cm: "m³/m³",
        soil_moisture_27_to_81cm: "m³/m³",
    };
    return units[type] || "";
}

function getLabel(type) {
    const labels = {
        temperature_2m: "Temperature (°C)",
        relative_humidity_2m: "Relative Humidity (%)",
        apparent_temperature: "Apparent Temperature (°C)",
        surface_pressure: "Surface Pressure (hPa)",
        wind_speed_80m: "Wind Speed (80m) (m/s)",
        wind_direction_10m: "Wind Direction (10m) (°)",
        wind_direction_80m: "Wind Direction (80m) (°)",
        wind_direction_120m: "Wind Direction (120m) (°)",
        wind_direction_180m: "Wind Direction (180m) (°)",
        wind_gusts_10m: "Wind Gusts (10m) (m/s)",
        shortwave_radiation: "Shortwave Radiation (W/m²)",
        direct_radiation: "Direct Radiation (W/m²)",
        direct_normal_irradiance: "Direct Normal Irradiance (W/m²)",
        global_tilted_irradiance: "Global Tilted Irradiance (W/m²)",
        evapotranspiration: "Evapotranspiration (mm)",
        precipitation: "Precipitation (mm)",
        snowfall: "Snowfall (cm)",
        rain: "Rain (mm)",
        showers: "Showers (mm)",
        weather_code: "Weather Code",
        freezing_level_height: "Freezing Level Height (m)",
        soil_temperature_0cm: "Soil Temperature (0cm) (°C)",
        soil_temperature_6cm: "Soil Temperature (6cm) (°C)",
        soil_temperature_18cm: "Soil Temperature (18cm) (°C)",
        soil_temperature_54cm: "Soil Temperature (54cm) (°C)",
        soil_moisture_0_to_1cm: "Soil Moisture (0-1cm) (m³/m³)",
        soil_moisture_1_to_3cm: "Soil Moisture (1-3cm) (m³/m³)",
        soil_moisture_3_to_9cm: "Soil Moisture (3-9cm) (m³/m³)",
        soil_moisture_9_to_27cm: "Soil Moisture (9-27cm) (m³/m³)",
        soil_moisture_27_to_81cm: "Soil Moisture (27-81cm) (m³/m³)",
    };
    return labels[type] || type;
}

// Initial load
document.addEventListener("DOMContentLoaded", async () => {
    // Set the default tab as active
    setActiveTab(document.getElementById("search-tab"));

    // Fetch and display initial data
    await updateData();
});