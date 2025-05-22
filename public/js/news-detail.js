document.addEventListener('DOMContentLoaded', function() {
    // Get news ID from URL
    const pathParts = window.location.pathname.split('/');
    const newsId = pathParts[pathParts.length - 1];
    
    // Fetch and display news details
    fetchNewsDetails(newsId);
});

function fetchNewsDetails(id) {
    fetch(`/api/news/${id}`)
        .then(response => response.json())
        .then(news => {
            const newsDetail = document.getElementById('newsDetail');
            
            // Format date
            const date = new Date(news.createdAt);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Create HTML content
            newsDetail.innerHTML = `
                <span class="detail-category">${news.category}</span>
                <h1 class="detail-title">${news.title}</h1>
                <div class="detail-meta">
                    <span><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                    ${news.isBreaking ? '<span class="breaking-badge"><i class="fas fa-bolt"></i> Breaking News</span>' : ''}
                </div>
                ${news.imageUrl ? `<img src="${news.imageUrl}" alt="${news.title}" class="detail-image">` : ''}
                <div class="detail-content">
                    ${news.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                </div>
            `;
            
            // Add glow effect to breaking news
            if (news.isBreaking) {
                const breakingBadge = newsDetail.querySelector('.breaking-badge');
                breakingBadge.style.animation = 'glow-pulse 1s infinite alternate';
            }
        })
        .catch(error => {
            console.error('Error fetching news details:', error);
            document.getElementById('newsDetail').innerHTML = `
                <h2>Error loading news</h2>
                <p>Could not load the requested news item. Please try again later.</p>
            `;
        });
}