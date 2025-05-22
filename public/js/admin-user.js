document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const addUserBtn = document.getElementById('addUserBtn');
    const userFormContainer = document.getElementById('userFormContainer');
    const userForm = document.getElementById('userForm');
    const cancelUserBtn = document.getElementById('cancelUserBtn');
    const userList = document.getElementById('userList');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const startItem = document.getElementById('startItem');
    const endItem = document.getElementById('endItem');
    const totalItems = document.getElementById('totalItems');
    const userSearch = document.getElementById('userSearch');

    // Sample user data (in a real app, this would come from an API)
    let users = [
        {
            id: 1,
            username: 'Ritesh',
            email: 'riteshS@isronews.gov.in',
            firstName: 'Ritesh',
            lastName: 'shinde',
            role: 'admin',
            status: 'active',
            lastActive: '2023-06-15T10:30:00',
            avatar: 'A'
        },
        {
            id: 2,
            username: 'editor1',
            email: 'editor1@isronews.gov.in',
            firstName: 'Rahul',
            lastName: 'Sharma',
            role: 'editor',
            status: 'active',
            lastActive: '2023-06-14T15:45:00',
            avatar: 'R'
        },
        {
            id: 3,
            username: 'viewer1',
            email: 'viewer1@isronews.gov.in',
            firstName: 'Priya',
            lastName: 'Patel',
            role: 'viewer',
            status: 'active',
            lastActive: '2023-06-10T09:15:00',
            avatar: 'P'
        },
        {
            id: 4,
            username: 'editor2',
            email: 'editor2@isronews.gov.in',
            firstName: 'Amit',
            lastName: 'Singh',
            role: 'editor',
            status: 'inactive',
            lastActive: '2023-05-28T14:20:00',
            avatar: 'A'
        },
        
    ];

    // Pagination variables
    let currentPage = 1;
    const usersPerPage = 10;
    let filteredUsers = [...users];

    // Event listeners
    addUserBtn.addEventListener('click', showUserForm);
    cancelUserBtn.addEventListener('click', hideUserForm);
    userForm.addEventListener('submit', handleUserSubmit);
    prevPageBtn.addEventListener('click', goToPrevPage);
    nextPageBtn.addEventListener('click', goToNextPage);
    userSearch.addEventListener('input', searchUsers);

    // Initialize
    renderUserList();
    updatePagination();

    // Show user form
    function showUserForm() {
        userForm.reset();
        document.getElementById('userId').value = '';
        userFormContainer.style.display = 'block';
        window.scrollTo({
            top: userFormContainer.offsetTop - 20,
            behavior: 'smooth'
        });
    }

    // Hide user form
    function hideUserForm() {
        userFormContainer.style.display = 'none';
    }

    // Handle form submission
    function handleUserSubmit(e) {
        e.preventDefault();
        
        const formData = {
            id: document.getElementById('userId').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            role: document.getElementById('role').value,
            status: document.getElementById('status').value,
            avatar: document.getElementById('firstName').value.charAt(0) || 
                   document.getElementById('username').value.charAt(0).toUpperCase()
        };

        // Password validation if new user
        if (!formData.id) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (password.length < 8) {
                alert('Password must be at least 8 characters');
                return;
            }
            
            formData.password = password;
        }

        // In a real app, you would send this to your backend
        if (formData.id) {
            // Update existing user
            const index = users.findIndex(u => u.id == formData.id);
            users[index] = { ...users[index], ...formData };
            alert('User updated successfully');
        } else {
            // Add new user
            formData.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            formData.lastActive = new Date().toISOString();
            users.push(formData);
            alert('User added successfully');
        }

        hideUserForm();
        filteredUsers = [...users];
        renderUserList();
        updatePagination();
    }

    // Render user list
    function renderUserList() {
        userList.innerHTML = '';
        
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = Math.min(startIndex + usersPerPage, filteredUsers.length);
        const usersToShow = filteredUsers.slice(startIndex, endIndex);
        
        if (usersToShow.length === 0) {
            userList.innerHTML = '<div class="no-results">No users found</div>';
            return;
        }
        
        usersToShow.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            
            let roleClass = '';
            if (user.role === 'admin') roleClass = 'role-admin';
            else if (user.role === 'editor') roleClass = 'role-editor';
            else roleClass = 'role-viewer';
            
            let statusClass = '';
            if (user.status === 'active') statusClass = 'status-active';
            else if (user.status === 'inactive') statusClass = 'status-inactive';
            else statusClass = 'status-suspended';
            
            const lastActive = new Date(user.lastActive);
            const formattedDate = lastActive.toLocaleDateString('en-US', {
                year: 'numeric', 
                month: 'short', 
                day: 'numeric'
            });
            
            userItem.innerHTML = `
                <div class="user-info">
                    <div class="user-avatar">${user.avatar}</div>
                    <div>
                        <div class="user-name">${user.firstName || ''} ${user.lastName || ''}</div>
                        <div class="user-email">${user.email}</div>
                    </div>
                </div>
                <div class="user-role">
                    <span class="role-badge ${roleClass}">${user.role}</span>
                </div>
                <div class="user-status">
                    <span class="status-badge ${statusClass}">${user.status}</span>
                </div>
                <div class="user-last-active">${formattedDate}</div>
                <div class="user-actions">
                    <button class="edit" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
                    <button class="delete" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            userList.appendChild(userItem);
        });
    }

    // Update pagination controls
    function updatePagination() {
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        
        startItem.textContent = ((currentPage - 1) * usersPerPage) + 1;
        endItem.textContent = Math.min(currentPage * usersPerPage, filteredUsers.length);
        totalItems.textContent = filteredUsers.length;
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
        
        // Update page numbers
        pageNumbers.innerHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageNumber = document.createElement('span');
            pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => goToPage(i));
            pageNumbers.appendChild(pageNumber);
        }
    }

    // Pagination functions
    function goToPage(page) {
        currentPage = page;
        renderUserList();
        updatePagination();
    }

    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderUserList();
            updatePagination();
        }
    }

    function goToNextPage() {
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderUserList();
            updatePagination();
        }
    }

    // Search users
    function searchUsers() {
        const searchTerm = userSearch.value.toLowerCase();
        
        if (searchTerm === '') {
            filteredUsers = [...users];
        } else {
            filteredUsers = users.filter(user => 
                user.username.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                (user.firstName && user.firstName.toLowerCase().includes(searchTerm)) ||
                (user.lastName && user.lastName.toLowerCase().includes(searchTerm))
            );
        }
        
        currentPage = 1;
        renderUserList();
        updatePagination();
    }

    // Global functions for inline event handlers
    window.editUser = function(id) {
        const user = users.find(u => u.id == id);
        
        if (user) {
            document.getElementById('userId').value = user.id;
            document.getElementById('username').value = user.username;
            document.getElementById('email').value = user.email;
            document.getElementById('firstName').value = user.firstName || '';
            document.getElementById('lastName').value = user.lastName || '';
            document.getElementById('role').value = user.role;
            document.getElementById('status').value = user.status;
            
            // Clear password fields
            document.getElementById('password').value = '';
            document.getElementById('confirmPassword').value = '';
            
            showUserForm();
        }
    };

    window.deleteUser = function(id) {
        if (confirm('Are you sure you want to delete this user?')) {
            users = users.filter(user => user.id != id);
            filteredUsers = filteredUsers.filter(user => user.id != id);
            renderUserList();
            updatePagination();
            alert('User deleted successfully');
        }
    };
});