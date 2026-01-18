// animations.js - Animation effects
class Animations {
    constructor() {
        this.animatedElements = [];
        this.counters = [];
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupHoverAnimations();
        this.setupFloatingElements();
    }

    setupScrollAnimations() {
        // Make all elements visible by default instead of animating on scroll
        const elementsToAnimate = document.querySelectorAll('.category-card, .college-card, .service-card, .exam-card, .recruiter-logo, .city-card');
        
        elementsToAnimate.forEach((element, index) => {
            // Add visible class immediately instead of animate-on-scroll
            element.classList.add('visible');
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    setupCounterAnimations() {
        const counterElements = document.querySelectorAll('.counter');
        
        counterElements.forEach(counter => {
            const targetValue = parseFloat(counter.getAttribute('data-target')) || 0;
            this.counters.push({
                element: counter,
                target: targetValue,
                suffix: counter.textContent.replace(/[0-9.]/g, ''),
                animated: false
            });
        });

        // Observe counter elements
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counterData = this.counters.find(c => c.element === entry.target);
                    if (counterData && !counterData.animated) {
                        this.animateCounter(counterData);
                        counterData.animated = true;
                    }
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => {
            counterObserver.observe(counter.element);
        });
    }

    animateCounter(counterData) {
        const element = typeof counterData === 'object' ? counterData.element : counterData;
        const target = typeof counterData === 'object' ? counterData.target : parseFloat(element.getAttribute('data-target')) || 0;
        const suffix = typeof counterData === 'object' ? counterData.suffix : element.textContent.replace(/[0-9.]/g, '');
        
        let current = 0;
        const increment = target / 50;
        const duration = 1500;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = Math.floor(target) + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, stepTime);
    }

    setupHoverAnimations() {
        // Category cards hover animation
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.category-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(5deg)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.category-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });

        // Service cards hover animation
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    setupFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach(element => {
            // Add random animation delay
            const randomDelay = Math.random() * 2;
            element.style.animationDelay = `${randomDelay}s`;
            
            // Add random rotation
            const randomRotation = Math.random() * 20 - 10;
            element.style.transform = `rotate(${randomRotation}deg)`;
        });
    }

    // Add bounce animation to element
    bounce(element) {
        element.classList.add('animate__animated', 'animate__bounce');
        setTimeout(() => {
            element.classList.remove('animate__animated', 'animate__bounce');
        }, 1000);
    }

    // Add shake animation to element
    shake(element) {
        element.classList.add('animate__animated', 'animate__shakeX');
        setTimeout(() => {
            element.classList.remove('animate__animated', 'animate__shakeX');
        }, 1000);
    }

    // Add fade in animation to element
    fadeIn(element, duration = 1000) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration + 10);
    }

    // Add slide in animation to element
    slideIn(element, direction = 'up', duration = 1000) {
        element.style.opacity = '0';
        element.style.transform = `translate${direction === 'up' ? 'Y' : 'X'}(${direction === 'up' || direction === 'left' ? '50' : '-50'}px)`;
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0)';
        }, 10);
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration + 10);
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    window.animations = new Animations();
});