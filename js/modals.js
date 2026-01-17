// modals.js - Modal windows functionality
class Modals {
    constructor() {
        this.modals = [];
        this.init();
    }

    init() {
        this.setupApplyButtons();
        this.setupHelpButton();
        this.setupModalCloseHandlers();
    }

    setupApplyButtons() {
        const applyButtons = document.querySelectorAll('.college-card .btn-outline, .btn-primary');
        
        applyButtons.forEach(button => {
            if (button.textContent.includes('Apply') || button.textContent.includes('Register')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    let title = '';
                    
                    if (button.closest('.college-card')) {
                        const collegeName = button.closest('.college-card').querySelector('h3').textContent;
                        title = `Apply to ${collegeName}`;
                    } else if (button.textContent.includes('Register')) {
                        title = 'Register Now';
                    } else {
                        title = 'Application Form';
                    }
                    
                    this.showApplicationModal(title);
                });
            }
        });
    }

    showApplicationModal(title) {
        const modalId = Utils.generateId('modal');
        
        const modalHTML = `
            <div id="${modalId}" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="applicationForm" class="application-form">
                            <div class="form-group">
                                <label for="fullName">Full Name *</label>
                                <input type="text" id="fullName" name="fullName" required>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="email">Email Address *</label>
                                    <input type="email" id="email" name="email" required>
                                </div>
                                <div class="form-group">
                                    <label for="phone">Phone Number *</label>
                                    <input type="tel" id="phone" name="phone" required>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="course">Preferred Course *</label>
                                    <select id="course" name="course" required>
                                        <option value="">Select Course</option>
                                        <option value="mba">MBA / PGDM</option>
                                        <option value="btech">B.Tech</option>
                                        <option value="mtech">M.Tech</option>
                                        <option value="law">Law (LLB/LLM)</option>
                                        <option value="design">Design</option>
                                        <option value="medical">Medical</option>
                                        <option value="commerce">Commerce</option>
                                        <option value="arts">Arts & Humanities</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="specialization">Specialization</label>
                                    <input type="text" id="specialization" name="specialization" placeholder="e.g., Marketing, AI, etc.">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="qualification">Current Qualification *</label>
                                <select id="qualification" name="qualification" required>
                                    <option value="">Select Qualification</option>
                                    <option value="12th">12th / High School</option>
                                    <option value="diploma">Diploma</option>
                                    <option value="graduate">Graduate</option>
                                    <option value="postgraduate">Post Graduate</option>
                                    <option value="working">Working Professional</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="message">Additional Information</label>
                                <textarea id="message" name="message" rows="3" placeholder="Any specific requirements or questions..."></textarea>
                            </div>
                            
                            <div class="form-footer">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-paper-plane"></i> Submit Application
                                </button>
                                <button type="button" class="btn btn-outline close-modal-btn">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add modal to tracking array
        const modal = document.getElementById(modalId);
        this.modals.push(modal);
        
        // Add modal styles if not already added
        this.addModalStyles();
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Setup modal events
        this.setupModalEvents(modal);
    }

    addModalStyles() {
        if (document.getElementById('modal-styles')) return;
        
        const styles = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                display: none;
            }
            .modal.active {
                display: block;
            }
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                animation: fadeIn 0.3s ease;
            }
            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                background: white;
                border-radius: 15px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: scaleIn 0.3s ease forwards;
            }
            .modal.active .modal-content {
                transform: translate(-50%, -50%) scale(1);
            }
            .modal-header {
                padding: 25px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, #2962ff, #00b0ff);
                color: white;
                border-radius: 15px 15px 0 0;
            }
            .modal-header h3 {
                margin: 0;
                font-size: 22px;
            }
            .close-modal {
                font-size: 28px;
                cursor: pointer;
                color: white;
                transition: transform 0.3s ease;
            }
            .close-modal:hover {
                transform: rotate(90deg);
            }
            .modal-body {
                padding: 25px;
            }
            .application-form .form-group {
                margin-bottom: 20px;
            }
            .application-form label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #333;
            }
            .application-form input,
            .application-form select,
            .application-form textarea {
                width: 100%;
                padding: 12px 15px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
                transition: all 0.3s ease;
                font-family: 'Poppins', sans-serif;
            }
            .application-form input:focus,
            .application-form select:focus,
            .application-form textarea:focus {
                outline: none;
                border-color: #2962ff;
                box-shadow: 0 0 0 3px rgba(41, 98, 255, 0.1);
            }
            .application-form textarea {
                resize: vertical;
                min-height: 100px;
            }
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            .form-footer {
                display: flex;
                gap: 15px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
            }
            .form-footer .btn {
                flex: 1;
            }
            @media (max-width: 768px) {
                .form-row {
                    grid-template-columns: 1fr;
                }
                .form-footer {
                    flex-direction: column;
                }
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'modal-styles';
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    setupModalEvents(modal) {
        // Close modal buttons
        const closeButtons = modal.querySelectorAll('.close-modal, .close-modal-btn, .modal-overlay');
        
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.closeModal(modal);
            });
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal(modal);
            }
        });
        
        // Form submission
        const form = modal.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form, modal);
            });
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            // Remove from tracking array
            this.modals = this.modals.filter(m => m !== modal);
        }, 300);
    }

    handleFormSubmission(form, modal) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!this.validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Show success message
            Utils.showNotification('Application submitted successfully! We will contact you soon.', 'success');
            
            // Close modal
            this.closeModal(modal);
            
            // Store application data
            this.storeApplicationData(data);
        }, 1500);
    }

    validateForm(data) {
        // Validate required fields
        if (!data.fullName || !data.email || !data.phone || !data.course || !data.qualification) {
            Utils.showNotification('Please fill all required fields', 'warning');
            return false;
        }
        
        // Validate email
        if (!Utils.validateEmail(data.email)) {
            Utils.showNotification('Please enter a valid email address', 'warning');
            return false;
        }
        
        // Validate phone
        if (!Utils.validatePhone(data.phone)) {
            Utils.showNotification('Please enter a valid 10-digit phone number', 'warning');
            return false;
        }
        
        return true;
    }

    storeApplicationData(data) {
        const applications = Utils.loadFromStorage('applications') || [];
        applications.push({
            ...data,
            date: new Date().toISOString(),
            id: Utils.generateId('app')
        });
        Utils.saveToStorage('applications', applications);
    }

    setupHelpButton() {
        const helpFab = document.getElementById('helpFab');
        if (helpFab) {
            helpFab.addEventListener('click', () => {
                this.showHelpModal();
            });
        }
    }

    showHelpModal() {
        const modalId = Utils.generateId('help-modal');
        
        const modalHTML = `
            <div id="${modalId}" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-question-circle"></i> Student Help Desk</h3>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="help-section">
                            <h4><i class="fas fa-headset"></i> Contact Support</h4>
                            <p>Our support team is available 24/7 to help you with:</p>
                            <ul>
                                <li>College admissions guidance</li>
                                <li>Application process assistance</li>
                                <li>Scholarship information</li>
                                <li>Education loan queries</li>
                                <li>Any other questions</li>
                            </ul>
                            <div class="contact-info">
                                <p><i class="fas fa-phone"></i> <strong>Call:</strong> +91 1800 123 4567</p>
                                <p><i class="fas fa-envelope"></i> <strong>Email:</strong> support@careermantra.com</p>
                                <p><i class="fas fa-clock"></i> <strong>Hours:</strong> 24/7</p>
                            </div>
                        </div>
                        
                        <div class="help-section">
                            <h4><i class="fas fa-lightbulb"></i> Quick Links</h4>
                            <div class="quick-links">
                                <a href="#" class="quick-link">
                                    <i class="fas fa-file-alt"></i>
                                    <span>Common Application Process</span>
                                </a>
                                <a href="#" class="quick-link">
                                    <i class="fas fa-graduation-cap"></i>
                                    <span>Scholarship Test</span>
                                </a>
                                <a href="#" class="quick-link">
                                    <i class="fas fa-user-graduate"></i>
                                    <span>Campus Rockstar Program</span>
                                </a>
                                <a href="#" class="quick-link">
                                    <i class="fas fa-university"></i>
                                    <span>College Predictor Tool</span>
                                </a>
                            </div>
                        </div>
                        
                        <div class="help-section">
                            <h4><i class="fas fa-comments"></i> Live Chat</h4>
                            <p>Chat with our education counselors in real-time.</p>
                            <button class="btn btn-primary start-chat-btn">
                                <i class="fas fa-comment-dots"></i> Start Live Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById(modalId);
        
        // Add help modal specific styles
        const helpStyles = `
            .help-section {
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
            }
            .help-section:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
            .help-section h4 {
                color: #2962ff;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .help-section ul {
                margin: 15px 0;
                padding-left: 20px;
            }
            .help-section ul li {
                margin-bottom: 8px;
            }
            .contact-info p {
                display: flex;
                align-items: center;
                gap: 10px;
                margin: 10px 0;
            }
            .quick-links {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-top: 15px;
            }
            .quick-link {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 15px;
                background: #f5f7fa;
                border-radius: 8px;
                text-decoration: none;
                color: #333;
                transition: all 0.3s ease;
            }
            .quick-link:hover {
                background: #e3f2fd;
                transform: translateY(-2px);
            }
            .quick-link i {
                color: #2962ff;
                font-size: 20px;
            }
            .start-chat-btn {
                margin-top: 15px;
            }
        `;
        
        // Add styles if not already added
        if (!document.getElementById('help-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'help-styles';
            styleElement.textContent = helpStyles;
            document.head.appendChild(styleElement);
        }
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Setup events
        this.setupModalEvents(modal);
        
        // Live chat button
        modal.querySelector('.start-chat-btn')?.addEventListener('click', () => {
            Utils.showNotification('Live chat feature coming soon!', 'info');
            this.closeModal(modal);
        });
    }

    setupModalCloseHandlers() {
        // Close all modals on outside click
        document.addEventListener('click', (e) => {
            this.modals.forEach(modal => {
                if (modal.classList.contains('active') && 
                    !e.target.closest('.modal-content') && 
                    e.target.closest('.modal-overlay')) {
                    this.closeModal(modal);
                }
            });
        });
    }
}

// Initialize modals
document.addEventListener('DOMContentLoaded', () => {
    window.modals = new Modals();
});