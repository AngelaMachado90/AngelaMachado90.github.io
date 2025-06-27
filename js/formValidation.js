/**
 * FORM-VALIDATION.JS
 * 
 * Sistema completo de validação e envio de formulários com:
 * - Validação em tempo real
 * - Sanitização de dados contra XSS/SQL Injection
 * - Integração com APIs de validação de CNPJ
 * - Sistema de notificações estilo popup
 * - Modal de confirmação pós-envio
 * 
 * Funcionalidades principais:
 * 1. Validação de campos obrigatórios e formatos específicos
 * 2. Máscaras para telefone e CNPJ
 * 3. Consulta à Receita Federal para validação de CNPJ
 * 4. Sistema de alertas visualmente ricos
 * 5. Proteção contra injeção de código
 * 6. Feedback visual durante o processamento
 * 
 * Dependências:
 * - Bootstrap 5 (CSS e JS)
 * - Bootstrap Icons (v1.11.1 ou superior)
 * - API da ReceitaWS (para consulta de CNPJ)
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========== SELEÇÃO DE ELEMENTOS ==========
    const telefone = document.querySelector('input[name="telefone"]');
    const cnpj = document.querySelector('input[name="cnpj"]');
    const empresa = document.querySelector('input[name="empresa"]');
    const form = document.querySelector('#formPlugnGO');
    const thankYouModal = new bootstrap.Modal('#thankYouModal');
    const validarCnpjBtn = document.getElementById('validar-cnpj');

    // ========== CONFIGURAÇÕES ==========
    const config = {
        apiReceitaWS: 'https://receitaws.com.br/v1/cnpj',
        timeoutAlertas: 5000, // 5 segundos
        timeoutAPI: 10000 // 10 segundos
    };

    // ========== SANITIZAÇÃO DE DADOS ==========
    /**
     * Sanitiza entradas do usuário para prevenir ataques XSS e SQL Injection
     * @param {string} value - Valor a ser sanitizado
     * @returns {string} Valor sanitizado seguro para processamento
     * 
     * Substitui caracteres perigosos por suas entidades HTML:
     * < → &lt;
     * > → &gt;
     * ' → &apos;
     * " → &quot;
     * ` → &grave;
     * $ → &#36;
     */
    const sanitizeInput = (value) => {
        if (!value) return '';
        return value.toString()
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&apos;')
            .replace(/"/g, '&quot;')
            .replace(/`/g, '&grave;')
            .replace(/\$/g, '&#36;');
    };

    // ========== SISTEMA DE ALERTAS ==========
    /**
     * Exibe notificações estilo popup para feedback ao usuário
     * @param {string} type - Tipo de alerta (success, danger, warning, info)
     * @param {string} message - Mensagem a ser exibida
     * @param {number} [timeout=5000] - Tempo em ms até fechar automaticamente (0 = não fecha)
     * 
     * Exemplo de uso:
     * showAlert('success', 'Cadastro realizado com sucesso!', 3000);
     */
    function showAlert(type, message, timeout = config.timeoutAlertas) {
        const alertContainer = document.getElementById('alert-container');
        const alertId = 'alert-' + Date.now();
        
        const alertHTML = `
            <div id="${alertId}" class="alert-popup alert-${type}">
                <i class="bi ${getIconForType(type)}"></i>
                <div class="alert-content">
                    <span class="alert-title">${getTitleForType(type)}</span>
                    <span class="alert-message">${message}</span>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
            </div>
        `;
        
        alertContainer.insertAdjacentHTML('afterbegin', alertHTML);
        alertContainer.style.display = 'block';

        // Fechamento automático
        if (timeout > 0) {
            setTimeout(() => {
                const alertElement = document.getElementById(alertId);
                if (alertElement) {
                    fadeOutAndRemove(alertElement, alertContainer);
                }
            }, timeout);
        }
    }

    /**
     * Animação de fade out e remoção do alerta
     * @param {HTMLElement} element - Elemento do alerta
     * @param {HTMLElement} container - Container principal
     */
    function fadeOutAndRemove(element, container) {
        element.classList.add('fade-out');
        element.addEventListener('animationend', () => {
            element.remove();
            if (container.children.length === 0) {
                container.style.display = 'none';
            }
        });
    }

    // Helper: Obtém ícone correspondente ao tipo de alerta
    function getIconForType(type) {
        const icons = {
            success: 'bi-check-circle-fill',
            danger: 'bi-exclamation-triangle-fill',
            warning: 'bi-exclamation-circle-fill',
            info: 'bi-info-circle-fill'
        };
        return icons[type] || 'bi-info-circle-fill';
    }

    // Helper: Obtém título correspondente ao tipo de alerta
    function getTitleForType(type) {
        const titles = {
            success: 'Sucesso!',
            danger: 'Erro!',
            warning: 'Aviso!',
            info: 'Informação'
        };
        return titles[type] || 'Alerta';
    }

    // ========== VALIDAÇÃO DE CAMPOS ==========
    /**
     * Objeto com funções de validação reutilizáveis
     * @namespace validar
     * @property {function} email - Valida formato de e-mail
     * @property {function} telefone - Valida telefone com DDD
     * @property {function} cnpj - Valida estrutura do CNPJ
     * @property {function} required - Verifica campo obrigatório
     * @property {function} cnpjReceita - Valida CNPJ na Receita Federal
     */
    const validar = {
        // Valida formato de e-mail
        email: (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
        
        // Valida telefone com DDD (10 ou 11 dígitos)
        telefone: (tel) => {
            const nums = tel.replace(/\D/g, '');
            return nums.length >= 10 && nums.length <= 11;
        },
        
        // Valida estrutura do CNPJ (dígitos verificadores)
        cnpj: (cnpj) => {
            const nums = cnpj.replace(/\D/g, '');
            if (nums.length !== 14) return false;
            
            // Cálculo do primeiro dígito verificador
            let tamanho = nums.length - 2;
            let numeros = nums.substring(0, tamanho);
            const digitos = nums.substring(tamanho);
            let soma = 0;
            let pos = tamanho - 7;
            
            for (let i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) pos = 9;
            }
            
            let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado !== parseInt(digitos.charAt(0))) return false;
            
            // Cálculo do segundo dígito verificador
            tamanho = tamanho + 1;
            numeros = nums.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;
            
            for (let i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) pos = 9;
            }
            
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            return resultado === parseInt(digitos.charAt(1));
        },
        
        // Verifica se campo não está vazio
        required: (value) => value.trim() !== '',
        
        /**
         * Valida CNPJ na Receita Federal
         * @param {string} cnpj - CNPJ a ser validado
         * @returns {Promise<Object>} Objeto com status e dados da empresa
         */
        cnpjReceita: async (cnpj) => {
            const cnpjNumeros = cnpj.replace(/\D/g, '');
            
            try {
                // Exibe loading
                toggleCnpjLoading(true);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), config.timeoutAPI);
                
                const response = await fetch(`${config.apiReceitaWS}/${cnpjNumeros}`, {
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error('Erro na consulta à Receita Federal');
                }
                
                const data = await response.json();
                
                if (data.status === 'OK' && data.situacao === 'ATIVA') {
                    return {
                        isValid: true,
                        empresa: data.nome,
                        message: 'CNPJ válido e ativo'
                    };
                } else {
                    return {
                        isValid: false,
                        message: data.message || 'CNPJ não encontrado ou inativo'
                    };
                }
            } catch (error) {
                console.error('Erro na validação do CNPJ:', error);
                return {
                    isValid: false,
                    message: error.message || 'Erro ao validar CNPJ'
                };
            } finally {
                toggleCnpjLoading(false);
            }
        }
    };

    // ========== CONTROLE DE LOADING ==========
    /**
     * Ativa/desativa visual de loading na validação do CNPJ
     * @param {boolean} isLoading - Estado desejado
     */
    function toggleCnpjLoading(isLoading) {
        const loadingElement = document.getElementById('cnpj-loading');
        const textElement = document.getElementById('cnpj-text');
        
        if (loadingElement && textElement) {
            loadingElement.style.display = isLoading ? 'inline-block' : 'none';
            textElement.textContent = isLoading ? 'Validando...' : 'Validar';
            validarCnpjBtn.disabled = isLoading;
        }
    }

    // ========== VALIDAÇÃO DO CNPJ NA RECEITA FEDERAL ==========
    /**
     * Valida o CNPJ na Receita Federal e preenche automaticamente o nome da empresa
     */
    async function validarCNPJ() {
        const cnpjNumeros = cnpj.value.replace(/\D/g, '');
        
        if (!validar.cnpj(cnpj.value)) {
            showAlert('danger', 'Formato de CNPJ inválido');
            return;
        }
        
        const resultado = await validar.cnpjReceita(cnpjNumeros);
        
        if (resultado.isValid) {
            empresa.value = resultado.empresa;
            empresa.readOnly = false;
            showAlert('success', resultado.message, 3000);
        } else {
            showAlert('danger', resultado.message);
            empresa.value = '';
        }
    }

    // Event listener para o botão de validar CNPJ
    if (validarCnpjBtn) {
        validarCnpjBtn.addEventListener('click', validarCNPJ);
    }

    // ========== ENVIO DO FORMULÁRIO ==========
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validação dos campos
            const campos = [
                { el: form.querySelector('[name="segmento"]'), validator: validar.required, msg: 'Selecione seu segmento' },
                { el: form.querySelector('[name="nome"]'), validator: validar.required, msg: 'Nome é obrigatório' },
                { el: form.querySelector('[name="email"]'), validator: validar.email, msg: 'E-mail inválido' },
                { el: telefone, validator: validar.telefone, msg: 'Telefone inválido (DDD + número)' },
                { el: cnpj, validator: validar.cnpj, msg: 'CNPJ inválido' },
                { el: empresa, validator: validar.required, msg: 'Empresa é obrigatória' }
            ];

            // Valida cada campo
            let formValido = true;
            campos.forEach(({ el, validator, msg }) => {
                el.classList.remove('is-invalid');
                const value = el.value.trim();
                
                if (!validator(value)) {
                    el.classList.add('is-invalid');
                    showAlert('danger', msg);
                    formValido = false;
                }
            });

            if (!formValido) return;

            // Prepara dados para envio
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';

            // Sanitiza os dados
            const formData = {
                segmento: sanitizeInput(form.segmento.value),
                nome: sanitizeInput(form.nome.value.trim()),
                email: sanitizeInput(form.email.value.trim()),
                telefone: form.telefone.value.replace(/\D/g, ''),
                cnpj: form.cnpj.value.replace(/\D/g, ''),
                empresa: sanitizeInput(form.empresa.value.trim())
            };

            // Envia para o servidor
            try {
                const response = await fetch('SUA_URL_DO_APPS_SCRIPT', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    thankYouModal.show();
                    form.reset();
                } else {
                    throw new Error(data.message || 'Erro no processamento');
                }
            } catch (error) {
                console.error('Erro no envio:', error);
                showAlert('danger', `Erro ao enviar: ${error.message}`);
            } finally {
                btn.disabled = false;
                btn.innerHTML = 'Enviar <i class="bi bi-send"></i>';
            }
        });
    }

    // ========== MÁSCARAS DE FORMULÁRIO ==========
    // Máscara para telefone (XX) XXXX-XXXX
    if (telefone) {
        telefone.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            if (value.length > 10) value = `${value.substring(0, 10)}-${value.substring(10, 15)}`;
            e.target.value = value.substring(0, 15);
        });
    }

    // Máscara para CNPJ XX.XXX.XXX/XXXX-XX
    if (cnpj) {
        cnpj.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) value = `${value.substring(0, 2)}.${value.substring(2)}`;
            if (value.length > 6) value = `${value.substring(0, 6)}.${value.substring(6)}`;
            if (value.length > 10) value = `${value.substring(0, 10)}/${value.substring(10)}`;
            if (value.length > 15) value = `${value.substring(0, 15)}-${value.substring(15, 17)}`;
            e.target.value = value.substring(0, 18);
        });
    }
});