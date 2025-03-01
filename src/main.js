import './style.css';
import { fetchWeatherData } from "./api.js";
import { updateUI, updateChart } from "./ui.js";

const tabs = document.querySelectorAll("nav ul li a");

function setActiveTab(selectedTab) {
    tabs.forEach(tab => tab.classList.remove("bg-pink-500", "text-white", "rounded-lg", "px-4", "py-2"));
    selectedTab.classList.add("bg-pink-500", "text-white", "rounded-lg", "px-4", "py-2");
}

document.getElementById("temperature-tab").addEventListener("click", async (event) => {
    setActiveTab(event.target);
    const data = await fetchWeatherData("temperature_2m");
    updateUI(data, "°C");
});

document.getElementById("wind-tab").addEventListener("click", async (event) => {
    setActiveTab(event.target);
    const data = await fetchWeatherData("wind_speed_10m");
    updateUI(data, "m/s");
    updateChart(data, "Wind Speed (m/s)");
});

document.getElementById("cloud_cover").addEventListener("click", async (event) => {
    setActiveTab(event.target);
    const data = await fetchWeatherData("cloud_cover");
    updateUI(data, "%");
    updateChart(data, "cloud_cover");
});
