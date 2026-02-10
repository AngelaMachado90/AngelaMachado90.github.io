/**
 * CHAT-WIDGET.JS
 * Sistema de Chat Interativo KoddaHub
 *
 * Versão: 2.0.0
 * Autor: Angela Machado
 * Data: 2024
 *
 * Descrição:
 * Widget de chat interativo com assistente virtual Kodda.
 * Oferece múltiplos canais de comunicação: WhatsApp, Instagram, Messenger, Email e Telefone.
 *
 * Funcionalidades:
 * 1. Chat interativo com o mascote Kodda
 * 2. Multiplos canais de comunicação
 * 3. Opções rápidas pré-definidas
 * 4. Sistema de notificações
 * 5. Captura de leads via formulário
 * 6. Respostas inteligentes e personalizadas
 * 7. Design responsivo e acessível
 */

// ============================================================================
// CONFIGURAÇÕES GLOBAIS E CONSTANTES
// ============================================================================

const CHAT_CONFIG = {
  // URLs dos canais de comunicação
  channels: {
    whatsapp:
      "https://wa.me/554192272854?text=Olá%20KoddaHub!%20Gostaria%20de%20conversar%20sobre",
    instagram: "https://instagram.com/koddahub",
    messenger: "https://m.me/koddahub",
    email:
      "mailto:angelamachado02022@gmail.com?subject=Contato%20KoddaHub&body=Olá,%20gostaria%20de%20mais%20informações%20sobre",
    telefone: "tel:+554192272854",

    // URLs específicas por ação
    orcamento:
      "https://wa.me/554192272854?text=Olá!%20Quero%20um%20orçamento%20para%20meu%20projeto",
    duvidas:
      "mailto:angelamachado02022@gmail.com?subject=Dúvidas%20Técnicas&body=Olá,%20tenho%20algumas%20dúvidas...",
    contato: "tel:+554192272854",
  },

  // Configurações do chat
  initialMessageCount: 3,
  notificationInterval: 120000, // 2 minutos em ms
  closeNotificationDelay: 30000, // 30 segundos em ms
  typingSpeed: 30, // ms por caractere
  maxTypingTime: 2000, // 2 segundos máximo
};

// ============================================================================
// VARIÁVEIS GLOBAIS DO CHAT
// ============================================================================

let chatState = {
  isOpen: false,
  messageCount: CHAT_CONFIG.initialMessageCount,
  quickOptions: null,
  isTyping: false,
  currentUser: null,
};

// ============================================================================
// INICIALIZAÇÃO PRINCIPAL
// ============================================================================

/**
 * Inicializa todos os sistemas do chat widget
 * @returns {void}
 */
function initializeChatWidget() {
  try {
    // Configura elementos principais
    const elements = getChatElements();

    // Inicializa sistema de eventos
    initializeChatEvents(elements);

    // Inicializa sistema de notificações
    initializeNotificationSystem(elements.notificationBadge);

    // Configura formulário rápido
    initializeQuickForm(elements.formSubmit, elements.formInput);

    // Inicializa sistema de respostas inteligentes
    initializeSmartResponses();

    // Adiciona estilos dinâmicos se necessário
    addChatWidgetStyles();

    // Atualiza notificação inicial
    updateNotificationBadge(elements.notificationBadge);

    logChat("✅ Chat widget inicializado com sucesso");
  } catch (error) {
    logChat(`❌ Erro na inicialização: ${error.message}`, "error");
  }
}

/**
 * Obtém todos os elementos DOM do chat widget
 * @returns {Object} Objeto com referências aos elementos
 */
function getChatElements() {
  return {
    chatWidget: document.querySelector(".chat-widget"),
    chatToggle: document.querySelector(".chat-toggle"),
    chatClose: document.querySelector(".chat-close"),
    notificationBadge: document.querySelector(".chat-notification"),
    quickOptions: document.querySelectorAll(".quick-option"),
    messagesContainer: document.querySelector(".chat-messages"),
    formSubmit: document.querySelector(".form-submit"),
    formInput: document.querySelector(".form-input"),
    actionButtons: {
      whatsapp: document.querySelector(".whatsapp-btn"),
      instagram: document.querySelector(".instagram-btn"),
      messenger: document.querySelector(".messenger-btn"),
      email: document.querySelector(".email-btn"),
      phone: document.querySelector(".phone-btn"),
    },
  };
}

// Inicializa quando o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", initializeChatWidget);

// ============================================================================
// SISTEMA DE EVENTOS DO CHAT
// ============================================================================

/**
 * Inicializa todos os eventos do chat widget
 * @param {Object} elements - Elementos do chat
 * @returns {void}
 */
function initializeChatEvents(elements) {
  if (!elements.chatToggle || !elements.chatWidget) {
    logChat("⚠️ Elementos do chat não encontrados", "warn");
    return;
  }

  // 1. EVENTO DE ABRIR/FECHAR CHAT
  elements.chatToggle.addEventListener("click", () => toggleChat(elements));
  elements.chatClose.addEventListener("click", () => closeChat(elements));

  // 2. EVENTOS DAS OPÇÕES RÁPIDAS
  if (elements.quickOptions.length > 0) {
    chatState.quickOptions = elements.quickOptions;
    initializeQuickOptions(elements.quickOptions, elements.messagesContainer);
  }

  // 3. EVENTOS DOS BOTÕES DE AÇÃO (CANAIS)
  initializeChannelButtons(elements.actionButtons);

  // 4. FECHAR CHAT AO CLICAR FORA (MOBILE)
  document.addEventListener("click", (event) => {
    handleOutsideClick(event, elements);
  });

  // 5. FECHAR CHAT COM TECLA ESC
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && chatState.isOpen) {
      closeChat(elements);
    }
  });

  logChat("Eventos do chat configurados");
}

/**
 * Alterna estado do chat (abrir/fechar)
 * @param {Object} elements - Elementos do chat
 * @returns {void}
 */
function toggleChat(elements) {
  if (chatState.isOpen) {
    closeChat(elements);
  } else {
    openChat(elements);
  }
}

/**
 * Abre o chat widget
 * @param {Object} elements - Elementos do chat
 * @returns {void}
 */
function openChat(elements) {
  chatState.isOpen = true;
  elements.chatWidget.classList.add("active");
  elements.chatToggle.style.display = "none";

  // Reseta notificações
  chatState.messageCount = 0;
  updateNotificationBadge(elements.notificationBadge);

  // Mensagem de boas-vindas
  setTimeout(() => {
    addBotMessage(
      "Olá! Sou o Kodda, seu assistente virtual da KoddaHub. 😊\n\n" +
        "Como posso ajudar você hoje? Escolha uma das opções abaixo ou clique em um dos nossos canais de comunicação!",
      elements.messagesContainer,
    );
  }, 500);

  // Anima o mascote Kodda
  animateKodda("open");

  // Foco no chat para acessibilidade
  setTimeout(() => {
    elements.chatWidget.focus();
  }, 300);

  logChat("Chat aberto");
}

/**
 * Fecha o chat widget
 * @param {Object} elements - Elementos do chat
 * @returns {void}
 */
function closeChat(elements) {
  chatState.isOpen = false;
  elements.chatWidget.classList.remove("active");
  elements.chatToggle.style.display = "flex";

  // Programa notificação futura
  setTimeout(() => {
    if (!chatState.isOpen) {
      chatState.messageCount++;
      updateNotificationBadge(elements.notificationBadge);
    }
  }, CHAT_CONFIG.closeNotificationDelay);

  // Para animação do mascote
  animateKodda("close");

  logChat("Chat fechado");
}

/**
 * Manipula clique fora do chat (mobile)
 * @param {Event} event - Evento de clique
 * @param {Object} elements - Elementos do chat
 * @returns {void}
 */
function handleOutsideClick(event, elements) {
  if (
    chatState.isOpen &&
    !elements.chatWidget.contains(event.target) &&
    !elements.chatToggle.contains(event.target) &&
    window.innerWidth <= 768
  ) {
    closeChat(elements);
  }
}

// ============================================================================
// SISTEMA DE OPÇÕES RÁPIDAS
// ============================================================================

/**
 * Inicializa as opções rápidas do chat
 * @param {NodeList} quickOptions - Elementos das opções rápidas
 * @param {HTMLElement} messagesContainer - Container de mensagens
 * @returns {void}
 */
function initializeQuickOptions(quickOptions, messagesContainer) {
  quickOptions.forEach((option) => {
    option.addEventListener("click", () => {
      handleQuickOptionClick(option, messagesContainer);
    });
  });

  logChat(`✅ ${quickOptions.length} opções rápidas configuradas`);
}

/**
 * Manipula clique em opções rápidas
 * @param {HTMLElement} option - Elemento da opção clicada
 * @param {HTMLElement} messagesContainer - Container de mensagens
 * @returns {void}
 */
function handleQuickOptionClick(option, messagesContainer) {
  const action = option.getAttribute("data-action");
  const optionText = option.querySelector("span").textContent;

  // Feedback visual
  provideVisualFeedback(option);

  // Adiciona mensagem do usuário
  addUserMessage(optionText, messagesContainer);

  // Processa a ação
  processQuickOptionAction(action, optionText, messagesContainer);
}

/**
 * Processa a ação da opção rápida selecionada
 * @param {string} action - Tipo de ação (orcamento, duvida, contato)
 * @param {string} optionText - Texto da opção selecionada
 * @param {HTMLElement} messagesContainer - Container de mensagens
 * @returns {void}
 */
function processQuickOptionAction(action, optionText, messagesContainer) {
  // Obtém resposta apropriada
  const response = getSmartResponse(action);

  // Mostra indicador de "digitando"
  showTypingIndicator(messagesContainer);

  // Resposta com delay realista
  const responseDelay = calculateTypingDelay(response);

  setTimeout(() => {
    hideTypingIndicator();
    addBotMessage(response, messagesContainer);

    // Ações adicionais baseadas no tipo
    handleAdditionalActions(action);
  }, responseDelay);
}

/**
 * Fornece feedback visual para interação
 * @param {HTMLElement} element - Elemento a receber feedback
 * @returns {void}
 */
function provideVisualFeedback(element) {
  // Guarda estilo original
  const originalBgColor = element.style.backgroundColor;
  const originalTransform = element.style.transform;

  // Aplica feedback
  element.style.backgroundColor = "var(--primary-100, #dbeafe)";
  element.style.transform = "scale(0.98)";
  element.style.transition = "all 0.2s ease-out";

  // Restaura após delay
  setTimeout(() => {
    element.style.backgroundColor = originalBgColor;
    element.style.transform = originalTransform;
  }, 200);
}

// ============================================================================
// SISTEMA DE CANAIS DE COMUNICAÇÃO
// ============================================================================

/**
 * Inicializa botões dos canais de comunicação
 * @param {Object} buttons - Objeto com botões dos canais
 * @returns {void}
 */
function initializeChannelButtons(buttons) {
  const channels = [
    { key: "whatsapp", name: "WhatsApp", icon: "fab fa-whatsapp" },
    { key: "instagram", name: "Instagram", icon: "fab fa-instagram" },
    { key: "messenger", name: "Messenger", icon: "fab fa-facebook-messenger" },
    { key: "email", name: "Email", icon: "fas fa-envelope" },
    { key: "phone", name: "Telefone", icon: "fas fa-phone" },
  ];

  channels.forEach((channel) => {
    if (buttons[channel.key]) {
      buttons[channel.key].addEventListener("click", (e) => {
        e.preventDefault();
        openCommunicationChannel(channel.key, channel.name);
      });

      // Adiciona tooltip se não existir
      if (!buttons[channel.key].getAttribute("title")) {
        buttons[channel.key].setAttribute(
          "title",
          `Conversar no ${channel.name}`,
        );
      }
    }
  });

  logChat("Canais de comunicação configurados");
}

/**
 * Abre canal de comunicação específico
 * @param {string} channel - Canal a ser aberto
 * @param {string} channelName - Nome do canal para logs
 * @returns {void}
 */
function openCommunicationChannel(channel, channelName) {
  const url = CHAT_CONFIG.channels[channel];

  if (!url) {
    logChat(`❌ URL não encontrada para canal: ${channel}`, "error");
    return;
  }

  // Registro de análise (pode ser integrado com Google Analytics)
  logChannelInteraction(channel);

  // Abre em nova aba
  window.open(url, "_blank", "noopener,noreferrer");

  // Feedback visual
  showChannelConfirmation(channelName);

  logChat(`Canal ${channelName} aberto`);
}

/**
 * Registra interação com canal (para analytics)
 * @param {string} channel - Canal utilizado
 * @returns {void}
 */
function logChannelInteraction(channel) {
  // Aqui você pode integrar com Google Analytics, Facebook Pixel, etc.
  if (window.DEBUG) console.log(`[Analytics] Canal ${channel} utilizado`);

  // Exemplo de como integrar com GA4:
  // if (window.gtag) {
  //     window.gtag('event', 'channel_click', {
  //         'channel_name': channel,
  //         'event_category': 'chat_interaction'
  //     });
  // }
}

/**
 * Mostra confirmação visual de canal aberto
 * @param {string} channelName - Nome do canal
 * @returns {void}
 */
function showChannelConfirmation(channelName) {
  // Poderia mostrar um toast ou mensagem no chat
  logChat(`✅ Redirecionando para ${channelName}...`);
}

// ============================================================================
// SISTEMA DE MENSAGENS DO CHAT
// ============================================================================

/**
 * Adiciona mensagem do bot ao chat
 * @param {string} text - Texto da mensagem
 * @param {HTMLElement} container - Container de mensagens
 * @param {boolean} showTyping - Se deve mostrar indicador de digitando
 * @returns {void}
 */
function addBotMessage(text, container, showTyping = true) {
  if (!container) {
    logChat("❌ Container de mensagens não encontrado", "error");
    return;
  }

  if (showTyping) {
    showTypingIndicator(container);

    const typingTime = calculateTypingDelay(text);

    setTimeout(() => {
      hideTypingIndicator();
      renderBotMessage(text, container);
    }, typingTime);
  } else {
    renderBotMessage(text, container);
  }
}

/**
 * Renderiza mensagem do bot no DOM
 * @param {string} text - Texto da mensagem
 * @param {HTMLElement} container - Container de mensagens
 * @returns {void}
 */
function renderBotMessage(text, container) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message bot";
  messageDiv.setAttribute("role", "status");
  messageDiv.setAttribute("aria-live", "polite");

  const timestamp = getCurrentTime();

  messageDiv.innerHTML = `
        <div class="message-avatar" aria-label="Assistente Kodda">
            <div class="kodda-mini-message" role="img"></div>
        </div>
        <div class="message-content">
            <p>${formatMessageText(text)}</p>
            <span class="message-time" aria-label="Enviado às ${timestamp}">${timestamp}</span>
        </div>
    `;

  container.appendChild(messageDiv);
  scrollToBottom(container);

  // Anima entrada da mensagem
  animateMessageIn(messageDiv);
}

/**
 * Adiciona mensagem do usuário ao chat
 * @param {string} text - Texto da mensagem
 * @param {HTMLElement} container - Container de mensagens
 * @returns {void}
 */
function addUserMessage(text, container) {
  if (!container) {
    logChat("❌ Container de mensagens não encontrado", "error");
    return;
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = "message user";
  messageDiv.setAttribute("role", "status");

  const timestamp = getCurrentTime();

  messageDiv.innerHTML = `
        <div class="message-avatar" aria-label="Você">
            <i class="fas fa-user" role="img"></i>
        </div>
        <div class="message-content">
            <p>${escapeHtml(text)}</p>
            <span class="message-time" aria-label="Enviado às ${timestamp}">${timestamp}</span>
        </div>
    `;

  container.appendChild(messageDiv);
  scrollToBottom(container);

  // Anima entrada da mensagem
  animateMessageIn(messageDiv);
}

/**
 * Formata texto da mensagem (negrito, links, etc.)
 * @param {string} text - Texto a ser formatado
 * @returns {string} Texto formatado
 */
function formatMessageText(text) {
  // Converte **texto** para negrito
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Converte quebras de linha para <br>
  formatted = formatted.replace(/\n/g, "<br>");

  // Escape HTML para segurança
  formatted = escapeHtml(formatted);

  return formatted;
}

/**
 * Rola para o final do chat
 * @param {HTMLElement} container - Container de mensagens
 * @returns {void}
 */
function scrollToBottom(container) {
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

/**
 * Obtém hora atual formatada
 * @returns {string} Hora formatada
 */
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================================================
// SISTEMA DE DIGITAÇÃO (TYPING INDICATOR)
// ============================================================================

/**
 * Mostra indicador de "digitando..."
 * @param {HTMLElement} container - Container de mensagens
 * @returns {void}
 */
function showTypingIndicator(container) {
  if (chatState.isTyping) return;

  chatState.isTyping = true;

  const typingDiv = document.createElement("div");
  typingDiv.className = "message bot typing-indicator";
  typingDiv.setAttribute("aria-label", "Kodda está digitando...");

  typingDiv.innerHTML = `
        <div class="message-avatar">
            <div class="kodda-mini-typing"></div>
        </div>
        <div class="message-content">
            <div class="typing-dots" aria-hidden="true">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;

  container.appendChild(typingDiv);
  scrollToBottom(container);
}

/**
 * Esconde indicador de "digitando..."
 * @returns {void}
 */
function hideTypingIndicator() {
  chatState.isTyping = false;

  const typingIndicator = document.querySelector(".typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

/**
 * Calcula delay realista para digitação
 * @param {string} text - Texto a ser "digitado"
 * @returns {number} Tempo em milissegundos
 */
function calculateTypingDelay(text) {
  const baseDelay = text.length * CHAT_CONFIG.typingSpeed;
  return Math.min(baseDelay, CHAT_CONFIG.maxTypingTime);
}

// ============================================================================
// SISTEMA DE RESPOSTAS INTELIGENTES
// ============================================================================

/**
 * Banco de respostas inteligentes do Kodda
 */
const SMART_RESPONSES = {
  orcamento: [
    {
      text: "**Kodda aqui!** Perfeito para orçamentos! \n\nVou conectar você com nossos especialistas. Em até 2 horas você recebe uma proposta personalizada com:\n• Análise detalhada do seu projeto\n• Cronograma realista\n• Investimento transparente\n\nQuer que eu redirecione você para nosso WhatsApp comercial?",
      actions: ["whatsapp_redirect"],
    },
    {
      text: "Excelente escolha! Nossa equipe vai preparar um orçamento detalhado considerando:\n\n1. Suas necessidades específicas\n2. Tecnologias mais adequadas\n3. Prazos realistas\n4. Melhor custo-benefício\n\nPosso te conectar agora mesmo?",
      actions: ["contact_redirect"],
    },
  ],

  duvida: [
    {
      text: "**Kodda ao resgate!** Adoro esclarecer dúvidas! 💡\n\nPosso ajudar com:\n• Desenvolvimento web e mobile\n• Prazos de entrega\n• Tecnologias utilizadas\n• Manutenção e suporte\n\nO que gostaria de saber primeiro?",
      actions: ["stay_in_chat"],
    },
    {
      text: "Vamos descomplicar! Posso explicar sobre:\n\nSites responsivos\n✅ E-commerce completo\n✅ Sistemas personalizados\n✅ SEO e performance\n\nMe conta qual sua dúvida principal!",
      actions: ["stay_in_chat"],
    },
  ],

  contato: [
    {
      text: "📞 **Kodda conectando!** Um consultor especializado entrará em contato em até 15 minutos! ⏱️\n\nNossa equipe está pronta para:\n• Entender suas necessidades\n• Propor soluções personalizadas\n• Tirar todas suas dúvidas\n\nPrefere WhatsApp, ligação ou e-mail?",
      actions: ["multi_channel"],
    },
  ],

  default: [
    "Olá! Como posso ajudar você hoje? 😊",
    "Estou aqui para ajudar! Escolha uma opção acima.",
    "Em que posso ser útil? Tenho várias formas de ajudar!",
  ],
};

/**
 * Inicializa sistema de respostas inteligentes
 * @returns {void}
 */
function initializeSmartResponses() {
  logChat("Sistema de respostas inteligentes carregado");
}

/**
 * Obtém resposta inteligente baseada na ação
 * @param {string} action - Tipo de ação
 * @returns {string} Resposta apropriada
 */
function getSmartResponse(action) {
  const responses = SMART_RESPONSES[action] || SMART_RESPONSES.default;
  const randomResponse =
    responses[Math.floor(Math.random() * responses.length)];

  return typeof randomResponse === "object"
    ? randomResponse.text
    : randomResponse;
}

/**
 * Lida com ações adicionais após resposta
 * @param {string} action - Tipo de ação
 * @returns {void}
 */
function handleAdditionalActions(action) {
  switch (action) {
    case "orcamento":
      // Redireciona após delay
      setTimeout(() => {
        window.open(CHAT_CONFIG.channels.orcamento, "_blank");
      }, 2000);
      break;

    case "contato":
      // Oferece múltiplas opções (já está na resposta)
      break;
  }
}

// ============================================================================
// SISTEMA DE FORMULÁRIO RÁPIDO
// ============================================================================

/**
 * Inicializa formulário rápido de captura
 * @param {HTMLElement} submitButton - Botão de submit
 * @param {HTMLElement} inputField - Campo de input
 * @returns {void}
 */
function initializeQuickForm(submitButton, inputField) {
  if (!submitButton || !inputField) {
    logChat("⚠️ Formulário rápido não encontrado", "warn");
    return;
  }

  submitButton.addEventListener("click", () => {
    handleQuickFormSubmit(submitButton, inputField);
  });

  inputField.addEventListener("focus", () => {
    resetInputField(inputField);
  });

  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleQuickFormSubmit(submitButton, inputField);
    }
  });

  logChat("Formulário rápido configurado");
}

/**
 * Manipula envio do formulário rápido
 * @param {HTMLElement} submitButton - Botão de submit
 * @param {HTMLElement} inputField - Campo de input
 * @returns {void}
 */
function handleQuickFormSubmit(submitButton, inputField) {
  const email = inputField.value.trim();

  if (!validateEmail(email)) {
    showInputError(inputField, "Por favor, insira um e-mail válido");
    return;
  }

  // Mostra estado de carregamento
  showLoadingState(submitButton, true);

  // Simula envio (substitua por chamada real à API)
  setTimeout(() => {
    captureLead(email);

    // Reseta formulário
    showLoadingState(submitButton, false);
    inputField.value = "";

    // Feedback ao usuário
    showSuccessMessage(email);
  }, 1500);
}

/**
 * Captura lead (integre com sua API aqui)
 * @param {string} email - Email do lead
 * @returns {void}
 */
function captureLead(email) {
  // Aqui você integraria com seu sistema de leads
  if (window.DEBUG) console.log(`[LEAD] Email capturado: ${email}`);

  // Exemplo de integração com API:
  // fetch('/api/leads', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, source: 'chat_widget' })
  // });

  logChat(`Lead capturado: ${email}`);
}

/**
 * Mostra mensagem de sucesso após captura
 * @param {string} email - Email capturado
 * @returns {void}
 */
function showSuccessMessage(email) {
  const messagesContainer = document.querySelector(".chat-messages");
  if (messagesContainer) {
    addUserMessage(`Me ligue - ${email}`, messagesContainer);

    setTimeout(() => {
      addBotMessage(
        "✅ **Recebemos seu contato!**\n\nNossa equipe entrará em contato em até 1 hora útil.\n\nEnquanto isso, que tal explorar nossos canais diretos?",
        messagesContainer,
      );
    }, 800);
  }
}

/**
 * Mostra estado de carregamento no botão
 * @param {HTMLElement} button - Botão
 * @param {boolean} isLoading - Se está carregando
 * @returns {void}
 */
function showLoadingState(button, isLoading) {
  if (isLoading) {
    button.textContent = "Enviando...";
    button.disabled = true;
    button.style.opacity = "0.7";
  } else {
    button.textContent = "Me ligue";
    button.disabled = false;
    button.style.opacity = "1";
  }
}

/**
 * Mostra erro no campo de input
 * @param {HTMLElement} input - Campo de input
 * @param {string} message - Mensagem de erro
 * @returns {void}
 */
function showInputError(input, message) {
  input.style.borderColor = "#FF3B30";
  input.style.boxShadow = "0 0 0 2px rgba(255, 59, 48, 0.1)";
  input.placeholder = message;
  input.value = "";

  // Remove erro após 3 segundos
  setTimeout(() => {
    resetInputField(input);
  }, 3000);
}

/**
 * Reseta campo de input para estado normal
 * @param {HTMLElement} input - Campo de input
 * @returns {void}
 */
function resetInputField(input) {
  input.style.borderColor = "";
  input.style.boxShadow = "";
  input.placeholder = "Seu melhor e-mail";
}

// ============================================================================
// SISTEMA DE NOTIFICAÇÕES
// ============================================================================

/**
 * Inicializa sistema de notificações
 * @param {HTMLElement} notificationBadge - Elemento do badge
 * @returns {void}
 */
function initializeNotificationSystem(notificationBadge) {
  if (!notificationBadge) return;

  // Notificação periódica
  setInterval(() => {
    if (!chatState.isOpen) {
      chatState.messageCount++;
      updateNotificationBadge(notificationBadge);
    }
  }, CHAT_CONFIG.notificationInterval);

  logChat("Sistema de notificações configurado");
}

/**
 * Atualiza badge de notificação
 * @param {HTMLElement} badge - Elemento do badge
 * @returns {void}
 */
function updateNotificationBadge(badge) {
  if (!badge) return;

  if (chatState.messageCount > 0) {
    badge.textContent = Math.min(chatState.messageCount, 9); // Máximo 9
    badge.style.display = "flex";
    badge.style.animation = "pulse 1.5s infinite";

    // Anima o botão do chat
    animateChatButton();
  } else {
    badge.style.display = "none";
  }
}

/**
 * Anima o botão do chat para chamar atenção
 * @returns {void}
 */
function animateChatButton() {
  const chatToggle = document.querySelector(".chat-toggle");
  if (chatToggle && !chatState.isOpen) {
    chatToggle.style.animation = "bounce 2s infinite";

    // Para animação após 6 segundos
    setTimeout(() => {
      if (chatToggle) {
        chatToggle.style.animation = "";
      }
    }, 6000);
  }
}

// ============================================================================
// ANIMAÇÕES E EFEITOS VISUAIS
// ============================================================================

/**
 * Anima entrada de mensagem
 * @param {HTMLElement} message - Elemento da mensagem
 * @returns {void}
 */
function animateMessageIn(message) {
  message.style.opacity = "0";
  message.style.transform = "translateY(10px)";

  setTimeout(() => {
    message.style.transition = "all 0.3s ease-out";
    message.style.opacity = "1";
    message.style.transform = "translateY(0)";
  }, 10);
}

/**
 * Anima o mascote Kodda
 * @param {string} action - Ação (open, close, wave)
 * @returns {void}
 */
function animateKodda(action) {
  const koddaFace = document.querySelector(".kodda-face");
  if (!koddaFace) return;

  switch (action) {
    case "open":
      koddaFace.style.animation = "nod 2s ease-in-out";
      break;
    case "wave":
      koddaFace.style.animation = "wave 1s ease-in-out";
      break;
    case "close":
      koddaFace.style.animation = "";
      break;
  }
}

// ============================================================================
// UTILITÁRIOS E FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Valida formato de email
 * @param {string} email - Email a ser validado
 * @returns {boolean} Se é válido
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Escape HTML para segurança
 * @param {string} text - Texto a ser escapado
 * @returns {string} Texto seguro
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Log para debug e monitoramento
 * @param {string} message - Mensagem de log
 * @param {string} type - Tipo de log (info, warn, error)
 * @returns {void}
 */
function logChat(message, type = "info") {
  const styles = {
    info: "color: #3B82F6; font-weight: bold;",
    success: "color: #10B981; font-weight: bold;",
    warn: "color: #F59E0B; font-weight: bold;",
    error: "color: #EF4444; font-weight: bold;",
  };

  if (!window.DEBUG) return;
  const timestamp = new Date().toLocaleTimeString();
  console.log(`%c[Chat ${timestamp}] ${message}`, styles[type]);
}

/**
 * Adiciona estilos dinâmicos para o chat widget
 * @returns {void}
 */
function addChatWidgetStyles() {
  if (!document.getElementById("chat-widget-styles")) {
    const style = document.createElement("style");
    style.id = "chat-widget-styles";

    style.textContent = `
            /* Animações do chat */
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
            }
            
            @keyframes nod {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(5deg); }
                75% { transform: rotate(-5deg); }
            }
            
            @keyframes wave {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(15deg); }
                75% { transform: rotate(-15deg); }
            }
            
            /* Indicador de digitando */
            .typing-dots {
                display: flex;
                gap: 4px;
                padding: 8px 12px;
            }
            
            .typing-dot {
                width: 8px;
                height: 8px;
                background: var(--gray-400, #9CA3AF);
                border-radius: 50%;
                animation: typingBounce 1.4s infinite ease-in-out;
            }
            
            .typing-dot:nth-child(1) { animation-delay: -0.32s; }
            .typing-dot:nth-child(2) { animation-delay: -0.16s; }
            
            @keyframes typingBounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }
            
            /* Estilos para canais */
            .action-buttons {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 10px;
                margin: 15px 0;
            }
            
            .action-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 10px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            
            .whatsapp-btn { background: #25D366; color: white; }
            .instagram-btn { background: #E4405F; color: white; }
            .messenger-btn { background: #006AFF; color: white; }
            .email-btn { background: #EA4335; color: white; }
            .phone-btn { background: #34B7F1; color: white; }
            
            .action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            
            /* Responsividade */
            @media (max-width: 768px) {
                .chat-widget {
                    width: calc(100vw - 40px) !important;
                    max-width: 400px !important;
                }
                
                .action-buttons {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            
            @media (max-width: 480px) {
                .action-buttons {
                    grid-template-columns: 1fr;
                }
                
                .quick-options {
                    grid-template-columns: 1fr !important;
                }
            }
        `;

    document.head.appendChild(style);
    logChat("Estilos dinâmicos adicionados");
  }
}

// ============================================================================
// EXPORTAÇÕES PARA USO EM MÓDULOS (OPCIONAL)
// ============================================================================

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initializeChatWidget,
    openChat,
    closeChat,
    addBotMessage,
    addUserMessage,
    captureLead,
    logChat,
  };
}

// ============================================================================
// EXPORTAÇÕES GLOBAIS (para navegador)
// ============================================================================

// Torna funções disponíveis globalmente se necessário
window.KoddaChat = {
  open: () => {
    const elements = getChatElements();
    openChat(elements);
  },
  close: () => {
    const elements = getChatElements();
    closeChat(elements);
  },
  sendMessage: (text) => {
    const container = document.querySelector(".chat-messages");
    if (container) addUserMessage(text, container);
  },
  captureEmail: (email) => captureLead(email),
};

// ============================================================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================================================

// Verifica se já está em um evento DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeChatWidget);
} else {
  // DOM já carregado, inicializa imediatamente
  setTimeout(initializeChatWidget, 100);
}

logChat("Módulo de chat carregado. Aguardando inicialização...");
