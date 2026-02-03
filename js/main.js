/**
 * main.js - Script principal do site
 * Versão: 1.0.0
 * Autor: Angela Machado
 * Descrição: Contém as funcionalidades principais do site incluindo animações,
 *            contadores, utilitários e navegação.
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCounters();
    initializeNavigation();
});

/**
 * Inicializa as animações de scroll
 * Observa quando as seções entram na viewport e aplica animações
 */
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observa todas as seções
    document.querySelectorAll('section').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Inicializa os contadores animados
 * Observa quando os elementos com números entram na viewport e inicia a animação
 */
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    // Opções do observer para os contadores
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observa todos os contadores
    counters.forEach(counter => observer.observe(counter));
}

/**
 * Anima um contador de forma suave
 * @param {HTMLElement} element - Elemento do contador a ser animado
 */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    let current = 0;
    
    // Calcula o incremento baseado no valor alvo
    const increment = target / 50;
    const duration = 1500; // 1.5 segundos
    const interval = duration / 50; // 30ms por passo
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString('pt-BR');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString('pt-BR');
        }
    }, interval);
}

/**
 * Inicializa a navegação suave (scroll para âncoras)
 */
function initializeNavigation() {
    // Adiciona event listeners para todos os links com âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignora links que não são âncoras
            if (href === '#') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Fecha o menu mobile se estiver aberto
                const nav = document.querySelector('nav');
                if (nav && nav.classList.contains('mobile-active')) {
                    nav.classList.remove('mobile-active');
                }
                
                // Rola suavemente até o elemento
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Adiciona múltiplos event listeners a elementos com o mesmo seletor
 * @param {string} selector - Seletor CSS
 * @param {string} event - Tipo de evento (ex: 'click', 'mouseover')
 * @param {Function} callback - Função de callback
 */
function addEventListener(selector, event, callback) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.addEventListener(event, callback);
    });
}

/**
 * Oculta um elemento
 * @param {HTMLElement} element - Elemento a ser ocultado
 */
function hideElement(element) {
    element.style.display = 'none';
}

/**
 * Exibe um elemento
 * @param {HTMLElement} element - Elemento a ser exibido
 * @param {string} display - Valor da propriedade display (padrão: 'block')
 */
function showElement(element, display = 'block') {
    element.style.display = display;
}

/**
 * Debounce - Limita a frequência de execução de uma função
 * Útil para eventos como scroll e resize
 * @param {Function} func - Função a ser debounced
 * @param {number} wait - Tempo de espera em milissegundos
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
 * Throttle - Garante que uma função seja executada no máximo uma vez por período
 * @param {Function} func - Função a ser throttled
 * @param {number} limit - Limite de tempo em milissegundos
 * @returns {Function} - Função throttled
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
 * Utilitário de log para debug
 * @param {string} message - Mensagem a ser logada
 * @param {any} data - Dados adicionais para log
 */
function log(message, data = null) {
    if (data) {
        console.log(`%c${message}`, 'color: #3498DB; font-weight: bold;', data);
    } else {
        console.log(`%c${message}`, 'color: #3498DB; font-weight: bold;');
    }
}

/**
 * Formata um valor como moeda brasileira (Real)
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado como moeda
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Valida um endereço de email
 * @param {string} email - Email a ser validado
 * @returns {boolean} - True se o email é válido
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida um número de telefone brasileiro
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean} - True se o telefone é válido
 */
function isValidPhone(phone) {
    const phoneRegex = /^\(?([0-9]{2})\)?[\s-]?([9])?[\s-]?([0-9]{4})[\s-]?([0-9]{4})$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Obtém a posição offset de um elemento relativa à janela
 * @param {HTMLElement} element - Elemento a ser medido
 * @returns {Object} - Objeto com top, left, width e height
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
 * Verifica se um elemento está visível na viewport
 * @param {HTMLElement} element - Elemento a ser verificado
 * @returns {boolean} - True se o elemento está na viewport
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
 * Alterna uma classe em um elemento
 * @param {HTMLElement} element - Elemento alvo
 * @param {string} className - Nome da classe
 */
function toggleClass(element, className) {
    element.classList.toggle(className);
}

/**
 * Adiciona múltiplas classes a um elemento
 * @param {HTMLElement} element - Elemento alvo
 * @param {Array<string>} classes - Array de nomes de classes
 */
function addClasses(element, classes) {
    classes.forEach(cls => element.classList.add(cls));
}

/**
 * Remove múltiplas classes de um elemento
 * @param {HTMLElement} element - Elemento alvo
 * @param {Array<string>} classes - Array de nomes de classes
 */
function removeClasses(element, classes) {
    classes.forEach(cls => element.classList.remove(cls));
}

/**
 * Formata um número com separadores brasileiros
 * @param {number} number - Número a ser formatado
 * @returns {string} - Número formatado
 */
function formatNumber(number) {
    return number.toLocaleString('pt-BR');
}

/**
 * Copia texto para a área de transferência
 * @param {string} text - Texto a ser copiado
 * @returns {Promise<boolean>} - True se a cópia foi bem-sucedida
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Erro ao copiar texto:', err);
        return false;
    }
}

/**
 * Detecta o tipo de dispositivo
 * @returns {string} - 'mobile', 'tablet' ou 'desktop'
 */
function detectDevice() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

/**
 * Adiciona um listener para o evento de resize com debounce
 * @param {Function} callback - Função a ser executada no resize
 * @param {number} delay - Delay para debounce (opcional, padrão: 250ms)
 */
function onResize(callback, delay = 250) {
    window.addEventListener('resize', debounce(callback, delay));
}

// Inicialização adicional para melhorar a experiência
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona classe de carregamento ao body
    document.body.classList.add('loaded');
    
    // Remove a classe após um tempo
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 500);
    
    // Detecta e armazena o tipo de dispositivo
    window.deviceType = detectDevice();
    
    // Adiciona listener para resize
    onResize(function() {
        window.deviceType = detectDevice();
    });
});

// Exporta funções para uso em outros módulos (se usando módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAnimations,
        initializeCounters,
        initializeNavigation,
        animateCounter,
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
        throttle,
        formatNumber,
        copyToClipboard,
        detectDevice,
        onResize
    };
}