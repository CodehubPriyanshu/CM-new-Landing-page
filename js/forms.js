// forms.js - Form handling
class Forms {
    constructor() {
        this.forms = [];
        this.init();
    }

    init() {
        this.setupForms();
        this.setupFormValidation();
        this.setupNewsletterForm();
    }

    setupForms() {
        // Find all forms on the page
        this.forms = document.querySelectorAll('form');
        
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleFormSubmit(e, form);
            });
            
            // Add real-time validation
            this.setupRealTimeValidation(form);
        });
    }

    setupFormValidation() {
        // Add validation patterns to inputs
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateEmail(input);
            });
        });
        
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validatePhone(input);
            });
        });
        
        const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateRequired(input);
            });
        });
    }

    handleFormSubmit(e, form) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalContent = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitButton.innerHTML = originalContent;
            submitButton.disabled = false;
            
            // Show success message
            Utils.showNotification('Form submitted successfully!', 'success');
            
            // Reset form
            form.reset();
            
            // Store form data
            this.storeFormData(form.id || 'anonymous_form', data);
        }, 1500);
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                this.showInputError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && input.value.trim()) {
                if (!Utils.validateEmail(input.value)) {
                    this.showInputError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            } else if (input.type === 'tel' && input.value.trim()) {
                if (!Utils.validatePhone(input.value)) {
                    this.showInputError(input, 'Please enter a valid 10-digit phone number');
                    isValid = false;
                }
            } else {
                this.clearInputError(input);
            }
        });
        
        return isValid;
    }

    setupRealTimeValidation(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.clearInputError(input);
                
                if (input.hasAttribute('required') && !input.value.trim()) {
                    this.showInputError(input, 'This field is required');
                } else if (input.type === 'email' && input.value.trim()) {
                    if (!Utils.validateEmail(input.value)) {
                        this.showInputError(input, 'Please enter a valid email address');
                    }
                } else if (input.type === 'tel' && input.value.trim()) {
                    if (!Utils.validatePhone(input.value)) {
                        this.showInputError(input, 'Please enter a valid 10-digit phone number');
                    }
                }
            });
        });
    }

    validateEmail(input) {
        if (!input.value.trim()) return true;
        
        if (!Utils.validateEmail(input.value)) {
            this.showInputError(input, 'Please enter a valid email address');
            return false;
        }
        
        this.clearInputError(input);
        return true;
    }

    validatePhone(input) {
        if (!input.value.trim()) return true;
        
        if (!Utils.validatePhone(input.value)) {
            this.showInputError(input, 'Please enter a valid 10-digit phone number');
            return false;
        }
        
        this.clearInputError(input);
        return true;
    }

    validateRequired(input) {
        if (input.hasAttribute('required') && !input.value.trim()) {
            this.showInputError(input, 'This field is required');
            return false;
        }
        
        this.clearInputError(input);
        return true;
    }

    showInputError(input, message) {
        // Remove existing error
        this.clearInputError(input);
        
        // Add error class
        input.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #f44336;
            font-size: 12px;
            margin-top: 5px;
        `;
        
        // Insert after input
        input.parentNode.insertBefore(errorElement, input.nextSibling);
        
        // Add shake animation
        animations.shake(input);
    }

    clearInputError(input) {
        input.classList.remove('error');
        
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    storeFormData(formId, data) {
        const formsData = Utils.loadFromStorage('forms_data') || {};
        formsData[formId] = formsData[formId] || [];
        formsData[formId].push({
            ...data,
            timestamp: new Date().toISOString()
        });
        Utils.saveToStorage('forms_data', formsData);
    }

    setupNewsletterForm() {
        // This would be for a newsletter form if added
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                
                if (Utils.validateEmail(email)) {
                    Utils.showNotification('Thank you for subscribing to our newsletter!', 'success');
                    newsletterForm.reset();
                    
                    // Store newsletter subscription
                    const subscriptions = Utils.loadFromStorage('newsletter_subscriptions') || [];
                    subscriptions.push({ email, date: new Date().toISOString() });
                    Utils.saveToStorage('newsletter_subscriptions', subscriptions);
                }
            });
        }
    }
}

// Initialize forms
document.addEventListener('DOMContentLoaded', () => {
    window.forms = new Forms();
});