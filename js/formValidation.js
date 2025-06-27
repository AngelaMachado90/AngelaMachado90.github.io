/**
 * FORM-VALIDATION.JS
 * 
 * Sistema completo de validação e envio de formulários com:
 * - Validação automática de CNPJ ao sair do campo (evento blur)
 * - Validação rigorosa do formato do CNPJ
 * - Fallback para cadastro manual quando API indisponível
 * - Exibição condicional do campo "Nome da empresa"
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
        timeoutAlertas: 1000,
        timeoutAPI: 10000,
        cacheCNPJ: true,
        cacheExpiration: 24 * 60 * 60 * 1000
    };

    // Oculta o campo empresa inicialmente
    empresaGroup.style.display = 'none';

    // ========== FUNÇÕES AUXILIARES ==========
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

    const setCnpjCache = (cnpj, data) => {
        if (!config.cacheCNPJ) return;
        const cache = { data, timestamp: Date.now() };
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

    function showAlert(type, message, timeout = 5000) {
    const alertContainer = document.getElementById('alert-container');
    
    // Cria o elemento do alerta
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.setAttribute('role', 'alert');
    
    // Conteúdo do alerta
    alertElement.innerHTML = `
        <strong>${type === 'success' ? 'Sucesso!' : 
                  type === 'danger' ? 'Erro!' : 
                  type === 'warning' ? 'Aviso!' : 'Informação'}</strong>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Adiciona ao container
    alertContainer.appendChild(alertElement);
    
    // Remove após o timeout
    if (timeout > 0) {
        setTimeout(() => {
            alertElement.remove();
        }, timeout);
    }
    
    // Retorna o elemento para controle externo se necessário
    return alertElement;
}

// ========== VALIDAÇÃO DE CNPJ ==========
function validarFormatoCNPJ(cnpj) {
        const nums = cnpj.replace(/\D/g, '');
        if (nums.length !== 14 || /^(\d)\1{13}$/.test(nums)) return false;
        
        // Cálculo dos dígitos verificadores
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
            }
            return {
                success: false,
                message: data.message || 'CNPJ não encontrado ou inativo',
                allowManual: true
            };
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
        
        if (!validarFormatoCNPJ(cnpj)) {
            cnpjInput.classList.add('is-invalid');
            cnpjInput.classList.remove('is-valid');
            empresaGroup.style.display = 'none';
            showAlert('danger', 'Formato de CNPJ inválido. Verifique os dígitos.');
            return;
        }
        
        cnpjInput.classList.add('loading');
        const resultado = await consultarReceitaFederal(cnpj);
        cnpjInput.classList.remove('loading');
        
        empresaGroup.style.display = 'block';
        
        if (resultado.success) {
            empresaInput.value = resultado.nomeEmpresa;
            empresaInput.readOnly = true;
            cnpjInput.classList.add('is-valid');
            cnpjInput.classList.remove('is-invalid');
            showAlert('success', resultado.message, 5000);
        } else {
            empresaInput.value = '';
            empresaInput.readOnly = false;
            cnpjInput.classList.remove('is-valid');
            showAlert(resultado.allowManual ? 'warning' : 'danger', resultado.message, 5000);
        }
    }

    // ========== EVENT LISTENERS ==========
    cnpjInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 14);
        
        if (value.length > 12) {
            e.target.value = `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5, 8)}/${value.substring(8, 12)}-${value.substring(12)}`;
        } else if (value.length > 8) {
            e.target.value = `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5, 8)}/${value.substring(8)}`;
        } else if (value.length > 5) {
            e.target.value = `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5)}`;
        } else if (value.length > 2) {
            e.target.value = `${value.substring(0, 2)}.${value.substring(2)}`;
        } else {
            e.target.value = value;
        }
        
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
                empresa: sanitizeInput(form.empresa.value.trim())
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