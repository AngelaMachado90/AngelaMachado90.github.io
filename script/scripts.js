document.addEventListener('DOMContentLoaded', function() {
    // Animation for feature cards
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
    
    // Form validation
    const ctaForm = document.querySelector('.cta-form');
    
    ctaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        const segmento = this.querySelector('[name="segmento"]');
        const nome = this.querySelector('[name="nome"]');
        const email = this.querySelector('[name="email"]');
        const telefone = this.querySelector('[name="telefone"]');
        
        if (!segmento.value || !nome.value || !email.value || !telefone.value) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Form submission would go here
        alert('Formulário enviado com sucesso! Entraremos em contato em breve.');
        this.reset();
    });
    
    // Animate stats in video overlay
    const stats = document.querySelectorAll('.stat');
    
    function animateStats() {
        stats.forEach(stat => {
            const target = parseInt(stat.textContent.replace('→', '-'));
            const start = 0;
            const duration = 2000;
            const startTime = Date.now();
            
            const animate = () => {
                const now = Date.now();
                const progress = Math.min((now - startTime) / duration, 1);
                
                if (stat.textContent.includes('→')) {
                    const values = stat.textContent.split('→');
                    const current = Math.floor(progress * (parseInt(values[1]) - parseInt(values[0]))) + parseInt(values[0]);
                    stat.textContent = `${values[0]}→${current}`;
                } else if (stat.textContent.includes('+')) {
                    const value = parseInt(stat.textContent.replace('+', ''));
                    const current = Math.floor(progress * value);
                    stat.textContent = `+${current}`;
                } else {
                    const current = Math.floor(progress * target);
                    stat.textContent = current;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    if (stat.textContent.includes('→')) {
                        stat.textContent = stat.textContent.replace('→', '-');
                    }
                }
            };
            
            animate();
        });
    }
    
    // Trigger animation when video section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(document.querySelector('.use-cases'));
});