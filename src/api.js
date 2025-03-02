const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeatherData(type, timespan = "20") {
    try {
        const pastDays = getPastDays(timespan);
        const url = `${BASE_URL}?latitude=61.4991&longitude=23.7871&hourly=${type}&past_days=${pastDays}&forecast_days=0&timezone=Europe%2FHelsinki`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${type} data: ${response.statusText}`);
        }
        
        const data = await response.json();

        const timestamps = data.hourly.time.slice(-timespan); 
        const values = data.hourly[type].slice(-timespan);

        return timestamps.map((timestamp, index) => ({
            date: new Date(timestamp).toLocaleDateString(),
            time: new Date(timestamp).toLocaleTimeString(),
            value: values[index]
        }));

    } catch (error) {
        throw new Error(`Error fetching ${type} data: ${error.message}`);
    }
}

// Helper function to calculate past_days based on timespan
function getPastDays(timespan) {
    if (timespan === "20") return 1;
    if (timespan === "24") return 1;
    if (timespan === "48") return 2;
    if (timespan === "72") return 3;
    if (timespan === "168") return 7;
    if (timespan === "720") return 30;
    return 1;
}

export async function fetchSevenDaysWeather(type) {
    try {
        const sevenDaysUrl = `${BASE_URL}?latitude=60.192059&longitude=24.945831&hourly=${type}&past_days=7`;

        const sevenDaysResponse = await fetch(sevenDaysUrl);
        if (!sevenDaysResponse.ok) {
            throw new Error(`Failed to fetch ${type} data: ${sevenDaysResponse.statusText}`);
        }
        const sevenDaysData = await sevenDaysResponse.json();

        return sevenDaysData.hourly[type].slice(-168); 

    } catch (error) {
        throw new Error(`Error fetching ${type} data: ${error.message}`);
    }
}