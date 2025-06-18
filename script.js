// Set the target date for the countdown (adjust as needed)
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 29); // 29 days from now
targetDate.setHours(targetDate.getHours() + 23); // Plus 23 hours
targetDate.setMinutes(targetDate.getMinutes() + 25); // Plus 25 minutes
targetDate.setSeconds(targetDate.getSeconds() + 46); // Plus 46 seconds

function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        document.getElementById('days').textContent = "00:00:00:00";
        document.getElementById('hours').textContent = "00:00";
        return;
    }
    
    // Calculate days, hours, minutes, seconds
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Update days display
    document.getElementById('days').textContent = 
        `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update hours display (showing remaining hours and minutes)
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById('hours').textContent = 
        `${totalHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
}

// Update countdown immediately and then every second
updateCountdown();
setInterval(updateCountdown, 1000);

// Subscribe button functionality
document.querySelector('.subscribe-btn').addEventListener('click', function() {
    alert('Obrigado por se inscrever! Nós entraremos em contato em breve.');
});