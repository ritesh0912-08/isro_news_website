document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display breaking news
    fetchBreakingNews();
    
    // Fetch and display all news
    fetchAllNews();
    
    // Set up auto-refresh every 30 seconds
    setInterval(fetchBreakingNews, 20000);
    setInterval(fetchAllNews, 20000);
});

function fetchBreakingNews() {
    fetch('/api/news/breaking')
        .then(response => response.json())
        .then(data => {
            const breakingContainer = document.getElementById('breakingNews');
            breakingContainer.innerHTML = '';
            
            data.forEach(news => {
                const breakingCard = document.createElement('div');
                breakingCard.className = 'breaking-card';
                breakingCard.innerHTML = `
                    <h3>${news.title}</h3>
                    <p>${news.content.substring(0, 150)}...</p>
                    <a href="/news/${news._id}">Read More <i class="fas fa-arrow-right"></i></a>
                `;
                breakingContainer.appendChild(breakingCard);
            });
            
            // Add glow effect to breaking news container
            if (data.length > 0) {
                breakingContainer.style.animation = 'glow-pulse 2s infinite alternate';
            }
        })
        .catch(error => console.error('Error fetching breaking news:', error));
}

function fetchAllNews() {
    fetch('/api/news')
        .then(response => response.json())
        .then(data => {
            const newsGrid = document.getElementById('newsGrid');
            newsGrid.innerHTML = '';
            
            data.forEach(news => {
                const newsCard = document.createElement('div');
                newsCard.className = 'news-card';
                newsCard.innerHTML = `
                    <div class="news-image">
                        <img src="${news.imageUrl || '/images/isro-default.jpg'}" alt="${news.title}">
                    </div>
                    <div class="news-content">
                        <span class="news-category">${news.category}</span>
                        <h3 class="news-title">${news.title}</h3>
                        <p class="news-excerpt">${news.content.substring(0, 100)}...</p>
                        <div class="news-meta">
                            <span>${new Date(news.createdAt).toLocaleDateString()}</span>
                            <a href="/news/${news._id}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                `;
                newsGrid.appendChild(newsCard);
            });
        })
        .catch(error => console.error('Error fetching all news:', error));
}

// Add glow pulse animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes glow-pulse {
        0% {
            box-shadow: 0 0 5px var(--glow-color);
        }
        100% {
            box-shadow: 0 0 20px var(--glow-intense);
        }
    }
`;
document.head.appendChild(style);