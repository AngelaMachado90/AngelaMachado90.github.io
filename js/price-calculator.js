/**
 * price-calculator.js - Calculadora de Preços Dinâmica
 * Versão: 1.0
 * Autor: Angela Machado
 * Descrição: Sistema completo de cálculo de preços para soluções web com
 *            múltiplas opções, features adicionais e visualização detalhada.
 */

(function() {
    'use strict';

    // Preços base para diferentes tipos de solução
    const basePrices = {
        institucional: {
            price: 2500,
            label: 'Site Institucional',
            description: 'Presença online profissional com até 10 páginas',
            features: ['Design responsivo', 'SEO básico', 'Formulário de contato', 'Integração com redes sociais']
        },
        ecommerce: {
            price: 4800,
            label: 'E-commerce',
            description: 'Loja virtual completa com sistema de pagamentos',
            features: ['Catálogo de produtos', 'Carrinho de compras', 'Pagamentos online', 'Área do cliente']
        },
        industrial: {
            price: 3800,
            label: 'Site Industrial',
            description: 'Solução especializada para indústrias',
            features: ['Catálogo de produtos', 'Sistema de cotação', 'Galeria de projetos', 'Área técnica']
        },
        servicos: {
            price: 2800,
            label: 'Site de Serviços',
            description: 'Plataforma para prestadores de serviços',
            features: ['Agendamento online', 'Portfólio de trabalhos', 'Depoimentos', 'Sistema de orçamentos']
        },
        sistemas_crm: {
            price: 6500,
            label: 'Sistema CRM',
            description: 'Gestão de relacionamento com clientes',
            features: ['Cadastro de clientes', 'Histórico de interações', 'Automação de emails', 'Relatórios']
        },
        sistemas_estoque: {
            price: 5200,
            label: 'Sistema de Estoque',
            description: 'Controle completo de inventário',
            features: ['Controle de entradas/saídas', 'Alertas de reposição', 'Relatórios de movimentação', 'Integração com vendas']
        },
        sistemas_completo: {
            price: 8000,
            label: 'Sistema Completo',
            description: 'Solução integrada ERP/CRM',
            features: ['Todos os módulos', 'Dashboard avançado', 'Relatórios personalizados', 'Suporte prioritário']
        }
    };

    // Features Plus e seus preços
    const plusFeatures = {
        area_restrita: {
            price: 800,
            label: 'Área Restrita/Membros',
            description: 'Acesso exclusivo para usuários cadastrados',
            category: 'Funcionalidades'
        },
        agendamento: {
            price: 1200,
            label: 'Sistema de Agendamento',
            description: 'Agendamento online com confirmação automática',
            category: 'Funcionalidades'
        },
        multilingue: {
            price: 1500,
            label: 'Site Multilíngue',
            description: 'Suporte a múltiplos idiomas com gerenciador',
            category: 'Internacionalização'
        },
        marketplaces: {
            price: 1500,
            label: 'Integração com Marketplaces',
            description: 'Conexão com Mercado Livre, Amazon, etc.',
            category: 'E-commerce'
        },
        erp_integration: {
            price: 2500,
            label: 'Integração ERP',
            description: 'Conexão com sistemas de gestão empresarial',
            category: 'Integrações'
        },
        configurador: {
            price: 2000,
            label: 'Configurador de Produtos',
            description: 'Personalização visual de produtos pelo cliente',
            category: 'E-commerce'
        },
        cotacao_complexa: {
            price: 1500,
            label: 'Sistema de Cotação Complexa',
            description: 'Orçamentos com múltiplas variáveis e condições',
            category: 'Industrial'
        },
        dashboard_cliente: {
            price: 1800,
            label: 'Dashboard do Cliente',
            description: 'Painel personalizado com métricas e relatórios',
            category: 'Dashboard'
        },
        videoteca: {
            price: 1200,
            label: 'Videoteca/Curso Online',
            description: 'Plataforma para vídeos com controle de acesso',
            category: 'Conteúdo'
        },
        medicao_online: {
            price: 1500,
            label: 'Medição Online',
            description: 'Sistema de medições e cálculos técnicos',
            category: 'Industrial'
        },
        agendamento_avancado: {
            price: 1200,
            label: 'Agendamento Avançado',
            description: 'Agenda com múltiplos recursos e integrações',
            category: 'Funcionalidades'
        },
        area_colaborativa: {
            price: 1500,
            label: 'Área Colaborativa',
            description: 'Espaço para equipes trabalharem juntas',
            category: 'Colaboração'
        },
        google_workspace: {
            price: 800,
            label: 'Integração Google Workspace',
            description: 'Conexão com Google Drive, Calendar, etc.',
            category: 'Integrações'
        },
        questionarios: {
            price: 600,
            label: 'Sistema de Questionários',
            description: 'Criação e análise de pesquisas online',
            category: 'Formulários'
        },
        propostas_automaticas: {
            price: 900,
            label: 'Propostas Automáticas',
            description: 'Geração automática de propostas comerciais',
            category: 'Comercial'
        },
        integracao_redes: {
            price: 300,
            label: 'Integração Redes Sociais',
            description: 'Publicação automática em redes sociais',
            category: 'Marketing'
        },
        chatbot: {
            price: 800,
            label: 'Chatbot Inteligente',
            description: 'Atendimento automatizado 24/7',
            category: 'Atendimento'
        },
        gateway_adicional: {
            price: 300,
            label: 'Gateway de Pagamento Extra',
            description: 'Adição de método de pagamento alternativo',
            category: 'E-commerce'
        },
        fidelidade: {
            price: 900,
            label: 'Programa de Fidelidade',
            description: 'Sistema de pontos e recompensas',
            category: 'Marketing'
        },
        comparador: {
            price: 600,
            label: 'Comparador de Produtos',
            description: 'Ferramenta de comparação lado a lado',
            category: 'E-commerce'
        },
        recomendacoes_ia: {
            price: 1200,
            label: 'Recomendações por IA',
            description: 'Sugestões inteligentes baseadas em comportamento',
            category: 'Inteligência Artificial'
        }
    };

    // Categorias para organização
    const featureCategories = {
        'Funcionalidades': 'fa-cogs',
        'E-commerce': 'fa-shopping-cart',
        'Integrações': 'fa-plug',
        'Industrial': 'fa-industry',
        'Dashboard': 'fa-chart-line',
        'Conteúdo': 'fa-photo-video',
        'Colaboração': 'fa-users',
        'Formulários': 'fa-clipboard-list',
        'Comercial': 'fa-file-contract',
        'Marketing': 'fa-bullhorn',
        'Atendimento': 'fa-headset',
        'Internacionalização': 'fa-globe',
        'Inteligência Artificial': 'fa-brain'
    };

    // Estado do calculador
    let calculatorState = {
        selectedSolution: null,
        selectedFeatures: [],
        subtotal: 0,
        total: 0,
        hasDiscount: false,
        discountValue: 0
    };

    /**
     * Inicializa o calculador de preços
     */
    function initializePriceCalculator() {
        const calculatorForm = document.getElementById('priceCalculatorForm');
        
        if (!calculatorForm) {
            logCalculator('Calculador não encontrado na página');
            return;
        }
        
        setupCalculatorEventListeners();
        renderFeatureCategories();
        updatePrice();
        updateSolutionDetails();
        
        // Inicializa widget se existir
        initializeWidget();
        
        logCalculator('Calculador inicializado');
    }

    /**
     * Configura os event listeners do calculador
     */
    function setupCalculatorEventListeners() {
        const solutionSelect = document.getElementById('solutionType');
        const featureCheckboxes = document.querySelectorAll('.plus-feature-checkbox');
        const resetButton = document.getElementById('resetCalculator');
        const printButton = document.getElementById('printQuote');
        const saveButton = document.getElementById('saveQuote');
        
        // Seleção de solução
        if (solutionSelect) {
            solutionSelect.addEventListener('change', function() {
                calculatorState.selectedSolution = this.value;
                updatePrice();
                updateSolutionDetails();
                animatePriceChange();
            });
        }
        
        // Checkboxes de features
        featureCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateSelectedFeatures();
                updatePrice();
                animateFeatureToggle(this);
            });
        });
        
        // Botão de reset
        if (resetButton) {
            resetButton.addEventListener('click', resetCalculator);
        }
        
        // Botão de imprimir
        if (printButton) {
            printButton.addEventListener('click', printQuote);
        }
        
        // Botão de salvar
        if (saveButton) {
            saveButton.addEventListener('click', saveQuote);
        }
        
        // Atualiza preço ao carregar a página
        updateSelectedFeatures();
    }

    /**
     * Renderiza categorias de features
     */
    function renderFeatureCategories() {
        const categoriesContainer = document.getElementById('featureCategories');
        if (!categoriesContainer) return;
        
        let categoriesHTML = '';
        
        Object.keys(featureCategories).forEach(category => {
            const icon = featureCategories[category];
            const featuresInCategory = Object.values(plusFeatures).filter(
                feature => feature.category === category
            );
            
            if (featuresInCategory.length > 0) {
                categoriesHTML += `
                    <div class="feature-category" data-category="${category}">
                        <div class="category-header">
                            <i class="fas ${icon}"></i>
                            <h4>${category}</h4>
                            <span class="category-toggle">+</span>
                        </div>
                        <div class="category-features">
                            ${featuresInCategory.map(feature => {
                                const featureKey = Object.keys(plusFeatures).find(
                                    key => plusFeatures[key] === feature
                                );
                                return `
                                    <label class="feature-checkbox">
                                        <input type="checkbox" 
                                               class="plus-feature-checkbox" 
                                               value="${featureKey}"
                                               data-name="${feature.label}">
                                        <span class="checkmark"></span>
                                        <div class="feature-info">
                                            <strong>${feature.label}</strong>
                                            <span class="feature-price">+ ${formatCurrency(feature.price)}</span>
                                            <p class="feature-desc">${feature.description}</p>
                                        </div>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }
        });
        
        categoriesContainer.innerHTML = categoriesHTML;
        
        // Adiciona toggles para categorias
        const categoryHeaders = categoriesContainer.querySelectorAll('.category-header');
        categoryHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const category = this.parentElement;
                const features = category.querySelector('.category-features');
                const toggle = this.querySelector('.category-toggle');
                
                category.classList.toggle('expanded');
                features.style.display = category.classList.contains('expanded') ? 'block' : 'none';
                toggle.textContent = category.classList.contains('expanded') ? '−' : '+';
            });
        });
    }

    /**
     * Atualiza a lista de features selecionadas
     */
    function updateSelectedFeatures() {
        const featureCheckboxes = document.querySelectorAll('.plus-feature-checkbox:checked');
        calculatorState.selectedFeatures = [];
        
        featureCheckboxes.forEach(checkbox => {
            const featureKey = checkbox.value;
            const feature = plusFeatures[featureKey];
            
            if (feature) {
                calculatorState.selectedFeatures.push({
                    key: featureKey,
                    name: feature.label,
                    price: feature.price,
                    category: feature.category,
                    description: feature.description
                });
            }
        });
    }

    /**
     * Atualiza o preço total
     */
    function updatePrice() {
        const solutionSelect = document.getElementById('solutionType');
        const totalElement = document.getElementById('totalPrice');
        const subtotalElement = document.getElementById('subtotalPrice');
        const discountElement = document.getElementById('discountValue');
        const breakdown = document.getElementById('priceBreakdown');
        const summary = document.getElementById('priceSummary');
        
        if (!solutionSelect || !totalElement) return;
        
        // Calcula subtotal
        let subtotal = 0;
        
        // Preço base da solução
        const solution = basePrices[calculatorState.selectedSolution];
        if (solution) {
            subtotal += solution.price;
        }
        
        // Features selecionadas
        calculatorState.selectedFeatures.forEach(feature => {
            subtotal += feature.price;
        });
        
        // Aplica desconto (se houver)
        let discount = 0;
        let total = subtotal;
        
        // Desconto progressivo por múltiplas features
        if (calculatorState.selectedFeatures.length >= 3) {
            discount = subtotal * 0.1; // 10% de desconto
            calculatorState.hasDiscount = true;
            calculatorState.discountValue = discount;
            total = subtotal - discount;
        } else {
            calculatorState.hasDiscount = false;
            calculatorState.discountValue = 0;
        }
        
        // Atualiza estado
        calculatorState.subtotal = subtotal;
        calculatorState.total = total;
        
        // Atualiza elementos da interface
        totalElement.textContent = formatCurrency(total);
        
        if (subtotalElement) {
            subtotalElement.textContent = formatCurrency(subtotal);
        }
        
        if (discountElement) {
            if (calculatorState.hasDiscount) {
                discountElement.textContent = `-${formatCurrency(discount)}`;
                discountElement.style.color = '#10B981';
                discountElement.style.fontWeight = 'bold';
            } else {
                discountElement.textContent = formatCurrency(0);
                discountElement.style.color = '';
                discountElement.style.fontWeight = '';
            }
        }
        
        // Atualiza breakdown
        if (breakdown) {
            updatePriceBreakdown(breakdown);
        }
        
        // Atualiza summary
        if (summary) {
            updatePriceSummary(summary);
        }
        
        // Atualiza hidden input para forms
        updatePriceHiddenInput();
        
        // Anima mudança de preço
        animatePriceUpdate(totalElement);
    }

    /**
     * Atualiza o detalhamento do preço
     * @param {HTMLElement} breakdownElement - Elemento do breakdown
     */
    function updatePriceBreakdown(breakdownElement) {
        const solution = basePrices[calculatorState.selectedSolution];
        
        let html = `
            <div class="breakdown-section">
                <h4>Detalhamento do Orçamento</h4>
                
                <div class="breakdown-item main-item">
                    <div>
                        <strong>${solution ? solution.label : 'Solução'}</strong>
                        <p class="breakdown-desc">${solution ? solution.description : 'Selecione uma solução'}</p>
                    </div>
                    <strong class="breakdown-price">${formatCurrency(solution ? solution.price : 0)}</strong>
                </div>
        `;
        
        // Features por categoria
        const featuresByCategory = {};
        calculatorState.selectedFeatures.forEach(feature => {
            if (!featuresByCategory[feature.category]) {
                featuresByCategory[feature.category] = [];
            }
            featuresByCategory[feature.category].push(feature);
        });
        
        Object.keys(featuresByCategory).forEach(category => {
            const features = featuresByCategory[category];
            const categoryTotal = features.reduce((sum, feature) => sum + feature.price, 0);
            
            html += `
                <div class="breakdown-category">
                    <div class="category-header">
                        <i class="fas ${featureCategories[category] || 'fa-plus'}"></i>
                        <span>${category}</span>
                        <span class="category-total">+ ${formatCurrency(categoryTotal)}</span>
                    </div>
                    <div class="category-items">
            `;
            
            features.forEach(feature => {
                html += `
                    <div class="breakdown-item">
                        <div>
                            <span>${feature.name}</span>
                            <p class="breakdown-desc">${feature.description}</p>
                        </div>
                        <span class="breakdown-price">+ ${formatCurrency(feature.price)}</span>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        // Total e desconto
        html += `
                <div class="breakdown-totals">
                    <div class="breakdown-item">
                        <strong>Subtotal</strong>
                        <strong>${formatCurrency(calculatorState.subtotal)}</strong>
                    </div>
        `;
        
        if (calculatorState.hasDiscount) {
            html += `
                    <div class="breakdown-item discount-item">
                        <div>
                            <strong>Desconto (10%)</strong>
                            <p class="breakdown-desc">Desconto por múltiplas features</p>
                        </div>
                        <strong class="discount-price">- ${formatCurrency(calculatorState.discountValue)}</strong>
                    </div>
            `;
        }
        
        html += `
                    <div class="breakdown-item total-item">
                        <strong>TOTAL</strong>
                        <strong class="total-price">${formatCurrency(calculatorState.total)}</strong>
                    </div>
                </div>
            </div>
        `;
        
        breakdownElement.innerHTML = html;
    }

    /**
     * Atualiza o resumo do preço
     * @param {HTMLElement} summaryElement - Elemento do summary
     */
    function updatePriceSummary(summaryElement) {
        const solution = basePrices[calculatorState.selectedSolution];
        
        let html = `
            <div class="price-summary">
                <h4>Resumo do Orçamento</h4>
                <div class="summary-item">
                    <span>Solução:</span>
                    <span>${solution ? solution.label : 'Não selecionada'}</span>
                </div>
                <div class="summary-item">
                    <span>Features adicionais:</span>
                    <span>${calculatorState.selectedFeatures.length} selecionadas</span>
                </div>
                <div class="summary-item">
                    <span>Desconto aplicado:</span>
                    <span>${calculatorState.hasDiscount ? 'Sim (10%)' : 'Não'}</span>
                </div>
                <div class="summary-total">
                    <span>Valor total:</span>
                    <strong>${formatCurrency(calculatorState.total)}</strong>
                </div>
                <div class="summary-note">
                    <small>* Valores estimados. Orçamento final pode variar conforme requisitos específicos.</small>
                </div>
            </div>
        `;
        
        summaryElement.innerHTML = html;
    }

    /**
     * Atualiza detalhes da solução selecionada
     */
    function updateSolutionDetails() {
        const detailsContainer = document.getElementById('solutionDetails');
        if (!detailsContainer) return;
        
        const solution = basePrices[calculatorState.selectedSolution];
        
        if (!solution) {
            detailsContainer.innerHTML = `
                <div class="solution-details-empty">
                    <i class="fas fa-info-circle"></i>
                    <p>Selecione uma solução para ver os detalhes</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="solution-details">
                <div class="solution-header">
                    <h3>${solution.label}</h3>
                    <span class="solution-price">${formatCurrency(solution.price)}</span>
                </div>
                <p class="solution-description">${solution.description}</p>
                <div class="solution-features">
                    <h4>Inclui:</h4>
                    <ul>
                        ${solution.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="solution-timeline">
                    <h4>Prazo estimado:</h4>
                    <div class="timeline">
                        <span class="timeline-item">Planejamento: 3-5 dias</span>
                        <span class="timeline-item">Desenvolvimento: 15-30 dias</span>
                        <span class="timeline-item">Testes: 3-7 dias</span>
                    </div>
                </div>
            </div>
        `;
        
        detailsContainer.innerHTML = html;
    }

    /**
     * Formata valor como moeda brasileira
     * @param {number} value - Valor a ser formatado
     * @returns {string} - Valor formatado
     */
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    /**
     * Obtém o preço total atual
     * @returns {number} - Preço total
     */
    function getTotalPrice() {
        return calculatorState.total;
    }

    /**
     * Reseta o calculador
     */
    function resetCalculator() {
        const solutionSelect = document.getElementById('solutionType');
        const featureCheckboxes = document.querySelectorAll('.plus-feature-checkbox');
        
        if (solutionSelect) {
            solutionSelect.value = '';
            calculatorState.selectedSolution = null;
        }
        
        featureCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        calculatorState.selectedFeatures = [];
        calculatorState.subtotal = 0;
        calculatorState.total = 0;
        calculatorState.hasDiscount = false;
        calculatorState.discountValue = 0;
        
        updatePrice();
        updateSolutionDetails();
        
        // Animação de reset
        const calculator = document.getElementById('priceCalculator');
        if (calculator) {
            calculator.style.opacity = '0.7';
            calculator.style.transform = 'translateX(-10px)';
            calculator.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                calculator.style.opacity = '1';
                calculator.style.transform = 'translateX(0)';
            }, 300);
        }
        
        logCalculator('Calculador resetado');
    }

    /**
     * Imprime o orçamento
     */
    function printQuote() {
        const solution = basePrices[calculatorState.selectedSolution];
        
        if (!solution) {
            alert('Por favor, selecione uma solução antes de imprimir.');
            return;
        }
        
        // Cria conteúdo para impressão
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Orçamento - ${solution.label}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                    .details { margin-bottom: 30px; }
                    .section { margin-bottom: 20px; }
                    .total { font-size: 1.5em; font-weight: bold; text-align: right; margin-top: 30px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    th { background: #f5f5f5; }
                    .note { font-size: 0.9em; color: #666; margin-top: 40px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Orçamento</h1>
                    <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div class="details">
                    <h2>${solution.label}</h2>
                    <p>${solution.description}</p>
                    <p><strong>Valor base:</strong> ${formatCurrency(solution.price)}</p>
                </div>
                
                ${calculatorState.selectedFeatures.length > 0 ? `
                <div class="section">
                    <h3>Features Adicionais</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Descrição</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${calculatorState.selectedFeatures.map(feature => `
                                <tr>
                                    <td>${feature.name}</td>
                                    <td>${feature.description}</td>
                                    <td>${formatCurrency(feature.price)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ` : ''}
                
                <div class="total">
                    <p>Subtotal: ${formatCurrency(calculatorState.subtotal)}</p>
                    ${calculatorState.hasDiscount ? `<p>Desconto: -${formatCurrency(calculatorState.discountValue)}</p>` : ''}
                    <p>TOTAL: ${formatCurrency(calculatorState.total)}</p>
                </div>
                
                <div class="note">
                    <p>* Este é um orçamento estimado. Valores finais podem variar conforme requisitos específicos.</p>
                    <p>* O orçamento é válido por 30 dias a partir da data de emissão.</p>
                </div>
            </body>
            </html>
        `;
        
        // Abre janela de impressão
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Aguarda carregamento e imprime
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
        
        logCalculator('Orçamento impresso');
    }

    /**
     * Salva o orçamento (simulação)
     */
    function saveQuote() {
        const solution = basePrices[calculatorState.selectedSolution];
        
        if (!solution) {
            alert('Por favor, selecione uma solução antes de salvar.');
            return;
        }
        
        // Simula salvamento
        const quoteData = {
            date: new Date().toISOString(),
            solution: calculatorState.selectedSolution,
            features: calculatorState.selectedFeatures.map(f => f.key),
            subtotal: calculatorState.subtotal,
            discount: calculatorState.discountValue,
            total: calculatorState.total
        };
        
        // Salva no localStorage (simulação)
        try {
            const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
            savedQuotes.push(quoteData);
            localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
            
            // Feedback visual
            showNotification('Orçamento salvo com sucesso!', 'success');
            logCalculator('Orçamento salvo:', quoteData);
        } catch (error) {
            showNotification('Erro ao salvar orçamento', 'error');
            console.error('Erro ao salvar orçamento:', error);
        }
    }

    /**
     * Mostra notificação
     * @param {string} message - Mensagem
     * @param {string} type - Tipo (success, error, info)
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `calculator-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            notification.style.transition = 'all 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Atualiza input hidden para formulários
     */
    function updatePriceHiddenInput() {
        let hiddenInput = document.getElementById('estimatedPrice');
        
        if (!hiddenInput) {
            hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'estimated_price';
            hiddenInput.id = 'estimatedPrice';
            
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.appendChild(hiddenInput);
            }
        }
        
        hiddenInput.value = calculatorState.total;
    }

    /**
     * Inicializa widget do calculador
     */
    function initializeWidget() {
        const widget = document.getElementById('priceCalculatorWidget');
        
        if (!widget) return;
        
        // Renderiza widget simplificado
        widget.innerHTML = `
            <div class="calculator-widget">
                <h3><i class="fas fa-calculator"></i> Simulador Rápido</h3>
                <div class="widget-form">
                    <select id="widgetSolutionType">
                        <option value="">Selecione uma solução</option>
                        ${Object.entries(basePrices).map(([key, solution]) => `
                            <option value="${key}">${solution.label} - ${formatCurrency(solution.price)}</option>
                        `).join('')}
                    </select>
                    
                    <div class="widget-features">
                        <label><input type="checkbox" value="area_restrita"> Área Restrita</label>
                        <label><input type="checkbox" value="agendamento"> Agendamento</label>
                        <label><input type="checkbox" value="multilingue"> Multilíngue</label>
                    </div>
                    
                    <div class="widget-total">
                        <span>Total estimado:</span>
                        <h2 id="widgetTotalPrice">${formatCurrency(0)}</h2>
                    </div>
                    
                    <button id="widgetRequestQuote" class="widget-button">
                        <i class="fas fa-file-alt"></i> Solicitar Orçamento
                    </button>
                </div>
            </div>
        `;
        
        // Adiciona event listeners ao widget
        const solutionSelect = widget.querySelector('#widgetSolutionType');
        const featureCheckboxes = widget.querySelectorAll('input[type="checkbox"]');
        const totalElement = widget.querySelector('#widgetTotalPrice');
        const requestButton = widget.querySelector('#widgetRequestQuote');
        
        function updateWidgetPrice() {
            const solutionKey = solutionSelect.value;
            const solution = basePrices[solutionKey];
            let total = solution ? solution.price : 0;
            
            featureCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const feature = plusFeatures[checkbox.value];
                    if (feature) total += feature.price;
                }
            });
            
            totalElement.textContent = formatCurrency(total);
            
            // Anima mudança
            totalElement.style.transform = 'scale(1.1)';
            totalElement.style.color = '#10B981';
            setTimeout(() => {
                totalElement.style.transform = 'scale(1)';
                totalElement.style.color = '';
            }, 300);
        }
        
        solutionSelect.addEventListener('change', updateWidgetPrice);
        featureCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateWidgetPrice);
        });
        
        requestButton.addEventListener('click', function() {
            const solutionKey = solutionSelect.value;
            if (!solutionKey) {
                alert('Por favor, selecione uma solução.');
                return;
            }
            
            // Rola até o formulário de contato
            const contactSection = document.getElementById('contato');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Preenche automaticamente (se possível)
            setTimeout(() => {
                const solutionSelectMain = document.getElementById('solutionType');
                if (solutionSelectMain) {
                    solutionSelectMain.value = solutionKey;
                    updatePrice();
                }
            }, 500);
        });
    }

    /**
     * Anima mudança de preço
     * @param {HTMLElement} priceElement - Elemento do preço
     */
    function animatePriceUpdate(priceElement) {
        priceElement.style.transform = 'scale(1.1)';
        priceElement.style.color = '#10B981';
        
        setTimeout(() => {
            priceElement.style.transform = 'scale(1)';
            priceElement.style.color = '';
        }, 300);
    }

    /**
     * Anima mudança de preço geral
     */
    function animatePriceChange() {
        const calculator = document.getElementById('priceCalculator');
        if (calculator) {
            calculator.style.boxShadow = '0 0 0 2px #3B82F6';
            calculator.style.transition = 'box-shadow 0.3s ease';
            
            setTimeout(() => {
                calculator.style.boxShadow = '';
            }, 500);
        }
    }

    /**
     * Anima toggle de feature
     * @param {HTMLElement} checkbox - Checkbox da feature
     */
    function animateFeatureToggle(checkbox) {
        const label = checkbox.closest('label');
        if (label) {
            label.style.transform = 'translateX(5px)';
            label.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
                label.style.transform = '';
            }, 200);
        }
    }

    /**
     * Log para debug
     * @param {string} message - Mensagem de log
     * @param {any} data - Dados adicionais
     */
    function logCalculator(message, data = null) {
        console.log(`%c[Price Calculator] ${message}`, 'color: #F59E0B; font-weight: bold;', data || '');
    }

    // Inicialização
    document.addEventListener('DOMContentLoaded', initializePriceCalculator);

    // Adiciona estilos CSS dinâmicos
    function addCalculatorStyles() {
        if (!document.querySelector('#calculator-styles')) {
            const style = document.createElement('style');
            style.id = 'calculator-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                .calculator-notification {
                    animation: slideIn 0.3s ease;
                }
                
                .feature-category.expanded .category-features {
                    display: block;
                }
                
                .category-features {
                    display: none;
                    padding: 10px 0 0 20px;
                }
                
                .breakdown-item {
                    transition: background-color 0.2s ease;
                }
                
                .breakdown-item:hover {
                    background-color: rgba(59, 130, 246, 0.05);
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Adiciona estilos
    addCalculatorStyles();

    // Exporta funções para uso externo
    if (typeof window !== 'undefined') {
        window.PriceCalculator = {
            getTotalPrice,
            resetCalculator,
            formatCurrency,
            printQuote,
            saveQuote,
            basePrices,
            plusFeatures,
            calculatorState
        };
    }

})();