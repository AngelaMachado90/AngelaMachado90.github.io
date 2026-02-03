(function(){
  // Basic gallery interactions: filter, open overlay, load template, simulate interactions
  const filters = document.querySelectorAll('.filter');
  const grid = document.getElementById('demo-grid');
  const cards = Array.from(document.querySelectorAll('.demo-card'));
  const overlay = document.getElementById('demo-overlay');
  const demoFrame = document.getElementById('demo-frame');
  const deviceSelect = document.getElementById('device-select');
  const themeSelect = document.getElementById('theme-select');
  const modeSelect = document.getElementById('mode-select');
  const closeBtn = document.getElementById('close-demo');

  // Filtering
  filters.forEach(btn=>btn.addEventListener('click',()=>{
    filters.forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c=>{ c.style.display = (f==='*' || c.dataset.type===f) ? '' : 'none'; });
  }));

  // Open demo
  grid.addEventListener('click',e=>{
    const btn = e.target.closest('.open-demo') || e.target.closest('.demo-card');
    if(!btn) return;
    const card = btn.closest('.demo-card');
    if(!card) return openTemplate(card);
    openTemplate(card);
  });

  // keyboard support: Enter opens focused card
  cards.forEach(c=>c.addEventListener('keydown',e=>{ if(e.key==='Enter') openTemplate(c); }));

  function openTemplate(card){
    const tplId = card.dataset.template; const tpl = document.querySelector(tplId);
    if(!tpl) return;
    demoFrame.innerHTML = '';
    const clone = tpl.content.cloneNode(true);
    demoFrame.appendChild(clone);
    overlay.setAttribute('aria-hidden','false');
    // attach demo-specific behavior
    attachDemoInteractions(demoFrame);
    applyDevice(deviceSelect.value);
    applyTheme(themeSelect.value);
  }

  closeBtn.addEventListener('click',closeOverlay);
  overlay.addEventListener('click',e=>{ if(e.target===overlay) closeOverlay(); });
  function closeOverlay(){ overlay.setAttribute('aria-hidden','true'); demoFrame.innerHTML=''; }

  deviceSelect.addEventListener('change',()=>applyDevice(deviceSelect.value));
  themeSelect.addEventListener('change',()=>applyTheme(themeSelect.value));

  function applyDevice(mode){
    demoFrame.classList.remove('mobile','tablet','desktop'); demoFrame.classList.add(mode);
    // simple sizing
    if(mode==='mobile') demoFrame.style.width='360px';
    else if(mode==='tablet') demoFrame.style.width='720px';
    else demoFrame.style.width='100%';
  }
  function applyTheme(t){ document.documentElement.setAttribute('data-demo-theme',t); }

  // basic simulation for demo templates
  function attachDemoInteractions(root){
    // forms
    const forms = root.querySelectorAll('.sim-form');
    forms.forEach(f=>f.addEventListener('submit',e=>{ e.preventDefault(); alert('Formulário enviado (simulado) — obrigado!'); }));

    // ecommerce add to cart
    const cart = root.querySelector('.cart-items');
    const total = root.querySelector('.cart-total span');
    if(cart){
      const addBtns = root.querySelectorAll('.add-cart');
      let sum=0; addBtns.forEach(b=>b.addEventListener('click',()=>{
        const price = Number(b.closest('.product').dataset.price||0);
        const item = document.createElement('div'); item.textContent = b.closest('.product').querySelector('h5').textContent + ' - R$'+price;
        cart.appendChild(item); sum+=price; if(total) total.textContent = sum;
      }));
    }

    // industrial specs
    const search = root.querySelector('.search');
    if(search){ search.addEventListener('input',()=>{
      const q = search.value.toLowerCase(); root.querySelectorAll('.part').forEach(p=>{ p.style.display = p.textContent.toLowerCase().includes(q)?'':'none'; });
    }); }

    // services booking simulation
    const bookBtns = root.querySelectorAll('.book');
    const bookingArea = root.querySelector('.booking-sim');
    bookBtns.forEach(b=>b.addEventListener('click',()=>{
      if(bookingArea) bookingArea.textContent='Agendamento simulado: horário selecionado. Entraremos em contato.';
    }));

    // systems metric inc
    const inc = root.querySelector('.inc-leads');
    if(inc){ inc.addEventListener('click',()=>{
      const el = root.querySelector('.metric strong'); el.textContent = Number(el.textContent)+1;
    }); }

    // CTA buttons small particle-like feedback (visual only)
    root.querySelectorAll('.cta-sim, .open-demo, button').forEach(b=>b.addEventListener('click',()=>{
      b.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:260});
    }));
  }

  // accessibility: close with Esc
  window.addEventListener('keydown',e=>{ if(e.key==='Escape') closeOverlay(); });
})();