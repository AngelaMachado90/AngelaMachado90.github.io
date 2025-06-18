// Contador Regressivo
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 29);
targetDate.setHours(targetDate.getHours() + 23);
targetDate.setMinutes(targetDate.getMinutes() + 25);
targetDate.setSeconds(targetDate.getSeconds() + 46);

function updateCountdown() {
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

// Modal Functionality
const modal = document.getElementById('subscription-modal');
const btn = document.getElementById('open-modal');
const span = document.querySelector('.close-modal');

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Form Submission
document.getElementById('subscription-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    setTimeout(() => {
        document.getElementById('success-message').classList.remove('hidden');
        this.reset();
        
        setTimeout(() => {
            document.getElementById('success-message').classList.add('hidden');
            modal.style.display = "none";
        }, 3000);
    }, 1000);
});

// Email Validation
document.getElementById('email').addEventListener('blur', function() {
    if (!this.value.includes('@')) {
        alert('Por favor, insira um e-mail válido');
        this.focus();
    }
});

// Initialize
updateCountdown();
setInterval(updateCountdown, 1000);