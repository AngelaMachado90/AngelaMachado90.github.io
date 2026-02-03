/**
 * navigation.js - Sistema de Navegação Responsivo
 * Versão: 1.0.0
 * Autor: Angela Machado
 * Descrição: Gerencia navegação mobile, scroll suave, highlight de seções ativas
 */

// Inicialização quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeMobileMenu();
    initializeBackToTop();
    
    // Ativa a navegação por seções
    updateActiveNav();
});

/**
 * Inicializa o sistema de navegação completo
 */
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.querySelector('.navbar-modern');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle do menu mobile
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleMobileMenu);
        
        // Atualiza ícone do toggle
        updateToggleIcon(navToggle, navMenu);
    }
    
    // Fecha menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Para links âncora, fecha o menu
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // Fecha menu mobile
                if (navToggle && navMenu) {
                    closeMobileMenu(navToggle, navMenu);
                }
                
                // Scroll suave para a seção
                smoothScrollToSection(href);
            }
        });
    });
    
    // Fecha menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (navToggle && navMenu && navMenu.classList.contains('active')) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu(navToggle, navMenu);
            }
        }
    });
    
    // Fecha menu com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            if (navToggle) {
                closeMobileMenu(navToggle, navMenu);
            }
        }
    });
    
    // Initialize navigation highlighting
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
 * Alterna o menu mobile
 */
function toggleMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggle || !navMenu) return;
    
    const isActive = navMenu.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu(navToggle, navMenu);
    } else {
        openMobileMenu(navToggle, navMenu);
    }
}

/**
 * Abre o menu mobile
 * @param {HTMLElement} toggle - Botão de toggle
 * @param {HTMLElement} menu - Menu de navegação
 */
function openMobileMenu(toggle, menu) {
    menu.classList.add('active');
    toggle.classList.add('active');
    updateToggleIcon(toggle, menu);
    
    // Previne scroll do body quando menu está aberto
    document.body.style.overflow = 'hidden';
    
    // Animação suave
    menu.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
}

/**
 * Fecha o menu mobile
 * @param {HTMLElement} toggle - Botão de toggle
 * @param {HTMLElement} menu - Menu de navegação
 */
function closeMobileMenu(toggle, menu) {
    menu.classList.remove('active');
    toggle.classList.remove('active');
    updateToggleIcon(toggle, menu);
    
    // Restaura scroll do body
    document.body.style.overflow = '';
    
    // Animação suave
    menu.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
}

/**
 * Atualiza o ícone do botão de toggle
 * @param {HTMLElement} toggle - Botão de toggle
 * @param {HTMLElement} menu - Menu de navegação
 */
function updateToggleIcon(toggle, menu) {
    const icon = toggle.querySelector('i');
    if (!icon) return;
    
    if (menu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    }
}

/**
 * Inicializa efeitos de scroll no header
 */
function initializeScrollEffects() {
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar-modern');
    const header = document.querySelector('header');
    
    if (!navbar && !header) return;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Efeito de scroll no navbar
        if (navbar) {
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
                navbar.style.backdropFilter = 'none';
                navbar.style.backgroundColor = '';
            }
        }
        
        // Header sticky com shadow
        if (header) {
            if (currentScrollY > 10) {
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                header.style.transition = 'box-shadow 0.3s ease';
            } else {
                header.style.boxShadow = 'none';
            }
        }
        
        // Hide/show header on scroll direction
        if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY) {
                // Scrolling down - hide header
                if (navbar) navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show header
                if (navbar) navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
}

/**
 * Inicializa menu mobile com funcionalidades extras
 */
function initializeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    // Adiciona overlay para fechar menu
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 998;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    `;
    
    document.body.appendChild(overlay);
    
    // Fecha menu ao clicar no overlay
    overlay.addEventListener('click', function() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        if (navToggle && navMenu) {
            closeMobileMenu(navToggle, navMenu);
        }
    });
    
    // Atualiza visibilidade do overlay
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (navMenu.classList.contains('active')) {
                    overlay.style.opacity = '1';
                    overlay.style.visibility = 'visible';
                } else {
                    overlay.style.opacity = '0';
                    overlay.style.visibility = 'hidden';
                }
            }
        });
    });
    
    observer.observe(navMenu, { attributes: true });
}

/**
 * Scroll suave para seções
 * @param {string} targetSelector - Seletor da seção alvo
 */
function smoothScrollToSection(targetSelector) {
    if (!targetSelector || targetSelector === '#') return;
    
    const target = document.querySelector(targetSelector);
    if (!target) return;
    
    // Calcula a posição considerando header fixo
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    const targetPosition = target.offsetTop - headerHeight - 20;
    
    // Scroll suave
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Ativa links de navegação baseado na seção visível
 */
function updateActiveNav() {
    const navLinks = document.querySelectorAll('a.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    if (navLinks.length === 0 || sections.length === 0) return;
    
    // Função debounced para performance
    const handleScroll = debounce(function() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        
        // Encontra a seção atual
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Atualiza links ativos
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href && href === `#${currentSection}`) {
                link.classList.add('active');
                
                // Estilos customizados para link ativo
                link.style.color = 'var(--primary-color, #2563eb)';
                link.style.fontWeight = '600';
                
                // Adiciona indicador visual
                if (!link.querySelector('.active-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.className = 'active-indicator';
                    indicator.style.cssText = `
                        display: block;
                        width: 4px;
                        height: 4px;
                        background: var(--primary-color, #2563eb);
                        border-radius: 50%;
                        position: absolute;
                        bottom: -8px;
                        left: 50%;
                        transform: translateX(-50%);
                    `;
                    link.style.position = 'relative';
                    link.appendChild(indicator);
                }
            } else {
                link.style.color = '';
                link.style.fontWeight = '';
                
                // Remove indicador visual
                const indicator = link.querySelector('.active-indicator');
                if (indicator) indicator.remove();
            }
        });
    }, 100);
    
    // Adiciona listener de scroll
    window.addEventListener('scroll', handleScroll);
    
    // Executa uma vez para definir estado inicial
    handleScroll();
}

/**
 * Inicializa botão "voltar ao topo"
 */
function initializeBackToTop() {
    // Cria botão se não existir
    let backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTop';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = `
            <i class="fas fa-chevron-up"></i>
            <span class="sr-only">Voltar ao topo</span>
        `;
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color, #2563eb);
            color: white;
            border: none;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        backToTopBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
        });
        backToTopBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
        });
        
        document.body.appendChild(backToTopBtn);
    }
    
    // Mostra/esconde botão baseado no scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
            setTimeout(() => {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            }, 10);
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
            setTimeout(() => {
                backToTopBtn.style.display = 'none';
            }, 300);
        }
    });
    
    // Scroll suave ao topo
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Função debounce para otimização de performance
 * @param {Function} func - Função a ser debounced
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} - Função debounced
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
 * Destaca a seção atual no menu
 * @param {string} sectionId - ID da seção a destacar
 */
function highlightCurrentSection(sectionId) {
    const navLinks = document.querySelectorAll('a.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkSectionId = href.substring(1);
        
        // Remove highlight anterior
        link.classList.remove('current-section');
        
        // Aplica highlight se for a seção atual
        if (linkSectionId === sectionId) {
            link.classList.add('current-section');
            
            // Adiciona estilos customizados
            link.style.cssText = `
                color: var(--primary-color, #2563eb) !important;
                font-weight: 600 !important;
                position: relative;
            `;
            
            // Adiciona underline animado
            if (!link.querySelector('.nav-underline')) {
                const underline = document.createElement('div');
                underline.className = 'nav-underline';
                underline.style.cssText = `
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: var(--primary-color, #2563eb);
                    transform: scaleX(1);
                    transition: transform 0.3s ease;
                `;
                link.appendChild(underline);
            }
        } else {
            // Remove estilos customizados
            link.style.cssText = '';
            
            // Remove underline
            const underline = link.querySelector('.nav-underline');
            if (underline) underline.remove();
        }
    });
}

/**
 * Adiciona navegação por teclado
 */
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        const navMenu = document.getElementById('navMenu');
        if (!navMenu || !navMenu.classList.contains('active')) return;
        
        const navLinks = navMenu.querySelectorAll('a');
        const currentIndex = Array.from(navLinks).findIndex(link => 
            document.activeElement === link
        );
        
        // Navegação com setas
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % navLinks.length;
            navLinks[nextIndex].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
            navLinks[prevIndex].focus();
        }
    });
}

/**
 * Detecta tamanho da tela e ajusta navegação
 */
function handleResponsiveNavigation() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    function checkScreenSize() {
        if (window.innerWidth > 768) {
            // Desktop - garante que menu está visível
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Verifica no carregamento e no resize
    checkScreenSize();
    window.addEventListener('resize', debounce(checkScreenSize, 250));
}

/**
 * Log para debug
 * @param {string} message - Mensagem de log
 */
function logNavigation(message) {
    console.log(`%c[Navigation] ${message}`, 'color: #10B981; font-weight: bold;');
}

// Inicializa navegação por teclado e responsividade
document.addEventListener('DOMContentLoaded', function() {
    initializeKeyboardNavigation();
    handleResponsiveNavigation();
    logNavigation('Sistema de navegação inicializado');
});

// Exporta funções para uso em outros módulos (se usando módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        toggleMobileMenu,
        smoothScrollToSection,
        updateActiveNav,
        initializeBackToTop,
        debounce,
        highlightCurrentSection,
        logNavigation
    };
}