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
    
    // Desktop-specific event handling
    if (window.innerWidth > 768) {
        setupDesktopDropdowns();
    } else {
        setupMobileDropdowns();
    }
    
    // Listen for window resize to adjust behavior
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            setupDesktopDropdowns();
        } else {
            setupMobileDropdowns();
        }
        
        // If profile content is currently displayed and screen size changes,
        // we might need to adjust the display behavior
        const profileContentArea = document.getElementById('profileContentArea');
        if (profileContentArea && profileContentArea.style.display === 'block' && window.innerWidth <= 768) {
            // On mobile, hide the content area and show the dropdown instead
            profileContentArea.style.display = 'none';
            document.body.classList.remove('profile-content-visible');
            const heroSection = document.getElementById('home');
            if (heroSection) {
                heroSection.style.display = 'block';
            }
        }
    });
}

// Setup desktop-specific dropdown behavior
function setupDesktopDropdowns() {
    // Explore dropdown - hover only on desktop
    const exploreDropdown = document.querySelector('.explore-dropdown');
    if (exploreDropdown) {
        // Remove click listeners to ensure hover-only behavior
        const exploreBtn = exploreDropdown.querySelector('.explore-btn');
        if (exploreBtn) {
            exploreBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                // On desktop, clicking should not open the dropdown
                // Hover interaction is used instead
            };
        }
        
        // Ensure hover behavior works
        exploreDropdown.addEventListener('mouseenter', function() {
            this.classList.add('active');
            // Update aria-expanded for accessibility
            const exploreBtn = this.querySelector('.explore-btn');
            if (exploreBtn) {
                exploreBtn.setAttribute('aria-expanded', 'true');
            }
        });
        
        exploreDropdown.addEventListener('mouseleave', function() {
            this.classList.remove('active');
            // Update aria-expanded for accessibility
            const exploreBtn = this.querySelector('.explore-btn');
            if (exploreBtn) {
                exploreBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Profile dropdown - click only on desktop
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileDropdown) {
        // Remove hover listeners to ensure click-only behavior
        profileDropdown.removeEventListener('mouseenter', handleProfileHover);
        profileDropdown.removeEventListener('mouseleave', handleProfileLeave);
        
        // Add click listener for profile
        const profileBtn = profileDropdown.querySelector('.profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Instead of showing the dropdown, show the profile content in main content area
                showProfileContent();
            });
        }
    }
}

// Setup mobile-specific dropdown behavior
function setupMobileDropdowns() {
    // Explore dropdown - click only on mobile
    const exploreDropdown = document.querySelector('.explore-dropdown');
    if (exploreDropdown) {
        // Clear previous event listeners
        exploreDropdown.removeEventListener('mouseenter', null);
        exploreDropdown.removeEventListener('mouseleave', null);
        
        const exploreBtn = exploreDropdown.querySelector('.explore-btn');
        if (exploreBtn) {
            // Remove any previous click handlers
            exploreBtn.replaceWith(exploreBtn.cloneNode(true)); // This removes all event listeners
            const newExploreBtn = exploreDropdown.querySelector('.explore-btn');
            newExploreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isActive = exploreDropdown.classList.contains('active');
                
                closeAllDropdowns();
                
                if (!isActive) {
                    exploreDropdown.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                } else {
                    this.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }
    
    // Profile dropdown - click only on mobile
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileDropdown) {
        const profileBtn = profileDropdown.querySelector('.profile-btn');
        if (profileBtn) {
            // Remove any previous click handlers
            profileBtn.replaceWith(profileBtn.cloneNode(true)); // This removes all event listeners
            const newProfileBtn = profileDropdown.querySelector('.profile-btn');
            newProfileBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // On mobile, continue to use the dropdown behavior
                const isActive = profileDropdown.classList.contains('active');
                
                closeAllDropdowns();
                
                if (!isActive) {
                    profileDropdown.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                } else {
                    this.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }
}

// Setup mobile menu functionality
function setupMobileMenu() {
    // Mobile sidebar is handled by toggleMobileMenu function
    // This function is kept for backward compatibility but does nothing
    console.log('Mobile menu setup - using mobile sidebar system');
}

function openMobileMenu() {
    // Use the mobile sidebar system instead
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (mobileBtn && mobileSidebar && sidebarOverlay) {
        mobileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        mobileBtn.innerHTML = '<i class="fas fa-times"></i>';
        mobileBtn.setAttribute('aria-expanded', 'true');
        preventBodyScroll(true);
    }
}

function closeMobileMenu() {
    // Use the mobile sidebar system instead
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (mobileBtn && mobileSidebar && sidebarOverlay) {
        mobileSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileBtn.setAttribute('aria-expanded', 'false');
        preventBodyScroll(false);
    }
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
    // Profile dropdown is handled in setupDropdowns function
    console.log('Profile dropdown functionality managed in setupDropdowns');
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

// Show profile content in main content area (desktop) or dropdown (mobile)
function showProfileContent() {
    // Check screen size to determine behavior
    if (window.innerWidth > 768) {
        // Desktop behavior: show profile content in main content area
        showProfileInContentArea();
    } else {
        // Mobile behavior: use dropdown as before
        showProfileDropdown();
    }
}

// Show profile content in main content area
function showProfileInContentArea() {
    // Close all dropdowns first
    closeAllDropdowns();
    
    // Hide the hero section and other main content if needed
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroSection.style.display = 'none';
    }
    
    // Show the profile content area
    const profileContentArea = document.getElementById('profileContentArea');
    if (profileContentArea) {
        profileContentArea.style.display = 'block';
        
        // Add class to body for proper styling
        document.body.classList.add('profile-content-visible');
        
        // Scroll to the profile content area
        profileContentArea.scrollIntoView({ behavior: 'smooth' });
    }
}

// Show profile dropdown (for mobile)
function showProfileDropdown() {
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileDropdown) {
        profileDropdown.classList.add('active');
        const profileBtn = document.querySelector('.profile-btn');
        if (profileBtn) {
            profileBtn.setAttribute('aria-expanded', 'true');
        }
    }
}

// Close profile content and show main content again
function closeProfileContent() {
    // Hide the profile content area
    const profileContentArea = document.getElementById('profileContentArea');
    if (profileContentArea) {
        profileContentArea.style.display = 'none';
    }
    
    // Show the hero section and other main content
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroSection.style.display = 'block';
    }
    
    // Remove class from body
    document.body.classList.remove('profile-content-visible');
    
    // Close any open profile dropdown
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileDropdown) {
        profileDropdown.classList.remove('active');
        const profileBtn = document.querySelector('.profile-btn');
        if (profileBtn) {
            profileBtn.setAttribute('aria-expanded', 'false');
        }
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
    
    // Also close mobile sidebar if it's open
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    if (mobileSidebar && mobileSidebar.classList.contains('active')) {
        mobileSidebar.classList.remove('active');
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
        if (mobileBtn) {
            mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileBtn.setAttribute('aria-expanded', 'false');
        }
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }
    
    // Also close old mobile menu if it's open
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
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (!mobileBtn || !mobileSidebar || !sidebarOverlay) return;
    
    const isSidebarActive = mobileSidebar.classList.contains('active');
    
    if (!isSidebarActive) {
        mobileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        mobileBtn.innerHTML = '<i class="fas fa-times"></i>';
        mobileBtn.setAttribute('aria-expanded', 'true');
        preventBodyScroll(true);
        
        // Close all dropdowns when mobile sidebar opens
        closeAllDropdowns();
        
        // Ensure proper focus management
        const firstFocusableElement = mobileSidebar.querySelector('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
    } else {
        mobileSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileBtn.setAttribute('aria-expanded', 'false');
        preventBodyScroll(false);
    }
}

// Close mobile sidebar when back button is clicked
function setupSidebarBackButton() {
    const backBtn = document.getElementById('sidebarBackBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    if (backBtn && mobileSidebar && sidebarOverlay && mobileBtn) {
        backBtn.addEventListener('click', function() {
            mobileSidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileBtn.setAttribute('aria-expanded', 'false');
            preventBodyScroll(false);
        });
    }
}

// Close mobile sidebar when overlay is clicked
function setupSidebarOverlay() {
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    if (sidebarOverlay && mobileSidebar && mobileBtn) {
        sidebarOverlay.addEventListener('click', function() {
            mobileSidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileBtn.setAttribute('aria-expanded', 'false');
            preventBodyScroll(false);
        });
    }
}

// Set up category item click handlers
function setupCategoryItems() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const categoryName = this.querySelector('span').textContent;
            console.log(`Category selected: ${categoryName}`);
            
            // Here you can implement navigation or show details for the selected category
            // For now, we'll just log the selection
            alert(`You selected: ${categoryName}\nThis would navigate to the ${categoryName} category page.`);
            
            // Close the sidebar after selection
            closeMobileSidebar();
        });
    });
}

// Set up quick action card click handlers
function setupQuickActionCards() {
    const quickCards = document.querySelectorAll('.quick-card');
    
    quickCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardText = this.querySelector('span').textContent;
            console.log(`Quick action selected: ${cardText}`);
            
            alert(`You selected: ${cardText}\nThis would open the ${cardText} feature.`);
            
            // Close the sidebar after selection
            closeMobileSidebar();
        });
    });
}

// Set up career card click handlers
function setupCareerCards() {
    const careerCards = document.querySelectorAll('.career-card');
    
    careerCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardText = this.querySelector('span').textContent;
            console.log(`Career card selected: ${cardText}`);
            
            alert(`You selected: ${cardText}\nThis would open the ${cardText} feature.`);
            
            // Close the sidebar after selection
            closeMobileSidebar();
        });
    });
}

// Set up popular links click handlers
function setupPopularLinks() {
    const popularLinks = document.querySelectorAll('.popular-links-list a');
    
    popularLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.querySelector('span').textContent;
            console.log(`Popular link selected: ${linkText}`);
            
            alert(`You selected: ${linkText}\nThis would navigate to the ${linkText} page.`);
            
            // Close the sidebar after selection
            closeMobileSidebar();
        });
    });
}

// Set up study abroad expandable rows
function setupStudyAbroadRows() {
    const expandableRows = document.querySelectorAll('.expandable-row');
    
    expandableRows.forEach(row => {
        row.addEventListener('click', function() {
            const rowText = this.querySelector('span').textContent;
            console.log(`Study abroad row selected: ${rowText}`);
            
            // Toggle expanded state
            this.classList.toggle('expanded');
            
            // Change the plus/minus icon
            const icon = this.querySelector('i');
            if (this.classList.contains('expanded')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
            
            // In a real implementation, you would show/hide additional content
            // For now, just show an alert
            alert(`You selected: ${rowText}\nThis would show more details about ${rowText}.`);
            
            // Close the sidebar after selection
            closeMobileSidebar();
        });
    });
}

// Set up goal input click handler
function setupGoalInput() {
    const goalInput = document.querySelector('.goal-input-wrapper input');
    const editIcon = document.querySelector('.goal-input-wrapper .edit-icon');
    
    if (goalInput) {
        goalInput.addEventListener('click', function() {
            console.log('Goal input clicked');
            alert('This would open the goal selection modal.');
        });
    }
    
    if (editIcon) {
        editIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Edit icon clicked');
            alert('This would open the goal editing interface.');
        });
    }
}

// Set up 'All Courses' link functionality
function setupAllCoursesLink() {
    const allCoursesLink = document.querySelector('.all-courses-link');
    
    if (allCoursesLink) {
        allCoursesLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('All Courses link clicked');
            
            alert('This would show all available courses.\nNavigating to the complete course catalog.');
            
            // Close the sidebar after selection
            closeMobileSidebar();
            // window.location.href = '/courses'; // Replace with actual URL
        });
    }
}

// Helper function to close mobile sidebar
function closeMobileSidebar() {
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileSidebar) {
        mobileSidebar.classList.remove('active');
    }
    if (sidebarOverlay) {
        sidebarOverlay.classList.remove('active');
    }
    if (mobileBtn) {
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileBtn.setAttribute('aria-expanded', 'false');
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
}

// Initialize search functionality
setupSearch();

// Setup mobile sidebar functionality
setupSidebarBackButton();
setupSidebarOverlay();
setupCategoryItems();
setupQuickActionCards();
setupCareerCards();
setupPopularLinks();
setupStudyAbroadRows();
setupGoalInput();
setupAllCoursesLink();

// Connect hamburger menu button to toggle function
const hamburgerBtn = document.querySelector('.mobile-menu-btn');
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
}

// Setup profile content close button
function setupProfileContentClose() {
    const closeProfileBtn = document.getElementById('closeProfileBtn');
    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', function() {
            closeProfileContent();
        });
    }
}

// Initialize profile content close functionality
setupProfileContentClose();

// Export functions for external use
window.NavbarFunctions = {
    closeAllDropdowns,
    openMobileMenu,
    closeMobileMenu,
    updateProfileUI,
    setupModuleInteractions,
    preventBodyScroll,
    toggleMobileMenu,
    showProfileContent,
    closeProfileContent
};