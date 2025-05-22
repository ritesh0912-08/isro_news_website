document.addEventListener('DOMContentLoaded', function() {
    // Set current date in the "Last Updated" section
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = currentDate;
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Add animation to policy sections
    const policySections = document.querySelectorAll('.policy-section');
    
    policySections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = `all 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100);
    });
});