document.addEventListener('DOMContentLoaded', function () {
    // ======= ANIMAÇÕES =======
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // ======= MÁSCARAS =======
    const telefone = document.querySelector('input[name="telefone"]');
    telefone.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
        if (value.length > 10) value = `${value.substring(0, 10)}-${value.substring(10, 15)}`;
        e.target.value = value.substring(0, 15);
    });

    const cnpj = document.querySelector('input[name="cnpj"]');
    cnpj.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) value = `${value.substring(0, 2)}.${value.substring(2)}`;
        if (value.length > 6) value = `${value.substring(0, 6)}.${value.substring(6)}`;
        if (value.length > 10) value = `${value.substring(0, 10)}/${value.substring(10)}`;
        if (value.length > 15) value = `${value.substring(0, 15)}-${value.substring(15, 17)}`;
        e.target.value = value.substring(0, 18);
    });

    // ======= VALIDAÇÕES =======
    const validar = {
        email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        telefone: (tel) => {
            const nums = tel.replace(/\D/g, '');
            return nums.length >= 10 && nums.length <= 11;
        },
        cnpj: (cnpj) => cnpj.replace(/\D/g, '').length === 14,
        required: (value) => value.trim() !== ''
    };

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

    // ======= FORMULÁRIO =======
    const form = document.querySelector('#formPlugnGO');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validação dos campos
        const campos = [
            { el: form.querySelector('[name="segmento"]'), validator: validar.required, msg: 'Selecione seu segmento' },
            { el: form.querySelector('[name="nome"]'), validator: validar.required, msg: 'Nome é obrigatório' },
            { el: form.querySelector('[name="email"]'), validator: validar.email, msg: 'E-mail inválido' },
            { el: telefone, validator: validar.telefone, msg: 'Telefone inválido' },
            { el: cnpj, validator: validar.cnpj, msg: 'CNPJ inválido' },
            { el: form.querySelector('[name="empresa"]'), validator: validar.required, msg: 'Empresa é obrigatória' }
        ];

        let formValido = true;
        campos.forEach(({ el, validator, msg }) => {
            if (!validator(el.value)) {
                mostrarErro(el, msg);
                formValido = false;
            } else {
                limparErro(el);
            }
        });

        if (!formValido) return;

        // Botão de submit - feedback visual
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        try {
            // Enviar para o Google Apps Script - ajuste abaixo para URL do seu deploy correto
            const response = await fetch('https://script.google.com/macros/s/AKfycbw472ayDEOXRK9ZI6cgayCPuZkauKKtSK_cHH7xA8QNuA6_tEz94J-0igHy2ISNUNNs/exec', {
                method: 'POST',
                body: new FormData(form)
            });

            if (response.ok) {
                document.getElementById('mensagem-sucesso').style.display = 'block';
                form.reset();
            } else {
                alert('Erro ao enviar. Tente novamente.');
            }
        } catch (error) {
            alert('Erro de conexão. Tente novamente.');
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Enviar';
        }
    });

    // ======= ANIMAÇÃO ESTATÍSTICAS =======
    const stats = document.querySelectorAll('.stat');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const useCases = document.querySelector('.use-cases');
    if (useCases) observer.observe(useCases);

    function animateStats() {
        stats.forEach(stat => {
            const originalText = stat.textContent;
            let target, prefix = '', suffix = '';

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
                suffix = '%';
                animateNumber(stat, 0, target, null, '', suffix);
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
