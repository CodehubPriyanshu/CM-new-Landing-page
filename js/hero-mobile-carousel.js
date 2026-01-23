// hero-mobile-carousel.js - Mobile-specific full-width hero image carousel
(function() {
    'use strict';
    
    class HeroMobileCarousel {
        constructor() {
            this.carousel = document.querySelector('.hero-image-carousel');
            this.track = document.querySelector('.hero-image-track');
            this.slides = document.querySelectorAll('.hero-image-slide');
            this.indicators = document.querySelectorAll('.hero-indicator');
            
            if (!this.carousel || !this.track || this.slides.length === 0) {
                console.warn('Hero mobile carousel elements not found');
                return;
            }
            
            this.currentIndex = 0;
            this.totalSlides = this.slides.length;
            this.autoSlideInterval = null;
            this.slideDuration = 4000; // 4 seconds
            this.isTransitioning = false;
            this.isPaused = false;
            this.touchStartX = 0;
            this.touchEndX = 0;
            this.startX = 0;
            this.currentX = 0;
            this.isDragging = false;
            
            this.init();
        }
        
        init() {
            // Only initialize on mobile devices
            if (window.innerWidth > 768) {
                this.hideMobileCarousel();
                return;
            }
            
            this.setupEventListeners();
            this.startAutoSlide();
            this.updateIndicators();
            
            // Handle window resize
            window.addEventListener('resize', this.handleResize.bind(this));
        }
        
        hideMobileCarousel() {
            if (this.carousel) {
                this.carousel.style.display = 'none';
            }
        }
        
        showMobileCarousel() {
            if (this.carousel) {
                this.carousel.style.display = 'block';
            }
        }
        
        handleResize() {
            if (window.innerWidth > 768) {
                this.hideMobileCarousel();
                this.stopAutoSlide();
            } else {
                this.showMobileCarousel();
                this.startAutoSlide();
            }
        }
        
        setupEventListeners() {
            // Touch events for mobile
            this.carousel.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            this.carousel.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
            this.carousel.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
            
            // Mouse events for desktop testing
            this.carousel.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.carousel.addEventListener('mousemove', this.handleMouseMove.bind(this));
            this.carousel.addEventListener('mouseup', this.handleMouseUp.bind(this));
            this.carousel.addEventListener('mouseleave', this.handleMouseUp.bind(this));
            
            // Pause on hover/touch
            this.carousel.addEventListener('mouseenter', this.pauseAutoSlide.bind(this));
            this.carousel.addEventListener('mouseleave', this.resumeAutoSlide.bind(this));
            
            // Indicator clicks
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    this.goToSlide(index);
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
            this.startX = e.touches[0].clientX;
            this.pauseAutoSlide();
            this.isDragging = true;
        }
        
        handleTouchMove(e) {
            if (!this.isDragging) return;
            
            this.touchEndX = e.touches[0].clientX;
            this.currentX = this.touchEndX - this.startX;
            
            // Add slight resistance for better UX
            const resistance = Math.abs(this.currentX) > 50 ? 0.5 : 1;
            const translateX = -(this.currentIndex * 100) + (this.currentX * resistance * 0.1);
            
            this.track.style.transform = `translateX(${translateX}%)`;
            this.track.style.transition = 'none';
        }
        
        handleTouchEnd() {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            const swipeThreshold = 50;
            const deltaX = this.touchEndX - this.touchStartX;
            
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            } else {
                // Snap back to current slide
                this.goToSlide(this.currentIndex);
            }
            
            this.resumeAutoSlide();
        }
        
        handleMouseDown(e) {
            this.startX = e.clientX;
            this.pauseAutoSlide();
            this.isDragging = true;
            this.carousel.style.cursor = 'grabbing';
        }
        
        handleMouseMove(e) {
            if (!this.isDragging) return;
            
            this.currentX = e.clientX - this.startX;
            
            const resistance = Math.abs(this.currentX) > 50 ? 0.5 : 1;
            const translateX = -(this.currentIndex * 100) + (this.currentX * resistance * 0.1);
            
            this.track.style.transform = `translateX(${translateX}%)`;
            this.track.style.transition = 'none';
        }
        
        handleMouseUp() {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            this.carousel.style.cursor = 'grab';
            
            const swipeThreshold = 50;
            const deltaX = this.currentX;
            
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            } else {
                this.goToSlide(this.currentIndex);
            }
            
            this.resumeAutoSlide();
        }
        
        goToSlide(index) {
            if (this.isTransitioning || index === this.currentIndex) return;
            
            this.isTransitioning = true;
            this.currentIndex = index;
            
            // Update transform with smooth transition
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
            this.track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            this.updateIndicators();
            
            // Reset transition flag after animation completes
            setTimeout(() => {
                this.isTransitioning = false;
            }, 800);
        }
        
        nextSlide() {
            const nextIndex = (this.currentIndex + 1) % this.totalSlides;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
            this.goToSlide(prevIndex);
        }
        
        updateIndicators() {
            this.indicators.forEach((indicator, index) => {
                if (index === this.currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
        
        startAutoSlide() {
            if (window.innerWidth > 768) return;
            
            this.stopAutoSlide();
            if (this.isPaused || this.totalSlides <= 1) return;
            
            this.autoSlideInterval = setInterval(() => {
                if (!this.isTransitioning) {
                    this.nextSlide();
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
            // Remove event listeners would require storing references
        }
    }
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        // Only initialize if we're on mobile or tablet
        if (window.innerWidth <= 768) {
            window.heroMobileCarousel = new HeroMobileCarousel();
        }
    });
    
    // Export for global access
    window.HeroMobileCarousel = HeroMobileCarousel;
    
})();