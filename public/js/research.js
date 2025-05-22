document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Facility data
    const facilities = {
        vssc: {
            name: "Vikram Sarabhai Space Centre (VSSC)",
            description: "The lead center for launch vehicle development located in Thiruvananthapuram. VSSC conducts research in aerodynamics, materials, propulsion, and other key areas of rocketry.",
            established: "1963",
            director: "Dr. S. Unnikrishnan Nair",
            focus: "Launch Vehicle Technology",
            stats: [
                { title: "Employees", value: "4,500+" },
                { title: "Area", value: "100 acres" },
                { title: "Key Projects", value: "PSLV, GSLV, Gaganyaan" }
            ]
        },
        sac: {
            name: "Space Applications Centre (SAC)",
            description: "Located in Ahmedabad, SAC focuses on developing payloads for communication, navigation, and earth observation satellites. It also conducts research in space sciences.",
            established: "1972",
            director: "Dr. Nilesh M. Desai",
            focus: "Satellite Payloads & Applications",
            stats: [
                { title: "Employees", value: "3,200+" },
                { title: "Key Instruments", value: "100+" },
                { title: "Patents", value: "150+" }
            ]
        },
        iist: {
            name: "Indian Institute of Space Science and Technology (IIST)",
            description: "Asia's first space university located in Thiruvananthapuram, offering undergraduate and postgraduate programs in space science and technology.",
            established: "2007",
            director: "Dr. V.K. Dadhwal",
            focus: "Space Education & Research",
            stats: [
                { title: "Students", value: "1,200+" },
                { title: "Faculty", value: "150+" },
                { title: "Research Papers", value: "500+" }
            ]
        },
        nrsc: {
            name: "National Remote Sensing Centre (NRSC)",
            description: "Located in Hyderabad, NRSC is the focal point for earth observation programs and applications of satellite data for natural resources management.",
            established: "1974",
            director: "Dr. Prakash Chauhan",
            focus: "Remote Sensing & GIS",
            stats: [
                { title: "Data Products", value: "200+" },
                { title: "User Agencies", value: "500+" },
                { title: "Satellites Supported", value: "20+" }
            ]
        },
        lpsc: {
            name: "Liquid Propulsion Systems Centre (LPSC)",
            description: "With campuses in Bengaluru and Thiruvananthapuram, LPSC develops liquid and cryogenic propulsion systems for launch vehicles and spacecraft.",
            established: "1985",
            director: "Dr. V. Narayanan",
            focus: "Propulsion Systems",
            stats: [
                { title: "Thrust Developed", value: "Up to 200 tons" },
                { title: "Key Systems", value: "Vikas Engine, CE-20" },
                { title: "Test Facilities", value: "15+" }
            ]
        }
    };

    // Render facility info
    function renderFacility(facilityId) {
        const facility = facilities[facilityId];
        const facilityInfo = document.getElementById('facilityInfo');
        
        let statsHTML = '';
        facility.stats.forEach(stat => {
            statsHTML += `
                <div class="stat-item">
                    <h5>${stat.title}</h5>
                    <p>${stat.value}</p>
                </div>
            `;
        });
        
        facilityInfo.innerHTML = `
            <div class="facility-content active">
                <h4>${facility.name}</h4>
                <p>${facility.description}</p>
                
                <div class="facility-meta">
                    <p><strong>Established:</strong> ${facility.established}</p>
                    <p><strong>Current Director:</strong> ${facility.director}</p>
                    <p><strong>Primary Focus:</strong> ${facility.focus}</p>
                </div>
                
                <div class="facility-stats">
                    ${statsHTML}
                </div>
            </div>
        `;
    }

    // Tab switching for facilities
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderFacility(this.dataset.facility);
        });
    });

    // Add animation to cards
    const areaCards = document.querySelectorAll('.area-card');
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    const optionCards = document.querySelectorAll('.option-card');
    
    function animateCards(cards) {
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `all 0.5s ease ${index * 0.1}s`;
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        });
    }

    // Initial render
    renderFacility('vssc');
    animateCards(areaCards);
    animateCards(spotlightCards);
    animateCards(optionCards);
});