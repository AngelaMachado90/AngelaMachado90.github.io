/**
 * form-handler.js - Gerenciador de Formulários
 * Versão: 1.0.0
 * Autor: Angela Machado
 * Descrição: Manipulação, validação e envio de formulários com feedback visual
 */

// Inicialização quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Adiciona validação em tempo real para todos os campos
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
    
    // Inicializa máscaras de telefone
    initializePhoneMasks();
    
    // Inicializa validação em tempo real para todos os formulários
    initializeFormValidation();
});

/**
 * Manipula o envio do formulário
 * @param {Event} e - Evento de submit
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    
    // Valida o formulário completo
    if (!validateForm(form)) {
        showFormError(form, 'Por favor, preencha todos os campos obrigatórios corretamente.');
        return;
    }
    
    // Prepara o botão de envio
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    // Coleta os dados do formulário
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Mostra estado de carregamento
    showFormLoading(form);
    
    // Simula envio (substituir por chamada de API real)
    setTimeout(() => {
        // Simulação de resposta bem-sucedida
        const isSuccess = Math.random() > 0.2; // 80% de chance de sucesso
        
        if (isSuccess) {
            showFormSuccess(form);
            form.reset();
            log('Formulário enviado com sucesso:', data);
            
            // Rola suavemente para a mensagem de sucesso
            const successMsg = form.querySelector('.form-success');
            if (successMsg) {
                successMsg.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        } else {
            showFormError(form, 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
            log('Erro no envio do formulário:', data);
        }
        
        // Restaura o botão
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Remove estado de carregamento
        hideFormLoading(form);
        
    }, 1500); // Simula delay de rede
}

/**
 * Mostra estado de carregamento no formulário
 * @param {HTMLFormElement} form - Formulário alvo
 */
function showFormLoading(form) {
    const loadingElement = form.querySelector('.form-loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    } else {
        // Cria elemento de loading se não existir
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'form-loading';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Enviando sua mensagem...</p>
        `;
        loadingDiv.style.cssText = `
            text-align: center;
            padding: 20px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
            margin: 20px 0;
        `;
        
        const spinnerStyle = document.createElement('style');
        spinnerStyle.textContent = `
            .loading-spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinnerStyle);
        
        form.appendChild(loadingDiv);
    }
}

/**
 * Remove estado de carregamento do formulário
 * @param {HTMLFormElement} form - Formulário alvo
 */
function hideFormLoading(form) {
    const loadingElement = form.querySelector('.form-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

/**
 * Valida o formulário completo
 * @param {HTMLFormElement} form - Formulário a ser validado
 * @returns {boolean} - True se o formulário é válido
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!isFieldValid(field)) {
            isValid = false;
            showFieldError(field, getFieldErrorMessage(field));
        } else {
            clearFieldError({ target: field });
        }
    });
    
    // Validação especial para campos de confirmação
    const confirmFields = form.querySelectorAll('[data-confirm]');
    confirmFields.forEach(field => {
        const confirmWith = field.getAttribute('data-confirm');
        const targetField = form.querySelector(`[name="${confirmWith}"]`);
        
        if (targetField && field.value !== targetField.value) {
            isValid = false;
            showFieldError(field, 'Os campos não conferem');
        }
    });
    
    return isValid;
}

/**
 * Valida um campo individual
 * @param {Event} event - Evento de blur ou input
 */
function validateField(event) {
    const field = event.target;
    
    // Se o campo não é obrigatório e está vazio, limpa o erro
    if (!field.required && !field.value.trim()) {
        clearFieldError(event);
        return;
    }
    
    // Valida o campo
    if (isFieldValid(field)) {
        showFieldSuccess(field);
    } else {
        showFieldError(field, getFieldErrorMessage(field));
    }
}

/**
 * Limpa os estilos de erro de um campo
 * @param {Event} event - Evento de input
 */
function clearFieldError(event) {
    const field = event.target;
    
    // Remove estilos de erro
    field.style.borderColor = '';
    field.style.backgroundColor = '';
    
    // Remove mensagem de erro específica do campo
    const errorSpan = field.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('field-error')) {
        errorSpan.style.display = 'none';
    }
    
    // Remove classes de erro
    field.classList.remove('field-error');
}

/**
 * Verifica se um campo é válido
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} field - Campo a ser validado
 * @returns {boolean} - True se o campo é válido
 */
function isFieldValid(field) {
    const value = field.value.trim();
    const type = field.type || field.tagName.toLowerCase();
    
    // Verifica campo obrigatório vazio
    if (field.required && !value) {
        return false;
    }
    
    // Se não é obrigatório e está vazio, é válido
    if (!field.required && !value) {
        return true;
    }
    
    // Validação de email
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }
    
    // Validação de telefone
    if ((type === 'tel' || field.name.toLowerCase().includes('phone')) && value) {
        const cleanNumber = value.replace(/\D/g, '');
        return cleanNumber.length >= 10 && cleanNumber.length <= 11;
    }
    
    // Validação de URL
    if (type === 'url' && value) {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    }
    
    // Validação de comprimento mínimo
    if (field.hasAttribute('minlength')) {
        const minLength = parseInt(field.getAttribute('minlength'));
        return value.length >= minLength;
    }
    
    // Validação de comprimento máximo
    if (field.hasAttribute('maxlength')) {
        const maxLength = parseInt(field.getAttribute('maxlength'));
        return value.length <= maxLength;
    }
    
    // Validação de valor mínimo para números
    if ((type === 'number' || type === 'range') && field.hasAttribute('min')) {
        const minValue = parseFloat(field.getAttribute('min'));
        return parseFloat(value) >= minValue;
    }
    
    // Validação de valor máximo para números
    if ((type === 'number' || type === 'range') && field.hasAttribute('max')) {
        const maxValue = parseFloat(field.getAttribute('max'));
        return parseFloat(value) <= maxValue;
    }
    
    return true;
}

/**
 * Obtém mensagem de erro específica para o campo
 * @param {HTMLElement} field - Campo do formulário
 * @returns {string} - Mensagem de erro apropriada
 */
function getFieldErrorMessage(field) {
    const value = field.value.trim();
    const type = field.type || field.tagName.toLowerCase();
    
    if (field.required && !value) {
        return 'Este campo é obrigatório';
    }
    
    if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Por favor, insira um email válido';
    }
    
    if ((type === 'tel' || field.name.toLowerCase().includes('phone')) && value) {
        const cleanNumber = value.replace(/\D/g, '');
        if (cleanNumber.length < 10) {
            return 'Número de telefone muito curto';
        }
        if (cleanNumber.length > 11) {
            return 'Número de telefone muito longo';
        }
        return 'Por favor, insira um telefone válido';
    }
    
    if (type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            return 'Por favor, insira uma URL válida';
        }
    }
    
    if (field.hasAttribute('minlength')) {
        const minLength = parseInt(field.getAttribute('minlength'));
        if (value.length < minLength) {
            return `Mínimo de ${minLength} caracteres`;
        }
    }
    
    if (field.hasAttribute('maxlength')) {
        const maxLength = parseInt(field.getAttribute('maxlength'));
        if (value.length > maxLength) {
            return `Máximo de ${maxLength} caracteres`;
        }
    }
    
    return 'Valor inválido';
}

/**
 * Mostra sucesso em um campo
 * @param {HTMLElement} field - Campo do formulário
 */
function showFieldSuccess(field) {
    field.style.borderColor = '#10b981'; // Verde
    field.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
    
    // Remove mensagem de erro se existir
    const errorSpan = field.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('field-error')) {
        errorSpan.style.display = 'none';
    }
}

/**
 * Mostra erro em um campo
 * @param {HTMLElement} field - Campo do formulário
 * @param {string} message - Mensagem de erro
 */
function showFieldError(field, message) {
    field.style.borderColor = '#ef4444'; // Vermelho
    field.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
    field.classList.add('field-error');
    
    // Adiciona ou atualiza mensagem de erro
    let errorSpan = field.nextElementSibling;
    if (!errorSpan || !errorSpan.classList.contains('field-error')) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'field-error';
        errorSpan.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        `;
        field.parentNode.insertBefore(errorSpan, field.nextSibling);
    }
    
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
}

/**
 * Mostra mensagem de sucesso no formulário
 * @param {HTMLFormElement} form - Formulário alvo
 */
function showFormSuccess(form) {
    const successMsg = form.querySelector('.form-success') || createMessageElement('success');
    const errorMsg = form.querySelector('.form-error');
    
    if (errorMsg) {
        errorMsg.style.display = 'none';
    }
    
    successMsg.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
    successMsg.style.display = 'block';
    
    // Adiciona ao formulário se não existir
    if (!form.contains(successMsg)) {
        form.prepend(successMsg);
    }
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 5000);
}

/**
 * Mostra mensagem de erro no formulário
 * @param {HTMLFormElement} form - Formulário alvo
 * @param {string} message - Mensagem de erro
 */
function showFormError(form, message) {
    const errorMsg = form.querySelector('.form-error') || createMessageElement('error');
    const successMsg = form.querySelector('.form-success');
    
    if (successMsg) {
        successMsg.style.display = 'none';
    }
    
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    
    // Adiciona ao formulário se não existir
    if (!form.contains(errorMsg)) {
        form.prepend(errorMsg);
    }
    
    // Rola suavemente para o erro
    errorMsg.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

/**
 * Cria elemento de mensagem para formulário
 * @param {string} type - 'success' ou 'error'
 * @returns {HTMLDivElement} - Elemento de mensagem
 */
function createMessageElement(type) {
    const div = document.createElement('div');
    div.className = `form-${type}`;
    div.style.cssText = `
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        display: none;
        font-weight: 500;
        text-align: center;
    `;
    
    if (type === 'success') {
        div.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        div.style.border = '1px solid #10b981';
        div.style.color = '#065f46';
    } else {
        div.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        div.style.border = '1px solid #ef4444';
        div.style.color = '#991b1b';
    }
    
    return div;
}

/**
 * Aplica máscara a um campo de entrada
 * @param {HTMLInputElement} input - Campo de entrada
 * @param {string} mask - Máscara a ser aplicada (ex: '(##) #####-####')
 */
function maskInput(input, mask) {
    input.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        let maskedValue = '';
        let maskIndex = 0;
        
        for (let i = 0; i < mask.length; i++) {
            if (maskIndex >= value.length) break;
            
            if (mask[i] === '#') {
                maskedValue += value[maskIndex];
                maskIndex++;
            } else {
                maskedValue += mask[i];
                // Se o próximo caractere do valor combina com o caractere da máscara, pula ele
                if (value[maskIndex] === mask[i]) {
                    maskIndex++;
                }
            }
        }
        
        this.value = maskedValue;
    });
}

/**
 * Inicializa máscaras para campos de telefone
 */
function initializePhoneMasks() {
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[data-mask="phone"]');
    
    phoneInputs.forEach(input => {
        // Define máscara padrão brasileira
        const mask = input.getAttribute('data-mask-pattern') || '(##) #####-####';
        maskInput(input, mask);
        
        // Adiciona placeholder se não existir
        if (!input.placeholder) {
            input.placeholder = mask.replace(/#/g, '9');
        }
    });
}

/**
 * Inicializa validação em tempo real para todos os formulários
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('form:not(.no-validation)');
    
    forms.forEach(form => {
        // Adiciona listeners para validação em tempo real
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
        
        // Impede envio se houver campos inválidos
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showFormError(this, 'Por favor, corrija os erros no formulário antes de enviar.');
            }
        });
    });
}

/**
 * Utilitário para formatar telefone brasileiro
 * @param {string} phone - Número de telefone
 * @returns {string} - Telefone formatado
 */
function formatBrazilianPhone(phone) {
    const clean = phone.replace(/\D/g, '');
    
    if (clean.length === 10) {
        return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (clean.length === 11) {
        return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
}

/**
 * Utilitário para formatar CPF
 * @param {string} cpf - Número do CPF
 * @returns {string} - CPF formatado
 */
function formatCPF(cpf) {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length === 11) {
        return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
}

/**
 * Utilitário para formatar CEP
 * @param {string} cep - Código postal
 * @returns {string} - CEP formatado
 */
function formatCEP(cep) {
    const clean = cep.replace(/\D/g, '');
    if (clean.length === 8) {
        return clean.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return cep;
}

/**
 * Função de log para debug
 * @param {string} message - Mensagem de log
 * @param {any} data - Dados adicionais
 */
function log(message, data = null) {
    console.log(`%c[Form Handler] ${message}`, 'color: #8B5CF6; font-weight: bold;', data || '');
}

// Exporta funções para uso em outros módulos (se usando módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleFormSubmit,
        validateForm,
        validateField,
        isFieldValid,
        showFormSuccess,
        showFormError,
        maskInput,
        initializePhoneMasks,
        formatBrazilianPhone,
        formatCPF,
        formatCEP,
        log
    };
}