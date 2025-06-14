document.addEventListener('DOMContentLoaded', function() {
    // DOM elements and event listeners
    const addNewsBtn = document.getElementById('addNewsBtn');
    const scrapeNewsBtn = document.getElementById('scrapeNewsBtn');
    const newsFormContainer = document.getElementById('newsFormContainer');
    const newsForm = document.getElementById('newsForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Add event listeners only if elements exist
    if (addNewsBtn) {
        addNewsBtn.addEventListener('click', showNewsForm);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideNewsForm);
    }
    
    if (newsForm) {
        newsForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (scrapeNewsBtn) {
        scrapeNewsBtn.addEventListener('click', handleScrapeNews);
    }
    
    // Load news items if we're on a page that needs them
    if (document.getElementById('newsList')) {
        loadNewsItems();
    }
});

function showNewsForm() {
    const newsFormContainer = document.getElementById('newsFormContainer');
    const newsForm = document.getElementById('newsForm');
    
    // Reset form
    newsForm.reset();
    document.getElementById('newsId').value = '';
    
    // Show form
    newsFormContainer.style.display = 'block';
    window.scrollTo({
        top: newsFormContainer.offsetTop - 20,
        behavior: 'smooth'
    });
}

function hideNewsForm() {
    document.getElementById('newsFormContainer').style.display = 'none';
}

function loadNewsItems() {
    fetch('/api/news')
      .then(response => response.json())
      .then(newsItems => {
        const newsList = document.getElementById('newsList');
        newsList.innerHTML = '';
        
        if (newsItems.length === 0) {
            newsList.innerHTML = '<div class="no-news">No news items available</div>';
            return;
        }
        
        newsItems.forEach(news => {
          const newsItem = document.createElement('div');
          newsItem.className = 'news-item';
          newsItem.setAttribute('data-id', news._id);
          newsItem.innerHTML = `
            <div class="news-item-info">
              <h3>${news.title}</h3>
              <p class="news-content">${news.content.substring(0, 150)}${news.content.length > 150 ? '...' : ''}</p>
              <div class="news-item-meta">
                <span><i class="fas fa-tag"></i> ${news.category}</span>
                <span><i class="fas fa-calendar-alt"></i> ${new Date(news.createdAt).toLocaleDateString()}</span>
                <span><i class="fas fa-newspaper"></i> ${news.source}</span>
                ${news.isBreaking ? '<span class="breaking"><i class="fas fa-bolt"></i> Breaking</span>' : ''}
              </div>
            </div>
            <div class="news-item-actions">
              <button class="edit" data-id="${news._id}" title="Edit"><i class="fas fa-edit"></i></button>
              <button class="delete" data-id="${news._id}" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          `;
          newsList.appendChild(newsItem);
        });

        // Add event listeners after creating all items
        document.querySelectorAll('.delete').forEach(btn => {
          btn.addEventListener('click', function() {
            deleteNewsItem(this.getAttribute('data-id'));
          });
        });

        document.querySelectorAll('.edit').forEach(btn => {
          btn.addEventListener('click', function() {
            editNewsItem(this.getAttribute('data-id'));
          });
        });
      })
      .catch(error => {
        console.error('Error loading news items:', error);
        showNotification('Failed to load news items', 'error');
      });
}


  
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        imageUrl: document.getElementById('imageUrl').value,
        category: document.getElementById('category').value,
        isBreaking: document.getElementById('isBreaking').checked
    };
    
    const newsId = document.getElementById('newsId').value;
    const url = newsId ? `/admin/${newsId}` : '/admin/add';
    const method = newsId ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            hideNewsForm();
            loadNewsItems();
        }
    })
    .catch(error => console.error('Error:', error));
}

// Global functions for inline event handlers
window.editNewsItem = function(id) {
    fetch(`/api/news/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch news item');
            }
            return response.json();
        })
        .then(news => {
            // Populate form with news data
            document.getElementById('newsId').value = news._id;
            document.getElementById('title').value = news.title;
            document.getElementById('content').value = news.content;
            document.getElementById('imageUrl').value = news.imageUrl || '';
            document.getElementById('category').value = news.category;
            document.getElementById('isBreaking').checked = news.isBreaking || false;
            
            // Show the form
            showNewsForm();
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Failed to load news item for editing', 'error');
        });
};

async function deleteNewsItem(id) {
    if (!id) {
        showNotification('No news item selected', 'error');
        return;
    }

    if (!confirm('Are you sure you want to delete this news item?')) {
        return;
    }

    try {
        console.log('Initiating delete for news ID:', id);
        const response = await fetch(`/admin/news/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        });

        // Handle response
        if (!response.ok) {
            // Try to get JSON error first
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Delete operation failed');
            } catch (e) {
                // Fallback to text error
                const errorText = await response.text();
                throw new Error(errorText.includes('Cannot DELETE') 
                    ? 'Delete endpoint not configured properly' 
                    : 'Failed to complete deletion');
            }
        }

        const result = await response.json();
        showNotification(result.message || 'News deleted successfully');
        loadNewsItems();

    } catch (error) {
        console.error('Delete failed:', error);
        showNotification(
            error.message.includes('endpoint not configured')
                ? 'Server configuration error - contact admin'
                : 'Failed to delete news item',
            'error'
        );
    }
}

// Make it available globally
window.deleteNewsItem = deleteNewsItem;


// Only one showNotification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}


// Helper function to show notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 8px 15px;
                border-radius: 4px;
                color: white;
                display: flex;
                align-items: center;
                gap: 8px;
                z-index: 1000;
                animation: slideIn 0.5s ease-out;
                font-size: 13px;
                max-width: 200px;
            }
            .notification.success {
                background-color: #4CAF50;
            }
            .notification.error {
                background-color: #f44336;
            }
            .notification i {
                font-size: 14px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Function to handle manual news scraping
async function handleScrapeNews() {
    try {
        const button = document.getElementById('scrapeNewsBtn');
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching ISRO News...';
        
        const response = await fetch('/admin/scrape-news', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Successfully fetched latest ISRO news');
            loadNewsItems(); // Refresh the news list
        } else {
            throw new Error(result.message || 'Failed to fetch ISRO news');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        showNotification('Failed to fetch ISRO news: ' + error.message, 'error');
    } finally {
        const button = document.getElementById('scrapeNewsBtn');
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-sync"></i> Fetch ISRO News';
    }
}