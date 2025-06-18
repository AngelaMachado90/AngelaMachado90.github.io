// Configuração da data final (ajuste conforme necessário)
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 29);
targetDate.setHours(targetDate.getHours() + 23);
targetDate.setMinutes(targetDate.getMinutes() + 25);
targetDate.setSeconds(targetDate.getSeconds() + 21);

function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        document.getElementById('days').textContent = "00:00:00:00";
        document.getElementById('hours').textContent = "00:00";
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = 
        `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById('hours').textContent = 
        `${totalHours.toString().padStart(3, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
}

// Iniciar contador
updateCountdown();
setInterval(updateCountdown, 1000);

// Evento do botão
document.querySelector('.subscribe-btn').addEventListener('click', function() {
    alert('Obrigado por se inscrever!');
});