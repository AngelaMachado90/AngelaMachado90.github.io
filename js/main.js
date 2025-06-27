/**
 * MAIN.JS
 * 
 * Arquivo principal com:
 * - Animações de hover nos cards
 * - Máscaras para campos de telefone e CNPJ
 * - Animação de contagem progressiva para estatísticas
 * 
 * Dependências:
 * - Nenhuma biblioteca externa necessária (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', function() {

    // ==================== ANIMAÇÕES DE HOVER ====================
    /**
     * Adiciona efeito de levitação aos cards de features
     * quando o mouse passa por cima
     */
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

    // ==================== MÁSCARAS DE FORMULÁRIO ====================
    /**
     * Aplica máscara para campo de telefone no formato: (99) 9999-9999
     */
    const telefone = document.querySelector('input[name="telefone"]');
    if (telefone) {
        telefone.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove não-números
            if (value.length > 2) value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            if (value.length > 10) value = `${value.substring(0, 10)}-${value.substring(10, 15)}`;
            e.target.value = value.substring(0, 15); // Limita o tamanho
        });
    }

    /**
     * Aplica máscara para campo de CNPJ no formato: 99.999.999/9999-99
     */
    const cnpj = document.querySelector('input[name="cnpj"]');
    if (cnpj) {
        cnpj.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove não-números
            if (value.length > 2) value = `${value.substring(0, 2)}.${value.substring(2)}`;
            if (value.length > 6) value = `${value.substring(0, 6)}.${value.substring(6)}`;
            if (value.length > 10) value = `${value.substring(0, 10)}/${value.substring(10)}`;
            if (value.length > 15) value = `${value.substring(0, 15)}-${value.substring(15, 17)}`;
            e.target.value = value.substring(0, 18); // Limita o tamanho
        });
    }

    // ==================== ANIMAÇÃO DE ESTATÍSTICAS ====================
    /**
     * Observa quando a seção de estatísticas entra na viewport
     * e dispara a animação de contagem
     */
    const stats = document.querySelectorAll('.stat');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target); // Para de observar após animar
            }
        });
    }, { threshold: 0.5 }); // Dispara quando 50% do elemento está visível

    // Observa a seção de use-cases (onde as estatísticas estão)
    const useCases = document.querySelector('.use-cases');
    if (useCases) observer.observe(useCases);

    /**
     * Anima todas as estatísticas na seção
     */
    function animateStats() {
        stats.forEach(stat => {
            const originalText = stat.textContent;
            let target, prefix = '', suffix = '';

            // Detecta o tipo de estatística pelo formato:
            if (originalText.includes('→')) { // Ex: "90→30"
                const [start, end] = originalText.split('→').map(Number);
                target = end;
                animateNumber(stat, start, target, () => {
                    stat.textContent = originalText.replace('→', '-'); // Formata final
                });
            } else if (originalText.includes('+')) { // Ex: "+300%"
                target = parseInt(originalText.replace('+', ''));
                prefix = '+';
                animateNumber(stat, 0, target, null, prefix);
            } else if (originalText.includes('%')) { // Ex: "100%"
                target = parseInt(originalText.replace('%', ''));
                suffix = '%';
                animateNumber(stat, 0, target, null, '', suffix);
            } else { // Números simples
                target = parseInt(originalText);
                animateNumber(stat, 0, target);
            }
        });
    }

    /**
     * Animação de contagem progressiva para números
     * @param {HTMLElement} element - Elemento DOM que exibirá o número
     * @param {number} start - Valor inicial
     * @param {number} end - Valor final
     * @param {function} callback - Função chamada ao terminar
     * @param {string} prefix - Texto antes do número (opcional)
     * @param {string} suffix - Texto após o número (opcional)
     */
    function animateNumber(element, start, end, callback = null, prefix = '', suffix = '') {
        const duration = 1500; // 1.5 segundos
        const startTime = performance.now(); // Tempo inicial

        /**
         * Atualiza o número a cada frame de animação
         */
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1); // Progresso (0-1)
            const value = Math.floor(progress * (end - start) + start); // Valor atual

            element.textContent = `${prefix}${value}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(updateNumber); // Continua animando
            } else if (callback) {
                callback(); // Chama callback ao finalizar
            }
        };

        requestAnimationFrame(updateNumber); // Inicia animação
    }

});