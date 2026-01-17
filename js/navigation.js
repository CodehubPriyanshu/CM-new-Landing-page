// navigation.js - Enhanced with new dropdown functionality
class Navigation {
    constructor() {
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.exploreBtn = document.querySelector('.explore-btn');
        this.exploreDropdown = document.querySelector('.explore-dropdown');
        this.profileBtn = document.querySelector('.profile-btn');
        this.profileDropdown = document.querySelector('.profile-dropdown');
        this.header = document.querySelector('.header');
        this.searchInput = document.querySelector('.search-input');
        this.searchBtn = document.querySelector('.search-btn');
        this.goalCityBtn = document.querySelector('.goal-city-btn');
        this.goalCityDropdown = document.querySelector('.goal-city-dropdown');
        this.courseOptions = document.querySelectorAll('.course-option');
        this.locationOptions = document.querySelectorAll('.location-option');
        this.courseSearch = document.querySelector('.course-search');
        this.locationSearch = document.querySelector('.location-search');
        this.modifyBtn = document.querySelector('.modify-btn');
        this.skipBtn = document.querySelector('.skip-btn');
        this.continueBtn = document.querySelector('.continue-btn');
        this.courseValue = document.querySelector('.course-value');
        this.steps = document.querySelectorAll('.step');
        this.selectedCourse = null;
        this.selectedLocation = null;
        this.applicationState = {};
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupExploreDropdown();
        this.setupProfileDropdown();
        this.setupStickyHeader();
        this.setupActiveNav();
        this.setupSearch();
        this.setupClickOutside();
        this.setupNavLinks();
    }

    setupMobileMenu() {
        if (!this.mobileMenuBtn || !this.navMenu) return;

        this.mobileMenuBtn.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.mobileMenuBtn.innerHTML = this.navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            
            // Close other dropdowns when mobile menu opens
            if (this.navMenu.classList.contains('active')) {
                this.closeAllDropdowns();
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && 
                !this.mobileMenuBtn.contains(e.target) && 
                this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        this.closeAllDropdowns();
    }

    setupExploreDropdown() {
        if (!this.exploreBtn || !this.exploreDropdown) return;

        // Desktop: Hover
        if (window.innerWidth > 768) {
            this.exploreDropdown.addEventListener('mouseenter', () => {
                this.exploreDropdown.classList.add('active');
                this.closeOtherDropdowns('explore');
            });

            this.exploreDropdown.addEventListener('mouseleave', (e) => {
                // Check if mouse left to a non-dropdown area
                if (!e.relatedTarget || !e.relatedTarget.closest('.explore-dropdown')) {
                    this.exploreDropdown.classList.remove('active');
                }
            });

            // Keep dropdown open when hovering over it
            const megaDropdown = this.exploreDropdown.querySelector('.mega-dropdown');
            if (megaDropdown) {
                megaDropdown.addEventListener('mouseenter', () => {
                    this.exploreDropdown.classList.add('active');
                });

                megaDropdown.addEventListener('mouseleave', (e) => {
                    if (!e.relatedTarget || !e.relatedTarget.closest('.explore-dropdown')) {
                        this.exploreDropdown.classList.remove('active');
                    }
                });
            }
        } else {
            // Mobile: Click
            this.exploreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.exploreDropdown.classList.toggle('active');
                this.closeOtherDropdowns('explore');
                
                // Add close button for mobile
                this.addMobileCloseButton(this.exploreDropdown, '.mega-dropdown');
            });
        }
    }

    setupProfileDropdown() {
        if (!this.profileBtn || !this.profileDropdown) return;

        // Desktop: Hover
        if (window.innerWidth > 768) {
            this.profileDropdown.addEventListener('mouseenter', () => {
                this.profileDropdown.classList.add('active');
                this.closeOtherDropdowns('profile');
            });

            this.profileDropdown.addEventListener('mouseleave', (e) => {
                if (!e.relatedTarget || !e.relatedTarget.closest('.profile-dropdown')) {
                    this.profileDropdown.classList.remove('active');
                }
            });

            // Keep panel open when hovering over it
            const profilePanel = this.profileDropdown.querySelector('.profile-panel');
            if (profilePanel) {
                profilePanel.addEventListener('mouseenter', () => {
                    this.profileDropdown.classList.add('active');
                });

                profilePanel.addEventListener('mouseleave', (e) => {
                    if (!e.relatedTarget || !e.relatedTarget.closest('.profile-dropdown')) {
                        this.profileDropdown.classList.remove('active');
                    }
                });
            }
        } else {
            // Mobile: Click
            this.profileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.profileDropdown.classList.toggle('active');
                this.closeOtherDropdowns('profile');
                
                // Add close button for mobile
                this.addMobileCloseButton(this.profileDropdown, '.profile-panel');
            });
        }
    }

    addMobileCloseButton(dropdownElement, dropdownSelector) {
        if (window.innerWidth > 768) return;

        const dropdown = dropdownElement.querySelector(dropdownSelector);
        if (!dropdown) return;

        // Remove existing close button
        const existingCloseBtn = dropdown.querySelector('.mobile-dropdown-close');
        if (existingCloseBtn) existingCloseBtn.remove();

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-dropdown-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownElement.classList.remove('active');
        });

        dropdown.insertBefore(closeBtn, dropdown.firstChild);
    }

    closeOtherDropdowns(currentDropdown) {
        const dropdowns = ['explore', 'profile'];
        dropdowns.forEach(dropdown => {
            if (dropdown !== currentDropdown) {
                const element = document.querySelector(`.${dropdown}-dropdown`);
                if (element) element.classList.remove('active');
            }
        });
    }

    closeAllDropdowns() {
        document.querySelectorAll('.explore-dropdown, .profile-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }

    setupStickyHeader() {
        if (!this.header) return;

        window.addEventListener('scroll', Utils.throttle(() => {
            if (window.scrollY > 100) {
                this.header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
                this.header.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                this.header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
                this.header.style.background = 'rgba(255, 255, 255, 0.98)';
            }
        }, 100));
    }

    setupActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link:not(.explore-btn)');
        
        window.addEventListener('scroll', Utils.throttle(() => {
            let current = '';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100));
    }

    setupSearch() {
        if (!this.searchBtn || !this.searchInput) return;

        this.searchBtn.addEventListener('click', () => {
            this.performSearch();
        });

        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Live search suggestions
        this.searchInput.addEventListener('input', Utils.debounce(() => {
            const query = this.searchInput.value.trim();
            if (query.length >= 2) {
                this.showSearchSuggestions(query);
            } else {
                this.hideSearchSuggestions();
            }
        }, 300));
    }

    performSearch() {
        const query = this.searchInput.value.trim();
        if (query) {
            // Close all dropdowns
            this.closeAllDropdowns();
            
            // Show search results
            if (window.search) {
                window.search.performSearch(query);
            } else {
                Utils.showNotification(`Searching for: ${query}`, 'info');
            }
        }
    }

    showSearchSuggestions(query) {
        // Create suggestions container
        let suggestionsContainer = document.querySelector('.search-suggestions');
        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'search-suggestions';
            this.searchInput.parentNode.appendChild(suggestionsContainer);
        }

        // Mock suggestions - in real app, this would come from API
        const suggestions = [
            { type: 'college', text: 'MBA Colleges in Bangalore' },
            { type: 'course', text: 'B.Tech Computer Science' },
            { type: 'exam', text: 'CAT 2025 Preparation' },
            { type: 'city', text: 'Colleges in Pune' },
            { type: 'university', text: 'Delhi University' }
        ];

        const filteredSuggestions = suggestions.filter(item => 
            item.text.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (filteredSuggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        suggestionsContainer.innerHTML = filteredSuggestions.map(item => `
            <div class="suggestion-item" data-type="${item.type}">
                <i class="fas ${this.getSuggestionIcon(item.type)}"></i>
                <span>${item.text}</span>
            </div>
        `).join('');

        suggestionsContainer.style.display = 'block';

        // Add click handlers
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.searchInput.value = filteredSuggestions[index].text;
                this.performSearch();
                suggestionsContainer.style.display = 'none';
            });
        });
    }

    getSuggestionIcon(type) {
        const icons = {
            college: 'fa-university',
            course: 'fa-book',
            exam: 'fa-file-alt',
            city: 'fa-map-marker-alt',
            university: 'fa-graduation-cap'
        };
        return icons[type] || 'fa-search';
    }

    hideSearchSuggestions() {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    setupClickOutside() {
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.explore-dropdown') && 
                !e.target.closest('.profile-dropdown') &&
                !e.target.closest('.search-container')) {
                this.closeAllDropdowns();
                this.hideSearchSuggestions();
            }
        });

        // Close dropdowns on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
                this.hideSearchSuggestions();
            }
        });
    }

    setupNavLinks() {
        const navLinks = document.querySelectorAll('.nav-link:not(.explore-btn)');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                // Close mobile menu
                this.closeMobileMenu();
                
                // Close all dropdowns
                this.closeAllDropdowns();
                
                // Scroll to section
                Utils.scrollToElement(targetId.substring(1));
            });
        });
    }

    // Handle window resize
    handleResize() {
        // Switch between hover and click behavior
        this.setupExploreDropdown();
        this.setupProfileDropdown();
    }
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
    
    // Handle window resize
    window.addEventListener('resize', Utils.debounce(() => {
        window.navigation.handleResize();
    }, 250));
});


// Handle window resize
window.addEventListener('resize', Utils.debounce(() => {
    window.navigation.handleResize();
}, 250));

// Add methods to the Navigation class
Navigation.prototype.handleScrollEffects = function() {
    if (!this.header) return;

    window.addEventListener('scroll', Utils.throttle(() => {
        const scrolled = window.scrollY;
        
        // Add scrolled class for background change
        if (scrolled > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        // Parallax effect for hero
        const hero = document.querySelector('.hero');
        if (hero && scrolled < 500) {
            const parallaxValue = scrolled * 0.5;
            hero.style.transform = `translateY(${parallaxValue}px)`;
        }
    }, 100));
};

Navigation.prototype.setupGoalCityDropdown = function() {
    if (!this.goalCityBtn || !this.goalCityDropdown) return;

    // Desktop: Hover
    if (window.innerWidth > 768) {
        this.goalCityDropdown.addEventListener('mouseenter', () => {
            this.goalCityDropdown.classList.add('active');
            this.closeOtherDropdowns('goalCity');
        });

        this.goalCityDropdown.addEventListener('mouseleave', (e) => {
            if (!e.relatedTarget || !e.relatedTarget.closest('.goal-city-dropdown')) {
                this.goalCityDropdown.classList.remove('active');
            }
        });

        // Keep dropdown open when hovering over it
        const goalCityModal = this.goalCityDropdown.querySelector('.goal-city-modal');
        if (goalCityModal) {
            goalCityModal.addEventListener('mouseenter', () => {
                this.goalCityDropdown.classList.add('active');
            });

            goalCityModal.addEventListener('mouseleave', (e) => {
                if (!e.relatedTarget || !e.relatedTarget.closest('.goal-city-dropdown')) {
                    this.goalCityDropdown.classList.remove('active');
                }
            });
        }
    } else {
        // Mobile: Click
        this.goalCityBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            this.goalCityDropdown.classList.toggle('active');
            this.closeOtherDropdowns('goalCity');
            
            // Add close button for mobile
            this.addMobileCloseButton(this.goalCityDropdown, '.goal-city-modal');
        });
        
        // Close dropdown when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (!this.goalCityDropdown.contains(e.target) && 
                this.goalCityDropdown.classList.contains('active') &&
                window.innerWidth <= 768) {
                this.goalCityDropdown.classList.remove('active');
            }
        });
    }

    // Setup course selection
    this.setupCourseSelection();
    
    // Setup location selection
    this.setupLocationSelection();
    
    // Setup modal controls
    this.setupModalControls();
    
    // Setup search functionality
    this.setupSearchFunctionality();
};

Navigation.prototype.setupCourseSelection = function() {
    this.courseOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectCourse(option.dataset.course);
            
            // Move to step 2
            this.goToStep(2);
        });
    });
};

Navigation.prototype.setupLocationSelection = function() {
    this.locationOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectLocation(option.dataset.location);
        });
    });
};

Navigation.prototype.setupModalControls = function() {
    // Skip button
    if (this.skipBtn) {
        this.skipBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeGoalCityDropdown();
        });
    }
    
    // Modify button
    if (this.modifyBtn) {
        this.modifyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.goToStep(1);
        });
    }
    
    // Continue button
    if (this.continueBtn) {
        this.continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.completeSelection();
        });
    }
};

Navigation.prototype.setupSearchFunctionality = function() {
    // Course search
    if (this.courseSearch) {
        this.courseSearch.addEventListener('input', Utils.debounce(() => {
            const searchTerm = this.courseSearch.value.toLowerCase();
            this.filterCourses(searchTerm);
        }, 300));
    }
    
    // Location search
    if (this.locationSearch) {
        this.locationSearch.addEventListener('input', Utils.debounce(() => {
            const searchTerm = this.locationSearch.value.toLowerCase();
            this.filterLocations(searchTerm);
        }, 300));
    }
};

Navigation.prototype.selectCourse = function(course) {
    this.selectedCourse = course;
    if (this.courseValue) {
        this.courseValue.textContent = course;
    }
    
    // Update application state
    this.applicationState.course = course;
};

Navigation.prototype.selectLocation = function(location) {
    this.selectedLocation = location;
    
    // Update application state
    this.applicationState.location = location;
    
    // Optionally update UI to show selected location
    this.highlightSelectedLocation(location);
};

Navigation.prototype.highlightSelectedLocation = function(location) {
    // Remove previous selections
    this.locationOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Highlight the selected location
    const selectedOption = Array.from(this.locationOptions).find(
        opt => opt.dataset.location === location
    );
    
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
};

Navigation.prototype.goToStep = function(stepNumber) {
    // Hide all steps
    this.steps.forEach(step => {
        step.classList.remove('active');
    });

    // Show the requested step
    const targetStep = document.querySelector(`.step-${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }
};

Navigation.prototype.filterCourses = function(searchTerm) {
    const allCategories = document.querySelectorAll('.course-category');
    
    allCategories.forEach(category => {
        const categoryVisible = Array.from(category.querySelectorAll('.course-option')).some(option => {
            return option.dataset.course.toLowerCase().includes(searchTerm);
        });
        
        if (searchTerm === '') {
            category.style.display = 'block';
            category.querySelectorAll('.course-option').forEach(option => {
                option.style.display = 'block';
            });
        } else {
            category.style.display = categoryVisible ? 'block' : 'none';
            
            category.querySelectorAll('.course-option').forEach(option => {
                if (option.dataset.course.toLowerCase().includes(searchTerm)) {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            });
        }
    });
};

Navigation.prototype.filterLocations = function(searchTerm) {
    const allLocationOptions = document.querySelectorAll('.location-option');
    
    allLocationOptions.forEach(option => {
        if (searchTerm === '') {
            option.style.display = 'block';
        } else if (option.dataset.location.toLowerCase().includes(searchTerm)) {
            option.style.display = 'block';
        } else {
            option.style.display = 'none';
        }
    });
};

Navigation.prototype.completeSelection = function() {
    // Store the selected course and location in application state
    if (this.selectedCourse && this.selectedLocation) {
        this.applicationState.selectedCourse = this.selectedCourse;
        this.applicationState.selectedLocation = this.selectedLocation;
        
        // Update the button text to reflect selection
        this.updateGoalCityButtonText();
        
        // Close the dropdown
        this.closeGoalCityDropdown();
        
        // Show success notification
        Utils.showNotification('Your study preference has been saved!', 'success');
    } else {
        Utils.showNotification('Please select both a course and a location.', 'warning');
    }
};

Navigation.prototype.updateGoalCityButtonText = function() {
    if (this.goalCityBtn && this.selectedCourse && this.selectedLocation) {
        const buttonText = `${this.selectedCourse} in ${this.selectedLocation}`;
        this.goalCityBtn.innerHTML = `<i class="fas fa-bullseye"></i><span>${buttonText}</span>`;
        
        // Add a class to indicate selection has been made
        this.goalCityBtn.classList.add('selected');
    }
};

Navigation.prototype.closeGoalCityDropdown = function() {
    if (this.goalCityDropdown) {
        this.goalCityDropdown.classList.remove('active');
    }
};

Navigation.prototype.closeOtherDropdowns = function(currentDropdown) {
    const dropdowns = ['explore', 'profile', 'goalCity'];
    dropdowns.forEach(dropdown => {
        if (dropdown !== currentDropdown) {
            const element = document.querySelector(`.${dropdown}-dropdown`);
            if (element) element.classList.remove('active');
        }
    });
};