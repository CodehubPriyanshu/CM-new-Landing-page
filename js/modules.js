// modules.js - Enhanced dropdown modules functionality

class ModulesManager {
    constructor() {
        this.exploreBtn = document.querySelector('.explore-btn');
        this.exploreDropdown = document.querySelector('.explore-dropdown');
        this.profileBtn = document.querySelector('.profile-btn');
        this.profileDropdown = document.querySelector('.profile-dropdown');
        this.goalInput = document.getElementById('selectGoal');
        this.init();
    }

    init() {
        this.setupExploreModule();
        this.setupProfileModule();
        this.setupGoalSelection();
        this.setupClickOutside();
        this.setupKeyboardNavigation();
    }

    setupExploreModule() {
        if (!this.exploreBtn || !this.exploreDropdown) return;

        // Desktop: Hover behavior
        if (window.innerWidth > 768) {
            this.exploreDropdown.addEventListener('mouseenter', () => {
                this.openModule('explore');
                this.adjustModulePosition('explore');
            });

            this.exploreDropdown.addEventListener('mouseleave', (e) => {
                if (!e.relatedTarget || !e.relatedTarget.closest('.explore-dropdown')) {
                    this.closeModule('explore');
                }
            });

            // Keep module open when hovering over content
            const exploreModule = this.exploreDropdown.querySelector('.explore-module');
            if (exploreModule) {
                exploreModule.addEventListener('mouseenter', () => {
                    this.openModule('explore');
                });

                exploreModule.addEventListener('mouseleave', (e) => {
                    if (!e.relatedTarget || !e.relatedTarget.closest('.explore-dropdown')) {
                        this.closeModule('explore');
                    }
                });
            }
        } else {
            // Mobile: Click behavior
            this.exploreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (this.exploreDropdown.classList.contains('active')) {
                    this.closeModule('explore');
                } else {
                    this.openModule('explore');
                    this.adjustModulePosition('explore');
                }
            });
        }
    }

    setupProfileModule() {
        if (!this.profileBtn || !this.profileDropdown) return;

        // Desktop: Hover behavior
        if (window.innerWidth > 768) {
            this.profileDropdown.addEventListener('mouseenter', () => {
                this.openModule('profile');
                this.adjustModulePosition('profile');
            });

            this.profileDropdown.addEventListener('mouseleave', (e) => {
                if (!e.relatedTarget || !e.relatedTarget.closest('.profile-dropdown')) {
                    this.closeModule('profile');
                }
            });

            // Keep module open when hovering over content
            const profileModule = this.profileDropdown.querySelector('.profile-module');
            if (profileModule) {
                profileModule.addEventListener('mouseenter', () => {
                    this.openModule('profile');
                });

                profileModule.addEventListener('mouseleave', (e) => {
                    if (!e.relatedTarget || !e.relatedTarget.closest('.profile-dropdown')) {
                        this.closeModule('profile');
                    }
                });
            }
        } else {
            // Mobile: Click behavior
            this.profileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (this.profileDropdown.classList.contains('active')) {
                    this.closeModule('profile');
                } else {
                    this.openModule('profile');
                    this.adjustModulePosition('profile');
                }
            });
        }
    }

    setupGoalSelection() {
        if (!this.goalInput) return;

        this.goalInput.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Show goal selection modal or dropdown
            this.showGoalSelection();
        });

        // Also handle the edit icon click
        const editIcon = this.goalInput.nextElementSibling;
        if (editIcon) {
            editIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showGoalSelection();
            });
        }
    }

    showGoalSelection() {
        // Create and show goal selection modal
        const modal = document.createElement('div');
        modal.className = 'goal-selection-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Select Your Study Goal</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="goal-options">
                            <button class="goal-option" data-goal="Engineering">Engineering</button>
                            <button class="goal-option" data-goal="Management">Management</button>
                            <button class="goal-option" data-goal="Medical">Medical</button>
                            <button class="goal-option" data-goal="Commerce">Commerce</button>
                            <button class="goal-option" data-goal="Arts">Arts</button>
                            <button class="goal-option" data-goal="Science">Science</button>
                            <button class="goal-option" data-goal="Law">Law</button>
                            <button class="goal-option" data-goal="Design">Design</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        const goalOptions = modal.querySelectorAll('.goal-option');

        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        goalOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedGoal = option.dataset.goal;
                this.goalInput.value = selectedGoal;
                this.saveGoalPreference(selectedGoal);
                closeModal();
            });
        });

        // Close on ESC key
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    saveGoalPreference(goal) {
        // Save to localStorage
        localStorage.setItem('careerMantraGoal', goal);
        
        // Update UI
        Utils.showNotification(`Goal set to: ${goal}`, 'success');
        
        // Update button state if needed
        this.updateGoalButton(goal);
    }

    updateGoalButton(goal) {
        const goalCityBtn = document.querySelector('.goal-city-btn');
        if (goalCityBtn) {
            goalCityBtn.innerHTML = `<i class="fas fa-bullseye"></i><span>${goal}</span>`;
            goalCityBtn.classList.add('selected');
        }
    }

    openModule(moduleType) {
        // Close other modules first
        this.closeAllModules();
        
        const dropdown = moduleType === 'explore' ? this.exploreDropdown : this.profileDropdown;
        const btn = moduleType === 'explore' ? this.exploreBtn : this.profileBtn;
        
        if (dropdown) {
            // Instant display - no animations
            dropdown.classList.add('active');
            
            if (btn) {
                btn.setAttribute('aria-expanded', 'true');
                btn.classList.add('active');
            }
            
            // Immediate position adjustment
            this.adjustModulePosition(moduleType);
        }
    }

    closeModule(moduleType) {
        const dropdown = moduleType === 'explore' ? this.exploreDropdown : this.profileDropdown;
        const btn = moduleType === 'explore' ? this.exploreBtn : this.profileBtn;
        
        if (dropdown) {
            // Instant close - no animations
            dropdown.classList.remove('active');
            
            if (btn) {
                btn.setAttribute('aria-expanded', 'false');
                btn.classList.remove('active');
            }
        }
    }

    closeAllModules() {
        const modules = ['explore', 'profile'];
        modules.forEach(module => this.closeModule(module));
    }

    setupClickOutside() {
        document.addEventListener('click', (e) => {
            // Close modules when clicking outside
            if (!e.target.closest('.explore-dropdown') && 
                !e.target.closest('.profile-dropdown')) {
                this.closeAllModules();
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC key closes all modules
            if (e.key === 'Escape') {
                this.closeAllModules();
            }
            
            // Tab navigation improvements
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    handleTabNavigation(e) {
        const activeExplore = this.exploreDropdown?.classList.contains('active');
        const activeProfile = this.profileDropdown?.classList.contains('active');
        
        if (activeExplore || activeProfile) {
            const currentModule = activeExplore ? this.exploreDropdown : this.profileDropdown;
            const focusableElements = currentModule.querySelectorAll(
                'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }

    // Public methods for external control
    toggleExplore() {
        if (this.exploreDropdown.classList.contains('active')) {
            this.closeModule('explore');
        } else {
            this.openModule('explore');
        }
    }

    toggleProfile() {
        if (this.profileDropdown.classList.contains('active')) {
            this.closeModule('profile');
        } else {
            this.openModule('profile');
        }
    }

    adjustModulePosition(moduleType) {
        // Perfect dropdown positioning directly below buttons
        const dropdown = moduleType === 'explore' ? this.exploreDropdown : this.profileDropdown;
        const module = dropdown.querySelector('.explore-module, .profile-module');
        
        if (!module) return;
        
        // Get viewport and element dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get precise measurements
        const moduleRect = module.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();
        
        // Reset all positioning styles to defaults
        module.style.left = '';
        module.style.right = '';
        module.style.top = '';
        module.style.bottom = '';
        module.style.transform = '';
        module.style.transition = 'none';
        
        // Set perfect vertical positioning - exactly below the button
        module.style.top = '100%';
        module.style.bottom = 'auto';
        
        // Perfect horizontal positioning
        if (moduleType === 'explore') {
            // Explore module - align left edge with navbar/container
            module.style.left = '0';
            module.style.right = 'auto';
            
            // Boundary check - if module extends beyond right edge
            if (dropdownRect.left + moduleRect.width > viewportWidth - 20) {
                // Adjust to stay within viewport
                const overflow = (dropdownRect.left + moduleRect.width) - (viewportWidth - 20);
                module.style.left = `-${overflow}px`;
            }
        } else {
            // Profile module - align right edge with profile button
            module.style.right = '0';
            module.style.left = 'auto';
            
            // Boundary check - if module extends beyond left edge
            if (dropdownRect.right - moduleRect.width < 20) {
                // Adjust to stay within viewport
                const overflow = 20 - (dropdownRect.right - moduleRect.width);
                module.style.right = `-${overflow}px`;
            }
        }
        
        // Vertical overflow check - flip if needed
        const moduleBottom = dropdownRect.bottom + moduleRect.height + 10;
        if (moduleBottom > viewportHeight - 20) {
            // Module would go below viewport - flip above the button
            module.classList.add('flipped');
        } else {
            // Normal positioning below - remove flipped class
            module.classList.remove('flipped');
        }
        
        // Final cleanup - ensure no animations
        module.style.transition = 'none';
        module.style.transform = 'none';
        
        // Force reflow for immediate positioning
        module.offsetHeight;
    }

    loadSavedPreferences() {
        // Load saved goal preference
        const savedGoal = localStorage.getItem('careerMantraGoal');
        if (savedGoal && this.goalInput) {
            this.goalInput.value = savedGoal;
            this.updateGoalButton(savedGoal);
        }
    }
}

// Initialize modules manager
document.addEventListener('DOMContentLoaded', () => {
    window.modulesManager = new ModulesManager();
    
    // Load saved preferences
    window.modulesManager.loadSavedPreferences();
    
    // Handle window resize
    window.addEventListener('resize', Utils.debounce(() => {
        // Re-setup modules on resize for responsive behavior
        window.modulesManager.setupExploreModule();
        window.modulesManager.setupProfileModule();
    }, 250));
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModulesManager;
}