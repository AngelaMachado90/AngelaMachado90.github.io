/* ========================================
   NAVIGATION.JS - Mobile Menu & Navigation
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  initializeMobileMenu();
  initializeNavigation();
});

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const nav = document.querySelector('nav');
  
  if (!mobileMenuBtn || !nav) return;
  
  mobileMenuBtn.addEventListener('click', function() {
    nav.classList.toggle('mobile-active');
    updateMenuIcon();
  });
  
  // Close menu when clicking on a link
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      nav.classList.remove('mobile-active');
      updateMenuIcon();
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideNav = nav.contains(event.target);
    const isClickOnBtn = mobileMenuBtn.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnBtn && nav.classList.contains('mobile-active')) {
      nav.classList.remove('mobile-active');
      updateMenuIcon();
    }
  });
}

/**
 * Update menu icon based on menu state
 */
function updateMenuIcon() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const icon = mobileMenuBtn.querySelector('i');
  const nav = document.querySelector('nav');
  
  if (nav.classList.contains('mobile-active')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
  } else {
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  }
}

/**
 * Initialize navigation highlighting
 * Highlights active nav link based on current page
 */
function initializeNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  const currentPage = window.location.pathname.split('/').pop();
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Check if link matches current page
    if (href && href.includes(currentPage)) {
      link.style.color = 'var(--secondary-color)';
      link.style.fontWeight = '600';
    }
  });
}

/**
 * Sticky header on scroll
 */
let lastScrollY = 0;
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (!header) return;
  
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
  } else {
    header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
  }
  
  lastScrollY = window.scrollY;
}, { passive: true });

/**
 * Add active link styling on scroll
 * Updates which section is active based on scroll position
 */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', debounce(function() {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });
  
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === '#' + current) {
      item.classList.add('active');
      item.style.color = 'var(--secondary-color)';
    } else {
      item.style.color = '';
    }
  });
}, 100), { passive: true });

/**
 * Utility debounce function (if not available from main.js)
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
 * Back to top button functionality
 */
function initializeBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = 'block';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });
  
  backToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize back to top if needed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBackToTop);
} else {
  initializeBackToTop();
}
