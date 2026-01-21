/**
 * Academic Website - JavaScript
 * Handles navigation, smooth scrolling, and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSmoothScroll();
    initScrollAnimations();
    initNavHighlight();
    initPublicationExpand();
    initResearchExpand();
    initThemeToggle();
    initBackToTop();
    initSpotlightEffect();
    initVideoPreview();
    initMagneticButtons();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-triggered Animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.pub-item, .project-card, .news-item, .course-item, .section-title'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

/**
 * Highlight Active Navigation Link Based on Scroll Position
 */
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const highlightNav = () => {
        const scrollPosition = window.scrollY + 300; /* Adjusted offset for better trigger timing */
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const sectionTitle = section.querySelector('.section-title');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Highlight Nav Link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                // Highlight Section Title
                if (sectionTitle) sectionTitle.classList.add('active');
            } else {
                if (sectionTitle) sectionTitle.classList.remove('active');
            }
        });
    };
    
    // Throttle scroll event
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                highlightNav();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial highlight
    highlightNav();
}

/**
 * Publication Expand Abstract
 * Desktop: hover to expand
 * Mobile: tap to toggle
 */
function initPublicationExpand() {
    const pubItems = document.querySelectorAll('.pub-item');
    
    // Check screen width for layout determination
    const isMobileWidth = () => {
        return window.innerWidth < 768;
    };
    
    pubItems.forEach(item => {
        // We use 'click' for mobile/narrow screens AND as a fallback
        // We use 'mouseenter'/'mouseleave' for desktop
        
        item.addEventListener('click', (e) => {
            // Only trigger click toggle if screen is narrow
            if (isMobileWidth()) {
                // Don't toggle if clicking on links
                if (e.target.closest('.pub-link')) return;
                
                // Toggle current item only - no auto-close of others
                item.classList.toggle('expanded');
            }
        });

        // Desktop hover interactions
        item.addEventListener('mouseenter', () => {
            if (!isMobileWidth()) {
                item.classList.add('expanded');
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!isMobileWidth()) {
                item.classList.remove('expanded');
            }
        });
    });
}

/**
 * Research Card Expand Tags
 * Mobile: tap to toggle tags visibility
 */
function initResearchExpand() {
    const cards = document.querySelectorAll('.project-card');
    
    const isMobileWidth = () => window.innerWidth < 768;
    
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (isMobileWidth()) {
                card.classList.toggle('expanded');
            }
        });
    });
}

/**
 * Dark Mode Toggle
 */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (!themeToggle) return;
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let newTheme;
        
        // Calculate new theme based on current state or system default
        if (currentTheme === 'dark') {
            newTheme = 'light';
        } else if (currentTheme === 'light') {
            newTheme = 'dark';
        } else {
            // If no attribute set (auto mode), toggle away from system preference
            newTheme = systemPrefersDark ? 'light' : 'dark';
        }
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Smart Storage Logic:
        // If the new theme matches the system preference, clear storage (return to auto mode)
        // If it differs, save the preference
        if ((newTheme === 'dark' && systemPrefersDark) || 
            (newTheme === 'light' && !systemPrefersDark)) {
            localStorage.removeItem('theme');
            document.documentElement.removeAttribute('data-theme'); // Let CSS take over
        } else {
            localStorage.setItem('theme', newTheme);
        }
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            // Theme will auto-update via CSS media query
        }
    });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    const toggleBackToTop = () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };
    
    // Throttle scroll event
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                toggleBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initial check
    toggleBackToTop();
}

/**
 * Spotlight Effect for Cards
 * Adds a cursor-following glow to cards to simulate "sensing"
 */
function initSpotlightEffect() {
    // Check if device supports hover
    if (window.matchMedia('(hover: none)').matches) return;

    const cards = document.querySelectorAll('.pub-item, .project-card, .course-item, .contact-note');
    
    if (cards.length === 0) return;
    
    // Add the class for CSS styling
    cards.forEach(card => card.classList.add('spotlight-card'));
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/**
 * Add active state styling for nav links
 */
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--color-text);
    }
    .nav-link.active::after {
        width: 100%;
    }
    
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    }
    
    .animate-on-scroll.is-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-toggle.active span:first-child {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:last-child {
        transform: rotate(-45deg) translate(5px, -5px);
    }
`;
document.head.appendChild(style);

/**
 * Video Preview on Hover/Expand
 * Desktop: plays video when hovering over publication items
 * Mobile: plays video when publication is expanded (clicked)
 */
function initVideoPreview() {
    const pubItems = document.querySelectorAll('.pub-item');
    const isTouchDevice = window.matchMedia('(hover: none)').matches;

    pubItems.forEach(item => {
        const thumb = item.querySelector('.pub-thumbnail');
        const video = thumb ? thumb.querySelector('video') : null;
        
        if (!video || !thumb) return;

        let playPromise;

        // Helper: Start video playback
        const startVideo = () => {
            thumb.classList.add('playing');
            video.currentTime = 0;
            // Preview video is already 1.5x speed, play at normal rate
            video.playbackRate = 1.0;
            playPromise = video.play();
        };

        // Helper: Stop video playback
        const stopVideo = () => {
            thumb.classList.remove('playing');
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    video.pause();
                    video.currentTime = 0;
                }).catch(error => {
                    // Auto-play was prevented
                });
            }
        };

        if (isTouchDevice) {
            // Mobile: Use MutationObserver to watch for 'expanded' class changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class') {
                        if (item.classList.contains('expanded')) {
                            startVideo();
                        } else {
                            stopVideo();
                        }
                    }
                });
            });
            observer.observe(item, { attributes: true });
        } else {
            // Desktop: Hover interactions
            item.addEventListener('mouseenter', startVideo);
            item.addEventListener('mouseleave', stopVideo);
        }
    });
}

/**
 * Magnetic Buttons Effect
 * Buttons slightly follow the mouse cursor
 */
function initMagneticButtons() {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const buttons = document.querySelectorAll('.btn-icon, .btn-primary, .btn-secondary');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Magnetic strength (lower number = stronger pull)
            const strength = 5; 
            
            btn.style.transform = `translate(${x/strength}px, ${y/strength}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}
