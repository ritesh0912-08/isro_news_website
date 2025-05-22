document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Sample mission data (in a real app, this would come from an API)
    const missions = [
        {
            id: 1,
            title: "Chandrayaan-3",
            description: "India's lunar exploration mission with lander and rover",
            type: "planetary",
            status: "completed",
            year: "2023",
            date: "July 14, 2023",
            image: "/images/chandrayaan3.jpg"
        },
        {
            id: 2,
            title: "Aditya-L1",
            description: "India's first solar mission to study the Sun's corona",
            type: "satellite",
            status: "ongoing",
            year: "2023",
            date: "September 2, 2023",
            image: "/images/adityal1.jpg"
        },
        {
            id: 3,
            title: "Gaganyaan G1",
            description: "First uncrewed test flight for human spaceflight program",
            type: "technology",
            status: "upcoming",
            year: "2024",
            date: "Q1 2024",
            image: "/images/gaganyaan.jpg"
        },
        {
            id: 4,
            title: "NISAR",
            description: "NASA-ISRO Synthetic Aperture Radar earth observation satellite",
            type: "satellite",
            status: "upcoming",
            year: "2024",
            date: "Early 2024",
            image: "/images/nisar.jpg"
        },
        {
            id: 5,
            title: "SSLV-D2",
            description: "Second developmental flight of Small Satellite Launch Vehicle",
            type: "launch-vehicle",
            status: "completed",
            year: "2023",
            date: "February 10, 2023",
            image: "/images/sslv.jpg"
        }
    ];

    // DOM elements
    const missionContainer = document.getElementById('missionContainer');
    const typeFilter = document.getElementById('mission-type');
    const statusFilter = document.getElementById('mission-status');
    const yearFilter = document.getElementById('mission-year');
    const resetButton = document.getElementById('reset-filters');

    // Render missions
    function renderMissions(filteredMissions) {
        missionContainer.innerHTML = '';
        
        filteredMissions.forEach(mission => {
            const missionCard = document.createElement('div');
            missionCard.className = 'mission-card';
            
            let statusClass = '';
            if (mission.status === 'upcoming') statusClass = 'status-upcoming';
            else if (mission.status === 'ongoing') statusClass = 'status-ongoing';
            else statusClass = 'status-completed';
            
            missionCard.innerHTML = `
                <div class="mission-image">
                    <img src="${mission.image}" alt="${mission.title}">
                </div>
                <div class="mission-content">
                    <span class="mission-status ${statusClass}">${mission.status}</span>
                    <h3 class="mission-title">${mission.title}</h3>
                    <div class="mission-date">
                        <i class="far fa-calendar-alt"></i> ${mission.date}
                    </div>
                    <p class="mission-description">${mission.description}</p>
                    <div class="mission-meta">
                        <span>${mission.type}</span>
                        <a href="/mission-detail.html?id=${mission.id}" class="read-more">Details <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            
            missionContainer.appendChild(missionCard);
        });
    }

    // Filter missions
    function filterMissions() {
        const typeValue = typeFilter.value;
        const statusValue = statusFilter.value;
        const yearValue = yearFilter.value;
        
        const filtered = missions.filter(mission => {
            return (typeValue === 'all' || mission.type === typeValue) &&
                   (statusValue === 'all' || mission.status === statusValue) &&
                   (yearValue === 'all' || mission.year === yearValue);
        });
        
        renderMissions(filtered);
    }

    // Event listeners
    typeFilter.addEventListener('change', filterMissions);
    statusFilter.addEventListener('change', filterMissions);
    yearFilter.addEventListener('change', filterMissions);
    
    resetButton.addEventListener('click', () => {
        typeFilter.value = 'all';
        statusFilter.value = 'all';
        yearFilter.value = 'all';
        filterMissions();
    });

    // Initial render
    renderMissions(missions);
    
    // Add animation to mission cards
    const missionCards = document.querySelectorAll('.mission-card');
    missionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
});