let weatherChart = null;

export function updateUI(data, unit) {
    const weatherDataElement = document.getElementById('weather-data');
    weatherDataElement.innerHTML = ''; // Clear previous data

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
        weatherChart.destroy(); // Destroy previous chart to avoid duplicates
    }

    // Create a new bar chart
    weatherChart = new Chart(ctx, {
        type: "bar", // Bar chart type
        data: {
            labels: labels, // X-axis labels (date and time)
            datasets: [{
                label: label,
                data: values, // Y-axis values (weather data)
                borderColor: "white", // Bar border color
                backgroundColor: "rgba(56, 178, 172, 0.7)", // Bar color with some transparency
                borderWidth: 1,
                barPercentage: 1.5, // Controls the width of bars
                categoryPercentage: 0.5, // Controls the space between bars
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: { color: "black" },
                    grid: { color: "gray" } // Light grid lines for X-axis
                },
                y: {
                    ticks: { 
                        color: "black",
                        // Automatic range based on the data
                        beginAtZero: false, // Don't force it to start from 0
                    },
                    grid: { color: "gray" } // Light grid lines for Y-axis
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'black' // Set legend text color to white
                    }
                }
            }
        }
    });
}

