// life-at-muj.js - Life at MUJ section functionality
class LifeAtMuj {
    constructor() {
        this.videoPlaceholder = document.getElementById('videoPlaceholder');
        this.youtubeEmbed = document.getElementById('youtubeEmbed');
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.sliderInterval = null;
        this.currentSlide = 0;
        this.isVideoPlaying = false;
        this.player = null;
        this.videoLoaded = false;
        this.autoSlideInterval = 5000; // 5 seconds
        this.init();
    }

    init() {
        this.setupVideoPlayer();
        this.setupTestimonialSlider();
        this.setupExploreButton();
        this.loadYouTubeAPI();
    }

    setupVideoPlayer() {
        if (!this.videoPlaceholder) return;

        const playButton = this.videoPlaceholder.querySelector('.play-button');
        
        playButton.addEventListener('click', () => {
            this.loadAndPlayVideo();
        });

        // Add click handler to thumbnail as well
        const thumbnail = this.videoPlaceholder.querySelector('.video-thumbnail');
        thumbnail.addEventListener('click', (e) => {
            if (e.target === thumbnail || e.target === thumbnail.querySelector('img')) {
                this.loadAndPlayVideo();
            }
        });
    }

    loadYouTubeAPI() {
        // Check if YouTube API is already loaded
        if (window.YT && window.YT.Player) {
            this.initializeYouTubePlayer();
        } else {
            // Create script element for YouTube API
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            // Set up global callback
            window.onYouTubeIframeAPIReady = () => {
                this.initializeYouTubePlayer();
            };
        }
    }

    initializeYouTubePlayer() {
        try {
            // Create player container if it doesn't exist
            let playerContainer = document.getElementById('player');
            if (!playerContainer) {
                playerContainer = document.createElement('div');
                playerContainer.id = 'player';
                this.youtubeEmbed.appendChild(playerContainer);
            }

            // Initialize YouTube Player
            this.player = new YT.Player('player', {
                height: '320',
                width: '100%',
                videoId: 'gvdf5n-zI14', // Replace with actual MUJ campus tour video ID
                playerVars: {
                    'autoplay': 0,
                    'controls': 1,
                    'rel': 0,
                    'showinfo': 0,
                    'modestbranding': 1,
                    'playsinline': 1
                },
                events: {
                    'onReady': this.onPlayerReady.bind(this),
                    'onStateChange': this.onPlayerStateChange.bind(this),
                    'onError': this.onPlayerError.bind(this)
                }
            });
        } catch (error) {
            console.error('Error initializing YouTube player:', error);
            this.showVideoError();
        }
    }

    loadAndPlayVideo() {
        if (!this.videoLoaded) {
            // Show YouTube embed
            this.videoPlaceholder.style.display = 'none';
            this.youtubeEmbed.style.display = 'block';
            this.videoLoaded = true;
            
            // Initialize player if not already
            if (!this.player) {
                this.initializeYouTubePlayer();
            }
            
            // Give time for player to load, then play
            setTimeout(() => {
                if (this.player && typeof this.player.playVideo === 'function') {
                    this.player.playVideo();
                }
            }, 1000);
        } else {
            // Video already loaded, just play it
            if (this.player && typeof this.player.playVideo === 'function') {
                this.player.playVideo();
            }
        }
    }

    onPlayerReady(event) {
        console.log('YouTube player ready');
        // Player is ready
        // Set initial volume to 50%
        event.target.setVolume(50);
    }

    onPlayerStateChange(event) {
        switch (event.data) {
            case YT.PlayerState.PLAYING:
                this.isVideoPlaying = true;
                this.pauseSlider();
                this.addPlayingIndicator();
                break;
            case YT.PlayerState.PAUSED:
                this.isVideoPlaying = false;
                this.removePlayingIndicator();
                if (!this.sliderInterval) {
                    this.startSlider();
                }
                break;
            case YT.PlayerState.ENDED:
                this.isVideoPlaying = false;
                this.removePlayingIndicator();
                this.startSlider();
                break;
            case YT.PlayerState.BUFFERING:
                // Handle buffering state if needed
                break;
            case YT.PlayerState.CUED:
                // Video is cued and ready to play
                break;
        }
    }

    onPlayerError(event) {
        console.error('YouTube player error:', event.data);
        this.showVideoError();
    }

    showVideoError() {
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'video-error';
        errorMessage.innerHTML = `
            <div style="padding: 20px; text-align: center; background: #ffebee; border-radius: 8px; margin-top: 10px;">
                <i class="fas fa-exclamation-triangle" style="color: #f44336; font-size: 24px; margin-bottom: 10px;"></i>
                <p style="color: #c62828; margin: 0;">Unable to load video. Please check your connection and try again.</p>
            </div>
        `;
        this.youtubeEmbed.appendChild(errorMessage);
    }

    addPlayingIndicator() {
        // Add playing indicator to video section
        const videoInfo = document.querySelector('.video-info');
        if (videoInfo && !videoInfo.querySelector('.playing-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'auto-play-indicator playing-indicator';
            indicator.innerHTML = `
                <i class="fas fa-play-circle"></i>
                <span>Video is playing - Slider paused</span>
            `;
            videoInfo.appendChild(indicator);
        }
    }

    removePlayingIndicator() {
        // Remove playing indicator
        const indicator = document.querySelector('.playing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    setupTestimonialSlider() {
        // Set initial slide
        this.showSlide(this.currentSlide);
        
        // Start auto-slider
        this.startSlider();
        
        // Dot click events
        this.dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.getAttribute('data-slide'));
                this.goToSlide(slideIndex);
            });
        });
        
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
            });
        }
        
        // Next button
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
            });
        }
        
        // Pause slider on hover
        const slider = document.querySelector('.testimonials-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => {
                this.pauseSlider();
            });
            
            slider.addEventListener('mouseleave', () => {
                if (!this.isVideoPlaying) {
                    this.startSlider();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Add slide change animation
        this.addSlideAnimations();
    }

    showSlide(index) {
        // Animate out current slide
        const currentSlide = this.slides[this.currentSlide];
        if (currentSlide) {
            currentSlide.style.animation = 'slideOutRight 0.6s ease forwards';
        }
        
        // Remove active class from all slides and dots
        this.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.animation = '';
        });
        
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show new slide with animation
        setTimeout(() => {
            this.slides[index].classList.add('active');
            this.slides[index].style.animation = 'slideInLeft 0.6s ease forwards';
            this.dots[index].classList.add('active');
            this.currentSlide = index;
        }, 300);
    }

    nextSlide() {
        let nextIndex = this.currentSlide + 1;
        if (nextIndex >= this.slides.length) {
            nextIndex = 0;
        }
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        let prevIndex = this.currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = this.slides.length - 1;
        }
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        this.showSlide(index);
        // Reset auto-slider timer
        this.resetSlider();
    }

    startSlider() {
        this.pauseSlider(); // Clear any existing interval
        
        this.sliderInterval = setInterval(() => {
            // Check if video is playing
            if (!this.isVideoPlaying) {
                this.nextSlide();
            }
        }, this.autoSlideInterval);
    }

    pauseSlider() {
        if (this.sliderInterval) {
            clearInterval(this.sliderInterval);
            this.sliderInterval = null;
        }
    }

    resetSlider() {
        this.pauseSlider();
        if (!this.isVideoPlaying) {
            this.startSlider();
        }
    }

    addSlideAnimations() {
        // Add animation classes to slides
        this.slides.forEach((slide, index) => {
            slide.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }

    setupExploreButton() {
        const exploreBtn = document.querySelector('.explore-cta .btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCampusLifeModal();
            });
        }
    }

    showCampusLifeModal() {
        const modalId = Utils.generateId('campus-modal');
        
        const modalHTML = `
            <div id="${modalId}" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-university"></i> Explore Campus Life at MUJ</h3>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="campus-gallery">
                            <div class="campus-grid">
                                <div class="campus-item">
                                    <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Campus Infrastructure">
                                    <div class="campus-caption">
                                        <h4>World-class Infrastructure</h4>
                                        <p>Modern classrooms, labs, and facilities</p>
                                    </div>
                                </div>
                                <div class="campus-item">
                                    <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Student Activities">
                                    <div class="campus-caption">
                                        <h4>Student Activities</h4>
                                        <p>Clubs, events, and cultural activities</p>
                                    </div>
                                </div>
                                <div class="campus-item">
                                    <img src="https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Sports Facilities">
                                    <div class="campus-caption">
                                        <h4>Sports Facilities</h4>
                                        <p>Indoor and outdoor sports complexes</p>
                                    </div>
                                </div>
                                <div class="campus-item">
                                    <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Hostel Life">
                                    <div class="campus-caption">
                                        <h4>Comfortable Hostels</h4>
                                        <p>Safe and comfortable accommodation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="campus-features">
                            <h4>Key Features of MUJ Campus:</h4>
                            <ul>
                                <li><i class="fas fa-check-circle"></i> 100+ acre lush green campus</li>
                                <li><i class="fas fa-check-circle"></i> 24/7 Wi-Fi connectivity</li>
                                <li><i class="fas fa-check-circle"></i> Central library with digital resources</li>
                                <li><i class="fas fa-check-circle"></i> Auditorium and conference halls</li>
                                <li><i class="fas fa-check-circle"></i> Medical facilities and wellness center</li>
                                <li><i class="fas fa-check-circle"></i> Cafeteria and food courts</li>
                            </ul>
                        </div>
                        
                        <div class="modal-footer">
                            <button class="btn btn-primary" onclick="window.location.href='#contact'">
                                <i class="fas fa-calendar-alt"></i> Schedule Campus Visit
                            </button>
                            <button class="btn btn-outline close-modal-btn">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById(modalId);
        
        // Add campus modal styles
        this.addCampusModalStyles();
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Setup modal events
        this.setupCampusModalEvents(modal);
    }

    addCampusModalStyles() {
        if (document.getElementById('campus-modal-styles')) return;
        
        const styles = `
            .campus-gallery {
                margin-bottom: 30px;
            }
            .campus-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 20px;
            }
            .campus-item {
                position: relative;
                border-radius: 8px;
                overflow: hidden;
                height: 150px;
            }
            .campus-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            .campus-item:hover img {
                transform: scale(1.05);
            }
            .campus-caption {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px;
                transform: translateY(100%);
                transition: transform 0.3s ease;
            }
            .campus-item:hover .campus-caption {
                transform: translateY(0);
            }
            .campus-caption h4 {
                margin: 0 0 5px 0;
                font-size: 14px;
            }
            .campus-caption p {
                margin: 0;
                font-size: 12px;
                opacity: 0.9;
            }
            .campus-features {
                background: #f8f9ff;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 25px;
            }
            .campus-features h4 {
                margin-top: 0;
                margin-bottom: 15px;
                color: #333;
            }
            .campus-features ul {
                list-style: none;
                padding: 0;
                margin: 0;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            .campus-features li {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                margin-bottom: 10px;
            }
            .campus-features i {
                color: #4CAF50;
            }
            .modal-footer {
                display: flex;
                gap: 15px;
                justify-content: flex-end;
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'campus-modal-styles';
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    setupCampusModalEvents(modal) {
        // Close modal buttons
        const closeButtons = modal.querySelectorAll('.close-modal, .close-modal-btn, .modal-overlay');
        
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
            }, 300);
        };
        
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModal);
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Handle page visibility
    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseSlider();
            if (this.player && this.isVideoPlaying) {
                this.player.pauseVideo();
            }
        } else {
            if (!this.isVideoPlaying) {
                this.startSlider();
            }
        }
    }
}

// Initialize Life at MUJ
document.addEventListener('DOMContentLoaded', () => {
    window.lifeAtMuj = new LifeAtMuj();
    
    // Add visibility change listener
    document.addEventListener('visibilitychange', () => {
        if (window.lifeAtMuj) {
            window.lifeAtMuj.handleVisibilityChange();
        }
    });
});

// Global YouTube API callback
function onYouTubeIframeAPIReady() {
    if (window.lifeAtMuj) {
        window.lifeAtMuj.initializeYouTubePlayer();
    }
}