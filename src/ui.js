let weatherChart = null;

export function updateUI(data, unit) {
    const weatherDataElement = document.getElementById('weather-data');
    weatherDataElement.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2">${item.date}</td>
            <td class="px-4 py-2">${item.time}</td>
            <td class="px-4 py-2">${item.value}${unit}</td>
        `;
        weatherDataElement.appendChild(row);
    });
}

export function updateChart(data, label) {
    const ctx = document.getElementById("weatherChart").getContext("2d");

    // Create labels based on the data timestamps
    const labels = data.map(item => `${item.date} ${item.time}`);

    // Extract values from the data
    const values = data.map(item => item.value);

    // Destroy previous chart if it exists
    if (weatherChart) {
        weatherChart.destroy();
    }

    // Determine chart type based on data length
    const chartType = data.length > 50 ? "line" : "bar"; // Use line chart for long datasets

    // Create a new chart
    weatherChart = new Chart(ctx, {
        type: chartType, // Dynamic chart type
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: values,
                borderColor: "rgba(56, 178, 172, 1)", // Line/border color
                backgroundColor: chartType === "bar" ? "rgba(56, 178, 172, 0.7)" : "transparent", // Bar color or transparent for line
                borderWidth: 2,
                pointRadius: chartType === "line" ? 2 : 0, // Show points only for line chart
                fill: chartType === "line", // Fill area under the line for line chart
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: "black",
                        maxRotation: 90, // Rotate labels to 90 degrees
                        minRotation: 45, // Minimum rotation angle
                        autoSkip: true, // Automatically skip labels to avoid overlap
                        maxTicksLimit: data.length > 50 ? 20 : undefined, // Limit number of labels for long datasets
                    },
                    grid: { color: "gray" },
                },
                y: {
                    ticks: {
                        color: "black",
                        beginAtZero: false,
                    },
                    grid: { color: "gray" },
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'black'
                    }
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
        }
    });
}

export function updateSevenDaysStats(sevenDaysData, type) {
    if (!sevenDaysData || sevenDaysData.length === 0) {
        document.getElementById("stats-data").innerHTML = `<li>No data available for ${type}.</li>`;
        return;
    }

    // Convert all values to numbers and filter out non numeric values
    const numericData = sevenDaysData.map(value => Number(value)).filter(num => !isNaN(num));

    if (numericData.length === 0) {
        document.getElementById("stats-data").innerHTML = `<li>Invalid data received for ${type}.</li>`;
        return;
    }

    const mean = numericData.reduce((sum, val) => sum + val, 0) / numericData.length;
    const sortedData = [...numericData].sort((a, b) => a - b);
    const median = sortedData.length % 2 === 0
        ? (sortedData[sortedData.length / 2 - 1] + sortedData[sortedData.length / 2]) / 2
        : sortedData[Math.floor(sortedData.length / 2)];
    const mode = findMode(numericData);
    const range = Math.max(...numericData) - Math.min(...numericData);
    const stdDev = Math.sqrt(numericData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericData.length);
    const min = Math.min(...numericData);
    const max = Math.max(...numericData);
    const variance = stdDev ** 2;

    document.getElementById("stats-data").innerHTML = `
        <li><strong>Mean:</strong> ${mean.toFixed(2)}</li>
        <li><strong>Median:</strong> ${median.toFixed(2)}</li>
        <li><strong>Mode:</strong> ${mode.length ? mode.join(", ") : "No mode"}</li>
        <li><strong>Range:</strong> ${range.toFixed(2)}</li>
        <li><strong>Standard Deviation:</strong> ${stdDev.toFixed(2)}</li>
        <li><strong>Min:</strong> ${min.toFixed(2)}</li>
        <li><strong>Max:</strong> ${max.toFixed(2)}</li>
        <li><strong>Variance:</strong> ${variance.toFixed(2)}</li>
    `;
}

// Helper function to calculate mode
function findMode(arr) {
    const frequency = {};
    arr.forEach(num => frequency[num] = (frequency[num] || 0) + 1);
    const maxFreq = Math.max(...Object.values(frequency));
    return Object.keys(frequency).filter(num => frequency[num] === maxFreq).map(Number);
}


