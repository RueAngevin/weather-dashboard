const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeatherData(type, timespan = "20") {
    try {
        const pastDays = getPastDays(timespan);
        const url = `${BASE_URL}?latitude=61.4991&longitude=23.7871&hourly=${type}&past_days=${pastDays}&forecast_days=0&timezone=Europe%2FHelsinki`;

        const response = await fetch(url);
        const data = await response.json();

        const timestamps = data.hourly.time.slice(-timespan); 
        const values = data.hourly[type].slice(-timespan);

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

// Helper function to calculate past_days based on timespan
function getPastDays(timespan) {
    // Latest 20 readings
    if (timespan === "20") return 1;
    // Last 24 hours
    if (timespan === "24") return 1;
    // Last 48 hours 
    if (timespan === "48") return 2;
    // Last 72 hours
    if (timespan === "72") return 3;
    // Last 1 week 
    if (timespan === "168") return 7;
    // Last 1 month 
    if (timespan === "720") return 30;
    // Default
    return 1;
}

// fetch Seven Days Weather 
export async function fetchSevenDaysWeather(type) {
    try {
        const sevenDaysUrl = `${BASE_URL}?latitude=60.192059&longitude=24.945831&hourly=${type}&past_days=7`;

        const sevenDaysResponse = await fetch(sevenDaysUrl);
        const sevenDaysData = await sevenDaysResponse.json();

        // Get last 168 readings (24 * 7)
        return sevenDaysData.hourly[type].slice(-168); 

    } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
        return [];
    }
}