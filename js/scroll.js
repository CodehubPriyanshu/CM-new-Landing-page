// scroll.js - Scroll effects
class ScrollEffects {
    constructor() {
        this.scrollToTopBtn = null;
        this.scrollProgress = null;
        this.init();
    }

    init() {
        this.createScrollElements();
        this.setupScrollEvents();
        this.setupParallaxEffects();
    }

    createScrollElements() {
        // Create scroll to top button
        this.scrollToTopBtn = document.createElement('button');
        this.scrollToTopBtn.className = 'scroll-to-top';
        this.scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        this.scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(this.scrollToTopBtn);

        // Create scroll progress indicator
        this.scrollProgress = document.createElement('div');
        this.scrollProgress.className = 'scroll-progress';
        document.body.appendChild(this.scrollProgress);

        // Add scroll styles
        this.addScrollStyles();
    }

    addScrollStyles() {
        if (document.getElementById('scroll-styles')) return;

        const styles = `
            .scroll-to-top {
                position: fixed;
                bottom: 30px;
                right: 100px;
                width: 50px;
                height: 50px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: none;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                z-index: 99;
                box-shadow: var(--shadow-md);
                transition: var(--transition);
            }
            .scroll-to-top:hover {
                background: var(--primary-dark);
                transform: translateY(-3px);
            }
            .scroll-to-top.visible {
                display: flex;
            }
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
                z-index: 1001;
                transition: width 0.1s ease;
            }
            @media (max-width: 768px) {
                .scroll-to-top {
                    right: 30px;
                    bottom: 90px;
                    width: 45px;
                    height: 45px;
                }
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.id = 'scroll-styles';
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    setupScrollEvents() {
        // Scroll to top button click
        this.scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Show/hide scroll to top button
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScrollProgress();
            this.handleScrollToTop();
        }, 100));

        // Initial check
        this.handleScrollToTop();
    }

    handleScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        if (this.scrollProgress) {
            this.scrollProgress.style.width = scrolled + '%';
        }
    }

    handleScrollToTop() {
        if (window.scrollY > 300) {
            this.scrollToTopBtn.classList.add('visible');
        } else {
            this.scrollToTopBtn.classList.remove('visible');
        }
    }

    setupParallaxEffects() {
        // Add parallax effect to hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                // Apply parallax to floating elements
                const floatingElements = document.querySelectorAll('.floating-element');
                floatingElements.forEach((element, index) => {
                    const speed = 0.1 + (index * 0.05);
                    element.style.transform = `translateY(${rate * speed}px) rotate(${index * 5}deg)`;
                });
            });
        }
    }

    // Smooth scroll to element with offset
    scrollToElement(elementId, offset = 80) {
        Utils.scrollToElement(elementId, offset);
    }

    // Scroll to section with animation
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Enable/disable scroll
    disableScroll() {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
    }

    enableScroll() {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }

    getScrollbarWidth() {
        // Create temporary div to measure scrollbar width
        const div = document.createElement('div');
        div.style.overflow = 'scroll';
        div.style.visibility = 'hidden';
        div.style.position = 'absolute';
        document.body.appendChild(div);
        const width = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);
        return width;
    }

    // Check if user has scrolled to bottom
    isAtBottom(threshold = 100) {
        return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - threshold);
    }

    // Get current scroll position
    getScrollPosition() {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset,
            maxX: document.body.scrollWidth - window.innerWidth,
            maxY: document.body.scrollHeight - window.innerHeight
        };
    }
}

// Initialize scroll effects
document.addEventListener('DOMContentLoaded', () => {
    window.scrollEffects = new ScrollEffects();
});