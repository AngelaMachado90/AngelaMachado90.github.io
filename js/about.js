document.addEventListener('DOMContentLoaded', function() {
    // Animação dos números
    const numberElements = document.querySelectorAll('.number-value');
    
    const animateNumbers = () => {
        numberElements.forEach(element => {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = 2000; // 2 segundos
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    clearInterval(counter);
                    element.textContent = target;
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 16);
        });
    };
    
    // Ativar animação quando a seção estiver visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(document.querySelector('.numbers-section'));
    
    // Accordion do FAQ (se estiver na página)
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                
                const answer = document.getElementById(question.getAttribute('aria-controls'));
                answer.setAttribute('aria-hidden', isExpanded);
            });
        });
    }
});