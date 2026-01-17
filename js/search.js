// search.js - Search functionality
class Search {
    constructor() {
        this.searchInputs = document.querySelectorAll('.search-input, .search-box-large input');
        this.searchButtons = document.querySelectorAll('.search-btn, .search-box-large .btn');
        this.searchResults = [];
        this.init();
    }

    init() {
        this.setupSearchEvents();
        this.setupSearchData();
    }

    setupSearchEvents() {
        // Search button click events
        this.searchButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const searchInput = this.searchInputs[index];
                this.performSearch(searchInput.value.trim());
            });
        });

        // Enter key events
        this.searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(input.value.trim());
                }
            });
        });

        // Live search on input
        this.searchInputs.forEach(input => {
            input.addEventListener('input', Utils.debounce((e) => {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    this.showLiveSuggestions(query);
                } else {
                    this.hideLiveSuggestions();
                }
            }, 300));
        });
    }

    setupSearchData() {
        // Mock search data - in real app, this would come from API
        this.searchData = {
            colleges: [
                'International Institute of Business Studies, Bangalore',
                'Bennett University, Greater Noida',
                'Lovely Professional University, Jalandhar',
                'Amity University, Noida',
                'Alliance University, Bangalore',
                'Chandigarh Group of Colleges, Chandigarh'
            ],
            courses: [
                'MBA - Master of Business Administration',
                'B.Tech - Bachelor of Technology',
                'LLB - Bachelor of Laws',
                'BBA - Bachelor of Business Administration',
                'MCA - Master of Computer Applications',
                'B.Com - Bachelor of Commerce'
            ],
            cities: [
                'Pune', 'Mumbai', 'Delhi', 'Bangalore',
                'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'
            ],
            exams: [
                'MAT - Management Aptitude Test',
                'XAT - Xavier Aptitude Test',
                'CAT - Common Admission Test',
                'GATE - Graduate Aptitude Test in Engineering',
                'JEE - Joint Entrance Examination',
                'NEET - National Eligibility cum Entrance Test'
            ]
        };
    }

    performSearch(query) {
        if (!query) {
            Utils.showNotification('Please enter a search term', 'warning');
            return;
        }

        // Show loading state
        Utils.showNotification(`Searching for "${query}"...`, 'info');

        // Simulate API call
        setTimeout(() => {
            const results = this.searchEverything(query);
            this.displaySearchResults(results, query);
        }, 500);
    }

    searchEverything(query) {
        const results = [];
        const queryLower = query.toLowerCase();

        // Search in colleges
        this.searchData.colleges.forEach(college => {
            if (college.toLowerCase().includes(queryLower)) {
                results.push({
                    type: 'college',
                    title: college,
                    description: 'Top ranked college with excellent placements'
                });
            }
        });

        // Search in courses
        this.searchData.courses.forEach(course => {
            if (course.toLowerCase().includes(queryLower)) {
                results.push({
                    type: 'course',
                    title: course,
                    description: 'Popular course with high demand'
                });
            }
        });

        // Search in cities
        this.searchData.cities.forEach(city => {
            if (city.toLowerCase().includes(queryLower)) {
                results.push({
                    type: 'city',
                    title: city,
                    description: 'Find colleges in this city'
                });
            }
        });

        // Search in exams
        this.searchData.exams.forEach(exam => {
            if (exam.toLowerCase().includes(queryLower)) {
                results.push({
                    type: 'exam',
                    title: exam,
                    description: 'Upcoming exam details and dates'
                });
            }
        });

        return results;
    }

    displaySearchResults(results, query) {
        if (results.length === 0) {
            Utils.showNotification(`No results found for "${query}"`, 'warning');
            return;
        }

        // Create results modal
        this.createResultsModal(results, query);
    }

    createResultsModal(results, query) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.search-results-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'search-results-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Search Results for "${query}"</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="results-count">Found ${results.length} results</div>
                    <div class="results-list">
                        ${results.map((result, index) => `
                            <div class="result-item" data-type="${result.type}">
                                <div class="result-icon">
                                    <i class="fas ${this.getIconForType(result.type)}"></i>
                                </div>
                                <div class="result-content">
                                    <h4>${result.title}</h4>
                                    <p>${result.description}</p>
                                </div>
                                <button class="btn btn-sm btn-outline view-result">View</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .search-results-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
            }
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
            }
            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 10px;
                width: 90%;
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
                animation: scaleIn 0.3s ease;
            }
            .modal-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header h3 {
                margin: 0;
                color: #2962ff;
            }
            .close-modal {
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            .modal-body {
                padding: 20px;
            }
            .results-count {
                color: #666;
                margin-bottom: 20px;
            }
            .result-item {
                display: flex;
                align-items: center;
                padding: 15px;
                border: 1px solid #eee;
                border-radius: 8px;
                margin-bottom: 10px;
                transition: all 0.3s ease;
            }
            .result-item:hover {
                border-color: #2962ff;
                box-shadow: 0 2px 8px rgba(41, 98, 255, 0.1);
            }
            .result-icon {
                width: 40px;
                height: 40px;
                background: #f0f4ff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                color: #2962ff;
            }
            .result-content {
                flex: 1;
            }
            .result-content h4 {
                margin: 0 0 5px 0;
                color: #333;
            }
            .result-content p {
                margin: 0;
                color: #666;
                font-size: 14px;
            }
            .btn-sm {
                padding: 5px 15px;
                font-size: 12px;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.remove();
        });

        // View result buttons
        modal.querySelectorAll('.view-result').forEach((button, index) => {
            button.addEventListener('click', () => {
                this.handleResultClick(results[index]);
                modal.remove();
            });
        });
    }

    getIconForType(type) {
        const icons = {
            college: 'fa-university',
            course: 'fa-graduation-cap',
            city: 'fa-map-marker-alt',
            exam: 'fa-file-alt'
        };
        return icons[type] || 'fa-search';
    }

    handleResultClick(result) {
        switch (result.type) {
            case 'college':
                Utils.showNotification(`Loading ${result.title} details...`, 'info');
                // In real app: navigate to college page
                break;
            case 'course':
                Utils.showNotification(`Showing courses: ${result.title}`, 'info');
                // In real app: filter by course
                break;
            case 'city':
                Utils.showNotification(`Showing colleges in ${result.title}`, 'info');
                // In real app: filter by city
                break;
            case 'exam':
                Utils.showNotification(`Showing ${result.title} details`, 'info');
                // In real app: show exam details
                break;
        }
    }

    showLiveSuggestions(query) {
        // Create suggestions container
        let suggestionsContainer = document.querySelector('.search-suggestions');
        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'search-suggestions';
            document.querySelector('.search-container').appendChild(suggestionsContainer);
        }

        // Get matching suggestions
        const suggestions = this.getSuggestions(query);
        
        if (suggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        // Display suggestions
        suggestionsContainer.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item">
                <i class="fas ${this.getIconForType(suggestion.type)}"></i>
                <span>${suggestion.text}</span>
            </div>
        `).join('');

        suggestionsContainer.style.display = 'block';

        // Add click handlers
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.searchInputs[0].value = suggestions[index].text;
                this.performSearch(suggestions[index].text);
                suggestionsContainer.style.display = 'none';
            });
        });
    }

    getSuggestions(query) {
        const suggestions = [];
        const queryLower = query.toLowerCase();

        // Add matching items from all categories
        this.searchData.colleges.forEach(college => {
            if (college.toLowerCase().includes(queryLower)) {
                suggestions.push({ type: 'college', text: college });
            }
        });

        this.searchData.courses.forEach(course => {
            if (course.toLowerCase().includes(queryLower)) {
                suggestions.push({ type: 'course', text: course });
            }
        });

        this.searchData.cities.forEach(city => {
            if (city.toLowerCase().includes(queryLower)) {
                suggestions.push({ type: 'city', text: city });
            }
        });

        this.searchData.exams.forEach(exam => {
            if (exam.toLowerCase().includes(queryLower)) {
                suggestions.push({ type: 'exam', text: exam });
            }
        });

        return suggestions.slice(0, 5); // Limit to 5 suggestions
    }

    hideLiveSuggestions() {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }
}

// Initialize search
document.addEventListener('DOMContentLoaded', () => {
    window.search = new Search();
});