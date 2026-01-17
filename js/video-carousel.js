// video-carousel.js - LIFE AT MUJ Video Carousel
class VideoCarousel {
    constructor() {
        this.carousel = document.querySelector('.video-carousel');
        this.slides = document.querySelectorAll('.video-slide');
        this.prevBtn = document.querySelector('.video-carousel-btn.prev-btn');
        this.nextBtn = document.querySelector('.video-carousel-btn.next-btn');
        this.indicators = document.querySelectorAll('.video-indicator');
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        this.slideDuration = 6000; // 6 seconds
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAutoSlide();
        this.setupVideoLazyLoading();
        this.updateProgressBar();
    }

    setupEventListeners() {
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.stopAutoSlide();
                this.prevSlide();
                this.startAutoSlide();
            });
        }

        // Next button
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.stopAutoSlide();
                this.nextSlide();
                this.startAutoSlide();
            });
        }

        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.stopAutoSlide();
                this.goToSlide(index);
                this.startAutoSlide();
            });
        });

        // Touch support for mobile
        if (this.carousel) {
            this.carousel.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
                this.stopAutoSlide();
            }, { passive: true });

            this.carousel.addEventListener('touchmove', (e) => {
                this.touchEndX = e.touches[0].clientX;
            }, { passive: true });

            this.carousel.addEventListener('touchend', () => {
                const threshold = 50;
                const diff = this.touchStartX - this.touchEndX;

                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
                this.startAutoSlide();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.stopAutoSlide();
                this.prevSlide();
                this.startAutoSlide();
            } else if (e.key === 'ArrowRight') {
                this.stopAutoSlide();
                this.nextSlide();
                this.startAutoSlide();
            }
        });

        // Pause auto-slide on hover
        this.carousel.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });

        this.carousel.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoSlide();
            } else {
                this.startAutoSlide();
            }
        });
    }

    setupVideoLazyLoading() {
        // Lazy load YouTube iframes
        const videoWrappers = document.querySelectorAll('.video-wrapper');
        videoWrappers.forEach((wrapper, index) => {
            // Set placeholder initially
            wrapper.classList.add('loading');
            
            // Only load first video immediately
            if (index === 0) {
                this.loadVideoIframe(wrapper);
            }
        });
    }

    loadVideoIframe(wrapper) {
        const iframe = wrapper.querySelector('iframe');
        if (!iframe) return;

        // Remove loading state
        wrapper.classList.remove('loading');
        wrapper.classList.add('loaded');

        // The iframe already has the correct src from HTML, just ensure it's loaded
        // If iframe already has a src, we don't need to change it
        if (!iframe.src || iframe.src.includes('about:blank')) {
            // Get the original src from the data attribute or fallback
            const originalSrc = iframe.dataset.originalSrc || iframe.src;
            if (originalSrc) {
                iframe.src = originalSrc;
            }
        }
    }

    updateSlidePosition() {
        this.slides.forEach((slide, index) => {
            if (index === this.currentIndex) {
                slide.classList.add('active');
                // Load video when slide becomes active
                const wrapper = slide.querySelector('.video-wrapper');
                if (wrapper) {
                    this.loadVideoIframe(wrapper);
                }
            } else {
                slide.classList.remove('active');
            }
        });

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Reset progress bar
        this.updateProgressBar();
    }

    updateProgressBar() {
        // Remove existing progress bars
        document.querySelectorAll('.video-carousel-progress').forEach(el => el.remove());
        
        // Add new progress bar to active slide
        const activeSlide = this.slides[this.currentIndex];
        if (activeSlide) {
            const progressBar = document.createElement('div');
            progressBar.className = 'video-carousel-progress';
            progressBar.innerHTML = '<div class="video-carousel-progress-bar"></div>';
            activeSlide.appendChild(progressBar);
        }
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        
        this.isTransitioning = true;
        this.currentIndex = index;
        
        this.updateSlidePosition();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
    }

    nextSlide() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        
        this.updateSlidePosition();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
    }

    prevSlide() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        
        this.updateSlidePosition();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
    }

    startAutoSlide() {
        this.stopAutoSlide();
        
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideDuration);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    // Public methods for external control
    play() {
        this.startAutoSlide();
    }

    pause() {
        this.stopAutoSlide();
    }

    reset() {
        this.currentIndex = 0;
        this.updateSlidePosition();
    }
}

// Initialize video carousel
document.addEventListener('DOMContentLoaded', () => {
    window.videoCarousel = new VideoCarousel();
    
    // Add click handlers for video play buttons
    const videoOverlays = document.querySelectorAll('.video-overlay');
    videoOverlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            const iframe = overlay.parentElement.querySelector('iframe');
            if (iframe) {
                // Ensure the iframe is loaded and visible
                const videoSrc = iframe.src;
                if (!videoSrc.includes('autoplay=1')) {
                    // Add autoplay parameter to start playing
                    let newSrc = videoSrc;
                    if (newSrc.includes('?')) {
                        if (newSrc.includes('autoplay=')) {
                            newSrc = newSrc.replace(/autoplay=\d/, 'autoplay=1');
                        } else {
                            newSrc = newSrc + '&autoplay=1';
                        }
                    } else {
                        newSrc = newSrc + '?autoplay=1';
                    }
                    iframe.src = newSrc;
                }
                // Hide overlay when video starts playing
                overlay.classList.add('playing');
            }
        });
    });
});