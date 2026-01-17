// Add to main.js after existing code

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
    
    // Load saved user goal
    const savedGoal = Utils.loadFromStorage('user_goal');
    if (savedGoal && goalSelect) {
        goalSelect.value = savedGoal.value;
    }
});