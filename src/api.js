const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeatherData(type) {
    try {
        const url = `${BASE_URL}?latitude=61.4991&longitude=23.7871&hourly=${type}&past_days=1&forecast_days=0&timezone=Europe%2FHelsinki`;
        const response = await fetch(url);
        const data = await response.json();
        const timestamps = data.hourly.time.slice(-20); // Get last 20 timestamps
        const values = data.hourly[type].slice(-20); // Get last 20 readings

        return timestamps.map((timestamp, index) => ({
            date: new Date(timestamp).toLocaleDateString(),
            time: new Date(timestamp).toLocaleTimeString(),
            value: values[index]
        }));
    } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
        return [];
    }
}
