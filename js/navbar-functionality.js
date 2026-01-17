// navbar-functionality.js - Modern navbar interaction logic

document.addEventListener('DOMContentLoaded', function() {
    console.log('Navbar functionality initializing...');
    // Initialize all navbar components
    initializeNavbar();
    setupDropdowns();
    setupMobileMenu();
    setupGoalCitySelection();
    setupProfileDropdown();
    setupAccessibility();
    setupModuleInteractions(); // Added for proper module interactions
    console.log('Navbar functionality initialized successfully!');
});

// Main navbar initialization
function initializeNavbar() {
    const header = document.querySelector('.header');
    const navbar = document.querySelector('.navbar');
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Close all dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-item') && !e.target.closest('.mobile-menu-btn')) {
            closeAllDropdowns();
        }
    });
}

// Setup dropdown functionality
function setupDropdowns() {
    console.log('Setting up dropdowns...');
    
    // Removed Explore dropdown functionality as it has been removed from HTML
    
    // Other dropdown functionality can go here if needed
}

// Setup mobile menu functionality
function setupMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', function() {
            toggleMobileMenu();
        });
        
        // Close mobile menu when clicking nav links
        const navLinks = navMenu.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && 
                !mobileBtn.contains(e.target) && 
                navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    navMenu.classList.add('active');
    body.style.overflow = 'hidden';
    mobileBtn.setAttribute('aria-expanded', 'true');
    mobileBtn.classList.add('active');
}

function closeMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    navMenu.classList.remove('active');
    body.style.overflow = '';
    body.style.position = '';
    body.style.width = '';
    mobileBtn.setAttribute('aria-expanded', 'false');
    mobileBtn.classList.remove('active');
}

// Setup Goal & City selection functionality
function setupGoalCitySelection() {
    const goalCityBtn = document.querySelector('.goal-city-btn');
    const goalCityDropdown = document.querySelector('.goal-city-dropdown');
    const modal = document.querySelector('.goal-city-modal');
    const skipBtns = document.querySelectorAll('.skip-btn');
    const continueBtn = document.querySelector('.continue-btn');
    
    if (goalCityBtn && goalCityDropdown) {
        goalCityBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = goalCityDropdown.classList.contains('active');
            
            closeAllDropdowns();
            
            if (!isActive) {
                goalCityDropdown.classList.add('active');
                goalCityBtn.setAttribute('aria-expanded', 'true');
                
                // Reset modal to first step
                showStep(1);
            } else {
                goalCityBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Goal selection
    const goalOptions = document.querySelectorAll('.goal-option');
    goalOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            goalOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Store selected goal
            const selectedGoal = this.getAttribute('data-goal');
            localStorage.setItem('selectedGoal', selectedGoal);
            
            // Move to step 2
            setTimeout(() => showStep(2), 300);
        });
    });
    
    // Location selection
    const locationOptions = document.querySelectorAll('.location-option');
    locationOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            locationOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Store selected location
            const selectedLocation = this.getAttribute('data-location');
            localStorage.setItem('selectedLocation', selectedLocation);
        });
    });
    
    // Skip buttons
    skipBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeGoalCityModal();
        });
    });
    
    // Continue button
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            const selectedGoal = localStorage.getItem('selectedGoal');
            const selectedLocation = localStorage.getItem('selectedLocation');
            
            // Save selections and close modal
            if (selectedGoal || selectedLocation) {
                console.log('Selected Goal:', selectedGoal);
                console.log('Selected Location:', selectedLocation);
                
                // Update button appearance to show selection
                if (selectedGoal) {
                    goalCityBtn.innerHTML = `
                        <i class="fas fa-bullseye"></i>
                        <span>${selectedGoal}${selectedLocation ? `, ${selectedLocation}` : ''}</span>
                    `;
                    goalCityBtn.classList.add('selected');
                }
            }
            
            closeGoalCityModal();
        });
    }
    
    // Location search
    const locationSearch = document.querySelector('.location-search');
    if (locationSearch) {
        locationSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            locationOptions.forEach(option => {
                const locationName = option.getAttribute('data-location').toLowerCase();
                if (locationName.includes(searchTerm)) {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            });
        });
    }
}

function showStep(stepNumber) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index === stepNumber - 1) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function closeGoalCityModal() {
    const goalCityDropdown = document.querySelector('.goal-city-dropdown');
    const goalCityBtn = document.querySelector('.goal-city-btn');
    
    if (goalCityDropdown) {
        goalCityDropdown.classList.remove('active');
        goalCityBtn.setAttribute('aria-expanded', 'false');
    }
}

// Setup Profile dropdown functionality
function setupProfileDropdown() {
    console.log('Profile dropdown functionality removed as it has been removed from HTML');
    // Profile dropdown functionality has been removed as it has been removed from HTML
}

function updateProfileUI() {
    // Check if user is logged in (this would typically check auth state)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    const guestView = document.querySelector('.guest-view');
    const userView = document.querySelector('.user-view');
    
    if (isLoggedIn && guestView && userView) {
        guestView.style.display = 'none';
        userView.style.display = 'block';
    } else if (guestView && userView) {
        guestView.style.display = 'block';
        userView.style.display = 'none';
    }
    
    // Setup login/register buttons
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            // Login functionality
            console.log('Login clicked');
            // This would typically open a login modal or redirect
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            // Register functionality
            console.log('Register clicked');
            // This would typically open a registration modal or redirect
        });
    }
}

function closeProfileDropdown() {
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileBtn = document.querySelector('.profile-btn');
    
    if (profileDropdown) {
        profileDropdown.classList.remove('active');
        profileBtn.setAttribute('aria-expanded', 'false');
    }
}

// Close all dropdowns
function closeAllDropdowns() {
    const activeDropdowns = document.querySelectorAll('.nav-item.active');
    const activeButtons = document.querySelectorAll('[aria-expanded="true"]');
    
    activeDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
    });
    
    activeButtons.forEach(button => {
        button.setAttribute('aria-expanded', 'false');
    });
    
    // Also close mobile menu if it's open
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        if (mobileBtn) {
            mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileBtn.setAttribute('aria-expanded', 'false');
        }
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }
}

// Setup keyboard navigation and accessibility
function setupAccessibility() {
    console.log('Setting up accessibility features...');
    
    // Keyboard navigation for dropdowns
    document.addEventListener('keydown', function(e) {
        // Escape key closes all dropdowns
        if (e.key === 'Escape') {
            closeAllDropdowns();
            closeMobileMenu();
        }
        
        // Tab key navigation improvements
        if (e.key === 'Tab') {
            // Handle tab navigation within dropdowns
            const activeDropdown = document.querySelector('.nav-item.active');
            if (activeDropdown) {
                const focusableElements = activeDropdown.querySelectorAll(
                    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length > 0) {
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey) {
                        // Shift + Tab
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        // Tab
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            }
        }
        
        // Enter/space key activation for buttons
        if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.nav-link, .goal-city-btn')) {
            e.preventDefault();
            e.target.click();
        }
    });
    
    // Arrow key navigation for dropdown menus
    const dropdownMenus = document.querySelectorAll('[role="menu"]');
    dropdownMenus.forEach(menu => {
        menu.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const items = Array.from(this.querySelectorAll('[role="menuitem"]'));
                const currentIndex = items.indexOf(document.activeElement);
                
                let newIndex;
                if (e.key === 'ArrowDown') {
                    newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                } else {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                }
                
                items[newIndex].focus();
            }
        });
    });
    
    // Add ARIA labels dynamically
    const searchInput = document.querySelector('.search-input');
    if (searchInput && !searchInput.hasAttribute('aria-label')) {
        searchInput.setAttribute('aria-label', 'Search for colleges, courses, exams, and cities');
    }
    
    // Ensure all interactive elements have proper roles
    const interactiveElements = document.querySelectorAll('.nav-link, .goal-city-btn');
    interactiveElements.forEach(el => {
        if (!el.hasAttribute('role') && el.tagName !== 'A') {
            el.setAttribute('role', 'button');
        }
    });
    
    console.log('Accessibility features set up successfully!');
}

// Setup dropdown keyboard navigation
function setupDropdownKeyboardNavigation(dropdown) {
    const dropdownItems = dropdown.querySelectorAll('a, button');
    
    if (dropdownItems.length > 0) {
        // Focus first item when dropdown opens
        setTimeout(() => {
            dropdownItems[0].focus();
        }, 100);
    }
}

// Search functionality
function setupSearch() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // Implement search functionality
                console.log('Searching for:', searchTerm);
                // This would typically redirect to search results page
                // window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
    
    // Search input enhancements
    if (searchInput) {
        // Clear search on escape
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                this.blur();
            }
        });
        
        // Auto-focus enhancement
        searchInput.addEventListener('focus', function() {
            this.select();
        });
    }
}

// Setup module interactions to ensure only one is open at a time
function setupModuleInteractions() {
    // Removed module interactions as the explore and profile buttons have been removed from HTML
    
    // Also handle clicks inside dropdowns to prevent closing
    document.querySelectorAll('.explore-dropdown-menu, .profile-panel').forEach(dropdown => {
        // Removed as these elements no longer exist
    });
}

// Prevent body scroll when mobile menu is open
function preventBodyScroll(isPrevented) {
    if (isPrevented) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }
}

// Handle mobile menu toggle
function toggleMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileBtn || !navMenu) return;
    
    const isActive = navMenu.classList.contains('active');
    
    if (!isActive) {
        navMenu.classList.add('active');
        mobileBtn.innerHTML = '<i class="fas fa-times"></i>';
        mobileBtn.setAttribute('aria-expanded', 'true');
        preventBodyScroll(true);
        
        // Close all dropdowns when mobile menu opens
        closeAllDropdowns();
    } else {
        navMenu.classList.remove('active');
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileBtn.setAttribute('aria-expanded', 'false');
        preventBodyScroll(false);
    }
}

// Initialize search functionality
setupSearch();

// Export functions for external use
window.NavbarFunctions = {
    closeAllDropdowns,
    openMobileMenu,
    closeMobileMenu,
    updateProfileUI,
    setupModuleInteractions,
    preventBodyScroll,
    toggleMobileMenu
};