// Configura a data de lançamento (altere para sua data real)
const launchDate = new Date();
launchDate.setDate(launchDate.getDate() + 15); // 15 dias a partir de hoje

// Atualiza o contador regressivo
function updateCountdown() {
    const now = new Date();
    const diff = launchDate - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    
    if (diff < 0) {
        clearInterval(countdownInterval);
        document.querySelector('.coming-soon').textContent = "Estamos no ar!";
        document.querySelector('.launch-text').textContent = "Nossa plataforma está disponível. Acesse agora!";
        document.querySelector('.countdown-container').style.display = 'none';
    }
}

// Atualiza a cada segundo
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Chamada inicial

// Form submission
document.getElementById('early-access-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulação de envio - substitua por sua lógica real
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    console.log('Dados do formulário:', data);
    
    // Feedback visual
    const btn = this.querySelector('.subscribe-btn');
    btn.innerHTML = '<i class="fas fa-check"></i> Cadastro realizado!';
    btn.style.backgroundColor = '#2ecc71';
    
    // Reset após 3 segundos
    setTimeout(() => {
        btn.innerHTML = '<span class="btn-text">Garantir Acesso Antecipado</span><i class="fas fa-arrow-right btn-icon"></i>';
        btn.style.backgroundColor = '';
        this.reset();
    }, 3000);
});

// WhatsApp Button Tooltip
const whatsappBtn = document.querySelector('.whatsapp-float');

whatsappBtn.addEventListener('mouseenter', () => {
    // Mostra o tooltip
    whatsappBtn.style.transform = 'scale(1.1)';
});

whatsappBtn.addEventListener('mouseleave', () => {
    // Volta ao normal
    whatsappBtn.style.transform = 'scale(1)';
});

// Clique no WhatsApp
whatsappBtn.addEventListener('click', () => {
    // Animação de clique
    whatsappBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        whatsappBtn.style.transform = 'scale(1.1)';
    }, 100);
    
    // Evento de analytics (opcional)
    console.log('WhatsApp button clicked');
});

// Botão Sobre
const aboutBtn = document.querySelector('.about-float');
const aboutSection = document.getElementById('sobre');
const closeAbout = document.querySelector('.close-about');

aboutBtn.addEventListener('click', (e) => {
    if (window.location.hash === '#sobre') {
        e.preventDefault();
        aboutSection.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
});

closeAbout.addEventListener('click', () => {
    aboutSection.style.display = 'none';
    document.body.style.overflow = 'auto';
    history.pushState(null, null, ' ');
});

