document.addEventListener('DOMContentLoaded', function() {
    // Sample data - in a real app, this would come from an API
    const analyticsData = {
        traffic: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Page Views',
                data: [12500, 19000, 17000, 21000, 23000, 25500, 31000],
                borderColor: 'rgba(100, 255, 218, 0.8)',
                backgroundColor: 'rgba(100, 255, 218, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        locations: {
            labels: ['India', 'United States', 'Japan', 'Germany', 'France', 'Others'],
            datasets: [{
                data: [65, 12, 8, 5, 4, 6],
                backgroundColor: [
                    'rgba(100, 255, 218, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ]
            }]
        },
        devices: {
            labels: ['Mobile', 'Desktop', 'Tablet'],
            datasets: [{
                data: [58, 38, 4],
                backgroundColor: [
                    'rgba(100, 255, 218, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ]
            }]
        },
        dailyVisitors: {
            labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
            datasets: [{
                label: 'Visitors',
                data: Array.from({length: 30}, () => Math.floor(Math.random() * 1000) + 500),
                borderColor: 'rgba(100, 255, 218, 0.8)',
                backgroundColor: 'rgba(100, 255, 218, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        topPages: [
            { page: 'Chandrayaan-3 Mission', views: 5892, visitors: 4210, duration: '4:15' },
            { page: 'Gaganyaan Updates', views: 4215, visitors: 3120, duration: '3:42' },
            { page: 'ISRO Homepage', views: 3890, visitors: 2890, duration: '2:10' },
            { page: 'Aditya-L1 Solar Mission', views: 3210, visitors: 2450, duration: '3:55' },
            { page: 'Career Opportunities', views: 2890, visitors: 2100, duration: '5:20' }
        ],
        referrals: [
            { source: 'Direct Traffic', visitors: 4520, percent: 42 },
            { source: 'Google Search', visitors: 3210, percent: 30 },
            { source: 'Social Media', visitors: 1580, percent: 15 },
            { source: 'News Sites', visitors: 850, percent: 8 },
            { source: 'Others', visitors: 420, percent: 5 }
        ]
    };

    // Initialize charts
    const trafficCtx = document.getElementById('trafficChart').getContext('2d');
    const trafficChart = new Chart(trafficCtx, {
        type: 'line',
        data: analyticsData.traffic,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#ccd6f6'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#8892b0'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#8892b0'
                    }
                }
            }
        }
    });

    const locationCtx = document.getElementById('locationChart').getContext('2d');
    const locationChart = new Chart(locationCtx, {
        type: 'doughnut',
        data: analyticsData.locations,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#ccd6f6'
                    }
                }
            }
        }
    });

    const deviceCtx = document.getElementById('deviceChart').getContext('2d');
    const deviceChart = new Chart(deviceCtx, {
        type: 'pie',
        data: analyticsData.devices,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#ccd6f6'
                    }
                }
            }
        }
    });

    const dailyVisitorsCtx = document.getElementById('dailyVisitorsChart').getContext('2d');
    const dailyVisitorsChart = new Chart(dailyVisitorsCtx, {
        type: 'bar',
        data: analyticsData.dailyVisitors,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#8892b0'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#8892b0'
                    }
                }
            }
        }
    });

    // Populate tables
    const topPagesTable = document.getElementById('topPagesTable');
    analyticsData.topPages.forEach(page => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${page.page}</td>
            <td>${page.views.toLocaleString()}</td>
            <td>${page.visitors.toLocaleString()}</td>
            <td>${page.duration}</td>
        `;
        topPagesTable.appendChild(row);
    });

    const referralTable = document.getElementById('referralTable');
    analyticsData.referrals.forEach(source => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${source.source}</td>
            <td>${source.visitors.toLocaleString()}</td>
            <td>${source.percent}%</td>
        `;
        referralTable.appendChild(row);
    });

    // Time range selector
    const timeRange = document.getElementById('timeRange');
    const customRange = document.getElementById('customRange');
    
    timeRange.addEventListener('change', function() {
        if (this.value === 'custom') {
            customRange.style.display = 'flex';
        } else {
            customRange.style.display = 'none';
            // In a real app, you would fetch data for the selected range
            console.log('Selected range:', this.value);
        }
    });

    // Apply custom date range
    document.getElementById('applyDateRange').addEventListener('click', function() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (startDate && endDate) {
            // In a real app, you would fetch data for the custom range
            console.log('Custom range selected:', startDate, 'to', endDate);
        } else {
            alert('Please select both start and end dates');
        }
    });

    // Set default dates for custom range
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    document.getElementById('endDate').valueAsDate = today;
    document.getElementById('startDate').valueAsDate = oneMonthAgo;
});