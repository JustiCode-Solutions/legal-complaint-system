// script.js - Legal Complaint Management System

document.addEventListener('DOMContentLoaded', function() {
    // ====== LOADING SCREEN FUNCTIONALITY ======
    const loadingOverlay = document.getElementById('loadingOverlay');
    const progressBar = document.getElementById('progressBar');
    const percentage = document.getElementById('percentage');
    const body = document.body;
    
    let progress = 0;
    let interval = null;
    
    // Simulate loading progress
    function updateProgress() {
        progress += Math.random() * 15; // Random increment for realistic feel
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Add final animation before hiding
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                
                // Add loaded class to body to show content
                body.classList.add('loaded');
                
                // Remove loading overlay from DOM after transition
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                    
                    // Initialize animations for main content
                    initAnimations();
                }, 1000);
            }, 500);
        }
        
        // Update progress bar and percentage
        if (progressBar) progressBar.style.width = progress + '%';
        if (percentage) percentage.textContent = Math.floor(progress) + '%';
        
        // Add pulsing effect when near completion
        if (progress > 90 && percentage) {
            percentage.style.animation = 'pulse 0.5s infinite alternate';
        }
    }
    
    // Start progress simulation after a short delay
    setTimeout(() => {
        interval = setInterval(updateProgress, 100);
    }, 500);
    
    // Add some random delays for realism
    setTimeout(() => {
        // Simulate database connection
        console.log('Database connection established');
    }, 1500);
    
    setTimeout(() => {
        // Simulate AI modules loading
        console.log('AI modules initialized');
    }, 2500);
    
    setTimeout(() => {
        // Simulate legal database loading
        console.log('Legal database loaded');
    }, 3500);
    
    // Weather update simulation
    setTimeout(() => {
        const weatherTemp = document.querySelector('.temperature');
        const weatherCondition = document.querySelector('.weather-condition');
        const weatherIcon = document.querySelector('.weather-widget i');
        
        if (weatherTemp && weatherCondition && weatherIcon) {
            // Simulate weather change
            setTimeout(() => {
                weatherTemp.textContent = '22°C';
                weatherCondition.textContent = 'Sunny';
                weatherIcon.className = 'fas fa-sun';
            }, 2000);
        }
    }, 4000);
    
    // Add click handler to skip loading (for testing)
    if (loadingOverlay) {
        loadingOverlay.addEventListener('click', function(e) {
            if (e.target === loadingOverlay) {
                // Fast forward to complete
                progress = 95;
                updateProgress();
            }
        });
    }

    // ====== MOBILE MENU FUNCTIONALITY ======
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.querySelector('.main-nav');
    const navActions = document.querySelector('.nav-actions');
    
    function toggleMobileMenu() {
        if (!mainNav || !navActions) return;
        
        const isVisible = mainNav.style.display === 'flex';
        
        if (isVisible) {
            mainNav.style.display = 'none';
            navActions.style.display = 'none';
            if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
            mainNav.style.display = 'flex';
            navActions.style.display = 'flex';
            mainNav.style.flexDirection = 'column';
            mainNav.style.position = 'absolute';
            mainNav.style.top = '100%';
            mainNav.style.left = '0';
            mainNav.style.width = '100%';
            mainNav.style.backgroundColor = '#1e1e1e';
            mainNav.style.padding = '2rem';
            mainNav.style.gap = '1.5rem';
            mainNav.style.zIndex = '1000';
            
            navActions.style.flexDirection = 'column';
            navActions.style.position = 'absolute';
            navActions.style.top = 'calc(100% + 200px)';
            navActions.style.left = '0';
            navActions.style.width = '100%';
            navActions.style.backgroundColor = '#1e1e1e';
            navActions.style.padding = '2rem';
            navActions.style.gap = '1rem';
            navActions.style.zIndex = '1000';
            
            if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
        }
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mainNav && navActions && 
            mainNav.style.display === 'flex' &&
            !mainNav.contains(event.target) && 
            !navActions.contains(event.target) &&
            event.target !== mobileMenuBtn) {
            toggleMobileMenu();
        }
    });

    // ====== SMOOTH SCROLLING ======
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Calculate offset for fixed header
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (window.innerWidth <= 768 && mainNav && mainNav.style.display === 'flex') {
                        toggleMobileMenu();
                    }
                }
            });
        });
    }
    
    initSmoothScrolling();

    // ====== LOGIN/REGISTER FUNCTIONALITY ======
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');
    
    function showLoginModal() {
        // Create modal structure
        const modalHtml = `
            <div class="modal-overlay active" id="loginModal">
                <div class="modal-content">
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-header">
                        <h2><i class="fas fa-sign-in-alt"></i> Login to Your Account</h2>
                        <p>Access your LegalJustice dashboard</p>
                    </div>
                    <div class="modal-body">
                        <form class="login-form" id="loginForm">
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="loginEmail" placeholder="Enter your email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" id="loginPassword" placeholder="Enter your password" required>
                                <div class="password-toggle">
                                    <i class="fas fa-eye" id="toggleLoginPassword"></i>
                                </div>
                            </div>
                            <div class="form-options">
                                <label>
                                    <input type="checkbox"> Remember me
                                </label>
                                <a href="#" class="forgot-password">Forgot Password?</a>
                            </div>
                            <button type="submit" class="btn btn-primary login-submit">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </button>
                            <div class="register-prompt">
                                Don't have an account? <a href="#" class="register-link">Register here</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        // Add modal styles
        addModalStyles();
        
        // Add event listeners for modal
        const modal = document.getElementById('loginModal');
        const closeBtn = modal.querySelector('.modal-close');
        const loginForm = document.getElementById('loginForm');
        const registerLink = modal.querySelector('.register-link');
        const togglePassword = document.getElementById('toggleLoginPassword');
        
        // Password toggle functionality
        if (togglePassword) {
            togglePassword.addEventListener('click', function() {
                const passwordInput = document.getElementById('loginPassword');
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        }
        
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simple validation
            if (email && password) {
                showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    modal.remove();
                    // In a real app, you would redirect to dashboard
                }, 1500);
            } else {
                showNotification('Please fill in all fields', 'error');
            }
        });
        
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            modal.remove();
            showRegisterModal();
        });
        
        // Forgot password
        const forgotPassword = modal.querySelector('.forgot-password');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Password reset link sent to your email', 'info');
                modal.remove();
            });
        }
    }
    
    function showRegisterModal() {
        // Create registration modal structure
        const modalHtml = `
            <div class="modal-overlay active" id="registerModal">
                <div class="modal-content">
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-header">
                        <h2><i class="fas fa-user-plus"></i> Create New Account</h2>
                        <p>Join LegalJustice System today</p>
                    </div>
                    <div class="modal-body">
                        <form class="register-form" id="registerForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="firstName">First Name</label>
                                    <input type="text" id="firstName" placeholder="Enter first name" required>
                                </div>
                                <div class="form-group">
                                    <label for="lastName">Last Name</label>
                                    <input type="text" id="lastName" placeholder="Enter last name" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="regEmail">Email Address</label>
                                <input type="email" id="regEmail" placeholder="Enter your email" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="tel" id="phone" placeholder="Enter phone number" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="userType">I am a...</label>
                                <select id="userType" required>
                                    <option value="">Select your role</option>
                                    <option value="citizen">Citizen / Complainant</option>
                                    <option value="officer">Legal Officer / Admin</option>
                                    <option value="lawyer">Lawyer</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="organization">Organization (Optional)</label>
                                <input type="text" id="organization" placeholder="Your organization name">
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="regPassword">Password</label>
                                    <input type="password" id="regPassword" placeholder="Create password" required>
                                    <div class="password-toggle">
                                        <i class="fas fa-eye" id="toggleRegPassword"></i>
                                    </div>
                                    <div class="password-strength">
                                        <div class="strength-bar"></div>
                                        <span class="strength-text">Password strength: Weak</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="confirmPassword">Confirm Password</label>
                                    <input type="password" id="confirmPassword" placeholder="Confirm password" required>
                                    <div class="password-toggle">
                                        <i class="fas fa-eye" id="toggleConfirmPassword"></i>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="referral">How did you hear about us?</label>
                                <select id="referral">
                                    <option value="">Select an option</option>
                                    <option value="search">Search Engine</option>
                                    <option value="social">Social Media</option>
                                    <option value="friend">Friend/Colleague</option>
                                    <option value="gov">Government Website</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            
                            <div class="form-group checkbox-group">
                                <input type="checkbox" id="terms" required>
                                <label for="terms">
                                    I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="terms-link">Privacy Policy</a>
                                </label>
                            </div>
                            
                            <div class="form-group checkbox-group">
                                <input type="checkbox" id="newsletter" checked>
                                <label for="newsletter">
                                    Send me updates about new features and legal resources
                                </label>
                            </div>
                            
                            <button type="submit" class="btn btn-primary register-submit">
                                <i class="fas fa-user-plus"></i> Create Account
                            </button>
                            
                            <div class="login-prompt">
                                Already have an account? <a href="#" class="login-link">Login here</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        // Add modal styles
        addModalStyles();
        
        // Add event listeners for modal
        const modal = document.getElementById('registerModal');
        const closeBtn = modal.querySelector('.modal-close');
        const registerForm = document.getElementById('registerForm');
        const loginLink = modal.querySelector('.login-link');
        
        // Password toggle functionality
        const toggleRegPassword = document.getElementById('toggleRegPassword');
        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
        
        if (toggleRegPassword) {
            toggleRegPassword.addEventListener('click', function() {
                const passwordInput = document.getElementById('regPassword');
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        }
        
        if (toggleConfirmPassword) {
            toggleConfirmPassword.addEventListener('click', function() {
                const passwordInput = document.getElementById('confirmPassword');
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        }
        
        // Password strength indicator
        const passwordInput = document.getElementById('regPassword');
        const strengthBar = modal.querySelector('.strength-bar');
        const strengthText = modal.querySelector('.strength-text');
        
        if (passwordInput && strengthBar && strengthText) {
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                let strength = 0;
                let width = '0%';
                let color = '#ff5722';
                let text = 'Weak';
                
                // Check password strength
                if (password.length >= 8) strength++;
                if (/[A-Z]/.test(password)) strength++;
                if (/[0-9]/.test(password)) strength++;
                if (/[^A-Za-z0-9]/.test(password)) strength++;
                
                if (strength === 0) {
                    width = '10%';
                    text = 'Very Weak';
                } else if (strength === 1) {
                    width = '30%';
                    text = 'Weak';
                    color = '#ff5722';
                } else if (strength === 2) {
                    width = '50%';
                    text = 'Fair';
                    color = '#ffa726';
                } else if (strength === 3) {
                    width = '75%';
                    text = 'Good';
                    color = '#4caf50';
                } else if (strength >= 4) {
                    width = '100%';
                    text = 'Strong';
                    color = '#2e7d32';
                }
                
                strengthBar.style.width = width;
                strengthBar.style.backgroundColor = color;
                strengthText.textContent = `Password strength: ${text}`;
                strengthText.style.color = color;
            });
        }
        
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('regEmail').value;
            const phone = document.getElementById('phone').value;
            const userType = document.getElementById('userType').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            
            // Validation
            if (!firstName || !lastName || !email || !phone || !userType || !password || !confirmPassword) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            if (!terms) {
                showNotification('Please agree to the Terms of Service', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 8) {
                showNotification('Password must be at least 8 characters', 'error');
                return;
            }
            
            // Simulate registration
            showNotification('Creating your account...', 'info');
            
            setTimeout(() => {
                showNotification('Account created successfully! Welcome to LegalJustice', 'success');
                modal.remove();
                
                // In a real app, you would:
                // 1. Send data to backend
                // 2. Create user session
                // 3. Redirect to dashboard
            }, 2000);
        });
        
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            modal.remove();
            showLoginModal();
        });
    }
    
    function addModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
                backdrop-filter: blur(5px);
            }
            
            .modal-content {
                background: linear-gradient(145deg, #1e1e1e, #2d2d2d);
                border-radius: 15px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                animation: scaleIn 0.3s ease;
                border: 2px solid #ff5722;
                box-shadow: 0 15px 35px rgba(255, 87, 34, 0.2);
            }
            
            .modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(255, 87, 34, 0.1);
                border: none;
                color: #ff5722;
                font-size: 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-close:hover {
                background: rgba(255, 87, 34, 0.2);
                transform: rotate(90deg);
            }
            
            .modal-header {
                padding: 2rem 2rem 1rem;
                border-bottom: 1px solid #3a3a3a;
                text-align: center;
            }
            
            .modal-header h2 {
                color: white;
                font-size: 1.8rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-bottom: 0.5rem;
            }
            
            .modal-header p {
                color: #aaa;
                font-size: 1rem;
            }
            
            .modal-body {
                padding: 2rem;
            }
            
            .form-group {
                margin-bottom: 1.5rem;
                position: relative;
            }
            
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            
            .form-group label {
                display: block;
                color: white;
                margin-bottom: 0.5rem;
                font-weight: 600;
            }
            
            .form-group input,
            .form-group select {
                width: 100%;
                padding: 0.8rem 1rem;
                background: #2d2d2d;
                border: 1px solid #3a3a3a;
                border-radius: 6px;
                color: #f5f5f5;
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            
            .form-group input:focus,
            .form-group select:focus {
                outline: none;
                border-color: #ff5722;
                box-shadow: 0 0 0 2px rgba(255, 87, 34, 0.2);
            }
            
            .form-group input::placeholder {
                color: #888;
            }
            
            .form-group select {
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23ff5722' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 1rem center;
                background-size: 16px;
                padding-right: 3rem;
            }
            
            .password-toggle {
                position: absolute;
                right: 10px;
                top: 38px;
                color: #888;
                cursor: pointer;
                transition: color 0.3s ease;
            }
            
            .password-toggle:hover {
                color: #ff5722;
            }
            
            .password-strength {
                margin-top: 0.5rem;
            }
            
            .strength-bar {
                height: 4px;
                background-color: #3a3a3a;
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 0.3rem;
                position: relative;
                width: 0%;
                transition: width 0.3s ease, background-color 0.3s ease;
            }
            
            .strength-text {
                color: #888;
                font-size: 0.85rem;
            }
            
            .form-options {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            
            .forgot-password {
                color: #ff8a50;
                text-decoration: none;
                transition: color 0.3s ease;
                font-size: 0.9rem;
            }
            
            .forgot-password:hover {
                color: #ff5722;
            }
            
            .checkbox-group {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 0.5rem;
            }
            
            .checkbox-group input[type="checkbox"] {
                width: 18px;
                height: 18px;
                accent-color: #ff5722;
                cursor: pointer;
            }
            
            .checkbox-group label {
                color: #ccc;
                font-weight: normal;
                margin-bottom: 0;
                cursor: pointer;
                font-size: 0.9rem;
            }
            
            .terms-link {
                color: #ff5722;
                text-decoration: none;
                transition: color 0.3s ease;
            }
            
            .terms-link:hover {
                text-decoration: underline;
            }
            
            .login-submit,
            .register-submit {
                width: 100%;
                margin-bottom: 1rem;
                padding: 0.8rem;
                font-size: 1.1rem;
                font-weight: 600;
            }
            
            .login-submit:hover,
            .register-submit:hover {
                transform: translateY(-2px);
            }
            
            .register-prompt,
            .login-prompt {
                text-align: center;
                color: #aaa;
                font-size: 0.95rem;
            }
            
            .register-link,
            .login-link {
                color: #ff5722;
                text-decoration: none;
                font-weight: 600;
                transition: color 0.3s ease;
            }
            
            .register-link:hover,
            .login-link:hover {
                color: #ff8a50;
                text-decoration: underline;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes scaleIn {
                0% { transform: scale(0.5); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            
            @media (max-width: 600px) {
                .form-row {
                    grid-template-columns: 1fr;
                }
                
                .modal-content {
                    width: 95%;
                    margin: 10px;
                }
                
                .modal-header h2 {
                    font-size: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', showRegisterModal);
    }

    // ====== NOTIFICATION SYSTEM ======
    function showNotification(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer') || createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 5000);
    }
    
    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }
    
    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 4000;
        `;
        document.body.appendChild(container);
        
        // Add toast styles
        const style = document.createElement('style');
        style.textContent = `
            .toast {
                background: linear-gradient(145deg, #1e1e1e, #2d2d2d);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                border-left: 4px solid #ff5722;
                transform: translateX(100%);
                animation: slideInLeft 0.3s ease forwards;
                max-width: 300px;
                border: 1px solid #3a3a3a;
            }
            
            .toast.success { border-left-color: #4caf50; }
            .toast.error { border-left-color: #f44336; }
            .toast.info { border-left-color: #ff5722; }
            .toast.warning { border-left-color: #ff9800; }
            
            .toast i {
                font-size: 1.2rem;
            }
            
            .toast.hiding {
                animation: slideInRight 0.3s ease forwards;
            }
            
            @keyframes slideInLeft {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideInRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        return container;
    }

    // ====== SCROLL ANIMATIONS ======
    function initAnimations() {
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Special handling for counters
                    if (entry.target.classList.contains('stat-item')) {
                        animateCounter(entry.target.querySelector('h3'));
                    }
                }
            });
        }, observerOptions);
        
        // Observe all cards and section titles
        document.querySelectorAll('.portal-card, .feature-card, .section-title, .stat-item').forEach(el => {
            el.classList.add('pre-animate');
            observer.observe(el);
        });
        
        // Add animation styles
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            .pre-animate {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .animated {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(animationStyle);
    }
    
    function animateCounter(counterElement) {
        if (!counterElement) return;
        
        const targetText = counterElement.textContent;
        const isPlus = targetText.includes('+');
        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, '')) || 0;
        let current = 0;
        const increment = targetNumber / 50; // Animate over 50 steps
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                current = targetNumber;
                clearInterval(timer);
            }
            counterElement.textContent = Math.floor(current) + (isPlus ? '+' : '');
        }, 30);
    }

    // ====== BACK TO TOP BUTTON ======
    function initBackToTop() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: #ff5722;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(255, 87, 34, 0.3);
        `;
        
        document.body.appendChild(backToTopBtn);
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.transform = 'translateY(0)';
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.transform = 'translateY(20px)';
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Add hover effect
        backToTopBtn.addEventListener('mouseenter', () => {
            backToTopBtn.style.background = '#c41c00';
            backToTopBtn.style.transform = 'translateY(-5px)';
            backToTopBtn.style.boxShadow = '0 8px 20px rgba(255, 87, 34, 0.4)';
        });
        
        backToTopBtn.addEventListener('mouseleave', () => {
            backToTopBtn.style.background = '#ff5722';
            if (window.pageYOffset > 300) {
                backToTopBtn.style.transform = 'translateY(0)';
            } else {
                backToTopBtn.style.transform = 'translateY(20px)';
            }
            backToTopBtn.style.boxShadow = '0 5px 15px rgba(255, 87, 34, 0.3)';
        });
    }

    // ====== PORTAL CARD INTERACTIONS ======
    function initPortalCards() {
        const portalCards = document.querySelectorAll('.portal-card');
        
        portalCards.forEach(card => {
            // Add hover animation for icons
            const icon = card.querySelector('.portal-icon i');
            if (icon) {
                card.addEventListener('mouseenter', () => {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.transition = 'transform 0.3s ease';
                });
                
                card.addEventListener('mouseleave', () => {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                });
            }
            
            // Add click effect
            const portalBtn = card.querySelector('.btn-primary');
            if (portalBtn) {
                portalBtn.addEventListener('click', (e) => {
                    if (!portalBtn.getAttribute('href') || portalBtn.getAttribute('href') === '#') {
                        e.preventDefault();
                        const portalType = card.querySelector('h3').textContent.includes('Citizen') ? 'Citizen' : 'Admin';
                        showNotification(`Redirecting to ${portalType} Portal...`, 'info');
                        
                        // Simulate loading for demo
                        setTimeout(() => {
                            showNotification(`Welcome to ${portalType} Portal!`, 'success');
                        }, 1000);
                    }
                });
            }
        });
    }

    // ====== DEMO BUTTON FUNCTIONALITY ======
    function initDemoButton() {
        const demoBtn = document.querySelector('.btn-secondary');
        if (demoBtn && demoBtn.textContent.includes('Demo')) {
            demoBtn.addEventListener('click', (e) => {
                if (demoBtn.getAttribute('href') === '#features') {
                    e.preventDefault();
                    showNotification('Starting interactive demo...', 'info');
                    
                    // Create demo overlay
                    const demoOverlay = document.createElement('div');
                    demoOverlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.9);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 2000;
                        animation: fadeIn 0.3s ease;
                    `;
                    
                    demoOverlay.innerHTML = `
                        <div style="background: #1e1e1e; padding: 2rem; border-radius: 15px; max-width: 600px; width: 90%; text-align: center;">
                            <h2 style="color: white; margin-bottom: 1rem;"><i class="fas fa-play-circle"></i> System Demo</h2>
                            <div style="background: #121212; padding: 2rem; border-radius: 10px; margin-bottom: 1.5rem;">
                                <div style="font-size: 4rem; color: #ff5722; margin-bottom: 1rem;">
                                    <i class="fas fa-play-circle"></i>
                                </div>
                                <p style="color: #aaa;">Interactive demo of LegalJustice System</p>
                            </div>
                            <div style="display: flex; gap: 1rem; justify-content: center;">
                                <button id="playDemo" style="background: #ff5722; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 6px; cursor: pointer;">
                                    <i class="fas fa-play"></i> Play Demo
                                </button>
                                <button id="closeDemo" style="background: transparent; color: #ff5722; border: 2px solid #ff5722; padding: 0.8rem 1.5rem; border-radius: 6px; cursor: pointer;">
                                    <i class="fas fa-times"></i> Close
                                </button>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(demoOverlay);
                    
                    // Add event listeners
                    document.getElementById('playDemo').addEventListener('click', () => {
                        showNotification('Demo video playing...', 'success');
                        // In a real app, you would play the video
                    });
                    
                    document.getElementById('closeDemo').addEventListener('click', () => {
                        demoOverlay.remove();
                    });
                    
                    demoOverlay.addEventListener('click', (e) => {
                        if (e.target === demoOverlay) {
                            demoOverlay.remove();
                        }
                    });
                }
            });
        }
    }

    // ====== INITIALIZE ALL FUNCTIONALITY ======
    initBackToTop();
    initPortalCards();
    initDemoButton();
    
    // Show welcome notification when page loads
    setTimeout(() => {
        if (body.classList.contains('loaded')) {
            showNotification('Welcome to LegalJustice System!', 'success');
        }
    }, 1000);

    // ====== WINDOW RESIZE HANDLER ======
    window.addEventListener('resize', () => {
        // Reset mobile menu on larger screens
        if (window.innerWidth > 768 && mainNav && navActions) {
            mainNav.style.display = '';
            mainNav.style.flexDirection = '';
            mainNav.style.position = '';
            mainNav.style.top = '';
            mainNav.style.left = '';
            mainNav.style.width = '';
            mainNav.style.backgroundColor = '';
            mainNav.style.padding = '';
            mainNav.style.gap = '';
            mainNav.style.zIndex = '';
            
            navActions.style.display = '';
            navActions.style.flexDirection = '';
            navActions.style.position = '';
            navActions.style.top = '';
            navActions.style.left = '';
            navActions.style.width = '';
            navActions.style.backgroundColor = '';
            navActions.style.padding = '';
            navActions.style.gap = '';
            navActions.style.zIndex = '';
            
            if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});