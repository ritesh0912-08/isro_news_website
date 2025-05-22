document.addEventListener('DOMContentLoaded', function() {
    // Load current settings
    loadSettings();
    
    // Form submissions
    document.getElementById('websiteSettings').addEventListener('submit', saveWebsiteSettings);
    document.getElementById('securitySettings').addEventListener('submit', saveSecuritySettings);
    
    // Danger zone buttons
    document.getElementById('clearCacheBtn').addEventListener('click', clearCache);
    document.getElementById('resetSettingsBtn').addEventListener('click', resetSettings);
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
});

function loadSettings() {
    fetch('/admin/api/settings')
        .then(response => response.json())
        .then(settings => {
            // Populate website settings
            document.getElementById('siteTitle').value = settings.siteTitle || '';
            document.getElementById('siteDescription').value = settings.siteDescription || '';
            document.getElementById('siteLogo').value = settings.siteLogo || '';
            
            // Populate security settings
            document.getElementById('requireHTTPS').checked = settings.requireHTTPS || false;
            document.getElementById('twoFactorAuth').checked = settings.twoFactorAuth || false;
            document.getElementById('sessionTimeout').value = settings.sessionTimeout || 480;
        })
        .catch(error => {
            console.error('Error loading settings:', error);
            alert('Failed to load settings');
        });
}

function saveWebsiteSettings(e) {
    e.preventDefault();
    
    const settings = {
        siteTitle: document.getElementById('siteTitle').value,
        siteDescription: document.getElementById('siteDescription').value,
        siteLogo: document.getElementById('siteLogo').value
    };
    
    saveSettings('website', settings);
}

function saveSecuritySettings(e) {
    e.preventDefault();
    
    const settings = {
        requireHTTPS: document.getElementById('requireHTTPS').checked,
        twoFactorAuth: document.getElementById('twoFactorAuth').checked,
        sessionTimeout: document.getElementById('sessionTimeout').value
    };
    
    saveSettings('security', settings);
}

function saveSettings(type, settings) {
    fetch(`/admin/api/settings/${type}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Settings saved successfully!');
        } else {
            throw new Error(data.message || 'Failed to save settings');
        }
    })
    .catch(error => {
        console.error('Error saving settings:', error);
        showNotification(error.message, 'error');
    });
}

function clearCache() {
    if (!confirm('Are you sure you want to clear all cache?')) return;
    
    fetch('/admin/api/clear-cache', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Cache cleared successfully!');
        } else {
            throw new Error(data.message || 'Failed to clear cache');
        }
    })
    .catch(error => {
        console.error('Error clearing cache:', error);
        showNotification(error.message, 'error');
    });
}

function resetSettings() {
    if (!confirm('Are you sure you want to reset all settings to defaults?')) return;
    
    fetch('/admin/api/reset-settings', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Settings reset to defaults!');
            loadSettings(); // Refresh the form
        } else {
            throw new Error(data.message || 'Failed to reset settings');
        }
    })
    .catch(error => {
        console.error('Error resetting settings:', error);
        showNotification(error.message, 'error');
    });
}

function exportData() {
    fetch('/admin/api/export-data', {
        credentials: 'include'
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'isro-news-backup.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        showNotification('Data exported successfully!');
    })
    .catch(error => {
        console.error('Error exporting data:', error);
        showNotification('Failed to export data', 'error');
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}