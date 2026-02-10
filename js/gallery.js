/**
 * gallery.js - Galeria Interativa de Demos/Templates
 * Versão: 1.0.0
 * Autor: Angela Machado
 * Descrição: Sistema completo de galeria com filtros, visualização em overlay,
 *            simulações interativas e suporte a múltiplos dispositivos e temas.
 */

(function() {
    'use strict';

    // Elementos principais da galeria
    const filters = document.querySelectorAll('.filter');
    const grid = document.getElementById('demo-grid');
    const cards = Array.from(document.querySelectorAll('.demo-card'));
    const overlay = document.getElementById('demo-overlay');
    const demoFrame = document.getElementById('demo-frame');
    const deviceSelect = document.getElementById('device-select');
    const themeSelect = document.getElementById('theme-select');
    const modeSelect = document.getElementById('mode-select');
    const closeBtn = document.getElementById('close-demo');
    const overlayTitle = document.getElementById('demo-title');
    
    // Variáveis de estado
    let currentDemo = null;
    let cartTotal = 0;
    let cartItems = [];

    /**
     * Inicializa a galeria
     */
    function initializeGallery() {
        if (!grid) {
            console.warn('Elemento #demo-grid não encontrado');
            return;
        }

        // Configura filtros
        initializeFilters();
        
        // Configura cards
        initializeCards();
        
        // Configura overlay
        initializeOverlay();
        
        // Configura controles
        initializeControls();
        
        // Configura acessibilidade
        initializeAccessibility();
        
        // Ativa primeiro filtro
        activateFirstFilter();
        
        // Log de inicialização
        logGallery('Galeria inicializada com ' + cards.length + ' cards');
    }

    /**
     * Inicializa os botões de filtro
     */
    function initializeFilters() {
        filters.forEach(btn => {
            btn.addEventListener('click', function() {
                handleFilterClick(this);
            });
            
            // Suporte a teclado
            btn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFilterClick(this);
                }
            });
        });
    }

    /**
     * Manipula clique em filtro
     * @param {HTMLElement} clickedFilter - Filtro clicado
     */
    function handleFilterClick(clickedFilter) {
        // Remove classe active de todos os filtros
        filters.forEach(b => b.classList.remove('active'));
        
        // Adiciona classe active ao filtro clicado
        clickedFilter.classList.add('active');
        clickedFilter.focus();
        
        // Obtém filtro selecionado
        const filterValue = clickedFilter.dataset.filter;
        
        // Filtra os cards
        filterCards(filterValue);
        
        // Anima transição
        animateFilterTransition();
        
        // Log
        logGallery('Filtro aplicado: ' + filterValue);
    }

    /**
     * Filtra os cards baseado no valor do filtro
     * @param {string} filterValue - Valor do filtro
     */
    function filterCards(filterValue) {
        cards.forEach(card => {
            const cardType = card.dataset.type;
            
            if (filterValue === '*' || filterValue === cardType) {
                showCard(card);
            } else {
                hideCard(card);
            }
        });
    }

    /**
     * Mostra card com animação
     * @param {HTMLElement} card - Card a ser mostrado
     */
    function showCard(card) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }

    /**
     * Esconde card com animação
     * @param {HTMLElement} card - Card a ser escondido
     */
    function hideCard(card) {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    }

    /**
     * Anima transição de filtro
     */
    function animateFilterTransition() {
        grid.style.opacity = '0.7';
        setTimeout(() => {
            grid.style.opacity = '1';
            grid.style.transition = 'opacity 0.3s ease';
        }, 150);
    }

    /**
     * Ativa primeiro filtro por padrão
     */
    function activateFirstFilter() {
        if (filters.length > 0) {
            const firstFilter = filters[0];
            firstFilter.classList.add('active');
            filterCards(firstFilter.dataset.filter);
        }
    }

    /**
     * Inicializa os cards da galeria
     */
    function initializeCards() {
        cards.forEach(card => {
            // Adiciona event listener para clique
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.open-demo')) {
                    handleCardClick(this);
                }
            });
            
            // Adiciona event listener para teclado
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCardClick(this);
                }
            });
            
            // Adiciona atributos ARIA
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Ver demonstração: ${card.querySelector('h4')?.textContent || 'Template'}`);
        });
    }

    /**
     * Manipula clique em card
     * @param {HTMLElement} card - Card clicado
     */
    function handleCardClick(card) {
        const templateId = card.dataset.template;
        const cardTitle = card.querySelector('h4')?.textContent || 'Demo';
        
        openTemplate(templateId, cardTitle, card);
        
        // Efeito visual de clique
        animateCardClick(card);
    }

    /**
     * Anima clique no card
     * @param {HTMLElement} card - Card clicado
     */
    function animateCardClick(card) {
        card.animate([
            { transform: 'scale(1)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
            { transform: 'scale(0.98)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
            { transform: 'scale(1)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }
        ], {
            duration: 300,
            easing: 'ease-in-out'
        });
    }

    /**
     * Inicializa o overlay de visualização
     */
    function initializeOverlay() {
        if (!overlay) return;
        
        // Configura fechamento por clique no overlay
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeOverlay();
            }
        });
        
        // Configura botão de fechar
        if (closeBtn) {
            closeBtn.addEventListener('click', closeOverlay);
            closeBtn.setAttribute('aria-label', 'Fechar demonstração');
        }
        
        // Adiciona overlay ao body se não existir
        if (!document.body.contains(overlay)) {
            document.body.appendChild(overlay);
        }
    }

    /**
     * Inicializa controles do overlay
     */
    function initializeControls() {
        // Seletor de dispositivo
        if (deviceSelect) {
            deviceSelect.addEventListener('change', function() {
                applyDevice(this.value);
            });
        }
        
        // Seletor de tema
        if (themeSelect) {
            themeSelect.addEventListener('change', function() {
                applyTheme(this.value);
            });
        }
        
        // Seletor de modo (se existir)
        if (modeSelect) {
            modeSelect.addEventListener('change', function() {
                applyMode(this.value);
            });
        }
    }

    /**
     * Abre template no overlay
     * @param {string} templateId - ID do template
     * @param {string} title - Título da demo
     * @param {HTMLElement} sourceCard - Card de origem
     */
    function openTemplate(templateId, title, sourceCard) {
        if (!templateId || !overlay || !demoFrame) {
            console.error('Elementos necessários não encontrados');
            return;
        }
        
        const template = document.querySelector(templateId);
        if (!template) {
            console.error('Template não encontrado:', templateId);
            return;
        }
        
        // Armazena card atual
        currentDemo = {
            id: templateId,
            title: title,
            source: sourceCard
        };
        
        // Atualiza título
        if (overlayTitle) {
            overlayTitle.textContent = title;
        }
        
        // Limpa conteúdo anterior
        demoFrame.innerHTML = '';
        
        // Clona e adiciona template
        const clone = template.content.cloneNode(true);
        demoFrame.appendChild(clone);
        
        // Mostra overlay
        showOverlay();
        
        // Aplica configurações atuais
        if (deviceSelect) applyDevice(deviceSelect.value);
        if (themeSelect) applyTheme(themeSelect.value);
        if (modeSelect) applyMode(modeSelect.value);
        
        // Anexa comportamentos interativos
        attachDemoInteractions(demoFrame);
        
        // Inicializa carrinho
        initializeCart();
        
        // Foco no botão de fechar
        if (closeBtn) {
            setTimeout(() => closeBtn.focus(), 100);
        }
        
        // Log
        logGallery('Demo aberta: ' + title);
    }

    /**
     * Mostra overlay com animação
     */
    function showOverlay() {
        if (!overlay) return;
        
        overlay.setAttribute('aria-hidden', 'false');
        overlay.style.display = 'flex';
        
        // Anima entrada
        requestAnimationFrame(() => {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease';
            
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
            });
        });
        
        // Previne scroll do body
        document.body.style.overflow = 'hidden';
    }

    /**
     * Fecha overlay
     */
    function closeOverlay() {
        if (!overlay) return;
        
        // Anima saída
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            overlay.setAttribute('aria-hidden', 'true');
            overlay.style.display = 'none';
            
            // Limpa conteúdo
            if (demoFrame) demoFrame.innerHTML = '';
            
            // Restaura scroll do body
            document.body.style.overflow = '';
            
            // Foco no card anterior
            if (currentDemo && currentDemo.source) {
                currentDemo.source.focus();
            }
            
            // Limpa estado
            resetDemoState();
            
            // Log
            logGallery('Demo fechada');
        }, 300);
    }

    /**
     * Aplica dispositivo selecionado
     * @param {string} device - Dispositivo (mobile, tablet, desktop)
     */
    function applyDevice(device) {
        if (!demoFrame) return;
        
        // Remove classes anteriores
        demoFrame.classList.remove('mobile', 'tablet', 'desktop');
        
        // Adiciona nova classe
        demoFrame.classList.add(device);
        
        // Aplica estilos de tamanho
        const sizes = {
            'mobile': { width: '360px', height: '640px' },
            'tablet': { width: '768px', height: '1024px' },
            'desktop': { width: '100%', height: '600px' }
        };
        
        const size = sizes[device] || sizes.desktop;
        demoFrame.style.width = size.width;
        demoFrame.style.height = size.height;
        demoFrame.style.maxWidth = device === 'desktop' ? '100%' : '90%';
        
        // Adiciona ícone do dispositivo
        updateDeviceIcon(device);
    }

    /**
     * Atualiza ícone do dispositivo
     * @param {string} device - Dispositivo selecionado
     */
    function updateDeviceIcon(device) {
        const iconMap = {
            'mobile': '📱',
            'tablet': '📱',
            'desktop': '💻'
        };
        
        const icon = iconMap[device] || '💻';
        logGallery('Dispositivo alterado: ' + device + ' ' + icon);
    }

    /**
     * Aplica tema selecionado
     * @param {string} theme - Tema (light, dark, etc.)
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-demo-theme', theme);
        
        // Adiciona classe adicional ao demo-frame
        if (demoFrame) {
            demoFrame.setAttribute('data-theme', theme);
        }
        
        logGallery('Tema alterado: ' + theme);
    }

    /**
     * Aplica modo selecionado
     * @param {string} mode - Modo (default, edit, preview)
     */
    function applyMode(mode) {
        if (!demoFrame) return;
        
        demoFrame.setAttribute('data-mode', mode);
        logGallery('Modo alterado: ' + mode);
    }

    /**
     * Anexa interações simuladas ao demo
     * @param {HTMLElement} root - Elemento raiz do demo
     */
    function attachDemoInteractions(root) {
        if (!root) return;
        
        // Simulação de formulários
        simulateForms(root);
        
        // Simulação de e-commerce
        simulateEcommerce(root);
        
        // Simulação de busca
        simulateSearch(root);
        
        // Simulação de agendamento
        simulateBooking(root);
        
        // Simulação de métricas
        simulateMetrics(root);
        
        // Efeitos visuais para botões
        addButtonEffects(root);
        
        // Simulação de tabs
        simulateTabs(root);
        
        // Simulação de accordion
        simulateAccordion(root);
    }

    /**
     * Simula envio de formulários
     * @param {HTMLElement} root - Elemento raiz
     */
    function simulateForms(root) {
        const forms = root.querySelectorAll('.sim-form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Mostra mensagem de sucesso
                showSuccessMessage(this, 'Formulário enviado com sucesso! Entraremos em contato em breve.');
                
                // Reseta formulário após delay
                setTimeout(() => {
                    form.reset();
                }, 2000);
                
                logGallery('Formulário simulado enviado');
            });
        });
    }

    /**
     * Mostra mensagem de sucesso
     * @param {HTMLElement} form - Formulário
     * @param {string} message - Mensagem
     */
    function showSuccessMessage(form, message) {
        // Cria elemento de mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            background: #10B981;
            color: white;
            padding: 12px;
            border-radius: 6px;
            margin-top: 16px;
            animation: fadeIn 0.3s ease;
        `;
        
        // Insere após o formulário
        form.parentNode.insertBefore(messageDiv, form.nextSibling);
        
        // Remove após 5 segundos
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    /**
     * Simula funcionalidades de e-commerce
     * @param {HTMLElement} root - Elemento raiz
     */
    function simulateEcommerce(root) {
        const cart = root.querySelector('.cart-items');
        const totalElement = root.querySelector('.cart-total span');
        
        if (cart) {
            const addBtns = root.querySelectorAll('.add-cart');
            
            addBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const product = this.closest('.product');
                    if (!product) return;
                    
                    const productName = product.querySelector('h5')?.textContent || 'Produto';
                    const productPrice = Number(product.dataset.price) || 0;
                    
                    // Adiciona ao carrinho
                    addToCart(productName, productPrice, cart, totalElement);
                    
                    // Efeito visual
                    animateAddToCart(this);
                });
            });
        }
    }

    /**
     * Adiciona item ao carrinho
     * @param {string} name - Nome do produto
     * @param {number} price - Preço do produto
     * @param {HTMLElement} cart - Elemento do carrinho
     * @param {HTMLElement} totalElement - Elemento do total
     */
    function addToCart(name, price, cart, totalElement) {
        // Adiciona ao array
        cartItems.push({ name, price });
        cartTotal += price;
        
        // Cria elemento do item
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span>${name}</span>
            <span class="price">R$ ${price.toFixed(2)}</span>
            <button class="remove-item" aria-label="Remover item">×</button>
        `;
        
        // Adiciona evento de remoção
        const removeBtn = itemDiv.querySelector('.remove-item');
        removeBtn.addEventListener('click', function() {
            removeFromCart(itemDiv, price);
            if (totalElement) {
                totalElement.textContent = cartTotal.toFixed(2);
            }
        });
        
        cart.appendChild(itemDiv);
        
        // Atualiza total
        if (totalElement) {
            totalElement.textContent = cartTotal.toFixed(2);
        }
        
        // Anima adição
        itemDiv.style.opacity = '0';
        itemDiv.style.transform = 'translateX(-20px)';
        itemDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        requestAnimationFrame(() => {
            itemDiv.style.opacity = '1';
            itemDiv.style.transform = 'translateX(0)';
        });
    }

    /**
     * Remove item do carrinho
     * @param {HTMLElement} itemElement - Elemento do item
     * @param {number} price - Preço do item
     */
    function removeFromCart(itemElement, price) {
        // Remove do array
        const itemName = itemElement.querySelector('span').textContent;
        cartItems = cartItems.filter(item => item.name !== itemName);
        cartTotal -= price;
        
        // Anima remoção
        itemElement.style.opacity = '0';
        itemElement.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            itemElement.remove();
        }, 300);
    }

    /**
     * Anima botão "Adicionar ao carrinho"
     * @param {HTMLElement} button - Botão clicado
     */
    function animateAddToCart(button) {
        button.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(0.95)' },
            { transform: 'scale(1)' }
        ], {
            duration: 200,
            easing: 'ease-in-out'
        });
        
        // Adiciona ícone temporário
        const icon = document.createElement('span');
        icon.innerHTML = '✓';
        icon.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 20px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        button.style.position = 'relative';
        button.appendChild(icon);
        
        icon.style.opacity = '1';
        setTimeout(() => {
            icon.style.opacity = '0';
            setTimeout(() => icon.remove(), 300);
        }, 1000);
    }

    /**
     * Inicializa carrinho
     */
    function initializeCart() {
        cartItems = [];
        cartTotal = 0;
    }

    /**
     * Simula funcionalidade de busca
     * @param {HTMLElement} root - Elemento raiz
     */
    function simulateSearch(root) {
        const searchInput = root.querySelector('.search');
        
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                const items = root.querySelectorAll('.part, .search-item');
                
                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    item.style.display = text.includes(query) ? '' : 'none';
                });
                
                // Mostra mensagem se não encontrar
                const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');
                showSearchFeedback(searchInput, visibleItems.length);
            });
        }
    }

    /**
     * Mostra feedback da busca
     * @param {HTMLElement} searchInput - Campo de busca
     * @param {number} resultsCount - Número de resultados
     */
    function showSearchFeedback(searchInput, resultsCount) {
        // Remove feedback anterior
        let feedback = searchInput.nextElementSibling;
        if (feedback && feedback.classList.contains('search-feedback')) {
            feedback.remove();
        }
        
        // Cria novo feedback
        if (searchInput.value.trim() !== '') {
            feedback = document.createElement('div');
            feedback.className = 'search-feedback';
            feedback.textContent = `${resultsCount} resultado(s) encontrado(s)`;
            feedback.style.cssText = `
                font-size: 0.875rem;
                color: #6B7280;
                margin-top: 4px;
                animation: fadeIn 0.3s ease;
            `;
            
            searchInput.parentNode.insertBefore(feedback, searchInput.nextSibling);
        }
    }

    /**
     * Simula agendamento
     * @param {HTMLElement} root - Elemento raiz
     */
    function simulateBooking(root) {
        const bookBtns = root.querySelectorAll('.book');
        const bookingArea = root.querySelector('.booking-sim');
        
        bookBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const service = this.closest('.service')?.querySelector('h4')?.textContent || 'serviço';
                
                if (bookingArea) {
                    bookingArea.innerHTML = `
                        <div class="booking-confirmation">
                            <h4>✓ Agendamento Confirmado</h4>
                            <p>Serviço: ${service}</p>
                            <p>Data: ${formatDate(new Date())}</p>
                            <p>Entraremos em contato para confirmação.</p>
                        </div>
                    `;
                    
                    // Anima confirmação
                    bookingArea.style.opacity = '0';
                    bookingArea.style.transform = 'translateY(10px)';
                    bookingArea.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    
                    requestAnimationFrame(() => {
                        bookingArea.style.opacity = '1';
                        bookingArea.style.transform = 'translateY(0)';
                    });
                }
                
                logGallery('Agendamento simulado: ' + service);
            });
        });
    }

    /**
     * Formata data
     * @param {Date} date - Data
     * @returns {string} - Data formatada
     */
    function formatDate(date) {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Simula métricas
     * @param {HTMLElement} root - Elemento raiz
     */
    function simulateMetrics(root) {
        const incButton = root.querySelector('.inc-leads');
        
        if (incButton) {
            incButton.addEventListener('click', function() {
                const metricElement = root.querySelector('.metric strong');
                if (metricElement) {
                    const currentValue = Number(metricElement.textContent);
                    metricElement.textContent = currentValue + 1;
                    
                    // Efeito visual
                    metricElement.animate([
                        { transform: 'scale(1)', color: 'inherit' },
                        { transform: 'scale(1.2)', color: '#10B981' },
                        { transform: 'scale(1)', color: 'inherit' }
                    ], {
                        duration: 500,
                        easing: 'ease-in-out'
                    });
                    
                    logGallery('Métrica incrementada: ' + (currentValue + 1));
                }
            });
        }
    }

    /**
     * Adiciona efeitos visuais a botões
     * @param {HTMLElement} root - Elemento raiz
     */
    function addButtonEffects(root) {
        root.querySelectorAll('.cta-sim, .open-demo, button:not(.no-effect)').forEach(btn => {
            btn.addEventListener('click', function() {
                // Efeito de clique
                this.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(0.96)' },
                    { transform: 'scale(1)' }
                ], {
                    duration: 200,
                    easing: 'ease-in-out'
                });
                
                // Efeito de ripple
                createRippleEffect(this);
            });
        });
    }

    /**
     * Cria efeito ripple em botões
     * @param {HTMLElement} button - Botão clicado
     */
    function createRippleEffect(button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.7);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        // Remove após animação
        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * Simula tabs
     * @param {HTMLElement} root - Elemento raiz
     */
    function simulateTabs(root) {
        const tabButtons = root.querySelectorAll('.tab-button');
        const tabContents = root.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // Remove active de todos
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Adiciona active ao selecionado
                this.classList.add('active');
                const targetContent = root.querySelector(`#${tabId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    /**
     * Simula accordion
     * @param {HTMLElement} root - Elemento raiz
     */
    function simulateAccordion(root) {
        const accordionHeaders = root.querySelectorAll('.accordion-header');
        
        accordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const isActive = content.style.display === 'block';
                
                // Fecha todos os outros
                accordionHeaders.forEach(otherHeader => {
                    if (otherHeader !== this) {
                        otherHeader.nextElementSibling.style.display = 'none';
                        otherHeader.classList.remove('active');
                    }
                });
                
                // Alterna atual
                content.style.display = isActive ? 'none' : 'block';
                this.classList.toggle('active', !isActive);
                
                // Anima
                if (!isActive) {
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(-10px)';
                    content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    
                    requestAnimationFrame(() => {
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    });
                }
            });
        });
    }

    /**
     * Inicializa acessibilidade
     */
    function initializeAccessibility() {
        // Fechar com ESC
        window.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay && overlay.getAttribute('aria-hidden') === 'false') {
                closeOverlay();
            }
        });
        
        // Trap focus dentro do overlay
        overlay.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && overlay.getAttribute('aria-hidden') === 'false') {
                const focusableElements = overlay.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
        
        // Adiciona roles ARIA
        if (grid) grid.setAttribute('role', 'grid');
        if (overlay) overlay.setAttribute('role', 'dialog');
        if (overlay) overlay.setAttribute('aria-modal', 'true');
    }

    /**
     * Reseta estado da demo
     */
    function resetDemoState() {
        currentDemo = null;
        cartItems = [];
        cartTotal = 0;
    }

    /**
     * Log para debug
     * @param {string} message - Mensagem de log
     */
    function logGallery(message) {
        console.log(`%c[Gallery] ${message}`, 'color: #8B5CF6; font-weight: bold;');
    }

    // Adiciona estilo CSS para animações
    function addGalleryStyles() {
        if (!document.querySelector('#gallery-styles')) {
            const style = document.createElement('style');
            style.id = 'gallery-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .demo-card {
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                
                .success-message {
                    animation: fadeIn 0.3s ease;
                }
                
                .cart-item {
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Inicialização
    document.addEventListener('DOMContentLoaded', function() {
        addGalleryStyles();
        initializeGallery();
        logGallery('Sistema de galeria carregado');
    });

    // Exporta funções para uso em outros módulos (se usando módulos)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            initializeGallery,
            openTemplate,
            closeOverlay,
            applyDevice,
            applyTheme,
            logGallery
        };
    }

})();