// mobile-sliders.js - Mobile slider functionality for specific sections with 5-second intervals
class MobileSlider {
    constructor(sectionSelector, cardSelector) {
        this.section = document.querySelector(sectionSelector);
        this.container = this.section?.querySelector(cardSelector);
        this.cards = this.container?.querySelectorAll('.college-card, .blog-card, .exam-card') || [];
        this.currentIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.autoSlideTimeout = null; // Using timeout instead of interval for precise 5-second timing
        this.slideDuration = 5000; // 5 seconds per card
        this.totalCards = this.cards.length;
        this.cardWidth = 0;
        this.isUserInteracting = false; // Track if user is interacting
        
        if (this.section && this.container && this.totalCards > 0) {
            this.init();
        }
    }

    init() {
        // Only initialize on mobile devices
        if (window.innerWidth > 768) return;

        this.setupContainer();
        this.setupCards();
        this.setupEventListeners();
        this.startAutoSlide();
        this.updateNavigation();
    }

    setupContainer() {
        this.container.style.display = 'flex';
        this.container.style.overflow = 'visible';
        this.container.style.position = 'relative';
        this.container.style.width = '100%';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';
    }

    setupCards() {
        // Clone first and last cards for infinite loop only if multiple cards exist
        if (this.totalCards > 1) {
            const firstCard = this.cards[0].cloneNode(true);
            const lastCard = this.cards[this.totalCards - 1].cloneNode(true);
            
            this.container.insertBefore(lastCard, this.cards[0]);
            this.container.appendChild(firstCard);
            
            // Update card references
            this.cards = this.container.querySelectorAll('.college-card, .blog-card, .exam-card');
            this.totalCards = this.cards.length;
            this.currentIndex = 1; // Start from original first card
        } else {
            // Single card - just center it
            this.currentIndex = 0;
        }

        // Style all cards
        this.cards.forEach((card, index) => {
            card.style.minWidth = '90vw';
            card.style.width = '90vw';
            card.style.margin = '0 2.5vw';
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.flexShrink = '0';
            card.style.position = 'relative';
        });

        // Calculate card width with margins
        this.cardWidth = this.container.offsetWidth * 0.9 + (this.container.offsetWidth * 0.025); // 90vw + 2.5vw margin
        
        // Position cards initially
        this.updateCardPositions();
    }

    setupEventListeners() {
        // Touch events
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // Mouse events for desktop testing
        this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.container.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.container.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));

        // Pause on interaction
        this.container.addEventListener('mouseenter', () => this.handleInteractionStart());
        this.container.addEventListener('mouseleave', () => this.handleInteractionEnd());

        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoSlide();
            } else {
                this.resumeAutoSlide();
            }
        });
    }

    handleInteractionStart() {
        this.isUserInteracting = true;
        this.pauseAutoSlide();
    }

    handleInteractionEnd() {
        this.isUserInteracting = false;
        // Wait a moment after interaction ends before resuming
        setTimeout(() => {
            if (!this.isUserInteracting) {
                this.resumeAutoSlide();
            }
        }, 500);
    }

    handleTouchStart(e) {
        this.isDragging = true;
        this.startX = e.touches[0].clientX;
        this.handleInteractionStart();
        e.preventDefault();
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        this.currentX = e.touches[0].clientX;
        const diff = this.startX - this.currentX;
        const cardWidthWithMargin = this.container.offsetWidth * 0.9 + (this.container.offsetWidth * 0.025);
        
        // Apply temporary transform during drag
        this.cards.forEach((card, index) => {
            const offset = (index - this.currentIndex) * cardWidthWithMargin;
            const translateValue = offset - diff;
            const scaleValue = index === this.currentIndex ? 1.02 : 1;
            card.style.transform = `translateX(${translateValue}px) scale(${scaleValue})`;
        });
    }

    handleTouchEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const diff = this.startX - this.currentX;
        const cardWidthWithMargin = this.container.offsetWidth * 0.9 + (this.container.offsetWidth * 0.025);
        const threshold = cardWidthWithMargin * 0.15; // 15% threshold for swipe

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        } else {
            this.goToSlide(this.currentIndex);
        }

        // Interaction ended, will resume automatically after timeout
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.handleInteractionStart();
        this.container.style.cursor = 'grabbing';
        e.preventDefault();
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        this.currentX = e.clientX;
        const diff = this.startX - this.currentX;
        const cardWidthWithMargin = this.container.offsetWidth * 0.9 + (this.container.offsetWidth * 0.025);
        
        this.cards.forEach((card, index) => {
            const offset = (index - this.currentIndex) * cardWidthWithMargin;
            const translateValue = offset - diff;
            const scaleValue = index === this.currentIndex ? 1.02 : 1;
            card.style.transform = `translateX(${translateValue}px) scale(${scaleValue})`;
        });
    }

    handleMouseUp(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const diff = this.startX - this.currentX;
        const cardWidthWithMargin = this.container.offsetWidth * 0.9 + (this.container.offsetWidth * 0.025);
        const threshold = cardWidthWithMargin * 0.15;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        } else {
            this.goToSlide(this.currentIndex);
        }

        this.container.style.cursor = 'grab';
        // Interaction ended, will resume automatically after timeout
    }

    handleMouseLeave(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.goToSlide(this.currentIndex);
            this.container.style.cursor = 'grab';
        }
    }

    goToSlide(index) {
        this.currentIndex = index;
        
        // Handle infinite loop for multiple cards
        if (this.totalCards > 1) {
            if (this.currentIndex >= this.totalCards - 1) {
                // Jump to first original card
                setTimeout(() => {
                    this.currentIndex = 1;
                    this.updateCardPositions();
                    this.updateNavigation();
                }, 300);
                return;
            } else if (this.currentIndex <= 0) {
                // Jump to last original card
                setTimeout(() => {
                    this.currentIndex = this.totalCards - 2;
                    this.updateCardPositions();
                    this.updateNavigation();
                }, 300);
                return;
            }
        }

        this.updateCardPositions();
        this.updateNavigation();
    }

    updateCardPositions() {
        const cardWidthWithMargin = this.container.offsetWidth * 0.9 + (this.container.offsetWidth * 0.025);
        
        this.cards.forEach((card, index) => {
            const offset = (index - this.currentIndex) * cardWidthWithMargin;
            
            // Apply position transform
            card.style.transform = `translateX(${offset}px) scale(${index === this.currentIndex ? 1.02 : 1})`;
            
            // Apply active class for styling
            if (index === this.currentIndex) {
                card.classList.add('active');
                card.style.opacity = '1';
                card.style.zIndex = '10';
            } else {
                card.classList.remove('active');
                card.style.opacity = '1';
                card.style.zIndex = '1';
            }
        });
    }

    nextSlide() {
        this.goToSlide(this.currentIndex + 1);
    }

    prevSlide() {
        this.goToSlide(this.currentIndex - 1);
    }

    updateNavigation() {
        // Remove active class from all cards
        this.cards.forEach(card => card.classList.remove('active'));
        
        // Add active class to current card
        if (this.cards[this.currentIndex]) {
            this.cards[this.currentIndex].classList.add('active');
        }
    }

    startAutoSlide() {
        this.stopAutoSlide();
        // Only auto-slide if there are multiple cards and not interacting
        if (this.totalCards <= 1 || this.isUserInteracting) return;

        this.autoSlideTimeout = setTimeout(() => {
            this.nextSlide();
            this.startAutoSlide(); // Continue the cycle
        }, this.slideDuration);
    }

    pauseAutoSlide() {
        this.stopAutoSlide();
    }

    resumeAutoSlide() {
        if (!this.isUserInteracting) {
            this.startAutoSlide();
        }
    }

    stopAutoSlide() {
        if (this.autoSlideTimeout) {
            clearTimeout(this.autoSlideTimeout);
            this.autoSlideTimeout = null;
        }
    }

    destroy() {
        this.stopAutoSlide();
        // Reset container styles
        if (this.container) {
            this.container.style.display = '';
            this.container.style.overflow = '';
            this.container.style.position = '';
            this.container.style.width = '';
            this.container.style.justifyContent = '';
            this.container.style.alignItems = '';
        }
        
        // Remove event listeners and reset card styles
        this.cards.forEach((card, index) => {
            card.style.minWidth = '';
            card.style.width = '';
            card.style.margin = '';
            card.style.transition = '';
            card.style.flexShrink = '';
            card.style.position = '';
            card.style.transform = '';
            card.style.opacity = '';
            card.style.zIndex = '';
            card.classList.remove('active');
        });
    }
}

// Initialize sliders for specific sections
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on mobile devices
    if (window.innerWidth > 768) return;

    // Initialize sliders for each section
    const sliders = [
        new MobileSlider('.top-colleges', '.colleges-slider'),
        new MobileSlider('.student-choice-colleges', '.student-choice-grid'),
        new MobileSlider('.placement-verified-colleges', '.placement-verified-grid'),
        new MobileSlider('.blogs-section', '.blogs-grid'),
        new MobileSlider('.exams', '.exams-grid')
    ];

    // Store references for cleanup
    window.mobileSliders = sliders;

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                // Destroy sliders on desktop
                sliders.forEach(slider => slider.destroy());
            } else {
                // Reinitialize sliders on mobile
                sliders.forEach(slider => {
                    if (slider.section) {
                        slider.destroy();
                        slider.init();
                    }
                });
            }
        }, 250);
    });
});