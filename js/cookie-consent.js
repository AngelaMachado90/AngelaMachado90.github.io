// Função principal
function initCookieConsent() {
  console.log('Inicializando cookie consent...');
  
  const cookieConsent = document.getElementById('cookieConsent');
  const cookieModal = document.getElementById('cookieModal');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieConfig = document.getElementById('cookieConfig');
  const cookieModalClose = document.getElementById('cookieModalClose');
  const cookieAcceptAll = document.getElementById('cookieAcceptAll');
  const cookieSave = document.getElementById('cookieSave');

  // Verificar se os elementos existem
  if (!cookieConsent) {
    console.log('Elementos ainda não carregados, tentando novamente em 500ms...');
    setTimeout(initCookieConsent, 500); // Tenta novamente
    return;
  }

  console.log('Elementos encontrados! Configurando eventos...');

  // Verificar se já aceitou cookies
  if (!localStorage.getItem('cookieConsent')) {
    cookieConsent.classList.remove('hidden');
    console.log('Cookie banner exibido');
  } else {
    cookieConsent.classList.add('hidden');
  }

  // Aceitar todos
  function acceptAllCookies() {
    console.log('Aceitar todos clicado');
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('analyticsCookies', 'true');
    localStorage.setItem('advertisingCookies', 'true');
    localStorage.setItem('functionalCookies', 'true');
    cookieConsent.classList.add('hidden');
    cookieModal.classList.remove('show');
  }

  // Adicionar event listeners
  if (cookieAccept) {
    cookieAccept.addEventListener('click', acceptAllCookies);
    console.log('Evento accept adicionado');
  }

  if (cookieAcceptAll) {
    cookieAcceptAll.addEventListener('click', acceptAllCookies);
    console.log('Evento acceptAll adicionado');
  }

  // Abrir configurações
  if (cookieConfig) {
    cookieConfig.addEventListener('click', function() {
      console.log('Configurar clicado');
      cookieModal.classList.add('show');
    });
  }

  // Fechar modal
  if (cookieModalClose) {
    cookieModalClose.addEventListener('click', function() {
      cookieModal.classList.remove('show');
    });
  }

  // Fechar modal clicando fora
  if (cookieModal) {
    cookieModal.addEventListener('click', function(e) {
      if (e.target === cookieModal) {
        cookieModal.classList.remove('show');
      }
    });
  }

  // Salvar preferências
  if (cookieSave) {
    cookieSave.addEventListener('click', function() {
      console.log('Salvar preferências clicado');
      const analytics = document.getElementById('analyticsCookies')?.checked || false;
      const advertising = document.getElementById('advertisingCookies')?.checked || false;
      const functional = document.getElementById('functionalCookies')?.checked || false;

      localStorage.setItem('cookieConsent', 'custom');
      localStorage.setItem('analyticsCookies', analytics);
      localStorage.setItem('advertisingCookies', advertising);
      localStorage.setItem('functionalCookies', functional);

      cookieConsent.classList.add('hidden');
      cookieModal.classList.remove('show');
    });
  }

  // Carregar preferências salvas
  if (localStorage.getItem('analyticsCookies') === 'true') {
    const el = document.getElementById('analyticsCookies');
    if (el) el.checked = true;
  }
  if (localStorage.getItem('advertisingCookies') === 'true') {
    const el = document.getElementById('advertisingCookies');
    if (el) el.checked = true;
  }
  if (localStorage.getItem('functionalCookies') === 'true') {
    const el = document.getElementById('functionalCookies');
    if (el) el.checked = true;
  }
}

// Iniciar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCookieConsent);
} else {
  initCookieConsent();
}