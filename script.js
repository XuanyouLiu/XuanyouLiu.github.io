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
    initLanguageToggle();
    initBackToTop();
    initSpotlightEffect();
    initVideoPreview();
    initMagneticButtons();
    initProfileImageTap();
    initScrollProgress();
    initScrollPerformance();
    initImageFadeIn();
    initBibTexCopy();
});

/**
 * Initialize Scroll Performance Optimization
 * Disables pointer events while scrolling to prevent hover effects and improve fps
 */
function initScrollPerformance() {
    let isScrolling;
    const body = document.body;

    window.addEventListener('scroll', () => {
        // Clear our timeout throughout the scroll
        window.clearTimeout(isScrolling);

        // Add class to disable hover effects
        if (!body.classList.contains('is-scrolling')) {
            body.classList.add('is-scrolling');
        }

        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(() => {
            // Remove the class
            body.classList.remove('is-scrolling');
        }, 150); // 150ms after scroll stops
    }, { passive: true });
}

/**
 * Initialize Image Fade-in
 */
function initImageFadeIn() {
    const images = document.querySelectorAll('img[loading="lazy"], .hero-image img');
    
    images.forEach(img => {
        // Find the skeleton container
        const container = img.closest('.hero-image, .pub-thumbnail, .project-image');
        
        const onImageLoad = () => {
            img.classList.add('loaded');
            if (container) {
                container.classList.add('loaded');
            }
        };

        if (img.complete) {
            onImageLoad();
        } else {
            img.addEventListener('load', onImageLoad);
        }
    });
}

/**
 * BibTeX Copy Functionality
 */
function initBibTexCopy() {
    const bibBtns = document.querySelectorAll('.bibtex-btn');
    const toast = document.querySelector('.toast-container');
    
    if (!bibBtns.length || !toast) return;
    
    let toastTimeout;
    
    bibBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card expansion
            const bibText = btn.getAttribute('data-bibtex');
            
            if (bibText) {
                navigator.clipboard.writeText(bibText).then(() => {
                    showToast();
                }).catch(err => {
                    console.error('Failed to copy BibTeX', err);
                });
            }
        });
    });
    
    function showToast() {
        if (toastTimeout) clearTimeout(toastTimeout);
        
        toast.classList.add('visible');
        
        toastTimeout = setTimeout(() => {
            toast.classList.remove('visible');
        }, 3000);
    }
}

/**
 * Scroll Progress Bar
 */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    if (!progressBar) return;
    
    const updateProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = `${scrollPercent}%`;
    };
    
    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateProgress);
    });
    
    // Initial call
    updateProgress();
}

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        // Helper to update ARIA state
        const updateAriaState = (isOpen) => {
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        };
        
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Toggle body scroll lock
            document.body.classList.toggle('no-scroll', isOpen);
            
            updateAriaState(isOpen);
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('no-scroll'); // Unlock scroll
                updateAriaState(false);
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                if (document.body.classList.contains('no-scroll')) {
                    document.body.classList.remove('no-scroll'); // Unlock scroll
                }
                updateAriaState(false);
            }
        });
        
        // Support Escape key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('no-scroll'); // Unlock scroll
                updateAriaState(false);
                navToggle.focus();
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
    
    // Helper to update ARIA state
    const updateAriaState = (item, isExpanded) => {
        item.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
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
                const isExpanded = item.classList.toggle('expanded');
                updateAriaState(item, isExpanded);
            }
        });

        // Desktop hover interactions
        item.addEventListener('mouseenter', () => {
            if (!isMobileWidth()) {
                item.classList.add('expanded');
                updateAriaState(item, true);
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!isMobileWidth()) {
                item.classList.remove('expanded');
                updateAriaState(item, false);
            }
        });
        
        // Support Enter/Space key for accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isExpanded = item.classList.toggle('expanded');
                updateAriaState(item, isExpanded);
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
                const isExpanded = card.classList.toggle('expanded');
                card.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            }
        });
        
        // Support keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && isMobileWidth()) {
                e.preventDefault();
                const isExpanded = card.classList.toggle('expanded');
                card.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            }
        });
    });
}

/**
 * Dark Mode Toggle with smooth transition
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
        
        // Enable transition animation
        document.documentElement.classList.add('theme-transition');
        
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
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 400);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            // Add transition for system theme changes too
            document.documentElement.classList.add('theme-transition');
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transition');
            }, 400);
        }
    });
}

/**
 * Language Toggle (English/Chinese) with smooth transition
 */
function initLanguageToggle() {
    const langToggle = document.querySelector('.lang-toggle');
    
    if (!langToggle) return;
    
    // Check for saved language preference
    const savedLang = localStorage.getItem('lang');
    
    if (savedLang) {
        // Use saved preference
        document.documentElement.setAttribute('data-lang', savedLang);
        applyLanguage(savedLang);
    } else {
        // Auto-detect browser language: Chinese users see Chinese, others see English
        const browserLang = navigator.language || navigator.userLanguage || 'en';
        const isChineseUser = browserLang.toLowerCase().startsWith('zh');
        const defaultLang = isChineseUser ? 'zh' : 'en';
        
        if (defaultLang === 'zh') {
            document.documentElement.setAttribute('data-lang', 'zh');
            applyLanguage('zh');
        }
        // For English, no need to apply since it's the default HTML content
    }
    
    // Update button title based on current language
    const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
    langToggle.title = currentLang === 'en' ? '切换到中文' : 'Switch to English';
    
    langToggle.addEventListener('click', () => {
        const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
        const newLang = currentLang === 'en' ? 'zh' : 'en';
        
        // Phase 1: Fade out
        document.documentElement.classList.add('lang-fade-out');
        
        // Phase 2: After fade out, change content and fade in
        setTimeout(() => {
            document.documentElement.setAttribute('data-lang', newLang);
            localStorage.setItem('lang', newLang);
            langToggle.title = newLang === 'en' ? '切换到中文' : 'Switch to English';
            
            applyLanguage(newLang);
            
            // Switch from fade-out to fade-in
            document.documentElement.classList.remove('lang-fade-out');
            document.documentElement.classList.add('lang-fade-in');
            
            // Phase 3: Clean up after fade in
            setTimeout(() => {
                document.documentElement.classList.remove('lang-fade-in');
            }, 150);
        }, 150);
    });
}

/**
 * Apply language to all elements with data-en and data-zh attributes
 */
function applyLanguage(lang) {
    const elements = document.querySelectorAll('[data-en][data-zh]');
    
    elements.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            // Use innerHTML to preserve HTML tags like <br>, <strong>, <a>
            el.innerHTML = text;
        }
    });
    
    // Handle special case for hero-name with the (Zed) suffix
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        const baseName = heroName.getAttribute(`data-${lang}`);
        if (baseName) {
            heroName.innerHTML = baseName + ' <span style="font-size: 0.5em; font-weight: 400;">(Zed)</span>';
        }
    }
    
    // Handle CV link - switch between English and Chinese resume
    const cvLink = document.querySelector('.cv-link');
    if (cvLink) {
        const cvUrl = lang === 'zh' ? cvLink.getAttribute('data-cv-zh') : cvLink.getAttribute('data-cv-en');
        if (cvUrl) {
            cvLink.href = cvUrl;
        }
    }
    
    // Update page title
    document.title = lang === 'zh' ? '刘炫佑 | 人机交互研究者' : 'Xuanyou Liu | HCI Researcher';
    
    // Update html lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
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
// Styles moved to styles.css

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

/**
 * Profile Image Tap Toggle (Mobile)
 * On touch devices, tap to toggle between profile images
 */
function initProfileImageTap() {
    // Only apply on touch devices
    if (!window.matchMedia('(hover: none)').matches) return;

    const heroImage = document.querySelector('.hero-image');
    if (!heroImage) return;

    heroImage.addEventListener('click', () => {
        heroImage.classList.toggle('tapped');
    });
}
