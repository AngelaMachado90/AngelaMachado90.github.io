// Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navToggle) navToggle.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar-modern');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Ativa links nav com hash
function updateActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

updateActiveNav();
  const nav = document.querySelector('nav');
  
  if (nav.classList.contains('mobile-active')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
  } else {
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
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
