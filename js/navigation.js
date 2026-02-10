/**
 * NAVIGATION.JS
 * Sistema de Navegação Responsivo para KoddaHub
 * 
 * Versão: 2.0.0
 * Autor: Angela Machado
 * Data: 2024
 * 
 * Descrição:
 * Gerencia navegação mobile/desktop, scroll suave, highlight de seções ativas,
 * menu responsivo, e efeitos de scroll no header.
 * 
 * Funcionalidades:
 * 1. Menu mobile com toggle
 * 2. Scroll suave para âncoras
 * 3. Highlight da seção ativa durante scroll
 * 4. Botão "voltar ao topo"
 * 5. Efeitos de scroll no navbar
 * 6. Navegação por teclado
 * 7. Responsividade automática
 */

// ============================================================================
// INICIALIZAÇÃO PRINCIPAL
// ============================================================================

/**
 * Inicializa todos os sistemas de navegação quando o DOM está pronto
 * @returns {void}
 */
function initializeAllNavigation() {
    initializeNavigation();
    initializeScrollEffects();
    initializeMobileMenu();
    initializeBackToTop();
    updateActiveNav();
    initializeKeyboardNavigation();
    handleResponsiveNavigation();
    
    logNavigation('Sistema de navegação inicializado com sucesso');
}

// Inicializa quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', initializeAllNavigation);

// ============================================================================
// SISTEMA DE NAVEGAÇÃO PRINCIPAL
// ============================================================================

/**
 * Inicializa o sistema de navegação completo
 * Configura eventos, toggle do menu, e comportamentos
 * @returns {void}
 */
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.querySelector('.navbar-modern');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navToggle || !navMenu) {
        logNavigation('Elementos de navegação não encontrados');
        return;
    }
    
    // 1. TOGGLE DO MENU MOBILE
    navToggle.addEventListener('click', toggleMobileMenu);
    updateToggleIcon(navToggle, navMenu);
    
    // 2. COMPORTAMENTO DOS LINKS DE NAVEGAÇÃO
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // 3. FECHA MENU AO CLICAR FORA
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active')) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu(navToggle, navMenu);
            }
        }
    });
    
    // 4. FECHA MENU COM TECLA ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu(navToggle, navMenu);
        }
    });
    
    // 5. DESTACA LINK ATUAL BASEADO NA PÁGINA
    highlightCurrentPageLink(navLinks);
    
    logNavigation('Navegação principal configurada');
}

/**
 * Manipula clique em links de navegação
 * @param {Event} e - Evento de clique
 * @returns {void}
 */
function handleNavLinkClick(e) {
    const href = this.getAttribute('href');
    
    // Se for link âncora (#), faz scroll suave
    if (href && href.startsWith('#')) {
        e.preventDefault();
        
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        // Fecha menu mobile se estiver aberto
        if (navToggle && navMenu && navMenu.classList.contains('active')) {
            closeMobileMenu(navToggle, navMenu);
        }
        
        // Scroll suave para a seção
        smoothScrollToSection(href);
        
        // Adiciona histórico do navegador
        if (history.pushState) {
            history.pushState(null, null, href);
        }
    }
}

/**
 * Destaca link da página atual
 * @param {NodeList} navLinks - Lista de links de navegação
 * @returns {void}
 */
function highlightCurrentPageLink(navLinks) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href && (href === currentPage || href === `./${currentPage}`)) {
            link.classList.add('current-page');
            link.style.color = 'var(--orange-vibrant)';
            link.style.fontWeight = '600';
        }
    });
}

// ============================================================================
// MENU MOBILE
// ============================================================================

/**
 * Alterna estado do menu mobile (abrir/fechar)
 * @returns {void}
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
 * @param {HTMLElement} menu - Elemento do menu
 * @returns {void}
 */
function openMobileMenu(toggle, menu) {
    menu.classList.add('active');
    toggle.classList.add('active');
    updateToggleIcon(toggle, menu);
    
    // Previne scroll do body
    document.body.style.overflow = 'hidden';
    
    // Animações
    menu.style.transition = 'all 0.3s ease-out';
    
    // Foco no primeiro link para acessibilidade
    setTimeout(() => {
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
    }, 300);
    
    logNavigation('Menu mobile aberto');
}

/**
 * Fecha o menu mobile
 * @param {HTMLElement} toggle - Botão de toggle
 * @param {HTMLElement} menu - Elemento do menu
 * @returns {void}
 */
function closeMobileMenu(toggle, menu) {
    menu.classList.remove('active');
    toggle.classList.remove('active');
    updateToggleIcon(toggle, menu);
    
    // Restaura scroll do body
    document.body.style.overflow = '';
    
    // Retorna foco para o toggle button para acessibilidade
    toggle.focus();
    
    logNavigation('Menu mobile fechado');
}

/**
 * Atualiza ícone do botão de toggle (hamburger/X)
 * @param {HTMLElement} toggle - Botão de toggle
 * @param {HTMLElement} menu - Elemento do menu
 * @returns {void}
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

// ============================================================================
// SCROLL SUAVE
// ============================================================================

/**
 * Scroll suave para seções da página
 * @param {string} targetSelector - Seletor da seção (#id)
 * @returns {void}
 */
function smoothScrollToSection(targetSelector) {
    if (!targetSelector || targetSelector === '#') return;
    
    const target = document.querySelector(targetSelector);
    if (!target) {
        logNavigation(`Seção ${targetSelector} não encontrada`);
        return;
    }
    
    // Calcula posição considerando altura do header
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    const offset = 20; // Offset adicional
    const targetPosition = target.offsetTop - headerHeight - offset;
    
    // Scroll suave com fallback para navegadores antigos
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
        // Fallback para navegadores antigos
        smoothScrollFallback(targetPosition);
    }
    
    logNavigation(`Scroll para ${targetSelector}`);
}

/**
 * Fallback de scroll suave para navegadores antigos
 * @param {number} targetPosition - Posição alvo
 * @returns {void}
 */
function smoothScrollFallback(targetPosition) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 500;
    let start = null;
    
    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        
        // Easing function (easeOutCubic)
        const easing = 1 - Math.pow(1 - percentage, 3);
        
        window.scrollTo(0, startPosition + distance * easing);
        
        if (progress < duration) {
            window.requestAnimationFrame(step);
        }
    }
    
    window.requestAnimationFrame(step);
}

// ============================================================================
// EFEITOS DE SCROLL NO HEADER
// ============================================================================

/**
 * Inicializa efeitos visuais no header durante scroll
 * @returns {void}
 */
function initializeScrollEffects() {
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar-modern');
    
    if (!navbar) {
        logNavigation('Navbar não encontrado para efeitos de scroll');
        return;
    }
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // 1. ADICIONA/REMOVE SOMBRA E BACKGROUND NO SCROLL
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            navbar.style.backdropFilter = 'blur(5px)';
        }
        
        // 2. ESCONDE/MOSTRA NAVBAR BASEADO NA DIREÇÃO DO SCROLL
        if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY) {
                // Scroll para baixo - esconde navbar
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.transition = 'transform 0.3s ease-out';
            } else {
                // Scroll para cima - mostra navbar
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    logNavigation('Efeitos de scroll configurados');
}

// ============================================================================
// HIGHLIGHT DA SEÇÃO ATIVA
// ============================================================================

/**
 * Atualiza destaque da seção ativa durante scroll
 * @returns {void}
 */
function updateActiveNav() {
    const navLinks = document.querySelectorAll('a.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    if (navLinks.length === 0 || sections.length === 0) {
        logNavigation('Nenhuma seção ou link de navegação encontrado');
        return;
    }
    
    // Debounce para performance
    const handleScroll = debounce(() => {
        const scrollPosition = window.scrollY + 100;
        let currentSection = '';
        
        // Encontra a seção atual baseada na posição do scroll
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Atualiza estado dos links
        updateNavLinksState(navLinks, currentSection);
        
    }, 100);
    
    // Adiciona listener
    window.addEventListener('scroll', handleScroll);
    
    // Executa uma vez para estado inicial
    handleScroll();
    
    logNavigation('Highlight de seções ativas configurado');
}

/**
 * Atualiza estado visual dos links de navegação
 * @param {NodeList} navLinks - Links de navegação
 * @param {string} currentSection - ID da seção atual
 * @returns {void}
 */
function updateNavLinksState(navLinks, currentSection) {
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkSection = href.substring(1); // Remove o #
        
        // Remove classes ativas anteriores
        link.classList.remove('active');
        
        // Adiciona classe ativa se for a seção atual
        if (linkSection === currentSection) {
            link.classList.add('active');
            
            // Adiciona indicador visual
            if (!link.querySelector('.active-indicator')) {
                addActiveIndicator(link);
            }
        } else {
            // Remove indicador visual
            const indicator = link.querySelector('.active-indicator');
            if (indicator) indicator.remove();
        }
    });
}

/**
 * Adiciona indicador visual ao link ativo
 * @param {HTMLElement} link - Elemento do link
 * @returns {void}
 */
function addActiveIndicator(link) {
    const indicator = document.createElement('span');
    indicator.className = 'active-indicator';
    indicator.style.cssText = `
        display: block;
        width: 6px;
        height: 6px;
        background: var(--orange-vibrant);
        border-radius: 50%;
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        animation: pulse 2s infinite;
    `;
    
    link.style.position = 'relative';
    link.appendChild(indicator);
}

// ============================================================================
// BOTÃO "VOLTAR AO TOPO"
// ============================================================================

/**
 * Inicializa botão "Voltar ao Topo"
 * @returns {void}
 */
function initializeBackToTop() {
    // Cria botão se não existir
    let backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) {
        backToTopBtn = createBackToTopButton();
    }
    
    // Mostra/esconde baseado no scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            showBackToTopButton(backToTopBtn);
        } else {
            hideBackToTopButton(backToTopBtn);
        }
    });
    
    // Scroll suave ao topo
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    logNavigation('Botão "Voltar ao Topo" configurado');
}

/**
 * Cria botão "Voltar ao Topo"
 * @returns {HTMLElement} - Botão criado
 */
function createBackToTopButton() {
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Voltar ao topo da página');
    btn.innerHTML = `
        <i class="fas fa-chevron-up"></i>
        <span class="sr-only">Voltar ao topo</span>
    `;
    
    // Estilos inline (podem ser movidos para CSS)
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--blue-electric), var(--orange-vibrant));
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
        transition: all 0.3s ease;
        z-index: 999;
        opacity: 0;
        transform: translateY(10px);
    `;
    
    // Efeitos hover
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px) scale(1.1)';
        btn.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0) scale(1)';
        btn.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
    });
    
    document.body.appendChild(btn);
    return btn;
}

/**
 * Mostra botão "Voltar ao Topo"
 * @param {HTMLElement} btn - Elemento do botão
 * @returns {void}
 */
function showBackToTopButton(btn) {
    btn.style.display = 'flex';
    setTimeout(() => {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
    }, 10);
}

/**
 * Esconde botão "Voltar ao Topo"
 * @param {HTMLElement} btn - Elemento do botão
 * @returns {void}
 */
function hideBackToTopButton(btn) {
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(10px)';
    setTimeout(() => {
        btn.style.display = 'none';
    }, 300);
}

// ============================================================================
// MENU MOBILE AVANÇADO
// ============================================================================

/**
 * Inicializa funcionalidades avançadas do menu mobile
 * @returns {void}
 */
function initializeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    // Cria overlay para fechar menu
    const overlay = createMobileOverlay();
    document.body.appendChild(overlay);
    
    // Atualiza overlay baseado no estado do menu
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
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
    
    // Fecha menu ao clicar no overlay
    overlay.addEventListener('click', () => {
        const navToggle = document.getElementById('navToggle');
        if (navToggle && navMenu.classList.contains('active')) {
            closeMobileMenu(navToggle, navMenu);
        }
    });
    
    logNavigation('Menu mobile avançado configurado');
}

/**
 * Cria overlay para menu mobile
 * @returns {HTMLElement} - Elemento do overlay
 */
function createMobileOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 997;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    `;
    
    return overlay;
}

// ============================================================================
// NAVEGAÇÃO POR TECLADO
// ============================================================================

/**
 * Inicializa navegação por teclado
 * @returns {void}
 */
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        const navMenu = document.getElementById('navMenu');
        if (!navMenu || !navMenu.classList.contains('active')) return;
        
        const navLinks = navMenu.querySelectorAll('a');
        if (navLinks.length === 0) return;
        
        const currentIndex = Array.from(navLinks).findIndex(link => 
            document.activeElement === link
        );
        
        // Navegação com setas
        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % navLinks.length;
                navLinks[nextIndex].focus();
                break;
                
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
                navLinks[prevIndex].focus();
                break;
                
            case 'Tab':
                // Mantém foco dentro do menu quando aberto
                if (currentIndex === navLinks.length - 1 && !e.shiftKey) {
                    e.preventDefault();
                    navLinks[0].focus();
                } else if (currentIndex === 0 && e.shiftKey) {
                    e.preventDefault();
                    navLinks[navLinks.length - 1].focus();
                }
                break;
        }
    });
    
    logNavigation('Navegação por teclado configurada');
}

// ============================================================================
// RESPONSIVIDADE
// ============================================================================

/**
 * Gerencia comportamento responsivo da navegação
 * @returns {void}
 */
function handleResponsiveNavigation() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    /**
     * Verifica tamanho da tela e ajusta navegação
     */
    function checkScreenSize() {
        // Em desktop (> 768px), garante que menu está visível
        if (window.innerWidth > 768) {
            if (navMenu && navMenu.classList.contains('active')) {
                closeMobileMenu(navToggle, navMenu);
            }
            document.body.style.overflow = '';
        }
    }
    
    // Verifica no carregamento
    checkScreenSize();
    
    // Verifica no redimensionamento (com debounce)
    window.addEventListener('resize', debounce(checkScreenSize, 250));
    
    logNavigation('Responsividade configurada');
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

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
 * Log para debug e monitoramento
 * @param {string} message - Mensagem de log
 * @param {string} type - Tipo de log (info, warn, error)
 * @returns {void}
 */
function logNavigation(message, type = 'info') {
    const styles = {
        info: 'color: #10B981; font-weight: bold;',
        warn: 'color: #F59E0B; font-weight: bold;',
        error: 'color: #EF4444; font-weight: bold;'
    };
    
    const timestamp = new Date().toLocaleTimeString();
    console.log(`%c[Navigation ${timestamp}] ${message}`, styles[type]);
}

// ============================================================================
// DESTAQUE DA SEÇÃO ATUAL
// ============================================================================

/**
 * Destaca a seção atual no menu
 * @param {string} sectionId - ID da seção a destacar
 * @returns {void}
 */
function highlightCurrentSection(sectionId) {
    const navLinks = document.querySelectorAll('a.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkSectionId = href.substring(1);
        
        // Remove destaque anterior
        link.classList.remove('current-section');
        
        // Aplica destaque se for a seção atual
        if (linkSectionId === sectionId) {
            link.classList.add('current-section');
            
            // Estilos customizados
            link.style.cssText = `
                color: var(--orange-vibrant) !important;
                font-weight: 600 !important;
                position: relative;
            `;
            
            // Adiciona underline animado
            addNavUnderline(link);
        } else {
            // Remove estilos
            link.style.cssText = '';
            
            // Remove underline
            const underline = link.querySelector('.nav-underline');
            if (underline) underline.remove();
        }
    });
}

/**
 * Adiciona underline animado ao link
 * @param {HTMLElement} link - Elemento do link
 * @returns {void}
 */
function addNavUnderline(link) {
    if (!link.querySelector('.nav-underline')) {
        const underline = document.createElement('div');
        underline.className = 'nav-underline';
        underline.style.cssText = `
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--orange-vibrant);
            transform: scaleX(0);
            transform-origin: left;
            animation: underlineExpand 0.3s ease-out forwards;
        `;
        link.appendChild(underline);
    }
}

// ============================================================================
// EXPORTAÇÕES PARA USO EM MÓDULOS (OPCIONAL)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeAllNavigation,
        toggleMobileMenu,
        smoothScrollToSection,
        updateActiveNav,
        initializeBackToTop,
        debounce,
        highlightCurrentSection,
        logNavigation
    };
}

// ============================================================================
// CONFIGURAÇÕES DE ANIMAÇÃO (CSS)
// ============================================================================

// Adiciona estilos de animação se não existirem
function addNavigationStyles() {
    if (!document.getElementById('navigation-styles')) {
        const style = document.createElement('style');
        style.id = 'navigation-styles';
        style.textContent = `
            /* Animação para underline */
            @keyframes underlineExpand {
                from { transform: scaleX(0); }
                to { transform: scaleX(1); }
            }
            
            /* Animação para indicador ativo */
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
                50% { opacity: 0.5; transform: translateX(-50%) scale(1.2); }
            }
            
            /* Estilos para menu mobile */
            @media (max-width: 768px) {
                .navbar-menu {
                    position: fixed;
                    top: 70px;
                    left: 0;
                    right: 0;
                    background: var(--white-pure);
                    flex-direction: column;
                    padding: 20px;
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease-out;
                    z-index: 998;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }
                
                .navbar-menu.active {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }
                
                .nav-link {
                    width: 100%;
                    padding: 15px 0;
                    border-bottom: 1px solid var(--gray-light);
                    text-align: left;
                }
                
                .nav-link:last-child {
                    border-bottom: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Adiciona estilos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', addNavigationStyles);

// ============================================================================
// EXPORTAÇÕES GLOBAIS (para navegador)
// ============================================================================

// Torna funções disponíveis globalmente se necessário
window.NavigationSystem = {
    initializeAllNavigation,
    toggleMobileMenu,
    smoothScrollToSection,
    updateActiveNav,
    highlightCurrentSection
};

// ============================================================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================================================

// Verifica se já está em um evento DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllNavigation);
} else {
    // DOM já carregado, inicializa imediatamente
    setTimeout(initializeAllNavigation, 100);
}

logNavigation('Módulo de navegação carregado. Aguardando inicialização...');