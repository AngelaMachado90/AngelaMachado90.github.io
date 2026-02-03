/* ========================================
   MAIN.JS - Core JavaScript Functionality
   ======================================== */

// Document ready state
document.addEventListener('DOMContentLoaded', function() {
  initializeScrollAnimations();
  initializeSmoothScroll();
});

/**
 * Initialize scroll animations for elements
 * Animates elements when they come into view
 */
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all stagger items
  document.querySelectorAll('.stagger-item').forEach(element => {
    observer.observe(element);
  });
}

/**
 * Initialize smooth scroll behavior
 * Provides smooth scrolling for anchor links
 */
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just "#"
      if (href === '#') return;
      
      const targetElement = document.querySelector(href);
      
      if (targetElement) {
        e.preventDefault();
        
        // Close mobile menu if open
        const nav = document.querySelector('nav');
        if (nav && nav.classList.contains('mobile-active')) {
          nav.classList.remove('mobile-active');
        }
        
        // Scroll to element
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Utility function to add event listeners
 */
function addEventListener(selector, event, callback) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.addEventListener(event, callback);
  });
}

/**
 * Utility function to hide element
 */
function hideElement(element) {
  element.style.display = 'none';
}

/**
 * Utility function to show element
 */
function showElement(element, display = 'block') {
  element.style.display = display;
}

/**
 * Debounce function for performance optimization
 */
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

/**
 * Throttle function for performance optimization
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Log utility for debugging
 */
function log(message, data = null) {
  if (data) {
    console.log(`%c${message}`, 'color: #3498DB; font-weight: bold;', data);
  } else {
    console.log(`%c${message}`, 'color: #3498DB; font-weight: bold;');
  }
}

/**
 * Format currency
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Validate email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Brazilian format)
 */
function isValidPhone(phone) {
  const phoneRegex = /^\(?([0-9]{2})\)?[\s-]?([9])?[\s-]?([0-9]{4})[\s-]?([0-9]{4})$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Get element offset position relative to window
 */
function getOffset(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
    width: rect.width,
    height: rect.height
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Add/remove class to element
 */
function toggleClass(element, className) {
  element.classList.toggle(className);
}

/**
 * Add multiple classes to element
 */
function addClasses(element, classes) {
  classes.forEach(cls => element.classList.add(cls));
}

/**
 * Remove multiple classes from element
 */
function removeClasses(element, classes) {
  classes.forEach(cls => element.classList.remove(cls));
}

// Export functions for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    log,
    formatCurrency,
    isValidEmail,
    isValidPhone,
    getOffset,
    isInViewport,
    toggleClass,
    addClasses,
    removeClasses,
    debounce,
    throttle
  };
}
