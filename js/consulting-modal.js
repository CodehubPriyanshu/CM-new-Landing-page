// consulting-modal.js - Consulting registration modal functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing consulting modal...');
    
    // Initialize modal functionality
    initConsultingModal();
    setupFormValidation();
    setupStateCityDropdown();
});

function initConsultingModal() {
    const consultingBtn = document.getElementById('consultingBtn');
    const modal = document.getElementById('consultingModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    const form = document.getElementById('consultingForm');
    
    // Open modal when consulting button is clicked
    if (consultingBtn) {
        consultingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openConsultingModal();
        });
    }
    
    // Close modal when close button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeConsultingModal();
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeConsultingModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeConsultingModal();
        }
    });
    
    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });
    }
}

function openConsultingModal() {
    const modal = document.getElementById('consultingModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset form when opening
        resetForm();
        
        // Focus first input field
        setTimeout(() => {
            const firstNameInput = document.getElementById('firstName');
            if (firstNameInput) {
                firstNameInput.focus();
            }
        }, 300);
    }
}

function closeConsultingModal() {
    const modal = document.getElementById('consultingModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form when closing
        resetForm();
    }
}

function resetForm() {
    const form = document.getElementById('consultingForm');
    if (form) {
        form.reset();
        
        // Clear all error messages
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.classList.remove('show');
        });
        
        // Reset button state
        const submitBtn = form.querySelector('.register-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register Now';
        }
    }
}

function setupFormValidation() {
    const form = document.getElementById('consultingForm');
    if (!form) return;
    
    // Real-time validation for inputs
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error when user starts typing
            clearFieldError(this);
        });
    });
    
    // Special validation for mobile number (numbers only)
    const mobileInput = document.getElementById('mobile');
    if (mobileInput) {
        mobileInput.addEventListener('keypress', function(e) {
            // Allow only numbers
            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                e.preventDefault();
            }
        });
        
        mobileInput.addEventListener('input', function() {
            // Limit to 10 digits
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
        });
    }
}

function setupStateCityDropdown() {
    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');
    
    if (!stateSelect || !citySelect) return;
    
    // State-city mapping
    const stateCities = {
        'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'],
        'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat'],
        'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'],
        'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
        'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba'],
        'Goa': ['Panaji', 'Margao', 'Vasco da Gama'],
        'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
        'Haryana': ['Chandigarh', 'Faridabad', 'Gurgaon', 'Hisar', 'Panipat'],
        'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Solan'],
        'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
        'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
        'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'],
        'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
        'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
        'Manipur': ['Imphal'],
        'Meghalaya': ['Shillong'],
        'Mizoram': ['Aizawl'],
        'Nagaland': ['Kohima', 'Dimapur'],
        'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur'],
        'Punjab': ['Chandigarh', 'Amritsar', 'Ludhiana', 'Jalandhar'],
        'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Ajmer', 'Kota'],
        'Sikkim': ['Gangtok'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
        'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
        'Tripura': ['Agartala'],
        'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi'],
        'Uttarakhand': ['Dehradun', 'Haridwar', 'Nainital', 'Roorkee'],
        'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol']
    };
    
    // Populate cities when state is selected
    stateSelect.addEventListener('change', function() {
        const selectedState = this.value;
        citySelect.innerHTML = '<option value="">-- Select City --</option>';
        
        if (selectedState && stateCities[selectedState]) {
            stateCities[selectedState].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
        
        // Clear city error
        clearFieldError(citySelect);
    });
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const errorElement = document.getElementById(fieldName + 'Error');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `Please enter your ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Mobile validation
    if (fieldName === 'mobile' && value) {
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid 10-digit mobile number';
        }
    }
    
    // Display/hide error
    if (!isValid && errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
        field.classList.add('error');
    } else if (errorElement) {
        errorElement.classList.remove('show');
        field.classList.remove('error');
    }
    
    return isValid;
}

function clearFieldError(field) {
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + 'Error');
    
    if (errorElement) {
        errorElement.classList.remove('show');
        field.classList.remove('error');
    }
}

function validateForm() {
    const form = document.getElementById('consultingForm');
    if (!form) return false;
    
    let isFormValid = true;
    const fields = form.querySelectorAll('input, select');
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

function handleFormSubmission() {
    const form = document.getElementById('consultingForm');
    const submitBtn = form.querySelector('.register-btn');
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        mobile: document.getElementById('mobile').value.trim(),
        email: document.getElementById('email').value.trim(),
        state: document.getElementById('state').value,
        city: document.getElementById('city').value
    };
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        console.log('Form submitted:', formData);
        
        // Show success message
        alert('Thank you for registering! Our team will contact you shortly.');
        
        // Close modal
        closeConsultingModal();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register Now';
    }, 1500);
}

// Export functions for external use
window.ConsultingModal = {
    open: openConsultingModal,
    close: closeConsultingModal
};