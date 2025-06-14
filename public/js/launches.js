document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Sample launch data (in a real app, this would come from an API)
    const launches = [
        {
            id: 1,
            title: "Chandrayaan-3",
            vehicle: "gslv-mk3",
            status: "success",
            date: "2023-07-14",
            description: "India's lunar landing mission with rover",
            image: "/images/chandrayaan3.jpg",
            payload: "Lander and Rover",
            site: "Satish Dhawan Space Centre",
            details: "Details",
            googleLink: "https://en.wikipedia.org/wiki/Chandrayaan-3"
        },
        {
            id: 2,
            title: "Aditya-L1",
            vehicle: "pslv",
            status: "success",
            date: "2023-09-02",
            description: "India's first solar observatory mission",
            image: "/images/adityal1.jpg",
            payload: "Solar Observatory",
            site: "Satish Dhawan Space Centre",
            details: "Details",
            googleLink: "https://en.wikipedia.org/wiki/Aditya-L1"
        },
        {
            id: 3,
            title: "OneWeb India-2",
            vehicle: "gslv-mk3",
            status: "success",
            date: "2023-03-26",
            description: "Commercial launch for OneWeb constellation",
            image: "/images/oneweb.jpg",
            payload: "36 Communication Satellites",
            site: "Satish Dhawan Space Centre",
            details: "Details",
            googleLink: "https://www.isro.gov.in/LVM3M3MissionLandingPage.html"
        },
        {
            id: 4,
            title: "SSLV-D2",
            vehicle: "sslv",
            status: "success",
            date: "2023-02-10",
            description: "Second developmental flight of SSLV",
            image: "/images/sslv.jpg",
            payload: "EOS-07 and 2 small satellites",
            site: "Satish Dhawan Space Centre",
            details: "Details",
            googleLink: "https://en.wikipedia.org/wiki/SSLV-D2"
        },
        {
            id: 5,
            title: "Gaganyaan TV-D1",
            vehicle: "gslv-mk3",
            status: "upcoming",
            date: "2023-10-21",
            description: "First test flight for human spaceflight program",
            image: "/images/gaganyaan.jpg",
            payload: "Crew Module",
            site: "Satish Dhawan Space Centre",
            details: "Details",
            googleLink: "https://en.wikipedia.org/wiki/Gaganyaan"
        }
    ];

    // Vehicle history data
    const vehicleHistory = {
        pslv: {
            name: "Polar Satellite Launch Vehicle (PSLV)",
            description: "ISRO's workhorse launch vehicle with over 50 successful missions. Known for its reliability and versatility in launching satellites to various orbits.",
            firstLaunch: "1993-09-20",
            successRate: "94%",
            height: "44m",
            diameter: "2.8m",
            mass: "320,000kg",
            stages: 4,
            payloadLEO: "3,800kg",
            payloadSSO: "1,750kg"
        },
        gslv: {
            name: "Geosynchronous Satellite Launch Vehicle (GSLV)",
            description: "Designed to launch heavier satellites into geostationary orbits. Features an indigenous cryogenic upper stage.",
            firstLaunch: "2001-04-18",
            successRate: "67%",
            height: "49m",
            diameter: "2.8m",
            mass: "414,000kg",
            stages: 3,
            payloadGTO: "2,500kg"
        },
        "gslv-mk3": {
            name: "GSLV Mark III",
            description: "ISRO's most powerful rocket, capable of launching 4-ton class satellites to GTO. Will be used for Gaganyaan human spaceflight missions.",
            firstLaunch: "2014-12-18",
            successRate: "100%",
            height: "43.43m",
            diameter: "4m",
            mass: "640,000kg",
            stages: 2,
            payloadGTO: "4,000kg",
            payloadLEO: "8,000kg"
        },
        sslv: {
            name: "Small Satellite Launch Vehicle (SSLV)",
            description: "New compact launch vehicle designed for small satellites. Offers quick turnaround and lower costs for dedicated launches.",
            firstLaunch: "2022-08-07",
            successRate: "50%",
            height: "34m",
            diameter: "2m",
            mass: "120,000kg",
            stages: 3,
            payloadSSO: "500kg"
        }
    };

    // DOM elements
    const launchContainer = document.getElementById('launchContainer');
    const nextLaunchSection = document.getElementById('nextLaunch');
    const vehicleHistorySection = document.getElementById('vehicleHistory');
    const vehicleFilter = document.getElementById('launch-vehicle');
    const statusFilter = document.getElementById('launch-status');
    const yearFilter = document.getElementById('launch-year');
    const resetButton = document.getElementById('reset-filters');
    const totalLaunches = document.getElementById('totalLaunches');
    const successRate = document.getElementById('successRate');
    const satellitesLaunched = document.getElementById('satellitesLaunched');
    const yearsActive = document.getElementById('yearsActive');

    // Initialize countdown for next launch
    function initCountdown() {
        const nextLaunch = launches.find(launch => launch.status === 'upcoming');
        
        if (nextLaunch) {
            nextLaunchSection.innerHTML = `
                <h3 class="countdown-title">Next Launch: ${nextLaunch.title}</h3>
                <div class="countdown-timer">
                    <div class="countdown-item">
                        <div class="countdown-number" id="days">00</div>
                        <div class="countdown-label">Days</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number" id="hours">00</div>
                        <div class="countdown-label">Hours</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number" id="minutes">00</div>
                        <div class="countdown-label">Minutes</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number" id="seconds">00</div>
                        <div class="countdown-label">Seconds</div>
                    </div>
                </div>
                <p>Launch scheduled for: ${new Date(nextLaunch.date).toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                })}</p>
            `;
            
            updateCountdown(nextLaunch.date);
            setInterval(() => updateCountdown(nextLaunch.date), 1000);
        } else {
            nextLaunchSection.innerHTML = `
                <h3 class="countdown-title">No Upcoming Launches Scheduled</h3>
                <p>Check back later for updates on future ISRO launches</p>
            `;
        }
    }

    // Update countdown timer
    function updateCountdown(launchDate) {
        const now = new Date().getTime();
        const launchTime = new Date(launchDate).getTime();
        const distance = launchTime - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }
    }

    // Render launches
    function renderLaunches(filteredLaunches) {
        launchContainer.innerHTML = '';
        
        filteredLaunches.forEach(launch => {
            const launchCard = document.createElement('div');
            launchCard.className = 'launch-card';
            
            let badgeClass = '';
            let badgeText = '';
            
            if (launch.status === 'upcoming') {
                badgeClass = 'badge-upcoming';
                badgeText = 'Upcoming';
            } else if (launch.status === 'success') {
                badgeClass = 'badge-success';
                badgeText = 'Success';
            } else {
                badgeClass = 'badge-failure';
                badgeText = 'Failed';
            }
            
            launchCard.innerHTML = `
                <div class="launch-image">
                    <img src="${launch.image}" alt="${launch.title}">
                    <span class="launch-badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="launch-content">
                    <h3 class="launch-title">${launch.title}</h3>
                    <div class="launch-date">
                        <i class="far fa-calendar-alt"></i> ${new Date(launch.date).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                    </div>
                    <p class="launch-description">${launch.description}</p>
                    <div class="launch-meta">
                        <span>${launch.vehicle.toUpperCase()}</span>
                        <a href="${launch.googleLink}" class="read-more"> Deails <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            
            launchContainer.appendChild(launchCard);
        });
    }

    // Filter launches
    function filterLaunches() {
        const vehicleValue = vehicleFilter.value;
        const statusValue = statusFilter.value;
        const yearValue = yearFilter.value;
        
        const filtered = launches.filter(launch => {
            const launchYear = new Date(launch.date).getFullYear().toString();
            return (vehicleValue === 'all' || launch.vehicle === vehicleValue) &&
                   (statusValue === 'all' || launch.status === statusValue) &&
                   (yearValue === 'all' || launchYear === yearValue);
        });
        
        renderLaunches(filtered);
    }

    // Render vehicle history
    function renderVehicleHistory(vehicle) {
        const vehicleData = vehicleHistory[vehicle];
        
        vehicleHistorySection.innerHTML = `
            <div class="vehicle-info active">
                <h4>${vehicleData.name}</h4>
                <p>${vehicleData.description}</p>
                
                <div class="vehicle-specs">
                    <div class="spec-item">
                        <h5>First Launch</h5>
                        <p>${new Date(vehicleData.firstLaunch).getFullYear()}</p>
                    </div>
                    <div class="spec-item">
                        <h5>Success Rate</h5>
                        <p>${vehicleData.successRate}</p>
                    </div>
                    <div class="spec-item">
                        <h5>Height</h5>
                        <p>${vehicleData.height}</p>
                    </div>
                    <div class="spec-item">
                        <h5>Mass</h5>
                        <p>${vehicleData.mass}</p>
                    </div>
                    ${vehicleData.payloadLEO ? `
                    <div class="spec-item">
                        <h5>Payload to LEO</h5>
                        <p>${vehicleData.payloadLEO}</p>
                    </div>
                    ` : ''}
                    ${vehicleData.payloadGTO ? `
                    <div class="spec-item">
                        <h5>Payload to GTO</h5>
                        <p>${vehicleData.payloadGTO}</p>
                    </div>
                    ` : ''}
                    ${vehicleData.payloadSSO ? `
                    <div class="spec-item">
                        <h5>Payload to SSO</h5>
                        <p>${vehicleData.payloadSSO}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Update statistics
    function updateStatistics() {
        // In a real app, these would be calculated from actual data
        totalLaunches.textContent = '124';
        successRate.textContent = '85%';
        satellitesLaunched.textContent = '342';
        yearsActive.textContent = (new Date().getFullYear() - 1969).toString();
    }

    // Event listeners
    vehicleFilter.addEventListener('change', filterLaunches);
    statusFilter.addEventListener('change', filterLaunches);
    yearFilter.addEventListener('change', filterLaunches);
    
    resetButton.addEventListener('click', () => {
        vehicleFilter.value = 'all';
        statusFilter.value = 'all';
        yearFilter.value = 'all';
        filterLaunches();
    });

    // Tab switching for vehicle history
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderVehicleHistory(this.dataset.vehicle);
        });
    });

    // Initial render
    initCountdown();
    renderLaunches(launches);
    renderVehicleHistory('pslv');
    updateStatistics();
    
    // Add animation to launch cards
    const launchCards = document.querySelectorAll('.launch-card');
    launchCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
});