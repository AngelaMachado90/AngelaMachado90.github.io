document.addEventListener('DOMContentLoaded', function() {
    // ==================== ANIMAÇÕES ====================
    // Efeito hover nos cards de features
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // ==================== MÁSCARAS ====================
    // Telefone: (41) 99999-9999
    const telefone = document.querySelector('input[name="telefone"]');
    telefone.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
        }
        if (value.length > 10) {
            value = `${value.substring(0, 10)}-${value.substring(10, 15)}`;
        }
        e.target.value = value.substring(0, 15);
    });

    // CNPJ: 99.999.999/9999-99
    const cnpj = document.querySelector('input[name="cnpj"]');
    cnpj.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) value = `${value.substring(0, 2)}.${value.substring(2)}`;
        if (value.length > 6) value = `${value.substring(0, 6)}.${value.substring(6)}`;
        if (value.length > 10) value = `${value.substring(0, 10)}/${value.substring(10)}`;
        if (value.length > 15) value = `${value.substring(0, 15)}-${value.substring(15, 17)}`;
        e.target.value = value.substring(0, 18);
    });

    // ==================== VALIDAÇÕES ====================
    // Funções de validação reutilizáveis
    const validar = {
        email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        telefone: (tel) => {
            const nums = tel.replace(/\D/g, '');
            return nums.length >= 10 && nums.length <= 11;
        },
        cnpj: (cnpj) => cnpj.replace(/\D/g, '').length === 14,
        required: (value) => value.trim() !== ''
    };

    // Validação em tempo real com feedback visual
    function mostrarErro(campo, mensagem) {
        const errorSpan = campo.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains('error-message')) {
            const novoError = document.createElement('span');
            novoError.className = 'error-message';
            novoError.style.color = 'red';
            novoError.style.fontSize = '0.8rem';
            campo.insertAdjacentElement('afterend', novoError);
        }
        campo.nextElementSibling.textContent = mensagem;
    }

    function limparErro(campo) {
        const errorSpan = campo.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains('error-message')) {
            errorSpan.textContent = '';
        }
    }

    // Eventos de validação
    document.querySelector('input[name="email"]').addEventListener('blur', function(e) {
        if (!validar.email(e.target.value)) {
            mostrarErro(e.target, 'E-mail inválido');
        } else {
            limparErro(e.target);
        }
    });

    telefone.addEventListener('blur', function(e) {
        if (!validar.telefone(e.target.value)) {
            mostrarErro(e.target, 'Telefone deve ter 10 ou 11 dígitos');
        } else {
            limparErro(e.target);
        }
    });

    cnpj.addEventListener('blur', function(e) {
        if (!validar.cnpj(e.target.value)) {
            mostrarErro(e.target, 'CNPJ deve ter 14 dígitos');
        } else {
            limparErro(e.target);
        }
    });

    // ==================== SUBMIT DO FORMULÁRIO ====================
    const ctaForm = document.querySelector('.cta-form');
    
    ctaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let formValido = true;

        // Validar todos os campos
        const campos = [
            { el: this.querySelector('[name="segmento"]'), validator: validar.required, msg: 'Selecione seu segmento' },
            { el: this.querySelector('[name="nome"]'), validator: validar.required, msg: 'Nome é obrigatório' },
            { el: this.querySelector('[name="email"]'), validator: validar.email, msg: 'E-mail inválido' },
            { el: telefone, validator: validar.telefone, msg: 'Telefone inválido' },
            { el: cnpj, validator: validar.cnpj, msg: 'CNPJ inválido' },
            { el: this.querySelector('[name="empresa"]'), validator: validar.required, msg: 'Empresa é obrigatória' }
        ];

        campos.forEach(({ el, validator, msg }) => {
            if (!validator(el.value)) {
                mostrarErro(el, msg);
                formValido = false;
                if (formValido) el.focus();
            } else {
                limparErro(el);
            }
        });

        // Se válido, enviar
        if (formValido) {
            // Simulação de envio (substitua pelo FormSubmit/API real)
            alert('Formulário enviado com sucesso!');
            this.reset();
            
            // Para FormSubmit real, descomente:
            // this.submit();
        }
    });

    // ==================== ANIMAÇÃO DE ESTATÍSTICAS ====================
    const stats = document.querySelectorAll('.stat');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.use-cases'));

    function animateStats() {
        stats.forEach(stat => {
            const originalText = stat.textContent;
            let target, prefix = '';
            
            if (originalText.includes('→')) {
                const [start, end] = originalText.split('→').map(Number);
                target = end;
                animateNumber(stat, start, target, () => {
                    stat.textContent = originalText.replace('→', '-');
                });
            } else if (originalText.includes('+')) {
                target = parseInt(originalText.replace('+', ''));
                prefix = '+';
                animateNumber(stat, 0, target, null, prefix);
            } else if (originalText.includes('%')) {
                target = parseInt(originalText.replace('%', ''));
                animateNumber(stat, 0, target, null, '', '%');
            } else {
                target = parseInt(originalText);
                animateNumber(stat, 0, target);
            }
        });
    }

    function animateNumber(element, start, end, callback = null, prefix = '', suffix = '') {
        const duration = 1500;
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            
            element.textContent = `${prefix}${value}${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else if (callback) {
                callback();
            }
        };
        
        requestAnimationFrame(updateNumber);
    }
});

// Verificação de envio
document.querySelector('.cta-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validação adicional
    if (!validarCNPJ(this.cnpj.value)) {
        alert('CNPJ inválido!');
        return;
    }

    // Feedback visual
    const btn = this.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    try {
        // Envio real
        const response = await fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            window.location.href = this.querySelector('[name="_next"]').value;
        } else {
            throw new Error('Falha no envio');
        }
    } catch (error) {
        btn.innerHTML = 'Tentar Novamente <i class="fas fa-redo"></i>';
        alert('Erro ao enviar: ' + error.message);
        btn.disabled = false;
    }
});


  document.getElementById('formPlugnGO').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);

    fetch("COLE_AQUI_SEU_WEBAPP_URL", {
      method: "POST",
      body: data
    })
      .then(response => {
        if (response.ok) {
          document.getElementById('mensagem-sucesso').style.display = 'block';
          form.reset();
        } else {
          alert("Erro ao enviar. Tente novamente.");
        }
      })
      .catch(() => alert("Erro de conexão."));
  });

