document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        console.log('Submitting contact form:', formData);
        
        // Simple validation
        if (!formData.name || !formData.email || !formData.message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        try {
            // Disable submit button and show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            console.log('Sending request to server...');
            // Send data to server
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('Server response:', response);
            const result = await response.json();
            console.log('Response data:', result);

            if (!response.ok) {
                throw new Error(result.error || 'Failed to send message');
            }
            
            // Show success message
            showNotification(result.message || 'Your message has been sent successfully!');
            
            // Reset form
            contactForm.reset();
        } catch (error) {
            console.error('Error:', error);
            showNotification(error.message || 'Failed to send message. Please try again later.', 'error');
        } finally {
            // Re-enable submit button
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    });
    
    function showNotification(message, type = 'success') {
        console.log('Showing notification:', { message, type });
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        // Add styles if not already in CSS
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '8px 15px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '1000';
        notification.style.animation = 'slideIn 0.5s ease-out';
        notification.style.fontSize = '13px';
        notification.style.maxWidth = '200px';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '8px';
        
        if (type === 'success') {
            notification.style.backgroundColor = 'rgba(40, 167, 69, 0.9)';
            notification.style.color = 'white';
            notification.style.borderLeft = '3px solid #28a745';
        } else {
            notification.style.backgroundColor = 'rgba(220, 53, 69, 0.9)';
            notification.style.color = 'white';
            notification.style.borderLeft = '3px solid #dc3545';
        }
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-in';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
});