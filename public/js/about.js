document.addEventListener('DOMContentLoaded', function() {
    // Animate stats counting
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const suffix = stat.textContent.includes('M') ? 'M' : '';
            const duration = 2000; // Animation duration in ms
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const increment = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(increment);
                } else {
                    stat.textContent = target + suffix;
                }
            };
            
            increment();
        });
    };
    
    // Only animate when stats are in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelector('.stats-section').style.opacity = '1';
    observer.observe(document.querySelector('.stats-section'));
    
    // Add animation to cards when they come into view
    const cards = document.querySelectorAll('.about-card, .team-member');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
});