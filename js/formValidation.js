/**
 * FORM-VALIDATION.JS
 * 
 * Este arquivo contém toda a lógica de validação e envio do formulário principal.
 * Utiliza Bootstrap para exibição de alertas e validação visual dos campos.
 * 
 * Dependências:
 * - Bootstrap 5 (CSS e JS)
 * - Font Awesome (para ícones)
 */

document.addEventListener('DOMContentLoaded', function() {
    // ======== SELEÇÃO DE ELEMENTOS ========
    // Campos que precisam de máscara (opcional - pode ser movido para main.js)
    const telefone = document.querySelector('input[name="telefone"]');
    const cnpj = document.querySelector('input[name="cnpj"]');

    // ======== OBJETO DE VALIDAÇÃO ========
    /**
     * Objeto com funções de validação reutilizáveis
     * @type {Object.<string, function>}
     * @property {function} email - Valida formato de e-mail
     * @property {function} telefone - Valida telefone com DDD (mínimo 10 dígitos)
     * @property {function} cnpj - Valida CNPJ (14 dígitos)
     * @property {function} required - Verifica se campo não está vazio
     */
    const validar = {
        email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        telefone: (tel) => tel.replace(/\D/g, '').length >= 10,
        cnpj: (cnpj) => cnpj.replace(/\D/g, '').length === 14,
        required: (value) => value.trim() !== ''
    };

    // ======== GERENCIAMENTO DE ALERTAS ========
    /**
     * Exibe alertas estilizados usando Bootstrap
     * @param {string} type - Tipo do alerta (success, danger, warning, info)
     * @param {string} message - Mensagem a ser exibida
     */
    function showAlert(type, message) {
        const alertContainer = document.getElementById('alert-container');
        
        // Cria estrutura do alerta com botão de fechar
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        alertContainer.style.display = 'block';
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            alertContainer.style.display = 'none';
        }, 5000);
    }

    // ======== LÓGICA DO FORMULÁRIO ========
    const form = document.querySelector('#formPlugnGO');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // ======= VALIDAÇÃO DOS CAMPOS =======
            /**
             * Array de configuração dos campos:
             * @type {Array<{
             *   el: HTMLElement,
             *   validator: function,
             *   msg: string
             * }>}
             */
            const campos = [
                { el: form.querySelector('[name="segmento"]'), validator: validar.required, msg: 'Selecione seu segmento' },
                { el: form.querySelector('[name="nome"]'), validator: validar.required, msg: 'Nome é obrigatório' },
                { el: form.querySelector('[name="email"]'), validator: validar.email, msg: 'E-mail inválido' },
                { el: telefone, validator: validar.telefone, msg: 'Telefone inválido (DDD + número)' },
                { el: cnpj, validator: validar.cnpj, msg: 'CNPJ inválido (14 dígitos)' },
                { el: form.querySelector('[name="empresa"]'), validator: validar.required, msg: 'Empresa é obrigatória' }
            ];

            // Valida cada campo
            let formValido = true;
            campos.forEach(({ el, validator, msg }) => {
                // Remove marcação de erro anterior
                el.classList.remove('is-invalid');
                
                // Aplica validação
                if (!validator(el.value)) {
                    // Adiciona estilo de erro e exibe alerta
                    el.classList.add('is-invalid');
                    showAlert('danger', msg);
                    formValido = false;
                }
            });

            // Interrompe se houver erros
            if (!formValido) return;

            // ======= ENVIO DO FORMULÁRIO =======
            const btn = form.querySelector('button[type="submit"]');
            
            // Feedback visual durante o envio
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            try {
                // Enviar para o Google Apps Script - ajuste abaixo para URL do seu deploy correto
                const response = await fetch('https://script.google.com/macros/s/AKfycbw472ayDEOXRK9ZI6cgayCPuZkauKKtSK_cHH7xA8QNuA6_tEz94J-0igHy2ISNUNNs/exec', {
                    method: 'POST',
                    body: new FormData(form)
                });

                if (response.ok) {
                    // Sucesso: exibe mensagem e reseta formulário
                    showAlert('success', 'Formulário enviado com sucesso!');
                    form.reset();
                } else {
                    throw new Error('Erro no servidor');
                }
            } catch (error) {
                // Erro de rede ou servidor
                showAlert('danger', 'Erro ao enviar. Tente novamente.');
                console.error('Erro no envio:', error);
            } finally {
                // Restaura botão ao estado original
                btn.disabled = false;
                btn.innerHTML = 'Enviar <i class="fas fa-satellite-dish"></i>';
            }
        });
    }
});