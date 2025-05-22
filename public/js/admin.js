document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const addNewsBtn = document.getElementById('addNewsBtn');
    const newsFormContainer = document.getElementById('newsFormContainer');
    const newsForm = document.getElementById('newsForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const newsList = document.getElementById('newsList');
    
    // Event listeners
    addNewsBtn.addEventListener('click', showNewsForm);
    cancelBtn.addEventListener('click', hideNewsForm);
    newsForm.addEventListener('submit', handleFormSubmit);
    
    // Load all news items
    loadNewsItems();
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
        .then(data => {
            const newsList = document.getElementById('newsList');
            newsList.innerHTML = '';
            
            data.forEach(news => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                newsItem.innerHTML = `
                    <div class="news-item-info">
                        <h3>${news.title}</h3>
                        <div class="news-item-meta">
                            <span><i class="fas fa-tag"></i> ${news.category}</span>
                            <span><i class="fas fa-calendar-alt"></i> ${new Date(news.createdAt).toLocaleDateString()}</span>
                            ${news.isBreaking ? '<span><i class="fas fa-bolt"></i> Breaking</span>' : ''}
                        </div>
                    </div>
                    <div class="news-item-actions">
                        <button class="edit" onclick="editNewsItem('${news._id}')"><i class="fas fa-edit"></i></button>
                        <button class="delete" onclick="deleteNewsItem('${news._id}')"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                newsList.appendChild(newsItem);
            });
        })
        .catch(error => console.error('Error loading news items:', error));
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
        .then(response => response.json())
        .then(news => {
            document.getElementById('newsId').value = news._id;
            document.getElementById('title').value = news.title;
            document.getElementById('content').value = news.content;
            document.getElementById('imageUrl').value = news.imageUrl;
            document.getElementById('category').value = news.category;
            document.getElementById('isBreaking').checked = news.isBreaking;
            
            showNewsForm();
        })
        .catch(error => console.error('Error fetching news item:', error));
};

window.deleteNewsItem = function(id) {
    if (confirm('Are you sure you want to delete this news item?')) {
        fetch(`/admin/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                loadNewsItems();
            }
        })
        .catch(error => console.error('Error:', error));
    }
};