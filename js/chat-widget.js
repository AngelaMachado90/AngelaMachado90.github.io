// Chat Widget Interativo
document.addEventListener('DOMContentLoaded', function() {
    const chatWidget = document.querySelector('.chat-widget');
    const chatToggle = document.querySelector('.chat-toggle');
    const chatClose = document.querySelector('.chat-close');
    const quickOptions = document.querySelectorAll('.quick-option');
    const notificationBadge = document.querySelector('.chat-notification');
    
    // Estado do chat
    let isChatOpen = false;
    let messageCount = 3; // Simula 3 mensagens não lidas
    
    // ============================================
    // 1. TOGGLE DO CHAT
    // ============================================
    chatToggle.addEventListener('click', function() {
        isChatOpen = true;
        chatWidget.classList.add('active');
        chatToggle.style.display = 'none';
        
        // Reseta notificação quando abre
        messageCount = 0;
        updateNotification();
        
        // Animação de entrada
        setTimeout(() => {
            addBotMessage("Em que posso ajudar você hoje? Temos especialistas online agora!");
        }, 500);
    });
    
    chatClose.addEventListener('click', function() {
        isChatOpen = false;
        chatWidget.classList.remove('active');
        chatToggle.style.display = 'flex';
        
        // Adiciona notificação após 30 segundos
        setTimeout(() => {
            if (!isChatOpen) {
                messageCount++;
                updateNotification();
            }
        }, 30000);
    });
    
    // ============================================
    // 2. OPÇÕES RÁPIDAS
    // ============================================
    quickOptions.forEach(option => {
        option.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            // Feedback visual
            this.style.backgroundColor = 'var(--neutral-100)';
            this.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                this.style.backgroundColor = '';
                this.style.transform = '';
            }, 200);
            
            // Respostas baseadas na ação
            let botResponse = "";
            let redirectUrl = "";
            
            switch(action) {
                case 'orcamento':
                    botResponse = "Ótimo! Vou te conectar com nosso time de orçamentos. Em até 2 horas você receberá uma proposta personalizada.";
                    redirectUrl = "https://wa.me/554192272854?text=Olá!%20Quero%20um%20orçamento%20para%20meu%20projeto";
                    break;
                    
                case 'duvida':
                    botResponse = "Claro! Nossos especialistas podem tirar todas suas dúvidas sobre desenvolvimento, prazos e tecnologias.";
                    redirectUrl = "mailto:angelamachado02022@gmail.com?subject=Dúvidas%20Técnicas&body=Olá,%20tenho%20algumas%20dúvidas...";
                    break;
                    
                case 'contato':
                    botResponse = "Perfeito! Um de nossos consultores entrará em contato em até 15 minutos.";
                    redirectUrl = "tel:+554192272854";
                    break;
            }
            
            // Adiciona mensagem do usuário
            addUserMessage(this.querySelector('span').textContent);
            
            // Resposta do bot com delay
            setTimeout(() => {
                addBotMessage(botResponse);
                
                // Redireciona se necessário
                if (redirectUrl && action !== 'duvida') {
                    setTimeout(() => {
                        window.open(redirectUrl, '_blank');
                    }, 1000);
                }
            }, 800);
        });
    });
    
    // ============================================
    // 3. FUNÇÕES DO CHAT
    // ============================================
    function addBotMessage(text) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">Agora</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function addUserMessage(text) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">Agora</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function scrollToBottom() {
        const messagesContainer = document.querySelector('.chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function updateNotification() {
        if (messageCount > 0) {
            notificationBadge.textContent = messageCount;
            notificationBadge.style.display = 'flex';
            notificationBadge.style.animation = 'pulse 1.5s infinite';
        } else {
            notificationBadge.style.display = 'none';
        }
    }
    
    // ============================================
    // 4. FORMULÁRIO RÁPIDO
    // ============================================
    const formSubmit = document.querySelector('.form-submit');
    const formInput = document.querySelector('.form-input');
    
    if (formSubmit && formInput) {
        formSubmit.addEventListener('click', function() {
            const email = formInput.value.trim();
            
            if (!validateEmail(email)) {
                formInput.style.borderColor = '#FF3B30';
                formInput.placeholder = "Por favor, insira um e-mail válido";
                formInput.value = "";
                return;
            }
            
            // Simula envio
            formSubmit.textContent = "Enviando...";
            formSubmit.disabled = true;
            
            setTimeout(() => {
                addUserMessage("Me ligue - " + email);
                
                setTimeout(() => {
                    addBotMessage("Recebemos seu contato! Nossa equipe entrará em contato em até 1 hora útil.");
                }, 800);
                
                // Reset form
                formInput.value = "";
                formSubmit.textContent = "Me ligue";
                formSubmit.disabled = false;
                
                // Poderia enviar para API aqui
                console.log('Lead capturado:', email);
                
            }, 1500);
        });
        
        formInput.addEventListener('focus', function() {
            this.style.borderColor = '';
            this.placeholder = "Seu melhor e-mail";
        });
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // ============================================
    // 5. INTERAÇÕES EXTRAS
    // ============================================
    
    // Fecha chat ao clicar fora (mobile)
    document.addEventListener('click', function(event) {
        if (isChatOpen && 
            !chatWidget.contains(event.target) && 
            !chatToggle.contains(event.target) &&
            window.innerWidth <= 768) {
            
            chatWidget.classList.remove('active');
            chatToggle.style.display = 'flex';
            isChatOpen = false;
        }
    });
    
    // Notificação periódica (simula nova mensagem)
    setInterval(() => {
        if (!isChatOpen) {
            messageCount++;
            updateNotification();
        }
    }, 120000); // A cada 2 minutos
    
    // Inicia com notificação
    updateNotification();
});