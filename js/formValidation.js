/**
 * FORM-VALIDATION.JS
 * 
 * Este arquivo contém toda a lógica de validação e envio do formulário principal.
 * Utiliza Bootstrap para exibição de alertas e validação visual dos campos.
 * 
 * Melhorias implementadas:
 * - Fluxo de agradecimento com modal
 * - Prevenção contra SQL Injection
 * - Sanitização de inputs
 * - Validação reforçada
 * 
 * Dependências:
 * - Bootstrap 5 (CSS e JS)
 * - Bootstrap Icons (para ícones)
 */

document.addEventListener('DOMContentLoaded', function() {
    // ======== SELEÇÃO DE ELEMENTOS ========
    const telefone = document.querySelector('input[name="telefone"]');
    const cnpj = document.querySelector('input[name="cnpj"]');
    const form = document.querySelector('#formPlugnGO');
    const thankYouModal = new bootstrap.Modal(document.getElementById('thankYouModal'));

    // ======== SANITIZAÇÃO DE DADOS ========
    /**
     * Sanitiza entradas para prevenir XSS e SQL Injection
     * @param {string} value - Valor a ser sanitizado
     * @returns {string} Valor sanitizado
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

    // ======== VALIDAÇÃO AVANÇADA ========
    /**
     * Objeto com funções de validação reutilizáveis
     * @type {Object.<string, function>}
     * @property {function} email - Valida formato de e-mail com regex avançado
     * @property {function} telefone - Valida telefone com DDD (mínimo 10 dígitos)
     * @property {function} cnpj - Valida CNPJ (14 dígitos e dígitos verificadores)
     * @property {function} required - Verifica se campo não está vazio
     */
    const validar = {
        email: (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
        telefone: (tel) => {
            const nums = tel.replace(/\D/g, '');
            return nums.length >= 10 && nums.length <= 11;
        },
        cnpj: (cnpj) => {
            const nums = cnpj.replace(/\D/g, '');
            if (nums.length !== 14) return false;
            
            // Validação de dígitos verificadores
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
        required: (value) => value.trim() !== ''
    };

    // ======== GERENCIAMENTO DE ALERTAS ========
    /**
     * Exibe alertas estilizados usando Bootstrap
     * @param {string} type - Tipo do alerta (success, danger, warning, info)
     * @param {string} message - Mensagem a ser exibida
     * @param {number} [timeout=5000] - Tempo em ms para fechar automaticamente
     */
    function showAlert(type, message, timeout = 5000) {
        const alertContainer = document.getElementById('alert-container');
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        alertContainer.style.display = 'block';

        if (timeout > 0) {
            setTimeout(() => {
                alertContainer.style.display = 'none';
            }, timeout);
        }
    }

    // ======== LÓGICA DO FORMULÁRIO ========
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // ======= PRÉ-VALIDAÇÃO =======
            const campos = [
                { el: form.querySelector('[name="segmento"]'), validator: validar.required, msg: 'Selecione seu segmento' },
                { el: form.querySelector('[name="nome"]'), validator: validar.required, msg: 'Nome é obrigatório' },
                { el: form.querySelector('[name="email"]'), validator: validar.email, msg: 'E-mail inválido' },
                { el: telefone, validator: validar.telefone, msg: 'Telefone inválido (DDD + número)' },
                { el: cnpj, validator: validar.cnpj, msg: 'CNPJ inválido' },
                { el: form.querySelector('[name="empresa"]'), validator: validar.required, msg: 'Empresa é obrigatória' }
            ];

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

            // ======= PREPARAÇÃO DOS DADOS =======
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';

            // Sanitiza e prepara os dados
            const formData = {
                segmento: sanitizeInput(form.segmento.value),
                nome: sanitizeInput(form.nome.value.trim()),
                email: sanitizeInput(form.email.value.trim()),
                telefone: form.telefone.value.replace(/\D/g, ''),
                cnpj: form.cnpj.value.replace(/\D/g, ''),
                empresa: sanitizeInput(form.empresa.value.trim())
            };

            // ======= ENVIO SEGURO =======
            try {
                const response = await fetch('SUA_URL_DO_APPS_SCRIPT', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Sucesso - mostra modal de agradecimento
                    thankYouModal.show();
                    form.reset();
                } else {
                    throw new Error(data.message || 'Erro no servidor');
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

    // ======== MÁSCARAS DE FORMULÁRIO ========
    if (telefone) {
        telefone.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            if (value.length > 10) value = `${value.substring(0, 10)}-${value.substring(10, 15)}`;
            e.target.value = value.substring(0, 15);
        });
    }

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