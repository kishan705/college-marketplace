// This file manages login, logout, and auth state

document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.onclick = login;
    }
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.onsubmit = signup;
    }
});

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html'; // Go to dashboard on successful login
        } else {
            alert(`Error: ${data.error || data.message}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login.');
    }
}

async function signup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const college = document.getElementById('signupCollege').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, college, phone }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert(`Error: ${data.error || data.message}`);
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred during signup.');
    }
}

/**
 * Checks if the user is logged in and updates the header accordingly.
 */
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const authButton = document.getElementById('authButton');
    const profileLink = document.getElementById('profileLink');
    const subNavbar = document.querySelector('.sub-navbar');

    if (!token) {
        // --- State when LOGGED OUT ---
        if (authButton) {
            authButton.textContent = 'Sign In';
            authButton.onclick = () => openModal('loginModal');
            authButton.style.display = 'block';
        }
        if (profileLink) {
            profileLink.style.display = 'none';
        }
        return;
    }

    // --- State when LOGGED IN ---
    try {
        const response = await fetch('/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            // User is verified
            if (authButton) {
                // Change the main button to a Logout button
                authButton.textContent = 'Logout';
                authButton.onclick = logout;
                authButton.style.display = 'block';
            }
            if (profileLink) {
                // Show the profile icon
                profileLink.style.display = 'flex';
            }
            // Add dashboard link to sub-navbar if it doesn't exist
            if (subNavbar && !subNavbar.querySelector('a[href="dashboard.html"]')) {
                const dashboardLink = document.createElement('a');
                dashboardLink.href = 'dashboard.html';
                dashboardLink.textContent = 'Dashboard';
                // Find the "Sell Item" link and insert the dashboard link before it
                const sellItemLink = subNavbar.querySelector('a[onclick*="sellModal"]');
                if (sellItemLink) {
                    subNavbar.insertBefore(dashboardLink, sellItemLink);
                } else {
                    subNavbar.appendChild(dashboardLink);
                }
            }
        } else {
            // Token is invalid, treat as logged out
            logout();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        logout();
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

function getAuthToken() {
    return localStorage.getItem('token');
}

