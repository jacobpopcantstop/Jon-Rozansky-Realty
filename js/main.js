/**
 * Market Master - Jon Rozansky Realty
 * Main JavaScript File
 */

(function() {
  'use strict';

  // ========== DOM Ready ==========
  document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initCounterAnimation();
    initRevealOnScroll();
    initAccessibilityControls();
    initMobileMenu();
    initSmoothScroll();
    initFormValidation();
  });

  // ========== Navigation ==========
  function initNavigation() {
    const nav = document.querySelector('.nav-header');
    if (!nav) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      // Add scrolled class for shadow effect
      if (currentScroll > scrollThreshold) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ========== Mobile Menu ==========
  function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function() {
      menu.classList.toggle('active');
      toggle.classList.toggle('active');

      // Update aria attributes
      const isExpanded = menu.classList.contains('active');
      toggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ========== Scroll Effects ==========
  function initScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const heroContent = hero.querySelector('.hero-content');

    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;

      if (scrolled < window.innerHeight && heroContent) {
        heroContent.style.transform = `translateY(${rate}px)`;
        heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
      }
    }, { passive: true });
  }

  // ========== Counter Animation ==========
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number, .hero-stat-number');
    if (counters.length === 0) return;

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(function(counter) {
      observer.observe(counter);
    });
  }

  function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/[\d,]+/);
    if (!match) return;

    const targetNumber = parseInt(match[0].replace(/,/g, ''), 10);
    const prefix = text.split(match[0])[0];
    const suffix = text.split(match[0])[1];
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let current = 0;
    const increment = targetNumber / steps;

    function updateCounter() {
      current += increment;
      if (current >= targetNumber) {
        current = targetNumber;
        element.textContent = prefix + formatNumber(Math.round(current)) + suffix;
        return;
      }
      element.textContent = prefix + formatNumber(Math.round(current)) + suffix;
      requestAnimationFrame(function() {
        setTimeout(updateCounter, stepDuration);
      });
    }

    element.textContent = prefix + '0' + suffix;
    updateCounter();
  }

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // ========== Reveal on Scroll ==========
  function initRevealOnScroll() {
    const reveals = document.querySelectorAll('.reveal, .testimonial-card, .service-card, .neighborhood-card');
    if (reveals.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    reveals.forEach(function(element, index) {
      element.style.transitionDelay = (index % 4) * 0.1 + 's';
      observer.observe(element);
    });
  }

  // ========== Accessibility Controls ==========
  function initAccessibilityControls() {
    const fontSizeBtn = document.querySelector('.a11y-font-size');
    if (!fontSizeBtn) return;

    const sizes = ['', 'font-size-large', 'font-size-xl'];
    let currentSize = 0;

    // Load saved preference
    const savedSize = localStorage.getItem('fontSizePreference');
    if (savedSize) {
      currentSize = sizes.indexOf(savedSize);
      if (currentSize > 0) {
        document.body.classList.add(savedSize);
      }
    }

    fontSizeBtn.addEventListener('click', function() {
      // Remove current size class
      if (sizes[currentSize]) {
        document.body.classList.remove(sizes[currentSize]);
      }

      // Move to next size
      currentSize = (currentSize + 1) % sizes.length;

      // Add new size class
      if (sizes[currentSize]) {
        document.body.classList.add(sizes[currentSize]);
      }

      // Save preference
      localStorage.setItem('fontSizePreference', sizes[currentSize]);

      // Update button title
      const sizeLabels = ['Normal', 'Large', 'Extra Large'];
      fontSizeBtn.title = 'Font Size: ' + sizeLabels[currentSize];
    });
  }

  // ========== Smooth Scroll ==========
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const navHeight = document.querySelector('.nav-header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        history.pushState(null, null, href);
      });
    });
  }

  // ========== Form Validation ==========
  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(function(field) {
          clearFieldError(field);

          if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
          } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
          } else if (field.type === 'tel' && !isValidPhone(field.value)) {
            showFieldError(field, 'Please enter a valid phone number');
            isValid = false;
          }
        });

        if (!isValid) {
          e.preventDefault();
          // Focus first error field
          const firstError = form.querySelector('.form-error');
          if (firstError) {
            firstError.previousElementSibling?.focus();
          }
        }
      });

      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
          validateField(this);
        });

        input.addEventListener('input', function() {
          if (this.classList.contains('has-error')) {
            validateField(this);
          }
        });
      });
    });
  }

  function validateField(field) {
    clearFieldError(field);

    if (field.required && !field.value.trim()) {
      showFieldError(field, 'This field is required');
      return false;
    }

    if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
      showFieldError(field, 'Please enter a valid email address');
      return false;
    }

    if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
      showFieldError(field, 'Please enter a valid phone number');
      return false;
    }

    return true;
  }

  function showFieldError(field, message) {
    field.classList.add('has-error');
    const error = document.createElement('span');
    error.className = 'form-error';
    error.textContent = message;
    error.style.color = '#dc3545';
    error.style.fontSize = '0.875rem';
    error.style.marginTop = '0.25rem';
    error.style.display = 'block';
    field.parentNode.appendChild(error);
  }

  function clearFieldError(field) {
    field.classList.remove('has-error');
    const error = field.parentNode.querySelector('.form-error');
    if (error) {
      error.remove();
    }
  }

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
  }

  // ========== Utility Functions ==========

  // Debounce function for performance
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for scroll events
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

})();

// ========== Testimonial Carousel (if multiple) ==========
class TestimonialCarousel {
  constructor(container) {
    this.container = container;
    this.slides = container.querySelectorAll('.testimonial-slide');
    this.currentIndex = 0;
    this.autoplayInterval = null;

    if (this.slides.length > 1) {
      this.init();
    }
  }

  init() {
    this.createDots();
    this.showSlide(0);
    this.startAutoplay();

    // Pause on hover
    this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());
  }

  createDots() {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';

    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => this.showSlide(index));
      dotsContainer.appendChild(dot);
    });

    this.container.appendChild(dotsContainer);
    this.dots = dotsContainer.querySelectorAll('.carousel-dot');
  }

  showSlide(index) {
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    if (this.dots) {
      this.dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    this.currentIndex = index;
  }

  nextSlide() {
    const next = (this.currentIndex + 1) % this.slides.length;
    this.showSlide(next);
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
  }

  pauseAutoplay() {
    clearInterval(this.autoplayInterval);
  }
}

// Initialize carousels
document.querySelectorAll('.testimonial-carousel').forEach(carousel => {
  new TestimonialCarousel(carousel);
});
