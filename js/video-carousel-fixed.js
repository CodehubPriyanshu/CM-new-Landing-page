// video-carousel-fixed.js - Improved LIFE AT MUJ Video Carousel with proper YouTube integration
(function() {
    'use strict';
    
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
            this.youTubeAPIReady = false;
            this.initializedVideos = [];
            this.init();
        }
    
        init() {
            this.extractVideoIds();
            this.setupEventListeners();
            this.setupVideoLazyLoading();
            this.loadYouTubeAPI();
            this.startAutoSlide();
            this.updateProgressBar();
        }
    
        // Extract video IDs from the current iframe sources
        extractVideoIds() {
            this.slides.forEach((slide, index) => {
                const iframe = slide.querySelector('iframe');
                if (iframe) {
                    const src = iframe.src;
                    let videoId = '';
                    
                    // Handle different YouTube URL formats
                    if (src.includes('youtube.com/embed/')) {
                        videoId = src.split('/embed/')[1].split('?')[0];
                    } else if (src.includes('youtube.com/watch?v=')) {
                        videoId = src.split('v=')[1].split('&')[0];
                    } else if (src.includes('youtu.be/')) {
                        videoId = src.split('youtu.be/')[1].split('?')[0];
                    } else if (src.includes('youtube.com/shorts/')) {
                        // Extract video ID from shorts URL
                        const parts = src.split('shorts/');
                        if (parts.length > 1) {
                            videoId = parts[1].split('?')[0];
                        }
                    }
                    
                    // Store the video ID with the slide
                    slide.dataset.videoId = videoId;
                    slide.dataset.originalSrc = src;
                }
            });
        }
    
        loadYouTubeAPI() {
            // Check if YouTube API is already loaded
            if (window.YT && window.YT.Player) {
                this.youTubeAPIReady = true;
                return;
            }
            
            // Check if script is already loading
            if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                return;
            }
            
            // Create script element for YouTube API
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            // Set up global callback
            window.onYouTubeIframeAPIReady = () => {
                this.youTubeAPIReady = true;
                console.log('YouTube API loaded successfully');
            };
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
                    setTimeout(() => {
                        this.loadVideoIframe(wrapper);
                    }, 100);
                }
            });
        }
    
        loadVideoIframe(wrapper) {
            const slide = wrapper.closest('.video-slide');
            if (!slide) return;
            
            const videoId = slide.dataset.videoId;
            const iframe = wrapper.querySelector('iframe');
            
            if (!iframe || !videoId) {
                console.error('Could not load video - missing iframe or video ID');
                this.createFallbackThumbnail(wrapper, videoId);
                return;
            }
    
            // Remove loading state
            wrapper.classList.remove('loading');
            wrapper.classList.add('loaded');
            
            // Create proper YouTube embed URL with all necessary parameters
            const embedUrl = `https://www.youtube.com/embed/${videoId}?` +
                `autoplay=0&` +
                `mute=0&` +
                `controls=1&` +
                `rel=0&` +
                `showinfo=0&` +
                `iv_load_policy=3&` +
                `modestbranding=1&` +
                `playsinline=1&` +
                `enablejsapi=1&` +
                `origin=${encodeURIComponent(window.location.origin)}&` +
                `widget_referrer=${encodeURIComponent(window.location.href)}`;
            
            // Update iframe src with proper parameters
            iframe.src = embedUrl;
            
            // Add timeout for loading failure
            const loadingTimeout = setTimeout(() => {
                if (wrapper.classList.contains('loaded') && !wrapper.querySelector('iframe').contentDocument) {
                    console.warn(`Video took too long to load: ${videoId}`);
                    this.handleVideoError(wrapper, videoId);
                }
            }, 10000); // 10 second timeout
            
            // Add error handling
            iframe.addEventListener('error', () => {
                clearTimeout(loadingTimeout);
                console.error(`Failed to load YouTube video with ID: ${videoId}`);
                this.handleVideoError(wrapper, videoId);
            });
            
            // Add load handling
            iframe.addEventListener('load', () => {
                clearTimeout(loadingTimeout);
                console.log(`Video loaded successfully: ${videoId}`);
                
                // Check if the iframe loaded properly by trying to access its content
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc && iframeDoc.querySelector('#player-api')) {
                        // Video player loaded successfully
                        console.log(`YouTube player initialized for video: ${videoId}`);
                    }
                } catch (e) {
                    // Cross-origin restrictions prevent access, which is normal
                    console.log(`Cross-origin restrictions for video: ${videoId} (this is normal)`);
                }
            });
        }
    
        createFallbackThumbnail(wrapper, videoId) {
            if (!videoId) return;
            
            // Create a thumbnail as fallback
            const thumbnailHtml = `
                <div class="video-thumbnail-fallback">
                    <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" 
                         alt="Video thumbnail" 
                         onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\"fallback-placeholder\">Video unavailable</div>'">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
            `;
            
            wrapper.innerHTML = thumbnailHtml;
            wrapper.classList.add('thumbnail-mode');
            
            // Add click handler to try loading the video again
            const thumbnail = wrapper.querySelector('.video-thumbnail-fallback');
            if (thumbnail) {
                thumbnail.addEventListener('click', () => {
                    // Reload the original iframe
                    const slide = wrapper.closest('.video-slide');
                    if (slide) {
                        const originalSrc = slide.dataset.originalSrc;
                        wrapper.innerHTML = `<iframe src=\"${originalSrc}\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" allowfullscreen loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\" sandbox=\"allow-same-origin allow-scripts allow-presentation allow-popups allow-forms\"></iframe>`;
                        wrapper.classList.remove('thumbnail-mode');
                        wrapper.classList.remove('error');
                        wrapper.classList.add('loading');
                        this.loadVideoIframe(wrapper);
                    }
                });
            }
        }
    
        handleVideoError(wrapper, videoId) {
            wrapper.classList.remove('loading');
            wrapper.classList.add('error');
            
            // Create error message
            const errorHtml = `
                <div class="video-error-message">
                    <div class="error-icon">⚠️</div>
                    <h4>Video Unavailable</h4>
                    <p>The video couldn't load. Please check your connection or try again later.</p>
                    <button class="retry-btn" onclick="location.reload()">Retry</button>
                </div>
            `;
            
            wrapper.innerHTML = errorHtml;
            
            // Also create a fallback thumbnail
            this.createFallbackThumbnail(wrapper, videoId);
        }
    
        updateSlidePosition() {
            this.slides.forEach((slide, index) => {
                if (index === this.currentIndex) {
                    slide.classList.add('active');
                    // Load video when slide becomes active
                    const wrapper = slide.querySelector('.video-wrapper');
                    if (wrapper && !this.initializedVideos.includes(index)) {
                        this.loadVideoIframe(wrapper);
                        this.initializedVideos.push(index);
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
                
                // Start the progress animation
                setTimeout(() => {
                    const progressBarFill = progressBar.querySelector('.video-carousel-progress-bar');
                    if (progressBarFill) {
                        progressBarFill.style.transition = `width ${this.slideDuration}ms linear`;
                        progressBarFill.style.width = '100%';
                    }
                }, 100);
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
    
    // Initialize video carousel when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        window.videoCarousel = new VideoCarousel();
        
        // Add click handlers for video overlays to allow user-initiated play
        const videoOverlays = document.querySelectorAll('.video-overlay');
        videoOverlays.forEach(overlay => {
            overlay.addEventListener('click', function() {
                const wrapper = this.closest('.video-wrapper');
                const iframe = wrapper.querySelector('iframe');
                if (iframe) {
                    // Get the original source from data attribute to avoid duplicate parameters
                    const slide = wrapper.closest('.video-slide');
                    let originalSrc = slide.dataset.originalSrc || iframe.src.split('?')[0];
                    
                    // Create new URL with proper YouTube parameters for user interaction
                    let newSrc = originalSrc;
                    
                    // Check if URL already has parameters
                    if (newSrc.includes('?')) {
                        // If autoplay is already present, just replace it
                        if (newSrc.includes('autoplay=')) {
                            newSrc = newSrc.replace(/autoplay=[^&]*/g, 'autoplay=1');
                        } else {
                            newSrc += '&autoplay=1';
                        }
                        
                        // Similarly handle mute parameter
                        if (newSrc.includes('mute=')) {
                            newSrc = newSrc.replace(/mute=[^&]*/g, 'mute=1');
                        } else {
                            newSrc += '&mute=1';
                        }
                    } else {
                        // No parameters, add them
                        newSrc += '?autoplay=1&mute=1';
                    }
                    
                    // Add other necessary parameters for proper functionality
                    if (!newSrc.includes('enablejsapi=')) {
                        newSrc += '&enablejsapi=1';
                    }
                    if (!newSrc.includes('controls=')) {
                        newSrc += '&controls=1';
                    }
                    
                    // Update iframe src to trigger video play
                    iframe.src = newSrc;
                    
                    // Hide overlay when video starts playing
                    this.classList.add('playing');
                    
                    // Add event listener to detect when the video actually starts playing
                    iframe.addEventListener('load', function() {
                        // Video has started loading, add a small delay before hiding overlay
                        // to ensure the video player has time to initialize
                        setTimeout(() => {
                            if (overlay && !overlay.classList.contains('playing')) {
                                overlay.classList.add('playing');
                            }
                        }, 500);
                    });
                }
            });
        });
    });
    
    // Handle window resize for responsive video sizing
    window.addEventListener('resize', () => {
        // Add any resize-specific video handling here if needed
    });
    
})();