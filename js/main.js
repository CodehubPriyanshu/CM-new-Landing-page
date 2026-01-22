// Add to main.js after existing code

// Function to handle college image loading
function initCollegeImageLoading() {
    // Select all college images in both sections
    const collegeImages = document.querySelectorAll('.student-choice-colleges .college-image img, .placement-verified-colleges .college-image img');
    
    collegeImages.forEach(img => {
        // Check if image is already loaded
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            // Add loaded class when image finishes loading
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            
            // Also handle error case
            img.addEventListener('error', function() {
                console.error('Failed to load image:', this.src);
                // Still add loaded class to ensure it's visible even if broken
                this.classList.add('loaded');
            });
        }
    });
}

// Initialize dropdown interactions
function initDropdownInteractions() {
    // Handle goal selection in profile dropdown
    const goalSelect = document.getElementById('goalSelect');
    if (goalSelect) {
        goalSelect.addEventListener('change', function() {
            if (this.value) {
                Utils.showNotification(`Goal set to: ${this.options[this.selectedIndex].text}`, 'success');
                // Save goal preference
                Utils.saveToStorage('user_goal', {
                    value: this.value,
                    text: this.options[this.selectedIndex].text,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    // Handle login/register button in profile dropdown
    const loginBtn = document.querySelector('.auth-section .btn-primary');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            modals.showApplicationModal('Login / Register');
        });
    }

    // Handle write review button
    const reviewBtn = document.querySelector('.review-section .btn-outline');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', () => {
            Utils.showNotification('Review writing feature coming soon!', 'info');
        });
    }

    // Handle app store buttons
    const appButtons = document.querySelectorAll('.app-btn');
    appButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const store = btn.querySelector('span').textContent;
            Utils.showNotification(`Redirecting to ${store}...`, 'info');
        });
    });

    // Handle mega dropdown items
    const megaDropdownItems = document.querySelectorAll('.mega-dropdown a');
    megaDropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const itemText = item.textContent.trim();
            Utils.showNotification(`Loading ${itemText}...`, 'info');
            
            // Close dropdown on mobile
            if (window.innerWidth <= 768) {
                window.navigation.closeAllDropdowns();
            }
        });
    });

    // Handle featured items
    const featuredItems = document.querySelectorAll('.featured-item');
    featuredItems.forEach(item => {
        item.addEventListener('click', () => {
            const itemTitle = item.querySelector('h5').textContent;
            Utils.showNotification(`Opening ${itemTitle}...`, 'info');
            
            // Close dropdown on mobile
            if (window.innerWidth <= 768) {
                window.navigation.closeAllDropdowns();
            }
        });
    });
}

// Update main initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Career Mantra Website Initialized');
    
    // Initialize all components
    this.initComponents();
    this.setupEventListeners();
    this.updateFooterYear();
    this.checkBrowserCompatibility();
    initDropdownInteractions(); // Add this line
    initCollegeImageLoading(); // Add this line to handle college image loading
    
    // Load saved user goal
    const savedGoal = Utils.loadFromStorage('user_goal');
    if (savedGoal && goalSelect) {
        goalSelect.value = savedGoal.value;
    }
});