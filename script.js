// Contador regressivo
function updateCountdown() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 29);
    targetDate.setHours(targetDate.getHours() + 23);
    targetDate.setMinutes(targetDate.getMinutes() + 25);
    targetDate.setSeconds(targetDate.getSeconds() + 45);

    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = "00:00:00:00";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = 
        `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Formulário
document.querySelector('.signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        interesse: document.getElementById('interesse').value
    };
    
    // Aqui você pode adicionar o código para enviar os dados
    console.log('Dados do formulário:', formData);
    alert('Obrigado por se inscrever! Entraremos em contato em breve.');
    
    // Limpar formulário
    this.reset();
});

// Máscara para telefone
document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    e.target.value = value;
});