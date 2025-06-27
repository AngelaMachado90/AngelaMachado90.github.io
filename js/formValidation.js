/**
 * FORM-VALIDATION.JS
 * 
 * Sistema completo de validação e envio de formulários com:
 * - Validação automática de CNPJ ao sair do campo (evento blur)
 * - Validação rigorosa do formato do CNPJ (incluindo dígitos verificadores)
 * - Fallback para cadastro manual quando API indisponível
 * - Exibição condicional do campo "Nome da empresa"
 * - Sanitização de dados contra XSS/SQL Injection
 * - Sistema de notificações estilo popup
 * - Modal de confirmação pós-envio
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========== SELEÇÃO DE ELEMENTOS ==========
    const telefone = document.querySelector('input[name="telefone"]');
    const cnpjInput = document.querySelector('input[name="cnpj"]');
    const empresaGroup = document.querySelector('.form-group:has(#empresa)');
    const empresaInput = document.querySelector('input[name="empresa"]');
    const form = document.querySelector('#formPlugnGO');
    const thankYouModal = new bootstrap.Modal('#thankYouModal');

    // ========== CONFIGURAÇÕES ==========
    const config = {
        apiReceitaWS: 'https://receitaws.com.br/v1/cnpj',
        timeoutAlertas: 5000, // 5 segundos para fechar alertas
        timeoutAPI: 10000, // 10 segundos timeout para API
        cacheCNPJ: true, // Ativa cache local
        cacheExpiration: 24 * 60 * 60 * 1000 // 24 horas em milissegundos
    };

    // Oculta o campo empresa inicialmente
    empresaGroup.style.display = 'none';

    // ========== SANITIZAÇÃO DE DADOS ==========
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

    // ========== SISTEMA DE CACHE LOCAL ==========
    const setCnpjCache = (cnpj, data) => {
        if (!config.cacheCNPJ) return;
        
        const cache = {
            data: data,
            timestamp: Date.now()
        };
        
        localStorage.setItem(`cnpj_${cnpj}`, JSON.stringify(cache));
    };

    const getCnpjCache = (cnpj) => {
        if (!config.cacheCNPJ) return null;
        
        const cached = localStorage.getItem(`cnpj_${cnpj}`);
        if (!cached) return null;
        
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp > config.cacheExpiration) {
            localStorage.removeItem(`cnpj_${cnpj}`);
            return null;
        }
        
        return parsed.data;
    };

    // ========== SISTEMA DE ALERTAS ==========
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

        if (timeout > 0) {
            setTimeout(() => {
                const alertElement = document.getElementById(alertId);
                if (alertElement) {
                    fadeOutAndRemove(alertElement, alertContainer);
                }
            }, timeout);
        }
    }

    function fadeOutAndRemove(element, container) {
        element.classList.add('fade-out');
        element.addEventListener('animationend', () => {
            element.remove();
            if (container.children.length === 0) {
                container.style.display = 'none';
            }
        });
    }

    function getIconForType(type) {
        const icons = {
            success: 'bi-check-circle-fill',
            danger: 'bi-exclamation-triangle-fill',
            warning: 'bi-exclamation-circle-fill',
            info: 'bi-info-circle-fill'
        };
        return icons[type] || 'bi-info-circle-fill';
    }

    function getTitleForType(type) {
        const titles = {
            success: 'Sucesso!',
            danger: 'Erro!',
            warning: 'Aviso!',
            info: 'Informação'
        };
        return titles[type] || 'Alerta';
    }

    // ========== VALIDAÇÃO DE CNPJ ==========
    function validarFormatoCNPJ(cnpj) {
        const nums = cnpj.replace(/\D/g, '');
        
        // Verifica se tem 14 dígitos e não é sequência repetida
        if (nums.length !== 14 || /^(\d)\1{13}$/.test(nums)) {
            return false;
        }
        
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
        if (resultado !== parseInt(digitos.charAt(0))) {
            return false;
        }
        
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
    }

    async function consultarReceitaFederal(cnpj) {
        const cnpjNumeros = cnpj.replace(/\D/g, '');
        
        try {
            const cached = getCnpjCache(cnpjNumeros);
            if (cached) {
                return {
                    success: true,
                    nomeEmpresa: cached.nome,
                    message: 'CNPJ válido (dados em cache)',
                    fromCache: true
                };
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.timeoutAPI);
            
            const response = await fetch(`${config.apiReceitaWS}/${cnpjNumeros}`, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error('Erro na consulta à Receita Federal');
            
            const data = await response.json();
            
            if (data.status === 'OK' && data.situacao === 'ATIVA') {
                setCnpjCache(cnpjNumeros, data);
                return {
                    success: true,
                    nomeEmpresa: data.nome,
                    message: 'CNPJ válido e ativo',
                    fromAPI: true
                };
            } else {
                return {
                    success: false,
                    message: data.message || 'CNPJ não encontrado ou inativo',
                    allowManual: true
                };
            }
        } catch (error) {
            console.error('Erro na consulta:', error);
            return {
                success: false,
                message: 'API indisponível. Você pode cadastrar o nome manualmente',
                allowManual: true
            };
        }
    }

    async function validarCNPJ() {
        const cnpj = cnpjInput.value.trim();
        
        if (cnpj === '') {
            cnpjInput.classList.remove('is-valid', 'is-invalid');
            empresaGroup.style.display = 'none';
            return;
        }
        
        // Verifica formato primeiro
        if (!validarFormatoCNPJ(cnpj)) {
            cnpjInput.classList.add('is-invalid');
            cnpjInput.classList.remove('is-valid');
            empresaGroup.style.display = 'none';
            showAlert('danger', 'Formato de CNPJ inválido. Verifique os dígitos.');
            return;
        }
        
        // Mostra loading
        cnpjInput.classList.add('loading');
        
        const resultado = await consultarReceitaFederal(cnpj);
        
        // Remove loading
        cnpjInput.classList.remove('loading');
        
        // Mostra campo empresa
        empresaGroup.style.display = 'block';
        
        if (resultado.success) {
            empresaInput.value = resultado.nomeEmpresa;
            empresaInput.readOnly = true;
            empresaInput.placeholder = 'Nome da empresa (preenchido automaticamente)';
            cnpjInput.classList.add('is-valid');
            cnpjInput.classList.remove('is-invalid');
            showAlert('success', resultado.message, 5000);
        } else {
            empresaInput.value = '';
            empresaInput.readOnly = false;
            empresaInput.placeholder = 'Digite o nome da empresa';
            cnpjInput.classList.remove('is-valid');
            showAlert(resultado.allowManual ? 'warning' : 'danger', resultado.message, 5000);
        }
    }

    // ========== EVENT LISTENERS ==========
    cnpjInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Limita a 14 caracteres
        value = value.substring(0, 14);
        
        // Aplica máscara progressiva
        if (value.length > 12) {
            e.target.value = `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5, 8)}/${value.substring(8, 12)}-${value.substring(12, 14)}`;
        } else if (value.length > 8) {
            e.target.value = `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5, 8)}/${value.substring(8)}`;
        } else if (value.length > 5) {
            e.target.value = `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5)}`;
        } else if (value.length > 2) {
            e.target.value = `${value.substring(0, 2)}.${value.substring(2)}`;
        } else {
            e.target.value = value;
        }
        
        // Validação em tempo real para números repetidos
        const nums = value.replace(/\D/g, '');
        if (nums.length === 14 && /^(\d)\1{13}$/.test(nums)) {
            cnpjInput.classList.add('is-invalid');
            showAlert('danger', 'CNPJ inválido. Não pode ter todos os números iguais.', 5000);
        } else if (nums.length === 14) {
            cnpjInput.classList.remove('is-invalid');
        }
    });
    
    cnpjInput.addEventListener('blur', function() {
        const cnpj = cnpjInput.value.trim();
        
        // Só valida se completo
        if (cnpj.replace(/\D/g, '').length === 14) {
            validarCNPJ();
        } else if (cnpj !== '') {
            cnpjInput.classList.add('is-invalid');
            showAlert('danger', 'CNPJ incompleto. Digite os 14 números.', 5000);
        }
    });

    // ========== ENVIO DO FORMULÁRIO ==========
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validarFormatoCNPJ(cnpjInput.value)) {
                showAlert('danger', 'Por favor, insira um CNPJ válido antes de enviar.');
                cnpjInput.focus();
                return;
            }
            
            if (empresaInput.value.trim() === '') {
                showAlert('danger', 'Por favor, preencha o nome da empresa.');
                empresaInput.focus();
                return;
            }
            
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';

            const formData = {
                segmento: sanitizeInput(form.segmento.value),
                nome: sanitizeInput(form.nome.value.trim()),
                email: sanitizeInput(form.email.value.trim()),
                telefone: form.telefone.value.replace(/\D/g, ''),
                cnpj: form.cnpj.value.replace(/\D/g, ''),
                empresa: sanitizeInput(form.empresa.value.trim()),
                cnpj_data: JSON.stringify(getCnpjCache(form.cnpj.value.replace(/\D/g, '')))
            };

            try {
                const response = await fetch('https://script.google.com/macros/s/AKfycbw472ayDEOXRK9ZI6cgayCPuZkauKKtSK_cHH7xA8QNuA6_tEz94J-0igHy2ISNUNNs/exec', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    thankYouModal.show();
                    form.reset();
                    empresaGroup.style.display = 'none';
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

    // Máscara para telefone
    if (telefone) {
        telefone.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            if (value.length > 10) value = `${value.substring(0, 10)}-${value.substring(10, 15)}`;
            e.target.value = value.substring(0, 15);
        });
    }
});