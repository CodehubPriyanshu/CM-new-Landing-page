// hero-mobile-slider.js - Mobile-specific single image slider at bottom of hero section
(function() {
    'use strict';
    
    class HeroMobileSlider {
        constructor() {
            this.slider = document.querySelector('.hero-image-slider');
            this.images = document.querySelectorAll('.hero-single-image');
            this.collegeNames = document.querySelectorAll('.hero-college-name');
            this.dots = document.querySelectorAll('.hero-dot');
            
            if (!this.slider || this.images.length === 0) {
                console.warn('Hero mobile slider elements not found');
                return;
            }
            
            this.currentIndex = 0;
            this.totalImages = this.images.length;
            this.autoSlideInterval = null;
            this.slideDuration = 4000; // 4 seconds
            this.isTransitioning = false;
            this.isPaused = false;
            this.touchStartX = 0;
            this.touchEndX = 0;
            
            this.init();
        }
        
        init() {
            // Only initialize on mobile devices
            if (window.innerWidth > 768) {
                this.hideMobileSlider();
                return;
            }
            
            this.setupEventListeners();
            this.startAutoSlide();
            this.updateDots();
            
            // Handle window resize
            window.addEventListener('resize', this.handleResize.bind(this));
        }
        
        hideMobileSlider() {
            if (this.slider) {
                this.slider.style.display = 'none';
            }
        }
        
        showMobileSlider() {
            if (this.slider) {
                this.slider.style.display = 'block';
            }
        }
        
        handleResize() {
            if (window.innerWidth > 768) {
                this.hideMobileSlider();
                this.stopAutoSlide();
            } else {
                this.showMobileSlider();
                this.startAutoSlide();
            }
        }
        
        setupEventListeners() {
            // Touch events for mobile swipe
            this.slider.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            this.slider.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
            this.slider.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
            
            // Mouse events for desktop testing
            this.slider.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.slider.addEventListener('mouseup', this.handleMouseUp.bind(this));
            this.slider.addEventListener('mouseleave', this.handleMouseUp.bind(this));
            
            // Pause on hover/touch
            this.slider.addEventListener('mouseenter', this.pauseAutoSlide.bind(this));
            this.slider.addEventListener('mouseleave', this.resumeAutoSlide.bind(this));
            
            // Dot clicks
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.goToImage(index);
                });
            });
            
            // Visibility change handling
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseAutoSlide();
                } else {
                    this.resumeAutoSlide();
                }
            });
        }
        
        handleTouchStart(e) {
            this.touchStartX = e.touches[0].clientX;
            this.pauseAutoSlide();
        }
        
        handleTouchMove(e) {
            // Prevent default only if swiping horizontally
            if (Math.abs(e.touches[0].clientX - this.touchStartX) > 10) {
                e.preventDefault();
            }
        }
        
        handleTouchEnd(e) {
            this.touchEndX = e.changedTouches[0].clientX;
            const swipeThreshold = 50;
            const deltaX = this.touchEndX - this.touchStartX;
            
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    this.prevImage();
                } else {
                    this.nextImage();
                }
            }
            
            this.resumeAutoSlide();
        }
        
        handleMouseDown(e) {
            this.touchStartX = e.clientX;
            this.pauseAutoSlide();
            this.slider.style.cursor = 'grabbing';
        }
        
        handleMouseUp(e) {
            if (this.touchStartX === 0) return;
            
            this.touchEndX = e.clientX;
            const swipeThreshold = 50;
            const deltaX = this.touchEndX - this.touchStartX;
            
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    this.prevImage();
                } else {
                    this.nextImage();
                }
            }
            
            this.touchStartX = 0;
            this.slider.style.cursor = 'grab';
            this.resumeAutoSlide();
        }
        
        goToImage(index) {
            if (this.isTransitioning || index === this.currentIndex) return;
            
            this.isTransitioning = true;
            
            // Remove active classes from all
            this.images.forEach(img => img.classList.remove('active'));
            this.collegeNames.forEach(name => name.classList.remove('active'));
            
            // Update current index
            this.currentIndex = index;
            
            // Add active classes to current image and college name
            this.images[this.currentIndex].classList.add('active');
            this.collegeNames[this.currentIndex].classList.add('active');
            
            this.updateDots();
            
            // Reset transition flag after animation completes
            setTimeout(() => {
                this.isTransitioning = false;
            }, 800);
        }
        
        nextImage() {
            const nextIndex = (this.currentIndex + 1) % this.totalImages;
            this.goToImage(nextIndex);
        }
        
        prevImage() {
            const prevIndex = (this.currentIndex - 1 + this.totalImages) % this.totalImages;
            this.goToImage(prevIndex);
        }
        
        updateDots() {
            this.dots.forEach((dot, index) => {
                if (index === this.currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        startAutoSlide() {
            if (window.innerWidth > 768) return;
            
            this.stopAutoSlide();
            if (this.isPaused || this.totalImages <= 1) return;
            
            this.autoSlideInterval = setInterval(() => {
                if (!this.isTransitioning) {
                    this.nextImage();
                }
            }, this.slideDuration);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
        
        pauseAutoSlide() {
            this.isPaused = true;
            this.stopAutoSlide();
        }
        
        resumeAutoSlide() {
            this.isPaused = false;
            this.startAutoSlide();
        }
        
        // Public methods
        play() {
            this.isPaused = false;
            this.startAutoSlide();
        }
        
        pause() {
            this.pauseAutoSlide();
        }
        
        destroy() {
            this.stopAutoSlide();
        }
    }
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        // Only initialize if we're on mobile
        if (window.innerWidth <= 768) {
            window.heroMobileSlider = new HeroMobileSlider();
        }
    });
    
    // Export for global access
    window.HeroMobileSlider = HeroMobileSlider;
    
})();