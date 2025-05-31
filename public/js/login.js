document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        console.log('Attempting login...');
        
        fetch('/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        })
        .then(response => {
            console.log('Login response:', response.status);
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            console.log('Login successful, redirecting...');
            window.location.href = '/admin';
        })
        .catch(error => {
            console.error('Login error:', error);
            document.getElementById('loginError').textContent = 
                error.message || 'Login failed. Please try again.';
        });
    });
});